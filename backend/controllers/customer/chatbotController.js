const Groq = require("groq-sdk");
const Product = require("../../models/productModel");
const Order = require("../../models/orderModel");
const ChatSession = require("../../models/chatSessionModel");
const Fuse = require("fuse.js");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

let searchEngine = null;
let cachedProducts = [];
let lastUpdated = 0;

// Cập nhật dữ liệu tìm kiếm mỗi 5p
async function updateSearchIndex() {
  const now = Date.now();
  if (now - lastUpdated > 300000 || !searchEngine) {
    try {
      const products = await Product.find({ status: "active" })
        .populate("brand", "name")
        .populate("category", "name")
        .select(
          "name price description brand category specifications tags"
        );

      // Chuẩn hóa dữ liệu để search ngon hơn
      cachedProducts = products.map((p) => ({
        price: p.price,
        // Tạo một trường text tổng hợp để search cho chuẩn
        searchText: `ID:${p.id} ${p.name}
          ${p.brand?.name || ""},
          ${p.category?.name || ""}
          ${p.description || ""}
          ${JSON.stringify(p.specifications || "")}
          ${p.tags}`,

        // Giữ nguyên dữ liệu thô để trả về cho AI lọc
        raw: {
          id: p.id,
          name: p.name,
          price: p.price,
          description: p.description,
          brand: p.brand?.name || "",
          category: p.category?.name || "",
          specifications: p.specifications,
          tags: p.tags,
        },
      }));

      // Cấu hình Fuse.js
      const options = {
        isCaseSensitive: false,
        includeScore: true,
        shouldSort: true,
        keys: ["searchText"], // Tìm trong trường text tổng hợp
        threshold: 0.4, // Độ chấp nhận sai số
        distance: 1000,
        ignoreLocation: true,
      };

      searchEngine = new Fuse(cachedProducts, options);
      lastUpdated = now;
      console.log(
        `Search Engine Updated! Loaded ${cachedProducts.length} products.`
      );
    } catch (e) {
      console.error("Update Search Index Error:", e);
    }
  }
}

updateSearchIndex();

const ROUTER_PROMPT = `
Role: Intent Classifier.
Task: Analyze user query and output JSON.

Intents:
1. "search_product": Find product, ask price.
2. "check_order": Check order status.

JSON Output:
{
  "intent": "search_product" | "check_order",
  "query": {
    "keyword": string, // Important: Keyword for product search just containst name, description, brands, category, specifications not price.
    "price_max": number // Only fill in when the role user mentions price if not, leave it null
    "price_min": number // Only fill in when the role user mentions price if not, leave it null
  },
}
`;

const FILTER_PROMPT = `
You are a data filter. Given a list of products in JSON format and user query, filter the products based on the query.
Task: From the product list, return only products that match the user query.

User Query Examples:
- "Cho tôi vài mẫu laptop i5" -> Filter products with "laptop" and "i5" in name or specifications.
- "Tôi muốn điện thoại của Apple" -> Filter products with "Smartphone" and brand "Apple".

Output only the JSON object.
  {
    products: [
      {
        "id": string,
        "name": string,
      }, ... // Repeat for each matching product
    ]
  }
Rules: 
-- Just return products that match the query.
-- If no products match, return an empty list.
-- If larger than 5, return only the top 5.
`;

const RESPONDER_SYSTEM_PROMPT = `
Role: Sales Assistant. Tone: Friendly, Polite, Vietnamese.
Task: Answer based on CONTEXT.
Rules:
- Don't list product details (e.g. name, brand,...) repeatedly because user can see the cards.
- Just give a short, catchy introduction about the products found.
- If no items, suggest broadly.
`;

const chatWithAI = async (req, res) => {
  const { message } = req.body;
  const userId = req.user.id;

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  try {
    await updateSearchIndex();

    let session;
    session = await ChatSession.findOne({ userId });

    if (!session) {
      session = new ChatSession({ userId: userId, messages: [] });
      await session.save();
    }

    // Lấy lịch sử chat cho AI nhớ
    const historyContext = session.messages.slice(-4).map((msg) => ({
      role: msg.sender === "user" ? "user" : "assistant",
      content: msg.message,
    }));

    // Gọi AI để lọc từ khóa từ user
    const routerCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: ROUTER_PROMPT },
        ...historyContext,
        { role: "user", content: message },
      ],
      model: "qwen/qwen3-32b",
      temperature: 0.4,
      response_format: { type: "json_object" },
    });

    const { intent, query } = JSON.parse(
      routerCompletion.choices[0].message.content
    );

    console.log("Detected Intent:", intent, "with query:", query);

    // Query db dựa trên res đã lọc từ AI cùi
    let dbContext = "Không có dữ liệu database.";
    let foundDataPayload = null;

    if (intent === "search_product") {
      let results = [];

      if (query?.keyword) {
        const fuseResults = searchEngine.search(query.keyword);
        results = fuseResults.map((r) => r.item);
      } else {
        results = cachedProducts;
      }

      if (query?.price_max) {
        results = results.filter((p) => p.price < query.price_max);
      }

      if (query?.price_min) {
        results = results.filter((p) => p.price > query.price_min);
      }
      console.log("Search Results Count:", results.length);
      if (results.length > 0) {
        results = results.slice(0, 20); // Giới hạn 20 kết quả để lọc
        // Gọi AI cùi để lọc dữ liệu cho nhanh
        const filterCompletion = await groq.chat.completions.create({
          messages: [
            { role: "system", content: FILTER_PROMPT },
            ...historyContext,
            { role: "system", content: `Context: ${JSON.stringify(results.map(p => p.raw))}` },
            { role: "user", content: message },
          ],
          model: "moonshotai/kimi-k2-instruct-0905",
          temperature: 0,
          response_format: { type: "json_object" },
        });

        const productFiltered = JSON.parse(
          filterCompletion.choices[0].message.content
        );

        console.log("Filtered Products:", productFiltered.products);

        dbContext =
          `Tìm thấy ${productFiltered.products.length} sản phẩm:\n` +
          productFiltered.products.map((p) => `- ${p.name}`).join("\n");
        const ids = productFiltered.products.map((p) => p.id);
        foundDataPayload = `[PRODUCT_LIST_START]${JSON.stringify(
          ids
        )}[PRODUCT_LIST_END]`;
      } else {
        dbContext =
          "Đã tìm trong kho nhưng không thấy sản phẩm nào khớp yêu cầu.";
      }
    } else if (intent === "check_order") {
      const orders = await Order.find({ userId })
        .sort({ createdAt: -1 })
        .limit(1);

      if (orders.length > 0) {
        const o = orders[0];
        dbContext = `Đơn gần nhất: ${o.orderCode}, Trạng thái: ${o.orderStatus}, Tổng: ${o.totalAmount}, Ngày: ${o.createdAt}`;

        foundDataPayload = `[ORDER_CODE:${o.orderCode}]`;
      } else {
        dbContext = "Khách hàng này chưa có đơn hàng nào.";
      }
    }

    // Gọi AI xịn cho nó "chém gió" dựa trên dbContext vừa tìm được =))
    const stream = await groq.chat.completions.create({
      messages: [
        { role: "system", content: RESPONDER_SYSTEM_PROMPT },
        ...historyContext,
        { role: "system", content: `CONTEXT DATA TỪ DATABASE:\n${dbContext}` },
        { role: "user", content: message },
      ],
      model: "llama-3.3-70b-versatile",
      stream: true,
      temperature: 0.7,
      max_tokens: 1000,
    });

    let fullBotResponse = "";

    // Stream từng chữ của AI về Frontend
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || "";
      if (content) {
        fullBotResponse += content;
        res.write(`data: ${JSON.stringify({ content })}\n\n`);
      }
    }

    // Gửi foundDataPayload để Frontend render ra cái Card đẹp mắt bên dưới lời thoại
    if (foundDataPayload) {
      res.write(
        `data: ${JSON.stringify({ content: "\n\n" + foundDataPayload })}\n\n`
      );
      fullBotResponse += "\n" + foundDataPayload;
    }

    session.messages.push({ sender: "user", message: message });
    session.messages.push({ sender: "bot", message: fullBotResponse });
    session.updatedAt = Date.now();
    await session.save();

    res.end();
  } catch (error) {
    console.error("Chatbot Error:", error);
    res.write(
      `data: ${JSON.stringify({
        content: "Mạng lag quá, mình chưa load được. Bạn hỏi lại nha!",
      })}\n\n`
    );
    res.end();
  }
};

const getHistory = async (req, res) => {
  const userId = req.user.id;
  try {
    const session = await ChatSession.findOne({ userId });

    if (!session) {
      res.status(400).json({
        message: "Chat history empty",
        error,
      });
    }

    res.status(200).json({
      message: "Get history chatbot successfull",
      session,
    });
  } catch (error) {
    res.status(500).json({
      message: "Get history chatbot error",
      error,
    });
  }
};

module.exports = { chatWithAI, getHistory };

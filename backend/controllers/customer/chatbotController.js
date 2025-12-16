const Groq = require('groq-sdk');
const Product = require('../../models/productModel');
const Order = require('../../models/orderModel');
const Category = require('../../models/categoryModel')
const Brand = require('../../models/brandModel')
const ChatSession = require('../../models/chatSessionModel');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const ROUTER_PROMPT = `
Bạn là bộ não phân tích ý định (Intent Classifier).
Nhiệm vụ: Đọc hội thoại và trả về JSON duy nhất.

Intent:
1. "search_product": Tìm mua, hỏi giá, tư vấn sp.
2. "check_order": Hỏi đơn hàng.
3. "chat": Chào hỏi, tán gẫu.

JSON Output:
{
  "intent": "search_product" | "check_order" | "chat",
  "query": { "name": string, "category": string, "brand": string, "price_max": number } 
  //name, category, brand luôn viết hoa chữ đầu và chữ còn lại viết thường ví dụ:"xiaomi ultrabook -> Xiaomi Ultrabook"
}
`;

const RESPONDER_SYSTEM_PROMPT = `
Bạn là trợ lý ảo bán hàng chuyên nghiệp, thân thiện của shop bán đồ công nghệ.
Nhiệm vụ: Trả lời khách hàng dựa trên DỮ LIỆU CUNG CẤP (Context).

Quy tắc quan trọng:
1. Giọng điệu: Vui vẻ, dùng emoji 💻🔥, xưng hô "mình" - "bạn".
2. Nếu có dữ liệu sản phẩm/đơn hàng: Hãy giới thiệu sơ qua 1-2 câu thật hấp dẫn.
3. TUYỆT ĐỐI KHÔNG bịa đặt thông tin không có trong Context.
4. KHÔNG hiển thị lại danh sách sản phẩm dạng text dài dòng. Chỉ cần nói dẫn dắt, vì hệ thống sẽ tự hiển thị thẻ sản phẩm sau câu nói của bạn.
`;

const chatWithAI = async (req, res) => {
  const { message } = req.body;
  const userId = req.user.id

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  try {
    let session;
    session = await ChatSession.findOne({ userId });

    if (!session) {
      session = new ChatSession({ userId: userId, messages: [] });
      await session.save();
    }

    // Lấy lịch sử chat cho AI nhớ
    const historyContext = session.messages.slice(-4).map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.message
    }));

    // Gọi AI cùi để lọc dữ liệu cho nhanh
    const routerCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: ROUTER_PROMPT },
        ...historyContext,
        { role: "user", content: message }
      ],
      model: "llama-3.1-8b-instant",
      temperature: 0,
      response_format: { type: "json_object" }
    });

    const { intent, query } = JSON.parse(routerCompletion.choices[0].message.content);

    // Query db dựa trên res đã lọc từ AI cùi
    let dbContext = "Không có dữ liệu database.";
    let foundDataPayload = null;

    if (intent === "search_product") {
      const dbQuery = { status: 'active' };
      if (query.name) {
        dbQuery.$or = [
          { name: { $regex: query.name, $options: 'i' } },
          { description: { $regex: query.name, $options: 'i' } }
        ];
      }
      if (query.category) {
        const categoryId = await Category.findOne({ name: query.category })
        if (categoryId) dbQuery.category = categoryId;
      }
      if (query.brand) {
        const brandId = await Brand.findOne({ name: query.brand })
        if (brandId) dbQuery.brand = brandId;
      }
      if (query.price_max) dbQuery.price = { $lte: query.price_max };

      // Lấy name và price để AI 2 đọc hiểu và chém gió =))
      // Lấy _id để gửi cho Frontend render
      const products = await Product.find(dbQuery).limit(5).select('name price sku _id');

      if (products.length > 0) {
        // Context cho AI xịn đọc
        dbContext = `Tìm thấy ${products.length} sản phẩm:\n` +
          products.map(p => `- ${p.name} (Giá: ${p.price})`).join("\n");

        const ids = products.map(p => p._id);
        foundDataPayload = `[PRODUCT_LIST_START]${JSON.stringify(ids)}[PRODUCT_LIST_END]`;
      } else {
        dbContext = "Đã tìm trong kho nhưng không thấy sản phẩm nào khớp yêu cầu.";
      }

    } else if (intent === "check_order") {
      const orders = await Order.find({ userId }).sort({ createdAt: -1 }).limit(1);

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
        { role: "user", content: message }
      ],
      model: "llama-3.3-70b-versatile",
      stream: true,
      temperature: 0.7,
      max_tokens: 500
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
      res.write(`data: ${JSON.stringify({ content: "\n\n" + foundDataPayload })}\n\n`);
      fullBotResponse += "\n" + foundDataPayload;
    }

    session.messages.push({ sender: 'user', message: message });
    session.messages.push({ sender: 'bot', message: fullBotResponse });
    session.updatedAt = Date.now();
    await session.save();

    console.log(fullBotResponse)
    res.end();

  } catch (error) {
    console.error("Chatbot Error:", error);
    res.write(`data: ${JSON.stringify({ content: "Mạng lag quá, mình chưa load được. Bạn hỏi lại nha!" })}\n\n`);
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
        error
      });
    }

    res.status(200).json({
      message: "Get history chatbot successfull",
      session
    });
  } catch (error) {
    res.status(500).json({
      message: "Get history chatbot error",
      error
    });
  }
};

module.exports = { chatWithAI, getHistory }
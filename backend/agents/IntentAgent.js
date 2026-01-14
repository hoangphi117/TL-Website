const Groq = require("groq-sdk");
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const ROUTER_PROMPT = `
Role: Intent Classifier.
Task: Analyze user query and output JSON.

Intents:
1. "GREETING": Chào hỏi xã giao (hi, hello, shop ơi...).
2. "SEARCH_PRODUCT": Tìm kiếm sản phẩm cụ thể, hỏi giá, tìm theo tiêu chí (laptop dưới 20tr, bàn phím cơ...).
3. "COMPARE_PRODUCT": So sánh 2 hoặc nhiều sản phẩm.
4. "CONSULTING": Yêu cầu tư vấn chung chung (mua máy gì làm văn phòng, tư vấn giúp em...).
5. "TECHNICAL_ADVICE": Hỏi về kỹ thuật, cấu hình, phần mềm, tư vấn kiến thức (Máy này chạy Docker được không? Sinh viên IT cần máy gì? Nên mua PC hay Laptop?...).
6. "OTHER": Các trường hợp khác (hỏi đơn hàng, thanh toán, shop ở đâu...).

JSON Output:
{
  "intent": "GREETING" | "SEARCH_PRODUCT" | "COMPARE_PRODUCT" | "CONSULTING" | "TECHNICAL_ADVICE" | "OTHER",
  "query": {
    "keyword": string,
    "category": string | null,
    "brand": string | null,  // Thương hiệu: "acer", "asus", "dell", "hp", "apple", "msi"...
    "products_to_compare": [string],
    "quantity": number | null,
    "price_max": number,  // Giá tối đa VNĐ: "dưới 20 triệu" -> 20000000, "không quá 15tr" -> 15000000
    "price_min": number,  // Giá tối thiểu VNĐ: "trên 10 triệu" -> 10000000
    "sort_by": "price_asc" | "price_desc" | "newest" | null,  // "giá cao nhất" -> "price_desc", "rẻ nhất" -> "price_asc"
    "device_model": string | null
  }
}

Rules:
- Chuyển đổi giá tiền về số VNĐ đầy đủ (20 triệu = 20000000, 15tr = 15000000)
- "dưới/dưới mức/không quá X" -> price_max = X
- "trên/từ/trên mức X" -> price_min = X
- "giá cao nhất/đắt nhất" -> sort_by = "price_desc"
- "giá rẻ nhất/thấp nhất" -> sort_by = "price_asc"
- Trích xuất brand từ câu hỏi: "laptop acer" -> brand = "acer", "máy asus" -> brand = "asus"
`;

class IntentAgent {
    async detectIntent(message, history = []) {
        try {
            // Format history for Groq
            const historyPrompt = history.map(msg =>
                `${msg.sender === 'user' ? 'User' : 'Assistant'}: ${msg.message}`
            ).join("\n");

            const messages = [
                { role: "system", content: ROUTER_PROMPT + `\n\nRecent History:\n${historyPrompt}` },
                { role: "user", content: message },
            ];

            const completion = await groq.chat.completions.create({
                messages: messages,
                model: "qwen/qwen3-32b",
                temperature: 0,
                response_format: { type: "json_object" },
            });

            return JSON.parse(completion.choices[0].message.content);
        } catch (error) {
            console.error("Intent Detection Error:", error);
            return { intent: "OTHER", query: {} };
        }
    }
}

module.exports = new IntentAgent();

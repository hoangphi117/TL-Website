import React, { useMemo } from "react";
import ChatProductGrid from "./ChatProductGrid";
import { OrderPreviewCard } from "./OrderPreviewCard";

interface Product {
  id: string;
}

interface ProductListData {
  type: "product_list";
  data: Product[];
}

interface ProductListGroupedData {
  type: "product_list_grouped";
  data: Record<string, Product[]>;
}

type ChatResponseData = ProductListData | ProductListGroupedData;

interface BotMessageProps {
  content: string;
}

const BotMessage: React.FC<BotMessageProps> = ({ content }) => {

  const parsedData = useMemo(() => {
    // 0. Loại bỏ thẻ <think> (Chain of Thought)
    let cleanContent = content.replace(/<think>[\s\S]*?<\/think>/g, "").trim();

    let productIds: string[] = [];
    let groupedProducts: Record<string, Product[]> | null = null;
    let orderCode: string | null = null;
    let isJsonMode = false;

    // 1. Cải tiến: Tách JSON từ nội dung hỗn hợp (Hỗ trợ cả Markdown Block & Raw JSON)
    try {
      // Sử dụng cleanContent đã loại bỏ <think> để regex không bị nhiễu
      const jsonRegex = /({[\s\S]*"type"\s*:\s*"product_list(?:_grouped)?["s\S]*"data"[\s\S]*})/;
      const match = cleanContent.match(jsonRegex);

      if (match) {
        const rawJson = match[1]; // Capture group 1 là toàn bộ cục JSON
        const jsonData: ChatResponseData = JSON.parse(rawJson);

        if (jsonData.type === "product_list" && Array.isArray(jsonData.data)) {
          productIds = jsonData.data.map((p: Product) => p.id);
          isJsonMode = true;
        } else if (jsonData.type === "product_list_grouped" && typeof jsonData.data === "object") {
          groupedProducts = jsonData.data;
          isJsonMode = true;
        }

        // Remove JSON part from content to get description text
        const fullMatchString = match[0];
        let textPart = cleanContent.replace(fullMatchString, "").trim();
        textPart = textPart.replace(/```json|```/g, "").trim();
        cleanContent = textPart;
      }
    } catch (e) {
      console.warn("JSON Parse Failed:", e);
    }

    if (!isJsonMode) {
      // 2. Logic Regex (Legacy / Fallback)
      const PRODUCT_REGEX = /\[PRODUCT_LIST_START\](.*?)\[PRODUCT_LIST_END\]/s;
      const productMatch = cleanContent.match(PRODUCT_REGEX);
      if (productMatch) {
        try {
          productIds = JSON.parse(productMatch[1]);
        } catch (e) {
          console.error("Lỗi parse JSON list sản phẩm:", e);
        }
        cleanContent = cleanContent.replace(PRODUCT_REGEX, "").trim();
      }

      const ORDER_REGEX = /\[ORDER_CODE:([a-zA-Z0-9]+)\]/;
      const orderMatch = cleanContent.match(ORDER_REGEX);
      if (orderMatch) {
        orderCode = orderMatch[1];
        cleanContent = cleanContent.replace(ORDER_REGEX, "").trim();
      }
    }

    return { cleanContent, productIds, groupedProducts, orderCode };
  }, [content]);

  return (
    <div className="space-y-3 w-full overflow-hidden">
      {parsedData.cleanContent && (
        <p className="whitespace-pre-wrap leading-relaxed">
          {parsedData.cleanContent}
        </p>
      )}

      {parsedData.orderCode && (
        <OrderPreviewCard orderCode={parsedData.orderCode} />
      )}

      {/* Hiển thị sản phẩm theo nhóm */}
      {parsedData.groupedProducts && Object.keys(parsedData.groupedProducts).map(category => (
        <div key={category} className="space-y-2">
          <h3 className="text-lg font-semibold text-blue-400 border-b border-blue-400/30 pb-1">
            {category}
          </h3>
          <ChatProductGrid 
            productIds={parsedData.groupedProducts![category].map((p: Product) => p.id)} 
          />
        </div>
      ))}

      {/* Hiển thị sản phẩm không phân nhóm */}
      {parsedData.productIds.length > 0 && !parsedData.groupedProducts && (
        <ChatProductGrid productIds={parsedData.productIds} />
      )}
    </div>
  );
};

export default BotMessage;

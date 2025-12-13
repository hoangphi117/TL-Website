import React from "react";
import { Link } from "react-router-dom";
import { Gift, Star } from "lucide-react";

import type { IProduct } from "@/types/product";

import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { getProductSpecsAttrs } from "@/utils/specMapper";

interface ProductCardProps {
  product: IProduct & {
    discountRate?: number;
    hasGift?: boolean;
  };
  className?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, className }) => {
  const specItems = getProductSpecsAttrs(product);

  const categoryName =
    typeof product.category === "object"
      ? product.category.name
      : String(product.category);

  const shouldShowSpecs = categoryName.toLowerCase() === "pc";

  // Hàm format tiền tệ VNĐ
  const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);

  // Link tới chi tiết sản phẩm
  // Lưu ý: encodeURIComponent để xử lý tên category có dấu hoặc khoảng trắng
  const productLink = `/product/${encodeURIComponent(categoryName)}/${
    product._id
  }`;

  // Xử lý ảnh: Lấy ảnh đầu tiên hoặc ảnh placeholder
  const displayImage =
    product.images && product.images.length > 0
      ? product.images[0]
      : "https://placehold.co/300x300?text=No+Image";

  return (
    <Link
      to={productLink}
      className="block h-full"
      onClick={() => window.scrollTo(0, 0)}
    >
      <Card
        className={cn(
          "group relative h-full bg-white border border-gray-200 rounded-lg hover:shadow-xl transition-all duration-300 p-3 flex flex-col justify-between overflow-hidden",
          className
        )}
      >
        {/* Badge Quà tặng (nếu có) */}
        {product.hasGift && (
          <div className="absolute top-0 right-0 z-10 p-2">
            <div className="bg-red-50 text-red-500 rounded-full p-1.5 shadow-sm border border-red-100">
              <Gift className="w-4 h-4" />
            </div>
          </div>
        )}

        {/* Hình ảnh sản phẩm */}
        <div className="relative w-full aspect-[4/3] flex items-center justify-center overflow-hidden rounded-md bg-white mb-3">
          <img
            src={displayImage}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
          />
          {product.status === "out_of_stock" && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-bold text-sm">
              Hết hàng
            </div>
          )}
        </div>

        {/* Tên sản phẩm */}
        <h3
          className="text-sm font-bold text-gray-800 line-clamp-2 min-h-[40px] hover:text-red-600 transition-colors mb-2"
          title={product.name}
        >
          {product.name}
        </h3>

        {/* --- HỘP CẤU HÌNH (CHỈ HIỂN THỊ NẾU LÀ PC) --- */}
        {shouldShowSpecs && specItems.length > 0 ? (
          <div className="bg-[#f3f4f6] rounded-md p-2 text-[11px] text-gray-600 mb-3">
            <div className="grid grid-cols-2 gap-y-1.5 gap-x-2">
              {specItems.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <div
                    key={index}
                    className="flex items-center gap-1.5 overflow-hidden"
                    title={item.label}
                  >
                    <IconComponent className="w-3.5 h-3.5 flex-shrink-0 text-gray-500" />
                    <span className="truncate font-medium">{item.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : // Nếu không hiện specs thì thêm khoảng trống nhỏ để căn chỉnh layout
        shouldShowSpecs ? (
          <div className="mb-3 h-[60px]" />
        ) : (
          <div className="mb-1" />
        )}

        {/* --- GIÁ & ĐÁNH GIÁ --- */}
        <div className="mt-auto pt-2 border-t border-gray-50">
          <div className="flex items-end gap-2 mb-1 h-5">
            {/* GIÁ GỐC / ORIGINAL PRICE */}
            {product.originalPrice && product.originalPrice > product.price && (
              <>
                <span className="text-xs text-gray-400 line-through">
                  {/* Sử dụng hàm formatPrice đã sửa */}
                  {formatPrice(product.originalPrice)}
                </span>

                {/* % Giảm giá */}
                {(product.discountRate || product.discountPercentage) && (
                  <span className="text-[10px] font-bold text-red-600 bg-red-50 border border-red-200 px-1 rounded">
                    -{product.discountRate || product.discountPercentage}%
                  </span>
                )}
              </>
            )}
          </div>

          {/* Giá bán chính thức / FINAL PRICE */}
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-[#d70018]">
              {/* Sử dụng hàm formatPrice đã sửa */}
              {formatPrice(product.price)}
            </span>

            {/* Rating Stars */}
            {product.averageRating > 0 && (
              <div className="flex items-center gap-0.5 text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-full">
                <span className="font-bold text-orange-500">
                  {Math.floor(product.averageRating)}
                </span>
                <Star className="w-3 h-3 fill-orange-500 text-orange-500" />
              </div>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default ProductCard;

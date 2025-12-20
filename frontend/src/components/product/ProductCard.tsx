import React from "react";
import { Link } from "react-router-dom";
import { Star } from "lucide-react";

import type { IProduct } from "@/types/product";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { getProductSpecsAttrs } from "@/utils/specMapper";

interface ProductCardProps {
  product: IProduct & {};
  className?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, className }) => {
  const specItems = getProductSpecsAttrs(product);

  const categoryName =
    typeof product.category === "object"
      ? product.category.name
      : String(product.category);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);

  const productLink = `/product/${encodeURIComponent(categoryName)}/${
    product._id
  }`;

  const displayImage =
    product.images && product.images.length > 0
      ? product.images[0]
      : "https://placehold.co/300x300?text=No+Image";

  return (
    <Link to={productLink} className="block">
      <Card
        className={cn(
          "group relative bg-white border border-gray-200 rounded-lg p-2 flex flex-col gap-1.5 transition-shadow sm:hover:shadow-xl",
          className
        )}
      >
        {/* IMAGE */}
        <div className="relative w-full aspect-[4/3] flex items-center justify-center overflow-hidden rounded-md bg-white">
          <img
            src={displayImage}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-contain transition-transform sm:group-hover:scale-110"
          />
          {product.status === "out_of_stock" && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-bold text-xs sm:text-sm">
              Hết hàng
            </div>
          )}
        </div>

        {/* NAME */}
        <h3
          className="mt-1 text-xs sm:text-sm font-bold text-gray-800 line-clamp-2 min-h-[32px] sm:min-h-[40px] transition-colors sm:group-hover:text-red-600"
          title={product.name}
        >
          {product.name}
        </h3>

        {/* SPECS */}
        <div className="mt-1 bg-[#f3f4f6] rounded-md p-1.5 sm:p-2 text-[10px] sm:text-[11px] text-gray-600">
          <div className="grid grid-cols-2 gap-y-1 gap-x-2">
            {specItems.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <div
                  key={index}
                  className="flex items-center gap-1 overflow-hidden"
                  title={item.label}
                >
                  <IconComponent className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0 text-gray-500" />
                  <span className="truncate font-medium">{item.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* PRICE & RATING */}
        <div className="mt-2 border-t border-gray-100 pt-1">
          {/* ORIGINAL PRICE */}
          {product.originalPrice && product.originalPrice > product.price && (
            <div className="flex flex-wrap items-center gap-1 text-[10px] sm:text-xs mb-0.5">
              <span className="text-gray-400 line-through">
                {formatPrice(product.originalPrice)}
              </span>
              {product.discountPercentage && product.discountPercentage > 0 && (
                <span className="font-bold text-red-600 bg-red-50 border border-red-200 px-1 rounded">
                  -{product.discountPercentage}%
                </span>
              )}
            </div>
          )}

          {/* FINAL PRICE + RATING */}
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-base sm:text-lg font-bold text-[#d70018]">
              {formatPrice(product.price)}
            </span>

            {product.averageRating > 0 && (
              <div className="self-start sm:self-auto flex items-center gap-0.5 text-[10px] sm:text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-full">
                <span className="font-bold text-orange-500">
                  {Number(product.averageRating).toFixed(1)}
                </span>
                <Star className="w-3 h-3 fill-orange-500 text-orange-500" />
              </div>
            )}
          </div>

          <span className="block mt-0.5 text-[10px] sm:text-xs text-gray-500">
            Đã bán {product.soldCount}
          </span>
        </div>
      </Card>
    </Link>
  );
};

export default ProductCard;

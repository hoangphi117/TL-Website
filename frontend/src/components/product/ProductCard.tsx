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
    <Link to={productLink} className="block h-full">
      <Card
        className={cn(
          "relative bg-[#1a1a1c] border border-2 border-zinc-800 rounded p-3",
          "flex flex-col gap-3",
          "h-full",
          "hover:border-red-600/50",
          className
        )}
      >
        <div className="relative w-full aspect-square sm:aspect-[4/3] overflow-hidden rounded bg-gray-700 p-1">
          <img
            src={displayImage}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-contain"
          />
          {product.status === "out_of_stock" && (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center text-white font-bold text-xs sm:text-sm backdrop-blur-sm">
              HẾT HÀNG
            </div>
          )}
        </div>

        {/* NAME */}
        <h3
          className="text-xs sm:text-sm font-bold text-gray-200 line-clamp-2 min-h-[2.5em] transition-colors hover:text-red-500"
          title={product.name}
        >
          {product.name}
        </h3>

        {/* SPECS */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-md p-2 text-[10px] sm:text-xs text-gray-400">
          <div className="flex flex-wrap gap-y-1 gap-x-3 items-center">
            {specItems.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <div
                  key={index}
                  className="flex items-center gap-1 min-w-fit"
                  title={item.label}
                >
                  <IconComponent className="w-3 h-3 flex-shrink-0 text-gray-500" />
                  <span className="font-medium whitespace-nowrap">
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* PRICE & RATING */}
        <div className="mt-auto pt-2 flex flex-col gap-1">
          {/* PRICE */}
          <div>
            {product.originalPrice && product.originalPrice > product.price && (
              <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm mb-1">
                <span className="text-gray-500 line-through decoration-gray-500">
                  {formatPrice(product.originalPrice)}
                </span>
                {product.discountPercentage &&
                  product.discountPercentage > 0 && (
                    <span className="font-bold text-red-500 bg-red-500/10 border border-red-500/20 px-1 rounded text-[10px]">
                      -{product.discountPercentage}%
                    </span>
                  )}
              </div>
            )}

            <span className="block text-lg sm:text-xl font-bold text-red-600 tracking-tight">
              {formatPrice(product.price)}
            </span>
          </div>

          {/* RATING */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
            {product.averageRating > 0 && (
              <div className="flex items-center gap-1 bg-yellow-500/10 border border-yellow-500/20 px-1.5 py-0.5 rounded">
                <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                <span className="font-bold text-yellow-500">
                  {Number(product.averageRating).toFixed(1)}
                </span>
              </div>
            )}
            <span className="hidden sm:inline text-gray-400">
              Đã bán {product.soldCount}
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default ProductCard;

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronRight, Truck } from "lucide-react";

import Carousel from "@/components/product/carousel/carousel";
import ProductCard from "@/components/product/ProductCard";
import type { IProduct } from "@/types/product";

interface ProductListCarouselProps {
  title: string;
  products: IProduct[];
  viewAllLink?: string;
  autoplay?: boolean;
  className?: string;
  brands?: any[];
}

const ProductListCarousel: React.FC<ProductListCarouselProps> = ({
  title,
  products,
  viewAllLink,
  autoplay = false,
  className,
  brands = [],
}) => {
  const navigate = useNavigate();

  const displayBrands = brands?.slice(0, 5) || [];

  return (
    <div
      className={`w-full bg-[#151517]/80 backdrop-blur-md border border-zinc-800 rounded px-5 py-6 shadow-xl ${
        className || ""
      }`}
    >
      <div className="mb-6 px-1">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            <h2 className="text-xl md:text-2xl font-bold text-white uppercase border-l-4 border-red-600 pl-4 tracking-wide">
              {title}
            </h2>

            {/* Shipping badge */}
            <div className="flex items-center gap-2 text-sm text-gray-400 bg-zinc-800/50 px-3 py-1 rounded-full border border-zinc-700/50">
              <Truck className="text-red-500 h-4 w-4" />
              <span>Miễn phí giao hàng</span>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-4">
            {/* Brands */}
            {displayBrands && displayBrands.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {displayBrands.map((brand) => (
                  <span
                    key={brand._id}
                    onClick={() => navigate(`/products?brand=${brand.name}`)}
                    className="cursor-pointer px-3 py-1 text-xs font-medium text-gray-300
                bg-zinc-800 border border-zinc-700 hover:bg-red-600 hover:text-white hover:border-red-600
                rounded transition-all duration-300"
                  >
                    {brand.name}
                  </span>
                ))}
              </div>
            )}

            {/* View all */}
            {viewAllLink && (
              <Link
                to={viewAllLink}
                className="group inline-flex items-center text-sm font-semibold
            text-gray-400 hover:text-red-500 transition-colors self-start md:self-auto"
              >
                Xem tất cả
                <ChevronRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* --- CAROUSEL BODY --- */}
      <Carousel<IProduct>
        data={products}
        autoplay={autoplay}
        itemClassName="basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5 pl-4"
        renderItem={(product) => (
          <div className="h-full pr-1 pb-2">
            <ProductCard product={product} />
          </div>
        )}
      />
    </div>
  );
};

export default ProductListCarousel;

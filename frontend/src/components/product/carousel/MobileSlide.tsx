import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import ProductCard from "@/components/product/ProductCard";
import type { IProduct } from "@/types/product";
import type { IBrand } from "@/types/brand";

interface MobileProductSlideProps {
  title: string;
  products: IProduct[];
  brands?: IBrand[];
  viewAllLink?: string;
  className?: string;
}

const MobileProductSlide: React.FC<MobileProductSlideProps> = ({
  title,
  products,
  brands = [],
  viewAllLink,
  className,
}) => {
  const navigate = useNavigate();

  return (
    // Xóa bg-white, dùng bg-transparent hoặc nền tối mờ
    <div className={`rounded-md p-0 mb-6 ${className || ""}`}>
      <div className="flex items-center justify-between mb-4 px-2">
        <h2 className="text-lg font-bold text-white uppercase border-l-4 border-red-600 pl-3 leading-none tracking-wide">
          {title}
        </h2>
        {viewAllLink && (
          <Link
            to={viewAllLink}
            className="text-xs text-red-500 flex items-center gap-0.5 font-medium active:text-red-500 hover:text-white transition-colors"
          >
            Xem tất cả <ChevronRight className="w-3 h-3" />
          </Link>
        )}
      </div>

      {/* BRANDS FILTER */}
      {brands && brands.length > 0 && (
        <div className="flex overflow-x-auto gap-2 mb-4 px-2 pb-1 no-scrollbar">
          {brands.map((brand) => (
            <button
              key={brand._id}
              onClick={() => navigate(`/products?brand=${brand.name}`)}
              className="flex-shrink-0 px-3 py-1.5 text-[11px] font-medium text-gray-300 bg-zinc-800/80 backdrop-blur rounded border border-zinc-700 active:bg-red-600 active:border-red-600 active:text-white transition-all"
            >
              {brand.name}
            </button>
          ))}
        </div>
      )}

      {/* PRODUCTS LIST */}
      <div className="flex overflow-x-auto gap-3 pb-4 px-2 snap-x snap-mandatory scroll-smooth no-scrollbar">
        {products.map((product) => (
          <div
            key={product._id}
            className="w-[170px] flex-shrink-0 snap-start h-auto"
          >
            <ProductCard product={product} />
          </div>
        ))}

        {viewAllLink && (
          <div className="w-[100px] flex-shrink-0 snap-start flex items-center justify-center">
            <Link
              to={viewAllLink}
              className="flex flex-col items-center justify-center text-gray-400 text-xs gap-2 p-4 h-full w-full bg-zinc-900/50 border border-zinc-800 rounded-xl hover:bg-zinc-800 hover:text-red-500 transition-all"
            >
              <div className="bg-zinc-800 rounded-full p-3 group-hover:bg-red-600/20">
                <ChevronRight className="w-6 h-6" />
              </div>
              <span className="font-semibold">Xem thêm</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileProductSlide;

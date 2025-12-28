import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { categoryService } from "@/services/api/customer/category.service";
import { Skeleton } from "@/components/ui/skeleton";
import { type ICategory } from "@/types/category";

const BottomCategory: React.FC = () => {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const res = await categoryService.getAllCategories();
        if (res.success && res.data) {
          setCategories(res.data);
        }
      } catch (error) {
        console.log("Failed to fetch categories: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="w-full bg-[#151517]/90 backdrop-blur-md rounded px-4 py-6 shadow-xl border border-zinc-800 mt-8">
      <div className="flex flex-col justify-between mb-2 px-1">
        <h2 className="text-xl md:text-2xl font-bold text-white uppercase border-l-4 border-red-600 pl-4 mb-6 md:mb-8 tracking-wide">
          Danh mục sản phẩm
        </h2>

        {loading ? (
          <div className="grid grid-cols-5 lg:grid-cols-10 gap-4">
            {Array.from({ length: 10 }).map((_, index) => (
              <div key={index} className="flex flex-col items-center space-y-2">
                <Skeleton className="h-14 w-14 rounded-full bg-zinc-800" />
                <Skeleton className="h-4 w-12 bg-zinc-800" />
              </div>
            ))}
          </div>
        ) : (
          <div
            className="grid grid-rows-2 grid-flow-col gap-4 overflow-x-auto pb-4 snap-x scrollbar-hide
            md:grid-cols-5 lg:grid-cols-10 md:gap-6 md:overflow-visible md:max-h-none md:grid-flow-row"
          >
            {categories.map((category) => (
              <Link
                to={`/category/${category._id}`}
                key={category._id}
                className="flex-shrink-0 w-24 md:w-auto flex flex-col items-center justify-center snap-start p-3 rounded-xl group"
              >
                <div className="w-14 h-14 md:w-16 md:h-16 mb-3 flex items-center justify-center bg-zinc-800 rounded-full p-3 ">
                  <img
                    src={
                      category.imageUrl ||
                      "https://placehold.co/64x64?text=No+Img"
                    }
                    alt={category.name}
                    className="w-full h-full object-contain filter transition-all duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://placehold.co/64x64?text=Error";
                    }}
                  />
                </div>
                <p className="text-xs md:text-sm text-center font-medium text-gray-400 group-hover:text-red-500 transition-colors line-clamp-2 h-10 flex items-center">
                  {category.name}
                </p>
              </Link>
            ))}
          </div>
        )}

        {!loading && categories.length === 0 && (
          <div className="text-center text-gray-500 py-6 italic">
            Chưa có danh mục nào.
          </div>
        )}
      </div>
    </div>
  );
};

export default BottomCategory;

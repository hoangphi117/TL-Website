import React, { useState, useEffect, useMemo } from "react";
import { Menu, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { categoryService } from "@/services/api/customer/category.service";
import { type ICategory } from "@/types/category";
import { Link } from "react-router-dom";

import getCategoryIcon from "@/utils/mapIcon";
import { getFiltersForCategory } from "@/types/filter";

interface ICategoryWithChildren extends ICategory {
  children: ICategory[];
}

const CategoryDropdownContent: React.FC = () => {
  const [categories, setCategories] = useState<ICategoryWithChildren[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIdx, setActiveIdx] = useState<number>(0);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await categoryService.getAllCategories();
        if (res.success && res.data) {
          const parents = res.data.filter((c) => !c.parentCategory);
          const hierarchy = parents.map((p) => ({
            ...p,
            children: res.data.filter((c) => c.parentCategory?._id === p._id),
          }));
          setCategories(hierarchy);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchCats();
  }, []);

  const activeCat = categories[activeIdx];
  const activeFilters = useMemo(
    () => (activeCat ? getFiltersForCategory(activeCat.name) : []),
    [activeCat]
  );

  if (loading)
    return (
      <div className="w-[900px] h-[500px] bg-[#151517] p-6 rounded border border-zinc-800">
        <Skeleton className="h-full w-full bg-zinc-800" />
      </div>
    );

  return (
    <div className="bg-[#151517]/95 backdrop-blur-md text-white shadow-2xl w-3xl border border-zinc-800 flex rounded overflow-hidden h-[500px] animate-in fade-in zoom-in-95">
      {/* DANH MỤC CHA */}
      <div className="w-64 bg-black/40 border-r border-zinc-800 py-2 overflow-y-auto no-scrollbar">
        {categories.map((cat, i) => (
          <div
            key={cat._id}
            onMouseEnter={() => setActiveIdx(i)}
            className={cn(
              "flex items-center gap-3 px-4 py-3 cursor-pointer text-sm font-bold transition-all uppercase tracking-tight",
              activeIdx === i
                ? "bg-zinc-800 text-red-500 border-l-4 border-red-600"
                : "text-gray-400 border-l-4 border-transparent hover:text-gray-200"
            )}
          >
            <span
              className={activeIdx === i ? "text-red-500" : "text-gray-500"}
            >
              {getCategoryIcon(cat.name)}
            </span>
            <span className="flex-1 truncate">{cat.name}</span>
            <ChevronRight
              className={cn(
                "w-4 h-4 transition-opacity",
                activeIdx === i ? "opacity-100" : "opacity-20"
              )}
            />
          </div>
        ))}
      </div>

      {/* DANH MỤC CON & BỘ LỌC */}
      <div className="flex-1 p-6 bg-transparent overflow-y-auto no-scrollbar">
        <Link
          to={`/category/${activeCat?._id}`}
          className="text-xs text-red-500 hover:text-red-400 font-bold uppercase tracking-widest underline underline-offset-4 mb-6 block"
        >
          Xem tất cả {activeCat?.name}
        </Link>

        <div className="space-y-8">
          {activeCat?.children.length > 0 && (
            <div>
              <h3 className="font-bold text-white uppercase text-xs mb-4 border-b border-zinc-800 pb-2 flex items-center gap-2">
                <span className="w-1 h-3 bg-red-600 rounded-full"></span>
                Danh mục con
              </h3>
              <div className="grid grid-cols-3 gap-y-3 gap-x-4">
                {activeCat.children.map((child) => (
                  <Link
                    key={child._id}
                    to={`/category/${
                      activeCat._id
                    }?category=${encodeURIComponent(child.name)}`}
                    className="text-sm text-gray-400 hover:text-red-500 transition-colors"
                  >
                    {child.name}
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-3 gap-8">
            {activeFilters.map((group, idx) => (
              <div key={idx} className="space-y-4">
                <h3 className="font-bold text-xs text-red-600 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-1 h-3 bg-red-600 rounded-full"></span>
                  {group.label}
                </h3>
                <ul className="space-y-2">
                  {group.options.map((opt, i) => (
                    <li key={i}>
                      <Link
                        to={`/category/${activeCat?._id}?${
                          group.key
                        }=${encodeURIComponent(opt.value)}`}
                        className="text-sm text-gray-400 hover:text-white block transition-all hover:translate-x-1"
                      >
                        {opt.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const CategoryDesktop: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div
      className="relative group z-50"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <Button
        variant="outline"
        className="border-2 border-white bg-transparent rounded text-white hover:border-red-600 hover:text-red-600 gap-2 cursor-pointer font-bold uppercase transition-all"
      >
        <Menu className="h-4 w-4" /> Danh mục
      </Button>
      {isOpen && (
        <div className="absolute left-0 top-full pt-2">
          <CategoryDropdownContent />
        </div>
      )}
    </div>
  );
};

export default CategoryDesktop;

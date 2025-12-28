import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { ChevronDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

import { type IBrand } from "@/types/brand";
import { brandService } from "@/services/api/customer/brand.service";
import { categoryService } from "@/services/api/customer/category.service";

import { FILTER_CONFIG, detectCategoryFromKeyword } from "@/types/filter";
import { formatVND } from "@/utils/admin/formatMoney";

// --- 1. COMPONENT LỌC GIÁ (SLIDER) ---
const PriceFilter = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [range, setRange] = useState([0, 50000000]);
  const [isOpen, setIsOpen] = useState(false);

  // Đồng bộ state với URL mỗi khi mở Popover hoặc URL thay đổi
  useEffect(() => {
    const gte = Number(searchParams.get("price[gte]")) || 0;
    const lte = Number(searchParams.get("price[lte]")) || 50000000;
    setRange([gte, lte]);
  }, [searchParams, isOpen]);

  const handleApply = () => {
    setSearchParams((prev) => {
      prev.set("price[gte]", range[0].toString());
      prev.set("price[lte]", range[1].toString());
      prev.set("page", "1"); // Reset về trang 1 khi lọc mới
      return prev;
    });
    setIsOpen(false);
  };

  const isActive =
    searchParams.has("price[gte]") || searchParams.has("price[lte]");

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "bg-zinc-900 border-zinc-800 text-gray-300 rounded hover:bg-transparent hover:text-gray-300",
            isActive && "border-red-600 text-red-500 bg-red-600/10"
          )}
        >
          Giá{" "}
          {isActive
            ? `(${formatVND(range[0])}đ - ${formatVND(range[1])}đ)`
            : ""}{" "}
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-80 p-4 bg-[#1a1a1c] border-zinc-800 rounded shadow-2xl"
        align="start"
      >
        <div className="space-y-6">
          <p className="text-sm font-bold text-white uppercase tracking-wider">
            Khoảng giá (đ)
          </p>
          <div className="flex items-center gap-2">
            <Input
              value={formatVND(range[0])}
              readOnly
              className="h-9 bg-zinc-900 border-zinc-800 text-white rounded text-center text-xs"
            />
            <span className="text-zinc-700">—</span>
            <Input
              value={formatVND(range[1])}
              readOnly
              className="h-9 bg-zinc-900 border-zinc-800 text-white rounded text-center text-xs"
            />
          </div>
          <Slider
            value={range}
            min={0}
            max={100000000}
            step={1000000}
            onValueChange={setRange}
            className="py-4 bg-gray-700"
          />
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="flex-1 border-zinc-800 text-gray-400 rounded"
            >
              Hủy
            </Button>
            <Button
              size="sm"
              onClick={handleApply}
              className="flex-1 bg-red-600 text-white rounded font-bold"
            >
              Lọc
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

// --- 2. COMPONENT LỌC THUỘC TÍNH CHUNG (CHECKBOX) ---
interface AttributeFilterProps {
  label: string;
  paramKey: string; // Key trên URL (ví dụ: 'brand', 'specifications.ram')
  options: { label: string; value: string }[];
}

const AttributeFilter: React.FC<AttributeFilterProps> = ({
  label,
  paramKey,
  options,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selected, setSelected] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Dùng getAll để lấy mảng các giá trị (hỗ trợ dạng ?key=A&key=B)
    const currentValues = searchParams.getAll(paramKey);

    // Logic fallback: Nếu URL cũ vẫn dùng dấu phẩy (?key=A,B), ta vẫn hỗ trợ tách nó ra
    // Điều này giúp tránh lỗi nếu user chia sẻ link cũ
    if (currentValues.length === 1 && currentValues[0].includes(",")) {
      setSelected(currentValues[0].split(","));
    } else if (currentValues.length > 0) {
      setSelected(currentValues);
    } else {
      setSelected([]);
    }
  }, [searchParams, paramKey, isOpen]);

  const handleApply = () => {
    setSearchParams((prev) => {
      // 1. Xóa key hiện tại để tránh bị trùng hoặc lỗi
      prev.delete(paramKey);

      // 2. Nếu có lựa chọn, thêm từng cái vào URL (tạo ra dạng &key=val1&key=val2)
      if (selected.length > 0) {
        selected.forEach((val) => {
          prev.append(paramKey, val);
        });
      }

      prev.set("page", "1");
      return prev;
    });
    setIsOpen(false);
  };

  const isActive = selected.length > 0;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "bg-zinc-900 border-zinc-800 text-gray-300 rounded hover:bg-transparent hover:text-gray-300",
            isActive && "border-red-600 text-red-500 bg-red-600/10"
          )}
        >
          {label} {isActive ? `(${selected.length})` : ""}{" "}
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-64 p-3 bg-[#1a1a1c] border-zinc-800 rounded shadow-2xl"
        align="start"
      >
        <div className="space-y-4">
          <div className="max-h-60 overflow-y-auto space-y-2 pr-1 no-scrollbar">
            {options.map((opt: any) => (
              <div
                key={opt.value}
                className="flex items-center space-x-3 p-2 rounded hover:bg-zinc-800 transition-colors"
              >
                <Checkbox
                  id={`${paramKey}-${opt.value}`}
                  checked={selected.includes(opt.value)}
                  onCheckedChange={(checked) =>
                    setSelected((p) =>
                      checked
                        ? [...p, opt.value]
                        : p.filter((x) => x !== opt.value)
                    )
                  }
                  className="border-zinc-700 data-[state=checked]:bg-red-600"
                />
                <label
                  htmlFor={`${paramKey}-${opt.value}`}
                  className="text-sm font-medium text-gray-300 cursor-pointer w-full"
                >
                  {opt.label}
                </label>
              </div>
            ))}
          </div>
          <div className="flex gap-2 pt-2 border-t border-zinc-800">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelected([])}
              className="w-1/2 border-zinc-800 text-gray-500 rounded"
            >
              Xóa
            </Button>
            <Button
              size="sm"
              onClick={handleApply}
              className="w-1/2 bg-red-600 text-white rounded font-bold"
            >
              Lọc
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

interface ProductFilterBarProps {
  categoryName?: string;
}

export const ProductFilterBar: React.FC<ProductFilterBarProps> = ({
  categoryName = "",
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [brands, setBrands] = useState<{ label: string; value: string }[]>([]);

  const currentKeyword = searchParams.get("keyword") || "";
  const currentCategoryId = searchParams.get("category");

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        // TRƯỜNG HỢP 1: Có ID trên URL (Vào thẳng trang danh mục)
        // Logic này giống hệt: brandService.getBrandsByCategory(cat._id) ở Homepage
        if (currentCategoryId) {
          const res = await brandService.getBrandsByCategory(currentCategoryId);
          if (res.brands) {
            setBrands(
              res.brands.map((b) => ({ label: b.name, value: b.name }))
            );
          }
          return;
        }

        // TRƯỜNG HỢP 2: Đang Search, chưa có ID -> Phải tìm ID
        if (currentKeyword) {
          const detectedName = detectCategoryFromKeyword(currentKeyword);

          if (detectedName) {
            // Bước phụ: Lấy list category về để tra ID (Giống Homepage fetch categoryRes)
            const catRes = await categoryService.getAllCategories();

            if (catRes.success && catRes.data) {
              // Tìm Category có tên khớp với từ khóa đoán được
              const targetCat = catRes.data.find((c) =>
                c.name.toLowerCase().includes(detectedName.toLowerCase())
              );

              if (targetCat) {
                // Đã tìm thấy ID -> Gọi API lấy Brand chuẩn
                const brandRes = await brandService.getBrandsByCategory(
                  targetCat._id
                );
                if (brandRes.brands) {
                  setBrands(
                    brandRes.brands.map((b) => ({
                      label: b.name,
                      value: b.name,
                    }))
                  );
                  return;
                }
              }
            }
          }
        }

        // TRƯỜNG HỢP 3: Không đoán được gì cả -> Lấy tất cả Brand (Fallback)
        const resAll = await brandService.getAllBrands();
        if (resAll.data) {
          // Lưu ý: getAllBrands trả về data, getBrandsByCategory trả về brands
          // Kiểm tra kiểu dữ liệu trả về của getAllBrands trong file service của bạn
          // Thường là resAll.data
          const list = Array.isArray(resAll.data) ? resAll.data : [];
          setBrands(
            list.map((b: IBrand) => ({ label: b.name, value: b.name }))
          );
        }
      } catch (error) {
        console.error("Lỗi tải brand filter:", error);
      }
    };

    fetchBrands();
  }, [currentCategoryId, currentKeyword]);

  const dynamicFilters = useMemo(() => {
    if (categoryName) {
      const key = Object.keys(FILTER_CONFIG).find((k) =>
        categoryName.toLowerCase().includes(k.toLowerCase())
      );
      return key ? FILTER_CONFIG[key] : FILTER_CONFIG.default;
    }

    if (currentKeyword) {
      const detectedCat = detectCategoryFromKeyword(currentKeyword);
      if (detectedCat) {
        return FILTER_CONFIG[detectedCat] || FILTER_CONFIG.default;
      }
    }

    return FILTER_CONFIG.default;
  }, [categoryName, currentKeyword]);

  const handleResetAll = () => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams();

      const currentCategory = prev.get("category");
      if (currentCategory) {
        newParams.set("category", currentCategory);
      }

      const currentKeyword = prev.get("keyword");
      if (currentKeyword) {
        newParams.set("keyword", currentKeyword);
      }

      // 3. Reset về trang 1
      newParams.set("page", "1");

      return newParams;
    });
  };

  const hasActiveFilters = Array.from(searchParams.keys()).some(
    (key) => !["page", "sort", "limit", "category", "keyword"].includes(key)
  );

  return (
    <div className="flex flex-wrap items-center gap-3 mb-6 p-3 bg-transparent border border-zinc-800 rounded">
      <div className="flex items-center gap-2 text-xs font-bold text-white uppercase bg-zinc-800 px-3 py-2 rounded border border-zinc-700 mr-2 tracking-widest">
        Bộ lọc
      </div>
      <AttributeFilter
        label="Tình trạng"
        paramKey="status"
        options={[
          { label: "Đang bán", value: "active" },
          { label: "Hết hàng", value: "out_of_stock" },
        ]}
      />
      <PriceFilter />
      <AttributeFilter label="Hãng" paramKey="brand" options={brands} />
      {dynamicFilters.map((f: any, i: number) => (
        <AttributeFilter
          key={i}
          label={f.label}
          paramKey={f.key}
          options={f.options}
        />
      ))}
      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleResetAll}
          className="ml-auto text-red-500 hover:bg-transparent hover:text-red-600 rounded"
        >
          <X className="w-4 h-4 mr-1" /> Xoá bộ lọc
        </Button>
      )}
    </div>
  );
};

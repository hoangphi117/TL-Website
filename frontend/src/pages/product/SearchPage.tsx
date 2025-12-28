import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { Search, Home, ChevronRight, FilterX } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ProductFilterBar } from "@/components/product/filter/ProductFilter";
import { ProductSort } from "@/components/product/filter/ProductSort";
import ProductCard from "@/components/product/ProductCard";
import PaginationCustom from "@/components/common/Pagination";
import { productService } from "@/services/api/customer/product.service";

const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const keyword = searchParams.get("keyword") || "";
  const pageFromUrl = Number(searchParams.get("page")) || 1;
  const sortOption = searchParams.get("sort") || "-createdAt";

  const [productResponse, setProductResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true);
      const params: any = {
        page: pageFromUrl,
        limit: 20,
        sort: sortOption,
        keyword,
      };
      searchParams.forEach((v, k) => {
        if (!["page", "sort", "keyword"].includes(k)) params[k] = v;
      });
      try {
        const res = await productService.getProducts(params);
        setProductResponse(res);
      } catch (err) {
        setProductResponse(null);
      } finally {
        setLoading(false);
      }
    };
    fetchSearchResults();
  }, [keyword, pageFromUrl, sortOption, searchParams]);

  return (
    <div className="py-6 min-h-screen container mx-auto px-4 bg-[#1a1a1a]">
      {/* BREADCRUMB */}
      <nav className="flex items-center space-x-2 text-sm text-gray-400 mb-6 bg-[#151517]/80 p-3 rounded border border-zinc-800">
        <Link to="/" className="hover:text-red-500 flex items-center">
          <Home className="w-4 h-4 mr-1" /> Trang chủ
        </Link>
        <ChevronRight className="w-4 h-4 text-zinc-700" />
        <span className="text-white font-semibold">Tìm kiếm</span>
      </nav>

      <h1 className="text-2xl font-bold text-white flex items-center gap-3 mb-6 uppercase">
        <Search className="w-6 h-6 text-red-500" />
        {keyword ? (
          <>
            Kết quả cho: <span className="text-red-500">"{keyword}"</span>
          </>
        ) : (
          "Tất cả sản phẩm"
        )}
      </h1>

      {/* TOOLBAR */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8 bg-[#151517]/90 p-4 rounded border border-zinc-800">
        <ProductFilterBar categoryName="" />
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-400">
            Tìm thấy{" "}
            <strong className="text-white">
              {productResponse?.pagination?.total || 0}
            </strong>{" "}
            sản phẩm
          </span>
          <ProductSort
            value={sortOption}
            onValueChange={(val) =>
              setSearchParams((p) => {
                p.set("sort", val);
                p.set("page", "1");
                return p;
              })
            }
          />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="bg-zinc-900/50 p-4 rounded border border-zinc-800"
            >
              <Skeleton className="h-44 w-full bg-zinc-800" />
            </div>
          ))}
        </div>
      ) : (productResponse?.data?.products.length || 0) > 0 ? (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {productResponse.data.products.map((p: any) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
          <div className="flex justify-center mt-12 pb-10">
            <PaginationCustom
              currentPage={pageFromUrl}
              totalPages={productResponse.pagination.totalPage}
              onPageChange={(p) =>
                setSearchParams((prev) => {
                  prev.set("page", p.toString());
                  return prev;
                })
              }
            />
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 bg-[#151517]/50 rounded border border-zinc-800 border-dashed">
          <FilterX className="w-16 h-16 text-zinc-700 mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">
            Không tìm thấy kết quả
          </h3>
          <Button
            onClick={() => navigate("/")}
            className="bg-red-600 hover:bg-red-700 rounded mt-4"
          >
            Quay lại trang chủ
          </Button>
        </div>
      )}
    </div>
  );
};
export default SearchPage;

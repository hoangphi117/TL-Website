import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { Search, Home, ChevronRight, Frown } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";

import { Button } from "@/components/ui/button";
import { ProductFilterBar } from "@/components/product/filter/ProductFilter";
import { ProductSort } from "@/components/product/filter/ProductSort";
import ProductCard from "@/components/product/ProductCard";

import { productService } from "@/services/api/customer/product.service";
import { type IProductListResponse } from "@/types/product";

const DEFAULT_LIMIT = 20;

const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const keyword = searchParams.get("keyword") || "";
  const pageFromUrl = Number(searchParams.get("page")) || 1;
  const sortOption = searchParams.get("sort") || "-createAt";

  const [productResponse, setProductResponse] =
    useState<IProductListResponse | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true);
      try {
        const params: any = {
          keyword: keyword,
          page: pageFromUrl,
          limit: DEFAULT_LIMIT,
          sort: sortOption,
          fields:
            "name,price,originalPrice,discountPercentage,images,averageRating,soldCount,category,specifications,status,slug",
        };
        searchParams.forEach((value, key) => {
          if (["page", "limit", "sort", "keyword"].includes(key)) return;
          params[key] = value;
        });

        const res = await productService.getProducts(params);
        setProductResponse(res);
      } catch (err) {
        console.error("Search error: ", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSearchResults();
  }, [keyword, pageFromUrl, sortOption, searchParams]);

  const handlePageChange = (newPage: number) => {
    setSearchParams((prev) => {
      prev.set("page", newPage.toString());
      return prev;
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSortChange = (newSort: string) => {
    setSearchParams((prev) => {
      prev.set("sort", newSort);
      prev.set("page", "1");
      return prev;
    });
  };

  const products = productResponse?.data.products || [];
  const pagination = productResponse?.pagination;
  const totalPages = pagination?.totalPage || 1;

  return (
    <div className="py-4 min-h-screen container mx-auto px-4 bg-gray-50/50">
      {/* BREADCRUMB */}
      <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
        <Link to="/" className="flex items-center hover:text-red-600">
          <Home className="w-4 h-4 mr-1" /> Trang chủ
        </Link>
        <ChevronRight className="w-4 h-4 text-gray-300" />
        <span className="text-gray-900 font-semibold">Tìm kiếm</span>
      </nav>

      {/* HEADER KẾT QUẢ */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Search className="w-6 h-6 text-red-600" />
          Kết quả tìm kiếm cho:{" "}
          <span className="text-red-600">"{keyword}"</span>
        </h1>
      </div>

      {/* FILTER & SORT TOOLBAR */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 bg-white p-3 rounded-lg shadow-sm border border-gray-100">
        {/* Lưu ý: ProductFilterBar cần categoryName để hiển thị filter động (CPU, RAM).
            Ở trang Search chung, ta không có categoryName cụ thể, nên nó sẽ chỉ hiện các filter chung (Giá, Tình trạng).
            Nếu bạn muốn filter nâng cao, bạn có thể truyền "Laptop" hoặc category nào đó nếu đoán được ý định người dùng.
        */}
        <ProductFilterBar categoryName="" />

        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
          <span className="text-sm text-gray-600 font-medium whitespace-nowrap">
            {pagination?.total || 0} kết quả
          </span>
          <ProductSort value={sortOption} onValueChange={handleSortChange} />
        </div>
      </div>

      {/* PRODUCTS GRID */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-lg p-3 border border-gray-100 shadow-sm"
            >
              <Skeleton className="h-44 w-full mb-3" />
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      ) : products.length > 0 ? (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {products.map((product) => (
              <div key={product._id} className="h-full">
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-10 gap-2">
              <Button
                variant="outline"
                disabled={pageFromUrl === 1}
                onClick={() => handlePageChange(pageFromUrl - 1)}
              >
                Trước
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Button
                  key={p}
                  variant={p === pageFromUrl ? "default" : "outline"}
                  onClick={() => handlePageChange(p)}
                  className={
                    p === pageFromUrl ? "bg-red-600 hover:bg-red-700" : ""
                  }
                >
                  {p}
                </Button>
              ))}
              <Button
                variant="outline"
                disabled={pageFromUrl === totalPages}
                onClick={() => handlePageChange(pageFromUrl + 1)}
              >
                Sau
              </Button>
            </div>
          )}
        </>
      ) : (
        // EMPTY STATE
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-gray-200 border-dashed">
          <div className="bg-gray-50 p-4 rounded-full mb-4">
            <Frown className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">
            Không tìm thấy sản phẩm nào
          </h3>
          <p className="text-gray-500 mb-6">
            Thử tìm kiếm với từ khóa khác hoặc xóa bộ lọc
          </p>
          <Button onClick={() => navigate("/")}>Về trang chủ</Button>
        </div>
      )}
    </div>
  );
};

export default SearchPage;

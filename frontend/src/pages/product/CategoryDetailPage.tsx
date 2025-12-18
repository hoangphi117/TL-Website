import React, { useEffect, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import {
  Zap,
  ArrowLeftRight,
  ArrowDownWideNarrow,
  ArrowUpNarrowWide,
} from "lucide-react";

import { categoryService } from "@/services/api/customer/category.service";
import { productService } from "@/services/api/customer/product.service";
import { type ICategory } from "@/types/category";
import { type IProductListResponse } from "@/types/product";

import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import ProductCard from "@/components/product/ProductCard";

const DEFAULT_LIMIT = 20;

const CategoryDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const pageFromUrl = Number(searchParams.get("page")) || 1;
  const categoryNameParam = searchParams.get("category");

  // State
  const [categoryDetail, setCategoryDetail] = useState<ICategory | null>(null);
  const [productResponse, setProductResponse] =
    useState<IProductListResponse | null>(null);
  const [loadingCategory, setLoadingCategory] = useState<boolean>(true);
  const [loadingProducts, setLoadingProducts] = useState<boolean>(false);
  const [sortOption, setSortOption] = useState<string>("-createdAt");

  useEffect(() => {
    const fetchCategoryInfo = async () => {
      if (id) {
        setLoadingCategory(true);
        try {
          const catRes = await categoryService.getCategoryById(id);
          if (catRes.data) {
            setCategoryDetail(catRes.data);
          }
        } catch (err) {
          console.error(err);
        } finally {
          setLoadingCategory(false);
        }
      } else if (categoryNameParam) {
        setCategoryDetail({
          _id: "temp",
          name: categoryNameParam,
          description: `Sản phẩm thuộc danh mục ${categoryNameParam}`,
          imageUrl: "",
        } as ICategory);
        setLoadingCategory(false);
      }
    };
    fetchCategoryInfo();
  }, [id, categoryNameParam]);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!categoryDetail?.name) return;

      setLoadingProducts(true);
      try {
        const res = await productService.getProducts({
          category: categoryDetail.name,
          page: pageFromUrl,
          limit: DEFAULT_LIMIT,
          sort: sortOption,
          fields:
            "name,price,originalPrice,images,averageRating,soldCount,specifications,slug",
        });
        setProductResponse(res);
      } catch (err) {
        console.error("Lỗi tải sản phẩm:", err);
      } finally {
        setLoadingProducts(false);
      }
    };

    if (categoryDetail) {
      fetchProducts();
    }
  }, [categoryDetail, pageFromUrl, sortOption]);

  const handlePageChange = (newPage: number) => {
    setSearchParams((prev) => {
      prev.set("page", newPage.toString());
      return prev;
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const products = productResponse?.data?.products || [];
  const pagination = productResponse?.pagination;
  const totalPages = pagination?.totalPage || 1;

  if (loadingCategory) {
    return (
      <div className="py-10 container mx-auto">
        <Skeleton className="w-full h-48 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="py-8 min-h-screen container mx-auto px-4">
      {/* HEADER */}
      {categoryDetail && (
        <Card className="mb-8 bg-white border-none shadow-sm overflow-hidden relative">
          {categoryDetail.imageUrl && (
            <div
              className="absolute inset-0 bg-cover bg-center opacity-10"
              style={{ backgroundImage: `url(${categoryDetail.imageUrl})` }}
            />
          )}
          <CardHeader className="relative z-10">
            <CardTitle className="text-3xl font-bold text-gray-800 flex items-center gap-3 border-l-4 border-red-600 pl-4">
              <Zap className="w-8 h-8 text-red-600 fill-red-600" />
              {categoryDetail.name.toUpperCase()}
            </CardTitle>
            <CardDescription className="text-gray-600 mt-2 text-lg pl-4">
              {categoryDetail.description ||
                `Khám phá các sản phẩm ${categoryDetail.name} chính hãng.`}
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      {/* TOOLBAR & SORT */}
      <div className="mb-6 flex flex-col md:flex-row justify-between items-center text-gray-600 gap-4">
        <p className="font-medium">
          Tìm thấy{" "}
          <span className="text-red-600 font-bold">
            {pagination?.total || 0}
          </span>{" "}
          sản phẩm
        </p>

        {/* [TỐI ƯU 3]: Dropdown Sắp xếp hoạt động thực tế */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              {sortOption === "-createdAt"
                ? "Mới nhất"
                : sortOption === "price"
                ? "Giá tăng dần"
                : "Giá giảm dần"}
              <ArrowLeftRight className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setSortOption("-createdAt")}>
              Mới nhất
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortOption("price")}>
              <ArrowUpNarrowWide className="w-4 h-4 mr-2" /> Giá tăng dần
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortOption("-price")}>
              <ArrowDownWideNarrow className="w-4 h-4 mr-2" /> Giá giảm dần
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* PRODUCT LIST */}
      {loadingProducts ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-lg p-3 border border-gray-200"
            >
              <Skeleton className="h-40 w-full mb-3" />
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {products.length > 0 ? (
              products.map((product) => (
                <div key={product._id} className="h-full">
                  <ProductCard product={product} />
                </div>
              ))
            ) : (
              <div className="col-span-full py-16 flex flex-col items-center justify-center bg-gray-50 rounded-xl border-dashed border-2">
                <p className="text-gray-500 text-lg mb-2">
                  Chưa có sản phẩm nào.
                </p>
                <Button variant="link" onClick={() => navigate("/")}>
                  Quay lại trang chủ
                </Button>
              </div>
            )}
          </div>

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-12 gap-2">
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
      )}
    </div>
  );
};

export default CategoryDetailPage;

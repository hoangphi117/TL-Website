import React, { useEffect, useState } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { Zap, ChevronRight, Home, LayoutGrid } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { categoryService } from "@/services/api/customer/category.service";
import { productService } from "@/services/api/customer/product.service";
import { ProductFilterBar } from "@/components/product/filter/ProductFilter";
import { ProductSort } from "@/components/product/filter/ProductSort";
import ProductCard from "@/components/product/ProductCard";
import PaginationCustom from "@/components/common/Pagination";

const CategoryDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const pageFromUrl = Number(searchParams.get("page")) || 1;
  const sortOption = searchParams.get("sort") || "-createdAt";
  const [categoryDetail, setCategoryDetail] = useState<any>(null);
  const [productResponse, setProductResponse] = useState<any>(null);
  const [loadingCategory, setLoadingCategory] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(false);

  useEffect(() => {
    const fetchCategoryInfo = async () => {
      if (id) {
        setLoadingCategory(true);
        try {
          const catRes = await categoryService.getCategoryById(id);
          setCategoryDetail(catRes.data);
        } catch (err) {
        } finally {
          setLoadingCategory(false);
        }
      }
    };
    fetchCategoryInfo();
  }, [id]);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!categoryDetail?.name) return;
      setLoadingProducts(true);
      try {
        const params: any = {
          category: categoryDetail.name,
          page: pageFromUrl,
          limit: 20,
          sort: sortOption,
        };
        searchParams.forEach((v, k) => {
          if (!["page", "sort"].includes(k)) params[k] = v;
        });
        const res = await productService.getProducts(params);
        setProductResponse(res);
        console.log(res);
      } catch (err) {
      } finally {
        setLoadingProducts(false);
      }
    };
    if (categoryDetail) fetchProducts();
  }, [categoryDetail, pageFromUrl, sortOption, searchParams]);

  if (loadingCategory)
    return (
      <div className="py-10 container mx-auto px-4">
        <Skeleton className="w-full h-48 rounded bg-zinc-800" />
      </div>
    );

  return (
    <div className="py-4 min-h-screen container mx-auto px-4 bg-[#1a1a1a]">
      {/* BREADCRUMB */}
      <nav className="flex items-center space-x-2 text-sm text-gray-400 mb-6 bg-[#151517]/80 p-3 rounded border border-zinc-800">
        <Link to="/" className="flex items-center hover:text-red-500">
          <Home className="w-4 h-4 mr-1" /> Trang chủ
        </Link>
        <ChevronRight className="w-4 h-4 text-zinc-700" />
        <span className="text-white font-semibold">{categoryDetail?.name}</span>
      </nav>

      {/* HEADER CARD */}
      <Card className="mb-6 bg-gradient-to-r from-red-600/20 to-zinc-900/90 border-zinc-800 rounded border-l-4 border-l-red-600">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <Zap className="w-6 h-6 text-red-500 fill-red-500" />
            <CardTitle className="text-2xl font-bold text-white uppercase tracking-tight">
              {categoryDetail?.name}
            </CardTitle>
          </div>
          <CardDescription className="text-gray-400">
            {categoryDetail?.description}
          </CardDescription>
        </CardHeader>
      </Card>

      <ProductFilterBar categoryName={categoryDetail?.name} />

      {/* TOOLBAR */}
      <div className="mb-6 flex flex-col md:flex-row justify-between items-center bg-[#151517]/90 p-4 rounded border border-zinc-800 gap-4">
        <div className="flex items-center text-gray-300">
          <LayoutGrid className="w-5 h-5 mr-2 text-red-500" />
          Tìm thấy{" "}
          <span className="text-red-500 font-black mx-1">
            {productResponse?.pagination?.total || 0}
          </span>{" "}
          sản phẩm
        </div>
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

      {/* GRID */}
      {loadingProducts ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="bg-zinc-900/50 rounded p-4 border border-zinc-800"
            >
              <Skeleton className="h-44 w-full bg-zinc-800" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {productResponse?.data?.products.map((p: any) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}

      {/* PAGINATION */}
      {productResponse?.pagination?.totalPage > 1 && (
        <PaginationCustom
          currentPage={pageFromUrl}
          totalPages={productResponse.pagination.totalPage}
          onPageChange={(page) =>
            setSearchParams((prev) => {
              prev.set("page", page.toString());
              return prev;
            })
          }
        />
      )}
    </div>
  );
};
export default CategoryDetailPage;

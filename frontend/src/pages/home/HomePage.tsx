import { useEffect, useState } from "react";
import useDocumentTitle from "@/hooks/useDocumentTitle";

import Banner from "@/components/common/Banner";
import BottomCategory from "@/features/BottomCategory";
import ProductListCarousel from "@/components/common/carousel/ProductListCarousel";
import { Skeleton } from "@/components/ui/skeleton";

import { productService } from "@/services/api/customer/product.service";
import { categoryService } from "@/services/api/customer/category.service";
import type { IProduct } from "@/types/product";

interface IHomeSection {
  title: string;
  categoryId: string;
  products: IProduct[];
}

const HomePage = () => {
  useDocumentTitle("Trang Chủ");

  const [sections, setSections] = useState<IHomeSection[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      setLoading(true);
      try {
        const categoryRes = await categoryService.getAllCategories();

        if (categoryRes.success && categoryRes.data) {
          const allCategories = categoryRes.data;

          const targetNames = ["Laptop", "Điện thoại", "Bàn phím", "Chuột"];

          const selectedCats = allCategories.filter((cat) =>
            targetNames.some((name) =>
              cat.name.toLowerCase().includes(name.toLowerCase())
            )
          );

          const sectionPromises = selectedCats.map(async (cat) => {
            const productRes = await productService.getProducts({
              category: cat.name,
              limit: 10,
              fields:
                "name,price,images,originalPrice, averageRating,specifications",
            });

            const productsData = productRes.data?.products || [];

            return {
              title: cat.name,
              categoryId: cat._id,
              products: productsData,
            };
          });

          const results = await Promise.all(sectionPromises);

          setSections(results.filter((section) => section.products.length > 0));
        }
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu trang chủ:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  return (
    <div className="mx-auto px-2 sm:px-4 lg:px-8 space-y-4 py-4 bg-[#ececec]">
      <Banner />

      {loading ? (
        <div className="space-y-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white p-4 rounded-md">
              <Skeleton className="h-8 w-64 mb-4" />
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[1, 2, 3, 4, 5].map((j) => (
                  <Skeleton key={j} className="h-60 w-full" />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        sections.map((section) => (
          <section key={section.categoryId} className="p-0">
            <ProductListCarousel
              title={section.title}
              products={section.products}
              viewAllLink={`/category/${section.categoryId}`}
              autoplay={true}
            />
          </section>
        ))
      )}

      <BottomCategory />
    </div>
  );
};

export default HomePage;

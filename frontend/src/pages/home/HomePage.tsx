import { useEffect, useState } from "react";
import useDocumentTitle from "@/hooks/useDocumentTitle";

import Banner from "@/components/common/Banner";
import ServicePolicy from "@/pages/home/ServicePolicy";
import BottomCategory from "@/pages/home/BottomCategory";
import ProductListCarousel from "@/components/product/carousel/ProductListCarousel";
import MobileProductSlide from "@/components/product/carousel/MobileSlide";
import { Skeleton } from "@/components/ui/skeleton";

import { productService } from "@/services/api/customer/product.service";
import { categoryService } from "@/services/api/customer/category.service";
import { brandService } from "@/services/api/customer/brand.service";
import type { IProduct } from "@/types/product";
import type { IBrand } from "@/types/brand";

interface IHomeSection {
  title: string;
  categoryId: string;
  products: IProduct[];
  brands: IBrand[];
}

const HomePage = () => {
  useDocumentTitle("Trang Chủ");

  const [laptopSection, setLaptopSection] = useState<IHomeSection | null>(null);
  const [phoneSection, setPhoneSection] = useState<IHomeSection | null>(null);
  const [keyboardSection, setKeyboardSection] = useState<IHomeSection | null>(
    null
  );
  const [mouseSection, setMouseSection] = useState<IHomeSection | null>(null);

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      setLoading(true);
      try {
        const categoryRes = await categoryService.getAllCategories();

        if (categoryRes.success && categoryRes.data) {
          const allCategories = categoryRes.data;

          const getCategoryData = async (
            keyword: string
          ): Promise<IHomeSection | null> => {
            const cat = allCategories.find((c) =>
              c.name.toLowerCase().includes(keyword.toLowerCase())
            );

            if (!cat) return null;

            const [productRes, brandRes] = await Promise.all([
              productService.getProducts({
                category: cat.name,
                limit: 10,
                fields:
                  "name,price,images,originalPrice,averageRating,specifications,soldCount",
              }),
              brandService.getBrandsByCategory(cat._id),
            ]);

            return {
              title: cat.name,
              categoryId: cat._id,
              products: productRes.data?.products || [],
              brands: brandRes.brands || [],
            };
          };

          const [laptopData, phoneData, keyboardData, mouseData] =
            await Promise.all([
              getCategoryData("Laptop"),
              getCategoryData("Điện thoại"),
              getCategoryData("Bàn phím"),
              getCategoryData("Chuột"),
            ]);

          setLaptopSection(laptopData);
          setPhoneSection(phoneData);
          setKeyboardSection(keyboardData);
          setMouseSection(mouseData);
        }
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu trang chủ:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  const RenderSection = ({ data }: { data: IHomeSection | null }) => {
    if (!data || data.products.length === 0) return null;
    return (
      <section className="p-0 mt-4">
        {/* MOBILE VIEW */}
        <div className="md:hidden">
          <MobileProductSlide
            title={data.title}
            products={data.products}
            brands={data.brands}
            viewAllLink={`/category/${data.categoryId}`}
          />
        </div>

        {/* DESKTOP VIEW */}
        <div className="hidden md:block">
          <ProductListCarousel
            title={data.title}
            products={data.products}
            viewAllLink={`/category/${data.categoryId}`}
            autoplay={true}
            brands={data.brands}
          />
        </div>
      </section>
    );
  };

  const PromotionBanner = ({ src }: { src: string }) => (
    <div className="group overflow-hidden rounded-lg border border-zinc-800 shadow-md">
      <img
        src={src}
        className="w-full h-[120px] object-cover cursor-pointer transition-transform duration-500 group-hover:scale-105 group-hover:brightness-110"
        alt="Promotion"
      />
    </div>
  );

  return (
    <div className="mx-auto px-2 sm:px-4 lg:px-8 space-y-1 py-3 bg-transparent">
      <Banner />
      <ServicePolicy />

      {loading ? (
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-[#151517]/50 backdrop-blur p-4 rounded-xl border border-zinc-800"
            >
              <Skeleton className="h-8 w-40 mb-4 bg-zinc-800" />
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[1, 2, 3, 4].map((j) => (
                  <Skeleton
                    key={j}
                    className="h-60 w-full bg-zinc-800 rounded-lg"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <RenderSection data={laptopSection} />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 my-4">
            <PromotionBanner src="https://file.hstatic.net/200000722513/file/banner_790x250_tai_nghe_6f6dcb17d3a54fcc88b3de96762d2d41.jpg" />
            <PromotionBanner src="https://file.hstatic.net/200000722513/file/bot_promotion_banner_small_2_2ad55c2345c64fbfb87dab4957b33914.png" />
            <PromotionBanner src="https://cdn.hstatic.net/files/200000722513/file/gearvn-man-hinh-t10-bot-promotion-big.jpg" />
          </div>

          <RenderSection data={phoneSection} />
          <RenderSection data={keyboardSection} />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 my-4">
            <PromotionBanner src="https://gamelade.vn/wp-content/uploads/2025/06/call-of-duty-black-ops-7-announced.webp" />
            <PromotionBanner src="https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1238810/header.jpg?t=1747167586" />
            <PromotionBanner src="https://eu.redmagic.gg/cdn/shop/files/banner-pc_2x_db79e769-d48e-4beb-8bb9-26826e2a63c8.png?v=1679906718&width=2400" />
          </div>

          <RenderSection data={mouseSection} />
        </>
      )}

      <BottomCategory />
    </div>
  );
};

export default HomePage;

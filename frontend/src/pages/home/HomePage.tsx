import ProductListCarousel from "@/components/common/carousel/ProductListCarousel";

import pcData from "@/data/pcs.json";
import mouseData from "@/data/mice.json";
import keyboardData from "@/data/keyboards.json";

import type { Product } from "@/types/product";

const HomePage = () => {
  return (
    <div className=" mx-auto px-2 sm:px-4 lg:px-8 space-y-3 py-4 sm:py-8 bg-[#ececec]">
      {/* PC Carousel */}
      <section className="p-0">
        <ProductListCarousel
          title="PC Gaming Bán Chạy"
          products={pcData as Product[]}
          viewAllLink="/category/pc"
          autoplay={false}
        />
      </section>

      {/* Mouse Carousel */}
      <section className="p-0">
        <ProductListCarousel
          title="Chuột Gaming Giá Rẻ"
          products={mouseData as Product[]}
          viewAllLink="/category/mouse"
          autoplay={true}
          className="bg-gray-100 rounded-lg shadow-inner"
        />
      </section>

      {/* KeyBoard Carousel */}
      <section className="p-0">
        <ProductListCarousel
          title="Bàn Phím Cơ Mới Về"
          products={keyboardData as Product[]}
          viewAllLink="/category/keyboard"
        />
      </section>
    </div>
  );
};

export default HomePage;

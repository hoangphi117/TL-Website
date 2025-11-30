import { Link } from "react-router-dom";
import { Zap, Truck, ShieldCheck } from "lucide-react";

import Banner from "@/components/common/Banner";

import Carousel from "@/components/common/carousel/carousel";
import { Button } from "@/components/ui/button";
// Giả sử bạn có component Card sản phẩm riêng
// import ProductCard from "@/components/common/ProductCard";

const HomePage = () => {
  // Dữ liệu giả lập cho Carousel
  const featuredProducts = [
    {
      id: 1,
      name: "PC Gaming Ultra",
      image: "https://placehold.co/300x300",
      price: "25.000.000đ",
    },
    {
      id: 2,
      name: "Màn hình 4K",
      image: "https://placehold.co/300x300",
      price: "8.000.000đ",
    },
    {
      id: 3,
      name: "Bàn phím cơ",
      image: "https://placehold.co/300x300",
      price: "2.500.000đ",
    },
    {
      id: 4,
      name: "Chuột không dây",
      image: "https://placehold.co/300x300",
      price: "1.200.000đ",
    },
    {
      id: 5,
      name: "Tai nghe Gaming",
      image: "https://placehold.co/300x300",
      price: "1.800.000đ",
    },
  ];

  return (
    <div className="space-y-10 pb-10">
      <Banner />

      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 px-4">
        <div className="flex items-center gap-3 p-4 bg-white rounded shadow-sm">
          <Truck className="w-8 h-8 text-red-500" />
          <div>
            <p className="font-bold">Miễn phí vận chuyển</p>
            <p className="text-sm text-gray-500">Cho đơn hàng trên 5tr</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-4 bg-white rounded shadow-sm">
          <Zap className="w-8 h-8 text-yellow-500" />
          <div>
            <p className="font-bold">Giao hàng hỏa tốc</p>
            <p className="text-sm text-gray-500">Nhận hàng trong 2h</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-4 bg-white rounded shadow-sm">
          <ShieldCheck className="w-8 h-8 text-blue-500" />
          <div>
            <p className="font-bold">Bảo hành chính hãng</p>
            <p className="text-sm text-gray-500">Cam kết 100%</p>
          </div>
        </div>
      </div>

      {/* 3. SẢN PHẨM NỔI BẬT (Dùng CarouselTemplate) */}
      <section className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold uppercase border-l-4 border-red-500 pl-3">
            Sản phẩm nổi bật
          </h2>
          <Link to="/products" className="text-blue-600 hover:underline">
            Xem tất cả
          </Link>
        </div>

        <Carousel
          data={featuredProducts}
          autoplay={true}
          itemClassName="basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
          renderItem={(item) => (
            // Demo render item đơn giản, sau này thay bằng component ProductCard
            <div className="border rounded-lg p-3 h-full bg-white hover:shadow-lg transition-shadow">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-48 object-contain mb-3"
              />
              <h3 className="font-semibold">{item.name}</h3>
              <p className="text-red-600 font-bold">{item.price}</p>
            </div>
          )}
        />
      </section>
    </div>
  );
};

export default HomePage;

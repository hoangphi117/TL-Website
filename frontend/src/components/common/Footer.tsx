import React from "react";
import { Link } from "react-router-dom";
import { Phone, Facebook, Youtube, Instagram, QrCode } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const Footer: React.FC = () => {
  const generalPolicies = [
    { name: "Chính sách bảo hành", href: "/policy/warranty" },
    { name: "Chính sách đổi trả", href: "/policy/return" },
    { name: "Chính sách bảo mật", href: "/policy/privacy" },
    { name: "Chính sách vận chuyển", href: "/policy/shipping" },
    { name: "Hướng dẫn thanh toán", href: "/guide/payment" },
    { name: "Kiểm tra hóa đơn điện tử", href: "/check/invoice" },
  ];

  const infoLinks = [
    { name: "Hệ thống cửa hàng", href: "/showroom" },
    { name: "Tuyển dụng", href: "/careers" },
    { name: "Tin công nghệ", href: "/news" },
  ];

  return (
    <footer className="bg-[#111111] text-gray-300 border-t border-zinc-800 pt-16">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* GIỚI THIỆU */}
          <div>
            <h4 className="font-bold text-white text-lg mb-6 uppercase tracking-wider">
              Về LiquidShop
            </h4>
            <p className="text-sm text-gray-400 mb-6 text-justify leading-relaxed">
              LiquidShop là hệ thống bán lẻ máy tính và phụ kiện gaming hàng đầu
              Việt Nam, cam kết mang đến những trải nghiệm tốt nhất cho game
              thủ.
            </p>
            <div className="space-y-4">
              <div>
                <p className="text-xs uppercase tracking-widest text-gray-500 mb-1">
                  Gọi mua hàng
                </p>
                <a
                  href="tel:18006975"
                  className="text-xl font-semibold text-red-500 hover:text-red-400 transition-colors flex items-center gap-2"
                >
                  <Phone className="w-5 h-5" /> 1800 6975
                </a>
                <p className="text-[10px] text-gray-600 mt-1">(8:30 - 21:30)</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-gray-500 mb-1">
                  Hỗ trợ kỹ thuật
                </p>
                <a
                  href="tel:18006173"
                  className="text-xl font-semibold text-white hover:text-red-500 transition-colors flex items-center gap-2"
                >
                  <Phone className="w-5 h-5" /> 1800 6173
                </a>
                <p className="text-[10px] text-gray-600 mt-1">(8:30 - 21:30)</p>
              </div>
            </div>
          </div>

          {/* CHÍNH SÁCH */}
          <div>
            <h4 className="font-bold text-white text-lg mb-6 uppercase tracking-wider">
              Chính sách chung
            </h4>
            <ul className="space-y-3 text-sm">
              {generalPolicies.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className="text-gray-400 hover:text-red-500 transition-all duration-300 block"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* THÔNG TIN & THANH TOÁN */}
          <div>
            <h4 className="font-bold text-white text-lg mb-6 uppercase tracking-wider">
              Thông tin
            </h4>
            <ul className="space-y-3 text-sm mb-8">
              {infoLinks.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className="text-gray-400 hover:text-red-500 transition-all duration-300 block"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>

            <h4 className="font-bold text-white text-xs mb-4 uppercase tracking-widest text-gray-500">
              Thanh toán
            </h4>
            <div className="flex flex-wrap gap-2 opacity-80 hover:opacity-100 transition-opacity">
              <div className="w-10 h-6 bg-green-600 border border-zinc-700 rounded flex items-center justify-center text-white text-[8px] font-bold">
                COD
              </div>
              <div className="w-10 h-6 bg-pink-800 border border-zinc-700 rounded flex items-center justify-center text-white text-[8px] font-bold">
                MOMO
              </div>
              <div className="w-10 h-6 bg-blue-700 border border-zinc-700 rounded flex items-center justify-center text-white text-[8px] font-bold">
                VNPAY
              </div>
            </div>
          </div>

          {/* KẾT NỐI & CHỨNG NHẬN */}
          <div>
            <h4 className="font-bold text-white text-lg mb-6 uppercase tracking-wider">
              Kết nối
            </h4>
            <div className="flex gap-4 mb-8">
              <Button
                size="icon"
                variant="outline"
                className="rounded-full border-zinc-700 bg-transparent text-gray-400 hover:bg-red-600 hover:border-red-600 hover:text-white transition-all"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </Button>
              <Button
                size="icon"
                variant="outline"
                className="rounded-full border-zinc-700 bg-transparent text-gray-400 hover:bg-red-600 hover:border-red-600 hover:text-white transition-all"
                aria-label="Youtube"
              >
                <Youtube className="w-5 h-5" />
              </Button>
              <Button
                size="icon"
                variant="outline"
                className="rounded-full border-zinc-700 bg-transparent text-gray-400 hover:bg-red-600 hover:border-red-600 hover:text-white transition-all"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </Button>
            </div>

            <h4 className="font-bold text-white text-xs mb-4 uppercase tracking-widest text-gray-500">
              Chứng nhận
            </h4>
            <div className="flex gap-4 items-center mb-6">
              <div className="w-32 h-12 bg-contain bg-no-repeat bg-center grayscale brightness-200 opacity-70 hover:opacity-100 transition-all bg-[url('https://webmedia.com.vn/images/2021/09/logo-da-thong-bao-bo-cong-thuong-mau-xanh.png')]"></div>
            </div>

            <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg group hover:border-red-500/50 transition-colors">
              <div className="flex items-center gap-2 mb-1 text-xs font-bold text-white">
                <QrCode className="w-4 h-4 text-red-500" /> Quét mã tư vấn
              </div>
              <p className="text-[10px] text-gray-500">
                Zalo OA chính thức của LiquidShop
              </p>
            </div>
          </div>
        </div>

        <Separator className="bg-zinc-800" />

        {/* --- BOTTOM COPYRIGHT --- */}
        <div className="py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-[11px] text-gray-500 tracking-tight">
            <div>
              <p className="font-bold text-gray-300 mb-2 uppercase tracking-widest">
                CÔNG TY TNHH THƯƠNG MẠI TEAM LIQUID
              </p>
              <p className="mb-1">
                Địa chỉ: 276-278 Hoàng Văn Thụ, Phường 4, Quận Tân Bình, TP. HCM
              </p>
              <p>Mã số thuế: 0313883xxx do Sở Kế hoạch và Đầu tư TP.HCM cấp</p>
            </div>
            <div className="md:text-right flex flex-col justify-end italic">
              <p>© 2025 LiquidShop. All rights reserved.</p>
              <p className="text-red-500/50 font-medium">
                Designed by March7th
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

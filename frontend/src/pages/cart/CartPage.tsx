import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Trash2,
  Minus,
  Plus,
  ShoppingCart,
  ArrowLeft,
  CreditCard,
  ChevronRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { formatVND } from "@/utils/admin/formatMoney";

const CartPage: React.FC = () => {
  const navigate = useNavigate();

  // Dữ liệu mẫu (Mock data) để hiển thị giao diện
  const cartItems = [
    {
      _id: "1",
      name: "Sản phẩm Demo 1",
      price: 15000000,
      image: "https://via.placeholder.com/150",
      quantity: 1,
      stock: 5,
    },
    {
      _id: "2",
      name: "Sản phẩm Demo 2",
      price: 2500000,
      image: "https://via.placeholder.com/150",
      quantity: 2,
      stock: 10,
    },
  ];

  const subTotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const shippingFee = 0;
  const total = subTotal + shippingFee;

  return (
    <div className="bg-slate-50 min-h-screen py-8 font-sans">
      <div className="container mx-auto max-w-7xl px-4">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-muted-foreground space-x-2 mb-6">
          <span
            onClick={() => navigate("/")}
            className="hover:text-red-600 cursor-pointer"
          >
            Trang chủ
          </span>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground font-medium">Giỏ hàng của bạn</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* DANH SÁCH SẢN PHẨM */}
          <div className="lg:col-span-8 flex-1 space-y-4">
            <Card className="border-none shadow-sm">
              <CardHeader className="border-b bg-white">
                <CardTitle className="flex items-center gap-2 text-xl uppercase">
                  <ShoppingCart className="w-6 h-6 text-red-600" />
                  Giỏ hàng ({cartItems.length} sản phẩm)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 bg-white">
                {cartItems.length > 0 ? (
                  cartItems.map((item, index) => (
                    <div key={item._id}>
                      <div className="p-6 flex flex-col sm:flex-row items-center gap-6">
                        {/* Ảnh sản phẩm */}
                        <div className="w-24 h-24 bg-gray-50 rounded-lg overflow-hidden border shrink-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-contain"
                          />
                        </div>

                        {/* Thông tin */}
                        <div className="flex-1 space-y-1 text-center sm:text-left">
                          <h3 className="font-bold text-gray-900 hover:text-red-600 cursor-pointer line-clamp-2">
                            {item.name}
                          </h3>
                          <p className="text-red-600 font-bold text-lg">
                            {formatVND(item.price)}
                          </p>
                        </div>

                        {/* Bộ tăng giảm số lượng */}
                        <div className="flex items-center border rounded-md">
                          <button className="p-2 hover:bg-gray-100 disabled:opacity-30 cursor-pointer">
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="px-4 py-1 font-semibold border-x w-12 text-center">
                            {item.quantity}
                          </span>
                          <button className="p-2 hover:bg-gray-100 cursor-pointer">
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Xóa */}
                        <Button
                          variant="ghost"
                          className="text-gray-400 hover:text-red-600 cursor-pointer"
                        >
                          <Trash2 className="w-5 h-5" />
                        </Button>
                      </div>
                      {index < cartItems.length - 1 && <Separator />}
                    </div>
                  ))
                ) : (
                  <div className="p-12 text-center space-y-4">
                    <p className="text-muted-foreground">
                      Giỏ hàng của bạn đang trống
                    </p>
                    <Button
                      onClick={() => navigate("/")}
                      className="bg-red-600 cursor-pointer"
                    >
                      Tiếp tục mua sắm
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Button
              variant="outline"
              onClick={() => navigate("/")}
              className="group border-gray-300 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Tiếp tục mua sắm
            </Button>
          </div>

          {/* TÓM TẮT ĐƠN HÀNG */}
          <div className="lg:w-96">
            <Card className="sticky top-6 border-none shadow-md overflow-hidden">
              <div className="bg-red-600 p-4 text-white">
                <h3 className="font-bold uppercase flex items-center gap-2">
                  <CreditCard className="w-5 h-5" /> Thanh toán
                </h3>
              </div>
              <CardContent className="p-6 space-y-4 bg-white">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Tạm tính:</span>
                  <span className="font-semibold text-gray-900">
                    {formatVND(subTotal)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Phí vận chuyển:</span>
                  <span className="text-green-600 font-medium">Miễn phí</span>
                </div>

                <Separator />

                <div className="flex justify-between items-end">
                  <span className="text-gray-900 font-bold">Tổng cộng:</span>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-red-600">
                      {formatVND(total)}
                    </p>
                    <p className="text-xs text-gray-400">
                      (Đã bao gồm VAT nếu có)
                    </p>
                  </div>
                </div>

                <div className="pt-4 space-y-3">
                  <Button className="w-full h-12 bg-red-600 hover:bg-red-700 text-white font-bold text-lg shadow-lg uppercase cursor-pointer">
                    Tiến hành đặt hàng
                  </Button>
                  <p className="text-[11px] text-center text-gray-400 italic">
                    Bạn sẽ được kiểm tra hàng trước khi thanh toán
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Thông báo chính sách ngắn gọn */}
            <div className="mt-4 grid grid-cols-1 gap-2">
              <Badge
                variant="outline"
                className="py-2 justify-center border-dashed border-red-200 text-red-700 bg-red-50"
              >
                Đổi trả trong 7 ngày nếu có lỗi
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  CreditCard,
  Package,
  Loader2,
  Clock,
  CheckCircle2,
  XCircle,
  Truck,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { formatVND } from "@/utils/admin/formatMoney";
import { orderService } from "@/services/api/customer/order.service";
import CancelOrderDialog from "./CancelDialog";

const OrderDetailPage: React.FC = () => {
  const { code } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processingPayment, setProcessingPayment] = useState(false);

  useEffect(() => {
    if (!code) return;
    const fetchOrder = async () => {
      try {
        const res: any = await orderService.getOrderByCode(code);
        if (res?.order) setOrder(res.order);
      } catch (e) {
        navigate("/profile/orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [code]);

  const handleRepayment = async () => {
    if (!order) return;
    setProcessingPayment(true);
    try {
      const res: any = await orderService.createPaymentUrl({
        orderCode: order.orderCode,
        paymentMethod: order.paymentMethod,
        paymentProvider:
          order.paymentMethod === "OnlineGateway" ? "VNPAY" : undefined,
      });
      if (res?.paymentUrl) window.location.href = res.paymentUrl;
      else window.location.reload();
    } catch (e: any) {
      toast.error("Lỗi tạo thanh toán");
    } finally {
      setProcessingPayment(false);
    }
  };

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-transparent">
        <Loader2 className="animate-spin text-red-600 w-10 h-10" />
      </div>
    );
  if (!order) return null;

  const currentIdx = [
    "pending_confirmation",
    "processing",
    "shipping",
    "completed",
  ].indexOf(order.orderStatus);

  return (
    <div className="bg-transparent min-h-screen py-8">
      <div className="container mx-auto max-w-5xl px-4">
        <Button
          variant="ghost"
          onClick={() => navigate("/users/me#orders-history")}
          className="mb-6 pl-0 text-gray-300 hover:text-red-500 hover:bg-transparent rounded transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" /> QUAY LẠI DANH SÁCH
        </Button>

        <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-bold text-white uppercase tracking-tighter">
              Đơn hàng #{order.orderCode}
            </h1>
            <p className="text-gray-500 text-sm italic">
              Ngày đặt: {new Date(order.createdAt).toLocaleString("vi-VN")}
            </p>
          </div>
          <div className="flex gap-3">
            {order.paymentStatus === "pending" &&
              order.orderStatus !== "cancelled" &&
              order.paymentMethod !== "COD" && (
                <Button
                  onClick={handleRepayment}
                  disabled={processingPayment}
                  className="bg-red-600 hover:bg-red-700 font-bold rounded animate-pulse shadow-lg shadow-red-900/40"
                >
                  THANH TOÁN NGAY
                </Button>
              )}
            {order.orderStatus === "pending_confirmation" && (
              <CancelOrderDialog
                orderCode={order.orderCode}
                onSuccess={() => window.location.reload()}
              />
            )}
          </div>
        </div>

        {/* STATUS STEPS */}
        {order.orderStatus === "cancelled" ? (
          <div className="bg-red-600/10 p-5 rounded flex items-center gap-3 text-red-500 border border-red-600/20 mb-10 font-bold uppercase">
            <XCircle className="w-6 h-6" /> Đơn hàng này đã bị hủy
          </div>
        ) : (
          <div className="flex justify-between items-center mb-12 relative px-4 max-w-3xl mx-auto">
            <div className="absolute left-0 top-5 w-full h-[2px] bg-zinc-800 -z-10" />
            {[
              { k: "pending_confirmation", i: Clock, l: "Xác nhận" },
              { k: "processing", i: Package, l: "Xử lý" },
              { k: "shipping", i: Truck, l: "Đang giao" },
              { k: "completed", i: CheckCircle2, l: "Hoàn thành" },
            ].map((s, idx) => (
              <div key={s.k} className="flex flex-col items-center gap-3">
                <div
                  className={`w-10 h-10 rounded flex items-center justify-center border-2 transition-all ${
                    idx <= currentIdx
                      ? "bg-red-600 border-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.5)]"
                      : "bg-[#151517] border-zinc-800 text-zinc-700"
                  }`}
                >
                  <s.i className="w-5 h-5" />
                </div>
                <span
                  className={`text-[10px] font-bold uppercase tracking-widest ${
                    idx <= currentIdx ? "text-red-500" : "text-zinc-600"
                  }`}
                >
                  {s.l}
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-[#151517]/90 border-zinc-800 rounded backdrop-blur-md">
              <CardHeader className="border-b border-zinc-800 py-4">
                <CardTitle className="text-white text-sm uppercase font-bold">
                  Danh sách sản phẩm
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                {order.items.map((item: any, idx: number) => (
                  <div key={idx} className="flex gap-4 items-center">
                    <div className="w-16 h-16 bg-white rounded border border-zinc-800 shrink-0 p-2 flex items-center justify-center">
                      <img
                        src={item.image}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-200 line-clamp-1 text-sm">
                        {item.name}
                      </h4>
                      <p className="text-[10px] text-zinc-500 font-mono">
                        SKU: {item.sku}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-white text-sm">
                        {formatVND(item.price)}
                      </p>
                      <p className="text-xs text-red-500 font-bold">
                        x{item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-[#151517]/90 border-zinc-800 rounded backdrop-blur-md">
                <CardHeader className="border-b border-zinc-800 py-4">
                  <CardTitle className="text-white text-sm uppercase font-bold flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-red-500" /> Nhận hàng
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-5 text-sm space-y-2">
                  <p className="font-bold text-white">
                    {order.customerInfo.fullName}
                  </p>
                  <p className="text-gray-400">
                    {order.customerInfo.phoneNumber}
                  </p>
                  <p className="text-gray-400 text-xs italic leading-relaxed">
                    {order.customerInfo.shippingAddress.street},{" "}
                    {order.customerInfo.shippingAddress.ward},{" "}
                    {order.customerInfo.shippingAddress.district},{" "}
                    {order.customerInfo.shippingAddress.city}
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-[#151517]/90 border-zinc-800 rounded backdrop-blur-md">
                <CardHeader className="border-b border-zinc-800 py-4">
                  <CardTitle className="text-white text-sm uppercase font-bold flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-red-500" /> Thanh toán
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-5 text-sm space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Hình thức:</span>
                    <span className="text-white font-bold">
                      {order.paymentMethod}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Trạng thái:</span>
                    <Badge
                      className={`rounded font-bold text-[10px] ${
                        order.paymentStatus === "paid"
                          ? "bg-green-600"
                          : "bg-zinc-800 text-zinc-400"
                      }`}
                    >
                      {order.paymentStatus === "paid"
                        ? "ĐÃ THANH TOÁN"
                        : "CHỜ THANH TOÁN"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="lg:col-span-1">
            <Card className="bg-[#151517]/90 border-zinc-800 rounded sticky top-24 backdrop-blur-md overflow-hidden">
              <CardHeader className="bg-zinc-800 py-4">
                <CardTitle className="text-white text-xs uppercase font-bold tracking-widest text-center">
                  Tổng kết chi phí
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 italic">Tạm tính:</span>
                  <span className="text-white font-bold">
                    {formatVND(order.subtotal)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 italic">Phí giao hàng:</span>
                  <span className="text-white font-bold">
                    {formatVND(order.shippingFee)}
                  </span>
                </div>
                {order.discountAmount > 0 && (
                  <div className="flex justify-between text-sm text-green-500">
                    <span>Giảm giá:</span>
                    <span>- {formatVND(order.discountAmount)}</span>
                  </div>
                )}
                <Separator className="bg-zinc-800" />
                <div className="flex justify-between items-end pt-2">
                  <span className="font-bold text-white uppercase text-sm">
                    Tổng cộng:
                  </span>
                  <span className="font-bold text-2xl text-red-500">
                    {formatVND(order.totalAmount)}
                  </span>
                </div>
                {order.notes && (
                  <div className="mt-6 bg-zinc-900 border border-zinc-800 p-4 rounded text-xs text-gray-400 leading-relaxed italic">
                    <span className="font-bold text-red-500 not-italic block mb-1 underline">
                      Ghi chú:
                    </span>
                    {order.notes}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
export default OrderDetailPage;

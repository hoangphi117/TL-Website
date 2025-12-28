import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { CheckCircle, ShoppingBag, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatVND } from "@/utils/admin/formatMoney";
import { orderService } from "@/services/api/customer/order.service";

const OrderSuccessPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const orderCode = searchParams.get("code");
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderCode) {
      navigate("/");
      return;
    }
    const fetchOrder = async () => {
      try {
        const res: any = await orderService.getOrderByCode(orderCode);
        if (res?.order) setOrder(res.order);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderCode]);

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-transparent">
        <Loader2 className="animate-spin text-red-600 w-10 h-10" />
      </div>
    );

  return (
    <div className="min-h-screen bg-transparent flex flex-col items-center justify-center p-4">
      <div className="bg-[#151517]/95 border border-zinc-800 p-8 md:p-12 rounded shadow-2xl max-w-lg w-full text-center backdrop-blur-md animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-green-600/20 rounded flex items-center justify-center mx-auto mb-6 border border-green-600/30">
          <CheckCircle className="w-12 h-12 text-green-500" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2 uppercase tracking-tighter">
          Đặt hàng thành công!
        </h1>
        <p className="text-gray-400 mb-8">
          Đơn hàng <strong className="text-red-500">#{order?.orderCode}</strong>{" "}
          của bạn đã được tiếp nhận và đang xử lý.
        </p>

        <Card className="bg-zinc-900/50 border-zinc-800 border-dashed border-2 mb-10 rounded">
          <CardContent className="p-5 text-sm space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-300 italic">Thanh toán:</span>
              <span className="font-bold text-white">
                {order?.paymentMethod}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300 italic">Tổng tiền:</span>
              <span className="font-bold text-red-500 text-xl">
                {formatVND(order?.totalAmount)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300 italic">Giao đến:</span>
              <span className="text-gray-200 text-right w-1/2">
                {order?.customerInfo?.shippingAddress?.street},{" "}
                {order?.customerInfo?.shippingAddress?.district},{" "}
                {order?.customerInfo?.shippingAddress?.ward},{" "}
                {order?.customerInfo?.shippingAddress?.city}
              </span>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-4">
          <Button
            className="w-full bg-red-600 hover:bg-red-700 h-14 text-white font-bold rounded uppercase"
            onClick={() => navigate(`/orders/${order.orderCode}`)}
          >
            Chi tiết đơn hàng <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          <Button
            variant="outline"
            className="w-full h-14 border-zinc-800 text-gray-700 rounded font-bold uppercase"
            onClick={() => navigate("/")}
          >
            <ShoppingBag className="w-5 h-5 mr-2" /> Tiếp tục mua sắm
          </Button>
        </div>
      </div>
    </div>
  );
};
export default OrderSuccessPage;

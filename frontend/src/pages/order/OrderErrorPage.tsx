import React from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { XCircle, RefreshCcw, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const OrderErrorPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const orderCode = searchParams.get("code");

  return (
    <div className="min-h-screen bg-transparent flex flex-col items-center justify-center p-4">
      <div className="bg-[#151517]/95 p-8 md:p-12 rounded border border-zinc-800 shadow-2xl max-w-lg w-full text-center space-y-6 backdrop-blur-md animate-in fade-in zoom-in duration-500">
        {/* ICON LỖI */}
        <div className="w-20 h-20 bg-red-600/20 rounded flex items-center justify-center mx-auto mb-2 border border-red-600/30">
          <XCircle className="w-12 h-12 text-red-500" />
        </div>

        {/* THÔNG TIN LỖI */}
        <div className="space-y-3">
          <h1 className="text-3xl font-bold text-white uppercase tracking-tighter">
            Thanh toán thất bại
          </h1>
          {orderCode && (
            <p className="text-xs font-mono text-red-500/80 bg-red-500/10 inline-block px-3 py-1 rounded border border-red-500/20">
              Mã đơn: #{orderCode}
            </p>
          )}
          <p className="text-gray-400 text-sm leading-relaxed">
            Giao dịch của bạn đã bị hủy hoặc xảy ra lỗi kỹ thuật trong quá trình
            xử lý. Vui lòng kiểm tra lại số dư tài khoản hoặc thử phương thức
            thanh toán khác.
          </p>
        </div>

        {/* HÀNH ĐỘNG */}
        <div className="flex flex-col gap-3 pt-4">
          <Button
            className="w-full bg-red-600 hover:bg-red-700 h-14 text-white font-bold rounded uppercase shadow-lg shadow-red-900/20 transition-all active:scale-95"
            onClick={() =>
              orderCode
                ? navigate(`/orders/${orderCode}`)
                : navigate("/users/me#orders-history")
            }
          >
            <RefreshCcw className="w-5 h-5 mr-2" /> Thử thanh toán lại
          </Button>

          <Button
            variant="ghost"
            className="w-full h-14 text-gray-500 hover:text-white hover:bg-zinc-800 rounded font-bold uppercase transition-colors"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="w-5 h-5 mr-2" /> Về trang chủ
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderErrorPage;

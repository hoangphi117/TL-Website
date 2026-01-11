import { Truck, ShieldCheck, RotateCcw, Headset } from "lucide-react";

const policies = [
  {
    icon: Truck,
    title: "Vận chuyển miễn phí",
    desc: "Cho đơn hàng từ 500k",
  },
  {
    icon: ShieldCheck,
    title: "Bảo hành chính hãng",
    desc: "100% sản phẩm Apple, Dell...",
  },
  {
    icon: RotateCcw,
    title: "Đổi trả dễ dàng",
    desc: "1 đổi 1 trong 15 ngày",
  },
  {
    icon: Headset,
    title: "Hỗ trợ 24/7",
    desc: "Tư vấn kỹ thuật trọn đời",
  },
];

const ServicePolicy = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-[#151517]/80 backdrop-blur-md p-6 rounded border border-zinc-800 shadow-lg">
      {policies.map((item, index) => (
        <div
          key={index}
          className="flex flex-col md:flex-row items-center gap-4 p-3 rounded-lg border border-transparent hover:bg-white/5 hover:border-red-600/30 transition-all duration-300 group"
        >
          <div className="p-2 bg-red-600/10 rounded-full group-hover:bg-red-600/20 transition-colors">
            <item.icon className="w-6 h-6 text-red-500 group-hover:scale-110 transition-transform" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-gray-200 group-hover:text-white transition-colors">
              {item.title}
            </h4>
            <p className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors">
              {item.desc}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ServicePolicy;

import { OrdersTable } from "@/components/admin/orders/orders-table";
import orderApi from "@/services/api/admin/orderApi";
import type { OrderQuery } from "@/services/api/admin/query";
import type { IOrder } from "@/types/order";
import { Grid2X2 } from "lucide-react";
import { useEffect, useState } from "react"

export default function OrdersPage() {
  const [orders, setOrders] = useState<IOrder[]>([])
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const perPage = 5;
  const [totalOrders, setTotalOrders] = useState(0);
  const [detailedOrder, setDetailedOrder] = useState<IOrder | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const handleDetailOpen = (id: string) => {
    try {

    }
  }

  const loadOrders = async () => {
    try {
      const params: OrderQuery = {
        limit: perPage,
        page,
      }
      const res = await orderApi.getAll(params);
      setOrders(res.data.data);
      setTotalOrders(res.data.count);
      setTotalPages(res.data.totalPages);
    }catch(error){
      console.log(error);
    }finally{
      setIsLoading(false);
    }
  }

  useEffect(() => {
    try {
      const fetchData = async () => {
        await loadOrders();
      }
      fetchData()
    }catch(error){
      console.log(error);
    }
  },[page, search,])
  return (
     <div className="p-5">
      {isLoading && (
          <p className="text-gray-500 text-center text-md sm:text-lg">Đang tải dữ liệu...</p>
      )}
      <div className="flex flex-col bg-white shadow-sm gap-3 p-4">
          <div className="flex flex-col bg-white mt-4 px-8 gap-3 border-b border-gray-300 pb-3 pt-3">
              <p className="text-2xl lg:text-3xl font-bold">Quản lí đơn hàng</p>
              <p className="text-md md:text-lg text-gray-600">Theo dõi và xử lí đơn hàng</p>
          </div>
          <div className="border border-gray-200 p-3 shadow-lg rounded-lg">
              <p className="flex flex-row gap-2 items-center font-bold text-lg">
                  <Grid2X2 size={24} color="#3f6cf3"/>
                  Tổng đơn hàng: {totalOrders}
              </p>
              <OrdersTable
                  orders={orders}
                  setPage={setPage}
                  totalPages={totalPages}
                  page={page}
                  search={search}
                  setSearch={setSearch}
              />
          </div>
      </div>
        
    </div>
  )
}

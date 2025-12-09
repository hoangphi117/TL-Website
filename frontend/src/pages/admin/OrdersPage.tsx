import orderApi from "@/services/api/admin/orderApi";
import type { OrderQuery } from "@/services/api/admin/query";
import type { IOrder } from "@/types/order";
import { useEffect, useState } from "react"

export default function OrdersPage() {
  const [users, setUsers] = useState<IOrder[]>([])
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [totalUsers, setTotalUsers] = useState(0);
  const perPage = 5;

  const loadOrders = async () => {
    try {
      const params: OrderQuery = {
        limit: 25,
      }
      const res = await orderApi.getAll(params);
      console.log("check getAll: ", res.data.data);
    }catch(error){
      console.log(error);
    }
  }

  useEffect(() => {
    try {
      const fetchData = async () => {
        loadOrders();
      }
      fetchData()
    }catch(error){
      console.log(error);
    }
  },[])
  return (
    <div>
      
    </div>
  )
}

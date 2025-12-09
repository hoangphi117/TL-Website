import type { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { ArrowUpDown } from "lucide-react"
import type { IOrder } from "@/types/order"

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export function formatVND(amount: number) {
  return amount.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
}


export const columns: ColumnDef<IOrder>[] = [
  {
    accessorKey: "orderCode",
    header: "Mã đơn hàng",
    cell: ({row}) => (<div className="font-bold">{row.getValue("orderCode")}</div>)
  },
  {
    accessorKey: "customerInfo",
    header: "Khách hàng",
    cell: ({ row, table }) => (
        <button
            className="text-black hover:underline"
            onClick={() => table.options.meta?.onUserClick?.(row.original._id)}
        >
            {row.getValue("orderCode")}
        </button>
    ),
  },
  {
    accessorKey: "totalAmount",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="text-md sm:text-lg font-bold hover:bg-blue-200"
        >
          Tổng tiền
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => { 
        const amount = row.getValue("totalAmount") as number;
        return (
            <span className="text-green-600 text-md md:text-lg font-bold">{formatVND(amount)}</span>
        )
    }
  },
  {
    accessorKey: "orderStatus",
    header: ("Trạng thái đơn hàng"),
    cell: ({ row }) => ( <div> {row.getValue("orderStatus")}</div> )
  },
  {
    accessorKey: "paymentStatus",
    header: ("Thanh toán"),
    cell: ({ row }) => { 
      const paymentStatus = row.getValue("paymentStatus");
      return (
      <div className={
        `w-20 px-1 py-1 rounded-xl text-sm md:text-md text-white text-center ` + 
        (paymentStatus === "paid" ? "bg-green-500" : paymentStatus === "pending" ? "bg-yellow-500" : "bg-red-500" )
        }>
          {row.getValue("paymentStatus")}
      </div> 
      );
    }
  },
  {
    accessorKey: "createdAt",
    header: ("Ngày đặt"),
    cell: ({ row }) => {
        const dateStr = row.getValue("createdAt") as string
        const dateFormat = formatDate(dateStr);
        return (
            <div>{dateFormat}</div> 
        )
    }
  },
]
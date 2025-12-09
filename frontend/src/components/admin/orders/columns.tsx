import type { ColumnDef } from "@tanstack/react-table"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ArrowUpDown } from "lucide-react"
import type { IOrder } from "@/types/order"

export const columns: ColumnDef<IOrder>[] = [
  {
    accessorKey: "orderCode",
    header: "Mã đơn hàng",
    cell: ({row}) => (
        <Avatar>
            <AvatarImage src={row.getValue("orderCode")}/>
        </Avatar>
    ),
  },
  {
    accessorKey: "customerInfo.fullName",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="text-md sm:text-lg font-bold hover:bg-blue-200"
      >
        Khách hàng
        <ArrowUpDown />
      </Button>
    ),
    cell: ({ row, table }) => (
      <button
        className="text-black hover:underline"
        onClick={() => table.options.meta?.onUserClick?.(row.original._id)}
      >
        {row.getValue("customerInfo.fullName")}
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
    cell: ({ row }) => <div className="lowercase">{row.getValue("totalAmount")}</div>,
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
    cell: ({ row }) => ( <div> {row.getValue("createdAt")}</div> )
  },
]
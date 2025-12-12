import type { ColumnDef } from "@tanstack/react-table"
import type { IReview } from "@/types/review";
import { Star } from "lucide-react";

export const columns = (onOpenDetail: (review: IReview) => void): ColumnDef<IReview>[] => [
    {
        accessorKey: "productId",
        header: "Sản phẩm",
        cell: ({ row }) => {
            const product = row.original.productId;
            return (
                <div className="flex flex-col whitespace-normal max-w-[300px]">
                    <span className="font-medium block">{product.name}</span>
                    <img className="w-17 h-15" src={product?.images?.[0]} alt="product image" />
                </div>
            )
        }
    },
    {
        accessorKey: "userId",
        header: "Khách hàng",
        cell: ({ row }) => {
            const user = row.original.userId;
            return (
                <div className="flex flex-col">
                    <span className="font-medium">{user.fullName}</span>
                </div>
            )
        }
    },
    {
        accessorKey: "comment",
        header: "Bình luận",
        cell: ({ row }) => {
            const review = row.original;
            return (
                <div 
                    onClick={() => onOpenDetail(review)}
                    className="whitespace-normal max-w-[300px]"
                >
                    <span
                        className="
                            block
                            wrap-break-word 
                            line-clamp-3
                            font-bold
                            text-black
                            hover:underline
                            cursor-pointer"
                    >
                        {review.comment}
                    </span>
                </div>
            );
        },
    },
    {
        accessorKey: "rating",
        header: "Đánh giá",
        cell: ({ row }) => (<div className="flex flex-row gap-1 font-bold">{row.getValue("rating")} <Star fill="yellow" color="#deed0c"/> </div>)
    },
    {
        accessorKey: "status",
        header: "Trạng thái",
        cell: ({ row }) => { 
            const status = row.getValue("status") as string;
            return (
               <span
                    className={`px-2 py-1 rounded text-white font-semibold
                        ${
                        status === "approved"
                            ? "bg-green-500"
                            : status === "pending"
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }
                    `}
                    >
                    {status}
                </span>
            )
        }
    },
]
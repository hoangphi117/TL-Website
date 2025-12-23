import type { ColumnDef } from "@tanstack/react-table"
import { Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { IPromotion } from "@/types/promotion";
import { formatVND } from "@/utils/admin/formatMoney";

export const columns = (
    onOpenDetail: (promotion: IPromotion) => void,
    onDelete: (id: string) => void
): ColumnDef<IPromotion>[] => [
    {
        accessorKey: "code",
        header: "Mã",
        cell: ({ row }) => {
            const code = row.original.code
            const description = row.original.description

            return (
                <div className="flex flex-col whitespace-normal max-w-[250px]">
                    <span className="font-semibold">{code}</span>
                    <span className="text-sm text-muted-foreground">
                    {description}
                    </span>
                </div>
            )
        }
    },
    {
        accessorKey: "discountValue",
        header: "mức giảm giá",
        cell: ({ row }) => {
            const value = row.original.discountValue;
            const type = row.original.discountType;
            return (
                <div className="flex flex-row">
                    <span
                        className="text-md md:text-lg font-semibold text-red-500"
                    >
                        {type === "percentage" ? value + "%" : formatVND(value)}
                    </span>
                </div>
            )
        }
    },
    {
        accessorKey: "usageLimit",
        header: "Số lượng",
        cell: ({ row }) => ( <div className="text-green-500 text:md font-semibold">{row.getValue("usageLimit")}</div>)
    },
    {
        accessorKey: "isActive",
        header: "Trạng thái",
        cell: ({ row }) => {
            const isActive = row.getValue("isActive") as boolean;
            return (
                <div 
                    className={`text-sm md:text-md rounded-lg px-2 py-1 w-fit text-white
                        ${
                            isActive ? "bg-green-500" : "bg-yellow-500"
                        }    
                    `}
                >
                    {isActive ? "Hoạt động" : "Không hoạt động"}
                </div>
            )
        }
    },
    {
        id: "actions",
        header: "xóa",
        cell: ({ row }) => {
            const id = row.original._id;
            return (
            <Button
                className="text-red-500 p-0 rounded-lg bg-transparent hover:bg-zinc-200"
                size="icon"
                onClick={() => onDelete(id)}
            >
                <Trash strokeWidth={2.5} className="h-4 w-4 border-gray-200" />
            </Button>
            );
        },
    }
]
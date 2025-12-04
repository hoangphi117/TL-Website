"use client"

import * as React from "react"
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import type {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal, PenLineIcon, Trash2Icon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarImage } from "@/components/ui/avatar"

// mock data
export const data: User[] = [
  {
    _id: "u001",
    email: "nguyenvana@example.com",
    password: "",
    fullName: "Nguyễn Văn An",
    phoneNumber: "0901234567",
    avatarUrl: "https://i.pravatar.cc/150?img=11",
    addresses: [
      {
        street: "12 Nguyễn Trãi",
        ward: "Phường 3",
        district: "Quận 5",
        city: "TP. Hồ Chí Minh",
        isDefault: true
      }
    ],
    role: "customer",
    isActive: true,
    wishlist: [],
    passwordResetToken: "",
    passwordResetExpires: null,
    createdAt: new Date("2024-01-02"),
    updatedAt: new Date("2024-03-10")
  },
  {
    _id: "u002",
    email: "tranthib@example.com",
    password: "",
    fullName: "Trần Thị Bình",
    phoneNumber: "0912345678",
    avatarUrl: "https://i.pravatar.cc/150?img=12",
    addresses: [
      {
        street: "23 Lê Lợi",
        ward: "Phường 7",
        district: "Quận 1",
        city: "TP. Hồ Chí Minh",
        isDefault: true
      }
    ],
    role: "customer",
    isActive: false,
    wishlist: ["p001"],
    passwordResetToken: "",
    passwordResetExpires: null,
    createdAt: new Date("2024-02-12"),
    updatedAt: new Date("2024-03-01")
  },
  {
    _id: "u003",
    email: "leduchuy@example.com",
    password: "",
    fullName: "Lê Đức Huy",
    phoneNumber: "0987654321",
    avatarUrl: "https://i.pravatar.cc/150?img=13",
    addresses: [
      {
        street: "88 Phan Xích Long",
        ward: "Phường 2",
        district: "Quận Phú Nhuận",
        city: "TP. Hồ Chí Minh",
        isDefault: true
      }
    ],
    role: "admin",
    isActive: true,
    wishlist: [],
    passwordResetToken: "",
    passwordResetExpires: null,
    createdAt: new Date("2023-10-28"),
    updatedAt: new Date("2024-04-15")
  },
  {
    _id: "u004",
    email: "phamthutrang@example.com",
    password: "",
    fullName: "Phạm Thu Trang",
    phoneNumber: "0931122334",
    avatarUrl: "https://i.pravatar.cc/150?img=14",
    addresses: [
      {
        street: "21 Võ Văn Kiệt",
        ward: "Phường 6",
        district: "Quận 6",
        city: "TP. Hồ Chí Minh",
        isDefault: true
      }
    ],
    role: "customer",
    isActive: true,
    wishlist: ["p002", "p005"],
    passwordResetToken: "",
    passwordResetExpires: null,
    createdAt: new Date("2024-03-05"),
    updatedAt: new Date("2024-03-29")
  },
  {
    _id: "u005",
    email: "dangquangminh@example.com",
    password: "",
    fullName: "Đặng Quang Minh",
    phoneNumber: "0367788991",
    avatarUrl: "https://i.pravatar.cc/150?img=15",
    addresses: [
      {
        street: "91 Trần Hưng Đạo",
        ward: "Phường 10",
        district: "Quận 5",
        city: "TP. Hồ Chí Minh",
        isDefault: true
      }
    ],
    role: "customer",
    isActive: false,
    wishlist: [],
    passwordResetToken: "",
    passwordResetExpires: null,
    createdAt: new Date("2023-11-09"),
    updatedAt: new Date("2024-01-14")
  },
  {
    _id: "u006",
    email: "phanthanhkhoa@example.com",
    password: "",
    fullName: "Phan Thành Khoa",
    phoneNumber: "0905566778",
    avatarUrl: "https://i.pravatar.cc/150?img=16",
    addresses: [
      {
        street: "10 Nguyễn Huệ",
        ward: "Bến Nghé",
        district: "Quận 1",
        city: "TP. Hồ Chí Minh",
        isDefault: true
      }
    ],
    role: "customer",
    isActive: true,
    wishlist: ["p010"],
    passwordResetToken: "",
    passwordResetExpires: null,
    createdAt: new Date("2023-12-01"),
    updatedAt: new Date("2024-04-02")
  },
  {
    _id: "u007",
    email: "vominhquan@example.com",
    password: "",
    fullName: "Võ Minh Quân",
    phoneNumber: "0942233445",
    avatarUrl: "https://i.pravatar.cc/150?img=17",
    addresses: [
      {
        street: "17 Lý Thường Kiệt",
        ward: "Phường 9",
        district: "Quận Tân Bình",
        city: "TP. Hồ Chí Minh",
        isDefault: true
      }
    ],
    role: "customer",
    isActive: true,
    wishlist: ["p003"],
    passwordResetToken: "",
    passwordResetExpires: null,
    createdAt: new Date("2024-02-10"),
    updatedAt: new Date("2024-05-12")
  },
  {
    _id: "u008",
    email: "nguyenngocanh@example.com",
    password: "",
    fullName: "Nguyễn Ngọc Ánh",
    phoneNumber: "0971239876",
    avatarUrl: "https://i.pravatar.cc/150?img=18",
    addresses: [
      {
        street: "102 Cách Mạng Tháng Tám",
        ward: "Phường 11",
        district: "Quận 3",
        city: "TP. Hồ Chí Minh",
        isDefault: true
      }
    ],
    role: "customer",
    isActive: false,
    wishlist: [],
    passwordResetToken: "",
    passwordResetExpires: null,
    createdAt: new Date("2023-09-10"),
    updatedAt: new Date("2024-01-03")
  },
  {
    _id: "u009",
    email: "lethithanh@example.com",
    password: "",
    fullName: "Lê Thị Thanh",
    phoneNumber: "0883344556",
    avatarUrl: "https://i.pravatar.cc/150?img=19",
    addresses: [
      {
        street: "55 Nguyễn Văn Linh",
        ward: "Hòa Thuận",
        district: "Hải Châu",
        city: "Đà Nẵng",
        isDefault: true
      }
    ],
    role: "customer",
    isActive: true,
    wishlist: ["p021"],
    passwordResetToken: "",
    passwordResetExpires: null,
    createdAt: new Date("2024-01-18"),
    updatedAt: new Date("2024-02-12")
  },
  {
    _id: "u010",
    email: "phamquocdung@example.com",
    password: "",
    fullName: "Phạm Quốc Dũng",
    phoneNumber: "0935566442",
    avatarUrl: "https://i.pravatar.cc/150?img=20",
    addresses: [
      {
        street: "78 Hoàng Hoa Thám",
        ward: "Phường 5",
        district: "Bình Thạnh",
        city: "TP. Hồ Chí Minh",
        isDefault: true
      }
    ],
    role: "admin",
    isActive: true,
    wishlist: [],
    passwordResetToken: "",
    passwordResetExpires: null,
    createdAt: new Date("2022-08-03"),
    updatedAt: new Date("2024-05-10")
  }
];


export type User = {
  _id: string
  email: string
  password: string
  fullName: string
  phoneNumber: string
  avatarUrl: string

  addresses: {
    street: string
    ward: string
    district: string
    city: string
    isDefault: boolean
  }[]

  role: "customer" | "admin"
  isActive: boolean

  wishlist: string[]   // danh sách productId

  passwordResetToken?: string | null
  passwordResetExpires?: Date | null

  createdAt: Date
  updatedAt: Date
}


export const columns: ColumnDef<User>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="border-gray-400"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="border-gray-400"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "avatarUrl",
    header: "Avatar",
    cell: ({row}) => (
        <Avatar>
            <AvatarImage src={row.getValue("avatarUrl")}/>
        </Avatar>
    ),
  },
  {
    accessorKey: "fullName",
    header: ({column}) => {
        return (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                className="text-md sm:tex-lg font-bold hover:bg-blue-200"
            >
                Name
                <ArrowUpDown />
            </Button>
        )
    }
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="text-md sm:text-lg font-bold hover:bg-blue-200"
        >
          Email
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
  },
  {
    accessorKey: "phoneNumber",
    header: ("Phone"),
    cell: ({ row }) => ( <div>{row.getValue("phoneNumber")}</div> )
  },
  {
    id: "actions",
    enableHiding: false,
    cell: () => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem > <PenLineIcon />Edit</DropdownMenuItem>
            <DropdownMenuItem 
                className="bg-red-500 text-white focus:bg-red-600 focus:text-white"
            >
                <Trash2Icon color="white"/>
                Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export function DataTableDemo() {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter emails..."
          value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("email")?.setFilterValue(event.target.value)
          }
          className="max-w-sm bg-white"
        />  
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="overflow-hidden rounded-md border bg-white">
        <Table>
          <TableHeader className="bg-blue-100">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="text-md sm:text-lg font-bold">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="text-md sm:text-lg"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-muted-foreground flex-1 text-sm sm:text-lg">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}

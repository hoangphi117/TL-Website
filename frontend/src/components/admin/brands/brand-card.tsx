import { Edit, Trash, MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { IBrand } from "@/types/brand"

interface BrandCardProps {
  brand: IBrand
  onEdit: (brand: IBrand) => void
  onDelete: (brand: IBrand) => void
}

export default function BrandCard({ brand, onEdit, onDelete }: BrandCardProps) {
  return (
    <div
      className="
        group relative
        bg-white/50 backdrop-blur-sm
        rounded-lg
        border border-border/40
        shadow-[0_2px_8px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.02)]
        transition-all duration-300 ease-out
        overflow-hidden
        cursor-pointer
        hover:shadow-[0_8px_24px_rgba(0,0,0,0.08),0_2px_4px_rgba(0,0,0,0.04)]
        hover:border-border/60
      "
    >
      <div className="relative w-full h-40 bg-gradient-to-br from-muted/30 via-muted/10 to-transparent overflow-hidden">
        <img
          src={brand.logoUrl || "https://placehold.co/200x200?text=No+Logo"}
          alt={brand.name}
          className="
            w-full h-full object-contain
            p-6
            transition-all duration-500 ease-out
          "
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content Area */}
      <div className="p-2 flex flex-col gap-4">
        <div className="flex items-center justify-center min-h-[3rem]">
          <h4 className="font-semibold text-base md:text-lg text-foreground text-center line-clamp-2 leading-tight tracking-tight">
            {brand.name}
          </h4>
        </div>

        <div className="hidden md:flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 -mt-2">
          <Button
            size="sm"
            variant="outline"
            className="h-9 px-4 bg-white/80 backdrop-blur-sm hover:bg-primary hover:text-primary-foreground hover:border-primary border-border/60 transition-all duration-200 shadow-sm hover:shadow-md"
            onClick={(e) => {
              e.stopPropagation()
              onEdit(brand)
            }}
          >
            <Edit className="h-3.5 w-3.5 mr-1.5" />
            <span className="text-xs font-medium">Sửa</span>
          </Button>

          <Button
            size="sm"
            variant="outline"
            className="h-9 px-4 bg-white/80 backdrop-blur-sm hover:bg-destructive hover:text-primary-foreground hover:border-destructive border-border/60 transition-all duration-200 shadow-sm hover:shadow-md"
            onClick={(e) => {
              e.stopPropagation()
              onDelete(brand)
            }}
          >
            <Trash className="h-3.5 w-3.5 mr-1.5" />
            <span className="text-xs font-medium">Xóa</span>
          </Button>
        </div>
      </div>

      {/* Subtle corner accent that appears on hover */}
      <div className="hidden md:block absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-primary/5 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Menu for mobile */}
      <div className="absolute top-2 right-2 z-10 md:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-white/50 backdrop-blur-sm">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(brand)}>
              <Edit className="mr-2 h-4 w-4" />
              <span>Sửa</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive" onClick={() => onDelete(brand)}>
              <Trash className="mr-2 h-4 w-4" />
              <span>Xóa</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

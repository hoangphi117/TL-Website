import { Edit, Trash, MoreVertical, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { ICategory } from "@/types/category"


interface CategoryCardProps {
  category: ICategory
  onEdit: (category: ICategory) => void
  onDelete: (category: ICategory) => void
}

export default function CategoryCard({ category, onEdit, onDelete }: CategoryCardProps) {
  return (
    <div
      className="
        group relative
        bg-white/40 backdrop-blur-md
        rounded-2xl
        border border-white/20
        shadow-[0_4px_20px_rgba(0,0,0,0.03)]
        transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]
        overflow-hidden
        hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)]
        hover:border-white/40
      "
    >
      {/* Image Container with sophisticated presentation */}
      <div className="relative aspect-square overflow-hidden bg-muted/20">
        {category.imageUrl ? (
          <img
            src={category.imageUrl || "/placeholder.svg"}
            alt={category.name}
            className="
              w-full h-full object-cover
              transition-transform duration-700 ease-out
            "
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground/30">
            <ImageIcon size={48} strokeWidth={1} />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      <div className="p-4 flex items-center justify-between bg-zinc-100 gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-[15px] text-foreground tracking-tight leading-snug truncate group-hover:text-primary transition-colors duration-300">
            {category.name}
          </h3>
        </div>

        {/* <div className="hidden md:flex items-center gap-1.5">
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 rounded-full hover:bg-white hover:shadow-sm hover:text-primary transition-all duration-300"
            onClick={(e) => {
              e.stopPropagation()
              onEdit(category)
            }}
          >
            <Edit className="h-3.5 w-3.5" />
          </Button>

          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 rounded-full hover:bg-destructive/10 hover:text-destructive transition-all duration-300"
            onClick={(e) => {
              e.stopPropagation()
              onDelete(category)
            }}
          >
            <Trash className="h-3.5 w-3.5" />
          </Button>
        </div> */}
      </div>

      {/* Mobile Action Menu */}
      <div className="absolute top-3 right-3 z-10 ">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm shadow-sm">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="rounded-xl border-white/20 backdrop-blur-lg">
            <DropdownMenuItem onClick={() => onEdit(category)} className="text-sm font-medium">
              <Edit className="mr-2 h-4 w-4" />
              <span>Chỉnh sửa</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive text-sm font-medium" onClick={() => onDelete(category)}>
              <Trash className="mr-2 h-4 w-4" />
              <span>Xóa danh mục</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Decorative accent for premium feel */}
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
    </div>
  )
}

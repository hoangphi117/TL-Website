import { Edit, Trash, } from "lucide-react";
import type { ICategory } from "@/types/category";

interface CategoryCardProps {
  category: ICategory;
  handleEdit: (category : ICategory) => void;
  onAskDelete: (category: ICategory) => void;
}

export default function CategoryCard({ category, handleEdit, onAskDelete}: CategoryCardProps) {

  return (
    <div
      className="bg-white h-45 rounded-lg shadow-sm border transition cursor-pointer"
    >
      <img
        src={category.imageUrl || "https://placehold.co/200x200?text=No+Image"}
        alt={category.name}
        className="w-full h-25 object-cover rounded-t-lg"
      />

      <div className="p-2 flex flex-col justify- gap-1 items-center">
        <h3 className="font-medium text-sm md:text-base ">{category.name}</h3>

        <div className="flex">
          <button 
            className="p-2 rounded-full hover:bg-gray-100"
            onClick={() => handleEdit(category)}
          >
            <Edit size={18} />
          </button>

          <button 
            className="p-2 rounded-full hover:bg-red-100 text-red-500"
            onClick={() => onAskDelete(category)}
          >
            <Trash size={18}/>
          </button>

        </div>
      </div>
    </div>
  );
}

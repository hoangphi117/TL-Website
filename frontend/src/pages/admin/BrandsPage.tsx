import BrandCard from "@/components/admin/brands/brand-card";
import type{ IBrand } from "@/types/brand";
import { useEffect, useState } from "react";
import brandApi from "@/services/api/admin/brandApi";

export default function BrandsPage() {
    const [brands, setBrands] = useState<IBrand[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [openEdit, setOpenEdit] = useState(false);
    const [selectedBrand, setSelectedBrand] = useState<IBrand | null>(null);

    const [deleteTarget, setDeleteTarget] = useState<IBrand | null>(null);
    const [openDelete, setOpenDelete] = useState(false);

     const handleEdit = (brand: IBrand) => {
        console.log("Edit brand:", brand)
        // mở dialog edit, set selectedBrand,...
    }

    const loadbrands = async () => {
        try {
            const res = await brandApi.getAll();
            setBrands(res.data);
        }
        catch(error){
            console.log(error);
        }
        finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        try {
            const fetchData = async () => {
                await loadbrands();
            }
            fetchData();
        }catch(error){
            console.log(error);
        }
    })

  return (
    <div className="p-4">
            {isLoading && (
                <p className="text-gray-500 text-center text-md sm:text-lg">Đang tải dữ liệu...</p>
            )}
    
            {!isLoading && brands.length === 0 && (
                <p className="text-gray-500 text-center text-md sm:text-lg">Chưa có dữ liệu</p>
            )}
    
            {!isLoading && brands.length > 0 && (
                <div className="flex flex-col gap-3">
                    <p className="text-xl lg:text-2xl font-bold text-gray-600">Danh sách các loại sản phẩm</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:px-4 xl:px-10 gap-5 mt-4"  >
                        {brands.map((b) =>(
                            <BrandCard 
                                key={b._id} 
                                brand={b} 
                                onEdit={handleEdit}
                                onDelete={(brand) => {
                                    setDeleteTarget(brand);
                                    setOpenDelete(true);
                                }}
                            />
                        ))}
                    </div>
                    {/* <EditCategoryDialog
                        open={openEdit}
                        setOpen={setOpenEdit}
                        category={selectedCategory}
                        onSave={handleOnSave}
                    />
                    <DeleteCategoryAlert
                        open={openDelete}
                        setOpen={setOpenDelete}
                        categoryName={deleteTarget?.name}
                        onConfirm={confirmDelete}
                    /> */}
                </div>  
            )}
        </div>
  )
}

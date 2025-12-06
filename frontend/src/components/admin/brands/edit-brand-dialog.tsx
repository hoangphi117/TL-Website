import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useEffect, useState } from "react"
import type { IBrand } from "@/types/brand"

interface EditbrandDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  brand: IBrand | null;
  onSave: (updated: IBrand) => void;
}


export function EditBrandDialog({open, setOpen, brand, onSave} : EditbrandDialogProps){
    const [name, setName] = useState(brand?.name || "");
    const [logoUrl, setImageUrl] = useState(brand?.logoUrl || "");
    const [description, setDescription] = useState(brand?.description || "");

    const handleSave = () => {
        if (!brand) return

        onSave({
            ...brand,
            name,
            logoUrl,
            description,
        })
        setOpen(false)
    }

    useEffect(() => {
        if (brand && open) {
            setName(brand.name);
            setImageUrl(brand.logoUrl || "");
        }
    }, [brand, open]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="w-full max-w-100 sm:max-w-130 md:max-w-150">
                <DialogHeader>
                    <DialogDescription className="sr-only">
                        edit brand
                    </DialogDescription>
                    <DialogTitle>{name}</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label className="text-md md:text-lg">Tên loại</Label>
                        <Input 
                            className="text-md md:text-lg" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-md md:text-lg">Ảnh hiển thị</Label>
                        <Input 
                            className="text-md md:text-lg"
                            value={logoUrl}
                            onChange={(e) => setImageUrl(e.target.value)} 
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-md md:text-lg">Mô tả</Label>
                        <Input 
                            className="text-md md:text-lg"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)} 
                        />
                    </div>

                </div>

                <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>
                    Hủy
                </Button>
                <Button onClick={() => handleSave()} className="">Lưu thay đổi</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
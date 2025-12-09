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


export function EditBrandDialog({ open, setOpen, brand, onSave }: EditbrandDialogProps) {
  const [name, setName] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [description, setDescription] = useState("");

  const isEdit = !!brand; 

  const handleSave = () => {
    const updated: IBrand = {
      name,
      logoUrl,
      description,
    };

    onSave(updated);
    setOpen(false);
  };

  useEffect(() => {
    if (brand && open) {
      setName(brand.name);
      setLogoUrl(brand.logoUrl || "");
      setDescription(brand.description || "");
    } else if (open) {
      setName("");
      setLogoUrl("");
      setDescription("");
    }
  }, [brand, open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-full max-w-100 sm:max-w-130 md:max-w-150">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? `Sửa thương hiệu: ${brand?.name}` : "Thêm thương hiệu mới"}
          </DialogTitle>
          <DialogDescription className="sr-only">
            Brand form
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Tên thương hiệu</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label>Logo URL</Label>
            <Input value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label>Mô tả</Label>
            <Input value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Hủy
          </Button>
          <Button onClick={handleSave}>
            {isEdit ? "Lưu thay đổi" : "Thêm mới"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

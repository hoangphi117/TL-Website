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
import { CircleX } from "lucide-react"
import { toast } from "sonner"

interface EditbrandDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  brand: IBrand | null;
  onSave: (updated: IBrand) => void;
  formError: string | undefined;
  formSuccess: string | undefined;
}


export function EditBrandDialog({ open, setOpen, brand, onSave, formError, formSuccess }: EditbrandDialogProps) {
  const [name, setName] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [description, setDescription] = useState("");

  const isEdit = !!brand; 

  const handleSave = () => {
    const updated: IBrand = {
      _id: brand?._id || "", 
      name,
      logoUrl,
      description,
    };

    onSave(updated);
  };

  useEffect(() => {
    if (brand && open) {
      // EDIT MODE
      setName(brand.name);
      setLogoUrl(brand.logoUrl || "");
      setDescription(brand.description || "");
    } else if (open) {
      // ADD MODE – reset form
      setName("");
      setLogoUrl("");
      setDescription("");
    }
  }, [brand, open]);

  useEffect(() => {
    if(formSuccess) {
      toast.success("Thêm thương hiệu mới thành công");
    }
  }, [formSuccess])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-full max-w-100 sm:max-w-130 md:max-w-150">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? `${brand?.name}` : "Thêm thương hiệu mới"}
          </DialogTitle>
          <DialogDescription className="sr-only">
            Brand form
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Tên thương hiệu</Label>
            <Input 
              className="rounded-xs"
              value={name} 
              onChange={(e) => setName(e.target.value)} />
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

        {formError && (
          <div className="flex flex-row gap-2 items-center">
          <CircleX color="#f00a0a" strokeWidth={2.5} />
          <span className="text-sm md:text-base text-red-500">{formError}</span>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Hủy
          </Button>
          <Button 
            className="bg-blue-500 hover:bg-blue-600 text-white"
            onClick={handleSave}
          >
            {isEdit ? "Cập nhật" : "Thêm mới"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface DeleteCategoryAlertProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  categoryName?: string;
  onConfirm: () => void;
}

export function DeleteCategoryAlert({ open, setOpen, categoryName, onConfirm }: DeleteCategoryAlertProps) {
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="w-[90%] p-6 max-w-sm">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-sm md:text-[1.2rem]">Bạn có chắc muốn xóa {categoryName}?</AlertDialogTitle>
          <AlertDialogDescription className="text-sm">
            Hành động này không thể hoàn tác.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel className="text-sm md:text-base">Hủy</AlertDialogCancel>

          <AlertDialogAction
            className="bg-red-500 hover:bg-red-600 text-sm md:text-base"
            onClick={onConfirm}
          >
            Xóa
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

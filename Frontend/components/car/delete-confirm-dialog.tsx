"use client"

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

interface DeleteConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (id: number) => void
  carId?: number
  carName?: string
}

export default function DeleteConfirmDialog({ isOpen, onClose, onConfirm, carId,carName }: DeleteConfirmDialogProps) {
  console.log(carName);
  console.log(carId);
  
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="bg-popover border-border">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-popover-foreground">Xác nhận xóa tin đăng</AlertDialogTitle>
          <AlertDialogDescription className="text-muted-foreground">
            Bạn có chắc chắn muốn xóa tin đăng {carName}? Hành động này không thể hoàn tác.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Hủy</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => onConfirm?.(Number(carId))}
            className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
          >
            Xóa tin đăng
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Edit } from "lucide-react"
import CarEditForm from "./car-edit-form"
import { CarDTO } from "@/types/car"

interface CarEditDialogProps {
    car: CarDTO
    triggerText?: string
    triggerVariant?: "default" | "outline" | "ghost" | "destructive" | "secondary"
    onRefresh? : (id:number) => void
}

export default function CarEditDialog({
    car,
    triggerText = "Chỉnh sửa",
    triggerVariant = "outline",
    onRefresh
}: CarEditDialogProps) {
    const [open, setOpen] = useState(false)

    const handleCancel = () => {
        setOpen(false) // Close dialog on cancel
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant={triggerVariant} className="flex items-center gap-2">
                    <Edit className="h-4 w-4" />
                    {triggerText}
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Edit className="h-5 w-5" />
                        Chỉnh sửa thông tin xe
                    </DialogTitle>
                </DialogHeader>
                <CarEditForm car={car} onCancel={handleCancel} onRefresh={onRefresh} />
            </DialogContent>
        </Dialog>
    )
}

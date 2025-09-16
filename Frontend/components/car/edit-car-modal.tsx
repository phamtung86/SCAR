"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CarDTO } from "@/types/car"


interface EditCarModalProps {
  isOpen: boolean
  onClose: () => void
  carData?: CarDTO
  onSave: (data: Partial<CarDTO>) => void
}

export default function EditCarModal({ isOpen, onClose, carData, onSave }: EditCarModalProps) {
  const [formData, setFormData] = useState<CarDTO | undefined>()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto bg-popover border-border">
        <DialogHeader>
          <DialogTitle className="text-popover-foreground">Chỉnh sửa thông tin xe</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-popover-foreground">
              Tên xe
            </Label>
            <Input
              id="name"
              value={formData?.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="bg-input border-border text-foreground"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price" className="text-popover-foreground">
                Giá bán (VND)
              </Label>
              <Input
                id="price"
                value={formData?.price}
                onChange={(e) => handleChange("price", e.target.value)}
                className="bg-input border-border text-foreground"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="originalPrice" className="text-popover-foreground">
                Giá gốc (VND)
              </Label>
              <Input
                id="originalPrice"
                value={formData?.originalPrice}
                onChange={(e) => handleChange("originalPrice", e.target.value)}
                className="bg-input border-border text-foreground"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location" className="text-popover-foreground">
              Địa điểm
            </Label>
            <Select value={formData?.location} onValueChange={(value) => handleChange("location", value)}>
              <SelectTrigger className="bg-input border-border text-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Hà Nội">Hà Nội</SelectItem>
                <SelectItem value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</SelectItem>
                <SelectItem value="Đà Nẵng">Đà Nẵng</SelectItem>
                <SelectItem value="Hải Phòng">Hải Phòng</SelectItem>
                <SelectItem value="Cần Thơ">Cần Thơ</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="year" className="text-popover-foreground">
                Năm sản xuất
              </Label>
              <Input
                id="year"
                value={formData?.year}
                onChange={(e) => handleChange("year", e.target.value)}
                className="bg-input border-border text-foreground"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mileage" className="text-popover-foreground">
                Số km đã đi
              </Label>
              <Input
                id="mileage"
                value={formData?.mileage}
                onChange={(e) => handleChange("mileage", e.target.value)}
                className="bg-input border-border text-foreground"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="transmission" className="text-popover-foreground">
              Hộp số
            </Label>
            <Select value={formData?.transmission} onValueChange={(value) => handleChange("transmission", value)}>
              <SelectTrigger className="bg-input border-border text-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Tự động">Tự động</SelectItem>
                <SelectItem value="Số sàn">Số sàn</SelectItem>
                <SelectItem value="Bán tự động">Bán tự động</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Hủy
            </Button>
            <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground">
              Lưu thay đổi
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

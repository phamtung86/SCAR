"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface PriceOfferModalProps {
  isOpen: boolean
  onClose: () => void
  originalPrice: string
  onSubmit: (offerPrice: string, message: string) => void
}

export function PriceOfferModal({ isOpen, onClose, originalPrice, onSubmit }: PriceOfferModalProps) {
  const [offerPrice, setOfferPrice] = useState("")
  const [message, setMessage] = useState("")

  const handleSubmit = () => {
    if (offerPrice && message) {
      onSubmit(offerPrice, message)
      setOfferPrice("")
      setMessage("")
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Đề xuất giá mua</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Giá hiện tại</Label>
            <Input value={originalPrice} disabled />
          </div>

          <div>
            <Label>Giá đề xuất</Label>
            <Input
              placeholder="Nhập giá bạn muốn mua"
              value={offerPrice}
              onChange={(e) => setOfferPrice(e.target.value)}
            />
          </div>

          <div>
            <Label>Lời nhắn</Label>
            <Textarea
              placeholder="Thêm lời nhắn cho người bán..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Hủy
            </Button>
            <Button onClick={handleSubmit} className="flex-1">
              Gửi đề xuất
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

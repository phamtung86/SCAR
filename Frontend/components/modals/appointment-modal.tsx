"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Calendar, Clock } from "lucide-react"

interface AppointmentModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (date: string, time: string, note: string) => void
}

export function AppointmentModal({ isOpen, onClose, onSubmit }: AppointmentModalProps) {
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [note, setNote] = useState("")

  const handleSubmit = () => {
    if (date && time) {
      onSubmit(date, time, note)
      setDate("")
      setTime("")
      setNote("")
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Đặt lịch xem xe</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Ngày xem xe
            </Label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
            />
          </div>

          <div>
            <Label className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Giờ xem xe
            </Label>
            <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
          </div>

          <div>
            <Label>Ghi chú</Label>
            <Textarea
              placeholder="Thêm ghi chú về cuộc hẹn..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Hủy
            </Button>
            <Button onClick={handleSubmit} className="flex-1">
              Đặt lịch
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

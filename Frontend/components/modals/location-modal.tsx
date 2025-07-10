"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MapPin, Navigation } from "lucide-react"

interface LocationModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (address: string, latitude?: number, longitude?: number) => void
}

export function LocationModal({ isOpen, onClose, onSubmit }: LocationModalProps) {
  const [address, setAddress] = useState("")
  const [isGettingLocation, setIsGettingLocation] = useState(false)

  const getCurrentLocation = () => {
    setIsGettingLocation(true)

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          // In a real app, you would reverse geocode to get the address
          setAddress(`Vị trí hiện tại (${latitude.toFixed(6)}, ${longitude.toFixed(6)})`)
          setIsGettingLocation(false)
        },
        (error) => {
          console.error("Error getting location:", error)
          setIsGettingLocation(false)
        },
      )
    }
  }

  const handleSubmit = () => {
    if (address) {
      onSubmit(address)
      setAddress("")
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Chia sẻ vị trí</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Địa chỉ</Label>
            <Input placeholder="Nhập địa chỉ cụ thể..." value={address} onChange={(e) => setAddress(e.target.value)} />
          </div>

          <Button variant="outline" onClick={getCurrentLocation} disabled={isGettingLocation} className="w-full">
            <Navigation className="w-4 h-4 mr-2" />
            {isGettingLocation ? "Đang lấy vị trí..." : "Sử dụng vị trí hiện tại"}
          </Button>

          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Hủy
            </Button>
            <Button onClick={handleSubmit} className="flex-1">
              <MapPin className="w-4 h-4 mr-2" />
              Chia sẻ
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, Shield, Calendar, Phone, Mail, Flag } from "lucide-react"
import type { ChatUser } from "../../types/chat"

interface UserProfileModalProps {
  isOpen: boolean
  onClose: () => void
  user: ChatUser | null
}

export function UserProfileModal({ isOpen, onClose, user }: UserProfileModalProps) {
  if (!user) return null
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Thông tin người dùng</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src={user?.sender?.profilePicture || "/placeholder.svg"} alt={user?.sender?.firstName?.charAt(0)} />
              <AvatarFallback>{user?.sender?.firstName?.charAt(0)}</AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">{user?.sender?.fullName}</h3>
                {user?.sender?.isVerified && <Shield className="w-4 h-4 text-blue-500" />} 
              </div>

              <div className="flex items-center gap-1 mt-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm">{user?.sender?.rating}</span>
                {/* <span className="text-sm text-muted-foreground">({user?.sender?.totalReviews} đánh giá)</span> */}
              </div>

              <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                <Calendar className="w-3 h-3" />
                <span>Tham gia từ {new Date(user?.sender?.createdAt).toLocaleDateString("vi-VN")}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Phone className="w-4 h-4" />
              <span>{user?.sender?.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Mail className="w-4 h-4" />
              <span>{user?.sender?.email}</span>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" className="flex-1">
              <Phone className="w-4 h-4 mr-2" />
              Gọi điện
            </Button>
            <Button variant="outline" className="flex-1">
              <Flag className="w-4 h-4 mr-2" />
              Báo cáo
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

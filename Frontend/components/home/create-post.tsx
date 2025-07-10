"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { getCurrentUser } from "@/lib/utils/get-current-user"
import { Car, ImageIcon, MapPin, Smile, Users, Video } from "lucide-react"
import { useState } from "react"
import CarSellingForm from "../car/car-selling-form"
import { useRouter } from "next/navigation"


export function CreatePost() {
  const [isCarSellModalOpen, setIsCarSellModalOpen] = useState(false)
  const route = useRouter()
  const handleCarSellClick = () => {
    if (user) {
      setIsCarSellModalOpen(true)

    } else {
      route.push('/auth')
    }
  }

  const handleCloseModal = () => {
    setIsCarSellModalOpen(false)
  }

  const user = getCurrentUser();

  const handleCheckAuth = () => {
    if (!user) {
      route.push('/auth')
    }
  }


  return (
    <>
      <Card className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50 shadow-lg">
        <CardContent className="p-6">
          <div className="flex space-x-4">
            <Avatar className="ring-2 ring-blue-500/20">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">U</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Textarea
                placeholder="Bạn đang nghĩ gì về xe hơi? Chia sẻ kinh nghiệm, hình ảnh xe của bạn..."
                className="border-none resize-none focus:ring-0 text-lg bg-gray-50 dark:bg-gray-800/50 rounded-xl min-h-[100px]"
                rows={3}
              />

              <div className="flex items-center justify-between mt-4">
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600"
                    onClick={handleCheckAuth}
                  >
                    <ImageIcon className="mr-2 h-4 w-4" />
                    Ảnh
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hover:bg-green-50 dark:hover:bg-green-900/20 text-green-600"
                    onClick={handleCheckAuth}
                  >
                    <Video className="mr-2 h-4 w-4" />
                    Video
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hover:bg-purple-50 dark:hover:bg-purple-900/20 text-purple-600"
                    onClick={handleCarSellClick}

                  >
                    <Car className="mr-2 h-4 w-4" />
                    Bán xe
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hover:bg-orange-50 dark:hover:bg-orange-900/20 text-orange-600"
                    onClick={handleCheckAuth}
                  >
                    <MapPin className="mr-2 h-4 w-4" />
                    Địa điểm
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hover:bg-yellow-50 dark:hover:bg-yellow-900/20 text-yellow-600"
                    onClick={handleCheckAuth}
                  >
                    <Smile className="mr-2 h-4 w-4" />
                    Cảm xúc
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hover:bg-indigo-50 dark:hover:bg-indigo-900/20 text-indigo-600"
                    onClick={handleCheckAuth}
                  >
                    <Users className="mr-2 h-4 w-4" />
                    Tag bạn bè
                  </Button>
                </div>
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg"
                  onClick={handleCheckAuth}>
                  Đăng bài
                </Button>
              </div>

              <div className="flex flex-wrap gap-2 mt-3">
                <Badge variant="secondary" className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                  #BMW
                </Badge>
                <Badge
                  variant="secondary"
                  className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                >
                  #Mercedes
                </Badge>
                <Badge variant="secondary" className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300">
                  #Toyota
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Car Selling Modal */}
      <Dialog open={isCarSellModalOpen} onOpenChange={setIsCarSellModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Car className="h-5 w-5" />
              Đăng tin bán xe
            </DialogTitle>
          </DialogHeader>
          <CarSellingForm onCancel={handleCloseModal} />
        </DialogContent>
      </Dialog>
    </>
  )
}

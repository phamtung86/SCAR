"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useChat } from '@/hooks/use-chat'
import CarAPI from "@/lib/api/car"
import { CarUtils } from "@/lib/utils/car-ultils"
import { getCurrentUser } from "@/lib/utils/get-current-user"
import { formatMoney } from "@/lib/utils/money-format"
import { Calendar, Eye, Fuel, Gauge, Heart, MapPin, MessageCircle, Settings, Star } from 'lucide-react'
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useUserOnline } from "../contexts/UserOnlineContext"
import { useWebSocket } from "../contexts/WebsocketContext"

interface Car {
  id: number
  title: string
  description: string
  year: number
  price: number
  originalPrice?: number
  odo: string
  color: string
  location: string
  view: number
  seatNumber: number
  doorNumber: number
  engine: string
  driveTrain: string
  fuelType: string
  transmission: string
  condition: string
  createdAt: string
  updatedAt: string
  carModelsId: number
  carModelsName: string
  carModelsBrandName: string
  carModelsBrandId: number
  carModelsCarTypeId: number
  carModelsCarTypeName: string
  carImages?: [
    {
      id: number
      carId: number
      carTitle: string
      imageUrl: string
      createdAt: string
      updatedAt: string
    }
  ]
  feature?: boolean
  sold?: boolean
  highLight: boolean
  user: {
    id: number
    usename: string
    email: string
    firstName: string
    lastName: string
    profilePicture?: string
    createdAt: string
    updatedAt: string
    role: string
    status: string
    isVerified: boolean
    bio: string
    location: string
    phone: string
    fullName: string
    rating: number
    rank: string
  }
  carFeatures?: [
    {
      id: number
      name: string
      carId: number
      carTitle: string
    }
  ]
  cacarHistories?: [
    {
      id: number
      eventDate: string
      description: string
      carId: number
      carTitle: string
    }
  ]
}

interface CarCardProps {
  car: Car
  viewMode: "grid" | "list"
}

export function CarCard({ car, viewMode }: CarCardProps) {
  const [liked, setLiked] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const route = useRouter()

  const user = getCurrentUser()
  const { usersOnline } = useUserOnline();

  const isOnline = usersOnline.some((u) => u.id === car.user.id);

  const handleChangeViewCar = async (id: number) => {
    try {
      const response = await CarAPI.changeViewCar(id)
      if (response.status === 200) {
        console.log("View count updated successfully")
      } else {
        console.error("Failed to update view count")
      }
    } catch (error) {
      console.error("Error updating view count:", error)
    }
  }
  const { stompClient } = useWebSocket();
  const {
    sendMessage,
  } = useChat(stompClient)

  const handleSendMessage = (sellerId: number) => {
    if (!user) {
      route.push(`/auth`);
      return;
    }
    if (user?.id === sellerId) return;
    const message = "Xin chào, bạn cần chúng tôi tư vấn gì không.";
    sendMessage(user.id, sellerId, "", car?.id, "TEXT");
    sendMessage(sellerId, user.id, message, car?.id, "TEXT");
    route.push(`/messages?carId=${car?.id}&sellerId=${sellerId}`);
  };



  if (viewMode === "list") {
    return (
      <Card className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
        <CardContent className={`pt-4 ${car.user.rank === "NORMAL" ? car?.highLight ? "border bg-yellow-100 shadow-md" : "" :
          car.user.rank === "PRO" ? "border bg-blue-100 shadow-md" : car.user.rank === "PREMIUM" ? "border bg-purple-200 shadow-md" : ""}`}>
          <div className="flex gap-6">
            <div className="relative w-80 h-48 flex-shrink-0">
              <Image src={car.carImages?.[0].imageUrl || "/placeholder.svg"} alt={car.title} fill className="object-cover rounded-lg" />
              {car.user.rank === "NORMAL" && car.highLight && (
                <Badge className="absolute top-2 left-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                  ⭐ Nổi bật
                </Badge>
              )}

              {(car.user.rank === "PRO" || car.user.rank === "PREMIUM") && (
                <Badge className="absolute top-2 left-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                  ⭐ VIP
                </Badge>
              )}

              {car.originalPrice && <Badge className="absolute top-2 right-2 bg-red-500 text-white">{Math.round(((car.originalPrice - car.price) / car.originalPrice) * 100)}%</Badge>}
            </div>

            <div className="flex-1">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-xl font-bold mb-2">{car.title}</h3>
                  <div className="flex items-center space-x-2 mb-2">
                    <p className="text-2xl font-bold text-green-600">{formatMoney(car.price, false)}</p>
                    {car.originalPrice && <p className="text-lg text-gray-500 line-through">{formatMoney(car.originalPrice, false)}</p>}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setLiked(!liked)}
                  className={liked ? "text-red-500" : "text-gray-400"}
                >
                  <Heart className={`h-5 w-5 ${liked ? "fill-current" : ""}`} />
                </Button>
              </div>

              <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">{car.description}</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <MapPin className="h-4 w-4 mr-2" />
                  {car.location}
                </div>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <Calendar className="h-4 w-4 mr-2" />
                  {car.year}
                </div>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <Gauge className="h-4 w-4 mr-2" />
                  {car.odo}
                </div>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <Fuel className="h-4 w-4 mr-2" />
                  {CarUtils.changeFuelType(car.fuelType)}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={car.user.profilePicture || "/placeholder.svg"} />
                      <AvatarFallback>{car.user.fullName}</AvatarFallback>
                    </Avatar>

                    {isOnline &&
                      (
                        <span className="absolute bottom-0 right-0 block h-2 w-2 rounded-full bg-green-500 ring-2 ring-white" />
                      )
                    }
                  </div>
                  <div>
                    <p className="text-sm font-medium">{car.user.fullName}</p>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => handleSendMessage(car.user.id)}>
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Nhắn tin
                  </Button>
                  <Link href={`/car/${car.id}`}>
                    <Button size="sm" onClick={() => handleChangeViewCar(car.id)}>Xem chi tiết</Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
      <div className="relative">
        <div className="relative h-48 overflow-hidden">
          {
            car.carImages?.map((image, index) => (
              <Image
                key={index}
                src={car.carImages?.[0]?.imageUrl || "/placeholder.svg"}
                alt={car.title}
                fill
                className={`absolute transition-opacity duration-300 ${index === currentImageIndex ? "opacity-100" : "opacity-0"}`}
              />
            ))
          }

          {car.user.rank === "NORMAL" && car.highLight && (
            <Badge className="absolute top-2 left-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
              ⭐ Nổi bật
            </Badge>
          )}

          {(car.user.rank === "PRO" || car.user.rank === "PREMIUM") && (
            <Badge className="absolute top-2 left-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
              ⭐ {car.user.rank === "PRO" ? "Chuyên nghiệp" : car.user.rank === "PREMIUM" ? "Cao cấp" : "VIP"}
            </Badge>
          )}
          {car.originalPrice && <Badge className="absolute top-2 right-2 bg-red-500 text-white">-{Math.round(((car.originalPrice - car.price) / car.originalPrice) * 100)}%</Badge>}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-12 bg-white/80 hover:bg-white"
            onClick={() => setLiked(!liked)}
          >
            <Heart className={`h-4 w-4 ${liked ? "text-red-500 fill-current" : "text-gray-600"}`} />
          </Button>

          {car.carImages && car.carImages.length > 1 && (
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
              {car.carImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${index === currentImageIndex ? "bg-white" : "bg-white/50"
                    }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <CardContent className={`pt-4 ${car.user.rank === "NORMAL" ? car?.highLight ? "border bg-yellow-100 shadow-md" : "" :
        car.user.rank === "PRO" ? "border bg-blue-100 shadow-md" : car.user.rank === "PREMIUM" ? "border bg-purple-300 shadow-md" : ""}`}>
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg line-clamp-1">{car.title}</h3>
          <div className="flex items-center text-xs text-gray-500">
            <Eye className="h-3 w-3 mr-1" />
            {car.view}
          </div>
        </div>

        <div className="flex items-center space-x-2 mb-3">
          <p className="text-xl font-bold text-green-600">{formatMoney(car.price, false)}</p>
          {car.originalPrice && <p className="text-sm text-gray-500 line-through">{formatMoney(car.originalPrice, false)}</p>}
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 dark:text-gray-400 mb-4">
          <div className="flex items-center">
            <MapPin className="h-3 w-3 mr-1" />
            {car.location}
          </div>
          <div className="flex items-center">
            <Calendar className="h-3 w-3 mr-1" />
            {car.year}
          </div>
          <div className="flex items-center">
            <Gauge className="h-3 w-3 mr-1" />
            {car.odo}
          </div>
          <div className="flex items-center">
            <Settings className="h-3 w-3 mr-1" />
            {CarUtils.changeTransmission(car.transmission)}
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Avatar className="h-10 w-10">
                <AvatarImage src={car.user.profilePicture || "/placeholder.svg"} />
                <AvatarFallback>{car.user.fullName}</AvatarFallback>
              </Avatar>

              {isOnline &&
                (
                  <span className="absolute bottom-0 right-0 block h-2 w-2 rounded-full bg-green-500 ring-2 ring-white" />
                )
              }
            </div>
            <div>
              <p className="text-xs font-medium">{car?.user?.fullName}</p>

              <div className="flex items-center">
                {
                  car.user.rating > 0 ?
                    <>
                      <Star className="h-3 w-3 text-yellow-400 fill-current mr-1" />
                      <span className="text-xs text-gray-500">{Math.round(car.user.rating * 10.0) / 10.0}</span>
                    </>
                    : ""
                }
              </div>
            </div>
          </div>
          <Badge variant="outline" className="text-xs">
            {CarUtils.changeCarCondition(car.condition)}
          </Badge>
        </div>

        <div className="flex space-x-2">
          <Button variant="outline" size="sm" className="flex-1" onClick={() => handleSendMessage(car.user.id)}>
            <MessageCircle className="h-3 w-3 mr-1" />
            Chat
          </Button>
          <Link href={`/car/${car.id}`}>
            <Button size="sm" className="flex-1" onClick={() => handleChangeViewCar(car.id)}>
              Chi tiết
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

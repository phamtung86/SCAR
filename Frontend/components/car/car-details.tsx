"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import CarAPI from "@/lib/api/car"
import { CarUtils } from "@/lib/utils/car-ultils"
import { formatDateToVietnamTime } from "@/lib/utils/format-date"
import { formatMoney } from "@/lib/utils/money-format"
import { formatDateToDate } from "@/lib/utils/time-format"
import {
  Calendar,
  Flag,
  Fuel,
  Gauge,
  Heart,
  MapPin,
  MessageCircle,
  Phone,
  Settings,
  Share,
  Shield,
  Star
} from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useUserOnline } from "../contexts/UserOnlineContext"
import { getCurrentUser } from "@/lib/utils/get-current-user"
import { useWebSocket } from "../contexts/WebsocketContext"
import { useChat } from "@/hooks/use-chat"


interface car {
  id: number
  title: string
  price: number
  originalPrice?: number
  color: string
  location: string
  year: number
  odo: string
  fuelType: string
  transmission: string
  carModelsCarTypeId: number
  carModelsCarTypeName: string
  carModelsId: number
  carModelsName: string
  view: number
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
  carModelsBrandName?: string
  carModelsBrandId?: number
  featured?: boolean
  discount?: number
  condition: string
  description: string
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
  }
  carFeatures?: [
    {
      id: number
      name: string
      carId: number
      carTitle: string
    }
  ]
  carHistories?: [
    {
      id: number
      eventDate: string
      description: string
      carId: number
      carTitle: string
    }
  ]
  [key: string]: any
}
interface CarDetailsProps {
  carId: number;
}

export function CarDetails({ carId }: CarDetailsProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [liked, setLiked] = useState(false)
  const [car, setCar] = useState<car | null>(null)
  const { usersOnline } = useUserOnline();
  const route = useRouter();
  const user = getCurrentUser()

  const isOnline = usersOnline.some((u) => u.id === car?.user.id);
  const fetchCarDetails = async (id: number) => {
    try {
      const response = await CarAPI.getCarById(id);
      if (response.status !== 200) {
        throw new Error("Failed to fetch car details")
      }
      setCar(response.data);
      console.log(car);

    } catch (error) {
      console.error("Error fetching car details:", error)
      setCar(null)
    }
  }

  const carSpecifications = {
    odo: "Số km",
    fuelType: "Nhiên liệu",
    transmission: "Hộp số",
    year: "Năm sản xuất",
    carModelsCarTypeName: "Loại xe",
    color: "Màu sắc",

  }
  const { stompClient } = useWebSocket();
  const {
    sendMessage,
  } = useChat(stompClient)

  const handleSendMessage = (carId : number, sellerId: number) => {
    if (!user) {
      route.push(`/auth`);
      return;
    }
    if (user?.id === sellerId) return;
    const message = "Xin chào, bạn cần chúng tôi tư vấn gì không.";
    sendMessage(user.id, sellerId, "", carId, "TEXT");
    sendMessage(sellerId, user.id, message, carId, "TEXT");
    route.push(`/messages?carId=${carId}&sellerId=${sellerId}`);
  };

  useEffect(() => {
    fetchCarDetails(carId)
  }, [carId])

  const relatedCars = [
    {
      id: 2,
      title: "BMW X3 2021",
      price: "2,200,000,000",
      image: "/placeholder.svg?height=200&width=300",
      year: 2021,
      mileage: "8,000 km",
    },
    {
      id: 3,
      title: "BMW X7 2019",
      price: "3,800,000,000",
      image: "/placeholder.svg?height=200&width=300",
      year: 2019,
      mileage: "25,000 km",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 dark:text-gray-400">
        <span>Trang chủ</span> / <span>Chợ xe</span> / <span>{car?.carModelsBrandName}</span> /{" "}
        <span className="text-gray-900 dark:text-gray-100">{car?.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image Gallery */}
          <Card className="overflow-hidden">
            <div className="relative">
              <div className="relative h-96 bg-gray-100 dark:bg-gray-800">
                {
                  car?.carImages?.map((image, index) => (
                    <Image
                      src={car?.carImages?.[currentImageIndex].imageUrl || "/placeholder.svg"}
                      alt={car?.title}
                      fill
                      className="object-contain transition-opacity duration-300 ease-in-out"
                    />
                  ))
                }
                <div className="absolute top-4 left-4 flex space-x-2">
                  {car?.featured && (
                    <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">⭐ Nổi bật</Badge>
                  )}
                  {car?.discount && <Badge className="bg-red-500 text-white">-{car.discount}%</Badge>}
                </div>
                <div className="absolute top-4 right-4 flex space-x-2">
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={() => setLiked(!liked)}
                    className="bg-white/80 hover:bg-white"
                  >
                    <Heart className={`h-4 w-4 ${liked ? "text-red-500 fill-current" : "text-gray-600"}`} />
                  </Button>
                  <Button variant="secondary" size="icon" className="bg-white/80 hover:bg-white">
                    <Share className="h-4 w-4 text-gray-600" />
                  </Button>
                  <Button variant="secondary" size="icon" className="bg-white/80 hover:bg-white">
                    <Flag className="h-4 w-4 text-gray-600" />
                  </Button>
                </div>
                <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                  {currentImageIndex + 1} / {car?.carImages?.length}
                </div>
              </div>

              {/* Thumbnail Navigation */}
              <div className="flex space-x-2 p-4 overflow-x-auto">
                {car?.carImages?.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`relative w-20 h-16 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${index === currentImageIndex ? "border-blue-500" : "border-gray-200 dark:border-gray-700"
                      }`}
                  >
                    <Image
                      src={image.imageUrl || "/placeholder.svg"}
                      alt={`${car.title} ${index + 1}`}
                      fill
                      className="object-contain"
                    />
                  </button>
                ))}
              </div>
            </div>
          </Card>

          {/* Car Details */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl mb-2">{car?.title}</CardTitle>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center">
                      {/* <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                      {car?.rating} đánh giá */}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {car?.location}
                    </div>
                    <span>{car?.view} lượt xem</span>
                  </div>
                </div>
                <div className="text-right">

                  <p className="text-3xl font-bold text-green-600">{car?.price ? formatMoney(car.price, false) : "Giá chưa xác định"}</p>
                  {car?.originalPrice && <p className="text-lg text-gray-500 line-through">{formatMoney(car?.originalPrice, false)}</p>}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Tổng quan</TabsTrigger>
                  <TabsTrigger value="specs">Thông số</TabsTrigger>
                  <TabsTrigger value="features">Tính năng</TabsTrigger>
                  <TabsTrigger value="history">Lịch sử</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <Calendar className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                      <p className="text-sm text-gray-500">Năm sản xuất</p>
                      <p className="font-semibold">{car?.year}</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <Gauge className="h-6 w-6 mx-auto mb-2 text-green-600" />
                      <p className="text-sm text-gray-500">Số km</p>
                      <p className="font-semibold">{car?.odo}</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <Fuel className="h-6 w-6 mx-auto mb-2 text-orange-600" />
                      <p className="text-sm text-gray-500">Nhiên liệu</p>
                      <p className="font-semibold">{CarUtils.changeFuelType(car?.fuelType || '')}</p>

                    </div>
                    <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <Settings className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                      <p className="text-sm text-gray-500">Hộp số</p>
                      <p className="font-semibold">{CarUtils.changeTransmission(car?.transmission || '')}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Mô tả</h3>
                    <p
                      className="text-gray-700 dark:text-gray-300 leading-relaxed"
                      style={{ whiteSpace: "pre-line" }}
                    >
                      {car?.description}
                    </p>

                  </div>
                </TabsContent>

                <TabsContent value="specs" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(carSpecifications).map(([key, value]) => (
                      <div
                        key={key}
                        className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                      >
                        <span className="text-gray-600 dark:text-gray-400">{value}</span>
                        {value === "Hộp số" ? (
                          <span className="font-semibold">{CarUtils.changeTransmission(car?.transmission || '')}</span>
                        ) : value === "Nhiên liệu" ? (
                          <span className="font-semibold">{CarUtils.changeFuelType(car?.fuelType || '')}</span>
                        ) : (
                          <span className="font-semibold">{car?.[key]}</span>
                        )}
                      </div>
                    ))}
                    {/* <span className="font-semibold">{car?.[key]}</span>
                      </div>
                    ))}  */}
                  </div>
                </TabsContent>

                <TabsContent value="features" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {car?.carFeatures?.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>{feature.name}</span>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="history" className="space-y-4">
                  <div className="space-y-4">
                    {car?.carHistories?.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                      >
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                          <Calendar className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-semibold">{formatDateToVietnamTime(item.eventDate)}</p>
                          <p className="text-gray-600 dark:text-gray-400">{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Seller Info */}
          <Card>
            <CardHeader>
              <CardTitle>Thông tin người bán</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">

                <div className="relative">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={car?.user?.profilePicture || "/placeholder.svg"} />
                    <AvatarFallback>{car?.user?.fullName}</AvatarFallback>
                  </Avatar>

                  {isOnline &&
                    (
                      <span className="absolute bottom-0 right-0 block h-2 w-2 rounded-full bg-green-500 ring-2 ring-white" />
                    )
                  }
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold">{car?.user?.fullName}</h3>
                    {car?.user?.isVerified && (
                      <Badge className="bg-blue-100 text-blue-700">
                        <Shield className="h-3 w-3 mr-1" />
                        Đã xác thực
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Star className="h-3 w-3 text-yellow-400 fill-current mr-1" />
                      {car?.user?.rating > 0
                        ? Math.round(car?.user?.rating * 10) / 10
                        : "Chưa có đánh giá"}

                    </div>
                    {/* <span>{car.seller.totalSales} xe đã bán</span> */}
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Tham gia từ:</span>
                  <span>{car?.user?.createdAt ? formatDateToDate(car.user.createdAt) : ""}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Địa điểm:</span>
                  <span>{car?.user?.location}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  <Phone className="h-4 w-4 mr-2" />
                  {car?.user?.phone}
                </Button>
                <Button variant="outline" className="w-full" onClick={
                  () => {handleSendMessage(car?.id, car?.user?.id)}}
                  >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Nhắn tin
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Related Cars */}
          <Card>
            <CardHeader>
              <CardTitle>Xe tương tự</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {relatedCars.map((relatedCar) => (
                <div
                  key={relatedCar.id}
                  className="flex space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                >
                  <Image
                    src={relatedCar.image || "/placeholder.svg"}
                    alt={relatedCar.title}
                    width={80}
                    height={60}
                    className="rounded object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-sm line-clamp-1">{relatedCar.title}</h4>
                    <p className="text-green-600 font-semibold text-sm">{relatedCar.price} VNĐ</p>
                    <p className="text-xs text-gray-500">
                      {relatedCar.year} • {relatedCar.mileage}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Safety Tips */}
          <Card className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
            <CardHeader>
              <CardTitle className="flex items-center text-yellow-800 dark:text-yellow-200">
                <Shield className="h-5 w-5 mr-2" />
                Lưu ý an toàn
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-yellow-700 dark:text-yellow-300 space-y-2">
              <p>• Kiểm tra kỹ xe trước khi mua</p>
              <p>• Gặp mặt tại nơi công cộng</p>
              <p>• Không chuyển tiền trước</p>
              <p>• Kiểm tra giấy tờ xe</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

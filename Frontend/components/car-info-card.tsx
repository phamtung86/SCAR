"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

interface CarInfo {
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

interface CarInfoCardProps {
  carInfo: CarInfo
  onViewDetails: () => void
}

export function CarInfoCard({ carInfo, onViewDetails }: CarInfoCardProps) {

   if (!carInfo) return null;

  const imageUrl = carInfo.carImages?.[0]?.imageUrl || "/placeholder.svg";

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
      <CardContent className="p-4">
        <div className="flex gap-4">
          <div className="relative w-20 h-16 flex-shrink-0">
            <Image
              src={imageUrl}
              alt={carInfo.title}
              fill
              className="object-cover rounded-lg"
            />
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-sm truncate mb-1">
              {carInfo.carModelsBrandName} {carInfo.carModelsName} {carInfo.year}
            </h4>

            <p className="text-lg font-bold text-green-600 mb-2">
              {carInfo.price.toLocaleString("vi-VN")}₫
            </p>
            <p className="text-lg font-bold text-green-600 mb-2 line-through">
              {carInfo.originalPrice?.toLocaleString("vi-VN")}₫
            </p>

            <div className="flex items-center justify-between">
              <Badge variant="secondary" className="text-xs">
                ID: {carInfo.id}
              </Badge>

              <Button
                variant="outline"
                size="sm"
                onClick={onViewDetails}
                className="text-xs bg-transparent"
              >
                Xem chi tiết
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

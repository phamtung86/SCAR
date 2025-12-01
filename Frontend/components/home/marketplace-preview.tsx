"use client"

import { ArrowRight, Star, MapPin, Calendar, Gauge, ChevronLeft, ChevronRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { CarDTO } from "@/types/car"
import CarAPI from "@/lib/api/car"
import { formatMoney } from "@/lib/utils/money-format"
import { CarUtils } from "@/lib/utils/car-ultils"
import { useRouter } from "next/navigation"

export function MarketplacePreview() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const sliderRef = useRef<HTMLDivElement>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const [featuredCars, setFeatureCars] = useState<CarDTO[]> ([])
  const route = useRouter();
  
  const fetchTopCars = async (limit : number) => {
    try {
      const res = await CarAPI.getTopCarsOrderByView(limit);
      if (res.status === 200) {
        setFeatureCars(res.data)
      }
    } catch (error) {
      console.log("Lỗi xảy ra khi lấy danh sách xe ", error );
    }
  }

  useEffect(() => {
    fetchTopCars(10);
  }, [])

  useEffect(() => {
    if (!isHovered) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex >= featuredCars.length - 3 ? 0 : prevIndex + 1))
      }, 3000)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isHovered, featuredCars.length])

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? Math.max(0, featuredCars.length - 3) : currentIndex - 1)
  }

  const goToNext = () => {
    setCurrentIndex(currentIndex >= featuredCars.length - 3 ? 0 : currentIndex + 1)
  }

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200/50 dark:border-blue-700/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center text-xl font-bold">
            🚗 Chợ xe nổi bật
            <Badge className="ml-2 bg-red-500 text-white animate-pulse">HOT</Badge>
          </CardTitle>
          <Link href="/marketplace">
            <Button variant="ghost" className="text-blue-600 hover:text-blue-700" onClick={() => route.push("/marketplace")}>
              Xem tất cả
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
          {/* Slider container */}
          <div className="overflow-hidden rounded-lg grid grid-cols-1 md:grid-cols-2 gap-6">
            <div
              ref={sliderRef}
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${currentIndex * (100 / 3)}%)`,
                width: `${(featuredCars.length * 100) / 3}%`,
              }}
            >
              {featuredCars.map((car) => (
                <div key={car?.id} className="w-1/3 flex-shrink-0 px-2">
                  <Link href={`/car/${car?.id}`}>
                    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white dark:bg-gray-800 h-full">
                      <div className="relative">
                        <Image
                          src={car?.carImages?.[0]?.imageUrl || "/placeholder.jpg"}
                          alt={car?.title || "Car image"}
                          width={300}
                          height={200}
                          className="w-full h-48 object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.onerror = null; // prevents infinite loop if fallback also fails
                            target.src = "/placeholder.svg"; // fallback image
                          }}
                        />
                        {car?.featured && (
                          <Badge className="absolute top-2 left-2 bg-yellow-500 text-black font-semibold shadow-md border-0">
                            ⭐ Nổi bật
                          </Badge>
                        )}
                        {car?.discount && (
                          <Badge className="absolute top-2 right-2 bg-red-500 text-white">-{car?.discount}%</Badge>
                        )}
                        <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs flex items-center">
                          <Star className="h-3 w-3 mr-1 fill-current text-yellow-400" />
                          {car?.rating}
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-lg mb-2 line-clamp-1">{car?.title}</h3>
                        <div className="flex items-center space-x-2 mb-3">
                          <p className="text-2xl font-bold text-green-600">{formatMoney(car?.price)}</p>
                          {car?.originalPrice && (
                            <p className="text-sm text-gray-500 line-through">{formatMoney(car?.originalPrice)}</p>
                          )}
                        </div>

                        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1" />
                              {car?.location}
                            </div>
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              {car?.year}
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Gauge className="h-4 w-4 mr-1" />
                              {car?.odo}
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {CarUtils.changeCarCondition(car?.condition)}
                            </Badge>
                          </div>
                        </div>

                        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium border-0" onClick={() => route.push(`/car/${car?.id}`)}>
                          Xem chi tiết
                        </Button>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          <Button
            variant="outline"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg z-10"
            onClick={goToPrevious}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg z-10"
            onClick={goToNext}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          <div className="flex justify-center space-x-2 mt-4">
            {Array.from({ length: Math.max(1, featuredCars.length - 2) }).map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex ? "bg-blue-600 w-6" : "bg-gray-300 hover:bg-gray-400"
                }`}
                onClick={() => goToSlide(index)}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

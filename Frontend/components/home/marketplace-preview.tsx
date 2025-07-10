import { ArrowRight, Star, MapPin, Calendar, Gauge } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import Link from "next/link"

export function MarketplacePreview() {
  const featuredCars = [
    {
      id: 1,
      title: "BMW X5 2020 - Như mới",
      price: "2,500,000,000",
      originalPrice: "2,800,000,000",
      image: "/placeholder.svg?height=200&width=300",
      location: "Hà Nội",
      year: 2020,
      mileage: "15,000 km",
      rating: 4.8,
      seller: "BMW Authorized Dealer",
      featured: true,
      discount: 11,
    },
    {
      id: 2,
      title: "Mercedes C200 2019",
      price: "1,800,000,000",
      image: "/placeholder.svg?height=200&width=300",
      location: "TP.HCM",
      year: 2019,
      mileage: "25,000 km",
      rating: 4.6,
      seller: "Mercedes Official",
      featured: false,
    },
    {
      id: 3,
      title: "Toyota Camry 2021",
      price: "1,200,000,000",
      image: "/placeholder.svg?height=200&width=300",
      location: "Đà Nẵng",
      year: 2021,
      mileage: "8,000 km",
      rating: 4.9,
      seller: "Toyota Dealer",
      featured: true,
    },
  ]

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200/50 dark:border-blue-700/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center text-xl font-bold">
            🚗 Chợ xe nổi bật
            <Badge className="ml-2 bg-red-500 text-white animate-pulse">HOT</Badge>
          </CardTitle>
          <Link href="/marketplace">
            <Button variant="ghost" className="text-blue-600 hover:text-blue-700">
              Xem tất cả
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredCars.map((car) => (
            <Link key={car.id} href={`/car/${car.id}`}>
              <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white dark:bg-gray-800">
                <div className="relative">
                  <Image
                    src={car.image || "/placeholder.svg"}
                    alt={car.title}
                    width={300}
                    height={200}
                    className="w-full h-48 object-cover"
                  />
                  {car.featured && (
                    <Badge className="absolute top-2 left-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                      ⭐ Nổi bật
                    </Badge>
                  )}
                  {car.discount && (
                    <Badge className="absolute top-2 right-2 bg-red-500 text-white">-{car.discount}%</Badge>
                  )}
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs flex items-center">
                    <Star className="h-3 w-3 mr-1 fill-current text-yellow-400" />
                    {car.rating}
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-2 line-clamp-1">{car.title}</h3>
                  <div className="flex items-center space-x-2 mb-3">
                    <p className="text-2xl font-bold text-green-600">{car.price} VNĐ</p>
                    {car.originalPrice && <p className="text-sm text-gray-500 line-through">{car.originalPrice} VNĐ</p>}
                  </div>

                  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {car.location}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {car.year}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Gauge className="h-4 w-4 mr-1" />
                        {car.mileage}
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {car.seller}
                      </Badge>
                    </div>
                  </div>

                  <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    Xem chi tiết
                  </Button>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

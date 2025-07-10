import { MapPin, Calendar, Gauge } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface MarketplaceItem {
  id: number
  title: string
  price: string
  image: string
  location: string
  year: number
  mileage: string
}

interface MarketplaceCardProps {
  item: MarketplaceItem
}

export function MarketplaceCard({ item }: MarketplaceCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <Image
          src={item.image || "/placeholder.svg"}
          alt={item.title}
          width={300}
          height={200}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-semibold">
          Còn hàng
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
        <p className="text-2xl font-bold text-green-600 mb-3">{item.price} VNĐ</p>
        <div className="space-y-2 text-sm text-gray-600 mb-4">
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-2" />
            {item.location}
          </div>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            Năm {item.year}
          </div>
          <div className="flex items-center">
            <Gauge className="h-4 w-4 mr-2" />
            {item.mileage}
          </div>
        </div>
        <Button className="w-full">Xem chi tiết</Button>
      </CardContent>
    </Card>
  )
}

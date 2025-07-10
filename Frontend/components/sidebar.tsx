import { Home, Users, ShoppingCart, Calendar, Settings, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export function Sidebar() {
  const menuItems = [
    { icon: Home, label: "Trang chủ", active: true },
    { icon: Users, label: "Cộng đồng", active: false },
    { icon: ShoppingCart, label: "Chợ xe", active: false },
    { icon: Calendar, label: "Sự kiện", active: false },
    { icon: TrendingUp, label: "Xu hướng", active: false },
    { icon: Settings, label: "Cài đặt", active: false },
  ]

  return (
    <aside className="w-64 p-4">
      <Card>
        <CardContent className="p-4">
          <nav className="space-y-2">
            {menuItems.map((item, index) => (
              <Button key={index} variant={item.active ? "default" : "ghost"} className="w-full justify-start">
                <item.icon className="mr-3 h-4 w-4" />
                {item.label}
              </Button>
            ))}
          </nav>
        </CardContent>
      </Card>

      <Card className="mt-4">
        <CardContent className="p-4">
          <h3 className="font-semibold mb-3">Nhóm yêu thích</h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                F
              </div>
              <span className="text-sm">Ferrari Việt Nam</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                B
              </div>
              <span className="text-sm">BMW Club</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                M
              </div>
              <span className="text-sm">Mercedes Fans</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </aside>
  )
}

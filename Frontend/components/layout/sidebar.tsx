"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { getCurrentUser } from "@/lib/utils/get-current-user"
import { Book, Calendar, Home, MessageSquare, Settings, ShoppingCart, Star, TrendingUp, Users, Wallet } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { useState, useEffect } from "react"

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // This will ensure admin menu only renders on client-side
  }, []);

  const currentUser = getCurrentUser();
  const menuItems = [
    { icon: Home, label: "Trang chủ", href: "/", active: pathname === "/" },
    { icon: Users, label: "Cộng đồng", href: "/community", active: pathname === "/community" },
    { icon: ShoppingCart, label: "Chợ xe", href: "/marketplace", active: pathname === "/marketplace" },
    { icon: MessageSquare, label: "Tin nhắn", href: "/messages", active: pathname === "/messages", badge: 5 },
    { icon: Calendar, label: "Sự kiện", href: "/events", active: pathname === "/events" },
    { icon: TrendingUp, label: "Xu hướng", href: "/trending", active: pathname === "/trending" },
    { icon: Star, label: "Yêu thích", href: "/favorites", active: pathname === "/favorites" },
    { icon: Wallet, label: "Thanh toán", href: "/payment", active: pathname === "/payment" },
    { icon: Book, label: "Quản lý", href: "/management/user", active: pathname === "/management/user" },
    { icon: Settings, label: "Cài đặt", href: "/settings", active: pathname === "/settings" },
  ];

  const adminMenuItem = isClient && currentUser?.role === "ADMIN"
    ? { icon: Book, label: "Quản trị", href: "/management/admin", active: pathname === "/management/admin" }
    : null;


  const carBrands = [
    { name: "Ferrari Việt Nam", members: "12.5k", color: "bg-red-500", initial: "F" },
    { name: "BMW Club", members: "8.2k", color: "bg-blue-500", initial: "B" },
    { name: "Mercedes Fans", members: "15.1k", color: "bg-gray-700", initial: "M" },
    { name: "Toyota Community", members: "22.3k", color: "bg-red-600", initial: "T" },
    { name: "Honda Lovers", members: "18.7k", color: "bg-red-700", initial: "H" },
  ]

  const handleNavigation = (href: string, isActive: boolean) => {

    if (!isActive) {
      router.push(href)
    }
  }

  return (
    <aside className="w-64 p-4 space-y-4">
      <Card className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50">
        <CardContent className="p-4">
          <nav className="space-y-1">
            {menuItems.map((item, index) => (
              <Button
                key={index}
                onClick={() => handleNavigation(String(item?.href), Boolean(item?.active))}
                variant={item?.active ? "default" : "ghost"}
                className={`w-full justify-start relative transition-all duration-200 ${item?.active
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                  : "hover:bg-blue-50 dark:hover:bg-blue-900/20"
                  }`}
              >
                <item.icon className="mr-3 h-4 w-4" />
                {item?.label}
                {item?.badge && <Badge className="ml-auto bg-red-500 text-white">{item?.badge}</Badge>}
              </Button>
            ))}
            {isClient && adminMenuItem && (
              <Button
                onClick={() => handleNavigation(String(adminMenuItem?.href), Boolean(adminMenuItem?.active))}
                variant={adminMenuItem?.active ? "default" : "ghost"}
                className={`w-full justify-start relative transition-all duration-200 ${adminMenuItem?.active
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                  : "hover:bg-blue-50 dark:hover:bg-blue-900/20"
                  }`}
              >
                <adminMenuItem.icon className="mr-3 h-4 w-4" />
                {adminMenuItem?.label}
              </Button>
            )}
          </nav>
        </CardContent>
      </Card>

      <Card className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50">
        <CardContent className="p-4">
          <h3 className="font-semibold mb-3 text-gray-900 dark:text-gray-100">Nhóm yêu thích</h3>
          <div className="space-y-3">
            {carBrands.map((brand, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer group"
              >
                <div
                  className={`w-10 h-10 ${brand.color} rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg group-hover:scale-110 transition-transform`}
                >
                  {brand.initial}
                </div>
                <div className="flex-1">
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{brand.name}</span>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{brand.members} thành viên</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </aside>
  )
}

"use client"

import { useState } from "react"
import { Bell, Heart, MessageCircle, Users, Car, Calendar, Settings, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function NotificationsContent() {
  const [activeTab, setActiveTab] = useState("all")

  const notifications = [
    {
      id: 1,
      type: "like",
      user: {
        name: "Nguyễn Văn A",
        avatar: "/placeholder.svg",
      },
      content: "đã thích bài viết của bạn về BMW X5",
      timestamp: "2 phút trước",
      isRead: false,
      icon: Heart,
      iconColor: "text-red-500",
    },
    {
      id: 2,
      type: "comment",
      user: {
        name: "Trần Thị B",
        avatar: "/placeholder.svg",
      },
      content: "đã bình luận về chiếc Mercedes C200 bạn đang bán",
      timestamp: "15 phút trước",
      isRead: false,
      icon: MessageCircle,
      iconColor: "text-blue-500",
    },
    {
      id: 3,
      type: "follow",
      user: {
        name: "Lê Minh C",
        avatar: "/placeholder.svg",
      },
      content: "đã bắt đầu theo dõi bạn",
      timestamp: "1 giờ trước",
      isRead: true,
      icon: Users,
      iconColor: "text-green-500",
    },
    {
      id: 4,
      type: "car_interest",
      user: {
        name: "Phạm Văn D",
        avatar: "/placeholder.svg",
      },
      content: "quan tâm đến chiếc Toyota Camry của bạn",
      timestamp: "2 giờ trước",
      isRead: true,
      icon: Car,
      iconColor: "text-purple-500",
    },
    {
      id: 5,
      type: "event",
      user: {
        name: "BMW Vietnam",
        avatar: "/placeholder.svg",
      },
      content: "mời bạn tham gia sự kiện BMW Test Drive Experience",
      timestamp: "4 giờ trước",
      isRead: false,
      icon: Calendar,
      iconColor: "text-orange-500",
    },
    {
      id: 6,
      type: "system",
      content: "Bài viết của bạn đã được duyệt và xuất bản",
      timestamp: "1 ngày trước",
      isRead: true,
      icon: Check,
      iconColor: "text-green-600",
    },
  ]

  const filterNotifications = (type: string) => {
    if (type === "all") return notifications
    return notifications.filter((notif) => notif.type === type)
  }

  const unreadCount = notifications.filter((notif) => !notif.isRead).length

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Thông báo
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Bạn có {unreadCount} thông báo chưa đọc</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Check className="h-4 w-4 mr-2" />
            Đánh dấu tất cả đã đọc
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Cài đặt
          </Button>
        </div>
      </div>

      <Card className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-6 rounded-none border-b">
              <TabsTrigger value="all" className="flex items-center">
                <Bell className="h-4 w-4 mr-2" />
                Tất cả
                {unreadCount > 0 && <Badge className="ml-2 bg-red-500 text-white text-xs">{unreadCount}</Badge>}
              </TabsTrigger>
              <TabsTrigger value="like" className="flex items-center">
                <Heart className="h-4 w-4 mr-2" />
                Thích
              </TabsTrigger>
              <TabsTrigger value="comment" className="flex items-center">
                <MessageCircle className="h-4 w-4 mr-2" />
                Bình luận
              </TabsTrigger>
              <TabsTrigger value="follow" className="flex items-center">
                <Users className="h-4 w-4 mr-2" />
                Theo dõi
              </TabsTrigger>
              <TabsTrigger value="car_interest" className="flex items-center">
                <Car className="h-4 w-4 mr-2" />
                Xe
              </TabsTrigger>
              <TabsTrigger value="event" className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Sự kiện
              </TabsTrigger>
            </TabsList>

            {["all", "like", "comment", "follow", "car_interest", "event"].map((tabValue) => (
              <TabsContent key={tabValue} value={tabValue} className="p-0">
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filterNotifications(tabValue).map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                        !notification.isRead ? "bg-blue-50 dark:bg-blue-900/20" : ""
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          {notification.user ? (
                            <div className="relative">
                              <Avatar className="h-10 w-10">
                                <AvatarImage src={notification.user.avatar || "/placeholder.svg"} />
                                <AvatarFallback>{notification.user.name[0]}</AvatarFallback>
                              </Avatar>
                              <div className="absolute -bottom-1 -right-1">
                                <notification.icon
                                  className={`h-4 w-4 ${notification.iconColor} bg-white dark:bg-gray-900 rounded-full p-0.5`}
                                />
                              </div>
                            </div>
                          ) : (
                            <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                              <notification.icon className={`h-5 w-5 ${notification.iconColor}`} />
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm">
                              {notification.user && <span className="font-semibold">{notification.user.name} </span>}
                              <span className="text-gray-600 dark:text-gray-400">{notification.content}</span>
                            </p>
                            {!notification.isRead && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 mt-1">{notification.timestamp}</p>
                        </div>

                        <div className="flex space-x-1">
                          {!notification.isRead && (
                            <Button variant="ghost" size="sm">
                              <Check className="h-4 w-4" />
                            </Button>
                          )}
                          <Button variant="ghost" size="sm">
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {filterNotifications(tabValue).length === 0 && (
                  <div className="text-center py-12">
                    <Bell className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Không có thông báo</h3>
                    <p className="text-gray-500 dark:text-gray-400">Bạn chưa có thông báo nào trong danh mục này</p>
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

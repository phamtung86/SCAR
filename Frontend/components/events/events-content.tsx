"use client"

import { useState } from "react"
import { Calendar, MapPin, Users, Clock, Plus, Filter, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image"

export function EventsContent() {
  const [activeTab, setActiveTab] = useState("upcoming")

  const upcomingEvents = [
    {
      id: 1,
      title: "Vietnam Motor Show 2024",
      description: "Triển lãm ô tô lớn nhất Việt Nam với hàng trăm mẫu xe mới",
      date: "2024-03-15",
      time: "09:00 - 18:00",
      location: "SECC, TP.HCM",
      image: "/placeholder.svg?height=200&width=400",
      attendees: 5234,
      interested: 12456,
      category: "Triển lãm",
      organizer: {
        name: "Vietnam Motor Show",
        avatar: "/placeholder.svg",
      },
      isOnline: false,
      isFeatured: true,
    },
    {
      id: 2,
      title: "BMW Test Drive Experience",
      description: "Trải nghiệm lái thử các dòng xe BMW mới nhất",
      date: "2024-03-22",
      time: "10:00 - 16:00",
      location: "BMW Showroom Hà Nội",
      image: "/placeholder.svg?height=200&width=400",
      attendees: 156,
      interested: 789,
      category: "Lái thử",
      organizer: {
        name: "BMW Vietnam",
        avatar: "/placeholder.svg",
      },
      isOnline: false,
      isFeatured: false,
    },
    {
      id: 3,
      title: "Car Modification Contest 2024",
      description: "Cuộc thi độ xe lớn nhất năm với giải thưởng hấp dẫn",
      date: "2024-03-28",
      time: "08:00 - 20:00",
      location: "Đà Nẵng",
      image: "/placeholder.svg?height=200&width=400",
      attendees: 234,
      interested: 1567,
      category: "Thi đua",
      organizer: {
        name: "Car Mod VN",
        avatar: "/placeholder.svg",
      },
      isOnline: false,
      isFeatured: true,
    },
    {
      id: 4,
      title: "Electric Car Webinar",
      description: "Hội thảo trực tuyến về tương lai của xe điện",
      date: "2024-03-20",
      time: "19:00 - 21:00",
      location: "Online",
      image: "/placeholder.svg?height=200&width=400",
      attendees: 1234,
      interested: 3456,
      category: "Hội thảo",
      organizer: {
        name: "EV Vietnam",
        avatar: "/placeholder.svg",
      },
      isOnline: true,
      isFeatured: false,
    },
  ]

  const myEvents = [
    {
      id: 1,
      title: "BMW Test Drive Experience",
      date: "2024-03-22",
      status: "going",
      image: "/placeholder.svg?height=100&width=150",
    },
    {
      id: 2,
      title: "Car Modification Contest 2024",
      date: "2024-03-28",
      status: "interested",
      image: "/placeholder.svg?height=100&width=150",
    },
  ]

  const categories = [
    { name: "Tất cả", count: 45 },
    { name: "Triển lãm", count: 12 },
    { name: "Lái thử", count: 8 },
    { name: "Thi đua", count: 6 },
    { name: "Hội thảo", count: 19 },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Sự kiện xe hơi
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Khám phá và tham gia các sự kiện thú vị</p>
        </div>
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
          <Plus className="h-4 w-4 mr-2" />
          Tạo sự kiện
        </Button>
      </div>

      {/* Search and Filter */}
      <Card className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input placeholder="Tìm kiếm sự kiện..." className="pl-10 bg-white dark:bg-gray-800" />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Bộ lọc
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-3">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="upcoming">Sắp diễn ra</TabsTrigger>
              <TabsTrigger value="my-events">Sự kiện của tôi</TabsTrigger>
              <TabsTrigger value="past">Đã qua</TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="space-y-6 mt-6">
              <div className="space-y-6">
                {upcomingEvents.map((event) => (
                  <Card
                    key={event.id}
                    className={`overflow-hidden hover:shadow-lg transition-all duration-300 ${
                      event.isFeatured ? "ring-2 ring-blue-500/20" : ""
                    }`}
                  >
                    <div className="md:flex">
                      <div className="md:w-1/3 relative">
                        <Image
                          src={event.image || "/placeholder.svg"}
                          alt={event.title}
                          width={400}
                          height={200}
                          className="w-full h-48 md:h-full object-cover"
                        />
                        {event.isFeatured && (
                          <Badge className="absolute top-2 left-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                            ⭐ Nổi bật
                          </Badge>
                        )}
                        {event.isOnline && (
                          <Badge className="absolute top-2 right-2 bg-green-500 text-white">Online</Badge>
                        )}
                      </div>
                      <CardContent className="md:w-2/3 p-6">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                            <Badge variant="secondary">{event.category}</Badge>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={event.organizer.avatar || "/placeholder.svg"} />
                              <AvatarFallback>{event.organizer.name[0]}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm text-gray-500">{event.organizer.name}</span>
                          </div>
                        </div>

                        <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">{event.description}</p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-sm">
                          <div className="flex items-center text-gray-600 dark:text-gray-400">
                            <Calendar className="h-4 w-4 mr-2" />
                            {new Date(event.date).toLocaleDateString("vi-VN")}
                          </div>
                          <div className="flex items-center text-gray-600 dark:text-gray-400">
                            <Clock className="h-4 w-4 mr-2" />
                            {event.time}
                          </div>
                          <div className="flex items-center text-gray-600 dark:text-gray-400">
                            <MapPin className="h-4 w-4 mr-2" />
                            {event.location}
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center">
                              <Users className="h-4 w-4 mr-1" />
                              {event.attendees} tham gia
                            </div>
                            <div>{event.interested} quan tâm</div>
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              Quan tâm
                            </Button>
                            <Button size="sm">Tham gia</Button>
                          </div>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="my-events" className="space-y-6 mt-6">
              <div className="space-y-4">
                {myEvents.map((event) => (
                  <Card key={event.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-4">
                        <Image
                          src={event.image || "/placeholder.svg"}
                          alt={event.title}
                          width={150}
                          height={100}
                          className="w-24 h-16 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold">{event.title}</h3>
                          <p className="text-sm text-gray-500">{new Date(event.date).toLocaleDateString("vi-VN")}</p>
                          <Badge variant={event.status === "going" ? "default" : "secondary"} className="mt-2">
                            {event.status === "going" ? "Sẽ tham gia" : "Quan tâm"}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="past" className="space-y-6 mt-6">
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Chưa có sự kiện nào đã qua
                </h3>
                <p className="text-gray-500 dark:text-gray-400">Các sự kiện bạn đã tham gia sẽ hiển thị ở đây</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Categories */}
          <Card>
            <CardHeader>
              <CardTitle>Danh mục</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {categories.map((category, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                >
                  <span>{category.name}</span>
                  <Badge variant="secondary">{category.count}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Thống kê</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">12</p>
                <p className="text-sm text-gray-500">Sự kiện sắp tới</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">5</p>
                <p className="text-sm text-gray-500">Đã tham gia</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">23</p>
                <p className="text-sm text-gray-500">Đang quan tâm</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

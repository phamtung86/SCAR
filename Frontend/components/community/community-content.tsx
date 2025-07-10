"use client"

import { useState } from "react"
import { Users, Plus, Search, TrendingUp, Crown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image"

export function CommunityContent() {
  const [activeTab, setActiveTab] = useState("discover")

  const featuredGroups = [
    {
      id: 1,
      name: "BMW Việt Nam Official",
      description: "Cộng đồng chính thức của BMW tại Việt Nam",
      members: 15420,
      posts: 2341,
      image: "/placeholder.svg?height=200&width=300",
      isOfficial: true,
      category: "Hãng xe",
    },
    {
      id: 2,
      name: "Mercedes-Benz Club VN",
      description: "Nơi chia sẻ đam mê Mercedes-Benz",
      members: 12850,
      posts: 1876,
      image: "/placeholder.svg?height=200&width=300",
      isOfficial: true,
      category: "Hãng xe",
    },
    {
      id: 3,
      name: "Xe Điện Việt Nam",
      description: "Cộng đồng xe điện và công nghệ xanh",
      members: 8934,
      posts: 1234,
      image: "/placeholder.svg?height=200&width=300",
      isOfficial: false,
      category: "Công nghệ",
    },
    {
      id: 4,
      name: "Car Modification VN",
      description: "Chia sẻ kinh nghiệm độ xe và tuning",
      members: 6789,
      posts: 987,
      image: "/placeholder.svg?height=200&width=300",
      isOfficial: false,
      category: "Độ xe",
    },
  ]

  const myGroups = [
    {
      id: 1,
      name: "BMW M Series Vietnam",
      members: 3456,
      lastActivity: "2 phút trước",
      unreadPosts: 5,
      image: "/placeholder.svg?height=50&width=50",
    },
    {
      id: 2,
      name: "Xe Cũ Hà Nội",
      members: 12340,
      lastActivity: "15 phút trước",
      unreadPosts: 12,
      image: "/placeholder.svg?height=50&width=50",
    },
    {
      id: 3,
      name: "Toyota Camry Club",
      members: 5678,
      lastActivity: "1 giờ trước",
      unreadPosts: 0,
      image: "/placeholder.svg?height=50&width=50",
    },
  ]

  const categories = [
    { name: "Hãng xe", count: 45, icon: "🚗" },
    { name: "Độ xe", count: 23, icon: "🔧" },
    { name: "Xe điện", count: 12, icon: "⚡" },
    { name: "Xe cũ", count: 67, icon: "🏷️" },
    { name: "Racing", count: 18, icon: "🏁" },
    { name: "Luxury", count: 34, icon: "💎" },
  ]

  const trendingTopics = [
    { topic: "VinFast VF8 Review", posts: 234, growth: "+15%" },
    { topic: "BMW iX3 2024", posts: 189, growth: "+8%" },
    { topic: "Giá xăng tháng 3", posts: 156, growth: "+25%" },
    { topic: "Mercedes EQS", posts: 134, growth: "+12%" },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Cộng đồng CarSocial
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Kết nối với những người có cùng đam mê xe hơi</p>
        </div>
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
          <Plus className="h-4 w-4 mr-2" />
          Tạo nhóm mới
        </Button>
      </div>

      {/* Search */}
      <Card className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input placeholder="Tìm kiếm nhóm, chủ đề, thành viên..." className="pl-10 bg-white dark:bg-gray-800" />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-3">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="discover">Khám phá</TabsTrigger>
              <TabsTrigger value="my-groups">Nhóm của tôi</TabsTrigger>
              <TabsTrigger value="trending">Thịnh hành</TabsTrigger>
            </TabsList>

            <TabsContent value="discover" className="space-y-6 mt-6">
              {/* Categories */}
              <Card>
                <CardHeader>
                  <CardTitle>Danh mục nhóm</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {categories.map((category, index) => (
                      <div
                        key={index}
                        className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                      >
                        <div className="text-2xl mb-2">{category.icon}</div>
                        <h3 className="font-semibold">{category.name}</h3>
                        <p className="text-sm text-gray-500">{category.count} nhóm</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Featured Groups */}
              <div>
                <h2 className="text-xl font-bold mb-4">Nhóm nổi bật</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {featuredGroups.map((group) => (
                    <Card
                      key={group.id}
                      className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer"
                    >
                      <div className="relative h-32">
                        <Image src={group.image || "/placeholder.svg"} alt={group.name} fill className="object-cover" />
                        {group.isOfficial && (
                          <Badge className="absolute top-2 right-2 bg-blue-500 text-white">
                            <Crown className="h-3 w-3 mr-1" />
                            Chính thức
                          </Badge>
                        )}
                      </div>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-lg line-clamp-1">{group.name}</h3>
                          <Badge variant="secondary">{group.category}</Badge>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                          {group.description}
                        </p>
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center">
                              <Users className="h-4 w-4 mr-1" />
                              {group.members.toLocaleString()} thành viên
                            </div>
                            <div>{group.posts} bài viết</div>
                          </div>
                          <Button size="sm">Tham gia</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="my-groups" className="space-y-6 mt-6">
              <div className="space-y-4">
                {myGroups.map((group) => (
                  <Card key={group.id} className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={group.image || "/placeholder.svg"} />
                          <AvatarFallback>{group.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold">{group.name}</h3>
                            {group.unreadPosts > 0 && (
                              <Badge className="bg-red-500 text-white">{group.unreadPosts} mới</Badge>
                            )}
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>{group.members.toLocaleString()} thành viên</span>
                            <span>Hoạt động {group.lastActivity}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="trending" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Chủ đề thịnh hành
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {trendingTopics.map((topic, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                    >
                      <div>
                        <h3 className="font-semibold text-blue-600">{topic.topic}</h3>
                        <p className="text-sm text-gray-500">{topic.posts} bài viết</p>
                      </div>
                      <Badge variant="outline" className="text-green-600 border-green-200">
                        {topic.growth}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Thống kê</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">156</p>
                <p className="text-sm text-gray-500">Nhóm đã tham gia</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">2,847</p>
                <p className="text-sm text-gray-500">Bạn bè trong cộng đồng</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">89</p>
                <p className="text-sm text-gray-500">Bài viết tuần này</p>
              </div>
            </CardContent>
          </Card>

          {/* Suggested Groups */}
          <Card>
            <CardHeader>
              <CardTitle>Gợi ý nhóm</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {featuredGroups.slice(0, 3).map((group) => (
                <div key={group.id} className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={group.image || "/placeholder.svg"} />
                    <AvatarFallback>{group.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm line-clamp-1">{group.name}</h4>
                    <p className="text-xs text-gray-500">{group.members.toLocaleString()} thành viên</p>
                  </div>
                  <Button size="sm" variant="outline">
                    Tham gia
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

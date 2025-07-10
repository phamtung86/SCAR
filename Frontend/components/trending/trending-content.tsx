"use client"

import { TrendingUp, Hash, Eye, MessageCircle, Heart, Share } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image"

export function TrendingContent() {
  const trendingTopics = [
    {
      id: 1,
      hashtag: "#VinFastVF8",
      posts: 2341,
      growth: "+25%",
      description: "Đánh giá và trải nghiệm VinFast VF8",
      category: "Xe điện",
    },
    {
      id: 2,
      hashtag: "#BMWIX3",
      posts: 1876,
      growth: "+18%",
      description: "BMW iX3 2024 ra mắt tại Việt Nam",
      category: "Xe mới",
    },
    {
      id: 3,
      hashtag: "#GiaXang",
      posts: 1654,
      growth: "+32%",
      description: "Biến động giá xăng tháng 3",
      category: "Thị trường",
    },
    {
      id: 4,
      hashtag: "#MercedesEQS",
      posts: 1432,
      growth: "+15%",
      description: "Mercedes EQS - Sedan điện hạng sang",
      category: "Luxury",
    },
    {
      id: 5,
      hashtag: "#CarMod2024",
      posts: 1234,
      growth: "+22%",
      description: "Xu hướng độ xe năm 2024",
      category: "Độ xe",
    },
  ]

  const trendingPosts = [
    {
      id: 1,
      user: {
        name: "Car Review VN",
        avatar: "/placeholder.svg",
        verified: true,
      },
      content: "Đánh giá chi tiết VinFast VF8 sau 1000km sử dụng thực tế! 🚗⚡",
      image: "/placeholder.svg?height=300&width=500",
      hashtags: ["#VinFastVF8", "#Review", "#ElectricCar"],
      stats: {
        views: 45600,
        likes: 2341,
        comments: 456,
        shares: 234,
      },
      timestamp: "2 giờ trước",
    },
    {
      id: 2,
      user: {
        name: "BMW Vietnam",
        avatar: "/placeholder.svg",
        verified: true,
      },
      content: "Giới thiệu BMW iX3 2024 - Tương lai của xe điện hạng sang đã đến Việt Nam! 🔥",
      image: "/placeholder.svg?height=300&width=500",
      hashtags: ["#BMWIX3", "#ElectricCar", "#Luxury"],
      stats: {
        views: 38900,
        likes: 1876,
        comments: 234,
        shares: 189,
      },
      timestamp: "4 giờ trước",
    },
    {
      id: 3,
      user: {
        name: "Auto News VN",
        avatar: "/placeholder.svg",
        verified: true,
      },
      content: "Giá xăng tăng mạnh - Đây có phải là thời điểm chuyển sang xe điện? 🤔",
      hashtags: ["#GiaXang", "#ElectricCar", "#Market"],
      stats: {
        views: 32100,
        likes: 1654,
        comments: 567,
        shares: 345,
      },
      timestamp: "6 giờ trước",
    },
  ]

  const trendingNews = [
    {
      id: 1,
      title: "VinFast công bố kế hoạch mở rộng thị trường quốc tế",
      category: "Tin tức",
      views: 12400,
      timestamp: "1 giờ trước",
    },
    {
      id: 2,
      title: "BMW giảm giá 10% cho tất cả dòng xe điện",
      category: "Khuyến mãi",
      views: 9800,
      timestamp: "3 giờ trước",
    },
    {
      id: 3,
      title: "Tesla Model Y chính thức có mặt tại Việt Nam",
      category: "Xe mới",
      views: 8900,
      timestamp: "5 giờ trước",
    },
    {
      id: 4,
      title: "Xu hướng độ xe điện đang nở rộ tại Việt Nam",
      category: "Độ xe",
      views: 7600,
      timestamp: "8 giờ trước",
    },
  ]

  const influencers = [
    {
      id: 1,
      name: "Car Guru VN",
      followers: "125k",
      avatar: "/placeholder.svg",
      specialty: "Đánh giá xe",
      verified: true,
    },
    {
      id: 2,
      name: "Electric Car VN",
      followers: "89k",
      avatar: "/placeholder.svg",
      specialty: "Xe điện",
      verified: true,
    },
    {
      id: 3,
      name: "Luxury Car Review",
      followers: "67k",
      avatar: "/placeholder.svg",
      specialty: "Xe sang",
      verified: false,
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
          Xu hướng
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Khám phá những chủ đề hot nhất trong cộng đồng xe hơi</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="topics" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="topics">Chủ đề hot</TabsTrigger>
              <TabsTrigger value="posts">Bài viết viral</TabsTrigger>
              <TabsTrigger value="news">Tin tức nổi bật</TabsTrigger>
            </TabsList>

            <TabsContent value="topics" className="space-y-4 mt-6">
              {trendingTopics.map((topic, index) => (
                <Card
                  key={topic.id}
                  className="hover:shadow-lg transition-all duration-300 cursor-pointer bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-blue-600 hover:text-blue-700">{topic.hashtag}</h3>
                          <Badge variant="secondary">{topic.category}</Badge>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-700 border-green-200">{topic.growth}</Badge>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-3">{topic.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Hash className="h-4 w-4 mr-1" />
                          {topic.posts.toLocaleString()} bài viết
                        </div>
                        <div className="flex items-center">
                          <TrendingUp className="h-4 w-4 mr-1" />
                          Đang thịnh hành
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Xem thêm
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="posts" className="space-y-6 mt-6">
              {trendingPosts.map((post) => (
                <Card
                  key={post.id}
                  className="hover:shadow-lg transition-all duration-300 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={post.user.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{post.user.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold">{post.user.name}</h3>
                          {post.user.verified && <Badge className="bg-blue-100 text-blue-700">✓</Badge>}
                        </div>
                        <p className="text-sm text-gray-500">{post.timestamp}</p>
                      </div>
                    </div>

                    <p className="mb-4">{post.content}</p>

                    {post.image && (
                      <div className="mb-4">
                        <Image
                          src={post.image || "/placeholder.svg"}
                          alt="Post image"
                          width={500}
                          height={300}
                          className="w-full rounded-lg object-cover"
                        />
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.hashtags.map((hashtag, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-blue-600 border-blue-200 hover:bg-blue-50 cursor-pointer"
                        >
                          {hashtag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-500 border-t pt-4">
                      <div className="flex items-center space-x-6">
                        <div className="flex items-center">
                          <Eye className="h-4 w-4 mr-1" />
                          {post.stats.views.toLocaleString()}
                        </div>
                        <div className="flex items-center">
                          <Heart className="h-4 w-4 mr-1" />
                          {post.stats.likes.toLocaleString()}
                        </div>
                        <div className="flex items-center">
                          <MessageCircle className="h-4 w-4 mr-1" />
                          {post.stats.comments}
                        </div>
                        <div className="flex items-center">
                          <Share className="h-4 w-4 mr-1" />
                          {post.stats.shares}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="news" className="space-y-4 mt-6">
              {trendingNews.map((news) => (
                <Card
                  key={news.id}
                  className="hover:shadow-md transition-shadow cursor-pointer bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm"
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary">{news.category}</Badge>
                      <span className="text-sm text-gray-500">{news.timestamp}</span>
                    </div>
                    <h3 className="font-semibold mb-2 hover:text-blue-600 transition-colors">{news.title}</h3>
                    <div className="flex items-center text-sm text-gray-500">
                      <Eye className="h-4 w-4 mr-1" />
                      {news.views.toLocaleString()} lượt xem
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Top Influencers */}
          <Card className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-orange-500" />
                Influencers nổi bật
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {influencers.map((influencer) => (
                <div key={influencer.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={influencer.avatar || "/placeholder.svg"} />
                      <AvatarFallback>{influencer.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center space-x-1">
                        <h4 className="font-medium text-sm">{influencer.name}</h4>
                        {influencer.verified && <Badge className="bg-blue-100 text-blue-700 text-xs">✓</Badge>}
                      </div>
                      <p className="text-xs text-gray-500">{influencer.specialty}</p>
                      <p className="text-xs text-gray-400">{influencer.followers} followers</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    Theo dõi
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Trending Stats */}
          <Card className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20">
            <CardHeader>
              <CardTitle>Thống kê xu hướng</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-600">156</p>
                <p className="text-sm text-gray-500">Chủ đề thịnh hành</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">2.3M</p>
                <p className="text-sm text-gray-500">Lượt tương tác hôm nay</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">45%</p>
                <p className="text-sm text-gray-500">Tăng trưởng tuần này</p>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Hành động nhanh</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Hash className="h-4 w-4 mr-2" />
                Tạo hashtag mới
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <TrendingUp className="h-4 w-4 mr-2" />
                Phân tích xu hướng
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Eye className="h-4 w-4 mr-2" />
                Xem báo cáo
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

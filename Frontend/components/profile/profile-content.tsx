"use client"

import { useState } from "react"
import { Camera, MapPin, Calendar, Star, Car, Users, Heart, MessageCircle, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PostCard } from "@/components/home/post-card"
import { CarCard } from "@/components/marketplace/car-card"

export function ProfileContent() {
  const [activeTab, setActiveTab] = useState("posts")

  const userProfile = {
    name: "Nguyễn Văn A",
    username: "@nguyenvana",
    avatar: "/placeholder.svg",
    coverImage: "/placeholder.svg?height=300&width=1200",
    bio: "Đam mê xe hơi từ nhỏ. Chuyên gia tư vấn BMW và Mercedes. Chia sẻ kinh nghiệm mua bán xe.",
    location: "Hà Nội, Việt Nam",
    joinDate: "Tham gia từ tháng 3 năm 2020",
    verified: true,
    stats: {
      posts: 156,
      followers: 2847,
      following: 892,
      carsOwned: 5,
      carsSold: 12,
    },
    interests: ["BMW", "Mercedes", "Luxury Cars", "Car Modification", "Racing"],
  }

  const userPosts = [
    {
      id: 1,
      user: {
        name: userProfile.name,
        avatar: userProfile.avatar,
        verified: true,
        role: "BMW Expert",
      },
      content: "Vừa hoàn thành việc độ lại chiếc BMW M3 của mình! Cảm giác lái thật tuyệt vời 🔥",
      images: ["/placeholder.svg?height=400&width=600"],
      likes: 124,
      comments: 23,
      shares: 5,
      timestamp: "2 giờ trước",
      location: "Hà Nội",
      tags: ["#BMW", "#M3", "#CarMod"],
    },
  ]

  const userCars = [
    {
      id: 1,
      title: "BMW X5 2020 - Như mới",
      price: "2,500,000,000",
      image: "/placeholder.svg?height=300&width=400",
      location: "Hà Nội",
      year: 2020,
      mileage: "15,000 km",
      fuel: "Xăng",
      transmission: "Tự động",
      rating: 4.8,
      seller: {
        name: userProfile.name,
        verified: true,
        rating: 4.9,
      },
      featured: true,
      condition: "Như mới",
      description: "BMW X5 2020 màu đen, nội thất kem, full option",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Cover Photo & Profile Info */}
      <Card className="overflow-hidden">
        <div className="relative">
          {/* Cover Image */}
          <div className="h-48 md:h-64 bg-gradient-to-r from-blue-500 to-purple-600 relative">
            <div className="absolute inset-0 bg-black/20"></div>
            <Button variant="secondary" size="sm" className="absolute bottom-4 right-4 bg-white/80 hover:bg-white">
              <Camera className="h-4 w-4 mr-2" />
              Đổi ảnh bìa
            </Button>
          </div>

          {/* Profile Picture */}
          <div className="absolute -bottom-16 left-6">
            <div className="relative">
              <Avatar className="h-32 w-32 border-4 border-white shadow-lg">
                <AvatarImage src={userProfile.avatar || "/placeholder.svg"} />
                <AvatarFallback className="text-2xl">{userProfile.name[0]}</AvatarFallback>
              </Avatar>
              <Button
                variant="secondary"
                size="icon"
                className="absolute bottom-2 right-2 h-8 w-8 rounded-full bg-white shadow-lg"
              >
                <Camera className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <CardContent className="pt-20 pb-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h1 className="text-2xl font-bold">{userProfile.name}</h1>
                {userProfile.verified && <Badge className="bg-blue-100 text-blue-700">✓ Đã xác thực</Badge>}
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-2">{userProfile.username}</p>
              <p className="text-gray-700 dark:text-gray-300 mb-4 max-w-2xl">{userProfile.bio}</p>

              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  {userProfile.location}
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {userProfile.joinDate}
                </div>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-6 mb-4">
                <div className="text-center">
                  <p className="text-xl font-bold text-gray-900 dark:text-gray-100">{userProfile.stats.posts}</p>
                  <p className="text-sm text-gray-500">Bài viết</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-gray-900 dark:text-gray-100">{userProfile.stats.followers}</p>
                  <p className="text-sm text-gray-500">Người theo dõi</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-gray-900 dark:text-gray-100">{userProfile.stats.following}</p>
                  <p className="text-sm text-gray-500">Đang theo dõi</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-gray-900 dark:text-gray-100">{userProfile.stats.carsOwned}</p>
                  <p className="text-sm text-gray-500">Xe sở hữu</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-gray-900 dark:text-gray-100">{userProfile.stats.carsSold}</p>
                  <p className="text-sm text-gray-500">Xe đã bán</p>
                </div>
              </div>

              {/* Interests */}
              <div className="flex flex-wrap gap-2">
                {userProfile.interests.map((interest, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                  >
                    {interest}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex space-x-2 mt-4 md:mt-0">
              <Button variant="outline">
                <MessageCircle className="h-4 w-4 mr-2" />
                Nhắn tin
              </Button>
              <Button>
                <Users className="h-4 w-4 mr-2" />
                Theo dõi
              </Button>
              <Button variant="outline" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content Tabs */}
      <Card>
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 rounded-none border-b">
              <TabsTrigger value="posts" className="flex items-center">
                <MessageCircle className="h-4 w-4 mr-2" />
                Bài viết
              </TabsTrigger>
              <TabsTrigger value="cars" className="flex items-center">
                <Car className="h-4 w-4 mr-2" />
                Xe đang bán
              </TabsTrigger>
              <TabsTrigger value="reviews" className="flex items-center">
                <Star className="h-4 w-4 mr-2" />
                Đánh giá
              </TabsTrigger>
              <TabsTrigger value="liked" className="flex items-center">
                <Heart className="h-4 w-4 mr-2" />
                Đã thích
              </TabsTrigger>
            </TabsList>

            <TabsContent value="posts" className="p-6">
              <div className="space-y-6">
                {userPosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="cars" className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {userCars.map((car) => (
                  <CarCard key={car.id} car={car} viewMode="grid" />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="p-6">
              <div className="text-center py-12">
                <Star className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Chưa có đánh giá nào</h3>
                <p className="text-gray-500 dark:text-gray-400">Đánh giá từ người mua sẽ hiển thị ở đây</p>
              </div>
            </TabsContent>

            <TabsContent value="liked" className="p-6">
              <div className="text-center py-12">
                <Heart className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Chưa có bài viết yêu thích
                </h3>
                <p className="text-gray-500 dark:text-gray-400">Các bài viết bạn thích sẽ hiển thị ở đây</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import CarAPI from "@/lib/api/car"
import userAPI from "@/lib/api/user"
import { getCurrentUser } from "@/lib/utils/get-current-user"
import { formatDateToDate } from "@/lib/utils/time-format"
import type { CarDTO } from "@/types/car"
import type { UserDTO } from "@/types/user"
import { Calendar, Camera, Car, Heart, MapPin, MessageCircle, Settings, Star, Trash2, Users } from "lucide-react"
import { useEffect, useState } from "react"
import CarEditDialog from "../car/car-edit-dialog"
import DeleteConfirmDialog from "../car/delete-confirm-dialog"
import { CarCard } from "../marketplace/car-card"
import { EditProfileDialog } from "./edit-profile-dialog"


export function ProfileContent() {
  const [activeTab, setActiveTab] = useState("posts")
  const [userProfile, setUserProfile] = useState<UserDTO>()
  const [userCars, setUserCars] = useState<CarDTO[]>([])
  const currentUser = getCurrentUser()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedCar, setSelectedCar] = useState<CarDTO>()

  const fetchUserProfile = async (id: number) => {
    try {
      const res = await userAPI.findById(id)
      if (res.status === 200) {
        setUserProfile(res.data)
      }
    } catch (error) {
      console.log("Lỗi khi lấy dữ liệu người dùng")
    }
  }

  const fetchUserCars = async (userId: number) => {
    try {
      const res = await CarAPI.getByUserId(userId)
      console.log(res)
      if (res.status === 200) {
        setUserCars(res.data)
      }
    } catch (error) {
      console.log("Lỗi khi lấy dữ liệu người dùng")
    }
  }

  useEffect(() => {
    fetchUserProfile(Number(currentUser?.id))
    fetchUserCars(Number(currentUser?.id))
  }, [])

  const handleDelete = async (id: number) => {
    const res = await CarAPI.deleteCarById(id)
    if (res.status === 200) {
      fetchUserCars(Number(currentUser?.id))
      setIsDeleteDialogOpen(false)
    }
  }

  const handleProfileUpdate = () => {
    fetchUserProfile(Number(currentUser?.id))
  }

  return (
    <div className="space-y-6">
      {/* Cover Photo & Profile Info */}
      <Card className="overflow-hidden">
        <div className="relative">
          {/* Cover Image */}
          <div className="h-48 md:h-64 bg-gradient-to-r from-blue-500 to-purple-600 relative">
            <div className="absolute inset-0 bg-black/20"></div>
            <Button
              variant="secondary"
              size="sm"
              className="absolute bottom-4 right-4 bg-white text-gray-900 hover:bg-gray-100 border shadow-sm"
            >
              <Camera className="h-4 w-4 mr-2" />
              Đổi ảnh bìa
            </Button>
          </div>

          {/* Profile Picture */}
          <div className="absolute -bottom-16 left-6">
            <div className="relative">
              <Avatar className="h-32 w-32 border-4 border-white shadow-lg">
                <AvatarImage src={userProfile?.profilePicture || "/placeholder.svg"} />
                <AvatarFallback className="text-2xl">{userProfile?.firstName[0]}</AvatarFallback>
              </Avatar>
              <Button
                variant="secondary"
                size="icon"
                className="absolute bottom-2 right-2 h-8 w-8 rounded-full bg-white text-gray-900 hover:bg-gray-100 shadow-lg border"
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
                <h1 className="text-2xl font-bold">{userProfile?.fullName}</h1>
                {userProfile?.verified && <Badge className="bg-blue-100 text-blue-700">✓ Đã xác thực</Badge>}
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-2">@{userProfile?.username}</p>
              <p className="text-gray-700 dark:text-gray-300 mb-4 max-w-2xl">{userProfile?.bio}</p>

              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  {userProfile?.location}
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {formatDateToDate(userProfile?.createdAt)}
                </div>
              </div>

              {/* Stats */}
              {/* <div className="flex flex-wrap gap-6 mb-4">
                <div className="text-center">
                  <p className="text-xl font-bold text-gray-900 dark:text-gray-100">{userProfile?.stats.posts}</p>
                  <p className="text-sm text-gray-500">Bài viết</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-gray-900 dark:text-gray-100">{userProfile?.stats.followers}</p>
                  <p className="text-sm text-gray-500">Người theo dõi</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-gray-900 dark:text-gray-100">{userProfile?.stats.following}</p>
                  <p className="text-sm text-gray-500">Đang theo dõi</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-gray-900 dark:text-gray-100">{userProfile?.stats.carsOwned}</p>
                  <p className="text-sm text-gray-500">Xe sở hữu</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-gray-900 dark:text-gray-100">{userProfile?.stats.carsSold}</p>
                  <p className="text-sm text-gray-500">Xe đã bán</p>
                </div>
              </div> */}

              {/* Interests */}
              {/* <div className="flex flex-wrap gap-2">
                {userProfile?.interests.map((interest, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                  >
                    {interest}
                  </Badge>
                ))}
              </div> */}
            </div>

            <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
              {/* {userProfile && <EditProfileDialog user={userProfile} onProfileUpdate={handleProfileUpdate} />} */}
              <Button
                variant="outline"
                className="bg-background text-foreground border-border hover:bg-accent hover:text-accent-foreground"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Nhắn tin
              </Button>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Users className="h-4 w-4 mr-2" />
                Theo dõi
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="bg-background text-foreground border-border hover:bg-accent hover:text-accent-foreground"
              >
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

            {/* <TabsContent value="posts" className="p-6">
              <div className="space-y-6">
                {userPosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            </TabsContent> */}

            <TabsContent value="cars" className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {userCars.map((car) => (
                  <Card className="bg-card border-border" key={car?.id}>
                    <CarCard
                      key={car.id}
                      car={car}
                      viewMode="grid"
                    />
                    <Card className="bg-card border-border">
                      <CardContent className="p-4">
                        {/* <h4 className="font-semibold text-card-foreground mb-3">Quản lý tin đăng</h4> */}
                        <div className="flex gap-2">
                          <CarEditDialog
                            car={car}
                            triggerText="Chỉnh sửa"
                            triggerVariant="outline"
                            onRefresh={fetchUserCars}
                          />
                          <Button onClick={() => {
                            setIsDeleteDialogOpen(true);
                            setSelectedCar(car)
                          }} variant="destructive" className="flex-1">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Xóa tin
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </Card>
                ))}
              </div>
              <DeleteConfirmDialog
                isOpen={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                onConfirm={() => handleDelete(Number(selectedCar?.id))}
                carId={selectedCar?.id}
                carName={selectedCar?.title}
              />
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

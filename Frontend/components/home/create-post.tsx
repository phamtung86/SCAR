"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { getCurrentUser } from "@/lib/utils/get-current-user"
import { Car, ImageIcon, MapPin, Smile, Users, Video, Loader2 } from "lucide-react"
import { useState, useEffect } from "react"
import CarSellingForm from "../car/car-selling-form"
import { useRouter } from "next/navigation"
import PostAPI, { CreatePostRequest } from "@/lib/api/post"


export function CreatePost() {
  const [isCarSellModalOpen, setIsCarSellModalOpen] = useState(false)
  const [content, setContent] = useState("")
  const [location, setLocation] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [selectedImages, setSelectedImages] = useState<string[]>([]) // For preview URLs
  const [files, setFiles] = useState<File[]>([]) // For actual file objects
  const [isClient, setIsClient] = useState(false)
  const route = useRouter()

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Only get user on client-side to avoid hydration issues
  const user = isClient ? getCurrentUser() : null;
  const isUserAuthenticated = !!user;

  const handleCarSellClick = () => {
    if (user) {
      setIsCarSellModalOpen(true)
    } else {
      route.push('/auth')
    }
  }

  const handleCloseModal = () => {
    setIsCarSellModalOpen(false)
  }

  const handleCheckAuth = () => {
    if (!user) {
      route.push('/auth')
    }
  }

  const handleCreatePost = async () => {
    if (!user || !user.id) {
      route.push('/auth')
      return
    }

    if (!content.trim()) {
      alert("Vui lòng nhập nội dung bài viết")
      return
    }

    setIsLoading(true)
    try {
      // Create a real FormData object with all the data
      const formData = new FormData();
      formData.append('content', content);
      formData.append('userId', user.id.toString()); // Add the userId as required by backend

      if (location) {
        formData.append('location', location);
      }

      // Append image files if they exist
      files.forEach((file, index) => {
        formData.append('images', file);
      });

      await PostAPI.createPost(formData)

      // Reset form
      setContent("")
      setLocation("")
      setSelectedImages([])
      setFiles([])

      // Optionally refresh the feed or show success message
      alert("Đăng bài thành công!")
    } catch (error) {
      console.error("Lỗi khi tạo bài viết:", error)
      alert("Có lỗi xảy ra khi đăng bài. Vui lòng thử lại.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files)
      // Create preview URLs for the images
      const newImageUrls = newFiles.map(file => URL.createObjectURL(file))

      // Update both the preview URLs and file objects
      setSelectedImages(prev => [...prev, ...newImageUrls])
      setFiles(prev => [...prev, ...newFiles])
    }
  }

  return (
    <>
      <Card className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50 shadow-lg">
        <CardContent className="p-6">
          <div className="flex space-x-4">
            <Avatar className="ring-2 ring-blue-500/20">
              <AvatarImage src={user?.avatar || "/placeholder.svg"} />
              <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                {user?.name ? user.name[0].toUpperCase() : 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Textarea
                placeholder="Bạn đang nghĩ gì về xe hơi? Chia sẻ kinh nghiệm, hình ảnh xe của bạn..."
                className="border-none resize-none focus:ring-0 text-lg bg-gray-50 dark:bg-gray-800/50 rounded-xl min-h-[100px]"
                rows={3}
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />

              {/* Selected images preview */}
              {selectedImages.length > 0 && (
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {selectedImages.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`Preview ${index}`}
                        className="rounded-lg h-20 w-full object-cover"
                      />
                      <button
                        type="button"
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => {
                          // Remove both the preview URL and the corresponding file
                          setSelectedImages(prev => prev.filter((_, i) => i !== index));
                          setFiles(prev => prev.filter((_, i) => i !== index));
                        }}
                      >
                        <span className="sr-only">Xóa ảnh</span>
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between mt-4">
                <div className="flex flex-wrap gap-2">
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600"
                      onClick={handleCheckAuth}
                      disabled={!isUserAuthenticated}
                    >
                      <ImageIcon className="mr-2 h-4 w-4" />
                      Ảnh
                    </Button>
                  </label>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hover:bg-green-50 dark:hover:bg-green-900/20 text-green-600"
                    onClick={handleCheckAuth}
                    disabled={!isUserAuthenticated}
                  >
                    <Video className="mr-2 h-4 w-4" />
                    Video
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hover:bg-purple-50 dark:hover:bg-purple-900/20 text-purple-600"
                    onClick={handleCarSellClick}
                    disabled={!isUserAuthenticated}
                  >
                    <Car className="mr-2 h-4 w-4" />
                    Bán xe
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hover:bg-orange-50 dark:hover:bg-orange-900/20 text-orange-600"
                    onClick={handleCheckAuth}
                    disabled={!isUserAuthenticated}
                  >
                    <MapPin className="mr-2 h-4 w-4" />
                    Địa điểm
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hover:bg-yellow-50 dark:hover:bg-yellow-900/20 text-yellow-600"
                    onClick={handleCheckAuth}
                    disabled={!isUserAuthenticated}
                  >
                    <Smile className="mr-2 h-4 w-4" />
                    Cảm xúc
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hover:bg-indigo-50 dark:hover:bg-indigo-900/20 text-indigo-600"
                    onClick={handleCheckAuth}
                    disabled={!isUserAuthenticated}
                  >
                    <Users className="mr-2 h-4 w-4" />
                    Tag bạn bè
                  </Button>
                </div>
                <Button
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg"
                  onClick={handleCreatePost}
                  disabled={isLoading || !isUserAuthenticated || !content.trim()}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Đang đăng...
                    </>
                  ) : (
                    "Đăng bài"
                  )}
                </Button>
              </div>

              <div className="flex flex-wrap gap-2 mt-3">
                <Badge
                  variant="secondary"
                  className={`bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 cursor-pointer ${location ? 'ring-2 ring-blue-500' : ''}`}
                  onClick={() => setLocation(location ? '' : 'Hà Nội')}
                >
                  <MapPin className="mr-1 h-3 w-3" />
                  {location || 'Thêm địa điểm'}
                </Badge>
                <Badge
                  variant="secondary"
                  className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 cursor-pointer"
                  onClick={() => setContent(content + ' #BMW')}
                >
                  #BMW
                </Badge>
                <Badge
                  variant="secondary"
                  className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 cursor-pointer"
                  onClick={() => setContent(content + ' #Mercedes')}
                >
                  #Mercedes
                </Badge>
                <Badge
                  variant="secondary"
                  className="bg-gray-100 dark:bg-gray-800/30 text-gray-700 dark:text-gray-300 cursor-pointer"
                  onClick={() => setContent(content + ' #Toyota')}
                >
                  #Toyota
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Car Selling Modal */}
      <Dialog open={isCarSellModalOpen} onOpenChange={setIsCarSellModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Car className="h-5 w-5" />
              Đăng tin bán xe
            </DialogTitle>
          </DialogHeader>
          <CarSellingForm onCancel={handleCloseModal} />
        </DialogContent>
      </Dialog>
    </>
  )
}

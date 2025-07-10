"use client"

import { Heart, MessageCircle, Share, MoreHorizontal, MapPin, Verified, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { useState } from "react"

interface Post {
  id: number
  user: {
    name: string
    avatar: string
    verified: boolean
    role: string
  }
  content: string
  images?: string[]
  likes: number
  comments: number
  shares: number
  timestamp: string
  location?: string
  tags?: string[]
}

interface PostCardProps {
  post: Post
}

export function PostCard({ post }: PostCardProps) {
  const [liked, setLiked] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  return (
    <Card className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Avatar className="ring-2 ring-blue-500/20">
              <AvatarImage src={post.user.avatar || "/placeholder.svg"} />
              <AvatarFallback>{post.user.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-gray-900 dark:text-gray-100">{post.user.name}</span>
                {post.user.verified && <Verified className="w-4 h-4 text-blue-500 fill-current" />}
                <Badge variant="secondary" className="text-xs">
                  {post.user.role}
                </Badge>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                <span>{post.timestamp}</span>
                {post.location && (
                  <>
                    <span>•</span>
                    <div className="flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      {post.location}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="hover:bg-gray-100 dark:hover:bg-gray-800">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <p className="mb-4 text-gray-800 dark:text-gray-200 leading-relaxed">{post.content}</p>

        {/* Tags */}
        {post.tags && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag, index) => (
              <Badge
                key={index}
                variant="outline"
                className="text-blue-600 border-blue-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer"
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Images */}
        {post.images && post.images.length > 0 && (
          <div className="mb-4 relative">
            <div className="relative rounded-xl overflow-hidden">
              <Image
                src={post.images[currentImageIndex] || "/placeholder.svg"}
                alt="Post image"
                width={600}
                height={400}
                className="w-full h-96 object-cover"
              />
              {post.images.length > 1 && (
                <>
                  <div className="absolute top-4 right-4 bg-black/50 text-white px-2 py-1 rounded-full text-sm">
                    {currentImageIndex + 1}/{post.images.length}
                  </div>
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {post.images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          index === currentImageIndex ? "bg-white" : "bg-white/50"
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4 py-2 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Heart className="h-4 w-4 text-red-500" />
              <span>{post.likes} lượt thích</span>
            </div>
            <div className="flex items-center space-x-1">
              <Eye className="h-4 w-4" />
              <span>{post.likes * 3} lượt xem</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span>{post.comments} bình luận</span>
            <span>{post.shares} chia sẻ</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-4">
          <Button
            variant="ghost"
            className={`flex-1 ${liked ? "text-red-500 hover:text-red-600" : "hover:text-red-500"} transition-colors`}
            onClick={() => setLiked(!liked)}
          >
            <Heart className={`mr-2 h-4 w-4 ${liked ? "fill-current" : ""}`} />
            {liked ? "Đã thích" : "Thích"}
          </Button>
          <Button variant="ghost" className="flex-1 hover:text-blue-500 transition-colors">
            <MessageCircle className="mr-2 h-4 w-4" />
            Bình luận
          </Button>
          <Button variant="ghost" className="flex-1 hover:text-green-500 transition-colors">
            <Share className="mr-2 h-4 w-4" />
            Chia sẻ
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

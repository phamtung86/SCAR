import { Heart, MessageCircle, Share, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Image from "next/image"

interface Post {
  id: number
  user: {
    name: string
    avatar: string
    verified: boolean
  }
  content: string
  image?: string
  likes: number
  comments: number
  shares: number
  timestamp: string
}

interface PostCardProps {
  post: Post
}

export function PostCard({ post }: PostCardProps) {
  return (
    <Card>
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src={post.user.avatar || "/placeholder.svg"} />
              <AvatarFallback>{post.user.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center space-x-1">
                <span className="font-semibold">{post.user.name}</span>
                {post.user.verified && (
                  <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                )}
              </div>
              <span className="text-sm text-gray-500">{post.timestamp}</span>
            </div>
          </div>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <p className="mb-3">{post.content}</p>

        {/* Image */}
        {post.image && (
          <div className="mb-3">
            <Image
              src={post.image || "/placeholder.svg"}
              alt="Post image"
              width={600}
              height={400}
              className="w-full rounded-lg object-cover"
            />
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
          <span>{post.likes} lượt thích</span>
          <div className="space-x-4">
            <span>{post.comments} bình luận</span>
            <span>{post.shares} chia sẻ</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between border-t pt-3">
          <Button variant="ghost" className="flex-1">
            <Heart className="mr-2 h-4 w-4" />
            Thích
          </Button>
          <Button variant="ghost" className="flex-1">
            <MessageCircle className="mr-2 h-4 w-4" />
            Bình luận
          </Button>
          <Button variant="ghost" className="flex-1">
            <Share className="mr-2 h-4 w-4" />
            Chia sẻ
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

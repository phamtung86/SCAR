"use client"

import { Heart, MessageCircle, Share, MoreHorizontal, MapPin, Verified, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { useState } from "react"
import { UserDTO } from "@/types/user"
import { getCurrentUser } from "@/lib/utils/get-current-user"
import PostAPI from "@/lib/api/post"

interface Post {
  id: number
  userId: number
  user: UserDTO
  content: string
  images?: string[] // URLs of images
  likes: number
  comments: number
  shares: number
  timestamp: string
  createdDate: string
  updatedDate?: string
  visibility: string
  isEdited: boolean
  isDeleted: boolean
  location?: string // Adding location back if it's available from other sources
  tags?: string[] // Adding tags back if available
}

interface PostCardProps {
  post: Post
}

export function PostCard({ post }: PostCardProps) {
  const [liked, setLiked] = useState(() => {
    // Check if user has already liked this post based on the initial data
    if (post.likes && typeof post.likes === 'object' && post.likes.length > 0) {
      // This assumes the backend sends user-specific like data
      const userId = getCurrentUser()?.id;
      return userId ? post.likes.some((like: any) => like.userId === userId) : false;
    }
    // Fallback: if likes is just a number, we can't determine if user liked it
    return false;
  });

  const [likeCount, setLikeCount] = useState(post.likes && typeof post.likes === 'object' ? post.likes.length : post.likes || 0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState(post.comments || []);

  const handleLike = async () => {
    if (!getCurrentUser()) {
      // Redirect to login if not authenticated
      window.location.href = '/auth';
      return;
    }

    const previousLikedState = liked;
    const previousLikeCount = likeCount;

    try {
      // Optimistically update UI
      setLiked(!liked);
      setLikeCount(prev => liked ? prev - 1 : prev + 1);

      // Call the real API
      if (!previousLikedState) {
        // Like the post
        await PostAPI.likePost(post.id);
      } else {
        // Unlike the post
        await PostAPI.unlikePost(post.id);
      }
    } catch (error) {
      console.error("Lỗi khi thích bài viết:", error);
      // Revert the optimistic update if the API call fails
      setLiked(previousLikedState);
      setLikeCount(previousLikeCount);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !getCurrentUser()) {
      return;
    }

    const currentUser = getCurrentUser();
    const commentData = {
      content: newComment,
      user: {
        id: currentUser?.id,
        fullName: currentUser?.fullName,
        profilePicture: currentUser?.profilePicture
      },
      createdDate: new Date().toISOString()
    };

    try {
      // Optimistically add the comment
      setComments(prev => [...prev, commentData]);
      setNewComment("");

      // Call the actual API to submit the comment
      await PostAPI.commentOnPost(post.id, newComment);
    } catch (error) {
      console.error("Lỗi khi bình luận bài viết:", error);
      // Revert the optimistic update if the API call fails
      setComments(prev => prev.slice(0, -1));
    }
  };

  return (
    <Card className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Avatar className="ring-2 ring-blue-500/20">
              <AvatarImage src={post.user.profilePicture || "/placeholder.svg"} />
              <AvatarFallback>{post.user.fullName ? post.user.fullName[0].toUpperCase() : 'U'}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-gray-900 dark:text-gray-100">{post.user.fullName || 'Unknown User'}</span>
                {post.user.verified && <Verified className="w-4 h-4 text-blue-500 fill-current" />}
                <Badge variant="secondary" className="text-xs">
                  {post.user.role || 'Member'}
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
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null; // prevents infinite loop if fallback also fails
                  target.src = "/placeholder.svg"; // fallback image
                }}
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
                        className={`w-2 h-2 rounded-full transition-all ${index === currentImageIndex ? "bg-white" : "bg-white/50"
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
              <span>{likeCount} lượt thích</span>
            </div>
            <div className="flex items-center space-x-1">
              <Eye className="h-4 w-4" />
              <span>{likeCount * 3} lượt xem</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span>{comments.length} bình luận</span>
            <span>{post.shares || 0} chia sẻ</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-4">
          <Button
            variant="ghost"
            className={`flex-1 ${liked ? "text-red-500 hover:text-red-600" : "hover:text-red-500"} transition-colors`}
            onClick={handleLike}
          >
            <Heart className={`mr-2 h-4 w-4 ${liked ? "fill-current" : ""}`} />
            {liked ? "Đã thích" : "Thích"}
          </Button>
          <Button
            variant="ghost"
            className="flex-1 hover:text-blue-500 transition-colors"
            onClick={() => setShowCommentBox(!showCommentBox)}
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            Bình luận
          </Button>
          <Button variant="ghost" className="flex-1 hover:text-green-500 transition-colors">
            <Share className="mr-2 h-4 w-4" />
            Chia sẻ
          </Button>
        </div>

        {/* Comments Section */}
        {showCommentBox && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            {/* Comment Input */}
            <form onSubmit={handleCommentSubmit} className="flex items-center space-x-2 mb-4">
              <Avatar className="h-8 w-8">
                <AvatarImage src={getCurrentUser()?.avatar || "/placeholder.svg"} />
                <AvatarFallback>{getCurrentUser()?.fullName ? getCurrentUser()?.fullName[0].toUpperCase() : 'U'}</AvatarFallback>
              </Avatar>
              <div className="flex-1 flex">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Viết bình luận..."
                  className="flex-1 border rounded-l-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
                />
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 rounded-l-none"
                  disabled={!newComment.trim()}
                >
                  Đăng
                </Button>
              </div>
            </form>

            {/* Comments List */}
            <div className="space-y-3">
              {comments?.map((comment: any, index: number) => (
                <div key={index} className="flex items-start space-x-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={comment.user?.avatar || "/placeholder.svg"} />
                    <AvatarFallback>{comment.user?.name ? comment.user.name[0].toUpperCase() : 'U'}</AvatarFallback>
                  </Avatar>
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2 flex-1">
                    <div className="font-semibold text-sm">{comment.user?.fullName}</div>
                    <p className="text-sm">{comment.content}</p>
                    <div className="text-xs text-gray-500 mt-1">Vừa xong</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

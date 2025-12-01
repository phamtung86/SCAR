"use client"

import { CreatePost } from "@/components/home/create-post"
import { PostCard } from "@/components/home/post-card"
import { MarketplacePreview } from "@/components/home/marketplace-preview"
import { StoriesSection } from "@/components/home/stories-section"
import { useEffect, useState } from "react"
import PostAPI, { PostType } from "@/lib/api/post"

// Helper function to format timestamp
const formatTimestamp = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return `${diffInSeconds} giây trước`;
  }
  if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} phút trước`;
  }
  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} giờ trước`;
  }
  const days = Math.floor(diffInSeconds / 86400);
  return `${days} ngày trước`;
};

export function NewsFeed() {
  const [posts, setPosts] = useState<PostType[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await PostAPI.getPosts()
        if (response.status === 200) {
          // Transform the response data to match our expected format
          console.log(response.data);

          const transformedPosts = response.data.map((post: any) => ({
            ...post,
            userId: post?.user?.id,
            timestamp: formatTimestamp(post.createdDate),
            // Convert image URLs to match expected format
            images: post.images?.map((img: any) => img.imageUrl) || [],
            // Calculate likes and comments count from the response
            likes: post.likes?.length || 0,
            comments: post.comments?.length || 0,
            shares: 0 // Shares not available in the backend DTO, default to 0
          }));
          setPosts(transformedPosts);
        } else {
          // Fallback to sample data if API fails
          setPosts([

          ])
        }
      } catch (error) {
        console.error("Lỗi khi lấy bài viết:", error)
        // Fallback to sample data if API fails
        setPosts([
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <StoriesSection />
        <CreatePost />
        <MarketplacePreview />
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <StoriesSection />
      <CreatePost />
      <MarketplacePreview />

      <div className="space-y-6">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  )
}

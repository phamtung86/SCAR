import { CreatePost } from "@/components/home/create-post"
import { PostCard } from "@/components/home/post-card"
import { MarketplacePreview } from "@/components/home/marketplace-preview"
import { StoriesSection } from "@/components/home/stories-section"

export function NewsFeed() {
  const posts = [
    {
      id: 1,
      user: {
        name: "Nguyễn Văn A",
        avatar: "/placeholder.svg",
        verified: true,
        role: "BMW Expert",
      },
      content:
        "Vừa hoàn thành việc độ lại chiếc BMW M3 của mình! Cảm giác lái thật tuyệt vời 🔥 Ai có kinh nghiệm về việc tune ECU không?",
      images: ["/placeholder.svg?height=400&width=600", "/placeholder.svg?height=400&width=600"],
      likes: 124,
      comments: 23,
      shares: 5,
      timestamp: "2 giờ trước",
      location: "Hà Nội",
      tags: ["#BMW", "#M3", "#CarMod"],
    },
    {
      id: 2,
      user: {
        name: "Trần Thị B",
        avatar: "/placeholder.svg",
        verified: false,
        role: "Car Enthusiast",
      },
      content:
        "Ai có kinh nghiệm về việc bảo dưỡng Mercedes C-Class không? Mình cần tư vấn về việc thay dầu máy và kiểm tra hệ thống phanh.",
      likes: 45,
      comments: 12,
      shares: 2,
      timestamp: "4 giờ trước",
      tags: ["#Mercedes", "#Maintenance"],
    },
    {
      id: 3,
      user: {
        name: "Lê Minh C",
        avatar: "/placeholder.svg",
        verified: true,
        role: "Car Dealer",
      },
      content:
        "Vừa nhập về lô xe Toyota Camry 2024 mới nhất! Giá cực tốt cho anh em. Inbox để được tư vấn chi tiết nhé! 🚗✨",
      images: ["/placeholder.svg?height=400&width=600"],
      likes: 89,
      comments: 34,
      shares: 12,
      timestamp: "6 giờ trước",
      location: "TP.HCM",
      tags: ["#Toyota", "#Camry2024", "#NewCar"],
    },
  ]

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

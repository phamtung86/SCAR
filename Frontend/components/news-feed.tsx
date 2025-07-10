import { CreatePost } from "@/components/create-post"
import { PostCard } from "@/components/post-card"
import { MarketplaceCard } from "@/components/marketplace-card"

export function NewsFeed() {
  const posts = [
    {
      id: 1,
      user: {
        name: "Nguyễn Văn A",
        avatar: "/placeholder.svg",
        verified: true,
      },
      content: "Vừa hoàn thành việc độ lại chiếc BMW M3 của mình! Cảm giác lái thật tuyệt vời 🔥",
      image: "/placeholder.svg?height=400&width=600",
      likes: 124,
      comments: 23,
      shares: 5,
      timestamp: "2 giờ trước",
    },
    {
      id: 2,
      user: {
        name: "Trần Thị B",
        avatar: "/placeholder.svg",
        verified: false,
      },
      content: "Ai có kinh nghiệm về việc bảo dưỡng Mercedes C-Class không? Mình cần tư vấn về việc thay dầu máy.",
      likes: 45,
      comments: 12,
      shares: 2,
      timestamp: "4 giờ trước",
    },
  ]

  const marketplaceItems = [
    {
      id: 1,
      title: "BMW X5 2020 - Như mới",
      price: "2,500,000,000",
      image: "/placeholder.svg?height=200&width=300",
      location: "Hà Nội",
      year: 2020,
      mileage: "15,000 km",
    },
    {
      id: 2,
      title: "Mercedes C200 2019",
      price: "1,800,000,000",
      image: "/placeholder.svg?height=200&width=300",
      location: "TP.HCM",
      year: 2019,
      mileage: "25,000 km",
    },
  ]

  return (
    <div className="space-y-6">
      <CreatePost />

      {/* Marketplace Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-bold mb-4">🚗 Chợ xe nổi bật</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {marketplaceItems.map((item) => (
            <MarketplaceCard key={item.id} item={item} />
          ))}
        </div>
      </div>

      {/* Posts */}
      <div className="space-y-4">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  )
}

import { TrendingUp, Users, Calendar } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function RightSidebar() {
  const trendingTopics = [
    { tag: "#BMW2024", posts: "1.2k bài viết" },
    { tag: "#MercedesEQS", posts: "856 bài viết" },
    { tag: "#ToyotaCamry", posts: "634 bài viết" },
    { tag: "#HondaCivic", posts: "423 bài viết" },
  ]

  const suggestedUsers = [
    { name: "Lê Văn C", role: "Chuyên gia BMW", avatar: "/placeholder.svg" },
    { name: "Phạm Thị D", role: "Dealer Mercedes", avatar: "/placeholder.svg" },
    { name: "Hoàng Văn E", role: "Thợ độ xe", avatar: "/placeholder.svg" },
  ]

  const upcomingEvents = [
    { name: "Vietnam Motor Show 2024", date: "15/03/2024", location: "SECC, TP.HCM" },
    { name: "BMW Test Drive Event", date: "22/03/2024", location: "Hà Nội" },
  ]

  return (
    <aside className="w-80 p-4 space-y-4">
      {/* Trending Topics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="mr-2 h-4 w-4" />
            Xu hướng
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {trendingTopics.map((topic, index) => (
            <div key={index} className="flex justify-between items-center">
              <div>
                <p className="font-semibold text-blue-600">{topic.tag}</p>
                <p className="text-sm text-gray-500">{topic.posts}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Suggested Users */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="mr-2 h-4 w-4" />
            Gợi ý kết bạn
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {suggestedUsers.map((user, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                <div>
                  <p className="font-semibold text-sm">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.role}</p>
                </div>
              </div>
              <Button size="sm" variant="outline">
                Kết bạn
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Upcoming Events */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="mr-2 h-4 w-4" />
            Sự kiện sắp tới
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {upcomingEvents.map((event, index) => (
            <div key={index} className="border-l-4 border-blue-500 pl-3">
              <p className="font-semibold text-sm">{event.name}</p>
              <p className="text-xs text-gray-500">{event.date}</p>
              <p className="text-xs text-gray-500">{event.location}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </aside>
  )
}

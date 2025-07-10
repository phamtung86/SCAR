import { TrendingUp, Users, Calendar, Award, Zap } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function RightSidebar() {
  const trendingTopics = [
    { tag: "#BMW2024", posts: "1.2k bài viết", trend: "+15%" },
    { tag: "#MercedesEQS", posts: "856 bài viết", trend: "+8%" },
    { tag: "#ToyotaCamry", posts: "634 bài viết", trend: "+12%" },
    { tag: "#HondaCivic", posts: "423 bài viết", trend: "+5%" },
    { tag: "#ElectricCars", posts: "789 bài viết", trend: "+25%" },
  ]

  const suggestedUsers = [
    {
      name: "Lê Văn C",
      role: "Chuyên gia BMW",
      avatar: "/placeholder.svg",
      followers: "2.5k",
      verified: true,
    },
    {
      name: "Phạm Thị D",
      role: "Dealer Mercedes",
      avatar: "/placeholder.svg",
      followers: "1.8k",
      verified: true,
    },
    {
      name: "Hoàng Văn E",
      role: "Thợ độ xe",
      avatar: "/placeholder.svg",
      followers: "3.2k",
      verified: false,
    },
  ]

  const upcomingEvents = [
    {
      name: "Vietnam Motor Show 2024",
      date: "15/03/2024",
      location: "SECC, TP.HCM",
      attendees: "5.2k",
      type: "Triển lãm",
    },
    {
      name: "BMW Test Drive Event",
      date: "22/03/2024",
      location: "Hà Nội",
      attendees: "1.5k",
      type: "Lái thử",
    },
    {
      name: "Car Modification Contest",
      date: "28/03/2024",
      location: "Đà Nẵng",
      attendees: "800",
      type: "Thi đua",
    },
  ]

  const carNews = [
    {
      title: "VinFast ra mắt mẫu xe điện mới",
      time: "2 giờ trước",
      category: "Tin tức",
    },
    {
      title: "Giá xăng tăng mạnh trong tuần này",
      time: "4 giờ trước",
      category: "Thị trường",
    },
    {
      title: "BMW giảm giá 10% cho tất cả dòng xe",
      time: "6 giờ trước",
      category: "Khuyến mãi",
    },
  ]

  return (
    <aside className="w-80 p-4 space-y-4">
      {/* Trending Topics */}
      <Card className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50">
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <TrendingUp className="mr-2 h-5 w-5 text-orange-500" />
            Xu hướng
            <Badge className="ml-2 bg-orange-100 text-orange-700">HOT</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {trendingTopics.map((topic, index) => (
            <div
              key={index}
              className="flex justify-between items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
            >
              <div>
                <p className="font-semibold text-blue-600 hover:text-blue-700">{topic.tag}</p>
                <p className="text-sm text-gray-500">{topic.posts}</p>
              </div>
              <Badge variant="outline" className="text-green-600 border-green-200">
                {topic.trend}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Suggested Users */}
      <Card className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50">
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <Users className="mr-2 h-5 w-5 text-blue-500" />
            Gợi ý kết bạn
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {suggestedUsers.map((user, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10 ring-2 ring-blue-500/20">
                  <AvatarImage src={user.avatar || "/placeholder.svg"} />
                  <AvatarFallback>{user.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center space-x-1">
                    <p className="font-semibold text-sm">{user.name}</p>
                    {user.verified && <Award className="h-3 w-3 text-blue-500" />}
                  </div>
                  <p className="text-xs text-gray-500">{user.role}</p>
                  <p className="text-xs text-gray-400">{user.followers} người theo dõi</p>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200"
              >
                Kết bạn
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Car News */}
      <Card className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50">
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <Zap className="mr-2 h-5 w-5 text-yellow-500" />
            Tin tức xe hơi
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {carNews.map((news, index) => (
            <div
              key={index}
              className="p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer border-l-4 border-blue-500"
            >
              <h4 className="font-medium text-sm line-clamp-2 mb-1">{news.title}</h4>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{news.time}</span>
                <Badge variant="secondary" className="text-xs">
                  {news.category}
                </Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Upcoming Events */}
      <Card className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-purple-200/50 dark:border-purple-700/50">
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <Calendar className="mr-2 h-5 w-5 text-purple-500" />
            Sự kiện sắp tới
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {upcomingEvents.map((event, index) => (
            <div
              key={index}
              className="p-3 bg-white/70 dark:bg-gray-800/70 rounded-lg border-l-4 border-purple-500 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-sm line-clamp-1">{event.name}</h4>
                <Badge variant="outline" className="text-xs">
                  {event.type}
                </Badge>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">{event.date}</p>
              <p className="text-xs text-gray-500 mb-2">{event.location}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-green-600">{event.attendees} người tham gia</span>
                <Button size="sm" variant="outline" className="text-xs h-6">
                  Quan tâm
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </aside>
  )
}

"use client"

import { Plus } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function StoriesSection() {
  const stories = [
    { id: 1, user: "Bạn", avatar: "/placeholder.svg", isOwn: true },
    { id: 2, user: "Nguyễn A", avatar: "/placeholder.svg", hasStory: true },
    { id: 3, user: "Trần B", avatar: "/placeholder.svg", hasStory: true },
    { id: 4, user: "Lê C", avatar: "/placeholder.svg", hasStory: true },
    { id: 5, user: "Phạm D", avatar: "/placeholder.svg", hasStory: true },
    { id: 6, user: "Hoàng E", avatar: "/placeholder.svg", hasStory: true },
  ]

  return (
    <Card className="p-4 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50">
      <div className="flex space-x-4 overflow-x-auto pb-2">
        {stories.map((story) => (
          <div key={story.id} className="flex flex-col items-center space-y-2 min-w-[80px] cursor-pointer group">
            <div
              className={`relative ${story.isOwn ? "" : "ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-gray-900"} rounded-full p-1 group-hover:scale-105 transition-transform`}
            >
              <Avatar className="h-16 w-16">
                <AvatarImage src={story.avatar || "/placeholder.svg"} />
                <AvatarFallback>{story.user[0]}</AvatarFallback>
              </Avatar>
              {story.isOwn && (
                <div className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-1">
                  <Plus className="h-3 w-3 text-white" />
                </div>
              )}
            </div>
            <span className="text-xs text-center font-medium text-gray-700 dark:text-gray-300 truncate w-full">
              {story.user}
            </span>
          </div>
        ))}
      </div>
    </Card>
  )
}

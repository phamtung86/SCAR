import { ImageIcon, Video, MapPin, Smile } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function CreatePost() {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex space-x-3">
          <Avatar>
            <AvatarImage src="/placeholder.svg" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <Textarea
              placeholder="Bạn đang nghĩ gì về xe hơi?"
              className="border-none resize-none focus:ring-0 text-lg"
              rows={3}
            />
            <div className="flex items-center justify-between mt-3">
              <div className="flex space-x-4">
                <Button variant="ghost" size="sm">
                  <ImageIcon className="mr-2 h-4 w-4" />
                  Ảnh
                </Button>
                <Button variant="ghost" size="sm">
                  <Video className="mr-2 h-4 w-4" />
                  Video
                </Button>
                <Button variant="ghost" size="sm">
                  <MapPin className="mr-2 h-4 w-4" />
                  Địa điểm
                </Button>
                <Button variant="ghost" size="sm">
                  <Smile className="mr-2 h-4 w-4" />
                  Cảm xúc
                </Button>
              </div>
              <Button>Đăng bài</Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

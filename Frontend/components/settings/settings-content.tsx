"use client"

import { useState } from "react"
import { User, Bell, Shield, Palette, Globe, HelpCircle, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function SettingsContent() {
  const [activeTab, setActiveTab] = useState("profile")

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Cài đặt
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Quản lý tài khoản và tùy chọn của bạn</p>
      </div>

      <Card className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-6 rounded-none border-b">
              <TabsTrigger value="profile" className="flex items-center">
                <User className="h-4 w-4 mr-2" />
                Hồ sơ
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center">
                <Bell className="h-4 w-4 mr-2" />
                Thông báo
              </TabsTrigger>
              <TabsTrigger value="privacy" className="flex items-center">
                <Shield className="h-4 w-4 mr-2" />
                Riêng tư
              </TabsTrigger>
              <TabsTrigger value="appearance" className="flex items-center">
                <Palette className="h-4 w-4 mr-2" />
                Giao diện
              </TabsTrigger>
              <TabsTrigger value="language" className="flex items-center">
                <Globe className="h-4 w-4 mr-2" />
                Ngôn ngữ
              </TabsTrigger>
              <TabsTrigger value="help" className="flex items-center">
                <HelpCircle className="h-4 w-4 mr-2" />
                Trợ giúp
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="p-6 space-y-6">
              <div className="space-y-6">
                {/* Profile Picture */}
                <div className="flex items-center space-x-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                  <div>
                    <Button variant="outline">Thay đổi ảnh</Button>
                    <p className="text-sm text-gray-500 mt-1">JPG, PNG tối đa 5MB</p>
                  </div>
                </div>

                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName">Họ và tên</Label>
                    <Input id="fullName" defaultValue="Nguyễn Văn A" />
                  </div>
                  <div>
                    <Label htmlFor="username">Tên người dùng</Label>
                    <Input id="username" defaultValue="@nguyenvana" />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue="nguyenvana@example.com" />
                  </div>
                  <div>
                    <Label htmlFor="phone">Số điện thoại</Label>
                    <Input id="phone" defaultValue="0123456789" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="bio">Giới thiệu</Label>
                  <Textarea
                    id="bio"
                    placeholder="Viết vài dòng về bản thân..."
                    defaultValue="Đam mê xe hơi từ nhỏ. Chuyên gia tư vấn BMW và Mercedes."
                  />
                </div>

                <div>
                  <Label htmlFor="location">Địa điểm</Label>
                  <Input id="location" defaultValue="Hà Nội, Việt Nam" />
                </div>

                <Button>Lưu thay đổi</Button>
              </div>
            </TabsContent>

            <TabsContent value="notifications" className="p-6 space-y-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Thông báo email</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Bình luận mới</Label>
                        <p className="text-sm text-gray-500">Nhận thông báo khi có người bình luận bài viết của bạn</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Lượt thích</Label>
                        <p className="text-sm text-gray-500">Nhận thông báo khi có người thích bài viết của bạn</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Người theo dõi mới</Label>
                        <p className="text-sm text-gray-500">Nhận thông báo khi có người theo dõi bạn</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Thông báo đẩy</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Tin nhắn mới</Label>
                        <p className="text-sm text-gray-500">Nhận thông báo đẩy khi có tin nhắn mới</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Sự kiện</Label>
                        <p className="text-sm text-gray-500">Nhận thông báo về sự kiện sắp diễn ra</p>
                      </div>
                      <Switch />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="privacy" className="p-6 space-y-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Quyền riêng tư tài khoản</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Tài khoản riêng tư</Label>
                        <p className="text-sm text-gray-500">Chỉ người theo dõi mới có thể xem bài viết của bạn</p>
                      </div>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Hiển thị trạng thái hoạt động</Label>
                        <p className="text-sm text-gray-500">Cho phép người khác biết khi bạn đang online</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Ai có thể liên hệ với bạn</h3>
                  <div className="space-y-4">
                    <div>
                      <Label>Tin nhắn</Label>
                      <Select defaultValue="everyone">
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="everyone">Mọi người</SelectItem>
                          <SelectItem value="followers">Chỉ người theo dõi</SelectItem>
                          <SelectItem value="none">Không ai</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="appearance" className="p-6 space-y-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Chủ đề</h3>
                  <Select defaultValue="system">
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Sáng</SelectItem>
                      <SelectItem value="dark">Tối</SelectItem>
                      <SelectItem value="system">Theo hệ thống</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Kích thước chữ</h3>
                  <Select defaultValue="medium">
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Nhỏ</SelectItem>
                      <SelectItem value="medium">Vừa</SelectItem>
                      <SelectItem value="large">Lớn</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="language" className="p-6 space-y-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Ngôn ngữ hiển thị</h3>
                  <Select defaultValue="vi">
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vi">Tiếng Việt</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Múi giờ</h3>
                  <Select defaultValue="asia/ho_chi_minh">
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asia/ho_chi_minh">Việt Nam (UTC+7)</SelectItem>
                      <SelectItem value="asia/bangkok">Bangkok (UTC+7)</SelectItem>
                      <SelectItem value="asia/singapore">Singapore (UTC+8)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="help" className="p-6 space-y-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Trung tâm trợ giúp</h3>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      Câu hỏi thường gặp
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      Liên hệ hỗ trợ
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      Báo cáo lỗi
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      Điều khoản sử dụng
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      Chính sách bảo mật
                    </Button>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <Button variant="destructive" className="w-full">
                    <LogOut className="h-4 w-4 mr-2" />
                    Đăng xuất
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

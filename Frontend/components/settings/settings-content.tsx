"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import ProvinceAPI from "@/lib/api/province"
import userAPI from "@/lib/api/user"
import { getCurrentUser } from "@/lib/utils/get-current-user"
import { UserDTO, Location } from "@/types/user"
import { Bell, CheckCircle, CircleArrowUp, Globe, HelpCircle, LogOut, Palette, Shield, User, XCircle } from "lucide-react"
import { useEffect, useState } from "react"
import { UpgradeModal } from "../upgrade-rank-user"
import { validateEmail, validatePhoneVN } from "@/lib/utils/validate"


export function SettingsContent() {
  const [activeTab, setActiveTab] = useState("profile")
  const [user, setUser] = useState<UserDTO>({
    id: 0,
    username: "",
    email: "",
    firstName: "",
    lastName: "",
    profilePicture: "",
    createdAt: "",
    updatedAt: "",
    role: "",
    status: "",
    verified: false,
    bio: "",
    location: "",
    phone: "",
    fullName: "",
    rating: 0,
    rank: "",
    registerRankAt: "",
    expiryRankAt: ""
  });
  const [address, setAddress] = useState<Location[]>([]);
  const [provinceIndex, setProvinceIndex] = useState<number>(0)
  const currentUser = getCurrentUser();
  const [ward, setWard] = useState<string>();
  const [province, setProvince] = useState<string>();
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [displayUpgrandeRank, setDisplayUpgrandeRank] = useState(false)

  // Xử lý chọn ảnh
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null
    setFile(selectedFile)

    // preview ảnh cho user
    if (selectedFile) {
      setPreview(URL.createObjectURL(selectedFile))
    }
  }
  const fetchDataUser = async (id: number) => {
    const res = await userAPI.findById(id);
    if (res.status === 200) {
      setUser(res.data)
      const addressSplit = user.location.split("-")
      setWard(addressSplit[0])
      setProvince(addressSplit[1])
    }
  }

  const fetchDataLocation = async () => {
    const res = await ProvinceAPI.getListProvinces();
    if (res.status === 200) {
      setAddress(res.data)
    }
  }


  useEffect(() => {
    fetchDataUser(currentUser?.id)
    fetchDataLocation()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prev) => ({
      ...prev,
      [name]: value
    }));
  };
  const handleUpdateUser = async () => {
    let updatedUser = { ...user }
    if (ward || province) {
      updatedUser.location = `${ward || ""} - ${province || ""}`

      if (Object.values(updatedUser).some(value => value === "" || value === null || value === undefined)) {
        alert("Vui lòng điền đầy đủ các trường");
        return;
      }


      if (!validateEmail(updatedUser.email)) {
        alert("Email chưa đúng định dạng")
        return;
      }

      if (!validatePhoneVN(updatedUser.phone)) {
        alert("Số điện thoại chưa đúng")
        return;
      }
    }
    console.log(updatedUser.email);
    const formData = new FormData()
    formData.append("firstName", updatedUser.firstName)
    formData.append("lastName", updatedUser.lastName)
    formData.append("email", updatedUser.email)
    formData.append("verified", updatedUser.verified ? "true" : "false")
    formData.append("rank", updatedUser.rank)
    formData.append("bio", updatedUser.bio)
    formData.append("location", updatedUser.location)
    formData.append("phone", updatedUser.phone)
    if (file) formData.append("profilePicture", file)

    const res = await userAPI.updateUser(formData, updatedUser.id)
    if (res.status === 200) {
      alert("Cập nhật tài khoản thành công")
      fetchDataUser(currentUser?.id)
      setPreview(null)
    } else {
      alert("Cập nhật tài khoản không thành công")
    }
  }

  const handleCloseUpgradeRank = () => {
    setDisplayUpgrandeRank(false)
  }


  return (
    <div className="max-w-4xl mx-auto space-y-6">

      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Cài đặt
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Quản lý tài khoản và tùy chọn của bạn</p>
      </div>

      <Card className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
        {displayUpgrandeRank && <UpgradeModal
          isOpen={displayUpgrandeRank}
          onClose={handleCloseUpgradeRank}
          currentRank={user.rank}
          currentUser={currentUser}
        />}
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
                    <AvatarImage src={user?.profilePicture || "/placeholder.svg"} />
                    <AvatarFallback>{user?.firstName?.substring(0, 1)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <Input type="file" accept="image/*" onChange={handleFileChange} />
                    <p className="text-sm text-gray-500 mt-1">JPG, PNG tối đa 5MB</p>
                  </div>
                  {preview &&
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={preview} />
                    </Avatar>
                  }
                </div>

                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="lastName">Họ</Label>
                    <Input id="lastName" name="lastName" value={user?.lastName} onChange={handleChange} />
                  </div>
                  <div>
                    <Label htmlFor="firstName">Tên</Label>
                    <Input id="firstName" name="firstName" value={user?.firstName} onChange={handleChange} />
                  </div>
                  <div>
                    <Label htmlFor="username">Tên người dùng</Label>
                    <Input id="username" name="username" value={user?.username} disabled />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" name="email" value={user?.email} onChange={handleChange} />
                  </div>
                  <div>
                    <Label htmlFor="phone">Số điện thoại</Label>
                    <Input id="phone" name="phone" value={user?.phone} onChange={handleChange} />
                  </div>
                  <div>
                    <Label htmlFor="phone">Xác thực</Label>
                    {user?.verified ? (
                      <div className="flex items-center gap-1 text-green-600">
                        <CheckCircle className="w-5 h-5" />
                        <span>Đã xác thực</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-red-600">
                        <XCircle className="w-5 h-5" />
                        <span>Chưa xác thực</span>
                      </div>
                    )}
                  </div>
                  <div >
                    <Label htmlFor="rank">Hạng tài khoản</Label>
                    <div className="flex">
                      <Input id="rank" name="rank" value={user?.rank} onChange={handleChange} disabled />
                      <Button className="bg-green-800" onClick={() => setDisplayUpgrandeRank(true)}><CircleArrowUp /> Nâng cấp</Button>
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="bio">Giới thiệu</Label>
                  <Textarea
                    id="bio"
                    placeholder="Viết vài dòng về bản thân..."
                    value={user?.bio}
                    name="bio"
                    onChange={handleChange}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">Địa điểm</Label>
                    <Input id="location" name="location" value={user?.location} onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="carModel">Tỉnh/Thành phố *</Label>
                    <Select onValueChange={(value) => {
                      const index = address.findIndex(a => a?.code.toString() === value);
                      setProvinceIndex(index);
                      setProvince(address[index].name)
                    }}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn tỉnh" />
                      </SelectTrigger>
                      <SelectContent>
                        {address?.map((a) => (
                          <SelectItem key={a?.code} value={a?.code.toString()}>
                            {a?.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="carModel">Xã/Phường *</Label>
                    <Select onValueChange={(value) => {
                      const ward = address[provinceIndex].wards.find(
                        (a) => a.code === Number(value)
                      );
                      setWard(ward.name);
                    }
                    }>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn xã/ phường" />
                      </SelectTrigger>
                      <SelectContent>
                        {address[provinceIndex]?.wards?.map((a) => (
                          <SelectItem key={a?.code} value={a?.code.toString()}>
                            {a?.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button onClick={handleUpdateUser}>Lưu thay đổi</Button>
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

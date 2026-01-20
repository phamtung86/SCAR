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
import settingsAPI from "@/lib/api/settings"
import { getCurrentUser } from "@/lib/utils/get-current-user"
import { logoutWithConfirmation } from "@/lib/utils/logout"
import { UserDTO, Location } from "@/types/user"
import {
  NotificationSettings,
  PrivacySettings,
  AppearanceSettings,
  LanguageSettings,
  defaultNotificationSettings,
  defaultPrivacySettings,
  defaultAppearanceSettings,
  defaultLanguageSettings
} from "@/types/settings"
import { Bell, CheckCircle, CircleArrowUp, Globe, HelpCircle, LogOut, Palette, Shield, User, XCircle } from "lucide-react"
import { useEffect, useState } from "react"
import { UpgradeModal } from "../upgrade-rank-user"
import { validateEmail, validatePhoneVN } from "@/lib/utils/validate"
import { useTheme } from "@/components/contexts/theme-context"
import { toast } from "sonner"


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
    expiryRankAt: "",
    accountStatus: ""
  });
  const [address, setAddress] = useState<Location[]>([]);
  const [provinceIndex, setProvinceIndex] = useState<number>(0)
  const currentUser = getCurrentUser();
  const [ward, setWard] = useState<string>();
  const [province, setProvince] = useState<string>();
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [displayUpgrandeRank, setDisplayUpgrandeRank] = useState(false)

  // Settings states
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>(defaultNotificationSettings)
  const [privacySettings, setPrivacySettings] = useState<PrivacySettings>(defaultPrivacySettings)
  const [appearanceSettings, setAppearanceSettings] = useState<AppearanceSettings>(defaultAppearanceSettings)
  const [languageSettings, setLanguageSettings] = useState<LanguageSettings>(defaultLanguageSettings)
  const [isLoadingSettings, setIsLoadingSettings] = useState(false)

  // Theme context
  const { theme, setTheme } = useTheme()


  // Xử lý chọn ảnh
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null
    setFile(selectedFile)

    // preview ảnh cho user
    if (selectedFile) {
      setPreview(URL.createObjectURL(selectedFile))
    }
  }

  // Fetch user settings
  const fetchUserSettings = async (userId: number) => {
    setIsLoadingSettings(true)
    try {
      const res = await settingsAPI.getUserSettings(userId)
      if (res.status === 200 && res.data) {
        if (res.data.notifications) setNotificationSettings(res.data.notifications)
        if (res.data.privacy) setPrivacySettings(res.data.privacy)
        if (res.data.appearance) {
          setAppearanceSettings(res.data.appearance)
          setTheme(res.data.appearance.theme)
        }
        if (res.data.language) setLanguageSettings(res.data.language)
      }
    } catch (error) {
      console.error("Failed to load settings:", error)
      // Use default settings if loading fails
    } finally {
      setIsLoadingSettings(false)
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
    if (currentUser?.id) {
      fetchDataUser(currentUser.id)
      fetchDataLocation()
      fetchUserSettings(currentUser.id)
    }
  }, [])


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
        toast.error("Vui lòng điền đầy đủ các trường");
        return;
      }


      if (!validateEmail(updatedUser.email)) {
        toast.error("Email chưa đúng định dạng")
        return;
      }

      if (!validatePhoneVN(updatedUser.phone)) {
        toast.error("Số điện thoại chưa đúng")
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
      toast.success("Cập nhật tài khoản thành công")
      if (currentUser?.id) {
        fetchDataUser(currentUser.id)
      }
      setPreview(null)
    } else {
      toast.error("Cập nhật tài khoản không thành công")
    }
  }

  // Handle notification settings update
  const handleUpdateNotifications = async () => {
    if (!currentUser?.id) return
    setIsLoadingSettings(true)
    try {
      const res = await settingsAPI.updateNotifications(currentUser.id, notificationSettings)
      if (res.status === 200) {
        toast.success("Đã lưu cài đặt thông báo")
      } else {
        toast.error("Không thể lưu cài đặt thông báo")
      }
    } catch (error) {
      toast.error("Đã xảy ra lỗi")
    } finally {
      setIsLoadingSettings(false)
    }
  }

  // Handle privacy settings update
  const handleUpdatePrivacy = async () => {
    if (!currentUser?.id) return
    setIsLoadingSettings(true)
    try {
      const res = await settingsAPI.updatePrivacy(currentUser.id, privacySettings)
      if (res.status === 200) {
        toast.success("Đã lưu cài đặt riêng tư")
      } else {
        toast.error("Không thể lưu cài đặt riêng tư")
      }
    } catch (error) {
      toast.error("Đã xảy ra lỗi")
    } finally {
      setIsLoadingSettings(false)
    }
  }

  // Handle appearance settings update
  const handleUpdateAppearance = async () => {
    if (!currentUser?.id) return
    setIsLoadingSettings(true)
    try {
      const res = await settingsAPI.updateAppearance(currentUser.id, appearanceSettings)
      if (res.status === 200) {
        toast.success("Đã lưu cài đặt giao diện")
        // Apply theme immediately
        setTheme(appearanceSettings.theme)
      } else {
        toast.error("Không thể lưu cài đặt giao diện")
      }
    } catch (error) {
      toast.error("Đã xảy ra lỗi")
    } finally {
      setIsLoadingSettings(false)
    }
  }

  // Handle language settings update
  const handleUpdateLanguage = async () => {
    if (!currentUser?.id) return
    setIsLoadingSettings(true)
    try {
      const res = await settingsAPI.updateLanguage(currentUser.id, languageSettings)
      if (res.status === 200) {
        toast.success("Đã lưu cài đặt ngôn ngữ")
      } else {
        toast.error("Không thể lưu cài đặt ngôn ngữ")
      }
    } catch (error) {
      toast.error("Đã xảy ra lỗi")
    } finally {
      setIsLoadingSettings(false)
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
        {displayUpgrandeRank && currentUser && <UpgradeModal
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
                      if (ward) {
                        setWard(ward.name);
                      }
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
                      <Switch
                        checked={notificationSettings.emailNewComments}
                        onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, emailNewComments: checked }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Lượt thích</Label>
                        <p className="text-sm text-gray-500">Nhận thông báo khi có người thích bài viết của bạn</p>
                      </div>
                      <Switch
                        checked={notificationSettings.emailNewLikes}
                        onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, emailNewLikes: checked }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Người theo dõi mới</Label>
                        <p className="text-sm text-gray-500">Nhận thông báo khi có người theo dõi bạn</p>
                      </div>
                      <Switch
                        checked={notificationSettings.emailNewFollowers}
                        onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, emailNewFollowers: checked }))}
                      />
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
                      <Switch
                        checked={notificationSettings.pushNewMessages}
                        onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, pushNewMessages: checked }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Sự kiện</Label>
                        <p className="text-sm text-gray-500">Nhận thông báo về sự kiện sắp diễn ra</p>
                      </div>
                      <Switch
                        checked={notificationSettings.pushEvents}
                        onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, pushEvents: checked }))}
                      />
                    </div>
                  </div>
                </div>

                <Button onClick={handleUpdateNotifications} disabled={isLoadingSettings}>
                  {isLoadingSettings ? "Đang lưu..." : "Lưu cài đặt"}
                </Button>
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
                      <Switch
                        checked={privacySettings.privateAccount}
                        onCheckedChange={(checked) => setPrivacySettings(prev => ({ ...prev, privateAccount: checked }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Hiển thị trạng thái hoạt động</Label>
                        <p className="text-sm text-gray-500">Cho phép người khác biết khi bạn đang online</p>
                      </div>
                      <Switch
                        checked={privacySettings.showActivityStatus}
                        onCheckedChange={(checked) => setPrivacySettings(prev => ({ ...prev, showActivityStatus: checked }))}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Ai có thể liên hệ với bạn</h3>
                  <div className="space-y-4">
                    <div>
                      <Label>Tin nhắn</Label>
                      <Select
                        value={privacySettings.allowMessagesFrom}
                        onValueChange={(value: "everyone" | "followers" | "none") =>
                          setPrivacySettings(prev => ({ ...prev, allowMessagesFrom: value }))
                        }
                      >
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

                <Button onClick={handleUpdatePrivacy} disabled={isLoadingSettings}>
                  {isLoadingSettings ? "Đang lưu..." : "Lưu cài đặt"}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="appearance" className="p-6 space-y-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Chủ đề</h3>
                  <Select
                    value={appearanceSettings.theme}
                    onValueChange={(value: "light" | "dark" | "system") =>
                      setAppearanceSettings(prev => ({ ...prev, theme: value }))
                    }
                  >
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
                  <Select
                    value={appearanceSettings.fontSize}
                    onValueChange={(value: "small" | "medium" | "large") =>
                      setAppearanceSettings(prev => ({ ...prev, fontSize: value }))
                    }
                  >
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

                <Button onClick={handleUpdateAppearance} disabled={isLoadingSettings}>
                  {isLoadingSettings ? "Đang lưu..." : "Áp dụng"}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="language" className="p-6 space-y-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Ngôn ngữ hiển thị</h3>
                  <Select
                    value={languageSettings.language}
                    onValueChange={(value: "vi" | "en") =>
                      setLanguageSettings(prev => ({ ...prev, language: value }))
                    }
                  >
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
                  <Select
                    value={languageSettings.timezone}
                    onValueChange={(value) =>
                      setLanguageSettings(prev => ({ ...prev, timezone: value }))
                    }
                  >
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

                <Button onClick={handleUpdateLanguage} disabled={isLoadingSettings}>
                  {isLoadingSettings ? "Đang lưu..." : "Lưu cài đặt"}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="help" className="p-6 space-y-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Trung tâm trợ giúp</h3>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start" onClick={() => toast.info("Tính năng đang phát triển")}>
                      Câu hỏi thường gặp
                    </Button>
                    <Button variant="outline" className="w-full justify-start" onClick={() => toast.info("Tính năng đang phát triển")}>
                      Liên hệ hỗ trợ
                    </Button>
                    <Button variant="outline" className="w-full justify-start" onClick={() => toast.info("Tính năng đang phát triển")}>
                      Báo cáo lỗi
                    </Button>
                    <Button variant="outline" className="w-full justify-start" onClick={() => toast.info("Tính năng đang phát triển")}>
                      Điều khoản sử dụng
                    </Button>
                    <Button variant="outline" className="w-full justify-start" onClick={() => toast.info("Tính năng đang phát triển")}>
                      Chính sách bảo mật
                    </Button>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <Button variant="destructive" className="w-full" onClick={logoutWithConfirmation}>
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

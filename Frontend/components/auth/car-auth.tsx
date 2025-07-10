"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import AuthAPI from "@/lib/api/auth"
import { log } from "console"
import { Car, Eye, EyeOff, Facebook, Mail } from "lucide-react"
import { useRouter } from 'next/navigation'
import { useState } from "react"

export default function Component() {
 const router = useRouter();
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [datalogin, setDatalogin] = useState({
    username: "",
    password: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setDatalogin((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleLogin = async () => {
    try {
      const response = await AuthAPI.login(datalogin.username, datalogin.password);
      if (response.status === 200) {
        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        router.push("/")
      }
    } catch (error) {
      console.error("Login failed:", error)

    }
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <Car className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">CarConnect</h1>
          <p className="text-gray-600 mt-2">Cộng đồng đam mê xe hơi</p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1 pb-6">
            <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
              <Button
                variant={isLogin ? "default" : "ghost"}
                className="flex-1 text-sm"
                onClick={() => setIsLogin(true)}
              >
                Đăng nhập
              </Button>
              <Button
                variant={!isLogin ? "default" : "ghost"}
                className="flex-1 text-sm"
                onClick={() => setIsLogin(false)}
              >
                Đăng ký
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Social Login */}
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="w-full">
                <Facebook className="mr-2 h-4 w-4 text-blue-600" />
                Facebook
              </Button>
              <Button variant="outline" className="w-full">
                <Mail className="mr-2 h-4 w-4 text-red-500" />
                Google
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Hoặc tiếp tục với</span>
              </div>
            </div>

            {/* Registration Form */}
            {!isLogin && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Họ</Label>
                    <Input id="firstName" placeholder="Nguyễn" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Tên</Label>
                    <Input id="lastName" placeholder="Văn A" />
                  </div>
                </div>
              </>
            )}

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="username">Tên đăng nhập</Label>
              <Input id="username" type="text" placeholder="scar@gmail.com" className="w-full" name="username" onChange={handleChange} />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Mật khẩu</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pr-10"
                  name="password"
                  onChange={handleChange}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>
            </div>

            {/* Confirm Password for Registration */}
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>
            )}

            {/* Remember Me / Terms */}
            <div className="flex items-center space-x-2">
              <Checkbox id="terms" />
              <Label htmlFor="terms" className="text-sm text-gray-600">
                {isLogin ? "Ghi nhớ đăng nhập" : "Tôi đồng ý với điều khoản sử dụng và chính sách bảo mật"}
              </Label>
            </div>

            {/* Forgot Password for Login */}
            {isLogin && (
              <div className="text-right">
                <Button variant="link" className="text-sm text-blue-600 p-0">
                  Quên mật khẩu?
                </Button>
              </div>
            )}

            {/* Submit Button */}
            {
              isLogin ?
                <Button className="w-full bg-blue-600 hover:bg-blue-700" size="lg" onClick={handleLogin}>
                  Đăng nhập
                </Button>
                :
                <Button className="w-full bg-blue-600 hover:bg-blue-700" size="lg" >
                  Tạo tài khoản"
                </Button>
            }



            {/* Additional Info */}
            <div className="text-center text-sm text-gray-600">
              {isLogin ? (
                <>
                  Chưa có tài khoản?{" "}
                  <Button variant="link" className="text-blue-600 p-0" onClick={() => setIsLogin(false)}>
                    Đăng ký ngay
                  </Button>
                </>
              ) : (
                <>
                  Đã có tài khoản?{" "}
                  <Button variant="link" className="text-blue-600 p-0" onClick={() => setIsLogin(true)}>
                    Đăng nhập
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>© 2024 CarConnect. Tất cả quyền được bảo lưu.</p>
          <div className="flex justify-center space-x-4 mt-2">
            <Button variant="link" className="text-xs text-gray-500 p-0">
              Điều khoản
            </Button>
            <Button variant="link" className="text-xs text-gray-500 p-0">
              Bảo mật
            </Button>
            <Button variant="link" className="text-xs text-gray-500 p-0">
              Hỗ trợ
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

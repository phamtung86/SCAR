"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import AuthAPI from "@/lib/api/auth"
import { Eye, EyeOff, Mail } from "lucide-react"
import Image from "next/image"
import { useRouter } from 'next/navigation'
import { useEffect, useState } from "react"

export default function Component() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isChecked, setIsChecked] = useState(false);

  const [datalogin, setDatalogin] = useState({
    username: "",
    password: "",
  })

  const [dataRegister, setDataRegister] = useState({
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
  })

  const [error, setError] = useState({
    notMatch: "",
    passwordNotValid: "",
    emailNotValid: "",
    isEmpty: "",
    termsNotAccepted: ""
  })

  const validatePassword = (password: string) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  }


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    isLogin ?
      setDatalogin((prev) => ({
        ...prev,
        [name]: value,
      }))
      :
      setDataRegister((prev) => ({
        ...prev,
        [name]: value,
      }))
  }

  const handleLogin = async () => {
    setError({}); // Reset lỗi
    const messages = {
      isEmpty: "Vui lòng điền đầy đủ các trường",
      passwordNotValid: "Mật khẩu phải ít nhất 8 ký tự, có chữ hoa, chữ thường, số và ký tự đặc biệt",
    };

    const newErrors: Partial<RegisterError> = {};
    if (Object.values(datalogin).some(value => !value)) {
      newErrors.isEmpty = messages.isEmpty;
    }
    if (Object.keys(newErrors).length > 0) {
      setError(newErrors);
      return;
    }
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

  // Google Login bằng Google Identity Services
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      // Khởi tạo Google Sign-In
      window.google.accounts.id.initialize({
        client_id: "255407059918-ebn1pgvo5tknitp9r01m9gn9pu40m716.apps.googleusercontent.com",
        callback: handleGoogleResponse,
      });

      // Render nút Google
      window.google.accounts.id.renderButton(
        document.getElementById("googleSignInDiv"),
        { theme: "outline", size: "large" }
      );
    };
  }, []);

  const handleGoogleResponse = async (response: any) => {
    try {
      const res = await AuthAPI.loginWithGoogle(
        response.credential
      );
      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      router.push("/");
    } catch (err) {
      console.error("Google login error:", err);
    }
  };
  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  const handleRegisterAccount = async () => {
    setError({}); // Reset lỗi
    const messages = {
      isEmpty: "Vui lòng điền đầy đủ các trường",
      notMatch: "Mật khẩu không trùng khớp",
      passwordNotValid: "Mật khẩu phải ít nhất 8 ký tự, có chữ hoa, chữ thường, số và ký tự đặc biệt",
      emailNotValid: "Email chưa đúng định dạng"
    };

    const newErrors: Partial<RegisterError> = {};

    // 1. Kiểm tra bỏ trống
    if (Object.values(dataRegister).some(value => !value)) {
      newErrors.isEmpty = messages.isEmpty;
    }

    // 2. Kiểm tra mật khẩu khớp
    if (dataRegister.password !== dataRegister.confirmPassword) {
      newErrors.notMatch = messages.notMatch;
    }

    // 3. Kiểm tra độ mạnh mật khẩu
    if (!validatePassword(dataRegister.password)) {
      newErrors.passwordNotValid = messages.passwordNotValid;
    }

    // 4. Kiểm tra email hợp lệ
    if (!validateEmail(dataRegister.email)) {
      newErrors.emailNotValid = messages.emailNotValid;
    }

    // Nếu có lỗi thì setError và dừng
    if (Object.keys(newErrors).length > 0) {
      setError(newErrors);
      return;
    }
    if (!isLogin && !isChecked) {
      setError({ termsNotAccepted: "Bạn cần đồng ý điều khoản trước khi đăng ký" });
      return;
    }


    // 5. Gọi API nếu không có lỗi
    try {
      const res = await AuthAPI.register(dataRegister);
      if (res.status === 200) {
        alert("Đăng kí thành công")
        setIsLogin(true);
      }
    } catch (err) {
      console.error("Đăng ký thất bại:", err);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <Image
              src="/SCAR.gif"
              alt="Logo"
              width={400}
              height={400}
              className="rounded-full max-w-full h-auto"
            />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">SCar Connect</h1>
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
              {/* <Button variant="outline" className="w-full">
                <Facebook className="mr-2 h-4 w-4 text-blue-600" />
                Facebook
              </Button> */}
              <Button variant="outline" className="w-full" id="googleSignInDiv">
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
                    <Input
                      id="firstName"
                      placeholder="Nguyễn"
                      name="firstName"
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Tên</Label>
                    <Input
                      id="lastName"
                      placeholder="Văn A"
                      name="lastName"
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </>
            )}

            {/* Username */}
            <div className="space-y-2">
              <Label htmlFor="username">Tên đăng nhập</Label>
              <Input id="username" type="text" className="w-full" name="username" onChange={handleChange} />
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
                    name="confirmPassword"
                    onChange={handleChange}
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
                {error && <div style={{ color: "red", padding: "0.25rem", fontSize: "13px" }}>
                  <div>{error.notMatch}</div>
                  <div>{error.passwordNotValid}</div>
                </div>
                }
              </div>
            )}

            {
              !isLogin && (
                <>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="text" placeholder="scar@gmail.com" className="w-full" name="email" onChange={handleChange} />
                  </div>
                  {error.emailNotValid && <div style={{ color: "red", padding: "0.25rem", fontSize: "13px" }}>
                    <div>{error.emailNotValid}</div>
                  </div>
                  }
                </>
              )
            }
            {error.isEmpty && <div style={{ color: "red", padding: "0.25rem", fontSize: "13px" }}>
              <div>{error.isEmpty}</div>
            </div>
            }
            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                checked={isChecked}
                onCheckedChange={(value) => setIsChecked(Boolean(value))}
              />
              <Label htmlFor="terms" className="text-sm text-gray-600">
                {isLogin
                  ? "Ghi nhớ đăng nhập"
                  : "Tôi đồng ý với điều khoản sử dụng và chính sách bảo mật"}
              </Label>
            </div>
            {error.termsNotAccepted && <div style={{ color: "red", padding: "0.25rem", fontSize: "13px" }}>
              <div>{error.termsNotAccepted}</div>
            </div>
            }

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
                <Button className="w-full bg-blue-600 hover:bg-blue-700" size="lg" onClick={handleRegisterAccount}>
                  Tạo tài khoản
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

"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import AuthAPI from "@/lib/api/auth"
import { validateEmail } from "@/lib/utils/validate"
import { Eye, EyeOff, Mail, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react"
import Image from "next/image"
import { useRouter } from 'next/navigation'
import { useEffect, useState } from "react"

interface RegisterError {
  notMatch?: string;
  passwordNotValid?: string;
  emailNotValid?: string;
  isEmpty?: string;
  termsNotAccepted?: string;
}

export default function Component() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isChecked, setIsChecked] = useState(false);

  // Forgot Password States
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
  const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState(false);
  const [forgotPasswordError, setForgotPasswordError] = useState("");

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

  const [error, setError] = useState<RegisterError>({
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
    setError({});
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
        if (response.data.user.accountStatus === "LOCKED" || response.data.user.accountStatus === "INACTIVE") {
          alert("Tài khoản của bạn đã bị khoá hoặc vô hiệu hoá. Vui lòng liên hệ quản trị viên để biết thêm chi tiết.")
          return;
        }
        if (response.data.user.role === "ADMIN") {
          router.push("/management/admin")
          return;
        }
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
    if (Object.values(dataRegister).some(value => value === "" || value === null || value === undefined)) {
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

  // Handle Forgot Password
  const handleForgotPassword = async () => {
    setForgotPasswordError("");

    if (!forgotPasswordEmail) {
      setForgotPasswordError("Vui lòng nhập email");
      return;
    }

    if (!validateEmail(forgotPasswordEmail)) {
      setForgotPasswordError("Email không đúng định dạng");
      return;
    }

    setForgotPasswordLoading(true);
    try {
      const res = await AuthAPI.forgotPassword(forgotPasswordEmail);
      if (res.status === 200) {
        setForgotPasswordSuccess(true);
      }
    } catch (err: any) {
      if (err.response?.status === 404) {
        setForgotPasswordError("Email không tồn tại trong hệ thống");
      } else {
        setForgotPasswordError("Có lỗi xảy ra, vui lòng thử lại sau");
      }
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  // Reset forgot password form
  const resetForgotPasswordForm = () => {
    setShowForgotPassword(false);
    setForgotPasswordEmail("");
    setForgotPasswordSuccess(false);
    setForgotPasswordError("");
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
                <Button
                  variant="link"
                  className="text-sm text-blue-600 p-0"
                  onClick={() => setShowForgotPassword(true)}
                >
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

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md shadow-2xl border-0 animate-in fade-in zoom-in duration-200">
            <CardHeader className="space-y-1 pb-4">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-2 hover:bg-gray-100 rounded-full"
                  onClick={resetForgotPasswordForm}
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Quên mật khẩu</h2>
                  <p className="text-sm text-gray-500">Đặt lại mật khẩu qua email</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {!forgotPasswordSuccess ? (
                <>
                  <div className="text-center mb-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                      <Mail className="h-8 w-8 text-blue-600" />
                    </div>
                    <p className="text-gray-600 text-sm">
                      Nhập email đã đăng ký, chúng tôi sẽ gửi liên kết đặt lại mật khẩu cho bạn.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="forgotEmail">Email</Label>
                    <Input
                      id="forgotEmail"
                      type="email"
                      placeholder="example@gmail.com"
                      value={forgotPasswordEmail}
                      onChange={(e) => setForgotPasswordEmail(e.target.value)}
                      className="w-full"
                      disabled={forgotPasswordLoading}
                    />
                  </div>

                  {forgotPasswordError && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                      {forgotPasswordError}
                    </div>
                  )}

                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    size="lg"
                    onClick={handleForgotPassword}
                    disabled={forgotPasswordLoading}
                  >
                    {forgotPasswordLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Đang gửi...
                      </>
                    ) : (
                      "Gửi liên kết đặt lại"
                    )}
                  </Button>

                  <div className="text-center">
                    <Button
                      variant="link"
                      className="text-sm text-gray-500"
                      onClick={resetForgotPasswordForm}
                    >
                      Quay lại đăng nhập
                    </Button>
                  </div>
                </>
              ) : (
                <div className="text-center py-6">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
                    <CheckCircle2 className="h-10 w-10 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Email đã được gửi!
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Chúng tôi đã gửi liên kết đặt lại mật khẩu đến <strong>{forgotPasswordEmail}</strong>.
                    Vui lòng kiểm tra hộp thư (bao gồm cả thư rác).
                  </p>
                  <p className="text-gray-500 text-xs mb-6">
                    Liên kết sẽ hết hạn sau 30 phút.
                  </p>
                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    onClick={resetForgotPasswordForm}
                  >
                    Quay lại đăng nhập
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

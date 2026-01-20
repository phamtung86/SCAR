"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import AuthAPI from "@/lib/api/auth"
import { Eye, EyeOff, CheckCircle2, XCircle, Loader2, ShieldCheck } from "lucide-react"
import Image from "next/image"
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState, Suspense } from "react"

function ResetPasswordContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const [isValidating, setIsValidating] = useState(true);
    const [isValidToken, setIsValidToken] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        newPassword: "",
        confirmPassword: ""
    });

    const [validationErrors, setValidationErrors] = useState({
        newPassword: "",
        confirmPassword: ""
    });

    // Validate token on mount
    useEffect(() => {
        const validateToken = async () => {
            if (!token) {
                setIsValidating(false);
                setIsValidToken(false);
                return;
            }

            try {
                const res = await AuthAPI.validateResetToken(token);
                if (res.status === 200 && res.data.valid) {
                    setIsValidToken(true);
                } else {
                    setIsValidToken(false);
                }
            } catch (err) {
                setIsValidToken(false);
            } finally {
                setIsValidating(false);
            }
        };

        validateToken();
    }, [token]);

    const validatePassword = (password: string) => {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return regex.test(password);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear errors on change
        setValidationErrors(prev => ({
            ...prev,
            [name]: ""
        }));
        setError("");
    };

    const handleSubmit = async () => {
        setValidationErrors({ newPassword: "", confirmPassword: "" });
        setError("");

        // Validate
        const errors = { newPassword: "", confirmPassword: "" };

        if (!formData.newPassword) {
            errors.newPassword = "Vui lòng nhập mật khẩu mới";
        } else if (!validatePassword(formData.newPassword)) {
            errors.newPassword = "Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt";
        }

        if (!formData.confirmPassword) {
            errors.confirmPassword = "Vui lòng xác nhận mật khẩu";
        } else if (formData.newPassword !== formData.confirmPassword) {
            errors.confirmPassword = "Mật khẩu không khớp";
        }

        if (errors.newPassword || errors.confirmPassword) {
            setValidationErrors(errors);
            return;
        }

        setIsLoading(true);
        try {
            const res = await AuthAPI.resetPassword(token!, formData.newPassword);
            if (res.status === 200 && res.data.success) {
                setIsSuccess(true);
            }
        } catch (err: any) {
            if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else {
                setError("Có lỗi xảy ra, vui lòng thử lại sau");
            }
        } finally {
            setIsLoading(false);
        }
    };

    // Loading state
    if (isValidating) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
                <Card className="w-full max-w-md shadow-xl border-0">
                    <CardContent className="py-16 text-center">
                        <Loader2 className="h-12 w-12 text-blue-600 animate-spin mx-auto mb-4" />
                        <p className="text-gray-600">Đang xác thực liên kết...</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Invalid token
    if (!isValidToken) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
                <Card className="w-full max-w-md shadow-xl border-0">
                    <CardContent className="py-12 text-center">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6">
                            <XCircle className="h-10 w-10 text-red-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-3">Liên kết không hợp lệ</h2>
                        <p className="text-gray-600 mb-6">
                            Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.
                            Vui lòng yêu cầu liên kết mới.
                        </p>
                        <Button
                            className="bg-blue-600 hover:bg-blue-700"
                            onClick={() => router.push('/auth')}
                        >
                            Quay lại đăng nhập
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Success state
    if (isSuccess) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
                <Card className="w-full max-w-md shadow-xl border-0">
                    <CardContent className="py-12 text-center">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
                            <CheckCircle2 className="h-10 w-10 text-green-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-3">Đổi mật khẩu thành công!</h2>
                        <p className="text-gray-600 mb-6">
                            Mật khẩu của bạn đã được cập nhật. Bạn có thể đăng nhập với mật khẩu mới.
                        </p>
                        <Button
                            className="w-full bg-blue-600 hover:bg-blue-700"
                            onClick={() => router.push('/auth')}
                        >
                            Đăng nhập ngay
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

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
                    <p className="text-gray-600 mt-2">Đặt lại mật khẩu</p>
                </div>

                <Card className="shadow-xl border-0">
                    <CardHeader className="space-y-1 pb-4">
                        <div className="flex items-center gap-3 justify-center">
                            <div className="p-3 bg-blue-100 rounded-full">
                                <ShieldCheck className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Tạo mật khẩu mới</h2>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        <p className="text-sm text-gray-600 text-center mb-4">
                            Nhập mật khẩu mới cho tài khoản của bạn. Đảm bảo mật khẩu đủ mạnh để bảo vệ tài khoản.
                        </p>

                        {/* New Password */}
                        <div className="space-y-2">
                            <Label htmlFor="newPassword">Mật khẩu mới</Label>
                            <div className="relative">
                                <Input
                                    id="newPassword"
                                    name="newPassword"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    className="pr-10"
                                    value={formData.newPassword}
                                    onChange={handleChange}
                                    disabled={isLoading}
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
                            {validationErrors.newPassword && (
                                <p className="text-red-500 text-xs mt-1">{validationErrors.newPassword}</p>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
                            <div className="relative">
                                <Input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    className="pr-10"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    disabled={isLoading}
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
                            {validationErrors.confirmPassword && (
                                <p className="text-red-500 text-xs mt-1">{validationErrors.confirmPassword}</p>
                            )}
                        </div>

                        {/* Password requirements */}
                        <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-xs text-gray-600 font-medium mb-2">Yêu cầu mật khẩu:</p>
                            <ul className="text-xs text-gray-500 space-y-1">
                                <li className={formData.newPassword.length >= 8 ? "text-green-600" : ""}>
                                    • Ít nhất 8 ký tự
                                </li>
                                <li className={/[A-Z]/.test(formData.newPassword) ? "text-green-600" : ""}>
                                    • Có chữ in hoa (A-Z)
                                </li>
                                <li className={/[a-z]/.test(formData.newPassword) ? "text-green-600" : ""}>
                                    • Có chữ thường (a-z)
                                </li>
                                <li className={/\d/.test(formData.newPassword) ? "text-green-600" : ""}>
                                    • Có số (0-9)
                                </li>
                                <li className={/[@$!%*?&]/.test(formData.newPassword) ? "text-green-600" : ""}>
                                    • Có ký tự đặc biệt (@$!%*?&)
                                </li>
                            </ul>
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        <Button
                            className="w-full bg-blue-600 hover:bg-blue-700"
                            size="lg"
                            onClick={handleSubmit}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Đang xử lý...
                                </>
                            ) : (
                                "Đặt lại mật khẩu"
                            )}
                        </Button>

                        <div className="text-center">
                            <Button
                                variant="link"
                                className="text-sm text-gray-500"
                                onClick={() => router.push('/auth')}
                            >
                                Quay lại đăng nhập
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Footer */}
                <div className="text-center mt-8 text-sm text-gray-500">
                    <p>© 2024 SCar Connect. Tất cả quyền được bảo lưu.</p>
                </div>
            </div>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
                <Card className="w-full max-w-md shadow-xl border-0">
                    <CardContent className="py-16 text-center">
                        <Loader2 className="h-12 w-12 text-blue-600 animate-spin mx-auto mb-4" />
                        <p className="text-gray-600">Đang tải...</p>
                    </CardContent>
                </Card>
            </div>
        }>
            <ResetPasswordContent />
        </Suspense>
    );
}

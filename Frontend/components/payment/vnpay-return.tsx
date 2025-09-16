"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import PaymentAPI from "@/lib/api/payment"
import userAPI from "@/lib/api/user"
import { getCurrentUser } from "@/lib/utils/get-current-user"
import { Building2, CheckCircle, Clock, CreditCard, FileText, Hash, XCircle } from "lucide-react"
import { useEffect, useState } from "react"

interface PaymentResult {
    status: "success" | "failed" | "error"
    message: string
    orderId?: string
    amount?: string
    transactionNo?: string
    bankTranNo?: string
    responseCode?: string
    transactionStatus?: string
    vnp_OrderInfo?: string
    vnp_BankCode?: string
    vnp_PayDate?: string
}

export default function PaymentResultPage() {
    const [loading, setLoading] = useState(true)
    const [result, setResult] = useState<PaymentResult | null>(null)
    const fetchResult = async () => {
        try {
            const res = await PaymentAPI.vnpayGetResult();
            if (res.status === 200) {
                setResult(res.data)
            }
        } catch (error) {
            setResult({
                status: "error",
                message: "Không thể tải kết quả thanh toán!",
            })
        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        fetchResult()
    }, [])

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Đang tải kết quả thanh toán...</p>
                </div>
            </div>
        )
    }

    if (!result) return null

    const isSuccess = result.status.toLowerCase() === "success"

    // Format tiền
    const formatAmount = (amount?: string) => {
        if (!amount) return "N/A"
        const numAmount = Number.parseInt(amount) / 100
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(numAmount)
    }

    const formatDate = (dateStr: string | undefined) => {
        if (!dateStr) return "N/A"
        // VNPay format: yyyyMMddHHmmss
        const year = dateStr.substring(0, 4)
        const month = dateStr.substring(4, 6)
        const day = dateStr.substring(6, 8)
        const hour = dateStr.substring(8, 10)
        const minute = dateStr.substring(10, 12)
        const second = dateStr.substring(12, 14)
        const date = new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}`)
        return date.toLocaleString("vi-VN")
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-2xl mx-auto space-y-6">
                    {/* Status Card */}
                    <Card
                        className={`border-2 ${isSuccess ? "border-green-500 bg-green-50" : "border-red-500 bg-red-50"
                            }`}
                    >
                        <CardHeader className="text-center pb-4">
                            <div className="flex justify-center mb-4">
                                {isSuccess ? (
                                    <div className="rounded-full bg-green-100 p-3">
                                        <CheckCircle className="h-12 w-12 text-green-600" />
                                    </div>
                                ) : (
                                    <div className="rounded-full bg-red-100 p-3">
                                        <XCircle className="h-12 w-12 text-red-600" />
                                    </div>
                                )}
                            </div>
                            <CardTitle
                                className={`text-xl font-semibold ${isSuccess ? "text-green-700" : "text-red-700"}`}
                            >
                                {result.message}
                            </CardTitle>
                            <Badge
                                variant={isSuccess ? "default" : "destructive"}
                                className={`w-fit mx-auto ${isSuccess ? "bg-green-600 text-white" : "bg-red-600 text-white"
                                    }`}
                            >
                                {isSuccess ? "Thành công" : "Thất bại"}
                            </Badge>
                        </CardHeader>
                    </Card>

                    {/* Transaction Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="h-5 w-5" />
                                Chi tiết giao dịch
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4">
                                <div className="flex items-center justify-between py-2 border-b">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Hash className="h-4 w-4" />
                                        <span>Mã đơn hàng</span>
                                    </div>
                                    <span className="font-mono text-sm">{result.orderId || "N/A"}</span>
                                </div>

                                <div className="flex items-center justify-between py-2 border-b">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <CreditCard className="h-4 w-4" />
                                        <span>Số tiền</span>
                                    </div>
                                    <span className="font-semibold text-lg">{formatAmount(result.amount)}</span>
                                </div>

                                <div className="flex items-center justify-between py-2 border-b">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <FileText className="h-4 w-4" />
                                        <span>Mô tả</span>
                                    </div>
                                    <span className="text-right max-w-xs">{result.vnp_OrderInfo || "N/A"}</span>
                                </div>

                                <div className="flex items-center justify-between py-2 border-b">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Building2 className="h-4 w-4" />
                                        <span>Ngân hàng</span>
                                    </div>
                                    <span className="uppercase">
                                        {result.vnp_BankCode || "N/A"}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between py-2 border-b">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Building2 className="h-4 w-4" />
                                        <span>Mã GD Ngân hàng</span>
                                    </div>
                                    <span className="uppercase">{result.bankTranNo || "N/A"}</span>
                                </div>

                                <div className="flex items-center justify-between py-2 border-b">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Hash className="h-4 w-4" />
                                        <span>Mã GD VNPAY</span>
                                    </div>
                                    <span className="font-mono text-sm">{result.transactionNo || "N/A"}</span>
                                </div>
                                <div className="flex items-center justify-between py-2 border-b">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Clock className="h-4 w-4" />
                                        <span>Thời gian</span>
                                    </div>
                                    <span>{formatDate(result.vnp_PayDate)}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                        <Button className="flex-1" onClick={() => (window.location.href = "/")}>
                            Quay lại
                        </Button>
                        <Button variant="outline" className="flex-1 bg-transparent" onClick={() => window.print()}>
                            Xuất PDF
                        </Button>
                    </div>

                    {/* Footer */}
                    <div className="text-center pt-8 pb-4">
                        <p className="text-sm text-muted-foreground">© 2025 SCAR. Cảm ơn bạn đã sử dụng dịch vụ.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

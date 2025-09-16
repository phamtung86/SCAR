"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import PaymentAPI from "@/lib/api/payment"
import { getCurrentUser } from "@/lib/utils/get-current-user"
import { PaymentDTO } from "@/types/payment"
import {
    AlertCircle,
    Bell,
    Calendar,
    CheckCircle,
    Clock,
    CreditCard,
    DollarSign,
    Filter,
    Search,
    User,
    X,
    XCircle,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"


export function PaymentFeesPage() {
    const [payments, setPayemnts] = useState<PaymentDTO[]>()
    const [filterStatus, setFilterStatus] = useState<string>("all")
    const [searchTerm, setSearchTerm] = useState("")
    const [currentView, setCurrentView] = useState<"list" | "detail" | "payment">("list")
    const [selectedPayments, setSelectedPayments] = useState<PaymentDTO | null>(null)
    const currentUser = getCurrentUser();
    const route = useRouter();


    const fetchPaymentByUserId = async (userId: number) => {
        try {
            const res = await PaymentAPI.getPaymentByUserId(userId);
            if (res.status === 200) {
                setPayemnts(res.data)
            }
        } catch (error) {
            console.log("Lỗi khi tải các khoản thanh toán ", error);

        }
    }


    useEffect(() => {
        fetchPaymentByUserId(Number(currentUser?.id))
    }, [])

    const filteredFees = payments?.filter((fee) => {
        const matchesStatus = filterStatus === "all" || fee.status === filterStatus
        const matchesSearch =
            fee.orderType.toLowerCase().includes(searchTerm.toLowerCase()) ||
            fee.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            fee.fee.name.toLowerCase().includes(searchTerm.toLowerCase())
        return matchesStatus && matchesSearch
    })

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "SUCCESS":
                return <CheckCircle className="h-4 w-4 text-green-600" />
            case "PENDING":
                return <Clock className="h-4 w-4 text-yellow-600" />
            case "ERROR":
                return <XCircle className="h-4 w-4 text-red-600" />
            case "CANCELED":
                return <AlertCircle className="h-4 w-4 text-gray-600" />
            case "OVERDUE":
                return <AlertCircle className="h-4 w-4 text-red-800" />
            default:
                return null
        }
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "SUCCESS":
                return (
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                        Đã thanh toán
                    </Badge>
                )
            case "PENDING":
                return (
                    <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                        Chờ thanh toán
                    </Badge>
                )
            case "ERROR":
                return (
                    <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
                        Lỗi giao dịch
                    </Badge>
                )
            case "CANCELED":
                return (
                    <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
                        Đã hủy
                    </Badge>
                )
            case "OVERDUE":
                return (
                    <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
                        Quá hạn
                    </Badge>
                )
            default:
                return null
        }
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(amount)
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("vi-VN")
    }

    const handleViewDetail = (payment: PaymentDTO) => {
        setSelectedPayments(payment)
        setCurrentView("detail")
    }

    const handlePayment = async (payment: PaymentDTO) => {
        setSelectedPayments(payment)
        const res = await PaymentAPI.vnpayCreatePayment(payment.amount, "NCB", "vn", payment?.user?.id, payment?.car?.id, payment?.id, payment?.fee?.id)
        if (res.status === 200) {
            window.location.href = res.data
        }
    }

    const handleUpdateStatusPaymentById = async (id: number, status: string) => {
        const res = await PaymentAPI.updateStatusPaymentById(id, status)
        if (res.status === 200) {
            handleBackToList()
        }
    }

    const handleBackToList = () => {
        setCurrentView("list")
        setSelectedPayments(null)
    }

    const totalAmount = filteredFees
        // ?.filter((fee) => fee?.status === "PENDING")
        ?.reduce((sum, fee) => sum + fee.amount, 0) || 0
    const pendingAmount = filteredFees
        ?.filter((fee) => fee?.status === "PENDING")
        .reduce((sum, fee) => sum + fee.amount, 0) || 0

    if (currentView === "detail" && selectedPayments) {
        return (
            <div className="min-h-screen bg-background">
                <header className="border-b bg-card">
                    <div className="container mx-auto px-4 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <Button variant="ghost" className="bg-blue-500 text-white" onClick={handleBackToList}>
                                    ← Quay lại
                                </Button>
                                <h1 className="text-2xl font-bold text-foreground">Chi tiết khoản phí</h1>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="container mx-auto px-4 py-8">
                    <div className="max-w-2xl mx-auto">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-2xl">{selectedPayments.fee.name}</CardTitle>
                                    {getStatusBadge(selectedPayments.status)}
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Mã khoản phí</label>
                                        <p className="text-lg font-semibold">#{selectedPayments.id}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Số tiền</label>
                                        <p className="text-2xl font-bold text-red-500">{formatCurrency(selectedPayments.amount)}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Hạn thanh toán</label>
                                        <p className="text-lg">{formatDate(selectedPayments.expiryDate)}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Trạng thái</label>
                                        <div className="mt-1">{getStatusBadge(selectedPayments.status)}</div>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Mô tả</label>
                                    <p className="text-lg mt-1">{selectedPayments.description}</p>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    {selectedPayments?.status == "PENDING" && (
                                        <Button className="bg-blue-500 hover:bg-blue-800" onClick={() => handlePayment(selectedPayments)}>
                                            <CreditCard className="h-4 w-4 mr-2" />
                                            Thanh toán ngay
                                        </Button>
                                    )}
                                    {selectedPayments?.status == "PENDING" && (
                                        <Button className="bg-red-500 hover:bg-red-800" onClick={() => handleUpdateStatusPaymentById(selectedPayments.id, "CANCELED")}>
                                            <X className="h-4 w-4 mr-2" />
                                            Hủy
                                        </Button>
                                    )}
                                    <Button variant="outline" onClick={handleBackToList}>
                                        Quay lại danh sách
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        )
    }

    // if (currentView === "payment" && selectedPayments) {
    //     return (
    //         <div className="min-h-screen bg-background">
    //             <header className="border-b bg-card">
    //                 <div className="container mx-auto px-4 py-4">
    //                     <div className="flex items-center justify-between">
    //                         <div className="flex items-center space-x-4">
    //                             <Button variant="ghost" onClick={handleBackToList}>
    //                                 ← Quay lại
    //                             </Button>
    //                             <h1 className="text-2xl font-bold text-foreground">Thanh toán</h1>
    //                         </div>
    //                     </div>
    //                 </div>
    //             </header>

    //             <div className="container mx-auto px-4 py-8">
    //                 <div className="max-w-2xl mx-auto space-y-6">
    //                     {/* Thông tin khoản phí */}
    //                     <Card>
    //                         <CardHeader>
    //                             <CardTitle>Thông tin thanh toán</CardTitle>
    //                         </CardHeader>
    //                         <CardContent>
    //                             <div className="space-y-3">
    //                                 <div className="flex justify-between">
    //                                     <span className="text-muted-foreground">Loại phí:</span>
    //                                     <span className="font-semibold">{selectedPayments.orderType}</span>
    //                                 </div>
    //                                 <div className="flex justify-between">
    //                                     <span className="text-muted-foreground">Mô tả:</span>
    //                                     <span>{selectedPayments.description}</span>
    //                                 </div>
    //                                 <div className="flex justify-between">
    //                                     <span className="text-muted-foreground">Hạn thanh toán:</span>
    //                                     <span>{formatDate(selectedPayments.expiryDate)}</span>
    //                                 </div>
    //                                 <div className="flex justify-between text-lg font-bold border-t pt-3">
    //                                     <span>Tổng tiền:</span>
    //                                     <span className="text-black">{formatCurrency(selectedPayments.amount)}</span>
    //                                 </div>
    //                             </div>
    //                         </CardContent>
    //                     </Card>

    //                     {/* Form thanh toán */}
    //                     <Card>
    //                         <CardHeader>
    //                             <CardTitle>Phương thức thanh toán</CardTitle>
    //                         </CardHeader>
    //                         <CardContent className="space-y-4">
    //                             <div>
    //                                 <label className="text-sm font-medium mb-2 block">Chọn phương thức</label>
    //                                 <Select defaultValue="card">
    //                                     <SelectTrigger>
    //                                         <SelectValue />
    //                                     </SelectTrigger>
    //                                     <SelectContent>
    //                                         <SelectItem value="card">Thẻ tín dụng/ghi nợ</SelectItem>
    //                                         <SelectItem value="bank">Chuyển khoản ngân hàng</SelectItem>
    //                                         <SelectItem value="wallet">Ví điện tử</SelectItem>
    //                                     </SelectContent>
    //                                 </Select>
    //                             </div>

    //                             <div className="grid grid-cols-2 gap-4">
    //                                 <div>
    //                                     <label className="text-sm font-medium mb-2 block">Số thẻ</label>
    //                                     <Input placeholder="1234 5678 9012 3456" />
    //                                 </div>
    //                                 <div>
    //                                     <label className="text-sm font-medium mb-2 block">Tên chủ thẻ</label>
    //                                     <Input placeholder="NGUYEN VAN A" />
    //                                 </div>
    //                             </div>

    //                             <div className="grid grid-cols-2 gap-4">
    //                                 <div>
    //                                     <label className="text-sm font-medium mb-2 block">Ngày hết hạn</label>
    //                                     <Input placeholder="MM/YY" />
    //                                 </div>
    //                                 <div>
    //                                     <label className="text-sm font-medium mb-2 block">CVV</label>
    //                                     <Input placeholder="123" />
    //                                 </div>
    //                             </div>

    //                             <div className="flex gap-3 pt-4">
    //                                 <Button className="flex-1 bg-accent hover:bg-accent/90">
    //                                     <CreditCard className="h-4 w-4 mr-2" />
    //                                     Xác nhận thanh toán {formatCurrency(selectedPayments.amount)}
    //                                 </Button>
    //                                 <Button variant="outline" onClick={() => handleUpdateStatusPaymentById(selectedPayments.id, "CANCELED")}>
    //                                     Hủy
    //                                 </Button>
    //                             </div>
    //                         </CardContent>
    //                     </Card>
    //                 </div>
    //             </div>
    //         </div>
    //     )
    // }

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b bg-card">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">

                            <DollarSign className="h-8 w-8 text-green-500" />
                            <h1 className="text-2xl font-bold text-foreground">Quản lý phí thanh toán</h1>
                        </div>
                        {/* <div className="flex items-center space-x-4">
                            <Button variant="ghost" size="icon">
                                <Bell className="h-5 w-5" />
                            </Button>
                            <Button variant="ghost" size="icon">
                                <User className="h-5 w-5" />
                            </Button>
                        </div> */}
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Sidebar Filters */}
                    <div className="lg:col-span-1">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Filter className="h-5 w-5" />
                                    Bộ lọc
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium mb-2 block">Tìm kiếm</label>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            placeholder="Tìm theo loại phí..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pl-10"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm font-medium mb-2 block">Trạng thái</label>
                                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Tất cả</SelectItem>
                                            <SelectItem value="SUCCESS">Đã thanh toán</SelectItem>
                                            <SelectItem value="PENDING">Chờ thanh toán</SelectItem>
                                            <SelectItem value="OVERDUE">Quá hạn</SelectItem>
                                            <SelectItem value="CANCELED">Đã hủy</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Summary Stats */}
                                <div className="pt-4 border-t">
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-muted-foreground">Tổng tiền:</span>
                                            <span className="font-semibold">{formatCurrency(totalAmount)}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-muted-foreground">Cần thanh toán:</span>
                                            <span className="font-semibold text-red-600">{formatCurrency(pendingAmount)}</span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-semibold">Danh sách phí ({filteredFees?.length} khoản)</h2>
                            </div>

                            {/* Fee Cards */}
                            <div className="grid gap-4">
                                {filteredFees?.map((payment) => (
                                    <Card key={payment.id} className="hover:shadow-md transition-shadow duration-200">
                                        <CardContent className="p-6">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        {getStatusIcon(payment.status)}
                                                        <h3 className="font-semibold text-lg">{payment?.fee?.name}</h3>
                                                        {getStatusBadge(payment.status)}
                                                    </div>

                                                    <p className="text-muted-foreground mb-3">{payment.description}</p>

                                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                        <div className="flex items-center gap-1">
                                                            <Calendar className="h-4 w-4" />
                                                            <span>Hạn: {formatDate(payment.expiryDate)}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="text-right">
                                                    <div className="text-2xl font-bold text-foreground mb-3">{formatCurrency(payment.amount)}</div>

                                                    <div className="flex gap-2">
                                                        {payment.status === "PENDING" && (
                                                            <Button className="bg-blue-500 hover:bg-blue-900" onClick={() => handlePayment(payment)}>
                                                                <CreditCard className="h-4 w-4 mr-2" />
                                                                Thanh toán
                                                            </Button>
                                                        )}
                                                        <Button variant="outline" size="sm" onClick={() => handleViewDetail(payment)}>
                                                            Chi tiết
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>

                            {filteredFees?.length === 0 && (
                                <Card>
                                    <CardContent className="p-12 text-center">
                                        <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                        <h3 className="text-lg font-semibold mb-2">Không tìm thấy khoản phí nào</h3>
                                        <p className="text-muted-foreground">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

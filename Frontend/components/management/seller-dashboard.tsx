"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import CarAPI from "@/lib/api/car"
import TransactionAPI from "@/lib/api/transaction"
import { getCurrentUser } from "@/lib/utils/get-current-user"
import { formatMoney } from "@/lib/utils/money-format"
import { formatDateToDate } from "@/lib/utils/time-format"
import type { CarDTO } from "@/types/car"
import { TransactionDTO } from "@/types/transactions"
import {
  AlertCircle,
  BarChart,
  Car,
  CreditCard,
  DollarSign,
  Eye,
  FileText,
  Filter,
  LineChart,
  MessageCircle,
  Plus,
  Search,
  Trash2,
  TrendingUp,
  Wallet,
  X,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import {
  Area,
  Bar,
  CartesianGrid,
  Cell,
  DynamicAreaChart,
  DynamicBarChart,
  DynamicLineChart,
  DynamicPieChart,
  DynamicResponsiveContainer,
  Legend,
  Line,
  Pie,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "@/components/ui/charts"
import CarEditDialog from "../car/car-edit-dialog"
import { ContractGenerator } from "./contract-generator"
import { TransactionEditDialog } from "./transaction-edit-dialog"
import { toast } from "sonner"

// Fallback data for charts when no real data is available
const monthlyRevenueChart = [
  { month: "T1", revenue: 0, carsSold: 0, fees: 0 },
]

const carPerformanceChart = [
  { brand: "Chưa có dữ liệu", sold: 0, revenue: 0 },
]

const weeklyActivityChart = [
  { day: "T2", views: 45, messages: 8, inquiries: 3 },
  { day: "T3", views: 52, messages: 12, inquiries: 5 },
  { day: "T4", views: 38, messages: 6, inquiries: 2 },
  { day: "T5", views: 65, messages: 15, inquiries: 7 },
  { day: "T6", views: 48, messages: 9, inquiries: 4 },
  { day: "T7", views: 42, messages: 7, inquiries: 3 },
  { day: "CN", views: 35, messages: 5, inquiries: 2 },
]

export function SellerDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [carPosts, setCarPosts] = useState<CarDTO[]>([])
  const [filteredCarPosts, setFilteredCarPosts] = useState<CarDTO[]>([])
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [carToDelete, setCarToDelete] = useState<CarDTO | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priceFilter, setPriceFilter] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const [transactions, setTransactions] = useState<TransactionDTO[]>([])

  // Dashboard statistics
  const [dashboardStats, setDashboardStats] = useState({
    totalActiveCars: 0,
    totalViews: 0,
    totalMessages: 0,
    totalRevenue: 0,
    availableBalance: 0,
  })

  const currentUser = getCurrentUser()
  const route = useRouter()

  const fetchListCarPosts = async (userId: number) => {
    try {
      const res = await CarAPI.getByUserId(userId)
      if (res.status === 200) {
        setCarPosts(res.data)
        setFilteredCarPosts(res.data)
      }
    } catch (error) {
      console.log("Lỗi xảy ra khi lấy dữ liệu xe: ", error)
    }
  }

  const fetchTransactionBySellerId = async (sellerId: number) => {
    try {
      const res = await TransactionAPI.getAllBySellerId(sellerId);
      if (res.status === 200) {
        setTransactions(res.data)
      }
    } catch (error) {
      console.log("Lỗi xảy ra khi lấy dữ liệu giao dịch ", error);

    }
  }


  // Calculate dashboard statistics
  const calculateDashboardStats = () => {
    // Total active cars
    const activeCars = carPosts.filter(car => car.status === "APPROVED").length

    // Total views
    const totalViews = carPosts.reduce((sum, car) => sum + (car.view || 0), 0)

    // Total messages (inquiries)
    const totalMessages = carPosts.reduce((sum, car) => sum + (car.inquiries || 0), 0)

    // Total revenue from completed transactions
    const completedTransactions = transactions.filter(t => t.status === "COMPLETED")
    const totalRevenue = completedTransactions.reduce((sum, t) => sum + (t.priceAgreed || 0), 0)

    const availableBalance = totalRevenue

    setDashboardStats({
      totalActiveCars: activeCars,
      totalViews,
      totalMessages,
      totalRevenue,
      availableBalance,
    })
  }

  // Generate monthly revenue chart data from transactions
  const getMonthlyRevenueData = () => {
    const monthlyData = new Map()

    transactions.forEach(transaction => {
      if (transaction.status === "COMPLETED" && transaction.contractDate) {
        const date = new Date(transaction.contractDate)
        const monthKey = `${date.getFullYear()}-${date.getMonth()}`
        const monthLabel = `T${date.getMonth() + 1}`

        if (!monthlyData.has(monthKey)) {
          monthlyData.set(monthKey, {
            month: monthLabel,
            revenue: 0,
            carsSold: 0,
            fees: 0
          })
        }

        const data = monthlyData.get(monthKey)
        const revenueInMillions = (transaction.priceAgreed || 0) / 1000000
        data.revenue += revenueInMillions
        data.carsSold += 1
        data.fees += revenueInMillions * 0.023 // 2.3% fee
      }
    })

    // Get last 6 months
    const sortedData = Array.from(monthlyData.values())
      .sort((a, b) => {
        const aMonth = parseInt(a.month.substring(1))
        const bMonth = parseInt(b.month.substring(1))
        return aMonth - bMonth
      })
      .slice(-6)

    return sortedData.length > 0 ? sortedData : monthlyRevenueChart
  }

  // Generate car performance by brand
  const getCarPerformanceByBrand = () => {
    const brandData = new Map()

    transactions.forEach(transaction => {
      if (transaction.status === "COMPLETED" && transaction.car) {
        const brand = transaction.car.brandName || "Khác"

        if (!brandData.has(brand)) {
          brandData.set(brand, {
            brand,
            sold: 0,
            revenue: 0
          })
        }

        const data = brandData.get(brand)
        data.sold += 1
        data.revenue += (transaction.priceAgreed || 0) / 1000000
      }
    })

    const sortedData = Array.from(brandData.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 4)

    return sortedData.length > 0 ? sortedData : carPerformanceChart
  }

  // Generate sales funnel data
  const getSalesFunnelData = () => {
    const totalViews = carPosts.reduce((sum, car) => sum + (car.view || 0), 0)
    const totalMessages = carPosts.reduce((sum, car) => sum + (car.inquiries || 0), 0)
    const totalSold = transactions.filter(t => t.status === "COMPLETED").length

    // Estimate appointments as ~30% of messages
    const estimatedAppointments = Math.floor(totalMessages * 0.3)

    return [
      { name: "Lượt xem", value: totalViews, color: "#3b82f6" },
      { name: "Tin nhắn", value: totalMessages, color: "#f59e0b" },
      { name: "Hẹn xem xe", value: estimatedAppointments, color: "#10b981" },
      { name: "Đã bán", value: totalSold, color: "#8b5cf6" },
    ]
  }

  useEffect(() => {
    fetchTransactionBySellerId(Number(currentUser?.id))
  }, [])

  useEffect(() => {
    let filtered = [...carPosts]

    // Search by title
    if (searchQuery) {
      filtered = filtered.filter((car) => car.title.toLowerCase().includes(searchQuery.toLowerCase()))
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((car) => car.status === statusFilter)
    }

    // Filter by price range
    if (priceFilter !== "all") {
      switch (priceFilter) {
        case "under-500m":
          filtered = filtered.filter((car) => car.price < 500000000)
          break
        case "500m-1b":
          filtered = filtered.filter((car) => car.price >= 500000000 && car.price < 1000000000)
          break
        case "1b-2b":
          filtered = filtered.filter((car) => car.price >= 1000000000 && car.price < 2000000000)
          break
        case "over-2b":
          filtered = filtered.filter((car) => car.price >= 2000000000)
          break
      }
    }

    // Sort results
    switch (sortBy) {
      case "newest":
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      case "oldest":
        filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        break
      case "price-high":
        filtered.sort((a, b) => b.price - a.price)
        break
      case "price-low":
        filtered.sort((a, b) => a.price - b.price)
        break
      case "most-viewed":
        filtered.sort((a, b) => (b.view || 0) - (a.view || 0))
        break
    }

    setFilteredCarPosts(filtered)
  }, [carPosts, searchQuery, statusFilter, priceFilter, sortBy])

  const clearFilters = () => {
    setSearchQuery("")
    setStatusFilter("all")
    setPriceFilter("all")
    setSortBy("newest")
  }

  useEffect(() => {
    fetchListCarPosts(Number(currentUser?.id))
  }, [])

  // Recalculate stats when data changes
  useEffect(() => {
    if (carPosts.length > 0 || transactions.length > 0) {
      calculateDashboardStats()
    }
  }, [carPosts, transactions])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "default"
      case "confirmed":
        return "secondary"
      case "pending":
        return "outline"
      case "cancelled":
        return "destructive"
      default:
        return "outline"
    }
  }

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "Hoàn thành"
      case "confirmed":
        return "Đã xác nhận"
      case "pending":
        return "Chờ xác nhận"
      case "cancelled":
        return "Đã hủy"
      default:
        return "Không xác định"
    }
  }

  const canSellerUpdateStatus = (currentStatus: string) => {
    return currentStatus === "PENDING"
  }

  const handleStatusUpdate = async (transactionId: number, newStatus: string) => {
    try {
      const res = await TransactionAPI.updateTransactionStatus(transactionId, newStatus)
      if (res.status === 200) {
        // Reload transactions
        await fetchTransactionBySellerId(Number(currentUser?.id))

        const statusText = newStatus !== "CONFIRMED" || "COMPLETED" ? "xác nhận" : "hủy"
        toast.success(`Đã ${statusText} giao dịch thành công!`)
      }
    } catch (error) {
      console.log("Lỗi khi cập nhật trạng thái: ", error)
      toast.error("Có lỗi xảy ra khi cập nhật trạng thái")
    }
  }

  // Xử lý xóa mềm tin đăng
  const handleDeleteCar = async () => {
    if (!carToDelete) return

    setIsDeleting(true)
    try {
      const res = await CarAPI.deleteCarById(carToDelete.id)
      if (res.status === 200) {
        toast.success(`Đã xóa tin "${carToDelete.title}" thành công!`)
        setIsDeleteDialogOpen(false)
        setCarToDelete(null)
        // Refresh danh sách
        await fetchListCarPosts(Number(currentUser?.id))
      }
    } catch (error) {
      console.log("Lỗi khi xóa tin đăng: ", error)
      toast.error("Có lỗi xảy ra khi xóa tin đăng")
    } finally {
      setIsDeleting(false)
    }
  }

  const openDeleteDialog = (car: CarDTO) => {
    setCarToDelete(car)
    setIsDeleteDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Xe đang bán</p>
                <p className="text-2xl font-bold">{dashboardStats.totalActiveCars}</p>
              </div>
              <Car className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Lượt xem</p>
                <p className="text-2xl font-bold">{dashboardStats.totalViews.toLocaleString()}</p>
              </div>
              <Eye className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tin nhắn</p>
                <p className="text-2xl font-bold">{dashboardStats.totalMessages}</p>
              </div>
              <MessageCircle className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Doanh thu</p>
                <p className="text-2xl font-bold">{formatMoney(dashboardStats.totalRevenue)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Số dư khả dụng</p>
                <p className="text-2xl font-bold">{formatMoney(dashboardStats.availableBalance)}</p>
              </div>
              <Wallet className="h-8 w-8 text-emerald-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Tổng quan</TabsTrigger>
          <TabsTrigger value="listings">Tin đăng</TabsTrigger>
          <TabsTrigger value="transactions">Giao dịch</TabsTrigger>
          <TabsTrigger value="financial">Báo cáo tài chính</TabsTrigger>
          <TabsTrigger value="debts">Công nợ</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Xu hướng doanh thu 6 tháng</CardTitle>
              </CardHeader>
              <CardContent>
                <DynamicResponsiveContainer width="100%" height={300}>
                  <DynamicAreaChart data={getMonthlyRevenueData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${Number(value).toFixed(1)}M VNĐ`, ""]} />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stackId="1"
                      stroke="#10b981"
                      fill="#10b981"
                      fillOpacity={0.6}
                      name="Doanh thu"
                    />
                  </DynamicAreaChart>
                </DynamicResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Phễu bán hàng</CardTitle>
              </CardHeader>
              <CardContent>
                <DynamicResponsiveContainer width="100%" height={300}>
                  <DynamicPieChart>
                    <Pie
                      data={getSalesFunnelData()}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {getSalesFunnelData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </DynamicPieChart>
                </DynamicResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Hiệu suất theo hãng xe</CardTitle>
              </CardHeader>
              <CardContent>
                <DynamicResponsiveContainer width="100%" height={300}>
                  <DynamicBarChart data={getCarPerformanceByBrand()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="brand" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${Number(value).toFixed(1)}M VNĐ`, ""]} />
                    <Legend />
                    <Bar dataKey="sold" fill="#3b82f6" name="Xe đã bán" />
                    <Bar dataKey="revenue" fill="#10b981" name="Doanh thu (M VNĐ)" />
                  </DynamicBarChart>
                </DynamicResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Hoạt động hàng tuần</CardTitle>
              </CardHeader>
              <CardContent>
                <DynamicResponsiveContainer width="100%" height={300}>
                  <DynamicLineChart data={weeklyActivityChart}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="views" stroke="#3b82f6" strokeWidth={3} name="Lượt xem" />
                    <Line type="monotone" dataKey="messages" stroke="#f59e0b" strokeWidth={3} name="Tin nhắn" />
                    <Line type="monotone" dataKey="inquiries" stroke="#10b981" strokeWidth={3} name="Yêu cầu xem xe" />
                  </DynamicLineChart>
                </DynamicResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Existing performance stats */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Hiệu suất bán hàng</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Xe đã bán tháng này</span>
                    <span className="font-semibold">
                      {transactions.filter(t => {
                        if (t.status === "COMPLETED" && t.contractDate) {
                          const date = new Date(t.contractDate)
                          const now = new Date()
                          return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
                        }
                        return false
                      }).length} xe
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Tỷ lệ chuyển đổi</span>
                    <span className="font-semibold text-green-600">
                      {dashboardStats.totalViews > 0
                        ? ((transactions.filter(t => t.status === "COMPLETED").length / dashboardStats.totalViews) * 100).toFixed(1)
                        : 0}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Tổng xe đã bán</span>
                    <span className="font-semibold">{transactions.filter(t => t.status === "COMPLETED").length} xe</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tình hình tài chính</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Doanh thu tháng này</span>
                    <span className="font-semibold text-green-600">
                      {formatMoney(
                        transactions
                          .filter(t => {
                            console.log(t);

                            if (t.status === "COMPLETED" && t.contractDate) {
                              const date = new Date(t.contractDate)
                              console.log(date);

                              const now = new Date()
                              return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
                            }
                            return false
                          })
                          .reduce((sum, t) => sum + (t.priceAgreed || 0), 0)
                      )}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Thanh toán chờ xử lý</span>
                    <span className="font-semibold text-orange-600">
                      {formatMoney(
                        transactions
                          .filter(t => t.status === "PENDING")
                          .reduce((sum, t) => sum + (t.priceAgreed || 0), 0)
                      )}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Tổng doanh thu</span>
                    <span className="font-semibold text-blue-600">{formatMoney(dashboardStats.totalRevenue)}</span>
                  </div>
                  {/* <div className="flex items-center justify-between">
                    <span className="text-sm">Phí đã trả (2.3%)</span>
                    <span className="font-semibold text-gray-600">{formatMoney(dashboardStats.totalRevenue * 0.023)}</span>
                  </div> */}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="listings" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Tin đăng của tôi</h2>
            <Button onClick={() => route.push("/sell-car")}>
              <Plus className="h-4 w-4 mr-2" />
              Đăng tin mới
            </Button>
          </div>

          {/* Status Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card
              className={`cursor-pointer transition-all hover:shadow-md ${statusFilter === "all" ? "ring-2 ring-blue-500" : ""}`}
              onClick={() => setStatusFilter("all")}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Tất cả</p>
                    <p className="text-2xl font-bold">{carPosts.length}</p>
                  </div>
                  <Car className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card
              className={`cursor-pointer transition-all hover:shadow-md ${statusFilter === "PENDING" ? "ring-2 ring-yellow-500" : ""}`}
              onClick={() => setStatusFilter("PENDING")}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">⏳ Chờ duyệt</p>
                    <p className="text-2xl font-bold text-yellow-600">
                      {carPosts.filter(car => car.status === "PENDING").length}
                    </p>
                  </div>
                  <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center">
                    <span className="text-lg">⏳</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card
              className={`cursor-pointer transition-all hover:shadow-md ${statusFilter === "APPROVED" ? "ring-2 ring-green-500" : ""}`}
              onClick={() => setStatusFilter("APPROVED")}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">✅ Đã duyệt</p>
                    <p className="text-2xl font-bold text-green-600">
                      {carPosts.filter(car => car.status === "APPROVED").length}
                    </p>
                  </div>
                  <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                    <span className="text-lg">✅</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card
              className={`cursor-pointer transition-all hover:shadow-md ${statusFilter === "REJECTED" ? "ring-2 ring-red-500" : ""}`}
              onClick={() => setStatusFilter("REJECTED")}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">❌ Từ chối</p>
                    <p className="text-2xl font-bold text-red-600">
                      {carPosts.filter(car => car.status === "REJECTED").length}
                    </p>
                  </div>
                  <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                    <span className="text-lg">❌</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col gap-4">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Tìm kiếm theo tên xe..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Filter Controls */}
                <div className="flex flex-wrap gap-4 items-center">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Lọc:</span>
                  </div>

                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[160px]">
                      <SelectValue placeholder="Trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả trạng thái</SelectItem>
                      <SelectItem value="PENDING">⏳ Chờ duyệt</SelectItem>
                      <SelectItem value="APPROVED">✅ Đã duyệt</SelectItem>
                      <SelectItem value="REJECTED">❌ Từ chối</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={priceFilter} onValueChange={setPriceFilter}>
                    <SelectTrigger className="w-[160px]">
                      <SelectValue placeholder="Khoảng giá" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả giá</SelectItem>
                      <SelectItem value="under-500m">Dưới 500 triệu</SelectItem>
                      <SelectItem value="500m-1b">500 triệu - 1 tỷ</SelectItem>
                      <SelectItem value="1b-2b">1 - 2 tỷ</SelectItem>
                      <SelectItem value="over-2b">Trên 2 tỷ</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[160px]">
                      <SelectValue placeholder="Sắp xếp" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Mới nhất</SelectItem>
                      <SelectItem value="oldest">Cũ nhất</SelectItem>
                      <SelectItem value="price-high">Giá cao → thấp</SelectItem>
                      <SelectItem value="price-low">Giá thấp → cao</SelectItem>
                      <SelectItem value="most-viewed">Xem nhiều nhất</SelectItem>
                    </SelectContent>
                  </Select>

                  {(searchQuery || statusFilter !== "all" || priceFilter !== "all" || sortBy !== "newest") && (
                    <Button variant="outline" size="sm" onClick={clearFilters}>
                      <X className="h-4 w-4 mr-1" />
                      Xóa bộ lọc
                    </Button>
                  )}
                </div>

                {/* Results Summary */}
                <div className="text-sm text-muted-foreground">
                  Hiển thị {filteredCarPosts.length} / {carPosts.length} tin đăng
                  {searchQuery && <span> cho từ khóa "{searchQuery}"</span>}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4">
            {filteredCarPosts.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <div className="text-muted-foreground">
                    {carPosts.length === 0 ? (
                      <>
                        <Car className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p className="text-lg font-medium mb-2">Chưa có tin đăng nào</p>
                        <p>Hãy đăng tin đầu tiên để bắt đầu bán xe!</p>
                      </>
                    ) : (
                      <>
                        <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p className="text-lg font-medium mb-2">Không tìm thấy kết quả</p>
                        <p>Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc</p>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : (
              filteredCarPosts.map((car) => (
                <Card key={car?.id} className={car?.status === "REJECTED" ? "border-red-200 bg-red-50/50" : car?.status === "PENDING" ? "border-yellow-200 bg-yellow-50/50" : ""}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={car?.carImages?.[0]?.imageUrl || "/placeholder.svg"}
                        alt={car?.title}
                        className="w-24 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold">{car?.title}</h3>
                        <p className="text-lg font-bold text-blue-600">{formatMoney(car?.price)}</p>
                        <p className="text-sm text-muted-foreground">Đăng ngày: {formatDateToDate(car?.createdAt)}</p>
                        {/* Hiển thị lý do từ chối nếu có */}
                        {car?.status === "REJECTED" && car?.rejectionReason && (
                          <div className="mt-2 p-2 bg-red-100 border border-red-200 rounded-md">
                            <p className="text-sm text-red-700 flex items-center gap-1">
                              <AlertCircle className="h-4 w-4" />
                              <span className="font-medium">Lý do từ chối:</span> {car.rejectionReason}
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="text-center min-w-[120px]">
                        <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            {car?.view || 0}
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageCircle className="h-4 w-4" />
                            {car?.inquiries || 0}
                          </div>
                        </div>
                        <Badge
                          variant={
                            car?.status === "APPROVED" ? "default" :
                              car?.status === "PENDING" ? "outline" :
                                "destructive"
                          }
                          className={`mt-2 ${car?.status === "APPROVED" ? "bg-green-600" :
                            car?.status === "PENDING" ? "bg-yellow-500 text-white border-yellow-500" :
                              ""
                            }`}
                        >
                          {car?.status === "APPROVED" ? "✅ Đang bán" :
                            car?.status === "PENDING" ? "⏳ Chờ duyệt" :
                              "❌ Từ chối"}
                        </Badge>
                      </div>
                      <div className="flex flex-col gap-2">
                        {car?.status !== "REJECTED" && (
                          <CarEditDialog
                            car={car}
                            triggerText="Chỉnh sửa"
                            triggerVariant="outline"
                            onRefresh={fetchListCarPosts}
                          />
                        )}
                        <Button variant="outline" size="sm" onClick={() => route.push(`/car/${car?.id}`)}>
                          Xem chi tiết
                        </Button>
                        {car?.status === "REJECTED" && (
                          <Button variant="default" size="sm" className="bg-blue-600 hover:bg-blue-700">
                            Đăng lại
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => openDeleteDialog(car)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Xóa
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-6">
          {/* Section for Offline/Showroom Transactions */}
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border-2 border-blue-200 dark:border-blue-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                Giao dịch tại Showroom (Offline)
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Tạo hóa đơn và hợp đồng cho khách hàng đến showroom mua xe trực tiếp (không cần tài khoản)
              </p>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                <ContractGenerator />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Giao dịch Online (Từ Website)</h2>
            <div className="text-sm text-muted-foreground">
              <p>💡 Giao dịch từ khách hàng bấm "Mua ngay" trên web</p>
            </div>
          </div>

          <div className="grid gap-4">
            {transactions?.map((transaction) => (
              <Card key={transaction.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h3 className="font-semibold">{transaction?.car?.carModelsName}</h3>
                      <p className="text-sm text-muted-foreground">Người mua: {transaction?.buyer?.fullName}</p>
                      <p className="text-sm text-muted-foreground">Ngày: {formatDateToDate(transaction?.contractDate)}</p>
                      <p className="text-sm text-muted-foreground">Mã HĐ: {transaction?.contractNumber}</p>
                    </div>

                    <div className="text-right space-y-2">
                      <p className="text-lg font-bold text-green-600">{formatMoney(transaction?.priceAgreed)}</p>
                      <Badge variant={getStatusColor(transaction?.status)}>{getStatusText(transaction?.status)}</Badge>
                    </div>

                    <div className="flex flex-col gap-2">
                      {canSellerUpdateStatus(transaction?.status) && (
                        <div className="flex flex-col gap-1">
                          <Button
                            size="sm"
                            onClick={() => handleStatusUpdate(transaction?.id, "CONFIRMED")}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            ✓ Xác nhận
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleStatusUpdate(transaction?.id, "CANCELLED")}
                          >
                            ✗ Hủy bỏ
                          </Button>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <TransactionEditDialog
                        transactionId={transaction?.id}
                        onRefresh={() => fetchTransactionBySellerId(Number(currentUser?.id))}
                      />
                      {
                        transaction?.status !== "CANCELLED" &&
                        <ContractGenerator
                          transaction={transaction}
                          onRefresh={() => fetchTransactionBySellerId(Number(currentUser?.id))}
                          onUpdate={() => handleStatusUpdate(transaction.id, "COMPLETED")}
                        />
                      }
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="financial" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Báo cáo tài chính</h2>
            <div className="flex gap-2">
              <Button variant="outline">
                <TrendingUp className="h-4 w-4 mr-2" />
                Xuất báo cáo
              </Button>
              <Button>
                <CreditCard className="h-4 w-4 mr-2" />
                Rút tiền
              </Button>
            </div>
          </div>

          {/* Financial Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Tổng doanh thu</p>
                  <p className="text-3xl font-bold text-green-600">{formatMoney(dashboardStats.totalRevenue)}</p>
                  <p className="text-sm text-green-600 mt-1">
                    Từ {transactions.filter(t => t.status === "COMPLETED").length} giao dịch
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Số dư khả dụng</p>
                  <p className="text-3xl font-bold text-blue-600">{formatMoney(dashboardStats.availableBalance)}</p>
                  <p className="text-sm text-blue-600 mt-1">Có thể rút ngay</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Tổng phí đã trả</p>
                  <p className="text-3xl font-bold text-purple-600">{formatMoney(dashboardStats.totalRevenue * 0.023)}</p>
                  <p className="text-sm text-purple-600 mt-1">2.3% tổng doanh thu</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Doanh thu vs Phí theo tháng</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={getMonthlyRevenueData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${Number(value).toFixed(1)}M VNĐ`, ""]} />
                    <Legend />
                    <Bar dataKey="revenue" fill="#10b981" name="Doanh thu" />
                    <Bar dataKey="fees" fill="#ef4444" name="Phí đã trả" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Số xe bán theo tháng</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={getMonthlyRevenueData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="carsSold"
                      stroke="#3b82f6"
                      strokeWidth={4}
                      name="Xe đã bán"
                      dot={{ fill: "#3b82f6", strokeWidth: 2, r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Monthly Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Hiệu suất theo tháng</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {getMonthlyRevenueData().length > 0 ? (
                  getMonthlyRevenueData().map((month, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="font-semibold">Tháng {month.month.substring(1)}</div>
                      <div className="flex items-center gap-8 text-sm">
                        <div>
                          <span className="text-muted-foreground">Xe bán: </span>
                          <span className="font-semibold">{month.carsSold}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Doanh thu: </span>
                          <span className="font-semibold text-green-600">{month.revenue.toFixed(1)}M VNĐ</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Phí: </span>
                          <span className="font-semibold text-red-600">{month.fees.toFixed(1)}M VNĐ</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>Chưa có dữ liệu giao dịch</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="debts" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Quản lý công nợ</h2>
            <Button>
              <AlertCircle className="h-4 w-4 mr-2" />
              Thanh toán nợ
            </Button>
          </div>

          {/* Debt Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Phí hệ thống chưa thanh toán</p>
                    <p className="text-2xl font-bold text-red-600">
                      {formatMoney(
                        transactions
                          .filter(t => t.status === "CONFIRMED")
                          .reduce((sum, t) => sum + (t.priceAgreed || 0) * 0.023, 0)
                      )}
                    </p>
                    <p className="text-sm text-red-600 mt-1">
                      Từ {transactions.filter(t => t.status === "CONFIRMED").length} giao dịch
                    </p>
                  </div>
                  <AlertCircle className="h-8 w-8 text-red-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Thanh toán chờ xác nhận</p>
                    <p className="text-2xl font-bold text-orange-600">
                      {formatMoney(
                        transactions
                          .filter(t => t.status === "PENDING")
                          .reduce((sum, t) => sum + (t.priceAgreed || 0), 0)
                      )}
                    </p>
                    <p className="text-sm text-orange-600 mt-1">
                      Từ {transactions.filter(t => t.status === "PENDING").length} giao dịch
                    </p>
                  </div>
                  <CreditCard className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Outstanding Payments */}
          <Card>
            <CardHeader>
              <CardTitle>Giao dịch chưa hoàn thành</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactions
                  .filter(t => t.status === "PENDING" || t.status === "CONFIRMED")
                  .length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>Không có giao dịch chờ xử lý</p>
                  </div>
                ) : (
                  transactions
                    .filter(t => t.status === "PENDING" || t.status === "CONFIRMED")
                    .map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h3 className="font-semibold">{transaction?.car?.carModelsName}</h3>
                          <p className="text-sm text-muted-foreground">Người mua: {transaction?.buyer?.fullName}</p>
                          <p className="text-sm text-muted-foreground">
                            Ngày giao dịch: {formatDateToDate(transaction?.contractDate)}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="text-lg font-bold text-orange-600">{formatMoney(transaction?.priceAgreed)}</p>
                          <Badge variant={transaction.status === "PENDING" ? "secondary" : "outline"}>
                            {getStatusText(transaction.status)}
                          </Badge>
                        </div>

                        <div className="flex gap-2">
                          {transaction.status === "PENDING" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleStatusUpdate(transaction.id, "CONFIRMED")}
                            >
                              Xác nhận
                            </Button>
                          )}
                        </div>
                      </div>
                    ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-600 flex items-center gap-2">
              <Trash2 className="h-5 w-5" />
              Xác nhận xóa tin đăng
            </DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa tin đăng này không? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>

          {carToDelete && (
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <img
                src={carToDelete.carImages?.[0]?.imageUrl || "/placeholder.svg"}
                alt={carToDelete.title}
                className="w-20 h-14 object-cover rounded"
              />
              <div>
                <h4 className="font-semibold">{carToDelete.title}</h4>
                <p className="text-sm text-muted-foreground">{formatMoney(carToDelete.price)}</p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteDialogOpen(false)
                setCarToDelete(null)
              }}
              disabled={isDeleting}
            >
              Hủy
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteCar}
              disabled={isDeleting}
            >
              {isDeleting ? "Đang xóa..." : "Xác nhận xóa"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import CarAPI from "@/lib/api/car"
import FeeAPI from "@/lib/api/fee"
import PaymentAPI from "@/lib/api/payment"
import userAPI from "@/lib/api/user"
import { CarUtils } from "@/lib/utils/car-ultils"
import { formatMoney } from "@/lib/utils/money-format"
import { formatDateToDate, formatDateToDateTime } from "@/lib/utils/time-format"
import { CarDTO } from "@/types/car"
import { FeeDTO } from "@/types/fee"
import { MonthlyTotalRevenue, RevenueComparisonByType } from "@/types/payment"
import { UserDTO } from "@/types/user"
import { Label } from "@radix-ui/react-label"
import {
  AlertTriangle,
  Ban,
  BarChart3,
  Calendar,
  Car,
  CheckCircle,
  Clock,
  Cog,
  DollarSign,
  Eye,
  Fuel,
  Gauge,
  MapPin,
  MoreVertical,
  Receipt,
  Search,
  ThumbsDown,
  ThumbsUp,
  TrendingUp,
  Users,
  XCircle
} from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { toast } from "sonner"
import { SystemFeesManager } from "../fee/SystemFeesManager"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog"
import { Textarea } from "../ui/textarea"

const mockReports = [
  {
    id: 1,
    type: "spam",
    reporter: "Nguyễn Văn D",
    reported: "Trần Văn E",
    reason: "Đăng tin spam nhiều lần",
    date: "22/03/2024",
    status: "pending",
  },
  {
    id: 2,
    type: "fraud",
    reporter: "Lê Thị F",
    reported: "Phạm Văn G",
    reason: "Thông tin xe không chính xác",
    date: "21/03/2024",
    status: "resolved",
  },
]


const mockTransactions = [
  {
    id: 1,
    carTitle: "Toyota Camry 2019",
    seller: "Nguyễn Văn A",
    buyer: "Trần Thị B",
    amount: "1,200,000,000",
    date: "20/03/2024",
    status: "completed",
    invoiceId: "INV-2024-001",
  },
  {
    id: 2,
    carTitle: "Honda Civic 2020",
    seller: "Lê Văn C",
    buyer: "Phạm Thị D",
    amount: "750,000,000",
    date: "18/03/2024",
    status: "pending",
    invoiceId: "INV-2024-002",
  },
  {
    id: 3,
    carTitle: "Mazda CX-5 2021",
    seller: "Hoàng Văn E",
    buyer: "Vũ Thị F",
    amount: "950,000,000",
    date: "16/03/2024",
    status: "confirmed",
    invoiceId: "INV-2024-003",
  },
  {
    id: 4,
    carTitle: "Hyundai Tucson 2020",
    seller: "Đặng Văn G",
    buyer: "Bùi Thị H",
    amount: "850,000,000",
    date: "14/03/2024",
    status: "disputed",
    invoiceId: "INV-2024-004",
  },
]

const userGrowthChart = [
  { month: "T1", users: 850, sellers: 120 },
  { month: "T2", users: 920, sellers: 135 },
  { month: "T3", users: 1050, sellers: 158 },
  { month: "T4", users: 1180, sellers: 175 },
  { month: "T5", users: 1247, sellers: 192 },
]

const transactionStatusChart = [
  { name: "Hoàn thành", value: 65, color: "#10b981" },
  { name: "Đang xử lý", value: 20, color: "#f59e0b" },
  { name: "Đã hủy", value: 10, color: "#ef4444" },
  { name: "Tranh chấp", value: 5, color: "#8b5cf6" },
]

const dailyActivityChart = [
  { day: "T2", posts: 45, transactions: 12, users: 23 },
  { day: "T3", posts: 52, transactions: 15, users: 28 },
  { day: "T4", posts: 48, transactions: 18, users: 31 },
  { day: "T5", posts: 65, transactions: 22, users: 35 },
  { day: "T6", posts: 58, transactions: 19, users: 29 },
  { day: "T7", posts: 42, transactions: 14, users: 25 },
  { day: "CN", posts: 38, transactions: 11, users: 22 },
]


export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [searchTerm, setSearchTerm] = useState("")
  const [editingFee, setEditingFee] = useState<string | null>(null)
  const [carPosts, setCarPosts] = useState<CarDTO[]>([])
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [rejectionReason, setRejectionReason] = useState("")
  const [statusFilter, setStatusFilter] = useState<"ALL" | "PENDING" | "APPROVED" | "REJECTED">("ALL")
  const [selectedListing, setSelectedListing] = useState<typeof carPosts[0] | null>(null)
  const [users, setUsers] = useState<UserDTO[]>([])
  const [dataMonthlyTotalRevenue, setDataMonthlyTotalRevenue] = useState<MonthlyTotalRevenue[]>([]);
  const [revenues, setRevenues] = useState<RevenueComparisonByType>()
  const [fees, setFees] = useState<FeeDTO[]>();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedFee, setSelectedFee] = useState<FeeDTO | null>(null);
  const [formData, setFormData] = useState({
    id: 0,
    name: "",
    icon: "",
    code: "",
    type: "",
    price: 0,
    sale: 0,
    expirySale: "",
  });

  const handleAdd = () => {
    // if (formData.) {
    //   toast.error("Vui lòng điền đầy đủ thông tin");
    //   return;
    // }

    // const newFee: FeeDTO = {
    //   id: 0,
    //   name: "",
    //   icon: "",
    //   code: "",
    //   type: "",
    //   price: 0,
    //   sale: 0,
    //   expirySale: "",
    // };

    // setFees([...fees, newFee]);
    // setFormData({ service: "", price: "", unit: "" });
    // setIsAddDialogOpen(false);
    // toast.success("Đã thêm phí hệ thống mới");
  };

  const handleEdit = () => {
    if (!selectedFee || !formData.name || !formData.price || !formData.sale) {
      toast.error("Vui lòng điền đầy đủ thông tin");
      return;
    }

    setFees(
      fees?.map((fee) =>
        fee.id === selectedFee.id
          ? { ...fee, name: formData.name, price: formData.price, sale: formData.sale }
          : fee
      )
    );

    setIsEditDialogOpen(false);
    setSelectedFee(null);
    setFormData({
      id: 0,
      name: "",
      icon: "",
      code: "",
      type: "",
      price: 0,
      sale: 0,
      expirySale: ""
    });
    toast.success("Đã cập nhật phí hệ thống");
  };

  const handleDelete = () => {
    if (!selectedFee) return;

    setFees(fees?.filter((fee) => fee.id !== selectedFee.id));
    setIsDeleteDialogOpen(false);
    setSelectedFee(null);
    toast.success("Đã xóa phí hệ thống");
  };

  const openEditDialog = (fee: FeeDTO) => {
    setSelectedFee(fee);
    setFormData({
      id: fee.id,
      name: fee?.name,
      icon: fee?.icon,
      code: fee?.code,
      type: fee?.type,
      price: fee.price,
      sale: fee.sale,
      expirySale: "",
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (fee: FeeDTO) => {
    setSelectedFee(fee);
    setIsDeleteDialogOpen(true);
  };
  const fetchCarPosts = async () => {
    try {
      const res = await CarAPI.getCars();
      if (res.status === 200) {
        setCarPosts(res.data)
      } else {
        console.error("Failed to fetch car posts")
      }
    } catch (error) {
      console.error("Error fetching car posts:", error)
    }
  }

  const changeStatusCar = async (carId: number, status: string, rejectReason?: string) => {
    try {
      const res = await CarAPI.changeStatusCar(carId, status, rejectReason);
      if (res.status === 200) {
        fetchCarPosts()
      } else {
        console.error("Failed to change car status")
      }
    } catch (error) {
      console.error("Error changing car status:", error)
    }
  }

  const fetchUsers = async (role: string) => {
    try {
      const res = await userAPI.findByRole(role);
      if (res.status === 200) {
        setUsers(res.data);
      } else {
        console.error("Failed to fetch users");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }

  const fetchDataMonthTotalRevenue = async (year: number) => {
    try {
      const res = await PaymentAPI.getMonthlyTotalRevenue(year);
      console.log(res);

      if (res.status === 200) {
        setDataMonthlyTotalRevenue(res.data)
      }
    } catch (error) {
      console.log("Error fetching monthly total revenue ", error);
    }

  }

  const fetchRevenuesByType = async (type: string) => {
    try {
      const res = await PaymentAPI.getRevenueByType(type.toUpperCase());
      if (res.status === 200) {
        setRevenues(res.data);
      }
    } catch (error) {
      console.log("Error fetching revenue ", error);

    }
  }

  const caclRevenueMonth = () => {
    const targetMonth = `T${(new Date().getMonth() + 1).toString()}`; // +1 nếu muốn hiển thị 1-12
    return dataMonthlyTotalRevenue.find(item => item.month.toString() === targetMonth);
  };

  const fetchFeesStytem = async () => {
    try {
      const res = await FeeAPI.getAllFees();
      if (res.status === 200) {
        setFees(res.data)
      }
    } catch (error) {
      console.log("Error fetching system fees ", error);

    }
  }
  useEffect(() => {
    fetchCarPosts()
    fetchUsers("USER")
    fetchDataMonthTotalRevenue(new Date().getFullYear());
    fetchRevenuesByType("3MONTHS")
    fetchFeesStytem()
  }, [])

  const calculateIncrease = (current: number, previous: number): string => {
    if (previous === 0) {
      if (current === 0) return "0%";
      return "+∞%";
    }

    const ratio = current / previous;
    const percentChange = (ratio - 1) * 100;

    const formatted = Math.abs(percentChange).toFixed(2); // làm tròn 2 chữ số
    return percentChange >= 0 ? `+${formatted}%` : `-${formatted}%`;
  };


  const handleHideListing = (listingId: number) => {
    console.log(`Hiding listing ${listingId}`)
    // API call to hide the listing
    setSelectedListing(null)
  }

  const filteredListings = carPosts
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .filter(listing => {
      const matchesSearch =
        listing?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing?.user?.fullName.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === "ALL" || listing.status === statusFilter
      return matchesSearch && matchesStatus
    })


  const handleUserAction = async (userId: number, action: "INACTIVE" | "ACTIVE" | "LOCKED") => {
    try {
      const res = await userAPI.changeAccountStatus(userId, action);
      if (res.status === 200) {
        fetchUsers("USER")
      } else {
        console.error("Failed to change user status")
      }
    } catch (error) {
      console.error("Error changing user status:", error)
    }
  }
  const handleApproveListing = async (listingId: number) => {
    await changeStatusCar(listingId, "APPROVED")
  }
  const handleRejectListing = async (listingId: number, reason: string) => {
    await changeStatusCar(listingId, "REJECTED", reason)
    setShowRejectDialog(false)
    setRejectionReason("")
  }

  const handleReportAction = (reportId: number, action: "APPROVED" | "REJECTED") => {
    console.log(`${action} report ${reportId}`)
  }

  const updateSystemFee = (service: string, newPrice: string) => {
    console.log(`Updating ${service} to ${newPrice}`)
    setEditingFee(null)
  }

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "COMPLETED":
        return "default"
      case "CONFIRMED":
        return "secondary"
      case "PENDING":
        return "outline"
      case "CANCELLED":
        return "destructive"
      case "DISPUTED":
        return "destructive"
      default:
        return "outline"
    }
  }

  const getStatusText = (status: string) => {
    switch (status.toUpperCase()) {
      case "COMPLETED":
        return "Hoàn thành"
      case "CONFIRMED":
        return "Đã xác nhận"
      case "PENDING":
        return "Chờ xác nhận"
      case "CANCELLED":
        return "Đã hủy"
      case "DISPUTED":
        return "Tranh chấp"
      default:
        return "Không xác định"
    }
  }


  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Badge className="bg-yellow-700 text-white "><Clock className="h-3 w-3 mr-1" />Chờ duyệt</Badge>
      case "APPROVED":
        return <Badge className="bg-green-500 text-white"><CheckCircle className="h-3 w-3 mr-1" />Đã duyệt</Badge>
      case "REJECTED":
        return <Badge className="bg-red-500 text-white"><XCircle className="h-3 w-3 mr-1" />Từ chối</Badge>
      default:
        return null
    }
  }

  const handleAdminStatusUpdate = (transactionId: number, newStatus: string) => {
    console.log(`[v0] Admin updating transaction ${transactionId} to status: ${newStatus}`)
    // Admin can change any status
  }

  return (
    <div className="space-y-6">
      {/* Admin Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tổng người dùng</p>
                <p className="text-2xl font-bold">{users?.length}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tổng tin đăng</p>
                <p className="text-2xl font-bold">{carPosts?.length}</p>
              </div>
              <Car className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Giao dịch tháng</p>
                <p className="text-2xl font-bold">89</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Doanh thu tháng</p>
                <p className="text-2xl font-bold">{formatMoney(caclRevenueMonth()?.total)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-emerald-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Báo cáo chờ</p>
                <p className="text-2xl font-bold">12</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Tổng quan</TabsTrigger>
          <TabsTrigger value="users">Người dùng</TabsTrigger>
          <TabsTrigger value="listings">Tin đăng</TabsTrigger>
          <TabsTrigger value="transactions">Giao dịch</TabsTrigger>
          <TabsTrigger value="reports">Báo cáo</TabsTrigger>
          <TabsTrigger value="fees">Quản lý phí</TabsTrigger>
          <TabsTrigger value="revenue">Báo cáo doanh thu</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Trend Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Xu hướng doanh thu</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={dataMonthlyTotalRevenue}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${formatMoney(Number(value), true)}`, ""]} />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="total"
                      stackId="1"
                      stroke="#10b981"
                      fill="#10b981"
                      fillOpacity={0.6}
                      name="Tổng doanh thu"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* User Growth Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Tăng trưởng người dùng</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={userGrowthChart}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={3} name="Tổng người dùng" />
                    <Line type="monotone" dataKey="sellers" stroke="#f59e0b" strokeWidth={3} name="Người bán" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Transaction Status Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Phân bố trạng thái giao dịch</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={transactionStatusChart}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {transactionStatusChart.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, ""]} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Daily Activity Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Hoạt động hàng ngày (7 ngày qua)</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={dailyActivityChart}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="posts" fill="#3b82f6" name="Tin đăng" />
                    <Bar dataKey="transactions" fill="#10b981" name="Giao dịch" />
                    <Bar dataKey="users" fill="#f59e0b" name="Người dùng mới" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Existing activity stats */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Thống kê hoạt động</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Người dùng mới hôm nay</span>
                    <span className="font-semibold text-green-600">+23</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Tin đăng mới hôm nay</span>
                    <span className="font-semibold text-blue-600">+45</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Giao dịch hoàn thành</span>
                    <span className="font-semibold text-purple-600">+8</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cảnh báo hệ thống</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    <span className="text-sm">5 báo cáo spam cần xử lý</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-4 w-4 text-orange-500" />
                    <span className="text-sm">2 tài khoản nghi vấn gian lận</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm">Server load cao trong giờ cao điểm</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Quản lý người dùng</h2>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm người dùng..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="grid gap-4">
            {users?.map((user) => (
              <Card key={user.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage src={user?.profilePicture || "/placeholder.svg"} />
                        <AvatarFallback>{user?.fullName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{user?.fullName}</h3>
                        <p className="text-sm text-muted-foreground">{user?.email}</p>
                        <div className="flex items-center gap-2 mt-1">
                          {/* <Badge variant="outline">{user?.role === "seller" ? "Người bán" : "Thành viên"}</Badge> */}
                          <Badge variant={user?.accountStatus === "ACTIVE" ? "default" : "destructive"} className={user?.accountStatus === "ACTIVE" ? "bg-green-700" : "bg-red-500"}>
                            {user?.accountStatus === "ACTIVE" ? "Hoạt động" : "Tạm khóa"}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Tham gia: {formatDateToDate(user?.createdAt)}</p>
                      {/* <p className="text-sm text-muted-foreground">Tin đăng: {user?.carsListed}</p> */}
                    </div>

                    <div className="flex items-center gap-2">
                      {user?.accountStatus === "ACTIVE" ? (
                        <Button variant="outline" size="sm" className="bg-red-500 text-white" onClick={() => handleUserAction(user?.id, "INACTIVE")}>
                          <Ban className="h-4 w-4 mr-2" />
                          Tạm khóa
                        </Button>
                      ) : (
                        <Button variant="outline" size="sm" className="bg-blue-500 text-white" onClick={() => handleUserAction(user?.id, "ACTIVE")}>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Kích hoạt
                        </Button>
                      )}
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>


        <TabsContent value="listings" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl">Quản lý tin đăng</CardTitle>
                <div className="flex items-center gap-4">
                  <div className="relative w-80">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Tìm kiếm theo tên xe, người đăng..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant={statusFilter === "ALL" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setStatusFilter("ALL")}
                      className={statusFilter === "ALL" ? "bg-blue-700 hover:bg-blue-800 text-white" : ""}
                    >
                      Tất cả ({carPosts.length})
                    </Button>
                    <Button
                      variant={statusFilter === "PENDING" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setStatusFilter("PENDING")}
                      className={statusFilter === "PENDING" ? "bg-blue-700 hover:bg-blue-800 text-white" : ""}
                    >
                      <Clock className="h-4 w-4 mr-1" />
                      Chờ duyệt ({carPosts.filter(l => l.status === "PENDING").length})
                    </Button>
                    <Button
                      variant={statusFilter === "APPROVED" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setStatusFilter("APPROVED")}
                      className={statusFilter === "APPROVED" ? "bg-blue-700 hover:bg-blue-800 text-white" : ""}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Đã duyệt ({carPosts.filter(l => l.status === "APPROVED").length})
                    </Button>
                    <Button
                      variant={statusFilter === "REJECTED" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setStatusFilter("REJECTED")}
                      className={statusFilter === "REJECTED" ? "bg-blue-700 hover:bg-blue-800 text-white" : ""}
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Từ chối ({carPosts.filter(l => l.status === "REJECTED").length})
                    </Button>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                {filteredListings?.map((listing) => (
                  <Card key={listing?.id} className="overflow-hidden hover:shadow-lg transition-all border-primary/10">
                    <div className="grid md:grid-cols-[300px_1fr] gap-6 p-6">
                      {/* Car Image */}
                      <div className="relative rounded-lg overflow-hidden bg-muted">
                        <Image
                          src={listing?.carImages?.[0]?.imageUrl || "/placeholder.svg"}
                          alt={listing?.title}
                          width={300}
                          height={200}
                          className={`absolute transition-opacity duration-300 `}
                        />

                        <div className="absolute top-3 right-3 text-white">
                          {getStatusBadge(listing?.status)}
                        </div>
                      </div>

                      {/* Car Details */}
                      <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2 flex-1">
                            <h3 className="text-xl font-bold">{listing?.title}</h3>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                <span>{listing?.year}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Gauge className="h-4 w-4" />
                                <span>{listing?.odo}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                <span>{listing?.location}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Cog className="h-4 w-4" />
                                <span>{CarUtils.changeTransmission(listing?.transmission)}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Fuel className="h-4 w-4" />
                                <span>{CarUtils.changeFuelType(listing?.fuelType)}</span>
                              </div>
                            </div>
                            <p className="text-2xl font-bold text-success">{formatMoney(listing?.price)}</p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground line-clamp-2">{listing?.description}</p>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-12 w-12">
                              <AvatarImage src={listing?.user?.profilePicture || "/placeholder.svg"} />
                              <AvatarFallback>{listing?.user?.fullName}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{listing?.user?.fullName}</p>
                              <p className="text-xs text-muted-foreground">{listing?.user?.phone}</p>
                              <p className="text-xs text-muted-foreground">Đăng ngày: {formatDateToDate(listing?.createdAt)}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {listing.status === "PENDING" && (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setSelectedListing(listing)}
                                >
                                  <Eye className="h-4 w-4 mr-2" />
                                  Xem chi tiết
                                </Button>
                                <Button
                                  size="sm"
                                  className="bg-green-600 hover:bg-green/90"
                                  onClick={() => handleApproveListing(listing.id)}
                                >
                                  <ThumbsUp className="h-4 w-4 mr-2" />
                                  Duyệt tin
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedListing(listing)
                                    setShowRejectDialog(true)
                                  }}
                                >
                                  <ThumbsDown className="h-4 w-4 mr-2" />
                                  Từ chối
                                </Button>
                              </>
                            )}

                            {listing?.status === "REJECTED" && (
                              <div className="space-y-1">
                                <div className="flex items-center gap-2 text-sm text-red-600">
                                  <XCircle className="h-4 w-4 text-red-600" />
                                  <span>Từ chối: {formatDateToDateTime(listing?.rejectedDate)}</span>
                                </div>
                                <p className="text-xs text-destructive">Lý do: {listing?.rejectionReason}</p>
                              </div>
                            )}
                            {listing.status === "APPROVED" && (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => setSelectedListing(listing)}
                                  className="bg-blue-500 text-white hover:bg-blue-600"
                                >
                                  <Eye className="h-4 w-4 mr-2" />
                                  Xem chi tiết
                                </Button>

                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="border-yellow-500 text-yellow-500 hover:bg-yellow-100"
                                  onClick={() => handleHideListing(listing.id)}
                                >
                                  <Ban className="h-4 w-4 mr-2" />
                                  Ẩn bài
                                </Button>
                                {listing?.status === "APPROVED" && (
                                  <div className="flex items-center gap-2 text-sm text-green-700">
                                    <CheckCircle className="h-4 w-4 text-green-700" />
                                    <span>Đã duyệt: {listing?.approvedDate}</span>
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Listing Detail Dialog */}
        {selectedListing && !showRejectDialog && (
          <Dialog open={!!selectedListing} onOpenChange={() => setSelectedListing(null)}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl">{selectedListing?.title}</DialogTitle>
                <DialogDescription>
                  Chi tiết tin đăng - {getStatusBadge(selectedListing?.status)}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                <div className="rounded-lg overflow-hidden">
                  <img
                    src={selectedListing.carImages?.[0]?.imageUrl || "/placeholder.svg"}
                    alt={selectedListing.title}
                    className="w-full h-[400px] object-cover"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-muted-foreground">Hãng xe</Label>
                    <p className="font-medium">{selectedListing?.carModelsBrandName}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground">Dòng xe</Label>
                    <p className="font-medium">{selectedListing?.carModelsName}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground">Năm sản xuất</Label>
                    <p className="font-medium">{selectedListing?.year}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground">Giá bán</Label>
                    <p className="font-medium text-success text-xl">{formatMoney(selectedListing?.price)} </p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground">Số km đã đi</Label>
                    <p className="font-medium">{selectedListing?.odo}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground">Địa điểm</Label>
                    <p className="font-medium">{selectedListing?.location}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground">Hộp số</Label>
                    <p className="font-medium">{CarUtils.changeTransmission(selectedListing?.transmission)}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground">Nhiên liệu</Label>
                    <p className="font-medium">{CarUtils.changeFuelType(selectedListing?.fuelType)}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-muted-foreground">Mô tả chi tiết</Label>
                  <p className="text-sm">{selectedListing?.description}</p>
                </div>

                <div className="space-y-2 p-4 bg-muted rounded-lg">
                  <Label className="text-muted-foreground">Thông tin người bán</Label>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={selectedListing?.user?.profilePicture || "/placeholder.svg"} />
                      <AvatarFallback>{selectedListing?.user?.fullName}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{selectedListing?.seller}</p>
                      <p className="text-sm text-muted-foreground">{selectedListing?.user?.phone}</p>
                      <p className="text-sm text-muted-foreground">Đăng ngày: {formatDateToDate(selectedListing?.createdAt)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {selectedListing?.status === "PENDING" && (
                <DialogFooter className="gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedListing(null)}
                  >
                    Đóng
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => setShowRejectDialog(true)}
                  >
                    <ThumbsDown className="h-4 w-4 mr-2" />
                    Từ chối tin đăng
                  </Button>
                  <Button
                    className="bg-success hover:bg-success/90"
                    onClick={() => handleApproveListing(selectedListing?.id)}
                  >
                    <ThumbsUp className="h-4 w-4 mr-2" />
                    Duyệt tin đăng
                  </Button>
                </DialogFooter>
              )}
            </DialogContent>
          </Dialog>
        )}

        {/* Reject Dialog */}
        <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Từ chối tin đăng</DialogTitle>
              <DialogDescription>
                Vui lòng nhập lý do từ chối để gửi thông báo cho người đăng
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reason">Lý do từ chối *</Label>
                <Textarea
                  id="reason"
                  placeholder="Ví dụ: Hình ảnh không rõ ràng, thiếu thông tin giấy tờ..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  rows={4}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setShowRejectDialog(false)
                  setRejectionReason("")
                }}
              >
                Hủy
              </Button>
              <Button
                variant="destructive"
                disabled={!rejectionReason.trim()}
                onClick={() => selectedListing && handleRejectListing(selectedListing.id, rejectionReason)}
              >
                <XCircle className="h-4 w-4 mr-2" />
                Xác nhận từ chối
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <TabsContent value="reports" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Báo cáo vi phạm</h2>
          </div>
          <div className="grid gap-4">
            {mockReports.map((report) => (
              <Card key={report.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{report.type === "spam" ? "Spam" : "Gian lận"}</Badge>
                        <Badge variant={report.status === "PENDING" ? "secondary" : "default"}>
                          {report.status === "PENDING" ? "Chờ xử lý" : "Đã xử lý"}
                        </Badge>
                      </div>
                      <div>
                        <p className="font-semibold">
                          {report.reporter} báo cáo {report.reported}
                        </p>
                        <p className="text-sm text-muted-foreground">Lý do: {report.reason}</p>
                        <p className="text-sm text-muted-foreground">Ngày: {report.date}</p>
                      </div>
                    </div>

                    {report.status === "PENDING" && (
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleReportAction(report.id, "APPROVED")}>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Chấp nhận
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleReportAction(report.id, "REJECTED")}>
                          <XCircle className="h-4 w-4 mr-2" />
                          Từ chối
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Quản lý giao dịch</h2>
            <div className="text-sm text-muted-foreground">
              <p>🔧 Admin có thể thay đổi mọi trạng thái giao dịch</p>
            </div>
          </div>

          <div className="grid gap-4">
            {mockTransactions.map((transaction) => (
              <Card key={transaction.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h3 className="font-semibold">{transaction.carTitle}</h3>
                      <p className="text-sm text-muted-foreground">Người bán: {transaction.seller}</p>
                      <p className="text-sm text-muted-foreground">Người mua: {transaction.buyer}</p>
                      <p className="text-sm text-muted-foreground">Ngày: {transaction.date}</p>
                      <p className="text-sm text-muted-foreground">Mã HĐ: {transaction.invoiceId}</p>
                    </div>

                    <div className="text-right space-y-2">
                      <p className="text-lg font-bold text-green-600">{transaction.amount} VNĐ</p>
                      <Badge variant={getStatusColor(transaction.status)}>{getStatusText(transaction.status)}</Badge>
                    </div>

                    <div className="flex flex-col gap-2">
                      <div className="grid grid-cols-2 gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAdminStatusUpdate(transaction.id, "confirmed")}
                          disabled={transaction.status === "confirmed"}
                        >
                          Xác nhận
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAdminStatusUpdate(transaction.id, "completed")}
                          disabled={transaction.status === "completed"}
                        >
                          Hoàn thành
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleAdminStatusUpdate(transaction.id, "cancelled")}
                          disabled={transaction.status === "cancelled"}
                        >
                          Hủy bỏ
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleAdminStatusUpdate(transaction.id, "disputed")}
                          disabled={transaction.status === "disputed"}
                        >
                          Tranh chấp
                        </Button>
                      </div>

                      <Button variant="ghost" size="sm">
                        Chi tiết
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="fees" className="space-y-6">
          <SystemFeesManager/>
          {/* <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Quản lý phí hệ thống</h2>
            <Button>
              <Settings className="h-4 w-4 mr-2" />
              Cài đặt chung
            </Button>
          </div>
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Quản lý phí hệ thống</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Quản lý các loại phí áp dụng cho người dùng
                </p>
              </div>
              <Button onClick={() => setIsAddDialogOpen(true)} className="gap-2 bg-blue-500">
                <Plus className="h-4 w-4" />
                Thêm phí mới
              </Button>
            </div>

            <div className="grid gap-4">
              {fees?.map((fee) => (
                <Card key={fee?.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center text-blue">
                          <DollarSign className="h-6 w-6 text-blue-500" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg text-foreground">{fee?.name}</h3>
                          {fee?.feeServiceDetails?.map(item => (
                            <p className="text-sm text-muted-foreground mt-1">
                              {item?.name}
                            </p>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-2xl font-bold text-green-500">
                            {fee?.sale ? formatMoney(fee?.price - ((fee?.price * fee?.sale) / 100)) : formatMoney(fee?.price)}
                          </p>
                          <p className="text-sm text-muted-foreground">{fee?.expirySale}</p>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditDialog(fee)}
                            className="gap-2"
                          >
                            <Pencil className="h-4 w-4" />
                            Sửa
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => openDeleteDialog(fee)}
                            className="gap-2"
                          >
                            <Trash2Icon className="h-4 w-4" />
                            Xóa
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Thêm phí hệ thống mới</DialogTitle>
                  <DialogDescription>
                    Nhập thông tin phí hệ thống mới
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Tên dịch vụ</Label>
                    <Input
                      id="name"
                      placeholder="VD: Đăng tin thường"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Giá</Label>
                    <Input
                      id="price"
                      placeholder="VD: 20,000"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="unit">Đơn vị</Label>
                    <Input
                      id="sale"
                      placeholder="VD: 10"
                      value={formData.sale}
                      onChange={(e) => setFormData({ ...formData, sale: Number(e.target.value) })}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Hủy
                  </Button>
                  <Button onClick={handleAdd}>Thêm mới</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog> */}

            {/* <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Chỉnh sửa phí hệ thống</DialogTitle>
                  <DialogDescription>
                    Cập nhật thông tin phí hệ thống
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-service">Tên dịch vụ</Label>
                    <Input
                      id="edit-service"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-price">Giá</Label>
                    <Input
                      id="edit-price"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-unit">Sale</Label>
                    <Input
                      id="edit-unit"
                      value={formData.sale}
                      onChange={(e) => setFormData({ ...formData, sale: Number(e.target.value) })}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                    Hủy
                  </Button>
                  <Button onClick={handleEdit}>Cập nhật</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>


            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Xác nhận xóa</DialogTitle>
                  <DialogDescription>
                    Bạn có chắc chắn muốn xóa phí "{selectedFee?.name}"? Hành động này không thể hoàn tác.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                    Hủy
                  </Button>
                  <Button variant="destructive" onClick={handleDelete}>
                    Xóa
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>  */}
        </TabsContent>

        <TabsContent value="revenue" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Báo cáo doanh thu hệ thống</h2>
            <div className="flex gap-2">
              <Button variant="outline">
                <BarChart3 className="h-4 w-4 mr-2" />
                Xuất báo cáo
              </Button>
              <Button>
                <Receipt className="h-4 w-4 mr-2" />
                Tạo hóa đơn
              </Button>
            </div>
          </div>

          {/* Revenue Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Tổng doanh thu 3 tháng</p>
                  <p className="text-3xl font-bold text-green-600">{formatMoney(revenues?.current?.total)}</p>
                  <p className="text-sm text-green-600 mt-1">{calculateIncrease(Number(revenues?.current?.total), Number(revenues?.previous?.total))} so với quý trước</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Phí đăng tin</p>
                  <p className="text-3xl font-bold text-blue-600">{formatMoney(revenues?.current?.postingFees)}</p>
                  <p className="text-sm text-blue-600 mt-1">{Math.abs((Number(revenues?.current?.postingFees) / Number(revenues?.current?.total)) * 100).toFixed(2)}% tổng doanh thu</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Phí nâng cấp tài khoản</p>
                  <p className="text-3xl font-bold text-purple-600">{formatMoney(revenues?.current?.upgradeFees)}</p>
                  <p className="text-sm text-purple-600 mt-1">{Math.abs((Number(revenues?.current?.upgradeFees) / Number(revenues?.current?.total)) * 100).toFixed(2)}% tổng doanh thu</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Breakdown Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Chi tiết doanh thu theo loại phí</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={dataMonthlyTotalRevenue}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${formatMoney(Number(value))}`, ""]} />
                    <Legend />
                    <Bar dataKey="postingFees" fill="#3b82f6" name="Phí đăng tin" />
                    <Bar dataKey="transactionFees" fill="#10b981" name="Phí nâng cấp tài khoản" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Revenue Growth Trend */}
            <Card>
              <CardHeader>
                <CardTitle>Xu hướng tăng trưởng doanh thu</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={dataMonthlyTotalRevenue}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${formatMoney(Number(value))}`, ""]} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="total"
                      stroke="#10b981"
                      strokeWidth={4}
                      name="Tổng doanh thu"
                      dot={{ fill: "#10b981", strokeWidth: 2, r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Monthly Revenue Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Chi tiết doanh thu theo tháng</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dataMonthlyTotalRevenue?.map((month, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="font-semibold">{month?.month}</div>
                    <div className="flex items-center gap-8 text-sm">
                      <div>
                        <span className="text-muted-foreground">Phí đăng tin: </span>
                        <span className="font-semibold text-blue-600">{month?.postingFees} VNĐ</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Phí nâng cấp tài khoản: </span>
                        <span className="font-semibold text-purple-600">{formatMoney(month?.transactionFees)}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Tổng: </span>
                        <span className="font-bold text-green-600">{formatMoney(month?.total)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

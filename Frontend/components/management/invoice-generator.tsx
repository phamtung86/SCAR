// "use client"

// import { useState, useEffect } from "react"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Separator } from "@/components/ui/separator"
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { FileText, Download, Printer, Send, Search, UserPlus } from "lucide-react"
// import { toast } from "sonner"
// import { CarSelectWithImage } from "./car-select-with-image"
// import { CarDTO } from "@/types/car"
// import CarAPI from "@/lib/api/car"
// import TransactionAPI from "@/lib/api/transaction"
// import { getCurrentUser } from "@/lib/utils/get-current-user"
// import { formatMoney } from "@/lib/utils/money-format"
// import { UserDTO } from "@/types/user"

// // Fake data for customers (sẽ được thay thế bằng API thật)
// const fakeCustomers: Customer[] = [
//   {
//     id: "1",
//     name: "Nguyễn Văn A",
//     phone: "0901234567",
//     email: "nguyenvana@gmail.com",
//     address: "123 Đường Lê Lợi, Quận 1, TP.HCM",
//     cccd: "001234567890",
//   },
//   {
//     id: "2",
//     name: "Trần Thị B",
//     phone: "0912345678",
//     email: "tranthib@gmail.com",
//     address: "456 Nguyễn Huệ, Quận 1, TP.HCM",
//     cccd: "002345678901",
//   },
//   {
//     id: "3",
//     name: "Lê Văn C",
//     phone: "0923456789",
//     email: "levanc@gmail.com",
//     address: "789 Trần Hưng Đạo, Quận 5, TP.HCM",
//     cccd: "003456789012",
//   },
// ]

// export interface Customer {
//   id: string;
//   name: string;
//   phone: string;
//   email: string;
//   address: string;
//   cccd: string;
// }

// interface InvoiceData {
//   invoiceNumber: string
//   date: string
//   dueDate: string
//   selectedCar: CarDTO | null
//   selectedCustomer: Customer | null
//   isNewCustomer: boolean
//   newCustomerData: {
//     name: string
//     phone: string
//     email: string
//     address: string
//     cccd: string
//   }
//   seller: UserDTO
//   transferFee: number
//   inspectionFee: number
//   insuranceFee: number
//   totalAmount: number
//   paymentMethod: string
//   notes: string
// }

// export function InvoiceGenerator() {
//   const [isOpen, setIsOpen] = useState(false)
//   const [searchValue, setSearchValue] = useState("")
//   const [invoiceData, setInvoiceData] = useState<InvoiceData>({
//     invoiceNumber: `INV-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`,
//     date: new Date().toISOString().split("T")[0],
//     dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
//     selectedCar: null,
//     selectedCustomer: null,
//     isNewCustomer: false,
//     newCustomerData: {
//       name: "",
//       phone: "",
//       email: "",
//       address: "",
//       cccd: "",
//     },
//     seller: {
//       id: 0,
//       username: "",
//       email: "",
//       firstName: "",
//       lastName: "",
//       profilePicture: "",
//       createdAt: "",
//       updatedAt: "",
//       role: "",
//       status: "",
//       verified: false,
//       bio: "",
//       location: "",
//       phone: "",
//       fullName: "",
//       rating: 0,
//       rank: "",
//       registerRankAt: "",
//       expiryRankAt: "",
//       accountStatus: "",
//     },
//     transferFee: 500000,
//     inspectionFee: 200000,
//     insuranceFee: 1000000,
//     totalAmount: 0,
//     paymentMethod: "bank_transfer",
//     notes: "",
//   })

//   const [previewMode, setPreviewMode] = useState(false)
//   const [carPosts, setCarPosts] = useState<CarDTO[]>([])
//   const currentUser = getCurrentUser()

//   const fetchListCarPosts = async (userId: number) => {
//     try {
//       const res = await CarAPI.getByUserId(userId)
//       if (res.status === 200) {
//         setCarPosts(res.data)
//       }
//     } catch (error) {
//       console.log("Lỗi xảy ra khi lấy dữ liệu xe: ", error)
//     }
//   }

//   const loadTransactionData = async () => {
//     if (transactionId) {
//       try {
//         const res = await TransactionAPI.getTransactionById(transactionId)
//         if (res.status === 200) {
//           const transaction = res.data
          
//           // Set dữ liệu từ transaction
//           setInvoiceData(prev => ({
//             ...prev,
//             selectedCar: transaction.car,
//             seller: transaction.seller,
//             selectedCustomer: transaction.buyer ? {
//               id: transaction.buyer.id.toString(),
//               name: transaction.buyer.fullName,
//               phone: transaction.buyer.phone,
//               email: transaction.buyer.email,
//               address: transaction.buyer.location,
//               cccd: "",
//             } : null,
//             isNewCustomer: !transaction.buyer && (
//               transaction.buyerName || transaction.buyerPhone
//             ) ? true : false,
//             newCustomerData: !transaction.buyer ? {
//               name: transaction.buyerName || "",
//               phone: transaction.buyerPhone || "",
//               email: "",
//               address: transaction.buyerAddress || "",
//               cccd: transaction.buyerCode || "",
//             } : prev.newCustomerData,
//           }))
          
//           toast.success("Đã tải thông tin giao dịch")
//         }
//       } catch (error) {
//         console.log("Lỗi khi tải giao dịch: ", error)
//         toast.error("Không thể tải thông tin giao dịch")
//       }
//     }
//   }

//   useEffect(() => {
//     fetchListCarPosts(Number(currentUser?.id))
//     loadTransactionData()
//   }, [])

//   // Calculate total amount
//   useEffect(() => {
//     const carPrice = invoiceData.selectedCar?.price || 0
//     const total = carPrice + invoiceData.transferFee + invoiceData.inspectionFee + invoiceData.insuranceFee
//     setInvoiceData((prev) => ({ ...prev, totalAmount: total }))
//   }, [invoiceData.selectedCar, invoiceData.transferFee, invoiceData.inspectionFee, invoiceData.insuranceFee])

//   const handleCarSelect = (car: CarDTO) => {
//     setInvoiceData((prev) => ({
//       ...prev,
//       selectedCar: car,
//       seller: car?.user  
//     }));
//     toast.success(`Đã chọn xe: ${car.title}`);
//   };

//   const handleCustomerSearch = () => {
//     if (!searchValue.trim()) {
//       toast.error("Vui lòng nhập thông tin tìm kiếm")
//       return
//     }

//     const searchTerm = searchValue.trim().toLowerCase()
    
//     // Tìm kiếm theo CCCD, SĐT hoặc tên
//     const customer = fakeCustomers.find(
//       c => 
//         c.cccd === searchValue.trim() || 
//         c.phone === searchValue.trim() ||
//         c.name.toLowerCase().includes(searchTerm)
//     )

//     if (customer) {
//       // Trường hợp 1: Đã có tài khoản - hiển thị thông tin
//       setInvoiceData((prev) => ({
//         ...prev,
//         selectedCustomer: customer,
//         isNewCustomer: false,
//         newCustomerData: {
//           name: "",
//           phone: "",
//           email: "",
//           address: "",
//           cccd: "",
//         }
//       }))
//       toast.success(`✓ Tìm thấy khách hàng: ${customer.name}`)
//       setSearchValue("")
//     } else {
//       // Trường hợp 2: Chưa có tài khoản - cho phép điền thông tin mới
//       setInvoiceData((prev) => ({
//         ...prev,
//         selectedCustomer: null,
//         isNewCustomer: true,
//         newCustomerData: {
//           ...prev.newCustomerData,
//           // Tự động điền CCCD nếu nhập đúng 12 số
//           cccd: searchValue.trim().length === 12 && /^\d{12}$/.test(searchValue.trim()) 
//             ? searchValue.trim() 
//             : "",
//           // Tự động điền SĐT nếu nhập đúng 10 số
//           phone: searchValue.trim().length === 10 && /^\d{10}$/.test(searchValue.trim()) 
//             ? searchValue.trim() 
//             : "",
//         }
//       }))
//       toast.info("Không tìm thấy khách hàng. Vui lòng nhập thông tin mới")
//       setSearchValue("")
//     }
//   }

//   const handleNewCustomerChange = (field: keyof typeof invoiceData.newCustomerData, value: string) => {
//     setInvoiceData((prev) => ({
//       ...prev,
//       newCustomerData: {
//         ...prev.newCustomerData,
//         [field]: value,
//       }
//     }))
//   }

//   const handleInputChange = (field: keyof InvoiceData, value: string | number) => {
//     setInvoiceData((prev) => ({ ...prev, [field]: value }))
//   }

//   const formatCurrency = (amount: number) => {
//     return new Intl.NumberFormat("vi-VN", {
//       style: "currency",
//       currency: "VND",
//     }).format(amount)
//   }

//   const validateCustomerData = (forPreview = false) => {
//     // Kiểm tra xe
//     if (!invoiceData.selectedCar) {
//       toast.error("Vui lòng chọn xe")
//       return false
//     }

//     // Kiểm tra khách hàng
//     if (!invoiceData.selectedCustomer && !invoiceData.isNewCustomer) {
//       toast.error("Vui lòng chọn khách hàng hoặc nhập thông tin mới")
//       return false
//     }
    
//     // Nếu là khách hàng mới, validate thông tin
//     if (invoiceData.isNewCustomer) {
//       const { name, phone, cccd, address } = invoiceData.newCustomerData
      
//       if (!name.trim()) {
//         toast.error("Vui lòng nhập họ tên khách hàng")
//         return false
//       }
      
//       if (!phone.trim() || !/^\d{10}$/.test(phone)) {
//         toast.error("Số điện thoại phải có 10 chữ số")
//         return false
//       }
      
//       if (!cccd.trim() || !/^\d{12}$/.test(cccd)) {
//         toast.error("CCCD phải có 12 chữ số")
//         return false
//       }
      
//       if (!address.trim()) {
//         toast.error("Vui lòng nhập địa chỉ khách hàng")
//         return false
//       }
//     }
    
//     return true
//   }

//   const generatePDF = () => {
//     if (!validateCustomerData()) {
//       return
//     }
    
//     console.log("Generating PDF invoice:", invoiceData)
//     toast.success("Hóa đơn PDF đã được tạo và tải xuống!")
//   }

//   const sendInvoice = () => {
//     const email = invoiceData.selectedCustomer?.email || invoiceData.newCustomerData.email
//     if (!email) {
//       toast.error("Khách hàng chưa có email")
//       return
//     }
//     console.log("Sending invoice to:", email)
//     toast.success(`Hóa đơn đã được gửi đến ${email}`)
//   }

//   const printInvoice = () => {
//     window.print()
//   }

//   const getCustomerInfo = () => {
//     if (invoiceData.selectedCustomer) {
//       return invoiceData.selectedCustomer
//     }
//     if (invoiceData.isNewCustomer) {
//       return invoiceData.newCustomerData
//     }
//     return null
//   }

//   const InvoicePreview = () => {
//     const customerInfo = getCustomerInfo()

//     return (
//       <div className="max-w-4xl mx-auto bg-white dark:bg-gray-900 p-8 shadow-lg border rounded-lg print:shadow-none">
//         {/* Header */}
//         <div className="flex justify-between items-start mb-8">
//           <div>
//             <h1 className="text-3xl font-bold text-primary">HÓA ĐƠN BÁN XE</h1>
//             <p className="text-muted-foreground mt-2">Số hóa đơn: {invoiceData.invoiceNumber}</p>
//           </div>
//           <div className="text-right">
//             <p className="text-sm text-muted-foreground">Ngày tạo: {new Date(invoiceData.date).toLocaleDateString("vi-VN")}</p>
//             <p className="text-sm text-muted-foreground">
//               Hạn thanh toán: {new Date(invoiceData.dueDate).toLocaleDateString("vi-VN")}
//             </p>
//           </div>
//         </div>

//         {/* Seller & Buyer Info */}
//         <div className="grid grid-cols-2 gap-8 mb-8">
//           <div>
//             <h3 className="font-semibold text-lg mb-3 text-primary">Thông tin người bán</h3>
//             <div className="space-y-1 text-sm">
//               <p><strong>Tên:</strong> {invoiceData?.seller?.fullName}</p>
//               <p><strong>Điện thoại:</strong> {invoiceData?.seller?.phone}</p>
//               <p><strong>Địa chỉ:</strong> {invoiceData?.seller?.location}</p>
//             </div>
//           </div>
//           <div>
//             <h3 className="font-semibold text-lg mb-3 text-primary">Thông tin người mua</h3>
//             {customerInfo ? (
//               <div className="space-y-1 text-sm">
//                 <p><strong>Tên:</strong> {customerInfo.name}</p>
//                 <p><strong>CCCD:</strong> {customerInfo.cccd}</p>
//                 <p><strong>Điện thoại:</strong> {customerInfo.phone}</p>
//                 <p><strong>Email:</strong> {customerInfo.email}</p>
//                 <p><strong>Địa chỉ:</strong> {customerInfo.address}</p>
//               </div>
//             ) : (
//               <p className="text-muted-foreground text-sm">Chưa có thông tin khách hàng</p>
//             )}
//           </div>
//         </div>

//         {/* Car Details */}
//         <div className="mb-8">
//           <h3 className="font-semibold text-lg mb-3 text-primary">Thông tin xe</h3>
//           {invoiceData?.selectedCar ? (
//             <div className="flex gap-4">
//               <img
//                 src={invoiceData?.selectedCar?.carImages?.[0]?.imageUrl}
//                 alt={invoiceData?.selectedCar?.title}
//                 className="w-32 h-24 object-cover rounded border border-border"
//               />
//               <div className="grid grid-cols-2 gap-4 text-sm flex-1">
//                 <p><strong>Tên xe:</strong> {invoiceData?.selectedCar?.title}</p>
//                 <p><strong>Model:</strong> {invoiceData?.selectedCar?.carModelsName}</p>
//                 <p><strong>Năm sản xuất:</strong> {invoiceData?.selectedCar?.year}</p>
//                 <p><strong>Số khung:</strong> {invoiceData?.selectedCar?.vin}</p>
//               </div>
//             </div>
//           ) : (
//             <p className="text-muted-foreground text-sm">Chưa chọn xe</p>
//           )}
//         </div>

//         {/* Invoice Items */}
//         <div className="mb-8">
//           <table className="w-full border-collapse border border-border">
//             <thead>
//               <tr className="bg-secondary">
//                 <th className="border border-border p-3 text-left">Mô tả</th>
//                 <th className="border border-border p-3 text-right">Số tiền</th>
//               </tr>
//             </thead>
//             <tbody>
//               <tr>
//                 <td className="border border-border p-3">Giá xe</td>
//                 <td className="border border-border p-3 text-right">{formatMoney(invoiceData?.selectedCar?.price || 0)}</td>
//                 {/* <td className="border border-border p-3 text-right">{invoiceData?}</td> */}
//               </tr>
//               <tr>
//                 <td className="border border-border p-3">Phí sang tên</td>
//                 <td className="border border-border p-3 text-right">{formatMoney(invoiceData?.transferFee)}</td>
//               </tr>
//               <tr>
//                 <td className="border border-border p-3">Phí kiểm định</td>
//                 <td className="border border-border p-3 text-right">{formatMoney(invoiceData?.inspectionFee)}</td>
//               </tr>
//               <tr>
//                 <td className="border border-border p-3">Phí bảo hiểm</td>
//                 <td className="border border-border p-3 text-right">{formatMoney(invoiceData?.insuranceFee)}</td>
//               </tr>
//               <tr className="bg-accent text-accent-foreground font-semibold">
//                 <td className="border border-border p-3">TỔNG CỘNG</td>
//                 <td className="border border-border p-3 text-right text-lg">
//                   {formatCurrency(invoiceData?.totalAmount)}
//                 </td>
//               </tr>
//             </tbody>
//           </table>
//         </div>

//         {/* Payment Info */}
//         <div className="mb-8">
//           <h3 className="font-semibold text-lg mb-3 text-primary">Thông tin thanh toán</h3>
//           <p className="text-sm">
//             <strong>Phương thức:</strong>{" "}
//             {invoiceData?.paymentMethod === "bank_transfer"
//               ? "Chuyển khoản ngân hàng"
//               : invoiceData?.paymentMethod === "cash"
//                 ? "Tiền mặt"
//                 : "Trả góp"}
//           </p>
//           {invoiceData?.notes && (
//             <div className="mt-3">
//               <strong>Ghi chú:</strong>
//               <p className="text-sm mt-1">{invoiceData?.notes}</p>
//             </div>
//           )}
//         </div>

//         {/* Signatures */}
//         <div className="grid grid-cols-2 gap-8 mt-12">
//           <div className="text-center">
//             <p className="font-semibold mb-16">Người bán</p>
//             <p className="border-t border-border pt-2">{invoiceData?.seller?.fullName}</p>
//           </div>
//           <div className="text-center">
//             <p className="font-semibold mb-16">Người mua</p>
//             <p className="border-t border-border pt-2">{customerInfo?.name || "___________________"}</p>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <Dialog open={isOpen} onOpenChange={setIsOpen}>
//       <DialogTrigger asChild>
//         <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
//           <FileText className="h-4 w-4 mr-2" />
//           Tạo hóa đơn
//         </Button>
//       </DialogTrigger>
//       <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
//         <DialogHeader>
//           <DialogTitle className="flex items-center gap-2 text-primary">
//             <FileText className="h-5 w-5" />
//             {previewMode ? "Xem trước hóa đơn" : "Tạo hóa đơn bán xe"}
//           </DialogTitle>
//         </DialogHeader>

//         {!previewMode ? (
//           <div className="space-y-6">
//             {/* Invoice Basic Info */}
//             <Card>
//               <CardHeader>
//                 <CardTitle className="text-lg">Thông tin cơ bản</CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div className="grid grid-cols-3 gap-4">
//                   <div>
//                     <Label htmlFor="invoiceNumber">Số hóa đơn</Label>
//                     <Input
//                       id="invoiceNumber"
//                       value={invoiceData?.invoiceNumber}
//                       onChange={(e) => handleInputChange("invoiceNumber", e.target.value)}
//                     />
//                   </div>
//                   <div>
//                     <Label htmlFor="date">Ngày tạo</Label>
//                     <Input
//                       id="date"
//                       type="date"
//                       value={invoiceData?.date}
//                       onChange={(e) => handleInputChange("date", e.target.value)}
//                     />
//                   </div>
//                   <div>
//                     <Label htmlFor="dueDate">Hạn thanh toán</Label>
//                     <Input
//                       id="dueDate"
//                       type="date"
//                       value={invoiceData?.dueDate}
//                       onChange={(e) => handleInputChange("dueDate", e.target.value)}
//                     />
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Car Selection */}
//             <Card>
//               <CardHeader>
//                 <CardTitle className="text-lg">Chọn xe</CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div>
//                   <Label>Chọn xe từ danh sách</Label>
//                   <CarSelectWithImage
//                     cars={carPosts}
//                     onSelect={handleCarSelect}
//                     selectedCar={invoiceData?.selectedCar}
//                   />
//                 </div>
//                 {invoiceData?.selectedCar && (
//                   <div className="p-4 bg-secondary rounded-lg">
//                     <div className="flex gap-4">
//                       <img
//                         src={invoiceData?.selectedCar?.carImages?.[0]?.imageUrl}
//                         alt={invoiceData?.selectedCar?.title}
//                         className="w-32 h-24 object-cover rounded border border-border"
//                       />
//                       <div>
//                         <h4 className="font-semibold mb-2">{invoiceData?.selectedCar?.title}</h4>
//                         <div className="grid grid-cols-2 gap-2 text-sm">
//                           <p><strong>Model:</strong> {invoiceData?.selectedCar?.carModelsName}</p>
//                           <p><strong>Năm:</strong> {invoiceData?.selectedCar?.year}</p>
//                           <p><strong>ODO:</strong> {invoiceData?.selectedCar?.odo} KM</p>
//                           <p className="col-span-2"><strong>Giá:</strong> <span className="text-red-700">{formatCurrency(invoiceData?.selectedCar?.price)}</span></p>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </CardContent>
//             </Card>

//             {/* Customer Search */}
//             <Card>
//               <CardHeader>
//                 <CardTitle className="text-lg">Thông tin khách hàng</CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div>
//                   <Label htmlFor="customer-search">Tìm khách hàng</Label>
//                   <div className="flex gap-2">
//                     <Input
//                       id="customer-search"
//                       value={searchValue}
//                       onChange={(e) => setSearchValue(e.target.value)}
//                       placeholder="Nhập CCCD, SĐT hoặc Tên khách hàng..."
//                       onKeyPress={(e) => e.key === "Enter" && handleCustomerSearch()}
//                       disabled={invoiceData?.selectedCustomer !== null || invoiceData?.isNewCustomer}
//                     />
//                     <Button 
//                       onClick={handleCustomerSearch} 
//                       className="bg-primary hover:bg-primary/90"
//                       disabled={invoiceData?.selectedCustomer !== null || invoiceData?.isNewCustomer}
//                     >
//                       <Search className="h-4 w-4 mr-2" />
//                       Tìm
//                     </Button>
//                   </div>
//                   <p className="text-xs text-muted-foreground mt-1">
//                     * Có thể tìm theo CCCD (12 số), SĐT (10 số) hoặc Tên khách hàng
//                   </p>
//                 </div>

//                 {/* Hiển thị thông tin khách hàng đã tìm thấy */}
//                 {invoiceData?.selectedCustomer && (
//                   <div className="p-4 bg-green-50 dark:bg-green-900/20 border-2 border-green-500 rounded-lg">
//                     <div className="flex items-center justify-between mb-3">
//                       <h4 className="font-semibold text-green-700 dark:text-green-400 flex items-center gap-2">
//                         <span className="text-xl">✓</span> Khách hàng đã có tài khoản
//                       </h4>
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         onClick={() => setInvoiceData(prev => ({ ...prev, selectedCustomer: null }))}
//                         className="text-red-600 hover:text-red-700 hover:bg-red-50"
//                       >
//                         Đổi khách
//                       </Button>
//                     </div>
//                     <div className="grid grid-cols-2 gap-3 text-sm">
//                       <div>
//                         <span className="text-muted-foreground">Họ tên:</span>
//                         <p className="font-medium">{invoiceData?.selectedCustomer.name}</p>
//                       </div>
//                       <div>
//                         <span className="text-muted-foreground">CCCD:</span>
//                         <p className="font-medium">{invoiceData?.selectedCustomer.cccd}</p>
//                       </div>
//                       <div>
//                         <span className="text-muted-foreground">SĐT:</span>
//                         <p className="font-medium">{invoiceData?.selectedCustomer.phone}</p>
//                       </div>
//                       <div>
//                         <span className="text-muted-foreground">Email:</span>
//                         <p className="font-medium">{invoiceData?.selectedCustomer.email}</p>
//                       </div>
//                       <div className="col-span-2">
//                         <span className="text-muted-foreground">Địa chỉ:</span>
//                         <p className="font-medium">{invoiceData?.selectedCustomer.address}</p>
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 {/* Form nhập thông tin khách hàng mới */}
//                 {invoiceData?.isNewCustomer && (
//                   <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-500 rounded-lg space-y-4">
//                     <div className="flex items-center justify-between">
//                       <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400 font-semibold">
//                         <UserPlus className="h-5 w-5" />
//                         <span>Thêm khách hàng mới</span>
//                       </div>
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         onClick={() => setInvoiceData(prev => ({ ...prev, isNewCustomer: false, newCustomerData: {
//                           name: "",
//                           phone: "",
//                           email: "",
//                           address: "",
//                           cccd: "",
//                         }}))}
//                         className="text-red-600 hover:text-red-700 hover:bg-red-50"
//                       >
//                         Hủy
//                       </Button>
//                     </div>
//                     <div className="grid grid-cols-2 gap-4">
//                       <div>
//                         <Label htmlFor="new-name">Họ tên *</Label>
//                         <Input
//                           id="new-name"
//                           value={invoiceData?.newCustomerData.name}
//                           onChange={(e) => handleNewCustomerChange("name", e.target.value)}
//                           placeholder="Nhập họ tên"
//                         />
//                       </div>
//                       <div>
//                         <Label htmlFor="new-cccd">CCCD *</Label>
//                         <Input
//                           id="new-cccd"
//                           value={invoiceData?.newCustomerData.cccd}
//                           onChange={(e) => handleNewCustomerChange("cccd", e.target.value)}
//                           placeholder="Nhập CCCD"
//                           maxLength={12}
//                         />
//                       </div>
//                       <div>
//                         <Label htmlFor="new-phone">Số điện thoại *</Label>
//                         <Input
//                           id="new-phone"
//                           value={invoiceData?.newCustomerData.phone}
//                           onChange={(e) => handleNewCustomerChange("phone", e.target.value)}
//                           placeholder="Nhập SĐT"
//                           maxLength={10}
//                         />
//                       </div>
//                       <div>
//                         <Label htmlFor="new-email">Email</Label>
//                         <Input
//                           id="new-email"
//                           type="email"
//                           value={invoiceData?.newCustomerData.email}
//                           onChange={(e) => handleNewCustomerChange("email", e.target.value)}
//                           placeholder="Nhập email"
//                         />
//                       </div>
//                       <div className="col-span-2">
//                         <Label htmlFor="new-address">Địa chỉ *</Label>
//                         <Textarea
//                           id="new-address"
//                           value={invoiceData?.newCustomerData.address}
//                           onChange={(e) => handleNewCustomerChange("address", e.target.value)}
//                           placeholder="Nhập địa chỉ"
//                           rows={2}
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </CardContent>
//             </Card>

//             {/* Pricing */}
//             <Card>
//               <CardHeader>
//                 <CardTitle className="text-lg">Chi phí phụ</CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div className="grid grid-cols-3 gap-4">
//                   <div>
//                     <Label htmlFor="transferFee">Phí sang tên (VNĐ)</Label>
//                     <Input
//                       id="transferFee"
//                       type="number"
//                       value={invoiceData?.transferFee}
//                       onChange={(e) => handleInputChange("transferFee", Number.parseInt(e.target.value) || 0)}
//                     />
//                   </div>
//                   <div>
//                     <Label htmlFor="inspectionFee">Phí kiểm định (VNĐ)</Label>
//                     <Input
//                       id="inspectionFee"
//                       type="number"
//                       value={invoiceData?.inspectionFee}
//                       onChange={(e) => handleInputChange("inspectionFee", Number.parseInt(e.target.value) || 0)}
//                     />
//                   </div>
//                   <div>
//                     <Label htmlFor="insuranceFee">Phí bảo hiểm (VNĐ)</Label>
//                     <Input
//                       id="insuranceFee"
//                       type="number"
//                       value={invoiceData?.insuranceFee}
//                       onChange={(e) => handleInputChange("insuranceFee", Number.parseInt(e.target.value) || 0)}
//                     />
//                   </div>
//                 </div>
//                 <Separator />
//                 <div className="flex justify-between items-center text-lg font-semibold">
//                   <span>Tổng cộng:</span>
//                   <span className="text-red-600 text-xl">{formatCurrency(invoiceData?.totalAmount)}</span>
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Payment & Notes */}
//             <Card>
//               <CardHeader>
//                 <CardTitle className="text-lg">Thanh toán & Ghi chú</CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div>
//                   <Label htmlFor="paymentMethod">Phương thức thanh toán</Label>
//                   <Select
//                     value={invoiceData?.paymentMethod}
//                     onValueChange={(value) => handleInputChange("paymentMethod", value)}
//                   >
//                     <SelectTrigger className="bg-background">
//                       <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent className="bg-popover z-50">
//                       <SelectItem value="bank_transfer">Chuyển khoản ngân hàng</SelectItem>
//                       <SelectItem value="cash">Tiền mặt</SelectItem>
//                       <SelectItem value="installment">Trả góp</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>
//                 <div>
//                   <Label htmlFor="notes">Ghi chú</Label>
//                   <Textarea
//                     id="notes"
//                     value={invoiceData?.notes}
//                     onChange={(e) => handleInputChange("notes", e.target.value)}
//                     placeholder="Ghi chú thêm về giao dịch..."
//                   />
//                 </div>
//               </CardContent>
//             </Card>

//             <div className="flex justify-end gap-2">
//               <Button 
//                 variant="outline" 
//                 onClick={() => {
//                   console.log("Click Xem trước")
//                   console.log("Invoice Data:", invoiceData)
//                   const isValid = validateCustomerData()
//                   console.log("Is Valid:", isValid)
//                   if (isValid) {
//                     console.log("Setting preview mode to true")
//                     setPreviewMode(true)
//                   }
//                 }}
//               >
//                 Xem trước
//               </Button>
//               <Button onClick={generatePDF} className="bg-primary hover:bg-primary/90">
//                 <Download className="h-4 w-4 mr-2" />
//                 Tạo PDF
//               </Button>
//             </div>
//           </div>
//         ) : (
//           <div className="space-y-4">
//             <div className="flex justify-between items-center">
//               <Button variant="outline" onClick={() => setPreviewMode(false)}>
//                 ← Quay lại chỉnh sửa
//               </Button>
//               <div className="flex gap-2">
//                 <Button variant="outline" onClick={printInvoice}>
//                   <Printer className="h-4 w-4 mr-2" />
//                   In
//                 </Button>
//                 <Button variant="outline" onClick={sendInvoice}>
//                   <Send className="h-4 w-4 mr-2" />
//                   Gửi email
//                 </Button>
//                 <Button onClick={generatePDF} className="bg-primary hover:bg-primary/90">
//                   <Download className="h-4 w-4 mr-2" />
//                   Tải PDF
//                 </Button>
//               </div>
//             </div>
//             <InvoicePreview />
//           </div>
//         )}
//       </DialogContent>
//     </Dialog>
//   )
// }

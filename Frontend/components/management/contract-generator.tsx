"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import CarAPI from "@/lib/api/car"
import { getCurrentUser } from "@/lib/utils/get-current-user"
import { CarDTO } from "@/types/car"
import { TransactionDTO } from "@/types/transactions"
import { UserDTO } from "@/types/user"
import html2pdf from "html2pdf.js"
import { Download, FileText, Printer, Search, Send } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { toast } from "sonner"
import { CarSelectWithImage } from "./car-select-with-image"
import TransactionAPI from "@/lib/api/transaction"

interface ContractData {
  contractNumber: string
  date: string
  selectedCar: CarDTO | null
  selectedCustomer: UserDTO | null
  isNewCustomer: boolean
  newCustomerData: {
    name: string
    phone: string
    email: string
    address: string
    cccd: string
  }
  seller: UserDTO
  salePrice: number
  deposit: number
  paymentTerms: string
  deliveryDate: string
  warrantyTerms: string
  specialConditions: string
  includeInsurance: boolean
  includeRegistration: boolean
}

interface ContractGeneratorProps {
  transaction?: TransactionDTO
  onRefresh?: () => void
  onUpdate?: (id: number, status: string) => void
}

export function ContractGenerator({ transaction, onRefresh, onUpdate }: ContractGeneratorProps) {

  const [isOpen, setIsOpen] = useState(false)
  const [searchValue, setSearchValue] = useState("")
  const [carPosts, setCarPosts] = useState<CarDTO[]>([])
  const currentUser = getCurrentUser()
  const [previewMode, setPreviewMode] = useState(false)
  const printRef = useRef<HTMLDivElement>(null)

  const [contractData, setContractData] = useState<ContractData>({
    contractNumber: `HD-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`,
    date: new Date().toISOString().split("T")[0],
    selectedCar: null,
    selectedCustomer: null,
    isNewCustomer: false,
    newCustomerData: {
      name: "",
      phone: "",
      email: "",
      address: "",
      cccd: "",
    },
    seller: currentUser || {
      id: 0, username: "", email: "", firstName: "", lastName: "", profilePicture: "",
      createdAt: "", updatedAt: "", role: "", status: "", verified: false,
      bio: "", location: "", phone: "", fullName: "", rating: 0, rank: "",
      registerRankAt: "", expiryRankAt: "", accountStatus: "",
    },
    salePrice: 0,
    deposit: 0,
    paymentTerms: "full_payment",
    deliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    warrantyTerms: "Bảo hành động cơ và hộp số trong 6 tháng hoặc 10,000km",
    specialConditions: "",
    includeInsurance: true,
    includeRegistration: true,
  })
  // Ưu tiên xe từ transaction, nếu không thì từ chọn tay
  const displayCar = transaction?.car || contractData.selectedCar

    const handleChangeStatus = async (transactionId: number, status: string) => {
    try {
      const res = await TransactionAPI.updateTransactionStatus(transactionId, status);
      if (res.status === 200) {
        toast.success("Thay đổi trạng thái thành công")
        onRefresh?.()
      }
    } catch (error) {
      toast.success("Lỗi khi thay đổi trạng thái giao dịch")
      console.log("Lỗi khi thay đổi trạng thái giao dịch ", error);
    }

  }

  // Format tiền
  const formatMoney = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value)
  }

  // Fetch danh sách xe của người dùng
  const fetchListCarPosts = async (userId: number) => {
    try {
      const res = await CarAPI.getByUserId(userId)
      if (res.status === 200) {
        setCarPosts(res.data)
      }
    } catch (error) {
      toast.error("Không thể tải danh sách xe")
    }
  }

  // Load xe khi mở dialog
  useEffect(() => {
    if (currentUser?.id && isOpen && !transaction?.car) {
      fetchListCarPosts(Number(currentUser.id))
    }
  }, [currentUser?.id, isOpen, transaction?.car])

  // Cập nhật từ transaction khi mở
  useEffect(() => {
    if (!isOpen) return

    // if (transaction) {
    setContractData(prev => ({
      ...prev,
      selectedCar: transaction?.car || prev.selectedCar,
      seller: transaction?.car?.user || prev.seller,
      salePrice: Number(transaction?.priceAgreed) || prev.salePrice,
      newCustomerData: {
        ...prev.newCustomerData,
        name: transaction?.buyer?.fullName || transaction?.buyerName || prev.newCustomerData.name,
        phone: transaction?.buyer?.phone || prev.newCustomerData.phone,
        email: transaction?.buyer?.email || prev.newCustomerData.email,
        address: transaction?.buyer?.location || prev.newCustomerData.address,
        cccd: (transaction?.buyer as any)?.cccd || prev.newCustomerData.cccd,
      },
      isNewCustomer: !transaction?.buyer,
      selectedCustomer: transaction?.buyer || null,
    }))
    // }
  }, [isOpen, transaction])

  // Cập nhật giá + seller khi chọn xe thủ công
  useEffect(() => {
    if (contractData.selectedCar && !transaction?.car) {
      setContractData(prev => ({
        ...prev,
        salePrice: contractData?.selectedCar?.price || 0,
        seller: contractData?.selectedCar?.user || prev.seller,
      }))
    }
  }, [contractData.selectedCar, transaction?.car])

  // Chọn xe
  const handleCarSelect = (car: CarDTO) => {
    if (transaction?.car) return // Không cho chọn nếu đã có transaction
    setContractData(prev => ({
      ...prev,
      selectedCar: car,
      seller: car.user,
      salePrice: car.price || 0,
    }))
    toast.success(`Đã chọn xe: ${car.title}`)
  }

  // Tìm kiếm khách hàng
  const handleCustomerSearch = () => {
    if (!searchValue.trim()) {
      toast.error("Vui lòng nhập thông tin tìm kiếm")
      return
    }

    const isCCCD = /^\d{12}$/.test(searchValue.trim())
    const isPhone = /^\d{10}$/.test(searchValue.trim())

    setContractData(prev => ({
      ...prev,
      selectedCustomer: null,
      isNewCustomer: true,
      newCustomerData: {
        ...prev.newCustomerData,
        cccd: isCCCD ? searchValue.trim() : prev.newCustomerData.cccd,
        phone: isPhone ? searchValue.trim() : prev.newCustomerData.phone,
      },
    }))
    toast.info("Khách hàng mới. Vui lòng nhập đầy đủ thông tin.")
    setSearchValue("")
  }

  // Thay đổi input
  const handleInputChange = (field: keyof ContractData, value: any) => {
    setContractData(prev => ({ ...prev, [field]: value }))
  }

  const handleNewCustomerChange = (field: keyof ContractData["newCustomerData"], value: string) => {
    setContractData(prev => ({
      ...prev,
      newCustomerData: { ...prev.newCustomerData, [field]: value },
    }))
  }

  // Lấy thông tin khách hàng
  const getCustomerInfo = () => {
    if (transaction?.buyer) {
      return {
        name: transaction.buyer.fullName,
        phone: transaction.buyer.phone,
        email: transaction.buyer.email,
        address: transaction.buyer.location,
        cccd: (transaction.buyer as any).cccd || "Chưa có",
      }
    }
    if (contractData.selectedCustomer) {
      return {
        name: contractData.selectedCustomer.fullName,
        phone: contractData.selectedCustomer.phone,
        email: contractData.selectedCustomer.email,
        address: contractData.selectedCustomer.location,
        cccd: (contractData.selectedCustomer as any).cccd || "Chưa có",
      }
    }
    if (contractData.isNewCustomer && contractData.newCustomerData.name) {
      return contractData.newCustomerData
    }
    return null
  }

  // Validate
  const validateContractData = () => {
    if (!displayCar) return toast.error("Vui lòng chọn xe"), false

    const customer = getCustomerInfo()
    if (!customer) return toast.error("Vui lòng nhập thông tin khách hàng"), false

    if (contractData.isNewCustomer || transaction?.buyer === undefined) {
      const { name, phone, cccd, address } = contractData.newCustomerData
      if (!name.trim()) return toast.error("Nhập họ tên"), false
      if (!/^\d{10}$/.test(phone)) return toast.error("SĐT phải 10 số"), false
      if (!/^\d{12}$/.test(cccd)) return toast.error("CCCD phải 12 số"), false
      if (!address.trim()) return toast.error("Nhập địa chỉ"), false
    }

    if (contractData.salePrice <= 0) return toast.error("Giá bán phải > 0"), false
    return true
  }

  const generatePDF = async () => {
    if (!validateContractData()) return

    if (!printRef.current) {
      toast.error("Không thể tạo PDF")
      return
    }

    toast.loading("Đang tạo PDF...")

    const opt = {
      margin: [10, 10, 10, 10],
      filename: `HopDong_${contractData.contractNumber}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      pagebreak: { mode: ["avoid-all", "css", "legacy"] },
    }

    try {
      await html2pdf().set(opt).from(printRef.current).save()
      toast.dismiss()
      toast.success("PDF đã được tải xuống!")
    } catch (error) {
      toast.dismiss()
      toast.error("Lỗi tạo PDF")
      console.error(error)
    }
  }


  const sendContract = () => {
    if (!validateContractData()) return
    const customer = getCustomerInfo()
    if (!customer?.email) return toast.error("Khách hàng chưa có email")
    toast.success(`Đã gửi đến: ${customer.email}`)
  }

  const ContractPreview = () => {
    const customer = getCustomerInfo()
    const car = displayCar

    return (
      <div className="max-w-4xl mx-auto bg-white p-8 shadow-lg text-sm print:shadow-none print:p-4">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</h1>
          <p className="font-semibold">Độc lập - Tự do - Hạnh phúc</p>
          <div className="border-b-2 border-black w-32 mx-auto mt-4 mb-8"></div>
          <h2 className="text-xl font-bold text-blue-600">HỢP ĐỒNG MUA BÁN XE Ô TÔ</h2>
          <p className="mt-2">Số: {contractData.contractNumber}</p>
        </div>

        <div className="mb-6">
          <p className="mb-4">
            Hôm nay, ngày {new Date(contractData.date).toLocaleDateString("vi-VN")}, tại{" "}
            {contractData.seller?.location || "___________________"}, chúng tôi gồm:
          </p>

          <div className="mb-4">
            <h3 className="font-semibold text-blue-600 mb-2">BÊN BÁN (Bên A):</h3>
            <p><strong>Họ tên:</strong> {contractData.seller?.fullName || "___________________"}</p>
            <p><strong>Điện thoại:</strong> {contractData.seller?.phone || "___________________"}</p>
            <p><strong>Địa chỉ:</strong> {contractData.seller?.location || "___________________"}</p>
          </div>

          <div className="mb-4">
            <h3 className="font-semibold text-blue-600 mb-2">BÊN MUA (Bên B):</h3>
            {customer ? (
              <>
                <p><strong>Họ tên:</strong> {customer.name}</p>
                <p><strong>CCCD:</strong> {customer.cccd}</p>
                <p><strong>Điện thoại:</strong> {customer.phone}</p>
                <p><strong>Địa chỉ:</strong> {customer.address}</p>
              </>
            ) : (
              <p className="text-red-500">Chưa có thông tin khách hàng</p>
            )}
          </div>
        </div>

        {car && (
          <div className="mb-6">
            <h3 className="font-semibold text-blue-600 mb-2">THÔNG TIN XE:</h3>
            <div className="flex gap-4 mb-4">
              <img
                src={car.carImages?.[0]?.imageUrl || "/placeholder.png"}
                alt={car.title}
                className="w-32 h-24 object-cover rounded border"
              />
              <div className="grid grid-cols-2 gap-2 text-sm flex-1">
                <p><strong>Tên xe:</strong> {car.title}</p>
                <p><strong>Model:</strong> {car.carModelsName}</p>
                <p><strong>Năm SX:</strong> {car.year}</p>
                <p><strong>Số khung:</strong> {car.vin}</p>
                <p><strong>Biển số:</strong> {car.licensePlate || "Chưa có"}</p>
                <p><strong>Màu:</strong> {car.color}</p>
              </div>
            </div>
          </div>
        )}

        <div className="mb-6 space-y-3">
          <h3 className="font-semibold text-blue-600 mb-2">ĐIỀU KHOẢN:</h3>
          <p><strong>Giá bán:</strong> <span className="text-green-600 font-bold">{formatMoney(contractData.salePrice)}</span></p>
          {contractData.deposit > 0 && <p><strong>Tiền cọc:</strong> {formatMoney(contractData.deposit)}</p>}
          <p><strong>Thanh toán:</strong> {
            contractData.paymentTerms === "full_payment" ? "Một lần" :
              contractData.paymentTerms === "installment" ? "Trả góp" : "Chuyển khoản"
          }</p>
          <p><strong>Giao xe:</strong> {new Date(contractData.deliveryDate).toLocaleDateString("vi-VN")}</p>
          <p><strong>Bảo hành:</strong> {contractData.warrantyTerms}</p>
          {contractData.includeInsurance && <p>Bên A hỗ trợ làm bảo hiểm.</p>}
          {contractData.includeRegistration && <p>Bên A hỗ trợ sang tên.</p>}
          {contractData.specialConditions && <p><strong>Đặc biệt:</strong> {contractData.specialConditions}</p>}
        </div>

        <div className="grid grid-cols-2 gap-8 mt-12">
          <div className="text-center">
            <p className="font-semibold mb-16">BÊN BÁN</p>
            <p className="border-t pt-2">{contractData.seller?.fullName}</p>
          </div>
          <div className="text-center">
            <p className="font-semibold mb-16">BÊN MUA</p>
            <p className="border-t pt-2">{customer?.name}</p>
          </div>
        </div>

        <p className="text-center text-xs text-gray-500 mt-8">
          Hợp đồng lập thành 02 bản, mỗi bên giữ 01 bản.
        </p>
      </div>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <FileText className="h-4 w-4 mr-2" />
          Tạo hợp đồng
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {previewMode ? "Xem trước hợp đồng" : "Tạo hợp đồng mua bán xe"}
          </DialogTitle>
        </DialogHeader>

        {!previewMode ? (
          <div className="space-y-6">
            <Card>
              <CardHeader><CardTitle className="text-lg">Thông tin cơ bản</CardTitle></CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <div><Label>Số hợp đồng</Label><Input value={contractData.contractNumber} onChange={e => handleInputChange("contractNumber", e.target.value)} /></div>
                <div><Label>Ngày ký</Label><Input type="date" value={contractData.date} onChange={e => handleInputChange("date", e.target.value)} /></div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="text-lg">Chọn xe</CardTitle></CardHeader>
              <CardContent>
                <CarSelectWithImage
                  cars={carPosts}
                  onSelect={handleCarSelect}
                  selectedCar={displayCar}
                  disabled={!!transaction?.car}
                />
                {displayCar && (
                  <div className="mt-4 p-4 bg-secondary rounded-lg flex gap-4">
                    <img src={displayCar.carImages?.[0]?.imageUrl || "/placeholder.png"} alt="" className="w-32 h-24 object-cover rounded" />
                    <div>
                      <h4 className="font-semibold">{displayCar.title}</h4>
                      <p className="text-sm">Giá: <span className="text-red-600 font-bold">{formatMoney(displayCar.price)}</span></p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="text-lg">Thông tin khách hàng</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {!transaction?.buyer && (
                  <div className="flex gap-2">
                    <Input placeholder="Tìm bằng tên, SĐT, CCCD..." value={searchValue} onChange={e => setSearchValue(e.target.value)} onKeyDown={e => e.key === "Enter" && handleCustomerSearch()} />
                    <Button onClick={handleCustomerSearch}><Search className="h-4 w-4" /></Button>
                  </div>
                )}

                {contractData.isNewCustomer || !transaction?.buyer ? (
                  <div className="grid grid-cols-2 gap-4">
                    <Input placeholder="Họ tên" value={contractData.newCustomerData.name} onChange={e => handleNewCustomerChange("name", e.target.value)} />
                    <Input placeholder="SĐT" value={contractData.newCustomerData.phone} onChange={e => handleNewCustomerChange("phone", e.target.value)} />
                    <Input placeholder="CCCD" value={contractData.newCustomerData.cccd} onChange={e => handleNewCustomerChange("cccd", e.target.value)} />
                    <Input placeholder="Email" value={contractData.newCustomerData.email} onChange={e => handleNewCustomerChange("email", e.target.value)} />
                    <Textarea placeholder="Địa chỉ" className="col-span-2" value={contractData.newCustomerData.address} onChange={e => handleNewCustomerChange("address", e.target.value)} />
                  </div>
                ) : (
                  <div className="p-4 bg-green-50 rounded-lg">
                    <p className="font-semibold">{transaction.buyer.fullName}</p>
                    <p className="text-sm">SĐT: {transaction.buyer.phone} | Email: {transaction.buyer.email}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="text-lg">Điều khoản</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Giá bán</Label><Input type="number" value={contractData.salePrice} onChange={e => handleInputChange("salePrice", Number(e.target.value))} /></div>
                  <div><Label>Tiền cọc</Label><Input type="number" value={contractData.deposit} onChange={e => handleInputChange("deposit", Number(e.target.value))} /></div>
                  <div><Label>Thanh toán</Label>
                    <Select value={contractData.paymentTerms} onValueChange={v => handleInputChange("paymentTerms", v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="full_payment">Một lần</SelectItem>
                        <SelectItem value="installment">Trả góp</SelectItem>
                        <SelectItem value="bank_transfer">Chuyển khoản</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div><Label>Giao xe</Label><Input type="date" value={contractData.deliveryDate} onChange={e => handleInputChange("deliveryDate", e.target.value)} /></div>
                </div>
                <Textarea placeholder="Bảo hành" value={contractData.warrantyTerms} onChange={e => handleInputChange("warrantyTerms", e.target.value)} />
                <Textarea placeholder="Điều khoản đặc biệt" value={contractData.specialConditions} onChange={e => handleInputChange("specialConditions", e.target.value)} />
                <div className="flex gap-4">
                  <div className="flex items-center gap-2"><Checkbox checked={contractData.includeInsurance} onCheckedChange={c => handleInputChange("includeInsurance", c)} /><Label>Hỗ trợ bảo hiểm</Label></div>
                  <div className="flex items-center gap-2"><Checkbox checked={contractData.includeRegistration} onCheckedChange={c => handleInputChange("includeRegistration", c)} /><Label>Hỗ trợ sang tên</Label></div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setPreviewMode(true)}>Xem trước</Button>
              {/* <Button onClick={generatePDF}>
                <Download className="h-4 w-4 mr-2" />
                Tạo PDF
              </Button> */}
            </div>


          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setPreviewMode(false)}>Quay lại</Button>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => {window.print(); onUpdate?.(Number(transaction?.id), "COMPLETED")}}>
                  <Printer className="h-4 w-4 mr-2" />In
                </Button>
                <Button variant="outline" onClick={ () => {sendContract; ; onUpdate?.(Number(transaction?.id), "COMPLETED")}}>
                  <Send className="h-4 w-4 mr-2" />Gửi
                </Button>
                <Button onClick={() => {generatePDF; ; onUpdate?.(Number(transaction?.id), "COMPLETED")}}>
                  <Download className="h-4 w-4 mr-2" />PDF
                </Button>
              </div>
            </div>
            <div ref={printRef}>
              <ContractPreview />
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
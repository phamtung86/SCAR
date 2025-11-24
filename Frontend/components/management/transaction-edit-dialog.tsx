"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Edit, Save } from "lucide-react"
import { toast } from "sonner"
import TransactionAPI from "@/lib/api/transaction"
import { formatMoney } from "@/lib/utils/money-format"

interface TransactionEditDialogProps {
  transactionId: number
  onRefresh?: () => void
}

export function TransactionEditDialog({ transactionId, onRefresh }: TransactionEditDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [transaction, setTransaction] = useState<any>(null)
  const [formData, setFormData] = useState({
    priceAgreed: 0,
    buyerName: "",
    buyerPhone: "",
    buyerAddress: "",
    buyerCode: "",
    paymentMethod: "CASH",
    contractNumber: "",
    notes: "",
  })

  // Load transaction data
  const loadTransaction = async () => {
    if (!transactionId) return

    try {
      setLoading(true)
      const res = await TransactionAPI.getTransactionById(transactionId)
      if (res.status === 200) {
        const data = res.data
        setTransaction(data)

        setFormData({
          priceAgreed: data.priceAgreed || 0,
          buyerName: data.buyerName || data.buyer?.fullName || "",
          buyerPhone: data.buyerPhone || data.buyer?.phone || "",
          buyerAddress: data.buyerAddress || data.buyer?.location || "",
          buyerCode: data.buyerCode || "",
          paymentMethod: data.paymentMethod || "CASH",
          contractNumber: data.contractNumber || "",
          notes: data.notes || "",
        })
      }
    } catch (error) {
      console.error("Lỗi khi tải giao dịch:", error)
      toast.error("Không thể tải thông tin giao dịch")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isOpen) {
      loadTransaction()
    }
  }, [isOpen, transactionId])

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

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

  const handleSave = async () => {
    // Validation
    if (!formData.priceAgreed || formData.priceAgreed <= 0) {
      toast.error("Giá bán phải lớn hơn 0")
      return
    }

    if (!transaction?.buyer) {
      if (!formData.buyerName.trim()) {
        toast.error("Vui lòng nhập tên khách hàng")
        return
      }
      if (!formData.buyerPhone.trim() || !/^\d{10}$/.test(formData.buyerPhone)) {
        toast.error("Số điện thoại phải có 10 chữ số")
        return
      }
    }

    try {
      setLoading(true)

      const updateData = {
        carId: transaction?.car?.id,
        sellerId: transaction?.seller?.id,
        buyerId: transaction?.buyer?.id,
        priceAgreed: formData.priceAgreed,
        buyerCode: formData.buyerCode,
        buyerName: formData.buyerName,
        buyerPhone: formData.buyerPhone,
        buyerAddress: formData.buyerAddress,
        paymentMethod: formData.paymentMethod,
        contractNumber: formData.contractNumber,
        notes: formData.notes,
      }

      const res = await TransactionAPI.updateTransaction(transactionId, updateData)

      if (res.status === 200) {
        toast.success("Đã cập nhật giao dịch thành công!")
        setIsOpen(false)
        onRefresh?.()
      }
    } catch (error) {
      console.error("Lỗi cập nhật giao dịch:", error)
      toast.error("Không thể cập nhật giao dịch")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Edit className="h-4 w-4 mr-2" />
          Sửa giao dịch
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            Sửa thông tin giao dịch
          </DialogTitle>
        </DialogHeader>

        {loading && <p className="text-center py-4">Đang tải...</p>}

        {!loading && transaction && (
          <div className="space-y-4">
            {/* Thông tin xe - chỉ hiển thị, không cho sửa */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Thông tin xe (Không thể sửa)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <img
                    src={transaction.car?.carImages?.[0]?.imageUrl || "/placeholder.png"}
                    alt={transaction.car?.title}
                    className="w-32 h-24 object-cover rounded border"
                  />
                  <div>
                    <h4 className="font-semibold">{transaction.car?.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      Model: {transaction.car?.carModelsName} • Năm: {transaction.car?.year}
                    </p>
                    <p className="text-sm font-bold text-red-600">
                      Giá niêm yết: {formatMoney(transaction.car?.price)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Thông tin khách hàng */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Thông tin khách hàng</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {transaction.buyer ? (
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded border">
                    <p className="font-semibold">✓ Khách hàng có tài khoản</p>
                    <p className="text-sm">{transaction.buyer.fullName}</p>
                    <p className="text-sm text-muted-foreground">
                      {transaction.buyer.phone} • {transaction.buyer.email}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label>Họ tên *</Label>
                        <Input
                          value={formData.buyerName}
                          onChange={(e) => handleInputChange("buyerName", e.target.value)}
                          placeholder="Nhập họ tên"
                        />
                      </div>
                      <div>
                        <Label>Số điện thoại *</Label>
                        <Input
                          value={formData.buyerPhone}
                          onChange={(e) => handleInputChange("buyerPhone", e.target.value)}
                          placeholder="Nhập SĐT"
                          maxLength={10}
                        />
                      </div>
                      <div>
                        <Label>CCCD</Label>
                        <Input
                          value={formData.buyerCode}
                          onChange={(e) => handleInputChange("buyerCode", e.target.value)}
                          placeholder="Nhập CCCD"
                          maxLength={12}
                        />
                      </div>
                      <div className="col-span-2">
                        <Label>Địa chỉ</Label>
                        <Textarea
                          value={formData.buyerAddress}
                          onChange={(e) => handleInputChange("buyerAddress", e.target.value)}
                          placeholder="Nhập địa chỉ"
                          rows={2}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Thông tin giao dịch */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Thông tin giao dịch</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Giá thỏa thuận (VNĐ) *</Label>
                    <Input
                      type="number"
                      value={formData.priceAgreed}
                      onChange={(e) => handleInputChange("priceAgreed", Number(e.target.value))}
                      placeholder="Nhập giá"
                    />
                  </div>
                  <div>
                    <Label>Phương thức thanh toán</Label>
                    <Select
                      value={formData.paymentMethod}
                      onValueChange={(value) => handleInputChange("paymentMethod", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CASH">Tiền mặt</SelectItem>
                        <SelectItem value="BANKING">Chuyển khoản</SelectItem>
                        <SelectItem value="INSTALLMENT">Trả góp</SelectItem>
                        <SelectItem value="OTHER">Khác</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-2">
                    <Label>Số hợp đồng</Label>
                    <Input
                      value={formData.contractNumber}
                      onChange={(e) => handleInputChange("contractNumber", e.target.value)}
                      placeholder="Nhập số hợp đồng"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label>Ghi chú</Label>
                    <Textarea
                      value={formData.notes}
                      onChange={(e) => handleInputChange("notes", e.target.value)}
                      placeholder="Ghi chú thêm..."
                      rows={3}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Buttons */}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => { setIsOpen(false) }}>
                Thoát
              </Button>
              {
                transaction.status !== "PENDING" &&
                <Button className="bg-red-500 text-white" variant="outline" onClick={() => { setIsOpen(false); handleChangeStatus(transaction?.id, "CANCELLED") }}>Hủy</Button>
              }

              <Button
                onClick={handleSave}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Save className="h-4 w-4 mr-2" />
                {loading ? "Đang lưu..." : "Lưu thay đổi"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

"use client"

import type React from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { formatMoney } from "@/lib/utils/money-format"
import Payment from "@/lib/api/payment"
import { Check, Crown, Star, Zap } from "lucide-react"

interface UpgradeTier {
  id: string
  name: string
  price: string
  originalPrice?: string
  duration: string
  icon: React.ReactNode
  color: string
  benefits: string[]
  popular?: boolean
}

interface UpgradeModalProps {
  isOpen: boolean
  onClose: () => void
  currentRank: string
  currentUser: object
}

const upgradeTiers: UpgradeTier[] = [
  {
    id: "PRO",
    name: "Pro",
    price: "299000",
    originalPrice: "399000",
    duration: "1 tháng",
    icon: <Star className="h-6 w-6" />,
    color: "from-blue-400 to-blue-500",
    benefits: [
      "Giảm 15% phí đăng bài",
      "Hỗ trợ ưu tiên",
      "Truy cập tính năng nâng cao",
      "Báo cáo chi tiết",
      "Ưu tiên bài đăng"
    ],
    popular: true,
  },
  {
    id: "PREMIUM",
    name: "Premium",
    price: "699000",
    originalPrice: "899000",
    duration: "1 tháng",
    icon: <Crown className="h-6 w-6" />,
    color: "from-purple-400 to-purple-500",
    benefits: [
      "Miễn phí đăng bài",
      "Hỗ trợ 24/7",
      "Tính năng AI Premium",
      "Quản lý đa tài khoản",
      "Phân tích nâng cao",
      "Tư vấn 1-1",
      "Ưu tiên bài đăng"
    ],
  },
]

export function UpgradeModal({ isOpen, onClose, currentRank, currentUser }: UpgradeModalProps) {

  const handleSelectPlan = (tierId: string) => {
    localStorage.setItem("scar_targetRank", tierId);
  }

  const upgradeRank = async (amount: number, bankCode: string, language: string, userId: number) => {
    const res = await Payment.vnpayCreatePayment(amount, bankCode, language, userId, null);
    if (res.status === 200) {
      window.location.href = res.data
    }

  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center flex items-center justify-center gap-2">
            <Zap className="h-6 w-6 text-blue-500" />
            Nâng cấp tài khoản
          </DialogTitle>
          <p className="text-center text-muted-foreground">Chọn gói nâng cấp phù hợp để mở khóa thêm nhiều tính năng</p>
        </DialogHeader>

        <div className="grid md:grid-cols-3 gap-6 mt-6">
          {upgradeTiers.map((tier) => (
            <Card key={tier.id} className={`relative ${tier.popular ? "ring-2 ring-blue-500 shadow-lg" : ""}`}>
              {tier.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500">Phổ biến nhất</Badge>
              )}

              <CardHeader className="text-center">
                <div
                  className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r ${tier.color} text-white mx-auto mb-2`}
                >
                  {tier.icon}
                </div>
                <CardTitle className="text-xl">{tier.name}</CardTitle>
                <div className="space-y-1">
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-1xl font-bold">{formatMoney(tier.price, false)}</span>
                    {tier.originalPrice && (
                      <span className="text-sm text-muted-foreground line-through">{formatMoney(tier.originalPrice, false)}</span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">/{tier.duration}</p>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {tier.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => { 
                    upgradeRank(Number(tier.price), "NCB", "vn", currentUser?.id); 
                    handleSelectPlan(tier.id) 
                  }}
                  className={`w-full ${tier.popular
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                    : ""
                    }`}
                  variant={tier.popular ? "default" : "outline"}
                >
                  Chọn gói {tier.name}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-6 p-4 bg-muted rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Check className="h-4 w-4 text-green-500" />
            <span className="font-medium">Cam kết của chúng tôi</span>
          </div>
          <ul className="text-sm text-muted-foreground space-y-1 ml-6">
            <li>• Hoàn tiền 100% trong 7 ngày đầu</li>
            <li>• Nâng cấp/hạ cấp linh hoạt bất cứ lúc nào</li>
            <li>• Hỗ trợ kỹ thuật 24/7</li>
            <li>• Bảo mật dữ liệu tuyệt đối</li>
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  )
}

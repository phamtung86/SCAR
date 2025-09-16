"use client"

import type React from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import PaymentAPI from "@/lib/api/payment"
import { formatMoney } from "@/lib/utils/money-format"
import { Check, Crown, Star, Zap } from "lucide-react"
import { useEffect, useState } from "react"
import { FeeDTO } from "@/types/fee"
import FeeAPI from "@/lib/api/fee"

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

export function UpgradeModal({ isOpen, onClose, currentRank, currentUser }: UpgradeModalProps) {

  const [upgradeTiers, setUpgradeTiers] = useState<FeeDTO[]>([]);


  const fetchRankByType = async (type: string) => {
    try {
      const res = await FeeAPI.findAllByType(type);
      if (res.status === 200) {
        console.log(res.data);
        
        setUpgradeTiers(res.data)
      }
    } catch (error) {
      console.log("Lỗi khi lấy danh sách hạng tài khoản ", error);

    }
  }

  useEffect(() => {
    fetchRankByType("UPGRADE_ACCOUNT")
  }, [])


  const handleSelectPlan = (tierId: string) => {
    // localStorage.setItem("scar_targetRank", tierId);
  }

  const upgradeRank = async (amount: number, bankCode: string, language: string, userId: number, feeId: number) => {
    const res = await PaymentAPI.vnpayCreatePayment(amount, bankCode, language, userId, null, null,feeId);
    if (res.status === 200) {
      window.location.href = res.data
    }
  }

  const handleUpgradeRank = (rankCode: string, rankPrice: string, rankName: string, rankId : number) => {
    if (rankCode === currentRank) {
      alert(`Gói ${rankName} của bạn vẫn còn hạn sử dụng`);
      return;
    }

    const doUpgrade = () => {
      upgradeRank(Number(rankPrice), "NCB", "vn", currentUser?.id, Number(rankId));
      handleSelectPlan(rankCode);
    };

    if (currentRank === "NORMAL") {
      doUpgrade();
    } else {
      const confirmMsg = `Bạn vẫn còn thời gian sử dụng gói ${currentRank}. 
      Nếu chọn gói ${rankName} thì quyền lợi sử dụng gói ${currentRank} của bạn sẽ bị mất`;

      if (window.confirm(confirmMsg)) {
        doUpgrade();
      }
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
            <Card key={tier?.id} className={`relative ${tier?.code === currentRank ? "ring-2 ring-blue-500 shadow-lg" : ""}`}>
              {tier?.code === currentRank && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500">Bạn đang dùng</Badge>
              )}

              <CardHeader className="text-center">
                <div
                  className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r ${tier?.code === "PRO" ? `from-blue-400 to-blue-500` : `from-purple-400 to-purple-500`} text-white mx-auto mb-2`}
                >
                  <i className={`fas fa-${tier?.icon}`}></i>
                </div>
                <CardTitle className="text-xl">{tier?.name}</CardTitle>
                <div className="space-y-1">
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-1xl font-bold">{formatMoney((tier?.price - (tier?.price * tier?.sale / 100)), false)}</span>
                    {tier?.sale > 0 && (
                      <span className="text-sm text-muted-foreground line-through">{formatMoney(tier?.price, false)}</span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">/Tháng</p>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {tier?.feeServiceDetails?.map((item) => (
                    <li key={item.id} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{item?.name}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => {
                    const price = tier?.sale ? (tier?.price - (tier?.price * tier?.sale / 100)) : tier?.price
                    handleUpgradeRank(tier?.code, price, tier?.name, tier?.id)
                  }}
                  className={`w-full ${tier?.code !== currentRank
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                    : ""
                    }`}
                  variant={tier?.code !== currentRank ? "default" : "outline"}
                >
                  {tier?.code === currentRank ? "Đang sử dụng" : `Chọn gói ${tier?.code}`}
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
            <li>• Hoàn tiền 100% trong 3 ngày đầu</li>
            <li>• Nâng cấp/hạ cấp linh hoạt bất cứ lúc nào</li>
            <li>• Hỗ trợ kỹ thuật 24/7</li>
            <li>• Bảo mật dữ liệu tuyệt đối</li>
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  )
}

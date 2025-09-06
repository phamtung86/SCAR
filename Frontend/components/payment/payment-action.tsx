"use client"

import { Button } from "@/components/ui/button"
import { Home, Printer } from "lucide-react"

export function PaymentActions() {
  const handleGoHome = () => {
    window.location.href = "/"
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="flex flex-col sm:flex-row gap-3 pt-4">
      <Button
        className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
        onClick={handleGoHome}
      >
        <Home className="h-4 w-4 mr-2" />
        Về trang chủ
      </Button>
      <Button
        variant="outline"
        className="flex-1 bg-gradient-to-r from-gray-50 to-blue-50 hover:from-gray-100 hover:to-blue-100 border-2 border-blue-200 hover:border-blue-300 text-blue-700 hover:text-blue-800 shadow-lg hover:shadow-xl transition-all duration-300"
        onClick={handlePrint}
      >
        <Printer className="h-4 w-4 mr-2" />
        In hóa đơn
      </Button>
    </div>
  )
}

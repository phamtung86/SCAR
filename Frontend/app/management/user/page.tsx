"use client"
import { Header } from "@/components/layout/header"
import { SellerDashboard } from "@/components/management/seller-dashboard"
import { useState } from "react"

export default function SellerPage() {
  const [userRole, setUserRole] = useState<"user" | "seller" | "admin">("seller")

  return (
    <div className="min-h-screen bg-background">
      <Header/>

      <main className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">Quản lý bán hàng</h1>
          <p className="text-muted-foreground">Quản lý xe bán, đơn hàng và doanh thu của bạn</p>
        </div>
        <SellerDashboard />
      </main>
    </div>
  )
}

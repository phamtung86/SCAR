"use client"

import { Header } from "@/components/layout/header"
import { AdminDashboard } from "@/components/management/admin-dashboard"
import { useState } from "react"

export default function AdminPage() {
    const [userRole, setUserRole] = useState<"user" | "seller" | "admin">("admin")

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main className="container mx-auto px-4 py-6">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-foreground mb-2">Quản trị hệ thống</h1>
                    <p className="text-muted-foreground">Quản lý người dùng, giao dịch và cài đặt hệ thống</p>
                </div>
                <AdminDashboard />
            </main>
        </div>
    )
}
 
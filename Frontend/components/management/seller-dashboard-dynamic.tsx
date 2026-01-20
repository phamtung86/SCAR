"use client"

import dynamic from 'next/dynamic'

// Dynamically import SellerDashboard with no SSR
const SellerDashboardDynamic = dynamic(
    () => import('@/components/management/seller-dashboard').then(mod => ({ default: mod.SellerDashboard })),
    {
        ssr: false,
        loading: () => (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Đang tải dashboard...</p>
                </div>
            </div>
        )
    }
)

export { SellerDashboardDynamic }

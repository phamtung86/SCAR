"use client"

// This file provides a client-only wrapper for recharts
// DO NOT import recharts directly anywhere else in the app

import dynamic from "next/dynamic"

// Lazy load the entire seller dashboard charts section
export const LazyCharts = dynamic(
    () => import("./charts-content"),
    {
        ssr: false,
        loading: () => <div className="h-[300px] flex items-center justify-center">Loading charts...</div>
    }
)

// Re-export recharts as lazy-loaded components
// These are safe because they're only rendered client-side
export const DynamicAreaChart = dynamic(
    () => import("recharts").then((mod) => mod.AreaChart),
    { ssr: false }
) as any

export const DynamicBarChart = dynamic(
    () => import("recharts").then((mod) => mod.BarChart),
    { ssr: false }
) as any

export const DynamicLineChart = dynamic(
    () => import("recharts").then((mod) => mod.LineChart),
    { ssr: false }
) as any

export const DynamicPieChart = dynamic(
    () => import("recharts").then((mod) => mod.PieChart),
    { ssr: false }
) as any

export const DynamicResponsiveContainer = dynamic(
    () => import("recharts").then((mod) => mod.ResponsiveContainer),
    { ssr: false }
) as any

// These child components are safe to re-export directly because
// they will only be rendered inside the dynamic parent components above
// The parent being ssr:false means these never run on server

// Export empty components for server-side, real ones for client-side
export const Area = typeof window !== "undefined" ? require("recharts").Area : (() => null) as any
export const Bar = typeof window !== "undefined" ? require("recharts").Bar : (() => null) as any
export const CartesianGrid = typeof window !== "undefined" ? require("recharts").CartesianGrid : (() => null) as any
export const Cell = typeof window !== "undefined" ? require("recharts").Cell : (() => null) as any
export const Legend = typeof window !== "undefined" ? require("recharts").Legend : (() => null) as any
export const Line = typeof window !== "undefined" ? require("recharts").Line : (() => null) as any
export const Pie = typeof window !== "undefined" ? require("recharts").Pie : (() => null) as any
export const Tooltip = typeof window !== "undefined" ? require("recharts").Tooltip : (() => null) as any
export const XAxis = typeof window !== "undefined" ? require("recharts").XAxis : (() => null) as any
export const YAxis = typeof window !== "undefined" ? require("recharts").YAxis : (() => null) as any
export const ResponsiveContainer = typeof window !== "undefined" ? require("recharts").ResponsiveContainer : (() => null) as any

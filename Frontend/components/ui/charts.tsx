"use client"

import dynamic from "next/dynamic"

// Dynamically import recharts components with SSR disabled
// This fixes "self is not defined" error during Vercel build
export const DynamicAreaChart = dynamic(
    () => import("recharts").then((mod) => mod.AreaChart),
    { ssr: false }
)

export const DynamicBarChart = dynamic(
    () => import("recharts").then((mod) => mod.BarChart),
    { ssr: false }
)

export const DynamicLineChart = dynamic(
    () => import("recharts").then((mod) => mod.LineChart),
    { ssr: false }
)

export const DynamicPieChart = dynamic(
    () => import("recharts").then((mod) => mod.PieChart),
    { ssr: false }
)

export const DynamicResponsiveContainer = dynamic(
    () => import("recharts").then((mod) => mod.ResponsiveContainer),
    { ssr: false }
)

// Re-export other recharts components that don't have SSR issues
export {
    Area,
    Bar,
    CartesianGrid,
    Cell,
    Legend,
    Line,
    Pie,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts"

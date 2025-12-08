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
let Area: any, Bar: any, CartesianGrid: any, Cell: any, Legend: any, Line: any, Pie: any, Tooltip: any, XAxis: any, YAxis: any

if (typeof window !== "undefined") {
    const recharts = require("recharts")
    Area = recharts.Area
    Bar = recharts.Bar
    CartesianGrid = recharts.CartesianGrid
    Cell = recharts.Cell
    Legend = recharts.Legend
    Line = recharts.Line
    Pie = recharts.Pie
    Tooltip = recharts.Tooltip
    XAxis = recharts.XAxis
    YAxis = recharts.YAxis
}

export { Area, Bar, CartesianGrid, Cell, Legend, Line, Pie, Tooltip, XAxis, YAxis }

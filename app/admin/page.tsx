"use client"

import { useState, useMemo } from "react"
import { AdminGate } from "@/components/auth/admin-gate"
import { getOrdersWithDemo, buildAnalytics } from "@/lib/analytics"
import { StatsCards } from "@/components/admin/stats-cards"
import { SalesLineChart } from "@/components/admin/sales-line-chart"
import { OrdersByDayBar } from "@/components/admin/orders-by-day-bar"
import { CategoryPieChart } from "@/components/admin/category-pie-chart"
import { TopProductsBar } from "@/components/admin/top-products-bar"
import { OrderStatusDonut } from "@/components/admin/order-status-donut"

export default function AdminDashboardPage() {
  const [win, setWin] = useState<"7d" | "30d" | "all">("30d")

  const filtered = useMemo(() => {
    const orders = getOrdersWithDemo(true)
    if (win === "all") return orders
    const days = win === "7d" ? 7 : 30
    const cutoff = Date.now() - days * 24 * 60 * 60 * 1000
    return orders.filter((o) => {
      const ts = o.createdAt ? new Date(o.createdAt).getTime() : Date.now()
      return ts >= cutoff
    })
  }, [win])

  const { kpis, ordersByDay, categories } = useMemo(() => buildAnalytics(filtered), [filtered])

  const topProducts = useMemo(() => {
    if (!filtered?.length) {
      return [
        { name: "Paracetamol 500mg", value: 9200 },
        { name: "Vitamin C 1000mg", value: 6700 },
        { name: "Cough Syrup", value: 5100 },
        { name: "Hand Sanitizer", value: 4300 },
        { name: "Digital Thermometer", value: 3200 },
      ]
    }
    const map = new Map<string, number>()
    for (const o of filtered as any[]) {
      const items = (o?.items as any[]) || []
      for (const it of items) {
        const name = (it?.name || it?.title || it?.productName || "Unknown") as string
        const qty = Number(it?.quantity ?? 1)
        const price = Number(it?.price ?? 0)
        const subtotal = price * qty
        map.set(name, (map.get(name) || 0) + subtotal)
      }
    }
    const arr = Array.from(map.entries()).map(([name, value]) => ({ name, value }))
    arr.sort((a, b) => b.value - a.value)
    return arr.slice(0, 8)
  }, [filtered])

  const statusData = useMemo(() => {
    if (!filtered?.length) {
      return [
        { name: "Pending", value: 18 },
        { name: "Approved", value: 42 },
        { name: "Shipped", value: 30 },
        { name: "Delivered", value: 55 },
        { name: "Rejected", value: 5 },
      ]
    }
    const cnt = new Map<string, number>()
    for (const o of filtered as any[]) {
      const s = (o?.status as string) || "Pending"
      cnt.set(s, (cnt.get(s) || 0) + 1)
    }
    return Array.from(cnt.entries()).map(([name, value]) => ({ name, value }))
  }, [filtered])

  return (
    <AdminGate>
      <div className="mb-4 flex flex-wrap gap-2">
        <button
          className={`px-2 py-1 rounded text-sm ${win === "7d" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
          onClick={() => setWin("7d")}
        >
          Last 7d
        </button>
        <button
          className={`px-2 py-1 rounded text-sm ${win === "30d" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
          onClick={() => setWin("30d")}
        >
          Last 30d
        </button>
        <button
          className={`px-2 py-1 rounded text-sm ${win === "all" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
          onClick={() => setWin("all")}
        >
          All time
        </button>
      </div>
      <div className="space-y-6">
        <StatsCards kpis={kpis} />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <SalesLineChart data={ordersByDay.map(({ date, revenue }) => ({ date, revenue }))} />
          <OrdersByDayBar data={ordersByDay.map(({ date, orders }) => ({ date, orders }))} />
        </div>
        <CategoryPieChart data={categories} />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <TopProductsBar data={topProducts} />
          <OrderStatusDonut data={statusData} />
        </div>
      </div>
    </AdminGate>
  )
}

"use client"

import { AdminGate } from "@/components/auth/admin-gate"
import { getOrdersWithDemo, buildAnalytics } from "@/lib/analytics"
import { SalesLineChart } from "@/components/admin/sales-line-chart"
import { OrdersByDayBar } from "@/components/admin/orders-by-day-bar"
import { CategoryPieChart } from "@/components/admin/category-pie-chart"
import ReportsTable from "@/components/admin/reports-table"
import { useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type WindowKey = "7d" | "30d" | "all"

function filterOrders(windowKey: WindowKey) {
  const orders = getOrdersWithDemo(true)
  if (windowKey === "all") return orders
  const days = windowKey === "7d" ? 7 : 30
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000
  return orders.filter((o) => {
    const ts = o.createdAt ? new Date(o.createdAt).getTime() : Date.now()
    return ts >= cutoff
  })
}

export default function AdminReportsPage() {
  const [win, setWin] = useState<WindowKey>("30d")

  const filtered = useMemo(() => filterOrders(win), [win])

  const { ordersByDay, categories } = useMemo(() => {
    return buildAnalytics(filtered)
  }, [filtered])

  return (
    <AdminGate>
      <div className="space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Reports</CardTitle>
            <div className="flex items-center gap-2 text-sm">
              <button
                className={`px-2 py-1 rounded ${win === "7d" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                onClick={() => setWin("7d")}
              >
                Last 7d
              </button>
              <button
                className={`px-2 py-1 rounded ${win === "30d" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                onClick={() => setWin("30d")}
              >
                Last 30d
              </button>
              <button
                className={`px-2 py-1 rounded ${win === "all" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                onClick={() => setWin("all")}
              >
                All time
              </button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <SalesLineChart data={ordersByDay.map(({ date, revenue }) => ({ date, revenue }))} />
              <OrdersByDayBar data={ordersByDay.map(({ date, orders }) => ({ date, orders }))} />
            </div>
            <div className="mt-6">
              <CategoryPieChart data={categories} />
            </div>
            <div className="mt-6">
              <ReportsTable orders={filtered as any[]} />
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminGate>
  )
}

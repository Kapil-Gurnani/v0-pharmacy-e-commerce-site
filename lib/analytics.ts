export type OrderItem = {
  id: string
  name: string
  price: number
  qty: number
  category?: string
}

export type Order = {
  id: string
  items: OrderItem[]
  total: number
  status?: string
  createdAt?: string | number
}

export function getOrdersFromStorage(): Order[] {
  if (typeof window === "undefined") return []
  try {
    const raw = window.localStorage.getItem("orders")
    if (!raw) return []
    const arr = JSON.parse(raw)
    if (!Array.isArray(arr)) return []
    return arr
  } catch {
    return []
  }
}

import { demoOrders } from "./admin-demo"

// Return orders including demo data by default
export function getOrdersWithDemo(includeDemo = true) {
  const orders = getOrdersFromStorage()
  return includeDemo ? [...demoOrders, ...orders] : orders
}

type KPI = {
  label: string
  value: string
  sublabel?: string
}

export function buildAnalytics(orders: Order[]) {
  const byDayMap = new Map<string, { orders: number; revenue: number }>()
  let revenue = 0
  let count = 0
  const categoryMap = new Map<string, number>()

  for (const o of orders) {
    const date = o.createdAt ? new Date(o.createdAt) : new Date()
    const key = date.toISOString().slice(0, 10) // YYYY-MM-DD
    const prev = byDayMap.get(key) || { orders: 0, revenue: 0 }
    byDayMap.set(key, { orders: prev.orders + 1, revenue: prev.revenue + (o.total || 0) })

    revenue += o.total || 0
    count += 1

    for (const it of o.items || []) {
      const cat = it.category || "Other"
      categoryMap.set(cat, (categoryMap.get(cat) || 0) + it.qty)
    }
  }

  const ordersByDay = Array.from(byDayMap.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([date, v]) => ({ date, orders: v.orders, revenue: Number(v.revenue.toFixed(2)) }))

  const categories = Array.from(categoryMap.entries()).map(([name, qty]) => ({
    name,
    qty,
  }))

  const averageOrder = count ? revenue / count : 0

  const kpis: KPI[] = [
    { label: "Total Revenue", value: `₹${revenue.toFixed(2)}` },
    { label: "Total Orders", value: String(count) },
    { label: "Avg. Order Value", value: `₹${averageOrder.toFixed(2)}` },
  ]

  return { kpis, ordersByDay, categories }
}

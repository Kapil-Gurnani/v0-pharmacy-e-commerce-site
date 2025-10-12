"use client"

export type OrderItem = {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
}

export type OrderEvent = {
  status: "Processing" | "Packed" | "Shipped" | "Out for Delivery" | "Delivered"
  at: string // ISO date
  note?: string
}

export type Order = {
  id: string
  createdAt: string
  trackingNumber: string
  status: OrderEvent["status"]
  events: OrderEvent[]
  items: OrderItem[]
  subtotal: number
  shipping: number
  total: number
  customer: {
    fullName: string
    phone: string
    addressLine1?: string
    addressLine2?: string
    city?: string
    state?: string
    zip?: string
  }
}

const STORAGE_KEY = "pharmacy_orders_v1"

export function loadOrders(): Order[] {
  if (typeof window === "undefined") return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Order[]) : []
  } catch {
    return []
  }
}

export function saveOrders(orders: Order[]) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(orders))
}

export function generateTrackingNumber() {
  // Simple demo tracking number: PHM-XXXX-YYYY
  const part = () => Math.random().toString(36).slice(2, 6).toUpperCase()
  return `PHM-${part()}-${part()}`
}

export function addOrder(input: Omit<Order, "id" | "createdAt" | "events" | "status" | "trackingNumber">): Order {
  const now = new Date().toISOString()
  const trackingNumber = generateTrackingNumber()

  const initialEvent: OrderEvent = {
    status: "Processing",
    at: now,
    note: "Order received. Preparing your items.",
  }

  const order: Order = {
    ...input,
    id: `ord_${Date.now()}`,
    createdAt: now,
    trackingNumber,
    status: "Processing",
    events: [initialEvent],
  }

  const existing = loadOrders()
  existing.unshift(order)
  saveOrders(existing)

  return order
}

export function advanceOrderStatus(orderId: string) {
  const steps: OrderEvent["status"][] = ["Processing", "Packed", "Shipped", "Out for Delivery", "Delivered"]
  const orders = loadOrders()
  const idx = orders.findIndex((o) => o.id === orderId)
  if (idx === -1) return
  const current = orders[idx]
  const currentIndex = steps.indexOf(current.status)
  if (currentIndex < steps.length - 1) {
    const next = steps[currentIndex + 1]
    const evt: OrderEvent = { status: next, at: new Date().toISOString() }
    current.status = next
    current.events.push(evt)
    orders[idx] = current
    saveOrders(orders)
  }
}

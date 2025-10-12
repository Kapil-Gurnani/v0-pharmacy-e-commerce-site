"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

type OrderItem = {
  id: string
  name: string
  price: number
  qty: number
}

type TrackingEvent = {
  date: string
  text: string
}

type Order = {
  id: string
  createdAt: string
  customerName: string
  phone: string
  address?: string
  items: OrderItem[]
  subtotal: number
  status: "pending" | "approved" | "rejected" | "shipped" | "delivered"
  tracking: TrackingEvent[]
}

const demoOrders: Order[] = [
  {
    id: "ORD-1001",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    customerName: "Amit Sharma",
    phone: "+91 98765 43210",
    address: "12 Green Park, Delhi",
    items: [
      { id: "p-ibu-200", name: "Ibuprofen 200mg", price: 149.5, qty: 2 },
      { id: "p-vit-c", name: "Vitamin C 500mg", price: 250, qty: 1 },
    ],
    subtotal: 549,
    status: "approved",
    tracking: [
      { date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), text: "Order received" },
      { date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), text: "Order approved" },
      { date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), text: "Packed and ready to ship" },
    ],
  },
  {
    id: "ORD-1002",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    customerName: "Priya Verma",
    phone: "+91 98220 11122",
    address: "Bandra West, Mumbai",
    items: [
      { id: "p-para-500", name: "Paracetamol 500mg", price: 99, qty: 3 },
      { id: "p-mask-n95", name: "N95 Mask", price: 199, qty: 2 },
    ],
    subtotal: 695,
    status: "shipped",
    tracking: [
      { date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), text: "Order received" },
      { date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), text: "Order approved" },
      { date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), text: "Shipped via BlueDart" },
    ],
  },
  {
    id: "ORD-1003",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    customerName: "Rohan Gupta",
    phone: "+91 90000 22233",
    address: "Kondhwa, Pune",
    items: [
      { id: "p-thermo-digi", name: "Digital Thermometer", price: 499, qty: 1 },
      { id: "p-omega-3", name: "Omega-3 Capsules", price: 650, qty: 1 },
    ],
    subtotal: 1149,
    status: "pending",
    tracking: [{ date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), text: "Order received" }],
  },
]

function loadOrders(): Order[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem("orders")
    return raw ? (JSON.parse(raw) as Order[]) : []
  } catch {
    return []
  }
}

function saveOrders(orders: Order[]) {
  try {
    localStorage.setItem("orders", JSON.stringify(orders))
  } catch {}
}

function currency(n: number) {
  return new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }).format(n)
}

export default function OrdersTable() {
  const [orders, setOrders] = useState<Order[]>([])
  const [query, setQuery] = useState("")
  const [selected, setSelected] = useState<Order | null>(null)
  const [newTrack, setNewTrack] = useState("")

  useEffect(() => {
    const fromStorage = loadOrders()
    setOrders(fromStorage.length > 0 ? fromStorage : demoOrders)
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return orders
    return orders.filter(
      (o) =>
        o.id.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.phone.toLowerCase().includes(q) ||
        o.status.toLowerCase().includes(q),
    )
  }, [orders, query])

  function updateOrder(next: Order) {
    setOrders((prev) => {
      const arr = prev.map((o) => (o.id === next.id ? next : o))
      saveOrders(arr)
      return arr
    })
  }

  function approve(o: Order) {
    updateOrder({
      ...o,
      status: "approved",
      tracking: [...o.tracking, { date: new Date().toISOString(), text: "Order approved" }],
    })
  }
  function reject(o: Order) {
    updateOrder({
      ...o,
      status: "rejected",
      tracking: [...o.tracking, { date: new Date().toISOString(), text: "Order rejected" }],
    })
  }
  function addTracking(o: Order, text: string) {
    if (!text.trim()) return
    updateOrder({ ...o, tracking: [...o.tracking, { date: new Date().toISOString(), text: text.trim() }] })
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Orders</CardTitle>
        <div className="w-56">
          <Input placeholder="Search by ID, name, phone..." value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="w-full overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left">
                <th className="py-2 pr-4">Order ID</th>
                <th className="py-2 pr-4">Customer</th>
                <th className="py-2 pr-4">Phone</th>
                <th className="py-2 pr-4">Total</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2 pr-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => (
                <tr key={o.id} className="border-t">
                  <td className="py-2 pr-4 font-mono">{o.id}</td>
                  <td className="py-2 pr-4">{o.customerName}</td>
                  <td className="py-2 pr-4">{o.phone}</td>
                  <td className="py-2 pr-4">{currency(o.subtotal)}</td>
                  <td className="py-2 pr-4">
                    <Badge
                      className={
                        o.status === "approved"
                          ? "bg-green-600"
                          : o.status === "rejected"
                            ? "bg-red-600"
                            : o.status === "shipped"
                              ? "bg-blue-600"
                              : o.status === "delivered"
                                ? "bg-emerald-700"
                                : "bg-yellow-600"
                      }
                    >
                      {o.status}
                    </Badge>
                  </td>
                  <td className="py-2 pr-4">
                    <div className="flex gap-2">
                      <Button size="sm" variant="secondary" onClick={() => setSelected(o)}>
                        Details
                      </Button>
                      <Button size="sm" onClick={() => approve(o)} disabled={o.status !== "pending"}>
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => reject(o)}
                        disabled={o.status !== "pending"}
                      >
                        Reject
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-muted-foreground">
                    No orders yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>

      <Dialog open={!!selected} onOpenChange={(v) => !v && setSelected(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Order details</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-4">
              {/* Customer + summary */}
              <div className="grid gap-2 text-sm">
                <div>
                  <span className="font-medium">Order ID:</span> <span className="font-mono">{selected.id}</span>
                </div>
                <div>
                  <span className="font-medium">Customer:</span> {selected.customerName}
                </div>
                <div>
                  <span className="font-medium">Phone:</span> {selected.phone}
                </div>
                <div>
                  <span className="font-medium">Address:</span> {selected.address || "-"}
                </div>
                <div>
                  <span className="font-medium">Status:</span> {selected.status}
                </div>
              </div>

              {/* Items */}
              <div>
                <h4 className="mb-2 font-semibold">Items</h4>
                <div className="rounded border">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left">
                        <th className="py-1 px-2">Item</th>
                        <th className="py-1 px-2">Qty</th>
                        <th className="py-1 px-2">Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selected.items.map((it) => (
                        <tr key={it.id} className="border-t">
                          <td className="py-1 px-2">{it.name}</td>
                          <td className="py-1 px-2">{it.qty}</td>
                          <td className="py-1 px-2">{currency(it.price)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-2 text-right font-medium">Subtotal: {currency(selected.subtotal)}</div>
              </div>

              {/* Tracking */}
              <div>
                <h4 className="mb-2 font-semibold">Tracking</h4>
                <ul className="space-y-1 text-sm">
                  {selected.tracking.map((t, idx) => (
                    <li key={idx} className="flex items-center justify-between rounded border px-2 py-1">
                      <span>{t.text}</span>
                      <span className="text-muted-foreground">{new Date(t.date).toLocaleString()}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-2 flex gap-2">
                  <Input
                    placeholder="Add tracking update..."
                    value={newTrack}
                    onChange={(e) => setNewTrack(e.target.value)}
                  />
                  <Button
                    onClick={() => {
                      if (!selected) return
                      addTracking(selected, newTrack)
                      setNewTrack("")
                      setSelected(loadOrders().find((o) => o.id === selected.id) || null)
                    }}
                  >
                    Add
                  </Button>
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="justify-between">
            <Button variant="secondary" onClick={() => setSelected(null)}>
              Close
            </Button>
            {selected && selected.status === "pending" && (
              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    if (!selected) return
                    approve(selected)
                    setSelected(loadOrders().find((o) => o.id === selected.id) || null)
                  }}
                >
                  Approve
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    if (!selected) return
                    reject(selected)
                    setSelected(loadOrders().find((o) => o.id === selected.id) || null)
                  }}
                >
                  Reject
                </Button>
              </div>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

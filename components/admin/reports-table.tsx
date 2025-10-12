"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Lightweight fallback types to avoid strict coupling
type OrderItem = {
  name?: string
  quantity?: number
  price?: number
  category?: string
}

type Order = {
  id?: string
  createdAt?: string | number | Date
  status?: string
  items?: OrderItem[]
  total?: number
  phone?: string
  customerName?: string
}

// Utility: compute amount from items if total not present
function computeAmount(order: Order): number {
  if (typeof order.total === "number") return order.total
  const items = order.items || []
  return items.reduce((sum, it) => {
    const qty = typeof it.quantity === "number" ? it.quantity : 1
    const price = typeof it.price === "number" ? it.price : 0
    return sum + qty * price
  }, 0)
}

// Utility: count items
function computeItemsCount(order: Order): number {
  const items = order.items || []
  return items.reduce((sum, it) => sum + (typeof it.quantity === "number" ? it.quantity : 1), 0)
}

function formatDate(input?: string | number | Date): string {
  try {
    const d = input ? new Date(input) : new Date()
    return d.toLocaleDateString()
  } catch {
    return ""
  }
}

function formatCurrency(n: number): string {
  try {
    return new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }).format(n)
  } catch {
    return `${n.toFixed(2)}`
  }
}

export function ReportsTable({ orders }: { orders: Order[] }) {
  const rows = useMemo(() => {
    return (orders || []).map((o) => ({
      id: o.id || "—",
      date: formatDate(o.createdAt),
      items: computeItemsCount(o),
      amount: computeAmount(o),
      status: o.status || "—",
      customer: o.customerName || o.phone || "—",
    }))
  }, [orders])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order #</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Items</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Customer</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    No orders found for this period.
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((r) => (
                  <TableRow key={`${r.id}-${r.date}`}>
                    <TableCell className="font-medium">{r.id}</TableCell>
                    <TableCell>{r.date}</TableCell>
                    <TableCell className="text-right">{r.items}</TableCell>
                    <TableCell className="text-right">{formatCurrency(r.amount)}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs bg-muted">
                        {r.status}
                      </span>
                    </TableCell>
                    <TableCell>{r.customer}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

export default ReportsTable

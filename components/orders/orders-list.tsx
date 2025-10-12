"use client"

import { useEffect, useState } from "react"
import type { Order } from "@/lib/orders"
import { loadOrders } from "@/lib/orders"
import OrderStatusBadge from "./order-status-badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function OrdersList() {
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    setOrders(loadOrders())
  }, [])

  if (!orders.length) {
    return (
      <div className="mx-auto max-w-2xl text-center">
        <Card>
          <CardHeader>
            <CardTitle className="text-balance">No orders yet</CardTitle>
            <CardDescription className="text-pretty">
              Your recent orders and their tracking updates will appear here after checkout.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <a href="/products">
              <Button>Browse products</Button>
            </a>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {orders.map((order) => (
        <Card key={order.id} className="overflow-hidden">
          <CardHeader className="gap-2">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <div>
                <CardTitle className="text-pretty">Order {order.id}</CardTitle>
                <CardDescription>
                  Placed on {new Date(order.createdAt).toLocaleString()} · Tracking {order.trackingNumber}
                </CardDescription>
              </div>
              <OrderStatusBadge status={order.status} />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-3">
              {order.items.map((it) => (
                <div key={it.id} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={it.image || `/placeholder.svg?height=48&width=48&query=medicine-bottle`}
                      alt={it.name}
                      className="size-12 rounded object-cover"
                    />
                    <div>
                      <div className="font-medium">{it.name}</div>
                      <div className="text-sm text-muted-foreground">Qty {it.quantity}</div>
                    </div>
                  </div>
                  <div className="text-sm font-medium">${(it.price * it.quantity).toFixed(2)}</div>
                </div>
              ))}
            </div>

            <div className="flex flex-col items-end gap-1 text-sm">
              <div className="flex gap-6">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex gap-6">
                <span className="text-muted-foreground">Shipping</span>
                <span>${order.shipping.toFixed(2)}</span>
              </div>
              <div className="flex gap-6 font-semibold">
                <span>Total</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-2">
              <div className="mb-2 text-sm font-medium">Tracking</div>
              <ol className="relative ms-4 border-s ps-4">
                {order.events.map((ev, idx) => (
                  <li key={idx} className="mb-4">
                    <div className="absolute -ms-1.5 mt-1.5 size-3 rounded-full bg-primary" />
                    <div className="text-sm font-medium">{ev.status}</div>
                    <div className="text-xs text-muted-foreground">{new Date(ev.at).toLocaleString()}</div>
                    {ev.note ? <div className="text-xs text-muted-foreground">{ev.note}</div> : null}
                  </li>
                ))}
              </ol>
            </div>

            <div className="text-xs text-muted-foreground">
              Shipping to: {order.customer.fullName}, {order.customer.phone}
              {order.customer.addressLine1 ? ` · ${order.customer.addressLine1}` : ""}
              {order.customer.city ? `, ${order.customer.city}` : ""}
              {order.customer.state ? `, ${order.customer.state}` : ""}
              {order.customer.zip ? ` ${order.customer.zip}` : ""}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

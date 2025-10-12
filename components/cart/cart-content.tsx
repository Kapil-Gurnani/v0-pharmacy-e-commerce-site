"use client"

import type React from "react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useCart } from "./cart-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/components/auth/auth-context"
import { addOrder } from "@/lib/orders"
import { useRouter } from "next/navigation"

export function CartContent() {
  const { items, itemCount, subtotal, updateQuantity, removeItem, clearCart } = useCart()
  const { user } = useAuth()
  const router = useRouter()

  const [placing, setPlacing] = useState(false)
  const authed = !!user
  const [form, setForm] = useState({
    name: "",
    phone: user?.phone || "",
    address: "",
  })

  useEffect(() => {
    if (user?.phone) {
      setForm((f) => ({ ...f, phone: user.phone! }))
    }
  }, [user?.phone])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!authed) {
      alert("Please sign in to place an order.")
      return
    }
    if (!form.name || !form.phone || !form.address) {
      alert("Please fill in all fields.")
      return
    }
    setPlacing(true)
    try {
      const shipping = 4.99
      const total = subtotal + shipping
      const orderItems = items.map((it) => ({
        id: it.id,
        name: it.name,
        price: it.price,
        quantity: it.quantity,
        image: (it as any).image, // optional, if available
      }))
      addOrder({
        items: orderItems,
        subtotal,
        shipping,
        total,
        customer: {
          fullName: form.name,
          phone: form.phone,
          addressLine1: form.address,
        },
      })
      clearCart()
      router.push("/orders")
    } finally {
      setPlacing(false)
    }
  }

  if (itemCount === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-pretty text-3xl font-semibold tracking-tight">Your cart</h1>
        <div className="rounded-lg border bg-card p-6">
          <p className="text-muted-foreground">Your cart is empty.</p>
          <Button asChild className="mt-4">
            <Link href="/products">Browse products</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="grid gap-8 md:grid-cols-3">
      <section className="md:col-span-2 space-y-4">
        <h1 className="text-pretty text-3xl font-semibold tracking-tight">Your cart</h1>
        <ul className="space-y-4">
          {items.map((item) => (
            <li key={item.id} className="flex items-start justify-between gap-4 rounded-lg border p-4">
              <div className="space-y-1">
                <Link href={`/products/${item.slug}`} className="font-medium hover:text-primary">
                  {item.name}
                </Link>
                <p className="text-sm text-muted-foreground">${item.price.toFixed(2)} each</p>
                <div className="flex items-center gap-2">
                  <Label htmlFor={`qty-${item.id}`} className="text-xs text-muted-foreground">
                    Qty
                  </Label>
                  <Input
                    id={`qty-${item.id}`}
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item.id, Number(e.target.value || 1))}
                    className="h-8 w-20"
                  />
                  <Button variant="ghost" size="sm" onClick={() => removeItem(item.id)}>
                    Remove
                  </Button>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <aside className="space-y-4">
        <div className="rounded-lg border bg-card p-4">
          <h2 className="text-lg font-semibold">Order summary</h2>
          <div className="mt-2 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Items</span>
            <span>{itemCount}</span>
          </div>
          <div className="mt-1 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-medium">${subtotal.toFixed(2)}</span>
          </div>
          <Separator className="my-3" />

          {!authed && (
            <div className="mb-3 rounded-md border bg-muted/30 p-3 text-sm">
              <p className="text-muted-foreground">
                Please{" "}
                <Link href="/login" className="text-primary underline">
                  sign in with your phone
                </Link>{" "}
                or{" "}
                <Link href="/signup" className="text-primary underline">
                  create an account
                </Link>{" "}
                to continue to checkout.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3" aria-labelledby="checkout-heading">
            <h3 id="checkout-heading" className="text-sm font-medium">
              Checkout details
            </h3>
            <div className="grid gap-2">
              <Label htmlFor="name">Full name</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                required
                disabled={!authed}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                required
                disabled={!authed}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={form.address}
                onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                required
                disabled={!authed}
              />
            </div>
            <Button type="submit" className="w-full" disabled={placing || !authed}>
              {placing ? "Placing..." : "Place order"}
            </Button>
          </form>
        </div>
      </aside>
    </div>
  )
}

export default CartContent

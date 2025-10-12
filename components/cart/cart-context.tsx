"use client"

import type React from "react"

import { createContext, useContext, useEffect, useMemo, useState } from "react"
import type { Product } from "@/lib/products"

type CartItem = {
  id: string
  name: string
  slug: string
  price: number
  quantity: number
}

type CartContextValue = {
  items: CartItem[]
  addItem: (product: Product, quantity?: number) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  itemCount: number
  subtotal: number
}

const CartContext = createContext<CartContextValue | null>(null)
const STORAGE_KEY = "pharmacy_cart_v1"

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  // Load from localStorage once
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setItems(JSON.parse(raw))
    } catch {}
  }, [])

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {}
  }, [items])

  const addItem = (product: Product, quantity = 1) => {
    setItems((prev) => {
      const idx = prev.findIndex((i) => i.id === product.id)
      if (idx >= 0) {
        const next = [...prev]
        next[idx] = { ...next[idx], quantity: next[idx].quantity + quantity }
        return next
      }
      return [...prev, { id: product.id, name: product.name, slug: product.slug, price: product.price, quantity }]
    })
  }

  const removeItem = (id: string) => setItems((prev) => prev.filter((i) => i.id !== id))

  const updateQuantity = (id: string, quantity: number) =>
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, quantity: Math.max(1, Math.floor(quantity || 1)) } : i)))

  const clearCart = () => setItems([])

  const itemCount = useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items])
  const subtotal = useMemo(() => items.reduce((sum, i) => sum + i.price * i.quantity, 0), [items])

  const value = useMemo(
    () => ({ items, addItem, removeItem, updateQuantity, clearCart, itemCount, subtotal }),
    [items, itemCount, subtotal],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used within CartProvider")
  return ctx
}

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { Product } from "@/lib/products"
import { useCart } from "./cart-context"

export function AddToCart({ product, showQuantity = false }: { product: Product; showQuantity?: boolean }) {
  const { addItem } = useCart()
  const [qty, setQty] = useState(1)

  return (
    <div className="flex items-center gap-3">
      {showQuantity && (
        <div className="flex items-center gap-2">
          <label htmlFor="qty" className="text-sm text-muted-foreground">
            Qty
          </label>
          <Input
            id="qty"
            type="number"
            min={1}
            value={qty}
            onChange={(e) => setQty(Math.max(1, Number(e.target.value || 1)))}
            className="w-20"
          />
        </div>
      )}
      <Button onClick={() => addItem(product, qty)}>Add to cart</Button>
    </div>
  )
}

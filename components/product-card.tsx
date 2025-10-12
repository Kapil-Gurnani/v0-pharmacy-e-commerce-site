"use client"

import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Product } from "@/lib/products"
import { useCart } from "@/components/cart/cart-context"

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart()
  return (
    <Card className="h-full overflow-hidden">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="aspect-[4/3] w-full overflow-hidden border-b bg-card">
          <Image
            src={`/.jpg?height=480&width=640&query=${encodeURIComponent(product.name)}`}
            alt={product.name}
            width={640}
            height={480}
            className="h-full w-full object-cover"
          />
        </div>
      </Link>
      <CardHeader className="pb-2">
        <CardTitle className="line-clamp-1 text-base">{product.name}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="line-clamp-2 text-sm text-muted-foreground">{product.description}</p>
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <p className="font-semibold">${product.price.toFixed(2)}</p>
        <div className="flex items-center gap-2">
          <Button asChild size="sm" variant="outline">
            <Link href={`/products/${product.slug}`}>View</Link>
          </Button>
          <Button size="sm" onClick={() => addItem(product, 1)}>
            Add to cart
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

import Image from "next/image"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { getProductBySlug } from "@/lib/products"
import { AddToCart } from "@/components/cart/add-to-cart"

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  const product = getProductBySlug(params.slug)
  if (!product) return notFound()

  return (
    <article className="grid gap-8 md:grid-cols-2">
      <div className="overflow-hidden rounded-lg border bg-card">
        <Image
          src={`/.jpg?height=640&width=800&query=${encodeURIComponent(product.name)}`}
          alt={product.name}
          width={800}
          height={640}
          className="h-auto w-full object-cover"
        />
      </div>

      <div className="space-y-5">
        <h1 className="text-3xl font-semibold">{product.name}</h1>
        <p className="text-muted-foreground">{product.description}</p>
        <p className="text-2xl font-semibold">${product.price.toFixed(2)}</p>

        <div className="flex gap-3">
          <AddToCart product={product} showQuantity />
          <Button variant="outline">Save</Button>
        </div>

        <section className="pt-6 border-t">
          <h2 className="sr-only">Details</h2>
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-muted-foreground">Category</dt>
              <dd className="font-medium">{product.category}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">SKU</dt>
              <dd className="font-mono">{product.id}</dd>
            </div>
          </dl>
        </section>
      </div>
    </article>
  )
}

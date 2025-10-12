import { ProductGrid } from "@/components/product-grid"
import { allProducts } from "@/lib/products"

export default function ProductsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-pretty text-3xl font-semibold tracking-tight">Products</h1>
      <p className="text-muted-foreground">
        Explore over-the-counter medicines, vitamins, first-aid and personal care.
      </p>
      <ProductGrid products={allProducts} />
    </div>
  )
}

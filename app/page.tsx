import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ProductGrid } from "@/components/product-grid"
import { topProducts } from "@/lib/products"

export default function HomePage() {
  return (
    <div className="space-y-12">
      <header className="rounded-xl bg-secondary p-6 md:p-10">
        <div className="grid items-center gap-8 md:grid-cols-2">
          <div className="space-y-4">
            <h1 className="text-pretty text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight">
              Trusted pharmacy essentials, delivered with care.
            </h1>
            <p className="text-muted-foreground">
              Shop OTC medicine, wellness, and everyday healthcare supplies. Clear information, fair pricing, fast
              delivery.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Button asChild>
                <Link href="/products">Browse products</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/about">Learn about us</Link>
              </Button>
            </div>
          </div>

          <div>
            <Image
              priority
              className="w-full h-auto rounded-lg border object-cover"
              src="/pharmacy-products-hero.jpg"
              alt="Assorted pharmacy products neatly arranged"
              width={800}
              height={600}
            />
          </div>
        </div>
      </header>

      <section aria-labelledby="featured-heading" className="space-y-6">
        <div className="flex items-end justify-between">
          <h2 id="featured-heading" className="text-balance text-2xl font-semibold">
            Popular this week
          </h2>
          <Button asChild variant="ghost">
            <Link href="/products" aria-label="See all products">
              See all
            </Link>
          </Button>
        </div>
        <ProductGrid products={topProducts} />
      </section>

      <section aria-labelledby="values-heading" className="rounded-lg border bg-card p-6">
        <h2 id="values-heading" className="text-xl font-semibold">
          Why shop with Vellacure
        </h2>
        <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <li className="rounded-md bg-secondary p-4">
            <p className="font-medium">Quality & authenticity</p>
            <p className="text-muted-foreground text-sm">We source from verified brands and distributors only.</p>
          </li>
          <li className="rounded-md bg-secondary p-4">
            <p className="font-medium">Clear information</p>
            <p className="text-muted-foreground text-sm">Honest ingredients, indications, and usage guidance.</p>
          </li>
          <li className="rounded-md bg-secondary p-4">
            <p className="font-medium">Fast, careful delivery</p>
            <p className="text-muted-foreground text-sm">Orders ship quickly with protective packaging.</p>
          </li>
        </ul>
      </section>
    </div>
  )
}

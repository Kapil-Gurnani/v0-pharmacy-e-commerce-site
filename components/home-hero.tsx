"use client"

import Link from "next/link"

export default function HomeHero() {
  return (
    <section aria-label="Pharmacy hero" className="mx-auto max-w-6xl px-4 py-10 md:py-14" data-hero>
      <div className="grid items-center gap-8 md:grid-cols-2">
        <div className="order-2 md:order-1 space-y-4">
          <h1 className="text-pretty text-3xl font-semibold md:text-4xl">Your trusted online pharmacy</h1>
          <p className="text-muted-foreground leading-relaxed">
            Shop essential medicines, wellness products, and healthcare supplies with fast delivery and professional
            care.
          </p>
          <div className="flex items-center gap-3">
            <Link
              href="/products"
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-primary-foreground transition hover:opacity-90"
            >
              Shop products
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-foreground hover:bg-accent hover:text-accent-foreground"
            >
              About us
            </Link>
          </div>
        </div>

        <div className="order-1 md:order-2">
          {/* Use a standard img to avoid Next/Image fill overlap issues */}
          <img
            src="/pharmacy-shelves-medicines.jpg"
            alt="Organized pharmacy shelves with medicine and wellness products"
            className="w-full h-auto rounded-lg border"
          />
        </div>
      </div>
    </section>
  )
}

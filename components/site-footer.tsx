import Link from "next/link"

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t bg-secondary">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4 sm:px-6 lg:px-8">
        <div>
          <p className="font-semibold">MediCare</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Everyday healthcare, clearly explained and fairly priced.
          </p>
        </div>

        <nav aria-label="Company" className="grid gap-2">
          <p className="font-medium">Company</p>
          <Link className="text-sm hover:text-primary" href="/about">
            About
          </Link>
          <Link className="text-sm hover:text-primary" href="/contact">
            Contact
          </Link>
        </nav>

        <nav aria-label="Shop" className="grid gap-2">
          <p className="font-medium">Shop</p>
          <Link className="text-sm hover:text-primary" href="/products">
            All products
          </Link>
        </nav>

        <div className="text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} MediCare, Inc.</p>
          <p>All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

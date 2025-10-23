import Link from "next/link"
import { Stethoscope } from "lucide-react"

export function SiteHeaderStatic() {
  const storeLinks = [
    { href: "/products", label: "Products" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ] as const

  return (
    <header className="border-b bg-background">
      <nav
        aria-label="Primary"
        className="mx-auto flex max-w-7xl min-w-0 items-center justify-between px-3 sm:px-6 lg:px-8 h-16"
      >
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Stethoscope className="h-5 w-5 text-primary" aria-hidden />
          <span className="text-pretty">Vellacure</span>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden items-center gap-6 md:flex">
          {storeLinks.map((l) => (
            <li key={l.href}>
              <Link className="hover:text-primary" href={l.href}>
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile menu placeholder */}
        <div className="md:hidden">
          <span className="text-sm text-muted-foreground">Menu</span>
        </div>
      </nav>
    </header>
  )
}

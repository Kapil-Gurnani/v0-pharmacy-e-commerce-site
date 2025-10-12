"use client"

import Link from "next/link"
import { ShoppingCart, Stethoscope, Phone, User, Menu } from "lucide-react" // add Menu icon
import { Button } from "@/components/ui/button"
import { useCart } from "@/components/cart/cart-context"
import { useAuth } from "@/components/auth/auth-context"
import { usePathname } from "next/navigation" // add usePathname to make header route-aware for admin pages
import {
  DropdownMenu, // add dropdown menu for mobile
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function SiteHeader() {
  const { itemCount } = useCart()
  const { user, signOut } = useAuth()
  const pathname = usePathname()
  const isAdmin = pathname?.startsWith("/admin")

  const storeBaseLinks = [
    { href: "/products", label: "Products" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ] as const

  const adminLinks = [
    { href: "/admin", label: "Dashboard" },
    { href: "/admin/orders", label: "Orders" },
    { href: "/admin/reports", label: "Reports" },
    { href: "/admin/products", label: "Products" },
    { href: "/admin/discounts", label: "Discounts" },
  ] as const

  const storeLinks = [...storeBaseLinks, ...(user ? [{ href: "/orders", label: "My Orders" } as const] : [])] as const

  const navLinks = isAdmin ? adminLinks : storeLinks

  return (
    <header className="border-b bg-background">
      <nav
        aria-label="Primary"
        className="mx-auto flex max-w-7xl min-w-0 items-center justify-between px-3 sm:px-6 lg:px-8 h-16"
      >
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Stethoscope className="h-5 w-5 text-primary" aria-hidden />
          <span className="text-pretty">MediCare</span>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden items-center gap-6 md:flex">
          {navLinks.map((l) => (
            <li key={l.href}>
              <Link className="hover:text-primary" href={l.href}>
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Open menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {navLinks.map((l) => (
                  <DropdownMenuItem key={l.href} asChild>
                    <Link href={l.href}>{l.label}</Link>
                  </DropdownMenuItem>
                ))}
                {!isAdmin && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/contact">Help</Link>
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                {user ? (
                  <>
                    <DropdownMenuItem disabled>{user.phone}</DropdownMenuItem>
                    <DropdownMenuItem onClick={signOut}>Sign out</DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/login">Sign in</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/signup">Sign up</Link>
                    </DropdownMenuItem>
                  </>
                )}
                {!isAdmin && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/cart">View cart</Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="hidden items-center gap-2 md:flex">
            {!isAdmin && (
              <Button variant="outline" size="sm" asChild>
                <Link href="/contact" aria-label="Contact">
                  <Phone className="mr-2 h-4 w-4" /> Help
                </Link>
              </Button>
            )}

            {user ? (
              <div className="flex items-center gap-2">
                <span className="hidden text-sm text-muted-foreground md:inline">{user.phone}</span>
                <Button variant="ghost" size="sm" onClick={signOut} aria-label="Sign out">
                  <User className="mr-2 h-4 w-4" />
                  Sign out
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/login">Sign in</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/signup">Sign up</Link>
                </Button>
              </div>
            )}
          </div>

          {!isAdmin && (
            <Link href="/cart" aria-label={`Cart with ${itemCount} item${itemCount === 1 ? "" : "s"}`}>
              <div className="relative">
                <Button variant="ghost" size="icon">
                  <ShoppingCart className="h-5 w-5" />
                </Button>
                {itemCount > 0 && (
                  <span
                    aria-hidden
                    className="absolute -right-1 -top-1 rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-medium text-primary-foreground"
                  >
                    {itemCount}
                  </span>
                )}
              </div>
            </Link>
          )}
        </div>
      </nav>
    </header>
  )
}

export default SiteHeader

"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

const tabs = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/reports", label: "Reports" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/discounts", label: "Discounts" }, // added
]

export default function AdminHeader() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <header className="w-full border-b bg-primary text-primary-foreground">
      <div className="mx-auto max-w-7xl px-3 sm:px-4 md:px-6">
        <div className="flex h-14 items-center justify-between">
          <Link href="/admin" className="font-semibold">
            Admin Panel
          </Link>

          {/* Desktop tabs */}
          <nav className="hidden md:flex items-center gap-2">
            {tabs.map((t) => {
              const active = pathname === t.href
              return (
                <Link
                  key={t.href}
                  href={t.href}
                  className={cn(
                    "rounded-md px-3 py-1.5 text-sm transition-colors",
                    active ? "bg-primary-foreground text-primary" : "hover:bg-primary/10",
                  )}
                >
                  {t.label}
                </Link>
              )
            })}
          </nav>

          <div className="flex items-center gap-2">
            {/* Mobile menu */}
            <DropdownMenu open={open} onOpenChange={setOpen}>
              <DropdownMenuTrigger asChild className="md:hidden">
                <Button size="sm" variant="secondary" className="text-primary">
                  Menu
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-40">
                {tabs.map((t) => (
                  <DropdownMenuItem key={t.href} asChild onClick={() => setOpen(false)}>
                    <Link href={t.href} className={cn(pathname === t.href && "font-semibold")}>
                      {t.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}

export { AdminHeader }

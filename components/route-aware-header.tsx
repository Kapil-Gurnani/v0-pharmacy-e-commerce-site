"use client"

import { usePathname } from "next/navigation"
import SiteHeader from "@/components/site-header"

export default function RouteAwareHeader() {
  const pathname = usePathname()
  if (pathname?.startsWith("/admin")) return null
  return <SiteHeader />
}

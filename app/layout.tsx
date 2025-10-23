import type React from "react"
import type { Metadata } from "next"
import type { Viewport } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import SiteHeader from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Suspense } from "react"
import { CartProvider } from "@/components/cart/cart-context"
import { AuthProvider } from "@/components/auth/auth-context"

export const metadata: Metadata = {
  title: "Vellacure",
  description: "Trusted pharmacy essentials, delivered with care",
  generator: "v0.app",
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased overflow-x-hidden`}>
        <Suspense fallback={<div>Loading...</div>}>
          <AuthProvider>
            <CartProvider>
              <SiteHeader />
              <main className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8">{children}</main>
              <SiteFooter />
            </CartProvider>
          </AuthProvider>
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}

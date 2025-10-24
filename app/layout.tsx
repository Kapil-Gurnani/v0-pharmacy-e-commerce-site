import type React from "react"
import type { Metadata } from "next"
import type { Viewport } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"
import { SiteHeaderStatic } from "@/components/site-header-static"
import { SiteFooter } from "@/components/site-footer"
import { AuthProvider } from "@/components/auth/auth-context"
import { CartProvider } from "@/components/cart/cart-context"

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
        <AuthProvider>
          <CartProvider>
            <SiteHeaderStatic />
            <main className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8">{children}</main>
            <SiteFooter />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}

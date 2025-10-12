import type React from "react"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="min-h-[60vh]">
      <div className="mx-auto max-w-7xl px-3 sm:px-4 md:px-6 py-6">
        <main>{children}</main>
      </div>
    </section>
  )
}

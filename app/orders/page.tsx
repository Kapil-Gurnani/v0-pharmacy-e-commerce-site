import { Suspense } from "react"
import OrdersGate from "@/components/orders/orders-gate"

export const metadata = {
  title: "My Orders",
}

export default function OrdersPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 md:px-6">
      <header className="mb-6">
        <h1 className="text-balance text-2xl font-semibold md:text-3xl">My Orders</h1>
        <p className="text-pretty text-muted-foreground">Track the status and delivery of your recent purchases.</p>
      </header>
      <Suspense fallback={<div>Loading...</div>}>
        <OrdersGate />
      </Suspense>
    </main>
  )
}

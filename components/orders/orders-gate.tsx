"use client"

import OrdersList from "@/components/orders/orders-list"
import { useAuth } from "@/components/auth/auth-context"
import PhoneLoginForm from "@/components/auth/phone-login-form"

export default function OrdersGate() {
  const { user } = useAuth()

  if (!user) {
    return (
      <section
        aria-labelledby="orders-auth-title"
        className="mx-auto w-full max-w-md rounded-lg border bg-card p-4 text-card-foreground"
      >
        <h2 id="orders-auth-title" className="mb-2 text-lg font-semibold">
          Please sign in to view your orders
        </h2>
        <p className="mb-4 text-sm text-muted-foreground">
          Sign in with your phone number to see your order history and tracking details.
        </p>
        <PhoneLoginForm />
      </section>
    )
  }

  return <OrdersList />
}

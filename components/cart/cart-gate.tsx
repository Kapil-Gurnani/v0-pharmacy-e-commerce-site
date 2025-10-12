"use client"
import { useAuth } from "@/components/auth/auth-context"
import PhoneLoginForm from "@/components/auth/phone-login-form"
import CartContent from "@/components/cart/cart-content"

export default function CartGate() {
  const { user, loading } = useAuth()
  if (loading) return <div className="py-10 text-center">Loading…</div>
  if (!user) {
    return (
      <div className="max-w-3xl mx-auto py-8">
        <h1 className="text-2xl font-semibold mb-4 text-balance">Sign in to continue</h1>
        <p className="text-sm text-muted-foreground mb-6">
          Please sign in with your phone number to proceed to checkout.
        </p>
        <PhoneLoginForm />
      </div>
    )
  }
  return <CartContent />
}

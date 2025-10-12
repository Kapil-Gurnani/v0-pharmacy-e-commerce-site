"use client"

import type React from "react"
import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "./auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { isAdmin } from "@/lib/admin"

export default function PhoneLoginForm() {
  const { requestSignin, confirmSignin } = useAuth()
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [otp, setOtp] = useState("")
  const [sentOtp, setSentOtp] = useState<string | null>(null)
  const [step, setStep] = useState<"form" | "otp">("form")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const search = useSearchParams()
  const redirect = search.get("redirect") || "/cart"

  const onSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!phone.trim() || !password) {
      setError("Phone and password are required")
      return
    }
    try {
      setLoading(true)
      const res = await requestSignin({ phone: phone.trim(), password })
      setSentOtp(res.otp) // Demo only: display code to user
      setStep("otp")
    } catch (err: any) {
      setError(err?.message || "Unable to sign in")
    } finally {
      setLoading(false)
    }
  }

  const onSubmitOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!otp.trim()) return setError("OTP is required")
    try {
      setLoading(true)
      await confirmSignin({ phone: phone.trim(), otp: otp.trim() })
      // Admin redirect
      if (isAdmin({ phone: phone.trim() })) {
        router.push("/admin")
      } else {
        router.push(redirect)
      }
    } catch (err: any) {
      setError(err?.message || "Invalid OTP")
    } finally {
      setLoading(false)
    }
  }

  if (step === "otp") {
    return (
      <form onSubmit={onSubmitOtp} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="otp">Enter OTP</Label>
          <Input
            id="otp"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="6-digit code"
            required
            aria-describedby={sentOtp ? "login-otp-help" : undefined}
          />
          {sentOtp && (
            <p id="login-otp-help" className="text-xs text-muted-foreground">
              Demo OTP: {sentOtp}
            </p>
          )}
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Verifying…" : "Verify and sign in"}
        </Button>
      </form>
    )
  }

  return (
    <form onSubmit={onSubmitForm} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          type="tel"
          inputMode="tel"
          placeholder="+1 555 123 4567"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Sending OTP…" : "Sign in"}
      </Button>
    </form>
  )
}

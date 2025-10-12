"use client"

import type React from "react"
import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "./auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function PhoneSignupForm() {
  const { requestSignup, confirmSignup } = useAuth()
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [otp, setOtp] = useState("")
  const [sentOtp, setSentOtp] = useState<string | null>(null)
  const [step, setStep] = useState<"form" | "otp">("form")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const search = useSearchParams()
  const redirect = search.get("redirect") || "/"

  const onSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!name.trim() || !phone.trim() || !password) {
      setError("Full name, phone, and password are required")
      return
    }
    try {
      setLoading(true)
      const res = await requestSignup({ name: name.trim(), phone: phone.trim(), password })
      setSentOtp(res.otp) // Demo only: display code to user
      setStep("otp")
    } catch (err: any) {
      setError(err?.message || "Unable to start signup")
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
      await confirmSignup({ phone: phone.trim(), otp: otp.trim() })
      router.push(redirect)
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
            aria-describedby={sentOtp ? "otp-help" : undefined}
          />
          {sentOtp && (
            <p id="otp-help" className="text-xs text-muted-foreground">
              Demo OTP: {sentOtp}
            </p>
          )}
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Verifying…" : "Verify and create account"}
        </Button>
      </form>
    )
  }

  return (
    <form onSubmit={onSubmitForm} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Full name</Label>
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
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
        {loading ? "Sending OTP…" : "Sign up"}
      </Button>
    </form>
  )
}

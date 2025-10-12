"use client"

import type React from "react"

import { useState } from "react"
import { getBrowserSupabase } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function SignupForm() {
  const supabase = getBrowserSupabase()
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, phone },
        emailRedirectTo:
          (process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL as string) ||
          (typeof window !== "undefined" ? window.location.origin : undefined),
      },
    })
    if (error) setError(error.message)
    else setMessage("Check your email to confirm your account.")
    setLoading(false)
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div className="grid gap-2">
        <Label htmlFor="fullName">Full name</Label>
        <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="phone">Phone</Label>
        <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      {message && <p className="text-sm text-muted-foreground">{message}</p>}
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Creating account..." : "Create account"}
      </Button>
    </form>
  )
}

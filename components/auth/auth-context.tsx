"use client"

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react"

type User = { phone: string; name: string }

type AuthContextValue = {
  user: User | null
  requestSignup: (args: { name: string; phone: string; password: string }) => Promise<{ otp: string }>
  confirmSignup: (args: { phone: string; otp: string }) => Promise<void>
  requestSignin: (args: { phone: string; password: string }) => Promise<{ otp: string }>
  confirmSignin: (args: { phone: string; otp: string }) => Promise<void>
  signOut: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

const SESSION_KEY = "pharmacy_user"
const ACCOUNTS_KEY = "pharmacy_accounts" // Record<phone, { name, password }>
const PENDING_SIGNUP_KEY = "pharmacy_pending_signup" // Record<phone, { name, password }>
const OTP_KEY = "pharmacy_otps" // Record<phone, { code, expires }>

function normalizePhone(input: string) {
  return input.replace(/[^\d+]/g, "")
}

function readMap<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function writeMap<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value))
}

function generateOtp() {
  return String(Math.floor(100000 + Math.random() * 900000))
}

function setOtp(phone: string, code: string, ttlMs = 5 * 60 * 1000) {
  const otps = readMap<Record<string, { code: string; expires: number }>>(OTP_KEY, {})
  otps[phone] = { code, expires: Date.now() + ttlMs }
  writeMap(OTP_KEY, otps)
}

function verifyOtp(phone: string, code: string) {
  const otps = readMap<Record<string, { code: string; expires: number }>>(OTP_KEY, {})
  const entry = otps[phone]
  if (!entry) return false
  const valid = entry.code === code && Date.now() < entry.expires
  if (valid) {
    delete otps[phone]
    writeMap(OTP_KEY, otps)
  }
  return valid
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(SESSION_KEY)
      if (raw) setUser(JSON.parse(raw) as User)
    } catch {
      // ignore
    }
  }, [])

  const requestSignup: AuthContextValue["requestSignup"] = async ({ name, phone, password }) => {
    const normalized = normalizePhone(phone)
    const accounts = readMap<Record<string, { name: string; password: string }>>(ACCOUNTS_KEY, {})
    if (accounts[normalized]) {
      throw new Error("Account already exists")
    }
    const pending = readMap<Record<string, { name: string; password: string }>>(PENDING_SIGNUP_KEY, {})
    pending[normalized] = { name: name.trim(), password }
    writeMap(PENDING_SIGNUP_KEY, pending)

    const otp = generateOtp()
    setOtp(normalized, otp)
    return { otp }
  }

  const confirmSignup: AuthContextValue["confirmSignup"] = async ({ phone, otp }) => {
    const normalized = normalizePhone(phone)
    if (!verifyOtp(normalized, otp)) throw new Error("Invalid or expired OTP")

    const pending = readMap<Record<string, { name: string; password: string }>>(PENDING_SIGNUP_KEY, {})
    const record = pending[normalized]
    if (!record) throw new Error("No pending signup found")

    const accounts = readMap<Record<string, { name: string; password: string }>>(ACCOUNTS_KEY, {})
    accounts[normalized] = { name: record.name, password: record.password }
    writeMap(ACCOUNTS_KEY, accounts)
    delete pending[normalized]
    writeMap(PENDING_SIGNUP_KEY, pending)

    const newUser: User = { phone: normalized, name: record.name }
    writeMap(SESSION_KEY, newUser)
    setUser(newUser)
  }

  const requestSignin: AuthContextValue["requestSignin"] = async ({ phone, password }) => {
    const normalized = normalizePhone(phone)
    const accounts = readMap<Record<string, { name: string; password: string }>>(ACCOUNTS_KEY, {})
    const record = accounts[normalized]
    if (!record || record.password !== password) {
      throw new Error("Invalid phone or password")
    }
    const otp = generateOtp()
    setOtp(normalized, otp)
    return { otp }
  }

  const confirmSignin: AuthContextValue["confirmSignin"] = async ({ phone, otp }) => {
    const normalized = normalizePhone(phone)
    if (!verifyOtp(normalized, otp)) throw new Error("Invalid or expired OTP")
    const accounts = readMap<Record<string, { name: string; password: string }>>(ACCOUNTS_KEY, {})
    const record = accounts[normalized]
    if (!record) throw new Error("Account not found")
    const existingUser: User = { phone: normalized, name: record.name }
    writeMap(SESSION_KEY, existingUser)
    setUser(existingUser)
  }

  const signOut = () => {
    localStorage.removeItem(SESSION_KEY)
    setUser(null)
  }

  const value = useMemo<AuthContextValue>(
    () => ({ user, requestSignup, confirmSignup, requestSignin, confirmSignin, signOut }),
    [user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider")
  return ctx
}

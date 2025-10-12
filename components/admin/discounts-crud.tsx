"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type CouponStatus = "active" | "inactive" | "expired"
type DiscountType = "percent" | "fixed"

type Coupon = {
  id: string
  code: string
  description?: string
  type: DiscountType
  value: number
  status: CouponStatus
  expiresAt?: string // ISO date
  createdAt: string
  updatedAt: string
}

const STORAGE_KEY = "pharmacy_discounts"

function loadCoupons(): Coupon[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Coupon[]) : []
  } catch {
    return []
  }
}
function saveCoupons(c: Coupon[]) {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(c))
}
function uuid() {
  return crypto?.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2)
}

export default function DiscountsCrud() {
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [selectedId, setSelectedId] = useState<string>("new")

  const selected = useMemo(() => coupons.find((c) => c.id === selectedId), [coupons, selectedId])

  const [code, setCode] = useState("")
  const [description, setDescription] = useState("")
  const [type, setType] = useState<DiscountType>("percent")
  const [value, setValue] = useState<number>(10)
  const [status, setStatus] = useState<CouponStatus>("active")
  const [expiresAt, setExpiresAt] = useState<string>("")

  useEffect(() => {
    setCoupons(loadCoupons())
  }, [])

  useEffect(() => {
    if (selected) {
      setCode(selected.code)
      setDescription(selected.description || "")
      setType(selected.type)
      setValue(selected.value)
      setStatus(selected.status)
      setExpiresAt(selected.expiresAt ? selected.expiresAt.slice(0, 10) : "")
    } else {
      setCode("")
      setDescription("")
      setType("percent")
      setValue(10)
      setStatus("active")
      setExpiresAt("")
    }
  }, [selected])

  function upsert() {
    if (!code.trim()) return
    const now = new Date().toISOString()
    let next = [...coupons]
    if (selected) {
      next = next.map((c) =>
        c.id === selected.id
          ? {
              ...c,
              code: code.trim(),
              description: description.trim() || undefined,
              type,
              value: Number(value),
              status,
              expiresAt: expiresAt ? new Date(expiresAt).toISOString() : undefined,
              updatedAt: now,
            }
          : c,
      )
    } else {
      const newCoupon: Coupon = {
        id: uuid(),
        code: code.trim().toUpperCase(),
        description: description.trim() || undefined,
        type,
        value: Number(value),
        status,
        expiresAt: expiresAt ? new Date(expiresAt).toISOString() : undefined,
        createdAt: now,
        updatedAt: now,
      }
      next.unshift(newCoupon)
      setSelectedId(newCoupon.id)
    }
    setCoupons(next)
    saveCoupons(next)
  }

  function remove() {
    if (!selected) return
    const next = coupons.filter((c) => c.id !== selected.id)
    setCoupons(next)
    saveCoupons(next)
    setSelectedId("new")
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Manage Discount Coupons</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="coupon-select">Edit existing</Label>
            <Select value={selectedId} onValueChange={setSelectedId}>
              <SelectTrigger id="coupon-select">
                <SelectValue placeholder="Select a coupon" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">+ New coupon</SelectItem>
                {coupons.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.code}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="code">Code</Label>
            <Input
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="SAVE10"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Select value={type} onValueChange={(v: DiscountType) => setType(v)}>
              <SelectTrigger id="type">
                <SelectValue placeholder="Discount type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="percent">Percent (%)</SelectItem>
                <SelectItem value="fixed">Fixed amount</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="value">{type === "percent" ? "Percent off" : "Amount off"}</Label>
            <Input
              id="value"
              type="number"
              min={type === "percent" ? 1 : 0.5}
              max={type === "percent" ? 90 : undefined}
              step={type === "percent" ? 1 : 0.5}
              value={value}
              onChange={(e) => setValue(Number(e.target.value))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={(v: CouponStatus) => setStatus(v)}>
              <SelectTrigger id="status">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short description"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="expiresAt">Validity (expires on)</Label>
            <Input id="expiresAt" type="date" value={expiresAt} onChange={(e) => setExpiresAt(e.target.value)} />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-2">
          <Button onClick={upsert}>{selected ? "Update coupon" : "Create coupon"}</Button>
          {selected && (
            <Button variant="destructive" onClick={remove}>
              Delete
            </Button>
          )}
          <Button variant="outline" onClick={() => setSelectedId("new")}>
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

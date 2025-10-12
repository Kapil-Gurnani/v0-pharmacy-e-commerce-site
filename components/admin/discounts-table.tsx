"use client"

import { useEffect, useMemo, useState } from "react"
import { getCoupons, upsertCoupon, deleteCoupon, type Coupon } from "@/lib/discounts"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

function formatDate(ts: number) {
  const d = new Date(ts)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
}

function StatusBadge({ status }: { status: Coupon["status"] }) {
  const map = {
    active: "bg-green-500/15 text-green-600",
    expired: "bg-red-500/15 text-red-600",
    scheduled: "bg-amber-500/15 text-amber-600",
  }
  return (
    <span className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium ${map[status]}`}>{status}</span>
  )
}

export default function DiscountsTable() {
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [q, setQ] = useState("")
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Coupon | null>(null)

  useEffect(() => {
    setCoupons(getCoupons())
  }, [])

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase()
    if (!term) return coupons
    return coupons.filter(
      (c) =>
        c.code.toLowerCase().includes(term) ||
        c.description.toLowerCase().includes(term) ||
        c.status.toLowerCase().includes(term),
    )
  }, [q, coupons])

  function onDelete(id: string) {
    const list = deleteCoupon(id)
    setCoupons(list)
  }

  function onSave(form: FormData) {
    const id = (form.get("id") as string) || `C-${Date.now()}`
    const code = String(form.get("code") || "").toUpperCase()
    const description = String(form.get("description") || "")
    const discountType = (form.get("discountType") as "percentage" | "flat") || "percentage"
    const value = Number(form.get("value") || 0)
    const status = (form.get("status") as Coupon["status"]) || "active"
    const validFrom = new Date(String(form.get("validFrom") || Date.now())).getTime()
    const validTo = new Date(String(form.get("validTo") || Date.now())).getTime()

    const updated: Coupon = { id, code, description, discountType, value, status, validFrom, validTo }
    const list = upsertCoupon(updated)
    setCoupons(list)
    setOpen(false)
    setEditing(null)
  }

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search coupons…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="w-64 max-w-full"
          />
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditing(null)
              }}
            >
              Add coupon
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>{editing ? "Edit coupon" : "Add coupon"}</DialogTitle>
            </DialogHeader>
            <form
              action={(formData) => {
                onSave(formData)
              }}
              className="space-y-4"
            >
              <input type="hidden" name="id" defaultValue={editing?.id || ""} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="code">Code</Label>
                  <Input id="code" name="code" required defaultValue={editing?.code || ""} />
                </div>
                <div>
                  <Label htmlFor="discountType">Type</Label>
                  <Select name="discountType" defaultValue={editing?.discountType || "percentage"}>
                    <SelectTrigger id="discountType">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage</SelectItem>
                      <SelectItem value="flat">Flat</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="value">Value</Label>
                  <Input
                    id="value"
                    name="value"
                    type="number"
                    min={0}
                    step="1"
                    required
                    defaultValue={editing?.value ?? 0}
                  />
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select name="status" defaultValue={editing?.status || "active"}>
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                      <SelectItem value="expired">Expired</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="validFrom">Valid from</Label>
                  <Input
                    id="validFrom"
                    name="validFrom"
                    type="date"
                    required
                    defaultValue={editing ? formatDate(editing.validFrom) : undefined}
                  />
                </div>
                <div>
                  <Label htmlFor="validTo">Valid to</Label>
                  <Input
                    id="validTo"
                    name="validTo"
                    type="date"
                    required
                    defaultValue={editing ? formatDate(editing.validTo) : undefined}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Input id="description" name="description" required defaultValue={editing?.description || ""} />
              </div>
              <DialogFooter>
                <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Save</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <table className="min-w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-3 py-2 text-left font-medium">Code</th>
              <th className="px-3 py-2 text-left font-medium">Description</th>
              <th className="px-3 py-2 text-left font-medium">Type</th>
              <th className="px-3 py-2 text-right font-medium">Value</th>
              <th className="px-3 py-2 text-center font-medium">Status</th>
              <th className="px-3 py-2 text-center font-medium whitespace-nowrap">Valid (From → To)</th>
              <th className="px-3 py-2 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id} className="border-t">
                <td className="px-3 py-2 font-mono">{c.code}</td>
                <td className="px-3 py-2">{c.description}</td>
                <td className="px-3 py-2 capitalize">{c.discountType}</td>
                <td className="px-3 py-2 text-right">
                  {c.discountType === "percentage" ? `${c.value}%` : `₹${c.value}`}
                </td>
                <td className="px-3 py-2 text-center">
                  <StatusBadge status={c.status} />
                </td>
                <td className="px-3 py-2 text-center">
                  {formatDate(c.validFrom)} → {formatDate(c.validTo)}
                </td>
                <td className="px-3 py-2 text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditing(c)
                        setOpen(true)
                      }}
                    >
                      Edit
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => onDelete(c.id)}>
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-3 py-8 text-center text-muted-foreground">
                  No coupons found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}

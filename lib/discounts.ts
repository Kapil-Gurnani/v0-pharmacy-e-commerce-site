export type CouponStatus = "active" | "expired" | "scheduled"
export type Coupon = {
  id: string
  code: string
  description: string
  discountType: "percentage" | "flat"
  value: number
  validFrom: number
  validTo: number
  status: CouponStatus
}

export function getStaticCoupons(): Coupon[] {
  const now = Date.now()
  const day = 86400000
  return [
    {
      id: "C1",
      code: "WELCOME10",
      description: "10% off for first-time customers",
      discountType: "percentage",
      value: 10,
      validFrom: now - 7 * day,
      validTo: now + 30 * day,
      status: "active",
    },
    {
      id: "C2",
      code: "FLAT50",
      description: "Flat ₹50 off on orders above ₹499",
      discountType: "flat",
      value: 50,
      validFrom: now - 40 * day,
      validTo: now - 5 * day,
      status: "expired",
    },
    {
      id: "C3",
      code: "HEALTH20",
      description: "20% off on Wellness category",
      discountType: "percentage",
      value: 20,
      validFrom: now + 3 * day,
      validTo: now + 45 * day,
      status: "scheduled",
    },
  ]
}

const LS_KEY = "pharmacy_admin_coupons_v1"

function isBrowser() {
  return typeof window !== "undefined" && typeof localStorage !== "undefined"
}

export function getCoupons(): Coupon[] {
  if (!isBrowser()) return getStaticCoupons()
  try {
    const raw = localStorage.getItem(LS_KEY)
    if (raw) return JSON.parse(raw) as Coupon[]
    const seed = getStaticCoupons()
    localStorage.setItem(LS_KEY, JSON.stringify(seed))
    return seed
  } catch {
    return getStaticCoupons()
  }
}

export function saveCoupons(coupons: Coupon[]) {
  if (!isBrowser()) return
  localStorage.setItem(LS_KEY, JSON.stringify(coupons))
}

export function upsertCoupon(coupon: Coupon) {
  const list = getCoupons()
  const idx = list.findIndex((c) => c.id === coupon.id)
  if (idx >= 0) {
    list[idx] = coupon
  } else {
    list.push(coupon)
  }
  saveCoupons(list)
  return list
}

export function deleteCoupon(id: string) {
  const list = getCoupons().filter((c) => c.id !== id)
  saveCoupons(list)
  return list
}

"use client"

import { cn } from "@/lib/utils"

export default function OrderStatusBadge({
  status,
  className,
}: { status: "Processing" | "Packed" | "Shipped" | "Out for Delivery" | "Delivered"; className?: string }) {
  const color =
    {
      Processing: "bg-blue-100 text-blue-800",
      Packed: "bg-cyan-100 text-cyan-800",
      Shipped: "bg-amber-100 text-amber-800",
      "Out for Delivery": "bg-purple-100 text-purple-800",
      Delivered: "bg-emerald-100 text-emerald-800",
    }[status] || "bg-gray-100 text-gray-800"

  return (
    <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium", color, className)}>
      {status}
    </span>
  )
}

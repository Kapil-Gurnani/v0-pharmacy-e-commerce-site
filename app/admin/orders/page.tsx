"use client"

import { AdminGate } from "@/components/auth/admin-gate"
import OrdersTable from "@/components/admin/orders-table"

export default function AdminOrdersPage() {
  return (
    <AdminGate>
      <OrdersTable />
    </AdminGate>
  )
}

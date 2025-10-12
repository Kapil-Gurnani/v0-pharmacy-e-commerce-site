import DiscountsTable from "@/components/admin/discounts-table"
import DiscountsCrud from "@/components/admin/discounts-crud"

export const metadata = {
  title: "Admin • Discounts",
}

export default function AdminDiscountsPage() {
  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Discounts</h1>
        <p className="text-sm text-muted-foreground">View coupons and their status/validity.</p>
      </div>
      <DiscountsCrud />
      <DiscountsTable />
    </section>
  )
}

"use client"

import { Pie, PieChart, Cell, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
]

export function CategoryPieChart({ data }: { data: { name: string; qty: number }[] }) {
  const total = data.reduce((acc, d) => acc + d.qty, 0)
  return (
    <Card>
      <CardHeader>
        <CardTitle>Category Mix</CardTitle>
      </CardHeader>
      <CardContent className="h-[280px] md:h-[320px]">
        <div className="h-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} dataKey="qty" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <p className="text-sm text-muted-foreground mt-3">Total units: {total}</p>
        </div>
      </CardContent>
    </Card>
  )
}

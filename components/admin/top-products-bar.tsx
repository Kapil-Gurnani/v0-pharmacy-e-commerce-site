"use client"

import { ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Cell } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

type Datum = { name: string; value: number }

export function TopProductsBar({ data }: { data: Datum[] }) {
  const palette = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"]
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Top Products by Revenue</CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        <ChartContainer
          className="h-[320px]"
          config={{
            value: { label: "Revenue", color: "hsl(var(--chart-3))" },
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 8, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} interval={0} angle={-20} textAnchor="end" height={50} />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {data.map((_, i) => (
                  <Cell key={`cell-${i}`} fill={palette[i % palette.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export default TopProductsBar

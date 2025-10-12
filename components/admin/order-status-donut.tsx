"use client"

import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

type Datum = { name: string; value: number }

export function OrderStatusDonut({ data }: { data: Datum[] }) {
  const palette = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"]
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Orders by Status</CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        <ChartContainer
          className="h-[320px]"
          config={{
            value: { label: "Count", color: "hsl(var(--chart-2))" },
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={4}
                stroke="hsl(var(--background))"
                strokeWidth={2}
              >
                {data.map((_, i) => (
                  <Cell key={i} fill={palette[i % palette.length]} />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export default OrderStatusDonut

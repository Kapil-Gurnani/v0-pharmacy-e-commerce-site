"use client"

import { Bar, BarChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

export function OrdersByDayBar({ data }: { data: { date: string; orders: number }[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Orders by Day</CardTitle>
      </CardHeader>
      <CardContent className="h-[280px] md:h-[320px]">
        <ChartContainer
          config={{
            orders: { label: "Orders", color: "hsl(var(--chart-2))" },
          }}
          className="h-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="orders" fill="var(--color-orders)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

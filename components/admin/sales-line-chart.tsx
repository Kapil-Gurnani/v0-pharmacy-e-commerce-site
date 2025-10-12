"use client"

import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

export function SalesLineChart({ data }: { data: { date: string; revenue: number }[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue Over Time</CardTitle>
      </CardHeader>
      <CardContent className="h-[280px] md:h-[320px]">
        <ChartContainer
          config={{
            revenue: { label: "Revenue", color: "hsl(var(--chart-1))" },
          }}
          className="h-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line type="monotone" dataKey="revenue" stroke="var(--color-revenue)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

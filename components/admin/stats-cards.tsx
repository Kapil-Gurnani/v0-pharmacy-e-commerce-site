"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function StatsCards({ kpis }: { kpis: { label: string; value: string; sublabel?: string }[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {kpis.map((kpi) => (
        <Card key={kpi.label}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">{kpi.label}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{kpi.value}</p>
            {kpi.sublabel ? <p className="text-xs text-muted-foreground mt-1">{kpi.sublabel}</p> : null}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

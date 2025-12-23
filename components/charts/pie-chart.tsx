"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { formatCurrency } from "@/lib/utils"

const COLORS = ["#22c55e", "#f97316", "#eab308", "#3b82f6", "#8b5cf6"]

interface TypePieChartProps {
  data: { type: string; total: number }[]
}

const typeLabels: Record<string, string> = {
  DIME: "Dime",
  DETTE_DIME: "Dette Dime",
  DETTE_COTISATION: "Dette Cotisation",
  OFFRANDE_CONSTRUCTION: "Offrande Construction",
}

export function TypePieChart({ data }: TypePieChartProps) {
  const chartData = data.map((d) => ({
    name: typeLabels[d.type] || d.type,
    value: d.total,
  }))

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={2}
          dataKey="value"
        >
          {chartData.map((_, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip 
          formatter={(value) => formatCurrency(Number(value))}
          contentStyle={{
            backgroundColor: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "8px",
          }}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}

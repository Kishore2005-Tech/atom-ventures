"use client"

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import type { Startup, InvestorInterest } from "@/lib/types"

const PALETTE = ["var(--color-chart-1)", "var(--color-chart-2)", "var(--color-chart-3)", "var(--color-chart-4)", "var(--color-chart-5)"]

export function AnalyticsCharts({
  startups,
  interests,
}: {
  startups: Startup[]
  interests: InvestorInterest[]
}) {
  const statusData = [
    { name: "Approved", value: startups.filter((s) => s.status === "approved").length },
    { name: "Pending", value: startups.filter((s) => s.status === "pending").length },
    { name: "Rejected", value: startups.filter((s) => s.status === "rejected").length },
  ]

  const buckets = [
    { name: "0-20", value: 0 },
    { name: "21-40", value: 0 },
    { name: "41-60", value: 0 },
    { name: "61-80", value: 0 },
    { name: "81-100", value: 0 },
  ]
  startups.forEach((s) => {
    if (s.ai_score == null) return
    const i = Math.min(Math.floor(s.ai_score / 20), 4)
    buckets[i].value += 1
  })

  // investor activity by day (last 14)
  const days: { name: string; value: number }[] = []
  for (let d = 13; d >= 0; d--) {
    const day = new Date()
    day.setDate(day.getDate() - d)
    const key = day.toISOString().slice(0, 10)
    const label = day.toLocaleDateString(undefined, { month: "short", day: "numeric" })
    const count = interests.filter((i) => i.created_at.startsWith(key)).length
    days.push({ name: label, value: count })
  }

  return (
    <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
      <Panel title="Approval status">
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie data={statusData} dataKey="value" nameKey="name" outerRadius={90}>
              {statusData.map((_, i) => (
                <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </Panel>

      <Panel title="AI score distribution">
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={buckets}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="value" fill="var(--color-chart-1)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Panel>

      <Panel title="Investor activity (last 14 days)" className="lg:col-span-2">
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={days}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="value" fill="var(--color-chart-2)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Panel>
    </div>
  )
}

function Panel({
  title,
  children,
  className = "",
}: {
  title: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={`rounded-xl border border-border bg-card p-5 ${className}`}>
      <h3 className="mb-3 text-sm font-semibold">{title}</h3>
      {children}
    </div>
  )
}

import { requireProfile } from "@/lib/auth"
import { AnalyticsCharts } from "@/components/analytics-charts"
import type { Startup, InvestorInterest } from "@/lib/types"

export default async function AnalyticsPage() {
  const { supabase } = await requireProfile(["admin"])
  const { data: startups = [] } = await supabase.from("startups").select("*").returns<Startup[]>()
  const { data: interests = [] } = await supabase.from("investor_interests").select("*").returns<InvestorInterest[]>()

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <h1 className="text-2xl font-semibold tracking-tight">Analytics</h1>
      <p className="mt-1 text-sm text-muted-foreground">Platform-wide performance.</p>
      <AnalyticsCharts startups={startups ?? []} interests={interests ?? []} />
    </div>
  )
}

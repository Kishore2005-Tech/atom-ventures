import { requireProfile } from "@/lib/auth"
import { AlertTriangle } from "lucide-react"
import type { Startup } from "@/lib/types"

export default async function FraudDetectionPage() {
  const { supabase } = await requireProfile(["admin"])

  const { data: startups = [] } = await supabase
    .from("startups")
    .select("*")
    .order("spam_probability", { ascending: false, nullsFirst: false })
    .returns<Startup[]>()

  // Heuristic: flag high spam, low score, or duplicate names
  const nameCounts = new Map<string, number>()
  ;(startups ?? []).forEach((s) => nameCounts.set(s.name.toLowerCase(), (nameCounts.get(s.name.toLowerCase()) ?? 0) + 1))

  const flagged = (startups ?? []).filter((s) => {
    const spam = (s.spam_probability ?? 0) >= 50
    const lowQuality = s.ai_score != null && s.ai_score < 40
    const duplicate = (nameCounts.get(s.name.toLowerCase()) ?? 0) > 1
    return spam || lowQuality || duplicate
  })

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <div className="mb-6 flex items-center gap-2">
        <AlertTriangle className="h-5 w-5 text-amber-500" />
        <h1 className="text-2xl font-semibold tracking-tight">Fraud detection</h1>
      </div>
      <p className="text-sm text-muted-foreground">
        Auto-flagged startups based on spam probability, low quality scores, and duplicate names.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2">
        {flagged.length === 0 ? (
          <div className="md:col-span-2 rounded-xl border border-border bg-card p-10 text-center">
            <p className="text-sm text-muted-foreground">No flagged startups.</p>
          </div>
        ) : (
          flagged.map((s) => {
            const dup = (nameCounts.get(s.name.toLowerCase()) ?? 0) > 1
            const spam = (s.spam_probability ?? 0) >= 50
            const lowq = s.ai_score != null && s.ai_score < 40
            return (
              <div key={s.id} className="rounded-xl border border-border bg-card p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium">{s.name}</p>
                    <p className="text-xs text-muted-foreground">{s.industry}</p>
                  </div>
                  <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-700 dark:text-amber-400">
                    Flagged
                  </span>
                </div>
                <ul className="mt-3 flex flex-wrap gap-2 text-xs">
                  {spam && (
                    <li className="rounded-full bg-secondary px-2 py-0.5">Spam {s.spam_probability}%</li>
                  )}
                  {lowq && <li className="rounded-full bg-secondary px-2 py-0.5">Low quality ({s.ai_score})</li>}
                  {dup && <li className="rounded-full bg-secondary px-2 py-0.5">Possible duplicate</li>}
                </ul>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

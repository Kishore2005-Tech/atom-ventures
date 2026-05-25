import { Progress } from "@/components/ui/progress"
import { ScoreBadge, RiskBadge } from "@/components/badges"
import type { Startup } from "@/lib/types"
import { BrainCircuit } from "lucide-react"

export function AiAnalysisCard({ startup }: { startup: Startup }) {
  const hasAnalysis = startup.ai_score != null
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BrainCircuit className="h-4 w-4" />
          <h2 className="text-sm font-semibold">AI Intelligence Engine</h2>
        </div>
        {hasAnalysis ? (
          <div className="flex items-center gap-2">
            <ScoreBadge score={startup.ai_score} />
            <RiskBadge risk={startup.risk_level} />
          </div>
        ) : (
          <span className="text-xs text-muted-foreground">Pending analysis</span>
        )}
      </div>

      {hasAnalysis ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <Metric label="Overall AI score" value={startup.ai_score!} />
            <Metric label="Market demand" value={startup.market_demand_score ?? 0} />
            <Metric label="Spam probability" value={startup.spam_probability ?? 0} invert />
          </div>
          <div className="flex flex-col gap-4">
            <Section title="Recommendations for investors">
              <p className="text-sm text-muted-foreground">{startup.ai_recommendations ?? "—"}</p>
            </Section>
            <Section title="Improvements for founder">
              <p className="text-sm text-muted-foreground">{startup.ai_improvements ?? "—"}</p>
            </Section>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3 rounded-lg border border-dashed border-border bg-secondary/30 p-6">
          <div className="h-2 w-2 animate-pulse rounded-full bg-foreground" />
          <p className="text-sm text-muted-foreground">
            Analysis will appear here once the AI engine finishes processing your submission.
          </p>
        </div>
      )}
    </div>
  )
}

function Metric({ label, value, invert }: { label: string; value: number; invert?: boolean }) {
  return (
    <div className="mb-4 last:mb-0">
      <div className="mb-1.5 flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-mono font-medium">{value}{invert ? "%" : "/100"}</span>
      </div>
      <Progress value={value} />
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">{title}</p>
      {children}
    </div>
  )
}

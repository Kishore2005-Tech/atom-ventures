import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export function ScoreBadge({ score }: { score: number | null | undefined }) {
  if (score == null) return <Badge variant="secondary">Pending</Badge>
  const tone =
    score >= 80
      ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20"
      : score >= 60
        ? "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20"
        : "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20"
  return (
    <span className={cn("inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium", tone)}>
      AI {score}
    </span>
  )
}

export function RiskBadge({ risk }: { risk: string | null | undefined }) {
  if (!risk) return <Badge variant="secondary">—</Badge>
  const tone =
    risk === "low"
      ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20"
      : risk === "medium"
        ? "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20"
        : "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20"
  return (
    <span
      className={cn("inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium capitalize", tone)}
    >
      {risk} risk
    </span>
  )
}

export function StatusBadge({ status }: { status: string }) {
  const tone =
    status === "approved"
      ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20"
      : status === "rejected"
        ? "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20"
        : "bg-secondary text-secondary-foreground border-border"
  return (
    <span
      className={cn("inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium capitalize", tone)}
    >
      {status}
    </span>
  )
}

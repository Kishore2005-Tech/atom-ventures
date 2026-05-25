"use client"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { ScoreBadge, RiskBadge } from "@/components/badges"
import { Heart, Bookmark, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Startup } from "@/lib/types"
import { toast } from "sonner"

export function StartupCard({
  startup,
  liked,
  saved,
}: {
  startup: Startup
  liked: boolean
  saved: boolean
}) {
  const router = useRouter()
  const [isLiked, setIsLiked] = useState(liked)
  const [isSaved, setIsSaved] = useState(saved)
  const [busy, setBusy] = useState(false)

  async function toggle(type: "like" | "save") {
    setBusy(true)
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      setBusy(false)
      return
    }
    const current = type === "like" ? isLiked : isSaved
    if (current) {
      const { error } = await supabase
        .from("investor_interests")
        .delete()
        .eq("investor_id", user.id)
        .eq("startup_id", startup.id)
        .eq("type", type)
      if (error) toast.error(error.message)
      else type === "like" ? setIsLiked(false) : setIsSaved(false)
    } else {
      const { error } = await supabase
        .from("investor_interests")
        .insert({ investor_id: user.id, startup_id: startup.id, type })
      if (error) toast.error(error.message)
      else type === "like" ? setIsLiked(true) : setIsSaved(true)
    }
    setBusy(false)
    router.refresh()
  }

  return (
    <article className="flex flex-col rounded-xl border border-border bg-card p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold">{startup.name}</h3>
          <p className="truncate text-xs text-muted-foreground">{startup.industry}</p>
        </div>
        <ScoreBadge score={startup.ai_score} />
      </div>

      <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">{startup.pitch}</p>

      <dl className="mt-4 grid grid-cols-2 gap-3 text-xs">
        <div>
          <dt className="text-muted-foreground">Funding</dt>
          <dd className="mt-0.5 font-medium">${Number(startup.funding_required).toLocaleString()}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Risk</dt>
          <dd className="mt-0.5">
            <RiskBadge risk={startup.risk_level} />
          </dd>
        </div>
      </dl>

      <div className="mt-5 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => toggle("like")}
            disabled={busy}
            aria-label="Like"
            className={cn(isLiked && "text-red-500")}
          >
            <Heart className={cn("h-4 w-4", isLiked && "fill-current")} />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => toggle("save")}
            disabled={busy}
            aria-label="Save"
            className={cn(isSaved && "text-foreground")}
          >
            <Bookmark className={cn("h-4 w-4", isSaved && "fill-current")} />
          </Button>
        </div>
        <Button asChild size="sm" variant="secondary">
          <Link href={`/investor/startups/${startup.id}`}>
            View <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </article>
  )
}

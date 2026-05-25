"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Eye, Check, X, Sparkles } from "lucide-react"
import { toast } from "sonner"
import type { Startup } from "@/lib/types"
import { AiAnalysisCard } from "@/components/ai-analysis-card"

export function ApproveActions({ startup }: { startup: Startup }) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)
  const [open, setOpen] = useState(false)

  async function setStatus(status: "approved" | "rejected") {
    setBusy(true)
    const supabase = createClient()
    const { error } = await supabase.from("startups").update({ status }).eq("id", startup.id)
    setBusy(false)
    if (error) {
      toast.error(error.message)
      return
    }
    toast.success(`Startup ${status}`)
    router.refresh()
  }

  async function runAi() {
    setBusy(true)
    const res = await fetch("/api/ai/score", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ startupId: startup.id }),
    })
    setBusy(false)
    if (!res.ok) {
      toast.error("AI analysis failed")
      return
    }
    toast.success("AI analysis updated")
    router.refresh()
  }

  return (
    <div className="flex items-center justify-end gap-1">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button size="sm" variant="ghost" aria-label="View">
            <Eye className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{startup.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 text-sm">
            <p className="text-muted-foreground">{startup.industry}</p>
            <Field label="Problem" value={startup.problem} />
            <Field label="Solution" value={startup.solution} />
            <Field label="Pitch" value={startup.pitch} />
            <Field label="Team" value={startup.team_details ?? "—"} />
            <AiAnalysisCard startup={startup} />
          </div>
        </DialogContent>
      </Dialog>
      <Button size="sm" variant="ghost" onClick={runAi} disabled={busy} title="Run AI">
        <Sparkles className="h-4 w-4" />
      </Button>
      <Button
        size="sm"
        variant="ghost"
        className="text-emerald-600 hover:text-emerald-700"
        onClick={() => setStatus("approved")}
        disabled={busy || startup.status === "approved"}
      >
        <Check className="h-4 w-4" /> Approve
      </Button>
      <Button
        size="sm"
        variant="ghost"
        className="text-red-600 hover:text-red-700"
        onClick={() => setStatus("rejected")}
        disabled={busy || startup.status === "rejected"}
      >
        <X className="h-4 w-4" /> Reject
      </Button>
    </div>
  )
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-1 leading-relaxed">{value}</p>
    </div>
  )
}

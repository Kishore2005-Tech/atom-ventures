"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"
import { toast } from "sonner"

export function RunAiButton({ startupId }: { startupId: string }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function run() {
    setLoading(true)
    const res = await fetch("/api/ai/score", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ startupId }),
    })
    setLoading(false)
    if (!res.ok) {
      const j = await res.json().catch(() => ({}))
      toast.error(j.error ?? "AI scoring failed")
      return
    }
    toast.success("AI analysis updated")
    router.refresh()
  }

  return (
    <Button onClick={run} disabled={loading} size="sm">
      <Sparkles className="h-4 w-4" />
      {loading ? "Analyzing…" : "Re-run AI analysis"}
    </Button>
  )
}

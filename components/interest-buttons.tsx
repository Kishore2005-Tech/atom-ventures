"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Heart, Bookmark } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

export function InterestButtons({
  startupId,
  liked,
  saved,
}: {
  startupId: string
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
    if (!user) return
    const current = type === "like" ? isLiked : isSaved
    if (current) {
      const { error } = await supabase
        .from("investor_interests")
        .delete()
        .eq("investor_id", user.id)
        .eq("startup_id", startupId)
        .eq("type", type)
      if (error) toast.error(error.message)
      else type === "like" ? setIsLiked(false) : setIsSaved(false)
    } else {
      const { error } = await supabase
        .from("investor_interests")
        .insert({ investor_id: user.id, startup_id: startupId, type })
      if (error) toast.error(error.message)
      else type === "like" ? setIsLiked(true) : setIsSaved(true)
    }
    setBusy(false)
    router.refresh()
  }

  return (
    <div className="flex items-center gap-1">
      <Button
        variant="outline"
        size="sm"
        onClick={() => toggle("like")}
        disabled={busy}
        className={cn(isLiked && "text-red-500")}
      >
        <Heart className={cn("h-4 w-4", isLiked && "fill-current")} />
        Like
      </Button>
      <Button variant="outline" size="sm" onClick={() => toggle("save")} disabled={busy}>
        <Bookmark className={cn("h-4 w-4", isSaved && "fill-current")} />
        {isSaved ? "Saved" : "Save"}
      </Button>
    </div>
  )
}

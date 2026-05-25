"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { MessageCircle } from "lucide-react"
import { toast } from "sonner"

export function ContactFounderButton({
  recipientId,
  startupId,
  startupName,
}: {
  recipientId: string
  startupId: string
  startupName: string
}) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [body, setBody] = useState(`Hi, I'd love to learn more about ${startupName}.`)
  const [sending, setSending] = useState(false)

  async function send() {
    setSending(true)
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      setSending(false)
      return
    }
    const { error: msgErr } = await supabase.from("messages").insert({
      sender_id: user.id,
      recipient_id: recipientId,
      startup_id: startupId,
      body: body.trim(),
    })
    if (msgErr) {
      toast.error(msgErr.message)
      setSending(false)
      return
    }
    await supabase
      .from("investor_interests")
      .insert({ investor_id: user.id, startup_id: startupId, type: "contact" })
      .select()
    setSending(false)
    setOpen(false)
    toast.success("Message sent to founder")
    router.push("/investor/messages")
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <MessageCircle className="h-4 w-4" /> Invest / Contact
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Contact founder</DialogTitle>
          <DialogDescription>Open a private conversation about {startupName}.</DialogDescription>
        </DialogHeader>
        <Textarea rows={5} value={body} onChange={(e) => setBody(e.target.value)} />
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={send} disabled={sending || !body.trim()}>
            {sending ? "Sending…" : "Send message"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

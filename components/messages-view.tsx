"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { Send, MessageSquare } from "lucide-react"
import { toast } from "sonner"

type Contact = { id: string; full_name: string | null; email: string | null; role: string }
type Msg = { id: string; sender_id: string; recipient_id: string; body: string; created_at: string; startup_id: string | null }

export function MessagesView({
  meId,
  messages,
  contacts,
}: {
  meId: string
  messages: Msg[]
  contacts: Contact[]
}) {
  const router = useRouter()
  const [activeId, setActiveId] = useState<string | null>(contacts[0]?.id ?? null)
  const [body, setBody] = useState("")
  const [sending, setSending] = useState(false)

  const thread = useMemo(
    () =>
      messages.filter(
        (m) =>
          (m.sender_id === meId && m.recipient_id === activeId) ||
          (m.sender_id === activeId && m.recipient_id === meId),
      ),
    [messages, meId, activeId],
  )

  async function send() {
    if (!body.trim() || !activeId) return
    setSending(true)
    const supabase = createClient()
    const { error } = await supabase.from("messages").insert({
      sender_id: meId,
      recipient_id: activeId,
      body: body.trim(),
    })
    setSending(false)
    if (error) {
      toast.error(error.message)
      return
    }
    setBody("")
    router.refresh()
  }

  return (
    <div className="flex h-[calc(100vh-3.5rem)] md:h-screen">
      <aside className="hidden w-72 shrink-0 flex-col border-r border-border bg-card md:flex">
        <div className="border-b border-border px-4 py-3">
          <h2 className="text-sm font-semibold">Conversations</h2>
        </div>
        <div className="flex-1 overflow-auto">
          {contacts.length === 0 ? (
            <div className="p-6 text-center text-xs text-muted-foreground">No conversations yet.</div>
          ) : (
            contacts.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveId(c.id)}
                className={cn(
                  "flex w-full items-center gap-3 px-4 py-3 text-left text-sm transition-colors",
                  activeId === c.id ? "bg-secondary" : "hover:bg-secondary/50",
                )}
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-medium">
                  {(c.full_name ?? c.email ?? "?").slice(0, 1).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="truncate font-medium">{c.full_name ?? c.email}</p>
                  <p className="truncate text-xs capitalize text-muted-foreground">{c.role}</p>
                </div>
              </button>
            ))
          )}
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex items-center gap-2 border-b border-border bg-card px-5 py-3">
          <MessageSquare className="h-4 w-4" />
          <h1 className="text-sm font-semibold">
            {activeId ? contacts.find((c) => c.id === activeId)?.full_name ?? "Conversation" : "Messages"}
          </h1>
        </header>

        <div className="flex-1 overflow-auto bg-secondary/20 p-6">
          {!activeId ? (
            <div className="mx-auto max-w-md text-center">
              <p className="text-sm text-muted-foreground">Select a conversation to start chatting.</p>
            </div>
          ) : thread.length === 0 ? (
            <div className="mx-auto max-w-md text-center">
              <p className="text-sm text-muted-foreground">No messages yet. Say hello.</p>
            </div>
          ) : (
            <ul className="mx-auto flex max-w-2xl flex-col gap-2">
              {thread.map((m) => {
                const mine = m.sender_id === meId
                return (
                  <li key={m.id} className={cn("flex", mine ? "justify-end" : "justify-start")}>
                    <div
                      className={cn(
                        "max-w-[75%] rounded-2xl px-4 py-2 text-sm",
                        mine
                          ? "bg-primary text-primary-foreground"
                          : "bg-card text-card-foreground border border-border",
                      )}
                    >
                      {m.body}
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        <div className="border-t border-border bg-card p-3">
          <div className="mx-auto flex max-w-2xl items-center gap-2">
            <Input
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder={activeId ? "Write a message…" : "Open a conversation first"}
              disabled={!activeId}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  send()
                }
              }}
            />
            <Button onClick={send} disabled={!activeId || !body.trim() || sending}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

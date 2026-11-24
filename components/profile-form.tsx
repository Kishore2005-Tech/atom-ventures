"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import type { Profile } from "@/lib/types"

export function ProfileForm({ profile }: { profile: Profile }) {
  const router = useRouter()
  const [fullName, setFullName] = useState(profile.full_name ?? "")
  const [company, setCompany] = useState(profile.company ?? "")
  const [bio, setBio] = useState(profile.bio ?? "")
  const [interests, setInterests] = useState((profile.interests ?? []).join(", "))
  const [saving, setSaving] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const supabase = createClient()
    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: fullName,
        company,
        bio,
        interests: interests
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      })
      .eq("id", profile.id)
    setSaving(false)
    if (error) {
      toast.error(error.message)
      return
    }
    toast.success("Profile updated")
    router.refresh()
  }

  return (
    <form onSubmit={onSubmit} className="rounded-xl border border-border bg-card p-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label>Email</Label>
          <Input value={profile.email ?? ""} disabled />
        </div>
        <div className="flex flex-col gap-2">
          <Label>Role</Label>
          <Input value={profile.role} disabled className="capitalize" />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="fullName">Full name</Label>
          <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="company">Company</Label>
          <Input id="company" value={company} onChange={(e) => setCompany(e.target.value)} />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea id="bio" rows={4} value={bio} onChange={(e) => setBio(e.target.value)} />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="interests">
            {profile.role === "investor" ? "Investment interests" : "Interests"} (comma separated)
          </Label>
          <Input
            id="interests"
            value={interests}
            onChange={(e) => setInterests(e.target.value)}
            placeholder="AI, Climate, Fintech"
          />
        </div>
        <Button type="submit" disabled={saving} className="self-start">
          {saving ? "Saving…" : "Save changes"}
        </Button>
      </div>
    </form>
  )
}

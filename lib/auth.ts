import "server-only"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import type { Profile, Role } from "@/lib/types"

export async function requireUser() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")
  return { supabase, user }
}

export async function requireProfile(allowed?: Role[]) {
  const { supabase, user } = await requireUser()
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single<Profile>()
  if (!profile) redirect("/auth/login")
  if (allowed && !allowed.includes(profile.role)) {
    if (profile.role === "admin") redirect("/admin")
    if (profile.role === "investor") redirect("/investor")
    redirect("/founder")
  }
  return { supabase, user, profile }
}

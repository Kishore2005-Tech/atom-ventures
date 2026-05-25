import { requireProfile } from "@/lib/auth"
import { DashboardShell } from "@/components/dashboard-shell"
import { ShieldCheck, Users, AlertTriangle, BarChart3, FileBarChart } from "lucide-react"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { profile } = await requireProfile(["admin"])
  return (
    <DashboardShell
      role="Admin"
      email={profile.email ?? ""}
      nav={[
        { href: "/admin", label: "Approvals", icon: ShieldCheck },
        { href: "/admin/users", label: "User Management", icon: Users },
        { href: "/admin/fraud", label: "Fraud Detection", icon: AlertTriangle },
        { href: "/admin/reports", label: "Reports", icon: FileBarChart },
        { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
      ]}
    >
      {children}
    </DashboardShell>
  )
}

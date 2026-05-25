export type Role = "founder" | "investor" | "admin"

export type Profile = {
  id: string
  email: string | null
  full_name: string | null
  role: Role
  bio: string | null
  company: string | null
  interests: string[] | null
  created_at: string
}

export type Startup = {
  id: string
  founder_id: string
  name: string
  industry: string
  problem: string
  solution: string
  pitch: string
  funding_required: number
  team_details: string | null
  pitch_deck_url: string | null
  status: "pending" | "approved" | "rejected"
  ai_score: number | null
  market_demand_score: number | null
  risk_level: "low" | "medium" | "high" | null
  spam_probability: number | null
  ai_recommendations: string | null
  ai_improvements: string | null
  created_at: string
  updated_at: string
}

export type InvestorInterest = {
  id: string
  investor_id: string
  startup_id: string
  type: "like" | "save" | "contact"
  created_at: string
}

export type Message = {
  id: string
  startup_id: string | null
  sender_id: string
  recipient_id: string
  body: string
  created_at: string
}

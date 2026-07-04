# ⚛️ Atom Ventures

> **AI-Powered Startup Discovery & Investment Platform**

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Status](https://img.shields.io/badge/status-active-brightgreen.svg)]()
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-orange.svg)](CONTRIBUTING.md)

---

## 🚀 Overview

**Atom Ventures** is an intelligent platform that bridges the gap between early-stage startups and forward-thinking investors. Powered by AI, it automates startup discovery, evaluates investment potential, and delivers curated deal flow — all in one unified workspace.

Whether you're a VC firm, angel investor, or accelerator, Atom Ventures transforms how you find and evaluate the next big idea.

---

## ✨ Key Features

| Feature | Description |
|---|---|
| 🔍 AI Startup Discovery | Scrapes and surfaces high-potential startups across ecosystems |
| 📊 **Investment Scoring** | AI-driven scoring models based on traction, team, market size, and more |
| 🧠 **Smart Deal Flow** | Personalized recommendations aligned with your investment thesis |
| 📈 **Market Intelligence** | Real-time trend analysis across sectors and geographies |
| 🤝 **Startup Profiles** | Structured founder profiles, pitch decks, and traction metrics |
| 🔔 **Alerts & Watchlists** | Monitor startups and get notified on key milestones |

---

## 🛠️ Tech Stack

```
Frontend       → Next.js, Tailwind CSS
Backend        → Node.js, Express
Database       → MongoDB
AI/ML          → OpenAI API / Custom Models
Auth           → NextAuth.js / JWT
Storage        → ImageKit / AWS S3
Deployment     → Vercel / Railway
```

---

## 📁 Project Structure

```
atom-ventures/
├── app/                    # Next.js App Router
│   ├── (auth)/             # Auth pages (login, signup)
│   ├── dashboard/          # Investor dashboard
│   ├── startups/           # Startup discovery & profiles
│   └── portfolio/          # Portfolio management
├── components/             # Reusable UI components
├── lib/                    # Utilities, helpers, AI logic
├── models/                 # MongoDB schemas
├── api/                    # REST API routes
├── public/                 # Static assets
└── README.md
```

---

## ⚙️ Getting Started

### Prerequisites

- Node.js `v18+`
- MongoDB (local or Atlas)
- OpenAI API key

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/atom-ventures.git
cd atom-ventures

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Fill in your keys (see Environment Variables section)

# 4. Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

---

## 🔐 Environment Variables

Create a `.env.local` file in the root directory:

```env
# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# MongoDB
MONGODB_URI=your_mongodb_connection_string

# Authentication
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000

# OpenAI
OPENAI_API_KEY=your_openai_api_key

# ImageKit (optional)
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_endpoint
```

---

## 🧩 How It Works

```
1. DATA INGESTION
   └─ AI crawlers collect startup data from public sources

2. AI ANALYSIS
   └─ Models evaluate team, traction, market fit, and signals

3. SCORING ENGINE
   └─ Each startup receives an Atom Score (0–100)

4. DISCOVERY FEED
   └─ Investors see personalized, ranked deal flow

5. PORTFOLIO TRACKING
   └─ Monitor investments and milestone alerts
```

---

## 📸 Screenshots

> *(Add screenshots or GIF demo here)*

```
/docs/screenshots/dashboard.png
/docs/screenshots/startup-profile.png
/docs/screenshots/deal-flow.png
```

---

## 🗺️ Roadmap

- [x] Startup discovery engine
- [x] Investor dashboard
- [x] AI scoring model (v1)
- [ ] Founder onboarding portal
- [ ] CRM integrations (Salesforce, HubSpot)
- [ ] Mobile app (React Native)
- [ ] LP reporting module
- [ ] Multi-language support

---

## 🤝 Contributing

Contributions are welcome! Please read the [Contributing Guide](CONTRIBUTING.md) before submitting a pull request.

```bash
# Fork → Branch → Commit → PR
git checkout -b feature/your-feature-name
git commit -m "feat: add your feature"
git push origin feature/your-feature-name
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 👤 Author

**Kishore** — [GitHub](https://github.com/your-username) · [LinkedIn](https://linkedin.com/in/your-profile)

---

<p align="center">
  Built with ⚛️ by the Atom Ventures team
</p>

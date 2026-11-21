# BUILDORA — The Secure AI Operating Workspace for Startups

> **Positioning:** The secure AI workspace for 5–15 person SaaS teams.
> **Core Loop:** AI assists → AI prepares → Human approves → AI acts → Everything is logged.

BUILDORA gives your startup one unified place to use AI across meetings, company knowledge, research, sales, and support—while keeping founders and admins in complete control of sensitive outbound actions.

---

## 🚀 Key Features

* **High-Converting Landing Page**: Complete SaaS marketing site with hero, value propositions, pricing tiers, and interactive playground.
* **Instant Interactive Demo (AcmeFlow)**: 6-step guided walkthrough without signup:
  1. Grounded Knowledge Query
  2. Meeting Agent & Action Items
  3. Sales Agent & Lead Research
  4. Human Approval Required Gate
  5. Founder One-Click Sign-off
  6. Immutable Audit Trail
* **Book a Demo Flow**: Inbound demo lead capture stored directly in backend and internal admin panel.
* **Multi-Tenant Workspaces**: Strict tenant isolation across documents, chats, tasks, approvals, and vectors.
* **Grounded Company Knowledge**: Vector search with zero external hallucinations and source citations.
* **Autonomous Agent Swarm**:
  * **Meeting Agent**: Audio/transcript synthesis, decisions, and tasks.
  * **Research Agent**: Competitor analysis, pricing, and market reports.
  * **Sales Agent**: Lead intelligence and personalized email drafts.
  * **Support Agent**: Customer ticket replies with confidence scores.
* **Approval Center**: Enforces human founder oversight for all high-risk external mutations.
* **Immutable Audit Trail**: Tamper-evident, SOC2-ready logging for all actions and approvals.
* **Subscription Billing**: Ready for **Stripe** (USD) and **Razorpay** (INR) with 14-day free trial meter.
* **Internal Admin Panel**: Telemetry for workspaces, users, AI costs, demo leads, and prompt injection defense logs.
* **Python AI Engine**: Modular FastAPI backend with multi-provider Model Router (OpenAI, Anthropic, Gemini, or local fallback).

---

## 📂 Project Structure

```
BUILDORA/
├── backend/                  # Python FastAPI Backend
│   ├── app/
│   │   ├── main.py           # Application entrypoint & CORS
│   │   ├── config.py         # Settings & environment variables
│   │   ├── api/
│   │   │   └── routes.py     # REST endpoints (auth, chat, agents, approvals, audit, demo, admin)
│   │   ├── agents/           # Specialized AI Agent implementations
│   │   │   ├── base_agent.py
│   │   │   ├── knowledge_agent.py
│   │   │   ├── meeting_agent.py
│   │   │   ├── research_agent.py
│   │   │   ├── sales_agent.py
│   │   │   └── support_agent.py
│   │   ├── ai/               # AI Model Router, Prompts, & Vector Context
│   │   │   ├── model_router.py
│   │   │   ├── context_builder.py
│   │   │   └── prompts/
│   │   │       └── base_prompts.py
│   │   ├── database/         # Multi-tenant models and repository
│   │   │   ├── models.py
│   │   │   ├── db.py
│   │   │   └── repositories.py
│   │   ├── integrations/     # Integration Adapter Architecture
│   │   │   └── adapters.py
│   │   └── billing/          # Stripe & Razorpay Subscription Service
│   │       └── billing_service.py
│   └── requirements.txt
├── src/                      # Frontend Application (React 19 + Vite)
│   ├── views/                # Full Responsive Views
│   │   ├── LandingPageView.jsx
│   │   ├── OverviewView.jsx
│   │   ├── ChatView.jsx
│   │   ├── KnowledgeView.jsx
│   │   ├── MeetingAgentView.jsx
│   │   ├── ResearchAgentView.jsx
│   │   ├── SalesAgentView.jsx
│   │   ├── SupportAgentView.jsx
│   │   ├── ApprovalView.jsx
│   │   ├── AuditLogView.jsx
│   │   ├── BillingView.jsx
│   │   ├── AdminView.jsx
│   │   └── ...
│   ├── components/           # UI Modals, Bars, and Drawers
│   │   ├── DemoTourBar.jsx
│   │   ├── BookDemoModal.jsx
│   │   ├── AuthModal.jsx
│   │   ├── CheckoutModal.jsx
│   │   ├── AiKeyModal.jsx
│   │   └── ...
│   ├── services/
│   │   └── aiService.js      # Client-side AI fallback & routing
│   └── api/
│       └── client.js         # Unified Backend API Client
├── .env.example
├── README.md
├── SETUP.md
├── ARCHITECTURE.md
├── SECURITY.md
└── API.md
```

---

## ⚡ Quick Start

### 1. Run Frontend
```bash
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 2. Run Python AI Backend
```bash
cd backend
python -m uvicorn app.main:app --reload --port 8000
```
Interactive API Swagger Docs: [http://localhost:8000/docs](http://localhost:8000/docs)

---

## 📄 Documentation Links
* [SETUP.md](file:///d:/work/BUILDORA/SETUP.md) — Local installation and production deployment.
* [ARCHITECTURE.md](file:///d:/work/BUILDORA/ARCHITECTURE.md) — Multi-tenant architecture and AI agent loops.
* [SECURITY.md](file:///d:/work/BUILDORA/SECURITY.md) — Human-in-the-loop, prompt injection defense, and air-gapped isolation.
* [API.md](file:///d:/work/BUILDORA/API.md) — REST API endpoints and payloads.

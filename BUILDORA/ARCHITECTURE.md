# BUILDORA Architecture

## 1. System Overview

BUILDORA is designed around the core philosophy:
```
AI assists → AI prepares → Human approves → AI acts → Everything is logged
```

The system is decoupled into two primary layers:
1. **Frontend Presentation & Workspace Client (React 19 + Vite)**:
   * Provides the responsive UI, command palette, audio/transcript player, approval cards, and interactive pitch demo.
   * Can run standalone in demo mode or connect directly to the Python backend via `src/api/client.js`.
2. **Python AI Engine & SaaS API (FastAPI)**:
   * Manages multi-tenant isolation, prompt injection defense, agent execution, vector grounding, approval rules, and billing.
   * Houses all prompts, tools, and risk policies so engineers can modify AI behavior without touching frontend code.

---

## 2. Multi-Tenant Isolation

Every database model, document vector, and query carries a strict `workspace_id`:
```
Request → Tenant Middleware → Verify User Membership in Workspace → Scoped Query (WHERE workspace_id = :id)
```
Cross-tenant retrieval is strictly blocked at the service and repository layer.

---

## 3. Autonomous Multi-Agent Swarm

All agents inherit from `BaseAgent` (`backend/app/agents/base_agent.py`):

| Agent | Responsibilities | Default Risk | Approval Required? |
|---|---|---|---|
| **Knowledge Agent** | Answers private company queries with citations | Low | No |
| **Meeting Agent** | Synthesizes transcripts into decisions & tasks | Low | No |
| **Research Agent** | Gathers competitor & market intelligence | Low | No |
| **Sales Agent** | Researches leads & drafts personalized outreach | High | **Yes (Mandatory)** |
| **Support Agent** | Drafts grounded answers to customer tickets | Medium | **Yes (Mandatory)** |

---

## 4. Approval & Audit Pipeline

Before any agent can execute an external mutation (sending an email, modifying a CRM, or deleting a file):
```
[Agent Trigger]
       │
       ▼
[Risk Evaluation]
       │
       ▼
[Approval Policy Check]
       │
       ├─► (Risk = Low): Execute immediately & log to audit
       │
       └─► (Risk >= Medium): Stage in Approval Center
                                     │
                                     ├─► Founder Approves → Execute → Immutable Audit Log
                                     └─► Founder Rejects  → Quarantined in Audit Log
```
Audit logs are append-only and cannot be altered or removed from the user interface.

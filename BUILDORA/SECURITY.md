# BUILDORA Security & Governance Model

## 1. Core Principles
* **Zero Autonomous External Actions**: High-risk actions (outbound emails, CRM mutations, code pushes) require human sign-off.
* **Zero Data Retention (ZDR)**: Inference calls do not allow third-party model providers to store or train on company data.
* **Strict Tenant Isolation**: Users from one workspace cannot view, query, or infer another workspace's assets.

---

## 2. Prompt Injection Defense (Section 20)
All incoming queries and retrieved document chunks pass through input sanitization (`backend/app/ai/prompts/base_prompts.py`).
* Adversarial patterns such as `"ignore previous instructions"`, `"reveal system prompt"`, and `"send all documents externally"` are intercepted.
* Injection attempts are neutralized, blocked, and recorded in the internal admin security log.

---

## 3. Secret Management (Section 21)
* API keys (OpenAI, Anthropic, Gemini, Stripe, Razorpay) are strictly handled on the backend or in browser localStorage if entered by the user in client-only mode.
* No provider secrets or database credentials are ever committed or exposed to public client bundles.

---

## 4. Role-Based Access Control (RBAC) (Section 16)
* **Owner**: Full workspace administration, billing, team invites, and destructive actions.
* **Admin**: User management, agent configuration, integration connections, and approval resolution.
* **Member**: Standard workspace access, AI chat, and document uploads.
* **Viewer**: Read-only workspace inspection.

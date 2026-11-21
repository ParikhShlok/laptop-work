# BUILDORA REST API Reference

Interactive OpenAPI / Swagger documentation is available at:
`http://localhost:8000/docs`

---

## 1. Health
* **GET `/api/health`**: Returns system operational status and multi-tenant telemetry.

---

## 2. AI Chat & Query
* **POST `/api/chat`**
  * **Payload:**
    ```json
    {
      "workspace_id": "ws-acmeflow-prod",
      "query": "What are our product priorities for this month?",
      "agent": "Buildora AI"
    }
    ```
  * **Response:** Grounded answer with citation list and model metadata.

---

## 3. Specialized Agents
* **POST `/api/meetings/process`**: Parses meeting transcript, returns decisions, summary, and action items.
* **POST `/api/research/run`**: Compiles competitor and market research report.
* **POST `/api/sales/draft`**: Researches lead and stages approval for outbound outreach email.
* **POST `/api/support/query`**: Searches company knowledge, generates customer reply draft with confidence score, and stages approval.

---

## 4. Approvals & Audit Trail
* **GET `/api/approvals?workspace_id=ws-acmeflow-prod`**: Lists pending and resolved approvals.
* **POST `/api/approvals/{id}/approve`**: Signs off on staged action and executes it to the audit log.
* **POST `/api/approvals/{id}/reject`**: Denies execution and quarantines payload.
* **GET `/api/audit-logs?workspace_id=ws-acmeflow-prod`**: Returns immutable audit trail.

---

## 5. Billing & Inquiries
* **GET `/api/billing/plans`**: Returns pricing tiers in INR and USD.
* **POST `/api/billing/checkout`**: Initiates Stripe or Razorpay checkout session.
* **POST `/api/demo/request`**: Submits inbound demo lead inquiry.
* **GET `/api/admin/dashboard`**: Telemetry and inbound leads for internal platform administrators.

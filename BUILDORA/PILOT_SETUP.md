# BUILDORA authenticated pilot setup

This release includes a real pilot API at `/api/v1`. It provides account registration, secure password hashing, expiring bearer sessions, workspace membership checks, persistent knowledge sources, support-reply drafts, review decisions, and append-only audit events.

## Run locally

1. Copy `.env.example` to `.env` and keep the default SQLite pilot database for local testing.
2. Start the backend:

   ```powershell
   cd backend
   python -m venv .venv
   .\.venv\Scripts\Activate.ps1
   pip install -r requirements.txt
   $env:PYTHONPATH = (Resolve-Path .).Path
   uvicorn app.main:app --reload --port 8000
   ```

3. Start the frontend in a second terminal:

   ```powershell
   npm run dev
   ```

4. Create an account using **Start a Pilot**. Passwords require at least 12 characters.

## Pilot API flow

1. Register or sign in; the API returns an expiring session token.
2. Add a knowledge source through `POST /api/v1/workspaces/{workspace_id}/documents`.
3. Create a support draft with `POST /api/v1/workspaces/{workspace_id}/support-drafts`.
4. An approval is stored in `pending` state; an operator records `approved` or `rejected`.
5. The operator manually sends the message from their existing support system. BUILDORA deliberately has no outbound-send endpoint yet.

## Before production deployment

- Deploy the frontend and API on separate HTTPS domains, then set `VITE_PILOT_API_URL` and `ALLOWED_ORIGINS` to those domains.
- Put the API behind a managed PostgreSQL database. The included SQLite store is not safe for multiple application instances.
- Use server-provided secrets only. Never put model or provider keys in `VITE_*` variables.
- Add password reset, email verification, invite flows, rate limiting, monitoring, backups, and a privacy policy before customer data onboarding.
- Connect a single draft-only integration only after its OAuth scopes and provider confirmation handling are implemented.

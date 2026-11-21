# Publish BUILDORA safely: pilot-demo release

This repository now includes an **authenticated pilot API** for a single-instance, human-reviewed support-draft workflow. The marketing/demo frontend can be published immediately. Do not connect real customer systems until the production requirements below are complete.

## What you can publish now

Publish the Vite frontend as a public demo. The approved sales message is:

> BUILDORA is an early-access pilot for reviewable AI sales and support drafts. The preview uses simulated data and does not connect to customer systems.

Before publishing, create a scheduling page in Calendly, Cal.com, or TidyCal. Set the booking URL as a build environment variable:

```text
VITE_BOOKING_URL=https://your-booking-provider.example/your-pilot
```

Do not add AI-provider keys (`OPENAI_API_KEY`, Anthropic, Gemini) to the frontend host. `VITE_*` values are public browser values.

## Vercel deployment (recommended for the public demo)

1. Create a GitHub repository and push this project.
2. In Vercel, select **Add New → Project**, import the repository, and use these settings:
   - Framework: `Vite`
   - Build command: `npm run build`
   - Output directory: `dist`
3. In **Settings → Environment Variables**, add `VITE_BOOKING_URL` with your booking-page link.
4. Deploy. Test the live site in an incognito browser and submit a test booking through the booking provider.
5. Attach a custom domain only after the booking flow works.

Netlify and Cloudflare Pages use the same build command and output directory.

## Why a real database is required before a team pilot

The current backend uses an in-memory Python object. It is reset when the server restarts and has no authenticated-user or tenant authorization layer. A production database is needed to persist and protect:

- users, sessions, roles, and workspace membership;
- document metadata and encrypted source files;
- agent jobs, draft payloads, review decisions, and delivery receipts;
- append-only audit events; and
- inbound demo leads.

The included authenticated pilot API uses SQLite for a local or single-server trial. For a deployed team pilot, use managed PostgreSQL (for example Supabase, Neon, or Render Postgres) with migrations and database-enforced tenant authorization. Keep uploaded files in private object storage, not database rows.

## Minimum requirements before inviting a real startup team

1. Real authentication and verified workspace membership on every API request.
2. PostgreSQL persistence with workspace-scoped authorization and migrations.
3. Server-side secrets only; remove browser API-key entry for production.
4. One live, least-privilege integration (start read-only or draft-only).
5. Durable approval state and audit events; an approval must not claim execution until a provider confirms it.
6. Request validation, rate limits, error monitoring, backups, and a privacy policy.
7. A written pilot agreement that says exactly which data is connected, retained, and who may approve actions.

## Recommended first paid pilot

Sell one workflow only: **draft support replies from approved internal documents, reviewed by a human before sending**.

Do not send messages automatically. Start by giving the customer a review screen and letting their support person manually copy/send the approved draft. This proves value while you build the integration and audit foundation.

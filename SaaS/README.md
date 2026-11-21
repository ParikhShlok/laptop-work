# AegisScan MVP

A small dashboard for an **authorized AI security-testing** SaaS. It uses local simulated results so you can demo the flow safely before integrating with an approved staging system.

## Run it

1. Install Node.js 20 or newer.
2. Run `npm install`.
3. Run `npm run dev`.
4. Open `http://localhost:3000`.

## Before connecting a real endpoint

Require written authorization, use a staging environment, set strict rate limits, and only send synthetic test data. Keep secrets out of logs. A production scan worker should additionally enforce an allowlist, per-customer credentials, and a kill switch.

## Next build steps

- Add Supabase authentication and database storage.
- Create a server-side scan queue that accepts only verified customer targets.
- Build a safe test library with synthetic prompts and canary values.
- Add scans history, report export, alerts, and CI integration.

# Freelance Task Finder

A free-first, on-demand Flask dashboard for authorized freelance project listings. The Freelancer.com official API adapter runs only when an authorized OAuth token is configured. Upwork, Fiverr, and PeoplePerHour are shown as official manual-search links until a permitted, reliable project-search integration is available. The app never applies, bids, messages clients, buys services, or submits proposals.

## Run locally on Windows (PowerShell)

Requires Python 3.11 or newer and the Python launcher (`py`). Open PowerShell in the project folder (`D:\work\freelance-agent`) and run:

```powershell
py --version
py -3 -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
Copy-Item .env.example .env
notepad .env
python app.py
```

In `.env`, replace the `APP_ACCESS_SECRET` placeholder with a private key, save, and restart `python app.py`. For a random local key, run `py -c "import secrets; print(secrets.token_urlsafe(32))"` in a second PowerShell window and paste its output into `.env`. Telegram is optional: leave its values empty to search without notifications. To enable notifications, fill both `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` in `.env` and restart the server. Do not share or commit `.env`.

Open http://127.0.0.1:5000, enter the same app access key, choose filters, and click **Find Freelance Tasks**. Only the configured Freelancer.com API is called; other sources show their connection status and official marketplace search link. Review each listing and proposal draft yourself.

If PowerShell blocks activation, either run `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass` in that PowerShell window and activate again, or use the environment's Python directly without activation:

```powershell
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
.\.venv\Scripts\python.exe app.py
```

To stop the local server, press `Ctrl+C` in its terminal. In a separate PowerShell window, run the automated tests:

```powershell
\.venv\Scripts\python.exe -m unittest discover -s tests -v
\.venv\Scripts\python.exe -m compileall -q app.py jobs tests
node --check static\app.js
```

The `py -3` launcher selects an installed Python 3 version (this project was checked with Python 3.14). To pin Python 3.11, replace that command with `py -3.11 -m venv .venv`. If the launcher is unavailable, install Python 3.11+ from python.org with the launcher enabled; `py -0p` lists installed interpreters.

Without `APP_ACCESS_SECRET`, the UI explains that search is unavailable and the API fails closed. `/health` stays available and returns only `{ "status": "ok" }`.

## Telegram setup

1. In Telegram, start a conversation with `@BotFather`, create a bot, and copy its token.
2. Start a chat with the new bot and send it a message. Obtain the numeric chat ID using Telegram's official Bot API `getUpdates` response, or use the bot in a private group and use that group's chat ID.
3. Set `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` in `.env` locally or in the Render service's environment settings. Never commit the token.
4. Search from the dashboard. The page confirms delivery only after Telegram's API accepts all report messages. If configuration is missing or delivery fails, results remain visible and the page says so. Empty-result notifications are off unless `NOTIFY_EMPTY_SEARCH=true`. Use a private chat that you control; avoid sending marketplace API data into public/shared groups.

Treat the bot token as a password. Do not put it in HTML, JavaScript, URLs, screenshots, or source control.

## Marketplace API setup and actual source status

- **Freelancer.com — implemented, OAuth-gated:** Register an application in the [official Freelancer developer portal](https://developers.freelancer.com/), obtain an OAuth2 access token with permission to read active projects, and set `FREELANCER_OAUTH_TOKEN` locally or in Render. The app calls the official active-project API only after this token exists. The official Freelancer SDK documents OAuth2 session use and active-project search. The API terms restrict redistribution and API use; keep this as a private, personal dashboard and review the current terms before connecting it. Do not enter a password, cookie, or browser session token.
- **Upwork — not integrated:** API credentials require an application and Upwork review/approval. The app shows a direct marketplace search link and makes no API or website requests until an approved adapter is implemented. Read Upwork's current [API access and authentication requirements](https://www.upwork.com/developer/documentation/graphql/api/docs/index.html) and [automation rules](https://support.upwork.com/hc/en-us/articles/43342677368467-Use-bots-and-other-automation-properly).
- **Fiverr — not integrated:** No client-posted project feed is configured. Fiverr's public [platform solutions page](https://www.fiverr.com/partnerships/platform-solutions) describes a freelancer catalog API as “coming soon”; the page is about featuring freelancers/services, not an open client task feed. The app provides a manual browse link and does not scrape Fiverr.
- **PeoplePerHour — not integrated:** No verified, authorized public project-search feed is configured. PeoplePerHour's [official API client repository](https://github.com/PeoplePerHour/pph-php-client) documents application credentials, but this project does not assume that it grants access to project search. The app provides a manual search link and makes no automated request.

Marketplace status is shown before each search and updated with whether a source was actually queried. If `FREELANCER_OAUTH_TOKEN` is absent, no marketplace API is queried and no fake or fallback listings are returned. Never paste marketplace passwords, browser cookies, or session tokens into this app.

## Search behavior and limitations

- The Freelancer.com adapter calls its official active project API with an OAuth token, bounded results, and request timeouts. It validates the returned marketplace URL or uses the API-provided `seo_url` with the URL construction pattern used by Freelancer's official SDK. It skips malformed records and reports API failures without fabricating results.
- Rules exclude explicit unpaid work, contests, full-time roles, internships, training, and upfront-fee requests. Scores reflect relevant skills (30), budget/payment clarity (20), brief scope (15), beginner wording (15), posting/deadline freshness (10), deliverable relevance (5), and competition count (5 when supplied). The score is an estimate, not a safety or legitimacy check. “Beginner fit” is awarded only when the source brief includes entry-level/beginner wording.
- Budget values stay in the source currency. The minimum fixed-price filter applies only when source currency matches the chosen currency; no exchange-rate estimate or conversion is performed. Hourly projects are filtered by project type but not by a fixed project budget minimum.
- Missing budgets display “Not specified,” score lower, and are marked as unconfirmed rather than verified paid work. Missing dates, competition, client names, and payment-verification data stay explicitly unknown.
- Keywords can be included/excluded and project type can be fixed-price, hourly, or either. The recent-only filter excludes projects without a trustworthy date when enabled. No persistence or mark-reviewed feature is implemented; cross-search history is not stored.
- Duplicates are removed within a search. Cross-search history is not saved. Render's free service has an ephemeral filesystem and may sleep/restart, so this version does not rely on local persistence.
- Search is synchronous, on demand, and protected by a short in-process rate limit and single-search lock. Free instances can sleep, so the first request may be slow. The WSGI timeout is finite; larger workloads need persistent queue/storage services and possibly paid capacity.
- The access secret is a lightweight shared-key gate, not user accounts. The in-memory throttle resets on restart and is per instance. Use HTTPS, keep the access secret private, and rotate it if shared accidentally. Free-hosted single-instance app behavior is not a full anti-abuse or identity system.
- The browser renders untrusted listing fields with `textContent`, limits outbound links to HTTPS marketplace allowlisted hosts, and does not receive API or Telegram credentials. Source URLs are never fetched by the server as arbitrary user-supplied URLs.
- No scheduler, paid API, paid LLM, database, or persistent deduplication service is used.

## Deploy to Render

1. Push this project to a private GitHub repository. Confirm `.env` is ignored and no secrets are committed. Freelancer API terms limit how API data may be shared; keep this instance private to your authorized account.
2. In Render, create a **Web Service** from the repository (or use the included `render.yaml` blueprint).
3. Use build command `pip install -r requirements.txt` and start command `gunicorn app:app --bind 0.0.0.0:$PORT --workers 1 --threads 4 --timeout 45`. The blueprint sets these and `/health` as the health check.
4. Set `APP_ACCESS_SECRET` to a long random secret. Optionally configure `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, `NOTIFY_EMPTY_SEARCH`, and an authorized `FREELANCER_OAUTH_TOKEN` in Render's Environment page. Never add credentials to GitHub.
5. Deploy. Check the Render health check or open `/health`, then visit the service URL and run a small search. Test Telegram delivery only after configuring credentials.
6. On a phone, open the deployed URL, enter the app key, and click Find Freelance Tasks. Render free services can sleep; wait for wake-up and retry if the platform times out. The app does not run searches while asleep.

Render's free plan, availability, limits, and sleep behavior can change. Check Render's current plan documentation before depending on it for production workloads. GitHub deployment means push commits to the connected branch and let Render build the latest commit; inspect the deployment logs if the build fails.

## Troubleshooting

- **Search says not configured:** Set `APP_ACCESS_SECRET` on the server and redeploy/restart. Enter the same value in the dashboard.
- **Windows cannot find Python:** Run `py -0p`; install Python 3.11+ with the launcher enabled, then create `.venv` again. Use `.\.venv\Scripts\python.exe` for commands if activation is blocked.
- **Port is already in use:** Stop the other local server or, in PowerShell, run `$env:PORT = "5001"; python app.py` and open http://127.0.0.1:5001.
- **`ModuleNotFoundError`:** Activate `.venv`, then run `python -m pip install -r requirements.txt` from the project root.
- **Freelancer.com is not configured:** Register an app with Freelancer.com and put an authorized OAuth2 API token in `FREELANCER_OAUTH_TOKEN`. Do not use a password, cookie, or browser login/session token.
- **Freelancer.com API failed:** Check that the OAuth token is valid and includes active-project read access; inspect the source status and Render logs. No sample projects are substituted.
- **Access denied:** Check for whitespace or an old key; rotate the server secret and use the new key.
- **Telegram not configured:** Set both bot token and chat ID. Make sure the bot has been started or added to the target chat.
- **Telegram delivery failed:** Check the token, chat ID, bot permissions, and Render outbound availability. The results page remains the record for that completed request; the app does not persist reports for retry.
- **Deploy fails:** Verify Python dependency installation and the Gunicorn start command in Render logs. `PORT` is supplied by Render.
- **Slow or timed-out request:** Free-service wake-up plus source latency can consume the request window. Reduce the result cap or retry. Do not run parallel searches; use a persistent job queue if searches outgrow the synchronous design.

## Project layout

`app.py` owns HTTP routes and validation; `jobs/sources/freelancer.py` calls and normalizes the official Freelancer.com API; `jobs/sources/catalog.py` lists each marketplace's availability and official browse link; `jobs/filters.py` filters, scores and deduplicates; `jobs/proposals.py` creates cautious drafts; `jobs/telegram.py` sends compact reports; `templates/` and `static/` implement the responsive interface; `tests/` contains offline mocked API/unit tests.

import os
import requests

API = "https://api.telegram.org/bot{token}/sendMessage"
MAX_CHARS = 3800


def send_report(jobs, enabled_for_empty=False):
    if not jobs and not enabled_for_empty:
        return {"sent": False, "status": "skipped", "message": "No projects matched; empty-search notifications are disabled."}
    token, chat_id = os.getenv("TELEGRAM_BOT_TOKEN"), os.getenv("TELEGRAM_CHAT_ID")
    if not token or not chat_id:
        return {"sent": False, "status": "not_configured", "message": "Telegram credentials are not configured."}
    chunks, current = [], ""
    if not jobs:
        chunks = ["Freelance Task Finder: No matching freelance projects were found."]
    else:
        top_jobs = jobs[:5]
        intro = f"Freelance Task Finder: {len(jobs)} matching project(s); top {len(top_jobs)} shown. Review source details before responding.\n"
        current = intro
        for i, job in enumerate(top_jobs, 1):
            piece = (f"\n{i}. {job['title']} — {job['source']}\nBudget: {job['budget_label']} | Type: {job.get('payment_type') or 'not specified'}\n"
                     f"Match: {job['match_score']}/100\nLink: {job['job_url']}\n")
            if len(current) + len(piece) > MAX_CHARS and current:
                chunks.append(current); current = ""
            current += piece[:MAX_CHARS]
        if current:
            chunks.append(current)
    try:
        for chunk in chunks:
            response = requests.post(API.format(token=token), json={"chat_id": chat_id, "text": chunk, "disable_web_page_preview": True}, timeout=(5, 15))
            response.raise_for_status()
            body = response.json()
            if not body.get("ok"):
                raise RuntimeError("Telegram rejected the message")
        return {"sent": True, "status": "sent", "message": f"Telegram accepted {len(chunks)} message(s)."}
    except Exception as exc:
        return {"sent": False, "status": "failed", "message": f"Telegram delivery failed ({type(exc).__name__})."}

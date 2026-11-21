import os
import threading
import time
import math
import hmac
from flask import Flask, jsonify, render_template, request
from dotenv import load_dotenv

from jobs.filters import SearchFilters, rank_and_filter
from jobs.sources.freelancer import fetch_projects
from jobs.sources.catalog import source_catalog
from jobs.proposals import make_proposal
from jobs.telegram import send_report

load_dotenv()
app = Flask(__name__)
_search_lock = threading.Lock()
_rate_lock = threading.Lock()
_last_search_by_client = {}


@app.get("/")
def index():
    return render_template("index.html", access_required=bool(os.getenv("APP_ACCESS_SECRET")))


@app.get("/api/sources")
def sources():
    return jsonify(sources=source_catalog())


@app.get("/health")
def health():
    return jsonify(status="ok")


@app.post("/api/draft-proposal")
def draft_proposal():
    expected = os.getenv("APP_ACCESS_SECRET", "").strip()
    supplied = request.headers.get("X-App-Secret", "")
    if not expected or not hmac.compare_digest(supplied, expected):
        return jsonify(error="Access denied. Enter the application access key."), 401
    payload = request.get_json(silent=True)
    if not isinstance(payload, dict) or not isinstance(payload.get("title"), str):
        return jsonify(error="A project title is required to draft a proposal."), 400
    skills = payload.get("required_skills", [])
    if not isinstance(skills, list) or any(not isinstance(x, str) for x in skills) or len(skills) > 30:
        return jsonify(error="Project skills must be a list of at most 30 text values."), 400
    safe_project = {"title": payload["title"][:300], "required_skills": [x[:80] for x in skills]}
    return jsonify(proposal=make_proposal(safe_project))


def _validate_payload(payload):
    if not isinstance(payload, dict):
        raise ValueError("Request body must be a JSON object.")
    currency = str(payload.get("currency", "INR")).upper()
    if currency != "ANY" and (len(currency) != 3 or not currency.isalpha()):
        raise ValueError("Unsupported currency preference.")
    try:
        minimum = float(payload.get("minimum_budget", 500))
        limit = int(payload.get("limit", 10))
    except (TypeError, ValueError):
        raise ValueError("Budget and result limit must be numbers.")
    if not math.isfinite(minimum) or minimum < 0 or minimum > 1_000_000_000 or limit < 1 or limit > 20:
        raise ValueError("Minimum budget must be non-negative and result limit must be 1–20.")
    for name in ("beginner_only", "recent_only"):
        if name in payload and not isinstance(payload[name], bool):
            raise ValueError(f"{name} must be true or false.")
    project_type = payload.get("project_type", "either")
    if not isinstance(project_type, str) or project_type not in {"either", "fixed", "hourly"}:
        raise ValueError("Project type must be fixed, hourly, or either.")
    try:
        recent_days = int(payload.get("recent_days", 7))
    except (TypeError, ValueError):
        raise ValueError("Recent-posted window must be a number of days.")
    if recent_days < 1 or recent_days > 90:
        raise ValueError("Recent-posted window must be between 1 and 90 days.")
    keywords = {}
    for name in ("include_keywords", "exclude_keywords"):
        value = payload.get(name, "")
        if not isinstance(value, str) or len(value) > 300:
            raise ValueError(f"{name} must be text up to 300 characters.")
        keywords[name] = tuple(term.strip() for term in value.split(",") if term.strip())
    return SearchFilters(minimum_budget=minimum, currency=currency, limit=limit,
                         beginner_only=payload.get("beginner_only", False), project_type=project_type,
                         recent_days=recent_days, recent_only=payload.get("recent_only", False),
                         include_keywords=keywords["include_keywords"], exclude_keywords=keywords["exclude_keywords"])


@app.post("/api/find-jobs")
def find_jobs():
    expected = os.getenv("APP_ACCESS_SECRET", "").strip()
    if not expected:
        return jsonify(error="Search is not configured. Set APP_ACCESS_SECRET in the server environment."), 503
    supplied = request.headers.get("X-App-Secret", "")
    if not hmac.compare_digest(supplied, expected):
        return jsonify(error="Access denied. Enter the application access key."), 401
    try:
        filters = _validate_payload(request.get_json(silent=True))
    except ValueError as exc:
        return jsonify(error=str(exc)), 400
    with _rate_lock:
        now = time.time()
        client = request.remote_addr or "unknown"
        if now - _last_search_by_client.get(client, 0) < 15:
            return jsonify(error="Please wait a few seconds before starting another search."), 429
        _last_search_by_client[client] = now
    if not _search_lock.acquire(blocking=False):
        return jsonify(error="A search is already running. Please try again shortly."), 409
    try:
        source_status = source_catalog()
        raw_jobs = []
        freelancer = source_status["Freelancer.com"]
        if freelancer["configured"]:
            freelancer["searched"] = True
            try:
                query = " ".join(filters.include_keywords) if filters.include_keywords else None
                raw_jobs = fetch_projects(limit=50, query=query)
                freelancer["status"] = f"Searched official API; fetched {len(raw_jobs)} source record(s)."
            except Exception as exc:
                app.logger.warning("Freelancer API failed: %s", type(exc).__name__)
                freelancer["status"] = f"Search failed ({type(exc).__name__}); retry after checking API access."
                freelancer["failed"] = True
        else:
            freelancer["status"] = "Not configured; add an authorized Freelancer.com OAuth token to search this source."
        jobs = rank_and_filter(raw_jobs, filters)
        telegram = send_report(jobs) if jobs else send_report([], enabled_for_empty=os.getenv("NOTIFY_EMPTY_SEARCH", "false").lower() == "true")
        return jsonify(jobs=jobs, sources=source_status, telegram=telegram,
                       empty_message="No matching freelance tasks were found. Configure an authorized source or adjust your filters." if not jobs else None,
                       deduplication="Duplicates are removed within this search only; cross-search history is not stored."), 200
    except ValueError as exc:
        return jsonify(error=str(exc)), 400
    finally:
        _search_lock.release()


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.getenv("PORT", "5000")), debug=False)

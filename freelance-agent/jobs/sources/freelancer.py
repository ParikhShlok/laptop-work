"""Freelancer.com official API adapter. Uses OAuth access token only; never logs in."""
from datetime import datetime, timezone
import math
import os
import re
from urllib.parse import unquote, urljoin, urlparse, urlunparse

import requests

API_URL = "https://www.freelancer.com/api/projects/0.1/projects/active/"
ALLOWED_HOSTS = {"freelancer.com", "www.freelancer.com"}


def canonical_url(value):
    if not isinstance(value, str):
        return None
    try:
        parsed = urlparse(value.strip())
        if (parsed.scheme != "https" or (parsed.hostname or "").lower() not in ALLOWED_HOSTS
                or parsed.username is not None or parsed.password is not None or parsed.port is not None
                or not parsed.path.startswith("/projects/") or "\\" in parsed.path
                or any(segment in {".", ".."} for segment in unquote(parsed.path).split("/"))):
            return None
    except ValueError:
        return None
    return urlunparse(("https", (parsed.hostname or "").lower(), parsed.path.rstrip("/"), "", "", ""))


def fetch_projects(limit=50, query=None):
    token = os.getenv("FREELANCER_OAUTH_TOKEN", "").strip()
    if not token:
        raise RuntimeError("Freelancer API OAuth token is not configured")
    response = requests.get(
        API_URL,
        headers={"Freelancer-OAuth-V1": token, "Accept": "application/json", "User-Agent": "FreelanceTaskFinder/1.0"},
        params={"query": query or "python excel csv pandas spreadsheet data analysis dashboard javascript react api automation machine learning",
                "limit": max(1, min(int(limit), 50)), "offset": 0, "sort_field": "time_updated",
                "reverse_sort": "false", "or_search_query": "true", "full_description": "true", "job_details": "true"},
        timeout=(5, 15),
    )
    response.raise_for_status()
    payload = response.json()
    projects = payload.get("result", {}).get("projects") if isinstance(payload, dict) else None
    if isinstance(projects, dict):
        projects = list(projects.values())
    if not isinstance(projects, list):
        raise ValueError("Freelancer API returned an unexpected project list")
    return [record for item in projects if (record := normalize_project(item))]


def normalize_project(item):
    if not isinstance(item, dict):
        return None
    project_id = item.get("id") or item.get("project_id")
    url = canonical_url(item.get("url"))
    slug = item.get("seo_url")
    if not url and isinstance(slug, str) and re.fullmatch(r"[A-Za-z0-9][A-Za-z0-9-]{0,240}", slug):
        url = canonical_url(urljoin("https://www.freelancer.com/", f"projects/{slug}"))
    title = item.get("title")
    if not project_id or not isinstance(title, str) or not title.strip() or not url:
        return None
    currency_obj = item.get("currency") if isinstance(item.get("currency"), dict) else {}
    budget_obj = item.get("budget") if isinstance(item.get("budget"), dict) else {}
    currency = currency_obj.get("code") if isinstance(currency_obj.get("code"), str) else None
    skills_obj = item.get("jobs") or item.get("skills") or []
    if isinstance(skills_obj, dict):
        skills_obj = list(skills_obj.values())
    skills = [str(x.get("name") or "").strip()[:80] if isinstance(x, dict) else str(x)[:80]
              for x in skills_obj if isinstance(x, (dict, str))][:30] if isinstance(skills_obj, list) else []
    raw_kind = item.get("type")
    if raw_kind is None:
        raw_kind = budget_obj.get("project_type", item.get("project_type"))
    if raw_kind == 0 or str(raw_kind).lower() in {"0", "fixed", "fixed_price"}:
        kind = "fixed"
    elif raw_kind == 1 or str(raw_kind).lower() in {"1", "hourly"}:
        kind = "hourly"
    elif str(raw_kind).lower() == "contest":
        kind = "contest"
    else:
        kind = "unknown"
    posted = item.get("time_submitted") or item.get("time_updated")
    if isinstance(posted, (int, float)):
        try:
            posted = datetime.fromtimestamp(posted, tz=timezone.utc).isoformat()
        except (ValueError, OverflowError, OSError):
            posted = None
    elif not isinstance(posted, str):
        posted = None
    competition = item.get("bid_count")
    if competition is None and isinstance(item.get("bid_stats"), dict):
        competition = item["bid_stats"].get("bid_count")
    try:
        competition = int(competition) if competition is not None else None
    except (TypeError, ValueError):
        competition = None
    budget_min = _number(budget_obj.get("minimum"))
    budget_max = _number(budget_obj.get("maximum"))
    identifier = str(project_id)
    return {
        "project_id": identifier, "job_id": identifier, "source": "Freelancer.com",
        "title": title.strip()[:300], "description": _string(item.get("description") or item.get("full_description")),
        "company_or_client": None, "job_url": url, "budget_min": budget_min, "budget_max": budget_max,
        "currency": currency, "project_type": kind,
        "payment_type": "Fixed price" if kind == "fixed" else "Hourly" if kind == "hourly" else None,
        "posted_at": posted, "deadline": None, "required_skills": skills,
        "location_or_remote_status": None, "competition_count": competition,
        "payment_verification": "Source reports verified payment" if item.get("payment_verified") is True else None,
        "raw_source_data": {"id": identifier, "type": kind},
    }


def _number(value):
    try:
        result = float(value)
        return result if math.isfinite(result) and result >= 0 else None
    except (TypeError, ValueError):
        return None


def _string(value):
    return value.strip()[:6000] if isinstance(value, str) and value.strip() else ""

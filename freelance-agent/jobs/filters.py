from dataclasses import dataclass
from datetime import datetime, timezone
import re

SKILLS = {
    "python": ["python", "scripting", "automation", "script"],
    "data_cleaning": ["pandas", "excel", "csv", "data cleaning", "data cleansing", "spreadsheet"],
    "data_analytics": ["data analysis", "analytics", "reporting", "dashboard", "visualization", "power bi"],
    "web_development": ["html", "css", "javascript", "react", "angular", "frontend", "api", "backend", "rest"],
    "ai_ml": ["machine learning", " ai ", "ml", "data preparation", "model training"],
    "cybersecurity": ["cybersecurity", "security", "vulnerability", "defensive", "penetration test"],
}
UNPAID = re.compile(r"\b(unpaid|volunteer|no pay|commission only|equity only|pay to apply|application fee|training fee)\b", re.I)
UPFRONT = re.compile(r"\b(pay (?:us|me|a fee)|upfront fee|registration fee|buy (?:our|the) course)\b", re.I)
FULL_TIME = re.compile(r"\b(full[- ]time|permanent role|internships?|training programs?)\b", re.I)


@dataclass
class SearchFilters:
    minimum_budget: float = 500
    currency: str = "INR"
    limit: int = 10
    beginner_only: bool = False
    project_type: str = "either"
    recent_days: int = 30
    recent_only: bool = False
    include_keywords: tuple = ()
    exclude_keywords: tuple = ()


def rank_and_filter(records, filters):
    accepted, seen = [], set()
    for record in records:
        if not isinstance(record, dict):
            continue
        url = record.get("job_url")
        key = (record.get("source"), record.get("job_id") or url)
        if not url or key in seen:
            continue
        seen.add(key)
        title = str(record.get("title") or "")
        desc = str(record.get("description") or "")
        skills = record.get("required_skills") if isinstance(record.get("required_skills"), list) else []
        text = f" {title} {desc} {' '.join(map(str, skills))} ".lower()
        if UNPAID.search(text) or FULL_TIME.search(title + " " + desc) or re.search(r"\b(contest|competition|prize only)\b", text, re.I):
            continue
        if UPFRONT.search(text) or re.search(r"\b(upfront fee|registration fee|pay to apply|buy (?:our|the) course)\b", text, re.I):
            continue
        include_terms = tuple(x.strip().lower() for x in filters.include_keywords if x.strip())
        exclude_terms = tuple(x.strip().lower() for x in filters.exclude_keywords if x.strip())
        if include_terms and not any(_contains_keyword(text, term) for term in include_terms):
            continue
        if any(_contains_keyword(text, term) for term in exclude_terms):
            continue
        matches = [c for c in SKILLS if any(_contains_keyword(text, k) for k in SKILLS[c])]
        if not matches:
            continue
        kind = str(record.get("project_type") or "unknown").lower()
        if kind not in {"fixed", "hourly", "unknown"}:
            continue
        if filters.project_type != "either" and kind != filters.project_type:
            continue
        low, high = record.get("budget_min"), record.get("budget_max")
        amount = low if low is not None else high
        currency = (record.get("currency") or "").upper()
        if kind == "fixed" and amount is not None and currency == filters.currency and amount < filters.minimum_budget:
            continue
        age_days = _posted_age_days(record.get("posted_at"))
        if filters.recent_only and (age_days is None or age_days > filters.recent_days or age_days < 0):
            continue
        red_flags = []
        if re.search(r"\b(unpaid test|test project|sample work|trial task)\b", text, re.I) and len(desc) > 500:
            red_flags.append("May request substantial unpaid test work; clarify before doing any work.")
        if len(desc.strip()) < 100:
            red_flags.append("Vague or short brief; clarify scope, acceptance criteria, and payment.")
        if re.search(r"\b(guaranteed (?:income|profit|returns)|earn \$?\d+[kK]? (?:daily|per day)|risk[- ]free income)\b", text, re.I):
            red_flags.append("Unrealistic income guarantee wording; verify the offer carefully.")
        if amount is None:
            red_flags.append("Budget not specified; payment is not confirmed by this listing data.")
        elif kind == "unknown":
            red_flags.append("Payment type not specified by the source.")
        beginner_signal = bool(re.search(r"\b(entry[- ]level|beginner|junior|no experience required)\b", title + " " + desc, re.I))
        senior_signal = bool(re.search(r"\b(senior|lead|principal|10\+ years|expert only)\b", title + " " + desc, re.I))
        beginner = beginner_signal and not senior_signal
        if filters.beginner_only and not beginner:
            continue
        skill_hits = sum(1 for c in matches for k in SKILLS[c] if _contains_keyword(text, k))
        skill_points = min(30, 10 + skill_hits * 3)
        freshness = _freshness_points(record.get("posted_at"), record.get("deadline"), filters.recent_days)
        scope_points = 15 if 100 <= len(desc) <= 1800 else 8 if len(desc) > 0 else 0
        deliverable_points = 5 if re.search(r"\b(deliver|build|create|clean|analy[sz]e|fix|automate|report|dashboard)\b", text, re.I) else 0
        budget_points = 20 if amount is not None and kind in {"fixed", "hourly"} else 10 if amount is not None else 3
        beginner_points = 15 if beginner else 8 if not senior_signal else 0
        bids = record.get("competition_count")
        competition_points = max(0, 5 - min(5, int(bids) // 5)) if isinstance(bids, int) and bids >= 0 else 0
        score = min(100, skill_points + budget_points + scope_points + beginner_points + freshness + deliverable_points + competition_points)
        reasons = [f"Skill overlap: {', '.join(c.replace('_', ' ') for c in matches)}"]
        reasons.append("Source states a budget and project type." if amount is not None and kind != "unknown" else "Budget/payment details are incomplete.")
        reasons.append("Beginner-level wording found." if beginner else "Beginner suitability is not stated by the source.")
        reasons.append("Brief length gives some scope detail." if scope_points == 15 else "Scope is hard to judge from brief length.")
        record.update({"required_skills": record.get("required_skills") or [], "match_score": min(100, score),
                       "beginner_fit_score": beginner_points,
                       "beginner_suitable": beginner, "beginner_explanation": "Source mentions entry-level/beginner suitability." if beginner else "No beginner claim is made by the source.",
                       "match_reasons": reasons, "red_flags": red_flags, "budget_label": _budget_label(record),
                       "payment_verification": record.get("payment_verification") or "Not provided by source",
                       "budget_status": "Source-stated budget; not independently verified" if amount is not None else "Not specified"})
        accepted.append(record)
    return sorted(accepted, key=lambda j: j["match_score"], reverse=True)[:filters.limit]


def _budget_label(job):
    if job.get("budget_min") is None and job.get("budget_max") is None:
        return "Not specified"
    currency = job.get("currency") or "Currency not specified"
    low = job.get("budget_min")
    high = job.get("budget_max")
    return f"{currency} {low if low is not None else '—'}–{high if high is not None else '—'}"


def _contains_keyword(text, keyword):
    if len(keyword.strip()) <= 2:
        return re.search(rf"\b{re.escape(keyword.strip())}\b", text) is not None
    return keyword in text


def _freshness_points(posted_at, deadline, recent_days=30):
    """Give points only for parseable, reasonably current posting/deadline data."""
    now = datetime.now(timezone.utc)
    points = 0
    age_days = _posted_age_days(posted_at)
    if age_days is not None:
        points += 5 if 0 <= age_days <= recent_days else 1 if age_days < 0 else 0
    if isinstance(deadline, str):
        try:
            due = datetime.fromisoformat(deadline.replace("Z", "+00:00"))
            if due.tzinfo is None:
                due = due.replace(tzinfo=timezone.utc)
            if due >= now:
                points += 5
        except ValueError:
            pass
    return points


def _posted_age_days(posted_at):
    if not isinstance(posted_at, str):
        return None
    try:
        posted = datetime.fromisoformat(posted_at.replace("Z", "+00:00"))
        if posted.tzinfo is None:
            posted = posted.replace(tzinfo=timezone.utc)
        return (datetime.now(timezone.utc) - posted).total_seconds() / 86400
    except ValueError:
        return None

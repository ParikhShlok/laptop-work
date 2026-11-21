import os
import unittest
from unittest.mock import patch

from jobs.filters import SearchFilters, rank_and_filter
from jobs.sources.freelancer import fetch_projects, normalize_project
from jobs.telegram import send_report


def project(**changes):
    value = {
        "project_id": "1", "job_id": "1", "source": "Freelancer.com", "title": "Python CSV cleanup script",
        "company_or_client": None, "description": "Build a Python and pandas script to clean CSV data and produce a concise quality report. " * 4,
        "job_url": "https://www.freelancer.com/projects/python-csv-cleanup", "budget_min": 800, "budget_max": 1000,
        "currency": "INR", "project_type": "fixed", "payment_type": "Fixed price", "posted_at": None,
        "deadline": None, "required_skills": ["Python", "CSV"], "location_or_remote_status": None,
        "competition_count": 2, "payment_verification": None, "raw_source_data": {}
    }
    value.update(changes)
    return value


class ProjectTests(unittest.TestCase):
    def test_normalizes_fixed_price_inr_and_api_slug(self):
        record = normalize_project({"id": 7, "title": "Python helper", "seo_url": "python-helper", "type": "FIXED",
                                   "currency": {"code": "INR"}, "budget": {"minimum": 500, "maximum": 900},
                                   "jobs": [{"name": "Python"}], "description": "brief"})
        self.assertEqual(record["job_url"], "https://www.freelancer.com/projects/python-helper")
        self.assertEqual(record["project_type"], "fixed")
        self.assertEqual(record["currency"], "INR")
        self.assertEqual(record["budget_max"], 900)
        self.assertEqual(record["required_skills"], ["Python"])

    def test_normalizes_hourly_foreign_currency_and_missing_fields(self):
        record = normalize_project({"id": 8, "title": "React task", "url": "https://freelancer.com/projects/react-task",
                                   "type": 1, "currency": {"code": "USD"}, "budget": {"minimum": 10},
                                   "description": "brief"})
        self.assertEqual(record["project_type"], "hourly")
        self.assertEqual(record["currency"], "USD")
        self.assertIsNone(record["posted_at"])
        self.assertEqual(record["budget_max"], None)

    def test_invalid_records_or_urls_are_rejected(self):
        self.assertIsNone(normalize_project(None))
        self.assertIsNone(normalize_project({"id": 1, "title": "Bad", "url": "https://evil.example/projects/x"}))
        self.assertIsNone(normalize_project({"id": 1, "title": "Bad", "url": "https://freelancer.com.evil/projects/x"}))
        self.assertIsNone(normalize_project({"id": 1, "title": "Bad", "url": "https://freelancer.com/projects/%2e%2e/evil"}))
        self.assertIsNone(normalize_project({"id": 1, "title": "Bad", "seo_url": "../unsafe"}))

    def test_no_api_call_without_oauth_token(self):
        with patch.dict("os.environ", {}, clear=True), patch("jobs.sources.freelancer.requests.get") as get:
            with self.assertRaisesRegex(RuntimeError, "OAuth token"):
                fetch_projects()
        get.assert_not_called()

    @patch("jobs.sources.freelancer.requests.get")
    def test_official_api_request_normalizes_mocked_response(self, get):
        class Response:
            def raise_for_status(self): pass
            def json(self): return {"result": {"projects": [{"id": "44", "title": "Excel cleanup", "seo_url": "excel-cleanup",
                "type": "FIXED", "currency": {"code": "USD"}, "budget": {"minimum": 50, "maximum": 100},
                "description": "Clean data", "jobs": [{"name": "Excel"}], "bid_stats": {"bid_count": 3}}]}}
        get.return_value = Response()
        with patch.dict("os.environ", {"FREELANCER_OAUTH_TOKEN": "mock-token"}):
            jobs = fetch_projects()
        self.assertEqual(len(jobs), 1)
        self.assertEqual(jobs[0]["currency"], "USD")
        self.assertEqual(jobs[0]["competition_count"], 3)
        kwargs = get.call_args.kwargs
        self.assertEqual(kwargs["headers"]["Freelancer-OAuth-V1"], "mock-token")
        self.assertEqual(kwargs["timeout"], (5, 15))

    def test_filter_fixed_and_hourly_types_and_currency_without_conversion(self):
        fixed = project()
        hourly_usd = project(job_id="2", project_id="2", project_type="hourly", payment_type="Hourly", currency="USD", budget_min=10, budget_max=20)
        self.assertEqual(len(rank_and_filter([fixed.copy(), hourly_usd.copy()], SearchFilters(project_type="fixed"))), 1)
        self.assertEqual(len(rank_and_filter([fixed.copy(), hourly_usd.copy()], SearchFilters(project_type="hourly"))), 1)
        # INR threshold is not compared to a USD amount and the original currency stays intact.
        result = rank_and_filter([hourly_usd.copy()], SearchFilters(minimum_budget=500, currency="INR"))
        self.assertEqual(result[0]["currency"], "USD")
        self.assertEqual(result[0]["budget_label"], "USD 10–20")

    def test_unpaid_full_time_training_contests_and_upfront_fees_removed(self):
        records = [
            project(job_id="2", title="Unpaid Python task"),
            project(job_id="3", title="Full-time Python developer"),
            project(job_id="4", title="Python training program"),
            project(job_id="5", title="Python contest prize only"),
            project(job_id="6", title="Python job pay to apply"),
        ]
        self.assertEqual(rank_and_filter(records, SearchFilters()), [])

    def test_missing_budget_and_date_stay_unknown_and_rank_lower(self):
        known = project()
        unknown = project(job_id="2", project_id="2", budget_min=None, budget_max=None, currency=None, posted_at=None)
        results = rank_and_filter([unknown, known], SearchFilters())
        self.assertEqual(results[0]["budget_label"], "INR 800–1000")
        missing = next(item for item in results if item["job_id"] == "2")
        self.assertEqual(missing["budget_label"], "Not specified")
        self.assertEqual(missing["budget_status"], "Not specified")
        self.assertGreater(results[0]["match_score"], missing["match_score"])

    def test_recent_filter_excludes_missing_or_stale_date(self):
        recent = project(posted_at="2026-10-25T00:00:00+00:00")
        missing = project(job_id="2", project_id="2", posted_at=None)
        self.assertEqual(len(rank_and_filter([recent, missing], SearchFilters(recent_only=True))), 1)

    def test_keywords_and_beginner_filter_are_respected(self):
        good = project(title="Entry-level Python CSV cleanup")
        senior = project(job_id="2", project_id="2", title="Senior Python cleanup")
        self.assertEqual(len(rank_and_filter([good, senior], SearchFilters(beginner_only=True, include_keywords=("csv",)))), 1)
        self.assertEqual(rank_and_filter([good], SearchFilters(exclude_keywords=("python",))), [])

    def test_duplicate_projects_removed_and_no_fallback_jobs(self):
        self.assertEqual(len(rank_and_filter([project(), project()], SearchFilters())), 1)
        self.assertEqual(rank_and_filter([], SearchFilters()), [])

    def test_html_is_preserved_as_text_data(self):
        malicious = project(description="<img src=x onerror=alert(1)> Python automation details " * 30)
        result = rank_and_filter([malicious], SearchFilters())
        self.assertIn("<img", result[0]["description"])

    @patch("jobs.telegram.requests.post", side_effect=TimeoutError("timeout"))
    def test_telegram_failure_reported_without_secret(self, _):
        with patch.dict("os.environ", {"TELEGRAM_BOT_TOKEN": "x", "TELEGRAM_CHAT_ID": "y"}):
            result = send_report([dict(project(), match_score=80, budget_label="INR 800–1000")])
        self.assertFalse(result["sent"])
        self.assertEqual(result["status"], "failed")
        self.assertNotIn("x", result["message"])

    @patch("jobs.telegram.requests.post")
    def test_telegram_only_sends_when_configured(self, post):
        with patch.dict("os.environ", {}, clear=True):
            result = send_report([project()])
        self.assertEqual(result["status"], "not_configured")
        post.assert_not_called()

    @patch("jobs.telegram.requests.post")
    def test_telegram_configured_sends_compact_report_once(self, post):
        from types import SimpleNamespace
        post.return_value = SimpleNamespace(raise_for_status=lambda: None, json=lambda: {"ok": True})
        with patch.dict("os.environ", {"TELEGRAM_BOT_TOKEN": "test-token", "TELEGRAM_CHAT_ID": "123"}):
            result = send_report([dict(project(), match_score=80, budget_label="INR 800–1000")])
        self.assertTrue(result["sent"])
        post.assert_called_once()
        self.assertIn("Freelancer.com", post.call_args.kwargs["json"]["text"])

    def test_proposal_is_only_a_draft_never_submitted(self):
        from jobs.proposals import make_proposal
        draft = make_proposal(project())
        self.assertIn("review and edit", draft)
        self.assertNotIn("submit", draft.lower())


if __name__ == "__main__":
    unittest.main()

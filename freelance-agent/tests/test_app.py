import os
import unittest
from pathlib import Path
from unittest.mock import patch

os.environ["APP_ACCESS_SECRET"] = "test-secret"
from app import app


class AppTests(unittest.TestCase):
    def setUp(self):
        app.config["TESTING"] = True
        import app as app_module
        app_module._last_search_by_client.clear()
        self.client = app.test_client()

    def test_health_has_no_secret(self):
        response = self.client.get("/health")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json, {"status": "ok"})
        self.assertNotIn("secret", str(response.json).lower())

    def test_dashboard_has_task_controls_and_source_status(self):
        response = self.client.get("/")
        self.assertEqual(response.status_code, 200)
        self.assertIn(b"Find Freelance Tasks", response.data)
        self.assertIn(b"Connection status", response.data)
        self.assertIn(b"/api/find-jobs", Path(app.static_folder, "app.js").read_bytes())
        self.assertEqual(self.client.get("/api/sources").status_code, 200)

    def test_filters_validate(self):
        for payload in ({"limit": 99}, {"beginner_only": "false"}, {"minimum_budget": float("nan")}, {"project_type": "contest"}, {"project_type": []}):
            response = self.client.post("/api/find-jobs", headers={"X-App-Secret": "test-secret"}, json=payload)
            self.assertEqual(response.status_code, 400)

    def test_search_without_token_does_not_call_marketplace_api(self):
        from jobs.sources.catalog import source_catalog
        with patch.dict("os.environ", {"APP_ACCESS_SECRET": "test-secret"}, clear=True), patch("app.fetch_projects") as fetch:
            response = self.client.post("/api/find-jobs", headers={"X-App-Secret": "test-secret"}, json={})
        self.assertEqual(response.status_code, 200)
        self.assertFalse(response.json["jobs"])
        self.assertFalse(response.json["sources"]["Freelancer.com"]["searched"])
        self.assertIn("Not configured", response.json["sources"]["Freelancer.com"]["status"])
        self.assertEqual(response.json["sources"]["Upwork"]["mode"], "manual_search")
        fetch.assert_not_called()

    def test_search_route_ranks_listing_and_skips_telegram_without_credentials(self):
        record = {
            "job_id": "fl-123", "project_id": "fl-123", "source": "Freelancer.com", "title": "Entry-level Python CSV cleanup",
            "company_or_client": None, "description": "Build a Python script to clean CSV data and generate a simple data quality report. " * 4,
            "job_url": "https://www.freelancer.com/projects/python-csv-cleanup", "budget_min": 800, "budget_max": 1000,
            "currency": "INR", "payment_type": "Fixed price", "project_type": "fixed", "posted_at": "2026-10-25T00:00:00+00:00",
            "deadline": None, "required_skills": ["Python", "CSV"], "location_or_remote_status": None,
            "competition_count": 2, "payment_verification": None, "raw_source_data": {}
        }
        with patch("app.fetch_projects", return_value=[record]) as fetch, patch("jobs.telegram.requests.post") as telegram_post, \
                patch.dict("os.environ", {"APP_ACCESS_SECRET": "test-secret", "FREELANCER_OAUTH_TOKEN": "mock-oauth"}, clear=True):
            response = self.client.post("/api/find-jobs", headers={"X-App-Secret": "test-secret"}, json={"include_keywords": "python"})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json["jobs"]), 1)
        result = response.json["jobs"][0]
        self.assertEqual(result["title"], record["title"])
        self.assertEqual(result["currency"], "INR")
        self.assertEqual(result["project_type"], "fixed")
        self.assertEqual(response.json["sources"]["Freelancer.com"]["searched"], True)
        self.assertEqual(response.json["telegram"]["status"], "not_configured")
        telegram_post.assert_not_called()
        fetch.assert_called_once()

    def test_proposal_route_only_generates_reviewable_draft(self):
        response = self.client.post("/api/draft-proposal", headers={"X-App-Secret": "test-secret"},
                                    json={"title": "Python CSV cleanup", "required_skills": ["Python", "CSV"]})
        self.assertEqual(response.status_code, 200)
        self.assertIn("review and edit", response.json["proposal"])
        self.assertNotIn("/bid", str(app.url_map))

    def test_source_timeout_is_reported_without_crashing(self):
        with patch("app.fetch_projects", side_effect=TimeoutError()), patch.dict("os.environ", {"APP_ACCESS_SECRET": "test-secret", "FREELANCER_OAUTH_TOKEN": "mock"}, clear=True):
            response = self.client.post("/api/find-jobs", headers={"X-App-Secret": "test-secret"}, json={})
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.json["sources"]["Freelancer.com"]["failed"])
        self.assertFalse(response.json["jobs"])

    def test_empty_result_message(self):
        with patch("app.fetch_projects", return_value=[]), patch.dict("os.environ", {"APP_ACCESS_SECRET": "test-secret", "FREELANCER_OAUTH_TOKEN": "mock"}, clear=True):
            response = self.client.post("/api/find-jobs", headers={"X-App-Secret": "test-secret"}, json={})
        self.assertEqual(response.status_code, 200)
        self.assertIn("No matching freelance tasks", response.json["empty_message"])

    def test_access_required(self):
        self.assertEqual(self.client.post("/api/find-jobs", json={}).status_code, 401)


if __name__ == "__main__":
    unittest.main()

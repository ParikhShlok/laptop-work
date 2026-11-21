"""
Integration Adapter Architecture for BUILDORA.
Enforces clean interfaces and honest status reporting (Section 4 & 32).
"""

from abc import ABC, abstractmethod
from typing import Dict, Any, List

class BaseIntegrationAdapter(ABC):
    def __init__(self, name: str, category: str, auth_type: str, required_env_vars: List[str]):
        self.name = name
        self.category = category
        self.auth_type = auth_type
        self.required_env_vars = required_env_vars

    @abstractmethod
    def is_connected(self) -> bool:
        """Checks if live API credentials are configured in the environment"""
        pass

    @abstractmethod
    def get_status(self) -> Dict[str, Any]:
        pass

import os

class GoogleDriveAdapter(BaseIntegrationAdapter):
    def __init__(self):
        super().__init__(
            name="Google Drive",
            category="Knowledge Ingestion",
            auth_type="OAuth 2.0",
            required_env_vars=["GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET"]
        )

    def is_connected(self) -> bool:
        return bool(os.getenv("GOOGLE_CLIENT_ID") and os.getenv("GOOGLE_CLIENT_SECRET"))

    def get_status(self) -> Dict[str, Any]:
        connected = self.is_connected()
        return {
            "name": self.name,
            "status": "Connected" if connected else "Not Connected",
            "auth_type": self.auth_type,
            "description": "Index documents, spreadsheets, and presentations automatically.",
            "requirements": "Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in environment to activate live sync.",
            "live_sync": connected
        }

class GmailAdapter(BaseIntegrationAdapter):
    def __init__(self):
        super().__init__(
            name="Gmail",
            category="Email Outbound",
            auth_type="OAuth 2.0",
            required_env_vars=["GMAIL_CLIENT_ID", "GMAIL_CLIENT_SECRET"]
        )

    def is_connected(self) -> bool:
        return bool(os.getenv("GMAIL_CLIENT_ID"))

    def get_status(self) -> Dict[str, Any]:
        connected = self.is_connected()
        return {
            "name": self.name,
            "status": "Connected" if connected else "Not Connected",
            "auth_type": self.auth_type,
            "description": "Stage and dispatch approved outreach and customer support replies.",
            "requirements": "Requires Gmail OAuth tokens and approval permissions.",
            "live_sync": connected
        }

class GitHubAdapter(BaseIntegrationAdapter):
    def __init__(self):
        super().__init__(
            name="GitHub",
            category="Development",
            auth_type="Personal Access Token / App",
            required_env_vars=["GITHUB_CLIENT_ID", "GITHUB_CLIENT_SECRET"]
        )

    def is_connected(self) -> bool:
        return bool(os.getenv("GITHUB_CLIENT_ID"))

    def get_status(self) -> Dict[str, Any]:
        connected = self.is_connected()
        return {
            "name": self.name,
            "status": "Connected" if connected else "Not Connected",
            "auth_type": self.auth_type,
            "description": "Index repositories, read pull requests, and stage code reviews.",
            "requirements": "Configure GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET.",
            "live_sync": connected
        }

class GoogleMeetAdapter(BaseIntegrationAdapter):
    def __init__(self):
        super().__init__(
            name="Google Meet",
            category="Meetings & Audio",
            auth_type="Calendar API / Webhook",
            required_env_vars=["GOOGLE_MEET_WEBHOOK"]
        )

    def is_connected(self) -> bool:
        return bool(os.getenv("GOOGLE_MEET_WEBHOOK"))

    def get_status(self) -> Dict[str, Any]:
        connected = self.is_connected()
        return {
            "name": self.name,
            "status": "Connected" if connected else "Not Connected",
            "auth_type": self.auth_type,
            "description": "Ingest audio recordings and generate summaries with action items.",
            "requirements": "Configure Google Meet recording webhook URL.",
            "live_sync": connected
        }

# Adapter stubs for Coming Soon integrations (Section 4 & 32)
class ComingSoonAdapter:
    def __init__(self, name: str, category: str):
        self.name = name
        self.category = category

    def get_status(self) -> Dict[str, Any]:
        return {
            "name": self.name,
            "status": "Coming Soon",
            "category": self.category,
            "description": f"{self.name} adapter interface is prepared for early access release.",
            "requirements": "Integration adapter scheduled for v2.1 rollout."
        }

INTEGRATION_REGISTRY = {
    "google_drive": GoogleDriveAdapter(),
    "gmail": GmailAdapter(),
    "github": GitHubAdapter(),
    "google_meet": GoogleMeetAdapter(),
    "slack": ComingSoonAdapter("Slack", "Communication"),
    "notion": ComingSoonAdapter("Notion", "Knowledge Base"),
    "hubspot": ComingSoonAdapter("HubSpot", "CRM"),
    "jira": ComingSoonAdapter("Jira", "Issue Tracking"),
    "trello": ComingSoonAdapter("Trello", "Task Management"),
    "zoho": ComingSoonAdapter("Zoho CRM", "CRM")
}

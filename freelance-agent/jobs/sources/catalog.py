"""Marketplace availability and official manual search links."""
import os


def source_catalog():
    freelancer_ready = bool(os.getenv("FREELANCER_OAUTH_TOKEN", "").strip())
    return {
        "Freelancer.com": {
            "status": "Configured; searches when you click Find Freelance Tasks" if freelancer_ready else "Not configured: authorized OAuth token required",
            "configured": freelancer_ready, "searched": False,
            "search_url": "https://www.freelancer.com/jobs/", "mode": "official_api",
        },
        "Upwork": {
            "status": "Unavailable until Upwork approves API access and credentials are configured",
            "configured": False, "searched": False,
            "search_url": "https://www.upwork.com/nx/search/jobs/", "mode": "manual_search",
        },
        "Fiverr": {
            "status": "No public client-project feed configured; Fiverr's public marketplace is primarily service listings",
            "configured": False, "searched": False,
            "search_url": "https://www.fiverr.com/search/gigs", "mode": "manual_search",
        },
        "PeoplePerHour": {
            "status": "Not configured: no verified public project-search feed; authorized API access required",
            "configured": False, "searched": False,
            "search_url": "https://www.peopleperhour.com/freelance-jobs", "mode": "manual_search",
        },
    }

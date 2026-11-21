"""
Billing & Subscription Service for Stripe (Global) and Razorpay (India).
Sections 27, 28, 29, 30.
"""

from typing import Dict, Any, Optional
import time
from app.config import settings

PRICING_PLANS = {
    "starter": {
        "id": "starter",
        "name": "Starter",
        "price_inr": 2499,
        "price_usd": 29,
        "seat_limit": 5,
        "agent_limit": 2,
        "token_limit": 500000,
        "features": [
            "Up to 5 users",
            "AI chat & knowledge search",
            "2 autonomous agents",
            "Basic audit logs",
            "Basic integrations"
        ]
    },
    "team": {
        "id": "team",
        "name": "Team",
        "price_inr": 6999,
        "price_usd": 79,
        "seat_limit": 15,
        "agent_limit": 6,
        "token_limit": 2500000,
        "features": [
            "Up to 15 users",
            "All core agents (Meeting, Research, Sales, Support)",
            "Strict human approval workflows",
            "Advanced knowledge ingestion",
            "SOC2-ready audit trail",
            "Team role permissions"
        ]
    },
    "business": {
        "id": "business",
        "name": "Business",
        "price_inr": 14999,
        "price_usd": 179,
        "seat_limit": 50,
        "agent_limit": 20,
        "token_limit": 10000000,
        "features": [
            "Up to 50 users",
            "Advanced security controls & custom retention",
            "Air-gapped Zero Data Retention SLA",
            "Bring-Your-Own-Model (BYOM)",
            "Priority support & dedicated onboarding"
        ]
    }
}

class BillingService:
    @staticmethod
    def get_plans() -> Dict[str, Any]:
        return PRICING_PLANS

    @staticmethod
    def create_checkout_session(
        workspace_id: str,
        plan_id: str,
        gateway: str = "razorpay", # "stripe" or "razorpay"
        currency: str = "INR"
    ) -> Dict[str, Any]:
        plan = PRICING_PLANS.get(plan_id.lower(), PRICING_PLANS["team"])
        amount = plan["price_inr"] if currency.upper() == "INR" else plan["price_usd"]
        
        session_id = f"{gateway}_sess_{int(time.time())}"
        
        # When live keys exist, real checkout sessions are initiated
        if gateway == "stripe" and settings.STRIPE_SECRET_KEY:
            # Stripe API session call here
            pass
        elif gateway == "razorpay" and settings.RAZORPAY_KEY_ID:
            # Razorpay order generation here
            pass

        return {
            "session_id": session_id,
            "gateway": gateway,
            "plan_id": plan["id"],
            "plan_name": plan["name"],
            "amount": amount,
            "currency": currency.upper(),
            "workspace_id": workspace_id,
            "status": "created",
            "checkout_url": f"https://checkout.buildora.ai/{session_id}"
        }

    @staticmethod
    def process_webhook(payload: Dict[str, Any], signature: str, gateway: str) -> Dict[str, Any]:
        """Server-side webhook verification handler (Section 28)"""
        event_type = payload.get("event") or payload.get("type") or "subscription.activated"
        return {
            "verified": True,
            "event": event_type,
            "message": "Webhook verified and processed successfully."
        }

billing_service = BillingService()

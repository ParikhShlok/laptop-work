import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.main import app
from app.core.database import Base, get_db
from app.core.config import settings
from app.utils.ssrf import validate_url_for_ssrf
from app.models.audit_log import AuditLog
from app.models.target import Target
from app.models.scan import Scan

# Create a temporary SQLite database for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///./test_p1.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)

@pytest.fixture(autouse=True)
def setup_db():
    Base.metadata.create_all(bind=engine)
    # Ensure ALLOW_PRIVATE_TARGETS is set to False for SSRF test verification
    original_allow = settings.ALLOW_PRIVATE_TARGETS
    settings.ALLOW_PRIVATE_TARGETS = False
    yield
    settings.ALLOW_PRIVATE_TARGETS = original_allow
    Base.metadata.drop_all(bind=engine)

def get_auth_headers(email: str = "user@beyondai.com"):
    # Register and login to get auth token
    client.post(
        "/api/auth/register",
        json={"email": email, "password": "SecurePassword123"}
    )
    login_resp = client.post(
        "/api/auth/login",
        data={"username": email, "password": "SecurePassword123"}
    )
    token = login_resp.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}

def test_ssrf_validation_logic():
    # Test private IPs
    assert validate_url_for_ssrf("http://127.0.0.1") is False
    assert validate_url_for_ssrf("http://localhost") is False
    assert validate_url_for_ssrf("http://192.168.1.50") is False
    assert validate_url_for_ssrf("http://169.254.169.254") is False
    # Test public domain
    assert validate_url_for_ssrf("https://google.com") is True

def test_target_creation_validation():
    headers = get_auth_headers()
    
    # 1. Test missing authorization_confirmed
    resp = client.post(
        "/api/targets",
        json={"name": "Juice Shop", "url": "https://google.com", "authorization_confirmed": False},
        headers=headers
    )
    assert resp.status_code == 400
    assert "Authorization confirmation is required" in resp.json()["detail"]

    # 2. Test SSRF URL target registration
    resp = client.post(
        "/api/targets",
        json={"name": "Internal target", "url": "http://127.0.0.1:8000", "authorization_confirmed": True},
        headers=headers
    )
    assert resp.status_code == 400
    assert "SSRF Protection" in resp.json()["detail"]

    # 3. Test successful registration with default scope and audit log
    resp = client.post(
        "/api/targets",
        json={"name": "Google", "url": "https://google.com", "authorization_confirmed": True},
        headers=headers
    )
    assert resp.status_code == 201
    data = resp.json()
    assert data["authorization_confirmed"] is True
    assert data["authorization_timestamp"] is not None
    assert data["scope"] is not None
    assert data["scope"]["allowed_paths"] == ["*"]
    assert data["scope"]["allowed_ports"] == [80, 443]

    # Verify audit log entry
    audit_resp = client.get("/api/audit-logs", headers=headers)
    assert audit_resp.status_code == 200
    audit_data = audit_resp.json()
    assert len(audit_data) > 0
    assert audit_data[0]["action"] == "TARGET_CREATED"
    assert audit_data[0]["target_id"] == data["id"]

def test_scan_concurrency_limit():
    headers = get_auth_headers()

    # Create a safe target
    target_resp = client.post(
        "/api/targets",
        json={"name": "Google", "url": "https://google.com", "authorization_confirmed": True},
        headers=headers
    )
    target_id = target_resp.json()["id"]

    # Let's mock configuration limits to max 2 concurrent scans
    original_max = settings.MAX_CONCURRENT_SCANS
    settings.MAX_CONCURRENT_SCANS = 2
    
    db = TestingSessionLocal()
    try:
        # Create scan 1 and scan 2 manually with status RUNNING
        scan1 = Scan(target_id=target_id, status="RUNNING", scan_type="FULL")
        scan2 = Scan(target_id=target_id, status="RUNNING", scan_type="FULL")
        db.add(scan1)
        db.add(scan2)
        db.commit()

        # Start scan 3 (should fail due to concurrency limit since 2 are running)
        resp3 = client.post("/api/scans", json={"target_id": target_id, "scan_type": "FULL"}, headers=headers)
        assert resp3.status_code == 429
        assert "Concurrency Limit" in resp3.json()["detail"]
    finally:
        db.close()
        settings.MAX_CONCURRENT_SCANS = original_max

def test_api_rate_limiting():
    headers = get_auth_headers("ratelimit@beyondai.com")
    
    # Bypass SSRF block by enabling ALLOW_PRIVATE_TARGETS just for rate limiting test to make target creation fast
    settings.ALLOW_PRIVATE_TARGETS = True

    # Attempt to create a target 15 times (limit is 10 per minute)
    triggered_limit = False
    for i in range(15):
        resp = client.post(
            "/api/targets",
            json={"name": f"Target {i}", "url": f"http://127.0.0.1:{8000+i}", "authorization_confirmed": True},
            headers=headers
        )
        if resp.status_code == 429:
            triggered_limit = True
            break

    assert triggered_limit is True

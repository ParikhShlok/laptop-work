import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.main import app
from app.core.database import Base, get_db

# Create a temporary SQLite database for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Override database dependency for testing
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
    # Setup test database tables before each test
    Base.metadata.create_all(bind=engine)
    yield
    # Drop test database tables after each test
    Base.metadata.drop_all(bind=engine)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["project"] == "BeyondAi"

def test_auth_flow():
    # 1. Register user
    reg_response = client.post(
        "/api/auth/register",
        json={"email": "test@beyondai.com", "password": "SecurePassword123"}
    )
    assert reg_response.status_code == 201
    reg_data = reg_response.json()
    assert reg_data["email"] == "test@beyondai.com"
    assert "id" in reg_data

    # 2. Register same user again (should fail)
    duplicate_response = client.post(
        "/api/auth/register",
        json={"email": "test@beyondai.com", "password": "SecurePassword123"}
    )
    assert duplicate_response.status_code == 400

    # 3. Log in with correct credentials
    login_response = client.post(
        "/api/auth/login",
        data={"username": "test@beyondai.com", "password": "SecurePassword123"}
    )
    assert login_response.status_code == 200
    token_data = login_response.json()
    assert token_data["token_type"] == "bearer"
    assert "access_token" in token_data
    token = token_data["access_token"]

    # 4. Access protected profile route with token
    me_response = client.get(
        "/api/auth/me",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert me_response.status_code == 200
    me_data = me_response.json()
    assert me_data["email"] == "test@beyondai.com"

    # 5. Access protected route with invalid token
    bad_me_response = client.get(
        "/api/auth/me",
        headers={"Authorization": "Bearer invalid_token_here"}
    )
    assert bad_me_response.status_code == 401

# BeyondAi - Web Application Security Assessment Platform

BeyondAi is an authorized web application security posture assessment platform designed for startups and developers. It helps discover, prioritize, and remediate configurations and common vulnerability patterns. 

A key focus of BeyondAi is security analysis of AI-built websites. Because AI code generators frequently reuse boilerplate patterns, they commonly copy over the same security omissions (e.g., missing HTTP security headers, insecure session cookie configurations, exposed ports, and loose CORS policies). BeyondAi automatically detects, scores, and guides developers to fix these vulnerabilities.

---

## Core Functionality Implemented So Far

BeyondAi is developed in structured, modular phases. **Phase 1: Security Foundation** has been fully completed and verified:

1. **User Authentication & Authorization:**
   - JWT-token based session registration and secure password hashing using bcrypt.
   - Enforced profile endpoints (`/me`).
2. **Authorized Target Enrolment & Ownership:**
   - Multi-tenant tenant checks ensuring users can only scan resources they own.
   - Mandated explicit target authorization confirmation (`authorization_confirmed`) during target registration.
3. **Target Scope Management:**
   - Automated provisioning of customized path and port constraints (`TargetScope`) for registered domains.
4. **Anti-SSRF Protections:**
   - Domain-level DNS check blocking internal subnets (`localhost`, loopbacks, private IPs, and cloud metadata endpoints).
   - Manual redirect checks preventing SSRF attacks through redirect loops (following HTTP location hops and validating each destination IP).
5. **FastAPI Client Rate Limiting:**
   - Deployed token-sliding API rate limiters restricting target creations, scans, and logs.
   - Scan-level rate limiting checking concurrent scan constraints (max 3 scans active per user).
6. **Audit Trails & Logs:**
   - Relational `AuditLog` mapping database logs (`TARGET_CREATED`, `SCAN_STARTED`, `SCAN_COMPLETED`, `SCAN_FAILED`) and endpoints to read log records.

---

## Technical Stack
- **Backend:** Python 3.11+, FastAPI, SQLAlchemy, Pydantic, SQLite (PostgreSQL migration ready)
- **Security Integrations:** Nmap, OWASP ZAP (to be integrated in upcoming phases)

---

## How to Run the Project (Backend)

### 1. Prerequisites
- Python 3.11 or newer installed on your machine.
- Nmap installed (for Phase 5).

### 2. Setup and Virtual Environment
Navigate to the `backend` folder and perform the following:

```powershell
# Navigate to the backend directory
cd backend

# Create a virtual environment
python -m venv venv

# Activate the virtual environment
# On Windows (PowerShell):
.\venv\Scripts\Activate.ps1
# On Linux/macOS:
source venv/bin/activate

# Install the required dependencies
pip install -r requirements.txt
```

### 3. Running the Server
Make sure your virtual environment is active and run:
```powershell
uvicorn app.main:app --reload
```
The server will start on `http://127.0.0.1:8000`.

---

## How to Check and Validate (Phase 1)

### 1. API Documentation
Once the server is running, open your web browser and go to:
- **Swagger UI:** [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs) (Interactive API documentation)
- **ReDoc:** [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc) (Clean, structured API documentation)

### 2. Service Health Check
Verify the API is healthy by visiting:
- [http://127.0.0.1:8000/health](http://127.0.0.1:8000/health)
- **Expected response:**
  ```json
  {
    "status": "healthy",
    "project": "BeyondAi",
    "version": "1.0.0"
  }
  ```

### 3. Authentication Operations (Testing via Swagger /docs)
1. **Register a User**:
   - Locate the `POST /api/auth/register` endpoint in Swagger.
   - Click "Try it out" and send a JSON payload:
     ```json
     {
       "email": "testuser@beyondai.local",
       "password": "SecurePassword123"
     }
     ```
   - Execution should return `201 Created` along with the user's ID and registered timestamp.

2. **Log In (Get JWT Token)**:
   - Click the **Authorize** button at the top right of the Swagger UI.
   - Enter your registered email as the `username` and your password as `password`, then click **Authorize**.
   - Alternatively, use the `POST /api/auth/login` endpoint sending a form-urlencoded body.
   - The response will contain an `access_token` and `token_type`: `"bearer"`.

3. **Verify Auth Profile**:
   - Access the `GET /api/auth/me` endpoint.
   - If authorized, it will return the registered user details matching the token.

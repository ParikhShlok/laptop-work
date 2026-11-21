# BUILDORA — Setup & Deployment Guide

This guide explains how to run BUILDORA locally, configure API keys, and deploy to production.

---

## 💻 Local Development

### Prerequisites
* **Node.js**: v18+ (v20+ recommended)
* **Python**: 3.10+ (tested on Python 3.14)
* **npm** or **pnpm**

### Step 1: Clone and Configure Environment
1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
2. Open `.env` and fill in your keys (optional, built-in intelligent simulation works out of the box without keys):
   * `OPENAI_API_KEY`
   * `ANTHROPIC_API_KEY`
   * `GOOGLE_AI_API_KEY`

### Step 2: Start the Python AI Backend
```bash
cd backend
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8000
```
* Backend API runs at: `http://localhost:8000`
* OpenAPI / Swagger Documentation: `http://localhost:8000/docs`

### Step 3: Start the Frontend Application
In a separate terminal:
```bash
npm install
npm run dev
```
* Frontend runs at: `http://localhost:5173`

---

## 🌐 Production Deployment

### Frontend Deployment (Vercel / Netlify / Cloudflare Pages)
BUILDORA's client bundle is completely static and can be deployed with zero server maintenance costs:
```bash
npm run build
```
The output is generated in `dist/`.
* **Vercel**: Run `vercel` or link your GitHub repository.
* **Netlify**: Drag & drop the `dist/` directory or connect repository.

### Backend Deployment (Render / Railway / AWS ECS / Fly.io)
Deploy the `backend/` directory as a Docker container or Python service:
```bash
uvicorn app.main:app --host 0.0.0.0 --port $PORT
```
Set environment variables (`OPENAI_API_KEY`, `STRIPE_SECRET_KEY`, `RAZORPAY_KEY_ID`, etc.) in your hosting provider's dashboard.

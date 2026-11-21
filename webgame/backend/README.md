# Voice Safety Assistant (FastAPI + gTTS)

Simple Python backend to generate Hindi and Gujarati voice guidance for fraud scenarios.

Run locally

1. Create a virtualenv and install dependencies:

```bash
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

2. Initialize the SQLite database and seed example scenarios:

```bash
python init_db.py
```

3. Start the server (port 8001 recommended to avoid conflicts with a website server):

```bash
uvicorn main:app --host 0.0.0.0 --port 8001
```

API endpoints

- `POST /voice` - JSON body `{"scenario":"otp_call","language":"hi"}` returns `{"audio_url":".../audio/otp_call_hi_...mp3"}`
- `GET /scenarios` - list available scenarios
- `GET /usage/{scenario_key}` - usage counts grouped by language

Example integration (client-side)

```js
fetch('https://your-backend.example.com/voice', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({scenario: 'otp_call', language: 'hi'})
})
.then(r => r.json())
.then(data => {
  const audio = new Audio(data.audio_url);
  audio.play();
})
```

Deployment notes

- Render: deploy as a Python web service, command `uvicorn main:app --host 0.0.0.0 --port $PORT`.
- PythonAnywhere: PythonAnywhere is WSGI-based; you can run a small Flask wrapper or run FastAPI with an always-on task using `uvicorn`, or prefer Render for easier ASGI support.

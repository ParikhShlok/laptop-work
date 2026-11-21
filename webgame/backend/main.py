import os
import time
import datetime
import sqlite3

from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from gtts import gTTS

BASE_DIR = os.path.dirname(__file__)
DB_PATH = os.path.join(BASE_DIR, "db.sqlite3")
AUDIO_DIR = os.path.join(BASE_DIR, "static", "audio")
os.makedirs(AUDIO_DIR, exist_ok=True)

app = FastAPI(title="Voice Safety Assistant API")

# Serve generated audio files at /audio/<filename>.mp3
app.mount("/audio", StaticFiles(directory=AUDIO_DIR), name="audio")


class VoiceRequest(BaseModel):
    scenario: str
    language: str


def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


@app.post("/voice")
async def generate_voice(req: VoiceRequest, request: Request):
    lang = req.language.lower()
    if lang not in ("hi", "gu"):
        raise HTTPException(status_code=400, detail="language must be 'hi' or 'gu'")

    conn = get_db()
    cur = conn.cursor()
    cur.execute("SELECT id, key, text_hi, text_gu FROM scenarios WHERE key = ?", (req.scenario,))
    row = cur.fetchone()
    if not row:
        conn.close()
        raise HTTPException(status_code=404, detail="scenario not found")

    text = row["text_hi"] if lang == "hi" else row["text_gu"]
    if not text:
        conn.close()
        raise HTTPException(status_code=500, detail="text for language not available")

    filename = f"{req.scenario}_{lang}_{int(time.time())}.mp3"
    file_path = os.path.join(AUDIO_DIR, filename)
    try:
        tts = gTTS(text=text, lang=lang)
        tts.save(file_path)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"TTS generation failed: {e}")

    # log usage
    now = datetime.datetime.utcnow().isoformat()
    cur.execute("INSERT INTO usage_logs(scenario_id, language, timestamp) VALUES (?,?,?)", (row["id"], lang, now))
    conn.commit()
    conn.close()

    base_url = str(request.base_url).rstrip('/')
    audio_url = f"{base_url}/audio/{filename}"
    return JSONResponse({"audio_url": audio_url})


@app.get("/scenarios")
def list_scenarios():
    conn = get_db()
    cur = conn.cursor()
    cur.execute("SELECT id, key FROM scenarios")
    rows = cur.fetchall()
    conn.close()
    return {"scenarios": [{"id": r["id"], "key": r["key"]} for r in rows]}


@app.get("/usage/{scenario_key}")
def usage_count(scenario_key: str):
    conn = get_db()
    cur = conn.cursor()
    cur.execute("SELECT id FROM scenarios WHERE key = ?", (scenario_key,))
    row = cur.fetchone()
    if not row:
        conn.close()
        raise HTTPException(status_code=404, detail="scenario not found")
    scenario_id = row[0]
    cur.execute("SELECT language, COUNT(*) as cnt FROM usage_logs WHERE scenario_id = ? GROUP BY language", (scenario_id,))
    rows = cur.fetchall()
    conn.close()
    return {r[0]: r[1] for r in rows}

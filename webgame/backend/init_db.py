import os
import sqlite3

BASE_DIR = os.path.dirname(__file__)
DB_PATH = os.path.join(BASE_DIR, "db.sqlite3")

def init_db():
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    cur.execute('''
    CREATE TABLE IF NOT EXISTS scenarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        key TEXT UNIQUE NOT NULL,
        text_hi TEXT,
        text_gu TEXT
    )
    ''')

    cur.execute('''
    CREATE TABLE IF NOT EXISTS usage_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        scenario_id INTEGER NOT NULL,
        language TEXT NOT NULL,
        timestamp TEXT NOT NULL,
        FOREIGN KEY(scenario_id) REFERENCES scenarios(id)
    )
    ''')

    # Insert example OTP scam scenario if not present
    cur.execute('SELECT id FROM scenarios WHERE key = ?', ("otp_call",))
    if not cur.fetchone():
        cur.execute('''INSERT INTO scenarios(key, text_hi, text_gu) VALUES (?,?,?)''', (
            "otp_call",
            "अगर कोई फोन करके ओटीपी मांगे, तो कभी भी ओटीपी साझा न करें।\nबैंक या कोई भी कंपनी कभी ओटीपी नहीं मांगती।\nतुरंत कॉल काट दें और नंबर ब्लॉक करें।",
            "જો કોઈ ફોન કરીને OTP માંગે,\nતો ક્યારેય OTP ન આપશો.\nબેંક કે કોઈ કંપની ક્યારેય OTP માંગતી નથી.\nતુરંત કોલ કાપી નાખો અને નંબર બ્લોક કરો."
        ))

    conn.commit()
    conn.close()

if __name__ == '__main__':
    init_db()
    print("Initialized database at", DB_PATH)

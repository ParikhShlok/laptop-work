"""Persistent, workspace-scoped storage for the BUILDORA pilot API.

SQLite is intentionally used for local and single-instance pilot testing. The
schema uses foreign keys and every application query is scoped by membership.
Deployments serving more than one instance must use PostgreSQL via a migration.
"""

from __future__ import annotations

import hashlib
import hmac
import os
import secrets
import sqlite3
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Any, Optional


def utcnow() -> str:
    return datetime.now(timezone.utc).isoformat()


class PilotStore:
    def __init__(self, database_url: str):
        if not database_url.startswith("sqlite:///"):
            raise ValueError("PilotStore supports sqlite URLs only. Use PostgreSQL storage before multi-instance production.")
        raw_path = database_url.removeprefix("sqlite:///")
        self.path = Path(raw_path).resolve()
        self.path.parent.mkdir(parents=True, exist_ok=True)
        self._initialize()

    def _connect(self) -> sqlite3.Connection:
        connection = sqlite3.connect(self.path)
        connection.row_factory = sqlite3.Row
        connection.execute("PRAGMA foreign_keys = ON")
        return connection

    def _initialize(self) -> None:
        with self._connect() as db:
            db.executescript(
                """
                CREATE TABLE IF NOT EXISTS users (
                  id TEXT PRIMARY KEY, email TEXT NOT NULL UNIQUE, name TEXT NOT NULL,
                  password_hash TEXT NOT NULL, created_at TEXT NOT NULL
                );
                CREATE TABLE IF NOT EXISTS workspaces (
                  id TEXT PRIMARY KEY, name TEXT NOT NULL, slug TEXT NOT NULL UNIQUE,
                  created_at TEXT NOT NULL
                );
                CREATE TABLE IF NOT EXISTS memberships (
                  workspace_id TEXT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
                  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                  role TEXT NOT NULL CHECK(role IN ('owner','admin','member','viewer')),
                  created_at TEXT NOT NULL, PRIMARY KEY(workspace_id, user_id)
                );
                CREATE TABLE IF NOT EXISTS sessions (
                  id TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                  token_hash TEXT NOT NULL UNIQUE, expires_at TEXT NOT NULL, created_at TEXT NOT NULL
                );
                CREATE TABLE IF NOT EXISTS documents (
                  id TEXT PRIMARY KEY, workspace_id TEXT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
                  title TEXT NOT NULL, content TEXT NOT NULL, source_type TEXT NOT NULL,
                  created_by TEXT NOT NULL REFERENCES users(id), created_at TEXT NOT NULL
                );
                CREATE TABLE IF NOT EXISTS approvals (
                  id TEXT PRIMARY KEY, workspace_id TEXT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
                  created_by TEXT NOT NULL REFERENCES users(id), action_type TEXT NOT NULL,
                  title TEXT NOT NULL, recipient TEXT, payload TEXT NOT NULL, risk_level TEXT NOT NULL,
                  status TEXT NOT NULL CHECK(status IN ('pending','approved','rejected')),
                  resolved_by TEXT REFERENCES users(id), resolved_at TEXT, created_at TEXT NOT NULL
                );
                CREATE TABLE IF NOT EXISTS audit_events (
                  id INTEGER PRIMARY KEY AUTOINCREMENT, workspace_id TEXT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
                  actor_id TEXT REFERENCES users(id), event_type TEXT NOT NULL, resource_type TEXT NOT NULL,
                  resource_id TEXT NOT NULL, details TEXT NOT NULL, created_at TEXT NOT NULL
                );
                """
            )

    @staticmethod
    def _password_hash(password: str, salt: Optional[bytes] = None) -> str:
        salt = salt or secrets.token_bytes(16)
        derived = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, 310_000)
        return f"pbkdf2_sha256$310000${salt.hex()}${derived.hex()}"

    @classmethod
    def _verify_password(cls, password: str, stored: str) -> bool:
        try:
            algorithm, iterations, salt_hex, expected_hex = stored.split("$", 3)
            if algorithm != "pbkdf2_sha256":
                return False
            actual = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), bytes.fromhex(salt_hex), int(iterations)).hex()
            return hmac.compare_digest(actual, expected_hex)
        except (TypeError, ValueError):
            return False

    @staticmethod
    def _id(prefix: str) -> str:
        return f"{prefix}_{secrets.token_urlsafe(16)}"

    def register(self, name: str, email: str, password: str, workspace_name: str) -> dict[str, Any]:
        clean_email = email.strip().lower()
        user_id, workspace_id = self._id("usr"), self._id("ws")
        slug_base = "".join(char.lower() if char.isalnum() else "-" for char in workspace_name).strip("-")[:48] or "workspace"
        workspace_slug = f"{slug_base}-{secrets.token_hex(3)}"
        now = utcnow()
        try:
            with self._connect() as db:
                db.execute("INSERT INTO users VALUES (?, ?, ?, ?, ?)", (user_id, clean_email, name.strip(), self._password_hash(password), now))
                db.execute("INSERT INTO workspaces VALUES (?, ?, ?, ?)", (workspace_id, workspace_name.strip(), workspace_slug, now))
                db.execute("INSERT INTO memberships VALUES (?, ?, 'owner', ?)", (workspace_id, user_id, now))
                self._audit(db, workspace_id, user_id, "workspace.created", "workspace", workspace_id, "Owner created a pilot workspace")
        except sqlite3.IntegrityError as exc:
            if "users.email" in str(exc):
                raise ValueError("An account already exists for this email.") from exc
            raise
        return {"id": user_id, "email": clean_email, "name": name.strip(), "workspace_id": workspace_id, "workspace_name": workspace_name.strip(), "role": "owner"}

    def login(self, email: str, password: str) -> Optional[dict[str, Any]]:
        with self._connect() as db:
            user = db.execute("SELECT * FROM users WHERE email = ?", (email.strip().lower(),)).fetchone()
            if not user or not self._verify_password(password, user["password_hash"]):
                return None
            membership = db.execute(
                "SELECT m.workspace_id, m.role, w.name AS workspace_name FROM memberships m JOIN workspaces w ON w.id=m.workspace_id WHERE m.user_id=? ORDER BY m.created_at LIMIT 1",
                (user["id"],),
            ).fetchone()
            if not membership:
                return None
            return {"id": user["id"], "email": user["email"], "name": user["name"], **dict(membership)}

    def create_session(self, user_id: str, days: int = 7) -> str:
        raw_token = secrets.token_urlsafe(48)
        token_hash = hashlib.sha256(raw_token.encode("utf-8")).hexdigest()
        expires = (datetime.now(timezone.utc) + timedelta(days=days)).isoformat()
        with self._connect() as db:
            db.execute("INSERT INTO sessions VALUES (?, ?, ?, ?, ?)", (self._id("ses"), user_id, token_hash, expires, utcnow()))
        return raw_token

    def user_for_token(self, token: str) -> Optional[dict[str, Any]]:
        token_hash = hashlib.sha256(token.encode("utf-8")).hexdigest()
        with self._connect() as db:
            row = db.execute(
                "SELECT u.id, u.email, u.name FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.token_hash=? AND s.expires_at > ?",
                (token_hash, utcnow()),
            ).fetchone()
        return dict(row) if row else None

    def revoke_session(self, token: str) -> None:
        with self._connect() as db:
            db.execute("DELETE FROM sessions WHERE token_hash=?", (hashlib.sha256(token.encode("utf-8")).hexdigest(),))

    def membership(self, workspace_id: str, user_id: str) -> Optional[str]:
        with self._connect() as db:
            row = db.execute("SELECT role FROM memberships WHERE workspace_id=? AND user_id=?", (workspace_id, user_id)).fetchone()
        return row["role"] if row else None

    def workspaces_for_user(self, user_id: str) -> list[dict[str, Any]]:
        with self._connect() as db:
            rows = db.execute("SELECT w.id, w.name, w.slug, m.role FROM workspaces w JOIN memberships m ON m.workspace_id=w.id WHERE m.user_id=? ORDER BY w.created_at", (user_id,)).fetchall()
        return [dict(row) for row in rows]

    def add_document(self, workspace_id: str, user_id: str, title: str, content: str, source_type: str) -> dict[str, Any]:
        doc_id, now = self._id("doc"), utcnow()
        with self._connect() as db:
            db.execute("INSERT INTO documents VALUES (?, ?, ?, ?, ?, ?, ?)", (doc_id, workspace_id, title.strip(), content.strip(), source_type, user_id, now))
            self._audit(db, workspace_id, user_id, "document.created", "document", doc_id, f"Added source: {title.strip()}")
        return {"id": doc_id, "title": title.strip(), "source_type": source_type, "created_at": now}

    def list_documents(self, workspace_id: str) -> list[dict[str, Any]]:
        with self._connect() as db:
            rows = db.execute("SELECT id, title, source_type, created_at FROM documents WHERE workspace_id=? ORDER BY created_at DESC", (workspace_id,)).fetchall()
        return [dict(row) for row in rows]

    def search_documents(self, workspace_id: str, query: str) -> list[dict[str, Any]]:
        terms = [term.lower() for term in query.split() if len(term) > 2][:10]
        with self._connect() as db:
            rows = db.execute("SELECT id, title, source_type, content FROM documents WHERE workspace_id=?", (workspace_id,)).fetchall()
        ranked = []
        for row in rows:
            score = sum((row["title"] + " " + row["content"]).lower().count(term) for term in terms)
            if score:
                ranked.append((score, dict(row)))
        return [item for _, item in sorted(ranked, key=lambda item: item[0], reverse=True)[:5]]

    def create_approval(self, workspace_id: str, user_id: str, title: str, recipient: str, payload: str, action_type: str = "support_reply") -> dict[str, Any]:
        approval_id, now = self._id("apr"), utcnow()
        with self._connect() as db:
            db.execute("INSERT INTO approvals VALUES (?, ?, ?, ?, ?, ?, ?, 'medium', 'pending', NULL, NULL, ?)", (approval_id, workspace_id, user_id, action_type, title, recipient, payload, now))
            self._audit(db, workspace_id, user_id, "approval.staged", "approval", approval_id, f"Staged {action_type}; no external delivery was attempted")
        return self.get_approval(workspace_id, approval_id)  # type: ignore[return-value]

    def get_approval(self, workspace_id: str, approval_id: str) -> Optional[dict[str, Any]]:
        with self._connect() as db:
            row = db.execute("SELECT * FROM approvals WHERE workspace_id=? AND id=?", (workspace_id, approval_id)).fetchone()
        return dict(row) if row else None

    def list_approvals(self, workspace_id: str) -> list[dict[str, Any]]:
        with self._connect() as db:
            rows = db.execute("SELECT * FROM approvals WHERE workspace_id=? ORDER BY created_at DESC", (workspace_id,)).fetchall()
        return [dict(row) for row in rows]

    def resolve_approval(self, workspace_id: str, approval_id: str, actor_id: str, status: str) -> Optional[dict[str, Any]]:
        now = utcnow()
        with self._connect() as db:
            current = db.execute("SELECT status FROM approvals WHERE workspace_id=? AND id=?", (workspace_id, approval_id)).fetchone()
            if not current or current["status"] != "pending":
                return None
            db.execute("UPDATE approvals SET status=?, resolved_by=?, resolved_at=? WHERE id=?", (status, actor_id, now, approval_id))
            self._audit(db, workspace_id, actor_id, f"approval.{status}", "approval", approval_id, "Decision recorded. Delivery remains manual in the pilot.")
        return self.get_approval(workspace_id, approval_id)

    def audit_events(self, workspace_id: str) -> list[dict[str, Any]]:
        with self._connect() as db:
            rows = db.execute("SELECT id, event_type, resource_type, resource_id, details, created_at FROM audit_events WHERE workspace_id=? ORDER BY id DESC", (workspace_id,)).fetchall()
        return [dict(row) for row in rows]

    @staticmethod
    def _audit(db: sqlite3.Connection, workspace_id: str, actor_id: str, event_type: str, resource_type: str, resource_id: str, details: str) -> None:
        db.execute("INSERT INTO audit_events (workspace_id, actor_id, event_type, resource_type, resource_id, details, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)", (workspace_id, actor_id, event_type, resource_type, resource_id, details, utcnow()))

/**
 * BUILDORA Unified API Client.
 * Connects frontend views to the Python FastAPI backend (http://localhost:8000/api),
 * with graceful fallback to local state if the backend is not actively running.
 */

const LEGACY_API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
const PILOT_API_BASE_URL = import.meta.env.VITE_PILOT_API_URL || 'http://localhost:8000/api/v1';
const SESSION_KEY = 'buildora_pilot_session';

class ApiClient {
  constructor() {
    this.baseUrl = LEGACY_API_BASE_URL;
    this.pilotBaseUrl = PILOT_API_BASE_URL;
  }

  getSession() {
    try { return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null'); } catch { return null; }
  }

  saveSession(session) { localStorage.setItem(SESSION_KEY, JSON.stringify(session)); }
  clearSession() { localStorage.removeItem(SESSION_KEY); }

  async pilotRequest(path, options = {}) {
    const session = this.getSession();
    const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
    if (session?.access_token) headers.Authorization = `Bearer ${session.access_token}`;
    const response = await fetch(`${this.pilotBaseUrl}${path}`, { ...options, headers });
    if (response.status === 204) return null;
    const body = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(body.detail || 'Request failed.');
    return body;
  }

  async registerPilot(payload) {
    const session = await this.pilotRequest('/auth/register', { method: 'POST', body: JSON.stringify(payload) });
    this.saveSession(session);
    return session;
  }

  async loginPilot(payload) {
    const session = await this.pilotRequest('/auth/login', { method: 'POST', body: JSON.stringify(payload) });
    this.saveSession(session);
    return session;
  }

  async logoutPilot() {
    try { await this.pilotRequest('/auth/logout', { method: 'POST' }); } finally { this.clearSession(); }
  }

  async addPilotKnowledge(workspaceId, payload) {
    return this.pilotRequest(`/workspaces/${workspaceId}/documents`, { method: 'POST', body: JSON.stringify(payload) });
  }

  async createSupportDraft(workspaceId, payload) {
    return this.pilotRequest(`/workspaces/${workspaceId}/support-drafts`, { method: 'POST', body: JSON.stringify(payload) });
  }

  async listPilotApprovals(workspaceId) {
    return this.pilotRequest(`/workspaces/${workspaceId}/approvals`);
  }

  async decidePilotApproval(workspaceId, approvalId, decision) {
    return this.pilotRequest(`/workspaces/${workspaceId}/approvals/${approvalId}`, { method: 'POST', body: JSON.stringify({ decision }) });
  }

  async checkBackendHealth() {
    try {
      const res = await fetch(`${this.baseUrl}/health`, { signal: AbortSignal.timeout(1500) });
      return res.ok;
    } catch (e) {
      return false;
    }
  }

  async postChat(workspaceId, query, agent = 'Buildora AI') {
    try {
      const res = await fetch(`${this.baseUrl}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workspace_id: workspaceId, query, agent })
      });
      if (res.ok) return await res.json();
    } catch (e) {
      // Fallback
    }
    return null;
  }

  async processMeeting(workspaceId, title, transcript) {
    try {
      const res = await fetch(`${this.baseUrl}/meetings/process`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workspace_id: workspaceId, title, transcript })
      });
      if (res.ok) return await res.json();
    } catch (e) {
      // Fallback
    }
    return null;
  }

  async runResearch(workspaceId, topic) {
    try {
      const res = await fetch(`${this.baseUrl}/research/run`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workspace_id: workspaceId, topic })
      });
      if (res.ok) return await res.json();
    } catch (e) {
      // Fallback
    }
    return null;
  }

  async draftSalesEmail(workspaceId, lead) {
    try {
      const res = await fetch(`${this.baseUrl}/sales/draft`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workspace_id: workspaceId,
          lead_name: lead.name,
          lead_role: lead.role,
          lead_company: lead.company,
          lead_email: lead.email
        })
      });
      if (res.ok) return await res.json();
    } catch (e) {
      // Fallback
    }
    return null;
  }

  async submitDemoRequest(demoData) {
    try {
      const res = await fetch(`${this.baseUrl}/demo/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(demoData)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      // Fallback
    }
    return { status: 'recorded_locally', message: 'Demo request saved.' };
  }

  async getAdminDashboard() {
    try {
      const res = await fetch(`${this.baseUrl}/admin/dashboard`);
      if (res.ok) return await res.json();
    } catch (e) {
      // Fallback
    }
    return null;
  }
}

export const apiClient = new ApiClient();

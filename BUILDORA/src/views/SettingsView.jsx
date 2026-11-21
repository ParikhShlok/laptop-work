import React, { useState } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import {
  Settings,
  Shield,
  Key,
  Database,
  Bell,
  Check,
  Lock,
  Cpu,
  RefreshCw,
  Clock
} from 'lucide-react';

export default function SettingsView() {
  const { workspace, setWorkspace, showToast } = useWorkspace();
  const [workspaceName, setWorkspaceName] = useState(workspace.name);
  const [retentionDays, setRetentionDays] = useState('90');
  const [strictMode, setStrictMode] = useState(true);
  const [primaryModel, setPrimaryModel] = useState('Claude 3.5 Sonnet (Zero Retention)');
  const [slackAlerts, setSlackAlerts] = useState(true);

  const handleSave = () => {
    setWorkspace(prev => ({ ...prev, name: workspaceName }));
    showToast('Workspace settings saved.', 'success');
  };

  return (
    <div className="view-container">
      <div className="view-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="badge badge-emerald">Admin Control</span>
            <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>Acme AI Labs Organization Settings</span>
          </div>
          <h1 className="view-title">Settings</h1>
          <p className="view-subtitle">Workspace preferences, compliance retention, and AI routing configurations.</p>
        </div>

        <button className="btn btn-primary btn-sm" onClick={handleSave}>
          <Check size={14} />
          <span>Save Changes</span>
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '820px' }}>
        {/* Organization Information */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Organization Profile</span>
          </div>
          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>
                Workspace Name
              </label>
              <input
                type="text"
                className="form-input"
                value={workspaceName}
                onChange={e => setWorkspaceName(e.target.value)}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>
                  Subscription Tier
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={workspace.plan}
                  disabled
                  style={{ opacity: 0.7 }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>
                  Primary Admin
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={workspace.currentUser.name}
                  disabled
                  style={{ opacity: 0.7 }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Security & Strict Approval Mode */}
        <div className="card">
          <div className="card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Shield size={16} color="var(--primary)" />
              <span className="card-title">Governance & Approvals</span>
            </div>
            <span className="badge badge-amber">Strict Enforced</span>
          </div>
          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-tertiary)',
                border: '1px solid var(--border)'
              }}
            >
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Strict Mode: Human-in-the-Loop for External Actions
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  Automatically pause any outbound email, code commit, or CRM mutation until a founder approves.
                </div>
              </div>

              <div
                onClick={() => setStrictMode(!strictMode)}
                style={{
                  width: '44px',
                  height: '24px',
                  borderRadius: '12px',
                  backgroundColor: strictMode ? '#059669' : '#94a3b8',
                  position: 'relative',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                  flexShrink: 0
                }}
              >
                <div
                  style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    backgroundColor: '#ffffff',
                    position: 'absolute',
                    top: '3px',
                    left: strictMode ? '23px' : '3px',
                    transition: 'left 0.2s'
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>
                Audit Log & Vector Data Retention Policy
              </label>
              <select
                className="form-input"
                value={retentionDays}
                onChange={e => setRetentionDays(e.target.value)}
              >
                <option value="30">30 Days (Ephemeral)</option>
                <option value="90">90 Days (Recommended for SOC2 / ISO 27001)</option>
                <option value="365">365 Days (Full Year Compliance)</option>
              </select>
            </div>
          </div>
        </div>

        {/* AI Model Routing & Privacy */}
        <div className="card">
          <div className="card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Cpu size={16} color="var(--primary)" />
              <span className="card-title">AI Engine & Zero-Training Guarantees</span>
            </div>
            <span className="badge badge-emerald">Privacy SLA Active</span>
          </div>

          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>
                Primary Foundation Model
              </label>
              <select
                className="form-input"
                value={primaryModel}
                onChange={e => setPrimaryModel(e.target.value)}
              >
                <option value="Claude 3.5 Sonnet (Zero Retention)">Claude 3.5 Sonnet (Air-gapped VPC - Fast Reasoning)</option>
                <option value="GPT-4o (Zero Data Retention)">GPT-4o (Azure OpenAI Confidential Compute)</option>
                <option value="Gemini 1.5 Pro (Enterprise Endpoint)">Gemini 1.5 Pro (Google Cloud Vertex - 1M Context)</option>
              </select>
            </div>

            <div
              style={{
                fontSize: '12px',
                color: 'var(--text-secondary)',
                lineHeight: 1.5,
                padding: '10px 14px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--bg-tertiary)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Lock size={14} color="#059669" />
              <span>
                All inference requests carry enterprise zero-data-retention (ZDR) riders. Your company queries are never retained for model training.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

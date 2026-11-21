import React, { useState } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  Lock,
  Key,
  Clock,
  Terminal,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Activity,
  Filter
} from 'lucide-react';

const ICON_MAP = {
  ShieldCheck,
  Key,
  Lock,
  Clock,
  ShieldAlert,
  Terminal
};

export default function SecurityView() {
  const { securityData, setActiveView, showToast } = useWorkspace();
  const [filterSeverity, setFilterSeverity] = useState('all');

  const filteredEvents = securityData.securityEvents.filter(ev => {
    if (filterSeverity === 'all') return true;
    return ev.severity.toLowerCase() === filterSeverity.toLowerCase();
  });

  return (
    <div className="view-container">
      {/* Header */}
      <div className="view-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="brand-badge">
              <span className="brand-badge-dot"></span>
              Preview security roadmap
            </span>
            <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>Controls shown here are planning examples, not production attestations</span>
          </div>
          <h1 className="view-title">Security & Control</h1>
          <p className="view-subtitle">The controls Buildora will validate with each production pilot.</p>
        </div>

        <button
          className="btn btn-secondary btn-sm"
          onClick={() => setActiveView('audit')}
        >
          <FileText size={14} />
          <span>View Preview History</span>
        </button>
      </div>

      {/* Operational Trust Callout Banner */}
      <div className="security-banner banner-blue">
        <div className="security-banner-icon">
          <ShieldCheck size={22} color="#2563eb" />
        </div>
        <div className="security-banner-content" style={{ flex: 1 }}>
          <h4>Security before live data</h4>
          <p>
            This preview demonstrates the intended review model. Production pilots will be enabled only after identity, tenant authorization, scoped integrations, and audit persistence are implemented and tested.
          </p>
        </div>
      </div>

      {/* Grid: Workspace Security + AI Security */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '28px' }}>
        {/* Left Column: Workspace Security */}
        <div className="card">
          <div className="card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Lock size={16} color="var(--primary)" />
              <span className="card-title">Production security roadmap</span>
            </div>
            <span className="badge badge-blue">Planned controls</span>
          </div>

          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {securityData.workspace.map((item, idx) => {
              const Icon = ICON_MAP[item.icon] || ShieldCheck;
              const isAlert = item.status === 'alert';
              return (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--bg-tertiary)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Icon size={16} color={isAlert ? '#d97706' : '#059669'} />
                    <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {item.label}
                    </span>
                  </div>

                  <span
                    className={`badge ${isAlert ? 'badge-amber' : 'badge-emerald'}`}
                    style={{ fontSize: '11px' }}
                  >
                    {item.value}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: AI Security Guardrails */}
        <div className="card">
          <div className="card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Shield size={16} color="var(--primary)" />
              <span className="card-title">Guardrail design targets</span>
            </div>
            <span className="badge badge-indigo">Pilot requirements</span>
          </div>

          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {securityData.aiSecurity.map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--bg-tertiary)'
                }}
              >
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {item.label}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                    {item.desc}
                  </div>
                </div>

                <span className="badge badge-emerald" style={{ fontSize: '11px' }}>
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Security Events Stream */}
      <div className="card">
        <div className="card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={16} color="#d97706" />
            <span className="card-title">Security Events & Interceptions</span>
          </div>

          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              className={`btn btn-sm ${filterSeverity === 'all' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilterSeverity('all')}
              style={{ fontSize: '11px' }}
            >
              All Events ({securityData.securityEvents.length})
            </button>
            <button
              className={`btn btn-sm ${filterSeverity === 'high' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilterSeverity('high')}
              style={{ fontSize: '11px' }}
            >
              High
            </button>
            <button
              className={`btn btn-sm ${filterSeverity === 'medium' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilterSeverity('medium')}
              style={{ fontSize: '11px' }}
            >
              Medium
            </button>
          </div>
        </div>

        <div style={{ padding: '8px 0' }}>
          {filteredEvents.map(event => (
            <div
              key={event.id}
              style={{
                padding: '16px 20px',
                borderBottom: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: '16px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor:
                      event.severity === 'High'
                        ? 'var(--rose-bg)'
                        : event.severity === 'Medium'
                        ? 'var(--amber-bg)'
                        : 'var(--blue-bg)',
                    color:
                      event.severity === 'High'
                        ? 'var(--rose-text)'
                        : event.severity === 'Medium'
                        ? 'var(--amber-text)'
                        : 'var(--blue-text)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: '2px'
                  }}
                >
                  <ShieldAlert size={16} />
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {event.title}
                    </span>
                    <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>•</span>
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                      Agent: <strong>{event.agent}</strong>
                    </span>
                    <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>•</span>
                    <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>{event.time}</span>
                  </div>

                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '4px', lineHeight: 1.5 }}>
                    {event.details}
                  </p>

                  <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--emerald-text)' }}>
                    Resolution: {event.actionTaken}
                  </div>
                </div>
              </div>

              <span
                className={`risk-pill ${
                  event.severity === 'High'
                    ? 'risk-high'
                    : event.severity === 'Medium'
                    ? 'risk-medium'
                    : 'risk-low'
                }`}
              >
                {event.severity} Severity
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

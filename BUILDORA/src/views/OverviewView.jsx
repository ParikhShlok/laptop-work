import React from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import {
  CheckCircle2,
  Clock,
  ShieldAlert,
  Database,
  TrendingUp,
  Video,
  MessageSquare,
  Compass,
  Code2,
  RefreshCw,
  Share2,
  ArrowUpRight,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  AlertTriangle
} from 'lucide-react';

const ICON_MAP = {
  CheckCircle2,
  Clock,
  ShieldAlert,
  Database,
  TrendingUp,
  Video,
  MessageSquare,
  Compass,
  Code2,
  RefreshCw,
  Share2
};

export default function OverviewView() {
  const { kpis, activities, setActiveView, setDemoTourActive, setDemoTourStep } = useWorkspace();

  return (
    <div className="view-container">
      {/* Top Welcome Header */}
      <div className="view-header">
        <div>
          <h1 className="view-title">Good morning, Alex 👋</h1>
          <p className="view-subtitle">Here's what is happening across your workspace.</p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setActiveView('knowledge')}
          >
            <Database size={13} />
            <span>247 Sources Indexed</span>
          </button>

          <button
            className="btn btn-primary btn-sm"
            onClick={() => setActiveView('chat')}
          >
            <Sparkles size={13} />
            <span>Ask Buildora</span>
          </button>
        </div>
      </div>

      {/* 4 KPI Cards */}
      <div className="kpi-grid">
        {kpis.map(kpi => {
          const Icon = ICON_MAP[kpi.icon] || CheckCircle2;
          const isAlert = kpi.id === 'pending_approvals' && parseInt(kpi.value, 10) > 0;
          return (
            <div
              key={kpi.id}
              className={`kpi-card ${isAlert ? 'alert-card' : ''}`}
              onClick={() => {
                if (kpi.id === 'pending_approvals') setActiveView('approvals');
                if (kpi.id === 'tasks_completed') setActiveView('tasks');
                if (kpi.id === 'knowledge_sources') setActiveView('knowledge');
              }}
              style={{ cursor: 'pointer' }}
            >
              <div className="kpi-top-row">
                <span className="kpi-label">{kpi.title}</span>
                <div
                  className="kpi-icon-pill"
                  style={{
                    backgroundColor:
                      kpi.color === 'emerald'
                        ? 'var(--emerald-bg)'
                        : kpi.color === 'indigo'
                        ? 'var(--indigo-bg)'
                        : kpi.color === 'amber'
                        ? 'var(--amber-bg)'
                        : 'var(--blue-bg)',
                    color:
                      kpi.color === 'emerald'
                        ? 'var(--emerald-text)'
                        : kpi.color === 'indigo'
                        ? 'var(--indigo-text)'
                        : kpi.color === 'amber'
                        ? 'var(--amber-text)'
                        : 'var(--blue-text)'
                  }}
                >
                  <Icon size={16} />
                </div>
              </div>

              <div className="kpi-value">{kpi.value}</div>
              <div className="kpi-subtext">
                {isAlert && <span style={{ color: '#d97706', fontWeight: 600 }}>Action Required • </span>}
                <span>{kpi.subtext}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Security Callout Banner */}
      <div className="security-banner banner-blue">
        <div className="security-banner-icon">
          <ShieldCheck size={20} color="#2563eb" />
        </div>
        <div className="security-banner-content" style={{ flex: 1 }}>
          <h4>Zero-Trust Boundary Active</h4>
          <p>
            AI agents can research, summarize, and draft actions inside your sandbox. Sensitive external actions (outbound emails, code pushes, CRM changes) pause for your approval.
          </p>
        </div>
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => setActiveView('security')}
          style={{ alignSelf: 'center', whiteSpace: 'nowrap' }}
        >
          View Guardrails
        </button>
      </div>

      {/* Main Content Split: Today's AI Activity Timeline + Quick Shortcuts */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        {/* Left Column: Today's AI Activity Timeline */}
        <div className="card">
          <div className="card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="card-title">Today's AI Activity</span>
              <span className="badge badge-emerald">Live Stream</span>
            </div>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setActiveView('audit')}
              style={{ fontSize: '11px', padding: '4px 8px' }}
            >
              <span>View Audit Log</span>
              <ArrowUpRight size={12} />
            </button>
          </div>

          <div style={{ padding: '8px 0' }}>
            {activities.map((act, index) => {
              const Icon = ICON_MAP[act.agentIcon] || Sparkles;
              return (
                <div
                  key={act.id}
                  style={{
                    padding: '14px 20px',
                    borderBottom: index < activities.length - 1 ? '1px solid var(--border)' : 'none',
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    gap: '14px',
                    transition: 'background-color 0.12s ease',
                    cursor: act.targetView ? 'pointer' : 'default'
                  }}
                  onClick={() => {
                    if (act.targetView) setActiveView(act.targetView);
                  }}
                  className="activity-item-hover"
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor:
                          act.statusColor === 'amber'
                            ? 'var(--amber-bg)'
                            : act.statusColor === 'emerald'
                            ? 'var(--emerald-bg)'
                            : 'var(--blue-bg)',
                        color:
                          act.statusColor === 'amber'
                            ? 'var(--amber-text)'
                            : act.statusColor === 'emerald'
                            ? 'var(--emerald-text)'
                            : 'var(--blue-text)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        marginTop: '2px'
                      }}
                    >
                      <Icon size={16} />
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                        <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
                          {act.agent}
                        </span>
                        <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>•</span>
                        <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>{act.time}</span>
                      </div>
                      <p style={{ fontSize: '13px', color: 'var(--text-primary)', marginBottom: '3px', fontWeight: 500 }}>
                        {act.action}
                      </p>
                      <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                        {act.detail}
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px', flexShrink: 0 }}>
                    <span
                      className={`badge ${
                        act.statusColor === 'amber'
                          ? 'badge-amber'
                          : act.statusColor === 'emerald'
                          ? 'badge-emerald'
                          : 'badge-blue'
                      }`}
                    >
                      {act.status}
                    </span>

                    {act.approvalRequired && (
                      <span className="risk-pill risk-medium">
                        Approval Required
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Founder Fast Actions & Demo Showcase */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Pitch Demo Story Launcher */}
          <div
            className="card"
            style={{
              background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
              color: '#ffffff',
              border: 'none',
              padding: '20px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Sparkles size={16} color="#60a5fa" />
              <span style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '0.02em', color: '#93c5fd' }}>
                5-MINUTE FOUNDER STORY
              </span>
            </div>
            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '6px', color: '#f8fafc' }}>
              "Connect → Understand → Assist → Act → Approve → Audit"
            </h3>
            <p style={{ fontSize: '12px', color: '#cbd5e1', lineHeight: 1.5, marginBottom: '16px' }}>
              Walk through the 7-step guided flow showing how Buildora indexes Drive, summarizes meetings, drafts sales outreach, and halts external sends until you approve.
            </p>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => {
                setDemoTourActive(true);
                setDemoTourStep(1);
                setActiveView('knowledge');
              }}
              style={{ width: '100%', justifyContent: 'center' }}
            >
              <span>Launch 7-Step Pitch Demo</span>
              <ArrowRight size={13} />
            </button>
          </div>

          {/* Connected Workspaces Health */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">Connected Sources</span>
              <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>6 Active</span>
            </div>
            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '16px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Google Drive</span>
                <span style={{ fontWeight: 600, color: 'var(--emerald-text)' }}>247 docs (14m ago)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Slack Archive</span>
                <span style={{ fontWeight: 600, color: 'var(--emerald-text)' }}>12,431 msgs (5m ago)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>GitHub Repos</span>
                <span style={{ fontWeight: 600, color: 'var(--emerald-text)' }}>18 repos (12m ago)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>External Action Queue</span>
                <span style={{ fontWeight: 600, color: 'var(--amber-text)' }}>4 awaiting review</span>
              </div>

              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setActiveView('knowledge')}
                style={{ width: '100%', marginTop: '6px' }}
              >
                <span>Browse All Knowledge</span>
              </button>
            </div>
          </div>

          {/* Pending Approvals Fast Access */}
          <div className="card" style={{ borderColor: 'var(--amber-border)' }}>
            <div className="card-header" style={{ backgroundColor: 'var(--amber-bg)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <AlertTriangle size={14} color="#d97706" />
                <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--amber-text)' }}>
                  Pending Founder Review
                </span>
              </div>
              <span className="risk-pill risk-medium">4 Actions</span>
            </div>
            <div className="card-body" style={{ padding: '16px 20px' }}>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                Sales Agent has prepared an outbound email to <strong>Marcus Vance (Acme Technologies)</strong>.
              </p>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => setActiveView('sales')}
                style={{ width: '100%', backgroundColor: '#d97706', borderColor: '#b45309' }}
              >
                <span>Review & Approve Outreach →</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

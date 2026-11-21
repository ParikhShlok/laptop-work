import React from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import {
  Activity,
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
  Filter
} from 'lucide-react';

const ICON_MAP = {
  TrendingUp,
  Video,
  MessageSquare,
  Compass,
  Code2,
  RefreshCw,
  Share2
};

export default function ActivityView() {
  const { activities, setActiveView } = useWorkspace();

  return (
    <div className="view-container">
      <div className="view-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="badge badge-emerald">Live Stream</span>
            <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>Immutable Activity Feed</span>
          </div>
          <h1 className="view-title">Activity</h1>
          <p className="view-subtitle">Chronological stream of all autonomous and human-approved actions.</p>
        </div>

        <button className="btn btn-secondary btn-sm" onClick={() => setActiveView('audit')}>
          <span>View Compliance Audit Log →</span>
        </button>
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title">All Workspace Activity</span>
          <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>{activities.length} Events Logged Today</span>
        </div>

        <div style={{ padding: '8px 0' }}>
          {activities.map((act, index) => {
            const Icon = ICON_MAP[act.agentIcon] || Activity;
            return (
              <div
                key={act.id}
                style={{
                  padding: '16px 20px',
                  borderBottom: index < activities.length - 1 ? '1px solid var(--border)' : 'none',
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: '16px',
                  cursor: act.targetView ? 'pointer' : 'default'
                }}
                onClick={() => {
                  if (act.targetView) setActiveView(act.targetView);
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
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
                    <Icon size={18} />
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                      <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
                        {act.agent}
                      </span>
                      <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>•</span>
                      <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>{act.time}</span>
                    </div>

                    <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '3px' }}>
                      {act.action}
                    </p>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                      {act.detail}
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
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
    </div>
  );
}

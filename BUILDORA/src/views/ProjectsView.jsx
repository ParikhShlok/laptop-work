import React from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import {
  Briefcase,
  CheckCircle2,
  Clock,
  Users,
  Bot,
  Plus,
  ArrowRight,
  ShieldCheck,
  Layers
} from 'lucide-react';

const PROJECTS_DATA = [
  {
    id: 'proj-1',
    name: 'Sprint 14: Enterprise SSO & SAML 2.0',
    lead: 'Rahul Patel',
    progress: 65,
    dueDate: 'Oct 14, 2026',
    status: 'In Progress',
    badge: 'Strategic Priority',
    color: 'emerald',
    tasksCount: 6,
    desc: 'Implement SAML 2.0, Okta connector, and session invalidation webhooks to unlock enterprise deals.'
  },
  {
    id: 'proj-2',
    name: 'Simplified Onboarding Redesign',
    lead: 'Sarah Chen',
    progress: 40,
    dueDate: 'Oct 20, 2026',
    status: 'In Progress',
    badge: 'Growth',
    color: 'indigo',
    tasksCount: 4,
    desc: 'Streamline the first-time setup flow to 3 simple steps to eliminate activation drop-off.'
  },
  {
    id: 'proj-3',
    name: 'SOC2 Type II Audit Readiness',
    lead: 'Alex Rivera',
    progress: 85,
    dueDate: 'Oct 31, 2026',
    status: 'Near Completion',
    badge: 'Compliance',
    color: 'amber',
    tasksCount: 8,
    desc: 'Zero-trust audit log verification, automated retention policies, and encryption key rotation.'
  },
  {
    id: 'proj-4',
    name: 'Customer Pricing Validation (5 Interviews)',
    lead: 'Maya Lin',
    progress: 20,
    dueDate: 'Oct 10, 2026',
    status: 'Active',
    badge: 'Market Research',
    color: 'blue',
    tasksCount: 3,
    desc: 'Interview 5 YC SaaS founders to establish willingness-to-pay for human-governed AI workspaces.'
  }
];

export default function ProjectsView() {
  const { setActiveView, showToast } = useWorkspace();

  return (
    <div className="view-container">
      <div className="view-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="badge badge-indigo">Strategic Initiatives</span>
            <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>Q4 Milestones</span>
          </div>
          <h1 className="view-title">Projects</h1>
          <p className="view-subtitle">High-level strategic initiatives coordinating tasks, meetings, and AI agents.</p>
        </div>

        <button
          className="btn btn-primary btn-sm"
          onClick={() => showToast('New project draft staged.', 'info')}
        >
          <Plus size={14} />
          <span>New Project</span>
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(420px, 1fr))', gap: '20px' }}>
        {PROJECTS_DATA.map(proj => (
          <div key={proj.id} className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span className="badge badge-indigo" style={{ fontSize: '10px' }}>
                  {proj.badge}
                </span>
                <span className="badge badge-emerald">
                  {proj.status}
                </span>
              </div>

              <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
                {proj.name}
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '16px' }}>
                {proj.desc}
              </p>

              {/* Progress Bar */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Completion</span>
                  <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{proj.progress}%</span>
                </div>
                <div style={{ height: '6px', borderRadius: '3px', backgroundColor: 'var(--bg-tertiary)', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${proj.progress}%`,
                      backgroundColor: 'var(--primary)',
                      borderRadius: '3px'
                    }}
                  />
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '11px',
                  color: 'var(--text-secondary)',
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--bg-tertiary)'
                }}
              >
                <div>Lead: <strong style={{ color: 'var(--text-primary)' }}>{proj.lead}</strong></div>
                <div>Due: <strong style={{ color: 'var(--text-primary)' }}>{proj.dueDate}</strong></div>
                <div>Tasks: <strong style={{ color: 'var(--text-primary)' }}>{proj.tasksCount} active</strong></div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--border)' }}>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setActiveView('tasks')}
                style={{ flex: 1 }}
              >
                <span>View Linked Tasks</span>
                <ArrowRight size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

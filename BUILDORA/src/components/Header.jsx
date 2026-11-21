import React from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import {
  ShieldCheck,
  Search,
  Sparkles,
  Bell,
  ChevronRight,
  ExternalLink,
  Plus
} from 'lucide-react';

const VIEW_TITLES = {
  overview: { section: 'Workspace', title: 'Overview' },
  chat: { section: 'Workspace', title: 'Buildora AI Chat' },
  knowledge: { section: 'Workspace', title: 'Company Knowledge' },
  agents: { section: 'Workspace', title: 'AI Agents Marketplace' },
  meetings: { section: 'Workspace', title: 'Meeting Agent' },
  research: { section: 'Workspace', title: 'Research Agent' },
  sales: { section: 'Workspace', title: 'Sales Agent (AcmeFlow)' },
  support: { section: 'Workspace', title: 'Support Agent Copilot' },
  tasks: { section: 'Workspace', title: 'Task System' },
  projects: { section: 'Workspace', title: 'Projects' },
  team: { section: 'Team', title: 'Team Members' },
  permissions: { section: 'Team', title: 'Roles & Permissions' },
  integrations: { section: 'Integrations', title: 'Connected Tools' },
  approvals: { section: 'Control', title: 'Approval Center' },
  activity: { section: 'Control', title: 'Live AI Activity' },
  audit: { section: 'Control', title: 'Immutable Audit Log' },
  security: { section: 'Control', title: 'Security & Guardrails' },
  settings: { section: 'System', title: 'Workspace Settings' },
  billing: { section: 'Account', title: 'Subscription & Usage' },
  admin: { section: 'System', title: 'Internal Admin Console' }
};

export default function Header() {
  const {
    activeView,
    setActiveView,
    setCommandPaletteOpen,
    demoTourActive,
    setDemoTourActive,
    setDemoTourStep,
    approvals
  } = useWorkspace();

  const currentMeta = VIEW_TITLES[activeView] || { section: 'Workspace', title: 'Overview' };
  const pendingCount = approvals.filter(a => a.status === 'pending').length;

  return (
    <header className="app-header">
      {/* Left: Breadcrumbs */}
      <div className="header-left">
        <div className="breadcrumb-trail">
          <span className="breadcrumb-root">{currentMeta.section}</span>
          <ChevronRight size={13} className="breadcrumb-separator" />
          <span className="breadcrumb-active">{currentMeta.title}</span>
        </div>
      </div>

      {/* Right: Quick actions, Security status, Demo launcher */}
      <div className="header-right">
        {/* Pitch Demo Trigger */}
        {!demoTourActive && (
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => {
              setDemoTourActive(true);
              setDemoTourStep(1);
              setActiveView('knowledge');
            }}
            style={{
              borderColor: 'var(--primary-border)',
              backgroundColor: 'var(--primary-light)',
              color: 'var(--primary)'
            }}
          >
            <Sparkles size={13} />
            <span>Interactive Pitch Demo (7 Steps)</span>
          </button>
        )}

        {/* Global Search Button */}
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => setCommandPaletteOpen(true)}
          style={{ gap: '6px' }}
        >
          <Search size={13} />
          <span style={{ color: 'var(--text-tertiary)' }}>Search</span>
          <span className="kbd-shortcut">⌘K</span>
        </button>

        {/* Security Guardrail Status Indicator */}
        <div
          className="header-security-pill"
          onClick={() => setActiveView('security')}
          title="Click to view Security & Control policies"
        >
          <ShieldCheck size={14} color="#059669" />
          <span>Strict Mode: Approvals Required</span>
        </div>

        {/* Ask AI shortcut */}
        <button
          className="btn btn-primary btn-sm"
          onClick={() => setActiveView('chat')}
        >
          <Plus size={14} />
          <span>Ask AI</span>
        </button>

        {/* Notification bell */}
        <div
          style={{ position: 'relative', cursor: 'pointer' }}
          onClick={() => setActiveView('approvals')}
          title={`${pendingCount} pending approvals`}
        >
          <button
            className="theme-toggle-btn"
            style={{ position: 'relative' }}
          >
            <Bell size={15} />
            {pendingCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-3px',
                  right: '-3px',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#ef4444'
                }}
              />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}

import React, { useState } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import {
  LayoutDashboard,
  MessageSquare,
  Database,
  Bot,
  Video,
  Compass,
  CheckSquare,
  FolderGit2,
  Users,
  ShieldCheck,
  HardDrive,
  Mail,
  Layers,
  CheckCircle2,
  Activity,
  FileText,
  Shield,
  Settings,
  HelpCircle,
  Sun,
  Moon,
  ChevronDown,
  Search,
  Sparkles,
  Lock,
  Briefcase,
  LifeBuoy,
  CreditCard,
  ShieldAlert,
  Globe
} from 'lucide-react';
import GithubIcon from './GithubIcon';

export default function Sidebar() {
  const {
    activeView,
    setActiveView,
    setSiteMode,
    workspace,
    approvals,
    theme,
    toggleTheme,
    setCommandPaletteOpen,
    demoTourActive,
    setDemoTourActive,
    setDemoTourStep,
    setOnboardingOpen
  } = useWorkspace();

  const [workspaceDropdownOpen, setWorkspaceDropdownOpen] = useState(false);

  // Count pending approvals dynamically
  const pendingApprovalsCount = approvals.filter(a => a.status === 'pending').length;

  const handleStartDemoTour = () => {
    setDemoTourActive(true);
    setDemoTourStep(1);
    setActiveView('knowledge');
  };

  const navItem = (viewId, label, Icon, badge = null, badgeClass = '') => {
    const isActive = activeView === viewId;
    return (
      <div
        key={viewId}
        id={`nav-${viewId}`}
        className={`nav-item ${isActive ? 'active' : ''}`}
        onClick={() => setActiveView(viewId)}
      >
        <div className="nav-item-left">
          <Icon size={16} strokeWidth={isActive ? 2.2 : 1.8} />
          <span>{label}</span>
        </div>
        {badge !== null && badge !== undefined && (
          <span className={`nav-item-badge ${badgeClass}`}>{badge}</span>
        )}
      </div>
    );
  };

  return (
    <aside className="app-sidebar">
      {/* Sidebar Header: Brand + Status */}
      <div className="sidebar-header">
        <div className="brand-wrapper">
          <div className="brand-logo-icon">
            <Shield size={16} strokeWidth={2.5} />
          </div>
          <span className="brand-title">BUILDORA</span>
          <span className="brand-badge">
            <span className="brand-badge-dot"></span>
            SOC2 SECURE
          </span>
        </div>

        {/* Workspace Switcher */}
        <div style={{ position: 'relative' }}>
          <div
            className="workspace-selector"
            onClick={() => setWorkspaceDropdownOpen(!workspaceDropdownOpen)}
          >
            <div className="workspace-info">
              <span className="workspace-icon">⚡</span>
              <span className="workspace-name">{workspace.name}</span>
            </div>
            <ChevronDown size={14} color="var(--text-tertiary)" />
          </div>

          {workspaceDropdownOpen && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                marginTop: '4px',
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-lg)',
                zIndex: 50,
                overflow: 'hidden',
                padding: '4px'
              }}
            >
              {workspace.workspaces.map(ws => (
                <div
                  key={ws.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 10px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '12px',
                    cursor: 'pointer',
                    backgroundColor: ws.name === workspace.name ? 'var(--bg-hover)' : 'transparent',
                    color: 'var(--text-primary)'
                  }}
                  onClick={() => {
                    setWorkspace(prev => ({ ...prev, name: ws.name, id: ws.id }));
                    setWorkspaceDropdownOpen(false);
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>{ws.icon}</span>
                    <span style={{ fontWeight: 600 }}>{ws.name}</span>
                  </div>
                  <span style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>{ws.role}</span>
                </div>
              ))}
              <div
                style={{
                  borderTop: '1px solid var(--border)',
                  marginTop: '4px',
                  paddingTop: '6px',
                  paddingBottom: '2px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '11px',
                  color: 'var(--primary)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  paddingLeft: '10px'
                }}
                onClick={() => {
                  setWorkspaceDropdownOpen(false);
                  setOnboardingOpen(true);
                }}
              >
                <span>+</span> Launch Onboarding Wizard
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Search Shortcut */}
      <div
        className="sidebar-search-btn"
        onClick={() => setCommandPaletteOpen(true)}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Search size={14} />
          <span>Quick find...</span>
        </div>
        <span className="kbd-shortcut">⌘K</span>
      </div>

      {/* Navigation Scrollable Area */}
      <div className="sidebar-nav-scroll">
        {/* Workspace Section */}
        <div className="sidebar-group">
          <div className="sidebar-group-title">Workspace</div>
          {navItem('overview', 'Overview', LayoutDashboard)}
          {navItem('chat', 'AI Chat', MessageSquare)}
          {navItem('knowledge', 'Company Knowledge', Database, '247', 'badge-blue')}
          {navItem('agents', 'Agents', Bot, '6 Active')}
          {navItem('meetings', 'Meetings', Video)}
          {navItem('research', 'Research', Compass)}
          {navItem('sales', 'Sales Agent', Mail)}
          {navItem('support', 'Support Agent', LifeBuoy)}
          {navItem('tasks', 'Tasks', CheckSquare, '5')}
          {navItem('projects', 'Projects', Briefcase)}
        </div>

        {/* Team Section */}
        <div className="sidebar-group">
          <div className="sidebar-group-title">Team</div>
          {navItem('team', 'Team Members', Users, '4')}
          {navItem('permissions', 'Roles & Permissions', ShieldCheck)}
        </div>

        {/* Integrations Section */}
        <div className="sidebar-group">
          <div className="sidebar-group-title">Integrations</div>
          <div
            className={`nav-item ${activeView === 'integrations' ? 'active' : ''}`}
            onClick={() => setActiveView('integrations')}
          >
            <div className="nav-item-left">
              <Layers size={16} />
              <span>All Connected (6)</span>
            </div>
            <span className="nav-item-badge badge-emerald">Live</span>
          </div>
          <div
            className="nav-item"
            style={{ fontSize: '12px', paddingLeft: '28px', color: 'var(--text-tertiary)' }}
            onClick={() => setActiveView('knowledge')}
          >
            <div className="nav-item-left" style={{ gap: '8px' }}>
              <HardDrive size={13} color="#059669" />
              <span>Google Drive</span>
            </div>
            <span style={{ fontSize: '10px', color: 'var(--emerald-text)' }}>●</span>
          </div>
          <div
            className="nav-item"
            style={{ fontSize: '12px', paddingLeft: '28px', color: 'var(--text-tertiary)' }}
            onClick={() => setActiveView('chat')}
          >
            <div className="nav-item-left" style={{ gap: '8px' }}>
              <MessageSquare size={13} color="#d97706" />
              <span>Slack</span>
            </div>
            <span style={{ fontSize: '10px', color: 'var(--emerald-text)' }}>●</span>
          </div>
          <div
            className="nav-item"
            style={{ fontSize: '12px', paddingLeft: '28px', color: 'var(--text-tertiary)' }}
            onClick={() => setActiveView('approvals')}
          >
            <div className="nav-item-left" style={{ gap: '8px' }}>
              <Mail size={13} color="#2563eb" />
              <span>Gmail</span>
            </div>
            <span style={{ fontSize: '10px', color: 'var(--amber-text)' }}>Draft</span>
          </div>
          <div
            className="nav-item"
            style={{ fontSize: '12px', paddingLeft: '28px', color: 'var(--text-tertiary)' }}
            onClick={() => setActiveView('meetings')}
          >
            <div className="nav-item-left" style={{ gap: '8px' }}>
              <Video size={13} color="#dc2626" />
              <span>Google Meet</span>
            </div>
            <span style={{ fontSize: '10px', color: 'var(--emerald-text)' }}>●</span>
          </div>
          <div
            className="nav-item"
            style={{ fontSize: '12px', paddingLeft: '28px', color: 'var(--text-tertiary)' }}
            onClick={() => setActiveView('audit')}
          >
            <div className="nav-item-left" style={{ gap: '8px' }}>
              <GithubIcon size={13} color="#7c3aed" />
              <span>GitHub</span>
            </div>
            <span style={{ fontSize: '10px', color: 'var(--emerald-text)' }}>●</span>
          </div>
        </div>

        {/* Control Section */}
        <div className="sidebar-group">
          <div className="sidebar-group-title">Control & Security</div>
          {navItem(
            'approvals',
            'Approvals',
            CheckCircle2,
            pendingApprovalsCount > 0 ? pendingApprovalsCount : null,
            'badge-amber'
          )}
          {navItem('activity', 'Activity', Activity)}
          {navItem('audit', 'Audit Logs', FileText)}
          {navItem('security', 'Security & Control', Shield)}
        </div>
      </div>

      {/* Sidebar Footer */}
      <div className="sidebar-footer">
        {/* 5-Minute Pitch Demo Tour button */}
        <button
          className="demo-pitch-btn"
          onClick={handleStartDemoTour}
          title="Start interactive 7-step guided demo for founders & investors"
        >
          <Sparkles size={14} />
          <span>5-Min Pitch Demo</span>
        </button>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <div
            className={`nav-item ${activeView === 'billing' ? 'active' : ''}`}
            onClick={() => setActiveView('billing')}
            style={{ padding: '5px 8px' }}
          >
            <div className="nav-item-left">
              <CreditCard size={15} />
              <span>Billing & Usage</span>
            </div>
            <span className="badge badge-emerald" style={{ fontSize: '9px', padding: '1px 5px' }}>14d Trial</span>
          </div>

          <div
            className={`nav-item ${activeView === 'admin' ? 'active' : ''}`}
            onClick={() => setActiveView('admin')}
            style={{ padding: '5px 8px' }}
          >
            <div className="nav-item-left">
              <ShieldAlert size={15} />
              <span>Admin Console</span>
            </div>
          </div>

          <div
            className={`nav-item ${activeView === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveView('settings')}
            style={{ padding: '5px 8px' }}
          >
            <div className="nav-item-left">
              <Settings size={15} />
              <span>Settings</span>
            </div>
          </div>

          <div
            className="nav-item"
            onClick={() => setSiteMode('landing')}
            style={{ padding: '5px 8px', color: 'var(--primary)' }}
          >
            <div className="nav-item-left">
              <Globe size={15} />
              <span style={{ fontWeight: 600 }}>Marketing Site</span>
            </div>
          </div>
        </div>

        {/* User Profile Row */}
        <div className="user-profile-row">
          <div className="user-profile-left">
            <div className="user-avatar-initials">AR</div>
            <div className="user-name-col">
              <span className="user-name">Alex Rivera</span>
              <span className="user-role-badge">Founder & Admin</span>
            </div>
          </div>

          <button
            className="theme-toggle-btn"
            onClick={toggleTheme}
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
          >
            {theme === 'light' ? <Moon size={14} /> : <Sun size={14} />}
          </button>
        </div>
      </div>
    </aside>
  );
}

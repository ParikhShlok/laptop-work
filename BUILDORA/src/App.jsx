import React from 'react';
import { WorkspaceProvider, useWorkspace } from './context/WorkspaceContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DemoTourBar from './components/DemoTourBar';
import CommandPalette from './components/CommandPalette';
import OnboardingModal from './components/OnboardingModal';
import DocumentDrawer from './components/DocumentDrawer';
import AuthModal from './components/AuthModal';
import CheckoutModal from './components/CheckoutModal';
import AiKeyModal from './components/AiKeyModal';

// Views
import LandingPageView from './views/LandingPageView';
import OverviewView from './views/OverviewView';
import ChatView from './views/ChatView';
import KnowledgeView from './views/KnowledgeView';
import AgentsView from './views/AgentsView';
import MeetingAgentView from './views/MeetingAgentView';
import ResearchAgentView from './views/ResearchAgentView';
import SalesAgentView from './views/SalesAgentView';
import SupportAgentView from './views/SupportAgentView';
import ApprovalView from './views/ApprovalView';
import SecurityView from './views/SecurityView';
import PermissionsView from './views/PermissionsView';
import AuditLogView from './views/AuditLogView';
import TasksView from './views/TasksView';
import IntegrationsView from './views/IntegrationsView';
import ActivityView from './views/ActivityView';
import ProjectsView from './views/ProjectsView';
import TeamView from './views/TeamView';
import SettingsView from './views/SettingsView';
import BillingView from './views/BillingView';
import AdminView from './views/AdminView';

import { CheckCircle2, AlertTriangle, Info, ArrowLeft, RefreshCw, Key, Shield } from 'lucide-react';

function AppContent() {
  const {
    siteMode,
    setSiteMode,
    activeView,
    toast,
    resetDemoData,
    setAiKeyModalOpen
  } = useWorkspace();

  // If siteMode is landing, render the public marketing landing page!
  if (siteMode === 'landing') {
    return (
      <>
        <LandingPageView />
        <AuthModal />
        <CheckoutModal />
        <AiKeyModal />
      </>
    );
  }

  const renderCurrentView = () => {
    switch (activeView) {
      case 'overview':
        return <OverviewView />;
      case 'chat':
        return <ChatView />;
      case 'knowledge':
        return <KnowledgeView />;
      case 'agents':
        return <AgentsView />;
      case 'meetings':
        return <MeetingAgentView />;
      case 'research':
        return <ResearchAgentView />;
      case 'sales':
        return <SalesAgentView />;
      case 'support':
        return <SupportAgentView />;
      case 'approvals':
        return <ApprovalView />;
      case 'security':
        return <SecurityView />;
      case 'permissions':
        return <PermissionsView />;
      case 'audit':
        return <AuditLogView />;
      case 'tasks':
        return <TasksView />;
      case 'integrations':
        return <IntegrationsView />;
      case 'activity':
        return <ActivityView />;
      case 'projects':
        return <ProjectsView />;
      case 'team':
        return <TeamView />;
      case 'settings':
        return <SettingsView />;
      case 'billing':
        return <BillingView />;
      case 'admin':
        return <AdminView />;
      default:
        return <OverviewView />;
    }
  };

  return (
    <div className="app-container">
      {/* Persistent Left Sidebar */}
      <Sidebar />

      {/* Main Stage */}
      <div className="app-main">
        {/* Top Sandbox Navigation Banner */}
        <div
          style={{
            backgroundColor: 'var(--brand-navy)',
            color: '#ffffff',
            padding: '8px 16px',
            fontSize: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(255,255,255,0.1)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981' }} />
            <strong style={{ letterSpacing: '0.02em' }}>
              {siteMode === 'demo' ? '⚡ Interactive Demo Sandbox (AcmeFlow)' : '🧪 Product Preview Workspace'}
            </strong>
            <span style={{ color: 'rgba(255,255,255,0.5)' }}>•</span>
            <span style={{ color: 'rgba(255,255,255,0.8)' }}>
              {siteMode === 'demo'
                ? 'Simulated data and actions — no external systems are connected'
                : 'Preview environment — connect live systems only after a scoped pilot setup'}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={() => setAiKeyModalOpen(true)}
              style={{
                background: 'none',
                border: 'none',
                color: '#93c5fd',
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <Key size={12} />
              <span>AI API Keys</span>
            </button>

            {siteMode === 'demo' && (
              <button
                onClick={resetDemoData}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#cbd5e1',
                  fontSize: '11px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <RefreshCw size={11} />
                <span>Reset Demo State</span>
              </button>
            )}

            <button
              onClick={() => setSiteMode('landing')}
              style={{
                backgroundColor: 'rgba(255,255,255,0.15)',
                border: 'none',
                color: '#ffffff',
                padding: '4px 10px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '11px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <ArrowLeft size={12} />
              <span>Return to Marketing Home</span>
            </button>
          </div>
        </div>

        {/* Pitch Demo Guidance Bar (when active) */}
        <DemoTourBar />

        {/* Global App Header */}
        <Header />

        {/* Active View Container */}
        <main style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {renderCurrentView()}
        </main>
      </div>

      {/* Global Drawers & Modals */}
      <CommandPalette />
      <OnboardingModal />
      <DocumentDrawer />
      <AuthModal />
      <CheckoutModal />
      <AiKeyModal />

      {/* Global Toast Notification System */}
      {toast && (
        <div className="toast-container">
          <div
            className={`toast ${
              toast.type === 'warning'
                ? 'toast-warning'
                : toast.type === 'info'
                ? 'toast-info'
                : ''
            }`}
          >
            {toast.type === 'warning' ? (
              <AlertTriangle size={16} color="#f59e0b" />
            ) : toast.type === 'info' ? (
              <Info size={16} color="#3b82f6" />
            ) : (
              <CheckCircle2 size={16} color="#10b981" />
            )}
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <WorkspaceProvider>
      <AppContent />
    </WorkspaceProvider>
  );
}

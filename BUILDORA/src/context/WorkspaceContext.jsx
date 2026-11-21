import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  INITIAL_WORKSPACE,
  INITIAL_KPIS,
  INITIAL_ACTIVITIES,
  KNOWLEDGE_SOURCES,
  INITIAL_AGENTS,
  INITIAL_APPROVALS,
  INITIAL_AUDIT_LOGS,
  INITIAL_TASKS,
  TEAM_MEMBERS,
  AGENT_PERMISSIONS_MATRIX,
  INTEGRATIONS_LIST,
  SECURITY_METRICS,
  MEETING_DEMO_DATA,
  RESEARCH_DEMO_DATA,
  SALES_LEAD_DATA
} from '../data/mockData';
import { getAiConfig, saveAiConfig } from '../services/aiService';
import { apiClient } from '../api/client';

const WorkspaceContext = createContext(null);

export function WorkspaceProvider({ children }) {
  // Theme state: light by default as required
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('buildora_theme') || 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('buildora_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // Site Mode: 'landing' (public marketing page), 'demo' (interactive sandbox), 'app' (authenticated workspace)
  const [siteMode, setSiteMode] = useState(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const modeParam = urlParams.get('mode');
    if (modeParam === 'demo' || modeParam === 'app') return modeParam;
    return 'landing'; // Default to landing page first as requested!
  });

  // Current active navigation view within the workspace
  const [activeView, setActiveView] = useState('overview');
  
  // Workspace metadata
  const [workspace, setWorkspace] = useState(INITIAL_WORKSPACE);
  const [currentWorkspaceId, setCurrentWorkspaceId] = useState('ws-acme-prod');

  // Core application entities with reactive states
  const [kpis, setKpis] = useState(INITIAL_KPIS);
  const [activities, setActivities] = useState(INITIAL_ACTIVITIES);
  const [approvals, setApprovals] = useState(INITIAL_APPROVALS);
  const [auditLogs, setAuditLogs] = useState(INITIAL_AUDIT_LOGS);
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [knowledgeSources, setKnowledgeSources] = useState(KNOWLEDGE_SOURCES);
  const [agents, setAgents] = useState(INITIAL_AGENTS);
  const [agentPermissions, setAgentPermissions] = useState(AGENT_PERMISSIONS_MATRIX);
  const [integrations, setIntegrations] = useState(INTEGRATIONS_LIST);
  const [securityData, setSecurityData] = useState(SECURITY_METRICS);

  // Auth State
  const [isLoggedIn, setIsLoggedIn] = useState(() => Boolean(apiClient.getSession()?.access_token));
  const [authModalOpen, setAuthModalOpen] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('mode') === 'app' && ['signup', 'login'].includes(params.get('auth'));
  });
  const [authModalMode, setAuthModalMode] = useState(() => {
    const mode = new URLSearchParams(window.location.search).get('auth');
    return mode === 'login' ? 'login' : 'signup';
  }); // 'login' | 'signup'

  // Pricing & Checkout
  const [pricingModalOpen, setPricingModalOpen] = useState(false);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState({
    id: 'growth',
    name: 'Growth',
    price: 199,
    interval: 'month',
    features: ['Up to 25 team members', 'Unlimited AI agents', 'Strict human approval gates', 'SOC2 audit logging']
  });

  // Real-Time AI API Config
  const [aiKeyModalOpen, setAiKeyModalOpen] = useState(false);
  const [aiConfig, setAiConfig] = useState(getAiConfig);

  const updateAiConfig = (newConfig) => {
    setAiConfig(newConfig);
    saveAiConfig(newConfig);
    showToast(`AI Engine updated: ${newConfig.provider.toUpperCase()} (${newConfig.model})`, 'success');
  };

  // Command palette and modals
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [onboardingOpen, setOnboardingOpen] = useState(false);
  const [previewDoc, setPreviewDoc] = useState(null);

  // Toast notification
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success', duration = 3500) => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast(current => (current && current.id === toast?.id ? null : current));
    }, duration);
  };

  // Demo Tour State
  const [demoTourActive, setDemoTourActive] = useState(false);
  const [demoTourStep, setDemoTourStep] = useState(1);

  // Sync pending approvals count with KPI card dynamically
  useEffect(() => {
    const pendingCount = approvals.filter(a => a.status === 'pending').length;
    setKpis(prev =>
      prev.map(kpi =>
        kpi.id === 'pending_approvals' ? { ...kpi, value: String(pendingCount) } : kpi
      )
    );
  }, [approvals]);

  // Auth Handlers
  const openLogin = () => {
    setAuthModalMode('login');
    setAuthModalOpen(true);
  };

  const openSignup = (defaultPlan = null) => {
    if (defaultPlan) setSelectedPlan(defaultPlan);
    setAuthModalMode('signup');
    setAuthModalOpen(true);
  };

  const loginUser = (profile) => {
    setIsLoggedIn(true);
    localStorage.setItem('buildora_logged_in', 'true');
    if (profile) {
      setCurrentWorkspaceId(profile.workspace_id);
      setWorkspace(prev => ({ ...prev, name: profile.workspace_name, currentUser: { name: profile.name, email: profile.email, role: profile.role } }));
    }
    setAuthModalOpen(false);
    setSiteMode('app');
    showToast(`Welcome, ${profile?.name || 'back'}!`, 'success');
  };

  const signupUser = (profile) => loginUser(profile);

  const logoutUser = () => {
    apiClient.logoutPilot();
    setIsLoggedIn(false);
    localStorage.removeItem('buildora_logged_in');
    setSiteMode('landing');
    showToast('Logged out successfully.', 'info');
  };

  // Checkout Handlers
  const openCheckout = (plan) => {
    setSelectedPlan(plan);
    setPricingModalOpen(false);
    setCheckoutModalOpen(true);
  };

  const handlePaymentSuccess = (plan) => {
    setWorkspace(prev => ({
      ...prev,
      plan: `${plan.name} Tier Active`
    }));
    setCheckoutModalOpen(false);
    showToast(`Subscription activated: ${plan.name} plan is now active!`, 'success');
    if (!isLoggedIn) {
      setIsLoggedIn(true);
      setSiteMode('app');
    }
  };

  // Reset Demo Data
  const resetDemoData = () => {
    setWorkspace(INITIAL_WORKSPACE);
    setKpis(INITIAL_KPIS);
    setActivities(INITIAL_ACTIVITIES);
    setApprovals(INITIAL_APPROVALS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setTasks(INITIAL_TASKS);
    setKnowledgeSources(KNOWLEDGE_SOURCES);
    setAgents(INITIAL_AGENTS);
    setAgentPermissions(AGENT_PERMISSIONS_MATRIX);
    setIntegrations(INTEGRATIONS_LIST);
    setSecurityData(SECURITY_METRICS);
    showToast('Workspace reset to pristine demo state.', 'info');
  };

  // Handle Approvals
  const approveAction = (approvalId, customNotes = '') => {
    const item = approvals.find(a => a.id === approvalId);
    if (!item) return;

    setApprovals(prev =>
      prev.map(a =>
        a.id === approvalId ? { ...a, status: 'approved', approvedAt: 'Just now', approver: workspace.currentUser.name } : a
      )
    );

    const newAudit = {
      id: `aud-${Date.now()}`,
      timestamp: 'Just now',
      date: 'Today',
      user: `${workspace.currentUser.name} (Founder)`,
      agent: item.agent,
      action: item.actionTitle,
      resource: item.recipient || item.targetSystem,
      result: 'Executed after Founder Approval',
      statusBadge: 'emerald',
      ipHash: '192.168.1.104 [Air-Gapped VPC]',
      approvalStatus: `Approved by ${workspace.currentUser.name}`,
      details: `Action executed on ${item.targetSystem}. Full payload hash: sha256_${Math.random().toString(36).substring(2, 10)}. Human-in-the-loop requirement satisfied.`
    };
    setAuditLogs(prev => [newAudit, ...prev]);

    const newActivity = {
      id: `act-${Date.now()}`,
      agent: item.agent,
      agentIcon: item.agentIcon,
      action: `Approved & executed: ${item.actionTitle}`,
      detail: `Target: ${item.recipient}. Completed via ${item.targetSystem}.`,
      time: 'Just now',
      status: 'Executed',
      statusColor: 'emerald',
      approvalRequired: false,
      risk: item.riskLevel,
      targetView: 'audit',
      targetId: newAudit.id
    };
    setActivities(prev => [newActivity, ...prev]);

    setKpis(prev =>
      prev.map(kpi =>
        kpi.id === 'tasks_completed'
          ? { ...kpi, value: String(parseInt(kpi.value, 10) + 1) }
          : kpi
      )
    );

    showToast(`Approved & Executed: "${item.actionTitle}". Logged to immutable audit trail.`, 'success');
  };

  const rejectAction = (approvalId, reason = 'Rejected by founder') => {
    const item = approvals.find(a => a.id === approvalId);
    if (!item) return;

    setApprovals(prev =>
      prev.map(a =>
        a.id === approvalId ? { ...a, status: 'rejected', rejectedAt: 'Just now', rejectionReason: reason } : a
      )
    );

    const newAudit = {
      id: `aud-${Date.now()}`,
      timestamp: 'Just now',
      date: 'Today',
      user: `${workspace.currentUser.name} (Founder)`,
      agent: item.agent,
      action: item.actionTitle,
      resource: item.recipient || item.targetSystem,
      result: 'Blocked / Rejected by User',
      statusBadge: 'rose',
      ipHash: '192.168.1.104 [Air-Gapped VPC]',
      approvalStatus: `Rejected by ${workspace.currentUser.name}`,
      details: `Execution denied. Outbound transmission to ${item.targetSystem} was aborted and quarantined.`
    };
    setAuditLogs(prev => [newAudit, ...prev]);

    showToast(`Action rejected. Quarantined in audit log.`, 'warning');
  };

  const modifyAction = (approvalId, updatedPayload) => {
    setApprovals(prev =>
      prev.map(a =>
        a.id === approvalId
          ? { ...a, payload: { ...a.payload, ...updatedPayload }, status: 'modified' }
          : a
      )
    );
    showToast(`Action payload updated. Re-staged for approval.`, 'info');
  };

  // Task management
  const toggleTask = (taskId) => {
    setTasks(prev =>
      prev.map(t => (t.id === taskId ? { ...t, completed: !t.completed } : t))
    );
  };

  const addTask = (newTask) => {
    const task = {
      id: `task-${Date.now()}`,
      completed: false,
      origin: 'User Created',
      originType: 'user',
      ...newTask
    };
    setTasks(prev => [task, ...prev]);
    showToast(`Task "${task.title}" added to workspace.`, 'success');
  };

  const createMeetingTasks = (actionItems) => {
    const formatted = actionItems.map((item, idx) => ({
      id: `task-meet-${Date.now()}-${idx}`,
      title: item.task,
      origin: 'Product Strategy Meeting',
      originType: 'meeting',
      assignee: item.owner,
      assigneeRole: item.category,
      due: item.due,
      priority: idx === 0 ? 'Urgent' : 'Medium',
      completed: false,
      category: item.category,
      notes: `Extracted from Google Meet recording (Sep 30)`
    }));

    setTasks(prev => [...formatted, ...prev]);
    
    const auditEntry = {
      id: `aud-${Date.now()}`,
      timestamp: 'Just now',
      date: 'Today',
      user: 'Meeting Agent',
      agent: 'Meeting Agent',
      action: 'Created 3 tasks from transcript',
      resource: 'Product Strategy Meeting',
      result: 'Tasks Staged',
      statusBadge: 'emerald',
      ipHash: 'Internal Worker Node',
      approvalStatus: 'Policy Pre-Approved (Internal Task Creation)',
      details: `Staged 3 tasks: SSO requirements (Rahul), Onboarding flow (Sarah), 5 Customer interviews (Maya).`
    };
    setAuditLogs(prev => [auditEntry, ...prev]);

    showToast(`3 action items turned into workspace tasks!`, 'success');
  };

  // Keyboard shortcut for Command Palette
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <WorkspaceContext.Provider
      value={{
        theme,
        toggleTheme,
        siteMode,
        setSiteMode,
        activeView,
        setActiveView,
        workspace,
        setWorkspace,
        currentWorkspaceId,
        setCurrentWorkspaceId,
        kpis,
        activities,
        approvals,
        approveAction,
        rejectAction,
        modifyAction,
        auditLogs,
        tasks,
        toggleTask,
        addTask,
        createMeetingTasks,
        knowledgeSources,
        setKnowledgeSources,
        agents,
        setAgents,
        agentPermissions,
        setAgentPermissions,
        integrations,
        setIntegrations,
        securityData,
        // Auth
        isLoggedIn,
        authModalOpen,
        setAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        openLogin,
        openSignup,
        loginUser,
        signupUser,
        logoutUser,
        // Billing & Pricing
        pricingModalOpen,
        setPricingModalOpen,
        checkoutModalOpen,
        setCheckoutModalOpen,
        selectedPlan,
        setSelectedPlan,
        openCheckout,
        handlePaymentSuccess,
        // Real-Time AI Keys
        aiKeyModalOpen,
        setAiKeyModalOpen,
        aiConfig,
        updateAiConfig,
        // Reset Demo
        resetDemoData,
        // Other Modals
        commandPaletteOpen,
        setCommandPaletteOpen,
        onboardingOpen,
        setOnboardingOpen,
        previewDoc,
        setPreviewDoc,
        toast,
        showToast,
        demoTourActive,
        setDemoTourActive,
        demoTourStep,
        setDemoTourStep,
        meetingDemoData: MEETING_DEMO_DATA,
        researchDemoData: RESEARCH_DEMO_DATA,
        salesLeadData: SALES_LEAD_DATA,
        teamMembers: TEAM_MEMBERS
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
}

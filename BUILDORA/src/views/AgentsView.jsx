import React, { useState } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import {
  Bot,
  Video,
  Compass,
  TrendingUp,
  MessageSquare,
  Share2,
  Code2,
  Shield,
  Layers,
  Activity,
  Settings2,
  ArrowRight,
  CheckCircle2,
  X,
  Lock,
  Play
} from 'lucide-react';

const AGENT_ICONS = {
  meeting: Video,
  research: Compass,
  sales: TrendingUp,
  support: MessageSquare,
  marketing: Share2,
  developer: Code2
};

export default function AgentsView() {
  const { agents, setAgents, setActiveView, showToast } = useWorkspace();
  const [configuringAgent, setConfiguringAgent] = useState(null);

  const toggleAgentStatus = (agentId) => {
    setAgents(prev =>
      prev.map(a => {
        if (a.id === agentId) {
          const newStatus = a.status === 'Active' ? 'Paused' : 'Active';
          showToast(`${a.name} is now ${newStatus}.`, 'info');
          return {
            ...a,
            status: newStatus,
            statusType: newStatus === 'Active' ? 'active' : 'paused'
          };
        }
        return a;
      })
    );
  };

  const handleLaunchAgent = (agentId) => {
    if (agentId === 'meeting') setActiveView('meetings');
    else if (agentId === 'research') setActiveView('research');
    else if (agentId === 'sales') setActiveView('sales');
    else if (agentId === 'support') setActiveView('approvals');
    else if (agentId === 'developer') setActiveView('approvals');
    else if (agentId === 'marketing') setActiveView('tasks');
  };

  return (
    <div className="view-container">
      {/* Header */}
      <div className="view-header">
        <div>
          <h1 className="view-title">AI Agents</h1>
          <p className="view-subtitle">Specialized AI workers for your startup.</p>
        </div>

        <button
          className="btn btn-primary btn-sm"
          onClick={() => setActiveView('permissions')}
        >
          <Shield size={14} />
          <span>Manage Agent Permissions Matrix</span>
        </button>
      </div>

      {/* Security Callout */}
      <div className="security-banner banner-blue">
        <div className="security-banner-icon">
          <Shield size={20} color="#2563eb" />
        </div>
        <div className="security-banner-content" style={{ flex: 1 }}>
          <h4>Least-Privilege Agent Isolation</h4>
          <p>
            Each agent runs in a dedicated ephemeral sandbox with strictly scoped tools. Agents marked with external execution capabilities (Sales, Support, Developer) are held at the approval boundary before contacting third parties.
          </p>
        </div>
      </div>

      {/* Agent Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '20px' }}>
        {agents.map(agent => {
          const Icon = AGENT_ICONS[agent.id] || Bot;
          const isActive = agent.status === 'Active';
          return (
            <div
              key={agent.id}
              className="card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '20px',
                borderColor: isActive ? 'var(--border)' : 'var(--border-light)'
              }}
            >
              <div>
                {/* Card Top: Icon, Name, Status Badge */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: isActive ? 'var(--primary-light)' : 'var(--bg-tertiary)',
                        color: isActive ? 'var(--primary)' : 'var(--text-tertiary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Icon size={20} />
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>
                          {agent.name}
                        </span>
                        <span className="badge badge-indigo" style={{ fontSize: '10px' }}>
                          {agent.badge}
                        </span>
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>
                        {agent.category}
                      </div>
                    </div>
                  </div>

                  <span
                    className={`badge ${
                      isActive ? 'badge-emerald' : 'badge-blue'
                    }`}
                  >
                    {agent.status}
                  </span>
                </div>

                {/* Tagline */}
                <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
                  "{agent.tagline}"
                </p>

                {/* Description */}
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '16px' }}>
                  {agent.description}
                </p>

                {/* Metadata Details */}
                <div
                  style={{
                    backgroundColor: 'var(--bg-tertiary)',
                    borderRadius: 'var(--radius-md)',
                    padding: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    fontSize: '11px',
                    marginBottom: '16px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Connected Tools:</span>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                      {agent.connectedTools.join(', ')}
                    </span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Permissions:</span>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)', textAlign: 'right' }}>
                      {agent.permissions}
                    </span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Risk Classification:</span>
                    <span
                      className={`risk-pill ${
                        agent.riskLevel.includes('High')
                          ? 'risk-high'
                          : agent.riskLevel.includes('Medium')
                          ? 'risk-medium'
                          : 'risk-low'
                      }`}
                      style={{ fontSize: '10px', padding: '1px 6px' }}
                    >
                      {agent.riskLevel}
                    </span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Usage:</span>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                      {agent.usage}
                    </span>
                  </div>
                </div>

                {/* Recent Activity Pill */}
                <div
                  style={{
                    fontSize: '11px',
                    color: 'var(--text-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    marginBottom: '16px'
                  }}
                >
                  <Activity size={12} color="var(--primary)" />
                  <span>Latest: {agent.recentActivity}</span>
                </div>
              </div>

              {/* Bottom Actions */}
              <div style={{ display: 'flex', gap: '8px', paddingTop: '12px', borderTop: '1px solid var(--border)' }}>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => setConfiguringAgent(agent)}
                  style={{ flex: 1 }}
                >
                  <Settings2 size={13} />
                  <span>Configure</span>
                </button>

                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => handleLaunchAgent(agent.id)}
                  style={{ flex: 1 }}
                >
                  <Play size={13} />
                  <span>Open Agent</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Configure Agent Drawer / Modal */}
      {configuringAgent && (
        <div className="modal-overlay" onClick={() => setConfiguringAgent(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '540px' }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Settings2 size={18} color="var(--primary)" />
                <span className="card-title">Configure {configuringAgent.name}</span>
              </div>
              <button
                onClick={() => setConfiguringAgent(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)' }}
              >
                <X size={18} />
              </button>
            </div>

            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>
                  Execution State
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    className={`btn btn-sm ${configuringAgent.status === 'Active' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => toggleAgentStatus(configuringAgent.id)}
                  >
                    Active
                  </button>
                  <button
                    className={`btn btn-sm ${configuringAgent.status !== 'Active' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => toggleAgentStatus(configuringAgent.id)}
                  >
                    Paused
                  </button>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>
                  External Action Policy
                </label>
                <div
                  style={{
                    padding: '12px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--amber-bg)',
                    border: '1px solid var(--amber-border)',
                    fontSize: '12px',
                    color: 'var(--text-primary)'
                  }}
                >
                  <div style={{ fontWeight: 700, color: 'var(--amber-text)', marginBottom: '2px' }}>
                    Strict Mode Enforced
                  </div>
                  Any outbound email, webhook dispatch, or database mutation generated by this agent is intercepted and queued for human approval.
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>
                  Prompt Injection Guardrail Sensitivity
                </label>
                <select className="form-input">
                  <option>Maximum (Sanitize all inputs + Strip system overrides)</option>
                  <option>Standard (Heuristic classifier)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>
                  Max Rate Limit
                </label>
                <input type="text" className="form-input" defaultValue="50 queries / min" />
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary btn-sm" onClick={() => setConfiguringAgent(null)}>
                Close
              </button>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => {
                  showToast(`Configuration updated for ${configuringAgent.name}.`, 'success');
                  setConfiguringAgent(null);
                }}
              >
                Save Guardrails
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

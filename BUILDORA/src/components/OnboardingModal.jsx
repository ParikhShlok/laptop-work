import React, { useState } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import {
  ShieldCheck,
  Check,
  ArrowRight,
  ArrowLeft,
  X,
  Sparkles,
  Layers,
  Bot,
  Lock,
  Building,
  Users
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function OnboardingModal() {
  const { onboardingOpen, setOnboardingOpen, setActiveView, showToast, setWorkspace } = useWorkspace();
  const [step, setStep] = useState(1);

  // Form states
  const [companyName, setCompanyName] = useState('Acme AI Labs');
  const [companySize, setCompanySize] = useState('5–15 employees');
  const [industry, setIndustry] = useState('B2B SaaS / Developer Tools');

  const [selectedTools, setSelectedTools] = useState([
    'Google Workspace',
    'Slack',
    'GitHub'
  ]);

  const [selectedAgents, setSelectedAgents] = useState([
    'Meeting Agent',
    'Research Agent',
    'Sales Agent',
    'Support Agent'
  ]);

  const [requireApproval, setRequireApproval] = useState(true);

  if (!onboardingOpen) return null;

  const toggleTool = (tool) => {
    setSelectedTools(prev =>
      prev.includes(tool) ? prev.filter(t => t !== tool) : [...prev, tool]
    );
  };

  const toggleAgent = (agent) => {
    setSelectedAgents(prev =>
      prev.includes(agent) ? prev.filter(a => a !== agent) : [...prev, agent]
    );
  };

  const handleFinish = () => {
    setWorkspace(prev => ({
      ...prev,
      name: companyName || 'Acme AI Labs'
    }));

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // confetti fallback
    }

    setOnboardingOpen(false);
    showToast(`Welcome to Buildora! Your secure workspace for ${companyName} is live.`, 'success');
    setActiveView('chat');
  };

  return (
    <div className="modal-overlay" onClick={() => setOnboardingOpen(false)}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '640px' }}>
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '26px',
                height: '26px',
                borderRadius: '6px',
                backgroundColor: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff'
              }}
            >
              <Sparkles size={14} />
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
                Buildora Workspace Setup
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>
                Step {step} of 6 • Less than 10 minutes
              </div>
            </div>
          </div>

          <button
            onClick={() => setOnboardingOpen(false)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body" style={{ minHeight: '340px' }}>
          {/* STEP 1: Welcome */}
          {step === 1 && (
            <div style={{ textAlign: 'center', padding: '24px 12px' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #1e293b 0%, #2563eb 100%)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px auto',
                  boxShadow: '0 8px 16px rgba(37, 99, 235, 0.2)'
                }}
              >
                <ShieldCheck size={28} />
              </div>
              <h2 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '8px', color: 'var(--text-primary)' }}>
                Welcome to Buildora
              </h2>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', maxWidth: '440px', margin: '0 auto 24px auto', lineHeight: 1.6 }}>
                Let's set up your AI workspace in less than 10 minutes.
                Bring company knowledge, AI agents, and workflows into one secure environment without losing control of sensitive actions.
              </p>

              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'var(--emerald-bg)',
                  border: '1px solid var(--emerald-border)',
                  color: 'var(--emerald-text)',
                  fontSize: '12px',
                  fontWeight: 600
                }}
              >
                <span>🔒 Built for 5–15 person high-velocity SaaS startups</span>
              </div>
            </div>
          )}

          {/* STEP 2: Company Details */}
          {step === 2 && (
            <div>
              <h3 style={{ fontSize: '17px', fontWeight: 700, marginBottom: '6px' }}>Tell us about your startup</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
                We calibrate agent permissions, knowledge indexing rates, and security boundaries to your team size.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>
                    Company Name
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    value={companyName}
                    onChange={e => setCompanyName(e.target.value)}
                    placeholder="e.g. Acme AI Labs"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>
                    Company Size
                  </label>
                  <select
                    className="form-input"
                    value={companySize}
                    onChange={e => setCompanySize(e.target.value)}
                  >
                    <option value="1–4 employees">1–4 employees (Early Pre-seed)</option>
                    <option value="5–15 employees">5–15 employees (Seed / Series A — Recommended)</option>
                    <option value="16–50 employees">16–50 employees (Growth Stage)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>
                    Industry & Focus
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    value={industry}
                    onChange={e => setIndustry(e.target.value)}
                    placeholder="e.g. B2B SaaS, FinTech, DevTools"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Choose Tools */}
          {step === 3 && (
            <div>
              <h3 style={{ fontSize: '17px', fontWeight: 700, marginBottom: '6px' }}>Choose your connected tools</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '18px' }}>
                Select the repositories and data sources Buildora will securely index.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  { name: 'Google Workspace', desc: 'Drive documents, Gmail drafts, Meet transcripts' },
                  { name: 'Slack', desc: 'Sync public discussions and deliver approval requests' },
                  { name: 'GitHub', desc: 'Code architecture, pull requests, issue tracking' },
                  { name: 'Notion', desc: 'Engineering specs, roadmaps, customer wikis' },
                  { name: 'HubSpot', desc: 'CRM contacts, deal stages, and sales outreach logs' }
                ].map(tool => {
                  const isChecked = selectedTools.includes(tool.name);
                  return (
                    <div
                      key={tool.name}
                      onClick={() => toggleTool(tool.name)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px 16px',
                        borderRadius: 'var(--radius-md)',
                        border: isChecked ? '1px solid var(--primary)' : '1px solid var(--border)',
                        backgroundColor: isChecked ? 'var(--primary-light)' : 'var(--bg-secondary)',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                          {tool.name}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                          {tool.desc}
                        </div>
                      </div>
                      <div
                        style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '4px',
                          border: isChecked ? 'none' : '1px solid var(--border-strong)',
                          backgroundColor: isChecked ? 'var(--primary)' : 'transparent',
                          color: '#fff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        {isChecked && <Check size={14} strokeWidth={3} />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 4: Choose First Agents */}
          {step === 4 && (
            <div>
              <h3 style={{ fontSize: '17px', fontWeight: 700, marginBottom: '6px' }}>Choose your first AI agents</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '18px' }}>
                Activate specialized agents for your startup's day-to-day operations.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {[
                  { name: 'Meeting Agent', desc: 'Turn meetings into summaries, decisions, and tasks.' },
                  { name: 'Research Agent', desc: 'Research markets, competitors, and customer trends.' },
                  { name: 'Sales Agent', desc: 'Research leads and prepare personalized follow-ups.' },
                  { name: 'Support Agent', desc: 'Draft customer responses using company knowledge.' }
                ].map(agent => {
                  const isChecked = selectedAgents.includes(agent.name);
                  return (
                    <div
                      key={agent.name}
                      onClick={() => toggleAgent(agent.name)}
                      style={{
                        padding: '14px',
                        borderRadius: 'var(--radius-md)',
                        border: isChecked ? '1px solid var(--primary)' : '1px solid var(--border)',
                        backgroundColor: isChecked ? 'var(--primary-light)' : 'var(--bg-secondary)',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        gap: '8px'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
                          {agent.name}
                        </span>
                        <div
                          style={{
                            width: '18px',
                            height: '18px',
                            borderRadius: '4px',
                            border: isChecked ? 'none' : '1px solid var(--border-strong)',
                            backgroundColor: isChecked ? 'var(--primary)' : 'transparent',
                            color: '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          {isChecked && <Check size={12} strokeWidth={3} />}
                        </div>
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                        {agent.desc}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 5: Security Settings */}
          {step === 5 && (
            <div>
              <h3 style={{ fontSize: '17px', fontWeight: 700, marginBottom: '6px' }}>Security & Founder Guardrails</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
                Configure the core Buildora rule: AI can prepare and recommend, but humans control external actions.
              </p>

              <div
                style={{
                  padding: '18px',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--amber-border)',
                  backgroundColor: 'var(--amber-bg)',
                  marginBottom: '16px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--amber-text)', marginBottom: '4px' }}>
                      Require approval for external actions
                    </div>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                      When enabled, no AI agent can send an outbound email, push code to production, or modify live CRM records without explicit founder or admin confirmation.
                    </p>
                  </div>
                  <div
                    onClick={() => setRequireApproval(!requireApproval)}
                    style={{
                      width: '46px',
                      height: '26px',
                      borderRadius: '13px',
                      backgroundColor: requireApproval ? '#059669' : '#94a3b8',
                      position: 'relative',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s',
                      flexShrink: 0
                    }}
                  >
                    <div
                      style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        backgroundColor: '#ffffff',
                        position: 'absolute',
                        top: '3px',
                        left: requireApproval ? '23px' : '3px',
                        transition: 'left 0.2s',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                      }}
                    />
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                  <ShieldCheck size={14} color="#059669" />
                  <span>Immutable audit logging enabled (tamper-evident SHA-256 chain)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                  <ShieldCheck size={14} color="#059669" />
                  <span>Prompt injection sanitizer active on inbound webhooks and tickets</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                  <ShieldCheck size={14} color="#059669" />
                  <span>Zero data retention by underlying LLM inference providers</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: Finished */}
          {step === 6 && (
            <div style={{ textAlign: 'center', padding: '24px 12px' }}>
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--emerald-bg)',
                  border: '2px solid var(--emerald-border)',
                  color: 'var(--emerald-dot)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 18px auto'
                }}
              >
                <Check size={32} strokeWidth={2.5} />
              </div>

              <h2 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '8px', color: 'var(--text-primary)' }}>
                Your Buildora workspace is ready.
              </h2>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', maxWidth: '440px', margin: '0 auto 24px auto', lineHeight: 1.6 }}>
                <strong>{companyName}</strong> has been configured with {selectedTools.length} connected sources, {selectedAgents.length} active AI agents, and strict founder approval enforcement.
              </p>

              <button
                className="btn btn-primary btn-lg"
                onClick={handleFinish}
                style={{ padding: '12px 24px', fontSize: '14px' }}
              >
                <span>Ask Buildora your first question →</span>
              </button>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        {step < 6 && (
          <div className="modal-footer">
            {step > 1 && (
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setStep(step - 1)}
              >
                <ArrowLeft size={13} />
                <span>Back</span>
              </button>
            )}

            <button
              className="btn btn-primary btn-sm"
              onClick={() => setStep(step + 1)}
            >
              <span>Continue</span>
              <ArrowRight size={13} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

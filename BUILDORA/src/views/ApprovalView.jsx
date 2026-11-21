import React, { useState } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  TrendingUp,
  MessageSquare,
  Database,
  Code2,
  Mail,
  LifeBuoy,
  Layers,
  Check,
  ChevronDown,
  ChevronUp,
  Clock,
  Shield,
  ArrowRight,
  ExternalLink,
  Edit3
} from 'lucide-react';
import confetti from 'canvas-confetti';
import GithubIcon from '../components/GithubIcon';

const AGENT_ICON_MAP = {
  'Sales Agent': TrendingUp,
  'Support Agent': MessageSquare,
  'CRM Agent': Database,
  'Developer Agent': Code2
};

const SYSTEM_ICON_MAP = {
  Mail,
  LifeBuoy,
  Layers,
  Github: GithubIcon
};

export default function ApprovalView() {
  const { approvals, approveAction, rejectAction, modifyAction, setActiveView, showToast } = useWorkspace();
  const [expandedId, setExpandedId] = useState('appr-1');
  const [filterRisk, setFilterRisk] = useState('all');

  const pendingApprovals = approvals.filter(a => a.status === 'pending');
  const completedApprovals = approvals.filter(a => a.status !== 'pending');

  const filteredItems = pendingApprovals.filter(item => {
    if (filterRisk === 'all') return true;
    return item.riskLevel.toLowerCase() === filterRisk.toLowerCase();
  });

  const handleApprove = (id) => {
    approveAction(id);
    try {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    } catch (e) {}
  };

  const handleReject = (id) => {
    rejectAction(id);
  };

  return (
    <div className="view-container">
      {/* Header */}
      <div className="view-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="badge badge-amber">{pendingApprovals.length} Pending Review</span>
            <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>Interactive preview of a human review queue</span>
          </div>
          <h1 className="view-title">Approvals</h1>
          <p className="view-subtitle">Inspect proposed actions and practice a review decision. This preview does not execute external actions.</p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className={`btn btn-sm ${filterRisk === 'all' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilterRisk('all')}
          >
            All Risks ({pendingApprovals.length})
          </button>
          <button
            className={`btn btn-sm ${filterRisk === 'high' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilterRisk('high')}
          >
            High Risk
          </button>
          <button
            className={`btn btn-sm ${filterRisk === 'medium' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilterRisk('medium')}
          >
            Medium Risk
          </button>
          <button
            className={`btn btn-sm ${filterRisk === 'low' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilterRisk('low')}
          >
            Low Risk
          </button>
        </div>
      </div>

      {/* Safety Notice Callout */}
      <div className="security-banner banner-amber" style={{ borderColor: 'var(--amber-border)' }}>
        <div className="security-banner-icon">
          <Shield size={20} color="#b45309" />
        </div>
        <div className="security-banner-content" style={{ flex: 1 }}>
          <h4>Why review gates matter</h4>
          <p>
            A useful approval workflow shows the payload, its source context, and the intended destination before an operator makes a decision. This environment simulates that review; it does not dispatch to external systems or create a compliance record.
          </p>
        </div>
      </div>

      {/* Active Pending Approvals Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
        {filteredItems.length === 0 ? (
          <div
            className="card"
            style={{ padding: '40px', textAlign: 'center', color: 'var(--text-tertiary)' }}
          >
            <CheckCircle2 size={36} color="#059669" style={{ margin: '0 auto 12px auto' }} />
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
              All Caught Up!
            </h3>
            <p style={{ fontSize: '13px' }}>
              There are no pending actions requiring founder authorization at this moment.
            </p>
          </div>
        ) : (
          filteredItems.map(item => {
            const AgentIcon = AGENT_ICON_MAP[item.agent] || Shield;
            const SystemIcon = SYSTEM_ICON_MAP[item.targetSystemIcon] || Mail;
            const isExpanded = expandedId === item.id;

            return (
              <div
                key={item.id}
                className="card"
                style={{
                  borderColor:
                    item.riskLevel === 'High'
                      ? 'var(--rose-border)'
                      : item.riskLevel === 'Medium'
                      ? 'var(--amber-border)'
                      : 'var(--border)',
                  overflow: 'hidden'
                }}
              >
                {/* Card Summary Header */}
                <div
                  style={{
                    padding: '16px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    backgroundColor: isExpanded ? 'var(--bg-hover)' : 'var(--bg-secondary)'
                  }}
                  onClick={() => setExpandedId(isExpanded ? null : item.id)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor:
                          item.riskLevel === 'High'
                            ? 'var(--rose-bg)'
                            : item.riskLevel === 'Medium'
                            ? 'var(--amber-bg)'
                            : 'var(--emerald-bg)',
                        color:
                          item.riskLevel === 'High'
                            ? 'var(--rose-text)'
                            : item.riskLevel === 'Medium'
                            ? 'var(--amber-text)'
                            : 'var(--emerald-text)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}
                    >
                      <AgentIcon size={18} />
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                        <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
                          {item.agent}
                        </span>
                        <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>•</span>
                        <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                          Target: <strong>{item.targetSystem}</strong>
                        </span>
                        <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>•</span>
                        <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>
                          {item.requestedTime}
                        </span>
                      </div>

                      <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {item.actionTitle}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span
                      className={`risk-pill ${
                        item.riskLevel === 'High'
                          ? 'risk-high'
                          : item.riskLevel === 'Medium'
                          ? 'risk-medium'
                          : 'risk-low'
                      }`}
                    >
                      Risk: {item.riskLevel}
                    </span>

                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={e => {
                        e.stopPropagation();
                        setExpandedId(isExpanded ? null : item.id);
                      }}
                    >
                      <span>{isExpanded ? 'Hide' : 'Review'}</span>
                      {isExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                    </button>
                  </div>
                </div>

                {/* Expanded Inspection Drawer */}
                {isExpanded && (
                  <div
                    style={{
                      padding: '20px',
                      borderTop: '1px solid var(--border)',
                      backgroundColor: 'var(--bg-tertiary)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '16px'
                    }}
                  >
                    {/* Metadata Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                      <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                        <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 700 }}>
                          Target Recipient / System
                        </div>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px' }}>
                          {item.recipient}
                        </div>
                      </div>

                      <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                        <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 700 }}>
                          Risk Classification
                        </div>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px' }}>
                          {item.riskLabel} ({item.riskLevel} Risk)
                        </div>
                      </div>

                      <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                        <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 700 }}>
                          Requested At
                        </div>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px' }}>
                          {item.requestedTime} by {item.agent}
                        </div>
                      </div>
                    </div>

                    {/* Data Being Used */}
                    <div>
                      <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '6px' }}>
                        Data Sources Utilized for Decision:
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {item.dataUsed.map((dataItem, idx) => (
                          <div
                            key={idx}
                            style={{
                              fontSize: '12px',
                              color: 'var(--text-primary)',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px'
                            }}
                          >
                            <span style={{ color: 'var(--primary)' }}>•</span>
                            <span>{dataItem}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Proposed Action Payload (Code or Email or Deal) */}
                    <div>
                      <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '6px' }}>
                        Action Payload:
                      </div>
                      <div
                        style={{
                          padding: '14px',
                          borderRadius: 'var(--radius-md)',
                          backgroundColor: 'var(--bg-secondary)',
                          border: '1px solid var(--border)',
                          fontFamily: item.payload.repo ? 'var(--font-mono)' : 'inherit',
                          fontSize: '12px',
                          lineHeight: 1.6,
                          whiteSpace: 'pre-line',
                          color: 'var(--text-primary)',
                          maxHeight: '260px',
                          overflowY: 'auto'
                        }}
                      >
                        {item.payload.body || JSON.stringify(item.payload, null, 2)}
                      </div>
                    </div>

                    {/* Action Execution Footer: Approve, Reject, Modify */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingTop: '12px',
                        borderTop: '1px solid var(--border)'
                      }}
                    >
                      <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                        In this preview, approving only updates the simulated review history. No request is sent to <strong>{item.targetSystem}</strong>.
                      </span>

                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => {
                            if (item.id === 'appr-1') setActiveView('sales');
                            else showToast('Payload modification unlocked for founder edit.', 'info');
                          }}
                        >
                          <Edit3 size={13} />
                          <span>Modify Payload</span>
                        </button>

                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleReject(item.id)}
                        >
                          <XCircle size={13} />
                          <span>Mark Rejected</span>
                        </button>

                        <button
                          className="btn btn-success btn-sm"
                          onClick={() => handleApprove(item.id)}
                          style={{ padding: '6px 16px', fontWeight: 700 }}
                        >
                          <Check size={14} />
                          <span>Mark Approved</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Completed / Historical Approvals */}
      {completedApprovals.length > 0 && (
        <div className="card">
          <div className="card-header">
            <span className="card-title">Completed & Processed Today</span>
            <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>
              {completedApprovals.length} Actions Decided
            </span>
          </div>
          <div className="card-body" style={{ padding: '8px 0' }}>
            {completedApprovals.map(item => (
              <div
                key={item.id}
                style={{
                  padding: '12px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottom: '1px solid var(--border)',
                  fontSize: '13px'
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                    {item.actionTitle}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>
                    Target: {item.recipient} • System: {item.targetSystem}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span
                    className={`badge ${
                      item.status === 'approved' ? 'badge-emerald' : 'badge-rose'
                    }`}
                  >
                    {item.status === 'approved' ? '✓ Approved by Alex' : '✗ Rejected'}
                  </span>

                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => setActiveView('audit')}
                    style={{ fontSize: '11px', padding: '3px 8px' }}
                  >
                    View Audit
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import {
  TrendingUp,
  Building,
  Mail,
  CheckCircle2,
  AlertTriangle,
  Edit3,
  XCircle,
  ExternalLink,
  ShieldAlert,
  Send,
  User,
  Globe,
  Sparkles,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function SalesAgentView() {
  const {
    salesLeadData,
    approvals,
    approveAction,
    rejectAction,
    modifyAction,
    setActiveView,
    demoTourActive,
    setDemoTourStep,
    showToast
  } = useWorkspace();

  const approvalItem = approvals.find(a => a.id === 'appr-1') || {
    status: 'pending',
    payload: salesLeadData.emailDraft
  };

  const isApproved = approvalItem.status === 'approved';
  const isRejected = approvalItem.status === 'rejected';

  const [isEditing, setIsEditing] = useState(false);
  const [editedSubject, setEditedSubject] = useState(approvalItem.payload.subject);
  const [editedBody, setEditedBody] = useState(approvalItem.payload.body);

  const handleApprove = () => {
    approveAction('appr-1');
    try {
      confetti({
        particleCount: 65,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {}

    if (demoTourActive) {
      setDemoTourStep(7);
    }
  };

  const handleReject = () => {
    rejectAction('appr-1', 'Cancelled by founder before transmission');
  };

  const handleSaveEdit = () => {
    modifyAction('appr-1', {
      subject: editedSubject,
      body: editedBody
    });
    setIsEditing(false);
  };

  return (
    <div className="view-container">
      {/* Header */}
      <div className="view-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="badge badge-emerald">Sales Agent Active</span>
            <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>Grounded in Acme Tech Dossier & Sales Playbook</span>
          </div>
          <h1 className="view-title">Lead Research: {salesLeadData.company}</h1>
          <p className="view-subtitle">AI-enriched prospect profile and personalized outbound drafting.</p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setActiveView('approvals')}
          >
            <ShieldAlert size={14} color="#d97706" />
            <span>View All Approvals</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Prospect Dossier on Left, Email Draft & Action Guardrail on Right */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: '24px' }}>
        {/* Left Column: Lead Information & Research Angle */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Company Dossier Card */}
          <div className="card">
            <div className="card-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Building size={16} color="var(--primary)" />
                <span className="card-title">Company Intelligence</span>
              </div>
              <span className="badge badge-blue">Series B FinTech</span>
            </div>

            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 700 }}>
                  Company Name & Domain
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                  <strong style={{ fontSize: '15px', color: 'var(--text-primary)' }}>
                    {salesLeadData.company}
                  </strong>
                  <a
                    href={salesLeadData.website}
                    target="_blank"
                    rel="noreferrer"
                    style={{ fontSize: '12px', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '2px' }}
                  >
                    <span>{salesLeadData.website}</span>
                    <ExternalLink size={10} />
                  </a>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 700 }}>
                    Industry
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--text-primary)', marginTop: '2px' }}>
                    {salesLeadData.industry}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 700 }}>
                    Team Size
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--text-primary)', marginTop: '2px' }}>
                    {salesLeadData.employees}
                  </div>
                </div>
              </div>

              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 700 }}>
                  Primary Contact
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px' }}>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--primary)',
                      color: '#fff',
                      fontSize: '11px',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    MV
                  </div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {salesLeadData.primaryContact.name}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                      {salesLeadData.primaryContact.title} • {salesLeadData.primaryContact.email}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 700 }}>
                  Relevant Product
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-primary)', marginTop: '2px', fontWeight: 500 }}>
                  {salesLeadData.relevantProduct}
                </div>
              </div>
            </div>
          </div>

          {/* Pain Points & Angle */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">Identified Pain Points</span>
              <span className="risk-pill risk-medium">High Conversion Signal</span>
            </div>
            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {salesLeadData.painPoints.map((point, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                    <span style={{ color: '#ef4444', fontWeight: 700 }}>⚠️</span>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                      {point}
                    </p>
                  </div>
                ))}
              </div>

              <div
                style={{
                  marginTop: '6px',
                  padding: '12px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-tertiary)',
                  border: '1px solid var(--border)'
                }}
              >
                <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--primary)', marginBottom: '3px' }}>
                  SUGGESTED OUTREACH ANGLE:
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-primary)', lineHeight: 1.5 }}>
                  {salesLeadData.suggestedAngle}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Draft Follow-up & The Critical External Action Callout */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Email Draft Card */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="card-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mail size={16} color="var(--primary)" />
                <span className="card-title">Draft Follow-up Email</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {isApproved && <span className="badge badge-emerald">✓ Approved & Sent</span>}
                {isRejected && <span className="badge badge-rose">✗ Rejected</span>}
                {!isApproved && !isRejected && (
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => setIsEditing(!isEditing)}
                    style={{ fontSize: '11px', padding: '3px 8px' }}
                  >
                    <Edit3 size={12} />
                    <span>{isEditing ? 'Cancel Edit' : 'Edit Draft'}</span>
                  </button>
                )}
              </div>
            </div>

            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
                  To Recipient
                </label>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px' }}>
                  {salesLeadData.emailDraft.to}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
                  Subject Line
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    className="form-input"
                    value={editedSubject}
                    onChange={e => setEditedSubject(e.target.value)}
                    style={{ marginTop: '4px' }}
                  />
                ) : (
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px' }}>
                    {editedSubject}
                  </div>
                )}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
                  Email Body
                </label>
                {isEditing ? (
                  <textarea
                    className="form-input"
                    rows={12}
                    value={editedBody}
                    onChange={e => setEditedBody(e.target.value)}
                    style={{ marginTop: '4px', fontFamily: 'inherit', lineHeight: 1.6 }}
                  />
                ) : (
                  <div
                    style={{
                      marginTop: '6px',
                      padding: '16px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--bg-tertiary)',
                      border: '1px solid var(--border)',
                      fontSize: '13px',
                      lineHeight: 1.7,
                      color: 'var(--text-primary)',
                      whiteSpace: 'pre-line'
                    }}
                  >
                    {editedBody}
                  </div>
                )}
              </div>

              {isEditing && (
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                  <button className="btn btn-secondary btn-sm" onClick={() => setIsEditing(false)}>
                    Cancel
                  </button>
                  <button className="btn btn-primary btn-sm" onClick={handleSaveEdit}>
                    Save Changes
                  </button>
                </div>
              )}
            </div>

            {/* THE CRITICAL EXTERNAL ACTION DETECTED CALLOUT */}
            <div
              style={{
                margin: '0 20px 20px 20px',
                padding: '16px 20px',
                borderRadius: 'var(--radius-lg)',
                backgroundColor: isApproved
                  ? 'var(--emerald-bg)'
                  : isRejected
                  ? 'var(--rose-bg)'
                  : 'var(--amber-bg)',
                border: `1px solid ${
                  isApproved
                    ? 'var(--emerald-border)'
                    : isRejected
                    ? 'var(--rose-border)'
                    : 'var(--amber-border)'
                }`,
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                {isApproved ? (
                  <ShieldCheck size={24} color="#059669" style={{ flexShrink: 0 }} />
                ) : isRejected ? (
                  <XCircle size={24} color="#dc2626" style={{ flexShrink: 0 }} />
                ) : (
                  <AlertTriangle size={24} color="#d97706" style={{ flexShrink: 0 }} />
                )}

                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: '14px',
                      fontWeight: 800,
                      color: isApproved
                        ? 'var(--emerald-text)'
                        : isRejected
                        ? 'var(--rose-text)'
                        : 'var(--amber-text)'
                    }}
                  >
                    {isApproved
                      ? 'Action Approved & Dispatched'
                      : isRejected
                      ? 'Action Quarantined & Blocked'
                      : 'External action detected'}
                  </div>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px', lineHeight: 1.5 }}>
                    {isApproved
                      ? `Email successfully sent to ${salesLeadData.emailDraft.to} via Gmail integration. Cryptographic hash recorded in the Audit Log.`
                      : isRejected
                      ? 'Outbound email was aborted. Target recipient was not contacted. Recorded in Audit Log.'
                      : `Sending this email will contact an external recipient (${salesLeadData.emailDraft.to}). Because this touches external parties, Buildora requires founder authorization.`}
                  </p>
                </div>
              </div>

              {/* Action Buttons: Approve & Send, Edit, Reject */}
              {!isApproved && !isRejected && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingTop: '6px' }}>
                  <button
                    className="btn btn-success"
                    onClick={handleApprove}
                    style={{ flex: 1.5, fontWeight: 700 }}
                  >
                    <Send size={14} />
                    <span>Approve & Send</span>
                  </button>

                  <button
                    className="btn btn-secondary"
                    onClick={() => setIsEditing(true)}
                    style={{ flex: 1 }}
                  >
                    <Edit3 size={13} />
                    <span>Edit</span>
                  </button>

                  <button
                    className="btn btn-danger"
                    onClick={handleReject}
                    style={{ flex: 1 }}
                  >
                    <XCircle size={13} />
                    <span>Reject</span>
                  </button>
                </div>
              )}

              {isApproved && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '4px' }}>
                  <span style={{ fontSize: '12px', color: 'var(--emerald-text)', fontWeight: 600 }}>
                    ✓ Logged to Immutable Audit Log
                  </span>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => setActiveView('audit')}
                  >
                    <span>View in Audit Log Chain →</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

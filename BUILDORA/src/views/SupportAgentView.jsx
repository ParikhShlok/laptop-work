import React, { useState } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import { apiClient } from '../api/client';
import { CheckCircle2, Database, FileText, LifeBuoy, Mail, Shield, Upload } from 'lucide-react';

export default function SupportAgentView() {
  const { currentWorkspaceId, isLoggedIn, openLogin, showToast } = useWorkspace();
  const [sourceTitle, setSourceTitle] = useState('');
  const [sourceContent, setSourceContent] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [question, setQuestion] = useState('');
  const [draft, setDraft] = useState(null);
  const [busy, setBusy] = useState(false);

  const mustBeSignedIn = () => {
    if (isLoggedIn) return false;
    showToast('Create a pilot workspace or sign in first.', 'warning');
    openLogin();
    return true;
  };

  const addSource = async event => {
    event.preventDefault();
    if (mustBeSignedIn()) return;
    setBusy(true);
    try {
      await apiClient.addPilotKnowledge(currentWorkspaceId, { title: sourceTitle, content: sourceContent, source_type: 'support_playbook' });
      setSourceTitle('');
      setSourceContent('');
      showToast('Knowledge source saved to your pilot workspace.', 'success');
    } catch (error) { showToast(error.message || 'Could not save the source.', 'warning'); } finally { setBusy(false); }
  };

  const createDraft = async event => {
    event.preventDefault();
    if (mustBeSignedIn()) return;
    setBusy(true);
    try {
      const result = await apiClient.createSupportDraft(currentWorkspaceId, { customer_email: customerEmail, customer_question: question });
      setDraft(result);
      showToast('Reply draft staged for human review. No message was sent.', 'success');
    } catch (error) { showToast(error.message || 'Could not create a draft.', 'warning'); } finally { setBusy(false); }
  };

  const recordDecision = async decision => {
    if (!draft) return;
    setBusy(true);
    try {
      const result = await apiClient.decidePilotApproval(currentWorkspaceId, draft.approval.id, decision);
      setDraft(previous => ({ ...previous, approval: result.approval }));
      showToast(`Review marked ${decision}. External delivery remains manual.`, 'success');
    } catch (error) { showToast(error.message || 'Could not record decision.', 'warning'); } finally { setBusy(false); }
  };

  return (
    <div className="view-container">
      <div className="view-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="badge badge-blue">LIVE PILOT WORKFLOW</span>
            <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>Sources → draft → human review → manual send</span>
          </div>
          <h1 className="view-title">Support Reply Review</h1>
          <p className="view-subtitle">The first real BUILDORA workflow: it stores workspace data and never sends customer messages automatically.</p>
        </div>
      </div>

      {!isLoggedIn && <div className="security-banner banner-amber" style={{ marginBottom: '20px' }}><Shield size={20} color="#b45309" /><div><strong>Create a pilot workspace to begin.</strong><br />Only signed-in pilot accounts can save private sources or create review records.</div></div>}

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '24px' }}>
        <form className="card" onSubmit={addSource} style={{ padding: '24px' }}>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}><Database size={18} color="var(--primary)" /><h3 style={{ margin: 0 }}>1. Add approved knowledge</h3></div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>Paste a support playbook, product policy, or verified FAQ. Keep first-pilot sources non-sensitive and concise.</p>
          <label style={{ fontSize: '12px', fontWeight: 700 }}>Source title</label>
          <input required className="form-input" value={sourceTitle} onChange={event => setSourceTitle(event.target.value)} placeholder="Password reset support policy" style={{ margin: '6px 0 12px' }} />
          <label style={{ fontSize: '12px', fontWeight: 700 }}>Approved source text</label>
          <textarea required minLength={20} rows={10} className="form-input" value={sourceContent} onChange={event => setSourceContent(event.target.value)} placeholder="Write verified guidance your support team can use..." style={{ margin: '6px 0 16px', resize: 'vertical' }} />
          <button className="btn btn-secondary" disabled={busy} style={{ width: '100%' }}><Upload size={15} />Save source</button>
        </form>

        <form className="card" onSubmit={createDraft} style={{ padding: '24px' }}>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}><LifeBuoy size={18} color="#059669" /><h3 style={{ margin: 0 }}>2. Prepare a customer reply</h3></div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>A draft is created only when relevant workspace knowledge exists, then held for a human decision.</p>
          <label style={{ fontSize: '12px', fontWeight: 700 }}>Customer email</label>
          <input required type="email" className="form-input" value={customerEmail} onChange={event => setCustomerEmail(event.target.value)} placeholder="customer@company.com" style={{ margin: '6px 0 12px' }} />
          <label style={{ fontSize: '12px', fontWeight: 700 }}>Customer question</label>
          <textarea required minLength={4} rows={5} className="form-input" value={question} onChange={event => setQuestion(event.target.value)} placeholder="How can I reset my password?" style={{ margin: '6px 0 16px', resize: 'vertical' }} />
          <button className="btn btn-primary" disabled={busy} style={{ width: '100%' }}><Mail size={15} />Create reviewable draft</button>
        </form>
      </div>

      {draft && <div className="card" style={{ padding: '24px', marginTop: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}><FileText size={18} color="var(--primary)" /><h3 style={{ margin: 0 }}>3. Review staged reply</h3><span className="badge badge-amber">{draft.approval.status}</span></div>
        <textarea className="form-input" rows={8} value={draft.draft} readOnly style={{ lineHeight: 1.6, marginBottom: '16px' }} />
        <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '8px' }}>Source context used</div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>{draft.sources.map(source => <span key={source.id} className="badge badge-blue">{source.title}</span>)}</div>
        {draft.approval.status === 'pending' ? <div style={{ display: 'flex', gap: '10px' }}><button type="button" className="btn btn-primary" disabled={busy} onClick={() => recordDecision('approved')}><CheckCircle2 size={15} />Mark approved</button><button type="button" className="btn btn-secondary" disabled={busy} onClick={() => recordDecision('rejected')}>Mark rejected</button></div> : <div className="security-banner banner-blue"><Shield size={18} color="#2563eb" /><div><strong>Decision recorded.</strong> Copy the reviewed draft into your current support system to send it. BUILDORA has not contacted the customer.</div></div>}
      </div>}
    </div>
  );
}

import React from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import {
  FileText,
  X,
  Lock,
  User,
  Clock,
  ShieldCheck,
  Download,
  Share2,
  ExternalLink
} from 'lucide-react';

export default function DocumentDrawer() {
  const { previewDoc, setPreviewDoc, showToast } = useWorkspace();

  if (!previewDoc) return null;

  return (
    <div className="modal-overlay" onClick={() => setPreviewDoc(null)}>
      <div
        className="modal-content"
        onClick={e => e.stopPropagation()}
        style={{
          maxWidth: '680px',
          width: '90%',
          maxHeight: '85vh',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Drawer Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FileText size={18} color="var(--primary)" />
            <div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>
                {previewDoc.title}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>
                Grounded Workspace Document
              </div>
            </div>
          </div>

          <button
            onClick={() => setPreviewDoc(null)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Drawer Meta Header */}
        <div
          style={{
            padding: '12px 24px',
            backgroundColor: 'var(--bg-tertiary)',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '12px',
            flexWrap: 'wrap',
            gap: '10px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <User size={13} color="var(--text-tertiary)" />
            <span>Owner: <strong style={{ color: 'var(--text-primary)' }}>{previewDoc.owner}</strong></span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Clock size={13} color="var(--text-tertiary)" />
            <span>Updated: <strong style={{ color: 'var(--text-primary)' }}>{previewDoc.updated}</strong></span>
          </div>

          <span className="risk-pill risk-low">
            <Lock size={10} />
            {previewDoc.access || 'Internal Confidential'}
          </span>
        </div>

        {/* Drawer Body (Content) */}
        <div className="modal-body" style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
          <div
            style={{
              padding: '12px 16px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--blue-bg)',
              border: '1px solid var(--blue-border)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '12px',
              color: 'var(--blue-text)',
              marginBottom: '16px'
            }}
          >
            <ShieldCheck size={16} />
            <span>
              This document is indexed in your private AES-256 partition. Agents query it via vector similarity; raw contents never leave your tenant boundary.
            </span>
          </div>

          <div
            style={{
              whiteSpace: 'pre-line',
              fontSize: '13px',
              lineHeight: 1.7,
              color: 'var(--text-primary)',
              fontFamily: 'inherit'
            }}
          >
            {previewDoc.content || `### Document Overview: ${previewDoc.title}

1. Purpose and Scope
This document sets the operational standards, technical milestones, and customer commitments for Acme AI Labs. All agents (Meeting, Research, Sales, Support, Developer) reference these definitions to ensure accuracy and eliminate hallucinations.

2. Architecture & Security Requirements
- Strict human-in-the-loop validation for all outbound communications.
- Multi-factor authentication mandatory for all tenant seats.
- Role-based access control preventing unauthorized cross-department indexing.

3. Sprint 14 Execution Priorities
- SAML 2.0 / Okta SSO connector release.
- 3-step onboarding flow refinement.
- Pricing validation interviews.`}
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="modal-footer">
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => showToast('Grounded document link copied to clipboard.', 'info')}
          >
            <Share2 size={13} />
            <span>Share Link</span>
          </button>

          <button className="btn btn-primary btn-sm" onClick={() => setPreviewDoc(null)}>
            <span>Close Preview</span>
          </button>
        </div>
      </div>
    </div>
  );
}

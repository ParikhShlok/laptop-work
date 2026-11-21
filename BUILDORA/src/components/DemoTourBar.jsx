import React, { useState } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import {
  Sparkles,
  ChevronRight,
  ChevronLeft,
  X,
  CheckCircle,
  ArrowRight,
  Building,
  ShieldCheck,
  CheckCircle2,
  Calendar
} from 'lucide-react';

const ACMEFLOW_STEPS = [
  {
    step: 1,
    title: 'Demo Step 1: Ask AcmeFlow Knowledge',
    desc: 'Ask: "What are our product priorities this month?" Buildora answers with citations using AcmeFlow knowledge.',
    view: 'chat',
    actionText: 'Open Meeting Agent (Step 2)'
  },
  {
    step: 2,
    title: 'Demo Step 2: Meeting Agent Workflow',
    desc: 'Product Strategy Meeting — Oct 5: Meeting audio transcript → Executive Summary → Action items & tasks.',
    view: 'meetings',
    actionText: 'Open Sales Agent (Step 3)'
  },
  {
    step: 3,
    title: 'Demo Step 3: Sales Agent Lead Research',
    desc: 'Sales Agent researches Marcus Vance (Acme Tech) and drafts personalized outbound email.',
    view: 'sales',
    actionText: 'Trigger Approval Gate (Step 4)'
  },
  {
    step: 4,
    title: 'Demo Step 4: Approval Required Gate',
    desc: 'External dispatch paused! System detects high-risk email to external domain. Founder review mandatory.',
    view: 'approvals',
    actionText: 'Click Approve & Send (Step 5)'
  },
  {
    step: 5,
    title: 'Demo Step 5: Founder Approves Action',
    desc: 'Founder Alex Rivera clicks "Approve & Send". Action executes cleanly.',
    view: 'approvals',
    actionText: 'View Audit Log Chain (Step 6)'
  },
  {
    step: 6,
    title: 'Demo Step 6: Immutable Audit Trail',
    desc: 'Full compliance chain: Agent → Lead Research → Email Draft → Founder Approval → Execution!',
    view: 'audit',
    actionText: 'Finish Demo & Get Started'
  }
];

export default function DemoTourBar({ onBookDemo }) {
  const {
    demoTourActive,
    setDemoTourActive,
    demoTourStep,
    setDemoTourStep,
    setActiveView,
    openSignup
  } = useWorkspace();

  const [finishedModal, setFinishedModal] = useState(false);

  if (!demoTourActive) return null;

  const current = ACMEFLOW_STEPS[demoTourStep - 1] || ACMEFLOW_STEPS[0];

  const goToStep = (stepNumber) => {
    if (stepNumber < 1 || stepNumber > ACMEFLOW_STEPS.length) return;
    setDemoTourStep(stepNumber);
    const target = ACMEFLOW_STEPS[stepNumber - 1];
    setActiveView(target.view);
  };

  const handleNext = () => {
    if (demoTourStep < ACMEFLOW_STEPS.length) {
      goToStep(demoTourStep + 1);
    } else {
      setFinishedModal(true);
    }
  };

  const handlePrev = () => {
    if (demoTourStep > 1) {
      goToStep(demoTourStep - 1);
    }
  };

  return (
    <>
      <div className="pitch-tour-bar" style={{ backgroundColor: '#1e1b4b', borderBottom: '1px solid #4338ca' }}>
        <div className="pitch-tour-left">
          <span className="pitch-step-pill" style={{ backgroundColor: '#4338ca', color: '#ffffff' }}>
            AcmeFlow Demo {current.step} / 6
          </span>
          <span className="pitch-step-title" style={{ color: '#ffffff', fontWeight: 700 }}>
            {current.title}
          </span>
          <span style={{ color: '#a5b4fc' }}>•</span>
          <span className="pitch-step-desc" style={{ color: '#c7d2fe' }}>
            {current.desc}
          </span>
        </div>

        <div className="pitch-tour-right">
          <button
            className="btn btn-secondary btn-sm"
            onClick={handlePrev}
            disabled={demoTourStep === 1}
            style={{ padding: '4px 8px', fontSize: '11px', backgroundColor: 'rgba(255,255,255,0.1)', color: '#fff', borderColor: 'rgba(255,255,255,0.2)' }}
          >
            <ChevronLeft size={13} />
            <span>Prev</span>
          </button>

          <button
            className="btn btn-primary btn-sm"
            onClick={handleNext}
            style={{ padding: '4px 12px', fontSize: '11px', fontWeight: 700, backgroundColor: '#6366f1', borderColor: '#4f46e5' }}
          >
            <span>{current.actionText}</span>
            <ChevronRight size={13} />
          </button>

          <button
            className="pitch-close-btn"
            onClick={() => setDemoTourActive(false)}
            title="Exit Demo Mode"
            style={{ color: '#a5b4fc' }}
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Demo Completed Modal (Section 26 & 53) */}
      {finishedModal && (
        <div className="modal-backdrop" onClick={() => setFinishedModal(false)}>
          <div
            className="modal-content"
            style={{ maxWidth: '520px', padding: '36px', textAlign: 'center' }}
            onClick={e => e.stopPropagation()}
          >
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '16px',
                backgroundColor: 'var(--primary-light)',
                color: 'var(--primary)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px'
              }}
            >
              <Sparkles size={28} />
            </div>

            <h3 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 10px 0' }}>
              This is BUILDORA.
            </h3>
            <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.6, margin: '0 0 24px 0' }}>
              <strong>AI that works with your startup — while you stay in control.</strong>
              <br />
              AI assists &rarr; AI prepares &rarr; Human approves &rarr; AI acts &rarr; Everything is logged.
            </p>

            <div style={{ backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', padding: '16px', marginBottom: '24px', textAlign: 'left', fontSize: '13px' }}>
              <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
                Want to try this with your own company data?
              </div>
              <ul style={{ margin: 0, paddingLeft: '18px', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <li>14-day free trial (no credit card required)</li>
                <li>Connect Google Drive, Notion, Slack, & Gmail in 2 minutes</li>
                <li>Zero Data Retention air-gapped security SLA</li>
              </ul>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                className="btn btn-primary"
                onClick={() => {
                  setFinishedModal(false);
                  setDemoTourActive(false);
                  openSignup();
                }}
                style={{ padding: '12px 24px', fontWeight: 700, gap: '6px' }}
              >
                <span>Start Free Workspace</span>
                <ArrowRight size={15} />
              </button>

              <button
                className="btn btn-secondary"
                onClick={() => {
                  setFinishedModal(false);
                  setDemoTourActive(false);
                  if (onBookDemo) onBookDemo();
                }}
                style={{ padding: '12px 20px', fontWeight: 600, gap: '6px' }}
              >
                <Calendar size={15} />
                <span>Book a Demo</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

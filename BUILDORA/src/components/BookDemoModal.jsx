import React, { useState } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import { apiClient } from '../api/client';
import {
  X,
  Calendar,
  Building,
  Mail,
  User,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  MessageSquare
} from 'lucide-react';

export default function BookDemoModal({ isOpen, onClose }) {
  const { showToast } = useWorkspace();
  const bookingUrl = import.meta.env.VITE_BOOKING_URL;

  const [name, setName] = useState('');
  const [workEmail, setWorkEmail] = useState('');
  const [company, setCompany] = useState('');
  const [companySize, setCompanySize] = useState('5–15 employees');
  const [role, setRole] = useState('Founder / CEO');
  const [currentAiTools, setCurrentAiTools] = useState('ChatGPT, Notion AI');
  const [workflowProblem, setWorkflowProblem] = useState('Too many fragmented tools and uncontrolled AI usage');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const demoPayload = {
      name,
      work_email: workEmail,
      company,
      company_size: companySize,
      role,
      current_ai_tools: currentAiTools,
      workflow_problem: workflowProblem,
      message
    };

    // Store in backend and local storage
    await apiClient.submitDemoRequest(demoPayload);

    // Save in local storage for Admin Panel view
    try {
      const existing = JSON.parse(localStorage.getItem('buildora_demo_requests') || '[]');
      existing.unshift({
        ...demoPayload,
        id: `dreq-${Date.now()}`,
        created_at: new Date().toISOString()
      });
      localStorage.setItem('buildora_demo_requests', JSON.stringify(existing));
    } catch (err) {
      console.error(err);
    }

    setSubmitting(false);
    setSubmitted(true);
    showToast('Demo request received! Our team will reach out within 2 hours.', 'success');
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content"
        style={{ maxWidth: '540px', padding: '32px' }}
        onClick={e => e.stopPropagation()}
      >
        <button
          className="modal-close-btn"
          onClick={onClose}
          style={{ position: 'absolute', top: '18px', right: '18px' }}
        >
          <X size={18} />
        </button>

        {!bookingUrl ? (
          <div style={{ textAlign: 'center', padding: '28px 8px' }}>
            <div
              style={{
                width: '54px',
                height: '54px',
                borderRadius: '50%',
                backgroundColor: 'var(--primary-light)',
                color: 'var(--primary)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px'
              }}
            >
              <Calendar size={28} />
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 8px 0' }}>
              Booking link needs setup
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: '400px', margin: '0 auto 24px auto' }}>
              This preview does not collect contact details. Add a Calendly, Cal.com, or TidyCal URL as <code>VITE_BOOKING_URL</code> before publishing.
            </p>
            <button className="btn btn-secondary" onClick={onClose} style={{ fontWeight: 600 }}>
              Close
            </button>
          </div>
        ) : !submitted ? (
          <>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--primary-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--primary)'
                }}
              >
                <Calendar size={22} />
              </div>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                  Book a Personalized Demo
                </h2>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '2px 0 0 0' }}>
                  See how Buildora unifies AI workflows for your 5–15 person startup.
                </p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Alex Rivera"
                    className="form-input"
                    value={name}
                    onChange={e => setName(e.target.value)}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>
                    Work Email *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="alex@startup.io"
                    className="form-input"
                    value={workEmail}
                    onChange={e => setWorkEmail(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>
                    Company Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="AcmeFlow Inc"
                    className="form-input"
                    value={company}
                    onChange={e => setCompany(e.target.value)}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>
                    Team Size
                  </label>
                  <select
                    className="form-input"
                    value={companySize}
                    onChange={e => setCompanySize(e.target.value)}
                  >
                    <option value="1–5 employees">1–5 employees</option>
                    <option value="5–15 employees">5–15 employees (Target)</option>
                    <option value="15–50 employees">15–50 employees</option>
                    <option value="50+ employees">50+ employees</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>
                    Your Role
                  </label>
                  <input
                    type="text"
                    placeholder="Founder / CEO"
                    className="form-input"
                    value={role}
                    onChange={e => setRole(e.target.value)}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>
                    Current AI Tools
                  </label>
                  <input
                    type="text"
                    placeholder="ChatGPT, Claude, Notion AI"
                    className="form-input"
                    value={currentAiTools}
                    onChange={e => setCurrentAiTools(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>
                  Biggest Workflow Problem to Solve
                </label>
                <input
                  type="text"
                  placeholder="Scattered knowledge & uncontrolled agent outputs"
                  className="form-input"
                  value={workflowProblem}
                  onChange={e => setWorkflowProblem(e.target.value)}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>
                  Optional Note / Questions
                </label>
                <textarea
                  rows={2}
                  placeholder="Tell us about your team's specific requirements or questions..."
                  className="form-input"
                  style={{ resize: 'none' }}
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', padding: '12px', fontSize: '14px', fontWeight: 700, marginTop: '8px' }}
                disabled={submitting}
              >
                {submitting ? 'Submitting Request...' : 'Request 20-Min Guided Demo'}
                {!submitting && <ArrowRight size={15} style={{ marginLeft: '6px' }} />}
              </button>
            </form>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '24px 8px' }}>
            <div
              style={{
                width: '54px',
                height: '54px',
                borderRadius: '50%',
                backgroundColor: '#ecfdf5',
                color: '#059669',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px'
              }}
            >
              <CheckCircle2 size={32} />
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 8px 0' }}>
              Demo Request Confirmed!
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: '400px', margin: '0 auto 24px auto' }}>
              Thank you, <strong>{name}</strong>. We've routed your request to our founder team. We'll send a calendar invite to <strong>{workEmail}</strong> shortly.
            </p>
            <button className="btn btn-secondary" onClick={onClose} style={{ fontWeight: 600 }}>
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

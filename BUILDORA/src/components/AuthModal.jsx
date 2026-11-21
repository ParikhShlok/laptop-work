import React, { useState } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import { apiClient } from '../api/client';
import {
  X,
  Shield,
  Lock,
  Mail,
  Building,
  User,
  ArrowRight,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

export default function AuthModal() {
  const {
    authModalOpen,
    setAuthModalOpen,
    authModalMode,
    setAuthModalMode,
    loginUser,
    signupUser,
    selectedPlan
  } = useWorkspace();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);

  if (!authModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (authModalMode === 'login') {
        const session = await apiClient.loginPilot({ email, password });
        loginUser(session.user);
      } else {
        const session = await apiClient.registerPilot({ name: fullName, email, password, workspace_name: companyName });
        signupUser(session.user);
      }
    } catch (error) {
      window.alert(error.message || 'We could not complete that request.');
    } finally {
      setLoading(false);
    }
  };

  const handle1ClickDemoLogin = () => {
    setAuthModalOpen(false);
    window.location.assign(`${window.location.pathname}?mode=demo`);
  };

  return (
    <div className="modal-backdrop" onClick={() => setAuthModalOpen(false)}>
      <div
        className="modal-content auth-modal-box"
        style={{ maxWidth: '440px', padding: '32px' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          className="modal-close-btn"
          onClick={() => setAuthModalOpen(false)}
          style={{ position: 'absolute', top: '18px', right: '18px' }}
        >
          <X size={18} />
        </button>

        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              marginBottom: '12px',
              boxShadow: '0 8px 16px -4px rgba(37, 99, 235, 0.4)'
            }}
          >
            <Shield size={24} />
          </div>
          <h2 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
            {authModalMode === 'login' ? 'Sign in to BUILDORA' : 'Create Your Pilot Workspace'}
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '6px' }}>
            {authModalMode === 'login'
              ? 'Sign in to your pilot workspace'
              : `Create a ${selectedPlan ? selectedPlan.name : 'pilot'} workspace with a real, private account`}
          </p>
        </div>

        {/* Tab Switcher */}
        <div
          style={{
            display: 'flex',
            backgroundColor: 'var(--bg-tertiary)',
            padding: '4px',
            borderRadius: 'var(--radius-md)',
            marginBottom: '20px'
          }}
        >
          <button
            type="button"
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              backgroundColor: authModalMode === 'login' ? 'var(--bg-secondary)' : 'transparent',
              color: authModalMode === 'login' ? 'var(--text-primary)' : 'var(--text-secondary)',
              boxShadow: authModalMode === 'login' ? 'var(--shadow-sm)' : 'none',
              transition: 'all 0.15s ease'
            }}
            onClick={() => setAuthModalMode('login')}
          >
            Sign In
          </button>
          <button
            type="button"
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              backgroundColor: authModalMode === 'signup' ? 'var(--bg-secondary)' : 'transparent',
              color: authModalMode === 'signup' ? 'var(--text-primary)' : 'var(--text-secondary)',
              boxShadow: authModalMode === 'signup' ? 'var(--shadow-sm)' : 'none',
              transition: 'all 0.15s ease'
            }}
            onClick={() => setAuthModalMode('signup')}
          >
            Create Account
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {authModalMode === 'signup' && (
            <>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>
                  Company / Organization Name
                </label>
                <div style={{ position: 'relative' }}>
                  <Building size={16} style={{ position: 'absolute', left: '12px', top: '11px', color: 'var(--text-tertiary)' }} />
                  <input
                    type="text"
                    required
                    placeholder="Acme AI Labs"
                    className="form-input"
                    style={{ paddingLeft: '36px' }}
                    value={companyName}
                    onChange={e => setCompanyName(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>
                  Founder / Admin Full Name
                </label>
                <div style={{ position: 'relative' }}>
                  <User size={16} style={{ position: 'absolute', left: '12px', top: '11px', color: 'var(--text-tertiary)' }} />
                  <input
                    type="text"
                    required
                    placeholder="Alex Rivera"
                    className="form-input"
                    style={{ paddingLeft: '36px' }}
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>
              Work Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: '12px', top: '11px', color: 'var(--text-tertiary)' }} />
              <input
                type="email"
                required
                placeholder="alex@acmeai.io"
                className="form-input"
                style={{ paddingLeft: '36px' }}
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: '12px', top: '11px', color: 'var(--text-tertiary)' }} />
              <input
                type="password"
                required
                placeholder="••••••••••••"
                className="form-input"
                style={{ paddingLeft: '36px' }}
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
          </div>

          {authModalMode === 'signup' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: 'var(--text-tertiary)' }}>
              <CheckCircle2 size={13} color="#10b981" />
              <span>Includes zero-data-retention and strict human-in-the-loop SLA</span>
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '11px', marginTop: '6px', fontSize: '14px', fontWeight: 700 }}
            disabled={loading}
          >
            {loading ? 'Please wait...' : authModalMode === 'login' ? 'Sign In to Workspace' : 'Create Pilot Workspace'}
            {!loading && <ArrowRight size={15} style={{ marginLeft: '6px' }} />}
          </button>
        </form>

        {/* Quick Demo Pre-fill for reviewers/buyers */}
        <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={handle1ClickDemoLogin}
            style={{
              width: '100%',
              backgroundColor: 'var(--bg-tertiary)',
              border: '1px dashed var(--border-strong)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              fontSize: '12px'
            }}
          >
            <Sparkles size={13} color="#2563eb" />
            <span>Open Interactive Demo Instead</span>
          </button>
        </div>
      </div>
    </div>
  );
}

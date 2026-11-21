import React, { useState } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import { queryAi } from '../services/aiService';
import BookDemoModal from '../components/BookDemoModal';
import {
  Shield,
  Bot,
  Database,
  CheckCircle2,
  Lock,
  ArrowRight,
  Sparkles,
  Zap,
  Cpu,
  FileText,
  Search,
  Users,
  HardDrive,
  Mail,
  Video,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  CreditCard,
  Sun,
  Moon,
  Send,
  HelpCircle,
  Building,
  Key,
  Calendar,
  LifeBuoy
} from 'lucide-react';

export default function LandingPageView() {
  const {
    setAiKeyModalOpen,
    theme,
    toggleTheme,
    showToast
  } = useWorkspace();

  const [currency, setCurrency] = useState('INR'); // 'INR' or 'USD'
  const [bookDemoOpen, setBookDemoOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const bookingUrl = import.meta.env.VITE_BOOKING_URL;

  const openPilotBooking = () => {
    if (bookingUrl) {
      window.open(bookingUrl, '_blank', 'noopener,noreferrer');
      return;
    }
    setBookDemoOpen(true);
  };

  const goToWorkspace = (auth) => {
    window.location.assign(`${window.location.pathname}?mode=app&auth=${auth}`);
  };

  // Real-time AI Mini-Playground State
  const [demoPrompt, setDemoPrompt] = useState("What are our top product priorities this month?");
  const [demoAiLoading, setDemoAiLoading] = useState(false);
  const [demoAiResponse, setDemoAiResponse] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleLaunchDemoTour = () => {
    window.location.assign(`${window.location.pathname}?mode=demo`);
  };

  const handleTestRealtimeAi = async (promptText) => {
    const text = promptText || demoPrompt;
    if (!text.trim()) return;

    setDemoAiLoading(true);
    setDemoAiResponse(null);

    try {
      const res = await queryAi({
        messages: [{ sender: 'user', text }],
        contextDocs: [
          { name: 'Product Roadmap & Sprint 14 Priorities', excerpt: 'Decided to move SAML SSO to Sprint 14 and simplify onboarding into 3 steps.' },
          { name: 'Customer Interview Synthesis', excerpt: '15 founders confirmed they require approval controls before autonomous agent dispatch.' }
        ]
      });
      setDemoAiResponse(res);
    } catch (err) {
      showToast(err.message || 'AI request failed', 'warning');
    } finally {
      setDemoAiLoading(false);
    }
  };

  const PRICING_PLANS = [
    {
      id: 'starter',
      name: 'Starter',
      price: currency === 'INR' ? '₹2,499' : '$29',
      subtitle: 'For founders validating one reviewed AI workflow.',
      popular: false,
      features: [
        'Knowledge Q&A workspace',
        'Sales and support draft review',
        'Demo activity history',
        'Guided setup call',
        'Early-access product updates'
      ]
    },
    {
      id: 'team',
      name: 'Team',
      price: currency === 'INR' ? '₹6,999' : '$79',
      subtitle: 'For teams piloting reviewed customer communication.',
      popular: true,
      badge: 'RECOMMENDED',
      features: [
        'Sales and support draft workflows',
        'Human review queue',
        'Pilot workspace and onboarding',
        'Workflow feedback sessions',
        'Usage-based pilot limits',
        'Activity history for the pilot'
      ]
    },
    {
      id: 'business',
      name: 'Business',
      price: currency === 'INR' ? '₹14,999' : '$179',
      subtitle: 'For teams that need a tailored pilot and support.',
      popular: false,
      features: [
        'Custom pilot scope',
        'Dedicated implementation support',
        'Integration discovery',
        'Security review roadmap',
        'Priority support',
        'Commercial terms on request'
      ]
    }
  ];

  return (
    <div className="landing-page-root" style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
      {/* 1. Global Navigation Bar */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          backdropFilter: 'blur(12px)',
          backgroundColor: theme === 'dark' ? 'rgba(9, 13, 22, 0.85)' : 'rgba(255, 255, 255, 0.85)',
          borderBottom: '1px solid var(--border)',
          padding: '0 24px'
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            height: '68px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          {/* Brand */}
          <div
            style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                boxShadow: '0 4px 10px rgba(37, 99, 235, 0.3)'
              }}
            >
              <Shield size={18} strokeWidth={2.5} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '18px', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
                BUILDORA
              </span>
              <span className="badge badge-emerald" style={{ fontSize: '10px', padding: '2px 6px' }}>
                EARLY ACCESS
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '22px' }} className="landing-nav-links">
            <a href="#features" style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', textDecoration: 'none' }}>
              Features
            </a>
            <a href="#realtime-ai" style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', textDecoration: 'none' }}>
              Real-Time AI
            </a>
            <a href="#pricing" style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', textDecoration: 'none' }}>
              Pricing
            </a>
            <button
              onClick={handleLaunchDemoTour}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '13px',
                fontWeight: 700,
                color: 'var(--primary)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <Sparkles size={14} />
              <span>See How It Works</span>
            </button>
          </nav>

          {/* Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* AI Keys Config Trigger */}
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setAiKeyModalOpen(true)}
              title="Configure OpenAI, Claude, Gemini or Python API keys"
              style={{ gap: '6px' }}
            >
              <Key size={13} color="var(--primary)" />
              <span style={{ fontSize: '12px' }}>AI Keys</span>
            </button>

            {/* Theme Toggle */}
            <button
              className="theme-toggle-btn"
              onClick={toggleTheme}
              style={{ width: '32px', height: '32px' }}
              title={`Toggle ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
            >
              {theme === 'light' ? <Moon size={14} /> : <Sun size={14} />}
            </button>

            {/* Book Demo Button */}
            <button
              className="btn btn-secondary btn-sm"
              onClick={openPilotBooking}
              style={{ fontWeight: 600, gap: '4px' }}
            >
              <Calendar size={13} />
              <span>Book a Demo</span>
            </button>

            {/* Sign In */}
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => goToWorkspace('login')}
              style={{ fontWeight: 600 }}
            >
              Sign In
            </button>

            {/* Primary CTA */}
            <button
              className="btn btn-primary btn-sm"
              onClick={() => goToWorkspace('signup')}
              style={{ fontWeight: 700, gap: '4px' }}
            >
              <span>Start a Pilot</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </header>

      {/* 2. Hero Section (Section 49) */}
      <section style={{ padding: '72px 24px 50px 24px', textAlign: 'center', position: 'relative' }}>
        <div style={{ maxWidth: '940px', margin: '0 auto' }}>
          {/* Tagline Pill */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--primary-light)',
              border: '1px solid var(--primary-border)',
              color: 'var(--primary)',
              fontSize: '12px',
              fontWeight: 700,
              marginBottom: '22px'
            }}
          >
            <Sparkles size={14} />
            <span>AI assists &bull; AI prepares &bull; You approve &bull; AI acts &bull; Everything is logged</span>
          </div>

          {/* Section 49 Hero Title */}
          <h1
            style={{
              fontSize: '50px',
              fontWeight: 800,
              lineHeight: 1.15,
              letterSpacing: '-0.03em',
              color: 'var(--text-primary)',
              marginBottom: '20px'
            }}
          >
            Your startup's AI team,{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              with a human in the loop.
            </span>
          </h1>

          {/* Section 49 Subheading */}
          <p
            style={{
              fontSize: '18px',
              lineHeight: 1.6,
              color: 'var(--text-secondary)',
              maxWidth: '720px',
              margin: '0 auto 36px auto'
            }}
          >
            Buildora helps small SaaS teams prepare sales and support replies from company context, then puts a person in control before anything customer-facing goes out.
          </p>

          {/* CTAs (Section 49 & 50) */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px', flexWrap: 'wrap', marginBottom: '40px' }}>
            <button
              className="btn btn-primary"
              onClick={() => goToWorkspace('signup')}
              style={{ padding: '14px 28px', fontSize: '15px', fontWeight: 700, gap: '8px', boxShadow: 'var(--shadow-md)' }}
            >
              <span>Start Your Pilot</span>
              <ArrowRight size={16} />
            </button>

            <button
              className="btn btn-secondary"
              onClick={handleLaunchDemoTour}
              style={{
                padding: '14px 24px',
                fontSize: '15px',
                fontWeight: 700,
                borderColor: 'var(--primary-border)',
                backgroundColor: 'var(--primary-light)',
                color: 'var(--primary)',
                gap: '8px'
              }}
            >
              <Sparkles size={16} />
              <span>See How Buildora Works →</span>
            </button>

            <button
              className="btn btn-secondary"
              onClick={openPilotBooking}
              style={{ padding: '14px 20px', fontSize: '15px', fontWeight: 600, gap: '6px' }}
            >
              <Calendar size={15} />
              <span>Book a Demo</span>
            </button>
          </div>

          {/* Trust Guarantees */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '24px', flexWrap: 'wrap', fontSize: '12px', color: 'var(--text-tertiary)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={15} color="#10b981" />
              <span>Built for 5–15 person SaaS startups</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={15} color="#10b981" />
              <span>No credit card required</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={15} color="#10b981" />
              <span>Review-first workflow design</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={15} color="#10b981" />
              <span>Demo workspace available instantly</span>
            </div>
          </div>
        </div>

        {/* Hero Dashboard Preview (AcmeFlow) */}
        <div style={{ maxWidth: '1060px', margin: '48px auto 0 auto' }}>
          <div
            style={{
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--border-strong)',
              backgroundColor: 'var(--bg-secondary)',
              boxShadow: 'var(--shadow-modal)',
              overflow: 'hidden',
              textAlign: 'left'
            }}
          >
            {/* Top Bar */}
            <div
              style={{
                padding: '12px 18px',
                backgroundColor: 'var(--bg-tertiary)',
                borderBottom: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '11px', height: '11px', borderRadius: '50%', backgroundColor: '#ef4444' }} />
                <span style={{ width: '11px', height: '11px', borderRadius: '50%', backgroundColor: '#f59e0b' }} />
                <span style={{ width: '11px', height: '11px', borderRadius: '50%', backgroundColor: '#10b981' }} />
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-tertiary)', marginLeft: '8px' }}>
                  buildora.ai/workspace/acmeflow-prod
                </span>
              </div>
              <button
                className="btn btn-primary btn-sm"
                onClick={handleLaunchDemoTour}
                style={{ fontSize: '11px', padding: '4px 10px' }}
              >
                <span>Launch Interactive 6-Step Demo &rarr;</span>
              </button>
            </div>

            {/* Dashboard Content */}
            <div style={{ padding: '24px', display: 'grid', gridTemplateColumns: '260px 1fr', gap: '20px' }}>
              <div style={{ borderRight: '1px solid var(--border)', paddingRight: '16px' }}>
                <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '12px' }}>
                  ⚡ AcmeFlow Workspace
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px' }}>
                  <div style={{ padding: '6px 10px', borderRadius: '6px', backgroundColor: 'var(--bg-hover)', color: 'var(--text-primary)', fontWeight: 600 }}>
                    Overview
                  </div>
                  <div style={{ padding: '6px 10px', color: 'var(--text-secondary)' }}>Knowledge Q&A</div>
                  <div style={{ padding: '6px 10px', color: 'var(--text-secondary)' }}>Demo Sources (247)</div>
                  <div style={{ padding: '6px 10px', color: 'var(--text-secondary)', display: 'flex', justifyContent: 'space-between' }}>
                    <span>Approvals</span>
                    <span className="badge badge-amber" style={{ fontSize: '10px' }}>4 Pending</span>
                  </div>
                  <div style={{ padding: '6px 10px', color: 'var(--text-secondary)' }}>Activity History</div>
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                      Approval Required: Outbound Sales Pitch to Marcus Vance
                    </h3>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '2px 0 0 0' }}>
                      Sales Agent researched lead at Acme Technologies and staged email. External dispatch paused.
                    </p>
                  </div>
                  <span className="badge badge-amber">Awaiting Founder Approval</span>
                </div>

                <div style={{ padding: '14px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '8px', border: '1px solid var(--border)', marginBottom: '16px' }}>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontStyle: 'italic', marginBottom: '10px' }}>
                    "Hi Marcus, noticed Acme Technologies is evaluating AI operating workspaces. Buildora includes SAML SSO for Sprint 14..."
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={handleLaunchDemoTour}
                      style={{ fontSize: '11px' }}
                    >
                      <CheckCircle2 size={13} />
                      <span>Review in AcmeFlow Demo</span>
                    </button>
                    <span style={{ fontSize: '11px', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center' }}>
                      Example workflow — no live email is sent from this demo
                    </span>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                  <div style={{ padding: '10px', borderRadius: '8px', backgroundColor: 'var(--bg-tertiary)' }}>
                    <div style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>AI Tasks Completed</div>
                    <div style={{ fontSize: '18px', fontWeight: 800 }}>128</div>
                  </div>
                  <div style={{ padding: '10px', borderRadius: '8px', backgroundColor: 'var(--bg-tertiary)' }}>
                    <div style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>Hours Saved</div>
                    <div style={{ fontSize: '18px', fontWeight: 800 }}>34.5h</div>
                  </div>
                  <div style={{ padding: '10px', borderRadius: '8px', backgroundColor: 'var(--bg-tertiary)' }}>
                    <div style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>Pending Approvals</div>
                    <div style={{ fontSize: '18px', fontWeight: 800, color: '#d97706' }}>4</div>
                  </div>
                  <div style={{ padding: '10px', borderRadius: '8px', backgroundColor: 'var(--bg-tertiary)' }}>
                    <div style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>Knowledge Sources</div>
                    <div style={{ fontSize: '18px', fontWeight: 800, color: '#2563eb' }}>247</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Section: "AI that knows your company" (Section 49) */}
      <section id="features" style={{ padding: '72px 24px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span className="badge badge-blue" style={{ marginBottom: '8px' }}>COMPANY KNOWLEDGE</span>
          <h2 style={{ fontSize: '34px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
            AI answers with visible source context.
          </h2>
          <p style={{ fontSize: '15px', color: 'var(--text-secondary)', marginTop: '8px', maxWidth: '640px', margin: '8px auto 0 auto' }}>
            Start with selected company material and see the source snippets behind a draft. Live integrations are introduced only when they are connected and tested for your pilot.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          <div className="card" style={{ padding: '24px' }}>
            <Database size={22} color="var(--primary)" style={{ marginBottom: '12px' }} />
            <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 8px 0' }}>Grounded Retrieval</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Buildora is designed to surface source context alongside a draft so reviewers can judge whether it is safe and useful before acting on it.
            </p>
          </div>

          <div className="card" style={{ padding: '24px' }}>
            <Lock size={22} color="#059669" style={{ marginBottom: '12px' }} />
            <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 8px 0' }}>Pilot Workspace Boundaries</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Pilot workspaces keep each team's review flow and source set separate. Production-grade tenant controls are launch work, not a claim we make before delivery.
            </p>
          </div>

          <div className="card" style={{ padding: '24px' }}>
            <FileText size={22} color="#7c3aed" style={{ marginBottom: '12px' }} />
            <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 8px 0' }}>Automatic Source Citations</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Every insight shows the exact document title, source integration (Notion, Drive, Meet), and snippet excerpt for effortless verification.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Section: "AI that can actually do work" (Section 49) */}
      <section style={{ padding: '72px 24px', backgroundColor: 'var(--bg-secondary)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <span className="badge badge-emerald" style={{ marginBottom: '8px' }}>AUTONOMOUS AGENTS</span>
            <h2 style={{ fontSize: '34px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
            Start with work that creates external risk.
            </h2>
            <p style={{ fontSize: '15px', color: 'var(--text-secondary)', marginTop: '8px', maxWidth: '640px', margin: '8px auto 0 auto' }}>
              The early-access product focuses on preparing customer-facing drafts, showing their source context, and routing them to a reviewer.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
            <div className="card" style={{ padding: '24px' }}>
              <Video size={20} color="#dc2626" style={{ marginBottom: '12px' }} />
              <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 6px 0' }}>Meeting Agent</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                A demo workflow for turning a transcript into decisions and proposed follow-ups. Live meeting ingestion is roadmap work.
              </p>
            </div>

            <div className="card" style={{ padding: '24px' }}>
              <Search size={20} color="#2563eb" style={{ marginBottom: '12px' }} />
              <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 6px 0' }}>Research Agent</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                A demo workflow for structuring research. Do not treat demo research as verified external market intelligence.
              </p>
            </div>

            <div className="card" style={{ padding: '24px' }}>
              <Mail size={20} color="#7c3aed" style={{ marginBottom: '12px' }} />
              <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 6px 0' }}>Sales Agent</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Prepares personalized outreach drafts using source context supplied to the workspace, then routes them to a human reviewer.
              </p>
            </div>

            <div className="card" style={{ padding: '24px' }}>
              <LifeBuoy size={20} color="#059669" style={{ marginBottom: '12px' }} />
              <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 6px 0' }}>Support Agent</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Prepares support-reply drafts for a human to verify and send through the team's existing support process.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Section: "You stay in control" (Section 49) */}
      <section style={{ padding: '72px 24px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span className="badge badge-amber" style={{ marginBottom: '8px' }}>FOUNDER OVERSIGHT</span>
          <h2 style={{ fontSize: '34px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
            You stay in control.
          </h2>
          <p style={{ fontSize: '15px', color: 'var(--text-secondary)', marginTop: '8px', maxWidth: '640px', margin: '8px auto 0 auto' }}>
            Core philosophy: AI assists &rarr; AI prepares &rarr; Human approves &rarr; AI acts &rarr; Everything is logged.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <div className="card" style={{ padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <Shield size={22} color="#d97706" />
              <h3 style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>Human-in-the-Loop Approvals</h3>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '14px' }}>
              Buildora's product direction is review before external action: the operator sees a proposed payload, its source context, and its intended destination before choosing what to do next.
            </p>
            <div style={{ padding: '10px 14px', borderRadius: '8px', backgroundColor: '#fffbeb', border: '1px solid #fde68a', fontSize: '12px', color: '#b45309' }}>
              ⚠️ The current demo does not connect to or send through live customer systems.
            </div>
          </div>

          <div className="card" style={{ padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <FileText size={22} color="#059669" />
              <h3 style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>Clear review history</h3>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '14px' }}>
              The pilot gives teams a readable history of proposed actions and review decisions. Durable, tamper-evident audit infrastructure is a production launch requirement—not a demo claim.
            </p>
            <div style={{ padding: '10px 14px', borderRadius: '8px', backgroundColor: '#ecfdf5', border: '1px solid #a7f3d0', fontSize: '12px', color: '#047857' }}>
              ✓ Every demo action clearly shows whether it is simulated or connected.
            </div>
          </div>
        </div>
      </section>

      {/* 6. Pricing Section (Section 27 & 49) */}
      <section id="pricing" style={{ padding: '72px 24px', backgroundColor: 'var(--bg-secondary)', borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <span className="badge badge-emerald" style={{ marginBottom: '8px' }}>BUILT FOR 5–15 PERSON SAAS TEAMS</span>
            <h2 style={{ fontSize: '34px', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 8px 0' }}>
              Simple, Transparent Pricing
            </h2>
            <p style={{ fontSize: '15px', color: 'var(--text-secondary)' }}>
              These are pilot starting points, not self-serve checkout prices. We confirm scope, data access, and success criteria before payment.
            </p>

            {/* Currency toggle */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginTop: '16px', padding: '4px', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-full)' }}>
              <button
                type="button"
                onClick={() => setCurrency('INR')}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  border: 'none',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  backgroundColor: currency === 'INR' ? 'var(--bg-secondary)' : 'transparent',
                  color: currency === 'INR' ? 'var(--text-primary)' : 'var(--text-secondary)',
                  boxShadow: currency === 'INR' ? 'var(--shadow-xs)' : 'none'
                }}
              >
                India (INR ₹)
              </button>
              <button
                type="button"
                onClick={() => setCurrency('USD')}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  border: 'none',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  backgroundColor: currency === 'USD' ? 'var(--bg-secondary)' : 'transparent',
                  color: currency === 'USD' ? 'var(--text-primary)' : 'var(--text-secondary)',
                  boxShadow: currency === 'USD' ? 'var(--shadow-xs)' : 'none'
                }}
              >
                Global (USD $)
              </button>
            </div>
          </div>

          {/* Pricing Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            {PRICING_PLANS.map(tier => (
              <div
                key={tier.id}
                className="card"
                style={{
                  padding: '32px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  border: tier.popular ? '2px solid var(--primary)' : '1px solid var(--border)',
                  position: 'relative'
                }}
              >
                {tier.badge && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '-12px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      backgroundColor: 'var(--primary)',
                      color: '#ffffff',
                      fontSize: '10px',
                      fontWeight: 800,
                      padding: '3px 12px',
                      borderRadius: 'var(--radius-full)'
                    }}
                  >
                    {tier.badge}
                  </div>
                )}

                <div>
                  <h3 style={{ fontSize: '20px', fontWeight: 800, margin: '0 0 6px 0', color: 'var(--text-primary)' }}>
                    {tier.name}
                  </h3>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 16px 0' }}>
                    {tier.subtitle}
                  </p>

                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '20px' }}>
                    <span style={{ fontSize: '38px', fontWeight: 800, color: 'var(--text-primary)' }}>
                      {tier.price}
                    </span>
                    <span style={{ fontSize: '13px', color: 'var(--text-tertiary)' }}>/month</span>
                  </div>

                  <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px', marginBottom: '24px' }}>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {tier.features.map((feat, idx) => (
                        <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                          <CheckCircle2 size={16} color="#059669" style={{ flexShrink: 0, marginTop: '2px' }} />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <button
                    className={tier.popular ? 'btn btn-primary' : 'btn btn-secondary'}
              onClick={openPilotBooking}
                    style={{ width: '100%', padding: '12px', fontWeight: 700 }}
                  >
                    Discuss This Pilot
                  </button>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={openPilotBooking}
                    style={{ width: '100%', fontSize: '11px', color: 'var(--text-tertiary)' }}
                  >
                    Book a Demo for {tier.name}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Final Call to Action (Section 49) */}
      <section style={{ padding: '80px 24px', textAlign: 'center', backgroundColor: 'var(--bg-primary)' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '36px', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 16px 0' }}>
            Ready to make AI-generated customer communication reviewable?
          </h2>
          <p style={{ fontSize: '16px', color: 'var(--text-secondary)', lineHeight: 1.6, margin: '0 0 32px 0' }}>
            Run a focused Buildora pilot for sales or support drafts. We will map one workflow, define its review gate, and show a useful result before asking your team to change tools.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <button
              className="btn btn-primary"
              onClick={() => goToWorkspace('signup')}
              style={{ padding: '14px 32px', fontSize: '15px', fontWeight: 700, gap: '8px' }}
            >
              <span>Start Your Pilot</span>
              <ArrowRight size={16} />
            </button>
            <button
              className="btn btn-secondary"
              onClick={openPilotBooking}
              style={{ padding: '14px 24px', fontSize: '15px', fontWeight: 600, gap: '6px' }}
            >
              <Calendar size={15} />
              <span>Book a Demo</span>
            </button>
          </div>
        </div>
      </section>

      {/* 8. Book Demo Modal */}
      <BookDemoModal isOpen={bookDemoOpen} onClose={() => setBookDemoOpen(false)} />
    </div>
  );
}

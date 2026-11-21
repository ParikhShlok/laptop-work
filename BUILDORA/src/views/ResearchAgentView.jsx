import React, { useState } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import {
  Compass,
  Search,
  BookOpen,
  Share2,
  FileDown,
  CheckCircle2,
  ExternalLink,
  Shield,
  Sparkles,
  TrendingUp,
  AlertCircle,
  Clock,
  Layers
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ResearchAgentView() {
  const { researchDemoData, setKnowledgeSources, showToast, setActiveView } = useWorkspace();
  const [topicInput, setTopicInput] = useState(researchDemoData.topic);
  const [isSearching, setIsSearching] = useState(false);
  const [searchStage, setSearchStage] = useState('');
  const [savedToKnowledge, setSavedToKnowledge] = useState(false);

  const handleRunResearch = () => {
    setIsSearching(true);
    setSearchStage('Crawling G2 reviews, pricing endpoints, and SEC filings...');

    setTimeout(() => {
      setSearchStage('Synthesizing feature matrices and compliance posture...');
    }, 600);

    setTimeout(() => {
      setSearchStage('Building pricing comparison & verified citation chain...');
    }, 1200);

    setTimeout(() => {
      setIsSearching(false);
      showToast('Research synthesis completed across 4 verified sources.', 'success');
    }, 1800);
  };

  const handleSaveToKnowledge = () => {
    setKnowledgeSources(prev =>
      prev.map(src => {
        if (src.id === 'notion') {
          return {
            ...src,
            docs: [
              {
                id: `doc-${Date.now()}`,
                title: `Competitor Research: AI Support Market (<50 seats).notion`,
                team: 'Strategy & Research',
                owner: 'Research Agent',
                access: 'All Team',
                updated: 'Just now',
                tags: ['Competitors', 'Market Analysis', 'Pricing']
              },
              ...src.docs
            ]
          };
        }
        return src;
      })
    );

    setSavedToKnowledge(true);
    try {
      confetti({ particleCount: 40, spread: 50, origin: { y: 0.6 } });
    } catch (e) {}

    showToast('Saved research briefing directly into Company Knowledge (Notion).', 'success');
  };

  return (
    <div className="view-container">
      {/* Header */}
      <div className="view-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="badge badge-indigo">Market Intelligence</span>
            <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>Grounded Web & Knowledge Synthesis</span>
          </div>
          <h1 className="view-title">Research Agent</h1>
          <p className="view-subtitle">Research markets, competitors, and customers with verified citations.</p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className="btn btn-secondary btn-sm"
            onClick={handleSaveToKnowledge}
            disabled={savedToKnowledge}
          >
            <BookOpen size={13} />
            <span>{savedToKnowledge ? '✓ Saved in Knowledge' : 'Save to Knowledge'}</span>
          </button>

          <button
            className="btn btn-secondary btn-sm"
            onClick={() => showToast('Generated executive PDF briefing for founder review.', 'info')}
          >
            <FileDown size={13} />
            <span>Create Report</span>
          </button>

          <button
            className="btn btn-primary btn-sm"
            onClick={() => showToast('Research briefing shared to Slack #product-strategy.', 'success')}
          >
            <Share2 size={13} />
            <span>Share with Team</span>
          </button>
        </div>
      </div>

      {/* Topic Query Bar */}
      <div
        className="card"
        style={{
          padding: '16px 20px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '14px'
        }}
      >
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={16} style={{ position: 'absolute', top: '11px', left: '12px', color: 'var(--text-tertiary)' }} />
          <input
            type="text"
            className="form-input"
            value={topicInput}
            onChange={e => setTopicInput(e.target.value)}
            placeholder="Enter research topic (e.g. competitors, market size, regulatory requirements)..."
            style={{ paddingLeft: '36px', fontSize: '13px' }}
          />
        </div>

        <button className="btn btn-primary" onClick={handleRunResearch} disabled={isSearching}>
          <Sparkles size={14} />
          <span>{isSearching ? 'Synthesizing...' : 'Run Deep Research'}</span>
        </button>
      </div>

      {/* Live Research In-Progress Simulation */}
      {isSearching && (
        <div
          className="security-banner banner-blue"
          style={{ marginBottom: '24px', animation: 'zoom-in 0.2s ease' }}
        >
          <div className="brand-badge-dot" style={{ backgroundColor: 'var(--primary)', marginTop: '4px' }} />
          <div className="security-banner-content">
            <h4>Research in progress...</h4>
            <p>{searchStage}</p>
          </div>
        </div>
      )}

      {/* Main Research Content Results */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Executive Summary */}
        <div className="card">
          <div className="card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Compass size={16} color="var(--primary)" />
              <span className="card-title">Executive Summary</span>
            </div>
            <span className="badge badge-emerald">Verified by 4 Sources</span>
          </div>
          <div className="card-body">
            <p style={{ fontSize: '14px', lineHeight: 1.7, color: 'var(--text-primary)' }}>
              {researchDemoData.executiveSummary}
            </p>
          </div>
        </div>

        {/* Competitor Comparison Matrix Table */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Competitor Comparison Matrix</span>
            <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>SMB / Startup Segment (&lt;50 Employees)</span>
          </div>

          <div className="table-container" style={{ border: 'none', borderRadius: 0 }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Competitor</th>
                  <th>Market Share</th>
                  <th>Pricing Model</th>
                  <th>Core Strengths</th>
                  <th>Key Weaknesses</th>
                  <th>Rating</th>
                </tr>
              </thead>
              <tbody>
                {researchDemoData.competitors.map((comp, idx) => (
                  <tr key={idx}>
                    <td>
                      <strong style={{ color: 'var(--text-primary)' }}>{comp.name}</strong>
                    </td>
                    <td>
                      <span className="badge badge-blue">{comp.marketShare}</span>
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}>
                      {comp.pricing}
                    </td>
                    <td style={{ color: 'var(--emerald-text)', fontSize: '12px' }}>
                      {comp.strengths}
                    </td>
                    <td style={{ color: 'var(--rose-text)', fontSize: '12px' }}>
                      {comp.weaknesses}
                    </td>
                    <td>
                      <span className="risk-pill risk-low" style={{ fontSize: '11px' }}>
                        ★ {comp.rating}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Market Observations & Pricing Insights */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          {/* Pricing Insights */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">Pricing Dynamics</span>
              <span className="badge badge-indigo">Startup Sensitivity</span>
            </div>
            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {researchDemoData.pricingObservations.map((obs, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <span style={{ color: 'var(--primary)', fontWeight: 700 }}>•</span>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    {obs}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Market Observations */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">Security & Adoption Barriers</span>
              <span className="badge badge-amber">Founder Consensus</span>
            </div>
            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {researchDemoData.marketObservations.map((obs, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <span style={{ color: 'var(--amber-text)', fontWeight: 700 }}>•</span>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    {obs}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Realistic Verified Sources and Citations */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Verified Citations & Grounded Data Sources</span>
            <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Immutable Hash Verification</span>
          </div>
          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {researchDemoData.sources.map((src, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--bg-tertiary)',
                  fontSize: '12px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <CheckCircle2 size={14} color="#059669" />
                  <strong style={{ color: 'var(--text-primary)' }}>{src.title}</strong>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--primary)' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px' }}>{src.url}</span>
                  <ExternalLink size={12} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

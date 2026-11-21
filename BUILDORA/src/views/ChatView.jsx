import React, { useState } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import {
  Send,
  Sparkles,
  Bot,
  User,
  FileText,
  Search,
  CheckSquare,
  Mail,
  Shield,
  ExternalLink,
  Info,
  AlertCircle,
  Clock,
  ArrowRight,
  Database
} from 'lucide-react';

export default function ChatView() {
  const { setActiveView, setPreviewDoc, showToast, createMeetingTasks, meetingDemoData } = useWorkspace();

  const [inputQuery, setInputQuery] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 'm1',
      sender: 'user',
      text: "What were the main decisions from yesterday's product meeting?",
      time: '10:14 AM'
    },
    {
      id: 'm2',
      sender: 'ai',
      type: 'answer', // 'answer' vs 'action'
      text: `Yesterday's product meeting resulted in 3 major decisions:

1. Move the onboarding redesign to Sprint 14 to reduce initial friction.
2. Prioritize SSO before the enterprise launch (Required for CloudPeak and Acme Tech deals).
3. Run 5 customer interviews before finalizing the pricing page.`,
      sources: [
        {
          id: 'src-1',
          name: 'Product Meeting — Sep 30',
          sourceType: 'Notion',
          excerpt: 'Discussion between Alex, Sarah, Rahul, and Maya on SSO priority & onboarding drop-off.'
        },
        {
          id: 'src-2',
          name: 'Product Roadmap & Sprint 14 Planning',
          sourceType: 'Google Drive',
          excerpt: 'Sprint 14 backlog: SAML 2.0 Auth, Session Revocation, Self-Serve Onboarding.'
        },
        {
          id: 'src-3',
          name: 'Sprint 14 Planning & Estimates',
          sourceType: 'Notion',
          excerpt: 'Engineering sizing: 8 story points allocated to Okta & Google Workspace SSO module.'
        }
      ],
      time: '10:14 AM',
      actionsAvailable: [
        { label: 'Create 3 Action Tasks', action: 'create_tasks', icon: CheckSquare },
        { label: 'Draft Customer Update Email', action: 'draft_email', icon: Mail },
        { label: 'Research Competitor SSO Pricing', action: 'research', icon: Search }
      ]
    }
  ]);

  const [isTyping, setIsTyping] = useState(false);

  // Send query or trigger predefined response
  const handleSend = (textToSend = null) => {
    const query = textToSend || inputQuery;
    if (!query.trim()) return;

    const userMsg = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: query,
      time: 'Just now'
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsTyping(true);

    setTimeout(() => {
      let aiResponse;
      const lower = query.toLowerCase();

      if (lower.includes('priorities') || lower.includes('this month') || lower.includes('step 3')) {
        aiResponse = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          type: 'answer',
          text: `Based on your connected Google Drive roadmaps and recent strategy transcripts, here are the top 3 priorities for October 2026:

1. **Enterprise SAML / SSO Integration**: Move to Sprint 14 to satisfy enterprise security requirements from pipeline leads (Acme Tech & CloudPeak).
2. **Simplified 3-Step Onboarding**: Redesign the initial setup flow to eliminate drop-off at multi-tool connection.
3. **Founder Customer Validation**: Complete 5 founder interviews to confirm pricing elasticity before publishing the new tiers.`,
          sources: [
            { id: 'src-1', name: 'Product Roadmap & Sprint 14 Planning.docx', sourceType: 'Google Drive', excerpt: 'Section 3: Sprint 14 Strategic Milestones & Enterprise Commitments.' },
            { id: 'src-2', name: 'Customer Interview Synthesis — 15 Founders.gdoc', sourceType: 'Google Drive', excerpt: 'Key takeaway: Founders require approval controls before deploying autonomous agents.' }
          ],
          time: 'Just now',
          actionsAvailable: [
            { label: 'View Meeting Agent Transcript', action: 'view_meeting', icon: Bot },
            { label: 'Review Sales Outreach to Acme Tech', action: 'view_sales', icon: Mail }
          ]
        };
      } else if (lower.includes('draft') || lower.includes('email') || lower.includes('acme')) {
        aiResponse = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          type: 'action',
          text: `I have prepared a personalized outbound email for Marcus Vance (VP Engineering at Acme Technologies) referencing your Sprint 14 SSO launch and SOC2 compliance.

⚠️ **External Action Notice**:
Because sending an email contacts an external domain, this action cannot be executed autonomously. It has been routed to the **Approval Center** for your review.`,
          sources: [
            { id: 'src-3', name: 'Sales Playbook & Objection Handling Guide', sourceType: 'Notion', excerpt: 'Positioning: Emphasize Buildora air-gapped security vs public LLMs.' }
          ],
          time: 'Just now',
          actionsAvailable: [
            { label: 'Open Sales Agent & Review Draft', action: 'view_sales', icon: Mail },
            { label: 'Go to Approval Center', action: 'view_approvals', icon: Shield }
          ]
        };
      } else {
        aiResponse = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          type: 'answer',
          text: `I synthesized your connected workspace documents (Google Drive, Notion, Slack, and GitHub). 

All findings are grounded strictly in your 247 indexed internal files. No unverified web data or third-party training pipelines were utilized.`,
          sources: [
            { id: 'src-1', name: 'Product Strategy Meeting — Sep 30 Notes', sourceType: 'Notion', excerpt: 'Internal meeting decisions and attendee notes.' }
          ],
          time: 'Just now',
          actionsAvailable: [
            { label: 'Create Workspace Task', action: 'create_tasks', icon: CheckSquare }
          ]
        };
      }

      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 700);
  };

  const handleActionClick = (actionType) => {
    if (actionType === 'create_tasks') {
      createMeetingTasks(meetingDemoData.actionItems);
      setActiveView('tasks');
    } else if (actionType === 'view_sales' || actionType === 'draft_email') {
      setActiveView('sales');
    } else if (actionType === 'view_meeting') {
      setActiveView('meetings');
    } else if (actionType === 'research') {
      setActiveView('research');
    } else if (actionType === 'view_approvals') {
      setActiveView('approvals');
    }
  };

  return (
    <div className="view-container" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 80px)' }}>
      {/* View Header */}
      <div className="view-header" style={{ marginBottom: '16px' }}>
        <div>
          <h1 className="view-title">Buildora AI</h1>
          <p className="view-subtitle">Ask questions about your company, projects, customers, and work.</p>
        </div>

        {/* Security distinction pill */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 12px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border)',
            fontSize: '12px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--emerald-text)' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--emerald-dot)' }} />
            <span style={{ fontWeight: 600 }}>Answering</span> (Grounded & Private)
          </div>
          <span style={{ color: 'var(--text-tertiary)' }}>vs</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--amber-text)' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--amber-dot)' }} />
            <span style={{ fontWeight: 600 }}>Taking Action</span> (Requires Approval)
          </div>
        </div>
      </div>

      {/* Chat Messages Scroll Container */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          paddingRight: '12px',
          marginBottom: '16px'
        }}
      >
        {messages.map(msg => (
          <div
            key={msg.id}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              width: '100%'
            }}
          >
            {/* Sender Label */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '6px',
                fontSize: '12px',
                color: 'var(--text-tertiary)'
              }}
            >
              {msg.sender === 'user' ? (
                <>
                  <span>You (Alex)</span>
                  <div
                    style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--primary)',
                      color: '#fff',
                      fontSize: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700
                    }}
                  >
                    AR
                  </div>
                </>
              ) : (
                <>
                  <div
                    style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '4px',
                      backgroundColor: '#0f172a',
                      color: '#38bdf8',
                      fontSize: '11px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Sparkles size={12} />
                  </div>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Buildora AI</span>
                  <span className="badge badge-emerald" style={{ fontSize: '10px', padding: '1px 6px' }}>
                    Air-gapped Sandbox
                  </span>
                </>
              )}
            </div>

            {/* Bubble Content */}
            <div
              style={{
                maxWidth: msg.sender === 'user' ? '70%' : '85%',
                backgroundColor: msg.sender === 'user' ? 'var(--primary)' : 'var(--bg-secondary)',
                color: msg.sender === 'user' ? '#ffffff' : 'var(--text-primary)',
                border: msg.sender === 'user' ? 'none' : '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                padding: '16px 20px',
                boxShadow: 'var(--shadow-sm)',
                whiteSpace: 'pre-line',
                fontSize: '14px',
                lineHeight: 1.6
              }}
            >
              {msg.text}

              {/* Clickable Sources */}
              {msg.sources && msg.sources.length > 0 && (
                <div
                  style={{
                    marginTop: '16px',
                    paddingTop: '14px',
                    borderTop: '1px solid var(--border)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}
                >
                  <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Verified Internal Sources:
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {msg.sources.map(src => (
                      <button
                        key={src.id}
                        onClick={() => {
                          setPreviewDoc({
                            title: src.name,
                            team: src.sourceType,
                            owner: 'Verified Workspace Index',
                            access: 'Internal Encrypted',
                            updated: 'Grounded Snapshot',
                            content: src.excerpt
                          });
                        }}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '5px 10px',
                          borderRadius: 'var(--radius-sm)',
                          backgroundColor: 'var(--bg-tertiary)',
                          border: '1px solid var(--border)',
                          color: 'var(--primary)',
                          fontSize: '12px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          transition: 'all 0.12s ease'
                        }}
                        title={`Click to view source from ${src.sourceType}`}
                      >
                        <FileText size={12} />
                        <span>{src.name}</span>
                        <ExternalLink size={10} color="var(--text-tertiary)" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons distinction */}
              {msg.actionsAvailable && (
                <div
                  style={{
                    marginTop: '16px',
                    paddingTop: '12px',
                    borderTop: '1px solid var(--border)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    flexWrap: 'wrap'
                  }}
                >
                  <span style={{ fontSize: '11px', color: 'var(--text-tertiary)', fontWeight: 600 }}>
                    Recommended Next Actions:
                  </span>
                  {msg.actionsAvailable.map((act, i) => {
                    const ActIcon = act.icon;
                    return (
                      <button
                        key={i}
                        className="btn btn-secondary btn-sm"
                        onClick={() => handleActionClick(act.action)}
                        style={{ fontSize: '12px' }}
                      >
                        <ActIcon size={13} color="var(--primary)" />
                        <span>{act.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        ))}

        {isTyping && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-tertiary)', fontSize: '12px' }}>
            <div className="brand-badge-dot" style={{ backgroundColor: 'var(--primary)' }} />
            <span>Buildora is cross-referencing connected knowledge...</span>
          </div>
        )}
      </div>

      {/* Suggested Quick Questions */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', overflowX: 'auto', paddingBottom: '4px' }}>
        {[
          "What are our priorities for this month?",
          "Summarize yesterday's product meeting",
          "Draft follow-up email to Acme Technologies",
          "What did customers say about onboarding in interviews?"
        ].map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            style={{
              padding: '6px 12px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
              color: 'var(--text-secondary)',
              fontSize: '12px',
              whiteSpace: 'nowrap',
              cursor: 'pointer',
              transition: 'all 0.12s ease'
            }}
          >
            {q}
          </button>
        ))}
      </div>

      {/* Chat Input Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '12px 16px',
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <input
          type="text"
          className="form-input"
          placeholder="Ask Buildora about company documents, meetings, leads, or code..."
          value={inputQuery}
          onChange={e => setInputQuery(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') handleSend();
          }}
          style={{ border: 'none', padding: '6px 0', fontSize: '14px', background: 'transparent' }}
        />

        {/* Action Type Selector Buttons */}
        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => handleSend()}
            title="Ask a safe grounded question"
          >
            <Sparkles size={13} color="var(--primary)" />
            <span>Ask</span>
          </button>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setActiveView('research')}
            title="Deep market research"
          >
            <Search size={13} />
            <span>Research</span>
          </button>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setActiveView('tasks')}
            title="Turn insight into task"
          >
            <CheckSquare size={13} />
            <span>Create task</span>
          </button>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setActiveView('sales')}
            title="Draft email with approval requirement"
          >
            <Mail size={13} />
            <span>Draft email</span>
          </button>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => handleSend()}
            disabled={!inputQuery.trim()}
          >
            <Send size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

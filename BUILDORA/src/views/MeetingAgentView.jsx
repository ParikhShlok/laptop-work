import React, { useState } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import {
  Video,
  Play,
  Pause,
  CheckCircle2,
  Calendar,
  Clock,
  Users,
  CheckSquare,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Share2,
  Volume2
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function MeetingAgentView() {
  const { meetingDemoData, createMeetingTasks, setActiveView, tasks, demoTourActive, setDemoTourStep } = useWorkspace();
  const [isPlaying, setIsPlaying] = useState(false);
  const [tasksCreated, setTasksCreated] = useState(false);

  const handleCreateTasks = () => {
    createMeetingTasks(meetingDemoData.actionItems);
    setTasksCreated(true);

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch (e) {}

    if (demoTourActive) {
      setDemoTourStep(5);
    }
  };

  return (
    <div className="view-container">
      {/* Header */}
      <div className="view-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="badge badge-emerald">Meeting Agent Active</span>
            <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>Google Meet Bot • Recorded Sep 30, 2026</span>
          </div>
          <h1 className="view-title">{meetingDemoData.title}</h1>
          <p className="view-subtitle">
            Automated transcription, decision synthesis, and action item extraction.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
            <span>{isPlaying ? 'Pause Audio' : 'Play Audio Sync'}</span>
          </button>

          <button
            className="btn btn-primary btn-sm"
            onClick={handleCreateTasks}
            disabled={tasksCreated}
          >
            <CheckSquare size={14} />
            <span>{tasksCreated ? '✓ Tasks Added to Workspace' : 'Create tasks'}</span>
          </button>
        </div>
      </div>

      {/* Participants & Meeting Meta Bar */}
      <div
        className="card"
        style={{
          padding: '14px 20px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
            <Calendar size={14} color="var(--text-tertiary)" />
            <strong style={{ color: 'var(--text-primary)' }}>{meetingDemoData.date}</strong>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
            <Clock size={14} color="var(--text-tertiary)" />
            <span>{meetingDemoData.duration}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
            <Video size={14} color="#dc2626" />
            <span>{meetingDemoData.channel}</span>
          </div>
        </div>

        {/* Participants Avatars */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>Participants:</span>
          <div style={{ display: 'flex', gap: '8px' }}>
            {meetingDemoData.participants.map(p => (
              <div
                key={p.name}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '3px 8px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'var(--bg-tertiary)',
                  fontSize: '11px',
                  fontWeight: 600
                }}
              >
                <span
                  style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    backgroundColor: p.color,
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '9px',
                    fontWeight: 800
                  }}
                >
                  {p.initials}
                </span>
                <span>{p.name}</span>
                <span style={{ color: 'var(--text-tertiary)', fontWeight: 400 }}>({p.role.split(' ')[0]})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Grid: AI Outputs on Left, Full Transcript on Right */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px' }}>
        {/* Left Column: AI Synthesis (Summary, Decisions, Action Items) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Summary Card */}
          <div className="card">
            <div className="card-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={16} color="var(--primary)" />
                <span className="card-title">AI Summary</span>
              </div>
              <span className="badge badge-emerald">Verified</span>
            </div>
            <div className="card-body">
              <p style={{ fontSize: '14px', lineHeight: 1.6, color: 'var(--text-primary)' }}>
                {meetingDemoData.summary}
              </p>
            </div>
          </div>

          {/* Decisions Card */}
          <div className="card">
            <div className="card-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={16} color="#059669" />
                <span className="card-title">Decisions Made</span>
              </div>
              <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>3 Decisions Logged</span>
            </div>
            <div className="card-body" style={{ padding: '16px 20px' }}>
              <ol style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {meetingDemoData.decisions.map((dec, idx) => (
                  <li key={idx} style={{ fontSize: '13px', lineHeight: 1.5, color: 'var(--text-primary)', fontWeight: 500 }}>
                    {dec}
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* Action Items Card */}
          <div className="card" style={{ borderColor: tasksCreated ? 'var(--emerald-border)' : 'var(--border)' }}>
            <div className="card-header" style={{ backgroundColor: tasksCreated ? 'var(--emerald-bg)' : 'var(--bg-secondary)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckSquare size={16} color={tasksCreated ? '#059669' : 'var(--primary)'} />
                <span className="card-title">Action Items & Deliverables</span>
              </div>
              {tasksCreated ? (
                <span className="badge badge-emerald">✓ Added to Task System</span>
              ) : (
                <span className="badge badge-amber">Staged for Creation</span>
              )}
            </div>

            <div className="table-container" style={{ border: 'none', borderRadius: 0 }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Task Description</th>
                    <th>Owner</th>
                    <th>Due Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {meetingDemoData.actionItems.map((item, idx) => (
                    <tr key={idx}>
                      <td style={{ fontWeight: 600 }}>{item.task}</td>
                      <td>
                        <span className="badge badge-indigo">{item.owner}</span>
                      </td>
                      <td style={{ color: 'var(--text-secondary)' }}>{item.due}</td>
                      <td>
                        <span className="badge badge-blue">
                          {tasksCreated ? 'Active in Tasks' : 'Staged'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div
              style={{
                padding: '14px 20px',
                borderTop: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: 'var(--bg-tertiary)'
              }}
            >
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                {tasksCreated
                  ? '3 tasks created in workspace. Click below to inspect.'
                  : 'Clicking "Create tasks" will push these items directly into your Task queue.'}
              </span>

              {tasksCreated ? (
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => setActiveView('tasks')}
                >
                  <span>View in Task Manager</span>
                  <ArrowRight size={13} />
                </button>
              ) : (
                <button className="btn btn-primary btn-sm" onClick={handleCreateTasks}>
                  <CheckSquare size={13} />
                  <span>Create tasks</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Full Audio & Transcript Viewer */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <div className="card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Volume2 size={16} color="var(--primary)" />
              <span className="card-title">Meeting Transcript</span>
            </div>
            <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Whisper AI v3 • 99.4% accuracy</span>
          </div>

          <div
            style={{
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              overflowY: 'auto',
              maxHeight: '620px'
            }}
          >
            {meetingDemoData.transcript.map((item, idx) => {
              const participant = meetingDemoData.participants.find(p => p.name === item.speaker);
              return (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: idx % 2 === 0 ? 'var(--bg-tertiary)' : 'var(--bg-secondary)',
                    border: '1px solid var(--border)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span
                        style={{
                          width: '18px',
                          height: '18px',
                          borderRadius: '50%',
                          backgroundColor: participant?.color || '#2563eb',
                          color: '#fff',
                          fontSize: '9px',
                          fontWeight: 700,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        {participant?.initials || 'U'}
                      </span>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>
                        {item.speaker}
                      </span>
                    </div>
                    <span style={{ fontSize: '11px', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>
                      {item.time}
                    </span>
                  </div>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, marginTop: '2px' }}>
                    "{item.text}"
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

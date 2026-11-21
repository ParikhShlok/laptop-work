import React, { useState, useEffect } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import {
  Search,
  LayoutDashboard,
  MessageSquare,
  Database,
  Bot,
  Video,
  Compass,
  CheckCircle2,
  FileText,
  Shield,
  CheckSquare,
  Users,
  Settings,
  X,
  Sparkles
} from 'lucide-react';

const COMMANDS = [
  { id: 'overview', title: 'Go to Overview Dashboard', category: 'Navigation', icon: LayoutDashboard },
  { id: 'chat', title: 'Ask Buildora AI (Chat)', category: 'Navigation', icon: MessageSquare },
  { id: 'knowledge', title: 'Company Knowledge & Documents', category: 'Navigation', icon: Database },
  { id: 'approvals', title: 'Review Pending Approvals', category: 'Control', icon: CheckCircle2 },
  { id: 'audit', title: 'View Immutable Audit Log', category: 'Security', icon: FileText },
  { id: 'security', title: 'Security Dashboard & Guardrails', category: 'Security', icon: Shield },
  { id: 'meetings', title: 'Meeting Agent: Product Strategy Notes', category: 'Agents', icon: Video },
  { id: 'sales', title: 'Sales Agent: Acme Tech Follow-up', category: 'Agents', icon: Sparkles },
  { id: 'research', title: 'Research Agent: Competitor Analysis', category: 'Agents', icon: Compass },
  { id: 'tasks', title: 'Workspace Tasks & Action Items', category: 'Navigation', icon: CheckSquare },
  { id: 'team', title: 'Team Members & RBAC Permissions', category: 'Team', icon: Users },
  { id: 'settings', title: 'Workspace Settings', category: 'System', icon: Settings }
];

export default function CommandPalette() {
  const { commandPaletteOpen, setCommandPaletteOpen, setActiveView } = useWorkspace();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (commandPaletteOpen) {
      setQuery('');
      setSelectedIndex(0);
    }
  }, [commandPaletteOpen]);

  if (!commandPaletteOpen) return null;

  const filtered = COMMANDS.filter(cmd =>
    cmd.title.toLowerCase().includes(query.toLowerCase()) ||
    cmd.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (viewId) => {
    setActiveView(viewId);
    setCommandPaletteOpen(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < filtered.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : filtered.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        handleSelect(filtered[selectedIndex].id);
      }
    } else if (e.key === 'Escape') {
      setCommandPaletteOpen(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={() => setCommandPaletteOpen(false)}>
      <div
        className="modal-content"
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: '540px', padding: 0 }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '14px 18px',
            borderBottom: '1px solid var(--border)'
          }}
        >
          <Search size={18} color="var(--text-tertiary)" />
          <input
            autoFocus
            type="text"
            placeholder="Type a command or search workspace..."
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            style={{
              flex: 1,
              border: 'none',
              background: 'transparent',
              fontSize: '14px',
              color: 'var(--text-primary)',
              outline: 'none'
            }}
          />
          <button
            onClick={() => setCommandPaletteOpen(false)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)' }}
          >
            <X size={16} />
          </button>
        </div>

        <div style={{ maxHeight: '340px', overflowY: 'auto', padding: '6px' }}>
          {filtered.length === 0 ? (
            <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: '13px' }}>
              No commands or views found matching "{query}"
            </div>
          ) : (
            filtered.map((cmd, idx) => {
              const Icon = cmd.icon;
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={cmd.id}
                  onClick={() => handleSelect(cmd.id)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: isSelected ? 'var(--bg-hover)' : 'transparent',
                    cursor: 'pointer',
                    fontSize: '13px',
                    color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Icon size={16} color={isSelected ? 'var(--primary)' : 'var(--text-tertiary)'} />
                    <span style={{ fontWeight: isSelected ? 600 : 500 }}>{cmd.title}</span>
                  </div>
                  <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>{cmd.category}</span>
                </div>
              );
            })
          )}
        </div>

        <div
          style={{
            padding: '8px 14px',
            backgroundColor: 'var(--bg-tertiary)',
            borderTop: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '11px',
            color: 'var(--text-tertiary)'
          }}
        >
          <span>Use ↑ ↓ to navigate, Enter to select</span>
          <span>Esc to close</span>
        </div>
      </div>
    </div>
  );
}

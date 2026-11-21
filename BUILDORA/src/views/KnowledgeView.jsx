import React, { useState } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import {
  Database,
  Search,
  Plus,
  HardDrive,
  BookOpen,
  MessageSquare,
  Lock,
  ShieldCheck,
  Filter,
  FileText,
  Clock,
  User,
  ArrowUpRight,
  RefreshCw,
  CheckCircle2,
  X
} from 'lucide-react';
import GithubIcon from '../components/GithubIcon';

const SOURCE_ICONS = {
  gdrive: HardDrive,
  notion: BookOpen,
  slack: MessageSquare,
  github: GithubIcon
};

export default function KnowledgeView() {
  const { knowledgeSources, setPreviewDoc, showToast, setActiveView, setDemoTourStep, demoTourActive } = useWorkspace();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSource, setSelectedSource] = useState('all');
  const [addKnowledgeModal, setAddKnowledgeModal] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Flatten all documents
  const allDocs = knowledgeSources.flatMap(src =>
    src.docs.map(doc => ({
      ...doc,
      sourceName: src.name,
      sourceId: src.id,
      sourceColor: src.color
    }))
  );

  const filteredDocs = allDocs.filter(doc => {
    const matchesSource = selectedSource === 'all' || doc.sourceId === selectedSource;
    const matchesQuery =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.team.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSource && matchesQuery;
  });

  const handleManualSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      showToast('All 4 connected knowledge connectors synced. 0 permission changes.', 'success');
      if (demoTourActive) {
        setDemoTourStep(2);
      }
    }, 900);
  };

  return (
    <div className="view-container">
      {/* Header */}
      <div className="view-header">
        <div>
          <h1 className="view-title">Company Knowledge</h1>
          <p className="view-subtitle">Buildora securely indexes your connected company information.</p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            className="btn btn-secondary btn-sm"
            onClick={handleManualSync}
            disabled={isSyncing}
          >
            <RefreshCw size={13} className={isSyncing ? 'brand-badge-dot' : ''} />
            <span>{isSyncing ? 'Syncing...' : 'Sync All Sources'}</span>
          </button>

          <button
            className="btn btn-primary btn-sm"
            onClick={() => setAddKnowledgeModal(true)}
          >
            <Plus size={14} />
            <span>+ Add knowledge</span>
          </button>
        </div>
      </div>

      {/* Mandatory Visual Guardrail Banner */}
      <div className="security-banner banner-amber" style={{ borderColor: 'var(--amber-border)' }}>
        <div className="security-banner-icon">
          <Lock size={20} color="#b45309" />
        </div>
        <div className="security-banner-content" style={{ flex: 1 }}>
          <h4>Private Company Data</h4>
          <p>
            Only authorized members and agents can access this information. All files are vectorized in dedicated tenant partitions and never leave your encryption perimeter.
          </p>
        </div>
        <span className="risk-pill risk-low" style={{ alignSelf: 'center' }}>
          AES-256 Air-Gapped
        </span>
      </div>

      {/* 4 Connected Knowledge Sources Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '28px' }}>
        {knowledgeSources.map(source => {
          const Icon = SOURCE_ICONS[source.id] || Database;
          const isSelected = selectedSource === source.id;
          return (
            <div
              key={source.id}
              className="card"
              onClick={() => setSelectedSource(isSelected ? 'all' : source.id)}
              style={{
                padding: '16px 18px',
                cursor: 'pointer',
                borderColor: isSelected ? 'var(--primary)' : 'var(--border)',
                backgroundColor: isSelected ? 'var(--primary-light)' : 'var(--bg-secondary)',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--bg-tertiary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--primary)'
                    }}
                  >
                    <Icon size={16} />
                  </div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {source.name}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>
                      {source.count}
                    </div>
                  </div>
                </div>

                <span className="badge badge-emerald">
                  {source.status}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '11px', color: 'var(--text-secondary)' }}>
                <div>Last sync: <strong style={{ color: 'var(--text-primary)' }}>{source.lastSync}</strong></div>
                <div style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }} title={source.permissions}>
                  {source.permissions}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filter and Search Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          marginBottom: '16px'
        }}
      >
        <div style={{ position: 'relative', flex: 1, maxWidth: '420px' }}>
          <Search size={14} style={{ position: 'absolute', top: '10px', left: '12px', color: 'var(--text-tertiary)' }} />
          <input
            type="text"
            className="form-input"
            placeholder="Search indexed documents, specs, tags, or authors..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '34px' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className={`btn btn-sm ${selectedSource === 'all' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setSelectedSource('all')}
          >
            All Sources ({allDocs.length})
          </button>
          {knowledgeSources.map(s => (
            <button
              key={s.id}
              className={`btn btn-sm ${selectedSource === s.id ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setSelectedSource(s.id)}
            >
              {s.name}
            </button>
          ))}
        </div>
      </div>

      {/* Documents Table with Metadata: Owner, Team, Access Level, Last Updated, Source */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Document / Resource</th>
              <th>Source</th>
              <th>Owner</th>
              <th>Team</th>
              <th>Access Level</th>
              <th>Last Updated</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDocs.map(doc => (
              <tr
                key={doc.id}
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  setPreviewDoc({
                    title: doc.title,
                    team: doc.team,
                    owner: doc.owner,
                    access: doc.access,
                    updated: doc.updated,
                    content: `This document is securely indexed in Buildora.
Location: ${doc.sourceName}
Owner: ${doc.owner} (${doc.team})
Access: ${doc.access}
Tags: ${doc.tags.join(', ')}

Content Summary:
Detailed strategic guidelines, architectural definitions, and decision matrices for Acme AI Labs. All agents respect the access bounds defined by the owner.`
                  });
                }}
              >
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <FileText size={16} color="var(--primary)" />
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{doc.title}</div>
                      <div style={{ display: 'flex', gap: '4px', marginTop: '2px' }}>
                        {doc.tags.map(t => (
                          <span
                            key={t}
                            style={{
                              fontSize: '10px',
                              padding: '1px 5px',
                              borderRadius: '3px',
                              backgroundColor: 'var(--bg-tertiary)',
                              color: 'var(--text-tertiary)'
                            }}
                          >
                            #{t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </td>
                <td>
                  <span className="badge badge-blue">{doc.sourceName}</span>
                </td>
                <td>
                  <span style={{ fontWeight: 500 }}>{doc.owner}</span>
                </td>
                <td>
                  <span style={{ color: 'var(--text-secondary)' }}>{doc.team}</span>
                </td>
                <td>
                  <span
                    className={`risk-pill ${
                      doc.access.includes('Restricted') || doc.access.includes('Founders')
                        ? 'risk-medium'
                        : 'risk-low'
                    }`}
                  >
                    <Lock size={10} />
                    {doc.access}
                  </span>
                </td>
                <td>
                  <span style={{ color: 'var(--text-tertiary)', fontSize: '12px' }}>{doc.updated}</span>
                </td>
                <td>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={e => {
                      e.stopPropagation();
                      setPreviewDoc({
                        title: doc.title,
                        team: doc.team,
                        owner: doc.owner,
                        access: doc.access,
                        updated: doc.updated,
                        content: `Security Sandbox Preview: ${doc.title}
Indexed from ${doc.sourceName}. Vector embeddings refreshed 14m ago.`
                      });
                    }}
                    style={{ padding: '3px 8px', fontSize: '11px' }}
                  >
                    Preview
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Knowledge Modal */}
      {addKnowledgeModal && (
        <div className="modal-overlay" onClick={() => setAddKnowledgeModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '520px' }}>
            <div className="modal-header">
              <span className="card-title">+ Add Knowledge Source</span>
              <button
                onClick={() => setAddKnowledgeModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)' }}
              >
                <X size={18} />
              </button>
            </div>
            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                Select a repository or drag & drop files to index into your private AES-256 tenant partition.
              </p>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>
                  Connector Type
                </label>
                <select className="form-input">
                  <option>Google Drive Folder</option>
                  <option>Notion Database</option>
                  <option>GitHub Repository</option>
                  <option>Direct PDF / Markdown Upload</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>
                  Resource URL or Path
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="https://drive.google.com/drive/folders/..."
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>
                  Access Scope & Classification
                </label>
                <select className="form-input">
                  <option>Internal Confidential (All Agents)</option>
                  <option>Technical Only (Engineering & Dev Agent)</option>
                  <option>Restricted (Founders Only)</option>
                </select>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary btn-sm" onClick={() => setAddKnowledgeModal(false)}>
                Cancel
              </button>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => {
                  setAddKnowledgeModal(false);
                  showToast('Connector staged. Initiating background vector indexing...', 'success');
                }}
              >
                Connect & Index
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

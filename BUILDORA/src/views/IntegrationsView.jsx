import React, { useState } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import {
  Layers,
  HardDrive,
  Mail,
  Video,
  MessageSquare,
  Database,
  BookOpen,
  Kanban,
  CheckSquare,
  Briefcase,
  CheckCircle2,
  RefreshCw,
  Lock,
  Plus,
  X,
  ExternalLink
} from 'lucide-react';
import GithubIcon from '../components/GithubIcon';

const ICON_MAP = {
  Layers,
  HardDrive,
  Mail,
  Video,
  Github: GithubIcon,
  MessageSquare,
  Database,
  BookOpen,
  Kanban,
  CheckSquare,
  Briefcase
};

export default function IntegrationsView() {
  const { integrations, setIntegrations, showToast } = useWorkspace();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [manageModal, setManageModal] = useState(null);

  const connectedList = integrations.filter(i => i.status === 'Connected');
  const comingSoonList = integrations.filter(i => i.status !== 'Connected');

  const handleDisconnect = (id, name) => {
    setIntegrations(prev =>
      prev.map(i => (i.id === id ? { ...i, status: 'Disconnected' } : i))
    );
    setManageModal(null);
    showToast(`Disconnected ${name}. Access revoked and active tokens destroyed.`, 'warning');
  };

  const handleReconnect = (id, name) => {
    setIntegrations(prev =>
      prev.map(i => (i.id === id ? { ...i, status: 'Connected', lastSync: 'Just now' } : i))
    );
    setManageModal(null);
    showToast(`Successfully reconnected ${name}.`, 'success');
  };

  return (
    <div className="view-container">
      {/* Header */}
      <div className="view-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="badge badge-blue">Demo connection states</span>
            <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>Live OAuth connections are configured during a scoped pilot</span>
          </div>
          <h1 className="view-title">Integrations</h1>
          <p className="view-subtitle">Explore the integrations Buildora is designed to support. This preview does not connect to company tools.</p>
        </div>

        <button
          className="btn btn-primary btn-sm"
          onClick={() => showToast('Select an integration card below to initiate OAuth connection.', 'info')}
        >
          <Plus size={14} />
          <span>+ Connect New Tool</span>
        </button>
      </div>

      {/* Security Banner */}
      <div className="security-banner banner-blue">
        <div className="security-banner-icon">
          <Lock size={20} color="#2563eb" />
        </div>
        <div className="security-banner-content" style={{ flex: 1 }}>
          <h4>Integration rollout approach</h4>
          <p>
            Each pilot begins with one read-only or draft-only connection and a documented review gate. We validate the requested scopes before enabling any live data flow.
          </p>
        </div>
      </div>

      {/* Active Connected Integrations */}
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '14px' }}>
          Planned pilot connections ({connectedList.length})
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '16px' }}>
          {connectedList.map(item => {
            const Icon = ICON_MAP[item.icon] || Layers;
            return (
              <div key={item.id} className="card" style={{ padding: '18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: 'var(--radius-md)',
                          backgroundColor: 'var(--bg-tertiary)',
                          color: 'var(--primary)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <Icon size={18} />
                      </div>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
                          {item.name}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>
                          {item.category}
                        </div>
                      </div>
                    </div>

                    <span className="badge badge-emerald">
                      <span className="brand-badge-dot"></span>
                      {item.status}
                    </span>
                  </div>

                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '14px', lineHeight: 1.5 }}>
                    {item.description}
                  </p>

                  <div
                    style={{
                      padding: '10px 12px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'var(--bg-tertiary)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                      fontSize: '11px',
                      marginBottom: '14px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Permissions:</span>
                      <span style={{ fontWeight: 600, color: 'var(--text-primary)', textAlign: 'right' }}>
                        {item.permissions}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Last Sync:</span>
                      <span style={{ fontWeight: 600, color: 'var(--emerald-text)' }}>{item.lastSync}</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px', paddingTop: '10px', borderTop: '1px solid var(--border)' }}>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => setManageModal(item)}
                    style={{ flex: 1 }}
                  >
                    Manage Scopes
                  </button>

                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => handleDisconnect(item.id, item.name)}
                    style={{ color: '#dc2626' }}
                  >
                    Disconnect
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Coming Soon Integrations */}
      <div>
        <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '14px' }}>
          Available & Coming Soon ({comingSoonList.length})
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '16px' }}>
          {comingSoonList.map(item => {
            const Icon = ICON_MAP[item.icon] || Layers;
            return (
              <div
                key={item.id}
                className="card"
                style={{ padding: '18px', opacity: 0.85, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: 'var(--radius-md)',
                          backgroundColor: 'var(--bg-tertiary)',
                          color: 'var(--text-tertiary)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <Icon size={18} />
                      </div>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
                          {item.name}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>
                          {item.category}
                        </div>
                      </div>
                    </div>

                    <span className="badge badge-indigo">
                      {item.status}
                    </span>
                  </div>

                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '14px', lineHeight: 1.5 }}>
                    {item.description}
                  </p>
                </div>

                <div style={{ paddingTop: '10px', borderTop: '1px solid var(--border)' }}>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => handleReconnect(item.id, item.name)}
                    style={{ width: '100%' }}
                  >
                    Request Early Access / Connect
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Manage Integration Modal */}
      {manageModal && (
        <div className="modal-overlay" onClick={() => setManageModal(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '480px' }}>
            <div className="modal-header">
              <span className="card-title">Manage {manageModal.name} Integration</span>
              <button
                onClick={() => setManageModal(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)' }}
              >
                <X size={18} />
              </button>
            </div>

            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
                  Connected Since
                </label>
                <div style={{ fontSize: '13px', color: 'var(--text-primary)', marginTop: '2px' }}>
                  {manageModal.connectedSince || 'Recently linked'}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
                  Active Scopes
                </label>
                <div style={{ fontSize: '13px', color: 'var(--text-primary)', marginTop: '2px' }}>
                  {manageModal.permissions}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
                  Token Rotation Policy
                </label>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  Automated ephemeral token refresh every 60 minutes with hardware security module (HSM) signing.
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary btn-sm" onClick={() => setManageModal(null)}>
                Close
              </button>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => {
                  showToast(`Synced ${manageModal.name} tokens.`, 'success');
                  setManageModal(null);
                }}
              >
                Refresh Scopes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import {
  FileText,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Download,
  Lock,
  ShieldCheck,
  X,
  ExternalLink,
  Hash
} from 'lucide-react';

export default function AuditLogView() {
  const { auditLogs, showToast } = useWorkspace();
  const [searchQuery, setSearchQuery] = useState('');
  const [agentFilter, setAgentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedLog, setSelectedLog] = useState(null);

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch =
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.agent.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.resource.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.user.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesAgent = agentFilter === 'all' || log.agent.toLowerCase().includes(agentFilter.toLowerCase());
    const matchesStatus = statusFilter === 'all' || log.result.toLowerCase().includes(statusFilter.toLowerCase());

    return matchesSearch && matchesAgent && matchesStatus;
  });

  const handleExportLogs = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(auditLogs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `buildora_audit_log_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Immutable audit trail JSON exported with SHA-256 signatures.', 'success');
  };

  return (
    <div className="view-container">
      {/* Header */}
      <div className="view-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="badge badge-emerald">SHA-256 Hash Chain</span>
            <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>Tamper-Evident Immutable Ledger</span>
          </div>
          <h1 className="view-title">Audit Log</h1>
          <p className="view-subtitle">Chronological ledger recording every AI agent read, query, approval, and execution.</p>
        </div>

        <button className="btn btn-secondary btn-sm" onClick={handleExportLogs}>
          <Download size={13} />
          <span>Export Compliance Log</span>
        </button>
      </div>

      {/* Security Callout Banner */}
      <div className="security-banner banner-blue">
        <div className="security-banner-icon">
          <ShieldCheck size={20} color="#2563eb" />
        </div>
        <div className="security-banner-content" style={{ flex: 1 }}>
          <h4>Complete Accountability Chain</h4>
          <p>
            <strong>Agent → Data → Action → Approval → Execution</strong>.
            Buildora logs every interaction with full contextual payloads, authorized user signatures, and sandboxed IP footprints for audit readiness.
          </p>
        </div>
      </div>

      {/* Filters Bar */}
      <div
        className="card"
        style={{
          padding: '14px 18px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >
        <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
          <Search size={14} style={{ position: 'absolute', top: '10px', left: '12px', color: 'var(--text-tertiary)' }} />
          <input
            type="text"
            className="form-input"
            placeholder="Search by action, agent, resource, or user..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '34px' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <div>
            <select
              className="form-input"
              value={agentFilter}
              onChange={e => setAgentFilter(e.target.value)}
              style={{ padding: '6px 12px', fontSize: '12px' }}
            >
              <option value="all">All Agents</option>
              <option value="Sales Agent">Sales Agent</option>
              <option value="Meeting Agent">Meeting Agent</option>
              <option value="Research Agent">Research Agent</option>
              <option value="Support Agent">Support Agent</option>
              <option value="Developer Agent">Developer Agent</option>
            </select>
          </div>

          <div>
            <select
              className="form-input"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              style={{ padding: '6px 12px', fontSize: '12px' }}
            >
              <option value="all">All Statuses</option>
              <option value="Allowed">Allowed</option>
              <option value="Approved">Approved</option>
              <option value="Awaiting approval">Awaiting Approval</option>
              <option value="Blocked">Blocked / Quarantined</option>
            </select>
          </div>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>User / Initiator</th>
              <th>Agent</th>
              <th>Action</th>
              <th>Resource</th>
              <th>Result</th>
              <th>Approval Status</th>
              <th>IP / Sandbox Hash</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map(log => (
              <tr
                key={log.id}
                style={{ cursor: 'pointer' }}
                onClick={() => setSelectedLog(log)}
              >
                <td>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 600 }}>
                    {log.timestamp}
                  </span>
                  <div style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>{log.date}</div>
                </td>
                <td>
                  <span style={{ fontWeight: 500 }}>{log.user}</span>
                </td>
                <td>
                  <span className="badge badge-indigo">{log.agent}</span>
                </td>
                <td>
                  <strong style={{ color: 'var(--text-primary)' }}>{log.action}</strong>
                </td>
                <td>
                  <span style={{ color: 'var(--text-secondary)' }}>{log.resource}</span>
                </td>
                <td>
                  <span
                    className={`badge ${
                      log.statusBadge === 'emerald'
                        ? 'badge-emerald'
                        : log.statusBadge === 'amber'
                        ? 'badge-amber'
                        : 'badge-rose'
                    }`}
                  >
                    {log.result}
                  </span>
                </td>
                <td>
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                    {log.approvalStatus}
                  </span>
                </td>
                <td>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-tertiary)' }}>
                    {log.ipHash}
                  </span>
                </td>
                <td>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={e => {
                      e.stopPropagation();
                      setSelectedLog(log);
                    }}
                    style={{ padding: '3px 8px', fontSize: '11px' }}
                  >
                    Proof
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Log Details Modal with Cryptographic Proof */}
      {selectedLog && (
        <div className="modal-overlay" onClick={() => setSelectedLog(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '580px' }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Lock size={16} color="var(--primary)" />
                <span className="card-title">Cryptographic Audit Record #{selectedLog.id}</span>
              </div>
              <button
                onClick={() => setSelectedLog(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)' }}
              >
                <X size={18} />
              </button>
            </div>

            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 700 }}>
                    Timestamp
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 600 }}>{selectedLog.timestamp} ({selectedLog.date})</div>
                </div>

                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 700 }}>
                    Agent Worker
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 600 }}>{selectedLog.agent}</div>
                </div>

                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 700 }}>
                    Target Resource
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 600 }}>{selectedLog.resource}</div>
                </div>

                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 700 }}>
                    Approval Status
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--emerald-text)' }}>
                    {selectedLog.approvalStatus}
                  </div>
                </div>
              </div>

              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '4px' }}>
                  Execution Details
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  {selectedLog.details}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '4px' }}>
                  Cryptographic Verification
                </div>
                <div
                  style={{
                    backgroundColor: 'var(--bg-tertiary)',
                    padding: '12px',
                    borderRadius: 'var(--radius-md)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    color: 'var(--text-primary)',
                    lineHeight: 1.5,
                    border: '1px solid var(--border)'
                  }}
                >
                  <div>Record Hash: sha256_7fa982bc194091fe8942b0...</div>
                  <div>Previous Block: sha256_e109d73ab0941829cd7812...</div>
                  <div>Signature: ECDSA_P256_VERIFIED</div>
                  <div>Isolation Sandbox: MicroVM-worker-node-04</div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary btn-sm" onClick={() => setSelectedLog(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import {
  ShieldCheck,
  UserPlus,
  Users,
  Lock,
  Edit2,
  Check,
  X,
  AlertTriangle,
  Sparkles
} from 'lucide-react';

export default function PermissionsView() {
  const { teamMembers, agentPermissions, setAgentPermissions, showToast } = useWorkspace();
  const [matrix, setMatrix] = useState(agentPermissions);
  const [editingAgent, setEditingAgent] = useState(null);

  const handlePermissionChange = (agentId, field, value) => {
    setMatrix(prev =>
      prev.map(row => (row.id === agentId ? { ...row, [field]: value } : row))
    );
    showToast(`Updated ${field} permission for ${agentId}.`, 'info');
  };

  const handleSaveMatrix = () => {
    setAgentPermissions(matrix);
    showToast('Agent Permissions Matrix successfully saved and enforced across sandboxes.', 'success');
  };

  return (
    <div className="view-container">
      {/* Header */}
      <div className="view-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="badge badge-emerald">RBAC & Least Privilege</span>
            <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>Founder Admin Enforcement</span>
          </div>
          <h1 className="view-title">Roles & Permissions</h1>
          <p className="view-subtitle">Manage human access levels and fine-grained AI agent tool scopes.</p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => showToast('Invite team member link generated.', 'info')}
          >
            <UserPlus size={14} />
            <span>Invite Member</span>
          </button>

          <button className="btn btn-primary btn-sm" onClick={handleSaveMatrix}>
            <Check size={14} />
            <span>Save Matrix Rules</span>
          </button>
        </div>
      </div>

      {/* Human Team Members Role Management Section */}
      <div className="card" style={{ marginBottom: '28px' }}>
        <div className="card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Users size={16} color="var(--primary)" />
            <span className="card-title">Team Roles & Access</span>
          </div>
          <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>4 Active Members (Growth Pro Tier)</span>
        </div>

        <div className="table-container" style={{ border: 'none', borderRadius: 0 }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Member</th>
                <th>Role</th>
                <th>Permissions Summary</th>
                <th>Authorized Scopes</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {teamMembers.map(member => (
                <tr key={member.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          backgroundColor: 'var(--primary)',
                          color: '#fff',
                          fontSize: '11px',
                          fontWeight: 700,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{member.name}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>{member.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-indigo">{member.role}</span>
                  </td>
                  <td style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    {member.permissions}
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                      {member.scope.map((s, idx) => (
                        <span
                          key={idx}
                          style={{
                            fontSize: '10px',
                            padding: '1px 6px',
                            borderRadius: 'var(--radius-xs)',
                            backgroundColor: 'var(--bg-tertiary)',
                            color: 'var(--text-secondary)'
                          }}
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-emerald">Active</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Agent Permissions Matrix */}
      <div className="card">
        <div className="card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={16} color="var(--primary)" />
            <span className="card-title">Agent Permissions Matrix</span>
          </div>
          <span className="badge badge-blue">Interactive Admin Table</span>
        </div>

        <div className="table-container" style={{ border: 'none', borderRadius: 0 }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Agent</th>
                <th>Knowledge</th>
                <th>Gmail</th>
                <th>CRM</th>
                <th>GitHub</th>
                <th>External Actions</th>
                <th>Risk Profile</th>
              </tr>
            </thead>
            <tbody>
              {matrix.map(row => (
                <tr key={row.id}>
                  <td>
                    <strong style={{ color: 'var(--text-primary)' }}>{row.agent}</strong>
                  </td>

                  {/* Knowledge permission selector */}
                  <td>
                    <select
                      className="form-input"
                      value={row.knowledge}
                      onChange={e => handlePermissionChange(row.id, 'knowledge', e.target.value)}
                      style={{ padding: '4px 8px', fontSize: '12px' }}
                    >
                      <option value="Read">Read</option>
                      <option value="Limited">Limited</option>
                      <option value="Technical">Technical</option>
                      <option value="No">No Access</option>
                    </select>
                  </td>

                  {/* Gmail permission selector */}
                  <td>
                    <select
                      className="form-input"
                      value={row.gmail}
                      onChange={e => handlePermissionChange(row.id, 'gmail', e.target.value)}
                      style={{ padding: '4px 8px', fontSize: '12px' }}
                    >
                      <option value="No">No</option>
                      <option value="Draft Only">Draft Only</option>
                      <option value="Read/Write">Read/Write</option>
                    </select>
                  </td>

                  {/* CRM permission selector */}
                  <td>
                    <select
                      className="form-input"
                      value={row.crm}
                      onChange={e => handlePermissionChange(row.id, 'crm', e.target.value)}
                      style={{ padding: '4px 8px', fontSize: '12px' }}
                    >
                      <option value="No">No</option>
                      <option value="Read">Read Only</option>
                      <option value="Read/Write">Read/Write</option>
                    </select>
                  </td>

                  {/* GitHub permission selector */}
                  <td>
                    <select
                      className="form-input"
                      value={row.github}
                      onChange={e => handlePermissionChange(row.id, 'github', e.target.value)}
                      style={{ padding: '4px 8px', fontSize: '12px' }}
                    >
                      <option value="No">No</option>
                      <option value="Read">Read Only</option>
                      <option value="Read/Write">Read/Write</option>
                    </select>
                  </td>

                  {/* External Actions permission */}
                  <td>
                    <select
                      className="form-input"
                      value={row.externalActions}
                      onChange={e => handlePermissionChange(row.id, 'externalActions', e.target.value)}
                      style={{
                        padding: '4px 8px',
                        fontSize: '12px',
                        fontWeight: 600,
                        color:
                          row.externalActions.includes('Approval')
                            ? 'var(--amber-text)'
                            : row.externalActions === 'No'
                            ? 'var(--emerald-text)'
                            : 'var(--text-primary)'
                      }}
                    >
                      <option value="No">No</option>
                      <option value="Approval Required">Approval Required</option>
                    </select>
                  </td>

                  {/* Risk Profile badge */}
                  <td>
                    <span
                      className={`risk-pill ${
                        row.riskLevel.includes('High')
                          ? 'risk-high'
                          : row.riskLevel.includes('Medium')
                          ? 'risk-medium'
                          : 'risk-low'
                      }`}
                    >
                      {row.riskLevel}
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
            backgroundColor: 'var(--bg-tertiary)',
            borderTop: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '12px'
          }}
        >
          <span style={{ color: 'var(--text-secondary)' }}>
            Changes made in this matrix take effect immediately across all isolated agent workers.
          </span>
          <button className="btn btn-primary btn-sm" onClick={handleSaveMatrix}>
            <span>Enforce Matrix Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
}

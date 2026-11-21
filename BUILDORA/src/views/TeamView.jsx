import React from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import {
  Users,
  UserPlus,
  ShieldCheck,
  Mail,
  Lock,
  ArrowRight
} from 'lucide-react';

export default function TeamView() {
  const { teamMembers, setActiveView, showToast } = useWorkspace();

  return (
    <div className="view-container">
      <div className="view-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="badge badge-emerald">4 Active Seats</span>
            <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>Growth Pro Plan (Up to 15 seats)</span>
          </div>
          <h1 className="view-title">Team Members</h1>
          <p className="view-subtitle">Manage startup team members, authentication posture, and access credentials.</p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setActiveView('permissions')}
          >
            <ShieldCheck size={14} />
            <span>Roles & Permissions Matrix</span>
          </button>

          <button
            className="btn btn-primary btn-sm"
            onClick={() => showToast('Team invite modal opened. Link copied to clipboard.', 'success')}
          >
            <UserPlus size={14} />
            <span>+ Invite Member</span>
          </button>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title">Active Workspace Members</span>
          <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>100% MFA Enforced</span>
        </div>

        <div className="table-container" style={{ border: 'none', borderRadius: 0 }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Member</th>
                <th>Role</th>
                <th>MFA Status</th>
                <th>Primary Agent Access</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {teamMembers.map(member => (
                <tr key={member.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '50%',
                          backgroundColor: 'var(--primary)',
                          color: '#fff',
                          fontSize: '12px',
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
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{member.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-indigo">{member.role}</span>
                  </td>
                  <td>
                    <span className="badge badge-emerald">
                      <ShieldCheck size={12} />
                      Enforced (Hardware Key)
                    </span>
                  </td>
                  <td style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    {member.permissions}
                  </td>
                  <td>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => setActiveView('permissions')}
                      style={{ fontSize: '11px', padding: '3px 8px' }}
                    >
                      Configure Scope
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

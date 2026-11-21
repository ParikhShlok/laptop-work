import React, { useState } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import {
  CheckSquare,
  Square,
  Plus,
  Filter,
  Bot,
  Video,
  User,
  Calendar,
  Sparkles,
  CheckCircle2,
  X
} from 'lucide-react';

export default function TasksView() {
  const { tasks, toggleTask, addTask, showToast } = useWorkspace();
  const [activeTab, setActiveTab] = useState('all'); // all, my, team, ai, completed
  const [newTaskModal, setNewTaskModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newAssignee, setNewAssignee] = useState('Alex Rivera');
  const [newDue, setNewDue] = useState('Oct 15, 2026');
  const [newPriority, setNewPriority] = useState('Medium');

  const filteredTasks = tasks.filter(task => {
    if (activeTab === 'completed') return task.completed;
    if (activeTab === 'my') return !task.completed && task.assignee === 'Alex Rivera';
    if (activeTab === 'team') return !task.completed && task.assignee !== 'Alex Rivera';
    if (activeTab === 'ai') return !task.completed && task.originType !== 'user';
    return !task.completed; // 'all' active tasks
  });

  const handleCreateTask = () => {
    if (!newTitle.trim()) return;
    addTask({
      title: newTitle,
      assignee: newAssignee,
      assigneeRole: 'Team',
      due: newDue,
      priority: newPriority,
      category: 'General'
    });
    setNewTitle('');
    setNewTaskModal(false);
  };

  return (
    <div className="view-container">
      {/* Header */}
      <div className="view-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="badge badge-blue">Action Execution</span>
            <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>Unified Human & Agent Tasks</span>
          </div>
          <h1 className="view-title">Tasks</h1>
          <p className="view-subtitle">Action items synthesized from strategy meetings, sales research, and founder notes.</p>
        </div>

        <button className="btn btn-primary btn-sm" onClick={() => setNewTaskModal(true)}>
          <Plus size={14} />
          <span>New Task</span>
        </button>
      </div>

      {/* Tabs Filter Bar */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        {[
          { id: 'all', label: `Active Tasks (${tasks.filter(t => !t.completed).length})` },
          { id: 'my', label: 'My Tasks' },
          { id: 'team', label: 'Team Tasks' },
          { id: 'ai', label: 'AI Created' },
          { id: 'completed', label: `Completed (${tasks.filter(t => t.completed).length})` }
        ].map(tab => (
          <button
            key={tab.id}
            className={`btn btn-sm ${activeTab === tab.id ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tasks List */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">Task Pipeline</span>
          <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Click checkbox to complete</span>
        </div>

        <div style={{ padding: '4px 0' }}>
          {filteredTasks.length === 0 ? (
            <div style={{ padding: '36px', textAlign: 'center', color: 'var(--text-tertiary)' }}>
              No tasks found in this view.
            </div>
          ) : (
            filteredTasks.map(task => (
              <div
                key={task.id}
                style={{
                  padding: '14px 20px',
                  borderBottom: '1px solid var(--border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '16px',
                  backgroundColor: task.completed ? 'var(--bg-tertiary)' : 'var(--bg-secondary)',
                  opacity: task.completed ? 0.75 : 1,
                  transition: 'background-color 0.12s ease'
                }}
              >
                {/* Left: Checkbox + Title */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1 }}>
                  <button
                    onClick={() => toggleTask(task.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: task.completed ? '#059669' : 'var(--text-tertiary)',
                      display: 'flex',
                      alignItems: 'center',
                      padding: 0
                    }}
                  >
                    {task.completed ? <CheckSquare size={18} /> : <Square size={18} />}
                  </button>

                  <div>
                    <div
                      style={{
                        fontSize: '14px',
                        fontWeight: 600,
                        color: task.completed ? 'var(--text-tertiary)' : 'var(--text-primary)',
                        textDecoration: task.completed ? 'line-through' : 'none'
                      }}
                    >
                      {task.title}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '3px', fontSize: '11px', color: 'var(--text-tertiary)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Bot size={11} color="var(--primary)" />
                        Origin: <strong>{task.origin}</strong>
                      </span>
                      <span>•</span>
                      <span>{task.notes}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Assignee, Due, Priority */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
                    <div
                      style={{
                        width: '22px',
                        height: '22px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--bg-tertiary)',
                        border: '1px solid var(--border)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '10px',
                        fontWeight: 700
                      }}
                    >
                      {task.assignee.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{task.assignee}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'var(--text-secondary)' }}>
                    <Calendar size={12} />
                    <span>{task.due}</span>
                  </div>

                  <span
                    className={`risk-pill ${
                      task.priority === 'Urgent'
                        ? 'risk-high'
                        : task.priority === 'High'
                        ? 'risk-medium'
                        : 'risk-low'
                    }`}
                    style={{ fontSize: '10px' }}
                  >
                    {task.priority}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* New Task Modal */}
      {newTaskModal && (
        <div className="modal-overlay" onClick={() => setNewTaskModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '480px' }}>
            <div className="modal-header">
              <span className="card-title">Create Workspace Task</span>
              <button
                onClick={() => setNewTaskModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)' }}
              >
                <X size={18} />
              </button>
            </div>

            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>
                  Task Title
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Schedule SOC2 readiness review with auditor..."
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>
                    Assignee
                  </label>
                  <select
                    className="form-input"
                    value={newAssignee}
                    onChange={e => setNewAssignee(e.target.value)}
                  >
                    <option value="Alex Rivera">Alex Rivera (Founder)</option>
                    <option value="Sarah Chen">Sarah Chen (Product)</option>
                    <option value="Rahul Patel">Rahul Patel (Engineering)</option>
                    <option value="Maya Lin">Maya Lin (Marketing)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>
                    Priority
                  </label>
                  <select
                    className="form-input"
                    value={newPriority}
                    onChange={e => setNewPriority(e.target.value)}
                  >
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>
                  Due Date
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={newDue}
                  onChange={e => setNewDue(e.target.value)}
                />
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary btn-sm" onClick={() => setNewTaskModal(false)}>
                Cancel
              </button>
              <button className="btn btn-primary btn-sm" onClick={handleCreateTask}>
                Add Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

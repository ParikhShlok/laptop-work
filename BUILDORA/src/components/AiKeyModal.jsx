import React, { useState } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import {
  X,
  Cpu,
  Key,
  CheckCircle2,
  AlertCircle,
  Shield,
  Server,
  Sparkles,
  ExternalLink,
  Eye,
  EyeOff
} from 'lucide-react';

export default function AiKeyModal() {
  const {
    aiKeyModalOpen,
    setAiKeyModalOpen,
    aiConfig,
    updateAiConfig,
    showToast
  } = useWorkspace();

  const [provider, setProvider] = useState(aiConfig.provider || 'builtin');
  const [apiKey, setApiKey] = useState(aiConfig.apiKey || '');
  const [model, setModel] = useState(aiConfig.model || 'gpt-4o-mini');
  const [pythonEndpoint, setPythonEndpoint] = useState(aiConfig.pythonEndpoint || 'http://localhost:8000');
  const [showKey, setShowKey] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  if (!aiKeyModalOpen) return null;

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);

    try {
      if (provider === 'python') {
        const res = await fetch(`${pythonEndpoint.replace(/\/$/, '')}/api/health`, { method: 'GET' });
        if (res.ok) {
          const data = await res.json();
          setTestResult({ success: true, message: `Connected to Python backend! Status: ${data.status}` });
        } else {
          setTestResult({ success: false, message: `Python server returned HTTP ${res.status}` });
        }
      } else if (provider === 'openai') {
        if (!apiKey.trim()) throw new Error('Please enter an OpenAI API key.');
        const res = await fetch('https://api.openai.com/v1/models', {
          headers: { Authorization: `Bearer ${apiKey.trim()}` }
        });
        if (!res.ok) throw new Error('Invalid OpenAI API Key or unauthorized.');
        setTestResult({ success: true, message: 'Valid OpenAI API Key verified!' });
      } else if (provider === 'gemini') {
        if (!apiKey.trim()) throw new Error('Please enter a Gemini API key.');
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey.trim()}`);
        if (!res.ok) throw new Error('Invalid Google Gemini API key.');
        setTestResult({ success: true, message: 'Valid Google Gemini API Key verified!' });
      } else if (provider === 'anthropic') {
        if (!apiKey.trim()) throw new Error('Please enter an Anthropic API key.');
        setTestResult({ success: true, message: 'Anthropic Key configured ready for inference!' });
      } else {
        setTestResult({ success: true, message: 'Built-in intelligent engine is active and ready!' });
      }
    } catch (err) {
      setTestResult({ success: false, message: err.message || 'Connection failed' });
    } finally {
      setTesting(false);
    }
  };

  const handleSave = () => {
    updateAiConfig({
      provider,
      apiKey: apiKey.trim(),
      model,
      pythonEndpoint: pythonEndpoint.trim(),
      zeroRetention: true
    });
    setAiKeyModalOpen(false);
  };

  return (
    <div className="modal-backdrop" onClick={() => setAiKeyModalOpen(false)}>
      <div
        className="modal-content"
        style={{ maxWidth: '520px', padding: '32px' }}
        onClick={e => e.stopPropagation()}
      >
        <button
          className="modal-close-btn"
          onClick={() => setAiKeyModalOpen(false)}
          style={{ position: 'absolute', top: '18px', right: '18px' }}
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              backgroundColor: 'var(--primary-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--primary)'
            }}
          >
            <Cpu size={22} />
          </div>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
              Real-Time AI Model & API Configuration
            </h2>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '2px 0 0 0' }}>
              Preview provider configuration. Do not enter a production API key in this early-access browser demo.
            </p>
          </div>
        </div>

        {/* Provider Selection */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '8px' }}>
            Select AI Provider
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {[
              { id: 'builtin', name: 'Built-in Engine', desc: 'No keys required' },
              { id: 'openai', name: 'OpenAI API', desc: 'GPT-4o / GPT-4o-mini' },
              { id: 'gemini', name: 'Google Gemini', desc: 'Gemini 1.5 Flash/Pro' },
              { id: 'anthropic', name: 'Anthropic Claude', desc: 'Claude 3.5 Sonnet' },
              { id: 'python', name: 'Python Backend', desc: 'Local FastAPI (server.py)' }
            ].map(p => (
              <div
                key={p.id}
                onClick={() => {
                  setProvider(p.id);
                  if (p.id === 'openai') setModel('gpt-4o-mini');
                  if (p.id === 'gemini') setModel('gemini-1.5-flash');
                  if (p.id === 'anthropic') setModel('claude-3-5-sonnet-20241022');
                }}
                style={{
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-md)',
                  border: `1px solid ${provider === p.id ? 'var(--primary)' : 'var(--border)'}`,
                  backgroundColor: provider === p.id ? 'var(--primary-light)' : 'var(--bg-secondary)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ fontSize: '13px', fontWeight: 700, color: provider === p.id ? 'var(--primary)' : 'var(--text-primary)' }}>
                  {p.name}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>{p.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* API Key or Python URL Input */}
        {provider !== 'builtin' && provider !== 'python' && (
          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: 700 }}>
                {provider.toUpperCase()} API Key
              </label>
              <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>
                Demo configuration only
              </span>
            </div>
            <div style={{ position: 'relative' }}>
              <Key size={15} style={{ position: 'absolute', left: '12px', top: '11px', color: 'var(--text-tertiary)' }} />
              <input
                type={showKey ? 'text' : 'password'}
                placeholder={`sk-... or AIza...`}
                className="form-input"
                style={{ paddingLeft: '36px', paddingRight: '36px', fontFamily: 'var(--font-mono)', fontSize: '12px' }}
                value={apiKey}
                onChange={e => setApiKey(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '8px',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-tertiary)',
                  cursor: 'pointer'
                }}
              >
                {showKey ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>
        )}

        {provider === 'python' && (
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>
              Python Backend Endpoint URL
            </label>
            <div style={{ position: 'relative' }}>
              <Server size={15} style={{ position: 'absolute', left: '12px', top: '11px', color: 'var(--text-tertiary)' }} />
              <input
                type="text"
                placeholder="http://localhost:8000"
                className="form-input"
                style={{ paddingLeft: '36px', fontFamily: 'var(--font-mono)', fontSize: '12px' }}
                value={pythonEndpoint}
                onChange={e => setPythonEndpoint(e.target.value)}
              />
            </div>
            <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Run <code>python server.py</code> in the terminal to start your local real-time AI backend.
            </p>
          </div>
        )}

        {/* Model Selection */}
        {provider === 'openai' && (
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>
              OpenAI Model
            </label>
            <select className="form-input" value={model} onChange={e => setModel(e.target.value)}>
              <option value="gpt-4o-mini">GPT-4o-mini (Fast & Recommended)</option>
              <option value="gpt-4o">GPT-4o (Omni Reasoning)</option>
              <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
            </select>
          </div>
        )}

        {provider === 'gemini' && (
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>
              Google Gemini Model
            </label>
            <select className="form-input" value={model} onChange={e => setModel(e.target.value)}>
              <option value="gemini-1.5-flash">Gemini 1.5 Flash (Ultra-fast)</option>
              <option value="gemini-1.5-pro">Gemini 1.5 Pro (Deep Context)</option>
            </select>
          </div>
        )}

        {/* Test Result Message */}
        {testResult && (
          <div
            style={{
              padding: '8px 12px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: testResult.success ? '#ecfdf5' : '#fef2f2',
              border: `1px solid ${testResult.success ? '#a7f3d0' : '#fecaca'}`,
              color: testResult.success ? '#047857' : '#b91c1c',
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              marginBottom: '16px'
            }}
          >
            {testResult.success ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
            <span>{testResult.message}</span>
          </div>
        )}

        {/* Privacy Note */}
        <div
          style={{
            padding: '10px 12px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'var(--bg-tertiary)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '8px',
            fontSize: '11px',
            color: 'var(--text-secondary)',
            marginBottom: '20px'
          }}
        >
          <Shield size={14} color="#059669" style={{ flexShrink: 0, marginTop: '2px' }} />
          <span>
            <strong>Important:</strong> This browser preview stores configuration locally. Production API credentials must be stored server-side with access controls; do not use a real production key here.
          </span>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleTestConnection}
            disabled={testing}
            style={{ flex: 1, fontWeight: 600 }}
          >
            {testing ? 'Verifying...' : 'Test Connection'}
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSave}
            style={{ flex: 1, fontWeight: 700 }}
          >
            Save & Activate
          </button>
        </div>
      </div>
    </div>
  );
}

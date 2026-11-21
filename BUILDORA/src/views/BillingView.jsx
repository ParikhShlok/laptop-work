import React, { useState } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import {
  CreditCard,
  Zap,
  TrendingUp,
  Clock,
  Shield,
  FileText,
  DollarSign,
  Users,
  HardDrive,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function BillingView() {
  const { workspace, openCheckout, showToast } = useWorkspace();
  const [currency, setCurrency] = useState('INR'); // INR (₹) or USD ($)

  return (
    <div className="view-container">
      {/* Header */}
      <div className="view-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="badge badge-emerald">Active Subscription</span>
            <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>14-Day Free Trial & Bullseye SaaS Billing</span>
          </div>
          <h1 className="view-title">Subscription & Usage</h1>
          <p className="view-subtitle">
            Manage your startup plan, monitor AI token consumption, and view transparent usage billing.
          </p>
        </div>

        {/* Currency Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ padding: '4px', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)', display: 'flex' }}>
            <button
              className={`btn btn-sm ${currency === 'INR' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setCurrency('INR')}
              style={{ padding: '3px 8px', fontSize: '11px' }}
            >
              INR (₹)
            </button>
            <button
              className={`btn btn-sm ${currency === 'USD' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setCurrency('USD')}
              style={{ padding: '3px 8px', fontSize: '11px' }}
            >
              USD ($)
            </button>
          </div>
        </div>
      </div>

      {/* Plan & Usage Summary Cards (Section 29 & 30) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '18px', marginBottom: '28px' }}>
        {/* Current Plan */}
        <div className="card" style={{ padding: '22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <span className="badge badge-blue">Current Plan</span>
            <span style={{ fontSize: '12px', color: '#059669', fontWeight: 600 }}>Active</span>
          </div>
          <h3 style={{ fontSize: '20px', fontWeight: 800, margin: '0 0 4px 0', color: 'var(--text-primary)' }}>
            Team Tier
          </h3>
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
            {currency === 'INR' ? '₹6,999/month' : '$79/month'} • Next renewal in 11 days
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => openCheckout({
                id: 'business',
                name: 'Business',
                price: currency === 'INR' ? 14999 : 179,
                interval: 'month'
              })}
              style={{ flex: 1, fontWeight: 700 }}
            >
              Upgrade Plan
            </button>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => showToast('Plan downgrade scheduled at period end.', 'info')}
            >
              Downgrade
            </button>
          </div>
        </div>

        {/* 14-Day Trial Meter */}
        <div className="card" style={{ padding: '22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <span className="badge badge-emerald">Free Trial Meter</span>
            <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>11 Days Left</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600 }}>AI Usage (Section 29)</span>
            <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--primary)' }}>72% Used</span>
          </div>
          {/* Progress bar */}
          <div style={{ width: '100%', height: '8px', borderRadius: '4px', backgroundColor: 'var(--bg-tertiary)', overflow: 'hidden', marginBottom: '12px' }}>
            <div style={{ width: '72%', height: '100%', backgroundColor: 'var(--primary)' }} />
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
            1,800,000 / 2,500,000 included monthly tokens consumed. No overage charges during trial.
          </div>
        </div>

        {/* AI Cost Tracker (Section 38) */}
        <div className="card" style={{ padding: '22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <span className="badge badge-purple">Cost Control (Sec 38)</span>
            <DollarSign size={16} color="#7c3aed" />
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px' }}>
            $18.42
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
            Total wholesale AI cost this month across 842 requests.
          </div>
          <div style={{ fontSize: '11px', color: '#059669', fontWeight: 600 }}>
            Most used: Research Agent (44% of compute)
          </div>
        </div>
      </div>

      {/* Usage Breakdown by Agent & Resource */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px', marginBottom: '28px' }}>
        {/* Agent Consumption Breakdown */}
        <div className="card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 16px 0', color: 'var(--text-primary)' }}>
            AI Consumption by Agent (Section 38)
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {[
              { agent: 'Research Agent', requests: 312, cost: '$8.10', tokens: '810k', percent: 44, color: '#7c3aed' },
              { agent: 'Sales Agent', requests: 245, cost: '$5.40', tokens: '540k', percent: 29, color: '#2563eb' },
              { agent: 'Meeting Agent', requests: 180, cost: '$3.22', tokens: '320k', percent: 18, color: '#059669' },
              { agent: 'Knowledge Agent', requests: 105, cost: '$1.70', tokens: '170k', percent: 9, color: '#d97706' }
            ].map((a, idx) => (
              <div key={idx}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{a.agent}</span>
                  <span style={{ color: 'var(--text-secondary)' }}>{a.requests} runs • {a.tokens} tokens • <strong>{a.cost}</strong></span>
                </div>
                <div style={{ width: '100%', height: '6px', borderRadius: '3px', backgroundColor: 'var(--bg-tertiary)', overflow: 'hidden' }}>
                  <div style={{ width: `${a.percent}%`, height: '100%', backgroundColor: a.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Gateways & Invoices */}
        <div className="card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 16px 0', color: 'var(--text-primary)' }}>
            Payment Gateways (Section 28)
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
            <div style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CreditCard size={18} color="var(--primary)" />
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700 }}>Razorpay India Gateway</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>UPI, NetBanking, RuPay & Cards</div>
                </div>
              </div>
              <span className="badge badge-emerald" style={{ fontSize: '10px' }}>Connected</span>
            </div>

            <div style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CreditCard size={18} color="#7c3aed" />
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700 }}>Stripe Global Gateway</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>USD, EUR, GBP International Cards</div>
                </div>
              </div>
              <span className="badge badge-emerald" style={{ fontSize: '10px' }}>Connected</span>
            </div>
          </div>

          <h4 style={{ fontSize: '14px', fontWeight: 700, margin: '0 0 10px 0', color: 'var(--text-primary)' }}>
            Recent Invoices
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
              <span>INV-2026-09 (Sep 1)</span>
              <span>₹6,999.00</span>
              <span style={{ color: '#059669', fontWeight: 600 }}>Paid</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
              <span>INV-2026-08 (Aug 1)</span>
              <span>₹6,999.00</span>
              <span style={{ color: '#059669', fontWeight: 600 }}>Paid</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

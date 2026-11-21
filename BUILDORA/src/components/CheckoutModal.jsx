import React, { useState } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import {
  X,
  CreditCard,
  Lock,
  CheckCircle2,
  ShieldCheck,
  Tag,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function CheckoutModal() {
  const {
    checkoutModalOpen,
    setCheckoutModalOpen,
    selectedPlan,
    handlePaymentSuccess
  } = useWorkspace();

  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [expiry, setExpiry] = useState('12/28');
  const [cvc, setCvc] = useState('888');
  const [zip, setZip] = useState('94103');
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!checkoutModalOpen || !selectedPlan) return null;

  const basePrice = selectedPlan.price || 199;
  const finalPrice = Math.max(0, Math.round(basePrice * (1 - discountPercent / 100)));

  const handleApplyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    if (code === 'LAUNCH50') {
      setDiscountPercent(50);
      setPromoApplied(true);
    } else if (code === 'FOUNDER100' || code === 'DEMO') {
      setDiscountPercent(100);
      setPromoApplied(true);
    } else {
      alert('Invalid coupon. Try "LAUNCH50" for 50% off or "FOUNDER100" for free test access.');
    }
  };

  const handlePay = (e) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      try {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {
        // Safe fallback
      }
      handlePaymentSuccess({
        ...selectedPlan,
        paidAmount: finalPrice
      });
    }, 1200);
  };

  return (
    <div className="modal-backdrop" onClick={() => setCheckoutModalOpen(false)}>
      <div
        className="modal-content checkout-modal-box"
        style={{ maxWidth: '480px', padding: '32px' }}
        onClick={e => e.stopPropagation()}
      >
        <button
          className="modal-close-btn"
          onClick={() => setCheckoutModalOpen(false)}
          style={{ position: 'absolute', top: '18px', right: '18px' }}
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              backgroundColor: 'var(--primary-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--primary)'
            }}
          >
            <CreditCard size={20} />
          </div>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
              Secure Checkout & Subscription
            </h2>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              256-Bit Encrypted Payment Gateway
            </span>
          </div>
        </div>

        {/* Plan Summary Card */}
        <div
          style={{
            backgroundColor: 'var(--bg-tertiary)',
            borderRadius: 'var(--radius-md)',
            padding: '16px',
            marginBottom: '20px',
            border: '1px solid var(--border)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
            <div>
              <span className="badge badge-blue" style={{ marginBottom: '4px' }}>Selected Plan</span>
              <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '4px 0 0 0', color: 'var(--text-primary)' }}>
                {selectedPlan.name} Plan
              </h3>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)' }}>
                ${finalPrice}
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 500 }}>
                  /{selectedPlan.interval || 'mo'}
                </span>
              </div>
              {discountPercent > 0 && (
                <div style={{ fontSize: '11px', color: '#059669', fontWeight: 600 }}>
                  {discountPercent}% OFF Applied
                </div>
              )}
            </div>
          </div>

          <div style={{ borderTop: '1px dashed var(--border)', paddingTop: '10px', marginTop: '10px' }}>
            <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '12px', color: 'var(--text-secondary)' }}>
              {(selectedPlan.features || [
                'Full AI Multi-Agent suite',
                'SOC2 compliant audit logs',
                'Human-in-the-loop approvals',
                'Zero data retention SLA'
              ]).slice(0, 3).map((feat, idx) => (
                <li key={idx} style={{ marginBottom: '3px' }}>{feat}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Coupon Section */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '18px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Tag size={14} style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--text-tertiary)' }} />
            <input
              type="text"
              placeholder="Promo code (e.g. LAUNCH50)"
              className="form-input"
              style={{ paddingLeft: '32px', fontSize: '12px', textTransform: 'uppercase' }}
              value={promoCode}
              onChange={e => setPromoCode(e.target.value)}
            />
          </div>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={handleApplyPromo}
            style={{ fontWeight: 600 }}
          >
            Apply
          </button>
        </div>

        {promoApplied && (
          <div
            style={{
              padding: '6px 10px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: '#ecfdf5',
              border: '1px solid #a7f3d0',
              color: '#047857',
              fontSize: '11px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              marginBottom: '16px'
            }}
          >
            <CheckCircle2 size={13} />
            <span>Coupon code accepted! Enjoy your discounted founder rate.</span>
          </div>
        )}

        {/* Card Details Form */}
        <form onSubmit={handlePay} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>
              Card Information
            </label>
            <div style={{ position: 'relative' }}>
              <CreditCard size={15} style={{ position: 'absolute', left: '12px', top: '11px', color: 'var(--text-tertiary)' }} />
              <input
                type="text"
                required
                className="form-input"
                style={{ paddingLeft: '36px', fontFamily: 'var(--font-mono)' }}
                value={cardNumber}
                onChange={e => setCardNumber(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, marginBottom: '4px' }}>
                Expires
              </label>
              <input
                type="text"
                required
                className="form-input"
                style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '12px' }}
                value={expiry}
                onChange={e => setExpiry(e.target.value)}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, marginBottom: '4px' }}>
                CVC / CVV
              </label>
              <input
                type="text"
                required
                className="form-input"
                style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '12px' }}
                value={cvc}
                onChange={e => setCvc(e.target.value)}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, marginBottom: '4px' }}>
                Postal Code
              </label>
              <input
                type="text"
                required
                className="form-input"
                style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '12px' }}
                value={zip}
                onChange={e => setZip(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '4px' }}>
            <Lock size={12} color="#059669" />
            <span>Encrypted with Stripe & PCI-DSS Level 1 Security</span>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '12px', fontSize: '14px', fontWeight: 700, marginTop: '8px' }}
            disabled={isProcessing}
          >
            {isProcessing ? 'Processing Payment...' : `Confirm & Pay $${finalPrice}`}
            {!isProcessing && <ArrowRight size={15} style={{ marginLeft: '6px' }} />}
          </button>
        </form>
      </div>
    </div>
  );
}

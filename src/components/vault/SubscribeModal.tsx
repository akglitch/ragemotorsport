'use client';
import { useState } from 'react';
import { X, Crown, Check, Lock, CreditCard, CalendarClock } from 'lucide-react';

interface Props {
  open: boolean;
  onClose: () => void;
  onSubscribed: () => void;
}

const PERKS = [
  'Unlock every exclusive Vault vehicle',
  'Early access to new arrivals before public listing',
  'Complimentary CARFAX history report on any car',
  'Priority concierge from our specialist team',
];

type Step = 'plan' | 'pay';

/**
 * Simulated Stripe subscription checkout for the Premium Vault membership.
 * No real charges — completing the flow calls onSubscribed() to flip the demo
 * user to premium. Dark + gold styling to match the Vault theme.
 */
export default function SubscribeModal({ open, onClose, onSubscribed }: Props) {
  const [step, setStep] = useState<Step>('plan');
  const [loading, setLoading] = useState(false);
  const [card, setCard] = useState({ number: '', name: '', expiry: '', cvv: '' });

  if (!open) return null;

  const formatCardNumber = (val: string) =>
    val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
  const formatExpiry = (val: string) =>
    val.replace(/\D/g, '').slice(0, 4).replace(/(.{2})/, '$1/');

  const reset = () => { setStep('plan'); setLoading(false); setCard({ number: '', name: '', expiry: '', cvv: '' }); };
  const handleClose = () => { reset(); onClose(); };

  const handleSubscribe = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      reset();
      onSubscribed();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Subscribe to Premium Vault">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={handleClose} />

      <div className="relative w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up vault-surface">
        {/* Header */}
        <div className="px-6 py-5 flex items-start justify-between border-b" style={{ borderColor: 'var(--vault-border)' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(var(--gold-rgb),0.14)', border: '1px solid var(--vault-border)' }}>
              <Crown size={20} style={{ color: 'var(--gold)' }} />
            </div>
            <div>
              <h2 className="text-lg font-bold" style={{ fontFamily: 'var(--font-jakarta)', color: '#f5f3ec' }}>Premium Vault</h2>
              <p className="text-xs" style={{ color: 'rgba(245,243,236,0.6)' }}>Exclusive access membership</p>
            </div>
          </div>
          <button onClick={handleClose} className="p-1.5 rounded-xl hover:bg-white/10 transition-colors" style={{ color: 'rgba(245,243,236,0.6)' }} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <div className="p-6">
          {step === 'plan' ? (
            <>
              {/* Price */}
              <div className="flex items-baseline gap-1.5 mb-1">
                <span className="text-4xl font-black" style={{ color: '#f5f3ec', fontFamily: 'var(--font-jakarta)' }}>$19.99</span>
                <span className="text-sm" style={{ color: 'rgba(245,243,236,0.6)' }}>/month</span>
              </div>
              <div className="inline-flex items-center gap-1.5 mb-5 px-2.5 py-1 rounded-md text-xs font-semibold badge-gold">
                <CalendarClock size={13} /> 7-day free trial — cancel anytime
              </div>

              <ul className="space-y-3 mb-6">
                {PERKS.map(p => (
                  <li key={p} className="flex items-start gap-3 text-sm" style={{ color: 'rgba(245,243,236,0.9)' }}>
                    <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center" style={{ background: 'rgba(var(--gold-rgb),0.15)' }}>
                      <Check size={12} style={{ color: 'var(--gold)' }} strokeWidth={3} />
                    </span>
                    {p}
                  </li>
                ))}
              </ul>

              <button onClick={() => setStep('pay')} className="btn-gold w-full justify-center py-3">
                Start Free Trial
              </button>
              <p className="text-center text-[11px] mt-3" style={{ color: 'rgba(245,243,236,0.45)' }}>
                <Lock size={10} className="inline mr-1" />
                Secured by Stripe — this is a demo, no real charges are made.
              </p>
            </>
          ) : (
            <>
              <p className="text-sm mb-4" style={{ color: 'rgba(245,243,236,0.8)' }}>
                You won&apos;t be charged until your 7-day trial ends. Then <strong style={{ color: '#f5f3ec' }}>$19.99/mo</strong>.
              </p>

              <div className="space-y-3 mb-5">
                <div className="relative">
                  <CreditCard size={14} className="absolute left-3 top-3.5" style={{ color: 'rgba(245,243,236,0.5)' }} />
                  <input
                    type="text" inputMode="numeric" placeholder="Card number"
                    value={card.number}
                    onChange={e => setCard({ ...card, number: formatCardNumber(e.target.value) })}
                    className="vault-input pl-9" maxLength={19} aria-label="Card number"
                  />
                </div>
                <input
                  type="text" placeholder="Name on card"
                  value={card.name}
                  onChange={e => setCard({ ...card, name: e.target.value })}
                  className="vault-input" aria-label="Name on card"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text" inputMode="numeric" placeholder="MM/YY"
                    value={card.expiry}
                    onChange={e => setCard({ ...card, expiry: formatExpiry(e.target.value) })}
                    className="vault-input" maxLength={5} aria-label="Expiry date"
                  />
                  <input
                    type="password" inputMode="numeric" placeholder="CVC"
                    value={card.cvv}
                    onChange={e => setCard({ ...card, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                    className="vault-input" maxLength={4} aria-label="CVC"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep('plan')} disabled={loading} className="flex-1 justify-center inline-flex items-center rounded-lg px-4 py-3 text-sm font-medium border transition-colors disabled:opacity-50" style={{ borderColor: 'var(--vault-border)', color: 'rgba(245,243,236,0.85)' }}>
                  Back
                </button>
                <button onClick={handleSubscribe} disabled={loading} className="btn-gold flex-1 justify-center py-3 disabled:opacity-70">
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-black/30 border-t-black/80 rounded-full animate-spin" />
                      Processing…
                    </span>
                  ) : (
                    <>Start Membership</>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

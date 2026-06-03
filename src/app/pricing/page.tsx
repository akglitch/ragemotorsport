'use client';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import BackToTop from '@/components/ui/BackToTop';
import { useUser } from '@/context/UserContext';
import { Check, X, Crown, Sparkles } from 'lucide-react';

const FEATURES: { label: string; free: boolean; premium: boolean }[] = [
  { label: 'Browse standard inventory', free: true, premium: true },
  { label: 'Save favorites & compare cars', free: true, premium: true },
  { label: 'WhatsApp checkout', free: true, premium: true },
  { label: 'Access to exclusive Vault vehicles', free: false, premium: true },
  { label: 'Early alerts on new arrivals', free: false, premium: true },
  { label: 'Complimentary CARFAX history report', free: false, premium: true },
  { label: 'Priority concierge support', free: false, premium: true },
];

function Cell({ on }: { on: boolean }) {
  return on
    ? <Check size={18} className="text-emerald-500 mx-auto" strokeWidth={2.5} />
    : <X size={18} className="mx-auto" style={{ color: 'var(--muted)' }} />;
}

export default function PricingPage() {
  const { isPremium, hydrated, openSubscribe, setPremium } = useUser();
  const premium = hydrated && isPremium;

  return (
    <>
      <Navbar />
      <main className="flex-grow pt-16 bg-[var(--bg)]" aria-label="Pricing">
        <div className="max-w-5xl mx-auto px-4 py-16">
          {/* Header */}
          <div className="text-center mb-14">
            <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.25em]" style={{ color: 'var(--gold)' }}>
              <Sparkles size={14} /> Membership
            </span>
            <h1 className="display text-4xl md:text-5xl font-semibold tracking-tight mt-3 mb-4" style={{ color: 'var(--text)' }}>
              Unlock the full collection
            </h1>
            <p className="text-lg max-w-xl mx-auto" style={{ color: 'var(--muted)' }}>
              Go Premium to access our exclusive Vault — the rarest vehicles we offer — plus early alerts and free history reports.
            </p>
          </div>

          {/* Plan cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            {/* Free */}
            <div className="rounded-2xl p-8" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
              <h2 className="text-lg font-bold mb-1" style={{ color: 'var(--text)', fontFamily: 'var(--font-jakarta)' }}>Free</h2>
              <p className="text-sm mb-5" style={{ color: 'var(--muted)' }}>Everything you need to browse and buy standard cars.</p>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-black" style={{ color: 'var(--text)', fontFamily: 'var(--font-jakarta)' }}>$0</span>
                <span className="text-sm" style={{ color: 'var(--muted)' }}>/forever</span>
              </div>
              {premium ? (
                <button onClick={() => setPremium(false)} className="btn-outline w-full justify-center py-3 text-sm">
                  Switch to Free
                </button>
              ) : (
                <div className="w-full text-center py-3 rounded-lg text-sm font-semibold" style={{ background: 'var(--surface-2)', color: 'var(--muted)' }}>
                  Your current plan
                </div>
              )}
            </div>

            {/* Premium */}
            <div className="rounded-2xl p-8 relative overflow-hidden vault-surface">
              <span className="absolute top-5 right-5 inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold badge-gold">
                <Crown size={12} /> Most popular
              </span>
              <h2 className="text-lg font-bold mb-1" style={{ color: '#f5f3ec', fontFamily: 'var(--font-jakarta)' }}>Premium Vault</h2>
              <p className="text-sm mb-5" style={{ color: 'rgba(245,243,236,0.65)' }}>Full access to exclusive vehicles and member perks.</p>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-4xl font-black" style={{ color: '#f5f3ec', fontFamily: 'var(--font-jakarta)' }}>$19.99</span>
                <span className="text-sm" style={{ color: 'rgba(245,243,236,0.65)' }}>/month</span>
              </div>
              <p className="text-xs mb-6" style={{ color: 'var(--gold)' }}>7-day free trial · cancel anytime</p>
              {premium ? (
                <div className="w-full text-center py-3 rounded-lg text-sm font-semibold inline-flex items-center justify-center gap-2" style={{ background: 'rgba(var(--gold-rgb),0.15)', color: 'var(--gold)', border: '1px solid var(--vault-border)' }}>
                  <Crown size={15} /> Active membership
                </div>
              ) : (
                <button onClick={openSubscribe} className="btn-gold w-full justify-center py-3">
                  <Crown size={16} /> Start Free Trial
                </button>
              )}
            </div>
          </div>

          {/* Comparison table */}
          <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: 'var(--surface-2)' }}>
                  <th className="text-left font-semibold px-6 py-4" style={{ color: 'var(--text)' }}>What&apos;s included</th>
                  <th className="font-semibold px-4 py-4 w-28" style={{ color: 'var(--text)' }}>Free</th>
                  <th className="font-semibold px-4 py-4 w-28" style={{ color: 'var(--gold)' }}>
                    <span className="inline-flex items-center gap-1 justify-center"><Crown size={13} /> Premium</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {FEATURES.map((f, i) => (
                  <tr key={f.label} style={{ background: i % 2 ? 'var(--surface)' : 'transparent', borderTop: '1px solid var(--border)' }}>
                    <td className="px-6 py-4" style={{ color: 'var(--text)' }}>{f.label}</td>
                    <td className="px-4 py-4 text-center"><Cell on={f.free} /></td>
                    <td className="px-4 py-4 text-center"><Cell on={f.premium} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Bottom CTA */}
          {!premium && (
            <div className="text-center mt-12">
              <button onClick={openSubscribe} className="btn-gold px-8 py-3.5">
                <Crown size={18} /> Start your 7-day free trial
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}

'use client';
import { Truck, ShieldCheck, BadgeCheck } from 'lucide-react';
import { Car } from '@/lib/types';
import { formatPrice, estimateShipping } from '@/lib/utils';

export default function PriceSummary({ car }: { car: Car }) {
  const shipping = estimateShipping(car.price);
  const total = car.price + shipping;

  return (
    <section
      className="rounded-2xl p-6"
      style={{ background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--card-shadow)' }}
      aria-label="Price and shipping summary"
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'var(--ink)' }}>
          <Truck size={18} className="text-white" />
        </div>
        <h3 className="font-bold text-lg" style={{ color: 'var(--text)', fontFamily: 'var(--font-jakarta)' }}>
          Buy &amp; Ship
        </h3>
      </div>

      <p className="text-sm mb-5 leading-relaxed" style={{ color: 'var(--muted)' }}>
        Pay in full and we deliver it to your door — no financing, no hidden fees.
      </p>

      <div className="rounded-xl p-4 space-y-3" style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
        <div className="flex justify-between text-sm">
          <span style={{ color: 'var(--muted)' }}>Vehicle price</span>
          <span className="font-medium" style={{ color: 'var(--text)' }}>{formatPrice(car.price)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span style={{ color: 'var(--muted)' }}>Shipping &amp; delivery</span>
          <span className="font-medium" style={{ color: 'var(--text)' }}>{formatPrice(shipping)}</span>
        </div>
        <div className="h-px" style={{ background: 'var(--border)' }} />
        <div className="flex justify-between items-center">
          <span className="font-bold" style={{ color: 'var(--text)' }}>Total</span>
          <span className="text-2xl font-black" style={{ color: 'var(--text)', fontFamily: 'var(--font-jakarta)' }}>
            {formatPrice(total)}
          </span>
        </div>
      </div>

      <div className="mt-5 space-y-2.5">
        {[
          { icon: <ShieldCheck size={15} />, text: '2-year warranty included' },
          { icon: <BadgeCheck size={15} />, text: '150-point inspection passed' },
          { icon: <Truck size={15} />, text: 'Enclosed transport, fully insured' },
        ].map(f => (
          <div key={f.text} className="flex items-center gap-2.5 text-sm" style={{ color: 'var(--text)' }}>
            <span className="text-emerald-500">{f.icon}</span>
            {f.text}
          </div>
        ))}
      </div>

      <p className="text-xs mt-4" style={{ color: 'var(--muted)' }}>
        * Estimated shipping. Final cost is confirmed at checkout based on your delivery address.
      </p>
    </section>
  );
}

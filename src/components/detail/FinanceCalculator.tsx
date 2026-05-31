'use client';
import { useState, useEffect } from 'react';
import { Calculator, DollarSign } from 'lucide-react';
import { calcMonthlyPayment, formatPrice } from '@/lib/utils';

interface Props {
  carPrice: number;
}

export default function FinanceCalculator({ carPrice }: Props) {
  const [downPayment, setDownPayment] = useState(Math.round(carPrice * 0.2));
  const [rate, setRate] = useState(5.9);
  const [term, setTerm] = useState(60);
  const [monthly, setMonthly] = useState(0);

  useEffect(() => {
    setMonthly(calcMonthlyPayment(carPrice, downPayment, rate, term));
  }, [carPrice, downPayment, rate, term]);

  const loanAmount = carPrice - downPayment;
  const totalPaid = monthly * term;
  const totalInterest = totalPaid - loanAmount;

  return (
    <section
      className="rounded-2xl p-6"
      style={{ background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--card-shadow)' }}
      aria-label="Finance calculator"
    >
      <div className="flex items-center gap-2 mb-5">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-dark))' }}
        >
          <Calculator size={18} className="text-white" />
        </div>
        <h3 className="font-bold text-lg" style={{ color: 'var(--text)', fontFamily: 'var(--font-jakarta)' }}>
          Finance Calculator
        </h3>
      </div>

      {/* Monthly payment hero */}
      <div
        className="rounded-xl p-5 mb-5 text-center"
        style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-dark))' }}
      >
        <p className="text-white/80 text-sm mb-1">Estimated Monthly Payment</p>
        <p className="text-4xl font-black text-white" style={{ fontFamily: 'var(--font-jakarta)' }}>
          {formatPrice(monthly)}<span className="text-xl font-normal">/mo</span>
        </p>
        <p className="text-white/70 text-xs mt-1">Based on {term} months at {rate}% APR</p>
      </div>

      <div className="space-y-4">
        {/* Down Payment */}
        <div>
          <div className="flex justify-between text-sm mb-1.5">
            <label className="font-medium" style={{ color: 'var(--text)' }}>Down Payment</label>
            <span className="font-bold" style={{ color: 'var(--accent)' }}>{formatPrice(downPayment)}</span>
          </div>
          <input
            type="range"
            min={0}
            max={carPrice}
            step={500}
            value={downPayment}
            onChange={e => setDownPayment(Number(e.target.value))}
            className="w-full"
            aria-label="Down payment amount"
          />
          <div className="flex justify-between text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
            <span>$0</span>
            <span>{formatPrice(carPrice)}</span>
          </div>
        </div>

        {/* Interest Rate */}
        <div>
          <div className="flex justify-between text-sm mb-1.5">
            <label className="font-medium" style={{ color: 'var(--text)' }}>Annual Interest Rate</label>
            <span className="font-bold" style={{ color: 'var(--accent)' }}>{rate.toFixed(1)}%</span>
          </div>
          <input
            type="range"
            min={1}
            max={20}
            step={0.1}
            value={rate}
            onChange={e => setRate(Number(e.target.value))}
            className="w-full"
            aria-label="Interest rate"
          />
          <div className="flex justify-between text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
            <span>1%</span>
            <span>20%</span>
          </div>
        </div>

        {/* Loan Term */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text)' }}>Loan Term</label>
          <div className="flex gap-2">
            {[24, 36, 48, 60, 72].map(t => (
              <button
                key={t}
                onClick={() => setTerm(t)}
                className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all`}
                style={{
                  background: term === t ? 'var(--accent)' : 'transparent',
                  borderColor: term === t ? 'var(--accent)' : 'var(--border)',
                  color: term === t ? 'white' : 'var(--text)',
                }}
                aria-pressed={term === t}
              >
                {t}mo
              </button>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div
          className="rounded-xl p-4 space-y-2"
          style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}
        >
          {[
            { label: 'Vehicle Price', value: formatPrice(carPrice) },
            { label: 'Down Payment', value: `- ${formatPrice(downPayment)}` },
            { label: 'Loan Amount', value: formatPrice(loanAmount) },
            { label: 'Total Interest', value: formatPrice(Math.max(0, totalInterest)) },
            { label: 'Total Cost', value: formatPrice(totalPaid + downPayment), bold: true },
          ].map(row => (
            <div key={row.label} className="flex justify-between text-sm">
              <span style={{ color: 'var(--muted)' }}>{row.label}</span>
              <span
                className={row.bold ? 'font-bold' : 'font-medium'}
                style={{ color: row.bold ? 'var(--accent)' : 'var(--text)' }}
              >
                {row.value}
              </span>
            </div>
          ))}
        </div>

        <p className="text-xs text-center" style={{ color: 'var(--muted)' }}>
          * Estimates only. Actual rates depend on credit score and lender.
        </p>
      </div>
    </section>
  );
}

'use client';
import { useState } from 'react';
import { X, CreditCard, User, Mail, Phone, MapPin, Lock, CheckCircle, ShieldCheck } from 'lucide-react';
import { Car } from '@/lib/types';
import { formatPrice, estimateShipping } from '@/lib/utils';
import Image from 'next/image';

interface Props {
  car: Car;
  onClose: () => void;
}

type Step = 'info' | 'payment' | 'confirm';

export default function CheckoutModal({ car, onClose }: Props) {
  const [step, setStep] = useState<Step>('info');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const [buyer, setBuyer] = useState({ name: '', email: '', phone: '', address: '', city: '', zip: '' });
  const [card, setCard] = useState({ number: '', name: '', expiry: '', cvv: '' });

  const shipping = estimateShipping(car.price);
  const total = car.price + shipping;

  const formatCardNumber = (val: string) =>
    val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();

  const formatExpiry = (val: string) =>
    val.replace(/\D/g, '').slice(0, 4).replace(/(.{2})/, '$1/');

  const handleConfirm = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); setDone(true); }, 1800);
  };

  const steps: { id: Step; label: string }[] = [
    { id: 'info', label: 'Your Info' },
    { id: 'payment', label: 'Payment' },
    { id: 'confirm', label: 'Confirm' },
  ];

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Purchase vehicle">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up" style={{ background: 'var(--surface)' }}>
        {/* Header */}
        <div className="px-6 py-4 flex items-center justify-between border-b" style={{ borderColor: 'var(--border)', background: 'linear-gradient(135deg, #0f172a, #1e293b)' }}>
          <div>
            <h2 className="text-lg font-bold text-white" style={{ fontFamily: 'var(--font-jakarta)' }}>
              Purchase Vehicle
            </h2>
            <p className="text-xs text-slate-400">Secure checkout — SSL encrypted</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-white/10 text-white/60 hover:text-white transition-colors" aria-label="Close checkout">
            <X size={18} />
          </button>
        </div>

        {/* Step progress */}
        {!done && (
          <div className="px-6 pt-4 pb-2">
            <div className="flex items-center gap-2">
              {steps.map((s, i) => (
                <div key={s.id} className="flex items-center gap-2 flex-1">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all ${step === s.id ? 'text-white scale-110' : steps.indexOf({ id: step, label: '' } as never) > i ? 'bg-emerald-500 text-white' : 'text-gray-400'}`}
                    style={{ background: step === s.id ? 'var(--accent)' : undefined, border: step === s.id ? 'none' : '2px solid var(--border)' }}>
                    {i + 1}
                  </div>
                  <span className="text-xs font-medium hidden sm:block" style={{ color: step === s.id ? 'var(--accent)' : 'var(--muted)' }}>
                    {s.label}
                  </span>
                  {i < steps.length - 1 && <div className="h-px flex-1" style={{ background: 'var(--border)' }} />}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {done ? (
            <div className="text-center py-6">
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(16,185,129,0.1)' }}>
                <CheckCircle size={40} className="text-emerald-500" />
              </div>
              <h3 className="text-2xl font-black mb-2" style={{ color: 'var(--text)', fontFamily: 'var(--font-jakarta)' }}>Purchase Complete!</h3>
              <p className="text-sm mb-2" style={{ color: 'var(--muted)' }}>
                Congratulations on your new <strong>{car.year} {car.make} {car.model}</strong>!
              </p>
              <p className="text-sm mb-6" style={{ color: 'var(--muted)' }}>
                A confirmation email has been sent to <strong>{buyer.email || 'your inbox'}</strong>.
              </p>
              <div className="flex items-center justify-center gap-2 mb-6">
                <ShieldCheck size={16} className="text-blue-500" />
                <span className="text-xs text-blue-500 font-medium">2-Year Warranty Included</span>
              </div>
              <button onClick={onClose} className="btn-primary justify-center">Done</button>
            </div>
          ) : (
            <>
              {/* Car summary */}
              <div className="flex items-center gap-4 p-4 rounded-xl mb-5" style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
                <div className="relative w-20 h-14 rounded-lg overflow-hidden flex-shrink-0">
                  <Image src={car.image} alt={`${car.make} ${car.model}`} fill className="object-cover" sizes="80px" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm truncate" style={{ color: 'var(--text)' }}>{car.year} {car.make} {car.model}</p>
                  <p className="text-xs" style={{ color: 'var(--muted)' }}>{car.condition} · {car.transmission} · {car.fuelType}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-lg font-black" style={{ color: 'var(--accent)' }}>{formatPrice(car.price)}</p>
                </div>
              </div>

              {/* Step: Buyer Info */}
              {step === 'info' && (
                <div className="space-y-3">
                  <h3 className="font-bold text-sm mb-3" style={{ color: 'var(--text)' }}>Your Information</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="relative">
                      <User size={14} className="absolute left-3 top-3.5" style={{ color: 'var(--muted)' }} />
                      <input required type="text" placeholder="Full name" value={buyer.name} onChange={e => setBuyer({ ...buyer, name: e.target.value })} className="input-field pl-9 text-sm" aria-label="Full name" />
                    </div>
                    <div className="relative">
                      <Mail size={14} className="absolute left-3 top-3.5" style={{ color: 'var(--muted)' }} />
                      <input required type="email" placeholder="Email" value={buyer.email} onChange={e => setBuyer({ ...buyer, email: e.target.value })} className="input-field pl-9 text-sm" aria-label="Email address" />
                    </div>
                    <div className="relative">
                      <Phone size={14} className="absolute left-3 top-3.5" style={{ color: 'var(--muted)' }} />
                      <input type="tel" placeholder="Phone number" value={buyer.phone} onChange={e => setBuyer({ ...buyer, phone: e.target.value })} className="input-field pl-9 text-sm" aria-label="Phone number" />
                    </div>
                    <div className="relative">
                      <MapPin size={14} className="absolute left-3 top-3.5" style={{ color: 'var(--muted)' }} />
                      <input required type="text" placeholder="ZIP code" value={buyer.zip} onChange={e => setBuyer({ ...buyer, zip: e.target.value })} className="input-field pl-9 text-sm" aria-label="ZIP code" />
                    </div>
                  </div>
                  <div className="relative">
                    <MapPin size={14} className="absolute left-3 top-3.5" style={{ color: 'var(--muted)' }} />
                    <input required type="text" placeholder="Delivery address" value={buyer.address} onChange={e => setBuyer({ ...buyer, address: e.target.value })} className="input-field pl-9 text-sm" aria-label="Delivery address" />
                  </div>
                  <button
                    onClick={() => setStep('payment')}
                    disabled={!buyer.name || !buyer.email || !buyer.address}
                    className="btn-primary w-full justify-center mt-2 disabled:opacity-50"
                  >
                    Continue to Payment
                  </button>
                </div>
              )}

              {/* Step: Payment */}
              {step === 'payment' && (
                <div className="space-y-3">
                  <h3 className="font-bold text-sm mb-3" style={{ color: 'var(--text)' }}>Payment Details</h3>

                  {/* Card mockup */}
                  <div className="relative h-44 rounded-2xl overflow-hidden p-5 mb-4"
                    style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #312e81 50%, #0f172a 100%)' }}>
                    <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-10" style={{ background: 'white', transform: 'translate(30%, -30%)' }} />
                    <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full opacity-10" style={{ background: 'white', transform: 'translate(-20%, 20%)' }} />
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-10 h-7 rounded-md bg-yellow-400/80" style={{ background: 'linear-gradient(135deg, #fbbf24, #f59e0b)' }} />
                      <span className="text-white/60 text-xs font-medium">VISA</span>
                    </div>
                    <p className="text-white font-mono text-lg tracking-[0.2em] mb-3">
                      {card.number || '•••• •••• •••• ••••'}
                    </p>
                    <div className="flex justify-between">
                      <div>
                        <p className="text-white/50 text-xs mb-0.5">CARD HOLDER</p>
                        <p className="text-white text-sm font-medium">{card.name || 'YOUR NAME'}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white/50 text-xs mb-0.5">EXPIRES</p>
                        <p className="text-white text-sm font-medium">{card.expiry || 'MM/YY'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="relative">
                    <CreditCard size={14} className="absolute left-3 top-3.5" style={{ color: 'var(--muted)' }} />
                    <input
                      type="text"
                      placeholder="Card number"
                      value={card.number}
                      onChange={e => setCard({ ...card, number: formatCardNumber(e.target.value) })}
                      className="input-field pl-9 text-sm font-mono"
                      maxLength={19}
                      aria-label="Card number"
                    />
                  </div>
                  <div className="relative">
                    <User size={14} className="absolute left-3 top-3.5" style={{ color: 'var(--muted)' }} />
                    <input
                      type="text"
                      placeholder="Cardholder name"
                      value={card.name}
                      onChange={e => setCard({ ...card, name: e.target.value.toUpperCase() })}
                      className="input-field pl-9 text-sm"
                      aria-label="Cardholder name"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="MM/YY"
                      value={card.expiry}
                      onChange={e => setCard({ ...card, expiry: formatExpiry(e.target.value) })}
                      className="input-field text-sm"
                      maxLength={5}
                      aria-label="Expiry date"
                    />
                    <div className="relative">
                      <Lock size={14} className="absolute left-3 top-3.5" style={{ color: 'var(--muted)' }} />
                      <input
                        type="password"
                        placeholder="CVV"
                        value={card.cvv}
                        onChange={e => setCard({ ...card, cvv: e.target.value.slice(0, 3) })}
                        className="input-field pl-9 text-sm"
                        maxLength={3}
                        aria-label="CVV"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 py-2 px-3 rounded-xl text-xs" style={{ background: 'rgba(16,185,129,0.08)', color: '#10b981' }}>
                    <Lock size={13} />
                    Your payment information is encrypted and secure. No actual charges are made.
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => setStep('info')} className="btn-outline flex-1 justify-center text-sm">Back</button>
                    <button onClick={() => setStep('confirm')} className="btn-primary flex-1 justify-center">Review Order</button>
                  </div>
                </div>
              )}

              {/* Step: Confirm */}
              {step === 'confirm' && (
                <div className="space-y-4">
                  <h3 className="font-bold text-sm mb-3" style={{ color: 'var(--text)' }}>Review Your Order</h3>
                  <div className="space-y-2 text-sm">
                    {[
                      ['Vehicle', `${car.year} ${car.make} ${car.model}`],
                      ['Condition', car.condition],
                      ['Buyer', buyer.name],
                      ['Email', buyer.email],
                      ['Delivery', buyer.address || 'N/A'],
                      ['Payment', `•••• ${card.number.slice(-4) || '••••'}`],
                    ].map(([label, value]) => (
                      <div key={label} className="flex justify-between py-1.5 border-b" style={{ borderColor: 'var(--border)' }}>
                        <span style={{ color: 'var(--muted)' }}>{label}</span>
                        <span className="font-medium" style={{ color: 'var(--text)' }}>{value}</span>
                      </div>
                    ))}
                    <div className="flex justify-between py-1.5">
                      <span style={{ color: 'var(--muted)' }}>Vehicle price</span>
                      <span className="font-medium" style={{ color: 'var(--text)' }}>{formatPrice(car.price)}</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b" style={{ borderColor: 'var(--border)' }}>
                      <span style={{ color: 'var(--muted)' }}>Shipping &amp; delivery</span>
                      <span className="font-medium" style={{ color: 'var(--text)' }}>{formatPrice(shipping)}</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="font-bold" style={{ color: 'var(--text)' }}>Total Due</span>
                      <span className="text-xl font-black" style={{ color: 'var(--accent)' }}>{formatPrice(total)}</span>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => setStep('payment')} className="btn-outline flex-1 justify-center text-sm">Back</button>
                    <button
                      onClick={handleConfirm}
                      disabled={loading}
                      className="btn-primary flex-1 justify-center disabled:opacity-70"
                    >
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Processing...
                        </span>
                      ) : (
                        <><Lock size={14} /> Confirm Purchase</>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

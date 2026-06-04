'use client';
import { useState } from 'react';
import { X, User, Mail, Phone, MapPin, MessageSquare, ShieldCheck, MessageCircle, Check } from 'lucide-react';
import { Car } from '@/lib/types';
import { formatPrice, estimateShipping, SAFETY_CERT_FEE, canCertify } from '@/lib/utils';
import { carOrderLink, OrderBuyer } from '@/lib/config';
import Image from 'next/image';

interface Props {
  car: Car;
  onClose: () => void;
}

type Step = 'info' | 'review';

export default function CheckoutModal({ car, onClose }: Props) {
  const [step, setStep] = useState<Step>('info');
  const [sent, setSent] = useState(false);

  const [buyer, setBuyer] = useState<OrderBuyer>({ name: '', email: '', phone: '', city: '', notes: '' });
  const [certified, setCertified] = useState(false);

  const certifiable = canCertify(car.condition);
  const certFee = certifiable && certified ? SAFETY_CERT_FEE : 0;
  const shipping = estimateShipping(car.price);
  const total = car.price + shipping + certFee;

  const handleSend = () => {
    const url = typeof window !== 'undefined' ? window.location.href : undefined;
    window.open(carOrderLink(car, buyer, { certified, url }), '_blank', 'noopener,noreferrer');
    setSent(true);
  };

  const steps: { id: Step; label: string }[] = [
    { id: 'info', label: 'Your Details' },
    { id: 'review', label: 'Review & Send' },
  ];

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Order vehicle">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up" style={{ background: 'var(--surface)' }}>
        {/* Header */}
        <div className="px-6 py-4 flex items-center justify-between border-b" style={{ borderColor: 'var(--border)', background: 'linear-gradient(135deg, #0f172a, #1e293b)' }}>
          <div>
            <h2 className="text-lg font-bold text-white" style={{ fontFamily: 'var(--font-jakarta)' }}>
              Order Vehicle
            </h2>
            <p className="text-xs text-slate-400">Complete your order securely on WhatsApp</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-white/10 text-white/60 hover:text-white transition-colors" aria-label="Close checkout">
            <X size={18} />
          </button>
        </div>

        {/* Step progress */}
        {!sent && (
          <div className="px-6 pt-4 pb-2">
            <div className="flex items-center gap-2">
              {steps.map((s, i) => (
                <div key={s.id} className="flex items-center gap-2 flex-1">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all ${step === s.id ? 'text-white scale-110' : ''}`}
                    style={{ background: step === s.id ? 'var(--accent)' : undefined, border: step === s.id ? 'none' : '2px solid var(--border)', color: step === s.id ? '#fff' : 'var(--muted)' }}>
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
          {sent ? (
            <div className="text-center py-6">
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(37,211,102,0.12)' }}>
                <MessageCircle size={40} style={{ color: '#25D366' }} />
              </div>
              <h3 className="text-2xl font-black mb-2" style={{ color: 'var(--text)', fontFamily: 'var(--font-jakarta)' }}>Order Sent!</h3>
              <p className="text-sm mb-2" style={{ color: 'var(--muted)' }}>
                Your order for the <strong>{car.year} {car.make} {car.model}</strong> has been opened in WhatsApp.
              </p>
              <p className="text-sm mb-6" style={{ color: 'var(--muted)' }}>
                Just hit send in the chat and our team will reply with payment &amp; delivery details.
              </p>
              <div className="flex items-center justify-center gap-2 mb-6">
                <ShieldCheck size={16} className="text-blue-500" />
                <span className="text-xs text-blue-500 font-medium">2-Year Warranty Included</span>
              </div>
              <div className="flex gap-3 justify-center">
                <button onClick={handleSend} className="btn-outline justify-center text-sm">Reopen WhatsApp</button>
                <button onClick={onClose} className="btn-primary justify-center">Done</button>
              </div>
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
                      <input type="text" placeholder="City" value={buyer.city} onChange={e => setBuyer({ ...buyer, city: e.target.value })} className="input-field pl-9 text-sm" aria-label="City" />
                    </div>
                  </div>
                  <div className="relative">
                    <MessageSquare size={14} className="absolute left-3 top-3.5" style={{ color: 'var(--muted)' }} />
                    <textarea placeholder="Notes for the seller (optional)" value={buyer.notes} onChange={e => setBuyer({ ...buyer, notes: e.target.value })} rows={2} className="input-field pl-9 text-sm resize-none" aria-label="Notes for the seller" />
                  </div>

                  {/* Safety certification (used cars only) */}
                  {certifiable && (
                    <div className="pt-1">
                      <h3 className="font-bold text-sm mb-2" style={{ color: 'var(--text)' }}>Safety Certification</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setCertified(true)}
                          aria-pressed={certified}
                          className="text-left p-3 rounded-xl border transition-all"
                          style={{ borderColor: certified ? 'var(--accent)' : 'var(--border)', background: certified ? 'rgba(var(--accent-rgb),0.06)' : 'var(--surface)', boxShadow: certified ? '0 0 0 1px var(--accent)' : 'none' }}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="flex items-center gap-1.5 font-semibold text-sm" style={{ color: 'var(--text)' }}>
                              <ShieldCheck size={15} className="text-emerald-500" /> Safety Certified
                            </span>
                            {certified && <Check size={15} style={{ color: 'var(--accent)' }} />}
                          </div>
                          <p className="text-xs mb-1" style={{ color: 'var(--muted)' }}>150-point inspection + certified warranty</p>
                          <p className="text-sm font-bold" style={{ color: 'var(--accent)' }}>+{formatPrice(SAFETY_CERT_FEE)}</p>
                        </button>

                        <button
                          type="button"
                          onClick={() => setCertified(false)}
                          aria-pressed={!certified}
                          className="text-left p-3 rounded-xl border transition-all"
                          style={{ borderColor: !certified ? 'var(--accent)' : 'var(--border)', background: !certified ? 'rgba(var(--accent-rgb),0.06)' : 'var(--surface)', boxShadow: !certified ? '0 0 0 1px var(--accent)' : 'none' }}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-semibold text-sm" style={{ color: 'var(--text)' }}>Buy As-Is</span>
                            {!certified && <Check size={15} style={{ color: 'var(--accent)' }} />}
                          </div>
                          <p className="text-xs mb-1" style={{ color: 'var(--muted)' }}>Sold as-is — inspect it yourself</p>
                          <p className="text-sm font-bold" style={{ color: 'var(--text)' }}>No extra cost</p>
                        </button>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => setStep('review')}
                    disabled={!buyer.name || !buyer.email}
                    className="btn-primary w-full justify-center mt-2 disabled:opacity-50"
                  >
                    Review Order
                  </button>
                </div>
              )}

              {/* Step: Review */}
              {step === 'review' && (
                <div className="space-y-4">
                  <h3 className="font-bold text-sm mb-3" style={{ color: 'var(--text)' }}>Review Your Order</h3>
                  <div className="space-y-2 text-sm">
                    {[
                      ['Vehicle', `${car.year} ${car.make} ${car.model}`],
                      ['Condition', car.condition],
                      ...(certifiable ? [['Certification', certified ? 'Safety Certified' : 'Buy as-is'] as [string, string]] : []),
                      ['Buyer', buyer.name],
                      ['Email', buyer.email],
                      ['Phone', buyer.phone || 'N/A'],
                      ['City', buyer.city || 'N/A'],
                    ].map(([label, value]) => (
                      <div key={label} className="flex justify-between py-1.5 border-b" style={{ borderColor: 'var(--border)' }}>
                        <span style={{ color: 'var(--muted)' }}>{label}</span>
                        <span className="font-medium text-right" style={{ color: 'var(--text)' }}>{value}</span>
                      </div>
                    ))}
                    <div className="flex justify-between py-1.5">
                      <span style={{ color: 'var(--muted)' }}>Vehicle price</span>
                      <span className="font-medium" style={{ color: 'var(--text)' }}>{formatPrice(car.price)}</span>
                    </div>
                    <div className={`flex justify-between py-1.5 ${certifiable && certified ? '' : 'border-b'}`} style={{ borderColor: 'var(--border)' }}>
                      <span style={{ color: 'var(--muted)' }}>Shipping &amp; delivery</span>
                      <span className="font-medium" style={{ color: 'var(--text)' }}>{formatPrice(shipping)}</span>
                    </div>
                    {certifiable && certified && (
                      <div className="flex justify-between py-1.5 border-b" style={{ borderColor: 'var(--border)' }}>
                        <span className="flex items-center gap-1.5" style={{ color: 'var(--muted)' }}>
                          <ShieldCheck size={13} className="text-emerald-500" /> Safety certification
                        </span>
                        <span className="font-medium" style={{ color: 'var(--text)' }}>{formatPrice(SAFETY_CERT_FEE)}</span>
                      </div>
                    )}
                    <div className="flex justify-between py-2">
                      <span className="font-bold" style={{ color: 'var(--text)' }}>Total Due</span>
                      <span className="text-xl font-black" style={{ color: 'var(--accent)' }}>{formatPrice(total)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 py-2 px-3 rounded-xl text-xs" style={{ background: 'rgba(37,211,102,0.08)', color: '#128C3E' }}>
                    <MessageCircle size={14} />
                    We&apos;ll send your order to our team on WhatsApp to arrange payment &amp; delivery.
                  </div>

                  <div className="flex gap-3">
                    <button onClick={() => setStep('info')} className="btn-outline flex-1 justify-center text-sm">Back</button>
                    <button
                      onClick={handleSend}
                      className="flex-1 justify-center inline-flex items-center gap-2 rounded-xl px-4 py-2.5 font-semibold text-white transition-transform hover:-translate-y-0.5"
                      style={{ background: '#25D366' }}
                    >
                      <MessageCircle size={16} /> Order on WhatsApp
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

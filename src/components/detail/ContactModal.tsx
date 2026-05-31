'use client';
import { useState } from 'react';
import { X, Send, User, Mail, Phone, MessageSquare, CheckCircle } from 'lucide-react';
import { Car } from '@/lib/types';

interface Props {
  car: Car;
  onClose: () => void;
}

export default function ContactModal({ car, onClose }: Props) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: `Hi, I'm interested in the ${car.year} ${car.make} ${car.model}. Is it still available?` });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); setSent(true); }, 1200);
  };

  return (
    <div
      className="fixed inset-0 z-[150] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Contact seller"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-md rounded-2xl p-6 shadow-2xl animate-fade-in-up"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl hover:bg-gray-100 transition-colors"
          aria-label="Close contact form"
        >
          <X size={18} style={{ color: 'var(--muted)' }} />
        </button>

        {sent ? (
          <div className="text-center py-6">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background: 'rgba(16,185,129,0.1)' }}
            >
              <CheckCircle size={32} className="text-emerald-500" />
            </div>
            <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text)', fontFamily: 'var(--font-jakarta)' }}>
              Message Sent!
            </h3>
            <p className="text-sm mb-6" style={{ color: 'var(--muted)' }}>
              {car.seller.name} will get back to you within 2 hours.
            </p>
            <button onClick={onClose} className="btn-primary justify-center">Close</button>
          </div>
        ) : (
          <>
            <h3 className="text-lg font-bold mb-1" style={{ color: 'var(--text)', fontFamily: 'var(--font-jakarta)' }}>
              Contact Seller
            </h3>
            <p className="text-sm mb-5" style={{ color: 'var(--muted)' }}>
              About: <span className="font-medium" style={{ color: 'var(--text)' }}>{car.year} {car.make} {car.model}</span>
            </p>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="relative">
                <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted)' }} />
                <input
                  required
                  type="text"
                  placeholder="Your full name"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="input-field pl-10"
                  aria-label="Your name"
                />
              </div>
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted)' }} />
                <input
                  required
                  type="email"
                  placeholder="Email address"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  className="input-field pl-10"
                  aria-label="Your email"
                />
              </div>
              <div className="relative">
                <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted)' }} />
                <input
                  type="tel"
                  placeholder="Phone number (optional)"
                  value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                  className="input-field pl-10"
                  aria-label="Your phone"
                />
              </div>
              <div className="relative">
                <MessageSquare size={15} className="absolute left-3 top-3" style={{ color: 'var(--muted)' }} />
                <textarea
                  required
                  placeholder="Your message..."
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  rows={3}
                  className="input-field pl-10 resize-none"
                  aria-label="Your message"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full justify-center disabled:opacity-70"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending...
                  </span>
                ) : (
                  <><Send size={15} /> Send Message</>
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

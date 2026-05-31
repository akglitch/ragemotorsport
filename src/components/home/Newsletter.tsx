'use client';
import { useState } from 'react';
import { Mail, ArrowRight, CheckCircle } from 'lucide-react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1000);
  };

  return (
    <section className="py-24 px-4 bg-gray-50" aria-label="Newsletter signup">
      <div className="max-w-[95rem] mx-auto px-6">
        <div className="bg-[#0a0e17] rounded-3xl p-12 lg:p-20 flex flex-col lg:flex-row items-center justify-between gap-12 overflow-hidden relative">

          <div className="lg:w-1/2 relative z-10">
            <h2 className="display text-3xl lg:text-5xl font-semibold text-white mb-4 tracking-tight leading-tight">
              Be first to the best cars
            </h2>
            <p className="text-white/60 text-lg mb-8 max-w-lg font-light">
              New arrivals, price drops, and expert buying guides — delivered before they hit the public listings.
            </p>

            <div className="flex items-center gap-6 flex-wrap">
              {['No spam ever', 'Weekly updates', 'Unsubscribe anytime'].map(t => (
                <div key={t} className="flex items-center gap-2 text-sm font-medium text-white/70">
                  <CheckCircle size={16} className="text-white/40" />
                  {t}
                </div>
              ))}
            </div>
          </div>

          <div className="lg:w-1/2 w-full max-w-md lg:max-w-none relative z-10">
            {submitted ? (
              <div className="flex items-center gap-4 py-6 px-8 rounded-2xl bg-white/5 border border-white/10">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                  <CheckCircle size={24} className="text-gray-900" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">You&apos;re subscribed</h3>
                  <p className="text-white/60">Check your inbox for a welcome message.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3" aria-label="Newsletter subscription form">
                <div className="relative flex-1">
                  <Mail size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-white/40" />
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full pl-12 pr-6 py-4 rounded-lg bg-white/5 border border-white/15 text-white placeholder:text-white/40 focus:outline-none focus:border-white/50 transition-all"
                    aria-label="Email address"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-white hover:bg-gray-100 text-gray-900 font-semibold py-4 px-8 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-70 flex-shrink-0"
                >
                  {loading ? 'Subscribing…' : 'Subscribe'}
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}

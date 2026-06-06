'use client';
import { useState } from 'react';
import { Lock, ShieldCheck } from 'lucide-react';
import { login } from '@/lib/adminAuth';

/** Email/password login backed by Supabase Auth. */
export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await login(email, password);
    if (!res.ok) {
      setError(res.error || 'Sign in failed.');
      setLoading(false);
    }
    // On success, onAuthChange in AdminGate flips to the app — no further action.
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--bg)' }}>
      <div className="w-full max-w-sm rounded-2xl p-8" style={{ background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--card-shadow)' }}>
        <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5" style={{ background: 'var(--ink)' }}>
          <Lock size={22} className="text-white" />
        </div>
        <h1 className="text-xl font-bold mb-1" style={{ color: 'var(--text)', fontFamily: 'var(--font-jakarta)' }}>
          Admin sign in
        </h1>
        <p className="text-sm mb-6" style={{ color: 'var(--muted)' }}>
          Sign in with your RageMotorSport admin account.
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email"
            autoFocus
            required
            value={email}
            onChange={e => { setEmail(e.target.value); setError(null); }}
            placeholder="Email"
            className="input-field"
            aria-label="Email"
          />
          <input
            type="password"
            required
            value={password}
            onChange={e => { setPassword(e.target.value); setError(null); }}
            placeholder="Password"
            className="input-field"
            aria-label="Password"
            aria-invalid={!!error}
          />
          {error && <p className="text-xs text-rose-600">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary w-full justify-center disabled:opacity-70">
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Signing in…
              </span>
            ) : 'Sign in'}
          </button>
        </form>

        <p className="mt-5 flex items-center gap-1.5 text-[11px]" style={{ color: 'var(--muted)' }}>
          <ShieldCheck size={13} /> Protected by Supabase Auth.
        </p>
      </div>
    </div>
  );
}

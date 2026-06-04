'use client';
import { useState, useEffect } from 'react';
import { Lock, ShieldCheck } from 'lucide-react';
import { isAuthed, login } from '@/lib/adminAuth';

/**
 * Password gate around the admin area. Renders a lock screen until the correct
 * password is entered; the session is remembered per browser tab.
 */
export default function AdminGate({ children }: { children: React.ReactNode }) {
  const [authed, setAuthed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    setAuthed(isAuthed());
    setMounted(true);
  }, []);

  // Avoid a flash of the gate (or content) before sessionStorage is read.
  if (!mounted) return null;

  if (authed) return <>{children}</>;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(password)) {
      setAuthed(true);
      setError(false);
    } else {
      setError(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--bg)' }}>
      <div className="w-full max-w-sm rounded-2xl p-8" style={{ background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--card-shadow)' }}>
        <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5" style={{ background: 'var(--ink)' }}>
          <Lock size={22} className="text-white" />
        </div>
        <h1 className="text-xl font-bold mb-1" style={{ color: 'var(--text)', fontFamily: 'var(--font-jakarta)' }}>
          Admin access
        </h1>
        <p className="text-sm mb-6" style={{ color: 'var(--muted)' }}>
          Enter the admin password to manage listings.
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="password"
            autoFocus
            value={password}
            onChange={e => { setPassword(e.target.value); setError(false); }}
            placeholder="Password"
            className="input-field"
            aria-label="Admin password"
            aria-invalid={error}
          />
          {error && <p className="text-xs text-rose-600">Incorrect password. Try again.</p>}
          <button type="submit" className="btn-primary w-full justify-center">
            Unlock
          </button>
        </form>

        <p className="mt-5 flex items-center gap-1.5 text-[11px]" style={{ color: 'var(--muted)' }}>
          <ShieldCheck size={13} /> Demo gate — replace with real auth before production.
        </p>
      </div>
    </div>
  );
}

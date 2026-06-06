'use client';
import { useState } from 'react';
import { X, Mail, Lock } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AuthModal({ open, onClose, onSuccess }: Props) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const supabase = createClient();
    
    let result;
    if (isSignUp) {
      result = await supabase.auth.signUp({ email, password });
    } else {
      result = await supabase.auth.signInWithPassword({ email, password });
    }

    setLoading(false);

    if (result.error) {
      setError(result.error.message);
    } else if (isSignUp && result.data?.user?.identities?.length === 0) {
      // Supabase returns this when user exists but signed up with different provider or we don't have email confirmations enabled
      setError('An account with this email already exists. Try logging in.');
    } else if (isSignUp) {
      // Switch to login view on successful signup
      setIsSignUp(false);
      setPassword('');
      setError('Account created successfully! Please log in.');
    } else {
      onSuccess();
    }
  };

  const resetAndClose = () => {
    setEmail('');
    setPassword('');
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={resetAndClose} />

      <div className="relative w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
        <div className="px-6 py-4 flex items-center justify-between border-b" style={{ borderColor: 'var(--border)' }}>
          <h2 className="text-lg font-bold display" style={{ color: 'var(--text)' }}>
            {isSignUp ? 'Create an Account' : 'Welcome Back'}
          </h2>
          <button onClick={resetAndClose} className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors" style={{ color: 'var(--muted)' }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl text-sm border bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-950/30 dark:border-rose-900 dark:text-rose-400">
              {error}
            </div>
          )}

          <div className="space-y-3">
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-3" style={{ color: 'var(--muted)' }} />
              <input
                type="email"
                required
                placeholder="Email address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="input-field pl-9 w-full"
              />
            </div>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-3" style={{ color: 'var(--muted)' }} />
              <input
                type="password"
                required
                minLength={6}
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="input-field pl-9 w-full"
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-2.5">
            {loading ? 'Processing...' : isSignUp ? 'Sign Up' : 'Log In'}
          </button>

          <p className="text-center text-sm mt-4" style={{ color: 'var(--muted)' }}>
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              type="button"
              onClick={() => { setIsSignUp(!isSignUp); setError(''); }}
              className="font-semibold hover:underline"
              style={{ color: 'var(--text)' }}
            >
              {isSignUp ? 'Log in' : 'Sign up'}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}

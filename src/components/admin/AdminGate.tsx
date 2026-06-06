'use client';
import { useState, useEffect } from 'react';
import { isAuthed, onAuthChange } from '@/lib/adminAuth';
import AdminLogin from './AdminLogin';

/**
 * Auth gate around the admin area. Shows the Supabase login until signed in,
 * then renders the admin. Subscribes to auth changes so sign-in/out flips the
 * UI immediately.
 */
export default function AdminGate({ children }: { children: React.ReactNode }) {
  const [authed, setAuthed] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    isAuthed().then(a => { if (active) { setAuthed(a); setReady(true); } });
    const unsub = onAuthChange(a => setAuthed(a));
    return () => { active = false; unsub(); };
  }, []);

  // Avoid a flash before the session is known.
  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
        <div className="w-8 h-8 border-4 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!authed) return <AdminLogin />;

  return <>{children}</>;
}

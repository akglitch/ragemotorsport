'use client';
import Link from 'next/link';
import { ExternalLink, LogOut } from 'lucide-react';
import { logout } from '@/lib/adminAuth';

/** Chrome shown around every admin page once authenticated. */
export default function AdminShell({ children }: { children: React.ReactNode }) {
  const handleLogout = async () => {
    await logout();
    // AdminGate's onAuthChange subscription flips back to the login screen.
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <header className="sticky top-0 z-40 border-b" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-2">
            <span className="text-sm font-semibold tracking-[0.18em] display" style={{ color: 'var(--text)' }}>RAGEMOTORSPORT</span>
            <span className="badge badge-gold text-[10px]">ADMIN</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/" className="btn-outline text-sm py-2 px-3">
              <ExternalLink size={15} /> <span className="hidden sm:inline">View site</span>
            </Link>
            <button onClick={handleLogout} className="btn-outline text-sm py-2 px-3" aria-label="Log out">
              <LogOut size={15} /> <span className="hidden sm:inline">Log out</span>
            </button>
          </div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}

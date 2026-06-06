'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, User as UserIcon, Crown, LogOut, Loader2 } from 'lucide-react';
import { useUser } from '@/context/UserContext';

const navLinks = [
  { label: 'Home',     href: '/' },
  { label: 'Listings', href: '/cars' },
  { label: 'Pricing',  href: '/pricing' },
  { label: 'About',    href: '/about' },
  { label: 'Contact',  href: '/contact' },
];

export default function Navbar() {
  const [scrolled,   setScrolled]   = useState(false);
  const [open,       setOpen]       = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const pathname = usePathname();
  const { user, isPremium, hydrated, openAuth, signOut } = useUser();

  const transparent = pathname === '/' && !scrolled;

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    fn();
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => { setOpen(false); }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const handleSignOut = async () => {
    setSigningOut(true);
    await new Promise(r => setTimeout(r, 900));
    await signOut();
    setSigningOut(false);
  };

  return (
    <>
      {/* ── Top bar ── */}
      <nav className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        transparent ? 'bg-transparent py-5' : 'bg-white/95 backdrop-blur-xl border-b border-gray-100 py-4'
      }`}>
        <div className="max-w-[100rem] mx-auto px-6 flex items-center justify-between">

          <Link href="/" className={`text-[0.85rem] font-semibold tracking-[0.22em] display transition-colors ${
            transparent ? 'text-white' : 'text-gray-900'
          }`}>
            RAGEMOTORSPORT
          </Link>

          {/* Desktop centre links */}
          <div className="hidden lg:flex items-center gap-9 absolute left-1/2 -translate-x-1/2">
            {navLinks.map(l => (
              <Link key={l.label} href={l.href} className={`text-[0.85rem] font-medium transition-colors ${
                pathname === l.href
                  ? transparent ? 'text-white' : 'text-gray-900'
                  : transparent ? 'text-white/65 hover:text-white' : 'text-gray-400 hover:text-gray-900'
              }`}>
                {l.label}
              </Link>
            ))}
          </div>

          {/* Desktop user */}
          <div className="hidden lg:flex items-center gap-4">
            {hydrated ? user ? (
              <div className="flex items-center gap-3">
                <span className={`text-[0.85rem] font-medium flex items-center gap-1.5 ${
                  isPremium ? 'text-[var(--gold)]' : transparent ? 'text-white/70' : 'text-gray-500'
                }`}>
                  {isPremium ? <Crown size={13} /> : <UserIcon size={13} />}
                  {user.email?.split('@')[0]}
                </span>
                <button onClick={handleSignOut} disabled={signingOut}
                  className={`transition-colors disabled:opacity-40 ${transparent ? 'text-white/50 hover:text-white' : 'text-gray-400 hover:text-gray-700'}`}>
                  {signingOut ? <Loader2 size={14} className="animate-spin" /> : <LogOut size={14} />}
                </button>
              </div>
            ) : (
              <button onClick={openAuth}
                className={`text-[0.85rem] font-medium flex items-center gap-1.5 transition-colors ${
                  transparent ? 'text-white/70 hover:text-white' : 'text-gray-500 hover:text-gray-900'
                }`}>
                <UserIcon size={14} /> Sign in
              </button>
            ) : <div className="w-14 h-3.5 rounded bg-gray-200 animate-pulse" />}
          </div>

          {/* Mobile hamburger */}
          <button onClick={() => setOpen(true)} aria-label="Open menu"
            className={`lg:hidden ${transparent ? 'text-white' : 'text-gray-700'}`}>
            <Menu size={21} />
          </button>
        </div>
      </nav>

      {/* ── Side Drawer — outside <nav> to avoid stacking context bug ── */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 9998, pointerEvents: open ? 'auto' : 'none' }}>

        {/* Backdrop */}
        <div onClick={() => setOpen(false)} style={{
          position: 'absolute', inset: 0,
          background: 'rgba(10,14,23,0.3)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
          opacity: open ? 1 : 0,
          transition: 'opacity 0.35s ease',
        }} />

        {/* White panel */}
        <aside style={{
          position: 'absolute', top: 0, left: 0, bottom: 0,
          width: '72vw', maxWidth: '290px',
          background: '#ffffff',
          borderRight: '1px solid #f0f0f2',
          display: 'flex', flexDirection: 'column',
          boxShadow: '8px 0 40px rgba(10,14,23,0.1)',
          transform: open ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.44s cubic-bezier(0.16,1,0.3,1)',
          willChange: 'transform',
        }}>

          {/* Gold top accent line */}
          <div style={{ height: '2px', background: 'linear-gradient(90deg, #c9a84c, rgba(201,168,76,0.2))', flexShrink: 0 }} />

          {/* Header */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '20px 20px 16px',
            borderBottom: '1px solid #f4f4f6',
            flexShrink: 0,
          }}>
            <span style={{
              fontFamily: 'var(--font-jakarta)', fontSize: '0.62rem', fontWeight: 700,
              letterSpacing: '0.2em', color: '#0a0e17', textTransform: 'uppercase',
            }}>
              Ragemotorsport
            </span>
            <button onClick={() => setOpen(false)} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#9ca3af', padding: 4, display: 'flex',
            }}>
              <X size={17} />
            </button>
          </div>

          {/* Nav links */}
          <nav style={{ flex: 1, padding: '40px 0 20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {navLinks.map((l, i) => {
              const active = pathname === l.href;
              return (
                <Link key={l.label} href={l.href} onClick={() => setOpen(false)} style={{
                  display: 'block',
                  padding: '10px 32px',
                  fontFamily: 'var(--font-jakarta), sans-serif',
                  fontSize: '2.25rem',
                  fontWeight: 300,
                  letterSpacing: '-0.03em',
                  color: active ? '#0a0e17' : 'rgba(10,14,23,0.25)',
                  textDecoration: 'none',
                  borderLeft: active ? '3px solid #c9a84c' : '3px solid transparent',
                  transition: 'color 0.3s ease, border-color 0.3s ease, transform 0.3s ease',
                  opacity: open ? 1 : 0,
                  transform: open ? 'none' : 'translateX(-20px)',
                  transitionDelay: open ? `${i * 50 + 100}ms` : '0ms',
                }}>
                  {l.label}
                </Link>
              );
            })}
          </nav>

          {/* User footer */}
          <div style={{
            padding: '16px 20px 28px',
            borderTop: '1px solid #f4f4f6',
            flexShrink: 0,
          }}>
            {hydrated ? user ? (
              <>
                {/* User info */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <div style={{
                    width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
                    background: isPremium ? 'rgba(201,168,76,0.1)' : '#f5f5f7',
                    border: `1px solid ${isPremium ? 'rgba(201,168,76,0.35)' : '#ebebed'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {isPremium
                      ? <Crown size={14} style={{ color: '#c9a84c' }} />
                      : <UserIcon size={14} style={{ color: '#9ca3af' }} />}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ margin: 0, fontSize: '0.82rem', fontWeight: 600, color: '#0a0e17', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {user.email?.split('@')[0]}
                    </p>
                    <p style={{ margin: 0, fontSize: '0.65rem', color: isPremium ? '#c9a84c' : '#9ca3af' }}>
                      {isPremium ? 'Premium member' : 'Free plan'}
                    </p>
                  </div>
                </div>

                {/* Sign out btn */}
                <button onClick={handleSignOut} disabled={signingOut} style={{
                  width: '100%', padding: '10px', borderRadius: 8, cursor: 'pointer',
                  background: '#f8f8fa', border: '1px solid #ebebed',
                  color: '#6b7280', fontSize: '0.82rem', fontWeight: 500,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                  opacity: signingOut ? 0.6 : 1, transition: 'opacity 0.2s',
                }}>
                  {signingOut ? <Loader2 size={13} className="animate-spin" /> : <LogOut size={13} />}
                  {signingOut ? 'Signing out…' : 'Sign out'}
                </button>
              </>
            ) : (
              <button onClick={() => { openAuth(); setOpen(false); }} style={{
                width: '100%', padding: '12px', borderRadius: 8, cursor: 'pointer',
                background: '#0a0e17', border: 'none',
                color: '#ffffff', fontSize: '0.88rem', fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
              }}>
                <UserIcon size={15} /> Sign in
              </button>
            ) : null}
          </div>
        </aside>
      </div>
    </>
  );
}

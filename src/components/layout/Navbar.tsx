'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, User as UserIcon, Crown, LogOut, Loader2 } from 'lucide-react';
import { useUser } from '@/context/UserContext';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Listings', href: '/cars' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const pathname = usePathname();
  const { user, isPremium, hydrated, openAuth, signOut } = useUser();

  const transparent = pathname === '/' && !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const handleSignOut = async () => {
    setSigningOut(true);
    await new Promise(r => setTimeout(r, 900));
    await signOut();
    setSigningOut(false);
    setMobileOpen(false);
  };

  const text = transparent ? 'text-white' : 'text-gray-900';
  const link = transparent
    ? 'text-white/80 hover:text-white'
    : 'text-gray-500 hover:text-gray-900';

  return (
    <>
      {/* ── Navbar bar ── */}
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          transparent
            ? 'bg-transparent py-5'
            : 'bg-white/95 backdrop-blur-xl border-b border-gray-100 py-4'
        }`}
      >
        <div className="max-w-[100rem] mx-auto px-6 flex items-center justify-between">
          {/* Wordmark */}
          <Link
            href="/"
            aria-label="RageMotorSport home"
            className={`text-[0.9rem] font-semibold tracking-[0.22em] display ${text}`}
          >
            RAGEMOTORSPORT
          </Link>

          {/* Center links — desktop */}
          <div className="hidden lg:flex items-center gap-9 absolute left-1/2 -translate-x-1/2">
            {navLinks.map(l => (
              <Link
                key={l.label}
                href={l.href}
                className={`text-[0.88rem] font-medium transition-colors relative group ${
                  pathname === l.href
                    ? transparent ? 'text-white' : 'text-gray-900'
                    : link
                }`}
              >
                {l.label}
                <span className={`absolute -bottom-0.5 left-0 h-[1px] bg-current transition-all duration-300 ${pathname === l.href ? 'w-full' : 'w-0 group-hover:w-full'}`} />
              </Link>
            ))}
          </div>

          {/* Right actions — desktop */}
          <div className="hidden lg:flex items-center gap-4">
            {hydrated ? (
              user ? (
                <div className="flex items-center gap-3">
                  <span className={`flex items-center gap-1.5 text-[0.88rem] font-medium ${isPremium ? 'text-[var(--gold)]' : link}`}>
                    {isPremium ? <Crown size={14} /> : <UserIcon size={14} />}
                    {user.email?.split('@')[0]}
                  </span>
                  <button
                    onClick={handleSignOut}
                    disabled={signingOut}
                    aria-label="Sign out"
                    className={`transition-all ${link} disabled:opacity-50`}
                  >
                    {signingOut
                      ? <Loader2 size={15} className="animate-spin" />
                      : <LogOut size={15} />}
                  </button>
                </div>
              ) : (
                <button
                  onClick={openAuth}
                  className={`text-[0.88rem] font-medium transition-colors flex items-center gap-1.5 ${link}`}
                >
                  <UserIcon size={15} /> Sign in
                </button>
              )
            ) : (
              <div className="w-16 h-4 bg-black/8 rounded animate-pulse" />
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className={`lg:hidden p-1 ${text}`}
            onClick={() => setMobileOpen(o => !o)}
            aria-label="Open menu"
            aria-expanded={mobileOpen}
          >
            <Menu size={22} />
          </button>
        </div>
      </nav>

      {/* ── Side Drawer — rendered OUTSIDE <nav> so z-index is unrestricted ── */}
      <div
        style={{ position: 'fixed', inset: 0, zIndex: 9998, pointerEvents: mobileOpen ? 'auto' : 'none' }}
        aria-hidden={!mobileOpen}
      >
        {/* Backdrop */}
        <div
          onClick={() => setMobileOpen(false)}
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0,0,0,0.72)',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
            opacity: mobileOpen ? 1 : 0,
            transition: 'opacity 0.4s ease',
          }}
        />

        {/* Drawer panel */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            width: '80vw',
            maxWidth: '320px',
            display: 'flex',
            flexDirection: 'column',
            background: 'linear-gradient(170deg, #0b0d12 0%, #090b0f 100%)',
            borderRight: '1px solid rgba(255,255,255,0.05)',
            boxShadow: '20px 0 60px rgba(0,0,0,0.6)',
            transform: mobileOpen ? 'translateX(0)' : 'translateX(-100%)',
            transition: 'transform 0.45s cubic-bezier(0.16,1,0.3,1)',
          }}
        >
          {/* Gold top accent */}
          <div style={{ height: '2px', background: 'linear-gradient(90deg, #d4af37 0%, rgba(212,175,55,0.1) 100%)', flexShrink: 0 }} />

          {/* Header */}
          <div style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.04)', flexShrink: 0 }}>
            <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.22em', fontFamily: 'var(--font-jakarta)' }}>
              RAGEMOTORSPORT
            </span>
            <button
              onClick={() => setMobileOpen(false)}
              style={{ width: 34, height: 34, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.06)', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.6)' }}
            >
              <X size={16} />
            </button>
          </div>

          {/* Navigation links */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '32px 16px 16px' }}>
            {navLinks.map((l, i) => {
              const active = pathname === l.href;
              return (
                <Link
                  key={l.label}
                  href={l.href}
                  onClick={() => setMobileOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '12px 16px',
                    borderRadius: 12,
                    marginBottom: 4,
                    fontSize: '1rem',
                    fontWeight: 500,
                    color: active ? '#fff' : 'rgba(255,255,255,0.5)',
                    background: active ? 'rgba(255,255,255,0.08)' : 'transparent',
                    textDecoration: 'none',
                    transition: 'all 0.2s ease',
                    opacity: mobileOpen ? 1 : 0,
                    transform: mobileOpen ? 'translateX(0)' : 'translateX(-16px)',
                    transitionDelay: mobileOpen ? `${60 + i * 45}ms` : '0ms',
                  }}
                >
                  {active && (
                    <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#d4af37', flexShrink: 0 }} />
                  )}
                  {l.label}
                </Link>
              );
            })}
          </div>

          {/* Footer user section */}
          <div style={{ padding: '16px 16px 24px', borderTop: '1px solid rgba(255,255,255,0.04)', flexShrink: 0 }}>
            {hydrated ? (
              user ? (
                <>
                  {/* User info */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                    <div style={{
                      width: 38, height: 38, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                      background: isPremium ? 'rgba(212,175,55,0.12)' : 'rgba(255,255,255,0.06)',
                      border: `1px solid ${isPremium ? 'rgba(212,175,55,0.3)' : 'rgba(255,255,255,0.08)'}`,
                    }}>
                      {isPremium
                        ? <Crown size={16} style={{ color: '#d4af37' }} />
                        : <UserIcon size={16} style={{ color: 'rgba(255,255,255,0.6)' }} />}
                    </div>
                    <div>
                      <p style={{ color: '#fff', fontSize: '0.85rem', fontWeight: 600, margin: 0 }}>{user.email?.split('@')[0]}</p>
                      <p style={{ color: isPremium ? '#d4af37' : 'rgba(255,255,255,0.35)', fontSize: '0.7rem', margin: 0 }}>
                        {isPremium ? '✦ Premium Member' : 'Standard Account'}
                      </p>
                    </div>
                  </div>

                  {/* Sign out */}
                  <button
                    onClick={handleSignOut}
                    disabled={signingOut}
                    style={{
                      width: '100%', padding: '11px 16px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.07)',
                      background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.7)',
                      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                      fontSize: '0.85rem', fontWeight: 500, transition: 'all 0.2s ease',
                      opacity: signingOut ? 0.7 : 1,
                    }}
                  >
                    {signingOut ? <Loader2 size={15} className="animate-spin" /> : <LogOut size={15} />}
                    {signingOut ? 'Signing out…' : 'Sign Out'}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => { openAuth(); setMobileOpen(false); }}
                  style={{
                    width: '100%', padding: '13px 16px', borderRadius: 10, border: 'none',
                    background: 'linear-gradient(135deg, #e8c976, #d4af37)',
                    color: '#0b0d12', cursor: 'pointer', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', gap: 8, fontSize: '0.9rem', fontWeight: 700,
                    letterSpacing: '0.02em',
                  }}
                >
                  <UserIcon size={16} />
                  Sign In
                </button>
              )
            ) : <div style={{ height: 46, borderRadius: 10, background: 'rgba(255,255,255,0.04)' }} />}
          </div>
        </div>
      </div>
    </>
  );
}

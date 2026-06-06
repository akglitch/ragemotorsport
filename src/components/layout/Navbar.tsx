'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, User as UserIcon, Globe, HelpCircle, Crown, LogOut, Loader2 } from 'lucide-react';
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
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close side nav when route changes
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  // Prevent body scroll when nav is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const handleSignOut = async () => {
    setSigningOut(true);
    // Small delay for the animation to be visible
    await new Promise(r => setTimeout(r, 800));
    await signOut();
    setSigningOut(false);
    setMobileOpen(false);
  };

  const text = transparent ? 'text-white' : 'text-gray-900';
  const link = transparent ? 'text-white/85 hover:text-white' : 'text-gray-600 hover:text-gray-900';

  return (
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
          className={`text-[0.95rem] font-semibold tracking-[0.22em] display ${text}`}
        >
          RAGEMOTORSPORT
        </Link>

        {/* Center links — desktop */}
        <div className="hidden lg:flex items-center gap-9 absolute left-1/2 -translate-x-1/2">
          {navLinks.map(l => (
            <Link key={l.label} href={l.href} className={`text-[0.9rem] font-medium transition-colors ${link}`}>
              {l.label}
            </Link>
          ))}
        </div>

        {/* Right actions — desktop */}
        <div className="hidden lg:flex items-center gap-5">
          <button aria-label="Help" className={`transition-colors ${link}`}><HelpCircle size={18} /></button>
          <button aria-label="Language" className={`transition-colors ${link}`}><Globe size={18} /></button>

          <div className="flex items-center gap-4 ml-4 pl-4 border-l border-current/10">
            {hydrated ? (
              user ? (
                <div className="flex items-center gap-3">
                  <span className={`flex items-center gap-2 text-[0.9rem] font-medium ${isPremium ? 'text-[var(--gold)]' : link}`}>
                    {isPremium ? <Crown size={16} /> : <UserIcon size={16} />}
                    {user.email?.split('@')[0]}
                  </span>
                  <button
                    onClick={handleSignOut}
                    disabled={signingOut}
                    aria-label="Sign out"
                    className={`transition-all opacity-70 hover:opacity-100 ${link}`}
                  >
                    {signingOut ? <Loader2 size={16} className="animate-spin" /> : <LogOut size={16} />}
                  </button>
                </div>
              ) : (
                <button onClick={openAuth} className={`flex items-center gap-2 text-[0.9rem] font-medium transition-colors ${link}`}>
                  <UserIcon size={18} /> Sign in
                </button>
              )
            ) : (
              <div className="w-20 h-5 bg-black/10 rounded animate-pulse" />
            )}
          </div>
        </div>

        {/* Mobile menu button */}
        <button
          className={`lg:hidden ${text}`}
          onClick={() => setMobileOpen(o => !o)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
        >
          <Menu size={24} />
        </button>
      </div>

      {/* ── Full-screen side navigation drawer ── */}
      {/* Portal-level fixed overlay, always rendered so transitions work */}
      <div
        aria-hidden={!mobileOpen}
        className={`fixed inset-0 z-[200] lg:hidden transition-all duration-500 ${
          mobileOpen ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
      >
        {/* Blurred dark backdrop */}
        <div
          className={`absolute inset-0 bg-black/70 backdrop-blur-md transition-opacity duration-500 ${mobileOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setMobileOpen(false)}
        />

        {/* Drawer panel — forced dark (#0a0e17 base) */}
        <div
          className={`absolute inset-y-0 left-0 w-[85vw] max-w-[340px] flex flex-col shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            mobileOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
          style={{ background: 'linear-gradient(160deg, #0d1117 0%, #0a0e17 60%, #0d1020 100%)' }}
        >
          {/* Subtle gold accent line at top */}
          <div className="h-[2px] w-full" style={{ background: 'linear-gradient(90deg, var(--gold), transparent 60%)' }} />

          {/* Header */}
          <div className="px-6 py-5 flex items-center justify-between border-b border-white/5">
            <span className="text-sm font-semibold tracking-[0.22em] display text-white">
              RAGEMOTORSPORT
            </span>
            <button
              onClick={() => setMobileOpen(false)}
              className="w-9 h-9 rounded-full flex items-center justify-center bg-white/5 text-white/60 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Nav links */}
          <nav className="flex-1 overflow-y-auto px-6 py-8 flex flex-col gap-1">
            {navLinks.map((l, i) => {
              const active = pathname === l.href;
              return (
                <Link
                  key={l.label}
                  href={l.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-4 px-4 py-3.5 rounded-xl text-base font-medium transition-all duration-200 ${
                    active
                      ? 'bg-white/10 text-white'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                  style={{
                    transitionDelay: mobileOpen ? `${80 + i * 40}ms` : '0ms',
                    transform: mobileOpen ? 'translateX(0)' : 'translateX(-12px)',
                    opacity: mobileOpen ? 1 : 0,
                  }}
                >
                  {active && <span className="w-1 h-1 rounded-full bg-white flex-shrink-0" />}
                  {l.label}
                </Link>
              );
            })}
          </nav>

          {/* Footer — user area */}
          <div className="p-6 border-t border-white/5" style={{ background: 'rgba(255,255,255,0.03)' }}>
            {hydrated ? (
              user ? (
                <>
                  {/* User card */}
                  <div className="mb-4 flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: isPremium ? 'rgba(var(--gold-rgb),0.15)' : 'rgba(255,255,255,0.08)', border: isPremium ? '1px solid rgba(var(--gold-rgb),0.3)' : '1px solid rgba(255,255,255,0.1)' }}
                    >
                      {isPremium ? <Crown size={18} style={{ color: 'var(--gold)' }} /> : <UserIcon size={18} className="text-white/70" />}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{user.email?.split('@')[0]}</p>
                      <p className="text-xs" style={{ color: isPremium ? 'var(--gold)' : 'rgba(255,255,255,0.4)' }}>
                        {isPremium ? '✦ Premium Member' : 'Standard Account'}
                      </p>
                    </div>
                  </div>

                  {/* Sign out button with animation */}
                  <button
                    onClick={handleSignOut}
                    disabled={signingOut}
                    className="w-full py-3 rounded-xl text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70"
                    style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.8)', border: '1px solid rgba(255,255,255,0.08)' }}
                  >
                    {signingOut ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Signing out…
                      </>
                    ) : (
                      <>
                        <LogOut size={16} />
                        Sign Out
                      </>
                    )}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => { openAuth(); setMobileOpen(false); }}
                  className="w-full py-3.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 text-black"
                  style={{ background: 'linear-gradient(135deg, #f5f3ec, #e8d5a3)' }}
                >
                  <UserIcon size={16} />
                  Sign In / Create Account
                </button>
              )
            ) : (
              <div className="h-12 rounded-xl bg-white/5 animate-pulse" />
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

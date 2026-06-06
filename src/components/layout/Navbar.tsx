'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, User as UserIcon, Globe, HelpCircle, Crown, LogOut } from 'lucide-react';
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
  const pathname = usePathname();
  const { user, isPremium, hydrated, openAuth, signOut } = useUser();

  // Transparent overlay only on the home hero; solid everywhere else / on scroll.
  const transparent = pathname === '/' && !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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

        {/* Center links */}
        <div className="hidden lg:flex items-center gap-9 absolute left-1/2 -translate-x-1/2">
          {navLinks.map(l => (
            <Link key={l.label} href={l.href} className={`text-[0.9rem] font-medium transition-colors ${link}`}>
              {l.label}
            </Link>
          ))}
        </div>

        {/* Right actions */}
        <div className="hidden lg:flex items-center gap-5">
          <button aria-label="Help" className={`transition-colors ${link}`}>
            <HelpCircle size={18} />
          </button>
          <button aria-label="Language" className={`transition-colors ${link}`}>
            <Globe size={18} />
          </button>
          
          <div className="flex items-center gap-4 ml-4 pl-4 border-l border-white/20">
            {hydrated ? (
              user ? (
                <div className="flex items-center gap-3">
                  <span className={`flex items-center gap-2 text-[0.9rem] font-medium ${isPremium ? 'text-[var(--gold)]' : link}`}>
                    {isPremium ? <Crown size={16} /> : <UserIcon size={16} />}
                    {user.email?.split('@')[0]}
                  </span>
                  <button onClick={signOut} aria-label="Sign out" className={`transition-colors opacity-70 hover:opacity-100 ${link}`}>
                    <LogOut size={16} />
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
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Full-screen sleek side navigation */}
      <div
        className={`fixed inset-0 z-[100] lg:hidden pointer-events-none transition-opacity duration-500 ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0'
        }`}
      >
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/60 backdrop-blur-md"
          onClick={() => setMobileOpen(false)}
        />
        
        {/* Drawer sliding from left */}
        <div 
          className={`absolute inset-y-0 left-0 w-[85%] max-w-sm bg-[var(--bg)] border-r border-white/10 shadow-2xl flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            mobileOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {/* Header */}
          <div className="p-6 flex items-center justify-between border-b border-white/5">
            <span className="text-sm font-semibold tracking-[0.22em] display text-white">
              RAGEMOTORSPORT
            </span>
            <button 
              onClick={() => setMobileOpen(false)}
              className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Links */}
          <div className="flex-1 overflow-y-auto px-6 py-8 flex flex-col gap-6">
            {navLinks.map((l, i) => (
              <Link
                key={l.label}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className="text-2xl font-semibold tracking-tight text-white/70 hover:text-white transition-colors flex items-center gap-4"
                style={{ transitionDelay: mobileOpen ? `${100 + i * 50}ms` : '0ms' }}
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* Footer actions */}
          <div className="p-6 border-t border-white/5 bg-white/5">
            {hydrated ? (
              user ? (
                <>
                  <div className="mb-4 flex items-center gap-3 text-white/90">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                      {isPremium ? <Crown size={18} style={{ color: 'var(--gold)' }} /> : <UserIcon size={18} />}
                    </div>
                    <div className="text-sm">
                      <p className="font-semibold">{user.email?.split('@')[0]}</p>
                      <p className="text-white/50 text-xs">{isPremium ? 'Premium Member' : 'Standard Account'}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => { signOut(); setMobileOpen(false); }}
                    className="w-full py-3 rounded-xl bg-white/10 text-white font-medium hover:bg-white/20 transition-colors flex items-center justify-center gap-2"
                  >
                    <LogOut size={16} /> Sign Out
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => { openAuth(); setMobileOpen(false); }}
                  className="w-full py-4 rounded-xl bg-white text-black font-semibold hover:bg-white/90 transition-colors flex items-center justify-center gap-2"
                >
                  <UserIcon size={18} /> Sign In to Subscribe
                </button>
              )
            ) : null}
          </div>
        </div>
      </div>
    </nav>
  );
}

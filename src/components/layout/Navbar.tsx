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

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-lg">
          <div className="px-6 py-4 flex flex-col gap-1">
            {navLinks.map(l => (
              <Link
                key={l.label}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className="py-2.5 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
              >
                {l.label}
              </Link>
            ))}
            
            <div className="mt-4 pt-4 border-t border-gray-100">
              {hydrated ? (
                user ? (
                  <>
                    <div className="py-2.5 text-sm font-medium text-gray-700 flex items-center gap-2">
                      {isPremium ? <Crown size={16} style={{ color: 'var(--gold)' }} /> : <UserIcon size={16} />}
                      {user.email}
                    </div>
                    <button onClick={signOut} className="py-2.5 text-sm font-medium text-rose-600 flex items-center gap-2 w-full text-left">
                      <LogOut size={16} /> Sign out
                    </button>
                  </>
                ) : (
                  <button onClick={() => { openAuth(); setMobileOpen(false); }} className="py-2.5 text-sm font-medium text-gray-700 flex items-center gap-2 w-full text-left">
                    <UserIcon size={16} /> Sign in
                  </button>
                )
              ) : null}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

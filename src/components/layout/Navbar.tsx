'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, User, Globe, HelpCircle } from 'lucide-react';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Listings', href: '/cars' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

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
        <div className="hidden lg:flex items-center gap-6">
          <button aria-label="Help" className={`transition-colors ${link}`}>
            <HelpCircle size={18} />
          </button>
          <button aria-label="Language" className={`transition-colors ${link}`}>
            <Globe size={18} />
          </button>
          <button className={`flex items-center gap-2 text-[0.9rem] font-medium transition-colors ${link}`}>
            <User size={18} />
            Sign in
          </button>
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
            <button className="mt-2 py-2.5 text-left text-sm font-medium text-gray-700 flex items-center gap-2">
              <User size={16} /> Sign in
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

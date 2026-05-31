import Link from 'next/link';
import { Phone, Mail, MapPin, MessageCircle, Hash, Camera, Briefcase, ArrowRight } from 'lucide-react';

const footerLinks = {
  Company: [
    { label: 'About Us', href: '/about' },
    { label: 'Careers', href: '/careers' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact Us', href: '/contact' },
  ],
  QuickLinks: [
    { label: 'Get in Touch', href: '/contact' },
    { label: 'Help Center', href: '/help' },
    { label: 'Live Chat', href: '/chat' },
    { label: 'How it Works', href: '/how-it-works' },
  ],
  OurBrands: [
    { label: 'Toyota', href: '/cars?make=Toyota' },
    { label: 'BMW', href: '/cars?make=BMW' },
    { label: 'Mercedes', href: '/cars?make=Mercedes' },
    { label: 'Tesla', href: '/cars?make=Tesla' },
  ],
  Vehicles: [
    { label: 'Sedan', href: '/cars?category=Sedan' },
    { label: 'SUV', href: '/cars?category=SUV' },
    { label: 'Electric', href: '/cars?category=Electric' },
    { label: 'Luxury', href: '/cars?category=Luxury' },
  ],
};

const socials = [
  { icon: <MessageCircle size={17} />, href: '#', label: 'Facebook' },
  { icon: <Hash size={17} />, href: '#', label: 'Twitter' },
  { icon: <Camera size={17} />, href: '#', label: 'Instagram' },
  { icon: <Briefcase size={17} />, href: '#', label: 'LinkedIn' },
];

const columns: [string, { label: string; href: string }[]][] = [
  ['Company', footerLinks.Company],
  ['Quick Links', footerLinks.QuickLinks],
  ['Our Brands', footerLinks.OurBrands],
  ['Vehicles', footerLinks.Vehicles],
];

export default function Footer() {
  return (
    <footer className="bg-[#0a0e17] text-white">
      <div className="max-w-[95rem] mx-auto px-6">

        {/* CTA band */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 py-16 border-b border-white/10">
          <div>
            <p className="text-xs font-semibold tracking-[0.22em] text-white/45 mb-5 display">RAGEMOTORSPORT</p>
            <h2 className="display text-3xl md:text-4xl font-semibold tracking-tight leading-tight max-w-xl">
              Ready to find your next car?
            </h2>
          </div>
          <Link
            href="/cars"
            className="group inline-flex items-center gap-2 bg-white text-gray-900 font-medium px-7 py-3.5 rounded-md hover:bg-gray-200 transition-colors whitespace-nowrap"
          >
            Browse inventory
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Columns */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-10 py-16">
          {/* Contact + socials */}
          <div className="col-span-2">
            <div className="space-y-4 mb-8 text-sm text-white/60">
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-white/40 mt-0.5 shrink-0" />
                <span>123 Queensberry Street, North<br />Melbourne VIC 3051, Australia.</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={18} className="text-white/40 shrink-0" />
                <span>+76 956 039 999</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={18} className="text-white/40 shrink-0" />
                <span>hello@ragemotorsport.com</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {socials.map(s => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-white/70 hover:bg-white hover:text-gray-900 hover:border-white transition-all"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {columns.map(([title, links]) => (
            <div key={title}>
              <h3 className="text-sm font-semibold text-white mb-5">{title}</h3>
              <ul className="space-y-3.5">
                {links.map(l => (
                  <li key={l.label}>
                    <Link href={l.href} className="text-sm text-white/55 hover:text-white transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Oversized brand watermark — SVG text stretches to fit width so nothing clips */}
        <div className="border-t border-white/10 py-8">
          <svg viewBox="0 0 1200 160" preserveAspectRatio="xMidYMid meet" className="w-full block select-none" aria-hidden="true">
            <text
              x="600"
              y="122"
              textAnchor="middle"
              textLength="1180"
              lengthAdjust="spacingAndGlyphs"
              fontSize="150"
              fontWeight="700"
              fill="rgba(255,255,255,0.05)"
              style={{ fontFamily: 'var(--font-jakarta), sans-serif', letterSpacing: '-0.02em' }}
            >
              RageMotorSport
            </text>
          </svg>
        </div>

        {/* Bottom bar */}
        <div className="py-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/45 text-sm">© 2026 RageMotorSport. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="#" className="text-white/45 hover:text-white text-sm transition-colors">Terms &amp; Conditions</Link>
            <Link href="#" className="text-white/45 hover:text-white text-sm transition-colors">Privacy Notice</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

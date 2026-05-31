import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import BackToTop from '@/components/ui/BackToTop';
import ContactForm from './ContactForm';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact — RageMotorSport',
  description: 'Get in touch with the RageMotorSport team. Book a test drive, ask about financing, or get support.',
};

const details = [
  { icon: <Phone size={18} />, label: 'Phone', value: '+76 956 039 999', href: 'tel:+76956039999' },
  { icon: <Mail size={18} />, label: 'Email', value: 'hello@ragemotorsport.com', href: 'mailto:hello@ragemotorsport.com' },
  { icon: <MapPin size={18} />, label: 'Showroom', value: '123 Queensberry Street, North Melbourne VIC 3051, Australia' },
  { icon: <Clock size={18} />, label: 'Hours', value: 'Mon–Sat · 9:00am – 6:00pm' },
];

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="flex-grow pt-24 bg-[var(--bg)]" aria-label="Contact RageMotorSport">
        <section className="max-w-[95rem] mx-auto px-6 py-16">
          <nav className="text-sm mb-6 flex items-center gap-2 text-gray-500" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-gray-900 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">Contact</span>
          </nav>

          <div className="max-w-2xl mb-14">
            <h1 className="display text-4xl md:text-6xl font-semibold text-gray-900 tracking-tight leading-[1.05]">
              Let&apos;s talk.
            </h1>
            <p className="text-gray-500 text-lg font-light leading-relaxed mt-5">
              Questions about a vehicle, financing, or a trade-in? Send us a note and the
              team will be in touch within one business day.
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-12">
            {/* Form */}
            <div className="lg:col-span-7">
              <div className="bg-white rounded-2xl border border-gray-100 p-7 md:p-9 shadow-[0_1px_2px_rgba(10,14,23,0.03),0_6px_20px_rgba(10,14,23,0.05)]">
                <ContactForm />
              </div>
            </div>

            {/* Details */}
            <div className="lg:col-span-5 lg:col-start-8">
              <div className="space-y-2">
                {details.map(d => {
                  const content = (
                    <div className="flex items-start gap-4 p-5 rounded-xl border border-gray-100 bg-white hover:border-gray-300 transition-colors">
                      <div className="w-11 h-11 rounded-full bg-[var(--surface-2)] flex items-center justify-center text-gray-700 shrink-0">
                        {d.icon}
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1">{d.label}</p>
                        <p className="text-gray-900 font-medium leading-snug">{d.value}</p>
                      </div>
                    </div>
                  );
                  return d.href
                    ? <Link key={d.label} href={d.href} className="block">{content}</Link>
                    : <div key={d.label}>{content}</div>;
                })}
              </div>

              {/* Map placeholder */}
              <div className="mt-2 rounded-xl overflow-hidden border border-gray-100 h-48 bg-[var(--surface-2)] flex items-center justify-center">
                <span className="text-sm text-gray-400 flex items-center gap-2">
                  <MapPin size={16} /> North Melbourne showroom
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}

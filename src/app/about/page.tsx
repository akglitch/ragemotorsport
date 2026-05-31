import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import BackToTop from '@/components/ui/BackToTop';
import { Shield, Truck, CreditCard, Award, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About — RageMotorSport',
  description: 'RageMotorSport is a curated marketplace of certified vehicles with transparent pricing, expert inspection, and delivery to your door.',
};

const stats = [
  { value: '15k+', label: 'Vehicles delivered' },
  { value: '4.9★', label: 'Average customer rating' },
  { value: '150', label: 'Point inspection' },
  { value: '12', label: 'Cities served' },
];

const values = [
  { icon: <Shield size={20} />, title: 'Inspected & certified', description: 'Every vehicle passes a rigorous 150-point inspection before it is ever listed.' },
  { icon: <CreditCard size={20} />, title: 'Transparent pricing', description: 'No hidden fees, no haggling. The price you see is the price you pay.' },
  { icon: <Truck size={20} />, title: 'Delivered to you', description: 'Free test drives and doorstep delivery across every city we serve.' },
  { icon: <Award size={20} />, title: 'Backed by warranty', description: 'Each purchase includes a complimentary two-year warranty for peace of mind.' },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="flex-grow pt-24 bg-[var(--bg)]" aria-label="About RageMotorSport">

        {/* Hero */}
        <section className="max-w-[95rem] mx-auto px-6 py-16">
          <nav className="text-sm mb-6 flex items-center gap-2 text-gray-500" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-gray-900 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">About</span>
          </nav>

          <div className="grid lg:grid-cols-12 gap-12 items-end">
            <div className="lg:col-span-7">
              <h1 className="display text-4xl md:text-6xl font-semibold text-gray-900 tracking-tight leading-[1.05]">
                Buying a car, reimagined.
              </h1>
              <p className="text-gray-500 text-lg font-light leading-relaxed mt-6 max-w-xl">
                RageMotorSport was built on a simple idea: buying a car should be as
                considered and confident as the drive itself. We curate, inspect, and
                deliver — so you can choose with certainty.
              </p>
              <div className="flex flex-wrap gap-3 mt-8">
                <Link href="/cars" className="btn-primary">Browse inventory <ArrowRight size={16} /></Link>
                <Link href="/contact" className="btn-outline">Talk to us</Link>
              </div>
            </div>
            <div className="lg:col-span-5">
              <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100">
                <Image
                  src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&q=80"
                  alt="Black Porsche Panamera on the highway"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="border-y border-gray-100 bg-white">
          <div className="max-w-[95rem] mx-auto px-6 py-14 grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map(s => (
              <div key={s.label}>
                <p className="display text-4xl md:text-5xl font-semibold text-gray-900">{s.value}</p>
                <p className="text-sm text-gray-500 mt-2">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Values */}
        <section className="max-w-[95rem] mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-12 gap-x-12 gap-y-10">
            <div className="lg:col-span-4">
              <h2 className="display text-3xl md:text-4xl font-semibold text-gray-900 tracking-tight leading-tight">
                What we stand for
              </h2>
              <p className="text-gray-500 mt-4 font-light leading-relaxed">
                Four commitments shape every vehicle we sell and every interaction along the way.
              </p>
            </div>
            <div className="lg:col-span-7 lg:col-start-6">
              {values.map((v, i) => (
                <div key={v.title} className="group flex items-start gap-6 py-7 border-t border-gray-200">
                  <span className="w-8 shrink-0 pt-1 text-xs font-semibold tracking-widest text-gray-300 group-hover:text-gray-900 transition-colors">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1.5">{v.title}</h3>
                    <p className="text-gray-500 text-[0.95rem] leading-relaxed font-light">{v.description}</p>
                  </div>
                  <div className="w-11 h-11 rounded-full border border-gray-200 flex items-center justify-center text-gray-700 shrink-0 group-hover:bg-gray-900 group-hover:text-white group-hover:border-gray-900 transition-colors">
                    {v.icon}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-[95rem] mx-auto px-6 pb-24">
          <div className="bg-[#0a0e17] rounded-3xl px-8 md:px-16 py-16 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div>
              <h2 className="display text-3xl md:text-4xl font-semibold text-white tracking-tight">
                Find a car worth the drive.
              </h2>
              <p className="text-white/60 text-lg font-light mt-3 max-w-lg">
                Explore our curated, inspected inventory and we&apos;ll bring it to your door.
              </p>
            </div>
            <Link href="/cars" className="bg-white text-gray-900 font-medium px-7 py-3.5 rounded-md hover:bg-gray-200 transition-colors whitespace-nowrap inline-flex items-center gap-2">
              Browse inventory <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}

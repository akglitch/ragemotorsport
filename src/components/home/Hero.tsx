'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, ChevronDown, ArrowUpRight, Gauge, Calendar, Cog } from 'lucide-react';
import { cars } from '@/lib/data';
import { formatPrice, formatMileage } from '@/lib/utils';

const makes = [...new Set(cars.map(c => c.make))];

// Each slide is a *real* vehicle from inventory, with an editorial line of its own.
const showcase = [
  { id: '1', headline: ['Built to be', 'driven hard.'] },
  { id: '4', headline: ['Quiet luxury,', 'loud presence.'] },
  { id: '14', headline: ['Some legends', 'never idle.'] },
].map(s => ({ ...s, car: cars.find(c => c.id === s.id)! }));

// Normalize every backdrop to the exact same dimensions so there is no size jump.
const bg = (url: string) => `${url.split('?')[0]}?w=2400&h=1500&fit=crop&crop=entropy&q=80`;

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const [condition, setCondition] = useState('Used Cars');
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [price, setPrice] = useState('All Prices');

  const next = useCallback(() => setCurrent(c => (c + 1) % showcase.length), []);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(next, 7000);
    return () => clearInterval(t);
  }, [paused, next]);

  const buildSearchUrl = () => {
    const params = new URLSearchParams();
    if (condition === 'New Cars') params.set('condition', 'New');
    if (condition === 'Used Cars') params.set('condition', 'Used');
    if (make) params.set('make', make);
    if (model) params.set('search', model);
    return `/cars?${params.toString()}`;
  };

  const slide = showcase[current];
  const car = slide.car;

  return (
    <section
      className="relative w-full min-h-screen flex flex-col overflow-hidden bg-[#070a12]"
      aria-label="Hero"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Backdrops — identical dimensions for every slide */}
      {showcase.map((s, i) => (
        <div
          key={s.id}
          className="absolute inset-0 transition-opacity duration-[1200ms] ease-in-out"
          style={{ opacity: i === current ? 1 : 0 }}
          aria-hidden={i !== current}
        >
          <Image
            src={bg(s.car.image)}
            alt={`${s.car.year} ${s.car.make} ${s.car.model}`}
            fill
            priority={i === 0}
            className={`object-cover object-center ${i === current ? 'animate-ken-burns' : ''}`}
            sizes="100vw"
          />
        </div>
      ))}

      {/* Cinematic depth */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#070a12] via-[#070a12]/55 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#070a12] via-transparent to-[#070a12]/40" />

      {/* Left index rail (desktop) */}
      <div className="hidden lg:flex absolute left-8 top-0 bottom-0 z-20 flex-col items-center justify-center gap-5">
        <span className="text-white/40 text-xs tracking-[0.3em] [writing-mode:vertical-rl] rotate-180 tabular-nums">
          {String(current + 1).padStart(2, '0')} — {String(showcase.length).padStart(2, '0')}
        </span>
        <div className="flex flex-col gap-3">
          {showcase.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`View vehicle ${i + 1}`}
              aria-current={i === current}
              className={`w-px transition-all duration-500 ${i === current ? 'h-12 bg-white' : 'h-6 bg-white/30 hover:bg-white/60'}`}
            />
          ))}
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="relative z-10 flex-1 flex items-center">
        <div className="w-full max-w-[95rem] mx-auto px-6 md:px-10 lg:pl-24 pt-28 md:pt-32">
          <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-10 lg:gap-16 items-end">

            {/* Headline column */}
            <div key={current} className="animate-fade-in-up">
              <div className="flex items-center gap-3 mb-7">
                <span className="h-px w-10 bg-[var(--accent)]" />
                <span className="text-[11px] md:text-xs font-semibold uppercase tracking-[0.35em] text-white/85">
                  {car.badge ?? 'Featured'} · In stock now
                </span>
              </div>

              <h1 className="display text-white font-semibold tracking-tight leading-[0.92] text-5xl md:text-7xl lg:text-[5.75rem] [text-shadow:0_2px_40px_rgba(0,0,0,0.5)]">
                {slide.headline[0]}<br />{slide.headline[1]}
              </h1>

              <div className="flex flex-col sm:flex-row sm:items-center gap-3 mt-9">
                <Link
                  href="/cars"
                  className="group inline-flex items-center justify-center gap-2 bg-white text-gray-900 font-medium px-9 py-4 rounded-md text-sm transition-all hover:-translate-y-0.5 hover:shadow-[0_14px_50px_rgba(255,255,255,0.25)]"
                >
                  Browse Inventory
                  <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Link>
                <Link
                  href="/about"
                  className="inline-flex items-center justify-center bg-white/5 hover:bg-white/15 backdrop-blur-md border border-white/25 text-white font-medium px-9 py-4 rounded-md text-sm transition-colors"
                >
                  Our Story
                </Link>
              </div>
            </div>

            {/* Live vehicle plate — the actual car on screen */}
            <Link
              href={`/cars/${car.id}`}
              key={`plate-${current}`}
              className="group block animate-fade-in-up rounded-2xl border border-white/15 bg-white/[0.06] backdrop-blur-2xl p-6 md:p-7 shadow-[0_20px_60px_rgba(0,0,0,0.5)] transition-colors hover:bg-white/[0.1] hover:border-white/25"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-white/55 text-xs uppercase tracking-[0.2em] mb-2">On screen now</p>
                  <h2 className="display text-white text-2xl md:text-3xl font-semibold leading-tight">
                    {car.make} {car.model}
                  </h2>
                  <p className="text-white/55 text-sm mt-1">{car.year} · {car.color}</p>
                </div>
                <span className="shrink-0 w-10 h-10 rounded-full border border-white/25 flex items-center justify-center text-white group-hover:bg-white group-hover:text-gray-900 transition-colors">
                  <ArrowUpRight size={18} />
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t border-white/10">
                <Spec icon={<Calendar size={15} />} label="Year" value={String(car.year)} />
                <Spec icon={<Gauge size={15} />} label="Mileage" value={formatMileage(car.mileage)} />
                <Spec icon={<Cog size={15} />} label="Drive" value={car.drivetrain} />
              </div>

              <div className="flex items-end justify-between mt-6">
                <div>
                  <p className="text-white/50 text-xs uppercase tracking-wide">Price</p>
                  <p className="text-white text-3xl font-semibold display">{formatPrice(car.price)}</p>
                </div>
                <span className="text-white/80 text-sm font-medium border-b border-white/40 group-hover:border-white pb-0.5 transition-colors">
                  View this {car.make}
                </span>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Marque marquee */}
      <div className="relative z-10 overflow-hidden border-y border-white/10 py-3.5">
        <div className="flex w-max animate-marquee gap-12 pr-12">
          {[...makes, ...makes].map((m, i) => (
            <span key={i} className="text-white/35 text-sm font-medium uppercase tracking-[0.25em] whitespace-nowrap">
              {m}
            </span>
          ))}
        </div>
      </div>

      {/* ── Search bar ── */}
      <div className="relative z-10 max-w-[95rem] mx-auto w-full px-6 md:px-10 py-8">
        <div className="bg-white/[0.07] backdrop-blur-2xl border border-white/15 text-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.45)] px-4 md:px-6 py-4 grid grid-cols-1 md:grid-cols-[repeat(4,1fr)_auto] gap-2 md:gap-0">
          <Field label="Condition" className="md:border-r border-white/10">
            <select value={condition} onChange={e => setCondition(e.target.value)} className="hero-select">
              <option value="Used Cars" className="text-black">Used Cars</option>
              <option value="New Cars" className="text-black">New Cars</option>
              <option value="All Cars" className="text-black">All Cars</option>
            </select>
          </Field>
          <Field label="Make" className="md:border-r border-white/10">
            <select value={make} onChange={e => setMake(e.target.value)} className="hero-select">
              <option value="" className="text-black">Any Make</option>
              {makes.map(m => <option key={m} value={m} className="text-black">{m}</option>)}
            </select>
          </Field>
          <Field label="Model" className="md:border-r border-white/10">
            <select value={model} onChange={e => setModel(e.target.value)} className="hero-select">
              <option value="" className="text-black">Any Model</option>
              <option value="Civic" className="text-black">Civic</option>
              <option value="Accord" className="text-black">Accord</option>
              <option value="Model 3" className="text-black">Model 3</option>
            </select>
          </Field>
          <Field label="Price" className="md:border-r border-white/10">
            <select value={price} onChange={e => setPrice(e.target.value)} className="hero-select">
              <option className="text-black">All Prices</option>
              <option className="text-black">Under $10k</option>
              <option className="text-black">Under $20k</option>
            </select>
          </Field>
          <div className="flex items-center md:pl-4">
            <Link href={buildSearchUrl()} className="w-full md:w-auto bg-white hover:bg-gray-100 transition-colors text-gray-900 rounded-xl px-8 py-3.5 flex items-center justify-center gap-2 text-sm font-semibold whitespace-nowrap">
              <Search size={16} />
              Search
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function Spec({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div>
      <span className="flex items-center gap-1.5 text-white/45 text-[11px] uppercase tracking-wide mb-1">
        {icon} {label}
      </span>
      <span className="text-white text-sm font-semibold">{value}</span>
    </div>
  );
}

function Field({ label, className = '', children }: { label: string; className?: string; children: React.ReactNode }) {
  return (
    <div className={`px-2 md:px-5 py-1 ${className}`}>
      <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-white/45 mb-1">{label}</span>
      <div className="relative">
        {children}
        <ChevronDown size={14} className="absolute right-0 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none" />
      </div>
    </div>
  );
}

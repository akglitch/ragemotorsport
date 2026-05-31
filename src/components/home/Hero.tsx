'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import { cars } from '@/lib/data';

const makes = [...new Set(cars.map(c => c.make))];

const slides = [
  {
    image: '/tyler-clemmensen-TRKMvwNypQs-unsplash.jpg',
    alt: 'Audi R8 on a mountain road at golden hour',
    title: 'Find Your Perfect Vehicle',
    subtitle: 'Certified, inspected, and delivered to your door.',
  },
  {
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=2000&q=80',
    alt: 'Black Porsche Panamera on the highway',
    title: 'Performance, Without Compromise',
    subtitle: 'A curated selection of premium machines.',
  },
  {
    image: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=2000&q=80',
    alt: 'Yellow Mercedes-AMG GT on an open road',
    title: 'Drive Something Extraordinary',
    subtitle: 'Transparent pricing on every listing.',
  },
];

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const [condition, setCondition] = useState('Used Cars');
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [price, setPrice] = useState('Prices: All Prices');

  const next = useCallback(() => setCurrent(c => (c + 1) % slides.length), []);
  const prev = () => setCurrent(c => (c - 1 + slides.length) % slides.length);

  // Auto-advance every 6s unless paused (hover)
  useEffect(() => {
    if (paused) return;
    const t = setInterval(next, 6000);
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

  return (
    <section
      className="relative w-full min-h-[92vh] flex flex-col overflow-hidden"
      aria-label="Hero"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Slides */}
      {slides.map((slide, i) => (
        <div
          key={i}
          className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
          style={{ opacity: i === current ? 1 : 0 }}
          aria-hidden={i !== current}
        >
          <Image
            src={slide.image}
            alt={slide.alt}
            fill
            priority={i === 0}
            className="object-cover object-center"
            sizes="100vw"
          />
        </div>
      ))}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/10 to-black/45" />

      {/* Arrows */}
      <button onClick={prev} aria-label="Previous slide" className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/15 hover:bg-white/30 backdrop-blur-md border border-white/20 flex items-center justify-center text-white transition-colors">
        <ChevronLeft size={22} />
      </button>
      <button onClick={next} aria-label="Next slide" className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/15 hover:bg-white/30 backdrop-blur-md border border-white/20 flex items-center justify-center text-white transition-colors">
        <ChevronRight size={22} />
      </button>

      {/* Top content (changes per slide) */}
      <div className="relative z-10 text-center px-4 pt-32 md:pt-36">
        <div key={current} className="animate-fade-in-up">
          <h1 className="display text-4xl md:text-6xl font-semibold text-white tracking-tight leading-[1.05]">
            {slides[current].title}
          </h1>
          <p className="text-white/85 text-base md:text-lg mt-3 font-light">
            {slides[current].subtitle}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-7">
          <Link href="/cars" className="w-60 sm:w-44 bg-white hover:bg-gray-100 text-gray-900 font-medium py-3 rounded-md text-sm transition-colors">
            Browse Inventory
          </Link>
          <Link href="/about" className="w-60 sm:w-44 bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/30 text-white font-medium py-3 rounded-md text-sm transition-colors">
            Learn More
          </Link>
        </div>
      </div>

      <div className="flex-1" />

      {/* Dots */}
      <div className="relative z-10 flex justify-center gap-2.5 mb-6">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Go to slide ${i + 1}`}
            aria-current={i === current}
            className={`h-2 rounded-full transition-all duration-300 ${i === current ? 'w-8 bg-white' : 'w-2 bg-white/40 hover:bg-white/70'}`}
          />
        ))}
      </div>

      {/* Search filter bar */}
      <div className="relative z-10 px-4 pb-10">
        <div className="bg-[#0b1221]/95 backdrop-blur-md text-white rounded-2xl w-full max-w-5xl mx-auto px-6 md:px-8 py-5 flex flex-col md:flex-row items-center gap-4 shadow-2xl">

          <div className="flex-1 w-full border-b md:border-b-0 md:border-r border-white/10 pr-4">
            <div className="relative">
              <select value={condition} onChange={e => setCondition(e.target.value)} className="w-full bg-transparent text-sm text-white/90 outline-none appearance-none cursor-pointer py-2">
                <option value="Used Cars" className="text-black">Used Cars</option>
                <option value="New Cars" className="text-black">New Cars</option>
                <option value="All Cars" className="text-black">All Cars</option>
              </select>
              <ChevronDown size={14} className="absolute right-0 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none" />
            </div>
          </div>

          <div className="flex-1 w-full border-b md:border-b-0 md:border-r border-white/10 px-4">
            <div className="relative">
              <select value={make} onChange={e => setMake(e.target.value)} className="w-full bg-transparent text-sm text-white/90 outline-none appearance-none cursor-pointer py-2">
                <option value="" className="text-black">Any Makes</option>
                {makes.map(m => <option key={m} value={m} className="text-black">{m}</option>)}
              </select>
              <ChevronDown size={14} className="absolute right-0 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none" />
            </div>
          </div>

          <div className="flex-1 w-full border-b md:border-b-0 md:border-r border-white/10 px-4">
            <div className="relative">
              <select value={model} onChange={e => setModel(e.target.value)} className="w-full bg-transparent text-sm text-white/90 outline-none appearance-none cursor-pointer py-2">
                <option value="" className="text-black">Any Models</option>
                <option value="Civic" className="text-black">Civic</option>
                <option value="Accord" className="text-black">Accord</option>
                <option value="Model 3" className="text-black">Model 3</option>
              </select>
              <ChevronDown size={14} className="absolute right-0 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none" />
            </div>
          </div>

          <div className="flex-1 w-full px-4">
            <div className="relative">
              <select value={price} onChange={e => setPrice(e.target.value)} className="w-full bg-transparent text-sm text-white/90 outline-none appearance-none cursor-pointer py-2">
                <option value="Prices: All Prices" className="text-black">Prices: All Prices</option>
                <option value="Under $10k" className="text-black">Under $10k</option>
                <option value="Under $20k" className="text-black">Under $20k</option>
              </select>
              <ChevronDown size={14} className="absolute right-0 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none" />
            </div>
          </div>

          <Link href={buildSearchUrl()} className="w-full md:w-auto md:ml-2 bg-white hover:bg-gray-100 transition-colors text-gray-900 rounded-lg px-8 py-3 flex items-center justify-center gap-2 text-sm font-semibold whitespace-nowrap">
            <Search size={16} />
            Search
          </Link>
        </div>
      </div>
    </section>
  );
}

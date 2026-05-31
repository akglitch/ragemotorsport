'use client';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import BackToTop from '@/components/ui/BackToTop';
import { cars } from '@/lib/data';
import { formatPrice, formatMileage } from '@/lib/utils';
import { Car } from '@/lib/types';
import { X, Plus, Check, Minus, BarChart3 } from 'lucide-react';

type SpecRow = {
  label: string;
  get: (c: Car) => string;
  best?: (c: Car, all: Car[]) => boolean;
};

const specRows: SpecRow[] = [
  { label: 'Price', get: c => formatPrice(c.price), best: (c, all) => c.price === Math.min(...all.map(x => x.price)) },
  { label: 'Year', get: c => String(c.year), best: (c, all) => c.year === Math.max(...all.map(x => x.year)) },
  { label: 'Mileage', get: c => formatMileage(c.mileage), best: (c, all) => c.mileage === Math.min(...all.map(x => x.mileage)) },
  { label: 'Condition', get: c => c.condition },
  { label: 'Body Type', get: c => c.category },
  { label: 'Fuel', get: c => c.fuelType },
  { label: 'Transmission', get: c => c.transmission },
  { label: 'Drivetrain', get: c => c.drivetrain },
  { label: 'Engine', get: c => c.engine },
  { label: 'Seats', get: c => `${c.seats} seats` },
  { label: 'Color', get: c => c.color },
  { label: 'Rating', get: c => `${c.rating} / 5`, best: (c, all) => c.rating === Math.max(...all.map(x => x.rating)) },
  { label: 'Location', get: c => c.location },
];

function compareUrl(ids: string[]) {
  return ids.length ? `/compare?ids=${ids.join(',')}` : '/cars';
}

function CompareContent() {
  const searchParams = useSearchParams();
  const ids = (searchParams.get('ids') || '').split(',').map(s => s.trim()).filter(Boolean);
  const selected = ids
    .map(id => cars.find(c => c.id === id))
    .filter((c): c is Car => Boolean(c));

  // Empty / insufficient states
  if (selected.length === 0) {
    return (
      <EmptyState
        title="No vehicles to compare"
        body="Add vehicles to your comparison from the listings page, then view them side by side here."
      />
    );
  }

  const allFeatures = Array.from(new Set(selected.flatMap(c => c.features))).sort();
  const gridStyle = { gridTemplateColumns: `180px repeat(${selected.length}, minmax(230px, 1fr))` };

  return (
    <div className="max-w-[95rem] mx-auto px-6 py-12">
      {/* Header */}
      <nav className="text-sm mb-4 flex items-center gap-2 text-gray-500" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-gray-900 transition-colors">Home</Link>
        <span>/</span>
        <Link href="/cars" className="hover:text-gray-900 transition-colors">Listings</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">Compare</span>
      </nav>

      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
        <div>
          <h1 className="display text-3xl md:text-4xl font-semibold text-gray-900 tracking-tight">Compare vehicles</h1>
          <p className="text-gray-500 mt-2">Comparing {selected.length} {selected.length === 1 ? 'vehicle' : 'vehicles'} side by side.</p>
        </div>
        {selected.length < 3 && (
          <Link href="/cars" className="btn-outline text-sm py-2.5">
            <Plus size={16} /> Add another vehicle
          </Link>
        )}
      </div>

      {selected.length === 1 && (
        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 text-amber-800 text-sm px-4 py-3">
          Add at least one more vehicle to see a side-by-side comparison.
        </div>
      )}

      {/* Comparison grid */}
      <div className="overflow-x-auto rounded-2xl border border-[var(--border)]">
        <div className="grid bg-[var(--surface)]" style={gridStyle}>

          {/* Header row */}
          <div className="sticky left-0 z-10 bg-[var(--surface)] border-b border-r border-[var(--border)] p-5 flex items-end">
            <span className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <BarChart3 size={16} /> Overview
            </span>
          </div>
          {selected.map(car => (
            <div key={car.id} className="border-b border-[var(--border)] p-5">
              <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden mb-4 bg-gray-100">
                <Image src={car.image} alt={`${car.make} ${car.model}`} fill className="object-cover" sizes="240px" />
                <Link
                  href={compareUrl(ids.filter(id => id !== car.id))}
                  aria-label={`Remove ${car.make} ${car.model} from comparison`}
                  className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-gray-700 hover:bg-white hover:text-red-500 transition-colors"
                >
                  <X size={15} />
                </Link>
              </div>
              <h3 className="display font-semibold text-gray-900 leading-tight">{car.year} {car.make} {car.model}</h3>
              <p className="text-xs text-gray-500 mt-0.5 mb-4">{car.location}</p>
              <Link href={`/cars/${car.id}`} className="btn-primary w-full text-sm py-2.5">View details</Link>
            </div>
          ))}

          {/* Spec rows */}
          {specRows.map((row, ri) => (
            <SpecRowCells key={row.label} row={row} cars={selected} striped={ri % 2 === 1} />
          ))}

          {/* Features section header */}
          <div
            className="bg-[var(--surface-2)] border-y border-[var(--border)] px-5 py-3"
            style={{ gridColumn: '1 / -1' }}
          >
            <span className="text-sm font-semibold text-gray-900">Features &amp; Equipment</span>
          </div>

          {/* Feature rows */}
          {allFeatures.map((feature, fi) => (
            <FeatureRowCells key={feature} feature={feature} cars={selected} striped={fi % 2 === 1} />
          ))}
        </div>
      </div>

      <div className="mt-8 flex justify-center">
        <Link href="/cars" className="btn-outline text-sm">Back to listings</Link>
      </div>
    </div>
  );
}

function SpecRowCells({ row, cars: list, striped }: { row: SpecRow; cars: Car[]; striped: boolean }) {
  const cellBg = striped ? 'bg-[var(--surface-2)]' : 'bg-[var(--surface)]';
  return (
    <>
      <div className={`sticky left-0 z-10 ${cellBg} border-b border-r border-[var(--border)] px-5 py-4 text-sm font-medium text-gray-500`}>
        {row.label}
      </div>
      {list.map(car => {
        const isBest = row.best?.(car, list) && list.length > 1;
        return (
          <div key={car.id} className={`${cellBg} border-b border-[var(--border)] px-5 py-4 text-sm`}>
            <span className={isBest ? 'font-semibold text-gray-900' : 'text-gray-800'}>
              {row.get(car)}
            </span>
            {isBest && (
              <span className="ml-2 inline-flex items-center rounded-md bg-emerald-50 text-emerald-700 border border-emerald-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide align-middle">
                Best
              </span>
            )}
          </div>
        );
      })}
    </>
  );
}

function FeatureRowCells({ feature, cars: list, striped }: { feature: string; cars: Car[]; striped: boolean }) {
  const cellBg = striped ? 'bg-[var(--surface-2)]' : 'bg-[var(--surface)]';
  return (
    <>
      <div className={`sticky left-0 z-10 ${cellBg} border-b border-r border-[var(--border)] px-5 py-3.5 text-sm font-medium text-gray-500`}>
        {feature}
      </div>
      {list.map(car => {
        const has = car.features.includes(feature);
        return (
          <div key={car.id} className={`${cellBg} border-b border-[var(--border)] px-5 py-3.5`}>
            {has ? (
              <Check size={17} className="text-gray-900" aria-label="Included" />
            ) : (
              <Minus size={17} className="text-gray-300" aria-label="Not included" />
            )}
          </div>
        );
      })}
    </>
  );
}

function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="max-w-[95rem] mx-auto px-6 py-24">
      <div className="text-center py-16 px-4 rounded-2xl border-2 border-dashed border-[var(--border)] max-w-xl mx-auto">
        <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5 bg-[var(--surface-2)]">
          <BarChart3 size={24} className="text-gray-400" />
        </div>
        <h1 className="display text-2xl font-semibold text-gray-900 mb-2">{title}</h1>
        <p className="text-gray-500 max-w-md mx-auto mb-7">{body}</p>
        <Link href="/cars" className="btn-primary">Browse inventory</Link>
      </div>
    </div>
  );
}

export default function ComparePage() {
  return (
    <>
      <Navbar />
      <main className="flex-grow pt-24 bg-[var(--bg)]" aria-label="Compare vehicles">
        <Suspense fallback={<div className="h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-gray-900 border-t-transparent rounded-full animate-spin" /></div>}>
          <CompareContent />
        </Suspense>
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}

'use client';
import Link from 'next/link';
import { cars } from '@/lib/data';
import CarCard from '@/components/cars/CarCard';
import { useFavorites } from '@/hooks/useFavorites';
import { useCompare } from '@/hooks/useCompare';
import { useToast } from '@/hooks/useToast';
import ToastContainer from '@/components/ui/Toast';
import CarCompareBar from '@/components/ui/CarCompareBar';
import { ArrowRight, Clock } from 'lucide-react';

const classics = cars.filter(c => c.category === 'Vintage').slice(0, 3);

export default function ClassicsSection() {
  const { isFavorite, toggle } = useFavorites();
  const { compareList, isInCompare, addToCompare, removeFromCompare, clearCompare } = useCompare();
  const { toasts, addToast, removeToast } = useToast();

  if (classics.length === 0) return null;

  const handleFavorite = (id: string) => {
    const car = cars.find(c => c.id === id);
    if (!car) return;
    const wasFav = isFavorite(id);
    toggle(id);
    addToast(wasFav ? 'Removed from favorites' : `${car.make} ${car.model} added to favorites!`, wasFav ? 'info' : 'success');
  };

  const handleCompare = (car: (typeof cars)[0]) => {
    if (isInCompare(car.id)) {
      removeFromCompare(car.id);
    } else if (compareList.length >= 3) {
      addToast('You can only compare up to 3 cars at once.', 'error');
    } else {
      addToCompare(car);
      addToast(`${car.make} ${car.model} added to compare.`, 'info');
    }
  };

  return (
    <section className="py-24 px-4 border-t" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }} aria-label="Classic and vintage vehicles">
      <div className="max-w-[95rem] mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-6">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.25em]" style={{ color: 'var(--muted)' }}>
              <Clock size={14} /> Heritage Collection
            </span>
            <h2 className="display text-3xl md:text-5xl font-semibold tracking-tight leading-[1.05] mt-3 mb-4" style={{ color: 'var(--text)' }}>
              Timeless classics
            </h2>
            <p className="text-lg font-light leading-relaxed" style={{ color: 'var(--muted)' }}>
              Lovingly restored icons from a golden era of motoring — numbers-matching, documented, and ready to be driven or collected.
            </p>
          </div>
          <Link href="/cars?category=Vintage" className="group shrink-0 flex items-center gap-2 text-sm font-medium border-b pb-0.5 transition-colors" style={{ color: 'var(--text)', borderColor: 'var(--text)' }}>
            Explore all classics <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {classics.map(car => (
            <CarCard
              key={car.id}
              car={car}
              isFavorite={isFavorite(car.id)}
              onToggleFavorite={handleFavorite}
              isInCompare={isInCompare(car.id)}
              onAddToCompare={handleCompare}
              onRemoveFromCompare={removeFromCompare}
            />
          ))}
        </div>
      </div>

      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <CarCompareBar compareList={compareList} removeFromCompare={removeFromCompare} clearCompare={clearCompare} />
    </section>
  );
}

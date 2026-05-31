'use client';
import { useState } from 'react';
import Link from 'next/link';
import { cars } from '@/lib/data';
import CarCard from '@/components/cars/CarCard';
import { useFavorites } from '@/hooks/useFavorites';
import { useCompare } from '@/hooks/useCompare';
import { useToast } from '@/hooks/useToast';
import ToastContainer from '@/components/ui/Toast';
import CarCompareBar from '@/components/ui/CarCompareBar';
import { ArrowRight } from 'lucide-react';

const featured = cars.slice(0, 6);

export default function FeaturedListings() {
  const { isFavorite, toggle } = useFavorites();
  const { compareList, isInCompare, addToCompare, removeFromCompare, clearCompare } = useCompare();
  const { toasts, addToast, removeToast } = useToast();

  const handleFavorite = (id: string) => {
    const car = cars.find(c => c.id === id);
    if (!car) return;
    const wasFav = isFavorite(id);
    toggle(id);
    addToast(wasFav ? `Removed from favorites` : `${car.make} ${car.model} added to favorites!`, wasFav ? 'info' : 'success');
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
    <section className="py-24 bg-[var(--surface-2)] px-4 border-t border-gray-100" aria-label="Featured car listings">
      <div className="max-w-[95rem] mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <h2 className="display text-3xl md:text-4xl font-semibold text-gray-900 tracking-tight mb-3">Featured inventory</h2>
            <p className="text-gray-500 text-lg font-light">A selection of our finest vehicles, each inspected and ready.</p>
          </div>
          <Link href="/cars" className="group flex items-center gap-2 text-sm font-medium text-gray-900 border-b border-gray-900 pb-0.5 hover:text-gray-500 hover:border-gray-300 transition-colors">
            View all cars <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {featured.map(car => (
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

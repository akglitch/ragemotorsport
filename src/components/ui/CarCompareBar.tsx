'use client';
import { Car } from '@/lib/types';
import { formatPrice } from '@/lib/utils';
import { X, BarChart3, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface Props {
  compareList: Car[];
  removeFromCompare: (id: string) => void;
  clearCompare: () => void;
}

export default function CarCompareBar({ compareList, removeFromCompare, clearCompare }: Props) {
  if (compareList.length === 0) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40 border-t shadow-2xl animate-fade-in-up"
      style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
      role="region"
      aria-label="Car comparison bar"
    >
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <BarChart3 size={18} style={{ color: 'var(--accent)' }} />
            <span className="text-sm font-bold" style={{ color: 'var(--text)' }}>
              Compare ({compareList.length}/3)
            </span>
          </div>

          <div className="flex-1 flex items-center gap-3 overflow-x-auto">
            {compareList.map(car => (
              <div
                key={car.id}
                className="flex items-center gap-2 px-3 py-2 rounded-xl flex-shrink-0"
                style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}
              >
                <div className="relative w-12 h-8 rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src={car.image}
                    alt={`${car.make} ${car.model}`}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="text-xs font-semibold" style={{ color: 'var(--text)' }}>
                    {car.make} {car.model}
                  </p>
                  <p className="text-xs font-bold" style={{ color: 'var(--accent)' }}>
                    {formatPrice(car.price)}
                  </p>
                </div>
                <button
                  onClick={() => removeFromCompare(car.id)}
                  className="p-1 rounded-full hover:bg-red-100 transition-colors ml-1"
                  aria-label={`Remove ${car.make} ${car.model} from comparison`}
                >
                  <X size={12} className="text-red-500" />
                </button>
              </div>
            ))}

            {/* Empty slots */}
            {Array.from({ length: 3 - compareList.length }).map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-center w-36 h-14 rounded-xl border-2 border-dashed flex-shrink-0 text-xs"
                style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}
              >
                + Add car
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {compareList.length >= 2 && (
              <Link
                href={`/compare?ids=${compareList.map(c => c.id).join(',')}`}
                className="btn-primary text-sm py-2 px-4"
              >
                Compare Now <ArrowRight size={14} />
              </Link>
            )}
            <button
              onClick={clearCompare}
              className="text-sm px-4 py-2 rounded-xl border transition-colors"
              style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}
            >
              Clear
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

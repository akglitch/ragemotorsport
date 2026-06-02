'use client';
import { Car } from '@/lib/types';
import { formatPrice, formatMileage } from '@/lib/utils';
import { Heart, MapPin, Star, BarChart2, Eye } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface CarCardProps {
  car: Car;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  isInCompare: boolean;
  onAddToCompare: (car: Car) => void;
  onRemoveFromCompare: (id: string) => void;
}

const conditionColors: Record<string, string> = {
  New: 'badge-green',
  Used: 'badge-blue',
  Certified: 'badge-orange',
  Salvage: 'badge-red',
};

export default function CarCard({
  car,
  isFavorite,
  onToggleFavorite,
  isInCompare,
  onAddToCompare,
  onRemoveFromCompare,
}: CarCardProps) {
  return (
    <article className="card group" aria-label={`${car.year} ${car.make} ${car.model}`}>
      {/* Image */}
      <div className="relative overflow-hidden" style={{ height: '220px' }}>
        <Image
          src={car.image}
          alt={`${car.year} ${car.make} ${car.model}`}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent" />

        {/* Top badges */}
        <div className="absolute top-3 left-3 flex gap-1.5">
          {car.badge ? (
            <span className="badge text-white" style={{ background: 'var(--ink)' }}>
              {car.badge}
            </span>
          ) : (
            <span className={`badge ${conditionColors[car.condition]}`}>
              {car.condition}
            </span>
          )}
        </div>

        {/* Favorite button */}
        <button
          onClick={() => onToggleFavorite(car.id)}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 backdrop-blur-md ${
            isFavorite
              ? 'bg-white text-red-500 scale-110 shadow-md'
              : 'bg-white/80 text-gray-600 hover:text-red-500 hover:scale-110'
          }`}
          aria-label={isFavorite ? `Remove ${car.make} ${car.model} from favorites` : `Add ${car.make} ${car.model} to favorites`}
          aria-pressed={isFavorite}
        >
          <Heart size={15} fill={isFavorite ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Title + price */}
        <div className="flex items-start justify-between gap-3 mb-1">
          <h3 className="text-[1.05rem] font-semibold leading-tight display" style={{ color: 'var(--text)' }}>
            {car.year} {car.make} {car.model}
          </h3>
        </div>
        <div className="flex items-center gap-1.5 mb-4">
          <MapPin size={12} style={{ color: 'var(--muted)' }} />
          <span className="text-xs" style={{ color: 'var(--muted)' }}>{car.location}</span>
          <span className="text-xs ml-auto flex items-center gap-1" style={{ color: 'var(--muted)' }}>
            <Star size={12} className="stars" fill="currentColor" />
            <span style={{ color: 'var(--text)' }} className="font-medium">{car.rating}</span>
          </span>
        </div>

        {/* Specs row */}
        <div className="grid grid-cols-3 gap-2 py-3 mb-4 border-y" style={{ borderColor: 'var(--border)' }}>
          <div>
            <p className="text-[11px] mb-0.5" style={{ color: 'var(--muted)' }}>Mileage</p>
            <p className="text-xs font-semibold" style={{ color: 'var(--text)' }}>
              {formatMileage(car.mileage)}
            </p>
          </div>
          <div>
            <p className="text-[11px] mb-0.5" style={{ color: 'var(--muted)' }}>Fuel</p>
            <p className="text-xs font-semibold" style={{ color: 'var(--text)' }}>{car.fuelType}</p>
          </div>
          <div>
            <p className="text-[11px] mb-0.5" style={{ color: 'var(--muted)' }}>Transmission</p>
            <p className="text-xs font-semibold" style={{ color: 'var(--text)' }}>
              {car.transmission === 'Automatic' ? 'Auto' : 'Manual'}
            </p>
          </div>
        </div>

        {/* Price + actions */}
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] leading-none mb-1" style={{ color: 'var(--muted)' }}>Price</p>
            <p className="text-xl font-semibold leading-none" style={{ color: 'var(--text)' }}>
              {formatPrice(car.price)}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() =>
                isInCompare ? onRemoveFromCompare(car.id) : onAddToCompare(car)
              }
              className="p-2.5 rounded-lg border transition-all duration-200"
              style={{
                background: isInCompare ? 'var(--ink)' : 'transparent',
                borderColor: isInCompare ? 'var(--ink)' : 'var(--border)',
                color: isInCompare ? 'white' : 'var(--muted)',
              }}
              aria-label={isInCompare ? 'Remove from comparison' : 'Add to comparison'}
              aria-pressed={isInCompare}
            >
              <BarChart2 size={16} />
            </button>
            <Link
              href={`/cars/${car.id}`}
              className="btn-primary text-sm py-2.5 px-5"
              aria-label={`View details for ${car.make} ${car.model}`}
            >
              <Eye size={14} />
              Details
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

'use client';
import Image from 'next/image';
import Link from 'next/link';
import { cars } from '@/lib/data';
import { formatPrice } from '@/lib/utils';
import { useUser } from '@/context/UserContext';
import { Crown, Lock, ArrowRight, Star } from 'lucide-react';

const vaultCars = cars.filter(c => c.isVault).slice(0, 3);

export default function PremiumVault() {
  const { isPremium, hydrated, openSubscribe } = useUser();
  const unlocked = hydrated && isPremium;

  return (
    <section className="py-24 px-4 vault-surface" aria-label="Premium Vault exclusive vehicles">
      <div className="max-w-[95rem] mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-6">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.25em]" style={{ color: 'var(--gold)' }}>
              <Crown size={14} /> Premium Vault
            </span>
            <h2 className="display text-3xl md:text-5xl font-semibold tracking-tight leading-[1.05] mt-3 mb-4" style={{ color: '#f5f3ec' }}>
              The collection few ever see
            </h2>
            <p className="text-lg font-light leading-relaxed" style={{ color: 'rgba(245,243,236,0.65)' }}>
              A curated reserve of the rarest vehicles in our inventory — unlocked exclusively for Premium members.
            </p>
          </div>
          {unlocked ? (
            <Link href="/cars?vault=1" className="group shrink-0 inline-flex items-center gap-2 text-sm font-medium border-b pb-0.5 transition-colors" style={{ color: 'var(--gold)', borderColor: 'var(--gold)' }}>
              Browse the Vault <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          ) : (
            <button onClick={openSubscribe} className="btn-gold shrink-0">
              <Crown size={16} /> Unlock the Vault — $19.99/mo
            </button>
          )}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {vaultCars.map(car => (
            <article key={car.id} className="rounded-2xl overflow-hidden vault-card group">
              {/* Image */}
              <div className="relative" style={{ height: '230px' }}>
                <Image
                  src={car.image}
                  alt={unlocked ? `${car.year} ${car.make} ${car.model}` : 'Exclusive Vault vehicle'}
                  fill
                  className={`object-cover transition-all duration-700 ${unlocked ? 'group-hover:scale-105' : 'blur-md scale-110'}`}
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(11,13,18,0.85), transparent 60%)' }} />

                {/* Members Only badge */}
                <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold uppercase tracking-wide badge-gold backdrop-blur-sm">
                  <Crown size={12} /> Members Only
                </span>

                {!unlocked && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'rgba(var(--gold-rgb),0.18)', border: '1px solid var(--vault-border)' }}>
                      <Lock size={20} style={{ color: 'var(--gold)' }} />
                    </div>
                  </div>
                )}
              </div>

              {/* Body */}
              <div className="p-5">
                {unlocked ? (
                  <>
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h3 className="text-[1.05rem] font-semibold leading-tight display" style={{ color: '#f5f3ec' }}>
                        {car.year} {car.make} {car.model}
                      </h3>
                      <span className="inline-flex items-center gap-1 text-xs" style={{ color: 'var(--gold)' }}>
                        <Star size={12} fill="currentColor" /> {car.rating}
                      </span>
                    </div>
                    <p className="text-2xl font-black mb-4" style={{ color: '#f5f3ec', fontFamily: 'var(--font-jakarta)' }}>{formatPrice(car.price)}</p>
                    <Link href={`/cars/${car.id}`} className="btn-gold w-full justify-center py-2.5 text-sm">
                      View Vehicle <ArrowRight size={14} />
                    </Link>
                  </>
                ) : (
                  <>
                    <div className="h-4 w-2/3 rounded mb-3" style={{ background: 'rgba(245,243,236,0.12)' }} />
                    <div className="h-7 w-1/3 rounded mb-4" style={{ background: 'rgba(245,243,236,0.12)' }} />
                    <button onClick={openSubscribe} className="btn-gold w-full justify-center py-2.5 text-sm">
                      <Lock size={14} /> Subscribe to Unlock
                    </button>
                  </>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

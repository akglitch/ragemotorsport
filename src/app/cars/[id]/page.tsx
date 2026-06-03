'use client';
import { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { cars } from '@/lib/data';
import { formatPrice, formatMileage } from '@/lib/utils';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ImageGallery from '@/components/detail/ImageGallery';
import PriceSummary from '@/components/detail/PriceSummary';
import SellerInfo from '@/components/detail/SellerInfo';
import ContactModal from '@/components/detail/ContactModal';
import CheckoutModal from '@/components/checkout/CheckoutModal';
import CarCard from '@/components/cars/CarCard';
import CarCompareBar from '@/components/ui/CarCompareBar';
import ToastContainer from '@/components/ui/Toast';
import BackToTop from '@/components/ui/BackToTop';
import { useFavorites } from '@/hooks/useFavorites';
import { useCompare } from '@/hooks/useCompare';
import { useToast } from '@/hooks/useToast';
import { useUser } from '@/context/UserContext';
import { Calendar, Gauge, Fuel, Settings, Zap, MapPin, CheckCircle, Heart, Share2, AlertCircle, Lock, Crown } from 'lucide-react';

export default function CarDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  
  const [showContact, setShowContact] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const { isFavorite, toggle } = useFavorites();
  const { compareList, isInCompare, addToCompare, removeFromCompare, clearCompare } = useCompare();
  const { toasts, addToast, removeToast } = useToast();
  const { isPremium, openSubscribe } = useUser();

  if (!mounted) return null; // Avoid hydration mismatch on favorites

  const car = cars.find(c => c.id === id);
  if (!car) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center pt-16">
          <div className="text-center">
            <AlertCircle size={48} className="mx-auto mb-4 text-red-500" />
            <h1 className="text-2xl font-bold mb-2">Car Not Found</h1>
            <p className="text-slate-500 mb-6">The vehicle you are looking for does not exist or has been sold.</p>
            <button onClick={() => router.push('/cars')} className="btn-primary">Browse All Cars</button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const similarCars = cars
    .filter(c => c.id !== car.id && (c.category === car.category || c.make === car.make))
    .slice(0, 4);

  // Vault cars are gated for non-premium users — blur media, hide price/specs.
  const locked = !!car.isVault && !isPremium;

  const handleFavorite = () => {
    const wasFav = isFavorite(car.id);
    toggle(car.id);
    addToast(wasFav ? 'Removed from favorites' : 'Saved to favorites!', wasFav ? 'info' : 'success');
  };

  const handleCompare = () => {
    if (isInCompare(car.id)) {
      removeFromCompare(car.id);
    } else if (compareList.length >= 3) {
      addToast('Compare list full (max 3)', 'error');
    } else {
      addToCompare(car);
      addToast('Added to compare', 'success');
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    addToast('Link copied to clipboard!', 'success');
  };

  const conditionColors: Record<string, string> = {
    New: 'badge-green', Used: 'badge-blue', Certified: 'badge-orange', Salvage: 'badge-red',
  };

  return (
    <>
      <Navbar />
      <main className="flex-grow pt-16 bg-[var(--bg)]" aria-label="Car details">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Breadcrumb & Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <nav className="text-sm flex items-center gap-2" style={{ color: 'var(--muted)' }}>
              <Link href="/" className="hover:text-[var(--text)] transition-colors">Home</Link>
              <span>/</span>
              <Link href="/cars" className="hover:text-[var(--text)] transition-colors">Cars</Link>
              <span>/</span>
              <span style={{ color: 'var(--text)' }} className="font-medium truncate max-w-[150px] sm:max-w-none">
                {car.year} {car.make} {car.model}
              </span>
            </nav>
            <div className="flex items-center gap-2">
              <button onClick={handleCopyLink} className="p-2 rounded-xl border hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm" style={{ borderColor: 'var(--border)', color: 'var(--text)' }}>
                <Share2 size={16} /> <span className="hidden sm:inline">Share</span>
              </button>
              <button onClick={handleFavorite} className={`p-2 rounded-xl border transition-colors flex items-center gap-2 text-sm ${isFavorite(car.id) ? 'bg-red-50 border-red-200 text-red-500' : 'hover:bg-gray-50'}`} style={{ borderColor: isFavorite(car.id) ? '' : 'var(--border)', color: isFavorite(car.id) ? '' : 'var(--text)' }}>
                <Heart size={16} fill={isFavorite(car.id) ? 'currentColor' : 'none'} /> <span className="hidden sm:inline">{isFavorite(car.id) ? 'Saved' : 'Save'}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Images & Details */}
            <div className="lg:col-span-2 space-y-8">
              {/* Images */}
              {locked ? (
                <div className="relative rounded-2xl overflow-hidden" style={{ height: '420px' }}>
                  <div className="absolute inset-0 blur-xl scale-110 pointer-events-none">
                    <ImageGallery images={car.images} alt="Exclusive Vault vehicle" />
                  </div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6" style={{ background: 'linear-gradient(to top, rgba(11,13,18,0.92), rgba(11,13,18,0.55))' }}>
                    <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ background: 'rgba(var(--gold-rgb),0.18)', border: '1px solid var(--vault-border)' }}>
                      <Lock size={28} style={{ color: 'var(--gold)' }} />
                    </div>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold uppercase tracking-wide badge-gold mb-3">
                      <Crown size={13} /> Members Only
                    </span>
                    <p className="text-lg font-bold" style={{ color: '#f5f3ec', fontFamily: 'var(--font-jakarta)' }}>This vehicle is locked</p>
                    <p className="text-sm mt-1" style={{ color: 'rgba(245,243,236,0.65)' }}>Join Premium to reveal photos, specs &amp; price</p>
                  </div>
                </div>
              ) : (
                <ImageGallery images={car.images} alt={`${car.year} ${car.make} ${car.model}`} />
              )}

              {/* Title & Price mobile view */}
              <div className="lg:hidden">
                <div className="flex items-center gap-2 mb-2">
                  {car.isVault ? (
                    <span className="badge badge-gold text-xs inline-flex items-center gap-1">
                      {isPremium ? <><Crown size={11} /> Premium Member</> : <><Lock size={11} /> Premium</>}
                    </span>
                  ) : (
                    <span className={`badge ${conditionColors[car.condition]} text-xs`}>{car.condition}</span>
                  )}
                  {car.badge && !car.isVault && <span className="badge bg-[var(--accent)] text-white text-xs">{car.badge}</span>}
                </div>
                <h1 className="text-3xl font-black mb-2" style={{ color: 'var(--text)', fontFamily: 'var(--font-jakarta)' }}>
                  {car.year} {car.make} {car.model}
                </h1>
                <div className="text-3xl font-black mb-4" style={{ color: 'var(--accent)' }}>
                  {locked ? '???' : formatPrice(car.price)}
                </div>
                {locked ? (
                  <button onClick={openSubscribe} className="btn-gold w-full justify-center py-3 mb-2 text-base">
                    <Crown size={16} /> Unlock — Join Premium $19.99/mo
                  </button>
                ) : (
                  <button onClick={() => setShowCheckout(true)} className="btn-primary w-full justify-center py-3 mb-2 text-lg">
                    Proceed to Checkout
                  </button>
                )}
              </div>

              {/* Overview Specs */}
              <div className={`grid grid-cols-2 sm:grid-cols-4 gap-4 ${locked ? 'blur-md pointer-events-none select-none' : ''}`}>
                {[
                  { icon: <Calendar size={18} />, label: 'Year', val: car.year },
                  { icon: <Gauge size={18} />, label: 'Mileage', val: formatMileage(car.mileage) },
                  { icon: <Fuel size={18} />, label: 'Fuel', val: car.fuelType },
                  { icon: <Settings size={18} />, label: 'Transmission', val: car.transmission },
                ].map(spec => (
                  <div key={spec.label} className="p-4 rounded-2xl flex flex-col items-center justify-center text-center" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                    <div className="mb-2" style={{ color: 'var(--accent)' }}>{spec.icon}</div>
                    <p className="text-xs mb-1" style={{ color: 'var(--muted)' }}>{spec.label}</p>
                    <p className="text-sm font-bold" style={{ color: 'var(--text)' }}>{spec.val}</p>
                  </div>
                ))}
              </div>

              {/* Description */}
              <section className={`rounded-2xl p-6 ${locked ? 'blur-md pointer-events-none select-none' : ''}`} style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text)', fontFamily: 'var(--font-jakarta)' }}>Overview</h2>
                <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: 'var(--muted)' }}>
                  {car.description}
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 mt-6 pt-6 border-t" style={{ borderColor: 'var(--border)' }}>
                  {[
                    { l: 'Engine', v: car.engine },
                    { l: 'Drivetrain', v: car.drivetrain },
                    { l: 'Exterior Color', v: car.color },
                    { l: 'Seating', v: `${car.seats} Seats` },
                  ].map(row => (
                    <div key={row.l} className="flex gap-4 text-sm">
                      <span className="w-24 font-medium" style={{ color: 'var(--muted)' }}>{row.l}</span>
                      <span className="font-semibold" style={{ color: 'var(--text)' }}>{row.v}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Features List */}
              <section className={`rounded-2xl p-6 ${locked ? 'blur-md pointer-events-none select-none' : ''}`} style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text)', fontFamily: 'var(--font-jakarta)' }}>Features &amp; Options</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {car.features.map(f => (
                    <div key={f} className="flex items-center gap-2 text-sm" style={{ color: 'var(--text)' }}>
                      <CheckCircle size={16} className="text-emerald-500" />
                      {f}
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Right Column: Sticky Sidebar */}
            <div className="space-y-6">
              <div className="sticky top-24 space-y-6">
                {/* Desktop Title & Actions */}
                <div className="hidden lg:block rounded-2xl p-6" style={{ background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--card-shadow)' }}>
                  <div className="flex items-center gap-2 mb-3">
                    {car.isVault ? (
                      <span className="badge badge-gold text-xs inline-flex items-center gap-1"><Lock size={11} /> Premium</span>
                    ) : (
                      <span className={`badge ${conditionColors[car.condition]} text-xs`}>{car.condition}</span>
                    )}
                    {car.isVault && isPremium && (
                      <span className="badge badge-gold text-xs inline-flex items-center gap-1"><Crown size={11} /> Premium Member</span>
                    )}
                    {car.badge && !car.isVault && <span className="badge bg-[var(--accent)] text-white text-xs">{car.badge}</span>}
                  </div>
                  <h1 className="text-2xl font-black mb-2 leading-tight" style={{ color: 'var(--text)', fontFamily: 'var(--font-jakarta)' }}>
                    {car.year} {car.make} {car.model}
                  </h1>
                  <div className="text-3xl font-black mb-6" style={{ color: 'var(--accent)' }}>
                    {locked ? '???' : formatPrice(car.price)}
                  </div>

                  {locked ? (
                    <>
                      <button onClick={openSubscribe} className="btn-gold w-full justify-center py-3 mb-3 text-base shadow-lg">
                        <Crown size={16} /> Unlock This Car → Join Premium $19.99/mo
                      </button>
                      <p className="text-xs text-center" style={{ color: 'var(--muted)' }}>
                        7-day free trial · cancel anytime
                      </p>
                    </>
                  ) : (
                    <>
                      <button onClick={() => setShowCheckout(true)} className="btn-primary w-full justify-center py-3 mb-3 text-base shadow-lg hover:-translate-y-1 transition-transform">
                        Proceed to Checkout
                      </button>
                      <button onClick={handleCompare} className="btn-outline w-full justify-center py-3 text-sm">
                        {isInCompare(car.id) ? 'Remove from Compare' : 'Add to Compare'}
                      </button>
                    </>
                  )}
                </div>

                {!locked && <PriceSummary car={car} />}
                <SellerInfo seller={car.seller} onContact={() => setShowContact(true)} />
              </div>
            </div>
          </div>

          {/* Similar Cars */}
          {similarCars.length > 0 && (
            <div className="mt-16 pt-10 border-t" style={{ borderColor: 'var(--border)' }}>
              <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text)', fontFamily: 'var(--font-jakarta)' }}>Similar Vehicles</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {similarCars.map(c => (
                  <CarCard
                    key={c.id} car={c}
                    isFavorite={isFavorite(c.id)} onToggleFavorite={() => { toggle(c.id); addToast('Favorites updated', 'info'); }}
                    isInCompare={isInCompare(c.id)} onAddToCompare={c => { addToCompare(c); addToast('Added to compare', 'success'); }}
                    onRemoveFromCompare={removeFromCompare}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
      <BackToTop />
      
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <CarCompareBar compareList={compareList} removeFromCompare={removeFromCompare} clearCompare={clearCompare} />
      
      {showContact && <ContactModal car={car} onClose={() => setShowContact(false)} />}
      {showCheckout && <CheckoutModal car={car} onClose={() => setShowCheckout(false)} />}
    </>
  );
}

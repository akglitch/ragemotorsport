'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import FilterSidebar, { FilterDrawer, activeFilterCount } from '@/components/cars/FilterSidebar';
import SortDropdown from '@/components/cars/SortDropdown';
import CarCard from '@/components/cars/CarCard';
import CarCompareBar from '@/components/ui/CarCompareBar';
import ToastContainer from '@/components/ui/Toast';
import BackToTop from '@/components/ui/BackToTop';
import { useFavorites } from '@/hooks/useFavorites';
import { useCompare } from '@/hooks/useCompare';
import { useToast } from '@/hooks/useToast';
import { useAllCars } from '@/hooks/useAllCars';
import { FilterState, SortOption } from '@/lib/types';
import { FilterX, SlidersHorizontal } from 'lucide-react';
import Link from 'next/link';

function CarsContent() {
  const searchParams = useSearchParams();
  const initCategory = searchParams.get('category') || '';
  const initSearch = searchParams.get('search') || '';
  const initMake = searchParams.get('make') || '';
  const initCondition = searchParams.get('condition') || '';
  const initFuel = searchParams.get('fuel') || '';
  const initVault = searchParams.get('vault') === '1';
  const showFavs = searchParams.get('favorites') === 'true';

  const currentYear = new Date().getFullYear();

  const [filters, setFilters] = useState<FilterState>({
    priceMin: 0,
    priceMax: 150000,
    makes: initMake ? [initMake] : [],
    fuelTypes: initFuel ? [initFuel] : [],
    transmissions: [],
    seats: [],
    yearMin: 1960,
    yearMax: currentYear + 1,
    conditions: initCondition ? [initCondition] : [],
    categories: initCategory ? [initCategory] : [],
    vaultOnly: initVault,
    search: initSearch,
  });

  const [sort, setSort] = useState<SortOption>('year-desc');
  const [page, setPage] = useState(1);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const itemsPerPage = 6;

  const resetFilters = () => setFilters({
    priceMin: 0, priceMax: 150000, makes: [], fuelTypes: [],
    transmissions: [], seats: [], yearMin: 1960, yearMax: currentYear + 1,
    conditions: [], categories: [], vaultOnly: false, search: '',
  });

  const { cars } = useAllCars();
  const { isFavorite, toggle, favorites } = useFavorites();
  const { compareList, isInCompare, addToCompare, removeFromCompare, clearCompare } = useCompare();
  const { toasts, addToast, removeToast } = useToast();

  const handleFavorite = (id: string) => {
    const car = cars.find(c => c.id === id);
    if (!car) return;
    const wasFav = isFavorite(id);
    toggle(id);
    addToast(wasFav ? `Removed from favorites` : `${car.make} ${car.model} saved!`, wasFav ? 'info' : 'success');
  };

  const handleCompare = (car: (typeof cars)[0]) => {
    if (isInCompare(car.id)) {
      removeFromCompare(car.id);
    } else if (compareList.length >= 3) {
      addToast('Compare list full (max 3)', 'error');
    } else {
      addToCompare(car);
      addToast(`Added to compare`, 'success');
    }
  };

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [filters, sort]);

  // Lock body scroll while the mobile filter drawer is open
  useEffect(() => {
    if (!drawerOpen) return;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [drawerOpen]);

  // Filtering
  const filtered = cars.filter(car => {
    if (showFavs && !favorites.includes(car.id)) return false;
    if (filters.vaultOnly && !car.isVault) return false;
    if (filters.categories.length > 0 && !filters.categories.includes(car.category)) return false;

    if (filters.search) {
      const q = filters.search.toLowerCase();
      if (!car.make.toLowerCase().includes(q) && !car.model.toLowerCase().includes(q)) return false;
    }
    if (car.price < filters.priceMin || car.price > filters.priceMax) return false;
    if (car.year < filters.yearMin || car.year > filters.yearMax) return false;
    if (filters.makes.length > 0 && !filters.makes.includes(car.make)) return false;
    if (filters.fuelTypes.length > 0 && !filters.fuelTypes.includes(car.fuelType)) return false;
    if (filters.transmissions.length > 0 && !filters.transmissions.includes(car.transmission)) return false;
    if (filters.conditions.length > 0 && !filters.conditions.includes(car.condition)) return false;
    if (filters.seats.length > 0) {
      if (filters.seats.includes('7') && car.seats < 7) return false;
      if (!filters.seats.includes('7') && !filters.seats.includes(car.seats.toString())) return false;
    }
    return true;
  });

  // Sorting
  const sorted = [...filtered].sort((a, b) => {
    switch (sort) {
      case 'price-asc': return a.price - b.price;
      case 'price-desc': return b.price - a.price;
      case 'year-asc': return a.year - b.year;
      case 'year-desc': return b.year - a.year;
      case 'mileage-asc': return a.mileage - b.mileage;
      default: return 0;
    }
  });

  const paginated = sorted.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  const totalPages = Math.ceil(sorted.length / itemsPerPage);
  const activeCount = activeFilterCount(filters);

  return (
    <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto px-4 py-8">
      {/* Sidebar — desktop only */}
      <div className="hidden lg:block w-72 flex-shrink-0">
        <FilterSidebar
          filters={filters}
          onChange={setFilters}
          onReset={resetFilters}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b" style={{ borderColor: 'var(--border)' }}>
          <div>
            <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--text)', fontFamily: 'var(--font-jakarta)' }}>
              {showFavs ? 'Your Favorites' : filters.categories.length === 1 ? `${filters.categories[0]} Vehicles` : 'All Vehicles'}
            </h1>
            <p className="text-sm" style={{ color: 'var(--muted)' }}>
              Showing {sorted.length} {sorted.length === 1 ? 'vehicle' : 'vehicles'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Mobile filter trigger */}
            <button
              onClick={() => setDrawerOpen(true)}
              className="lg:hidden inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors"
              style={{ borderColor: 'var(--border)', color: 'var(--text)', background: 'var(--surface)' }}
              aria-label="Open filters"
            >
              <SlidersHorizontal size={15} />
              Filters
              {activeCount > 0 && (
                <span className="min-w-5 h-5 px-1.5 rounded-full text-[11px] font-bold flex items-center justify-center text-white" style={{ background: 'var(--ink)' }}>
                  {activeCount}
                </span>
              )}
            </button>
            <SortDropdown value={sort} onChange={setSort} />
          </div>
        </div>

        {/* Breadcrumb */}
        <nav className="text-sm mb-6 flex items-center gap-2" style={{ color: 'var(--muted)' }} aria-label="Breadcrumb">
          <Link href="/" className="hover:text-[var(--text)] transition-colors">Home</Link>
          <span>/</span>
          <span style={{ color: 'var(--text)' }} className="font-medium">Browse Cars</span>
        </nav>

        {/* Grid */}
        {sorted.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mb-10">
              {paginated.map(car => (
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

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 rounded-xl text-sm font-semibold border disabled:opacity-50 transition-colors"
                  style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`w-10 h-10 rounded-xl text-sm font-semibold transition-all`}
                    style={{
                      background: page === i + 1 ? 'var(--accent)' : 'transparent',
                      color: page === i + 1 ? 'white' : 'var(--text)',
                      border: page === i + 1 ? 'none' : '1px solid var(--border)'
                    }}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 rounded-xl text-sm font-semibold border disabled:opacity-50 transition-colors"
                  style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20 px-4 rounded-2xl border-2 border-dashed" style={{ borderColor: 'var(--border)' }}>
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'var(--bg)' }}>
              <FilterX size={24} style={{ color: 'var(--muted)' }} />
            </div>
            <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text)' }}>No vehicles found</h3>
            <p className="text-sm max-w-md mx-auto" style={{ color: 'var(--muted)' }}>
              We couldn&apos;t find any cars matching your current filters. Try adjusting your price range, year, or clearing some options.
            </p>
          </div>
        )}
      </div>

      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <CarCompareBar compareList={compareList} removeFromCompare={removeFromCompare} clearCompare={clearCompare} />

      <FilterDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        filters={filters}
        onChange={setFilters}
        onReset={resetFilters}
        resultCount={sorted.length}
      />
    </div>
  );
}

export default function CarsPage() {
  return (
    <>
      <Navbar />
      <main className="flex-grow pt-16 bg-[var(--bg)]" aria-label="Cars list">
        <Suspense fallback={<div className="h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-[var(--accent)] border-t-transparent rounded-full animate-spin"/></div>}>
          <CarsContent />
        </Suspense>
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}

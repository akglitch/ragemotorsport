'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Pencil, Trash2, Copy, Crown, Car as CarIcon, Loader2 } from 'lucide-react';
import { Car } from '@/lib/types';
import { getAllCars, deleteCar, isAdminCar } from '@/lib/carStore';
import { formatPrice } from '@/lib/utils';
import { useToast } from '@/hooks/useToast';
import ToastContainer from '@/components/ui/Toast';

export default function AdminDashboard() {
  const [cars, setCars] = useState<Car[] | null>(null);
  const { toasts, addToast, removeToast } = useToast();

  const load = useCallback(async () => {
    setCars(await getAllCars());
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (car: Car) => {
    if (!confirm(`Delete ${car.year} ${car.make} ${car.model}? This cannot be undone.`)) return;
    await deleteCar(car.id);
    addToast('Listing deleted.', 'info');
    load();
  };

  const adminCount = cars?.filter(c => isAdminCar(c.id)).length ?? 0;
  const vaultCount = cars?.filter(c => c.isVault).length ?? 0;

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black" style={{ color: 'var(--text)', fontFamily: 'var(--font-jakarta)' }}>Inventory</h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>Manage and upload vehicle listings.</p>
        </div>
        <Link href="/admin/new" className="btn-primary">
          <Plus size={16} /> Add vehicle
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Total listings', value: cars?.length ?? '—', icon: <CarIcon size={16} /> },
          { label: 'Your uploads', value: adminCount, icon: <Plus size={16} /> },
          { label: 'Vault exclusives', value: vaultCount, icon: <Crown size={16} style={{ color: 'var(--gold)' }} /> },
        ].map(s => (
          <div key={s.label} className="rounded-2xl p-4" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
            <div className="flex items-center gap-1.5 text-xs mb-1" style={{ color: 'var(--muted)' }}>{s.icon} {s.label}</div>
            <p className="text-2xl font-black" style={{ color: 'var(--text)' }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      {cars === null ? (
        <div className="flex items-center justify-center py-20" style={{ color: 'var(--muted)' }}>
          <Loader2 size={22} className="animate-spin" />
        </div>
      ) : (
        <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: 'var(--surface-2)' }}>
                <th className="text-left font-semibold px-4 py-3" style={{ color: 'var(--text)' }}>Vehicle</th>
                <th className="text-left font-semibold px-4 py-3 hidden sm:table-cell" style={{ color: 'var(--text)' }}>Price</th>
                <th className="text-left font-semibold px-4 py-3 hidden md:table-cell" style={{ color: 'var(--text)' }}>Condition</th>
                <th className="text-right font-semibold px-4 py-3" style={{ color: 'var(--text)' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cars.map(car => {
                const editable = isAdminCar(car.id);
                return (
                  <tr key={car.id} style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)' }}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative w-14 h-10 rounded-lg overflow-hidden flex-shrink-0" style={{ background: 'var(--surface-2)' }}>
                          {car.image && <Image src={car.image} alt="" fill className="object-cover" sizes="56px" unoptimized />}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold truncate flex items-center gap-1.5" style={{ color: 'var(--text)' }}>
                            {car.year} {car.make} {car.model}
                            {car.isVault && <Crown size={13} style={{ color: 'var(--gold)' }} />}
                          </p>
                          <p className="text-xs" style={{ color: 'var(--muted)' }}>
                            {editable ? 'Your upload' : 'Seed listing'} · {car.category}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell" style={{ color: 'var(--text)' }}>{formatPrice(car.price)}</td>
                    <td className="px-4 py-3 hidden md:table-cell" style={{ color: 'var(--muted)' }}>{car.condition}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/admin/edit/${car.id}`}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors"
                          style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
                        >
                          {editable ? <><Pencil size={13} /> Edit</> : <><Copy size={13} /> Duplicate</>}
                        </Link>
                        {editable && (
                          <button
                            onClick={() => handleDelete(car)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors hover:bg-rose-50 hover:border-rose-200 hover:text-rose-600"
                            style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}
                            aria-label="Delete listing"
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
}

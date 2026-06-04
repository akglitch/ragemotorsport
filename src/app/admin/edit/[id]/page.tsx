'use client';
import { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Car } from '@/lib/types';
import { getCar, isAdminCar } from '@/lib/carStore';
import CarForm from '@/components/admin/CarForm';

export default function EditCarPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [car, setCar] = useState<Car | null | undefined>(undefined);

  useEffect(() => {
    getCar(id).then(c => setCar(c ?? null));
  }, [id]);

  const duplicate = car && !isAdminCar(car.id);

  return (
    <div>
      <Link href="/admin" className="inline-flex items-center gap-1.5 text-sm mb-5" style={{ color: 'var(--muted)' }}>
        <ArrowLeft size={15} /> Back to inventory
      </Link>

      {car === undefined ? (
        <div className="flex items-center justify-center py-20" style={{ color: 'var(--muted)' }}>
          <Loader2 size={22} className="animate-spin" />
        </div>
      ) : car === null ? (
        <div className="rounded-2xl p-10 text-center" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
          <h1 className="text-xl font-bold mb-2" style={{ color: 'var(--text)' }}>Vehicle not found</h1>
          <p className="text-sm mb-5" style={{ color: 'var(--muted)' }}>It may have been deleted.</p>
          <Link href="/admin" className="btn-primary">Back to inventory</Link>
        </div>
      ) : (
        <>
          <h1 className="text-2xl font-black mb-1" style={{ color: 'var(--text)', fontFamily: 'var(--font-jakarta)' }}>
            {duplicate ? 'Duplicate listing' : 'Edit vehicle'}
          </h1>
          {duplicate && (
            <p className="text-sm mb-6" style={{ color: 'var(--muted)' }}>
              This is a seed listing. Saving creates an editable copy you own — the original stays unchanged.
            </p>
          )}
          {!duplicate && <div className="mb-6" />}
          <CarForm mode={duplicate ? 'create' : 'edit'} initial={car} />
        </>
      )}
    </div>
  );
}

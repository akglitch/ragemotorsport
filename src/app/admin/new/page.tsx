'use client';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import CarForm from '@/components/admin/CarForm';

export default function NewCarPage() {
  return (
    <div>
      <Link href="/admin" className="inline-flex items-center gap-1.5 text-sm mb-5" style={{ color: 'var(--muted)' }}>
        <ArrowLeft size={15} /> Back to inventory
      </Link>
      <h1 className="text-2xl font-black mb-6" style={{ color: 'var(--text)', fontFamily: 'var(--font-jakarta)' }}>
        Add a vehicle
      </h1>
      <CarForm mode="create" />
    </div>
  );
}

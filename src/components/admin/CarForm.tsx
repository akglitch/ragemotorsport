'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, ArrowLeft, Crown } from 'lucide-react';
import { Car } from '@/lib/types';
import { categoryList } from '@/lib/data';
import { saveCar } from '@/lib/carStore';
import { BUSINESS, RAGE_SELLER } from '@/lib/config';
import ImageUploader from './ImageUploader';
import FeatureListEditor from './FeatureListEditor';
import { useToast } from '@/hooks/useToast';
import ToastContainer from '@/components/ui/Toast';

const FUELS: Car['fuelType'][] = ['Petrol', 'Diesel', 'Electric', 'Hybrid'];
const TRANSMISSIONS: Car['transmission'][] = ['Automatic', 'Manual'];
const CONDITIONS: Car['condition'][] = ['New', 'Used', 'Certified', 'Salvage'];

/** Defaults applied to every admin-created listing; the public seller is canonical. */
function blankCar(): Car {
  return {
    id: '', make: '', model: '', year: new Date().getFullYear(), price: 0, mileage: 0,
    fuelType: 'Petrol', transmission: 'Automatic', seats: 5, condition: 'Used',
    image: '', images: [], description: '', features: [],
    seller: { ...RAGE_SELLER, phone: '+233 20 974 2331', image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&q=80' },
    location: BUSINESS.location, rating: 4.8,
    engine: '', drivetrain: 'FWD', color: '', category: categoryList[0] || 'Sedan',
    badge: '', isVault: false,
  };
}

function Field({ label, children, required }: { label: string; children: React.ReactNode; required?: boolean }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text)' }}>
        {label}{required && <span className="text-rose-500"> *</span>}
      </label>
      {children}
    </div>
  );
}

export default function CarForm({ mode, initial }: { mode: 'create' | 'edit'; initial?: Car }) {
  const router = useRouter();
  const { toasts, addToast, removeToast } = useToast();
  const [car, setCar] = useState<Car>(initial ?? blankCar());
  const [saving, setSaving] = useState(false);

  const set = <K extends keyof Car>(key: K, val: Car[K]) => setCar(prev => ({ ...prev, [key]: val }));
  const num = (v: string) => (v === '' ? 0 : Number(v));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!car.make.trim() || !car.model.trim()) return addToast('Make and model are required.', 'error');
    if (car.price <= 0) return addToast('Enter a price greater than 0.', 'error');
    if (car.images.length === 0) return addToast('Add at least one image.', 'error');
    if (!car.description.trim()) return addToast('Add a short description.', 'error');

    setSaving(true);
    try {
      // Primary image is the first uploaded; keep seller location in sync with the listing.
      await saveCar({
        ...car,
        image: car.images[0],
        seller: { ...car.seller, location: car.location || car.seller.location },
      });
      router.push('/admin');
    } catch {
      setSaving(false);
      addToast('Could not save — storage may be full.', 'error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl">
      {/* Images */}
      <section className="rounded-2xl p-6" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
        <h2 className="font-bold mb-4" style={{ color: 'var(--text)' }}>Photos</h2>
        <ImageUploader value={car.images} onChange={imgs => set('images', imgs)} onError={msg => addToast(msg, 'error')} />
      </section>

      {/* Core details */}
      <section className="rounded-2xl p-6 space-y-5" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
        <h2 className="font-bold" style={{ color: 'var(--text)' }}>Vehicle details</h2>

        <div className="grid sm:grid-cols-2 gap-5">
          <Field label="Make" required>
            <input className="input-field" value={car.make} onChange={e => set('make', e.target.value)} placeholder="BMW" />
          </Field>
          <Field label="Model" required>
            <input className="input-field" value={car.model} onChange={e => set('model', e.target.value)} placeholder="M3 Competition" />
          </Field>
          <Field label="Year">
            <input type="number" className="input-field" value={car.year} onChange={e => set('year', num(e.target.value))} min={1950} max={2030} />
          </Field>
          <Field label="Price (USD)" required>
            <input type="number" className="input-field" value={car.price} onChange={e => set('price', num(e.target.value))} min={0} placeholder="82500" />
          </Field>
          <Field label="Mileage (mi)">
            <input type="number" className="input-field" value={car.mileage} onChange={e => set('mileage', num(e.target.value))} min={0} />
          </Field>
          <Field label="Seats">
            <input type="number" className="input-field" value={car.seats} onChange={e => set('seats', num(e.target.value))} min={1} max={9} />
          </Field>
          <Field label="Fuel type">
            <select className="input-field cursor-pointer" value={car.fuelType} onChange={e => set('fuelType', e.target.value as Car['fuelType'])}>
              {FUELS.map(f => <option key={f}>{f}</option>)}
            </select>
          </Field>
          <Field label="Transmission">
            <select className="input-field cursor-pointer" value={car.transmission} onChange={e => set('transmission', e.target.value as Car['transmission'])}>
              {TRANSMISSIONS.map(t => <option key={t}>{t}</option>)}
            </select>
          </Field>
          <Field label="Condition">
            <select className="input-field cursor-pointer" value={car.condition} onChange={e => set('condition', e.target.value as Car['condition'])}>
              {CONDITIONS.map(c => <option key={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Category">
            <select className="input-field cursor-pointer" value={car.category} onChange={e => set('category', e.target.value)}>
              {categoryList.map(c => <option key={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Engine">
            <input className="input-field" value={car.engine} onChange={e => set('engine', e.target.value)} placeholder="3.0L Twin-Turbo I6 503hp" />
          </Field>
          <Field label="Drivetrain">
            <input className="input-field" value={car.drivetrain} onChange={e => set('drivetrain', e.target.value)} placeholder="AWD" />
          </Field>
          <Field label="Exterior color">
            <input className="input-field" value={car.color} onChange={e => set('color', e.target.value)} placeholder="Brooklyn Grey" />
          </Field>
          <Field label="Location">
            <input className="input-field" value={car.location} onChange={e => set('location', e.target.value)} placeholder={BUSINESS.location} />
          </Field>
          <Field label="Rating (0–5)">
            <input type="number" step="0.1" className="input-field" value={car.rating} onChange={e => set('rating', num(e.target.value))} min={0} max={5} />
          </Field>
          <Field label="Badge (optional)">
            <input className="input-field" value={car.badge ?? ''} onChange={e => set('badge', e.target.value)} placeholder="New Arrival" />
          </Field>
        </div>

        <Field label="Description" required>
          <textarea className="input-field resize-none" rows={4} value={car.description} onChange={e => set('description', e.target.value)} placeholder="Describe the vehicle…" />
        </Field>
      </section>

      {/* Features */}
      <section className="rounded-2xl p-6" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
        <h2 className="font-bold mb-4" style={{ color: 'var(--text)' }}>Features &amp; options</h2>
        <FeatureListEditor value={car.features} onChange={f => set('features', f)} />
      </section>

      {/* Vault */}
      <section className="rounded-2xl p-6 flex items-center justify-between gap-4" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
        <div className="flex items-start gap-3">
          <Crown size={20} style={{ color: 'var(--gold)' }} className="mt-0.5" />
          <div>
            <p className="font-semibold" style={{ color: 'var(--text)' }}>Premium Vault exclusive</p>
            <p className="text-sm" style={{ color: 'var(--muted)' }}>Only Premium members can view this listing.</p>
          </div>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={!!car.isVault}
          onClick={() => set('isVault', !car.isVault)}
          className="relative w-12 h-7 rounded-full transition-colors flex-shrink-0"
          style={{ background: car.isVault ? 'var(--gold)' : 'var(--border)' }}
        >
          <span className="absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white transition-transform" style={{ transform: car.isVault ? 'translateX(20px)' : 'translateX(0)' }} />
        </button>
      </section>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button type="button" onClick={() => router.push('/admin')} className="btn-outline">
          <ArrowLeft size={16} /> Cancel
        </button>
        <button type="submit" disabled={saving} className="btn-primary disabled:opacity-70">
          {saving ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Saving…
            </span>
          ) : (
            <><Save size={16} /> {mode === 'create' ? 'Publish vehicle' : 'Save changes'}</>
          )}
        </button>
      </div>

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </form>
  );
}

import { Car } from './types';
import { cars as seedCars } from './data';

/**
 * Data-access layer for admin-managed cars.
 *
 * This is the ONLY module that reads/writes uploaded listings. It is backed by
 * localStorage today so the admin works end-to-end with no backend. The function
 * signatures are async on purpose: swapping in Supabase later is a body change,
 * not an API change for callers.
 *
 * ───────────────────────────────────────────────────────────────────────────
 * TODO(supabase): replace the localStorage bodies below with Supabase queries.
 *   import { createClient } from '@supabase/supabase-js'
 *   const supabase = createClient(
 *     process.env.NEXT_PUBLIC_SUPABASE_URL!,
 *     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
 *   )
 *   listCars  -> supabase.from('cars').select('*')
 *   getCar    -> supabase.from('cars').select('*').eq('id', id).single()
 *   saveCar   -> supabase.from('cars').upsert(car)
 *   deleteCar -> supabase.from('cars').delete().eq('id', id)
 * Keep the same return shapes and the seed-merge in getAllCars().
 * ───────────────────────────────────────────────────────────────────────────
 */

const STORAGE_KEY = 'rage-admin-cars';
/** Admin-created ids are prefixed so they never collide with seed ids ('1'..'20'). */
const ADMIN_ID_PREFIX = 'adm_';

export const isAdminCar = (id: string): boolean => id.startsWith(ADMIN_ID_PREFIX);

function read(): Car[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Car[]) : [];
  } catch {
    return [];
  }
}

function write(cars: Car[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cars));
  } catch {
    // Quota errors are swallowed — data-URL images can be large under localStorage.
  }
}

function makeId(): string {
  // Avoids Math.random/Date collisions across rapid saves without extra deps.
  return ADMIN_ID_PREFIX + Math.random().toString(36).slice(2, 9) + read().length;
}

/** Admin-created cars only. */
export async function listCars(): Promise<Car[]> {
  return read();
}

/** Seed inventory + admin-created cars, deduped by id (admin wins). */
export async function getAllCars(): Promise<Car[]> {
  const admin = read();
  const adminIds = new Set(admin.map(c => c.id));
  return [...admin, ...seedCars.filter(c => !adminIds.has(c.id))];
}

/** Look up a single car by id across admin + seed inventory. */
export async function getCar(id: string): Promise<Car | undefined> {
  return (await getAllCars()).find(c => c.id === id);
}

/**
 * Create or update an admin car. A car without an admin id gets a fresh one
 * (so seed cars can be "duplicated" into editable admin copies). Returns the
 * saved car (with its id).
 */
export async function saveCar(input: Car): Promise<Car> {
  const cars = read();
  const car: Car = { ...input, id: isAdminCar(input.id) ? input.id : makeId() };
  const idx = cars.findIndex(c => c.id === car.id);
  if (idx >= 0) cars[idx] = car;
  else cars.unshift(car);
  write(cars);
  return car;
}

/** Delete an admin car. Seed cars are immutable and ignored. */
export async function deleteCar(id: string): Promise<void> {
  if (!isAdminCar(id)) return;
  write(read().filter(c => c.id !== id));
}

import { Car } from './types';
import { cars as seedCars } from './data';
import { createClient } from './supabase/client';
import { rowToCar, CarRow } from './supabase/carMapper';

/**
 * Data-access layer for admin-managed cars, backed by Supabase.
 *
 * Reads go directly through the browser Supabase client (RLS allows public
 * SELECT). Writes (saveCar/deleteCar) go through our authenticated API routes
 * (/api/cars), which verify the session server-side — the anon client alone
 * cannot write. Seed cars in data.ts remain code-side; getAllCars() merges DB
 * rows over the seed list (admin wins on id collision).
 */

/** Admin-created ids are prefixed so they never collide with seed ids ('1'..'20'). */
const ADMIN_ID_PREFIX = 'adm_';

export const isAdminCar = (id: string): boolean => id.startsWith(ADMIN_ID_PREFIX);

function makeId(): string {
  return ADMIN_ID_PREFIX + Math.random().toString(36).slice(2, 11);
}

/** Admin-created cars only (from the DB). */
export async function listCars(): Promise<Car[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('cars')
    .select('*')
    .order('created_at', { ascending: false });
  if (error || !data) return [];
  return (data as CarRow[]).map(rowToCar);
}

/** Seed inventory + admin-created cars, deduped by id (admin wins). */
export async function getAllCars(): Promise<Car[]> {
  const admin = await listCars();
  const adminIds = new Set(admin.map(c => c.id));
  return [...admin, ...seedCars.filter(c => !adminIds.has(c.id))];
}

/** Look up a single car by id across admin + seed inventory. */
export async function getCar(id: string): Promise<Car | undefined> {
  if (isAdminCar(id)) {
    const supabase = createClient();
    const { data } = await supabase.from('cars').select('*').eq('id', id).maybeSingle();
    if (data) return rowToCar(data as CarRow);
    return undefined;
  }
  return seedCars.find(c => c.id === id);
}

/**
 * Create or update an admin car via the authenticated API route. A car without
 * an admin id gets a fresh one (so seed cars can be "duplicated" into editable
 * admin copies). Returns the saved car.
 */
export async function saveCar(input: Car): Promise<Car> {
  const car: Car = { ...input, id: isAdminCar(input.id) ? input.id : makeId() };
  const res = await fetch('/api/cars', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(car),
  });
  if (!res.ok) {
    const { error } = await res.json().catch(() => ({ error: 'Save failed.' }));
    throw new Error(error || 'Save failed.');
  }
  const { row } = await res.json();
  return rowToCar(row as CarRow);
}

/** Delete an admin car via the authenticated API route. Seed cars are ignored. */
export async function deleteCar(id: string): Promise<void> {
  if (!isAdminCar(id)) return;
  const res = await fetch(`/api/cars/${id}`, { method: 'DELETE' });
  if (!res.ok) {
    const { error } = await res.json().catch(() => ({ error: 'Delete failed.' }));
    throw new Error(error || 'Delete failed.');
  }
}

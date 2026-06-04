'use client';
import { useState, useEffect } from 'react';
import { Car } from '@/lib/types';
import { cars as seedCars } from '@/lib/data';
import { getAllCars } from '@/lib/carStore';

/**
 * Public-site car source: static seed inventory merged with admin-created cars
 * from the store. Starts with the seed list (so SSR and first paint match), then
 * folds in uploaded listings once localStorage is read on the client.
 */
export function useAllCars(): { cars: Car[]; loaded: boolean } {
  const [cars, setCars] = useState<Car[]>(seedCars);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    getAllCars().then(merged => {
      if (active) { setCars(merged); setLoaded(true); }
    });
    return () => { active = false; };
  }, []);

  return { cars, loaded };
}

'use client';
import { useState } from 'react';
import { Car } from '@/lib/types';

export function useCompare() {
  const [compareList, setCompareList] = useState<Car[]>([]);

  const addToCompare = (car: Car) => {
    if (compareList.length >= 3) return;
    if (compareList.find(c => c.id === car.id)) return;
    setCompareList(prev => [...prev, car]);
  };

  const removeFromCompare = (id: string) => {
    setCompareList(prev => prev.filter(c => c.id !== id));
  };

  const clearCompare = () => setCompareList([]);

  const isInCompare = (id: string) => compareList.some(c => c.id === id);

  return { compareList, addToCompare, removeFromCompare, clearCompare, isInCompare };
}

import { Car } from '@/lib/types';

/** A row in the Supabase `cars` table (snake_case columns). */
export interface CarRow {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuel_type: string;
  transmission: string;
  seats: number;
  condition: string;
  image: string;
  images: string[];
  description: string;
  features: string[];
  seller: Car['seller'];
  location: string;
  rating: number;
  engine: string;
  drivetrain: string;
  color: string;
  category: string;
  badge: string | null;
  is_vault: boolean;
  is_sold: boolean;
}

/** Car (app/camelCase) → CarRow (DB/snake_case). */
export function carToRow(car: Car): CarRow {
  return {
    id: car.id,
    make: car.make,
    model: car.model,
    year: car.year,
    price: car.price,
    mileage: car.mileage,
    fuel_type: car.fuelType,
    transmission: car.transmission,
    seats: car.seats,
    condition: car.condition,
    image: car.image,
    images: car.images,
    description: car.description,
    features: car.features,
    seller: car.seller,
    location: car.location,
    rating: car.rating,
    engine: car.engine,
    drivetrain: car.drivetrain,
    color: car.color,
    category: car.category,
    badge: car.badge ?? null,
    is_vault: !!car.isVault,
    is_sold: !!car.isSold,
  };
}

/** CarRow (DB/snake_case) → Car (app/camelCase). */
export function rowToCar(row: CarRow): Car {
  return {
    id: row.id,
    make: row.make,
    model: row.model,
    year: row.year,
    price: row.price,
    mileage: row.mileage,
    fuelType: row.fuel_type as Car['fuelType'],
    transmission: row.transmission as Car['transmission'],
    seats: row.seats,
    condition: row.condition as Car['condition'],
    image: row.image,
    images: row.images ?? [],
    description: row.description,
    features: row.features ?? [],
    seller: row.seller,
    location: row.location,
    rating: row.rating,
    engine: row.engine,
    drivetrain: row.drivetrain,
    color: row.color,
    category: row.category,
    badge: row.badge ?? undefined,
    isVault: row.is_vault,
    isSold: row.is_sold,
  };
}

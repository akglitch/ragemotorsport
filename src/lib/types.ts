export interface Seller {
  name: string;
  location: string;
  rating: number;
  reviewCount: number;
  verified: boolean;
  phone: string;
  image: string;
}

export interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuelType: 'Petrol' | 'Diesel' | 'Electric' | 'Hybrid';
  transmission: 'Automatic' | 'Manual';
  seats: number;
  condition: 'New' | 'Used' | 'Certified' | 'Salvage';
  image: string;
  images: string[];
  description: string;
  features: string[];
  seller: Seller;
  location: string;
  rating: number;
  engine: string;
  drivetrain: string;
  color: string;
  category: string;
  badge?: string;
  isVault?: boolean;
}

export interface FilterState {
  priceMin: number;
  priceMax: number;
  makes: string[];
  fuelTypes: string[];
  transmissions: string[];
  seats: string[];
  yearMin: number;
  yearMax: number;
  conditions: string[];
  categories: string[];
  vaultOnly: boolean;
  search: string;
}

export type SortOption =
  | 'price-asc'
  | 'price-desc'
  | 'year-desc'
  | 'year-asc'
  | 'mileage-asc';

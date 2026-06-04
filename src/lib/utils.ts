export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatMileage(mileage: number): string {
  if (mileage === 0) return 'Brand New';
  return new Intl.NumberFormat('en-US').format(mileage) + ' mi';
}

// Flat-rate enclosed transport, tiered by vehicle value.
// We sell pay-in-full; this is the shipping added on top of the car price.
export function estimateShipping(price: number): number {
  if (price < 30000) return 899;
  if (price < 60000) return 1299;
  return 1799;
}

// Optional safety-certification add-on for used cars: a 150-point inspection plus
// a certified warranty. New/Certified cars already qualify; salvage is sold as-is.
export const SAFETY_CERT_FEE = 750;

export function canCertify(condition: string): boolean {
  return condition === 'Used';
}

export function getRatingStars(rating: number): string {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5 ? 1 : 0;
  return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(5 - full - half);
}

export function slugify(str: string): string {
  return str.toLowerCase().replace(/\s+/g, '-');
}

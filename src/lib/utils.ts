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

export function calcMonthlyPayment(
  price: number,
  downPayment: number,
  annualRate: number,
  termMonths: number
): number {
  const principal = price - downPayment;
  if (annualRate === 0) return principal / termMonths;
  const monthlyRate = annualRate / 100 / 12;
  const payment =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) /
    (Math.pow(1 + monthlyRate, termMonths) - 1);
  return Math.round(payment);
}

export function getRatingStars(rating: number): string {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5 ? 1 : 0;
  return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(5 - full - half);
}

export function slugify(str: string): string {
  return str.toLowerCase().replace(/\s+/g, '-');
}

import { Car } from './types';
import { formatPrice, estimateShipping } from './utils';

/**
 * RageMotorSport business contact.
 *
 * ⬇️  SET THIS to the handler's real WhatsApp number in full international
 * format, DIGITS ONLY — no "+", spaces, or dashes.
 * Example: the number +61 412 345 678 becomes '61412345678'.
 */
export const WHATSAPP_NUMBER = '';

export const BUSINESS = {
  name: 'RageMotorSport',
  location: 'North Melbourne, VIC',
  email: 'hello@ragemotorsport.com',
};

/** Single canonical seller — every vehicle is sold by RageMotorSport. */
export const RAGE_SELLER = {
  name: 'RageMotorSport',
  location: BUSINESS.location,
  rating: 4.9,
  reviewCount: 1284,
  verified: true,
};

/** Build a wa.me deep link that opens the handler's chat with a prefilled message. */
export function whatsappLink(message: string): string {
  const base = WHATSAPP_NUMBER ? `https://wa.me/${WHATSAPP_NUMBER}` : 'https://wa.me/';
  return `${base}?text=${encodeURIComponent(message)}`;
}

/** Prefilled enquiry message for a specific vehicle. */
export function carEnquiryLink(car: Car, url?: string): string {
  const shipping = estimateShipping(car.price);
  const total = car.price + shipping;
  const lines = [
    `Hi ${BUSINESS.name}! 👋`,
    ``,
    `I'd like to buy this vehicle:`,
    `• ${car.year} ${car.make} ${car.model}`,
    `• Price: ${formatPrice(car.price)}`,
    `• Shipping: ${formatPrice(shipping)}`,
    `• Total: ${formatPrice(total)}`,
    url ? `\n${url}` : ``,
    ``,
    `Is it still available?`,
  ];
  return whatsappLink(lines.filter(l => l !== undefined).join('\n'));
}

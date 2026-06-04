import { Car } from './types';
import { formatPrice, estimateShipping, SAFETY_CERT_FEE, canCertify } from './utils';

/**
 * RageMotorSport business contact.
 *
 * ⬇️  SET THIS to the handler's real WhatsApp number in full international
 * format, DIGITS ONLY — no "+", spaces, or dashes.
 * Example: the number +61 412 345 678 becomes '61412345678'.
 */
export const WHATSAPP_NUMBER = '233209742331';

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

/** Buyer details captured by the checkout flow before handing off to WhatsApp. */
export interface OrderBuyer {
  name: string;
  email: string;
  phone: string;
  city: string;
  notes?: string;
}

/** Optional order extras captured by the checkout flow. */
export interface OrderOptions {
  /** Buyer chose the paid safety-certification add-on (only valid for used cars). */
  certified?: boolean;
  /** Listing URL to include in the message. */
  url?: string;
}

/**
 * Prefilled order message for the WhatsApp checkout. Bundles the vehicle, the
 * buyer's contact details, and any add-ons (safety certification) into one
 * message so the handler can reply with payment + delivery instructions.
 */
export function carOrderLink(car: Car, buyer: OrderBuyer, opts: OrderOptions = {}): string {
  const shipping = estimateShipping(car.price);
  const certified = !!opts.certified && canCertify(car.condition);
  const certFee = certified ? SAFETY_CERT_FEE : 0;
  const total = car.price + shipping + certFee;
  const lines = [
    `Hi ${BUSINESS.name}! 👋`,
    ``,
    `I'd like to place an order for:`,
    `• ${car.year} ${car.make} ${car.model}`,
    `• Condition: ${car.condition}`,
    `• Price: ${formatPrice(car.price)}`,
    `• Shipping: ${formatPrice(shipping)}`,
    canCertify(car.condition)
      ? `• Safety certification: ${certified ? `Yes (+${formatPrice(SAFETY_CERT_FEE)})` : 'No — buying as-is'}`
      : undefined,
    `• Total: ${formatPrice(total)}`,
    opts.url ? `\n${opts.url}` : ``,
    ``,
    `My details:`,
    `• Name: ${buyer.name}`,
    `• Email: ${buyer.email}`,
    buyer.phone ? `• Phone: ${buyer.phone}` : undefined,
    buyer.city ? `• City: ${buyer.city}` : undefined,
    buyer.notes ? `\nNotes: ${buyer.notes}` : undefined,
    ``,
    `Please let me know the next steps to complete payment and delivery.`,
  ];
  return whatsappLink(lines.filter(l => l !== undefined).join('\n'));
}

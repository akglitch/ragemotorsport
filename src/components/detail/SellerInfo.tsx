import { Seller } from '@/lib/types';
import Image from 'next/image';
import { BadgeCheck, Star, Phone, MessageCircle, MapPin } from 'lucide-react';

interface Props {
  seller: Seller;
  onContact: () => void;
}

export default function SellerInfo({ seller, onContact }: Props) {
  return (
    <div
      className="rounded-2xl p-5"
      style={{ background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--card-shadow)' }}
    >
      <h3 className="font-bold text-base mb-4" style={{ color: 'var(--text)', fontFamily: 'var(--font-jakarta)' }}>
        About the Seller
      </h3>

      {/* Seller profile */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">
          <Image src={seller.image} alt={seller.name} fill className="object-cover" sizes="56px" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-bold text-sm truncate" style={{ color: 'var(--text)' }}>
              {seller.name}
            </span>
            {seller.verified && (
              <BadgeCheck size={16} className="text-blue-500 flex-shrink-0" />
            )}
          </div>
          <div className="flex items-center gap-1 mt-0.5">
            <MapPin size={11} style={{ color: 'var(--muted)' }} />
            <span className="text-xs" style={{ color: 'var(--muted)' }}>{seller.location}</span>
          </div>
          <div className="flex items-center gap-1 mt-1">
            <div className="flex">
              {[1, 2, 3, 4, 5].map(s => (
                <Star
                  key={s}
                  size={12}
                  className={s <= Math.round(seller.rating) ? 'text-amber-400' : 'text-gray-300'}
                  fill={s <= Math.round(seller.rating) ? 'currentColor' : 'none'}
                />
              ))}
            </div>
            <span className="text-xs font-semibold" style={{ color: 'var(--text)' }}>
              {seller.rating}
            </span>
            <span className="text-xs" style={{ color: 'var(--muted)' }}>
              ({seller.reviewCount} reviews)
            </span>
          </div>
        </div>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-2 mb-4">
        {seller.verified && (
          <span className="badge badge-blue text-xs">✓ Verified Dealer</span>
        )}
        <span className="badge badge-green text-xs">🏆 Top Rated</span>
        <span className="badge badge-orange text-xs">⚡ Fast Responder</span>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-2">
        <button
          onClick={onContact}
          className="btn-primary w-full justify-center text-sm py-3"
          aria-label="Contact seller"
        >
          <MessageCircle size={16} />
          Send Message
        </button>
        <a
          href={`tel:${seller.phone}`}
          className="btn-outline w-full justify-center text-sm py-3"
          aria-label={`Call ${seller.name}`}
        >
          <Phone size={16} />
          {seller.phone}
        </a>
      </div>
    </div>
  );
}

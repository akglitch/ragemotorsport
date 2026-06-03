'use client';
import { useUser } from '@/context/UserContext';
import { Crown } from 'lucide-react';

/**
 * Demo-only "View as" switch that flips between Free and Premium membership so
 * the Vault gating can be previewed without a real backend. Premium side shows
 * a gold crown.
 */
export default function UserToggle({ compact = false }: { compact?: boolean }) {
  const { isPremium, hydrated, toggle } = useUser();

  // Avoid a hydration flash — render a neutral placeholder until localStorage is read.
  if (!hydrated) {
    return <div className={compact ? 'h-9 w-full rounded-full' : 'h-9 w-44 rounded-full'} style={{ background: 'rgba(120,120,120,0.12)' }} aria-hidden />;
  }

  return (
    <div className={`inline-flex items-center rounded-full p-0.5 border ${compact ? 'w-full' : ''}`}
      style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}
      role="group" aria-label="View as Free or Premium user">
      <button
        onClick={() => isPremium && toggle()}
        aria-pressed={!isPremium}
        className={`${compact ? 'flex-1 ' : ''}px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
          !isPremium ? 'text-white' : 'text-[var(--muted)] hover:text-[var(--text)]'
        }`}
        style={!isPremium ? { background: 'var(--ink)' } : undefined}
      >
        Free
      </button>
      <button
        onClick={() => !isPremium && toggle()}
        aria-pressed={isPremium}
        className={`${compact ? 'flex-1 ' : ''}inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
          isPremium ? '' : 'text-[var(--muted)] hover:text-[var(--text)]'
        }`}
        style={isPremium ? { background: 'linear-gradient(135deg, var(--gold-soft), var(--gold))', color: '#1a1407' } : undefined}
      >
        <Crown size={13} style={{ color: isPremium ? '#1a1407' : 'var(--gold)' }} />
        Premium
      </button>
    </div>
  );
}

'use client';
import { useState } from 'react';
import { FilterState } from '@/lib/types';
import { categoryList } from '@/lib/data';
import { ChevronDown, Check, X } from 'lucide-react';

interface FilterSidebarProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  onReset: () => void;
}

const makes = ['Toyota', 'Honda', 'BMW', 'Mercedes', 'Ford', 'Hyundai', 'Volkswagen', 'Tesla', 'Chevrolet', 'Porsche'];
const fuelTypes = ['Petrol', 'Diesel', 'Electric', 'Hybrid'];
const transmissions = ['Automatic', 'Manual'];
const seatOptions = ['2', '4', '5', '7'];
const conditions = ['New', 'Used', 'Certified', 'Salvage'];

const PRICE_MAX = 150000;
const YEAR_MIN = 1960;
const YEAR_MAX = 2025;

/** Count of active (non-default) filters — shared by the desktop sidebar and the mobile trigger. */
export function activeFilterCount(filters: FilterState): number {
  return (
    filters.categories.length + filters.makes.length + filters.fuelTypes.length +
    filters.transmissions.length + filters.seats.length + filters.conditions.length +
    (filters.priceMin > 0 || filters.priceMax < PRICE_MAX ? 1 : 0) +
    (filters.yearMin > YEAR_MIN || filters.yearMax < YEAR_MAX ? 1 : 0)
  );
}

function Section({ title, count = 0, children, defaultOpen = true }: {
  title: string; count?: number; children: React.ReactNode; defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-[var(--border)] last:border-b-0">
      <button
        className="flex items-center justify-between w-full py-4"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span className="text-[0.8rem] font-semibold uppercase tracking-[0.08em] text-[var(--text)] flex items-center gap-2">
          {title}
          {count > 0 && <span className="w-1.5 h-1.5 rounded-full bg-[var(--ink)]" />}
        </span>
        <ChevronDown size={15} className={`text-[var(--muted)] transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${open ? 'max-h-[600px] opacity-100 pb-5' : 'max-h-0 opacity-0'}`}>
        {children}
      </div>
    </div>
  );
}

function CheckGroup({ options, selected, onChange }: {
  options: string[]; selected: string[]; onChange: (val: string[]) => void;
}) {
  const toggle = (val: string) =>
    onChange(selected.includes(val) ? selected.filter(v => v !== val) : [...selected, val]);
  return (
    <div className="flex flex-col gap-0.5">
      {options.map(opt => {
        const active = selected.includes(opt);
        return (
          <label key={opt} className="flex items-center gap-3 cursor-pointer py-2 group">
            <input type="checkbox" checked={active} onChange={() => toggle(opt)} className="sr-only" aria-label={opt} />
            <span className={`w-[18px] h-[18px] rounded-md border flex items-center justify-center transition-all ${
              active ? 'bg-[var(--ink)] border-[var(--ink)] text-white' : 'border-[var(--border)] bg-[var(--surface)] text-transparent group-hover:border-[var(--muted)]'
            }`}>
              <Check size={12} strokeWidth={3} />
            </span>
            <span className={`text-sm transition-colors ${active ? 'text-[var(--text)] font-medium' : 'text-[var(--muted)] group-hover:text-[var(--text)]'}`}>
              {opt}
            </span>
          </label>
        );
      })}
    </div>
  );
}

function PillGroup({ options, selected, onChange, format }: {
  options: string[]; selected: string[]; onChange: (val: string[]) => void; format?: (v: string) => string;
}) {
  const toggle = (val: string) =>
    onChange(selected.includes(val) ? selected.filter(v => v !== val) : [...selected, val]);
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(opt => {
        const active = selected.includes(opt);
        return (
          <button
            key={opt}
            onClick={() => toggle(opt)}
            aria-pressed={active}
            className={`px-3.5 py-2.5 rounded-lg text-xs font-semibold border transition-all ${
              active
                ? 'bg-[var(--ink)] border-[var(--ink)] text-white'
                : 'bg-[var(--surface)] border-[var(--border)] text-[var(--muted)] hover:border-[var(--ink)] hover:text-[var(--text)]'
            }`}
          >
            {format ? format(opt) : opt}
          </button>
        );
      })}
    </div>
  );
}

/** Dual range slider with a filled segment between thumbs. */
function RangeSlider({ min, max, step = 1, valueMin, valueMax, onMin, onMax, labelMin, labelMax }: {
  min: number; max: number; step?: number;
  valueMin: number; valueMax: number;
  onMin: (n: number) => void; onMax: (n: number) => void;
  labelMin: string; labelMax: string;
}) {
  const pct = (v: number) => ((v - min) / (max - min)) * 100;
  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex-1 rounded-lg border border-[var(--border)] px-3 py-2 text-center">
          <p className="text-sm font-semibold text-[var(--text)]">{labelMin}</p>
        </div>
        <span className="text-[var(--muted)] text-xs">to</span>
        <div className="flex-1 rounded-lg border border-[var(--border)] px-3 py-2 text-center">
          <p className="text-sm font-semibold text-[var(--text)]">{labelMax}</p>
        </div>
      </div>
      <div className="relative h-4 flex items-center">
        {/* track */}
        <div className="absolute inset-x-0 h-[3px] rounded-full bg-[var(--border)]" />
        {/* filled segment */}
        <div className="absolute h-[3px] rounded-full bg-[var(--ink)]" style={{ left: `${pct(valueMin)}%`, right: `${100 - pct(valueMax)}%` }} />
        <input
          type="range" min={min} max={max} step={step} value={valueMin}
          onChange={e => onMin(Math.min(Number(e.target.value), valueMax))}
          className="range-thumb absolute w-full" aria-label="Minimum"
        />
        <input
          type="range" min={min} max={max} step={step} value={valueMax}
          onChange={e => onMax(Math.max(Number(e.target.value), valueMin))}
          className="range-thumb absolute w-full" aria-label="Maximum"
        />
      </div>
    </div>
  );
}

/**
 * The filter sections themselves, with no outer chrome. Rendered inside the
 * desktop sidebar (FilterSidebar) and the mobile drawer (FilterDrawer).
 */
function FilterControls({ filters, onChange }: { filters: FilterState; onChange: (f: FilterState) => void }) {
  return (
    <>
      <Section title="Category" count={filters.categories.length}>
        <PillGroup options={categoryList} selected={filters.categories} onChange={val => onChange({ ...filters, categories: val })} />
      </Section>

      <Section title="Price">
        <RangeSlider
          min={0} max={PRICE_MAX} step={1000}
          valueMin={filters.priceMin} valueMax={filters.priceMax}
          onMin={n => onChange({ ...filters, priceMin: n })}
          onMax={n => onChange({ ...filters, priceMax: n })}
          labelMin={`$${filters.priceMin.toLocaleString()}`}
          labelMax={`$${filters.priceMax.toLocaleString()}`}
        />
      </Section>

      <Section title="Condition" count={filters.conditions.length}>
        <PillGroup options={conditions} selected={filters.conditions} onChange={val => onChange({ ...filters, conditions: val })} />
      </Section>

      <Section title="Make" count={filters.makes.length}>
        <CheckGroup options={makes} selected={filters.makes} onChange={val => onChange({ ...filters, makes: val })} />
      </Section>

      <Section title="Fuel" count={filters.fuelTypes.length}>
        <PillGroup options={fuelTypes} selected={filters.fuelTypes} onChange={val => onChange({ ...filters, fuelTypes: val })} />
      </Section>

      <Section title="Transmission" count={filters.transmissions.length}>
        <PillGroup options={transmissions} selected={filters.transmissions} onChange={val => onChange({ ...filters, transmissions: val })} />
      </Section>

      <Section title="Seats" count={filters.seats.length}>
        <PillGroup options={seatOptions} selected={filters.seats} onChange={val => onChange({ ...filters, seats: val })} format={s => (s === '7' ? '7+' : s)} />
      </Section>

      <Section title="Year" defaultOpen={false}>
        <RangeSlider
          min={YEAR_MIN} max={YEAR_MAX}
          valueMin={filters.yearMin} valueMax={filters.yearMax}
          onMin={n => onChange({ ...filters, yearMin: n })}
          onMax={n => onChange({ ...filters, yearMax: n })}
          labelMin={String(filters.yearMin)}
          labelMax={String(filters.yearMax)}
        />
      </Section>
    </>
  );
}

/** Desktop sidebar — sticky panel shown from the lg breakpoint up. */
export default function FilterSidebar({ filters, onChange, onReset }: FilterSidebarProps) {
  const activeCount = activeFilterCount(filters);

  return (
    <aside
      className="rounded-2xl sticky top-24 bg-[var(--surface)] border border-[var(--border)] px-6"
      style={{ boxShadow: 'var(--card-shadow)' }}
      aria-label="Filter cars"
    >
      {/* Header */}
      <div className="flex items-center justify-between py-5 border-b border-[var(--border)]">
        <h2 className="display text-lg font-semibold text-[var(--text)]">
          Filters{activeCount > 0 && <span className="text-[var(--muted)] font-normal"> · {activeCount}</span>}
        </h2>
        <button
          onClick={onReset}
          disabled={activeCount === 0}
          className="text-xs font-medium text-[var(--muted)] hover:text-[var(--text)] transition-colors disabled:opacity-40 disabled:cursor-default underline underline-offset-4"
        >
          Reset
        </button>
      </div>

      <FilterControls filters={filters} onChange={onChange} />
    </aside>
  );
}

interface FilterDrawerProps extends FilterSidebarProps {
  open: boolean;
  onClose: () => void;
  resultCount: number;
}

/**
 * Mobile filter drawer — a bottom sheet that slides up over the listings.
 * Sticky header for dismissal and a thumb-reachable "Show results" CTA so the
 * primary action is always within reach on a phone.
 */
export function FilterDrawer({ filters, onChange, onReset, open, onClose, resultCount }: FilterDrawerProps) {
  if (!open) return null;
  const activeCount = activeFilterCount(filters);

  return (
    <div className="fixed inset-0 z-[200] lg:hidden" role="dialog" aria-modal="true" aria-label="Filter cars">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={onClose} />

      {/* Sheet */}
      <div className="absolute inset-x-0 bottom-0 max-h-[90vh] flex flex-col rounded-t-3xl bg-[var(--surface)] shadow-2xl animate-sheet-up">
        {/* Grab handle */}
        <div className="pt-3 pb-1 flex justify-center flex-shrink-0">
          <span className="w-10 h-1.5 rounded-full bg-[var(--border)]" />
        </div>

        {/* Header */}
        <div className="px-5 pb-3 flex items-center justify-between border-b border-[var(--border)] flex-shrink-0">
          <h2 className="display text-lg font-semibold text-[var(--text)]">
            Filters{activeCount > 0 && <span className="text-[var(--muted)] font-normal"> · {activeCount}</span>}
          </h2>
          <button
            onClick={onClose}
            className="w-9 h-9 -mr-1 rounded-full flex items-center justify-center text-[var(--muted)] hover:bg-[var(--surface-2)] hover:text-[var(--text)] transition-colors"
            aria-label="Close filters"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable controls */}
        <div className="px-5 overflow-y-auto overscroll-contain flex-1">
          <FilterControls filters={filters} onChange={onChange} />
        </div>

        {/* Sticky footer CTA */}
        <div
          className="px-5 pt-4 border-t border-[var(--border)] flex items-center gap-3 flex-shrink-0"
          style={{ paddingBottom: 'calc(1rem + env(safe-area-inset-bottom))' }}
        >
          <button
            onClick={onReset}
            disabled={activeCount === 0}
            className="btn-outline justify-center py-3 px-5 text-sm disabled:opacity-40 disabled:cursor-default"
          >
            Reset
          </button>
          <button onClick={onClose} className="btn-primary flex-1 justify-center py-3 text-sm">
            Show {resultCount} {resultCount === 1 ? 'result' : 'results'}
          </button>
        </div>
      </div>
    </div>
  );
}

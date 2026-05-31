'use client';
import { SortOption } from '@/lib/types';
import { ArrowUpDown } from 'lucide-react';

interface Props {
  value: SortOption;
  onChange: (sort: SortOption) => void;
}

const options: { value: SortOption; label: string }[] = [
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'year-desc', label: 'Newest First' },
  { value: 'year-asc', label: 'Oldest First' },
  { value: 'mileage-asc', label: 'Mileage: Low to High' },
];

export default function SortDropdown({ value, onChange }: Props) {
  return (
    <div className="flex items-center gap-2">
      <ArrowUpDown size={14} style={{ color: 'var(--muted)' }} />
      <select
        value={value}
        onChange={e => onChange(e.target.value as SortOption)}
        className="input-field py-2 pr-8 text-sm cursor-pointer"
        style={{ width: 'auto' }}
        aria-label="Sort cars"
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

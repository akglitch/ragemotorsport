'use client';
import { useState } from 'react';
import { Plus, X } from 'lucide-react';

/** Add/remove chip editor for a string list (Car.features). */
export default function FeatureListEditor({
  value,
  onChange,
}: {
  value: string[];
  onChange: (next: string[]) => void;
}) {
  const [draft, setDraft] = useState('');

  const add = () => {
    const v = draft.trim();
    if (!v || value.includes(v)) { setDraft(''); return; }
    onChange([...value, v]);
    setDraft('');
  };

  const remove = (item: string) => onChange(value.filter(v => v !== item));

  return (
    <div>
      <div className="flex gap-2">
        <input
          type="text"
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); add(); } }}
          placeholder="e.g. Panoramic Sunroof"
          className="input-field flex-1"
          aria-label="Add a feature"
        />
        <button type="button" onClick={add} className="btn-outline px-4" aria-label="Add feature">
          <Plus size={16} />
        </button>
      </div>

      {value.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {value.map(item => (
            <span key={item} className="inline-flex items-center gap-1.5 pl-3 pr-2 py-1.5 rounded-lg text-sm" style={{ background: 'var(--surface-2)', color: 'var(--text)' }}>
              {item}
              <button type="button" onClick={() => remove(item)} className="rounded-full p-0.5 hover:bg-black/10 transition-colors" aria-label={`Remove ${item}`}>
                <X size={13} />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

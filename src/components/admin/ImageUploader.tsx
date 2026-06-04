'use client';
import { useState, useRef } from 'react';
import Image from 'next/image';
import { UploadCloud, X, Star, Loader2 } from 'lucide-react';
import { uploadImage, ImageUploadError } from '@/lib/uploadImage';

/**
 * Multi-image uploader. The first image is the primary (`Car.image`); the full
 * list is `Car.images[]`. Each dropped file is pushed through uploadImage()
 * (the Cloudinary seam). Supports drag-drop, click-to-pick, remove, and
 * "make primary".
 */
export default function ImageUploader({
  value,
  onChange,
  onError,
}: {
  value: string[];
  onChange: (next: string[]) => void;
  onError?: (message: string) => void;
}) {
  const [dragOver, setDragOver] = useState(false);
  const [busy, setBusy] = useState(0); // count of in-flight uploads
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const list = Array.from(files);
    setBusy(b => b + list.length);
    const uploaded: string[] = [];
    for (const file of list) {
      try {
        uploaded.push(await uploadImage(file));
      } catch (err) {
        const msg = err instanceof ImageUploadError ? err.message : 'Upload failed.';
        onError?.(`${file.name}: ${msg}`);
      } finally {
        setBusy(b => b - 1);
      }
    }
    if (uploaded.length) onChange([...value, ...uploaded]);
  };

  const removeAt = (idx: number) => onChange(value.filter((_, i) => i !== idx));

  const makePrimary = (idx: number) => {
    if (idx === 0) return;
    const next = [...value];
    const [picked] = next.splice(idx, 1);
    onChange([picked, ...next]);
  };

  return (
    <div>
      {/* Dropzone */}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={e => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
        className="w-full rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-2 py-10 px-4 transition-colors"
        style={{
          borderColor: dragOver ? 'var(--ink)' : 'var(--border)',
          background: dragOver ? 'var(--surface-2)' : 'var(--surface)',
        }}
        aria-label="Upload images"
      >
        <UploadCloud size={26} style={{ color: 'var(--muted)' }} />
        <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>
          Drag &amp; drop images, or click to browse
        </span>
        <span className="text-xs" style={{ color: 'var(--muted)' }}>PNG/JPG/WebP up to 5 MB each</span>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={e => { handleFiles(e.target.files); e.target.value = ''; }}
      />

      {busy > 0 && (
        <p className="mt-3 flex items-center gap-2 text-xs" style={{ color: 'var(--muted)' }}>
          <Loader2 size={14} className="animate-spin" /> Uploading {busy} image{busy > 1 ? 's' : ''}…
        </p>
      )}

      {/* Previews */}
      {value.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-4">
          {value.map((src, idx) => (
            <div key={`${idx}-${src.slice(-16)}`} className="relative group rounded-xl overflow-hidden" style={{ aspectRatio: '4 / 3', border: '1px solid var(--border)' }}>
              <Image src={src} alt={`Upload ${idx + 1}`} fill className="object-cover" sizes="160px" unoptimized />

              {idx === 0 && (
                <span className="absolute top-1.5 left-1.5 inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold text-white" style={{ background: 'var(--ink)' }}>
                  <Star size={10} fill="currentColor" /> Primary
                </span>
              )}

              <div className="absolute inset-0 flex items-end justify-between p-1.5 opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.5), transparent 60%)' }}>
                {idx !== 0 ? (
                  <button type="button" onClick={() => makePrimary(idx)} className="text-[10px] font-medium text-white bg-black/50 rounded px-1.5 py-0.5 hover:bg-black/70" aria-label="Make primary image">
                    Make primary
                  </button>
                ) : <span />}
                <button type="button" onClick={() => removeAt(idx)} className="w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-rose-600" aria-label={`Remove image ${idx + 1}`}>
                  <X size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

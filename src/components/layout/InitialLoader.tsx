'use client';
import { useState, useEffect } from 'react';

export default function InitialLoader() {
  const [show, setShow] = useState(true);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    // Start fading out after 1.5 seconds
    const fadeTimer = setTimeout(() => setFade(true), 1500);
    // Remove from DOM completely after 2.0 seconds
    const removeTimer = setTimeout(() => setShow(false), 2000);
    return () => { clearTimeout(fadeTimer); clearTimeout(removeTimer); };
  }, []);

  if (!show) return null;

  return (
    <div 
      className={`fixed inset-0 z-[1000] flex flex-col items-center justify-center transition-opacity duration-500 ease-in-out ${fade ? 'opacity-0' : 'opacity-100'}`} 
      style={{ background: 'var(--bg)' }}
    >
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full opacity-10 animate-pulse" style={{ background: 'radial-gradient(circle, var(--gold) 0%, transparent 70%)' }} />
      
      {/* Central Brand */}
      <div className="relative flex flex-col items-center z-10">
        <h1 className="display text-3xl md:text-4xl font-black tracking-[0.2em] relative z-10" style={{ color: 'var(--text)' }}>
          RAGE
        </h1>
        <div className="flex items-center gap-3 mt-3">
          <div className="w-8 h-[1px]" style={{ background: 'linear-gradient(90deg, transparent, var(--gold))' }} />
          <span className="text-[10px] uppercase tracking-[0.4em] font-semibold" style={{ color: 'var(--gold)' }}>
            Motorsport
          </span>
          <div className="w-8 h-[1px]" style={{ background: 'linear-gradient(270deg, transparent, var(--gold))' }} />
        </div>
      </div>

      {/* Orbit spinner */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[160px] h-[160px] rounded-full border border-dashed border-white/10 animate-[spin_10s_linear_infinite]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] rounded-full border border-white/5 animate-[spin_15s_linear_infinite_reverse]" />
      
      {/* Small orbiting dot */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[160px] h-[160px] animate-[spin_3s_ease-in-out_infinite]">
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full" style={{ background: 'var(--gold)', boxShadow: '0 0 8px var(--gold)' }} />
      </div>
    </div>
  );
}

'use client';
import { useState, useEffect } from 'react';

export default function InitialLoader() {
  const [phase, setPhase] = useState<'in' | 'hold' | 'out' | 'done'>('in');

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('hold'), 100);
    const t2 = setTimeout(() => setPhase('out'), 1800);
    const t3 = setTimeout(() => setPhase('done'), 2400);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  if (phase === 'done') return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
      style={{
        background: '#08090d',
        opacity: phase === 'out' ? 0 : 1,
        transition: phase === 'out' ? 'opacity 0.6s cubic-bezier(0.7,0,0.84,0)' : 'none',
        pointerEvents: phase === 'out' ? 'none' : 'auto',
      }}
    >
      {/* Extremely subtle vignette grain texture */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")', backgroundSize: '128px' }}
      />

      {/* Centered content */}
      <div className="relative flex flex-col items-center select-none">

        {/* RAGE — clipped reveal */}
        <div className="overflow-hidden">
          <h1
            className="font-black text-white tracking-[0.25em] text-4xl md:text-5xl"
            style={{
              fontFamily: 'var(--font-jakarta), sans-serif',
              opacity: phase === 'in' ? 0 : 1,
              transform: phase === 'in' ? 'translateY(100%)' : 'translateY(0)',
              transition: 'opacity 0.7s ease, transform 0.7s cubic-bezier(0.16,1,0.3,1)',
            }}
          >
            RAGE
          </h1>
        </div>

        {/* Gold divider line — draws left to right */}
        <div className="w-full mt-3 mb-3 overflow-hidden" style={{ height: '1px' }}>
          <div
            className="h-full origin-left"
            style={{
              background: 'linear-gradient(90deg, #d4af37, rgba(212,175,55,0.3))',
              transform: phase === 'in' ? 'scaleX(0)' : 'scaleX(1)',
              transition: 'transform 0.9s cubic-bezier(0.16,1,0.3,1) 0.3s',
            }}
          />
        </div>

        {/* MOTORSPORT — fades in with letter spacing */}
        <p
          style={{
            fontFamily: 'var(--font-inter), sans-serif',
            letterSpacing: '0.35em',
            fontSize: '0.6rem',
            color: 'rgba(212,175,55,0.7)',
            opacity: phase === 'in' ? 0 : 1,
            transition: 'opacity 1s ease 0.5s',
            textTransform: 'uppercase',
            fontWeight: 500,
          }}
        >
          Motorsport
        </p>
      </div>

      {/* Bottom progress line */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-white/5 overflow-hidden">
        <div
          className="h-full"
          style={{
            background: 'linear-gradient(90deg, transparent, #d4af37, transparent)',
            width: '40%',
            transform: phase === 'in' ? 'translateX(-100%)' : 'translateX(350%)',
            transition: phase === 'in' ? 'none' : 'transform 1.6s cubic-bezier(0.4,0,0.2,1) 0.1s',
          }}
        />
      </div>
    </div>
  );
}

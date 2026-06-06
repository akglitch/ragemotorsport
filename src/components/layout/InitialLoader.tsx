'use client';
import { useState, useEffect } from 'react';

export default function InitialLoader() {
  const [mounted, setMounted] = useState(false);
  const [out,     setOut]     = useState(false);
  const [gone,    setGone]    = useState(false);

  useEffect(() => {
    const t0 = setTimeout(() => setMounted(true),   80);
    const t1 = setTimeout(() => setOut(true),      1900);
    const t2 = setTimeout(() => setGone(true),     2500);
    return () => [t0, t1, t2].forEach(clearTimeout);
  }, []);

  if (gone) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: '#fff',
      display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column',
      gap: 0,
      opacity: out ? 0 : 1,
      transition: out ? 'opacity 0.6s ease' : 'none',
      pointerEvents: out ? 'none' : 'auto',
    }}>

      {/* RAGE — curtain reveal (parent clips, child slides up) */}
      <div style={{ overflow: 'hidden', lineHeight: 1 }}>
        <p style={{
          margin: 0,
          fontFamily: 'var(--font-jakarta), sans-serif',
          fontSize: 'clamp(2rem, 6vw, 3.5rem)',
          fontWeight: 800,
          letterSpacing: '0.18em',
          color: '#0a0e17',
          textTransform: 'uppercase',
          transform: mounted ? 'translateY(0)' : 'translateY(105%)',
          transition: 'transform 1s cubic-bezier(0.16,1,0.3,1) 0.08s',
        }}>
          Rage
        </p>
      </div>

      {/* Gold rule — grows from left */}
      <div style={{ overflow: 'hidden', margin: '14px 0 12px', height: '1px', width: '100%', display: 'flex', justifyContent: 'center' }}>
        <div style={{
          height: '1px',
          width: mounted ? '64px' : '0px',
          background: 'linear-gradient(90deg, transparent, #c9a84c 40%, transparent)',
          transition: 'width 0.9s cubic-bezier(0.16,1,0.3,1) 0.45s',
        }} />
      </div>

      {/* MOTORSPORT — fades up */}
      <div style={{ overflow: 'hidden', lineHeight: 1 }}>
        <p style={{
          margin: 0,
          fontFamily: 'var(--font-inter), sans-serif',
          fontSize: '0.52rem',
          fontWeight: 500,
          letterSpacing: '0.32em',
          textTransform: 'uppercase',
          color: 'rgba(10,14,23,0.38)',
          transform: mounted ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform 0.8s cubic-bezier(0.16,1,0.3,1) 0.65s',
        }}>
          Motorsport
        </p>
      </div>
    </div>
  );
}

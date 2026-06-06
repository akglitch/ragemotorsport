export default function Loading() {
  return (
    <div className="fixed inset-0 z-[1000] flex flex-col items-center justify-center" style={{ background: 'var(--bg)' }}>
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full opacity-10 animate-pulse" style={{ background: 'radial-gradient(circle, var(--gold) 0%, transparent 70%)' }} />
      
      {/* Central Brand */}
      <div className="relative flex flex-col items-center z-10">
        <h1 className="display text-6xl md:text-8xl font-black tracking-[0.2em] relative z-10" style={{ color: 'var(--text)' }}>
          RAGE
        </h1>
        <div className="flex items-center gap-4 mt-6">
          <div className="w-12 h-[1px]" style={{ background: 'linear-gradient(90deg, transparent, var(--gold))' }} />
          <span className="text-xs uppercase tracking-[0.4em] font-semibold" style={{ color: 'var(--gold)' }}>
            Motorsport
          </span>
          <div className="w-12 h-[1px]" style={{ background: 'linear-gradient(270deg, transparent, var(--gold))' }} />
        </div>
      </div>

      {/* Orbit spinner */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] md:w-[380px] md:h-[380px] rounded-full border border-dashed border-white/5 animate-[spin_10s_linear_infinite]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[420px] md:h-[420px] rounded-full border border-white/5 animate-[spin_15s_linear_infinite_reverse]" />
      
      {/* Small orbiting dot */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] md:w-[380px] md:h-[380px] animate-[spin_4s_ease-in-out_infinite]">
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full" style={{ background: 'var(--gold)', boxShadow: '0 0 10px var(--gold)' }} />
      </div>
    </div>
  );
}

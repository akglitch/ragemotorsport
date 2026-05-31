interface CarTypeIconProps {
  type: string;
  className?: string;
}

/**
 * Inline side-profile silhouettes for body styles.
 * Single-color (currentColor) so they inherit the ink palette and hover states.
 * Wheels use a hollow hub (var(--surface)) to read as tires.
 */
export default function CarTypeIcon({ type, className }: CarTypeIconProps) {
  const body = bodies[type] ?? bodies.Sedan;
  const wheels = type === 'Truck' ? { front: 40, rear: 128 } : { front: 46, rear: 120 };

  return (
    <svg
      viewBox="0 0 168 78"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-hidden="true"
    >
      <path d={body} fill="currentColor" />
      {/* Wheels */}
      <circle cx={wheels.front} cy={62} r={13} fill="currentColor" />
      <circle cx={wheels.rear} cy={62} r={13} fill="currentColor" />
      <circle cx={wheels.front} cy={62} r={5.5} fill="var(--surface)" />
      <circle cx={wheels.rear} cy={62} r={5.5} fill="var(--surface)" />
    </svg>
  );
}

const bodies: Record<string, string> = {
  // Three-box notchback
  Sedan:
    'M12 62 L12 46 C12 43 14 42 18 41 L30 40 L52 27 C55 25 58 24 62 24 L98 24 L120 41 L152 44 C156 45 158 47 158 50 L158 62 Z',
  // Low sleek fastback
  Coupe:
    'M14 62 L14 47 C14 44 16 43 20 42 L34 41 L62 26 C66 24 70 23 76 24 L98 26 L142 45 L152 48 C156 49 156 51 156 53 L156 62 Z',
  // Tall boxy greenhouse
  SUV:
    'M12 62 L12 44 C12 41 14 40 18 39 L26 38 L44 22 C46 20 49 19 53 19 L120 19 C124 19 127 20 129 23 L140 39 L152 41 C156 42 158 44 158 47 L158 62 Z',
  // Cab + open bed
  Truck:
    'M10 62 L10 44 C10 41 12 40 16 39 L24 38 L38 24 C40 22 43 21 47 21 L70 21 C74 21 76 23 76 27 L76 41 L150 41 C155 41 158 43 158 47 L158 62 L150 62 L150 46 L84 46 L84 62 Z',
  // Short rear hatch
  Hatchback:
    'M14 62 L14 46 C14 43 16 42 20 41 L32 40 L54 26 C57 24 60 23 64 23 L100 23 L120 42 L134 44 C138 45 140 47 140 50 L140 62 Z',
  // Open top, low windshield
  Convertible:
    'M12 62 L12 46 C12 43 14 42 18 41 L34 40 L50 30 C52 29 54 28 57 28 L62 28 C64 28 65 29 64 31 L60 41 L142 44 C150 45 156 47 156 51 L156 62 Z',
};

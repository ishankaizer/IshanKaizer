/**
 * Site-wide atmosphere: a barely-there tonal gradient, a few soft organic
 * colour fields, and fine film grain — so warm paper reads as a real
 * material rather than a flat fill. Deliberately below the threshold of
 * "noticed"; it sits behind all content and never competes with it.
 */
const GRAIN =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"

export function BackgroundField() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* soft organic colour fields + tonal drift */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: [
            'radial-gradient(55% 48% at 14% 16%, color-mix(in oklab, #c9893a 9%, transparent), transparent 70%)',
            'radial-gradient(52% 50% at 86% 84%, color-mix(in oklab, #5f7681 9%, transparent), transparent 70%)',
            'radial-gradient(40% 36% at 78% 32%, color-mix(in oklab, var(--brand) 5%, transparent), transparent 68%)',
            'linear-gradient(158deg, transparent 42%, color-mix(in oklab, var(--ink) 3%, transparent))',
          ].join(','),
        }}
      />
      {/* film grain */}
      <div
        className="absolute inset-0 opacity-[0.32] mix-blend-overlay dark:opacity-[0.15]"
        style={{ backgroundImage: `url("${GRAIN}")`, backgroundSize: '200px 200px' }}
      />
    </div>
  )
}

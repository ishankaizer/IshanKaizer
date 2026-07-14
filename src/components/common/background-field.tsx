import { useEffect, useRef } from 'react'

/**
 * Site-wide atmosphere: irregular, organic colour fields (blurred SVG
 * blobs, not ellipses), a faint tonal drift, and fine film grain, so warm
 * paper reads as a real material rather than a flat fill. The colour fields
 * drift with the pointer for a subtle parallax. Kept soft and behind all
 * content so it never competes with the work.
 */
const GRAIN =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"

export function BackgroundField() {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (!window.matchMedia('(pointer: fine)').matches) return
    const svg = svgRef.current
    if (!svg) return

    let tx = 0
    let ty = 0
    let cx = 0
    let cy = 0
    let raf = 0
    const render = () => {
      cx += (tx - cx) * 0.06
      cy += (ty - cy) * 0.06
      svg.style.transform = `translate3d(${cx * -24}px, ${cy * -24}px, 0) scale(1.1)`
      raf = requestAnimationFrame(render)
    }
    raf = requestAnimationFrame(render)

    const onMove = (e: MouseEvent) => {
      tx = e.clientX / window.innerWidth - 0.5
      ty = e.clientY / window.innerHeight - 0.5
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMove)
    }
  }, [])

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* organic colour fields, irregular blurred blobs */}
      <svg
        ref={svgRef}
        className="absolute inset-0 h-full w-full opacity-100 dark:opacity-[0.55]"
        style={{ transformOrigin: 'center', willChange: 'transform', transform: 'scale(1.1)' }}
        viewBox="0 0 1600 1000"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <filter id="bf-soft" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="95" />
          </filter>
        </defs>
        <g filter="url(#bf-soft)">
          <path
            d="M-120 140 C120 -40 380 -30 520 165 C615 300 515 445 335 480 C150 516 -50 440 -150 305 C-215 215 -230 210 -120 140 Z"
            fill="#c9863a"
            opacity="0.22"
          />
          <path
            d="M1740 630 C1560 505 1300 555 1205 725 C1135 850 1235 1010 1430 1040 C1620 1068 1795 945 1835 800 C1862 712 1840 705 1740 630 Z"
            fill="#5f7681"
            opacity="0.2"
          />
          <path
            d="M320 800 C205 715 55 760 60 885 C64 985 205 1045 330 1000 C445 960 440 878 320 800 Z"
            fill="#8a7a52"
            opacity="0.14"
          />
          <path
            d="M1200 235 C1090 165 950 210 942 335 C935 438 1050 505 1170 472 C1300 437 1312 322 1200 235 Z"
            fill="#d5392a"
            opacity="0.08"
          />
        </g>
      </svg>

      {/* faint tonal drift */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(152deg, color-mix(in oklab, var(--ink) 3%, transparent), transparent 40%, color-mix(in oklab, var(--ink) 4%, transparent))',
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

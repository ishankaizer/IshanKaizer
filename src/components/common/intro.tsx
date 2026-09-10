import { useEffect, useMemo, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

/**
 * First-load moment: the "old" maximalist portfolio collage opens as if someone
 * launched the wrong file, a caption admits it, and the screen cracks and falls
 * away to reveal the real hero.
 *
 * Robustness: the hero renders underneath from the start, every phase change is
 * a hard setTimeout (never an animation event), and the overlay unmounts on a
 * timer no matter what. The image gates only the start of the hold, capped at
 * LOAD_CAP, so a slow network can delay the intro but never stall it.
 */
const IMAGE = '/intro/portfolio-v1.webp'
const WRONG_AT = 1350 // when the caption admits it is the wrong file
const ARM_BEFORE = 300 // mount the (still unbroken) shards early, see below
const HOLD = 1900 // collage on screen before the impact
const LOAD_CAP = 2000 // start the hold even if the image is slow
const FALL = 1450 // crack, stagger and fall; matches .intro-shard
const COLS = 6
const ROWS = 4

interface Shard {
  clip: string
  origin: string
  /** Tiny separation at the crack, before gravity takes over. */
  cx: string
  cy: string
  crot: string
  /** Where the piece ends up. */
  dx: string
  rot: string
  delay: string
}

interface Break {
  shards: Shard[]
  ix: number
  iy: number
}

function mulberry32(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** A jittered grid: neighbouring shards share corner points, so no gaps. */
function buildBreak(seed: number): Break {
  const rnd = mulberry32(seed)
  const pts: [number, number][][] = []
  for (let r = 0; r <= ROWS; r++) {
    const row: [number, number][] = []
    for (let c = 0; c <= COLS; c++) {
      let x = (c / COLS) * 100
      let y = (r / ROWS) * 100
      if (c > 0 && c < COLS) x += (rnd() - 0.5) * (100 / COLS) * 0.6
      if (r > 0 && r < ROWS) y += (rnd() - 0.5) * (100 / ROWS) * 0.6
      row.push([x, y])
    }
    pts.push(row)
  }
  const ix = 38 + rnd() * 24
  const iy = 32 + rnd() * 26
  const shards: Shard[] = []
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const quad = [pts[r][c], pts[r][c + 1], pts[r + 1][c + 1], pts[r + 1][c]]
      const cx = quad.reduce((s, p) => s + p[0], 0) / 4
      const cy = quad.reduce((s, p) => s + p[1], 0) / 4
      const dist = Math.hypot(cx - ix, cy - iy)
      const away = Math.max(dist, 0.001)
      shards.push({
        clip: `polygon(${quad.map((p) => `${p[0].toFixed(2)}% ${p[1].toFixed(2)}%`).join(', ')})`,
        origin: `${cx.toFixed(2)}% ${cy.toFixed(2)}%`,
        cx: `${(((cx - ix) / away) * 5).toFixed(2)}px`,
        cy: `${(((cy - iy) / away) * 5).toFixed(2)}px`,
        crot: `${((rnd() - 0.5) * 1.6).toFixed(2)}deg`,
        dx: `${((cx - ix) * 0.75 + (rnd() - 0.5) * 14).toFixed(1)}vw`,
        rot: `${((rnd() - 0.5) * 160).toFixed(1)}deg`,
        // Pieces nearest the impact let go first, the rest follow outward.
        delay: `${Math.round(dist * 4.2 + rnd() * 60)}ms`,
      })
    }
  }
  return { shards, ix, iy }
}

export function Intro({ onReveal, onDone }: { onReveal: () => void; onDone: () => void }) {
  const { shards, ix, iy } = useMemo(() => buildBreak(7), [])
  const [loaded, setLoaded] = useState(false)
  const [shown, setShown] = useState(false)
  const [wrong, setWrong] = useState(false)
  const [armed, setArmed] = useState(false)
  const [breaking, setBreaking] = useState(false)
  const reveal = useRef(onReveal)
  const done = useRef(onDone)
  reveal.current = onReveal
  done.current = onDone

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  useEffect(() => {
    if (shown) return
    if (loaded) {
      setShown(true)
      return
    }
    const t = window.setTimeout(() => setShown(true), LOAD_CAP)
    return () => window.clearTimeout(t)
  }, [loaded, shown])

  useEffect(() => {
    if (!shown) return
    const t1 = window.setTimeout(() => setWrong(true), WRONG_AT)
    // Mount the pieces while they still line up exactly with the screen, so the
    // compositor has already rasterised all of them when the break starts.
    // Nothing changes on screen at this point.
    const t2 = window.setTimeout(() => setArmed(true), HOLD - ARM_BEFORE)
    const t3 = window.setTimeout(() => {
      setBreaking(true)
      reveal.current()
    }, HOLD)
    const t4 = window.setTimeout(() => done.current(), HOLD + FALL)
    return () => {
      window.clearTimeout(t1)
      window.clearTimeout(t2)
      window.clearTimeout(t3)
      window.clearTimeout(t4)
    }
  }, [shown])

  const art = { backgroundImage: `url(${IMAGE})` }

  return (
    <div
      aria-hidden
      className={cn(
        'intro fixed inset-0 z-[300] overflow-hidden',
        shown && 'is-shown',
        breaking && 'is-breaking',
      )}
    >
      <img src={IMAGE} alt="" onLoad={() => setLoaded(true)} className="hidden" />

      {/* Ambient fill so the letterboxed collage does not sit in dead black.
          It outlives the crack by a beat, then clears for the hero. */}
      <div
        className={cn('intro-ambient absolute inset-0', shown && 'is-on')}
        style={art}
      />

      {!breaking && (
        <div className={cn('intro-screen absolute inset-0', shown && 'is-on')} style={art} />
      )}

      {armed &&
        shards.map((s, i) => (
          <div
            key={i}
            className="intro-shard absolute inset-0"
            style={{
              ...art,
              clipPath: s.clip,
              transformOrigin: s.origin,
              animationDelay: s.delay,
              ['--cx' as string]: s.cx,
              ['--cy' as string]: s.cy,
              ['--crot' as string]: s.crot,
              ['--dx' as string]: s.dx,
              ['--rot' as string]: s.rot,
            }}
          />
        ))}

      {breaking && (
        <div
          className="intro-impact absolute inset-0"
          style={{ ['--ix' as string]: `${ix}%`, ['--iy' as string]: `${iy}%` }}
        />
      )}

      <p
        className={cn(
          'absolute bottom-5 left-5 font-mono text-[0.68rem] uppercase tracking-[0.18em] transition-opacity duration-300 sm:bottom-7 sm:left-7',
          shown && !breaking ? 'opacity-100' : 'opacity-0',
        )}
      >
        {wrong ? (
          <span className="text-brand">wrong one.</span>
        ) : (
          <>
            <span className="text-white/55">opening </span>
            <span className="text-white/90">portfolio_v1_FINAL(2).png</span>
            <span className="intro-cursor text-white/90">_</span>
          </>
        )}
      </p>
    </div>
  )
}

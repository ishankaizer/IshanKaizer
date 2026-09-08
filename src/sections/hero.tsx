import { useLayoutEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { Container } from '@/components/common/container'
import { site } from '@/data/site'
import { cn } from '@/lib/utils'

/** The things he does, kept short and visual. */
const disciplines = [
  'Industrial Design',
  'Product Design',
  'UI / UX',
  'Visualization',
  'Branding',
  'Frontend',
]

const HOLD = 1500 // how long the centred name is held before it moves
const MOVE = 1300 // how long the slot-into-position glide takes
const EASE = 'cubic-bezier(0.76, 0, 0.24, 1)'

export function Hero() {
  const reduce = useReducedMotion()
  const nameRef = useRef<HTMLHeadingElement>(null)
  const ishanRef = useRef<HTMLSpanElement>(null)
  const kaizerRef = useRef<HTMLSpanElement>(null)
  const [intro, setIntro] = useState(false)
  const [ready, setReady] = useState(false)

  useLayoutEffect(() => {
    let play = true
    try {
      play = sessionStorage.getItem('introPlayed') !== 'true'
    } catch {
      play = true
    }
    const h1 = nameRef.current
    const w1 = ishanRef.current
    const w2 = kaizerRef.current

    // No intro: reveal the hero content shortly after mount.
    if (!play || reduce || !h1 || !w1 || !w2) {
      try {
        sessionStorage.setItem('introPlayed', 'true')
      } catch {
        /* ignore */
      }
      const t = window.setTimeout(() => setReady(true), 60)
      return () => window.clearTimeout(t)
    }

    setIntro(true)
    document.body.style.overflow = 'hidden'
    h1.style.position = 'relative'
    h1.style.zIndex = '210'

    // Measure the true resting rects of each word (two-line layout).
    w1.style.transition = 'none'
    w2.style.transition = 'none'
    w1.style.transform = 'none'
    w2.style.transform = 'none'
    const r1 = w1.getBoundingClientRect()
    const r2 = w2.getBoundingClientRect()

    // Build a single centred line and compute each word's transform to it.
    const fontSize = parseFloat(getComputedStyle(h1).fontSize) || r1.height
    const gap = fontSize * 0.32
    const vw = window.innerWidth
    const vh = window.innerHeight
    const oneLine = r1.width + gap + r2.width
    const s = Math.min(1, (vw * 0.9) / oneLine)
    const total = (r1.width + gap + r2.width) * s
    const left = (vw - total) / 2
    const cy = vh / 2
    const cx1 = left + (r1.width * s) / 2
    const cx2 = left + (r1.width + gap) * s + (r2.width * s) / 2
    const rc1x = r1.left + r1.width / 2
    const rc1y = r1.top + r1.height / 2
    const rc2x = r2.left + r2.width / 2
    const rc2y = r2.top + r2.height / 2

    for (const w of [w1, w2]) {
      w.style.transformOrigin = 'center'
      w.style.willChange = 'transform'
    }
    w1.style.transform = `translate(${cx1 - rc1x}px, ${cy - rc1y}px) scale(${s})`
    w2.style.transform = `translate(${cx2 - rc2x}px, ${cy - rc2y}px) scale(${s})`

    const t1 = window.setTimeout(() => {
      w1.style.transition = `transform ${MOVE}ms ${EASE}`
      w2.style.transition = `transform ${MOVE}ms ${EASE} 90ms`
      w1.style.transform = 'none'
      w2.style.transform = 'none'
      setReady(true)
    }, HOLD)
    const t2 = window.setTimeout(() => {
      for (const w of [w1, w2]) {
        w.style.transition = ''
        w.style.transform = ''
        w.style.transformOrigin = ''
        w.style.willChange = ''
      }
      h1.style.position = ''
      h1.style.zIndex = ''
      document.body.style.overflow = ''
      try {
        sessionStorage.setItem('introPlayed', 'true')
      } catch {
        /* ignore */
      }
      setIntro(false)
    }, HOLD + MOVE + 250)

    return () => {
      window.clearTimeout(t1)
      window.clearTimeout(t2)
      document.body.style.overflow = ''
    }
  }, [reduce])

  return (
    <section
      id="hero"
      data-hero-ready={ready ? 'true' : 'false'}
      className={cn(
        'relative overflow-hidden border-b border-hairline',
        intro && 'hero-intro',
      )}
    >
      {intro && (
        <div
          aria-hidden
          className={cn(
            'fixed inset-0 z-[200] bg-paper transition-opacity duration-1000 ease-out',
            ready ? 'opacity-0' : 'opacity-100',
          )}
        />
      )}

      <Container>
        <div className="grid min-h-[calc(100svh-4rem)] items-center gap-12 py-20 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Left: identity, nothing more. */}
          <div>
            <p
              className="hero-stagger font-mono text-xs uppercase tracking-[0.2em] text-ink-mute"
              style={{ transitionDelay: '0.05s' }}
            >
              {site.location}
            </p>

            <h1
              ref={nameRef}
              className="mt-6 font-display text-[clamp(3rem,11vw,7.5rem)] font-black uppercase leading-[0.86] tracking-[-0.03em] text-ink"
            >
              <span ref={ishanRef} className="block w-fit">
                Ishan
              </span>
              <span ref={kaizerRef} className="block w-fit text-ink-mute">
                Kaizer
              </span>
            </h1>

            <p
              className="hero-stagger mt-8 flex max-w-xl flex-wrap gap-y-1 text-base text-ink-soft sm:text-lg"
              style={{ transitionDelay: '0.2s' }}
            >
              {disciplines.map((d, i) => (
                <span key={d} className="inline-flex items-center">
                  {i > 0 && (
                    <span aria-hidden className="mx-2 text-brand">
                      &middot;
                    </span>
                  )}
                  {d}
                </span>
              ))}
            </p>

            <div
              className="hero-stagger mt-10 flex flex-wrap items-center gap-x-6 gap-y-3"
              style={{ transitionDelay: '0.28s' }}
            >
              <a
                href="#work"
                className="inline-flex items-center bg-ink px-6 py-3 text-sm font-semibold text-paper transition-colors hover:bg-brand"
              >
                View the work
              </a>
              <a
                href={site.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-ink underline-offset-4 transition-colors hover:text-brand hover:underline"
              >
                Résumé &#8599;
              </a>
            </div>
          </div>

          {/* Right: portrait, an industrial-design nod. Desktop only. */}
          <div
            className="hero-stagger hidden lg:block"
            style={{ transitionDelay: '0.34s' }}
          >
            <div className="draft-grid relative aspect-square w-full overflow-hidden rounded-lg border border-hairline">
              <span className="absolute left-4 top-4 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-ink-mute">
                Fig. 01
              </span>
              <img
                src="/hero/fig-01.jpg"
                alt="Ishan Kaizer"
                loading="eager"
                decoding="async"
                className="size-full object-cover grayscale transition-[filter] duration-500 hover:grayscale-0"
              />
              <span className="absolute bottom-4 right-4 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-brand">
                object &middot; interface &middot; code
              </span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}

import { useEffect, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { Container } from '@/components/common/container'
import { Intro } from '@/components/common/intro'
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

/** The see-through window of /hero/polaroid.webp, in percent of the card. */
const WINDOW = { left: '3.3%', top: '15.55%', width: '90.7%', height: '69.3%' }

/** A few stickers from the desk (section 06) peeking around the card. */
const stickers = [
  { src: '/likes/stickers/star.webp', alt: '', w: 'w-16 lg:w-24', pos: '-left-6 -top-6 lg:-left-12 lg:-top-8', r: -14, drift: 7 },
  { src: '/likes/stickers/worm-03.webp', alt: '', w: 'w-24 lg:w-32', pos: '-bottom-4 -right-6 lg:-right-14', r: 12, drift: 8.5 },
  { src: '/likes/stickers/tiger-small.webp', alt: '', w: 'w-16 lg:w-24', pos: 'bottom-20 -left-8 lg:-left-16', r: 9, drift: 6.5 },
]

export function Hero() {
  const reduce = useReducedMotion()
  const [intro, setIntro] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let play = true
    try {
      play = sessionStorage.getItem('introPlayed') !== 'true'
    } catch {
      play = true
    }
    if (!play || reduce) {
      try {
        sessionStorage.setItem('introPlayed', 'true')
      } catch {
        /* ignore */
      }
      const t = window.setTimeout(() => setReady(true), 60)
      return () => window.clearTimeout(t)
    }
    setIntro(true)
  }, [reduce])

  const finish = () => {
    try {
      sessionStorage.setItem('introPlayed', 'true')
    } catch {
      /* ignore */
    }
    setReady(true)
    setIntro(false)
  }

  return (
    <section
      id="hero"
      data-hero-ready={ready ? 'true' : 'false'}
      className={cn('relative overflow-hidden border-b border-hairline', intro && 'hero-intro')}
    >
      {intro && <Intro onReveal={() => setReady(true)} onDone={finish} />}

      <Container className="relative">
        <div className="grid min-h-[calc(100svh-4rem)] items-center gap-14 py-16 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
          <div>
            <p
              className="hero-stagger font-mono text-xs uppercase tracking-[0.2em] text-ink-mute"
              style={{ transitionDelay: '0.05s' }}
            >
              {site.location}
            </p>

            <h1 className="hero-stagger mt-6 font-display text-[clamp(3rem,11vw,7.5rem)] font-black uppercase leading-[0.86] tracking-[-0.03em] text-ink">
              <span className="block">Ishan</span>
              <span className="block text-ink-mute">Kaizer</span>
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

          {/* The photo, pinned up like a print: a worn 1979 card with his
              picture in the window, a strip of tape, a few stickers from the
              desk. Colour comes in on hover. */}
          <div
            className="hero-stagger relative mx-auto w-full max-w-[400px] px-6 sm:max-w-[460px] lg:max-w-[560px] lg:px-4"
            style={{ transitionDelay: '0.34s' }}
          >
            <div className="polaroid group relative">
              <div className="absolute overflow-hidden bg-[#141210]" style={WINDOW}>
                <img
                  src="/hero/fig-01.jpg"
                  alt="Ishan Kaizer"
                  width={1439}
                  height={1892}
                  loading="eager"
                  decoding="async"
                  className="size-full object-cover object-[50%_38%] grayscale transition-[filter] duration-700 group-hover:grayscale-0"
                />
              </div>
              <img
                src="/hero/polaroid.webp"
                alt=""
                width={818}
                height={1074}
                loading="eager"
                decoding="async"
                draggable={false}
                className="relative block h-auto w-full select-none"
              />
              <span className="absolute bottom-[5%] left-[6.5%] font-mono text-[0.6rem] uppercase tracking-[0.18em] text-[#3a352c] sm:text-[0.68rem]">
                fig. 01 &middot; {site.location}
              </span>
              <span aria-hidden className="polaroid-tape" />
            </div>

            {stickers.map((s) => (
              <span
                key={s.src}
                aria-hidden
                className={cn('sticker pointer-events-none absolute', s.w, s.pos)}
                style={{ rotate: `${s.r}deg` }}
              >
                <img
                  src={s.src}
                  alt=""
                  loading="eager"
                  decoding="async"
                  draggable={false}
                  className="block h-auto w-full"
                  style={reduce ? undefined : { animationDuration: `${s.drift}s`, animationDelay: `${-s.drift / 2}s` }}
                />
              </span>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}

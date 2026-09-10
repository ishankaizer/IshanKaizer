import { useId, useLayoutEffect, useRef, useState } from 'react'
import { cubicBezier, motion, useMotionValue, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { Container } from '@/components/common/container'
import { Pinned } from '@/components/common/pinned'
import { SectionHeader } from '@/components/common/section-header'
import { experience, receipt } from '@/data/experience'
import { site } from '@/data/site'
import type { ExperienceRole } from '@/types'

/**
 * Experience as a till receipt. The paper arrives a little small and, as you
 * scroll into it, grows to full size (a pinned stage scales it about its top
 * edge over PIN_VH of scroll), then releases and the rest of the receipt
 * scrolls natively at full size. Each line item unfolds its detail on click.
 * The paper ends torn along a perforation, with the customer-copy stub
 * hanging off the end.
 *
 * Readability first: the receipt is never scaled at rest, stickers sit in the
 * margins beside the paper (desktop only) and never over the print, and the
 * section reserves the paper's overflow as padding, measured from its real
 * height, so unfolding an item just makes the page longer.
 *
 * Robustness: the resting layout is scale 1; every value is a pure function of
 * scroll position; reduced motion skips the pin.
 */
const MAX_W = 640
const START_SCALE = 0.72
const PIN_VH = 70
const TOP = 96 // below the sticky nav
const TEETH = 26

const mech = cubicBezier(0.16, 0.84, 0.3, 1)

/** A serrated edge as a clip-path, teeth along the bottom (or the top). */
function tear(edge: 'bottom' | 'top', depth = 10) {
  const pts: string[] = []
  const step = 100 / TEETH
  if (edge === 'bottom') {
    pts.push('0 0', '100% 0')
    for (let i = TEETH; i >= 0; i--) {
      const x = i * step
      pts.push(`${x.toFixed(2)}% calc(100% - ${i % 2 ? depth : 0}px)`)
    }
  } else {
    for (let i = 0; i <= TEETH; i++) {
      const x = i * step
      pts.push(`${x.toFixed(2)}% ${i % 2 ? depth : 0}px`)
    }
    pts.push('100% 100%', '0 100%')
  }
  return `polygon(${pts.join(', ')})`
}

function receiptDate() {
  return new Date()
    .toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
    .toUpperCase()
}

function Row({ role, index }: { role: ExperienceRole; index: number }) {
  const [open, setOpen] = useState(false)
  const id = useId()
  const foldable = role.points.length > 0
  // Narrow paper stacks the date under the item; side by side there is not
  // enough room for both and the role name wraps a word per line.
  const head = (
    <span className="grid w-full grid-cols-[2.4ch_1fr] gap-x-4 text-left sm:grid-cols-[2.4ch_1fr_auto]">
      <span>{String(index + 1).padStart(2, '0')}</span>
      <span className="min-w-0">
        <span className="block font-semibold">{role.role}</span>
        <span className="block text-[0.92em] opacity-80">
          {role.org}
          {role.location ? `, ${role.location}` : ''}
        </span>
        <span className="mt-1 block text-[0.88em] opacity-70 sm:hidden">{role.when}</span>
        {foldable && (
          <span className="mt-1 block text-[0.85em] tracking-[0.08em] opacity-60">
            [{open ? '-' : '+'}] {open ? 'fold' : 'details'}
          </span>
        )}
      </span>
      <span className="hidden whitespace-nowrap text-right text-[0.9em] sm:block">{role.when}</span>
    </span>
  )
  return (
    <li className="py-3">
      {foldable ? (
        <button
          type="button"
          aria-expanded={open}
          aria-controls={id}
          onClick={() => setOpen((o) => !o)}
          className="receipt-row block w-full cursor-pointer"
        >
          {head}
        </button>
      ) : (
        head
      )}
      {foldable && (
        <ul id={id} hidden={!open} className="mt-2.5 flex flex-col gap-2 pl-[2.4ch] text-[0.92em] normal-case">
          {role.points.map((p) => (
            <li key={p.slice(0, 24)} className="flex gap-2">
              <span aria-hidden>*</span>
              <span>{p}</span>
            </li>
          ))}
        </ul>
      )}
    </li>
  )
}

function Rule() {
  return <span aria-hidden className="receipt-rule my-3 block" />
}

function Receipt() {
  return (
    <div className="receipt-world">
      <div className="receipt-paper relative" style={{ clipPath: tear('bottom') }}>
        <div className="receipt-body px-7 pb-12 pt-10 font-mono text-[0.86rem] uppercase leading-snug tracking-[0.02em] sm:px-9 sm:text-[0.95rem]">
          <p className="text-center font-display text-[2.6rem] font-black uppercase leading-none tracking-tight sm:text-[3rem]">
            Receipt
          </p>
          <p className="mt-1.5 text-center">Experience, 2022 to present</p>

          <p className="mt-7">Order #{receipt.order} for {site.name.replace(' ', '').toUpperCase()}</p>
          <p>{receiptDate()}</p>
          <Rule />
          <p className="grid grid-cols-[2.4ch_1fr] gap-x-4 sm:grid-cols-[2.4ch_1fr_auto]">
            <span>Qty</span>
            <span>Item</span>
            <span className="hidden sm:block">Amt</span>
          </p>
          <Rule />
          <ol className="divide-y divide-dashed divide-[rgba(33,29,23,0.18)]">
            {experience.map((role, i) => (
              <Row key={role.role + role.when} role={role} index={i} />
            ))}
          </ol>
          <Rule />
          <p className="flex justify-between">
            <span>Item count:</span>
            <span>{String(experience.length).padStart(2, '0')}</span>
          </p>
          <p className="flex justify-between font-semibold">
            <span>Total:</span>
            <span>{receipt.total}</span>
          </p>
          <Rule />
          <p>Card #: **** **** **** 2026</p>
          <p>Auth code: {receipt.auth}</p>
          <p>Cardholder: {site.name}</p>
          <p className="mt-7 text-center">{receipt.thanks}</p>
          <span aria-hidden className="receipt-barcode mx-auto mt-4 block h-14 w-[82%]" />
          <p className="mt-2 text-center text-[0.9em] normal-case">{site.url.replace('https://', '')}</p>
          <p className="mt-8 text-center text-[0.8em] tracking-[0.2em] opacity-60">
            &#10218; tear here &#10219;
          </p>
        </div>
      </div>

      {/* The stub, torn off along the perforation and left hanging askew. */}
      <div className="receipt-stub relative mx-auto mt-2 w-[72%]" style={{ clipPath: tear('top') }}>
        <div className="receipt-body px-6 pb-6 pt-8 text-center font-mono text-[0.7rem] uppercase leading-snug tracking-[0.14em] sm:text-[0.74rem]">
          <p className="font-semibold">Customer copy</p>
          <p className="mt-1 opacity-70">Keep for your records. No refunds.</p>
          <p className="mt-3 opacity-60">
            Still printing<span className="receipt-cursor" aria-hidden>_</span>
          </p>
        </div>
      </div>

      {/* Margins only, never over the print. */}
      <Pinned src="/stickers/frog-glitter.webp" className="hidden w-28 lg:block" tilt={14} />
      <Pinned src="/stickers/dog-heart.webp" className="hidden w-28 lg:block" tilt={-10} />
      <Pinned src="/stickers/designer-badge.webp" className="hidden w-28 lg:block" tilt={8} />
      <Pinned src="/stickers/succeed-crazy.webp" variant="taped" className="hidden w-40 lg:block" tilt={-7} caption="motivational" />
    </div>
  )
}

export function Experience() {
  const reduce = useReducedMotion()
  const pinRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const worldRef = useRef<HTMLDivElement>(null)
  const [w, setW] = useState(MAX_W)
  const [tail, setTail] = useState(0)
  const s0 = useMotionValue(START_SCALE)

  useLayoutEffect(() => {
    const stage = stageRef.current
    const world = worldRef.current
    if (!stage || !world) return
    const measure = () => {
      const sw = stage.clientWidth
      const sh = stage.clientHeight
      setW(Math.min(MAX_W, sw - 32))
      // Phones already show the paper edge to edge; the zoom there is gentle.
      s0.set(sw < 640 ? 0.88 : START_SCALE)
      setTail(Math.max(0, TOP + world.offsetHeight - sh))
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(stage)
    ro.observe(world)
    return () => ro.disconnect()
  }, [s0])

  const { scrollYProgress } = useScroll({ target: pinRef, offset: ['start start', 'end end'] })
  const p = useTransform(scrollYProgress, [0, 1], [0, 1], { ease: mech })
  const scale = useTransform([p, s0], ([v, s]: number[]) => s + (1 - s) * v)

  return (
    <section
      id="experience"
      className="scroll-mt-24 border-t border-hairline"
      style={{ paddingBottom: tail + 112 }}
    >
      <Container className="pt-20 sm:pt-28 lg:pt-32">
        <SectionHeader
          index="03"
          eyebrow="Experience"
          title={
            <>
              Where I&rsquo;ve{' '}
              <span className="font-serif font-normal normal-case italic text-brand">
                put in the reps.
              </span>
            </>
          }
          description="Tap a line item for the details."
        />
      </Container>

      <div ref={pinRef} data-pin style={{ height: reduce ? '100svh' : `calc(100svh + ${PIN_VH}vh)` }}>
        <div ref={stageRef} className="receipt-stage sticky top-0 h-[100svh]">
          <motion.div
            ref={worldRef}
            className="absolute will-change-transform"
            style={{
              width: w,
              left: `calc(50% - ${w / 2}px)`,
              top: TOP,
              transformOrigin: `${w / 2}px 0px`,
              scale: reduce ? 1 : scale,
            }}
          >
            <Receipt />
          </motion.div>
        </div>
      </div>
    </section>
  )
}

import { useId, useLayoutEffect, useRef, useState } from 'react'
import { cubicBezier, motion, useMotionValue, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { Container } from '@/components/common/container'
import { Pinned } from '@/components/common/pinned'
import { SectionHeader } from '@/components/common/section-header'
import { experience, receipt } from '@/data/experience'
import { site } from '@/data/site'
import type { ExperienceRole } from '@/types'

/**
 * Experience as a till receipt. The owner holds a pink card; on scroll the
 * stage zooms into the card, which pushes him out of frame, and the card turns
 * out to be the tip of a long receipt that runs down into a typewriter still
 * printing it. Each line item unfolds its detail when clicked.
 *
 * One "world" holds the card, the receipt and the machine at their final size
 * (the receipt is never scaled at rest, so its type stays crisp). A pinned
 * stage scales the world from "whole photo fits" to 1 over PIN_VH of scroll,
 * then releases, and the receipt hanging below scrolls natively. The section
 * reserves that overflow as padding, measured from the world's real height, so
 * unfolding an item just makes the page longer.
 *
 * Robustness: the resting layout is scale 1 with the holder faded out; every
 * value is a pure function of scroll position, nothing is gated on an event.
 * Reduced motion skips the pin and lands on the resting layout.
 */

/** Geometry in units of the card width, printed by scripts/gen-experience-assets.py. */
const G = {
  photoW: 2.0631,
  photoH: 1.9798,
  photoLeft: -0.0151,
  photoTop: -0.7957,
  cropW: 1.0151,
  cropH: 0.8159,
  cropLeft: -0.0151,
  cropTop: -0.0883,
  cardH: 0.6015,
  machineAspect: 0.3909,
}
const TUCK = 0.08 // how far the paper starts behind the card
const MACHINE_W = 1.5 // machine width, in card widths
const MACHINE_OVERLAP = 0.16 // paper hidden behind the roller
const PIN_VH = 110 // scroll distance the zoom takes
const MAX_W = 500

const mech = cubicBezier(0.16, 0.84, 0.3, 1)

function receiptDate() {
  return new Date()
    .toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
    .toUpperCase()
}

function Row({ role, index }: { role: ExperienceRole; index: number }) {
  const [open, setOpen] = useState(false)
  const id = useId()
  const foldable = role.points.length > 0
  const head = (
    <span className="grid w-full grid-cols-[2.2ch_1fr_auto] gap-x-3 text-left">
      <span>{String(index + 1).padStart(2, '0')}</span>
      <span className="min-w-0">
        <span className="block font-semibold">{role.role}</span>
        <span className="block text-[0.92em] opacity-80">
          {role.org}
          {role.location ? `, ${role.location}` : ''}
        </span>
        {foldable && (
          <span className="mt-0.5 block text-[0.85em] tracking-[0.08em] opacity-60">
            [{open ? '-' : '+'}] {open ? 'fold' : 'details'}
          </span>
        )}
      </span>
      <span className="whitespace-nowrap text-right text-[0.9em]">{role.when}</span>
    </span>
  )
  return (
    <li className="py-2">
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
        <ul id={id} hidden={!open} className="mt-2 flex flex-col gap-1.5 pl-[2.2ch] text-[0.9em] normal-case">
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
  return <span aria-hidden className="receipt-rule my-2 block" />
}

function Receipt({ w }: { w: number }) {
  return (
    <div className="receipt-paper relative z-0" style={{ marginTop: (G.cardH - TUCK) * w }}>
      <div className="receipt-body px-6 pb-8 pt-16 font-mono text-[0.74rem] uppercase leading-snug tracking-[0.02em] sm:px-7 sm:text-[0.78rem]">
        <p className="text-center font-display text-[2.1rem] font-black uppercase leading-none tracking-tight">
          Receipt
        </p>
        <p className="mt-1 text-center">Experience, 2022 to present</p>

        <p className="mt-6">Order #{receipt.order} for {site.name.replace(' ', '').toUpperCase()}</p>
        <p>{receiptDate()}</p>
        <Rule />
        <p className="grid grid-cols-[2.2ch_1fr_auto] gap-x-3">
          <span>Qty</span>
          <span>Item</span>
          <span>Amt</span>
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
        <p className="mt-6 text-center">{receipt.thanks}</p>
        <span aria-hidden className="receipt-barcode mx-auto mt-4 block h-12 w-[82%]" />
        <p className="mt-2 text-center text-[0.9em] normal-case">{site.url.replace('https://', '')}</p>
        <p className="mt-8 text-[0.85em] opacity-60">
          Still printing<span className="receipt-cursor" aria-hidden>_</span>
        </p>
      </div>

      <Pinned src="/stickers/frog-glitter.webp" className="-right-9 top-[24%] w-24 sm:w-28" tilt={14} />
      <Pinned src="/stickers/dog-heart.webp" className="-left-10 top-[56%] w-24 sm:w-28" tilt={-10} />
      <Pinned src="/stickers/designer-badge.webp" className="right-4 bottom-[9%] w-24 sm:w-28" tilt={8} />
    </div>
  )
}

export function Experience() {
  const reduce = useReducedMotion()
  const pinRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const worldRef = useRef<HTMLDivElement>(null)
  const [w, setW] = useState(MAX_W)
  const [top, setTop] = useState(120)
  const [tail, setTail] = useState(0)
  const s0 = useMotionValue(1)
  const tx = useMotionValue(0)
  const ty = useMotionValue(0)

  useLayoutEffect(() => {
    const stage = stageRef.current
    const world = worldRef.current
    if (!stage || !world) return
    const measure = () => {
      const sw = stage.clientWidth
      const sh = stage.clientHeight
      const cw = Math.min(MAX_W, sw - 40)
      const cardTop = 84 + -G.cropTop * cw // keep the fingers clear of the nav
      setW(cw)
      setTop(cardTop)
      // p = 0: the whole photo sits centred at about two thirds of the stage,
      // so the zoom into the card is a real move, not a nudge.
      const pw = G.photoW * cw
      const ph = G.photoH * cw
      const s = Math.min((sw * 0.86) / pw, (sh * 0.66) / ph, 1)
      const ox = (sw - cw) / 2 + cw / 2
      const oy = cardTop + (G.cardH * cw) / 2
      const pcx = (sw - cw) / 2 + G.photoLeft * cw + pw / 2
      const pcy = cardTop + G.photoTop * cw + ph / 2
      s0.set(s)
      tx.set(sw / 2 - (ox + (pcx - ox) * s))
      ty.set(sh / 2 - (oy + (pcy - oy) * s))
      setTail(Math.max(0, cardTop + world.offsetHeight - sh))
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(stage)
    ro.observe(world)
    return () => ro.disconnect()
  }, [s0, tx, ty])

  const { scrollYProgress } = useScroll({ target: pinRef, offset: ['start start', 'end end'] })
  const p = useTransform(scrollYProgress, [0, 1], [0, 1], { ease: mech })
  const scale = useTransform([p, s0], ([v, s]: number[]) => s + (1 - s) * v)
  const x = useTransform([p, tx], ([v, t]: number[]) => t * (1 - v))
  const y = useTransform([p, ty], ([v, t]: number[]) => t * (1 - v))
  const holderOpacity = useTransform(p, [0, 0.45, 0.9], [1, 1, 0])
  const holderX = useTransform(p, [0, 1], [0, 0.22 * w])

  const worldStyle = reduce
    ? { scale: 1, x: 0, y: 0 }
    : { scale, x, y }

  return (
    <section
      id="experience"
      className="scroll-mt-24 border-t border-hairline"
      style={{ paddingBottom: tail + 96 }}
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
          description="Keep scrolling, it is still printing. Tap a line for the details."
        />
      </Container>

      <div ref={pinRef} data-pin style={{ height: reduce ? '100svh' : `calc(100svh + ${PIN_VH}vh)` }}>
        <div ref={stageRef} className="receipt-stage sticky top-0 h-[100svh]">
          <motion.div
            ref={worldRef}
            className="receipt-world absolute will-change-transform"
            style={{
              width: w,
              left: `calc(50% - ${w / 2}px)`,
              top,
              transformOrigin: `${w / 2}px ${(G.cardH * w) / 2}px`,
              ...worldStyle,
            }}
          >
            {!reduce && (
              <motion.img
                src="/experience/holder.webp"
                alt=""
                aria-hidden
                width={1400}
                height={1343}
                loading="lazy"
                decoding="async"
                draggable={false}
                className="pointer-events-none absolute z-[1] max-w-none select-none"
                style={{
                  width: G.photoW * w,
                  left: G.photoLeft * w,
                  top: G.photoTop * w,
                  opacity: holderOpacity,
                  x: holderX,
                }}
              />
            )}

            <Receipt w={w} />

            <img
              src="/experience/card.webp"
              alt="Ishan holding a pink card that reads Experience, with his festival design team roles and the CIPET Mysore internship listed on it"
              width={805}
              height={647}
              loading="lazy"
              decoding="async"
              draggable={false}
              className="pointer-events-none absolute z-[3] max-w-none select-none drop-shadow-[0_18px_28px_rgba(35,32,26,0.28)]"
              style={{ width: G.cropW * w, left: G.cropLeft * w, top: G.cropTop * w }}
            />

            <Pinned
              src="/stickers/succeed-crazy.webp"
              variant="taped"
              className="hidden w-40 lg:block"
              tilt={-7}
              caption="motivational"
            />

            <div
              className="receipt-machine relative z-[2]"
              style={{
                width: MACHINE_W * w,
                marginLeft: (-(MACHINE_W - 1) / 2) * w,
                marginTop: -MACHINE_OVERLAP * w,
              }}
            >
              <img
                src="/experience/machine.webp"
                alt="A typewriter the receipt is feeding out of"
                width={1100}
                height={430}
                loading="lazy"
                decoding="async"
                draggable={false}
                className="block h-auto w-full"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

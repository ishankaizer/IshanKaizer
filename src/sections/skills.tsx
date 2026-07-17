import { useEffect, useRef, useState } from 'react'
import {
  cubicBezier,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from 'framer-motion'
import { Section } from '@/components/common/section'
import { SectionHeader } from '@/components/common/section-header'
import { toolGroups } from '@/data/about'
import { cn } from '@/lib/utils'

/**
 * The toolkit as an exploded view. The section arrives open: each row stands
 * off to one side and its parts fan apart along the row's baseline, over a
 * faint working grid. Scroll scrubs the assembly, each part translating into
 * its seat in sequence until the composition locks into the resting type
 * specimen. The grid holds at a constant faint value: a drafting sheet's grid
 * does not fade, and driving its opacity off the scroll made framer render it
 * non-monotonically (it visibly reappeared near the end). The section performs
 * the site's thesis:
 * separate instruments, one practice.
 *
 * Poses are derived (see `openPose`), never hand-scattered. An earlier pass
 * flung parts to random corners with heavily overlapped timing, which read as
 * confetti: everything moving at once, from everywhere, which is precisely
 * what "one idea per moment" forbids.
 *
 * Robustness: the resting layout is the natural flow layout. Scatter is pure
 * transform driven by scroll position, so with JS dead or reduced motion the
 * section is simply the assembled, readable specimen. Nothing is ever hidden
 * behind the animation, and no rAF loop runs.
 */
const scaleClass = {
  lg: 'text-[clamp(2.5rem,5.5vw,4.5rem)]',
  md: 'text-[clamp(1.9rem,4vw,3.25rem)]',
  sm: 'text-[clamp(1.5rem,3vw,2.4rem)]',
} as const

/**
 * The open pose, derived rather than hand-scattered. A real exploded drawing
 * separates along a coherent axis; it does not fling parts to random corners.
 * So a row slides in from one side (alternating down the page, the Assemble
 * signature) while its own parts fan apart along the row's baseline. The whole
 * section reads as one concertina closing, not as nine unrelated arrivals.
 */
const ROW_OFFSET = 72
const FAN = 64
const LIFT = 22

function openPose(rowIndex: number, indexInRow: number, rowLength: number) {
  const dir = rowIndex % 2 === 0 ? -1 : 1
  const fan = indexInRow - (rowLength - 1) / 2
  return {
    x: dir * ROW_OFFSET + fan * FAN,
    y: LIFT + Math.abs(fan) * 10,
    r: fan * 1.4 + dir * 0.9,
  }
}

const mech = cubicBezier(0.16, 0.84, 0.3, 1)

/**
 * Sequential settle windows. Concurrency is SPAN / stagger: the old pass ran a
 * 0.42 span on a 0.055 stagger, so eight of nine parts were in flight at once
 * and the section read as confetti. These values keep about three parts moving
 * at a time, which the eye follows as a wave, and land the last part at 0.75
 * so the finished specimen holds for a quarter of the scrub before release.
 */
const SPAN = 0.2
const LAST_START = 0.55

function settleWindow(i: number, total: number): [number, number] {
  const start = total > 1 ? (i / (total - 1)) * LAST_START : 0
  return [start, start + SPAN]
}

function ToolLabel({ tool }: { tool: (typeof toolGroups)[number]['tools'][number] }) {
  return (
    <span className="group/tool inline-flex items-baseline gap-2.5">
      <span
        className={cn(
          'font-display font-black uppercase leading-[0.92] tracking-tight text-ink transition-colors duration-300 group-hover/tool:text-brand',
          scaleClass[tool.scale],
        )}
      >
        {tool.label}
      </span>
      <span className="font-mono text-[0.65rem] uppercase tracking-[0.12em] text-ink-mute transition-colors duration-300 group-hover/tool:text-ink-soft sm:text-xs">
        {tool.note}
      </span>
    </span>
  )
}

function ScatterPart({
  progress,
  index,
  total,
  pose,
  children,
}: {
  progress: MotionValue<number>
  index: number
  total: number
  pose: { x: number; y: number; r: number }
  children: React.ReactNode
}) {
  const range = settleWindow(index, total)
  const x = useTransform(progress, range, [pose.x, 0], { ease: mech })
  const y = useTransform(progress, range, [pose.y, 0], { ease: mech })
  const rotate = useTransform(progress, range, [pose.r, 0], { ease: mech })
  return (
    <motion.span className="inline-block will-change-transform" style={{ x, y, rotate }}>
      {children}
    </motion.span>
  )
}

export function Skills() {
  const stageRef = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const [small, setSmall] = useState(false)

  // Small screens have no room to stage the scatter: names would clip
  // mid-word at the viewport edge and read as broken. They get the
  // assembled specimen directly, same as reduced motion.
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 640px)')
    const sync = () => setSmall(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  const staticView = Boolean(reduce) || small

  // Scrub exactly over the pinned stretch: progress 0 as the stage tops out,
  // 1 as it releases. Before that it stays clamped at 0, so the section is
  // already sitting open on the bench as it rises into view.
  const { scrollYProgress } = useScroll({
    target: stageRef,
    offset: ['start start', 'end end'],
  })

  const totalParts = toolGroups.reduce((n, g) => n + g.tools.length, 0)
  let partIndex = -1

  return (
    <Section id="skills" divided className="overflow-x-clip">
      <SectionHeader
        index="05"
        eyebrow="Toolkit"
        title={
          <>
            The tools I{' '}
            <span className="font-serif font-normal normal-case italic text-brand">
              reach for.
            </span>
          </>
        }
        description="Comfortable from CAD to front-end, and I write Python to delete the repetitive parts of design production. Set in order of reach: the bigger the name, the more it gets used."
      />

      <div
        ref={stageRef}
        className={cn('relative mt-10 sm:mt-12', !staticView && 'h-[190vh]')}
      >
        <div
          className={cn(
            !staticView &&
              'sticky top-16 flex min-h-[calc(100svh-4rem)] flex-col justify-center',
          )}
        >
          {!staticView && (
            <div
              aria-hidden
              className="draft-grid pointer-events-none absolute -inset-x-8 inset-y-0 -z-10 opacity-40"
            />
          )}

          <div>
            {toolGroups.map((group, rowIndex) => (
              <div
                key={group.label}
                className="flex flex-col gap-3 border-t border-hairline py-6 sm:py-8 lg:flex-row lg:items-baseline lg:justify-between lg:gap-12"
              >
                <p className="flex min-w-0 flex-wrap items-baseline gap-x-6 gap-y-2 sm:gap-x-9">
                  {group.tools.map((tool, indexInRow) => {
                    partIndex += 1
                    return staticView ? (
                      <ToolLabel key={tool.label} tool={tool} />
                    ) : (
                      <ScatterPart
                        key={tool.label}
                        progress={scrollYProgress}
                        index={partIndex}
                        total={totalParts}
                        pose={openPose(rowIndex, indexInRow, group.tools.length)}
                      >
                        <ToolLabel tool={tool} />
                      </ScatterPart>
                    )
                  })}
                </p>
                <div className="order-first flex shrink-0 items-center gap-3 font-mono text-xs uppercase tracking-[0.14em] text-ink-mute lg:order-last">
                  <span aria-hidden className="h-px w-6 bg-hairline" />
                  <span>{group.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  )
}

import { useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Container } from '@/components/common/container'
import { SectionHeader } from '@/components/common/section-header'
import { stickers, wallpapers } from '@/data/likes'
import { cn } from '@/lib/utils'

/**
 * A desktop of things the owner likes: a wallpaper you can cycle, and a pile
 * of die-cut stickers and photos you can drag around. The header sits on the
 * paper above the board like every other section; the board itself carries
 * nothing but the wallpaper and the stickers.
 *
 * Robustness: every sticker rests at its data position with no opacity
 * animation, the default wallpaper is always painted underneath the others,
 * and drag is transform-only via framer, so with JS dead the board is simply
 * the laid-out desk.
 */
export function Likes() {
  const board = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const [wall, setWall] = useState(0)
  const [layer, setLayer] = useState<Record<string, number>>({})
  const top = useRef(2)

  const raise = (id: string) => {
    top.current += 1
    setLayer((m) => ({ ...m, [id]: top.current }))
  }
  const cycle = (dir: 1 | -1) => setWall((w) => (w + dir + wallpapers.length) % wallpapers.length)

  return (
    <section id="likes" aria-labelledby="likes-title" className="scroll-mt-24 border-t border-hairline">
      <Container className="flex flex-col gap-8 pt-20 pb-10 sm:pt-28 sm:pb-12 lg:flex-row lg:items-end lg:justify-between lg:pt-32">
        <SectionHeader
          index="06"
          eyebrow="Off the clock"
          title={
            <span id="likes-title">
              Things I{' '}
              <span className="font-serif font-normal normal-case italic text-brand">like.</span>
            </span>
          }
        />
        <div className="flex flex-col items-start gap-3 lg:items-end">
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-ink-mute">
            Drag the stickers around.
          </p>
          <div className="flex items-center gap-1 rounded-md border border-hairline p-1">
            <button
              type="button"
              aria-label="Previous wallpaper"
              onClick={() => cycle(-1)}
              className="grid size-9 place-items-center rounded text-ink transition-colors hover:bg-paper-2"
            >
              <ArrowLeft className="size-4" />
            </button>
            <span className="px-1.5 font-mono text-xs uppercase tracking-[0.14em] text-ink-mute">
              Wallpaper {wall + 1}/{wallpapers.length}
            </span>
            <button
              type="button"
              aria-label="Next wallpaper"
              onClick={() => cycle(1)}
              className="grid size-9 place-items-center rounded text-ink transition-colors hover:bg-paper-2"
            >
              <ArrowRight className="size-4" />
            </button>
          </div>
        </div>
      </Container>

      <div
        ref={board}
        className="likes-board relative isolate h-[80svh] max-h-[900px] min-h-[560px] overflow-hidden border-y border-hairline"
      >
        <div aria-hidden className="absolute inset-0 -z-10">
          {wallpapers.map((w, i) => (
            <img
              key={w.src}
              src={w.src}
              alt=""
              draggable={false}
              loading="lazy"
              decoding="async"
              className={cn(
                'absolute inset-0 size-full object-cover transition-opacity duration-500',
                i === wall || i === 0 ? 'opacity-100' : 'opacity-0',
              )}
              style={{ zIndex: i }}
            />
          ))}
        </div>

        {stickers.map((s) => (
          <motion.div
            key={s.id}
            drag
            dragConstraints={board}
            dragMomentum={false}
            dragElastic={0.05}
            whileDrag={{ scale: 1.06 }}
            whileHover={{ scale: 1.03 }}
            onDragStart={() => raise(s.id)}
            className="sticker absolute cursor-grab touch-none active:cursor-grabbing"
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: `calc(${s.w}px * var(--sticker-scale))`,
              zIndex: layer[s.id] ?? 2,
              rotate: s.r,
            }}
          >
            <img
              src={s.src}
              alt={s.alt}
              width={s.iw}
              height={s.ih}
              draggable={false}
              loading="lazy"
              decoding="async"
              className={cn('block h-auto w-full select-none', s.kind === 'photo' && 'sticker--photo')}
              style={reduce ? undefined : { animationDuration: `${s.drift}s`, animationDelay: `${-s.drift / 2}s` }}
            />
          </motion.div>
        ))}
      </div>
    </section>
  )
}

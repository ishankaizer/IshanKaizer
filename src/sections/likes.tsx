import { useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { SectionHeader } from '@/components/common/section-header'
import { stickers, wallpapers } from '@/data/likes'
import { cn } from '@/lib/utils'

/**
 * A desktop of things the owner likes: a wallpaper you can cycle, and a pile
 * of die-cut stickers and photos you can drag around. Pure sandbox, no copy.
 *
 * Robustness: every sticker rests at its data position with no opacity
 * animation, the default wallpaper is always painted underneath the others,
 * and drag is transform-only via framer, so with JS dead the board is simply
 * the laid-out desk.
 */
export function Likes() {
  const bounds = useRef<HTMLElement>(null)
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
    <section
      id="likes"
      ref={bounds}
      aria-labelledby="likes-title"
      className="likes relative isolate flex h-[88svh] max-h-[960px] min-h-[640px] flex-col overflow-hidden border-y border-hairline scroll-mt-16"
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

      <div className="relative z-[1] flex flex-wrap items-start justify-between gap-3 p-5 sm:p-8 lg:p-12">
        <div className="max-w-md rounded-lg border border-hairline bg-paper/90 p-5 shadow-[0_18px_40px_-20px_rgba(0,0,0,0.5)] backdrop-blur-sm sm:p-6">
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
          <p className="mt-3 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-ink-mute">
            Drag the stickers around.
          </p>
        </div>

        <div className="flex items-center gap-1 rounded-md border border-hairline bg-paper/90 p-1 backdrop-blur-sm">
          <button
            type="button"
            aria-label="Previous wallpaper"
            onClick={() => cycle(-1)}
            className="grid size-9 place-items-center rounded text-ink transition-colors hover:bg-paper-2"
          >
            <ArrowLeft className="size-4" />
          </button>
          <span className="px-1.5 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-ink-mute">
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

      <div className="likes-board relative flex-1">
        {stickers.map((s) => (
          <motion.div
            key={s.id}
            drag
            dragConstraints={bounds}
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

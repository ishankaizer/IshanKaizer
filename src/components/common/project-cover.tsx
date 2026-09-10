import { useState } from 'react'
import { cn } from '@/lib/utils'

interface ProjectCoverProps {
  slug: string
  title: string
  src?: string
  className?: string
  /** Eager-load above-the-fold covers. */
  priority?: boolean
}

/**
 * Renders a project's cover image, falling back to a composed editorial
 * placeholder (so an absent asset still looks intentional, never broken).
 */
export function ProjectCover({
  slug,
  title,
  src,
  className,
  priority = false,
}: ProjectCoverProps) {
  const [failed, setFailed] = useState(false)
  const showImage = Boolean(src) && !failed

  return (
    <div
      className={cn(
        'relative isolate overflow-hidden bg-paper-2',
        className,
      )}
    >
      {showImage ? (
        <img
          src={src}
          alt={`${title} project cover`}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          onError={() => setFailed(true)}
          className="size-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.03]"
        />
      ) : (
        <div className="absolute inset-0 grid place-items-center p-6 transition-transform duration-700 ease-out group-hover:scale-[1.03]">
          <div
            aria-hidden
            className="absolute inset-0 opacity-90"
            style={{
              background:
                'radial-gradient(120% 120% at 15% 0%, color-mix(in oklab, var(--brand) 14%, transparent), transparent 55%), linear-gradient(160deg, var(--paper-2), color-mix(in oklab, var(--ink) 6%, var(--paper-2)))',
            }}
          />
          <span className="relative font-display text-4xl font-black uppercase tracking-tight text-ink/25 sm:text-5xl">
            {title}
          </span>
          <span className="absolute bottom-4 left-4 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-ink-mute">
            {slug}.jpg
          </span>
        </div>
      )}
    </div>
  )
}

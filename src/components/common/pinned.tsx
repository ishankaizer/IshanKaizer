import { cn } from '@/lib/utils'

type Variant = 'cutout' | 'polaroid' | 'taped' | 'pinned'

interface PinnedProps {
  src: string
  /** Decorative by default; pass alt to make it real content. */
  alt?: string
  variant?: Variant
  /** Position and size classes (absolute offsets, width). */
  className?: string
  tilt?: number
  caption?: string
}

/**
 * A thing stuck to the page: a die-cut sticker, or a photo in a polaroid
 * frame, taped down, or pushpinned. Decorative, so it never takes pointer
 * events and is hidden from assistive tech unless given alt text.
 */
export function Pinned({ src, alt = '', variant = 'cutout', className, tilt = 0, caption }: PinnedProps) {
  return (
    <span
      aria-hidden={alt === '' || undefined}
      className={cn(
        'pinned pointer-events-none absolute block',
        variant === 'cutout' && 'sticker',
        `pinned--${variant}`,
        className,
      )}
      style={{ rotate: `${tilt}deg` }}
    >
      {variant === 'pinned' && <span aria-hidden className="pinned__pin" />}
      {variant === 'taped' && <span aria-hidden className="pinned__tape" />}
      <img src={src} alt={alt} loading="lazy" decoding="async" draggable={false} className="block h-auto w-full select-none" />
      {caption && <span className="pinned__caption">{caption}</span>}
    </span>
  )
}

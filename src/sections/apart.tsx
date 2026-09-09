import { useState } from 'react'
import { Section } from '@/components/common/section'
import { SectionHeader } from '@/components/common/section-header'
import { Reveal } from '@/components/common/reveal'
import { philosophies } from '@/data/about'
import { cn } from '@/lib/utils'

/**
 * Two cards, one per medium. Hovering a card keeps its own words and turns
 * the other card into a photo of "the owner" at that medium. Text is the
 * resting state; the photo only exists while a pointer is over the sibling,
 * so nothing can stay hidden. Touch taps toggle instead.
 */
export function Apart() {
  const [active, setActive] = useState<number | null>(null)

  return (
    <Section id="apart" band divided>
      <SectionHeader
        index="04"
        eyebrow="How I think"
        title={
          <>
            What I{' '}
            <span className="font-serif font-normal normal-case italic text-brand">do.</span>
          </>
        }
        description="Hover one to see me at the other."
      />

      <div className="mt-12 grid gap-5 md:grid-cols-2 md:gap-6">
        {philosophies.map((p, i) => {
          const other = philosophies[1 - i]
          const showPhoto = active === 1 - i
          return (
            <Reveal key={p.label} delay={i * 0.08}>
              <article
                onPointerEnter={(e) => e.pointerType === 'mouse' && setActive(i)}
                onPointerLeave={(e) => e.pointerType === 'mouse' && setActive(null)}
                onPointerUp={(e) =>
                  e.pointerType === 'touch' && setActive((a) => (a === i ? null : i))
                }
                className={cn(
                  'apart-card group relative flex min-h-[400px] flex-col overflow-hidden rounded-lg border bg-card p-7 transition-colors duration-300 sm:p-9',
                  active === i ? 'border-brand' : 'border-hairline',
                )}
              >
                <div
                  className={cn(
                    'relative z-[1] flex flex-1 flex-col gap-5 transition-opacity duration-300',
                    showPhoto && 'opacity-0',
                  )}
                >
                  <p className="font-mono text-xs uppercase tracking-[0.14em] text-ink-mute">
                    {p.label}
                  </p>
                  <h3 className="font-display text-5xl font-black uppercase leading-none tracking-tight text-ink transition-colors duration-300 group-hover:text-brand sm:text-6xl">
                    {p.title}
                  </h3>
                  <blockquote className="mt-auto max-w-md text-lg leading-snug text-ink-soft sm:text-xl">
                    {p.text}
                  </blockquote>
                </div>

                <figure
                  aria-hidden={!showPhoto}
                  className={cn('apart-photo absolute inset-0', showPhoto && 'is-on')}
                >
                  <img
                    src={other.image.src}
                    alt={other.image.alt}
                    width={other.image.width}
                    height={other.image.height}
                    loading="lazy"
                    decoding="async"
                    draggable={false}
                    className="size-full object-cover"
                  />
                </figure>
              </article>
            </Reveal>
          )
        })}
      </div>
    </Section>
  )
}

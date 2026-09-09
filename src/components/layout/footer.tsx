import { ArrowUpRight, Mail } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import { Container } from '@/components/common/container'
import { SectionHeader } from '@/components/common/section-header'
import { CopyButton } from '@/components/common/copy-button'
import { Button } from '@/components/ui/button'
import { site } from '@/data/site'
import { cn } from '@/lib/utils'

const ease = [0.16, 0.84, 0.3, 1] as const

const postcards = [
  {
    src: '/contact/postcard-front.webp',
    width: 698,
    height: 452,
    alt: 'Postcard front: a photograph of Ishan lying across a rock at the shoreline as the surf comes in.',
    from: -28,
    className: 'postcard--front',
  },
  {
    src: '/contact/postcard-back.webp',
    width: 717,
    height: 456,
    alt: 'Postcard back, handwritten: Contact me. To Ishan Kaizer. Whether it is an opportunity, a collaboration, or simply a hello, your letter will always find its way. Email ishankaizer@gmail.com. Addressed to you, wherever you are. Love, me.',
    from: 28,
    className: 'postcard--back',
  },
]

export function Footer() {
  const year = new Date().getFullYear()
  const reduce = useReducedMotion()
  const { pathname } = useLocation()

  return (
    <footer id="contact" className="scroll-mt-24 border-t border-hairline bg-paper-2">
      <Container className="pt-20 sm:pt-28 lg:pt-32">
        <SectionHeader
          index={pathname === '/' ? '07' : undefined}
          eyebrow="Contact"
          title={
            <>
              Need me?{' '}
              <span className="font-serif font-normal normal-case italic text-brand">
                Here&rsquo;s where to find me.
              </span>
            </>
          }
        />
      </Container>

      {/* The postcards get a wider sheet than the text so they sit close to
          their native size; on desktop the back card overlaps the front like
          a pile on a desk. */}
      <div className="mx-auto mt-10 w-full max-w-[1440px] px-5 sm:mt-12 sm:px-8 lg:px-12">
        <div className="grid items-start gap-8 lg:grid-cols-2 lg:gap-0">
          {postcards.map((card, i) => {
            const figure = (
              <figure className={cn('postcard', card.className)}>
                <img
                  src={card.src}
                  width={card.width}
                  height={card.height}
                  alt={card.alt}
                  loading="lazy"
                  decoding="async"
                />
              </figure>
            )
            return (
              <motion.div
                key={card.src}
                className={cn(
                  'mx-auto w-full max-w-[620px] lg:max-w-none',
                  i === 0 ? 'lg:mr-[-6%]' : 'relative z-[1] lg:ml-[-6%] lg:mt-14',
                )}
                initial={reduce ? false : { x: card.from }}
                whileInView={reduce ? undefined : { x: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.7, delay: i * 0.1, ease }}
              >
                {i === 1 ? (
                  <a
                    href={`mailto:${site.email}`}
                    aria-label={`Write to ${site.name}`}
                    className="postcard-link block rounded-lg"
                  >
                    {figure}
                    <span className="mt-4 block text-right font-mono text-xs uppercase tracking-[0.14em] text-ink-mute">
                      Tap the card to write to me
                    </span>
                  </a>
                ) : (
                  figure
                )}
              </motion.div>
            )
          })}
        </div>
      </div>

      <Container className="pb-8">
        <div className="mt-12 grid gap-10 border-t border-hairline pt-10 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-ink-mute">Reach me</p>
            <a
              href={`mailto:${site.email}`}
              className="mt-2 block break-words text-balance font-display text-2xl font-black uppercase tracking-tight text-ink transition-colors hover:text-brand-strong sm:text-3xl"
            >
              {site.email}
            </a>
            <p className="mt-2 text-sm text-ink-mute">
              {site.location} · {site.phone}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Button asChild variant="brand" className="cta-marquee">
                <a href={`mailto:${site.email}`}>
                  <span className="cta-marquee__clip">
                    <span className="cta-marquee__label">Email me</span>
                  </span>
                  <span className="cta-marquee__icon size-4">
                    <Mail className="size-4" />
                    <Mail className="size-4" />
                  </span>
                </a>
              </Button>
              <CopyButton value={site.email} label="Copy email" />
            </div>
          </div>

          <nav aria-label="Social" className="flex flex-col gap-1">
            {site.socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target={s.href.startsWith('http') ? '_blank' : undefined}
                rel={s.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="group inline-flex items-center gap-1.5 py-2 text-sm text-ink-soft transition-colors hover:text-brand-strong"
              >
                <span className="font-mono text-xs uppercase tracking-[0.08em] text-ink-mute">
                  {s.label}
                </span>
                <span className="transition-colors group-hover:text-brand-strong">{s.handle}</span>
                <ArrowUpRight className="size-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
              </a>
            ))}
          </nav>
        </div>

        <div className="mt-10 flex flex-col-reverse items-start justify-between gap-4 border-t border-hairline pt-8 sm:flex-row sm:items-center">
          <p className="font-mono text-xs text-ink-mute">
            © {year} {site.name}. Designed &amp; built in Bengaluru.
          </p>
          <a
            href="#top"
            className="inline-block py-2 font-mono text-xs uppercase tracking-[0.08em] text-ink-mute transition-colors hover:text-ink"
          >
            Back to top ↑
          </a>
        </div>
      </Container>
    </footer>
  )
}

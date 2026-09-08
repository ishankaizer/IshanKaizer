import { ArrowUpRight } from 'lucide-react'
import { Container } from '@/components/common/container'
import { site } from '@/data/site'

export function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="overflow-hidden border-t border-hairline bg-paper-2">
      <Container className="flex flex-col gap-10 pt-16 pb-8">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div className="max-w-md">
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-ink-mute">
              {site.availability}
            </p>
            <p className="mt-3 text-balance font-display text-2xl font-black uppercase leading-tight tracking-tight text-ink sm:text-3xl">
              Let&rsquo;s build something{' '}
              <span className="font-serif font-normal normal-case italic text-brand">
                worth shipping.
              </span>
            </p>
          </div>
          <nav aria-label="Social" className="flex flex-col gap-2">
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
                <span className="transition-colors group-hover:text-brand-strong">
                  {s.handle}
                </span>
                <ArrowUpRight className="size-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
              </a>
            ))}
          </nav>
        </div>

        <div className="flex flex-col-reverse items-start justify-between gap-4 border-t border-hairline pt-8 sm:flex-row sm:items-center">
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

      {/* Signature: the name, oversized, barely above the background and with
          its lower ~10% clipped below the bottom edge so it reads as rising
          out of the screen. */}
      <div className="overflow-hidden px-4">
        <p
          aria-hidden
          className="select-none whitespace-nowrap text-center font-display text-[clamp(4rem,23vw,20rem)] font-black uppercase leading-[0.8] tracking-[-0.03em]"
          style={{
            color: 'color-mix(in oklab, var(--ink) 8%, var(--paper-2))',
            marginBottom: '-0.22em',
          }}
        >
          Kaizer
        </p>
      </div>
    </footer>
  )
}

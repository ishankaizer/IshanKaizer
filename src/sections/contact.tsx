import { ArrowUpRight, Mail } from 'lucide-react'
import { Section } from '@/components/common/section'
import { SectionHeader } from '@/components/common/section-header'
import { Reveal } from '@/components/common/reveal'
import { Button } from '@/components/ui/button'
import { CopyButton } from '@/components/common/copy-button'
import { site } from '@/data/site'

const reasons = [
  {
    title: 'Two disciplines, one hire',
    body: 'Industrial design and UX/UI in the same person. I can own a product from physical form to shipped interface without the handoff gap.',
  },
  {
    title: 'I actually ship',
    body: 'Materia and Binkli are live, working React products, not just Figma files. I design the thing and build it.',
  },
  {
    title: 'I lift the team',
    body: 'Led a 40-person design team and automate production grind with Python. I raise the whole team’s velocity, not just my own output.',
  },
]

export function Contact() {
  return (
    <Section id="contact" band divided>
      <SectionHeader
        index="06"
        eyebrow="Why me · Contact"
        title={
          <>
            Let&rsquo;s make something{' '}
            <span className="font-serif font-normal normal-case italic text-brand">
              worth shipping.
            </span>
          </>
        }
        description="Open to product and UX design roles for 2026. If your team builds things that live in the real world and on a screen, we’ll get along."
      />

      <div className="mt-14 grid gap-8 lg:grid-cols-3">
        {reasons.map((r, i) => (
          <Reveal key={r.title} delay={i * 0.06}>
            <div className="flex h-full flex-col gap-3 rounded-lg border border-hairline bg-card p-6">
              <span className="font-mono text-xs font-semibold text-brand">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="font-display text-lg font-bold uppercase tracking-tight text-ink">
                {r.title}
              </h3>
              <p className="text-sm leading-relaxed text-ink-soft">{r.body}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-12">
        <div className="flex flex-col gap-6 rounded-xl border border-hairline bg-card p-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-ink-mute">
              Reach me
            </p>
            <a
              href={`mailto:${site.email}`}
              className="mt-2 block break-words text-balance font-display text-2xl font-black uppercase tracking-tight text-ink transition-colors hover:text-brand-strong sm:text-3xl"
            >
              {site.email}
            </a>
            <p className="mt-2 text-sm text-ink-mute">
              {site.location} · {site.phone}
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap gap-2">
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
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              {site.socials
                .filter((s) => s.href.startsWith('http'))
                .map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-1 py-1.5 text-sm text-ink-soft transition-colors hover:text-brand-strong"
                  >
                    {s.label}
                    <ArrowUpRight className="size-3.5 opacity-60 transition-opacity group-hover:opacity-100" />
                  </a>
                ))}
            </div>
          </div>
        </div>
      </Reveal>
    </Section>
  )
}

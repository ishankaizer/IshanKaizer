import { Container } from '@/components/common/container'
import { Pinned } from '@/components/common/pinned'
import { Reveal } from '@/components/common/reveal'
import { Portrait } from '@/components/common/portrait'
import { about } from '@/data/about'

export function About() {
  return (
    <section
      id="about"
      className="relative overflow-hidden border-t border-hairline"
    >
      {/* Portrait, behind the text: right-anchored, faded, masked into paper. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 hidden w-[48%] md:block"
      >
        <Portrait
          bleed
          className="h-full w-full opacity-[0.55] [mask-image:linear-gradient(to_left,black_20%,transparent_92%)] [-webkit-mask-image:linear-gradient(to_left,black_20%,transparent_92%)]"
        />
      </div>

      <Container className="relative py-28 sm:py-36 lg:py-44">
        <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.14em] text-ink-mute">
          <span className="font-semibold text-brand">02</span>
          <span aria-hidden className="h-px w-6 bg-hairline" />
          <span>About</span>
        </div>

        <div className="mt-14 max-w-4xl sm:mt-20">
          <Reveal>
            <p className="font-display text-[clamp(2rem,5.4vw,4.25rem)] font-medium leading-[1.03] tracking-[-0.02em] text-ink">
              {about.statement}
            </p>
          </Reveal>

          <Reveal delay={0.06}>
            <p className="mt-10 max-w-2xl text-lg leading-relaxed text-ink-soft sm:text-xl">
              {about.sub}
            </p>
          </Reveal>
        </div>

        {/* Mobile portrait: keep the picture present on small screens. */}
        <Reveal delay={0.1} className="mt-14 md:hidden">
          <Portrait className="aspect-[4/5] w-full max-w-xs" />
        </Reveal>

        <Pinned
          src="/stickers/monkey-thinking.webp"
          variant="polaroid"
          caption="deciding"
          className="right-[6%] top-14 hidden w-36 md:block lg:right-[10%] lg:top-16 lg:w-40"
          tilt={6}
        />
        <Pinned
          src="/stickers/dolphins-key-to-life.webp"
          variant="taped"
          className="bottom-8 left-[54%] hidden w-36 md:block lg:left-[50%] lg:w-44"
          tilt={-5}
        />
      </Container>
    </section>
  )
}

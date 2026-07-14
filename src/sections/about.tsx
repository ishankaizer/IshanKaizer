import { Section } from '@/components/common/section'
import { SectionHeader } from '@/components/common/section-header'
import { Reveal } from '@/components/common/reveal'
import { Portrait } from '@/components/common/portrait'
import { CountUp } from '@/components/common/count-up'
import { about } from '@/data/about'

const facts = [
  { value: '40', label: 'Design team led at Gravitas' },
  { value: '3', label: 'Design internships' },
  { value: '2', label: 'Live React products shipped' },
]

export function About() {
  return (
    <Section id="about" band divided>
      <SectionHeader
        index="02"
        eyebrow="About"
        title={
          <>
            An industrial designer who{' '}
            <span className="font-serif font-normal normal-case italic text-brand">
              fell for interfaces.
            </span>
          </>
        }
      />

      <div className="mt-14 grid gap-10 lg:grid-cols-12 lg:gap-14">
        <Reveal className="lg:col-span-5">
          <Portrait className="aspect-[4/5] w-full max-w-sm lg:sticky lg:top-24" />
        </Reveal>

        <div className="flex flex-col gap-8 lg:col-span-7">
          <Reveal>
            <p className="prose-measure text-balance font-serif text-2xl leading-snug text-ink sm:text-[1.7rem]">
              {about.tldr}
            </p>
          </Reveal>

          <Reveal delay={0.05}>
            <div className="prose-measure flex flex-col gap-4 text-ink-soft">
              {about.long.map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <dl className="grid grid-cols-3 gap-6 border-t border-hairline pt-8">
              {facts.map((f) => (
                <div key={f.label} className="flex flex-col gap-1">
                  <dt className="font-display text-4xl font-black tracking-tight text-brand">
                    <CountUp value={f.value} />
                  </dt>
                  <dd className="text-sm leading-snug text-ink-mute">{f.label}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </div>
    </Section>
  )
}

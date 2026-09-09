import { Section } from '@/components/common/section'
import { SectionHeader } from '@/components/common/section-header'
import { Reveal } from '@/components/common/reveal'
import { tools } from '@/data/about'

/**
 * The toolkit as a row of folders: one illustrated folder icon per tool, the
 * name underneath like a file label, nothing else. Order encodes reach.
 */
export function Skills() {
  return (
    <Section id="skills" divided>
      <SectionHeader
        index="05"
        eyebrow="Toolkit"
        title={
          <>
            The tools I{' '}
            <span className="font-serif font-normal normal-case italic text-brand">
              reach for.
            </span>
          </>
        }
      />

      <ul className="mt-12 flex flex-wrap justify-center gap-x-4 gap-y-8 sm:mt-14 sm:gap-x-8 sm:gap-y-10">
        {tools.map((tool, i) => (
          <li key={tool.label} className="w-[28%] max-w-[168px] sm:w-[22%] lg:w-[13.5%]">
            <Reveal delay={i * 0.035} y={14}>
              <figure className="folder flex flex-col items-center gap-3 text-center">
                <img
                  src={tool.icon}
                  alt=""
                  width={tool.width}
                  height={tool.height}
                  loading="lazy"
                  decoding="async"
                  className="block h-auto w-full"
                />
                <figcaption className="font-mono text-[0.68rem] uppercase tracking-[0.12em] text-ink-soft transition-colors sm:text-xs">
                  {tool.label}
                </figcaption>
              </figure>
            </Reveal>
          </li>
        ))}
      </ul>
    </Section>
  )
}

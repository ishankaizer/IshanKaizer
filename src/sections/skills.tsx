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
            Folders I{' '}
            <span className="font-serif font-normal normal-case italic text-brand">
              live in.
            </span>
          </>
        }
      />

      <ul className="mt-14 flex flex-wrap justify-center gap-x-6 gap-y-10 sm:mt-16 sm:gap-x-10 sm:gap-y-12 lg:gap-x-12 lg:gap-y-14">
        {tools.map((tool, i) => (
          <li key={tool.label} className="w-[27%] max-w-[176px] sm:w-[20%] lg:w-[12.5%]">
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
                <figcaption className="font-mono text-sm uppercase tracking-[0.1em] text-ink-soft transition-colors sm:text-[0.95rem]">
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

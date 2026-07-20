import { LightObject } from '@/components/common/light-object'

/**
 * A full-bleed dark interlude: a graphite form sitting in shadow that the
 * cursor lights as it passes. It performs an industrial-design truth (a form
 * only reads once light finds its edges), so the section states something real
 * rather than decorating. Always dark, in both site themes, on purpose.
 *
 * Unnumbered, like the other interludes (TermsBanner, Music), so it does not
 * disturb the 01 to 06 section index.
 */
export function LightBand() {
  return (
    <section
      aria-label="Form and light"
      className="relative isolate flex min-h-[560px] items-center overflow-hidden border-y border-white/10 bg-[#08080a] py-24 sm:min-h-[640px]"
    >
      <LightObject className="absolute inset-0 -z-10 size-full" />

      <div className="mx-auto w-full max-w-[1180px] px-5 sm:px-8 lg:px-12">
        <div className="max-w-xl">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-white/40">
            On form
          </p>
          <p className="mt-5 text-balance font-display text-3xl font-black uppercase leading-[0.95] tracking-tight text-white/85 sm:text-4xl lg:text-5xl">
            A form only shows itself when light finds its edges.
          </p>
        </div>
      </div>

      <p className="pointer-events-none absolute bottom-6 right-5 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-white/35 sm:right-8 lg:right-12">
        Move your cursor
      </p>
    </section>
  )
}

import { Container } from '@/components/common/container'
import { Reveal } from '@/components/common/reveal'
import { AlbumCover } from '@/components/common/album-cover'
import { music } from '@/data/music'

export function Music() {
  // Duplicated once so the marquee loops seamlessly at translateX(-50%).
  const loop = [...music.albums, ...music.albums]

  return (
    <section id="music" className="overflow-hidden border-t border-hairline py-20 sm:py-28">
      <div className="marquee">
        <ul className="marquee-track px-5">
          {loop.map((a, i) => (
            <li
              key={`${a.slug}-${i}`}
              data-cursor="grow"
              className="group/item w-40 shrink-0"
            >
              <div className="overflow-hidden rounded-lg border border-hairline transition duration-300 ease-out group-hover/item:scale-[1.05] group-hover/item:border-brand group-hover/item:shadow-xl group-hover/item:[filter:invert(1)]">
                <AlbumCover title={a.title} year={a.year} src={a.cover} />
              </div>
              <p className="mt-2 truncate text-sm font-medium text-ink">{a.title}</p>
              <p className="font-mono text-[0.62rem] text-ink-mute">{a.year}</p>
            </li>
          ))}
        </ul>
      </div>

      <Container>
        <Reveal>
          <p className="mx-auto mt-10 max-w-2xl text-balance text-center font-display text-lg font-bold uppercase tracking-tight text-ink sm:text-xl">
            {music.caption}
          </p>
        </Reveal>
      </Container>
    </section>
  )
}

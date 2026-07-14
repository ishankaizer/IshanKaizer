import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react'
import { getProject, getAdjacentCaseStudies } from '@/data/projects'
import type { Project } from '@/types'
import { Seo } from '@/components/common/seo'
import { Container } from '@/components/common/container'
import { Reveal } from '@/components/common/reveal'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ProjectCover } from '@/components/common/project-cover'
import { CaseMediaFrame } from '@/components/case/case-media'
import { SlideGallery } from '@/components/case/slide-gallery'
import { CountUp } from '@/components/common/count-up'
import { ReadingProgress } from '@/components/common/reading-progress'
import { NotFoundPage } from './not-found'

function Block({
  label,
  title,
  children,
}: {
  label: string
  title: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <section className="border-t border-hairline pt-10">
      <p className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-brand">
        {label}
      </p>
      <h2 className="mt-3 text-balance font-display text-2xl font-black uppercase tracking-tight text-ink sm:text-3xl">
        {title}
      </h2>
      <div className="mt-6">{children}</div>
    </section>
  )
}

function Paragraphs({ items, className = '' }: { items: string[]; className?: string }) {
  return (
    <div className={`flex flex-col gap-4 text-lg leading-relaxed text-ink-soft ${className}`}>
      {items.map((p) => (
        <p key={p.slice(0, 28)}>{p}</p>
      ))}
    </div>
  )
}

function CaseStudyContent({ project }: { project: Project & { study: NonNullable<Project['study']> } }) {
  const { study } = project
  const { prev, next } = getAdjacentCaseStudies(project.slug)

  const overview = [
    { label: 'Timeline', value: study.overview.timeline },
    { label: 'Role', value: study.overview.team },
    { label: 'Platform', value: study.overview.platform },
    { label: 'Tools', value: study.overview.tools.join(', ') },
  ]

  return (
    <>
      <Seo
        title={project.title}
        description={study.hook}
        path={`/work/${project.slug}`}
      />
      <ReadingProgress />

      <article>
        {/* Hero */}
        <header className="pt-10 pb-8 sm:pt-14">
          <Container>
            <Link
              to="/#work"
              className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.1em] text-ink-mute transition-colors hover:text-ink"
            >
              <ArrowLeft className="size-3.5" />
              All work
            </Link>

            <div className="mt-8 flex flex-wrap items-center gap-2">
              {project.disciplines.map((d) => (
                <Badge key={d}>{d}</Badge>
              ))}
              <span className="font-mono text-xs text-ink-mute">&middot; {project.year}</span>
            </div>

            <h1 className="mt-5 text-balance font-display text-4xl font-black uppercase leading-[0.98] tracking-tight text-ink sm:text-6xl">
              {project.title}
            </h1>
            <p className="mt-6 max-w-3xl text-balance font-serif text-xl leading-snug text-ink-soft sm:text-2xl">
              {study.hook}
            </p>
          </Container>
        </header>

        <Container>
          <ProjectCover
            slug={project.slug}
            title={project.title}
            src={project.cover}
            priority
            className="aspect-[16/9] w-full rounded-xl border border-hairline"
          />

          <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-6 border-y border-hairline py-8 lg:grid-cols-4">
            {overview.map((o) => (
              <div key={o.label} className="flex flex-col gap-1.5">
                <dt className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-ink-mute">
                  {o.label}
                </dt>
                <dd className="text-sm font-medium text-ink">{o.value}</dd>
              </div>
            ))}
          </dl>
        </Container>

        {/* Body: centred reading column, media breaks out wider */}
        <Container className="py-16">
          <div className="mx-auto flex max-w-3xl flex-col gap-16">
            <Block label="The problem" title="Why this needed solving">
              <Paragraphs items={study.problem} />
            </Block>

            <Block label="My role" title="What I did, specifically">
              <ul className="flex flex-col gap-3">
                {study.contributions.map((c) => (
                  <li key={c.slice(0, 24)} className="flex gap-3 text-lg text-ink-soft">
                    <span aria-hidden className="mt-2.5 size-1.5 shrink-0 rounded-full bg-brand" />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </Block>

            <Block label="Process" title="From research to resolution">
              <div className="flex flex-col gap-12">
                {study.process.map((sec, i) => (
                  <Reveal key={sec.heading} delay={i * 0.04}>
                    <div className="flex flex-col gap-5">
                      <h3 className="font-display text-lg font-bold uppercase tracking-tight text-ink">
                        {sec.heading}
                      </h3>
                      <Paragraphs items={sec.body} />
                      {sec.media && (
                        <CaseMediaFrame
                          media={sec.media}
                          className="mt-2 lg:-mx-16 xl:-mx-24"
                        />
                      )}
                    </div>
                  </Reveal>
                ))}
              </div>
            </Block>

            <Block label="Key decisions" title="The trade-offs I stand behind">
              <div className="flex flex-col gap-4">
                {study.decisions.map((d, i) => (
                  <div
                    key={d.title}
                    className="rounded-xl border border-hairline bg-paper-2 p-6"
                  >
                    <div className="flex items-baseline gap-3">
                      <span className="font-mono text-xs font-semibold text-brand">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <h3 className="font-display text-lg font-bold uppercase tracking-tight text-ink">
                        {d.title}
                      </h3>
                    </div>
                    <p className="mt-3 leading-relaxed text-ink-soft">{d.body}</p>
                  </div>
                ))}
              </div>
            </Block>

            <Block label="Outcome" title="Where it landed">
              {study.outcome.stats && study.outcome.stats.length > 0 && (
                <dl className="mb-8 grid grid-cols-2 gap-6 sm:grid-cols-3">
                  {study.outcome.stats.map((s) => (
                    <div key={s.label} className="flex flex-col gap-1">
                      <dt className="font-display text-4xl font-black tracking-tight text-brand">
                        <CountUp value={s.value} />
                      </dt>
                      <dd className="text-sm text-ink-mute">{s.label}</dd>
                    </div>
                  ))}
                </dl>
              )}
              <Paragraphs items={study.outcome.body} />
            </Block>

            <Block label="Reflection" title="What I’d do differently">
              <Paragraphs items={study.reflection} />
            </Block>
          </div>
        </Container>

        {/* The full deck */}
        <SlideGallery slides={project.slides ?? []} projectTitle={project.title} />

        {/* Prev / next */}
        <Container className="pb-16">
          <nav
            aria-label="More case studies"
            className="grid gap-4 border-t border-hairline pt-10 sm:grid-cols-2"
          >
            {prev && <AdjacentLink project={prev} direction="prev" />}
            {next && <AdjacentLink project={next} direction="next" />}
          </nav>
        </Container>

        {/* CTA */}
        <section className="border-t border-hairline bg-paper-2 py-16">
          <Container className="flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-balance font-display text-2xl font-black uppercase tracking-tight text-ink sm:text-3xl">
              Want the full walk-through?{' '}
              <span className="font-serif font-normal normal-case italic text-brand">
                Let&rsquo;s talk.
              </span>
            </p>
            <Button asChild variant="brand" size="lg">
              <Link to="/#contact">
                Get in touch
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </Container>
        </section>
      </article>
    </>
  )
}

function AdjacentLink({
  project,
  direction,
}: {
  project: Project
  direction: 'prev' | 'next'
}) {
  const isNext = direction === 'next'
  return (
    <Link
      to={`/work/${project.slug}`}
      className={`group flex flex-col gap-1 rounded-xl border border-hairline p-6 transition-colors hover:border-ink/25 ${isNext ? 'sm:items-end sm:text-right' : ''}`}
    >
      <span className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.1em] text-ink-mute">
        {!isNext && <ArrowLeft className="size-3.5" />}
        {isNext ? 'Next' : 'Previous'}
        {isNext && <ArrowRight className="size-3.5" />}
      </span>
      <span className="font-display text-xl font-bold uppercase tracking-tight text-ink transition-colors group-hover:text-brand-strong">
        {project.title}
      </span>
    </Link>
  )
}

export function CaseStudyPage() {
  const { slug } = useParams<{ slug: string }>()
  const project = slug ? getProject(slug) : undefined

  if (!project) return <NotFoundPage />

  // Projects without a written study: show the deck (Miscellaneous),
  // or link out (Binkli).
  if (!project.study) {
    const hasSlides = (project.slides?.length ?? 0) > 0
    return (
      <>
        <Seo title={project.title} description={project.tagline} path={`/work/${project.slug}`} />
        <article>
          <header className="pt-10 pb-8 sm:pt-14">
            <Container>
              <Link
                to="/#work"
                className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.1em] text-ink-mute transition-colors hover:text-ink"
              >
                <ArrowLeft className="size-3.5" />
                All work
              </Link>
              <div className="mt-8 flex flex-wrap items-center gap-2">
                {project.disciplines.map((d) => (
                  <Badge key={d}>{d}</Badge>
                ))}
                <span className="font-mono text-xs text-ink-mute">&middot; {project.year}</span>
              </div>
              <h1 className="mt-5 text-balance font-display text-4xl font-black uppercase leading-[0.98] tracking-tight text-ink sm:text-6xl">
                {project.title}
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft">
                {project.tagline}
              </p>
              {project.external && (
                <Button asChild variant="brand" className="mt-8">
                  <a href={project.external} target="_blank" rel="noopener noreferrer">
                    Visit live site
                    <ArrowUpRight className="size-4" />
                  </a>
                </Button>
              )}
            </Container>
          </header>
          {hasSlides && (
            <SlideGallery
              slides={project.slides ?? []}
              projectTitle={project.title}
              eyebrow="The work"
            />
          )}
        </article>
      </>
    )
  }

  return (
    <CaseStudyContent
      project={project as Project & { study: NonNullable<Project['study']> }}
    />
  )
}

import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import type { Project } from '@/types'
import { ProjectCover } from './project-cover'
import { Reveal } from './reveal'
import { useRouteMaskNavigate } from './route-mask'

/**
 * The work index: every project is a full-width row, set at hero scale so the
 * work reads as the subject rather than as a thumbnail.
 *
 * On a fine pointer the cover rides the cursor and the hovered row alone stays
 * lit. On a coarse pointer, or under reduced motion, the covers render inline
 * instead: the work is never locked behind an interaction the visitor cannot
 * perform. Titles and metadata are always visible in every mode, so a failed
 * script can only ever cost the imagery, never the content.
 */
export function WorkIndex({ projects }: { projects: Project[] }) {
  const [fine, setFine] = useState(false)
  const [active, setActive] = useState<number | null>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()

  // A cursor-borne panel only makes sense where there is a cursor, and only
  // for visitors who accept movement. Everyone else gets the covers inline.
  const hoverMode = fine && !reduce

  useEffect(() => {
    const mq = window.matchMedia('(pointer: fine)')
    const sync = () => setFine(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    if (!hoverMode) return
    const panel = panelRef.current
    if (!panel) return

    let tx = window.innerWidth / 2
    let ty = window.innerHeight / 2
    let px = tx
    let py = ty
    let raf = 0

    // Same mechanical smoothing as CustomCursor: the panel trails the pointer
    // rather than snapping to it.
    const render = () => {
      px += (tx - px) * 0.12
      py += (ty - py) * 0.12
      panel.style.transform = `translate3d(${px}px, ${py}px, 0) translate(-50%, -50%)`
      raf = requestAnimationFrame(render)
    }
    raf = requestAnimationFrame(render)

    const onMove = (e: MouseEvent) => {
      tx = e.clientX
      ty = e.clientY
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMove)
    }
  }, [hoverMode])

  return (
    <div className="work-index" data-active={active !== null}>
      <ol>
        {projects.map((project, i) => {
          const isExternal = Boolean(project.external)
          const href = isExternal ? project.external! : `/work/${project.slug}`
          const label = `${project.title}, ${isExternal ? 'open live site' : 'read case study'}`
          return (
            <li key={project.slug}>
              <Reveal delay={Math.min(i, 3) * 0.06}>
                <WorkRow
                  project={project}
                  index={i}
                  href={href}
                  label={label}
                  isExternal={isExternal}
                  dimmed={active !== null && active !== i}
                  showCoverInline={!hoverMode}
                  onEnter={() => setActive(i)}
                  onLeave={() => setActive(null)}
                />
              </Reveal>
            </li>
          )
        })}
      </ol>

      {hoverMode && (
        <div ref={panelRef} className="work-panel" data-show={active !== null} aria-hidden>
          {projects.map((project, i) => (
            <div key={project.slug} className="work-panel__item" data-active={active === i}>
              <ProjectCover
                slug={project.slug}
                title={project.title}
                src={project.cover}
                className="size-full"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

interface WorkRowProps {
  project: Project
  index: number
  href: string
  label: string
  isExternal: boolean
  dimmed: boolean
  showCoverInline: boolean
  onEnter: () => void
  onLeave: () => void
}

function WorkRow({
  project,
  index,
  href,
  label,
  isExternal,
  dimmed,
  showCoverInline,
  onEnter,
  onLeave,
}: WorkRowProps) {
  const maskNavigate = useRouteMaskNavigate()

  const external = isExternal
    ? { target: '_blank', rel: 'noopener noreferrer' as const }
    : {}

  return (
    <a
      href={href}
      aria-label={label}
      {...external}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onClick={(e) => {
        if (isExternal) return
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
        e.preventDefault()
        maskNavigate(href)
      }}
      data-dim={dimmed}
      className="work-row group block border-t border-hairline py-8 focus-visible:outline-none sm:py-10"
    >
      <div className="flex items-center justify-between gap-6">
        <div className="flex min-w-0 items-baseline gap-4 sm:gap-7">
          <span className="work-row__index shrink-0 font-mono text-xs font-semibold uppercase tracking-[0.14em] text-ink-mute sm:text-sm">
            {String(index + 1).padStart(2, '0')}
          </span>
          <h3 className="work-row__title min-w-0 break-words text-balance font-display font-black uppercase leading-[0.9] tracking-tight text-ink sm:truncate">
            {project.title}
          </h3>
        </div>
        <div className="flex shrink-0 items-center gap-5">
          <span
            aria-hidden
            className="work-row__arrow grid size-10 shrink-0 place-items-center rounded-full border border-hairline text-ink"
          >
            {isExternal ? <ArrowUpRight className="size-4" /> : <ArrowRight className="size-4" />}
          </span>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-baseline gap-x-4 gap-y-1 pl-9 font-mono text-xs uppercase tracking-[0.14em] text-ink-mute sm:pl-[3.4rem]">
        <span className="text-ink-soft">{project.disciplines.join(' / ')}</span>
        <span aria-hidden className="h-px w-6 bg-hairline" />
        <span>{project.role}</span>
      </div>

      {showCoverInline && (
        <ProjectCover
          slug={project.slug}
          title={project.title}
          src={project.cover}
          className="mt-6 aspect-[16/9] w-full border border-hairline"
        />
      )}
    </a>
  )
}

import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import type { Project } from '@/types'
import { Badge } from '@/components/ui/badge'
import { ProjectCover } from './project-cover'
import { cn } from '@/lib/utils'

interface WorkCardProps {
  project: Project
  index: number
  className?: string
  priority?: boolean
}

export function WorkCard({ project, index, className, priority }: WorkCardProps) {
  const isExternal = Boolean(project.external)
  const href = isExternal ? project.external! : `/work/${project.slug}`
  const label = `${project.title}, ${isExternal ? 'open live site' : 'read case study'}`

  const inner = (
    <>
      <ProjectCover
        slug={project.slug}
        title={project.title}
        src={project.cover}
        priority={priority}
        className="aspect-[4/3] w-full rounded-lg border border-hairline"
      />
      <div className="mt-5 flex items-start justify-between gap-4">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2.5 font-mono text-xs uppercase tracking-[0.12em] text-ink-mute">
            <span className="font-semibold text-brand">
              {String(index + 1).padStart(2, '0')}
            </span>
            <span aria-hidden className="h-px w-4 bg-hairline" />
            <span>{project.year}</span>
          </div>
          <h3 className="font-display text-2xl font-bold uppercase tracking-tight text-ink transition-colors group-hover:text-brand-strong sm:text-3xl">
            {project.title}
          </h3>
          <p className="max-w-md text-ink-soft">{project.tagline}</p>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {project.disciplines.map((d) => (
              <Badge key={d}>{d}</Badge>
            ))}
          </div>
        </div>
        <span
          aria-hidden
          className="mt-1 grid size-10 shrink-0 place-items-center rounded-full border border-hairline text-ink transition-all duration-300 group-hover:border-brand group-hover:bg-brand group-hover:text-white"
        >
          {isExternal ? (
            <ArrowUpRight className="size-4" />
          ) : (
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          )}
        </span>
      </div>
    </>
  )

  const classes = cn(
    'group block transition-transform duration-300 ease-out will-change-transform hover:scale-[1.015] focus-visible:outline-none',
    className,
  )

  return isExternal ? (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className={classes}
    >
      {inner}
    </a>
  ) : (
    <Link to={href} aria-label={label} className={classes}>
      {inner}
    </Link>
  )
}

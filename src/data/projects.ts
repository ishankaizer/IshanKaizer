import type { Project } from '@/types'
import { caseStudyBySlug } from './case-studies'

/**
 * Card metadata lives here; long-form `study` content is attached from
 * ./case-studies by slug. Order defines the selected-work sequence.
 * Cover images resolve from /public/projects/<slug>.jpg when present.
 */
const base: Omit<Project, 'study'>[] = [
  {
    slug: 'park-it',
    title: 'Park IT',
    tagline: 'A smart-parking app that turns circling for a spot into a two-tap reservation.',
    disciplines: ['UX/UI', 'Product'],
    role: 'UX Research & Product Design',
    featured: true,
    cover: '/projects/park-it/cover.jpg',
  },
  {
    slug: 'wellbell',
    title: 'WellBell',
    tagline: 'A connected pill dispenser that helps seniors take the right dose at the right time.',
    disciplines: ['Industrial Design', 'UX/UI'],
    role: 'Industrial & Interaction Design',
    featured: true,
    cover: '/projects/wellbell/cover.jpg',
  },
  {
    slug: 'soul-ai',
    title: 'Soul AI',
    tagline: 'Case study in progress, check back soon.',
    disciplines: ['Product'],
    role: 'Product Design',
    featured: true,
    cover: '/projects/soul-ai/cover.jpg',
  },
  {
    slug: 'materia',
    title: 'Materia',
    tagline: 'A material-discovery platform for interior designers, shipped as a working React product.',
    disciplines: ['Product', 'UX/UI', 'Visualization'],
    role: 'Product Design & Front-end',
    featured: true,
    cover: '/projects/materia/cover.jpg',
  },
  {
    slug: 'levelstretch',
    title: 'Levelstretch',
    tagline: 'A self-leveling ambulance stretcher that streams live vitals to the hospital en route.',
    disciplines: ['Industrial Design', 'Product'],
    role: 'Industrial Design & IoT',
    featured: true,
    cover: '/projects/levelstretch/cover.jpg',
  },
  {
    slug: 'binkli',
    title: 'Binkli',
    tagline: 'A retro image-effects lab: halftone, duotone, riso and glitch, live in the browser.',
    disciplines: ['UX/UI'],
    role: 'Design & Build',
    featured: true,
    external: 'https://binkli.vercel.app',
    cover: '/projects/binkli/cover.jpg',
  },
  {
    slug: 'miscellaneous',
    title: 'Miscellaneous',
    tagline: 'Packaging, posters, stickers and other graphic work, including the Palkia blind-box series.',
    disciplines: ['Branding', 'Graphic Design'],
    role: 'Graphic & Packaging Design',
    featured: true,
    cover: '/projects/miscellaneous/cover.jpg',
  },
]

/** Number of rendered deck slides per project (public/projects/<slug>/slides). */
const SLIDE_COUNTS: Record<string, number> = {
  'park-it': 11,
  wellbell: 6,
  levelstretch: 7,
  miscellaneous: 12,
  materia: 13,
  'soul-ai': 34,
}

function slidePaths(slug: string): string[] {
  const n = SLIDE_COUNTS[slug] ?? 0
  return Array.from(
    { length: n },
    (_, i) => `/projects/${slug}/slides/${String(i + 1).padStart(2, '0')}.webp`,
  )
}

export const projects: Project[] = base.map((p) => ({
  ...p,
  study: caseStudyBySlug[p.slug],
  slides: slidePaths(p.slug),
}))

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug)
}

export const featuredProjects = projects.filter((p) => p.featured)

/** Projects with a readable case study. Drives /work/:slug and prev/next. */
export const caseStudies = projects.filter((p) => p.study)

export function getAdjacentCaseStudies(slug: string) {
  const i = caseStudies.findIndex((p) => p.slug === slug)
  if (i === -1) return { prev: undefined, next: undefined }
  const prev = i > 0 ? caseStudies[i - 1] : caseStudies[caseStudies.length - 1]
  const next = i < caseStudies.length - 1 ? caseStudies[i + 1] : caseStudies[0]
  return { prev, next }
}

export type Discipline =
  | 'UX/UI'
  | 'Industrial Design'
  | 'Product'
  | 'Visualization'
  | 'Branding'
  | 'Graphic Design'

export interface MetricStat {
  value: string
  label: string
}

export interface CaseMedia {
  /** `placeholder` renders a labelled frame until a real asset is dropped in. */
  kind: 'image' | 'placeholder'
  src?: string
  alt?: string
  caption?: string
  /** CSS aspect-ratio, e.g. "16 / 9" or "4 / 3". */
  aspect?: string
}

export interface CaseSection {
  heading: string
  body: string[]
  media?: CaseMedia
}

export interface Decision {
  title: string
  body: string
}

/**
 * The deck carries the depth. The written study is deliberately short: enough
 * to frame the work before the slides, never a second telling of it.
 *
 * This shape is intentionally fixed at four fields. Do not add fields back
 * (process, decisions, outcome, reflection, contributions, a timeline) without
 * an explicit request, they were removed on purpose. See
 * docs/decisions.md#d21 and #d22.
 */
export interface CaseStudy {
  /** One-line, 3-second read: what it is, the role, the outcome. */
  hook: string
  overview: {
    team: string
    platform: string
    tools: string[]
  }
  /** The real user problem and stakes. One short paragraph. */
  problem: string[]
}

/**
 * No date field, deliberately: dates on individual projects (a year, a
 * timeline) date the portfolio itself and don't help a hiring manager. Do not
 * add one back without an explicit request. See docs/decisions.md#d24.
 */
export interface Project {
  slug: string
  title: string
  /** Outcome-first one-liner for the card and hero. */
  tagline: string
  disciplines: Discipline[]
  role: string
  /** Shown in the selected-work grid on the homepage. */
  featured: boolean
  /** Live/external destination (opens in a new tab), used when no case study. */
  external?: string
  /** /projects/<slug>/cover.jpg by convention; falls back to a generated cover. */
  cover?: string
  /** Optional long-form case study. */
  study?: CaseStudy
  /** Rendered deck slides for the "full presentation" gallery. */
  slides?: string[]
}

export interface ExperienceRole {
  when: string
  role: string
  org: string
  location?: string
  points: string[]
}

export interface Tool {
  label: string
  /** Cut-out folder icon under /tools, with its intrinsic size. */
  icon: string
  width: number
  height: number
}

export interface Wallpaper {
  src: string
  label: string
}

export interface Sticker {
  id: string
  src: string
  alt: string
  /** `photo` keeps its rectangle and gets a print border; `cutout` is die-cut. */
  kind: 'cutout' | 'photo'
  /** Intrinsic pixel size of the file. */
  iw: number
  ih: number
  /** Display width in px at desktop scale. */
  w: number
  /** Starting position, percent of the board, top-left corner. */
  x: number
  y: number
  /** Resting tilt in degrees. */
  r: number
  /** Idle drift period in seconds. */
  drift: number
}

export interface Philosophy {
  label: string
  text: string
}

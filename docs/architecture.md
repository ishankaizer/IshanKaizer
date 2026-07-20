# Architecture

## Stack

| Concern | Choice | Notes |
|---|---|---|
| UI | React 19 | `StrictMode` on, client rendered only, no SSR |
| Language | TypeScript | strict-ish: `noUnusedLocals`, `noUnusedParameters`, `erasableSyntaxOnly` |
| Build | Vite 8 | target `es2022`, `@vitejs/plugin-react` |
| Styling | Tailwind CSS v4 | via `@tailwindcss/vite`. **Configured in CSS, no `tailwind.config`** |
| Motion | Framer Motion 12 | used sparingly; most signature motion is hand written CSS |
| Routing | React Router 7 | `createBrowserRouter` |
| Primitives | shadcn/ui (new-york) | only Button and Badge, rebound to brand tokens |
| Icons | Lucide | |
| Fonts | Fontsource | self hosted, no third party request |

Path alias: `@/*` resolves to `src/*` (set in both `vite.config.ts` and
`tsconfig.app.json`; keep them in sync).

## Rendering model

Pure client-side SPA. There is no server or SSR. Consequences that matter:

- `useLayoutEffect` is safe (no hydration warnings).
- Social scrapers cannot run JS, so **Open Graph / Twitter / JSON-LD tags are
  written statically into `index.html`**. The `Seo` component sets per-route
  titles at runtime for humans; the static tags serve crawlers.
- Deep links need a server rewrite. `vercel.json` rewrites `/(.*)` to
  `/index.html`.

## Routing

```
RootLayout
├── index          -> HomePage
├── work/:slug     -> CaseStudyPage   (lazy loaded)
└── *              -> NotFoundPage
```

`CaseStudyPage` is lazily imported so homepage visitors do not download it.
`vite.config.ts` additionally splits two manual chunks:

- `motion` (framer-motion, motion-dom, motion-utils)
- `router` (react-router)

`RootLayout` renders the persistent shell: `BackgroundField`, `CustomCursor`,
skip link, `Nav`, `<main>`, `Footer`, `ScrollRestoration`.

## Case-study page order

`pages/case-study.tsx` renders: header (title, hook), cover, spec row, **the
deck**, then the written study, then prev/next and the CTA. The deck leads
deliberately; see [`decisions.md`](./decisions.md#d18-the-deck-leads-the-case-study-the-written-story-follows-it).

## Data layer

All content is static TypeScript in `src/data`. There is no CMS, no fetching.

| File | Holds |
|---|---|
| `site.ts` | name, role, location, email, phone, resume URL, canonical URL, availability, socials |
| `projects.ts` | project cards + assembly of case studies and slides |
| `case-studies/*.ts` | long-form study bodies, one file per project, exported via `index.ts` |
| `experience.ts` | roles |
| `about.ts` | the About statement, plus philosophies, hobbies, tools used by other sections |
| `music.ts` | the track list for the music marquee |

### How a project is composed

`projects.ts` holds a `base` array of card metadata, then derives the rest:

- `study` is attached from `caseStudyBySlug[slug]`. A project without an entry
  simply has no case study.
- `slides` are generated from `SLIDE_COUNTS[slug]` as
  `/projects/<slug>/slides/NN.webp` (zero padded, 1-based).
- Array order defines the Selected Work sequence.

Derived exports: `getProject(slug)`, `featuredProjects`, `caseStudies`
(only those with a `study`), `getAdjacentCaseStudies(slug)` (wraps around).

### The three kinds of project

The case study page branches on the data, not on a flag:

1. **Has `study`** -> full long-form case study, then the deck gallery.
2. **No `study`, has slides** -> deck-only page (Miscellaneous).
3. **Has `external`** -> the card links out to a live site instead of a case
   study (Binkli).

## Homepage composition

Section order is defined in `src/pages/home.tsx`:

```
Hero -> TermsBanner -> SelectedWork -> About -> Music -> Experience -> Apart -> Skills -> LightBand -> Contact
```

The ordering is deliberate: `TermsBanner` (the discipline marquee) is the
immediate beat after the hero, then Selected Work, so a recruiter reaches the
work before any prose about who made it. See
[`decisions.md`](./decisions.md#d12-selected-work-sits-directly-after-the-hero-about-follows-it).
`LightBand` is a full-bleed dark WebGL interlude just before the closer; see
[`decisions.md`](./decisions.md#d20-the-light-band-a-cursor-lit-3d-interlude).

Numbered sections read 01 to 06 down the page: Selected Work (01, `SectionHeader`
prop), About (02, inline eyebrow in `about.tsx`, not a `SectionHeader`),
Experience (03), Apart (04), Skills (05), Contact (06). The unnumbered
interludes (TermsBanner, Music, LightBand) sit between them. **If you reorder
sections, renumber**, both the `SectionHeader index` props and About's hardcoded
span.

## Theming

Two themes, light and dark, both first class.

- The active theme is the `dark` class on `<html>`.
- An inline script in `index.html` sets it **before first paint** from
  `localStorage.theme`, falling back to `prefers-color-scheme`. This exists to
  prevent a flash of the wrong theme; do not move it into React.
- `ThemeProvider` reads the initial value off the DOM class (so it agrees with
  the pre-paint script), then owns toggling and persistence.

## Build pipeline

```
npm run build
  1. node scripts/check-no-emdash.mjs   # fails on any em dash
  2. tsc -b                             # type check
  3. vite build
```

The em dash guard walks `src/` and also checks `index.html`, `README.md`,
`scripts/gen-og.mjs`, `public/site.webmanifest`. It does not currently scan
`docs/` or `CLAUDE.md`, but the rule still applies there.

`scripts/gen-og.mjs` generates the OG image and icons via `@resvg/resvg-js`. It
is a manual tool, not part of `npm run build`.

## Deploy

Vercel, building from `github.com/ishankaizer/IshanKaizer`, branch `main`.
`origin` points at an older `portfolio1` repo kept as a mirror. Local branch is
`redesign/working-drawing`.

## Dev server

Port 5200. The launch configuration lives at `../.claude/launch.json` (the
workspace root, **outside this repository**), which also defines configs for
sibling projects.

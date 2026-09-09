# Coding conventions

## Language and prose

- **No em dashes.** Enforced by the build. Use a comma, period, colon, or
  rewrite. This applies to code comments, copy, and docs.
- Copy is honest and specific. No fabricated metrics. If a number is not real,
  it does not go on the site. Qualitative outcomes are fine.
- Comments explain **why**, or state a constraint the code cannot show. They do
  not narrate what the next line does.

## TypeScript

- Named exports for components. No default exports except `App.tsx`.
- Shared types live in `src/types/index.ts` and are imported with
  `import type { ... } from '@/types'`. `verbatimModuleSyntax` is on, so type-only
  imports must use `import type`.
- `noUnusedLocals` and `noUnusedParameters` are on. Dead variables fail the build.
- Data objects use `as const` where the literal types are useful (`site.ts`).
- Prefer deriving over duplicating (`projects.ts` derives `featuredProjects`,
  `caseStudies`, and slide paths rather than hand maintaining them).

## Components

- Function components, named after the file (`work-card.tsx` -> `WorkCard`).
- Files are kebab-case. Components are PascalCase.
- Props are typed inline or via a local `interface XProps`. Document non-obvious
  props with a short doc comment, as `Section` and `Project` do.
- Compose with the primitives: `Container` for gutters, `Section` for rhythm,
  `Reveal` for scroll entrance. Do not hand roll a second version of these.
- A section is free to build its own layout when it should have its own identity.
  Sections deliberately do not all share one template.

## Styling

- Tailwind utilities in JSX. Merge conditional classes with `cn()` from
  `@/lib/utils` (clsx plus tailwind-merge), never string concatenation.
- Use the **material utilities**: `text-ink`, `text-ink-soft`, `text-ink-mute`,
  `bg-paper`, `bg-paper-2`, `border-hairline`, `text-brand`. They are the design
  vocabulary and they theme automatically.
- Do not hard code hex values in components. Add or reuse a token in
  `index.css`. When a value must be computed, reference the CSS variables, for
  example `color-mix(in oklab, var(--ink) 8%, var(--paper-2))`.
- Bespoke keyframes and multi-element animation classes live in `index.css`, not
  in component files. Tailwind arbitrary values are fine for one-off geometry.
- Fluid type uses `clamp()` in an arbitrary value, for example
  `text-[clamp(3rem,11vw,7.5rem)]`.

## Accessibility

Non-negotiable, and cheap to maintain:

- Decorative elements get `aria-hidden`. This includes the background field,
  the cursor, the hero placeholder, and the duplicated marquee content. The
  footer postcards are content, not decoration: their `alt` carries the
  handwritten text.
- Interactive elements keep a visible focus ring (`:focus-visible` is styled
  globally). Do not remove outlines.
- Tap targets stay at least 44px on touch.
- Contrast: keep `--ink-mute` and `--brand-strong` at AA on paper.
- Images carry real `alt`, or empty `alt` when decorative.
- Every motion path has a reduced-motion branch.
- The skip link in `RootLayout` must keep working.

## State and effects

- No global state library. Local state, plus one context for theme.
- `useLayoutEffect` is fine where a measurement must happen before paint (the
  retired hero FLIP used it). This is safe because there is no SSR.
- Always clean up: clear timeouts, cancel rAF, remove listeners, restore
  `document.body.style.overflow`. Scroll locks in particular must be released in
  the cleanup, not only on the happy path.
- Remember React StrictMode double-invokes effects in development. Effects must
  be idempotent, and any measurement must reset prior transforms first.

## Assets

- Project covers: `/projects/<slug>/cover.jpg`.
- Deck slides: `/projects/<slug>/slides/NN.webp`, zero padded, 1-based, with the
  count registered in `SLIDE_COUNTS` in `projects.ts`.
- Portrait: `/about/portrait.jpg`.
- Missing assets must degrade to an intentional placeholder, never a broken
  image. `ProjectCover` and `Portrait` both implement an `onError` fallback.
- Slides are lazy loaded. Marquee images are loaded eagerly, because lazy
  loading breaks in a continuously scrolling track.

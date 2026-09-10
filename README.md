# Ishan Kaizer, Portfolio

Product · UX/UI · Industrial Design portfolio. Built to convince a hiring
manager, in 30 to 60 seconds, that this is an exceptional designer: timeless
editorial craft, optimized for the hire, not for design-community applause.

**Start with [`CLAUDE.md`](./CLAUDE.md)** for the hard rules (no em dashes,
change only what was asked, motion robustness) and the documentation map into
[`docs/`](./docs). This file is a short landing page, not the source of truth.

## Stack

- **React 19** + **TypeScript** + **Vite**
- **Tailwind CSS v4** (`@tailwindcss/vite`), configured in CSS, token-based
- **Framer Motion**, restrained, reduced-motion-aware
- **React Router**, home + `/work/:slug` case studies
- **shadcn/ui** primitives (Button, Badge) on the brand tokens
- **Lucide** icons

## Scripts

```bash
npm run dev      # dev server (port 5200 via ../.claude/launch.json, outside this repo)
npm run build    # em dash guard + type-check + production build
npm run preview  # preview the build
npm run lint     # oxlint
```

A few one-off Python scripts under `scripts/` cut stickers and folder icons
out of source photos and build generated textures; see
[`docs/content.md`](./docs/content.md) for when to run them.

## Structure

```
src/
  components/
    ui/         shadcn primitives (Button, Badge) bound to brand tokens
    common/     Container, Section, Reveal, Pinned, Marquee, WorkCard, Seo, ...
    layout/     Nav, Footer (also the Contact section), RootLayout, CustomCursor, ThemeToggle
    case/       case-study presentation pieces (SlideGallery, ...)
    draft/      Assemble, the signature motion primitive
    theme/      theme context + provider
  data/         site, projects, experience, about, music, likes, case-studies/*
  pages/        home, case-study, not-found
  sections/     homepage sections (hero, selected-work, about, experience, apart, skills, likes, ...)
  types/        shared types
  index.css     design tokens + all bespoke CSS animation
```

Design tokens (colour, type, radius) live in `src/index.css` and map onto
shadcn's semantic tokens, so both themes and every primitive stay in sync.
There is no separate Tailwind config file.

## Content

All copy and project data live in `src/data`. Edit content there; components
should not need to change. See [`docs/content.md`](./docs/content.md) for the
full map, including how to add a project, a sticker, or a wallpaper.

## Drop-in assets (replace placeholders)

- `public/resume.pdf`, résumé (linked from the nav + hero)
- `public/about/portrait.jpg`, portrait (monogram shows until then)
- `public/projects/<slug>/cover.jpg`, project covers, and
  `public/projects/<slug>/slides/NN.webp` for a full deck
- `public/hero/`, `public/experience/`, `public/likes/`, `public/tools/`,
  `public/stickers/`, `public/contact/`, ready to use, replace to restyle
- `public/og.png`, 1200x630 social share image

## Deploy

Vercel, from the `ishankaizer` remote, branch `main`. SPA deep-link routing is
handled by `vercel.json` rewrites.

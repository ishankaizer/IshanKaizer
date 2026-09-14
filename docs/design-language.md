# Design language: "The Working Drawing"

## The idea

A portfolio that refuses to hide how anything is made. Every project, whether a
stretcher, an app, a brand, or a script, is documented in the same language: its
grid, its parts, its dimensions, and the maker's hand. The recurring act is
**assembly**: rough parts resolving into precise form.

It exists to express a multidisciplinary mind. Industrial design, product, UX/UI,
visualization, branding, and frontend are presented as one act of construction
rather than as separate skill silos.

## The governing rule: philosophy over motif

**This is the most important rule in the language, and the easiest to break.**

The Working Drawing must not degrade into "make everything look like an
engineering drawing". Drafting devices (title blocks, dimension lines, leader
lines, coordinates, revision marks, part numbers, visible grids, bills of
materials) may appear **only where they measure or explain something real**. If a
device exists purely to reinforce the theme, remove it.

Practical tests:

- The grid **organises silently**. It does not constantly reveal itself.
- Projects are the heroes. The philosophy reveals how work was made; it is not
  the work.
- Question any device that appears more than two or three times.
- The result should feel **inevitable, not themed**. The least obvious system wins.
- When in doubt, remove.
- Drafting notation earns its place mainly **inside case studies**, annotating
  real project imagery. The homepage, hero, nav, and about carry the philosophy
  only through composition, confident type, restraint, honest copy, the material
  palette, and the assembly motion.

## Audience and priorities

The site is judged by **hiring managers, not designers**. Benchmarks are drawn
from award-winning craft, but the goal is not to impress designers with
animation.

Ordering principle when values conflict:

1. Professionalism beats looking cool. Every time.
2. Timeless beats trendy.
3. Usability is never traded for a trend.
4. Every decision should increase hiring conversion.

## Materials (colour)

Warm draft paper, graphite, and exactly **one** accent, a wine/plum marker
(`#6b3a52` light, `#b9467e` dark), not the red-pencil orange of earlier
versions. No blueprint blue. No editorial white. See
[D37](./decisions.md#d37-accent-colour-and-display-face-changed-owner-request).

Tokens are defined in `src/index.css` on `:root` and `.dark`. The **token API is
stable** (`--paper`, `--ink`, `--brand`, ...) so components keep working when the
material changes. Change the values, not the names.

| Token | Role |
|---|---|
| `--paper`, `--paper-2` | background, recessed background |
| `--ink`, `--ink-soft`, `--ink-mute` | primary text, secondary, tertiary |
| `--hairline` | borders and rules |
| `--brand`, `--brand-strong`, `--brand-tint` | the single red-pencil accent |
| `--grid`, `--grid-strong` | the non-repro drafting grid |

Two consumers are layered on top:

1. **shadcn semantic tokens** (`--background`, `--primary`, `--border`, ...) are
   aliased to the material tokens, so every shadcn primitive inherits the brand
   in both themes automatically.
2. **`@theme inline` aliases** expose Tailwind utilities: `text-ink`, `bg-paper`,
   `text-brand`, `border-hairline`, `text-ink-mute`, and so on.

Prefer the material utilities (`text-ink`) in app code. They are the vocabulary.

### Contrast

`--ink-mute` and `--brand-strong` are chosen to meet WCAG AA on paper. If you
retune colours, preserve that. `--brand-strong` exists specifically for small
text and links, where `--brand` alone would not pass.

## Typography

Two voices, no more:

- **Machine**: IBM Plex Mono. Metadata, eyebrows, indices, part numbers,
  captions. Usually uppercase with wide tracking.
- **Hand**: Libre Franklin (variable). Everything else, display and body.

Plus one accent: Fraunces (variable) italic, `--font-serif`, used only for the
short italic "accent word" inside a heading (see every `SectionHeader` title).
Never used for a whole heading or for body copy at length. See
[D37](./decisions.md#d37-accent-colour-and-display-face-changed-owner-request).

Numerals are first class. Big type is set tight: heavy weight, negative
tracking, line-height at or below 0.9 for display sizes.

**Scale encodes priority, and the work outranks the name.** The hero tops out at
`6rem`; project rows in the work index match it (`clamp(2rem, 7vw, 6rem)`) and
never exceed it; a case-study title, being the subject of its own page, is the
one element allowed to go larger (`clamp(2.5rem, 9vw, 7.5rem)`). Setting projects
smaller than the hero is what made an earlier grid read as boring: it presented
the work as metadata about a card. See
[`decisions.md`](./decisions.md#d16-selected-work-is-a-hover-reveal-index-not-a-card-grid).

**Serif is no longer retired, by explicit request (D37).** `--font-serif` now
points at Fraunces, a genuine serif, and is used deliberately for the italic
accent word in section headings. It is still not a voice for running text:
the rule against serif garnish elsewhere in the page still holds.

Fonts are self hosted through Fontsource and imported in `src/main.tsx`. Do not
add a third party font request.

## Layout

- `Container`: `max-w-[1180px]` with responsive padding. The standard page gutter.
- `Section`: the standard vertical rhythm (`py-20 sm:py-28 lg:py-32`), with
  optional `band` (recessed background), `divided` (top hairline), and `bleed`
  (opt out of the Container for full width).
- `.draft-grid`: the working grid utility, driven by `--grid-size`,
  `--grid-origin-x`, `--grid-origin-y`.
- `.prose-measure`: `max-width: 68ch` for reading columns.

Sections that need their own identity (the hero, About) compose their own layout
directly rather than using `SectionHeader`, on purpose. Not every section should
look like the same template.

## Atmosphere

`BackgroundField` gives the paper the quality of a real material: irregular
blurred SVG colour fields (not ellipses), a faint tonal drift, fine film grain,
and a subtle pointer parallax. It is fixed behind all content at `-z-10` and must
never compete with the work.

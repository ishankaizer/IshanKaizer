# Content and assets

Everything editable lives in `src/data` and `public/`. Components should not need
to change to update content.

## Editing copy

| Want to change | Edit |
|---|---|
| Name, role, location, email, phone, socials, availability | `src/data/site.ts` |
| The About statement | `src/data/about.ts` (`statement`, `sub`) |
| The two "Two mediums" cards (words, hover photo, caption), tools | `src/data/about.ts` |
| Roles and history, and the receipt's footer lines (order, total, auth code) | `src/data/experience.ts` |
| Project cards | `src/data/projects.ts` |
| A long-form case study | `src/data/case-studies/<slug>.ts` |
| Music marquee tracks | `src/data/music.ts` |
| Hero disciplines list | `src/sections/hero.tsx` (local `disciplines` const) |
| Terms banner words | `src/sections/terms-banner.tsx` (local `terms` const) |

## Adding a project

1. Add an entry to the `base` array in `src/data/projects.ts`. Order in this
   array is the order in Selected Work.
2. Drop a cover at `public/projects/<slug>/cover.jpg`.
3. If it has a written case study, add `src/data/case-studies/<slug>.ts` and
   export it from `case-studies/index.ts`. It will be attached automatically by
   slug.
4. If it has a deck, export the slides to
   `public/projects/<slug>/slides/01.webp`, `02.webp`, ... and register the count
   in `SLIDE_COUNTS`. Then run `node scripts/gen-slide-dims.mjs` so
   `SlideGallery` knows each slide's real width/height and can reserve the
   right space before it loads (see [`decisions.md`](./decisions.md#d25-slide-decks-carry-their-real-dimensions-so-they-do-not-jump-while-loading)).
   Skipping this just means slides load without a reserved size, it is not a
   build error.
5. If it links out instead of having a study, set `external`.

No component changes are needed for any of this.

**Keep slide files web-weight, not source-weight.** Export each slide as an
individually optimised WebP, not a multi-hundred-megabyte PDF or a raw
screen recording. The existing decks total under 2MB each (largest single
slide is ~420KB); that is the bar. A giant PDF cannot be dropped in as-is,
both because it cannot be processed through this tooling and because
shipping it to a browser would be the opposite of the fast, responsive
loading the deck is designed for.

## Case study shape

`CaseStudy` in `src/types/index.ts` encodes the intended spine, and the
interface is deliberately locked to exactly this. Follow it:

- `hook`, a one-line, three-second read: what it is, the role, the outcome
- `overview`, team / platform / tools (no timeline, see D22)
- `problem`, the real user problem and the stakes, in **one** short paragraph

That is the whole shape. No `contributions` / "my role" field, no `process`, no
`decisions`, no `outcome`, no `reflection`, no timeline. The deck carries the
depth, so the written study is framing only: see
[D18](./decisions.md#d18-the-deck-leads-the-case-study-the-written-story-follows-it),
[D21](./decisions.md#d21-the-written-case-study-is-framing-not-a-second-telling)
and [D22](./decisions.md#d22-no-timeline-no-role-list-the-shape-is-locked).

**Do not add a field back to `CaseStudy` or to the spec row on the page, even
one that feels small (a date, a duration, a role bullet), without the owner
explicitly asking for it.** These were cut on purpose, twice. If new case-study
content shows up that does not fit `hook` / `overview` / `problem`, that is a
signal to ask, not to extend the type.

**Never fabricate metrics.** Honest qualitative outcomes are correct and
preferred over invented numbers.

## Drop-in assets

Placeholders render until the real file exists, so nothing looks broken.

| Path | Fallback if missing |
|---|---|
| `public/resume.pdf` | link 404s |
| `public/about/portrait.jpg` | large "IK" monogram, behind the About text |
| `public/projects/<slug>/cover.jpg` | composed placeholder card with the title |
| `public/projects/<slug>/slides/NN.webp` | gallery is omitted |
| `public/og.png` | social card has no image |

`public/about/` and `public/music/` contain `_DROP_*_HERE.txt` notes marking
where files go.

## Wallpapers, stickers and tool folders

The "Things I like" desk reads `src/data/likes.ts`; the toolkit reads `tools`
in `src/data/about.ts`.

- **Add a wallpaper**: save a WebP under `public/likes/wallpapers/` and append
  it to `wallpapers`. The first entry is the default.
- **Add a sticker** from a photo with a flat background:
  `python scripts/cutout.py in.jpg public/likes/stickers/name.webp` (needs
  Pillow, numpy, scipy; `--mode rembg` needs rembg for patterned backgrounds;
  `--split` breaks a sheet into pieces; `--crop T,R,B,L` strips screenshot
  chrome first). Then add an entry to `stickers` with its pixel size (`iw`,
  `ih`), display width `w`, resting spot `x`/`y` in percent of the board, tilt
  `r` and drift period.
- **Rebuild the receipt's paper texture**:
  `python scripts/gen-experience-assets.py` (regenerates
  `public/experience/crumple.jpg`). Keep it near white; it is multiplied onto
  the paper and anything darker costs readability.
- **Stick something on a section**: cut it with `scripts/cutout.py` (or keep a
  photo whole) into `public/stickers/`, then drop a `<Pinned>` into the section
  with a variant (`cutout`, `polaroid`, `taped`, `pinned`), a position class and
  a tilt. Record it in `resources/README.md`.
- **Add or reassign a tool folder**: cut the icon with
  `python scripts/cutout.py in.jpg public/tools/name.webp --max 320` and point
  the tool's `icon` at it.

## Generated assets

`scripts/gen-og.mjs` renders `og.png` and the app icons via `@resvg/resvg-js`.
Run it manually after a brand change; it is not part of `npm run build`.

## Music data

`src/data/music.ts` holds `{ title, artist, cover }` per track. Covers are
referenced from the Spotify CDN (oEmbed thumbnails, displayed under licence, not
re-hosted). The list is shuffled so identical album art is never adjacent,
including across the loop seam. Marquee duration scales with track count, and
covers load eagerly because lazy loading breaks inside a moving track.

# Decisions

Enduring decisions and the reasoning behind them. Includes paths that were tried
and rejected, so they are not re-litigated.

---

## D1. The design language is "The Working Drawing", and it is locked

An earlier version read as generic and templated. The diagnosis was that it had
copied the surface tics of reference sites without a central idea, and that
"safe" was itself the tell.

The committed idea is a portfolio that refuses to hide how anything is made.
Full detail in [`design-language.md`](./design-language.md).

**Corollary, and the rule most often broken:** philosophy over motif. Drafting
devices appear only where they measure something real. A previous iteration
over-applied the motif (grids, title blocks, sheet numbers, bills of materials on
the hero) and had to be pulled back.

**Rejected:** bedroom/CRT maximalism, editorial serif, literal blueprint,
Y2K/cluttercore. These were explored as an idea bank; they are not the voice.

## D2. Optimise for hiring managers, not designers

The site is judged in 30 to 60 seconds by someone deciding whether to interview.
When "looks cool" conflicts with professionalism, professionalism wins. Timeless
over trendy. Never trade usability for a trend.

This is why the loud, maximalist concepts were demoted and why animation is
restrained.

## D3. No em dashes, enforced in the build

The owner considers the em dash an AI tell. Rather than rely on discipline, the
build fails: `scripts/check-no-emdash.mjs` runs before `tsc`. It scans `src/`
plus `index.html`, `README.md`, `scripts/gen-og.mjs`, `public/site.webmanifest`.

## D4. Serif is retired, and `--font-serif` is aliased to Archivo

The language forbids serif garnish. Rather than remove every `font-serif` usage
at once, `--font-serif` points at Archivo, so a stray usage degrades to Archivo
italic instead of a system serif. Two voices only: Archivo (hand) and IBM Plex
Mono (machine).

**Rejected:** Space Grotesk. A swap of the display face to Space Grotesk using a
tighter, medium-weight recipe (borrowed from a reference site) was tried and
rejected outright. The Archivo setting is the intended look. Do not re-propose a
display face change without an explicit request.

## D5. Content lives in `src/data`

Copy, projects, experience, and case studies are static TypeScript. No CMS. Edits
happen in one place and components stay presentational.

## D6. A project's shape is derived from its data, not flagged

`projects.ts` composes `study` and `slides` onto card metadata. The case study
page branches on what exists: a written study, a deck only, or an external link.
Adding a project means adding data, not code.

## D7. Token API is stable; only materials change

Components address `--ink`, `--paper`, `--brand`. The palette has been re-skinned
without touching components because the names never moved. shadcn semantic tokens
are aliased onto the same materials so primitives inherit the brand for free.

Keep this contract. Change values, not names.

## D8. Motion must never be able to hide content

Learned from real bugs, twice:

1. A Framer Motion preloader drove its exit with rAF. When the frames did not
   advance, the overlay stayed at `transform: none` and **covered the entire
   site permanently**. Fix: CSS transition for the movement plus a hard
   `setTimeout` that unmounts the overlay regardless of animation callbacks.
2. Entrance keyframes using `animation-fill-mode: both` can hold an element at
   its hidden `from` state if the animation never completes. Fix: `backwards`,
   so the resting state is the natural visible one.

Generalised into the rules in [`animation.md`](./animation.md#robustness-rules):
default to visible, resolve on a timer, prefer compositor-driven CSS for anything
that gates visibility.

## D9. Scroll reveals trigger on entry, not early

A scroll reveal was once given a 200px positive `rootMargin` (to fix elements
getting stuck invisible during fast scrolling). The side effect was worse: every
element revealed before it entered the viewport, so the animation was never seen
and the site "felt like a PDF".

Current setting: `{ once: true, amount: 0.2 }`. Reveal when a fifth of the
element is actually visible.

## D10. Reduced motion fades, it does not freeze

The global CSS rule collapses durations to `0.01ms`, which alone would make the
site fully static for those users. `Reveal` and `Assemble` therefore keep an
**opacity fade** under reduced motion and drop only transforms, parallax, and
blur. Opacity is safe for vestibular sensitivity; movement is not.

## D11. The intro plays once per session, and only on the homepage

`sessionStorage.introPlayed` gates it. A returning visitor is not forced through
it again; a new tab replays it. It lives inside `Hero`, so landing directly on a
case study correctly has no intro.

**Decided:** the name animates as one line that slots apart into the two-line
hero, via per-word FLIP. Reflowing a single text node from one line to two mid
transition is janky; animating two words to measured positions is smooth and
lands exact.

**Superseded:** the earlier standalone `Preloader` component (a centred name
panel that swiped up). It is replaced by the hero intro and is now dead code, see
[`known-gaps.md`](./known-gaps.md).

## D12. Selected Work sits directly after the hero; About follows it

**Reversed.** The order was originally Hero, About, then interludes, then
Selected Work, on the reasoning that the project count is small so the site
should lead with the person. That was flipped in two steps: Selected Work moved
ahead of About, then the terms-banner marquee (the discipline strip: Industrial
Design, Product Design, UI/UX, and so on) moved from between About and Selected
Work to sit immediately after the hero instead. Current order is Hero,
**TermsBanner**, **Selected Work**, About, Music, Experience, Apart, Skills,
Contact (`pages/home.tsx`). A recruiter now reaches the work immediately, before
any prose about who made it.

`SelectedWork`'s `SectionHeader` carries `index="01"` and About's inline eyebrow
(hardcoded in `about.tsx`, not a `SectionHeader` prop) was updated to `02` to
match, since the numbers must reflect real order. Experience/Apart/Skills/Contact
stayed `03`-`06`: their order relative to each other, and to About, never
changed. The terms banner itself carries no visible index (it is `aria-hidden`
and decorative), so moving it required no renumbering.

About is deliberately short: one large statement plus one supporting line, with a
lot of air, and the portrait behind the text rather than beside it. A long
self-selling essay was explicitly cut. That reasoning is unaffected by the reorder.

## D13. Deck images are shown with zero gap, at the page's own width

Project decks were authored to be read as continuous slides. `SlideGallery`
stacks them with no gap, no border, and no rounding.

The slides are **not** 16:9 presentation slides. They are near-square designed
page sections (Park IT's are 1500x1558) that read as one continuous document:
slide 01 is a hero plus an "About" block, slide 05 is a "Research" block
carrying the real figures. **This is why they must not be chopped into a
carousel or a thumbnail grid**; doing so would cut a designed page apart.

The deck spans the full `Container` width (~1084px rendered), not a narrower
reading column. It is the work, so it is not set smaller than the prose about it.

## D14. Static social tags in `index.html`

The site is client rendered, so scrapers get no JS. Open Graph, Twitter, and
JSON-LD are written statically into `index.html`; the `Seo` component handles
per-route titles for humans only.

## D15. Theme is set before paint by an inline script

A React-owned theme would flash the wrong palette on load. The inline script in
`index.html` sets the `dark` class from `localStorage` or
`prefers-color-scheme` before first paint, and `ThemeProvider` adopts whatever it
finds. Do not move this into React.

## D16. Selected Work is a hover-reveal index, not a card grid

The 2-up card grid was replaced. The diagnosis was scale, not styling: the hero
name was set up to 96px while project titles sat at 24 to 30px and covers were
half-width 4:3 thumbnails. The site rendered the person three times louder than
the work, contradicting the language's own rule that **projects are the heroes**.

Now every project is a full-width row: index, title at `clamp(2rem, 7vw, 6rem)`
(topping out at the hero's own max, never louder), and a mono meta row. On a fine
pointer the cover rides the cursor and the hovered row alone stays lit.

**The known trade-off:** a hover-reveal list hides imagery behind an interaction.
This was chosen deliberately, with a required mitigation: on coarse pointers and
under reduced motion the covers render **inline** instead
(`hoverMode = fine && !reduce` in `work-index.tsx`). Titles and metadata are
visible in every mode. Do not remove the inline fallback; without it the work is
unreachable on touch, which would breach D2.

**Superseded:** `WorkCard` is deleted, not merely unused.

## D17. The case-study title outscales the homepage hero

The case-study `h1` was `text-4xl sm:text-6xl` (36 to 60px), smaller than the
hero. A project's own page should be led by the project, so `.cs-title` is now
`clamp(2.5rem, 9vw, 7.5rem)`. This is the one place the work is deliberately set
larger than the name.

## D18. The deck leads the case study; the written story follows it

Measured on Park IT, the old order put the deck **7.7 screens down a 23.5 screen
page**, with the deck itself accounting for 14.5 of those screens. A recruiter
had to scroll seven screens of prose before seeing any actual work.

The deck is already a complete, designed case study with its own narrative and
figures (see D13). The written study restates the same beats: its process
headings are "Research", "Insight" and "Design", which is exactly what slides 01
to 05 already show, and better. Park IT's `outcome.stats` is even empty while the
deck carries the real numbers.

So `SlideGallery` now renders **directly after the header, cover and spec row**,
and the written study sits below it as optional depth. The deck's first slide is
`loading="eager"` because it is now near the top; lazy loading it made it pop in.

Time to first real work: **7.7 screens to 1.7**.

The page got *longer* (23.5 to 26.5 screens), because widening the deck makes
each near-square slide taller. That was accepted knowingly: scrolling the deck is
a recruiter looking at the work, whereas scrolling preamble to reach it is not.
Length was never the problem; order was.

**Not done, and worth revisiting:** the written study genuinely duplicates the
deck. Trimming it to a short "at a glance" was offered and declined for now.

## D19. The toolkit is a type specimen, not a card grid

The 3-column grid of abbr-chip cards was replaced with five capability lines
(Interface, Form & CAD, Image & Print, Motion, Automation), each a flowing
baseline of tool names set in Archivo black. **Scale encodes reach**: how
central a tool is to the practice, declared as `scale: 'lg' | 'md' | 'sm'` in
`toolGroups` (`data/about.ts`), because it is a measurement, not styling. The
section copy states the encoding outright so it reads as information, not as a
private conceit.

Constraints that shaped it:

- Tool names cap at `clamp(2.5rem, 5.5vw, 4.5rem)`, **below** the work index's
  6rem: instruments never outrank the work they produce (extends D16's scale
  hierarchy).
- Rows carry no index numbers. They were tried and cut: stacked under the "05
  Toolkit" header they were a second numbering system doing nothing real,
  unlike work-index numbers which identify projects.
- Rows enter via `Assemble` from alternating sides, the signature motion, one
  idea per row.
- Capability labels sit as mono margin notes (right on desktop, above on
  mobile), naming what the tools serve so a hiring manager scans five
  capability words rather than nine app names.

**Rejected:** vendor logo walls (nine foreign brand voices in a one-accent
site), skill bars and radar charts (self-ratings that hiring managers
distrust), a third marquee (device already used twice), periodic-table tiles
(still boxes). The `abbr` field died with the cards and was removed from the
`Tool` type.

**Extended with the exploded view.** Prompted by a reference site that staged
tools as 3D keycaps in a lit scene, the principle taken (tools as objects in one
atmospheric moment, never the skin) was translated into the site's own language:
on desktop the specimen opens **exploded**. The names lie strewn across the sheet
over the faint `.draft-grid`, and scroll scrubs each part into its seat in
sequence. Assembly, the language's recurring act, performed live.

**Retuned after the first pass read as confetti.** Three faults were measured
and fixed:

- **Poses were random-facing.** The old `SCATTER` flung parts across a 500px X
  span from unrelated directions. An exploded drawing separates along a coherent
  axis, so poses are now *derived* (`openPose`): each row stands off to one side,
  alternating down the page, and its own parts fan along the row's baseline. X
  span cut to ~240px, lift kept positive and small.
- **Timing overlapped.** Concurrency is span / stagger; the old 0.42 span on a
  0.055 stagger put eight of nine parts in flight at once. Now `SPAN = 0.2` over
  a derived stagger keeps ~3 moving at a time (a wave the eye follows) and lands
  the last part at 0.75, so the finished specimen holds a quarter-scrub before
  release. The scroll offset was also fixed to `['start start', 'end end']` so
  progress maps exactly onto the pinned stretch.
- **The grid fade misbehaved.** Driving grid opacity off `scrollYProgress` made
  framer render it non-monotonically (it dipped, then visibly reappeared near
  the end; framer never wrote the inline value, and computed opacity swung
  0.7 to 0.11 to 0.35). It is now a **constant faint grid** (`opacity-40`, plain
  div, no motion value): a drafting sheet's grid does not fade, and this removes
  the bug and a whole scroll-linked value.

Robustness reasoning, in the spirit of D8:

- The **resting layout is the natural flow layout**; the open pose is pure
  transform driven by scroll position (`useScroll` + `useTransform`, no rAF loop
  of our own, no entrance triggers). With JS dead the section is simply the
  assembled specimen. If rAF ever stalls, parts rest posed but fully visible and
  legible. Opacity of content never animates, so nothing can be hidden.
- Capability labels were briefly wired to fade in at 72% progress and cut in
  review: that hid real content behind an interaction (rule 1). They print on
  the sheet from the start.
- **Small screens (max-width 640px) and reduced motion get the static
  assembled specimen**, no stage, no scrub. At 375px wide the open pose clipped
  names mid-word at the viewport edge, which reads as broken, not composed. D2:
  usability is never traded for a trend.
- The stage is 190vh with a sticky viewport, roughly one screen of dwell. The
  grid layer is `aria-hidden` and decorative.

## D20. The light band: a cursor-lit 3D interlude

Prompted by a Spline community scene (a form in darkness, revealed by a
cursor-light with edge glow). The owner wanted "something beautiful in the
background, hidden by darkness, lit by my cursor."

The principle was taken, the skin was not (D1, D3-of-CLAUDE rule 3). A pitch-dark
cursor-lit scene fights the whole site: warm draft paper, dark text, one accent.
Dropped behind the live site it would either be hidden by the paper content or
destroy legibility. So it lives in **one dedicated full-bleed dark section**
(`sections/light-band.tsx`), placed just before Contact as a quiet crescendo.
The rest of the site stays paper; this band is dark in both themes on purpose.

Choices:

- **Native raw WebGL, not Spline.** Spline means its runtime plus a scene from
  its CDN: heavy, external, off-palette, against the site's self-hosting and
  fast-load-for-recruiters priorities. `light-object.tsx` raymarches a rounded
  graphite box in a single fragment shader, **zero new dependencies**. The glow
  reads `--brand` at runtime, so the edge light is the site's own red pencil,
  not a foreign colour.
- **It states something real.** The caption ("a form only shows itself when
  light finds its edges") is an industrial-design truth the object performs, so
  the section is a statement about the owner's discipline, not decoration. That
  is the governing rule: devices earn their place by measuring something real.

Robustness (D8 and the animation rules):

- No page content sits behind the canvas, so it can never hide anything. The
  caption is a separate always-visible layer.
- The rAF loop **pauses off-screen** (IntersectionObserver) and **falls back to
  a static dark gradient panel** if WebGL is missing or the context is lost.
- **Reduced motion**: no rotation, no auto-orbit, instant (unsmoothed) cursor
  tracking; it settles to one frame and stops, but a pointer event restarts it
  (cursor lighting is user-driven, not vestibular, motion).
- **Coarse pointers** (no hover) get a slow auto-orbit light so the form still
  breathes and reveals itself, rather than sitting as a dead black rectangle.
- DPR capped at 1.6 and raymarch steps bounded, so the per-pixel shader stays
  cheap on a full-width band.
- Unnumbered, like the other interludes, so the 01 to 06 index is undisturbed.

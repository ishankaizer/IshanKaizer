# Animation

Motion here is a feature, not decoration. Without it the site reads like a PDF.
With too much of it, it stops reading as professional. This document records the
principles and, more importantly, the **robustness rules** that were learned from
real failures.

## Principles

1. **Mechanical, not sprung.** Motion is torqued, it settles, it never bounces.
   The signature easing is `cubic-bezier(0.16, 0.84, 0.3, 1)`. The intro's
   longer glide uses a slow ease-in-out, `cubic-bezier(0.76, 0, 0.24, 1)`.
2. **The recurring act is assembly.** Parts translate precisely into position.
3. **Restraint.** One idea per moment. Motion guides attention; it never
   performs for its own sake.
4. **Everything honours reduced motion**, but reduced motion should not mean
   dead. See below.
5. **Fine-pointer effects are gated.** The custom cursor and pointer parallax
   only run on `(pointer: fine)`.

## Robustness rules

**These are not stylistic. Breaking them has broken the site before.**

1. **Content is visible by default. Motion may only hide it temporarily.**
   Never build a reveal where the resting state is hidden and JS is required to
   show it. If the script fails, the page must still be readable.
   Implementation: `.hero-stagger` is visible by default and only hidden while
   `.hero-intro[data-hero-ready='false']` is actively covering it.
2. **Prefer CSS transitions/animations over JS rAF for anything that gates
   visibility.** CSS runs on the compositor and survives throttling.
3. **Any full-screen overlay must remove itself on a hard `setTimeout`,**
   independent of animation callbacks. An overlay that waits on an animation
   event can get stuck covering the entire site if that event never fires.
   This actually happened with a Framer Motion driven preloader whose rAF never
   advanced.
4. **Use `animation-fill-mode: backwards`, not `both`,** for entrance keyframes.
   With `backwards`, the resting state after the animation is the element's
   natural (visible) state. With `both`, a frozen or failed animation can hold
   the element at its hidden `from` state forever. See the `cs-*` animations.
5. **Trigger scroll reveals when the element is actually entering view.**
   A generous positive `rootMargin` (revealing 200px early) makes everything
   pre-reveal, so the user never sees the animation and the site feels static.
   The current setting is `viewport={{ once: true, amount: 0.2 }}`.
6. **Measure before you transform.** Any FLIP must clear existing transforms
   before `getBoundingClientRect()`, or a re-invoked effect (React StrictMode
   double-invokes effects in dev) will measure an already transformed element.

## Reduced motion

The global rule in `index.css` collapses all animation and transition durations
to `0.01ms` under `prefers-reduced-motion: reduce`.

Because that rule is blunt, the JS-driven primitives make a deliberate choice:
**under reduced motion they still fade opacity, they do not go fully static.**
Opacity changes are considered safe for vestibular sensitivity; transforms,
parallax, and blur are what get dropped. `Reveal` and `Assemble` both implement
this via `useReducedMotion()`.

The hero intro is skipped entirely under reduced motion and lands directly on the
resting hero.

## The motion system

### `Reveal` (`components/common/reveal.tsx`)

The single shared scroll reveal. A quiet blur plus rise, once per element.

- Trigger: `whileInView`, `{ once: true, amount: 0.2 }`
- Normal: `opacity 0 -> 1`, `y 20 -> 0`, `blur(6px) -> blur(0)`, 0.65s
- Reduced motion: opacity only, 0.5s

Use this for ordinary page content. Do not hand roll a second reveal.

### `Assemble` (`components/draft/assemble.tsx`)

The signature primitive: a part translating precisely into position from a given
direction (`up`, `down`, `left`, `right`) with mechanical easing. Same trigger
and reduced-motion policy as `Reveal`.

### Hero intro (`sections/hero.tsx`)

The first-visit moment. The name appears centred on a full-screen panel as a
single line, holds, then the two words **slot apart into the two-line hero**
while the panel dissolves and the rest of the hero rises in.

- Runs **once per browser session**, gated by `sessionStorage.introPlayed`.
  A refresh will not replay it; a new tab will.
- Implemented as a **per-word FLIP**: measure each word's resting rect, compute
  the transform that places both on one centred line (scaling down only if the
  line would not fit), apply it, then transition back to `none`. Because the
  words return to `transform: none`, they land pixel exact by construction.
- Driven by CSS transitions plus `setTimeout`, deliberately **not** rAF.
- Timing: `HOLD = 1500ms`, `MOVE = 1300ms`, second word staggered by 90ms.
  These are the tuning dials.
- The whole hero content (`.hero-stagger`) is visible by default; it is only
  hidden while the overlay is up.

Only the homepage has an intro, because only `Hero` mounts it. Landing directly
on a case study correctly shows no intro.

### Case-study entrance (`cs-rise`, `cs-fade`, `cs-cover`)

Plays when a project opens. The title rises out of a mask, the meta and hook fade
up, the cover clips open with a slow settle. Pure CSS keyframes with
`backwards` fill, staggered by inline `animationDelay`.

Applied in `pages/case-study.tsx` to both the full case study header and the
deck-only header.

### Work index (`components/common/work-index.tsx`)

The Selected Work hover reveal. Hovering a row lights it, recedes its siblings to
`opacity: 0.3`, and swings the cover in on a panel that trails the cursor.

- **Fine pointer only, and only without reduced motion**
  (`hoverMode = fine && !reduce`). Otherwise the covers render **inline** in each
  row instead. This fallback is load bearing: without it the imagery is
  unreachable on touch. See
  [`decisions.md`](./decisions.md#d16-selected-work-is-a-hover-reveal-index-not-a-card-grid).
- The panel trails the pointer via the same rAF lerp as `CustomCursor` (`k = 0.12`).
- All covers stay mounted and cross-fade by opacity, so switching rows never
  triggers a fetch flash.
- Every resting state is the visible one. The dim, the title shift, and the panel
  are all hover-driven, so with JS dead the list still reads in full.
- The panel sits at `z-index: 60`: above the nav (50), below the custom cursor
  (9999) and the route mask (290), and is `pointer-events: none` so it never eats
  a click.

### Toolkit exploded view (`sections/skills.tsx`)

The one scroll-scrubbed set piece. On desktop the tool names open strewn across
the sheet over a faint `.draft-grid`, and scroll drives each part into its seat
in sequence. Implemented with `useScroll` + `useTransform` per part, each with
its own settle window, eased on the mechanical curve.

- **Poses are derived, not hand-scattered** (`openPose`): rows stand off to
  alternating sides and their parts fan along the row baseline, so the section
  reads as one concertina closing rather than confetti. See
  [`decisions.md`](./decisions.md#d19-the-toolkit-is-a-type-specimen-not-a-card-grid).
- **Timing keeps ~3 parts moving at once** (`SPAN = 0.2` over a derived
  stagger); the last part lands at 0.75 so the specimen holds before release.
  The scroll offset `['start start', 'end end']` maps progress onto the pin.
- **The grid is a constant faint layer** (`opacity-40`), not scroll-driven:
  driving its opacity off progress made framer render it non-monotonically.
- **The resting layout is the natural flow layout.** The open pose is transform
  only; content opacity never animates. JS dead or rAF stalled leaves posed but
  fully legible type, never hidden content.
- Small screens (max-width 640px) and reduced motion skip the stage entirely
  and render the assembled specimen statically.
- No entrance triggers, so it cannot suffer the stuck-invisible failure of
  rule 5; progress is a pure function of scroll position.

### Route mask (`components/common/route-mask.tsx`)

The project-open transition. Eight vertical bars scale up to cover the screen,
the route swaps underneath while covered, then the bars scale away, staggered.

- Every phase change is driven by a hard `setTimeout`, never by `animationend`,
  so the mask cannot get stuck covering the site (robustness rule 3).
- Bars are absolutely positioned with a 1px overlap on each edge. Flex sizing let
  each bar's own compositor layer round independently and open a hairline seam.
- Skipped entirely under reduced motion: it navigates straight away.

### Marquees

There are **two separate marquee implementations**. This is intentional but worth
knowing:

- **`.marquee` / `.marquee-track` in `index.css`**: used by the Music section.
  Duration is set per instance via `--marquee-duration` (scaled to track count),
  pauses on hover, disabled under reduced motion.
- **`components/common/marquee.tsx`**: a generic reusable component (duplicates
  children, edge mask fade, optional pause on hover, four directions). Used by
  the Terms banner.

### Micro-interactions

- `.nav-highlight`: a filled box wipes in left to right behind nav links
  (`scaleX` with a `transform-origin` flip).
- `.cta-marquee`: the label scrolls up to an identical copy (a `text-shadow`
  clone one line below), while the icon flies out top-right and a duplicate
  slides in from bottom-left.
- `.hero-float`: the hero placeholder's slow idle float.

### `CustomCursor`

Two parts, a precise dot and a trailing ring, both `mix-blend-mode: difference`
so they read on any background. rAF lerp smoothing (ring `0.18`, dot `0.45`),
grows over interactive elements, snaps instantly under reduced motion, hidden on
coarse pointers, and the native cursor is untouched when JS is off.

### `CountUp`

Counts to the number inside a string (preserving prefix and suffix such as
`"68%"`) when scrolled into view. IntersectionObserver at `threshold: 0.4`,
cubic ease-out, fires once. Shows the final value immediately under reduced
motion.

## Verifying motion

The in-editor browser preview **freezes animation frames**: screenshots time out
and transitions stall part way. A computed style read there can show a stuck
intermediate value that is not a real bug.

Verify by DOM instead: check structure and classes, check the **resting** state
(is the element visible, is `transform` back to `none`), and confirm the actual
feel on the deployed site.

# Known gaps

Verified against the source. These are real, low-risk, and safe to clean up when
touching the surrounding code. None of them break the site today.

## Dead code

| Item | Status |
|---|---|
| `src/components/layout/preloader.tsx` | **Unused.** Zero references. Superseded by the hero intro (see [`decisions.md`](./decisions.md#d11-the-intro-plays-once-per-session-and-only-on-the-homepage)). Safe to delete along with the `.preloader*` CSS. |
| `.preloader`, `.preloader-word`, `.preloader-word-2`, `@keyframes preloader-word-in` in `index.css` | Only consumed by the dead component above. |
| `.page-enter` and `@keyframes page-enter` in `index.css` | **Unused.** The page-wide entrance blur was removed because its `filter` created a stacking context that trapped the hero intro's z-index, and the intro replaced it as the load moment. |
| `.draft-grid-strong` in `index.css` | Unused. `.draft-grid` is used. |
| `.no-scrollbar` in `index.css` | Unused. |
| `--ease-mech` (`@theme` at the end of `index.css`) | Now **partly adopted**: the `.work-*` rules use `var(--ease-mech)`. The rest of the file still hard codes `cubic-bezier(0.16, 0.84, 0.3, 1)`. Finish the migration or drop the token. |
| `site.positioning` in `src/data/site.ts` | Unused since the hero was stripped back to identity only. |
| `src/components/case/case-media.tsx` (`CaseMediaFrame`) | **Unused** since the written case study was cut back to framing only (see [`decisions.md`](./decisions.md#d21-the-written-case-study-is-framing-not-a-second-telling)). Its only caller was the removed `process` block. Kept, not deleted, so the cut stays reversible. |
| `src/components/common/count-up.tsx` (`CountUp`) | **Unused** for the same reason: its only caller was the removed `outcome.stats` block. |
| `CaseMedia`, `CaseSection`, `Decision`, `MetricStat` in `src/types/index.ts` | No longer referenced by `CaseStudy`. `CaseMedia` is still imported by the dead `case-media.tsx`. |
| `@fontsource/instrument-serif` in `package.json` | **Unused dependency.** Never imported. Left over from the retired serif voice. |

## Missing content

- **`binkli` has no cover asset.** `public/projects/binkli/` contains only
  `_DROP_IMAGES_HERE.txt`, so it falls back to the composed `ProjectCover`
  placeholder. The dev server answers the missing path with a `200 text/html`
  SPA fallback rather than a 404; the image still fails to decode, so
  `onError` fires and the placeholder shows as intended. Dropping a
  `cover.jpg` into the folder is the fix; no code change is needed.

  (`materia` and `soul-ai` had the same gap; both now have a `cover.jpg`.)

## Inconsistencies

- **`font-serif` is still used in eight places** (`footer.tsx`, `case-study.tsx`
  x2, `apart.tsx`, `experience.tsx`, `selected-work.tsx`, `skills.tsx`,
  `likes.tsx`), usually as `font-serif italic` for an accent phrase. Since
  `--font-serif` is aliased to Archivo, these render as **Archivo italic**, not a
  serif. This is intentional as a safety net, but the class name now lies about
  what it does. Consider replacing with `italic` alone.

- **Two marquee implementations** coexist: the CSS `.marquee` used by the Music
  section, and the generic `components/common/marquee.tsx` used by the Terms
  banner. Both work; consolidating is optional.

- **`README.md` structure section is slightly out of date.** It predates
  `sections/terms-banner.tsx`, `components/draft/`, and `components/common/marquee.tsx`.

## Environment notes

- The dev launch config lives at `../.claude/launch.json`, **outside this
  repository**, so a fresh clone has no port 5200 config. `npm run dev` still
  works, it just picks Vite's default port.
- The in-editor browser preview freezes animation frames. Screenshots time out
  and transitions stall mid flight. Verify motion via DOM inspection and on the
  deployed site, not by screenshot.

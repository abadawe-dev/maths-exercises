# Maths Practice site

Static GitHub Pages site (Vite + React + TS) with interactive exercises for a Grade 11 maths textbook chapter.
Companion to explainer videos made in a separate project; the look (dark aurora, one accent per concept) matches them.

## Layout

- `src/lib/` — framework: `types.ts` (content schema), `math.ts` (answer checking), `Exercise.tsx`,
  `ConceptPage.tsx`, `Home.tsx`, `Tex.tsx` (`<Tex>`, `<Rich>`), `progress.ts`. `src/styles.css` is the design system.
- `src/content/ch01/cN.tsx` — one concept: lessons → key ideas, optional widget, exercises. `c1.tsx` and
  `c1.widgets.tsx` are the reference; copy their patterns.
- `tests/content.test.ts` — validates every exercise. `scripts/shots.mjs` — screenshots. `scripts/smoke.mjs` — e2e.

## Content rules

- Text fields are "rich" strings: `$inline$`, `$$display$$`, `**bold**`. Write them with `const T = String.raw` so
  backslashes survive; never put `$` directly before `{` inside a template literal.
- `\C{n}{r}` typesets ₙCᵣ. Follow the textbook's notation and wording ("factorise", "LHS/RHS").
- Exercise `id`s are storage keys: unique per concept, never renamed.
- Exercise types: `input` (typed expression/number, one or more fields), `choice`, `proof` (pick each next line).
  Use `proof` for proofs and multi-step methods, `input` wherever a final expression can be typed.
- `Field.answer` is in typed syntax (`(x+2)/(x(x-1))`, `sqrt(ab)`, `2x^2+3x+8`). Equivalent forms are accepted, so
  add `rule: 'noParens'` for "expand", `rule: 'simplified'` for "simplify/reduce", `rule: 'number'` for numbers —
  otherwise retyping the question would be marked correct.
- Every exercise needs a full worked `solution`; most need 1–3 `hints` that go from nudge to near-answer.
  `choice` distractors should be real mistakes, each with `feedback` explaining it.
- Order within a lesson: warm-up → practice → challenge. Cite the textbook in `source`
  ("Lesson 1-4 · Try 1"). Verify every answer by hand; the tests only check self-consistency.
- Widgets: plain React + inline SVG, styled with the `.w-*` helper classes and CSS variables (`var(--accent)`,
  `var(--cyan)` …). They must work with touch, at 390 px width, and be operable by keyboard (native inputs/buttons).

## Checks before finishing

`npx tsc --noEmit`, `npx vitest run`, then `node scripts/shots.mjs <route> <route>:solve` and look at the PNGs in
`shots/` (desktop and mobile) for overflow, clipping and broken maths.

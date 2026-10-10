# Maths Practice

Interactive practice pages for Grade 11 Mathematics, Chapter 1 **Algebraic Proofs** — companion to a set of
explainer videos. Each concept page has short key-idea cards, a hands-on explorer, and exercises that check
typed algebra, give hints and show worked solutions. Progress is stored only in the visitor's browser.

**Live site:** https://abadawe-dev.github.io/maths-exercises/

| Concept | Lessons |
|---|---|
| 1 · Binomial & Multinomial Theorems | 1-1, 1-2, 1-3 |
| 2 · Polynomial Division | 1-4, 1-5 |
| 3 · Rational Expressions | 1-6, 1-7, 1-8 |
| 4 · Identities & Proofs | 1-9 – 1-12 |
| 5 · Inequalities | 1-13 – 1-16 |

## Develop

```bash
npm install
npm run dev        # local dev server
npm test           # validates every exercise: TeX, reference answers, option lists
npm run build      # type-check + production build into dist/
npm run shots -- binomial binomial:solve   # full-page screenshots into shots/
```

Static site: Vite + React + TypeScript, KaTeX for typesetting, mathjs for checking answers (typed expressions are
compared with the reference numerically, so any equivalent form is accepted). Hash routing and a relative base
path mean it runs from any GitHub Pages URL. Pushing to `main` deploys via `.github/workflows/deploy.yml`.

## Adding content

Content lives in `src/content/ch01/`: one `cN.tsx` per concept (data, typed by `src/lib/types.ts`) plus
`cN.widgets.tsx` for its interactive explorers. See `CLAUDE.md` for the authoring rules.

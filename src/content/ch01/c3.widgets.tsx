import React, {useEffect, useRef, useState} from 'react';
import {Rich, Tex} from '../../lib/Tex';

// ---------------------------------------------------------------------------------------------
// Shared bits for the three Concept 3 explorers. All extra CSS is scoped with the .c3- prefix.
// ---------------------------------------------------------------------------------------------

const CSS = `
.c3-presets { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 16px; }
.c3-stack { display: grid; gap: 14px; min-width: 0; }
.c3-orig { text-align: center; color: var(--muted); font-size: 0.95rem; overflow-x: auto; overflow-y: hidden; padding: 2px 0; }
.c3-expr { display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 10px 14px; padding: 10px 0 4px; }
.c3-frac { display: inline-flex; flex-direction: column; align-items: stretch; min-width: 0; }
.c3-frac.flipped { animation: c3-flip 0.5s ease-out; }
.c3-chips { display: flex; flex-wrap: wrap; justify-content: center; gap: 6px; min-height: 44px; }
.c3-bar { height: 2px; background: var(--text); border-radius: 2px; margin: 8px 0; }
.c3-op { font-size: 1.5rem; min-width: 22px; text-align: center; }
.c3-chip { position: relative; font: inherit; color: var(--text); background: var(--panel-2); border: 1.5px solid var(--border); border-radius: 12px; padding: 2px 11px; min-height: 44px; min-width: 44px; cursor: pointer; transition: border-color 0.2s, background 0.2s, box-shadow 0.2s; }
.c3-chip:hover:not(:disabled) { border-color: var(--accent); }
.c3-chip.sel { border-color: var(--amber); background: color-mix(in srgb, var(--amber) 18%, transparent); box-shadow: 0 0 0 3px color-mix(in srgb, var(--amber) 22%, transparent); }
.c3-chip.cut { cursor: default; border-style: dashed; background: none; }
.c3-chip.cut > span { opacity: 0.6; }
.c3-chip.cut::after { content: ''; position: absolute; left: -4px; right: -4px; top: 50%; height: 3px; margin-top: -1.5px; border-radius: 3px; background: var(--pink); box-shadow: 0 0 10px color-mix(in srgb, var(--pink) 70%, transparent); transform: rotate(-14deg); animation: c3-strike 0.4s ease-out; }
.c3-chip.bad { border-color: var(--pink); animation: c3-shake 0.4s; }
@keyframes c3-strike { from { clip-path: inset(-8px 100% -8px 0); } to { clip-path: inset(-8px 0 -8px 0); } }
@keyframes c3-shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } }
@keyframes c3-flip { from { transform: rotateX(180deg); opacity: 0.2; } to { transform: rotateX(0); opacity: 1; } }
.c3-msg { border-radius: 12px; padding: 10px 14px; font-size: 0.95rem; border: 1px solid var(--border); background: rgba(0, 0, 0, 0.2); min-height: 48px; overflow-wrap: anywhere; }
.c3-msg.bad { border-color: color-mix(in srgb, var(--pink) 60%, transparent); background: color-mix(in srgb, var(--pink) 9%, transparent); }
.c3-msg.good { border-color: color-mix(in srgb, var(--green) 55%, transparent); background: color-mix(in srgb, var(--green) 8%, transparent); }
.c3-msg.warn { border-color: color-mix(in srgb, var(--amber) 60%, transparent); background: color-mix(in srgb, var(--amber) 9%, transparent); }
.c3-result { text-align: center; animation: pop 0.4s; }
.c3-result .w-big { font-size: 1.45rem; padding: 4px 0; }
.c3-toggle { font: inherit; color: var(--text); background: var(--panel-2); border: 1.5px dashed var(--border); border-radius: 11px; padding: 2px 11px; min-height: 42px; min-width: 44px; cursor: pointer; transition: border-color 0.2s, background 0.2s; }
.c3-toggle:hover { border-color: var(--amber); }
.c3-toggle.on { border-style: solid; border-color: var(--amber); background: color-mix(in srgb, var(--amber) 20%, transparent); }
.c3-cd { display: grid; grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr); gap: 12px; align-items: center; }
.c3-cd .w-panel { text-align: center; }
.c3-cd-from { color: var(--muted); font-size: 0.85rem; display: flex; gap: 8px; align-items: center; justify-content: center; }
.c3-cd-now { font-size: 1.15rem; padding: 8px 0 10px; overflow-x: auto; overflow-y: hidden; }
.c3-times { display: flex; flex-wrap: wrap; gap: 6px; justify-content: center; align-items: center; }
.c3-steps { display: grid; gap: 2px; }
.c3-check { display: grid; gap: 10px; border-top: 1px dashed var(--border); margin-top: 12px; padding-top: 12px; }
.c3-vals { display: grid; grid-template-columns: repeat(auto-fit, minmax(88px, 1fr)); gap: 8px; }
.c3-val { background: rgba(255, 255, 255, 0.04); border: 1px solid var(--border); border-radius: 12px; padding: 8px 6px; text-align: center; min-width: 0; }
.c3-val .w-label { margin-bottom: 2px; }
.c3-val-n { font-size: 1.25rem; min-height: 2.4em; display: grid; place-items: center; font-variant-numeric: tabular-nums; }
.c3-val.undef .c3-val-n { color: var(--pink); font-size: 1rem; }
.c3-val.diff { border-color: var(--pink); }
.c3-val.same { border-color: color-mix(in srgb, var(--green) 55%, transparent); }
.c3-big { font-size: 1.5rem; text-align: center; overflow-x: auto; overflow-y: hidden; padding: 6px 0; }
.c3-choices { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; justify-content: center; }
.c3-choice { font: inherit; color: var(--text); background: var(--panel-2); border: 1.5px solid var(--border); border-radius: 12px; padding: 4px 14px; min-height: 46px; cursor: pointer; transition: border-color 0.2s, background 0.2s; }
.c3-choice:hover { border-color: var(--amber); }
.c3-choice.on { border-color: var(--amber); background: color-mix(in srgb, var(--amber) 20%, transparent); }
.c3-choice small { display: block; color: var(--muted); font-size: 0.75rem; line-height: 1.2; padding-bottom: 3px; }
@media (max-width: 640px) {
  .c3-cd { grid-template-columns: minmax(0, 1fr); }
  .c3-cd > .c3-op { margin: -6px 0; }
  .c3-big { font-size: 1.3rem; }
}
`;
const Styles: React.FC = () => <style>{CSS}</style>;

const AMBER = '#ffc857';
const PINK = '#ff6b9d';
const INK = '#f4f6ff';
const amber = (t: string) => `\\textcolor{${AMBER}}{${t}}`;
const big = (t: string) => t.replaceAll('\\frac', '\\dfrac');
const strike = (t: string) => `\\textcolor{${PINK}}{\\cancel{\\textcolor{${INK}}{${t}}}}`;

/** a / b that is NaN (not ±Infinity) when b is zero, so "undefined" survives later arithmetic. */
const dv = (a: number, b: number) => (Number.isFinite(a) && Number.isFinite(b) && Math.abs(b) > 1e-12 ? a / b : NaN);

/** TeX for a number: an integer or a fraction in lowest terms where possible. */
const numTex = (v: number): string => {
  if (!Number.isFinite(v)) return '';
  for (let d = 1; d <= 5000; d++) {
    const n = Math.round(v * d);
    if (Math.abs(v * d - n) < 1e-9) {
      if (d === 1) return `${n}`;
      return `${n < 0 ? '-' : ''}\\dfrac{${Math.abs(n)}}{${d}}`;
    }
  }
  return v.toFixed(4);
};
const same = (a: number, b: number) => Number.isFinite(a) && Number.isFinite(b) && Math.abs(a - b) < 1e-9;

const Value: React.FC<{label: string; v: number; tone?: 'same' | 'diff'}> = ({label, v, tone}) => (
  <div className={`c3-val ${Number.isFinite(v) ? (tone ?? '') : 'undef'}`}>
    <div className="w-label">{label}</div>
    <div className="c3-val-n">{Number.isFinite(v) ? <Tex tex={numTex(v)} /> : 'undefined'}</div>
  </div>
);

const XSlider: React.FC<{x: number; min: number; max: number; step: number; onChange: (v: number) => void}> = ({x, min, max, step, onChange}) => (
  <div className="w-control">
    <label>
      <span>Try a value of x</span>
      <output>x = {x}</output>
    </label>
    <input type="range" min={min} max={max} step={step} value={x} aria-label="value of x" onChange={(e) => onChange(Number(e.target.value))} />
  </div>
);

// ---------------------------------------------------------------------------------------------
// 1-6 · Cancel the common factor
// ---------------------------------------------------------------------------------------------

type Frac = {top: string[]; bottom: string[]};
type CancelPreset = {
  label: string;
  source: string;
  /** The expression as the textbook prints it. */
  original: string;
  /** The same expression factorised; with `divide`, the second fraction is the divisor. */
  fracs: Frac[];
  divide?: boolean;
  result: string;
  /** Shown with the result. */
  note: string;
  /** Explanations for particular tempting pairs, keyed "a|b" with the two factors sorted. */
  traps?: Record<string, string>;
};

const pairKey = (a: string, b: string) => [a, b].sort().join('|');

const CANCEL: CancelPreset[] = [
  {
    label: 'Numbers and letters',
    source: 'Warm Up 1(a)',
    original: String.raw`\frac{12ab^5}{9a^3b^2}`,
    fracs: [{top: ['3', '4', 'a', 'b^2', 'b^3'], bottom: ['3', '3', 'a', 'a^2', 'b^2']}],
    result: String.raw`\frac{4b^3}{3a^2}`,
    note: 'A 3, an $a$ and a $b^2$ were common to the top and the bottom. What is left cannot be reduced.',
  },
  {
    label: 'Factorise first',
    source: 'Warm Up 1(b)',
    original: String.raw`\frac{x^2-4}{3x^2+7x+2}`,
    fracs: [{top: ['(x+2)', '(x-2)'], bottom: ['(3x+1)', '(x+2)']}],
    result: String.raw`\frac{x-2}{3x+1}`,
    note: 'Before factorising, nothing seemed to cancel. Once the brackets are visible the common factor is easy to see.',
    traps: {
      [pairKey('(x-2)', '(x+2)')]: 'Look at the signs: $(x-2)$ and $(x+2)$ are different factors. At $x=3$ they are $1$ and $5$.',
    },
  },
  {
    label: 'A product',
    source: 'Exercise 2(d)',
    original: String.raw`\frac{x+1}{x^2-4}\times\frac{x^2-2x-8}{x^2+x}`,
    fracs: [
      {top: ['(x+1)'], bottom: ['(x-2)', '(x+2)']},
      {top: ['(x-4)', '(x+2)'], bottom: ['x', '(x+1)']},
    ],
    result: String.raw`\frac{x-4}{x(x-2)}`,
    note: 'In a product, a factor on any top cancels with the same factor on any bottom. Leave the answer in brackets.',
  },
  {
    label: 'A division',
    source: 'Warm Up 2',
    original: String.raw`\frac{x^2-4x-5}{2x^2+5x+2}\div\frac{x^2-x-20}{2x^2-5x-3}`,
    fracs: [
      {top: ['(x+1)', '(x-5)'], bottom: ['(2x+1)', '(x+2)']},
      {top: ['(x-5)', '(x+4)'], bottom: ['(2x+1)', '(x-3)']},
    ],
    divide: true,
    result: String.raw`\frac{(x+1)(x-3)}{(x+2)(x+4)}`,
    note: 'Flip the divisor, factorise, cancel. Do not expand the brackets.',
  },
  {
    label: 'A trap',
    source: 'Common Mistakes',
    original: String.raw`\frac{x^2+6x}{x^2+2x}`,
    fracs: [{top: ['x', '(x+6)'], bottom: ['x', '(x+2)']}],
    result: String.raw`\frac{x+6}{x+2}`,
    note: 'This is irreducible. Tempted to cross out the $x$ in $x+6$ and in $x+2$ as well? Tap those two chips and see.',
    traps: {
      [pairKey('(x+6)', '(x+2)')]:
        'Tempting, but no. Inside $x+6$ and $x+2$ the $x$ is a **term**, joined on with a plus sign, not a factor. Test $x=2$: $\\frac{x+6}{x+2}=\\frac84=2$, but crossing out the $x$’s would give $\\frac62=3$.',
    },
  },
];

type Msg = {tone: '' | 'good' | 'bad' | 'warn'; text: string};
const START: Msg = {tone: '', text: 'Tap a factor on top, then the identical factor underneath, to cancel the pair.'};
const START_DIV: Msg = {tone: '', text: 'This one is a division. What has to happen before anything can be cancelled?'};

export const CancelGame: React.FC = () => {
  const [pi, setPi] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [cut, setCut] = useState<string[]>([]);
  const [sel, setSel] = useState<string | null>(null);
  const [bad, setBad] = useState<string[]>([]);
  const [msg, setMsg] = useState<Msg>(START);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  const p = CANCEL[pi];

  const reset = (i: number) => {
    setPi(i);
    setFlipped(false);
    setCut([]);
    setSel(null);
    setBad([]);
    setMsg(CANCEL[i].divide ? START_DIV : START);
  };

  // A chip is identified by its place in the expression as printed: fraction, row, index.
  type Chip = {id: string; tex: string; onTop: boolean};
  const rows = p.fracs.map((f, fi) => {
    const swap = flipped && fi === 1;
    const mk = (list: string[], row: 't' | 'b'): Chip[] =>
      list.map((tex, i) => ({id: `${fi}${row}${i}`, tex, onTop: (row === 't') !== swap}));
    const t = mk(f.top, 't');
    const b = mk(f.bottom, 'b');
    return swap ? {top: b, bottom: t} : {top: t, bottom: b};
  });
  const chips = rows.flatMap((r) => [...r.top, ...r.bottom]);
  const live = chips.filter((c) => !cut.includes(c.id));
  const ready = !p.divide || flipped;
  const done = ready && !live.some((a) => a.onTop && live.some((b) => !b.onTop && b.tex === a.tex));

  const tap = (c: Chip) => {
    if (cut.includes(c.id)) return;
    if (!ready) {
      setMsg({tone: 'bad', text: 'Not yet: this is a division. You can only cancel across a **multiplication**, so flip the divisor first.'});
      return;
    }
    if (sel === null) {
      setSel(c.id);
      return;
    }
    if (sel === c.id) {
      setSel(null);
      return;
    }
    const first = chips.find((x) => x.id === sel)!;
    if (first.onTop === c.onTop) {
      setSel(c.id);
      setMsg({
        tone: 'warn',
        text: `Both of those are in a ${c.onTop ? 'numerator' : 'denominator'}. Cancelling divides the top and the bottom by the same factor, so pick one from each.`,
      });
      return;
    }
    setSel(null);
    if (first.tex === c.tex) {
      setCut((s) => [...s, first.id, c.id]);
      setMsg({tone: 'good', text: `$${c.tex}\\div ${c.tex}=1$, so the pair cancels.`});
      return;
    }
    setBad([first.id, c.id]);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setBad([]), 450);
    setMsg({
      tone: 'bad',
      text:
        p.traps?.[pairKey(first.tex, c.tex)] ??
        `$${first.tex}$ and $${c.tex}$ are not the same factor, so dividing one by the other does not give 1. Look for an identical pair.`,
    });
  };

  const renderChip = (c: Chip) => {
    const isCut = cut.includes(c.id);
    return (
      <button
        key={c.id}
        type="button"
        className={`c3-chip ${isCut ? 'cut' : ''} ${sel === c.id ? 'sel' : ''} ${bad.includes(c.id) ? 'bad' : ''}`}
        aria-pressed={sel === c.id}
        aria-disabled={isCut}
        aria-label={`${c.onTop ? 'numerator' : 'denominator'} factor ${c.tex}${isCut ? ', cancelled' : ''}`}
        onClick={() => tap(c)}
      >
        <span>
          <Tex tex={c.tex} />
        </span>
      </button>
    );
  };

  return (
    <div className="c3-stack">
      <Styles />
      <div className="c3-presets" role="group" aria-label="Choose an expression">
        {CANCEL.map((c, i) => (
          <button key={c.label} type="button" className={`w-btn ${i === pi ? 'on' : ''}`} onClick={() => reset(i)}>
            {c.label}
          </button>
        ))}
      </div>
      <div className="w-panel">
        <div className="w-label">{p.source} · factorised</div>
        <div className="c3-orig">
          <Tex tex={`${p.original.replaceAll('\\frac', '\\dfrac')}\\;=`} />
        </div>
        <div className="c3-expr">
          {rows.map((r, fi) => (
            <React.Fragment key={fi}>
              {fi > 0 ? (
                <span className="c3-op" aria-label={p.divide && !flipped ? 'divided by' : 'times'}>
                  <Tex tex={p.divide && !flipped ? '\\div' : '\\times'} />
                </span>
              ) : null}
              <div className={`c3-frac ${flipped && fi === 1 ? 'flipped' : ''}`}>
                <div className="c3-chips">{r.top.map(renderChip)}</div>
                <div className="c3-bar" />
                <div className="c3-chips">{r.bottom.map(renderChip)}</div>
              </div>
            </React.Fragment>
          ))}
        </div>
        <div className="w-row" style={{justifyContent: 'center', marginTop: 12}}>
          {p.divide ? (
            <button
              type="button"
              className="w-btn"
              disabled={flipped}
              onClick={() => {
                setFlipped(true);
                setSel(null);
                setMsg({tone: 'good', text: 'Dividing by a fraction is multiplying by its reciprocal. Now cancel the common factors.'});
              }}
            >
              Flip the divisor: ÷ becomes ×
            </button>
          ) : null}
          <button type="button" className="w-btn" onClick={() => reset(pi)}>
            Start again
          </button>
        </div>
      </div>
      <div className={`c3-msg ${msg.tone}`} role="status" aria-live="polite">
        <Rich text={msg.text} />
      </div>
      {done ? (
        <div className="w-panel c3-result">
          <div className="w-label">Nothing more cancels · irreducible</div>
          <div className="w-big">
            <Tex tex={big(p.result)} />
          </div>
          <p className="w-note" style={{marginTop: 6}}>
            <Rich text={p.note} />
          </p>
        </div>
      ) : null}
    </div>
  );
};

// ---------------------------------------------------------------------------------------------
// 1-7 · Common-denominator builder
// ---------------------------------------------------------------------------------------------

type Term = {
  /** Numerator as printed, and as it should look inside a product. */
  num: string;
  numB: string;
  /** Denominator as printed, and as a list of factors. */
  den: string;
  factors: string[];
};
type CDPreset = {
  label: string;
  source: string;
  op: '+' | '-';
  terms: [Term, Term];
  /** Every factor of the least common denominator. */
  lcd: string[];
  numeric?: boolean;
  /** Working shown once the denominators match (TeX lines). */
  steps: string[];
  result: string;
  note: string;
  orig: (x: number) => number;
  res: (x: number) => number;
};

const CD: CDPreset[] = [
  {
    label: 'Numbers',
    source: 'Like numerical fractions',
    op: '+',
    terms: [
      {num: '1', numB: '1', den: '2', factors: ['2']},
      {num: '1', numB: '1', den: '3', factors: ['3']},
    ],
    lcd: ['2', '3'],
    numeric: true,
    steps: [String.raw`\frac{3}{6}+\frac{2}{6}=\frac{3+2}{6}`],
    result: String.raw`\frac{5}{6}`,
    note: 'Not $\\frac25$: adding the tops and adding the bottoms would give less than the $\\frac12$ we started with.',
    orig: () => 1 / 2 + 1 / 3,
    res: () => 5 / 6,
  },
  {
    label: 'Two brackets',
    source: 'Point · first example',
    op: '+',
    terms: [
      {num: '1', numB: '1', den: 'x+1', factors: ['(x+1)']},
      {num: '1', numB: '1', den: 'x-2', factors: ['(x-2)']},
    ],
    lcd: ['(x+1)', '(x-2)'],
    steps: [String.raw`\frac{(x-2)+(x+1)}{(x+1)(x-2)}`],
    result: String.raw`\frac{2x-1}{(x+1)(x-2)}`,
    note: 'The numerator $2x-1$ does not factorise, so nothing can be reduced.',
    orig: (x) => dv(1, x + 1) + dv(1, x - 2),
    res: (x) => dv(2 * x - 1, (x + 1) * (x - 2)),
  },
  {
    label: 'A shared factor',
    source: 'Point · second example',
    op: '+',
    terms: [
      {num: '2', numB: '2', den: 'x^2-x-2', factors: ['(x+1)', '(x-2)']},
      {num: '3', numB: '3', den: 'x^2-5x+6', factors: ['(x-2)', '(x-3)']},
    ],
    lcd: ['(x+1)', '(x-2)', '(x-3)'],
    steps: [String.raw`\frac{2(x-3)+3(x+1)}{(x+1)(x-2)(x-3)}`, String.raw`=\frac{2x-6+3x+3}{(x+1)(x-2)(x-3)}`],
    result: String.raw`\frac{5x-3}{(x+1)(x-2)(x-3)}`,
    note: 'Both denominators already had $(x-2)$, so neither fraction needed it again.',
    orig: (x) => dv(2, x * x - x - 2) + dv(3, x * x - 5 * x + 6),
    res: (x) => dv(5 * x - 3, (x + 1) * (x - 2) * (x - 3)),
  },
  {
    label: 'Warm Up',
    source: 'Warm Up',
    op: '-',
    terms: [
      {num: 'x+4', numB: '(x+4)', den: 'x^2-2x', factors: ['x', '(x-2)']},
      {num: '3', numB: '3', den: 'x^2-3x+2', factors: ['(x-1)', '(x-2)']},
    ],
    lcd: ['x', '(x-1)', '(x-2)'],
    steps: [
      String.raw`\frac{(x+4)(x-1)-3x}{x(x-1)(x-2)}`,
      String.raw`=\frac{x^2-4}{x(x-1)(x-2)}`,
      `=\\frac{${strike('(x-2)')}(x+2)}{x(x-1)${strike('(x-2)')}}`,
    ],
    result: String.raw`\frac{x+2}{x(x-1)}`,
    note: 'Calculate only the numerator, factorise it, reduce, and leave the denominator in brackets.',
    orig: (x) => dv(x + 4, x * x - 2 * x) - dv(3, x * x - 3 * x + 2),
    res: (x) => dv(x + 2, x * (x - 1)),
  },
];

const sortedKey = (list: string[]) => [...list].sort().join(' ');

export const DenominatorBuilder: React.FC = () => {
  const [pi, setPi] = useState(1);
  const [chosen, setChosen] = useState<[string[], string[]]>([[], []]);
  const [x, setX] = useState(3);
  const p = CD[pi];
  const join = p.numeric ? '\\times ' : '\\,';

  const pick = (i: number) => {
    setPi(i);
    setChosen([[], []]);
  };
  const toggle = (ti: 0 | 1, f: string) =>
    setChosen((c) => {
      const next: [string[], string[]] = [[...c[0]], [...c[1]]];
      next[ti] = next[ti].includes(f) ? next[ti].filter((k) => k !== f) : [...next[ti], f];
      return next;
    });

  const dens = [0, 1].map((ti) => [...p.terms[ti].factors, ...chosen[ti]]);
  const touched = chosen[0].length + chosen[1].length > 0;
  const match = sortedKey(dens[0]) === sortedKey(dens[1]);
  const least = match && sortedKey(dens[0]) === sortedKey(p.lcd);
  const extra = match && !least ? dens[0].filter((f, i) => dens[0].indexOf(f) !== i || !p.lcd.includes(f)) : [];

  const termTex = (ti: number) => {
    const t = p.terms[ti];
    const add = chosen[ti].map(amber);
    const top = add.length === 0 ? t.num : [...(t.num === '1' && !p.numeric ? [] : [t.numB]), ...add].join(join);
    const bottom = [...t.factors, ...add].join(join);
    return `\\dfrac{${top}}{${bottom}}`;
  };

  const status: Msg = !touched
    ? {tone: '', text: 'Tap the factor each fraction is missing. Whatever multiplies the bottom must multiply the top as well, so the value does not change.'}
    : !match
      ? {tone: 'warn', text: 'The two denominators are still different. Compare them factor by factor: what does each one lack?'}
      : !least
        ? {
            tone: 'bad',
            text: `The denominators match, but $${[...new Set(extra)].join(',\\ ')}$ was multiplied in without being needed. It would only have to be cancelled again later. Use the **least** common denominator.`,
          }
        : {tone: 'good', text: 'Same denominator. Now the numerators can be combined over it.'};

  const a = p.orig(x);
  const b = p.res(x);

  return (
    <div className="c3-stack">
      <Styles />
      <div className="c3-presets" role="group" aria-label="Choose a sum">
        {CD.map((c, i) => (
          <button key={c.label} type="button" className={`w-btn ${i === pi ? 'on' : ''}`} onClick={() => pick(i)}>
            {c.label}
          </button>
        ))}
      </div>
      <div className="c3-cd">
        {[0, 1].map((ti) => (
          <React.Fragment key={ti}>
            {ti === 1 ? (
              <span className="c3-op">
                <Tex tex={p.op} />
              </span>
            ) : null}
            <div className="w-panel">
              <div className="c3-cd-from">
                <Tex tex={`\\dfrac{${p.terms[ti].num}}{${p.terms[ti].den}}`} /> <span>{p.numeric || p.terms[ti].factors.length < 2 ? 'is' : 'factorised is'}</span>
              </div>
              <div className="c3-cd-now">
                <Tex tex={termTex(ti)} />
              </div>
              <div className="w-label">Multiply top and bottom by</div>
              <div className="c3-times" role="group" aria-label={`Factors to multiply fraction ${ti + 1} by`}>
                {p.lcd.map((f) => (
                  <button
                    key={f}
                    type="button"
                    className={`c3-toggle ${chosen[ti].includes(f) ? 'on' : ''}`}
                    aria-pressed={chosen[ti].includes(f)}
                    onClick={() => toggle(ti as 0 | 1, f)}
                  >
                    <Tex tex={f} />
                  </button>
                ))}
              </div>
            </div>
          </React.Fragment>
        ))}
      </div>
      <div className={`c3-msg ${status.tone}`} role="status" aria-live="polite">
        <Rich text={status.text} />
      </div>
      {least ? (
        <div className="w-panel c3-result">
          <div className="w-label">{p.source} · combine the numerators</div>
          <div className="c3-steps">
            {p.steps.map((s) => (
              <Tex key={s} display tex={s} />
            ))}
          </div>
          <div className="w-big">
            <Tex tex={`=${big(p.result)}`} />
          </div>
          <p className="w-note" style={{marginTop: 6}}>
            <Rich text={p.note} />
          </p>
          <div className="c3-check">
            {p.numeric ? null : <XSlider x={x} min={-4} max={6} step={1} onChange={setX} />}
            <div className="c3-vals">
              <Value label="Original" v={a} tone={same(a, b) ? 'same' : undefined} />
              <Value label="Result" v={b} tone={same(a, b) ? 'same' : undefined} />
            </div>
            <p className="w-note">
              {p.numeric
                ? 'Both are the same number.'
                : same(a, b)
                  ? `At x = ${x} both sides give the same number, as they must.`
                  : !Number.isFinite(a) && Number.isFinite(b)
                    ? `At x = ${x} a denominator of the original is zero, so it is undefined there, although the reduced form gives a number. The two agree wherever the original is defined.`
                    : `At x = ${x} a denominator is zero, so both are undefined.`}
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
};

// ---------------------------------------------------------------------------------------------
// 1-8 · Compound-fraction peeler
// ---------------------------------------------------------------------------------------------

type Verdict = 'good' | 'ok' | 'half' | 'bad' | 'wrong';
type PeelOption = {
  /** What the numerator and denominator are multiplied by (TeX), and an optional small caption. */
  by: string;
  caption?: string;
  /** What the compound fraction becomes (TeX lines). */
  work: string[];
  verdict: Verdict;
  text: string;
  value: (x: number) => number;
};
type PeelPreset = {
  label: string;
  source: string;
  tex: string;
  hasX: boolean;
  simplest: string;
  orig: (x: number) => number;
  res: (x: number) => number;
  options: PeelOption[];
};

const w1 = (x: number) => dv(1, 1 - dv(1, x - 1));
const w2 = (x: number) => dv(dv(1, 1 - x) + dv(1, 1 + x), dv(1, 1 - x) - dv(1, 1 + x));

const PEEL: PeelPreset[] = [
  {
    label: 'Numbers',
    source: 'Why it works',
    tex: String.raw`\dfrac{\;\frac{1}{2}\;}{\frac{3}{4}}`,
    hasX: false,
    simplest: String.raw`\frac{2}{3}`,
    orig: () => 2 / 3,
    res: () => 2 / 3,
    options: [
      {
        by: '2',
        work: [String.raw`\dfrac{\frac12\times2}{\frac34\times2}=\dfrac{1}{\;\frac32\;}`],
        verdict: 'half',
        text: 'The top is clear, but 2 is not enough to clear the quarters underneath. There is still a fraction inside.',
        value: () => 2 / 3,
      },
      {
        by: '4',
        work: [String.raw`\dfrac{\frac12\times4}{\frac34\times4}=\dfrac{2}{3}`],
        verdict: 'good',
        text: '4 is a multiple of both little denominators, so both little fractions vanish. The value is unchanged, because we really multiplied by $\\frac44=1$.',
        value: () => 2 / 3,
      },
      {
        by: '3',
        work: [String.raw`\dfrac{\frac12\times3}{\frac34\times3}=\dfrac{\;\frac32\;}{\frac94}`],
        verdict: 'bad',
        text: 'Still equal to the original, but 3 cancels neither the 2 nor the 4. Nothing has been cleared.',
        value: () => 2 / 3,
      },
      {
        by: '4',
        caption: 'bottom only',
        work: [String.raw`\dfrac{\frac12}{\frac34\times4}=\dfrac{\;\frac12\;}{3}=\dfrac16`],
        verdict: 'wrong',
        text: 'Multiplying only the bottom changes the value: $\\frac16$ is not $\\frac23$. The top and the bottom must be multiplied by the same thing.',
        value: () => 1 / 6,
      },
    ],
  },
  {
    label: 'Warm Up 1',
    source: 'Warm Up 1',
    tex: String.raw`\dfrac{1}{1-\dfrac{1}{x-1}}`,
    hasX: true,
    simplest: String.raw`\frac{x-1}{x-2}`,
    orig: w1,
    res: (x) => dv(x - 1, x - 2),
    options: [
      {
        by: 'x-1',
        work: [String.raw`\dfrac{1\times(x-1)}{\left(1-\frac{1}{x-1}\right)\times(x-1)}`, String.raw`=\dfrac{x-1}{(x-1)-1}=\dfrac{x-1}{x-2}`],
        verdict: 'good',
        text: 'The little denominator is $x-1$, so multiplying by $x-1$ turns the little fraction into 1. Notice that the plain 1 underneath is multiplied too.',
        value: w1,
      },
      {
        by: 'x',
        work: [String.raw`\dfrac{1\times x}{\left(1-\frac{1}{x-1}\right)\times x}=\dfrac{x}{x-\dfrac{x}{x-1}}`],
        verdict: 'bad',
        text: 'Still equal to the original, but $x$ does not cancel with $x-1$, so the little fraction is still there.',
        value: w1,
      },
      {
        by: 'x(x-1)',
        work: [String.raw`\dfrac{x(x-1)}{x(x-1)-x}=\dfrac{x(x-1)}{x(x-2)}`, String.raw`=\dfrac{x-1}{x-2}`],
        verdict: 'ok',
        text: 'This clears the little fraction, but the extra $x$ was not needed and has to be cancelled again. Multiply by just enough.',
        value: w1,
      },
      {
        by: 'x-1',
        caption: 'bottom only',
        work: [String.raw`\dfrac{1}{\left(1-\frac{1}{x-1}\right)\times(x-1)}=\dfrac{1}{x-2}`],
        verdict: 'wrong',
        text: 'The little fraction has gone, but so has the original value: the numerator was not multiplied. Compare the numbers below.',
        value: (x) => (x === 1 ? NaN : dv(1, x - 2)),
      },
    ],
  },
  {
    label: 'Warm Up 2',
    source: 'Warm Up 2',
    tex: String.raw`\dfrac{\dfrac{1}{1-x}+\dfrac{1}{1+x}}{\dfrac{1}{1-x}-\dfrac{1}{1+x}}`,
    hasX: true,
    simplest: String.raw`\frac{1}{x}`,
    orig: w2,
    res: (x) => dv(1, x),
    options: [
      {
        by: '1-x',
        work: [String.raw`\dfrac{1+\dfrac{1-x}{1+x}}{1-\dfrac{1-x}{1+x}}`],
        verdict: 'half',
        text: 'Half done: the fractions over $1-x$ have gone, but the ones over $1+x$ are still there.',
        value: w2,
      },
      {
        by: '(1-x)(1+x)',
        work: [String.raw`\dfrac{(1+x)+(1-x)}{(1+x)-(1-x)}`, String.raw`=\dfrac{2}{2x}=\dfrac{1}{x}`],
        verdict: 'good',
        text: 'Each little fraction cancels one bracket and leaves the other behind. On top the $x$’s cancel; underneath the 1’s cancel.',
        value: w2,
      },
      {
        by: 'x',
        work: [String.raw`\dfrac{\dfrac{x}{1-x}+\dfrac{x}{1+x}}{\dfrac{x}{1-x}-\dfrac{x}{1+x}}`],
        verdict: 'bad',
        text: 'Still equal to the original, but $x$ cancels with neither $1-x$ nor $1+x$. All four little fractions are still there.',
        value: w2,
      },
    ],
  },
];

const VERDICT: Record<Verdict, {tone: Msg['tone']; title: string}> = {
  good: {tone: 'good', title: 'That clears every little fraction.'},
  ok: {tone: 'warn', title: 'It works, but it is more than you need.'},
  half: {tone: 'warn', title: 'Only partly cleared.'},
  bad: {tone: 'bad', title: 'Nothing is cleared.'},
  wrong: {tone: 'bad', title: 'The value has changed!'},
};

export const CompoundPeeler: React.FC = () => {
  const [pi, setPi] = useState(1);
  const [oi, setOi] = useState<number | null>(null);
  const [x, setX] = useState(3);
  const p = PEEL[pi];
  const o = oi === null ? null : p.options[oi];
  const a = p.orig(x);
  const mine = o ? o.value(x) : NaN;
  const b = p.res(x);

  return (
    <div className="c3-stack">
      <Styles />
      <div className="c3-presets" role="group" aria-label="Choose a compound fraction">
        {PEEL.map((c, i) => (
          <button
            key={c.label}
            type="button"
            className={`w-btn ${i === pi ? 'on' : ''}`}
            onClick={() => {
              setPi(i);
              setOi(null);
            }}
          >
            {c.label}
          </button>
        ))}
      </div>
      <div className="w-grid">
        <div className="c3-stack">
          <div className="w-panel">
            <div className="w-label">{p.source} · compound fraction</div>
            <div className="c3-big">
              <Tex tex={p.tex} />
            </div>
          </div>
          <div>
            <div className="w-label" style={{textAlign: 'center'}}>
              Multiply the numerator and the denominator by
            </div>
            <div className="c3-choices" role="group" aria-label="Choose a multiplier">
              {p.options.map((opt, i) => (
                <button key={i} type="button" className={`c3-choice ${oi === i ? 'on' : ''}`} aria-pressed={oi === i} onClick={() => setOi(i)}>
                  <Tex tex={`\\times\\,${opt.caption ? opt.by : amber(opt.by)}`} />
                  {opt.caption ? <small>{opt.caption}</small> : null}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="c3-stack">
          {o ? (
            <>
              <div className="w-panel" key={`${pi}-${oi}`} style={{animation: 'pop 0.35s'}}>
                <div className="w-label">It becomes</div>
                <div className="c3-steps">
                  {o.work.map((s) => (
                    <Tex key={s} display tex={s} />
                  ))}
                </div>
              </div>
              <div className={`c3-msg ${VERDICT[o.verdict].tone}`} role="status" aria-live="polite">
                <strong>{VERDICT[o.verdict].title}</strong> <Rich text={o.text} />
              </div>
            </>
          ) : (
            <div className="c3-msg" role="status">
              Choose a multiplier and see what it does to the little fractions. A good choice clears all of them at once.
            </div>
          )}
        </div>
      </div>
      <div className="w-panel">
        <div className="w-label">Check with numbers</div>
        {p.hasX ? <XSlider x={x} min={-3} max={4} step={0.5} onChange={setX} /> : null}
        <div className="c3-vals" style={{marginTop: 8}}>
          <Value label="Original" v={a} />
          {o ? <Value label="Your choice" v={mine} tone={same(a, mine) ? 'same' : Number.isFinite(a) ? 'diff' : undefined} /> : null}
          <Value label="Simplest form" v={b} tone={same(a, b) ? 'same' : undefined} />
        </div>
        <p className="w-note" style={{marginTop: 8}}>
          <Rich
            text={
              !Number.isFinite(a) && Number.isFinite(b)
                ? `At $x=${x}$ one of the denominators inside the original is zero, so the original is undefined, even though $${p.simplest}$ gives a number there. The two agree wherever the original is defined.`
                : !Number.isFinite(a)
                  ? `At $x=${x}$ a denominator is zero: undefined.`
                  : o && !same(a, mine)
                    ? 'Your version gives a different number, so it is not the same expression any more.'
                    : `The simplest form is $${p.simplest}$. Multiplying top and bottom by the same expression never changes the value.`
            }
          />
        </p>
      </div>
    </div>
  );
};

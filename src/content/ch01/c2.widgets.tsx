import React, {useMemo, useState} from 'react';
import {Tex} from '../../lib/Tex';

// ---------------------------------------------------------------------------------------
// Exact arithmetic: fractions and polynomials in x (index = power of x).
// ---------------------------------------------------------------------------------------
type Fr = {n: number; d: number};
const gcd = (a: number, b: number) => {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) [a, b] = [b, a % b];
  return a || 1;
};
const fr = (n: number, d = 1): Fr => {
  if (d < 0) {
    n = -n;
    d = -d;
  }
  const g = gcd(n, d);
  return {n: n / g, d: d / g};
};
const ZERO = fr(0);
const fSub = (a: Fr, b: Fr) => fr(a.n * b.d - b.n * a.d, a.d * b.d);
const fAdd = (a: Fr, b: Fr) => fr(a.n * b.d + b.n * a.d, a.d * b.d);
const fMul = (a: Fr, b: Fr) => fr(a.n * b.n, a.d * b.d);
const fDiv = (a: Fr, b: Fr) => fr(a.n * b.d, a.d * b.n);

type Poly = Fr[];
const trim = (p: Poly): Poly => {
  const q = p.slice();
  while (q.length && q[q.length - 1].n === 0) q.pop();
  return q;
};
const deg = (p: Poly) => trim(p).length - 1; // -1 for the zero polynomial
const co = (p: Poly, i: number): Fr => p[i] ?? ZERO;
const combine = (a: Poly, b: Poly, f: (x: Fr, y: Fr) => Fr): Poly =>
  trim(Array.from({length: Math.max(a.length, b.length)}, (_, i) => f(co(a, i), co(b, i))));
const pAdd = (a: Poly, b: Poly) => combine(a, b, fAdd);
const pSub = (a: Poly, b: Poly) => combine(a, b, fSub);
/** p × c·x^k */
const pMulTerm = (p: Poly, c: Fr, k: number): Poly =>
  c.n === 0 ? [] : trim([...Array.from({length: k}, () => ZERO), ...p.map((v) => fMul(v, c))]);
const pMul = (a: Poly, b: Poly): Poly => b.reduce<Poly>((s, c, k) => pAdd(s, pMulTerm(a, c, k)), []);
const divmod = (a: Poly, b: Poly): {q: Poly; r: Poly} => {
  let r = trim(a);
  let q: Poly = [];
  const db = deg(b);
  while (deg(r) >= db) {
    const k = deg(r) - db;
    const c = fDiv(r[deg(r)], b[db]);
    q = pAdd(q, pMulTerm([fr(1)], c, k));
    r = pSub(r, pMulTerm(b, c, k));
  }
  return {q, r};
};

/** Highest power first, as typed in the coefficient boxes. */
const fromBoxes = (boxes: string[]): Poly =>
  trim(
    boxes
      .map((s) => {
        const t = s.replace(/[−–]/g, '-').trim();
        return /^-?\d{1,3}$/.test(t) ? fr(parseInt(t, 10)) : ZERO;
      })
      .reverse(),
  );

// ---------------------------------------------------------------------------------------
// TeX helpers
// ---------------------------------------------------------------------------------------
const xPow = (p: number) => (p === 0 ? '' : p === 1 ? 'x' : `x^{${p}}`);
const magTex = (c: Fr, p: number) => {
  const an = Math.abs(c.n);
  const num = c.d === 1 ? (an === 1 && p > 0 ? '' : `${an}`) : `\\tfrac{${an}}{${c.d}}`;
  return num + xPow(p);
};
/** One signed term. `lead` drops the plus sign; otherwise the sign gets binary-operator spacing. */
const termTex = (c: Fr, p: number, lead = true) =>
  c.n === 0 ? '0' : (c.n < 0 ? (lead ? '-' : '{}-') : lead ? '' : '{}+') + magTex(c, p);
const polyTex = (p: Poly) => {
  const t = trim(p);
  if (!t.length) return '0';
  let out = '';
  for (let i = t.length - 1; i >= 0; i--) {
    if (t[i].n === 0) continue;
    out += (t[i].n < 0 ? '-' : out ? '+' : '') + magTex(t[i], i);
  }
  return out;
};
const bracket = (tex: string) => (tex.startsWith('-') ? `(${tex})` : tex);
const colName = (p: number) => (p === 0 ? 'constant' : p === 1 ? 'x' : `x${'⁰¹²³⁴⁵⁶⁷⁸'[p] ?? '^' + p}`);

const HEX = {A: '#5ee6ff', B: '#ff6b9d', Q: '#ffc857', R: '#7cf29c'};
const tc = (role: keyof typeof HEX, tex: string) => `\\textcolor{${HEX[role]}}{${tex}}`;

// ---------------------------------------------------------------------------------------
// Shared styles (scoped with the c2- prefix)
// ---------------------------------------------------------------------------------------
const CSS = `
.c2-A { color: var(--cyan); } .c2-B { color: var(--pink); } .c2-Q { color: var(--amber); } .c2-R { color: var(--green); }
.c2-stage { display: grid; gap: 18px; grid-template-columns: minmax(0, 1fr); align-items: start; }
@media (min-width: 860px) {
  .c2-stage { grid-template-columns: minmax(0, 1.12fr) minmax(0, 1fr); }
  .c2-stage > .c2-side { order: 2; }
}
.c2-side { display: grid; gap: 14px; min-width: 0; }
.c2-work { min-width: 0; overflow-x: auto; padding: 18px 14px 20px; background: rgba(0,0,0,0.28); border: 1px solid var(--border); border-radius: 16px; }
.c2-ld { display: grid; width: max-content; margin: 0 auto; font-size: 1.02rem; }
.c2-cell { padding: 5px 7px; min-width: 3.1em; text-align: right; white-space: nowrap; border-radius: 7px; transition: background 0.25s, color 0.25s; }
.c2-cell.c2-top { border-top: 2px solid rgba(255,255,255,0.75); border-radius: 0; }
.c2-cell.c2-first { border-left: 2px solid rgba(255,255,255,0.75); border-top-left-radius: 2px; border-bottom-left-radius: 12px; padding-left: 10px; }
.c2-cell.c2-under { border-bottom: 1.5px solid rgba(255,255,255,0.6); border-radius: 0; }
.c2-cell.c2-sum { border-top: 1.5px solid rgba(255,255,255,0.6); border-radius: 0; }
.c2-cell.c2-hot { background: color-mix(in srgb, var(--accent) 22%, transparent); }
.c2-cell.c2-dim { color: var(--muted); }
.c2-divisor { display: flex; justify-content: flex-end; align-items: baseline; padding: 5px 10px 5px 0; white-space: nowrap; color: var(--pink); }
.c2-divisor > span { border-radius: 7px; padding: 0 1px; transition: background 0.25s; }
.c2-divisor > span.c2-hot { background: color-mix(in srgb, var(--pink) 24%, transparent); }
.c2-minus { text-align: right; padding: 5px 10px 5px 0; color: var(--muted); }
.c2-gap { display: inline-block; width: 1.5em; height: 1.1em; vertical-align: middle; border: 1.5px dashed rgba(255,255,255,0.28); border-radius: 6px; }
.c2-rowlabel { text-align: right; padding: 5px 12px 5px 0; white-space: nowrap; }
.c2-moves { display: flex; flex-wrap: wrap; gap: 6px; }
.c2-move { font-family: var(--head); font-size: 0.72rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted); border: 1.5px solid var(--border); border-radius: 999px; padding: 3px 10px; transition: all 0.25s; }
.c2-move.on { color: var(--bg0); background: var(--accent); border-color: var(--accent); }
.c2-explain { min-height: 9.5em; }
.c2-explain p + p, .c2-explain p + div, .c2-explain div + p { margin-top: 6px; }
.c2-explain .katex-display { margin: 0.35em 0; }
.c2-editor { display: flex; flex-wrap: wrap; align-items: center; gap: 6px 4px; }
.c2-editor-name { min-width: 5.6em; font-size: 0.92rem; color: var(--muted); }
.c2-box { display: inline-flex; align-items: center; gap: 3px; margin-right: 4px; }
.c2-box input { width: 46px; height: 38px; text-align: center; font: 600 1rem ui-monospace, 'JetBrains Mono', Menlo, monospace; color: inherit; background: rgba(0,0,0,0.3); border: 1.5px solid color-mix(in srgb, currentColor 45%, transparent); border-radius: 10px; outline: 0; }
.c2-box input:focus-visible { border-color: currentColor; box-shadow: 0 0 0 3px color-mix(in srgb, currentColor 22%, transparent); }
.c2-result { display: flex; flex-wrap: wrap; gap: 10px 26px; align-items: baseline; }
.c2-result .w-big { font-size: 1.45rem; }
.c2-flag { border-radius: 14px; padding: 12px 16px; border: 1.5px solid; }
.c2-flag.ok { border-color: color-mix(in srgb, var(--green) 60%, transparent); background: rgba(124, 242, 156, 0.08); }
.c2-flag.bad { border-color: color-mix(in srgb, var(--wrong) 70%, transparent); background: rgba(255, 122, 138, 0.09); }
.c2-flag strong.ok { color: var(--green); } .c2-flag strong.bad { color: var(--wrong); }
.c2-degs { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; margin-bottom: 8px; font-family: var(--head); font-weight: 700; }
.c2-deg { border: 1.5px solid currentColor; border-radius: 10px; padding: 2px 10px; font-size: 0.9rem; }
@media (max-width: 640px) {
  .c2-ld { font-size: 0.8rem; }
  .c2-cell { min-width: 2.2em; padding: 4px 3px; }
  .c2-cell.c2-first { padding-left: 6px; }
  .c2-editor-name { flex-basis: 100%; }
  .c2-check .katex { font-size: 0.95em; }
  .c2-work { padding: 14px 8px 16px; }
  .c2-divisor, .c2-minus { padding-right: 6px; }
  .c2-rowlabel { padding-right: 6px; }
  .c2-box input { width: 42px; }
}
`;
const Style: React.FC = () => <style>{CSS}</style>;

/** A row of small integer boxes: [2]x³ + [−5]x² + … */
const CoefEditor: React.FC<{
  name: string;
  letter: string;
  role: keyof typeof HEX;
  boxes: string[];
  onChange: (boxes: string[]) => void;
}> = ({name, letter, role, boxes, onChange}) => (
  <div className={`c2-editor c2-${role}`}>
    <span className="c2-editor-name">
      {name} <Tex tex={`${letter}=`} />
    </span>
    {boxes.map((v, i) => {
      const p = boxes.length - 1 - i;
      return (
        <span className="c2-box" key={i}>
          <input
            value={v}
            inputMode="text"
            autoComplete="off"
            maxLength={4}
            aria-label={`${name}: ${p === 0 ? 'constant term' : `coefficient of ${colName(p)}`}`}
            onFocus={(e) => e.target.select()}
            onChange={(e) => onChange(boxes.map((b, j) => (j === i ? e.target.value.replace(/[^0-9\-−]/g, '') : b)))}
          />
          <Tex tex={`${xPow(p)}${p > 0 ? '\\,+' : ''}`} />
        </span>
      );
    })}
  </div>
);

// ---------------------------------------------------------------------------------------
// 1-4 · Long-division stepper
// ---------------------------------------------------------------------------------------
type Iter = {
  d: number; // degree of what we are dividing into at this round
  before: Poly;
  qc: Fr;
  qp: number;
  prod: Poly;
  after: Poly;
  lowSub: number; // lowest power in play straight after subtracting
  lowBring: number; // lowest power in play after bringing down
  brought: number[]; // powers (non-zero terms) that come down
};
type Move =
  | {kind: 'setup'}
  | {kind: 'done'}
  | {kind: 'divide'; it: number}
  | {kind: 'multiply'; it: number}
  | {kind: 'subtract'; it: number}
  | {kind: 'bring'; it: number};

const plan = (A: Poly, B: Poly) => {
  const db = deg(B);
  const iters: Iter[] = [];
  const moves: Move[] = [{kind: 'setup'}];
  let r = trim(A);
  while (db >= 0 && deg(r) >= db) {
    const d = deg(r);
    const qp = d - db;
    const qc = fDiv(r[d], B[db]);
    const prod = pMulTerm(B, qc, qp);
    const after = pSub(r, prod);
    const lowSub = qp;
    const lowBring = deg(after) >= db ? deg(after) - db : 0;
    const brought: number[] = [];
    for (let p = lowSub - 1; p >= lowBring; p--) if (co(after, p).n !== 0) brought.push(p);
    const it = iters.length;
    iters.push({d, before: r, qc, qp, prod, after, lowSub, lowBring, brought});
    moves.push({kind: 'divide', it}, {kind: 'multiply', it}, {kind: 'subtract', it});
    if (brought.length) moves.push({kind: 'bring', it});
    r = after;
  }
  moves.push({kind: 'done'});
  const Q = iters.reduce<Poly>((s, t) => pAdd(s, pMulTerm([fr(1)], t.qc, t.qp)), []);
  return {iters, moves, Q, R: r};
};

type Preset = {name: string; a: number[]; b: number[]};
const DIV_PRESETS: Preset[] = [
  {name: 'Textbook Warm Up 1', a: [0, 2, -5, 0, -2], b: [2, -1, -1]},
  {name: 'Lesson 1-5 Warm Up 2', a: [0, 4, 0, 7, -24], b: [0, 2, -3]},
  {name: 'Missing x²', a: [0, 1, 0, -3, 5], b: [0, 1, 2]},
  {name: 'Three gaps', a: [1, 0, 0, 0, -1], b: [1, 1, 1]},
  {name: 'Fractions appear', a: [0, 1, 0, 2, 1], b: [0, 2, -1]},
];
const MOVE_NAMES = ['divide', 'multiply', 'subtract', 'bring'] as const;
const MOVE_LABEL = {divide: 'Divide', multiply: 'Multiply', subtract: 'Subtract', bring: 'Bring down'} as const;

export const LongDivisionStepper: React.FC = () => {
  const [aBoxes, setABoxes] = useState(DIV_PRESETS[0].a.map(String));
  const [bBoxes, setBBoxes] = useState(DIV_PRESETS[0].b.map(String));
  const [step, setStep] = useState(0);
  const A = useMemo(() => fromBoxes(aBoxes), [aBoxes]);
  const B = useMemo(() => fromBoxes(bBoxes), [bBoxes]);
  const {iters, moves, Q, R} = useMemo(() => plan(A, B), [A, B]);
  const dA = deg(A);
  const dB = deg(B);
  const n = Math.max(dA, 0);
  const s = Math.min(step, moves.length - 1);
  const move = moves[s];
  const finished = move.kind === 'done';
  const preset = DIV_PRESETS.findIndex((p) => p.a.join() === aBoxes.join() && p.b.join() === bBoxes.join());

  // how far each round has got: 0 nothing, 1 quotient term, 2 product, 3 difference, 4 brought down
  const stage = iters.map((_, i) => {
    let st = 0;
    for (let k = 1; k <= s; k++) {
      const m = moves[k];
      if (m.kind === 'done') st = 4;
      else if (m.kind !== 'setup' && m.it === i) st = MOVE_NAMES.indexOf(m.kind) + 1;
    }
    return st;
  });

  const hot = new Set<string>();
  if (move.kind !== 'setup' && move.kind !== 'done') {
    const t = iters[move.it];
    const src = move.it === 0 ? 'A' : `D${move.it - 1}`;
    if (move.kind === 'divide') [`${src}:${t.d}`, `Q:${t.qp}`, 'B:lead'].forEach((k) => hot.add(k));
    if (move.kind === 'multiply') {
      hot.add(`Q:${t.qp}`);
      hot.add('B:all');
      for (let p = t.d; p >= t.lowSub; p--) hot.add(`P${move.it}:${p}`);
    }
    if (move.kind === 'subtract') for (let p = t.d; p >= t.lowSub; p--) hot.add(`D${move.it}:${p}`);
    if (move.kind === 'bring') t.brought.forEach((p) => [`D${move.it}:${p}`, `A:${p}`].forEach((k) => hot.add(k)));
  }

  const col = (p: number) => 2 + (n - p);
  const cells: React.ReactNode[] = [];
  const cell = (key: string, row: number, p: number, tex: string | null, cls = '') =>
    cells.push(
      <div key={key} className={`c2-cell ${cls} ${hot.has(key) ? 'c2-hot' : ''}`} style={{gridRow: row, gridColumn: col(p)}}>
        {tex === null ? <span className="c2-gap" title="gap for a missing power" /> : tex ? <Tex tex={tex} /> : null}
      </div>,
    );
  // quotient row
  iters.forEach((t, i) => {
    if (stage[i] >= 1) cell(`Q:${t.qp}`, 1, t.qp, termTex(t.qc, t.qp, i === 0), 'c2-Q');
  });
  // dividend row (with the bracket)
  for (let p = n; p >= 0; p--) {
    const c = co(A, p);
    const tex = dA < 0 ? (p === 0 ? '0' : '') : c.n === 0 ? null : termTex(c, p, p === dA);
    cell(`A:${p}`, 2, p, tex, `c2-A c2-top ${p === n ? 'c2-first' : ''}`);
  }
  // working rows
  iters.forEach((t, i) => {
    const rowP = 3 + 2 * i;
    if (stage[i] >= 2) {
      cells.push(
        <div key={`m${i}`} className="c2-minus" style={{gridRow: rowP, gridColumn: col(t.d) - 1}} aria-hidden>
          −
        </div>,
      );
      let lead = true;
      for (let p = t.d; p >= t.lowSub; p--) {
        const c = co(t.prod, p);
        cell(`P${i}:${p}`, rowP, p, c.n === 0 ? '' : termTex(c, p, lead), 'c2-under c2-dim');
        if (c.n !== 0) lead = false;
      }
    }
    if (stage[i] >= 3) {
      const low = stage[i] >= 4 || !t.brought.length ? t.lowBring : t.lowSub;
      const isRemainder = finished && i === iters.length - 1;
      let lead = true;
      let any = false;
      for (let p = t.d; p >= low; p--) {
        const c = co(t.after, p);
        if (c.n !== 0) any = true;
        const tex = c.n !== 0 ? termTex(c, p, lead) : p === low && !any ? '0' : '';
        cell(`D${i}:${p}`, rowP + 1, p, tex, isRemainder ? 'c2-R' : '');
        if (c.n !== 0) lead = false;
      }
    }
  });

  // divisor, term by term so its leading term can light up
  const divisorTerms = dB < 0 ? [<span key="z">0</span>] : [];
  for (let p = dB; p >= 0; p--) {
    if (co(B, p).n === 0) continue;
    const on = hot.has('B:all') || (hot.has('B:lead') && p === dB);
    divisorTerms.push(
      <span key={p} className={on ? 'c2-hot' : ''}>
        <Tex tex={termTex(co(B, p), p, p === dB)} />
      </span>,
    );
  }

  const load = (p: Preset) => {
    setABoxes(p.a.map(String));
    setBBoxes(p.b.map(String));
    setStep(0);
  };

  const gaps: number[] = [];
  for (let p = dA - 1; p >= 0; p--) if (co(A, p).n === 0) gaps.push(p);

  let explain: React.ReactNode;
  if (dB < 0) {
    explain = <p>The divisor is 0, and nothing can be divided by 0. Give the divisor at least one non-zero coefficient.</p>;
  } else if (move.kind === 'setup') {
    explain = (
      <>
        <p>
          <strong>Set out the division.</strong> The <span className="c2-A">dividend</span> goes inside, the{' '}
          <span className="c2-B">divisor</span> outside, both in descending powers of <Tex tex="x" />.
        </p>
        {gaps.length ? (
          <p>
            The dividend has no {gaps.map((g, i) => (
              <React.Fragment key={g}>
                {i ? (i === gaps.length - 1 ? ' or ' : ', ') : ''}
                {g === 0 ? 'constant' : <Tex tex={xPow(g)} />}
              </React.Fragment>
            ))}{' '}
            term, so {gaps.length > 1 ? 'gaps are' : 'a gap is'} left to keep every power in its own column.
          </p>
        ) : (
          <p>Every power has its own column. Press “Next step” to begin.</p>
        )}
      </>
    );
  } else if (move.kind === 'done') {
    const dR = deg(R);
    explain = (
      <>
        <p>
          <strong>Stop.</strong>{' '}
          {!iters.length ? (
            <>The dividend already has a lower degree than the divisor, so there is nothing to divide: the quotient is 0 and the whole dividend is the remainder.</>
          ) : dR < 0 ? (
            <>Nothing is left, so the remainder is 0 and the division is exact.</>
          ) : (
            <>
              What is left has degree {dR}, lower than the divisor’s degree {dB}, so it cannot be divided any further. It is the{' '}
              <span className="c2-R">remainder</span>.
            </>
          )}
        </p>
        <p className="w-note">Check with A = B × Q + R:</p>
        <div className="c2-check">
          <Tex
            display
            tex={`\\begin{aligned}${tc('A', polyTex(A))}&=${tc('B', `(${polyTex(B)})`)}${(polyTex(A) + polyTex(B) + polyTex(Q)).length > 40 ? '\\\\&\\quad{}\\times' : ''}${tc('Q', `(${polyTex(Q)})`)}${dR < 0 ? '' : `\\\\&\\quad{}+${tc('R', `(${polyTex(R)})`)}`}\\end{aligned}`}
          />
        </div>
      </>
    );
  } else {
    const t = iters[move.it];
    const q = termTex(t.qc, t.qp);
    if (move.kind === 'divide') {
      explain = (
        <>
          <p>
            <strong>Divide</strong> the leading terms only.
          </p>
          <Tex display tex={`${bracket(termTex(co(t.before, t.d), t.d))}\\div ${bracket(termTex(co(B, dB), dB))}=${tc('Q', q)}`} />
          <p>
            Write <Tex tex={tc('Q', q)} /> on top, in the {colName(t.qp)} column.
          </p>
        </>
      );
    } else if (move.kind === 'multiply') {
      explain = (
        <>
          <p>
            <strong>Multiply</strong> the whole divisor by <Tex tex={tc('Q', q)} />, every term of it.
          </p>
          <Tex display tex={`${tc('Q', q)}\\,${tc('B', `(${polyTex(B)})`)}=${polyTex(t.prod)}`} />
          <p>Write the result underneath, each term in its matching column.</p>
        </>
      );
    } else if (move.kind === 'subtract') {
      const lines: string[] = [];
      for (let p = t.d; p >= t.lowSub; p--) {
        const a = co(t.before, p);
        const b = co(t.prod, p);
        if (a.n === 0 && b.n === 0) continue;
        lines.push(`${a.n === 0 ? '0' : termTex(a, p)}-${bracket(termTex(b, p))}&=${termTex(co(t.after, p), p)}`);
      }
      explain = (
        <>
          <p>
            <strong>Subtract</strong> column by column. Taking away a negative term means adding it.
          </p>
          <Tex display tex={`\\begin{aligned}${lines.join('\\\\')}\\end{aligned}`} />
          <p className="w-note">The leading terms cancel, which was the whole point.</p>
        </>
      );
    } else {
      const down = t.brought.map((p) => termTex(co(t.after, p), p)).join(',\\;');
      const next = iters[move.it + 1];
      explain = (
        <>
          <p>
            <strong>Bring down</strong> <Tex tex={down} /> from the dividend.
          </p>
          <p>
            {next ? (
              <>
                Now divide into <Tex tex={polyTex(t.after.map((c, p) => (p >= t.lowBring ? c : ZERO)))} /> and repeat.
              </>
            ) : (
              <>Everything from the dividend has now been used.</>
            )}
          </p>
        </>
      );
    }
  }

  return (
    <div style={{display: 'grid', gap: 16}}>
      <Style />
      <div className="w-row" role="group" aria-label="Example divisions" style={{gap: 8}}>
        {DIV_PRESETS.map((p, i) => (
          <button key={p.name} type="button" className={`w-btn ${preset === i ? 'on' : ''}`} onClick={() => load(p)}>
            {p.name}
          </button>
        ))}
      </div>
      <div style={{display: 'grid', gap: 10}}>
        <CoefEditor name="Dividend" letter="A" role="A" boxes={aBoxes} onChange={(v) => (setABoxes(v), setStep(0))} />
        <CoefEditor name="Divisor" letter="B" role="B" boxes={bBoxes} onChange={(v) => (setBBoxes(v), setStep(0))} />
        <p className="w-note">Or type your own whole-number coefficients (0 for a missing power).</p>
      </div>
      <div className="c2-stage">
        <div className="c2-side">
          <div className="c2-moves" aria-hidden>
            {MOVE_NAMES.map((m) => (
              <span key={m} className={`c2-move ${move.kind === m ? 'on' : ''}`}>
                {MOVE_LABEL[m]}
              </span>
            ))}
          </div>
          <div className="w-row" style={{gap: 8}}>
            <button type="button" className="w-btn" disabled={s === 0} onClick={() => setStep(s - 1)}>
              ← Back
            </button>
            <button type="button" className="w-btn on" disabled={finished || dB < 0} onClick={() => setStep(s + 1)}>
              Next step →
            </button>
            <button type="button" className="w-btn" disabled={s === 0} onClick={() => setStep(0)}>
              Reset
            </button>
            <span className="w-note" style={{marginLeft: 'auto'}}>
              {s} / {moves.length - 1}
            </span>
          </div>
          <div className="w-panel c2-explain" aria-live="polite">
            {explain}
          </div>
          {finished && dB >= 0 ? (
            <div className="w-panel c2-result">
              <div>
                <div className="w-label">Quotient</div>
                <span className="w-big c2-Q" data-testid="c2-quotient">
                  <Tex tex={polyTex(Q)} />
                </span>
              </div>
              <div>
                <div className="w-label">Remainder</div>
                <span className="w-big c2-R" data-testid="c2-remainder">
                  <Tex tex={polyTex(R)} />
                </span>
              </div>
            </div>
          ) : null}
        </div>
        <div className="c2-work">
          <div className="c2-ld" role="img" aria-label={`Long division working, step ${s} of ${moves.length - 1}`}>
            <div className="c2-divisor" style={{gridRow: 2, gridColumn: 1}}>
              {divisorTerms}
            </div>
            {cells}
          </div>
        </div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------------------
// 1-5 · A = B × Q + R builder
// ---------------------------------------------------------------------------------------
type BQR = {name: string; b: number[]; q: number[]; r: number[]};
const BQR_PRESETS: BQR[] = [
  {name: 'Textbook Warm Up 1', b: [1, -2, -1], q: [0, 1, 3], r: [0, -2, 5]},
  {name: 'Check a division', b: [2, -1, -1], q: [0, 1, -2], r: [0, -1, -4]},
  {name: 'Exact (R = 0)', b: [0, 2, -3], q: [2, 3, 8], r: [0, 0, 0]},
  {name: 'Stopped too early', b: [1, 2, -3], q: [0, 1, 0], r: [-2, -4, 6]},
];

export const QuotientRemainderBuilder: React.FC = () => {
  const [bBoxes, setB] = useState(BQR_PRESETS[0].b.map(String));
  const [qBoxes, setQ] = useState(BQR_PRESETS[0].q.map(String));
  const [rBoxes, setR] = useState(BQR_PRESETS[0].r.map(String));
  const B = useMemo(() => fromBoxes(bBoxes), [bBoxes]);
  const Q = useMemo(() => fromBoxes(qBoxes), [qBoxes]);
  const R = useMemo(() => fromBoxes(rBoxes), [rBoxes]);
  const A = pAdd(pMul(B, Q), R);
  const dB = deg(B);
  const dR = deg(R);
  const ok = dB >= 0 && dR < dB;
  const fixed = dB >= 0 && !ok ? divmod(A, B) : null;
  const n = Math.max(deg(A), deg(pMul(B, Q)), dR, 0);
  const preset = BQR_PRESETS.findIndex(
    (p) => p.b.join() === bBoxes.join() && p.q.join() === qBoxes.join() && p.r.join() === rBoxes.join(),
  );

  const cells: React.ReactNode[] = [];
  let row = 0;
  const addRow = (key: string, label: string, p: Poly, cls: string, zeroIfEmpty = false) => {
    row++;
    cells.push(
      <div key={`${key}-l`} className={`c2-rowlabel ${cls.includes('c2-sum') ? 'c2-A' : ''}`} style={{gridRow: row, gridColumn: 1}}>
        <Tex tex={label} />
      </div>,
    );
    let lead = true;
    for (let k = n; k >= 0; k--) {
      const c = co(p, k);
      const tex = c.n !== 0 ? termTex(c, k, lead) : zeroIfEmpty && k === 0 && deg(p) < 0 ? '0' : '';
      cells.push(
        <div key={`${key}-${k}`} className={`c2-cell ${cls}`} style={{gridRow: row, gridColumn: 2 + n - k}}>
          {tex ? <Tex tex={tex} /> : null}
        </div>,
      );
      if (c.n !== 0) lead = false;
    }
  };
  for (let k = deg(Q); k >= 0; k--) {
    const c = co(Q, k);
    if (c.n === 0) continue;
    addRow(`q${k}`, `${tc('B', 'B')}\\times${tc('Q', bracket(termTex(c, k)))}`, pMulTerm(B, c, k), '');
  }
  addRow('r', `{}+${tc('R', 'R')}`, R, 'c2-R', true);
  addRow('a', 'A=', A, 'c2-A c2-sum', true);

  return (
    <div style={{display: 'grid', gap: 16}}>
      <Style />
      <div className="w-row" role="group" aria-label="Examples" style={{gap: 8}}>
        {BQR_PRESETS.map((p, i) => (
          <button
            key={p.name}
            type="button"
            className={`w-btn ${preset === i ? 'on' : ''}`}
            onClick={() => {
              setB(p.b.map(String));
              setQ(p.q.map(String));
              setR(p.r.map(String));
            }}
          >
            {p.name}
          </button>
        ))}
      </div>
      <div style={{display: 'grid', gap: 10}}>
        <CoefEditor name="Divisor" letter="B" role="B" boxes={bBoxes} onChange={setB} />
        <CoefEditor name="Quotient" letter="Q" role="Q" boxes={qBoxes} onChange={setQ} />
        <CoefEditor name="Remainder" letter="R" role="R" boxes={rBoxes} onChange={setR} />
      </div>
      <div className="c2-stage">
        <div className="c2-side">
          <div className="w-panel">
            <div className="w-label">Substitute into A = B × Q + R</div>
            <Tex
              display
              tex={`\\begin{aligned}${tc('A', 'A')}&=${tc('B', `(${polyTex(B)})`)}${tc('Q', `(${polyTex(Q)})`)}\\\\&\\quad{}+${tc('R', `(${polyTex(R)})`)}\\end{aligned}`}
            />
            <div className="w-row" style={{justifyContent: 'center'}}>
              <span className="w-big c2-A" style={{fontSize: '1.35rem'}} data-testid="c2-dividend">
                <Tex tex={`A=${polyTex(A)}`} />
              </span>
            </div>
          </div>
          <div className={`c2-flag ${ok ? 'ok' : 'bad'}`} aria-live="polite" data-testid="c2-degree-check">
            <div className="c2-degs">
              <span className="c2-deg c2-R">degree of R: {dR < 0 ? 'none (R = 0)' : dR}</span>
              <span className={ok ? 'c2-R' : ''} style={ok ? undefined : {color: 'var(--wrong)'}}>
                {ok ? '<' : dB < 0 ? '' : '≥'}
              </span>
              <span className="c2-deg c2-B">degree of B: {dB < 0 ? 'none (B = 0)' : dB}</span>
            </div>
            {dB < 0 ? (
              <p>
                <strong className="bad">✗ B is 0.</strong> Nothing can be divided by 0, so choose a divisor with at least one non-zero
                coefficient.
              </p>
            ) : ok ? (
              <p>
                <strong className="ok">✓ A proper remainder.</strong>{' '}
                {dR < 0
                  ? 'R = 0, so A is exactly divisible by B, and Q is the quotient.'
                  : 'Dividing A by B really does give this quotient and this remainder.'}
              </p>
            ) : (
              <>
                <p>
                  <strong className="bad">✗ Not finished.</strong> The equation is still true, but R can itself be divided by B, so
                  these are not the quotient and remainder of A ÷ B.
                </p>
                {fixed ? (
                  <p style={{marginTop: 6}}>
                    Carrying on gives quotient <Tex tex={tc('Q', polyTex(fixed.q))} /> and remainder{' '}
                    <Tex tex={tc('R', polyTex(fixed.r))} />.
                  </p>
                ) : null}
              </>
            )}
          </div>
        </div>
        <div className="c2-work">
          <div className="w-label" style={{textAlign: 'center', marginBottom: 10}}>
            Expand term by term, then add the columns
          </div>
          <div className="c2-ld" role="img" aria-label="Expansion of B times Q plus R, one row per term of Q">
            {cells}
          </div>
        </div>
      </div>
    </div>
  );
};

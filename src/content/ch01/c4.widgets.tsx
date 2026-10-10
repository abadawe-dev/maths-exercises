import React, {useId, useRef, useState} from 'react';
import {Tex} from '../../lib/Tex';

// Colour roles shared with the video: LHS cyan, RHS pink, the key substitution amber, results green.
const C = {cyan: '#5ee6ff', pink: '#ff6b9d', amber: '#ffc857', green: '#7cf29c'};
const tc = (colour: string, tex: string) => `\\textcolor{${colour}}{${tex}}`;

const CSS = `
.c4-tabs { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 16px; }
.c4-presets { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 16px; }
.c4-presets .w-btn { padding: 6px 12px; font-weight: 500; }
.c4-presets .w-btn.on { background: color-mix(in srgb, var(--accent) 22%, transparent); color: var(--text); }
.c4-presets .w-btn .katex { font-size: 1em; }
.c4-side { display: grid; gap: 14px; min-width: 0; }
.c4-plot { touch-action: pan-y; cursor: ew-resize; user-select: none; border-radius: 16px; background: rgba(0,0,0,0.25); border: 1px solid var(--border); }
.c4-tiles { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.c4-tile { border-radius: 14px; padding: 10px 14px; border: 1.5px solid; min-width: 0; }
.c4-tile .w-label { margin-bottom: 0; }
.c4-val { font-family: var(--head); font-weight: 700; font-size: 1.6rem; font-variant-numeric: tabular-nums; white-space: nowrap; }
.c4-verdict { border-radius: 14px; padding: 12px 16px; border: 1.5px solid var(--border); background: rgba(0,0,0,0.25); }
.c4-verdict.good { border-color: var(--green); background: rgba(124, 242, 156, 0.1); }
.c4-verdict.warn { border-color: color-mix(in srgb, var(--amber) 70%, transparent); background: rgba(255, 200, 87, 0.08); }
.c4-verdict strong { font-family: var(--head); }
.c4-pop { animation: c4pop 0.45s; }
@keyframes c4pop { 0% { transform: scale(0.94); opacity: 0.3; } 60% { transform: scale(1.03); } 100% { transform: scale(1); opacity: 1; } }
.c4-table { display: grid; grid-template-columns: auto 1fr auto auto; gap: 6px 14px; align-items: center; font-size: 0.95rem; }
.c4-table .h { font-family: var(--head); font-size: 0.75rem; letter-spacing: 0.12em; text-transform: uppercase; color: var(--muted); }
.c4-mark { width: 26px; height: 26px; border-radius: 50%; display: grid; place-items: center; font-weight: 700; font-size: 0.85rem; }
.c4-mark.ok { background: var(--green); color: var(--bg0); }
.c4-mark.no { border: 1.5px solid var(--border); color: var(--muted); }
.c4-lines { display: grid; gap: 10px; }
.c4-lines > div { overflow-x: auto; overflow-y: hidden; padding: 2px 0; }
.c4-big { font-family: var(--head); font-weight: 700; font-size: 1.9rem; color: var(--green); text-align: center; }
.c4-steppers { display: flex; flex-wrap: wrap; align-items: center; gap: 8px 6px; }
.c4-stepper { display: inline-flex; align-items: center; gap: 4px; }
.c4-stepper .w-btn { padding: 0; width: 38px; min-height: 38px; font-size: 1.1rem; }
.c4-stepper output { min-width: 30px; text-align: center; font-family: var(--head); font-weight: 700; font-size: 1.3rem; }
.c4-ratio-label { flex-basis: 100%; }
@media (max-width: 480px) {
  .c4-steppers { gap: 6px 2px; }
  .c4-stepper { gap: 1px; }
  .c4-stepper .w-btn { width: 32px; }
  .c4-stepper output { min-width: 24px; }
}
.c4-colon { font-family: var(--head); font-weight: 700; font-size: 1.3rem; color: var(--muted); padding: 0 2px; }
`;
const Style: React.FC = () => <style>{CSS}</style>;

const fmt = (v: number, d = 2) => {
  const r = Math.round(v * 10 ** d) / 10 ** d;
  return (r === 0 ? 0 : r).toString();
};
/** Number as plain text with a proper minus sign. */
const txt = (v: number, d = 2) => fmt(v, d).replace('-', '−');
const sgn = (v: number) => (v < 0 ? `${fmt(v)}` : `+${fmt(v)}`);
const par = (v: number) => (v < 0 ? `(${fmt(v)})` : fmt(v));
const gcd = (a: number, b: number): number => (b === 0 ? Math.abs(a) : gcd(b, a % b));
const fracTex = (n: number, d: number) => {
  const g = gcd(n, d) || 1;
  let p = n / g;
  let q = d / g;
  if (q < 0) [p, q] = [-p, -q];
  return q === 1 ? `${p}` : `${p < 0 ? '-' : ''}\\dfrac{${Math.abs(p)}}{${q}}`;
};

const Slider: React.FC<{
  label: React.ReactNode;
  aria: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  colour?: string;
  show?: string;
  onChange: (v: number) => void;
}> = ({label, aria, value, min, max, step = 1, colour, show, onChange}) => (
  <div className="w-control">
    <label>
      <span>{label}</span>
      <output style={colour ? {color: colour} : undefined}>{show ?? txt(value)}</output>
    </label>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      aria-label={aria}
      style={colour ? {accentColor: colour} : undefined}
      onChange={(e) => onChange(Number(e.target.value))}
    />
  </div>
);

/* ------------------------------------------------------------------ */
/* Lesson 1-9: equation vs identity grapher + coefficient matcher      */
/* ------------------------------------------------------------------ */

const PW = 520;
const PH = 400;
const ML = 40;
const MR = 12;
const MT = 12;
const MB = 58;

type Range = [number, number];
const scales = (xr: Range, yr: Range) => ({
  sx: (x: number) => ML + ((x - xr[0]) / (xr[1] - xr[0])) * (PW - ML - MR),
  sy: (y: number) => PH - MB - ((y - yr[0]) / (yr[1] - yr[0])) * (PH - MT - MB),
});
const curvePath = (f: (x: number) => number, xr: Range, yr: Range) => {
  const {sx, sy} = scales(xr, yr);
  const span = yr[1] - yr[0];
  let d = '';
  let pen = false;
  const N = 200;
  for (let i = 0; i <= N; i++) {
    const x = xr[0] + ((xr[1] - xr[0]) * i) / N;
    const y = f(x);
    if (!Number.isFinite(y) || y < yr[0] - span || y > yr[1] + span) {
      pen = false;
      continue;
    }
    d += `${pen ? 'L' : 'M'}${sx(x).toFixed(1)},${sy(y).toFixed(1)}`;
    pen = true;
  }
  return d;
};
const ints = (r: Range) => {
  const out: number[] = [];
  for (let i = Math.ceil(r[0]); i <= Math.floor(r[1]); i++) out.push(i);
  return out;
};
const same = (a: number, b: number) => Number.isFinite(a) && Number.isFinite(b) && Math.abs(a - b) < 1e-9;

const Plot: React.FC<{
  xr: Range;
  yr: Range;
  lhs: (x: number) => number;
  rhs: (x: number) => number;
  x?: number;
  onX?: (x: number) => void;
  matched?: boolean;
  hole?: {x: number; y: number};
  label: string;
}> = ({xr, yr, lhs, rhs, x, onX, matched, hole, label}) => {
  const clip = 'c4clip' + useId().replace(/[^a-zA-Z0-9]/g, '');
  const ref = useRef<SVGSVGElement>(null);
  const dragging = useRef(false);
  const {sx, sy} = scales(xr, yr);
  const move = (e: React.PointerEvent) => {
    if (!onX || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const px = ((e.clientX - r.left) / r.width) * PW;
    const v = xr[0] + ((px - ML) / (PW - ML - MR)) * (xr[1] - xr[0]);
    onX(Math.min(xr[1], Math.max(xr[0], Math.round(v * 10) / 10)));
  };
  const yStep = yr[1] - yr[0] > 12 ? 4 : 2;
  const yTicks = ints(yr).filter((v) => v % yStep === 0);
  const xTicks = ints(xr);
  const l = x === undefined ? NaN : lhs(x);
  const r = x === undefined ? NaN : rhs(x);
  const y0 = Math.min(Math.max(0, yr[0]), yr[1]);
  const x0 = Math.min(Math.max(0, xr[0]), xr[1]);
  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${PW} ${PH}`}
      className="w-svg c4-plot"
      style={onX ? undefined : {cursor: 'default'}}
      role="img"
      aria-label={label}
      onPointerDown={(e) => {
        dragging.current = true;
        (e.currentTarget as Element).setPointerCapture?.(e.pointerId);
        move(e);
      }}
      onPointerMove={(e) => dragging.current && move(e)}
      onPointerUp={() => (dragging.current = false)}
      onPointerCancel={() => (dragging.current = false)}
    >
      <defs>
        <clipPath id={clip}>
          <rect x={ML} y={MT} width={PW - ML - MR} height={PH - MT - MB} />
        </clipPath>
      </defs>
      {xTicks.map((v) => (
        <g key={`x${v}`}>
          <line x1={sx(v)} x2={sx(v)} y1={MT} y2={PH - MB} stroke="rgba(255,255,255,0.07)" />
          <text x={sx(v)} y={PH - MB + 19} textAnchor="middle" fontSize={15} fill="var(--muted)" fontFamily="var(--body)">
            {txt(v)}
          </text>
        </g>
      ))}
      {yTicks.map((v) => (
        <g key={`y${v}`}>
          <line x1={ML} x2={PW - MR} y1={sy(v)} y2={sy(v)} stroke="rgba(255,255,255,0.07)" />
          <text x={ML - 8} y={sy(v) + 5} textAnchor="end" fontSize={15} fill="var(--muted)" fontFamily="var(--body)">
            {txt(v)}
          </text>
        </g>
      ))}
      <line x1={ML} x2={PW - MR} y1={sy(y0)} y2={sy(y0)} stroke="rgba(255,255,255,0.4)" strokeWidth={1.5} />
      <line x1={sx(x0)} x2={sx(x0)} y1={MT} y2={PH - MB} stroke="rgba(255,255,255,0.4)" strokeWidth={1.5} />
      <g clipPath={`url(#${clip})`}>
        <path
          d={curvePath(lhs, xr, yr)}
          fill="none"
          stroke={matched ? C.green : C.cyan}
          strokeWidth={matched ? 9 : 6}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={matched ? 0.75 : 0.9}
        />
        <path d={curvePath(rhs, xr, yr)} fill="none" stroke={C.pink} strokeWidth={3.5} strokeDasharray="11 8" strokeLinecap="round" />
        {hole ? <circle cx={sx(hole.x)} cy={sy(hole.y)} r={8} fill="var(--bg0)" stroke={C.cyan} strokeWidth={3} /> : null}
        {x !== undefined ? (
          <>
            <line x1={sx(x)} x2={sx(x)} y1={MT} y2={PH - MB} stroke="rgba(255,255,255,0.55)" strokeWidth={1.5} strokeDasharray="4 5" />
            {Number.isFinite(l) && Number.isFinite(r) && !same(l, r) ? (
              <line x1={sx(x)} x2={sx(x)} y1={sy(l)} y2={sy(r)} stroke={C.amber} strokeWidth={4} />
            ) : null}
            {Number.isFinite(l) ? <circle cx={sx(x)} cy={sy(l)} r={9} fill={C.cyan} stroke="var(--bg0)" strokeWidth={2.5} /> : null}
            {Number.isFinite(r) ? <circle cx={sx(x)} cy={sy(r)} r={5.5} fill={C.pink} stroke="var(--bg0)" strokeWidth={2} /> : null}
          </>
        ) : null}
      </g>
      {/* one dot per whole number: green where the two sides agree */}
      {xTicks.map((v) => {
        const a = lhs(v);
        const b = rhs(v);
        const cx = sx(v);
        const cy = PH - 15;
        if (!Number.isFinite(a) || !Number.isFinite(b)) {
          return (
            <text key={`d${v}`} x={cx} y={cy + 6} textAnchor="middle" fontSize={17} fontWeight={700} fill={C.amber}>
              ?
            </text>
          );
        }
        return same(a, b) ? (
          <circle key={`d${v}`} cx={cx} cy={cy} r={7.5} fill={C.green} />
        ) : (
          <circle key={`d${v}`} cx={cx} cy={cy} r={6.5} fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth={2} />
        );
      })}
    </svg>
  );
};

type Preset = {
  id: string;
  lhs: string;
  rhs: string;
  f: (x: number) => number;
  g: (x: number) => number;
  xr: Range;
  yr: Range;
  start: number;
  kind: 'equation' | 'identity' | 'hole';
  title: string;
  verdict: string;
  hole?: {x: number; y: number};
};
const PRESETS: Preset[] = [
  {
    id: 'lin',
    lhs: '2x+1',
    rhs: '7',
    f: (x) => 2 * x + 1,
    g: () => 7,
    xr: [-2, 6],
    yr: [-2, 12],
    start: 1,
    kind: 'equation',
    title: 'Equation: equal only at x = 3',
    verdict: 'The two lines cross once. Any other x makes the sides disagree.',
  },
  {
    id: 'quad',
    lhs: 'x^2',
    rhs: '2x+3',
    f: (x) => x * x,
    g: (x) => 2 * x + 3,
    xr: [-4, 5],
    yr: [-2, 14],
    start: 1,
    kind: 'equation',
    title: 'Equation: equal only at x = −1 and x = 3',
    verdict: 'Two crossing points, so two solutions, but still not “every x”.',
  },
  {
    id: 'id',
    lhs: '(x+1)^2',
    rhs: 'x^2+2x+1',
    f: (x) => (x + 1) ** 2,
    g: (x) => x * x + 2 * x + 1,
    xr: [-5, 3],
    yr: [-2, 12],
    start: 1,
    kind: 'identity',
    title: 'Identity: equal for every x',
    verdict: 'The curves lie exactly on top of each other. Slide x anywhere: the gap is always 0.',
  },
  {
    id: 'fake',
    lhs: '(x+1)^2',
    rhs: 'x^2+1',
    f: (x) => (x + 1) ** 2,
    g: (x) => x * x + 1,
    xr: [-4, 4],
    yr: [-2, 14],
    start: 1,
    kind: 'equation',
    title: 'Not an identity: equal only at x = 0',
    verdict: 'It looks plausible, but the 2x term is missing. One matching value is not enough.',
  },
  {
    id: 'hole',
    lhs: '\\dfrac{x^2-16}{x-4}',
    rhs: 'x+4',
    f: (x) => (Math.abs(x - 4) < 1e-9 ? NaN : (x * x - 16) / (x - 4)),
    g: (x) => x + 4,
    xr: [-2, 8],
    yr: [-2, 14],
    start: 2,
    kind: 'hole',
    title: 'Equal wherever both sides exist',
    verdict: 'At x = 4 the LHS is 0 ÷ 0, which has no value: the cyan line has a hole there. It is an identity only for x ≠ 4.',
    hole: {x: 4, y: 8},
  },
];

const EquationMode: React.FC = () => {
  const [pid, setPid] = useState('lin');
  const p = PRESETS.find((q) => q.id === pid)!;
  const [x, setX] = useState(p.start);
  const l = p.f(x);
  const r = p.g(x);
  const eq = same(l, r);
  const undef = !Number.isFinite(l);
  return (
    <>
      <div className="c4-presets" role="group" aria-label="Choose an equality">
        {PRESETS.map((q) => (
          <button
            key={q.id}
            type="button"
            className={`w-btn ${q.id === pid ? 'on' : ''}`}
            aria-pressed={q.id === pid}
            onClick={() => {
              setPid(q.id);
              setX(q.start);
            }}
          >
            <Tex tex={`${q.lhs.replace('\\dfrac', '\\tfrac')}=${q.rhs}`} />
          </button>
        ))}
      </div>
      <div className="w-grid">
        <div>
          <Plot xr={p.xr} yr={p.yr} lhs={p.f} rhs={p.g} x={x} onX={setX} hole={p.hole} label={`Graphs of both sides of ${p.lhs} = ${p.rhs}`} />
          <p className="w-note" style={{marginTop: 8}}>
            Drag on the graph or use the slider. The dots along the bottom test each whole number: green means both sides
            agree there.
          </p>
        </div>
        <div className="c4-side">
          <div className="w-panel" style={{textAlign: 'center'}}>
            <Tex tex={`${tc(C.cyan, p.lhs)}\\;=\\;${tc(C.pink, p.rhs)}`} />
          </div>
          <Slider label="x" aria="value of x" value={x} min={p.xr[0]} max={p.xr[1]} step={0.1} show={txt(x, 1)} onChange={setX} />
          <div className="c4-tiles">
            <div className="c4-tile" style={{borderColor: C.cyan, background: 'rgba(94,230,255,0.08)'}}>
              <div className="w-label">LHS</div>
              <div className="c4-val" style={{color: C.cyan, fontSize: undef ? '1.05rem' : undefined, lineHeight: undef ? '2.4rem' : undefined}}>
                {undef ? 'undefined' : txt(l)}
              </div>
            </div>
            <div className="c4-tile" style={{borderColor: C.pink, background: 'rgba(255,107,157,0.08)'}}>
              <div className="w-label">RHS</div>
              <div className="c4-val" style={{color: C.pink}}>
                {txt(r)}
              </div>
            </div>
          </div>
          <p style={{fontWeight: 600, color: undef ? C.amber : eq ? C.green : C.amber}} aria-live="polite">
            {undef
              ? `At x = ${txt(x, 1)} the LHS has no value.`
              : eq
                ? `✓ At x = ${txt(x, 1)} the two sides are equal.`
                : `✗ At x = ${txt(x, 1)} the sides differ by ${txt(Math.abs(l - r))}.`}
          </p>
          <div className={`c4-verdict ${p.kind === 'identity' ? 'good' : 'warn'}`} key={p.id}>
            <div className="w-label">Verdict</div>
            <strong style={{color: p.kind === 'identity' ? C.green : C.amber}}>{p.title}</strong>
            <p className="w-note" style={{marginTop: 4}}>
              {p.verdict}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

const MatchMode: React.FC = () => {
  const [a, setA] = useState(2);
  const [b, setB] = useState(1);
  const [c, setC] = useState(0);
  const rows: {power: string; expr: string; got: number; want: number}[] = [
    {power: 'x^2', expr: 'a', got: a, want: 1},
    {power: 'x', expr: '2a+b', got: 2 * a + b, want: 0},
    {power: '\\text{constant}', expr: 'a+b+c', got: a + b + c, want: 6},
  ];
  const done = rows.every((r) => r.got === r.want);
  const xr: Range = [-5, 4];
  const yr: Range = [-4, 20];
  return (
    <div className="w-grid">
      <div>
        <Plot
          xr={xr}
          yr={yr}
          lhs={(x) => x * x + 6}
          rhs={(x) => a * (x + 1) ** 2 + b * (x + 1) + c}
          matched={done}
          label="Target curve x squared plus 6 and your curve"
        />
        <p className="w-note" style={{marginTop: 8}}>
          Solid: the target <Tex tex={tc(C.cyan, 'x^2+6')} />. Dashed: your right-hand side. Green dots mark the whole
          numbers where they already agree.
        </p>
      </div>
      <div className="c4-side">
        <div className="w-panel" style={{textAlign: 'center'}}>
          <Tex tex={`${tc(C.cyan, 'x^2+6')}=${tc(C.pink, `${tc(C.amber, fmt(a))}(x+1)^2${tc(C.amber, sgn(b))}(x+1)${tc(C.amber, sgn(c))}`)}`} />
        </div>
        <div className="w-row">
          <Slider label="a" aria="constant a" value={a} min={-3} max={3} colour={C.amber} onChange={setA} />
          <Slider label="b" aria="constant b" value={b} min={-6} max={6} colour={C.amber} onChange={setB} />
          <Slider label="c" aria="constant c" value={c} min={-4} max={10} colour={C.amber} onChange={setC} />
        </div>
        <div className="w-panel">
          <div className="c4-table" role="table" aria-label="Coefficients compared">
            <span className="h">Term</span>
            <span className="h">Your RHS</span>
            <span className="h">LHS</span>
            <span className="h" />
            {rows.map((r) => (
              <React.Fragment key={r.power}>
                <span>
                  <Tex tex={r.power} />
                </span>
                <span>
                  <Tex tex={`${r.expr}=${tc(C.pink, fmt(r.got))}`} />
                </span>
                <span>
                  <Tex tex={tc(C.cyan, fmt(r.want))} />
                </span>
                <span className={`c4-mark ${r.got === r.want ? 'ok' : 'no'}`} aria-label={r.got === r.want ? 'matches' : 'does not match'}>
                  {r.got === r.want ? '✓' : '≠'}
                </span>
              </React.Fragment>
            ))}
          </div>
        </div>
        {done ? (
          <div className="c4-verdict good c4-pop" aria-live="polite">
            <strong style={{color: C.green}}>The curves coincide: it is an identity!</strong>
            <p className="w-note" style={{marginTop: 4}}>
              All three coefficients match, so <Tex tex="a=1,\ b=-2,\ c=7" /> and the two sides agree for every x.
            </p>
          </div>
        ) : (
          <div className="c4-verdict" aria-live="polite">
            <p className="w-note">
              Work from the top: fix the <Tex tex="x^2" /> row with a, then the <Tex tex="x" /> row with b, then the constant
              with c. There is no x term on the left, so its coefficient is 0.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

/** Lesson 1-9: see the difference between an equation and an identity, then match coefficients by hand. */
export const IdentityGrapher: React.FC = () => {
  const [mode, setMode] = useState<'eq' | 'match'>('eq');
  return (
    <div>
      <Style />
      <div className="c4-tabs" role="group" aria-label="Mode">
        <button type="button" className={`w-btn ${mode === 'eq' ? 'on' : ''}`} aria-pressed={mode === 'eq'} onClick={() => setMode('eq')}>
          Equation or identity?
        </button>
        <button type="button" className={`w-btn ${mode === 'match' ? 'on' : ''}`} aria-pressed={mode === 'match'} onClick={() => setMode('match')}>
          Match the coefficients
        </button>
      </div>
      {mode === 'eq' ? <EquationMode /> : <MatchMode />}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Lesson 1-10: area picture for (x+y)^2 - (x-y)^2 = 4xy               */
/* ------------------------------------------------------------------ */

export const AreaPicture: React.FC = () => {
  const [x, setX] = useState(5);
  const [yRaw, setY] = useState(3);
  const y = Math.min(yRaw, x);
  const SIDE = 280;
  const OX = 44;
  const OY = 40;
  const u = SIDE / (x + y);
  const X = x * u;
  const Y = y * u;
  const rects = [
    {x: 0, y: 0, w: X, h: Y},
    {x: X, y: 0, w: Y, h: X},
    {x: Y, y: X, w: X, h: Y},
    {x: 0, y: Y, w: Y, h: X},
  ];
  const inner = X - Y;
  const big = (x + y) ** 2;
  const small = (x - y) ** 2;
  return (
    <div className="w-grid">
      <Style />
      <div>
        <div className="w-row">
          <Slider label="x" aria="length x" value={x} min={2} max={10} onChange={setX} />
          <Slider label="y (at most x)" aria="length y" value={y} min={1} max={x} onChange={setY} />
        </div>
        <svg
          viewBox={`0 0 ${SIDE + OX + 16} ${SIDE + OY + 16}`}
          className="w-svg"
          style={{maxWidth: 400, margin: '10px auto 0'}}
          role="img"
          aria-label={`Square of side ${x + y} with a square of side ${x - y} removed from the middle, leaving four ${x} by ${y} rectangles`}
        >
          <g transform={`translate(${OX} ${OY})`}>
            {rects.map((r, i) => {
              const tall = r.h > r.w;
              const cx = r.x + r.w / 2;
              const cy = r.y + r.h / 2;
              return (
                <g key={i}>
                  <rect x={r.x + 1.5} y={r.y + 1.5} width={r.w - 3} height={r.h - 3} rx={5} fill="rgba(255,107,157,0.2)" stroke={C.pink} strokeWidth={2} />
                  {Math.min(r.w, r.h) >= 17 ? (
                    <text
                      x={cx}
                      y={cy}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize={Math.min(r.w, r.h) >= 24 ? 15 : 12}
                      fontWeight={700}
                      fontFamily="var(--head)"
                      fill={C.pink}
                      transform={tall ? `rotate(-90 ${cx} ${cy})` : undefined}
                    >
                      {x} × {y} = {x * y}
                    </text>
                  ) : null}
                </g>
              );
            })}
            {inner > 0 ? (
              <>
                <rect x={Y + 3} y={Y + 3} width={inner - 6} height={inner - 6} rx={4} fill="rgba(7,11,26,0.75)" stroke={C.cyan} strokeWidth={2} strokeDasharray="6 5" />
                {inner >= 54 ? (
                  <>
                    <text x={Y + inner / 2} y={Y + inner / 2 - 9} textAnchor="middle" dominantBaseline="central" fontSize={13} fill="var(--muted)" fontFamily="var(--body)">
                      removed
                    </text>
                    <text x={Y + inner / 2} y={Y + inner / 2 + 10} textAnchor="middle" dominantBaseline="central" fontSize={15} fontWeight={700} fill={C.cyan} fontFamily="var(--head)">
                      {x - y}² = {small}
                    </text>
                  </>
                ) : null}
              </>
            ) : null}
            <rect x={0} y={0} width={SIDE} height={SIDE} rx={6} fill="none" stroke={C.cyan} strokeWidth={3} />
            {/* edge labels */}
            <g fontFamily="var(--head)" fontWeight={700} fontSize={15} fill="var(--text)" textAnchor="middle">
              <path d={`M2,-10 H${X - 2} M${X + 2},-10 H${SIDE - 2}`} stroke="var(--muted)" strokeWidth={1.5} />
              <path d={`M2,-15 V-5 M${X},-15 V-5 M${SIDE - 2},-15 V-5`} stroke="var(--muted)" strokeWidth={1.5} />
              <text x={X / 2} y={-18}>
                x = {x}
              </text>
              <text x={X + Y / 2} y={-18}>
                {Y > 44 ? `y = ${y}` : 'y'}
              </text>
              <path d={`M-10,2 V${Y - 2} M-10,${Y + 2} V${SIDE - 2}`} stroke="var(--muted)" strokeWidth={1.5} />
              <path d={`M-15,2 H-5 M-15,${Y} H-5 M-15,${SIDE - 2} H-5`} stroke="var(--muted)" strokeWidth={1.5} />
              <text x={-22} y={Y / 2} dominantBaseline="central">
                y
              </text>
              <text x={-22} y={Y + X / 2} dominantBaseline="central">
                x
              </text>
            </g>
          </g>
        </svg>
      </div>
      <div className="c4-side">
        <div className="w-panel">
          <div className="w-label">Big square minus the middle square</div>
          <div className="c4-lines">
            <div>
              <Tex tex={`${tc(C.cyan, '(x+y)^2-(x-y)^2')}=${x + y}^2-${x - y}^2`} />
            </div>
            <div>
              <Tex tex={`=${big}-${small}=${tc(C.cyan, `${big - small}`)}`} />
            </div>
          </div>
        </div>
        <div className="w-panel">
          <div className="w-label">Four rectangles</div>
          <Tex tex={`${tc(C.pink, '4xy')}=4\\times${x}\\times${y}=${tc(C.pink, `${4 * x * y}`)}`} />
        </div>
        <div className="c4-verdict good" key={`${x}-${y}`}>
          <div className="c4-big">
            {big - small} = {4 * x * y} ✓
          </div>
          <p className="w-note" style={{textAlign: 'center'}}>
            {x === y
              ? 'With x = y nothing is removed: the four rectangles fill the whole square.'
              : 'Whatever x and y are, what is left of the big square is exactly the four x-by-y rectangles.'}
          </p>
        </div>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Lesson 1-11: switch the condition a + b + c = 0 on and off          */
/* ------------------------------------------------------------------ */

type Cond = {id: string; lhs: string; rhs: string; f: (a: number, b: number, c: number) => number; g: (a: number, b: number, c: number) => number};
const CONDS: Cond[] = [
  {
    id: 'sq',
    lhs: 'a^2+b^2+c^2',
    rhs: '-2(ab+bc+ca)',
    f: (a, b, c) => a * a + b * b + c * c,
    g: (a, b, c) => -2 * (a * b + b * c + c * a),
  },
  {id: 'cube', lhs: 'a^3+b^3+c^3', rhs: '3abc', f: (a, b, c) => a ** 3 + b ** 3 + c ** 3, g: (a, b, c) => 3 * a * b * c},
  {
    id: 'frac',
    lhs: '\\dfrac{a}{b+c}+\\dfrac{b}{c+a}+\\dfrac{c}{a+b}',
    rhs: '-3',
    f: (a, b, c) => (b + c === 0 || c + a === 0 || a + b === 0 ? NaN : a / (b + c) + b / (c + a) + c / (a + b)),
    g: () => -3,
  },
];

export const ConditionLab: React.FC = () => {
  const [id, setId] = useState('sq');
  const [a, setA] = useState(1);
  const [b, setB] = useState(2);
  const [locked, setLocked] = useState(true);
  const [cFree, setCFree] = useState(-1);
  const c = locked ? -a - b : cFree;
  const q = CONDS.find((k) => k.id === id)!;
  const L = q.f(a, b, c);
  const R = q.g(a, b, c);
  const sum = a + b + c;
  const undef = !Number.isFinite(L);
  const equal = same(L, R);
  const W = 520;
  const mid = W / 2;
  const scale = (mid - 150) / Math.max(Math.abs(undef ? 0 : L), Math.abs(R), 6);
  const bar = (v: number, yy: number, colour: string, name: string) => {
    const w = Math.abs(v) * scale;
    const right = v >= 0;
    return (
      <g>
        <rect x={right ? mid : mid - w} y={yy} width={Math.max(w, 2)} height={30} rx={6} fill={colour} opacity={0.85} />
        <text
          x={right ? mid + w + 10 : mid - w - 10}
          y={yy + 16}
          textAnchor={right ? 'start' : 'end'}
          dominantBaseline="central"
          fontSize={22}
          fontWeight={700}
          fontFamily="var(--head)"
          fill={colour}
        >
          {name} = {txt(v)}
        </text>
      </g>
    );
  };
  return (
    <div>
      <Style />
      <div className="c4-presets" role="group" aria-label="Choose an equality">
        {CONDS.map((k) => (
          <button key={k.id} type="button" className={`w-btn ${k.id === id ? 'on' : ''}`} aria-pressed={k.id === id} onClick={() => setId(k.id)}>
            <Tex tex={`${k.lhs.replace(/\\dfrac/g, '\\tfrac')}=${k.rhs}`} />
          </button>
        ))}
      </div>
      <div className="w-grid">
        <div className="c4-side">
          <div className="w-row">
            <Slider label="a" aria="value of a" value={a} min={-6} max={6} onChange={setA} />
            <Slider label="b" aria="value of b" value={b} min={-6} max={6} onChange={setB} />
          </div>
          <div className="w-row">
            <button type="button" className={`w-btn ${locked ? 'on' : ''}`} aria-pressed={locked} onClick={() => (locked ? (setCFree(c), setLocked(false)) : setLocked(true))}>
              {locked ? 'Condition ON: c = −a − b' : 'Condition OFF: choose c freely'}
            </button>
            {locked ? (
              <span style={{color: C.amber, fontWeight: 600}}>
                <Tex tex={tc(C.amber, `c=-(${par(a)})-(${par(b)})=${fmt(c)}`)} />
              </span>
            ) : (
              <Slider label="c" aria="value of c" value={cFree} min={-12} max={12} colour={C.amber} onChange={setCFree} />
            )}
          </div>
          <p className="w-note">
            <Tex tex={`a+b+c=${fmt(sum)}`} /> {sum === 0 ? '— the condition holds.' : '— the condition is broken.'}
          </p>
        </div>
        <div className="c4-side">
          <div className="w-panel" style={{textAlign: 'center'}}>
            <Tex tex={`${tc(C.cyan, q.lhs)}\\;=\\;${tc(C.pink, q.rhs)}`} />
          </div>
          <svg viewBox={`0 0 ${W} 112`} className="w-svg" role="img" aria-label={`LHS ${undef ? 'undefined' : fmt(L)}, RHS ${fmt(R)}`}>
            <line x1={mid} x2={mid} y1={4} y2={108} stroke="rgba(255,255,255,0.4)" strokeWidth={1.5} />
            {undef ? (
              <text x={mid + 10} y={31} dominantBaseline="central" fontSize={22} fontWeight={700} fontFamily="var(--head)" fill={C.cyan}>
                LHS is undefined (÷ 0)
              </text>
            ) : (
              bar(L, 15, C.cyan, 'LHS')
            )}
            {bar(R, 65, C.pink, 'RHS')}
          </svg>
          <div className={`c4-verdict ${equal ? 'good' : 'warn'}`} aria-live="polite">
            <strong style={{color: equal ? C.green : C.amber}}>
              {undef
                ? 'A denominator is 0 here: pick non-zero numbers.'
                : equal
                  ? sum === 0
                    ? '✓ Equal, as the condition promises.'
                    : '✓ Equal here, but only by luck.'
                  : '✗ Not equal: without the condition the equality fails.'}
            </strong>
            <p className="w-note" style={{marginTop: 4}}>
              {locked
                ? 'Move a and b anywhere. Because c is tied to them, the two bars always have the same length.'
                : 'This is a conditional equality: it is only guaranteed when a + b + c = 0.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Lesson 1-12: ratio lab                                              */
/* ------------------------------------------------------------------ */

const Stepper: React.FC<{name: string; value: number; onChange: (v: number) => void}> = ({name, value, onChange}) => (
  <span className="c4-stepper">
    <button type="button" className="w-btn" aria-label={`decrease ${name}`} disabled={value <= 1} onClick={() => onChange(value - 1)}>
      −
    </button>
    <output aria-label={`ratio number for ${name}`}>{value}</output>
    <button type="button" className="w-btn" aria-label={`increase ${name}`} disabled={value >= 6} onClick={() => onChange(value + 1)}>
      +
    </button>
  </span>
);

export const RatioLab: React.FC = () => {
  const [p, setP] = useState(2);
  const [q, setQ] = useState(3);
  const [r, setR] = useState(5);
  const [k, setK] = useState(3);
  const x = p * k;
  const y = q * k;
  const z = r * k;
  const n0 = 2 * p * q + q * r + 3 * r * p;
  const d0 = p * p + q * q + r * r;
  const num = 2 * x * y + y * z + 3 * z * x;
  const den = x * x + y * y + z * z;
  const W = 520;
  const X0 = 30;
  const unit = (W - X0 - 150) / (Math.max(p, q, r) * 10); // the longest bar fills the width when k = 10
  const rows: [string, number, number][] = [
    ['x', p, x],
    ['y', q, y],
    ['z', r, z],
  ];
  return (
    <div className="w-grid">
      <Style />
      <div className="c4-side">
        <div className="c4-steppers" role="group" aria-label="The ratio x to y to z">
          <span className="w-note c4-ratio-label">
            Ratio <Tex tex="x:y:z" />
          </span>
          <Stepper name="x" value={p} onChange={setP} />
          <span className="c4-colon">:</span>
          <Stepper name="y" value={q} onChange={setQ} />
          <span className="c4-colon">:</span>
          <Stepper name="z" value={r} onChange={setR} />
        </div>
        <Slider label="k (the common multiplier)" aria="constant k" value={k} min={0.5} max={10} step={0.5} colour={C.amber} onChange={setK} />
        <svg viewBox={`0 0 ${W} 178`} className="w-svg" role="img" aria-label={`Bars of length ${fmt(x)}, ${fmt(y)} and ${fmt(z)}`}>
          {rows.map(([name, parts, val], i) => {
            const yy = 12 + i * 56;
            const seg = k * unit;
            return (
              <g key={name}>
                <text x={4} y={yy + 20} dominantBaseline="central" fontSize={22} fontStyle="italic" fontFamily="KaTeX_Math, serif" fill="var(--text)">
                  {name}
                </text>
                {Array.from({length: parts}, (_, j) => (
                  <rect
                    key={j}
                    x={X0 + j * seg + 1}
                    y={yy}
                    width={Math.max(seg - 2, 1)}
                    height={40}
                    rx={Math.min(6, seg / 3)}
                    fill="color-mix(in srgb, var(--accent) 35%, transparent)"
                    stroke="var(--accent)"
                    strokeWidth={1.5}
                  />
                ))}
                <text x={X0 + parts * seg + 10} y={yy + 20} dominantBaseline="central" fontSize={21} fontWeight={700} fontFamily="var(--head)" fill="var(--text)">
                  {parts === 1 ? '' : parts}
                  <tspan fill={C.amber}>k</tspan> = {txt(val)}
                </text>
              </g>
            );
          })}
        </svg>
        <p className="w-note">
          Each block is one <span style={{color: C.amber, fontWeight: 600}}>k</span>. Changing k stretches all three bars
          together, so their ratio stays {p} : {q} : {r}.
        </p>
      </div>
      <div className="c4-side">
        <div className="w-panel">
          <div className="w-label">Substitute x = {p}k, y = {q}k, z = {r}k</div>
          <div className="c4-lines">
            <div>
              <Tex tex={`\\dfrac{2xy+yz+3zx}{x^2+y^2+z^2}=\\dfrac{${n0}${tc(C.amber, 'k^2')}}{${d0}${tc(C.amber, 'k^2')}}`} />
            </div>
            <div>
              <Tex tex={`\\text{with }${tc(C.amber, `k=${fmt(k)}`)}:\\quad\\dfrac{${fmt(num)}}{${fmt(den)}}`} />
            </div>
          </div>
        </div>
        <div className="c4-verdict good">
          <div className="w-label">Value of the fraction</div>
          <div className="c4-big">
            <Tex tex={`${fracTex(n0, d0)}${n0 % d0 === 0 ? '' : `\\approx ${fmt(n0 / d0, 3)}`}`} />
          </div>
          <p className="w-note" style={{textAlign: 'center'}}>
            The k² cancels, so the value never depends on k. Only the ratio matters.
          </p>
        </div>
      </div>
    </div>
  );
};

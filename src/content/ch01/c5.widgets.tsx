import React, {useState} from 'react';
import {Tex} from '../../lib/Tex';

// Colour roles used throughout this concept: LHS cyan, RHS amber, positive/true green, negative/false red-pink.
const LHS = 'var(--cyan)';
const RHS = 'var(--amber)';
const POS = 'var(--green)';
const NEG = 'var(--wrong)';
const MUTED = 'var(--muted)';
// KaTeX's \textcolor needs literal colours (same values as the CSS variables).
const HEX = {pos: '#7cf29c', neg: '#ff7a8a', zero: '#9aa5c8', lhs: '#5ee6ff', rhs: '#ffc857'};

const signVar = (v: number) => (v > 0 ? POS : v < 0 ? NEG : MUTED);
const signHex = (v: number) => (v > 0 ? HEX.pos : v < 0 ? HEX.neg : HEX.zero);
const signWord = (v: number) => (v > 0 ? 'positive' : v < 0 ? 'negative' : 'zero');
/** Number for TeX: at most `d` decimals, no trailing zeros, no "-0". */
const plain = (v: number, d = 2) => {
  const r = Math.round(v * 10 ** d) / 10 ** d;
  return String(r === 0 ? 0 : r);
};
/** The same for TeX: a negative number is wrapped in braces so its minus is not spaced like a subtraction. */
const n = (v: number, d = 2) => (plain(v, d).startsWith('-') ? `{${plain(v, d)}}` : plain(v, d));
/** Number for plain text and SVG labels (proper minus sign). */
const t = (v: number, d = 2) => plain(v, d).replace('-', '−');
const rel = (a: number, b: number) => (Math.abs(a - b) < 1e-9 ? '=' : a > b ? '>' : '<');
const col = (hex: string, tex: string) => `\\textcolor{${hex}}{${tex}}`;

const Styles: React.FC = () => (
  <style>{`
.c5-sliders { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px 20px; }
.c5-sliders .w-control { min-width: 0; }
.c5-stack { display: grid; gap: 14px; min-width: 0; }
.c5-pills { display: flex; flex-wrap: wrap; gap: 8px; }
.c5-pill { display: inline-flex; align-items: center; gap: 6px; border: 1.5px solid currentColor; border-radius: 999px; padding: 3px 12px; font-size: 0.88rem; font-weight: 600; font-variant-numeric: tabular-nums; background: color-mix(in srgb, currentColor 10%, transparent); white-space: nowrap; }
.c5-verdict { font-family: var(--head); font-weight: 700; font-size: 1.5rem; line-height: 1.2; font-variant-numeric: tabular-nums; }
.c5-rows { display: grid; grid-template-columns: auto minmax(0, 1fr); gap: 6px 14px; align-items: baseline; }
.c5-rows dt { font-family: var(--head); font-size: 0.72rem; letter-spacing: 0.12em; text-transform: uppercase; color: var(--muted); }
.c5-rows dd { margin: 0; overflow-x: auto; overflow-y: hidden; }
.c5-sub { font-family: var(--head); font-size: 1.12rem; letter-spacing: -0.01em; margin: 0 0 4px; }
.c5-rule { border: 0; border-top: 1px dashed var(--border); margin: 26px 0 22px; }
.c5-cell { cursor: pointer; }
.c5-cell:hover { stroke: rgba(255,255,255,0.7); stroke-width: 1; }
.c5-svg text { font-family: var(--head); font-variant-numeric: tabular-nums; }
.c5-fade { transition: opacity 0.25s; }
`}</style>
);

const Slider: React.FC<{
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  colour?: string;
  onChange: (v: number) => void;
}> = ({label, value, min, max, step = 1, colour, onChange}) => (
  <div className="w-control">
    <label>
      <span style={colour ? {color: colour, fontWeight: 600} : undefined}>{label}</span>
      <output>{t(value)}</output>
    </label>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      aria-label={label}
      style={colour ? {accentColor: colour} : undefined}
      onChange={(e) => onChange(Number(e.target.value))}
    />
  </div>
);

const Pill: React.FC<{colour: string; children: React.ReactNode}> = ({colour, children}) => (
  <span className="c5-pill" style={{color: colour}}>
    {children}
  </span>
);

/* ------------------------------------------------------------------ 1-13 */

/** 2(ax+by) against (a+b)(x+y): two bars, and the factorised difference (a−b)(x−y) with signed factors. */
export const DifferenceExplorer: React.FC = () => {
  const [a, setA] = useState(7);
  const [b, setB] = useState(3);
  const [x, setX] = useState(6);
  const [y, setY] = useState(2);
  const lhs = 2 * (a * x + b * y);
  const rhs = (a + b) * (x + y);
  const f1 = a - b;
  const f2 = x - y;
  const diff = f1 * f2;
  const top = [20, 50, 100, 200, 400].find((m) => m >= Math.max(lhs, rhs, 1)) ?? 400;
  const X0 = 52;
  const X1 = 300;
  const px = (v: number) => X0 + ((X1 - X0) * v) / top;
  const note =
    diff === 0
      ? 'One factor is zero, so the difference is zero and the two sides are exactly equal.'
      : f1 > 0 && f2 > 0
        ? 'Both conditions hold: positive × positive is positive, so LHS > RHS. This is the textbook proof.'
        : f1 < 0 && f2 < 0
          ? 'Both conditions are broken, yet negative × negative is positive again! The conditions are enough for the inequality, but they are not the only way to get it.'
          : 'One condition is broken: positive × negative is negative, so the inequality flips to LHS < RHS.';
  return (
    <div className="w-grid">
      <Styles />
      <div className="c5-stack">
        <div className="c5-sliders">
          <Slider label="a" value={a} min={0} max={10} onChange={setA} />
          <Slider label="x" value={x} min={0} max={10} onChange={setX} />
          <Slider label="b" value={b} min={0} max={10} onChange={setB} />
          <Slider label="y" value={y} min={0} max={10} onChange={setY} />
        </div>
        <div className="c5-pills" aria-live="polite">
          <Pill colour={f1 > 0 ? POS : NEG}>
            {f1 > 0 ? '✓' : '✗'} a &gt; b
          </Pill>
          <Pill colour={f2 > 0 ? POS : NEG}>
            {f2 > 0 ? '✓' : '✗'} x &gt; y
          </Pill>
        </div>
        <svg viewBox="0 0 360 150" className="w-svg c5-svg" role="img" aria-label={`Left-hand side ${lhs}, right-hand side ${rhs}`}>
          {[0, top / 2, top].map((v) => (
            <g key={v}>
              <line x1={px(v)} x2={px(v)} y1={8} y2={112} stroke="rgba(255,255,255,0.12)" strokeDasharray="3 4" />
              <text x={px(v)} y={128} textAnchor="middle" fontSize={12.5} fill={MUTED}>
                {v}
              </text>
            </g>
          ))}
          {(
            [
              ['LHS', lhs, LHS, 16],
              ['RHS', rhs, RHS, 62],
            ] as const
          ).map(([name, v, c, yy]) => (
            <g key={name}>
              <text x={X0 - 10} y={yy + 17} textAnchor="end" dominantBaseline="central" fontSize={13} fontWeight={700} fill={c}>
                {name}
              </text>
              <rect x={X0} y={yy} width={Math.max(px(v) - X0, 2)} height={34} rx={7} fill={c} opacity={0.85} style={{transition: 'width 0.2s'}} />
              <text x={px(v) + 10} y={yy + 17} dominantBaseline="central" fontSize={15} fontWeight={700} fill="var(--text)">
                {v}
              </text>
            </g>
          ))}
          {diff !== 0 ? (
            <g>
              <line x1={px(Math.min(lhs, rhs))} x2={px(Math.max(lhs, rhs))} y1={106} y2={106} stroke={signVar(diff)} strokeWidth={4} strokeLinecap="round" />
              <text
                x={Math.min(Math.max((px(lhs) + px(rhs)) / 2, 80), 300)}
                y={146}
                textAnchor="middle"
                fontSize={13}
                fontWeight={700}
                fill={signVar(diff)}
              >
                LHS − RHS = {t(diff)}
              </text>
            </g>
          ) : (
            <text x={px(lhs)} y={146} textAnchor="middle" fontSize={13} fontWeight={700} fill={MUTED}>
              LHS − RHS = 0
            </text>
          )}
        </svg>
      </div>
      <div className="w-panel c5-stack">
        <div>
          <div className="w-label">The two sides</div>
          <div className="w-row" style={{gap: '2px 28px'}}>
            <Tex tex={`${col(HEX.lhs, '2(ax+by)')}=${lhs}`} />
            <Tex tex={`${col(HEX.rhs, '(a+b)(x+y)')}=${rhs}`} />
          </div>
        </div>
        <div>
          <div className="w-label">The difference, factorised</div>
          <Tex display tex={`\\text{LHS}-\\text{RHS}=(a-b)(x-y)`} />
          <Tex display tex={`=(${col(signHex(f1), n(f1))})(${col(signHex(f2), n(f2))})=${col(signHex(diff), n(diff))}`} />
        </div>
        <div className="c5-pills">
          <Pill colour={signVar(f1)}>
            a − b is {signWord(f1)}
          </Pill>
          <Pill colour={signVar(f2)}>
            x − y is {signWord(f2)}
          </Pill>
        </div>
        <div className="c5-verdict" style={{color: signVar(diff)}} aria-live="polite">
          LHS {rel(lhs, rhs)} RHS
        </div>
        <p className="w-note">{note}</p>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ 1-14 */

/** a² + 4b² − 4ab as the square (a − 2b)²: a map of its size over the (a, b) plane, zero exactly on a = 2b. */
export const SquareMap: React.FC = () => {
  const [a, setA] = useState(3);
  const [b, setB] = useState(-1);
  const lhs = a * a + 4 * b * b;
  const rhs = 4 * a * b;
  const side = a - 2 * b;
  const diff = side * side;
  const equal = Math.abs(side) < 1e-9;
  // map geometry: a from −6 to 6, b from −3 to 3, cells of 0.5 at the same scale on both axes
  const C = 13;
  const OX = 28;
  const OY = 8;
  const cx = (va: number) => OX + ((va + 6) / 0.5) * C + C / 2;
  const cy = (vb: number) => OY + ((3 - vb) / 0.5) * C + C / 2;
  const as = Array.from({length: 25}, (_, i) => -6 + i * 0.5);
  const bs = Array.from({length: 13}, (_, i) => 3 - i * 0.5);
  const SQ = 9; // px per unit for the little square picture
  return (
    <div className="w-grid">
      <Styles />
      <div className="c5-stack">
        <div className="c5-sliders">
          <Slider label="a" value={a} min={-6} max={6} step={0.5} onChange={setA} />
          <Slider label="b" value={b} min={-3} max={3} step={0.5} onChange={setB} />
        </div>
        <svg
          viewBox={`0 0 ${OX + 25 * C + 8} ${OY + 13 * C + 30}`}
          className="w-svg c5-svg"
          role="img"
          aria-label={`Map of (a − 2b) squared. Current point a = ${a}, b = ${b}, value ${t(diff)}`}
        >
          {bs.map((vb) =>
            as.map((va) => {
              const d = Math.abs(va - 2 * vb) / 12;
              return (
                <rect
                  key={`${va}:${vb}`}
                  className="c5-cell"
                  x={cx(va) - C / 2}
                  y={cy(vb) - C / 2}
                  width={C - 1}
                  height={C - 1}
                  rx={2}
                  fill={d === 0 ? 'rgba(124,242,156,0.5)' : `rgba(255,107,157,${(0.07 + 0.83 * d).toFixed(3)})`}
                  onClick={() => {
                    setA(va);
                    setB(vb);
                  }}
                />
              );
            }),
          )}
          <line x1={cx(-6)} y1={cy(-3)} x2={cx(6)} y2={cy(3)} stroke={POS} strokeWidth={2.5} strokeLinecap="round" pointerEvents="none" />
          <text x={cx(4.2)} y={cy(2.75)} textAnchor="end" fontSize={13} fontWeight={700} fill={POS} pointerEvents="none">
            a = 2b
          </text>
          {/* drop from the point to the line, horizontally: its length is |a − 2b| */}
          {!equal ? <line x1={cx(a)} y1={cy(b)} x2={cx(2 * b)} y2={cy(b)} stroke="#fff" strokeWidth={1.5} strokeDasharray="3 3" pointerEvents="none" /> : null}
          <circle cx={cx(a)} cy={cy(b)} r={7} fill={equal ? POS : '#fff'} stroke="var(--bg0)" strokeWidth={2.5} pointerEvents="none" />
          {[-6, -3, 0, 3, 6].map((v) => (
            <text key={v} x={cx(v)} y={OY + 13 * C + 14} textAnchor="middle" fontSize={12.5} fill={MUTED}>
              {t(v)}
            </text>
          ))}
          <text x={OX + (25 * C) / 2} y={OY + 13 * C + 28} textAnchor="middle" fontSize={13} fontWeight={700} fill="var(--text)">
            a
          </text>
          {[-3, 0, 3].map((v) => (
            <text key={v} x={OX - 6} y={cy(v)} textAnchor="end" dominantBaseline="central" fontSize={12.5} fill={MUTED}>
              {t(v)}
            </text>
          ))}
          <text x={6} y={cy(1.5)} dominantBaseline="central" fontSize={13} fontWeight={700} fill="var(--text)">
            b
          </text>
        </svg>
        <p className="w-note">
          Brighter pink means a bigger difference. Tap anywhere on the map, or use the sliders. The dashed line has length |a − 2b|.
        </p>
      </div>
      <div className="w-panel c5-stack">
        <dl className="c5-rows" style={{margin: 0}}>
          <dt style={{color: LHS}}>LHS</dt>
          <dd>
            <Tex tex={`a^2+4b^2=${n(a * a)}+${n(4 * b * b)}=${col(HEX.lhs, n(lhs))}`} />
          </dd>
          <dt style={{color: RHS}}>RHS</dt>
          <dd>
            <Tex tex={`4ab=${col(HEX.rhs, n(rhs))}`} />
          </dd>
          <dt>Gap</dt>
          <dd>
            <Tex tex={`(a-2b)^2=(${n(side)})^2=${col(equal ? HEX.pos : '#ff6b9d', n(diff))}`} />
          </dd>
        </dl>
        <div className="w-row" style={{gap: 16, flexWrap: 'nowrap', alignItems: 'center'}}>
          <svg viewBox="0 0 120 120" width={120} height={120} style={{flex: 'none'}} className="c5-svg" role="img" aria-label={`A square of side ${t(Math.abs(side))}`}>
            <rect x={0.5} y={0.5} width={119} height={119} rx={8} fill="none" stroke="rgba(255,255,255,0.12)" strokeDasharray="3 4" />
            {equal ? (
              <circle cx={6} cy={114} r={4} fill={POS} />
            ) : (
              <rect
                x={4}
                y={116 - Math.abs(side) * SQ}
                width={Math.abs(side) * SQ}
                height={Math.abs(side) * SQ}
                rx={3}
                fill="color-mix(in srgb, var(--pink) 35%, transparent)"
                stroke="var(--pink)"
                strokeWidth={2}
              />
            )}
          </svg>
          <div style={{minWidth: 0}}>
            <div className="w-label">Area = LHS − RHS</div>
            <div className="w-big" style={{color: equal ? POS : 'var(--accent)', lineHeight: 1.1}}>
              {t(diff)}
            </div>
            <p className="w-note">
              a square of side |a − 2b| = {t(Math.abs(side))}
            </p>
          </div>
        </div>
        <div className="c5-verdict" style={{color: equal ? POS : 'var(--text)', fontSize: '1.2rem'}} aria-live="polite">
          {equal ? 'a = 2b: equality holds, LHS = RHS' : `LHS > RHS  (a ≠ 2b)`}
        </div>
        <p className="w-note">
          {equal
            ? 'You are on the green line. The square has shrunk to a point: its area is 0, the smallest a square can be.'
            : 'An area is never negative, so the left-hand side can never drop below the right-hand side. Can you make the area 0?'}
        </p>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ 1-15 */

/** Two numbers on a number line and their squares as areas: order is kept for positives, not always for negatives. */
export const SquaresCompare: React.FC = () => {
  const [A, setA] = useState(2);
  const [B, setB] = useState(3.5);
  const [neg, setNeg] = useState(false);
  const min = neg ? -6 : 0.5;
  const toggle = () => {
    if (neg) {
      setA(Math.max(Math.abs(A), 0.5));
      setB(Math.max(Math.abs(B), 0.5));
    }
    setNeg(!neg);
  };
  const a2 = A * A;
  const b2 = B * B;
  const ordN = Math.sign(A - B);
  const ordS = Math.sign(a2 - b2);
  const bothPos = A > 0 && B > 0;
  const kept = ordN === ordS;
  const U = 13; // px per unit for the squares
  const lx = (v: number) => 180 + v * 26; // number line −6..6
  const BASE = 172;
  const verdict = kept ? 'Same order' : ordS === 0 ? 'The squares cannot tell them apart' : ordN === 0 ? 'Same order' : 'The order has flipped!';
  const note = bothPos
    ? 'Both numbers are positive, so they are side lengths: the longer side always makes the bigger square. Comparing squares is safe.'
    : kept
      ? 'The order happens to survive here, but with a negative number around there is no guarantee. Keep exploring.'
      : ordS === 0
        ? 'A and −A have the same square. Knowing the squares are equal does not tell you the numbers are equal.'
        : 'Squaring throws away the minus sign, so a number far below zero gets a big square. This is why a proof must say “both sides are positive” before comparing squares.';
  return (
    <div className="w-grid">
      <Styles />
      <div className="c5-stack">
        <div className="c5-sliders">
          <Slider label="A" colour={LHS} value={A} min={min} max={6} step={0.5} onChange={setA} />
          <Slider label="B" colour={RHS} value={B} min={min} max={6} step={0.5} onChange={setB} />
        </div>
        <div className="w-row" style={{gap: 10}}>
          <button type="button" className={`w-btn ${neg ? 'on' : ''}`} aria-pressed={neg} onClick={toggle}>
            {neg ? '✓ ' : ''}Allow negative numbers
          </button>
          <button
            type="button"
            className="w-btn"
            onClick={() => {
              setNeg(true);
              setA(-3);
              setB(2);
            }}
          >
            Try −3 and 2
          </button>
        </div>
        <svg viewBox="0 0 360 200" className="w-svg c5-svg" role="img" aria-label={`A = ${A}, B = ${B}; A squared = ${t(a2)}, B squared = ${t(b2)}`}>
          {/* number line */}
          <rect x={lx(-6)} y={22} width={lx(0) - lx(-6)} height={16} rx={4} fill={neg ? 'rgba(255,122,138,0.10)' : 'rgba(255,255,255,0.03)'} />
          <line x1={lx(-6)} x2={lx(6)} y1={30} y2={30} stroke="rgba(255,255,255,0.35)" strokeWidth={1.5} />
          {[-6, -4, -2, 0, 2, 4, 6].map((v) => (
            <g key={v} opacity={!neg && v < 0 ? 0.35 : 1}>
              <line x1={lx(v)} x2={lx(v)} y1={25} y2={35} stroke="rgba(255,255,255,0.35)" />
              <text x={lx(v)} y={52} textAnchor="middle" fontSize={12.5} fill={MUTED}>
                {t(v)}
              </text>
            </g>
          ))}
          {(
            [
              ['A', A, LHS, -1],
              ['B', B, RHS, 1],
            ] as const
          ).map(([name, v, c, side]) => (
            <g key={name} style={{transition: 'transform 0.15s'}}>
              <circle cx={lx(v)} cy={30} r={6.5} fill={c} stroke="var(--bg0)" strokeWidth={2} />
              <text x={lx(v) + (A === B ? side * 8 : 0)} y={15} textAnchor="middle" fontSize={14} fontWeight={700} fill={c}>
                {name}
              </text>
            </g>
          ))}
          {/* squares */}
          <line x1={20} x2={340} y1={BASE} y2={BASE} stroke="rgba(255,255,255,0.18)" />
          {(
            [
              ['A', A, a2, LHS, 96],
              ['B', B, b2, RHS, 264],
            ] as const
          ).map(([name, v, sq, c, mid]) => {
            const s = Math.max(Math.abs(v) * U, 1.5);
            return (
              <g key={name}>
                <rect x={mid - s / 2} y={BASE - s} width={s} height={s} rx={3} fill={`color-mix(in srgb, ${c} 28%, transparent)`} stroke={c} strokeWidth={2} />
                <text x={mid} y={BASE - s - 8} textAnchor="middle" fontSize={14} fontWeight={700} fill={c}>
                  {name}² = {t(sq)}
                </text>
                <text x={mid} y={BASE + 18} textAnchor="middle" fontSize={12.5} fill={MUTED}>
                  side |{name}| = {t(Math.abs(v))}
                </text>
              </g>
            );
          })}
          <text x={180} y={BASE - 26} textAnchor="middle" dominantBaseline="central" fontSize={30} fontWeight={700} fill={kept ? POS : NEG}>
            {rel(a2, b2)}
          </text>
        </svg>
      </div>
      <div className="w-panel c5-stack">
        <dl className="c5-rows" style={{margin: 0}}>
          <dt>Numbers</dt>
          <dd>
            <Tex tex={`${col(HEX.lhs, 'A')}${rel(A, B)}${col(HEX.rhs, 'B')}\\qquad ${n(A)}${rel(A, B)}${n(B)}`} />
          </dd>
          <dt>Squares</dt>
          <dd>
            <Tex tex={`${col(HEX.lhs, 'A^2')}${rel(a2, b2)}${col(HEX.rhs, 'B^2')}\\qquad ${n(a2)}${rel(a2, b2)}${n(b2)}`} />
          </dd>
        </dl>
        <div className="c5-pills">
          <Pill colour={bothPos ? POS : NEG}>{bothPos ? '✓ both positive' : '✗ not both positive'}</Pill>
        </div>
        <div className="c5-verdict" style={{color: kept ? POS : NEG}} aria-live="polite">
          {verdict}
        </div>
        <p className="w-note">{note}</p>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ 1-16 */

const Semicircle: React.FC = () => {
  const [a, setA] = useState(2);
  const [b, setB] = useState(8);
  const am = (a + b) / 2;
  const gm = Math.sqrt(a * b);
  const equal = a === b;
  const X0 = 20;
  const D = 320;
  const Y = 190;
  const k = D / (a + b); // px per unit: the diameter always fills the width
  const sx = X0 + a * k;
  const h = gm * k;
  const mid = X0 + D / 2;
  const R = D / 2;
  const gmRight = sx >= mid; // which side the GM label goes on
  return (
    <div className="w-grid">
      <div className="c5-stack">
        <svg viewBox="0 0 360 222" className="w-svg c5-svg" role="img" aria-label={`Semicircle on a diameter split into ${a} and ${b}. Radius ${t(am)}, half-chord ${t(gm)}`}>
          <path d={`M ${X0} ${Y} A ${R} ${R} 0 0 1 ${X0 + D} ${Y}`} fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.4)" strokeWidth={1.5} />
          {/* the two pieces of the diameter */}
          <line x1={X0} x2={sx} y1={Y} y2={Y} stroke="var(--pink)" strokeWidth={5} strokeLinecap="round" />
          <line x1={sx} x2={X0 + D} y1={Y} y2={Y} stroke="var(--violet)" strokeWidth={5} strokeLinecap="round" />
          <text x={(X0 + sx) / 2} y={Y + 23} textAnchor="middle" fontSize={15} fontWeight={700} fill="var(--pink)">
            a = {t(a)}
          </text>
          <text x={(sx + X0 + D) / 2} y={Y + 23} textAnchor="middle" fontSize={15} fontWeight={700} fill="var(--violet)">
            b = {t(b)}
          </text>
          {/* radius to the top of the chord: the hypotenuse of the right-angled triangle */}
          {!equal ? <line x1={mid} y1={Y} x2={sx} y2={Y - h} stroke={LHS} strokeWidth={1.5} strokeDasharray="4 4" opacity={0.8} /> : null}
          {/* radius = arithmetic mean */}
          <line x1={mid} y1={Y} x2={mid} y2={Y - R} stroke={LHS} strokeWidth={equal ? 7 : 3.5} strokeLinecap="round" opacity={equal ? 0.55 : 1} />
          {/* half-chord = geometric mean */}
          <line x1={sx} y1={Y} x2={sx} y2={Y - h} stroke={RHS} strokeWidth={3.5} strokeLinecap="round" />
          <circle cx={sx} cy={Y - h} r={4.5} fill={RHS} />
          <circle cx={sx} cy={Y} r={5.5} fill="#fff" stroke="var(--bg0)" strokeWidth={2} />
          <circle cx={mid} cy={Y} r={3} fill={LHS} />
          <text x={mid + (gmRight ? -9 : 9)} y={Y - R * 0.5} textAnchor={gmRight ? 'end' : 'start'} fontSize={14.5} fontWeight={700} fill={LHS}>
            AM = {t(am)}
          </text>
          <text
            x={equal ? mid + 9 : Math.min(Math.max(sx, 44), 316)}
            y={equal ? Y - R * 0.5 + 20 : Y - h - 11}
            textAnchor={equal ? 'start' : 'middle'}
            fontSize={14.5}
            fontWeight={700}
            fill={RHS}
          >
            GM = {t(gm)}
          </text>
        </svg>
        <div className="c5-sliders">
          <Slider label="a" colour="var(--pink)" value={a} min={0.5} max={10} step={0.5} onChange={setA} />
          <Slider label="b" colour="var(--violet)" value={b} min={0.5} max={10} step={0.5} onChange={setB} />
        </div>
        <div className="w-row" style={{gap: 10}}>
          <button type="button" className="w-btn" onClick={() => (setA(2), setB(8))}>
            2 and 8
          </button>
          <button type="button" className="w-btn" onClick={() => (setA(1), setB(9))}>
            1 and 9
          </button>
          <button type="button" className="w-btn" onClick={() => setB(a)}>
            Make b = a
          </button>
        </div>
      </div>
      <div className="w-panel c5-stack">
        <dl className="c5-rows" style={{margin: 0}}>
          <dt style={{color: LHS}}>AM</dt>
          <dd>
            <Tex tex={`\\dfrac{a+b}{2}=\\dfrac{${n(a)}+${n(b)}}{2}=${col(HEX.lhs, n(am))}`} />
          </dd>
          <dt style={{color: RHS}}>GM</dt>
          <dd>
            <Tex tex={`\\sqrt{ab}=\\sqrt{${n(a * b)}}${Number.isInteger(gm) ? '=' : '\\approx'}${col(HEX.rhs, n(gm))}`} />
          </dd>
          <dt>Gap</dt>
          <dd>
            <Tex tex={`\\text{AM}-\\text{GM}${Number.isInteger(gm) ? '=' : '\\approx'}${col(equal ? HEX.pos : '#ff6b9d', n(am - gm))}`} />
          </dd>
        </dl>
        <div className="c5-verdict" style={{color: equal ? POS : 'var(--text)', fontSize: '1.2rem'}} aria-live="polite">
          {equal ? 'a = b: equality, AM = GM' : 'AM > GM'}
        </div>
        <p className="w-note">
          {equal
            ? 'The split point sits at the centre, so the upright line is itself a radius. This is the only place the two means are equal.'
            : 'The dashed radius is the longest side of a right-angled triangle whose upright side is the half-chord. So the half-chord √(ab) can never be longer than the radius (a + b)/2.'}
        </p>
      </div>
    </div>
  );
};

const Rectangle: React.FC = () => {
  const [L, setL] = useState(70);
  const W = 100 - L;
  const area = L * W;
  const best = L === 50;
  const S = 1.7;
  // area-against-length curve
  const gx = (v: number) => 48 + v * 2.92;
  const gy = (v: number) => 172 - (v / 2500) * 140;
  const curve = Array.from({length: 101}, (_, i) => `${i === 0 ? 'M' : 'L'} ${gx(i).toFixed(1)} ${gy(i * (100 - i)).toFixed(1)}`).join(' ');
  return (
    <div className="w-grid">
      <div className="c5-stack">
        <svg viewBox="0 0 360 215" className="w-svg c5-svg" role="img" aria-label={`Rectangle ${L} by ${W} centimetres, area ${area} square centimetres`}>
          <rect
            x={190 - (L * S) / 2}
            y={100 - (W * S) / 2}
            width={L * S}
            height={W * S}
            rx={4}
            fill={best ? 'rgba(124,242,156,0.2)' : 'color-mix(in srgb, var(--pink) 22%, transparent)'}
            stroke={best ? POS : 'var(--pink)'}
            strokeWidth={2.5}
          />
          <text x={190} y={100 + (W * S) / 2 + 18} textAnchor="middle" fontSize={14} fontWeight={700} fill="var(--text)">
            L = {L}
          </text>
          <text x={190 - (L * S) / 2 - 8} y={100} textAnchor="end" dominantBaseline="central" fontSize={13} fontWeight={700} fill="var(--text)">
            W = {W}
          </text>
          {L * S > 76 && W * S > 26 ? (
            <text x={190} y={100} textAnchor="middle" dominantBaseline="central" fontSize={15} fontWeight={700} fill={best ? POS : 'var(--pink)'}>
              {area} cm²
            </text>
          ) : null}
        </svg>
        <Slider label="length L (cm)" value={L} min={1} max={99} onChange={setL} />
        <div className="w-row" style={{gap: 10}}>
          <Pill colour={MUTED}>perimeter 2L + 2W = 200</Pill>
          <Pill colour={MUTED}>L + W = 100</Pill>
        </div>
      </div>
      <div className="w-panel c5-stack">
        <svg viewBox="0 0 360 200" className="w-svg c5-svg" role="img" aria-label="Area plotted against length: a curve that peaks at 2500 when the length is 50">
          <line x1={gx(0)} x2={gx(100)} y1={gy(0)} y2={gy(0)} stroke="rgba(255,255,255,0.3)" />
          <line x1={gx(0)} x2={gx(0)} y1={gy(0)} y2={gy(2500) - 10} stroke="rgba(255,255,255,0.3)" />
          <line x1={gx(0)} x2={gx(100)} y1={gy(2500)} y2={gy(2500)} stroke={POS} strokeDasharray="5 5" opacity={0.8} />
          <text x={gx(0) - 6} y={gy(2500)} textAnchor="end" dominantBaseline="central" fontSize={13} fontWeight={700} fill={POS}>
            2500
          </text>
          <text x={gx(0) - 6} y={gy(0)} textAnchor="end" dominantBaseline="central" fontSize={13} fill={MUTED}>
            0
          </text>
          {[0, 50, 100].map((v) => (
            <text key={v} x={gx(v)} y={gy(0) + 15} textAnchor="middle" fontSize={13} fill={MUTED}>
              {v}
            </text>
          ))}
          <text x={gx(100)} y={gy(0) + 15} dx={-38} textAnchor="end" fontSize={13} fontWeight={700} fill="var(--text)">
            length L
          </text>
          <text x={gx(0) + 8} y={gy(2500) - 12} fontSize={13} fontWeight={700} fill="var(--text)">
            area
          </text>
          <path d={curve} fill="none" stroke="var(--pink)" strokeWidth={2.5} />
          <line x1={gx(L)} x2={gx(L)} y1={gy(0)} y2={gy(area)} stroke="rgba(255,255,255,0.45)" strokeDasharray="3 4" />
          {!best ? <line x1={gx(L)} x2={gx(L)} y1={gy(area)} y2={gy(2500)} stroke={NEG} strokeWidth={2} /> : null}
          <circle cx={gx(L)} cy={gy(area)} r={7} fill={best ? POS : '#fff'} stroke="var(--bg0)" strokeWidth={2.5} />
        </svg>
        <div className="w-row" style={{gap: '4px 16px', alignItems: 'baseline'}}>
          <span className="w-big" style={{color: best ? POS : 'var(--accent)'}}>
            {area}
          </span>
          <span className="w-note">cm² = {L} × {W}</span>
        </div>
        <Tex tex={`2500-LW=(L-50)^2=${col(best ? HEX.pos : HEX.neg, n((L - 50) ** 2))}`} />
        <p className="w-note" aria-live="polite">
          {best
            ? 'L = W = 50: the square. AM-GM says √(LW) ≤ (L + W)/2 = 50, so 2500 is the limit, and it is reached exactly when L = W.'
            : `The red line is how far short of 2500 you are: ${(L - 50) ** 2} cm². Slide towards the square to close it.`}
        </p>
      </div>
    </div>
  );
};

/** The semicircle picture of AM ≥ GM, and the fixed-perimeter rectangle it solves. */
export const AmGmLab: React.FC = () => (
  <div>
    <Styles />
    <h4 className="c5-sub">Two means in one semicircle</h4>
    <p className="w-note" style={{marginBottom: 14}}>
      Split a diameter into pieces a and b. The radius is the arithmetic mean; the upright line at the split is the geometric mean.
    </p>
    <Semicircle />
    <hr className="c5-rule" />
    <h4 className="c5-sub">The best rectangle with perimeter 200 cm</h4>
    <p className="w-note" style={{marginBottom: 14}}>
      The sum L + W is fixed at 100, so AM-GM puts a ceiling on the product LW. Find it.
    </p>
    <Rectangle />
  </div>
);

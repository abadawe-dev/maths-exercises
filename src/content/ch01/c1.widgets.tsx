import React, {useState} from 'react';
import {Tex} from '../../lib/Tex';

const binom = (n: number, k: number) => {
  let r = 1;
  for (let i = 1; i <= k; i++) r = (r * (n - k + i)) / i;
  return Math.round(r);
};
const fact = (n: number): number => (n <= 1 ? 1 : n * fact(n - 1));
const signed = (v: number) => (v < 0 ? `(${v})` : `${v}`);
const pow = (base: string, e: number) => (e === 0 ? '' : e === 1 ? base : `${base}^{${e}}`);

const Slider: React.FC<{label: string; value: number; min: number; max: number; onChange: (v: number) => void}> = ({
  label,
  value,
  min,
  max,
  onChange,
}) => (
  <div className="w-control">
    <label>
      <span>{label}</span>
      <output>{value}</output>
    </label>
    <input type="range" min={min} max={max} value={value} aria-label={label} onChange={(e) => onChange(Number(e.target.value))} />
  </div>
);

/** Pascal's triangle + a term-by-term expansion of (ax + b)^n. */
export const BinomialExplorer: React.FC = () => {
  const [n, setN] = useState(4);
  const [a, setA] = useState(3);
  const [b, setB] = useState(-2);
  const [r, setR] = useState(1);
  const rr = Math.min(r, n);
  const ROWS = 9;
  const S = 46;
  const W = ROWS * S;
  const ax = a === 1 ? 'x' : a === -1 ? '(-x)' : `(${a}x)`;
  const coef = binom(n, rr) * a ** (n - rr) * b ** rr;
  const expansion = Array.from({length: n + 1}, (_, k) => {
    const c = binom(n, k) * a ** (n - k) * b ** k;
    if (c === 0) return '';
    const mag = Math.abs(c) === 1 && n - k > 0 ? '' : `${Math.abs(c)}`;
    return `${c < 0 ? '-' : k === 0 ? '' : '+'}${mag}${pow('x', n - k)}`;
  }).join('');
  return (
    <div className="w-grid">
      <div>
        <div className="w-row">
          <Slider label="power n" value={n} min={1} max={8} onChange={setN} />
          <Slider label="a (coefficient of x)" value={a} min={-4} max={4} onChange={(v) => setA(v || 1)} />
          <Slider label="b (constant)" value={b} min={-4} max={4} onChange={(v) => setB(v || 1)} />
        </div>
        <svg viewBox={`0 0 ${W} ${ROWS * S * 0.9 + 10}`} className="w-svg" style={{maxWidth: 460, margin: '14px auto 0'}} role="img" aria-label={`Pascal's triangle with row ${n} highlighted`}>
          {Array.from({length: ROWS}, (_, row) =>
            Array.from({length: row + 1}, (_, k) => {
              const x = W / 2 + (k - row / 2) * S;
              const y = row * S * 0.9 + S / 2;
              const inRow = row === n;
              const picked = inRow && k === rr;
              return (
                <g key={`${row}-${k}`} onClick={() => inRow && setR(k)} style={{cursor: inRow ? 'pointer' : 'default'}}>
                  <circle
                    cx={x}
                    cy={y}
                    r={S * 0.42}
                    fill={picked ? 'var(--accent)' : inRow ? 'color-mix(in srgb, var(--accent) 22%, transparent)' : 'rgba(255,255,255,0.05)'}
                    stroke={inRow ? 'var(--accent)' : 'rgba(255,255,255,0.18)'}
                    strokeWidth={1.5}
                  />
                  <text x={x} y={y} textAnchor="middle" dominantBaseline="central" fontSize={15} fontWeight={700} fontFamily="var(--head)" fill={picked ? 'var(--bg0)' : inRow ? 'var(--text)' : 'var(--muted)'}>
                    {binom(row, k)}
                  </text>
                </g>
              );
            }),
          )}
        </svg>
        <p className="w-note" style={{textAlign: 'center'}}>
          Row {n} is highlighted. Tap one of its numbers to pick a term.
        </p>
      </div>
      <div style={{display: 'grid', gap: 14}}>
        <div className="w-panel">
          <div className="w-label">Expansion</div>
          <Tex tex={`(${a === 1 ? '' : a === -1 ? '-' : a}x${b < 0 ? b : '+' + b})^{${n}}`} />
          <div style={{marginTop: 8}}>
            <Tex tex={`=${expansion}`} />
          </div>
        </div>
        <div className="w-panel">
          <div className="w-label">
            Term with r = {rr} &nbsp;(tap the triangle to change)
          </div>
          <Tex display tex={`\\C{${n}}{${rr}}\\,${pow(ax, n - rr)}\\,${pow(signed(b), rr)}`} />
          <Tex display tex={`=${binom(n, rr)}\\times ${signed(a ** (n - rr))}${pow('x', n - rr)}\\times ${signed(b ** rr)}`} />
          <div className="w-row" style={{justifyContent: 'center'}}>
            <span className="w-big">
              <Tex tex={`${coef}${pow('x', n - rr)}`} />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

/** Count the arrangements behind a multinomial coefficient. */
export const MultinomialCounter: React.FC = () => {
  const [p, setP] = useState(4);
  const [q, setQ] = useState(3);
  const [r, setR] = useState(1);
  const n = p + q + r;
  const value = fact(n) / (fact(p) * fact(q) * fact(r));
  const letters = [...'a'.repeat(p), ...'b'.repeat(q), ...'c'.repeat(r)];
  const colour = {a: 'var(--cyan)', b: 'var(--pink)', c: 'var(--green)'} as Record<string, string>;
  return (
    <div className="w-grid">
      <div>
        <div className="w-row">
          <Slider label="p (number of a’s)" value={p} min={0} max={5} onChange={setP} />
          <Slider label="q (number of b’s)" value={q} min={0} max={5} onChange={setQ} />
          <Slider label="r (number of c’s)" value={r} min={0} max={5} onChange={setR} />
        </div>
        <div className="w-row" style={{gap: 8, marginTop: 16}} aria-label="letters to arrange">
          {letters.map((ch, i) => (
            <span
              key={i}
              style={{
                width: 40,
                height: 40,
                display: 'grid',
                placeItems: 'center',
                borderRadius: 11,
                border: `2px solid ${colour[ch]}`,
                background: `color-mix(in srgb, ${colour[ch]} 15%, transparent)`,
                color: colour[ch],
              }}
            >
              <Tex tex={ch} />
            </span>
          ))}
        </div>
        <p className="w-note" style={{marginTop: 10}}>
          One letter is picked from each of the {n} brackets. Every different order of these letters is one way to build
          the term.
        </p>
      </div>
      <div className="w-panel">
        <div className="w-label">Term in the expansion</div>
        <Tex display tex={`(a+b+c)^{${n}}\;\\longrightarrow\;${pow('a', p)}${pow('b', q)}${pow('c', r)}${n === 0 ? '1' : ''}`} />
        <Tex display tex={`\\frac{${n}!}{${p}!\\,${q}!\\,${r}!}=\\frac{${fact(n)}}{${fact(p)}\\times${fact(q)}\\times${fact(r)}}`} />
        <div className="w-row" style={{justifyContent: 'center'}}>
          <span className="w-big">{value}</span>
          <span className="w-note">arrangements = the coefficient</span>
        </div>
      </div>
    </div>
  );
};

/** Substitute a value of x into (1 + x)^n and watch the coefficients add up. */
export const SubstitutionLab: React.FC = () => {
  const [n, setN] = useState(5);
  const [x, setX] = useState(1);
  const terms = Array.from({length: n + 1}, (_, k) => binom(n, k) * x ** k);
  const total = terms.reduce((s, t) => s + t, 0);
  const xs = [1, -1, 2, -2];
  return (
    <div style={{display: 'grid', gap: 16}}>
      <div className="w-row">
        <Slider label="power n" value={n} min={1} max={8} onChange={setN} />
        <div className="w-row" role="group" aria-label="value of x">
          <span className="w-note">substitute</span>
          {xs.map((v) => (
            <button key={v} type="button" className={`w-btn ${x === v ? 'on' : ''}`} onClick={() => setX(v)}>
              x = {v}
            </button>
          ))}
        </div>
      </div>
      <div className="w-panel">
        <Tex display tex={`(1+x)^{${n}}=${Array.from({length: n + 1}, (_, k) => `\\C{${n}}{${k}}${pow('x', k)}`).join('+')}`} />
        <Tex
          display
          tex={`(1${x < 0 ? x : '+' + x})^{${n}}=${terms.map((t, k) => (k === 0 ? `${t}` : t < 0 ? `${t}` : `+${t}`)).join('')}`}
        />
        <div className="w-row" style={{justifyContent: 'center'}}>
          <span className="w-big">
            <Tex tex={`${signed(1 + x)}^{${n}}=${total}`} />
          </span>
        </div>
      </div>
      <p className="w-note">
        {x === 1
          ? 'With x = 1 every power of x is 1, so the coefficients simply add up to a power of 2.'
          : x === -1
            ? 'With x = −1 the signs alternate and everything cancels: the total is always 0.'
            : x === 2
              ? 'With x = 2 each coefficient is multiplied by a power of 2, and the total is a power of 3.'
              : 'With x = −2 the total is (−1)ⁿ: it flips between −1 and 1.'}
      </p>
    </div>
  );
};

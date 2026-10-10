import {MathNode, parse} from 'mathjs';

// Answer checking: a typed expression is compared with the reference by evaluating both
// at random points, so any algebraically equivalent form is accepted. Extra `rule`s then
// insist on a particular shape (expanded, simplified) where the question asks for one.
// "simplified" means: no fraction that can still be cancelled, and not much longer than the reference.

export type Rule = 'noParens' | 'simplified' | 'number';

/** Turn what a student types into something mathjs parses the way a mathematician reads it. */
export const normalise = (raw: string): string => {
  let s = raw
    .replace(/[−–—]/g, '-')
    .replace(/[×·⋅]/g, '*')
    .replace(/÷/g, '/')
    .replace(/²/g, '^2')
    .replace(/³/g, '^3')
    .replace(/⁴/g, '^4')
    .replace(/√/g, 'sqrt')
    .replace(/\*\*/g, '^')
    .replace(/\s+/g, ' ')
    .trim();
  // protect sqrt, then every letter is its own variable: ab -> a*b, 2x -> 2*x, x(x+1) -> x*(x+1)
  s = s.replace(/sqrt/gi, '§');
  s = s.replace(/([0-9a-zA-Z)])\s*(?=[a-zA-Z(§])/g, '$1*');
  s = s.replace(/\)\s*(?=[0-9])/g, ')*');
  s = s.replace(/§\*?/g, 'sqrt');
  return s;
};

export const tryParse = (raw: string): MathNode | null => {
  if (!raw.trim()) return null;
  try {
    return parse(normalise(raw));
  } catch {
    return null;
  }
};

const symbolsOf = (node: MathNode): Set<string> => {
  const out = new Set<string>();
  node.traverse((n: MathNode) => {
    const s = n as unknown as {isSymbolNode?: boolean; name: string};
    if (s.isSymbolNode && s.name !== 'sqrt') out.add(s.name);
  });
  return out;
};

/** Rough size of an expression: number of operators and function calls. */
export const complexity = (node: MathNode): number => {
  let c = 0;
  node.traverse((n: MathNode) => {
    const t = n as unknown as {isOperatorNode?: boolean; isFunctionNode?: boolean};
    if (t.isOperatorNode || t.isFunctionNode) c++;
  });
  return c;
};

// --- "Can a fraction in this still be cancelled?" -------------------------------------------
// Each product/quotient in the typed answer is gathered into one numerator and one denominator,
// both expanded to integer polynomials. They share a factor if their coefficients share a
// divisor, or if they share a polynomial factor, which is tested one variable at a time with
// the other variables replaced by fixed numbers and the gcd taken modulo a prime.

type Poly = Map<string, number>; // monomial key "a^1 x^2" -> integer coefficient
const LIMIT = 2 ** 40;

const keyOf = (m: Record<string, number>) =>
  Object.keys(m)
    .filter((v) => m[v])
    .sort()
    .map((v) => `${v}^${m[v]}`)
    .join(' ');
const monoOf = (key: string) => {
  const m: Record<string, number> = {};
  if (key) for (const part of key.split(' ')) m[part.split('^')[0]] = Number(part.split('^')[1]);
  return m;
};
const constPoly = (c: number): Poly => (c === 0 ? new Map() : new Map([['', c]]));
const addPoly = (a: Poly, b: Poly, sign = 1): Poly => {
  const out = new Map(a);
  for (const [k, c] of b) {
    const v = (out.get(k) ?? 0) + sign * c;
    if (v) out.set(k, v);
    else out.delete(k);
  }
  return out;
};
const mulPoly = (a: Poly, b: Poly): Poly | null => {
  const out: Poly = new Map();
  for (const [ka, ca] of a) {
    for (const [kb, cb] of b) {
      const m = monoOf(ka);
      for (const [v, e] of Object.entries(monoOf(kb))) m[v] = (m[v] ?? 0) + e;
      const k = keyOf(m);
      const c = (out.get(k) ?? 0) + ca * cb;
      if (Math.abs(c) > LIMIT) return null;
      if (c) out.set(k, c);
      else out.delete(k);
    }
  }
  return out.size > 400 ? null : out;
};
const powPoly = (a: Poly, n: number): Poly | null => {
  let out: Poly | null = constPoly(1);
  for (let i = 0; i < n && out; i++) out = mulPoly(out, a);
  return out;
};

type Any = {
  type: string;
  op?: string;
  fn?: string;
  args?: MathNode[];
  content?: MathNode;
  value?: unknown;
  name?: string;
};
const smallPower = (n: MathNode): number | null => {
  const e = n as unknown as Any;
  if (e.type === 'ParenthesisNode') return smallPower(e.content!);
  const v = e.type === 'ConstantNode' ? Number(e.value) : NaN;
  return Number.isInteger(v) && v >= 0 && v <= 12 ? v : null;
};

/** Expand to an integer polynomial, or null if the node is not one (a fraction, a root, a decimal). */
const toPoly = (node: MathNode): Poly | null => {
  const n = node as unknown as Any;
  if (n.type === 'ParenthesisNode') return toPoly(n.content!);
  if (n.type === 'ConstantNode') {
    const v = Number(n.value);
    return Number.isInteger(v) && Math.abs(v) < LIMIT ? constPoly(v) : null;
  }
  if (n.type === 'SymbolNode') return new Map([[`${n.name}^1`, 1]]);
  if (n.type !== 'OperatorNode') return null;
  const args = n.args!.map(toPoly);
  if (n.fn === 'unaryMinus') return args[0] && addPoly(new Map(), args[0], -1);
  if (n.fn === 'unaryPlus') return args[0];
  if (n.op === '^') {
    const e = smallPower(n.args![1]);
    return args[0] && e !== null ? powPoly(args[0], e) : null;
  }
  if (args.some((a) => !a)) return null;
  if (n.op === '+') return addPoly(args[0]!, args[1]!);
  if (n.op === '-') return addPoly(args[0]!, args[1]!, -1);
  if (n.op === '*') return mulPoly(args[0]!, args[1]!);
  return null;
};

/** Write a product/quotient as [numerator, denominator]. */
const toFraction = (node: MathNode): [Poly, Poly] | null => {
  const n = node as unknown as Any;
  if (n.type === 'ParenthesisNode') return toFraction(n.content!);
  if (n.type === 'OperatorNode' && (n.op === '*' || n.op === '/') && n.args!.length === 2) {
    const a = toFraction(n.args![0]);
    const b = toFraction(n.args![1]);
    if (!a || !b) return null;
    const num = mulPoly(a[0], n.op === '*' ? b[0] : b[1]);
    const den = mulPoly(a[1], n.op === '*' ? b[1] : b[0]);
    return num && den ? [num, den] : null;
  }
  if (n.type === 'OperatorNode' && n.fn === 'unaryMinus') {
    const a = toFraction(n.args![0]);
    return a && [addPoly(new Map(), a[0], -1), a[1]];
  }
  if (n.type === 'OperatorNode' && n.op === '^') {
    const a = toFraction(n.args![0]);
    const e = smallPower(n.args![1]);
    if (!a || e === null) return null;
    const num = powPoly(a[0], e);
    const den = powPoly(a[1], e);
    return num && den ? [num, den] : null;
  }
  const p = toPoly(node);
  return p && [p, constPoly(1)];
};

const gcdInt = (a: number, b: number): number => (b ? gcdInt(b, a % b) : Math.abs(a));
const contentOf = (p: Poly) => [...p.values()].reduce(gcdInt, 0);

const PRIME = 33554393; // below 2^25, so products of residues stay exact in a double
const modMul = (a: number, b: number) => (a * b) % PRIME;
const modPow = (a: number, e: number) => {
  let r = 1;
  for (; e > 0; e >>= 1, a = modMul(a, a)) if (e & 1) r = modMul(r, a);
  return r;
};
/** Coefficients (lowest power first, mod PRIME) of p as a polynomial in `v`, other variables fixed. */
const restrict = (p: Poly, v: string, values: Record<string, number>): number[] => {
  const out: number[] = [];
  for (const [k, c] of p) {
    const m = monoOf(k);
    let term = ((c % PRIME) + PRIME) % PRIME;
    for (const [w, e] of Object.entries(m)) if (w !== v) term = modMul(term, modPow(values[w], e));
    const d = m[v] ?? 0;
    while (out.length <= d) out.push(0);
    out[d] = (out[d] + term) % PRIME;
  }
  while (out.length && out[out.length - 1] === 0) out.pop();
  return out;
};
const gcdDegree = (a: number[], b: number[]): number => {
  while (b.length) {
    const inv = modPow(b[b.length - 1], PRIME - 2);
    a = [...a];
    while (a.length >= b.length) {
      const q = modMul(a[a.length - 1], inv);
      const shift = a.length - b.length;
      for (let i = 0; i < b.length; i++) a[i + shift] = (a[i + shift] - modMul(q, b[i]) + PRIME) % PRIME;
      while (a.length && a[a.length - 1] === 0) a.pop();
    }
    [a, b] = [b, a];
  }
  return a.length - 1;
};
const shareFactor = (num: Poly, den: Poly): boolean => {
  if (!num.size || !den.size) return false;
  if (gcdInt(contentOf(num), contentOf(den)) > 1) return true;
  const vars = new Set<string>();
  for (const p of [num, den]) for (const k of p.keys()) Object.keys(monoOf(k)).forEach((v) => vars.add(v));
  for (const v of vars) {
    // two different substitutions must agree, so an unlucky choice of numbers cannot raise a false alarm
    const hit = [0, 1].every((round) => {
      const values: Record<string, number> = {};
      [...vars].forEach((w, i) => (values[w] = 1009 + 7919 * (i + 1) + 104729 * round * (i + 2)));
      return gcdDegree(restrict(num, v, values), restrict(den, v, values)) >= 1;
    });
    if (hit) return true;
  }
  return false;
};

/** True when some fraction in the expression, as written, still has a common factor top and bottom. */
export const canCancel = (node: MathNode): boolean => {
  let found = false;
  node.traverse((n: MathNode) => {
    const t = n as unknown as Any;
    if (found || t.type !== 'OperatorNode' || (t.op !== '/' && t.op !== '*')) return;
    const f = toFraction(n);
    if (f && shareFactor(f[0], f[1])) found = true;
  });
  return found;
};

// Deterministic sample points: awkward non-integers, so accidental agreement is not a worry.
const POINTS = [1.37, 2.19, 0.73, 3.41, 1.93, 2.77, 0.58, 4.13];
const sample = (vars: string[], k: number, positive: boolean) => {
  const scope: Record<string, number> = {};
  vars.forEach((v, i) => {
    const x = POINTS[(k * 3 + i * 5 + v.charCodeAt(0)) % POINTS.length] + 0.11 * i + 0.07 * k;
    scope[v] = !positive && (k + i) % 3 === 2 ? -x : x;
  });
  return scope;
};

export type Verdict =
  | {ok: true}
  | {ok: false; reason: 'empty' | 'syntax' | 'unknown' | 'wrong' | 'form'; message: string};

export const check = (raw: string, answer: string, rule?: Rule): Verdict => {
  if (!raw.trim()) return {ok: false, reason: 'empty', message: 'Type an answer first.'};
  const got = tryParse(raw);
  const want = tryParse(answer);
  if (!want) throw new Error(`Bad reference answer: ${answer}`);
  if (!got) {
    return {
      ok: false,
      reason: 'syntax',
      message: 'I could not read that. Check your brackets, and use ^ for powers and / for fractions.',
    };
  }
  const wantVars = [...symbolsOf(want)].sort();
  const extra = [...symbolsOf(got)].filter((v) => !wantVars.includes(v));
  if (rule === 'number' && symbolsOf(got).size) {
    return {ok: false, reason: 'form', message: 'The answer should be a number, with no letters.'};
  }
  if (extra.length) {
    return {
      ok: false,
      reason: 'unknown',
      message: `The answer should not contain ${extra.map((e) => `“${e}”`).join(', ')}.`,
    };
  }
  const positive = /sqrt/.test(normalise(answer)) || /sqrt/.test(normalise(raw));
  let compared = 0;
  for (let k = 0; k < 10; k++) {
    const scope = sample(wantVars, k, positive);
    let a: number, b: number;
    try {
      a = Number(want.evaluate({...scope}));
      b = Number(got.evaluate({...scope}));
    } catch {
      return {ok: false, reason: 'syntax', message: 'I could not work that out. Check what you typed.'};
    }
    if (!Number.isFinite(a)) continue;
    compared++;
    if (!Number.isFinite(b) || Math.abs(a - b) > 1e-7 * Math.max(1, Math.abs(a))) {
      return {ok: false, reason: 'wrong', message: 'Not quite. Check your working and try again.'};
    }
  }
  if (compared < 3) throw new Error(`Could not evaluate reference answer: ${answer}`);
  if (rule === 'noParens' && /[()]/.test(raw)) {
    return {
      ok: false,
      reason: 'form',
      message: 'That is equal to the answer, but expand it fully: no brackets should be left.',
    };
  }
  if (rule === 'simplified' && canCancel(got)) {
    return {
      ok: false,
      reason: 'form',
      message: 'That is equal to the answer, but a fraction in it can still be cancelled down.',
    };
  }
  if (rule === 'simplified' && complexity(got) > complexity(want) + 2) {
    return {
      ok: false,
      reason: 'form',
      message: 'That is equal to the answer, but it can be simplified further.',
    };
  }
  return {ok: true};
};

const isNum = (n: MathNode) => (n as unknown as {isConstantNode?: boolean}).isConstantNode === true;

/** TeX for a live preview of what the student has typed. */
export const previewTex = (raw: string): string | null => {
  const node = tryParse(raw);
  if (!node) return null;
  try {
    return node.toTex({
      parenthesis: 'keep',
      handler: (n: MathNode, options: object) => {
        const op = n as unknown as {isOperatorNode?: boolean; op: string; args: MathNode[]};
        if (op.isOperatorNode && op.op === '*' && op.args.length === 2) {
          const [l, r] = op.args.map((a) => a.toTex(options));
          // juxtapose (2x, ab) unless that would glue two numbers together
          return isNum(op.args[1]) ? `${l}\\times ${r}` : `${l}\\,${r}`;
        }
        const sym = n as unknown as {isSymbolNode?: boolean; name: string};
        if (sym.isSymbolNode) return sym.name;
        return undefined;
      },
    });
  } catch {
    return null;
  }
};

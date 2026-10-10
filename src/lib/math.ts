import {MathNode, parse} from 'mathjs';

// Answer checking: a typed expression is compared with the reference by evaluating both
// at random points, so any algebraically equivalent form is accepted. Extra `rule`s then
// insist on a particular shape (expanded, simplified) where the question asks for one.

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

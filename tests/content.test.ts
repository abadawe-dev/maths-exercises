import {describe, expect, it} from 'vitest';
import {concepts} from '../src/content/ch01';
import {check, normalise} from '../src/lib/math';
import {assertTex, splitRich} from '../src/lib/Tex';

// Every rich string must be valid KaTeX, and every reference answer must pass its own checker.
const checkRich = (text: string, where: string) => {
  for (const p of splitRich(text)) {
    if (p.kind === 'math' || p.kind === 'display') {
      try {
        assertTex(p.value);
      } catch (e) {
        throw new Error(`${where}: bad TeX "${p.value}": ${(e as Error).message}`);
      }
    } else if (p.value.includes('$')) {
      throw new Error(`${where}: stray "$" in "${p.value}"`);
    }
  }
};

describe('answer checker', () => {
  it('accepts equivalent forms', () => {
    expect(check('(x+2)(x-2)', 'x^2-4').ok).toBe(true);
    expect(check('x²−4', 'x^2-4').ok).toBe(true);
    expect(check('2ab + b^2', 'b(2a+b)').ok).toBe(true);
    expect(check('(x-1)/x', '1-1/x').ok).toBe(true);
    expect(check('sqrt(ab)', 'sqrt(a*b)').ok).toBe(true);
    expect(check('x(x+1)', 'x^2+x').ok).toBe(true);
    expect(check('1/2', '0.5', 'number').ok).toBe(true);
  });
  it('rejects wrong answers and wrong forms', () => {
    expect(check('x^2+4', 'x^2-4').ok).toBe(false);
    expect(check('(x+1)^2', 'x^2+2x+1', 'noParens').ok).toBe(false);
    expect(check('x^2+2x+1', 'x^2+2x+1', 'noParens').ok).toBe(true);
    expect(check('(x^2-4)/((3x+1)(x+2))', '(x-2)/(3x+1)', 'simplified').ok).toBe(false);
    expect(check('2y', '2x').ok).toBe(false);
    expect(check('2x+', '2x').ok).toBe(false);
  });
  it('reads implicit multiplication', () => {
    expect(normalise('2x(x+1)')).toBe('2*x*(x+1)');
    expect(normalise('ab')).toBe('a*b');
    expect(normalise('√(ab)')).toBe('sqrt(a*b)');
  });
});

for (const c of concepts) {
  describe(`concept ${c.number}: ${c.title}`, () => {
    it('has unique exercise ids', () => {
      const ids = c.lessons.flatMap((l) => l.exercises.map((e) => e.id));
      expect(new Set(ids).size).toBe(ids.length);
    });
    for (const l of c.lessons) {
      it(`lesson ${l.id} text is valid`, () => {
        checkRich(l.blurb, `${l.id} blurb`);
        l.ideas.forEach((i) => i.body.forEach((b) => checkRich(b, `${l.id} idea "${i.title}"`)));
        if (l.widget) checkRich(l.widget.blurb, `${l.id} widget`);
        expect(l.exercises.length).toBeGreaterThanOrEqual(5);
      });
      for (const ex of l.exercises) {
        it(`${l.id} / ${ex.id}`, () => {
          const w = `${l.id}/${ex.id}`;
          checkRich(ex.prompt, w);
          ex.hints?.forEach((h) => checkRich(h, `${w} hint`));
          expect(ex.solution.length).toBeGreaterThan(0);
          ex.solution.forEach((s) => checkRich(s, `${w} solution`));
          if (ex.type === 'input') {
            expect(ex.fields.length).toBeGreaterThan(0);
            for (const f of ex.fields) {
              if (f.label) checkRich(f.label, `${w} label`);
              const v = check(f.answer, f.answer, f.rule);
              expect(v.ok, `${w}.${f.key}: reference answer "${f.answer}" fails its own check`).toBe(true);
              expect(check('12345', f.answer, f.rule).ok, `${w}.${f.key}: accepts a wrong answer`).toBe(false);
            }
          } else if (ex.type === 'choice') {
            ex.options.forEach((o) => checkRich(o, `${w} option`));
            ex.feedback?.forEach((o) => checkRich(o, `${w} feedback`));
            expect(ex.correct).toBeGreaterThanOrEqual(0);
            expect(ex.correct).toBeLessThan(ex.options.length);
            expect(new Set(ex.options).size).toBe(ex.options.length);
            if (ex.feedback) expect(ex.feedback.length).toBe(ex.options.length);
          } else {
            expect(ex.steps.length).toBeGreaterThan(1);
            for (const s of ex.steps) {
              checkRich(s.goal, `${w} goal`);
              if (s.why) checkRich(s.why, `${w} why`);
              s.options.forEach((o) => checkRich(o, `${w} step option`));
              expect(s.options.length).toBeGreaterThanOrEqual(2);
              expect(s.correct).toBeLessThan(s.options.length);
              expect(new Set(s.options).size).toBe(s.options.length);
            }
          }
        });
      }
    }
  });
}

import React, {useId, useMemo, useRef, useState} from 'react';
import {check, previewTex, Verdict} from './math';
import {isSolved, markSolved, useSolved} from './progress';
import {Rich, Tex} from './Tex';
import type {ChoiceExercise, Exercise, Field, InputExercise, ProofExercise} from './types';

const LEVEL = {warmup: 'Warm-up', practice: 'Practice', challenge: 'Challenge'} as const;
const KEYS: [string, string][] = [
  ['x²', '^2'],
  ['xⁿ', '^'],
  ['( )', '()'],
  ['÷', '/'],
  ['√', 'sqrt()'],
  ['−', '-'],
];

/** One answer box with a live typeset preview and a small symbol keypad. */
const MathField: React.FC<{
  field: Field;
  value: string;
  verdict?: Verdict;
  disabled: boolean;
  onChange: (v: string) => void;
  onEnter: () => void;
}> = ({field, value, verdict, disabled, onChange, onEnter}) => {
  const ref = useRef<HTMLInputElement>(null);
  const id = useId();
  const tex = useMemo(() => previewTex(value), [value]);
  const insert = (snippet: string) => {
    const el = ref.current;
    if (!el) return;
    const start = el.selectionStart ?? value.length;
    const end = el.selectionEnd ?? value.length;
    onChange(value.slice(0, start) + snippet + value.slice(end));
    const caret = start + (snippet.endsWith('()') ? snippet.length - 1 : snippet.length);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(caret, caret);
    });
  };
  const state = verdict ? (verdict.ok ? 'right' : 'wrong') : '';
  return (
    <div className={`field ${state}`}>
      <label htmlFor={id} className="field-label">
        {field.label ? <Rich text={field.label} /> : 'Answer'}
      </label>
      <div className="field-main">
        <input
          id={id}
          ref={ref}
          value={value}
          disabled={disabled}
          placeholder={field.placeholder ?? 'type here, e.g. 3x^2 - 2x'}
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          inputMode="text"
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onEnter()}
          aria-invalid={state === 'wrong'}
        />
        <div className="preview" aria-live="polite">
          {value.trim() === '' ? (
            <span className="muted">preview</span>
          ) : tex ? (
            <Tex tex={tex} />
          ) : (
            <span className="muted">…</span>
          )}
        </div>
      </div>
      {!disabled ? (
        <div className="keypad" aria-label="Symbol keys">
          {KEYS.map(([label, snippet]) => (
            <button key={label} type="button" tabIndex={-1} onClick={() => insert(snippet)}>
              {label}
            </button>
          ))}
        </div>
      ) : null}
      {verdict && !verdict.ok && verdict.reason !== 'empty' ? <p className="field-msg">{verdict.message}</p> : null}
    </div>
  );
};

const InputBody: React.FC<{ex: InputExercise; done: boolean; onSolved: () => void}> = ({ex, done, onSolved}) => {
  const [values, setValues] = useState<Record<string, string>>({});
  const [verdicts, setVerdicts] = useState<Record<string, Verdict>>({});
  const submit = () => {
    const next: Record<string, Verdict> = {};
    for (const f of ex.fields) next[f.key] = check(values[f.key] ?? '', f.answer, f.rule);
    setVerdicts(next);
    if (Object.values(next).every((v) => v.ok)) onSolved();
  };
  const allRight = ex.fields.every((f) => verdicts[f.key]?.ok);
  return (
    <>
      <div className={`fields ${ex.fields.length > 1 ? 'multi' : ''}`}>
        {ex.fields.map((f) => (
          <MathField
            key={f.key}
            field={f}
            value={values[f.key] ?? ''}
            verdict={verdicts[f.key]}
            disabled={allRight}
            onChange={(v) => {
              setValues((s) => ({...s, [f.key]: v}));
              setVerdicts((s) => {
                const {[f.key]: _drop, ...rest} = s;
                return rest;
              });
            }}
            onEnter={submit}
          />
        ))}
      </div>
      {allRight ? (
        <p className="verdict right">✓ Correct{done ? '' : '!'}</p>
      ) : (
        <button type="button" className="btn primary" onClick={submit}>
          Check
        </button>
      )}
    </>
  );
};

const ChoiceBody: React.FC<{ex: ChoiceExercise; onSolved: () => void}> = ({ex, onSolved}) => {
  const [picked, setPicked] = useState<number | null>(null);
  const [wrong, setWrong] = useState<number[]>([]);
  const solved = picked === ex.correct;
  const pick = (i: number) => {
    if (solved) return;
    setPicked(i);
    if (i === ex.correct) onSolved();
    else setWrong((w) => (w.includes(i) ? w : [...w, i]));
  };
  return (
    <>
      <div className="options" role="group" aria-label="Answer options">
        {ex.options.map((o, i) => (
          <button
            key={i}
            type="button"
            className={`option ${solved && i === ex.correct ? 'right' : ''} ${wrong.includes(i) ? 'wrong' : ''}`}
            disabled={solved || wrong.includes(i)}
            onClick={() => pick(i)}
          >
            <span className="option-key">{String.fromCharCode(65 + i)}</span>
            <span>
              <Rich text={o} />
            </span>
          </button>
        ))}
      </div>
      {picked !== null ? (
        <p className={`verdict ${solved ? 'right' : 'wrong'}`}>
          {solved ? '✓ Correct. ' : '✗ Not that one. '}
          {ex.feedback?.[picked] ? <Rich text={ex.feedback[picked]} /> : null}
        </p>
      ) : null}
    </>
  );
};

const ProofBody: React.FC<{ex: ProofExercise; onSolved: () => void}> = ({ex, onSolved}) => {
  const [at, setAt] = useState(0);
  const [wrong, setWrong] = useState<number[]>([]);
  // Shuffle each step's options once, so the right line is not always in the same place.
  const orders = useMemo(
    () =>
      ex.steps.map((s, si) => {
        const idx = s.options.map((_, i) => i);
        let seed = ex.id.length * 31 + si * 17 + s.options.length;
        for (let i = idx.length - 1; i > 0; i--) {
          seed = (seed * 1103515245 + 12345) & 0x7fffffff;
          const j = seed % (i + 1);
          [idx[i], idx[j]] = [idx[j], idx[i]];
        }
        return idx;
      }),
    [ex],
  );
  const finished = at >= ex.steps.length;
  const pick = (i: number) => {
    const step = ex.steps[at];
    if (i === step.correct) {
      setWrong([]);
      if (at + 1 >= ex.steps.length) onSolved();
      setAt(at + 1);
    } else {
      setWrong((w) => [...w, i]);
    }
  };
  return (
    <div className="proof">
      <ol className="proof-lines">
        {ex.steps.slice(0, at).map((s, i) => (
          <li key={i}>
            <div className="proof-line">
              <Rich text={s.options[s.correct]} />
            </div>
            {s.why ? (
              <div className="proof-why">
                <Rich text={s.why} />
              </div>
            ) : null}
          </li>
        ))}
      </ol>
      {finished ? (
        <p className="verdict right">✓ Complete.</p>
      ) : (
        <div className="proof-step">
          <p className="proof-goal">
            <span className="step-count">
              Step {at + 1} of {ex.steps.length}
            </span>
            <Rich text={ex.steps[at].goal} />
          </p>
          <div className="options">
            {orders[at].map((i) => (
              <button
                key={i}
                type="button"
                className={`option ${wrong.includes(i) ? 'wrong' : ''}`}
                disabled={wrong.includes(i)}
                onClick={() => pick(i)}
              >
                <span>
                  <Rich text={ex.steps[at].options[i]} />
                </span>
              </button>
            ))}
          </div>
          {wrong.length ? <p className="verdict wrong">✗ That line does not follow. Try another.</p> : null}
        </div>
      )}
    </div>
  );
};

export const ExerciseCard: React.FC<{conceptId: string; ex: Exercise; index: number}> = ({conceptId, ex, index}) => {
  const store = useSolved();
  const done = isSolved(store, conceptId, ex.id);
  const [hints, setHints] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const onSolved = () => markSolved(conceptId, ex.id);
  return (
    <article className={`exercise ${done ? 'done' : ''} level-${ex.level}`} id={`ex-${ex.id}`}>
      <header className="exercise-head">
        <span className="exercise-num">{done ? '✓' : index}</span>
        <span className={`chip chip-${ex.level}`}>{LEVEL[ex.level]}</span>
        {ex.source ? <span className="exercise-source">{ex.source}</span> : null}
      </header>
      <div className="exercise-prompt">
        <Rich text={ex.prompt} />
      </div>
      {ex.type === 'input' ? (
        <InputBody ex={ex} done={done} onSolved={onSolved} />
      ) : ex.type === 'choice' ? (
        <ChoiceBody ex={ex} onSolved={onSolved} />
      ) : (
        <ProofBody ex={ex} onSolved={onSolved} />
      )}
      <footer className="exercise-foot">
        {ex.hints && hints < ex.hints.length ? (
          <button type="button" className="btn ghost" onClick={() => setHints(hints + 1)}>
            {hints === 0 ? 'Hint' : 'Another hint'} ({ex.hints.length - hints} left)
          </button>
        ) : null}
        <button type="button" className="btn ghost" aria-expanded={showSolution} onClick={() => setShowSolution(!showSolution)}>
          {showSolution ? 'Hide solution' : 'Show solution'}
        </button>
      </footer>
      {hints > 0 ? (
        <ul className="hints">
          {ex.hints!.slice(0, hints).map((h, i) => (
            <li key={i}>
              <Rich text={h} />
            </li>
          ))}
        </ul>
      ) : null}
      {showSolution ? (
        <div className="solution">
          <div className="solution-title">Worked solution</div>
          {ex.solution.map((line, i) => (
            <p key={i}>
              <Rich text={line} />
            </p>
          ))}
        </div>
      ) : null}
    </article>
  );
};

import React from 'react';
import {isSolved, useSolved} from './progress';
import type {Concept} from './types';

export const Ring: React.FC<{value: number; size?: number; label?: string}> = ({value, size = 64, label}) => {
  const r = size / 2 - 5;
  const c = 2 * Math.PI * r;
  return (
    <svg className="ring" width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={label ?? `${Math.round(value * 100)}% complete`}>
      <circle cx={size / 2} cy={size / 2} r={r} className="ring-track" />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        className="ring-value"
        strokeDasharray={c}
        strokeDashoffset={c * (1 - value)}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      <text x="50%" y="50%" dominantBaseline="central" textAnchor="middle" className="ring-text">
        {Math.round(value * 100)}%
      </text>
    </svg>
  );
};

export const useConceptProgress = (c: Concept) => {
  const store = useSolved();
  const all = c.lessons.flatMap((l) => l.exercises);
  const solved = all.filter((e) => isSolved(store, c.id, e.id)).length;
  return {solved, total: all.length, value: all.length ? solved / all.length : 0};
};

const ConceptCard: React.FC<{c: Concept}> = ({c}) => {
  const p = useConceptProgress(c);
  return (
    <a className="concept-card" data-accent={c.accent} href={`#/${c.id}`}>
      <div className="concept-card-top">
        <span className="concept-num">Concept {c.number}</span>
        <Ring value={p.value} size={58} />
      </div>
      <h2>{c.title}</h2>
      <p>{c.tagline}</p>
      <ul className="lesson-tags">
        {c.lessons.map((l) => (
          <li key={l.id}>
            <span>{l.id}</span> {l.title}
          </li>
        ))}
      </ul>
      <div className="concept-card-foot">
        <span>
          {p.solved} / {p.total} solved
        </span>
        <span className="go">{p.solved ? 'Continue' : 'Start'} →</span>
      </div>
    </a>
  );
};

export const Home: React.FC<{concepts: Concept[]}> = ({concepts}) => {
  const store = useSolved();
  const total = concepts.reduce((n, c) => n + c.lessons.reduce((m, l) => m + l.exercises.length, 0), 0);
  const solved = concepts.reduce(
    (n, c) => n + c.lessons.reduce((m, l) => m + l.exercises.filter((e) => isSolved(store, c.id, e.id)).length, 0),
    0,
  );
  return (
    <main className="home">
      <header className="hero">
        <p className="kicker">Grade 11 Mathematics · Chapter 1</p>
        <h1>
          Algebraic <span>Proofs</span>
        </h1>
        <p className="hero-sub">
          Watch the idea, then make it yours. Explore each concept with interactive tools and practise with exercises
          that check your working, give hints, and show full solutions.
        </p>
        <div className="hero-stats">
          <div>
            <strong>{concepts.length}</strong> concepts
          </div>
          <div>
            <strong>{concepts.reduce((n, c) => n + c.lessons.length, 0)}</strong> lessons
          </div>
          <div>
            <strong>{total}</strong> exercises
          </div>
          <div>
            <strong>{solved}</strong> solved by you
          </div>
        </div>
      </header>
      <section className="concept-grid" aria-label="Concepts">
        {concepts.map((c) => (
          <ConceptCard key={c.id} c={c} />
        ))}
      </section>
      <section className="howto">
        <h2>How to type maths</h2>
        <div className="howto-grid">
          <div>
            <code>x^2</code> <span>powers</span>
          </div>
          <div>
            <code>(x+2)/(x-1)</code> <span>fractions: bracket the top and bottom</span>
          </div>
          <div>
            <code>3ab</code> or <code>3*a*b</code> <span>multiplication</span>
          </div>
          <div>
            <code>sqrt(ab)</code> <span>square roots</span>
          </div>
        </div>
        <p className="muted">Any correct equivalent form is accepted unless the question asks for a particular one.</p>
      </section>
    </main>
  );
};

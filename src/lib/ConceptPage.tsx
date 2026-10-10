import React from 'react';
import {ExerciseCard} from './Exercise';
import {Ring, useConceptProgress} from './Home';
import {isSolved, resetConcept, useSolved} from './progress';
import {Rich} from './Tex';
import type {Concept, Lesson} from './types';

const LessonSection: React.FC<{concept: Concept; lesson: Lesson}> = ({concept, lesson}) => (
  <section className="lesson" id={`lesson-${lesson.id}`}>
    <header className="lesson-head">
      <span className="lesson-badge">{lesson.id}</span>
      <div>
        <h2>{lesson.title}</h2>
        <p>
          <Rich text={lesson.blurb} />
        </p>
      </div>
    </header>

    <div className="ideas">
      {lesson.ideas.map((idea) => (
        <div className="idea" key={idea.title}>
          <h3>{idea.title}</h3>
          {idea.body.map((line, i) => (
            <p key={i}>
              <Rich text={line} />
            </p>
          ))}
        </div>
      ))}
    </div>

    {lesson.widget ? (
      <div className="widget">
        <div className="widget-head">
          <span className="chip chip-explore">Explore</span>
          <h3>{lesson.widget.title}</h3>
          <p>
            <Rich text={lesson.widget.blurb} />
          </p>
        </div>
        <div className="widget-body">
          <lesson.widget.Component />
        </div>
      </div>
    ) : null}

    <h3 className="exercises-title">Exercises</h3>
    <div className="exercises">
      {lesson.exercises.map((ex, i) => (
        <ExerciseCard key={ex.id} conceptId={concept.id} ex={ex} index={i + 1} />
      ))}
    </div>
  </section>
);

export const ConceptPage: React.FC<{concept: Concept; all: Concept[]}> = ({concept, all}) => {
  const p = useConceptProgress(concept);
  const store = useSolved();
  const i = all.indexOf(concept);
  const prev = all[i - 1];
  const next = all[i + 1];
  return (
    <main className="concept" data-accent={concept.accent}>
      <nav className="topbar" aria-label="Breadcrumb">
        <a href="#/">← All concepts</a>
        <span className="topbar-progress">
          {p.solved} / {p.total} solved
        </span>
      </nav>

      <header className="concept-hero">
        <div>
          <p className="kicker">Chapter 1 · Concept {concept.number}</p>
          <h1>{concept.title}</h1>
          <p className="hero-sub">{concept.tagline}</p>
        </div>
        <Ring value={p.value} size={120} />
      </header>

      <nav className="lesson-nav" aria-label="Lessons">
        {concept.lessons.map((l) => {
          const done = l.exercises.filter((e) => isSolved(store, concept.id, e.id)).length;
          return (
            <a key={l.id} href={`#/${concept.id}/lesson-${l.id}`}>
              <span className="lesson-badge small">{l.id}</span>
              <span className="lesson-nav-title">{l.title}</span>
              <span className="lesson-nav-count">
                {done}/{l.exercises.length}
              </span>
            </a>
          );
        })}
      </nav>

      {concept.lessons.map((l) => (
        <LessonSection key={l.id} concept={concept} lesson={l} />
      ))}

      <nav className="pager" aria-label="Other concepts">
        {prev ? (
          <a href={`#/${prev.id}`} data-accent={prev.accent}>
            <span>← Concept {prev.number}</span>
            <strong>{prev.title}</strong>
          </a>
        ) : (
          <span />
        )}
        {next ? (
          <a href={`#/${next.id}`} data-accent={next.accent} className="next">
            <span>Concept {next.number} →</span>
            <strong>{next.title}</strong>
          </a>
        ) : (
          <a href="#/" className="next">
            <span>Finished →</span>
            <strong>Back to all concepts</strong>
          </a>
        )}
      </nav>
      {p.solved > 0 ? (
        <p className="reset">
          <button
            type="button"
            className="btn ghost"
            onClick={() => {
              if (window.confirm(`Clear your progress for “${concept.title}”?`)) {
                resetConcept(concept.id);
                window.location.reload();
              }
            }}
          >
            Reset progress for this concept
          </button>
        </p>
      ) : null}
    </main>
  );
};

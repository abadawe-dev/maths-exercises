import type React from 'react';
import type {Rule} from './math';

export type Accent = 'cyan' | 'amber' | 'green' | 'violet' | 'pink';
export type Level = 'warmup' | 'practice' | 'challenge';

// All text fields are "rich" strings: plain text with $inline maths$ in KaTeX syntax,
// and **bold**. A line that is only maths can be written as "$$ ... $$" to display it centred.

type Base = {
  /** Unique within the concept; progress is stored under it, so never rename one. */
  id: string;
  level: Level;
  /** Where it comes from in the textbook, e.g. "Lesson 1-1 · Try 1(a)". */
  source?: string;
  prompt: string;
  /** Shown one at a time, from gentle nudge to nearly-the-answer. */
  hints?: string[];
  /** Full worked solution, one rich line per step. */
  solution: string[];
};

export type Field = {
  key: string;
  /** Rich label in front of the box, e.g. "$a =$" or "Quotient". */
  label?: string;
  /** Reference answer in typed syntax, e.g. "(x+2)/(x(x-1))". Any equivalent form is accepted. */
  answer: string;
  /** noParens: must be fully expanded. simplified: must not be much longer than the reference. number: no letters. */
  rule?: Rule;
  placeholder?: string;
};

/** Type one or more expressions or numbers. */
export type InputExercise = Base & {type: 'input'; fields: Field[]};

/** Pick one option. */
export type ChoiceExercise = Base & {
  type: 'choice';
  options: string[];
  correct: number;
  /** Optional feedback per option, shown when that option is picked. */
  feedback?: string[];
};

/** Build a proof or a worked solution line by line: at each step pick the correct next line. */
export type ProofExercise = Base & {
  type: 'proof';
  steps: {
    /** What this step is trying to do, e.g. "Expand both brackets". */
    goal: string;
    options: string[];
    correct: number;
    /** Shown once the right line is chosen. */
    why?: string;
  }[];
};

export type Exercise = InputExercise | ChoiceExercise | ProofExercise;

export type KeyIdea = {title: string; body: string[]};

export type Lesson = {
  /** e.g. "1-1" */
  id: string;
  title: string;
  /** One-sentence summary under the title. */
  blurb: string;
  ideas: KeyIdea[];
  /** Optional interactive explorer shown between the key ideas and the exercises. */
  widget?: {title: string; blurb: string; Component: React.FC};
  exercises: Exercise[];
};

export type Concept = {
  /** URL slug, e.g. "binomial". */
  id: string;
  number: number;
  title: string;
  tagline: string;
  accent: Accent;
  lessons: Lesson[];
};

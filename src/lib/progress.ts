import {useSyncExternalStore} from 'react';

// Which exercises have been solved, kept in localStorage (per browser, no account needed).
const KEY = 'maths-practice:v1';
type Store = Record<string, true>;

let cache: Store | null = null;
const listeners = new Set<() => void>();

const read = (): Store => {
  if (cache) return cache;
  try {
    cache = JSON.parse(localStorage.getItem(KEY) ?? '{}') as Store;
  } catch {
    cache = {};
  }
  return cache;
};

const write = (next: Store) => {
  cache = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // private mode or storage full: progress just lasts for this visit
  }
  listeners.forEach((l) => l());
};

export const markSolved = (conceptId: string, exerciseId: string) => {
  const k = `${conceptId}/${exerciseId}`;
  if (!read()[k]) write({...read(), [k]: true});
};

export const resetConcept = (conceptId: string) => {
  write(Object.fromEntries(Object.entries(read()).filter(([k]) => !k.startsWith(conceptId + '/'))) as Store);
};

export const useSolved = (): Store =>
  useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    read,
    read,
  );

export const isSolved = (store: Store, conceptId: string, exerciseId: string) =>
  !!store[`${conceptId}/${exerciseId}`];

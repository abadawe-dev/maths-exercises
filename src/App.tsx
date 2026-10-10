import React, {useEffect, useState} from 'react';
import {concepts} from './content/ch01';
import {ConceptPage} from './lib/ConceptPage';
import {Home} from './lib/Home';

// Hash routing (#/binomial) so every page works on GitHub Pages without server rewrites.
const useRoute = () => {
  const get = () => window.location.hash.replace(/^#\/?/, '');
  const [route, setRoute] = useState(get);
  useEffect(() => {
    const on = () => setRoute(get());
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  return route;
};

export const App: React.FC = () => {
  const route = useRoute();
  const [slug, anchor] = route.split('/');
  const concept = concepts.find((c) => c.id === slug);
  useEffect(() => {
    document.title = concept ? `${concept.title} · Maths Practice` : 'Maths Practice · Algebraic Proofs';
    document.documentElement.dataset.accent = concept?.accent ?? 'cyan';
    if (anchor) document.getElementById(anchor)?.scrollIntoView();
    else window.scrollTo(0, 0);
  }, [concept, anchor]);
  return (
    <>
      <div className="aurora" aria-hidden="true" />
      {concept ? <ConceptPage concept={concept} all={concepts} /> : <Home concepts={concepts} />}
      <footer className="site-foot">
        <p>
          Practice pages for Grade 11 Mathematics, Chapter 1 “Algebraic Proofs”. Exercises follow the textbook’s lessons;
          progress is saved only in this browser.
        </p>
      </footer>
    </>
  );
};

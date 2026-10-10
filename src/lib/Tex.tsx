import katex from 'katex';
import React, {useMemo} from 'react';

const macros = {'\\C': '{}_{#1}\\mathrm{C}_{#2}'};

const render = (tex: string, display: boolean) => {
  try {
    return katex.renderToString(tex, {displayMode: display, throwOnError: true, strict: false, macros: {...macros}});
  } catch (e) {
    if (import.meta.env?.DEV) console.error('KaTeX:', tex, e);
    return katex.renderToString(tex, {displayMode: display, throwOnError: false, strict: false, macros: {...macros}});
  }
};

/** Throws if `tex` is not valid KaTeX. Used by the content tests. */
export const assertTex = (tex: string) =>
  void katex.renderToString(tex, {throwOnError: true, strict: false, macros: {...macros}});

export const Tex: React.FC<{tex: string; display?: boolean; className?: string}> = ({tex, display, className}) => {
  const html = useMemo(() => render(tex, !!display), [tex, display]);
  return <span className={className} dangerouslySetInnerHTML={{__html: html}} />;
};

type Piece = {kind: 'text' | 'bold' | 'math' | 'display'; value: string};

/** Split a rich string into text, **bold**, $inline$ and $$display$$ pieces. */
export const splitRich = (text: string): Piece[] => {
  const out: Piece[] = [];
  const re = /\$\$([^$]+)\$\$|\$([^$]+)\$|\*\*([^*]+)\*\*/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push({kind: 'text', value: text.slice(last, m.index)});
    if (m[1] !== undefined) out.push({kind: 'display', value: m[1].trim()});
    else if (m[2] !== undefined) out.push({kind: 'math', value: m[2]});
    else out.push({kind: 'bold', value: m[3]});
    last = re.lastIndex;
  }
  if (last < text.length) out.push({kind: 'text', value: text.slice(last)});
  return out;
};

/** Text with $inline maths$, $$display maths$$ and **bold**. */
export const Rich: React.FC<{text: string}> = ({text}) => (
  <>
    {splitRich(text).map((p, i) =>
      p.kind === 'text' ? (
        <React.Fragment key={i}>{p.value}</React.Fragment>
      ) : p.kind === 'bold' ? (
        <strong key={i}>{p.value}</strong>
      ) : p.kind === 'display' ? (
        <span key={i} className="rich-display">
          <Tex tex={p.value} display />
        </span>
      ) : (
        <Tex key={i} tex={p.value} />
      ),
    )}
  </>
);

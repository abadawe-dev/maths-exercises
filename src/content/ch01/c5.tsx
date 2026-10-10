import type {Concept, Exercise} from '../../lib/types';
import {AmGmLab, DifferenceExplorer, SquareMap, SquaresCompare} from './c5.widgets';

const T = String.raw;

const content: Concept = {
  id: 'inequalities',
  number: 5,
  title: 'Inequalities',
  tagline: 'Prove that one expression is always at least as big as another, up to the famous AM-GM inequality.',
  accent: 'pink',
  lessons: [
    /* ================================================================== 1-13 */
    {
      id: '1-13',
      title: 'Proving Inequalities (1): with conditions',
      blurb: T`Subtract, factorise, and let the given conditions tell you the sign of each bracket.`,
      ideas: [
        {
          title: 'Subtract, then check the sign',
          body: [
            T`To prove $\text{LHS}>\text{RHS}$, calculate the difference and show that it is positive:`,
            T`$$\text{LHS}-\text{RHS}>0$$`,
            T`Every proof in this lesson starts with $\text{LHS}-\text{RHS}=\dots$`,
          ],
        },
        {
          title: 'Rewrite the conditions',
          body: [
            T`A condition such as $a>b$ is really a positive quantity in disguise:`,
            T`$$a>b\iff a-b>0$$`,
            T`So $x>3$ gives $x-3>0$, and $y>-5$ gives $y+5>0$.`,
          ],
        },
        {
          title: 'Factorise, then read the signs',
          body: [
            T`Group in pairs so that the brackets from the conditions appear:`,
            T`$$ax-ay-bx+by=(a-b)(x-y)$$`,
            T`If $A>0$ and $B>0$, then $AB>0$.`,
          ],
        },
      ],
      widget: {
        title: 'Difference explorer',
        blurb: T`Compare $2(ax+by)$ with $(a+b)(x+y)$. Their difference is always $(a-b)(x-y)$: break one of the conditions $a>b$, $x>y$ and watch the inequality flip.`,
        Component: DifferenceExplorer,
      },
      exercises: [
        {
          id: 'cond-rewrite',
          type: 'choice',
          level: 'warmup',
          source: 'Lesson 1-13 · Point / Warm Up 2',
          prompt: T`You are given $x>3$ and $y>-5$. Which pair of facts can you use in a proof?`,
          options: [T`$x-3>0$ and $y+5>0$`, T`$x-3>0$ and $y-5>0$`, T`$x+3>0$ and $y-5>0$`, T`$x-3>0$ and $y+5<0$`],
          correct: 0,
          feedback: [
            T`Move everything to one side: $x>3\iff x-3>0$ and $y>-5\iff y-(-5)>0$.`,
            T`Careful with the second one: subtracting $-5$ gives $y+5$, not $y-5$.`,
            T`Subtract the number on the right from both sides: $x-3$ and $y-(-5)=y+5$.`,
            T`$y>-5$ says $y$ is bigger than $-5$, so $y+5$ is positive, not negative.`,
          ],
          solution: [T`$x>3\iff x-3>0$, and $y>-5\iff y+5>0$.`, T`These are exactly the brackets in $xy+5x-3y-15=(x-3)(y+5)$.`],
        },
        {
          id: 'ex1-diff',
          type: 'input',
          level: 'warmup',
          source: 'Lesson 1-13 · Exercise 1',
          prompt: T`To prove that $3x-4y>2x-3y$ when $x>y$, first calculate $\text{LHS}-\text{RHS}$ and simplify it.`,
          fields: [{key: 'd', label: T`$\text{LHS}-\text{RHS}=$`, answer: 'x-y', rule: 'simplified', placeholder: 'simplified'}],
          hints: [T`$\text{LHS}-\text{RHS}=(3x-4y)-(2x-3y)$. Subtracting the bracket changes both of its signs.`, T`$3x-2x=x$ and $-4y+3y=-y$.`],
          solution: [
            T`$$\begin{aligned}&\text{LHS}-\text{RHS}\\&=3x-4y-2x+3y\\&=x-y\end{aligned}$$`,
            T`Since $x>y$, we have $x-y>0$. Therefore $3x-4y>2x-3y$.`,
          ],
        },
        {
          id: 'wu1-proof',
          type: 'proof',
          level: 'warmup',
          source: 'Lesson 1-13 · Warm Up 1',
          prompt: T`If $a>b$ and $x>y$, prove that $2(ax+by)>(a+b)(x+y)$.`,
          steps: [
            {
              goal: 'Start from the difference and expand both brackets.',
              options: [
                T`$\text{LHS}-\text{RHS}=2ax+2by-ax-ay-bx-by$`,
                T`$\text{LHS}-\text{RHS}=2ax+2by-ax+ay+bx+by$`,
                T`$\text{LHS}-\text{RHS}=2ax+by-ax-ay-bx-by$`,
              ],
              correct: 0,
              why: T`The minus sign in front of $(a+b)(x+y)$ changes the sign of all four of its terms.`,
            },
            {
              goal: 'Collect like terms.',
              options: [T`$=ax-ay-bx+by$`, T`$=ax-ay-bx-by$`, T`$=ax+ay-bx+by$`],
              correct: 0,
              why: T`$2ax-ax=ax$ and $2by-by=by$.`,
            },
            {
              goal: 'Factorise in pairs.',
              options: [T`$=a(x-y)-b(x-y)=(a-b)(x-y)$`, T`$=a(x-y)+b(x-y)=(a+b)(x-y)$`, T`$=x(a-b)+y(a-b)=(a-b)(x+y)$`],
              correct: 0,
              why: T`Taking out $-b$ from $-bx+by$ leaves $(x-y)$, the same bracket as the first pair.`,
            },
            {
              goal: 'Use the conditions to find the sign of each factor.',
              options: [
                T`Since $a>b$ and $x>y$: $\;a-b>0$ and $x-y>0$`,
                T`Since $a>b$ and $x>y$: $\;a>0$ and $x>0$`,
                T`Since $a>b$ and $x>y$: $\;a-b>0$ and $y-x>0$`,
              ],
              correct: 0,
              why: T`$a>b\iff a-b>0$. Nothing says that $a$ or $x$ themselves are positive.`,
            },
            {
              goal: 'Conclude.',
              options: [
                T`So $(a-b)(x-y)>0$. Therefore $2(ax+by)>(a+b)(x+y)$`,
                T`So $(a-b)+(x-y)>0$. Therefore $2(ax+by)>(a+b)(x+y)$`,
                T`So $(a-b)(x-y)<0$. Therefore $2(ax+by)>(a+b)(x+y)$`,
              ],
              correct: 0,
              why: 'Positive × positive is positive, and the difference is a product, not a sum.',
            },
          ],
          hints: [T`Expand $2(ax+by)$ and $(a+b)(x+y)$ separately, then subtract every term of the second.`, T`After collecting terms you should have $ax-ay-bx+by$. Take $a$ out of the first two terms.`],
          solution: [
            T`$$\begin{aligned}&\text{LHS}-\text{RHS}\\&=2ax+2by-ax-ay-bx-by\\&=ax-ay-bx+by\\&=a(x-y)-b(x-y)\\&=(a-b)(x-y)\end{aligned}$$`,
            T`Since $a>b$ and $x>y$, we have $a-b>0$ and $x-y>0$, so $(a-b)(x-y)>0$.`,
            T`Therefore $2(ax+by)>(a+b)(x+y)$.`,
          ],
        },
        {
          id: 'try1-factor',
          type: 'input',
          level: 'practice',
          source: 'Lesson 1-13 · Try 1',
          prompt: T`If $a>b$ and $c>d$, we want to prove $ac+bd>ad+bc$. Write $\text{LHS}-\text{RHS}=ac+bd-ad-bc$ as a product of two brackets.`,
          fields: [{key: 'f', label: T`$\text{LHS}-\text{RHS}=$`, answer: '(a-b)(c-d)', rule: 'simplified', placeholder: 'e.g. (a+b)(c+d)'}],
          hints: [T`Reorder as $ac-ad-bc+bd$ and factorise in pairs.`, T`$ac-ad=a(c-d)$ and $-bc+bd=-b(c-d)$.`],
          solution: [
            T`$$\begin{aligned}&ac-ad-bc+bd\\&=a(c-d)-b(c-d)\\&=(a-b)(c-d)\end{aligned}$$`,
            T`Since $a>b$ and $c>d$, we have $a-b>0$ and $c-d>0$, so $(a-b)(c-d)>0$. Therefore $ac+bd>ad+bc$.`,
          ],
        },
        {
          id: 'try2-proof',
          type: 'proof',
          level: 'practice',
          source: 'Lesson 1-13 · Try 2',
          prompt: T`If $x>2$ and $y>1$, prove that $xy+2>x+2y$.`,
          steps: [
            {
              goal: 'Write the difference.',
              options: [T`$\text{LHS}-\text{RHS}=xy-x-2y+2$`, T`$\text{LHS}-\text{RHS}=xy-x+2y+2$`, T`$\text{LHS}-\text{RHS}=xy+x+2y+2$`],
              correct: 0,
            },
            {
              goal: 'Factorise in pairs.',
              options: [T`$=x(y-1)-2(y-1)$`, T`$=x(y-1)-2(y+1)$`, T`$=x(y-1)+2(y-1)$`],
              correct: 0,
              why: T`Check by expanding: $-2(y-1)=-2y+2$.`,
            },
            {
              goal: 'Take out the common bracket.',
              options: [T`$=(x-2)(y-1)$`, T`$=(x+2)(y-1)$`, T`$=(x-2)(y-1)^2$`],
              correct: 0,
            },
            {
              goal: 'Use the conditions.',
              options: [
                T`Since $x>2$ and $y>1$: $\;x-2>0$ and $y-1>0$`,
                T`Since $x>2$ and $y>1$: $\;x-2>0$ and $1-y>0$`,
                T`Since $x>2$ and $y>1$: $\;x-2<0$ and $y-1<0$`,
              ],
              correct: 0,
            },
            {
              goal: 'Conclude.',
              options: [
                T`So $(x-2)(y-1)>0$. Therefore $xy+2>x+2y$`,
                T`So $(x-2)(y-1)<0$. Therefore $xy+2>x+2y$`,
                T`So $(x-2)(y-1)>0$. Therefore $xy+2<x+2y$`,
              ],
              correct: 0,
              why: T`$\text{LHS}-\text{RHS}>0$ means exactly $\text{LHS}>\text{RHS}$.`,
            },
          ],
          hints: [T`The conditions give $x-2>0$ and $y-1>0$, so aim for the brackets $(x-2)$ and $(y-1)$.`, T`$xy-x=x(y-1)$ and $-2y+2=-2(y-1)$.`],
          solution: [
            T`$$\begin{aligned}&\text{LHS}-\text{RHS}\\&=xy-x-2y+2\\&=x(y-1)-2(y-1)\\&=(x-2)(y-1)\end{aligned}$$`,
            T`Since $x>2$ and $y>1$, we have $x-2>0$ and $y-1>0$, so $(x-2)(y-1)>0$.`,
            T`Therefore $xy+2>x+2y$.`,
          ],
        },
        {
          id: 'ex3-factor',
          type: 'input',
          level: 'practice',
          source: 'Lesson 1-13 · Exercise 3',
          prompt: T`If $a>1$ and $b>1$, we want to prove $ab+1>a+b$. The difference factorises as $$ab+1-a-b=(a-1)\times\boxed{\phantom{00}}$$ What goes in the box?`,
          fields: [{key: 'f', label: 'The other factor', answer: 'b-1', placeholder: 'an expression in b'}],
          hints: [T`Reorder: $ab-a-b+1=a(b-1)-(b-1)$.`, T`The condition $b>1$ tells you which bracket to expect.`],
          solution: [
            T`$$\begin{aligned}&ab-a-b+1\\&=a(b-1)-1(b-1)\\&=(a-1)(b-1)\end{aligned}$$`,
            T`Since $a>1$ and $b>1$, both brackets are positive, so $(a-1)(b-1)>0$. Therefore $ab+1>a+b$.`,
          ],
        },
        {
          id: 'flip',
          type: 'choice',
          level: 'practice',
          source: 'Lesson 1-13 · Warm Up 1 (what if?)',
          prompt: T`In Warm Up 1, $\;2(ax+by)-(a+b)(x+y)=(a-b)(x-y)$. Suppose now that $a>b$ but $x<y$. What can you say?`,
          options: [
            T`$2(ax+by)<(a+b)(x+y)$`,
            T`$2(ax+by)>(a+b)(x+y)$ still`,
            T`$2(ax+by)=(a+b)(x+y)$`,
            'It depends on the actual numbers',
          ],
          correct: 0,
          feedback: [
            T`$a-b>0$ and $x-y<0$, so the product is negative: $\text{LHS}-\text{RHS}<0$.`,
            T`The proof needed both brackets to be positive. Now $x-y<0$.`,
            T`The difference is zero only if $a=b$ or $x=y$.`,
            T`No numbers needed: positive × negative is always negative.`,
          ],
          hints: ['Work out the sign of each bracket.', 'Try it in the explorer above: put x below y.'],
          solution: [
            T`$a>b$ gives $a-b>0$; $x<y$ gives $x-y<0$.`,
            T`Positive × negative is negative, so $\text{LHS}-\text{RHS}<0$: the inequality flips to $2(ax+by)<(a+b)(x+y)$.`,
          ],
        },
        {
          id: 'ex4-needed',
          type: 'choice',
          level: 'practice',
          source: 'Lesson 1-13 · Exercise 4',
          prompt: T`If $a>b>x>y$, then $ax+by>ay+bx$, because $\text{LHS}-\text{RHS}=(a-b)(x-y)$. Which part of the chain $a>b>x>y$ does the proof **never use**?`,
          options: [T`$b>x$`, T`$a>b$`, T`$x>y$`, 'Every part is needed'],
          correct: 0,
          feedback: [
            T`Right: only the brackets $(a-b)$ and $(x-y)$ appear, so only $a>b$ and $x>y$ matter.`,
            T`$a>b$ is what makes the factor $a-b$ positive.`,
            T`$x>y$ is what makes the factor $x-y$ positive.`,
            T`Look at which brackets appear in the factorised difference.`,
          ],
          hints: [T`$ax-ay-bx+by=a(x-y)-b(x-y)$.`],
          solution: [
            T`$$\begin{aligned}&\text{LHS}-\text{RHS}\\&=ax-ay-bx+by\\&=a(x-y)-b(x-y)\\&=(a-b)(x-y)\end{aligned}$$`,
            T`$a>b$ gives $a-b>0$ and $x>y$ gives $x-y>0$, so the product is positive. The middle link $b>x$ is never used.`,
          ],
        },
        {
          id: 'rearrangement',
          type: 'proof',
          level: 'challenge',
          source: 'Lesson 1-13 · Challenge — Rearrangement',
          prompt: T`If $a>b>c>0$ and $x>y>z>0$, prove that $ax+by+cz>ay+bz+cx$.`,
          steps: [
            {
              goal: T`Write the difference, grouped by $a$, $b$ and $c$.`,
              options: [
                T`$\text{LHS}-\text{RHS}=a(x-y)+b(y-z)+c(z-x)$`,
                T`$\text{LHS}-\text{RHS}=a(x-y)+b(y-z)+c(x-z)$`,
                T`$\text{LHS}-\text{RHS}=a(x-y)+b(z-y)+c(z-x)$`,
              ],
              correct: 0,
              why: T`$ax-ay$, then $by-bz$, then $cz-cx$.`,
            },
            {
              goal: T`$z-x$ is negative, which is awkward. Rewrite it using the other two brackets.`,
              options: [T`$z-x=-(x-y)-(y-z)$`, T`$z-x=(x-y)+(y-z)$`, T`$z-x=-(x-y)+(y-z)$`],
              correct: 0,
              why: T`$-(x-y)-(y-z)=-x+y-y+z=z-x$.`,
            },
            {
              goal: 'Substitute and collect the two brackets.',
              options: [
                T`$=(a-c)(x-y)+(b-c)(y-z)$`,
                T`$=(a+c)(x-y)+(b+c)(y-z)$`,
                T`$=(a-c)(x-y)-(b-c)(y-z)$`,
              ],
              correct: 0,
              why: T`$a(x-y)-c(x-y)=(a-c)(x-y)$ and $b(y-z)-c(y-z)=(b-c)(y-z)$.`,
            },
            {
              goal: 'Use the conditions on all four brackets.',
              options: [
                T`$a-c>0,\;\; b-c>0,\;\; x-y>0,\;\; y-z>0$`,
                T`$a-c>0,\;\; b-c<0,\;\; x-y>0,\;\; y-z<0$`,
                T`$a-c<0,\;\; b-c<0,\;\; x-y>0,\;\; y-z>0$`,
              ],
              correct: 0,
              why: T`From $a>b>c$ and $x>y>z$.`,
            },
            {
              goal: 'Conclude.',
              options: [
                T`A sum of two positive products is positive, so $ax+by+cz>ay+bz+cx$`,
                T`A difference of two positive products is positive, so $ax+by+cz>ay+bz+cx$`,
                T`A product of four positive numbers is positive, so $ax+by+cz>ay+bz+cx$`,
              ],
              correct: 0,
            },
          ],
          hints: [
            T`$\text{LHS}-\text{RHS}=ax-ay+by-bz+cz-cx$. Group the terms with $a$, with $b$, with $c$.`,
            T`The three brackets $(x-y)$, $(y-z)$, $(z-x)$ add up to zero, so one of them can be written using the other two.`,
            T`Aim for $(a-c)(x-y)+(b-c)(y-z)$.`,
          ],
          solution: [
            T`$$\begin{aligned}&\text{LHS}-\text{RHS}\\&=a(x-y)+b(y-z)+c(z-x)\end{aligned}$$`,
            T`Since $z-x=-(x-y)-(y-z)$,`,
            T`$$\begin{aligned}&\text{LHS}-\text{RHS}\\&=(a-c)(x-y)+(b-c)(y-z)\end{aligned}$$`,
            T`From $a>b>c$ and $x>y>z$: $a-c>0$, $b-c>0$, $x-y>0$, $y-z>0$. Both products are positive, so their sum is positive.`,
            T`Therefore $ax+by+cz>ay+bz+cx$. (Check: $a,b,c=3,2,1$ and $x,y,z=3,2,1$ give $14>11$.)`,
          ],
        },
      ],
    },

    /* ================================================================== 1-14 */
    {
      id: '1-14',
      title: 'Proving Inequalities (2): completing the square',
      blurb: T`With no conditions to lean on, use the one fact that is true for every real number: a square is never negative.`,
      ideas: [
        {
          title: 'A square is never negative',
          body: [
            T`For all real numbers $X$ and $Y$:`,
            T`$$X^2\ge0\qquad X^2+Y^2\ge0$$`,
            T`No conditions are needed, so this proves inequalities for **all** real numbers.`,
          ],
        },
        {
          title: 'Complete the square',
          body: [
            T`Rewrite $\text{LHS}-\text{RHS}$ in the form $X^2$ or $X^2+Y^2$:`,
            T`$$a^2-4ab+4b^2=(a-2b)^2$$`,
            T`$$x^2-2x=(x-1)^2-1$$`,
          ],
        },
        {
          title: 'Say when equality holds',
          body: [
            T`With $\ge$ or $\le$ you must also state the condition for equality.`,
            T`$X^2=0$ only when $X=0$.`,
            T`$X^2+Y^2=0$ only when $X=0$ **and** $Y=0$.`,
          ],
        },
      ],
      widget: {
        title: 'The square behind the inequality',
        blurb: T`$a^2+4b^2$ and $4ab$ always differ by $(a-2b)^2$, the area of a square. Explore every pair $(a,b)$ and find where that area vanishes.`,
        Component: SquareMap,
      },
      exercises: [
        {
          id: 'can-be-negative',
          type: 'choice',
          level: 'warmup',
          source: 'Lesson 1-14 · Point',
          prompt: T`Three of these are never negative, whatever real numbers you put in. Which one **can** be negative?`,
          options: [T`$x^2-4x+3$`, T`$(a-2b)^2$`, T`$(x-1)^2+(y+1)^2$`, T`$x^2-2x+2$`],
          correct: 0,
          feedback: [
            T`$x^2-4x+3=(x-2)^2-1$, which equals $-1$ when $x=2$.`,
            T`This is a square, $X^2$ with $X=a-2b$, so it is never negative.`,
            T`This is a sum of two squares, $X^2+Y^2$, so it is never negative.`,
            T`Complete the square: $x^2-2x+2=(x-1)^2+1$, which is at least $1$.`,
          ],
          hints: ['Complete the square in the two that are not already written as squares.'],
          solution: [
            T`$(a-2b)^2\ge0$ and $(x-1)^2+(y+1)^2\ge0$ are squares or sums of squares.`,
            T`$x^2-2x+2=(x-1)^2+1\ge1$.`,
            T`$x^2-4x+3=(x-2)^2-1$: at $x=2$ it equals $-1$. The leftover constant decides everything.`,
          ],
        },
        {
          id: 'sq-wu1',
          type: 'proof',
          level: 'warmup',
          source: 'Lesson 1-14 · Warm Up 1',
          prompt: T`Prove that $a^2+4b^2\ge4ab$, and determine when equality holds.`,
          steps: [
            {
              goal: 'Write the difference with its terms in order.',
              options: [T`$\text{LHS}-\text{RHS}=a^2-4ab+4b^2$`, T`$\text{LHS}-\text{RHS}=a^2+4ab+4b^2$`, T`$\text{LHS}-\text{RHS}=a^2-4ab-4b^2$`],
              correct: 0,
            },
            {
              goal: 'Complete the square.',
              options: [T`$=(a-2b)^2$`, T`$=(a-4b)^2$`, T`$=(a+2b)^2$`, T`$=(2a-b)^2$`],
              correct: 0,
              why: T`$(a-2b)^2=a^2-2\cdot a\cdot2b+(2b)^2=a^2-4ab+4b^2$.`,
            },
            {
              goal: 'Explain the sign.',
              options: [
                T`$(a-2b)^2\ge0$, because the square of a real number is never negative`,
                T`$(a-2b)^2>0$, because a square is always positive`,
                T`$(a-2b)^2\ge0$, because $a>2b$`,
              ],
              correct: 0,
              why: T`A square can be zero, so the sign is $\ge$, not $>$. And no condition on $a$, $b$ is given or needed.`,
            },
            {
              goal: 'Conclude.',
              options: [T`Therefore $a^2+4b^2\ge4ab$`, T`Therefore $a^2+4b^2>4ab$`, T`Therefore $a^2+4b^2\le4ab$`],
              correct: 0,
            },
            {
              goal: 'State when equality holds.',
              options: [
                T`Equality holds when $a-2b=0$, that is, when $a=2b$`,
                T`Equality holds only when $a=b=0$`,
                T`Equality holds when $a=-2b$`,
                'Equality never holds',
              ],
              correct: 0,
              why: T`$X^2=0$ exactly when $X=0$. For example $a=6$, $b=3$: $36+36=72=4\cdot6\cdot3$.`,
            },
          ],
          hints: [T`$\text{LHS}-\text{RHS}=a^2+4b^2-4ab$. Which bracket squared gives a middle term $-4ab$?`, T`$4b^2=(2b)^2$.`],
          solution: [
            T`$$\begin{aligned}\text{LHS}-\text{RHS}&=a^2-4ab+4b^2\\&=(a-2b)^2\ge0\end{aligned}$$`,
            T`Therefore $a^2+4b^2\ge4ab$.`,
            T`Equality holds when $a-2b=0$, that is, when $a=2b$.`,
          ],
        },
        {
          id: 'sq-ex1',
          type: 'input',
          level: 'warmup',
          source: 'Lesson 1-14 · Exercise 1',
          prompt: T`To prove $9x^2\ge y(6x-y)$, write $\text{LHS}-\text{RHS}$ as a perfect square. Then give the condition for equality.`,
          fields: [
            {key: 'sq', label: T`$\text{LHS}-\text{RHS}=$`, answer: '(3x-y)^2', rule: 'simplified', placeholder: 'a perfect square, e.g. (x+y)^2'},
            {key: 'eq', label: T`Equality holds when $y=$`, answer: '3x', placeholder: 'in terms of x'},
          ],
          hints: [T`$\text{LHS}-\text{RHS}=9x^2-6xy+y^2$.`, T`$9x^2=(3x)^2$, and the middle term is $-2\cdot3x\cdot y$.`],
          solution: [
            T`$$\begin{aligned}\text{LHS}-\text{RHS}&=9x^2-6xy+y^2\\&=(3x-y)^2\ge0\end{aligned}$$`,
            T`Therefore $9x^2\ge y(6x-y)$. Equality holds when $3x-y=0$, that is, when $y=3x$.`,
          ],
        },
        {
          id: 'sq-wu2',
          type: 'proof',
          level: 'practice',
          source: 'Lesson 1-14 · Warm Up 2',
          prompt: T`Prove that $x^2+y^2\ge2(x-y-1)$, and determine when equality holds.`,
          steps: [
            {
              goal: T`Write the difference, grouping the $x$ terms and the $y$ terms.`,
              options: [T`$\text{LHS}-\text{RHS}=x^2-2x+y^2+2y+2$`, T`$\text{LHS}-\text{RHS}=x^2-2x+y^2-2y-2$`, T`$\text{LHS}-\text{RHS}=x^2-2x+y^2+2y-2$`],
              correct: 0,
              why: T`$-2(x-y-1)=-2x+2y+2$.`,
            },
            {
              goal: T`Complete the square for $x$.`,
              options: [T`$x^2-2x=(x-1)^2-1$`, T`$x^2-2x=(x-1)^2+1$`, T`$x^2-2x=(x-2)^2-4$`],
              correct: 0,
              why: T`Halve the coefficient of $x$, then subtract the square of that half.`,
            },
            {
              goal: T`Complete the square for $y$.`,
              options: [T`$y^2+2y=(y+1)^2-1$`, T`$y^2+2y=(y+1)^2+1$`, T`$y^2+2y=(y+2)^2-4$`],
              correct: 0,
            },
            {
              goal: 'Put the pieces together.',
              options: [
                T`$\text{LHS}-\text{RHS}=(x-1)^2+(y+1)^2\ge0$`,
                T`$\text{LHS}-\text{RHS}=(x-1)^2+(y+1)^2+2\ge0$`,
                T`$\text{LHS}-\text{RHS}=(x-1)^2+(y+1)^2-2\ge0$`,
              ],
              correct: 0,
              why: T`The leftover numbers cancel perfectly: $-1-1+2=0$.`,
            },
            {
              goal: 'State when equality holds.',
              options: [
                T`Equality holds when $x=1$ **and** $y=-1$`,
                T`Equality holds when $x=1$ **or** $y=-1$`,
                T`Equality holds when $x=-1$ and $y=1$`,
              ],
              correct: 0,
              why: T`$X^2+Y^2=0$ needs both squares to be zero. Check: $1+1=2=2(1+1-1)$.`,
            },
          ],
          hints: [T`Expand the right-hand side first: $2(x-y-1)=2x-2y-2$.`, T`$x^2-2x=(x-1)^2-1$ and $y^2+2y=(y+1)^2-1$.`],
          solution: [
            T`$$\begin{aligned}&\text{LHS}-\text{RHS}\\&=x^2-2x+y^2+2y+2\\&=(x-1)^2-1+(y+1)^2-1+2\\&=(x-1)^2+(y+1)^2\ge0\end{aligned}$$`,
            T`Therefore $x^2+y^2\ge2(x-y-1)$.`,
            T`Equality holds when $x-1=0$ and $y+1=0$, that is, when $x=1$ and $y=-1$.`,
          ],
        },
        {
          id: 'sq-ex6',
          type: 'input',
          level: 'practice',
          source: 'Lesson 1-14 · Exercise 6',
          prompt: T`To prove $x^2+y^2-6x+8y+25\ge0$, write the left-hand side as a sum of two squares, and find when equality holds.`,
          fields: [
            {key: 'sq', label: T`$x^2+y^2-6x+8y+25=$`, answer: '(x-3)^2+(y+4)^2', rule: 'simplified', placeholder: '( … )^2 + ( … )^2'},
            {key: 'x', label: T`Equality when $x=$`, answer: '3', rule: 'number', placeholder: 'a number'},
            {key: 'y', label: T`and $y=$`, answer: '-4', rule: 'number', placeholder: 'a number'},
          ],
          hints: [T`$x^2-6x=(x-3)^2-9$.`, T`$y^2+8y=(y+4)^2-16$, and $-9-16+25=0$.`],
          solution: [
            T`$$\begin{aligned}&x^2-6x+y^2+8y+25\\&=(x-3)^2-9+(y+4)^2-16+25\\&=(x-3)^2+(y+4)^2\ge0\end{aligned}$$`,
            T`Equality holds when $x-3=0$ and $y+4=0$, that is, when $x=3$ and $y=-4$.`,
          ],
        },
        {
          id: 'sq-ex3',
          type: 'proof',
          level: 'practice',
          source: 'Lesson 1-14 · Exercise 3',
          prompt: T`Prove that $(2x-y)^2\ge3(x^2-y^2)$, and determine when equality holds.`,
          steps: [
            {
              goal: 'Expand the difference.',
              options: [
                T`$\text{LHS}-\text{RHS}=4x^2-4xy+y^2-3x^2+3y^2$`,
                T`$\text{LHS}-\text{RHS}=4x^2-2xy+y^2-3x^2+3y^2$`,
                T`$\text{LHS}-\text{RHS}=4x^2-4xy+y^2-3x^2-3y^2$`,
              ],
              correct: 0,
              why: T`$(2x-y)^2=4x^2-4xy+y^2$, and $-3(x^2-y^2)=-3x^2+3y^2$.`,
            },
            {
              goal: 'Collect like terms.',
              options: [T`$=x^2-4xy+4y^2$`, T`$=x^2-4xy+2y^2$`, T`$=x^2-4xy-2y^2$`],
              correct: 0,
            },
            {
              goal: 'Complete the square.',
              options: [T`$=(x-2y)^2\ge0$`, T`$=(x-4y)^2\ge0$`, T`$=(x-2y)^2>0$`],
              correct: 0,
              why: T`A square is zero when its inside is zero, so we can only claim $\ge$.`,
            },
            {
              goal: 'Conclude, with the equality condition.',
              options: [
                T`So $(2x-y)^2\ge3(x^2-y^2)$, with equality when $x=2y$`,
                T`So $(2x-y)^2\ge3(x^2-y^2)$, with equality when $y=2x$`,
                T`So $(2x-y)^2\ge3(x^2-y^2)$, with equality only when $x=y=0$`,
              ],
              correct: 0,
              why: T`Check $x=2$, $y=1$: $(4-1)^2=9$ and $3(4-1)=9$.`,
            },
          ],
          hints: [T`Expand both sides fully before subtracting.`, T`You should reach $x^2-4xy+4y^2$, and $4y^2=(2y)^2$.`],
          solution: [
            T`$$\begin{aligned}&\text{LHS}-\text{RHS}\\&=4x^2-4xy+y^2-3x^2+3y^2\\&=x^2-4xy+4y^2\\&=(x-2y)^2\ge0\end{aligned}$$`,
            T`Therefore $(2x-y)^2\ge3(x^2-y^2)$. Equality holds when $x-2y=0$, that is, when $x=2y$.`,
          ],
        },
        {
          id: 'sq-try2',
          type: 'choice',
          level: 'practice',
          source: 'Lesson 1-14 · Try 2',
          prompt: T`For $a^2+5b^2\ge4ab$ we get $\;\text{LHS}-\text{RHS}=(a-2b)^2+b^2\ge0$. When does equality hold?`,
          options: [T`Only when $a=0$ and $b=0$`, T`Whenever $a=2b$`, T`Whenever $b=0$`, 'Never'],
          correct: 0,
          feedback: [
            T`Both squares must vanish: $b=0$, and then $a-2b=0$ forces $a=0$.`,
            T`If $a=2b$ the first square is zero, but $b^2$ is still there. Try $a=2$, $b=1$: $4+5=9>8$.`,
            T`If $b=0$ the second square is zero, but $(a-0)^2=a^2$ is still there.`,
            T`Try $a=b=0$: both sides are $0$.`,
          ],
          hints: [T`$X^2+Y^2=0$ needs $X=0$ **and** $Y=0$. Here $X=a-2b$ and $Y=b$.`],
          solution: [
            T`$$\begin{aligned}&a^2-4ab+5b^2\\&=(a^2-4ab+4b^2)+b^2\\&=(a-2b)^2+b^2\ge0\end{aligned}$$`,
            T`Equality needs $a-2b=0$ and $b=0$ together, so $a=b=0$.`,
            T`(Exercise 4 is the same story: $(2a+3b)^2-12ab=4a^2+9b^2\ge0$, with equality only when $a=b=0$.)`,
          ],
        },
        {
          id: 'sq-ex5',
          type: 'input',
          level: 'practice',
          source: 'Lesson 1-14 · Exercise 5',
          prompt: T`The textbook asks you to prove $x^2+2>2x$ with a strict $>$ and no equality case. Complete the square to see why: what is the smallest value that $\text{LHS}-\text{RHS}=x^2-2x+2$ can take, and where?`,
          fields: [
            {key: 'min', label: 'Smallest value', answer: '1', rule: 'number', placeholder: 'a number'},
            {key: 'x', label: T`It occurs at $x=$`, answer: '1', rule: 'number', placeholder: 'a number'},
          ],
          hints: [T`$x^2-2x=(x-1)^2-1$.`, T`So $x^2-2x+2=(x-1)^2+1$. How small can the square be?`],
          solution: [
            T`$$\begin{aligned}\text{LHS}-\text{RHS}&=x^2-2x+2\\&=(x-1)^2+1\end{aligned}$$`,
            T`Since $(x-1)^2\ge0$, the difference is at least $1$, reached at $x=1$.`,
            T`It is never $0$, so $x^2+2>2x$ strictly and there is no equality case.`,
          ],
        },
        {
          id: 'sq-try1',
          type: 'proof',
          level: 'challenge',
          source: 'Lesson 1-14 · Try 1',
          prompt: T`Prove that $(a^2+b^2)(x^2+y^2)\ge(ax+by)^2$, and determine when equality holds.`,
          steps: [
            {
              goal: 'Expand the left-hand side.',
              options: [T`$\text{LHS}=a^2x^2+a^2y^2+b^2x^2+b^2y^2$`, T`$\text{LHS}=a^2x^2+b^2y^2$`, T`$\text{LHS}=a^2x^2+2abxy+b^2y^2$`],
              correct: 0,
            },
            {
              goal: 'Expand the right-hand side.',
              options: [T`$\text{RHS}=a^2x^2+2abxy+b^2y^2$`, T`$\text{RHS}=a^2x^2+b^2y^2$`, T`$\text{RHS}=a^2x^2+abxy+b^2y^2$`],
              correct: 0,
              why: T`$(P+Q)^2=P^2+2PQ+Q^2$ with $P=ax$, $Q=by$.`,
            },
            {
              goal: 'Subtract.',
              options: [
                T`$\text{LHS}-\text{RHS}=a^2y^2-2abxy+b^2x^2$`,
                T`$\text{LHS}-\text{RHS}=a^2y^2+2abxy+b^2x^2$`,
                T`$\text{LHS}-\text{RHS}=a^2y^2+b^2x^2$`,
              ],
              correct: 0,
              why: T`$a^2x^2$ and $b^2y^2$ cancel.`,
            },
            {
              goal: 'Recognise a perfect square.',
              options: [T`$=(ay-bx)^2\ge0$`, T`$=(ax-by)^2\ge0$`, T`$=(ay+bx)^2\ge0$`],
              correct: 0,
              why: T`$(ay)^2-2(ay)(bx)+(bx)^2$.`,
            },
            {
              goal: 'State when equality holds.',
              options: [T`Equality holds when $ay=bx$`, T`Equality holds when $ax=by$`, T`Equality holds only when $a=b$ and $x=y$`],
              correct: 0,
              why: T`Check $a=1,\ b=2,\ x=3,\ y=6$: $5\times45=225=15^2$.`,
            },
          ],
          hints: [T`Expand both sides completely. Two terms appear on both sides and cancel.`, T`What is left is $a^2y^2-2abxy+b^2x^2$. Think of $ay$ and $bx$ as single objects.`],
          solution: [
            T`$\text{LHS}=a^2x^2+a^2y^2+b^2x^2+b^2y^2$ and $\text{RHS}=a^2x^2+2abxy+b^2y^2$, so $a^2x^2$ and $b^2y^2$ cancel:`,
            T`$$\begin{aligned}&\text{LHS}-\text{RHS}\\&=a^2y^2-2abxy+b^2x^2\\&=(ay-bx)^2\ge0\end{aligned}$$`,
            T`Therefore $(a^2+b^2)(x^2+y^2)\ge(ax+by)^2$. Equality holds when $ay-bx=0$, that is, when $ay=bx$.`,
          ],
        },
        {
          id: 'never-negative',
          type: 'input',
          level: 'challenge',
          source: 'Lesson 1-14 · Challenge — Never Negative',
          prompt: T`A factory's daily overhead cost (in dollars) for machine settings $x$ and $y$ is $$x^2+2y^2-10x+12y+43$$ Complete the square in $x$ and in $y$ to show the cost is never negative. What is the smallest possible cost, and which settings give it?`,
          fields: [
            {key: 'min', label: 'Smallest cost', answer: '0', rule: 'number', placeholder: 'a number'},
            {key: 'x', label: T`at $x=$`, answer: '5', rule: 'number', placeholder: 'a number'},
            {key: 'y', label: T`and $y=$`, answer: '-3', rule: 'number', placeholder: 'a number'},
          ],
          hints: [
            T`$x^2-10x=(x-5)^2-25$.`,
            T`Take the $2$ out first: $2y^2+12y=2(y^2+6y)=2(y+3)^2-18$.`,
            T`Add up the leftover numbers: $-25-18+43$.`,
          ],
          solution: [
            T`$$\begin{aligned}&x^2-10x+2y^2+12y+43\\&=(x-5)^2-25+2(y+3)^2-18\\&\quad+43\\&=(x-5)^2+2(y+3)^2\ge0\end{aligned}$$`,
            T`Both terms are squares (one doubled), so the cost is never negative.`,
            T`The smallest cost is $0$ dollars, when $x-5=0$ and $y+3=0$: at $x=5$, $y=-3$.`,
          ],
        },
      ],
    },

    /* ================================================================== 1-15 */
    {
      id: '1-15',
      title: 'Proving Inequalities (3): square roots',
      blurb: T`Square roots are awkward to subtract, so compare the squares instead, after checking that both sides are positive.`,
      ideas: [
        {
          title: 'Compare the squares',
          body: [
            T`For inequalities with radicals, calculate the difference of the squares`,
            T`$$(\text{LHS})^2-(\text{RHS})^2$$`,
            T`and show that it is positive (or $\ge0$). Squaring makes the roots disappear.`,
          ],
        },
        {
          title: 'Only when both sides are positive',
          body: [
            T`When $\text{LHS}>0$ and $\text{RHS}>0$:`,
            T`$$(\text{LHS})^2>(\text{RHS})^2\iff\text{LHS}>\text{RHS}$$`,
            T`Without that it can fail: $-3<2$, but $(-3)^2>2^2$.`,
          ],
        },
        {
          title: 'The shape of the proof',
          body: [
            T`**(i)** Show that $(\text{LHS})^2\ge(\text{RHS})^2$.`,
            T`**(ii)** State that both sides are positive. (When $a>0$, $\sqrt a>0$.)`,
            T`From (i) and (ii), $\text{LHS}\ge\text{RHS}$.`,
          ],
        },
      ],
      widget: {
        title: 'Does squaring keep the order?',
        blurb: T`Two numbers and their squares, drawn as areas. With positive numbers the bigger number always has the bigger square. Switch on negatives and hunt for a pair where it goes wrong.`,
        Component: SquaresCompare,
      },
      exercises: [
        {
          id: 'squares-trap',
          type: 'choice',
          level: 'warmup',
          source: 'Lesson 1-15 · Point',
          prompt: T`Is the statement “if $a^2>b^2$, then $a>b$” true for all real numbers $a$ and $b$?`,
          options: [
            T`No: for example $a=-3$, $b=2$`,
            'Yes, always',
            T`No: for example $a=3$, $b=2$`,
            T`No: for example $a=2$, $b=-3$`,
          ],
          correct: 0,
          feedback: [
            T`$(-3)^2=9>4=2^2$, yet $-3<2$. The statement is only safe when both numbers are positive.`,
            T`Try a negative value for $a$, such as $a=-3$ with $b=2$.`,
            T`Here $9>4$ and $3>2$: this example agrees with the statement, so it is not a counterexample.`,
            T`Here $a^2=4$ is not greater than $b^2=9$, so the “if” part fails and the example tests nothing.`,
          ],
          hints: [T`A counterexample needs $a^2>b^2$ to be true while $a>b$ is false.`],
          solution: [
            T`Take $a=-3$ and $b=2$: $a^2=9>4=b^2$, but $a<b$.`,
            T`When $a>0$ and $b>0$ the statement is true, which is why a proof must say that both sides are positive.`,
          ],
        },
        {
          id: 'root-diffs',
          type: 'input',
          level: 'warmup',
          source: 'Lesson 1-15 · Warm Up 2 and Exercise 5',
          prompt: T`For $a>0$, $b>0$, calculate and simplify $(\text{LHS})^2-(\text{RHS})^2$ for each inequality.`,
          fields: [
            {key: 'p', label: T`$\sqrt a+4\sqrt b>\sqrt{a+16b}$`, answer: '8sqrt(ab)', rule: 'simplified', placeholder: 'e.g. 3sqrt(ab)'},
            {key: 'q', label: T`$2\sqrt a+3\sqrt b>\sqrt{4a+9b}$`, answer: '12sqrt(ab)', rule: 'simplified', placeholder: 'e.g. 3sqrt(ab)'},
          ],
          hints: [T`$(\sqrt a+4\sqrt b)^2=a+2\cdot\sqrt a\cdot4\sqrt b+16b$.`, T`The $a$ and $b$ terms cancel with the right-hand side, leaving only the middle term.`],
          solution: [
            T`$$\begin{aligned}&(\sqrt a+4\sqrt b)^2-(\sqrt{a+16b})^2\\&=a+8\sqrt{ab}+16b-(a+16b)\\&=8\sqrt{ab}\end{aligned}$$`,
            T`$$\begin{aligned}&(2\sqrt a+3\sqrt b)^2-(\sqrt{4a+9b})^2\\&=4a+12\sqrt{ab}+9b-(4a+9b)\\&=12\sqrt{ab}\end{aligned}$$`,
            T`Both are positive because $a>0$ and $b>0$; and both sides of each inequality are positive, so $\text{LHS}>\text{RHS}$.`,
            T`(Exercise 4, $\sqrt a+\sqrt b>\sqrt{a+b}$, works the same way with $2\sqrt{ab}$.)`,
          ],
        },
        {
          id: 'root-wu1',
          type: 'proof',
          level: 'warmup',
          source: 'Lesson 1-15 · Warm Up 1',
          prompt: T`If $a>0$ and $b>0$, prove that $\sqrt{\dfrac{a^2+b^2}{2}}\ge\dfrac{a+b}{2}$, and determine when equality holds.`,
          steps: [
            {
              goal: 'Square each side and subtract.',
              options: [
                T`$(\text{LHS})^2-(\text{RHS})^2$ $\,{=\dfrac{a^2+b^2}{2}-\dfrac{a^2+2ab+b^2}{4}}$`,
                T`$(\text{LHS})^2-(\text{RHS})^2$ $\,{=\dfrac{a^2+b^2}{2}-\dfrac{a^2+b^2}{4}}$`,
                T`$(\text{LHS})^2-(\text{RHS})^2$ $\,{=\dfrac{a^2+b^2}{2}-\dfrac{a^2+2ab+b^2}{2}}$`,
              ],
              correct: 0,
              why: T`$(a+b)^2$ has a middle term $2ab$, and the denominator $2$ is squared too.`,
            },
            {
              goal: 'Put everything over 4 and simplify.',
              options: [T`$=\dfrac{a^2-2ab+b^2}{4}$`, T`$=\dfrac{a^2+2ab+b^2}{4}$`, T`$=\dfrac{-2ab}{4}$`],
              correct: 0,
              why: T`$\dfrac{2a^2+2b^2-a^2-2ab-b^2}{4}$.`,
            },
            {
              goal: 'Recognise a perfect square.',
              options: [
                T`$=\left(\dfrac{a-b}{2}\right)^2\ge0$`,
                T`$=\left(\dfrac{a-b}{2}\right)^2>0$`,
                T`$=\left(\dfrac{a+b}{2}\right)^2\ge0$`,
              ],
              correct: 0,
              why: T`This shows $(\text{LHS})^2\ge(\text{RHS})^2$ … (i)`,
            },
            {
              goal: 'What must be said before the squares can be removed?',
              options: [
                T`Since $a>0$, $b>0$: $\;\text{LHS}>0$ and $\text{RHS}>0$ … (ii)`,
                T`Nothing: $X^2\ge Y^2$ always gives $X\ge Y$`,
                T`Since $a>0$, $b>0$: $\;a>b$ … (ii)`,
              ],
              correct: 0,
              why: 'Comparing squares only compares the numbers when both are positive.',
            },
            {
              goal: 'Conclude, with the equality condition.',
              options: [
                T`From (i) and (ii), $\text{LHS}\ge\text{RHS}$. Equality holds when $a=b$`,
                T`From (i) and (ii), $\text{LHS}\ge\text{RHS}$. Equality holds when $a=-b$`,
                T`From (i) and (ii), $\text{LHS}>\text{RHS}$. Equality never holds`,
              ],
              correct: 0,
              why: T`$\dfrac{a-b}{2}=0$ when $a=b$. Check $a=b=3$: $\sqrt9=3=\dfrac62$.`,
            },
          ],
          hints: [T`$\left(\dfrac{a+b}{2}\right)^2=\dfrac{a^2+2ab+b^2}{4}$.`, T`Write $\dfrac{a^2+b^2}{2}$ as $\dfrac{2a^2+2b^2}{4}$ before subtracting.`],
          solution: [
            T`$$\begin{aligned}&(\text{LHS})^2-(\text{RHS})^2\\&=\frac{a^2+b^2}{2}-\frac{a^2+2ab+b^2}{4}\\&=\frac{a^2-2ab+b^2}{4}\\&=\left(\frac{a-b}{2}\right)^2\ge0\end{aligned}$$`,
            T`Thus $(\text{LHS})^2\ge(\text{RHS})^2$ … (i)`,
            T`Since $a>0$ and $b>0$, $\text{LHS}>0$ and $\text{RHS}>0$ … (ii)`,
            T`From (i) and (ii), $\sqrt{\dfrac{a^2+b^2}{2}}\ge\dfrac{a+b}{2}$. Equality holds when $\dfrac{a-b}{2}=0$, that is, when $a=b$.`,
          ],
        },
        {
          id: 'root-ex1',
          type: 'input',
          level: 'practice',
          source: 'Lesson 1-15 · Exercise 1',
          prompt: T`If $a>0$, we want to prove $2+a\ge\sqrt{3+6a}$. Simplify $(\text{LHS})^2-(\text{RHS})^2$ and write it as a perfect square, then say where equality holds.`,
          fields: [
            {key: 'd', label: T`$(\text{LHS})^2-(\text{RHS})^2=$`, answer: '(a-1)^2', rule: 'simplified', placeholder: 'a perfect square'},
            {key: 'eq', label: T`Equality holds when $a=$`, answer: '1', rule: 'number', placeholder: 'a number'},
          ],
          hints: [T`$(2+a)^2=4+4a+a^2$ and $(\sqrt{3+6a})^2=3+6a$.`, T`You should reach $a^2-2a+1$. Which bracket squared gives that?`],
          solution: [
            T`$$\begin{aligned}&(2+a)^2-(3+6a)\\&=a^2+4a+4-3-6a\\&=a^2-2a+1\\&=(a-1)^2\ge0\end{aligned}$$`,
            T`Since $a>0$, both $2+a$ and $\sqrt{3+6a}$ are positive, so $2+a\ge\sqrt{3+6a}$.`,
            T`Equality holds when $a-1=0$, that is, when $a=1$. (Check: $3=\sqrt9$.)`,
          ],
        },
        {
          id: 'root-try2',
          type: 'proof',
          level: 'practice',
          source: 'Lesson 1-15 · Try 2',
          prompt: T`If $a>0$ and $b>0$, prove that $2\sqrt a+\sqrt b>\sqrt{4a+b}$.`,
          steps: [
            {
              goal: 'Square the left-hand side.',
              options: [T`$(\text{LHS})^2=4a+4\sqrt{ab}+b$`, T`$(\text{LHS})^2=4a+b$`, T`$(\text{LHS})^2=4a+2\sqrt{ab}+b$`, T`$(\text{LHS})^2=2a+4\sqrt{ab}+b$`],
              correct: 0,
              why: T`$(2\sqrt a)^2=4a$, and the middle term is $2\cdot2\sqrt a\cdot\sqrt b$.`,
            },
            {
              goal: 'Subtract the square of the right-hand side.',
              options: [
                T`$(\text{LHS})^2-(\text{RHS})^2=4\sqrt{ab}$`,
                T`$(\text{LHS})^2-(\text{RHS})^2=4\sqrt{ab}+2b$`,
                T`$(\text{LHS})^2-(\text{RHS})^2=4\sqrt{ab}+8a$`,
              ],
              correct: 0,
              why: T`$(\sqrt{4a+b})^2=4a+b$, which cancels the $4a$ and the $b$.`,
            },
            {
              goal: 'Find the sign.',
              options: [
                T`Since $a>0$, $b>0$: $\;4\sqrt{ab}>0$, so $(\text{LHS})^2>(\text{RHS})^2$ … (i)`,
                T`Since $a>0$, $b>0$: $\;4\sqrt{ab}<0$, so $(\text{LHS})^2<(\text{RHS})^2$ … (i)`,
                T`Since $a>0$, $b>0$: $\;4\sqrt{ab}>0$, so $(\text{RHS})^2>(\text{LHS})^2$ … (i)`,
              ],
              correct: 0,
            },
            {
              goal: 'One more line is needed before concluding. Which?',
              options: [
                T`Also $2\sqrt a+\sqrt b>0$ and $\sqrt{4a+b}>0$ … (ii)`,
                'Nothing more: a bigger square always belongs to a bigger number',
                T`Also $4a+b>4a$ … (ii)`,
              ],
              correct: 0,
              why: 'This is the line students most often forget. Without it, (i) proves nothing about the sides themselves.',
            },
            {
              goal: 'Conclude.',
              options: [
                T`From (i) and (ii), $2\sqrt a+\sqrt b>\sqrt{4a+b}$`,
                T`From (i) and (ii), $2\sqrt a+\sqrt b\ge\sqrt{4a+b}$, with equality when $a=b$`,
                T`From (i) and (ii), $2\sqrt a+\sqrt b<\sqrt{4a+b}$`,
              ],
              correct: 0,
              why: T`The difference $4\sqrt{ab}$ is never zero for positive $a$, $b$, so the inequality is strict and has no equality case.`,
            },
          ],
          hints: [T`$(2\sqrt a+\sqrt b)^2=4a+4\sqrt{ab}+b$.`, 'After finding the sign of the difference of squares, say that both sides are positive.'],
          solution: [
            T`$$\begin{aligned}&(\text{LHS})^2-(\text{RHS})^2\\&=4a+4\sqrt{ab}+b-(4a+b)\\&=4\sqrt{ab}>0\end{aligned}$$`,
            T`Thus $(2\sqrt a+\sqrt b)^2>(\sqrt{4a+b})^2$ … (i)`,
            T`Since $a>0$, $b>0$: $2\sqrt a+\sqrt b>0$ and $\sqrt{4a+b}>0$ … (ii)`,
            T`From (i) and (ii), $2\sqrt a+\sqrt b>\sqrt{4a+b}$.`,
          ],
        },
        {
          id: 'missing-line',
          type: 'choice',
          level: 'practice',
          source: 'Lesson 1-15 · Point',
          prompt: T`A student proving $\sqrt a+\sqrt b>\sqrt{a+b}$ for $a>0$, $b>0$ writes: “$(\text{LHS})^2-(\text{RHS})^2=2\sqrt{ab}>0$. Therefore $\text{LHS}>\text{RHS}$.” What is wrong?`,
          options: [
            'A line is missing: both sides are positive, so comparing squares is allowed',
            T`The difference of squares should be $\sqrt{ab}$, not $2\sqrt{ab}$`,
            'Nothing: the proof is complete',
            T`The sign should be $\ge$, with equality when $a=b$`,
          ],
          correct: 0,
          feedback: [
            T`$(\text{LHS})^2>(\text{RHS})^2$ gives $\text{LHS}>\text{RHS}$ only when $\text{LHS}>0$ and $\text{RHS}>0$, and the proof has to say so.`,
            T`$(\sqrt a+\sqrt b)^2=a+2\sqrt{ab}+b$, so $2\sqrt{ab}$ is correct.`,
            T`Remember $-3<2$ but $(-3)^2>2^2$. What makes that impossible here?`,
            T`$2\sqrt{ab}$ is strictly positive when $a>0$, $b>0$, so equality never holds.`,
          ],
          solution: [
            T`The calculation is right: $(\sqrt a+\sqrt b)^2-(a+b)=2\sqrt{ab}>0$.`,
            T`But the step from squares back to the sides needs: “Since $a>0$, $b>0$: $\sqrt a+\sqrt b>0$ and $\sqrt{a+b}>0$.”`,
          ],
        },
        {
          id: 'root-try1',
          type: 'proof',
          level: 'practice',
          source: 'Lesson 1-15 · Try 1',
          prompt: T`If $a>0$ and $b>0$, prove that $\sqrt{2(a+b)}\ge\sqrt a+\sqrt b$, and determine when equality holds.`,
          steps: [
            {
              goal: 'Square each side and subtract.',
              options: [
                T`$(\text{LHS})^2-(\text{RHS})^2=2(a+b)-(a+2\sqrt{ab}+b)$`,
                T`$(\text{LHS})^2-(\text{RHS})^2=2(a+b)-(a+b)$`,
                T`$(\text{LHS})^2-(\text{RHS})^2=2(a+b)-(a+\sqrt{ab}+b)$`,
              ],
              correct: 0,
              why: T`$(\sqrt a+\sqrt b)^2$ is not $a+b$: the middle term is $2\sqrt a\sqrt b=2\sqrt{ab}$.`,
            },
            {
              goal: 'Simplify.',
              options: [T`$=a-2\sqrt{ab}+b$`, T`$=a+2\sqrt{ab}+b$`, T`$=a+b$`],
              correct: 0,
            },
            {
              goal: 'Recognise a perfect square.',
              options: [
                T`$=(\sqrt a-\sqrt b)^2\ge0$`,
                T`$=(\sqrt a+\sqrt b)^2\ge0$`,
                T`$=(a-b)^2\ge0$`,
              ],
              correct: 0,
              why: T`$(\sqrt a)^2-2\sqrt a\sqrt b+(\sqrt b)^2$.`,
            },
            {
              goal: 'Go back from the squares to the sides.',
              options: [
                T`Both sides are positive, so $\sqrt{2(a+b)}\ge\sqrt a+\sqrt b$`,
                T`Squares keep the order of any two real numbers, so $\sqrt{2(a+b)}\ge\sqrt a+\sqrt b$`,
                T`Both sides are positive, so $\sqrt{2(a+b)}>\sqrt a+\sqrt b$`,
              ],
              correct: 0,
            },
            {
              goal: 'State when equality holds.',
              options: [
                T`Equality holds when $\sqrt a=\sqrt b$, that is, when $a=b$`,
                T`Equality holds when $ab=1$`,
                'Equality never holds',
              ],
              correct: 0,
              why: T`Check $a=b=1$: $\sqrt4=2=1+1$.`,
            },
          ],
          hints: [T`$(\sqrt a+\sqrt b)^2=a+2\sqrt{ab}+b$.`, T`$a-2\sqrt{ab}+b$ is $X^2-2XY+Y^2$ with $X=\sqrt a$, $Y=\sqrt b$.`],
          solution: [
            T`$$\begin{aligned}&(\text{LHS})^2-(\text{RHS})^2\\&=2(a+b)-(a+2\sqrt{ab}+b)\\&=a-2\sqrt{ab}+b\\&=(\sqrt a-\sqrt b)^2\ge0\end{aligned}$$`,
            T`Since $a>0$, $b>0$, both sides are positive, so $\sqrt{2(a+b)}\ge\sqrt a+\sqrt b$.`,
            T`Equality holds when $\sqrt a-\sqrt b=0$, that is, when $a=b$.`,
          ],
        },
        {
          id: 'root-ex6',
          type: 'choice',
          level: 'practice',
          source: 'Lesson 1-15 · Exercise 6',
          prompt: T`For $a>b>0$, prove $\sqrt{a-b}>\sqrt a-\sqrt b$. Squaring gives $$\begin{aligned}(\text{LHS})^2-(\text{RHS})^2&=2\sqrt{ab}-2b\\&=2\sqrt b\,(\sqrt a-\sqrt b)\end{aligned}$$ Where does the proof use the condition $a>b$?`,
          options: [
            T`Twice: it makes $\sqrt a-\sqrt b>0$, so the difference of squares is positive **and** the right-hand side is positive`,
            T`Only to make sure $\sqrt{a-b}$ exists`,
            T`Only to make $2\sqrt b$ positive`,
            T`Nowhere: the inequality holds for all positive $a$, $b$`,
          ],
          correct: 0,
          feedback: [
            T`$\sqrt a>\sqrt b$ gives the sign of the product, and it is also what makes $\text{RHS}=\sqrt a-\sqrt b$ positive, so that squares may be compared.`,
            T`It does that too, but the sign of $\sqrt a-\sqrt b$ matters in two more places.`,
            T`$2\sqrt b>0$ comes from $b>0$, not from $a>b$.`,
            T`If $a<b$, then $\sqrt{a-b}$ is not even a real number.`,
          ],
          hints: [T`Look at the factor $(\sqrt a-\sqrt b)$, and at the right-hand side of the inequality itself.`],
          solution: [
            T`$$\begin{aligned}&(\text{LHS})^2-(\text{RHS})^2\\&=(a-b)-(a-2\sqrt{ab}+b)\\&=2\sqrt{ab}-2b\\&=2\sqrt b\,(\sqrt a-\sqrt b)\end{aligned}$$`,
            T`Since $a>b>0$: $\sqrt a>\sqrt b$, so this is positive, and $\text{RHS}=\sqrt a-\sqrt b>0$. Also $\text{LHS}=\sqrt{a-b}>0$.`,
            T`Both sides are positive and $(\text{LHS})^2>(\text{RHS})^2$, so $\sqrt{a-b}>\sqrt a-\sqrt b$.`,
          ],
        },
        {
          id: 'root-challenge',
          type: 'proof',
          level: 'challenge',
          source: 'Lesson 1-15 · Challenge — A Root Inequality',
          prompt: T`If $a>b$, where $a$ and $b$ are two positive numbers, prove that $\sqrt{a-b}<\sqrt a-\dfrac{b}{2\sqrt a}$.`,
          steps: [
            {
              goal: 'Square the right-hand side.',
              options: [
                T`$(\text{RHS})^2=a-b+\dfrac{b^2}{4a}$`,
                T`$(\text{RHS})^2=a-\dfrac{b^2}{4a}$`,
                T`$(\text{RHS})^2=a-2b+\dfrac{b^2}{4a}$`,
                T`$(\text{RHS})^2=a+b+\dfrac{b^2}{4a}$`,
              ],
              correct: 0,
              why: T`The middle term is $-2\cdot\sqrt a\cdot\dfrac{b}{2\sqrt a}=-b$.`,
            },
            {
              goal: 'Subtract the square of the left-hand side (the bigger side goes first).',
              options: [
                T`$(\text{RHS})^2-(\text{LHS})^2=\dfrac{b^2}{4a}$`,
                T`$(\text{RHS})^2-(\text{LHS})^2=\dfrac{b^2}{4a}-2b$`,
                T`$(\text{RHS})^2-(\text{LHS})^2=-\dfrac{b^2}{4a}$`,
              ],
              correct: 0,
              why: T`$(\sqrt{a-b})^2=a-b$, which cancels.`,
            },
            {
              goal: 'Find the sign.',
              options: [
                T`Since $a>0$, $b>0$: $\;\dfrac{b^2}{4a}>0$, so $(\text{RHS})^2>(\text{LHS})^2$ … (i)`,
                T`Since $a>0$, $b>0$: $\;\dfrac{b^2}{4a}<0$, so $(\text{RHS})^2<(\text{LHS})^2$ … (i)`,
                T`Since $a>b$: $\;\dfrac{b^2}{4a}>1$, so $(\text{RHS})^2>(\text{LHS})^2$ … (i)`,
              ],
              correct: 0,
            },
            {
              goal: 'Check that the right-hand side is positive. It is not obvious here!',
              options: [
                T`$\text{RHS}=\dfrac{2a-b}{2\sqrt a}>0$, because $a>b>0$ … (ii)`,
                T`$\text{RHS}>0$, because it contains a square root … (ii)`,
                T`$\text{RHS}=\dfrac{a-b}{2\sqrt a}>0$, because $a>b$ … (ii)`,
              ],
              correct: 0,
              why: T`$\sqrt a=\dfrac{2a}{2\sqrt a}$, and $2a-b=a+(a-b)>0$. Also $\text{LHS}=\sqrt{a-b}>0$.`,
            },
            {
              goal: 'Conclude.',
              options: [
                T`From (i) and (ii), $\sqrt{a-b}<\sqrt a-\dfrac{b}{2\sqrt a}$`,
                T`From (i) and (ii), $\sqrt{a-b}>\sqrt a-\dfrac{b}{2\sqrt a}$`,
                T`From (i) and (ii), $\sqrt{a-b}\le\sqrt a-\dfrac{b}{2\sqrt a}$, with equality when $a=2b$`,
              ],
              correct: 0,
              why: T`Check $a=4$, $b=1$: $\sqrt3\approx1.732<2-\tfrac14=1.75$.`,
            },
          ],
          hints: [
            T`Use $(P-Q)^2=P^2-2PQ+Q^2$ with $P=\sqrt a$ and $Q=\dfrac{b}{2\sqrt a}$.`,
            T`$2PQ=b$ and $Q^2=\dfrac{b^2}{4a}$.`,
            T`To see that the right-hand side is positive, write it as one fraction over $2\sqrt a$.`,
          ],
          solution: [
            T`$$\begin{aligned}&(\text{RHS})^2\\&=a-2\sqrt a\cdot\frac{b}{2\sqrt a}+\frac{b^2}{4a}\\&=a-b+\frac{b^2}{4a}\end{aligned}$$`,
            T`$$\begin{aligned}&(\text{RHS})^2-(\text{LHS})^2\\&=a-b+\frac{b^2}{4a}-(a-b)\\&=\frac{b^2}{4a}>0\quad\ldots\text{(i)}\end{aligned}$$`,
            T`Since $a>b>0$: $\text{LHS}=\sqrt{a-b}>0$ and $\text{RHS}=\dfrac{2a-b}{2\sqrt a}>0$ … (ii)`,
            T`From (i) and (ii), $\sqrt{a-b}<\sqrt a-\dfrac{b}{2\sqrt a}$.`,
          ],
        },
      ],
    },

    /* ================================================================== 1-16 */
    {
      id: '1-16',
      title: 'Proving Inequalities (4): the AM-GM inequality',
      blurb: T`For positive numbers the ordinary average is never smaller than the geometric mean, and that single fact finds maximum and minimum values.`,
      ideas: [
        {
          title: 'Two kinds of mean',
          body: [
            T`For the numbers $2$ and $8$:`,
            T`$$\text{AM}=\frac{2+8}{2}=5$$`,
            T`$$\text{GM}=\sqrt{2\times8}=4$$`,
            T`The geometric mean is the side of the square with the same area as a $2\times8$ rectangle.`,
          ],
        },
        {
          title: 'The AM-GM inequality',
          body: [
            T`When $a>0$ and $b>0$:`,
            T`$$\frac{a+b}{2}\ge\sqrt{ab}$$`,
            T`or, multiplying by 2, $\;a+b\ge2\sqrt{ab}$.`,
            T`Equality holds when $a=b$.`,
          ],
        },
        {
          title: 'Hunt for a constant product',
          body: [
            T`AM-GM is most useful when the product of the two terms is a constant:`,
            T`$$a\times\frac1a=1\;\Rightarrow\;a+\frac1a\ge2\sqrt1=2$$`,
            T`Always write “since $\ldots>0$” first: that is what allows you to use it.`,
          ],
        },
      ],
      widget: {
        title: 'AM-GM lab',
        blurb: T`See why $\dfrac{a+b}{2}\ge\sqrt{ab}$ in a single picture, then use it to find the largest rectangle you can make from a fixed perimeter.`,
        Component: AmGmLab,
      },
      exercises: [
        {
          id: 'means',
          type: 'input',
          level: 'warmup',
          source: 'Lesson 1-16 · Point',
          prompt: T`Find the arithmetic mean and the geometric mean of $4$ and $9$.`,
          fields: [
            {key: 'am', label: 'Arithmetic mean', answer: '6.5', rule: 'number', placeholder: 'a number'},
            {key: 'gm', label: 'Geometric mean', answer: '6', rule: 'number', placeholder: 'a number'},
          ],
          hints: [T`$\text{AM}=\dfrac{a+b}{2}$ and $\text{GM}=\sqrt{ab}$.`],
          solution: [T`$$\text{AM}=\frac{4+9}{2}=6.5$$`, T`$$\text{GM}=\sqrt{4\times9}=\sqrt{36}=6$$`, T`As AM-GM promises, $6.5\ge6$. They are not equal because $4\ne9$.`],
        },
        {
          id: 'reflect',
          type: 'choice',
          level: 'warmup',
          source: 'Lesson 1-16 · Reflect',
          prompt: T`Break the rule on purpose: put $a=-2$ and $b=-8$ into $\dfrac{a+b}{2}\ge\sqrt{ab}$. What happens?`,
          options: [
            T`$\text{AM}=-5$ and $\text{GM}=4$, so the inequality is false`,
            T`$\text{AM}=5$ and $\text{GM}=4$, so the inequality still holds`,
            T`$\text{AM}=-5$ and $\text{GM}=-4$, so the inequality is false`,
            T`$\sqrt{ab}$ does not exist, because $a$ and $b$ are negative`,
          ],
          correct: 0,
          feedback: [
            T`$-5\ge4$ is false. AM-GM is only guaranteed when $a>0$ and $b>0$, which is why every proof starts by saying so.`,
            T`The sum is $-2+(-8)=-10$, so the mean is $-5$.`,
            T`$ab=(-2)(-8)=+16$, and $\sqrt{16}=4$: a square root is never negative.`,
            T`The product of two negatives is positive: $ab=16$, so $\sqrt{ab}=4$ exists.`,
          ],
          solution: [
            T`$$\text{AM}=\frac{-2+(-8)}{2}=-5$$`,
            T`$$\text{GM}=\sqrt{(-2)(-8)}=\sqrt{16}=4$$`,
            T`$-5\ge4$ is false: the inequality breaks down. The conditions $a>0$, $b>0$ are part of the theorem, not decoration.`,
          ],
        },
        {
          id: 'amgm-wu1',
          type: 'proof',
          level: 'warmup',
          source: 'Lesson 1-16 · Warm Up 1',
          prompt: T`If $a>0$ and $b>0$, prove that $\dfrac ba+\dfrac ab\ge2$, and determine when equality holds.`,
          steps: [
            {
              goal: 'The line the textbook says you must always write first.',
              options: [
                T`Since $a>0$ and $b>0$: $\;\dfrac ba>0$ and $\dfrac ab>0$`,
                T`Since $\dfrac ba$ and $\dfrac ab$ are fractions, AM-GM applies`,
                T`Since $a>0$ and $b>0$: $\;\dfrac ba\ge\dfrac ab$`,
              ],
              correct: 0,
              why: 'AM-GM is only allowed for positive numbers, so say that the two terms are positive.',
            },
            {
              goal: 'Apply the AM-GM inequality to the two terms.',
              options: [
                T`$\dfrac ba+\dfrac ab\ge2\sqrt{\dfrac ba\times\dfrac ab}$`,
                T`$\dfrac ba+\dfrac ab\ge\sqrt{\dfrac ba\times\dfrac ab}$`,
                T`$\dfrac ba+\dfrac ab\le2\sqrt{\dfrac ba\times\dfrac ab}$`,
                T`$\dfrac ba+\dfrac ab\ge2\sqrt{\dfrac ba+\dfrac ab}$`,
              ],
              correct: 0,
              why: T`$A+B\ge2\sqrt{AB}$: twice the root of the **product**.`,
            },
            {
              goal: 'Simplify the right-hand side.',
              options: [T`$=2\sqrt1=2$`, T`$=2\sqrt2$`, T`$=2\sqrt{\dfrac{b^2}{a^2}}=\dfrac{2b}{a}$`],
              correct: 0,
              why: T`The product is a constant: $\dfrac ba\times\dfrac ab=1$. So $\dfrac ba+\dfrac ab\ge2$.`,
            },
            {
              goal: 'Equality in AM-GM holds when the two terms are equal.',
              options: [
                T`Equality holds when $\dfrac ba=\dfrac ab$, so $b^2=a^2$`,
                T`Equality holds when $\dfrac ba\times\dfrac ab=1$`,
                T`Equality holds when $\dfrac ba+\dfrac ab=0$`,
              ],
              correct: 0,
              why: T`Multiply both sides by $ab$.`,
            },
            {
              goal: T`Solve $b^2=a^2$.`,
              options: [T`Since $a>0$ and $b>0$: $\;a=b$`, T`So $a=b$ or $a=-b$`, T`So $a=b=1$ only`],
              correct: 0,
              why: T`$a=-b$ is impossible when both are positive.`,
            },
          ],
          hints: [T`Use $A+B\ge2\sqrt{AB}$ with $A=\dfrac ba$ and $B=\dfrac ab$.`, T`$\dfrac ba\times\dfrac ab=1$.`],
          solution: [
            T`Since $a>0$ and $b>0$, we have $\dfrac ba>0$ and $\dfrac ab>0$. By the AM-GM inequality,`,
            T`$$\frac ba+\frac ab\ge2\sqrt{\frac ba\times\frac ab}=2$$`,
            T`Equality holds when $\dfrac ba=\dfrac ab$, that is $b^2=a^2$. Since $a>0$, $b>0$, this means $a=b$.`,
          ],
        },
        {
          id: 'amgm-ex1',
          type: 'input',
          level: 'practice',
          source: 'Lesson 1-16 · Exercise 1',
          prompt: T`For $a>0$, what is the smallest possible value of $a+\dfrac4a$, and for which $a$ is it reached?`,
          fields: [
            {key: 'min', label: 'Smallest value', answer: '4', rule: 'number', placeholder: 'a number'},
            {key: 'a', label: T`reached when $a=$`, answer: '2', rule: 'number', placeholder: 'a number'},
          ],
          hints: [T`The product $a\times\dfrac4a$ is a constant. Which constant?`, T`$a+\dfrac4a\ge2\sqrt4$.`, T`Equality needs the two terms to be equal: $a=\dfrac4a$.`],
          solution: [
            T`Since $a>0$, we have $a>0$ and $\dfrac4a>0$. By the AM-GM inequality,`,
            T`$$a+\frac4a\ge2\sqrt{a\times\frac4a}=2\sqrt4=4$$`,
            T`Equality holds when $a=\dfrac4a$, so $a^2=4$, and since $a>0$, $a=2$. (Check: $2+2=4$.)`,
          ],
        },
        {
          id: 'amgm-try1',
          type: 'proof',
          level: 'practice',
          source: 'Lesson 1-16 · Try 1',
          prompt: T`If $a>0$ and $b>0$, prove that $\dfrac{b}{3a}+\dfrac{12a}{b}\ge4$, and determine when equality holds.`,
          steps: [
            {
              goal: 'Begin correctly.',
              options: [
                T`Since $a>0$ and $b>0$: $\;\dfrac{b}{3a}>0$ and $\dfrac{12a}{b}>0$`,
                'No conditions are needed: AM-GM works for all real numbers',
                T`Since $a>0$ and $b>0$: $\;\dfrac{b}{3a}>\dfrac{12a}{b}$`,
              ],
              correct: 0,
            },
            {
              goal: 'Apply the AM-GM inequality.',
              options: [
                T`$\dfrac{b}{3a}+\dfrac{12a}{b}\ge2\sqrt{\dfrac{b}{3a}\times\dfrac{12a}{b}}$`,
                T`$\dfrac{b}{3a}+\dfrac{12a}{b}\ge\sqrt{\dfrac{b}{3a}\times\dfrac{12a}{b}}$`,
                T`$\dfrac{b}{3a}+\dfrac{12a}{b}\ge2\sqrt{\dfrac{b}{3a}+\dfrac{12a}{b}}$`,
              ],
              correct: 0,
            },
            {
              goal: 'Simplify the product under the root.',
              options: [T`$=2\sqrt4=4$`, T`$=2\sqrt{36}=12$`, T`$=\sqrt4=2$`],
              correct: 0,
              why: T`$\dfrac{b}{3a}\times\dfrac{12a}{b}=\dfrac{12}{3}=4$: everything else cancels.`,
            },
            {
              goal: 'Set the two terms equal to find the equality case.',
              options: [
                T`Equality holds when $\dfrac{b}{3a}=\dfrac{12a}{b}$, so $b^2=36a^2$`,
                T`Equality holds when $\dfrac{b}{3a}=\dfrac{12a}{b}$, so $b^2=4a^2$`,
                T`Equality holds when $\dfrac{b}{3a}=\dfrac{12a}{b}$, so $b^2=12a^2$`,
              ],
              correct: 0,
              why: T`Cross-multiply: $b\times b=3a\times12a$.`,
            },
            {
              goal: 'Finish.',
              options: [T`Since $a>0$ and $b>0$: $\;b=6a$`, T`So $b=6a$ or $b=-6a$`, T`Since $a>0$ and $b>0$: $\;a=6b$`],
              correct: 0,
              why: T`Check $a=1$, $b=6$: $\dfrac63+\dfrac{12}{6}=2+2=4$.`,
            },
          ],
          hints: [T`Multiply the two terms: all the letters cancel.`, T`$2\sqrt4=4$. For equality, set $\dfrac{b}{3a}=\dfrac{12a}{b}$.`],
          solution: [
            T`Since $a>0$ and $b>0$, we have $\dfrac{b}{3a}>0$ and $\dfrac{12a}{b}>0$. By the AM-GM inequality,`,
            T`$$\begin{aligned}\frac{b}{3a}+\frac{12a}{b}&\ge2\sqrt{\frac{b}{3a}\times\frac{12a}{b}}\\&=2\sqrt4=4\end{aligned}$$`,
            T`Equality holds when $\dfrac{b}{3a}=\dfrac{12a}{b}$, that is $b^2=36a^2$. Since $a>0$, $b>0$, this means $b=6a$.`,
          ],
        },
        {
          id: 'amgm-ex5',
          type: 'input',
          level: 'practice',
          source: 'Lesson 1-16 · Exercise 5',
          prompt: T`For $a>0$, $b>0$, expanding gives $$\begin{aligned}&(a+8b)\left(\frac2a+\frac1b\right)\\&=\frac ab+\frac{16b}{a}+k\end{aligned}$$ Find the constant $k$, the smallest possible value of the whole expression, and when it is reached.`,
          fields: [
            {key: 'k', label: T`$k=$`, answer: '10', rule: 'number', placeholder: 'a number'},
            {key: 'min', label: 'Smallest value', answer: '18', rule: 'number', placeholder: 'a number'},
            {key: 'eq', label: T`reached when $a=$`, answer: '4b', placeholder: 'in terms of b'},
          ],
          hints: [
            T`$a\times\dfrac2a=2$ and $8b\times\dfrac1b=8$.`,
            T`$\dfrac ab\times\dfrac{16b}{a}=16$, so $\dfrac ab+\dfrac{16b}{a}\ge2\sqrt{16}$.`,
            T`Equality: $\dfrac ab=\dfrac{16b}{a}$ gives $a^2=16b^2$.`,
          ],
          solution: [
            T`$$\begin{aligned}&(a+8b)\left(\frac2a+\frac1b\right)\\&=2+\frac ab+\frac{16b}{a}+8\\&=\frac ab+\frac{16b}{a}+10\end{aligned}$$`,
            T`Since $\dfrac ab>0$ and $\dfrac{16b}{a}>0$, by the AM-GM inequality $\dfrac ab+\dfrac{16b}{a}\ge2\sqrt{16}=8$.`,
            T`So the expression is at least $8+10=18$.`,
            T`Equality holds when $\dfrac ab=\dfrac{16b}{a}$, that is $a^2=16b^2$, so $a=4b$. (Check $a=4$, $b=1$: $12\times1.5=18$.)`,
          ],
        },
        {
          id: 'amgm-try2',
          type: 'proof',
          level: 'practice',
          source: 'Lesson 1-16 · Try 2',
          prompt: T`If $a>0$ and $b>0$, prove that $\left(a+\dfrac1b\right)\left(b+\dfrac9a\right)\ge16$, and determine when equality holds.`,
          steps: [
            {
              goal: 'Expand the brackets first.',
              options: [
                T`$\left(a+\dfrac1b\right)\left(b+\dfrac9a\right)=ab+\dfrac{9}{ab}+10$`,
                T`$\left(a+\dfrac1b\right)\left(b+\dfrac9a\right)=ab+\dfrac{9}{ab}$`,
                T`$\left(a+\dfrac1b\right)\left(b+\dfrac9a\right)=ab+\dfrac{9}{ab}+9$`,
              ],
              correct: 0,
              why: T`$a\times\dfrac9a=9$ and $\dfrac1b\times b=1$.`,
            },
            {
              goal: 'Prepare to use AM-GM on the two terms that are not constant.',
              options: [
                T`Since $a>0$ and $b>0$: $\;ab>0$ and $\dfrac{9}{ab}>0$`,
                T`Since $a>0$ and $b>0$: $\;ab>\dfrac{9}{ab}$`,
                T`Since the product is $9$, no condition is needed`,
              ],
              correct: 0,
            },
            {
              goal: 'Apply the AM-GM inequality.',
              options: [
                T`$ab+\dfrac{9}{ab}\ge2\sqrt{ab\times\dfrac{9}{ab}}=6$`,
                T`$ab+\dfrac{9}{ab}\ge\sqrt{ab\times\dfrac{9}{ab}}=3$`,
                T`$ab+\dfrac{9}{ab}\ge2\sqrt{ab\times\dfrac{9}{ab}}=18$`,
              ],
              correct: 0,
              why: T`$2\sqrt9=2\times3$.`,
            },
            {
              goal: 'Add 10 to both sides to match the expansion.',
              options: [T`So $ab+\dfrac{9}{ab}+10\ge16$`, T`So $ab+\dfrac{9}{ab}+10\ge60$`, T`So $ab+\dfrac{9}{ab}+10\ge6$`],
              correct: 0,
            },
            {
              goal: 'State when equality holds.',
              options: [
                T`Equality holds when $ab=\dfrac{9}{ab}$, that is, when $ab=3$`,
                T`Equality holds when $ab=\dfrac{9}{ab}$, that is, when $ab=9$`,
                T`Equality holds when $a=b$`,
              ],
              correct: 0,
              why: T`$(ab)^2=9$ and $ab>0$. Check $a=1$, $b=3$: $\dfrac43\times12=16$. But $a=b=1$ gives $2\times10=20$.`,
            },
          ],
          hints: [T`Expand: four products, two of which are plain numbers.`, T`Treat $ab$ as one positive quantity: $ab\times\dfrac{9}{ab}=9$.`],
          solution: [
            T`$$\begin{aligned}&\left(a+\frac1b\right)\left(b+\frac9a\right)\\&=ab+9+1+\frac{9}{ab}\\&=ab+\frac{9}{ab}+10\end{aligned}$$`,
            T`Since $ab>0$ and $\dfrac{9}{ab}>0$, by the AM-GM inequality $ab+\dfrac{9}{ab}\ge2\sqrt9=6$.`,
            T`Therefore $\left(a+\dfrac1b\right)\left(b+\dfrac9a\right)\ge6+10=16$.`,
            T`Equality holds when $ab=\dfrac{9}{ab}$, that is $(ab)^2=9$, so $ab=3$.`,
          ],
        },
        {
          id: 'equality-trap',
          type: 'choice',
          level: 'practice',
          source: 'Lesson 1-16 · Exercise 4',
          prompt: T`For $x>0$ the textbook claims $\left(x+\dfrac1x\right)\left(x+\dfrac4x\right)\ge9$. A student argues: “By AM-GM, $x+\dfrac1x\ge2$ and $x+\dfrac4x\ge4$, so the product is $\ge8$, and $8$ is the smallest value.” What is the truth?`,
          options: [
            T`$\ge8$ is true but $8$ is never reached: the two equality cases need $x=1$ and $x=2$ at once. Expanding first gives the real minimum, $9$`,
            T`The student is right: the minimum is $8$ and the textbook is wrong`,
            T`The student's inequalities are false: you cannot use AM-GM on $x+\dfrac4x$`,
            T`Two inequalities between positive numbers can never be multiplied`,
          ],
          correct: 0,
          feedback: [
            T`Exactly. $x+\dfrac1x=2$ only at $x=1$, and $x+\dfrac4x=4$ only at $x=2$. A bound is a minimum only if its equality case can actually occur.`,
            T`Try to find an $x$ that gives $8$: at $x=1$ the product is $2\times5=10$, at $x=2$ it is $2.5\times4=10$.`,
            T`Both uses are fine: the products $x\cdot\dfrac1x=1$ and $x\cdot\dfrac4x=4$ are constants.`,
            T`For positive numbers it is allowed, and $\ge8$ is true. The problem is elsewhere.`,
          ],
          hints: [T`When does equality hold in $x+\dfrac1x\ge2$? And in $x+\dfrac4x\ge4$?`, T`Expand the product: $x^2+\dfrac{4}{x^2}+5$.`],
          solution: [
            T`The student's bound is true but not sharp: equality would need $x=1$ and $x=2$ at the same time.`,
            T`Expand first: $$\left(x+\frac1x\right)\left(x+\frac4x\right)=x^2+\frac{4}{x^2}+5$$`,
            T`Since $x^2>0$ and $\dfrac{4}{x^2}>0$, AM-GM gives $x^2+\dfrac{4}{x^2}\ge2\sqrt4=4$, so the product is $\ge9$.`,
            T`Equality holds when $x^2=\dfrac{4}{x^2}$, that is $x^4=4$, so $x=\sqrt2$: this time the equality case really occurs.`,
          ],
        },
        {
          id: 'which-tool',
          type: 'choice',
          level: 'practice',
          source: 'Lessons 1-13 to 1-16 · review',
          prompt: T`Match each inequality with the tool that proves it most directly. **P:** if $a>1$, $b>1$ then $ab+1>a+b$. **Q:** $9x^2\ge y(6x-y)$ for all real $x$, $y$. **R:** if $a>0$, $b>0$ then $\sqrt a+\sqrt b>\sqrt{a+b}$. **S:** if $a>0$, $b>0$ then $3ab+\dfrac{4}{ab}\ge4\sqrt3$.`,
          options: [
            'P factorise the difference · Q complete the square · R compare the squares · S AM-GM',
            'P complete the square · Q factorise the difference · R compare the squares · S AM-GM',
            'P factorise the difference · Q AM-GM · R compare the squares · S complete the square',
            'P factorise the difference · Q complete the square · R AM-GM · S compare the squares',
          ],
          correct: 0,
          feedback: [
            T`Conditions like $a>1$ → factorise into those brackets. All real numbers → a square. Roots → squares of positive sides. A sum with a constant product → AM-GM.`,
            T`P comes with conditions, so you want the brackets $(a-1)(b-1)$. Q has no conditions at all, so it needs something that is never negative.`,
            T`AM-GM needs positive numbers, but Q is for all real $x$, $y$.`,
            T`In S the product $3ab\times\dfrac{4}{ab}=12$ is constant: the signature of AM-GM.`,
          ],
          solution: [
            T`**P:** $ab+1-a-b=(a-1)(b-1)>0$.`,
            T`**Q:** $9x^2-6xy+y^2=(3x-y)^2\ge0$.`,
            T`**R:** $(\sqrt a+\sqrt b)^2-(a+b)=2\sqrt{ab}>0$, and both sides are positive.`,
            T`**S:** $3ab>0$, $\dfrac{4}{ab}>0$, so $3ab+\dfrac{4}{ab}\ge2\sqrt{12}=4\sqrt3$ (Exercise 2), with equality when $3ab=\dfrac{4}{ab}$.`,
          ],
        },
        {
          id: 'max-area',
          type: 'input',
          level: 'challenge',
          source: 'Lesson 1-16 · Challenge — Maximum Area',
          prompt: T`A rectangle with length $L$ and width $W$ has a perimeter of $200$ cm. Use the relation between A.M. and G.M. to find the largest area it can have.`,
          fields: [
            {key: 'sum', label: T`$L+W=$`, answer: '100', rule: 'number', placeholder: 'a number'},
            {key: 'area', label: T`Largest area (cm²)`, answer: '2500', rule: 'number', placeholder: 'a number'},
            {key: 'l', label: T`reached when $L=$`, answer: '50', rule: 'number', placeholder: 'a number'},
          ],
          hints: [
            T`$2L+2W=200$.`,
            T`AM-GM the other way round: $\sqrt{LW}\le\dfrac{L+W}{2}$.`,
            T`Both sides are positive, so you may square: $LW\le50^2$.`,
          ],
          solution: [
            T`$2L+2W=200$, so $L+W=100$.`,
            T`Since $L>0$ and $W>0$, by the AM-GM inequality $$\sqrt{LW}\le\frac{L+W}{2}=50$$`,
            T`Both sides are positive, so squaring gives $LW\le2500$: the area is at most $2500\text{ cm}^2$.`,
            T`Equality holds when $L=W$, that is $L=W=50$: the best rectangle is a square.`,
          ],
        },
      ],
    },
  ],
};

// Choice options are shown in the order given (only proof steps are shuffled by the framework), so the
// choices above are authored with the correct option first and moved to these positions here.
const CORRECT_AT: Record<string, number> = {
  'cond-rewrite': 1,
  flip: 1,
  'ex4-needed': 2,
  'can-be-negative': 2,
  'sq-try2': 2,
  'squares-trap': 1,
  'missing-line': 2,
  'root-ex6': 1,
  reflect: 2,
  'equality-trap': 1,
  'which-tool': 3,
};
const place = (ex: Exercise): Exercise => {
  if (ex.type !== 'choice') return ex;
  const at = CORRECT_AT[ex.id] ?? 0;
  const move = <X,>(xs: X[]) => {
    const [first, ...rest] = xs;
    rest.splice(at, 0, first);
    return rest;
  };
  return {...ex, correct: at, options: move(ex.options), feedback: ex.feedback ? move(ex.feedback) : undefined};
};

// Long inline maths wraps on a phone, and KaTeX may break a line after any top-level operator, even inside
// brackets: "(a − b)(x −" / "y)". Wrapping a piece in a TeX group keeps it on one line, so this groups every
// bracket, every "LHS − RHS", and every formula short enough to fit a phone line as a whole; longer lines then
// only break between terms. A full stop or comma after a formula is pulled inside it so it cannot wrap alone.
// Applied to every rich string of this concept (display maths is left alone).
const WIDE = /\\(ge|le|ne|iff|times|cdot|approx|Rightarrow|ldots|dots)(?![a-zA-Z])/g;
/** Rough rendered width of some TeX, in units of about one letter. */
const width = (tex: string) => {
  const wide = (tex.match(WIDE) ?? []).length + (tex.match(/[-+=<>]/g) ?? []).length;
  const roots = (tex.match(/\\sqrt/g) ?? []).length;
  const rest = tex.replace(/\\[a-zA-Z]+|\\.|[-+=<>{}^_\s]/g, '');
  const brackets = (rest.match(/[()]/g) ?? []).length;
  return wide * 2.3 + roots + brackets * 0.6 + (rest.length - brackets);
};
const glueInline = (tex: string) => {
  const out = tex
    .replace(/(?<!\\left|\\right)\(([^()]*)\)/g, '{($1)}')
    .replace(/\\text\{LHS\}-\\text\{RHS\}/g, '{\\text{LHS}-\\text{RHS}}');
  return width(tex) <= 19 ? '{' + out + '}' : out;
};
const glue = (text: string) =>
  text
    .split(/(\$\$[^$]+\$\$)/)
    .map((part) =>
      part.startsWith('$$')
        ? part
        : part.replace(/\$([^$]+)\$([.,]?)/g, (_m, tex: string, punct: string) => '$' + glueInline(tex) + punct + '$'),
    )
    .join('');
const glueAll = <V,>(v: V): V =>
  (typeof v === 'string'
    ? glue(v)
    : Array.isArray(v)
      ? v.map(glueAll)
      : v && typeof v === 'object'
        ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, ['id', 'answer', 'key', 'type', 'level', 'rule'].includes(k) ? x : glueAll(x)]))
        : v) as V;

export const c5: Concept = {
  ...content,
  lessons: content.lessons.map((l) => ({
    ...l,
    blurb: glue(l.blurb),
    ideas: glueAll(l.ideas),
    widget: l.widget && {...l.widget, blurb: glue(l.widget.blurb)},
    exercises: l.exercises.map((ex) => glueAll(place(ex))),
  })),
};

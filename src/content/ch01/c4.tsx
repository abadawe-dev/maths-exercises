import type {Concept} from '../../lib/types';
import {AreaPicture, ConditionLab, IdentityGrapher, RatioLab} from './c4.widgets';

const T = String.raw;

// Colour roles shared with the video: LHS cyan #5ee6ff, RHS pink #ff6b9d, key substitution amber #ffc857.

export const c4: Concept = {
  id: 'identities',
  number: 4,
  title: 'Identities & Proofs',
  tagline: 'Tell identities from equations, find unknown constants, and prove that two expressions are always equal.',
  accent: 'violet',
  lessons: [
    /* ------------------------------------------------------------ 1-9 */
    {
      id: '1-9',
      title: 'Identities',
      blurb: T`An equation asks "which $x$ works?". An identity says "every $x$ works", and that lets you compare coefficients.`,
      ideas: [
        {
          title: 'Equation or identity?',
          body: [
            T`An equality that holds true for **any value** substituted for $x$ is called an **identity** in $x$.`,
            T`$2x+1=7$ is only true for $x=3$: an equation. $(x+1)^2=x^2+2x+1$ is true for every $x$: an identity.`,
          ],
        },
        {
          title: 'Compare coefficients',
          body: [
            T`$$ax^2+bx+c=a'x^2+b'x+c'$$`,
            T`is an identity in $x$ exactly when $\textcolor{#ffc857}{a=a',\ b=b',\ c=c'}$.`,
            T`So: arrange both sides in **descending powers** of $x$, then compare one power at a time. A missing term has coefficient $0$.`,
          ],
        },
        {
          title: 'Fractions: clear the denominators',
          body: [
            T`For an identity with rational expressions, first multiply both sides by the common denominator.`,
            T`$$\frac{3x+1}{(x+2)(x-3)}=\frac{a}{x+2}+\frac{b}{x-3}$$`,
            T`becomes $3x+1=a(x-3)+b(x+2)$, and then you compare coefficients as usual.`,
          ],
        },
      ],
      widget: {
        title: 'Equation or identity? See it',
        blurb: T`Plot both sides of an equality and slide $x$: do the curves meet at a point or two, or everywhere? Then switch mode and tune $a$, $b$, $c$ until two curves become one.`,
        Component: IdentityGrapher,
      },
      exercises: [
        {
          id: 'eq-or-id',
          type: 'choice',
          level: 'warmup',
          source: 'Lesson 1-9 · Point',
          prompt: T`Which of these is an **identity** in $x$?`,
          options: [T`$2x+1=7$`, T`$x^2=2x+3$`, T`$(x+2)^2=x^2+4x+4$`, T`$(x+2)^2=x^2+4$`],
          correct: 2,
          feedback: [
            T`This is only true when $x=3$. Try $x=0$: $1\ne7$.`,
            T`This is true for $x=-1$ and $x=3$ only. Try $x=0$: $0\ne3$.`,
            T`Expanding the left side gives exactly the right side, so it holds for every $x$.`,
            T`The middle term $4x$ is missing, so it is only true when $x=0$. Try $x=1$: $9\ne5$.`,
          ],
          hints: [T`Test each one with an easy value such as $x=0$ or $x=1$. An identity can never fail a test.`],
          solution: [
            T`$(x+2)^2=x^2+4x+4$ for every $x$, so the third equality is an identity.`,
            T`The others are equations: they hold only for $x=3$; for $x=-1,3$; and for $x=0$.`,
          ],
        },
        {
          id: 'wu1-guided',
          type: 'proof',
          level: 'warmup',
          source: 'Lesson 1-9 · Warm Up 1',
          prompt: T`Find the constants $a$, $b$, $c$ such that $x^2+6=a(x+1)^2+b(x+1)+c$ is an identity in $x$, one decision at a time.`,
          steps: [
            {
              goal: T`Expand the RHS and arrange it in descending powers of $x$.`,
              options: [T`$ax^2+(2a+b)x+(a+b+c)$`, T`$ax^2+(a+b)x+(a+b+c)$`, T`$ax^2+(2a+b)x+c$`],
              correct: 0,
              why: T`$a(x^2+2x+1)+b(x+1)+c$: the $x$ terms are $2ax+bx$ and the constants are $a+b+c$.`,
            },
            {
              goal: T`Write the LHS so that every power of $x$ is visible.`,
              options: [T`$x^2+0x+6$`, T`$x^2+x+6$`, T`$x^2+6x+0$`],
              correct: 0,
              why: T`There is no $x$ term, so its coefficient is $0$.`,
            },
            {
              goal: 'Compare the coefficients of terms with the same degree.',
              options: [T`$a=1,\quad 2a+b=0,\quad a+b+c=6$`, T`$a=1,\quad 2a+b=6,\quad a+b+c=0$`, T`$a=1,\quad a+b=0,\quad c=6$`],
              correct: 0,
            },
            {
              goal: 'Solve the simultaneous equations.',
              options: [T`$a=1,\quad b=-2,\quad c=7$`, T`$a=1,\quad b=-2,\quad c=5$`, T`$a=1,\quad b=2,\quad c=3$`],
              correct: 0,
              why: T`Check with $x=0$: LHS $=6$ and RHS $=1-2+7=6$.`,
            },
          ],
          hints: [T`$(x+1)^2=x^2+2x+1$, so $a(x+1)^2$ contributes $ax^2+2ax+a$.`],
          solution: [
            T`$$a(x+1)^2+b(x+1)+c=ax^2+(2a+b)x+(a+b+c)$$`,
            T`Comparing with $x^2+0x+6$: $\;a=1,\ 2a+b=0,\ a+b+c=6$.`,
            T`So $a=1$, $b=-2$, $c=7$.`,
          ],
        },
        {
          id: 'try-1',
          type: 'input',
          level: 'practice',
          source: 'Lesson 1-9 · Try 1',
          prompt: T`Find the constants such that this is an identity in $x$: $$x^2-x-3=a(x-1)^2+b(x-1)+c$$`,
          fields: [
            {key: 'a', label: '$a =$', answer: '1', rule: 'number', placeholder: 'a number'},
            {key: 'b', label: '$b =$', answer: '1', rule: 'number', placeholder: 'a number'},
            {key: 'c', label: '$c =$', answer: '-3', rule: 'number', placeholder: 'a number'},
          ],
          hints: [
            T`Expand the RHS: $a(x^2-2x+1)+b(x-1)+c$.`,
            T`RHS $=ax^2+(-2a+b)x+(a-b+c)$. Compare with $x^2-x-3$.`,
          ],
          solution: [
            T`$$a(x-1)^2+b(x-1)+c=ax^2+(-2a+b)x+(a-b+c)$$`,
            T`Comparing coefficients: $a=1,\ -2a+b=-1,\ a-b+c=-3$.`,
            T`So $a=1$, $b=1$, $c=-3$. (Check with $x=1$: LHS $=-3=c$.)`,
          ],
        },
        {
          id: 'ex-1',
          type: 'input',
          level: 'practice',
          source: 'Lesson 1-9 · Exercise 1',
          prompt: T`Find the constants such that $a(x+1)-b(x+5)=8x$ is an identity in $x$.`,
          fields: [
            {key: 'a', label: '$a =$', answer: '10', rule: 'number', placeholder: 'a number'},
            {key: 'b', label: '$b =$', answer: '2', rule: 'number', placeholder: 'a number'},
          ],
          hints: [T`LHS $=(a-b)x+(a-5b)$.`, T`The RHS is $8x+0$, so $a-b=8$ and $a-5b=0$.`],
          solution: [
            T`LHS $=(a-b)x+(a-5b)$ and RHS $=8x+0$.`,
            T`So $a-b=8$ and $a-5b=0$. Subtracting: $4b=8$, so $b=2$ and $a=10$.`,
            T`Check: $10(x+1)-2(x+5)=10x+10-2x-10=8x$.`,
          ],
        },
        {
          id: 'ex-4',
          type: 'input',
          level: 'practice',
          source: 'Lesson 1-9 · Exercise 4',
          prompt: T`Find the constants such that $(ax+b)(x+1)=4x^2+cx+1$ is an identity in $x$.`,
          fields: [
            {key: 'a', label: '$a =$', answer: '4', rule: 'number', placeholder: 'a number'},
            {key: 'b', label: '$b =$', answer: '1', rule: 'number', placeholder: 'a number'},
            {key: 'c', label: '$c =$', answer: '5', rule: 'number', placeholder: 'a number'},
          ],
          hints: [T`LHS $=ax^2+(a+b)x+b$.`, T`The unknowns sit on both sides this time: $a=4$, $a+b=c$, $b=1$.`],
          solution: [T`LHS $=ax^2+(a+b)x+b$.`, T`Comparing with $4x^2+cx+1$: $a=4$, $b=1$, and $c=a+b=5$.`],
        },
        {
          id: 'ex-5',
          type: 'input',
          level: 'practice',
          source: 'Lesson 1-9 · Exercise 5',
          prompt: T`Find the constants such that $2x^2-7x+8=(x-3)(ax+b)+c$ is an identity in $x$.`,
          fields: [
            {key: 'a', label: '$a =$', answer: '2', rule: 'number', placeholder: 'a number'},
            {key: 'b', label: '$b =$', answer: '-1', rule: 'number', placeholder: 'a number'},
            {key: 'c', label: '$c =$', answer: '5', rule: 'number', placeholder: 'a number'},
          ],
          hints: [
            T`RHS $=ax^2+(b-3a)x+(-3b+c)$.`,
            T`$a=2$, then $b-3a=-7$, then $-3b+c=8$.`,
          ],
          solution: [
            T`$$(x-3)(ax+b)+c=ax^2+(b-3a)x+(-3b+c)$$`,
            T`$a=2$; $\ b-6=-7$ so $b=-1$; $\ 3+c=8$ so $c=5$.`,
            T`Check with $x=3$: LHS $=18-21+8=5=c$.`,
          ],
        },
        {
          id: 'try-2',
          type: 'input',
          level: 'practice',
          source: 'Lesson 1-9 · Try 2',
          prompt: T`Find the constants such that this is an identity in $x$. Type fractions like 2/3. $$\frac{1}{(2x-1)(x+1)}=\frac{a}{2x-1}+\frac{b}{x+1}$$`,
          fields: [
            {key: 'a', label: '$a =$', answer: '2/3', rule: 'number', placeholder: 'e.g. 2/3'},
            {key: 'b', label: '$b =$', answer: '-1/3', rule: 'number', placeholder: 'e.g. -1/3'},
          ],
          hints: [
            T`Multiply both sides by $(2x-1)(x+1)$ to clear the denominators.`,
            T`$1=a(x+1)+b(2x-1)=(a+2b)x+(a-b)$. The LHS is $0x+1$.`,
          ],
          solution: [
            T`Multiply both sides by $(2x-1)(x+1)$: $\;1=a(x+1)+b(2x-1)$.`,
            T`$$1=(a+2b)x+(a-b)$$`,
            T`So $a+2b=0$ and $a-b=1$. Subtracting: $3b=-1$, so $b=-\dfrac13$ and $a=\dfrac23$.`,
          ],
        },
        {
          id: 'ex-8',
          type: 'input',
          level: 'practice',
          source: 'Lesson 1-9 · Exercise 8',
          prompt: T`Find the constants such that this is an identity in $x$: $$\frac{3x-8}{3x^2+5x-2}=\frac{a}{x+2}+\frac{b}{3x-1}$$`,
          fields: [
            {key: 'a', label: '$a =$', answer: '2', rule: 'number', placeholder: 'a number'},
            {key: 'b', label: '$b =$', answer: '-3', rule: 'number', placeholder: 'a number'},
          ],
          hints: [
            T`Factorise first: $3x^2+5x-2=(x+2)(3x-1)$.`,
            T`Clearing denominators: $3x-8=a(3x-1)+b(x+2)=(3a+b)x+(-a+2b)$.`,
          ],
          solution: [
            T`$3x^2+5x-2=(x+2)(3x-1)$. Multiply both sides by it:`,
            T`$$3x-8=a(3x-1)+b(x+2)=(3a+b)x+(-a+2b)$$`,
            T`So $3a+b=3$ and $-a+2b=-8$. Solving gives $a=2$, $b=-3$.`,
          ],
        },
        {
          id: 'reflect-hole',
          type: 'choice',
          level: 'practice',
          source: 'Lesson 1-9 · Reflect',
          prompt: T`Is $\dfrac{x^2-16}{x-4}=x+4$ an identity in $x$?`,
          options: [
            T`Yes, for every real $x$ with no exceptions.`,
            T`It holds for every $x$ except $x=4$, where the LHS is undefined.`,
            T`No. It is an equation whose only solution is $x=4$.`,
            T`No. The two sides differ for most values of $x$.`,
          ],
          correct: 1,
          feedback: [
            T`Cancelling $x-4$ is only allowed when $x-4\ne0$. At $x=4$ the LHS is $\frac00$, which has no value.`,
            T`For $x\ne4$, $\frac{(x-4)(x+4)}{x-4}=x+4$. At $x=4$ the LHS does not exist, so the identity holds only on $x\ne4$.`,
            T`It is the other way round: $x=4$ is the one value where the LHS is not even defined.`,
            T`Try $x=5$: LHS $=\frac{9}{1}=9$ and RHS $=9$. They agree wherever the LHS exists.`,
          ],
          hints: [T`Factorise the numerator. What must be true about $x-4$ before you may cancel it?`],
          solution: [
            T`$x^2-16=(x-4)(x+4)$, so for $x\ne4$ the LHS simplifies to $x+4$.`,
            T`At $x=4$ the LHS is $\dfrac00$, undefined, while the RHS is $8$. So the two sides are identical only for $x\ne4$.`,
            'Try the last preset in the explorer above to see the hole in the graph.',
          ],
        },
        {
          id: 'challenge-pf',
          type: 'input',
          level: 'challenge',
          source: 'Lesson 1-9 · Challenge (Partial Fractions)',
          prompt: T`A clearance rate is modelled by $f(t)=\dfrac{22t+15}{8t^2+10t+3}$ for $t>0$. Separate it into two partial fractions $\dfrac{a}{2t+1}+\dfrac{b}{4t+3}$ and find $a$ and $b$.`,
          fields: [
            {key: 'a', label: '$a =$', answer: '4', rule: 'number', placeholder: 'a number'},
            {key: 'b', label: '$b =$', answer: '3', rule: 'number', placeholder: 'a number'},
          ],
          hints: [
            T`$8t^2+10t+3=(2t+1)(4t+3)$.`,
            T`Clear the denominators: $22t+15=a(4t+3)+b(2t+1)$.`,
            T`Compare coefficients: $4a+2b=22$ and $3a+b=15$.`,
          ],
          solution: [
            T`$8t^2+10t+3=(2t+1)(4t+3)$, so multiply both sides by it:`,
            T`$$22t+15=a(4t+3)+b(2t+1)=(4a+2b)t+(3a+b)$$`,
            T`$4a+2b=22$ and $3a+b=15$. Doubling the second and subtracting the first: $2a=8$, so $a=4$ and $b=3$.`,
            T`$$f(t)=\frac{4}{2t+1}+\frac{3}{4t+3}$$`,
          ],
        },
      ],
    },

    /* ----------------------------------------------------------- 1-10 */
    {
      id: '1-10',
      title: 'Proving Equalities (1)',
      blurb: T`To prove LHS = RHS, simplify the sides until they become the same expression.`,
      ideas: [
        {
          title: 'Aim for the same expression',
          body: [
            T`To prove the equality $\textcolor{#5ee6ff}{\text{LHS}}=\textcolor{#ff6b9d}{\text{RHS}}$, simplify the LHS and the RHS **respectively** so that they become the **same expression**.`,
          ],
        },
        {
          title: 'Two routes',
          body: [
            T`**One side:** start with the more complicated side and simplify it until it is the other side.`,
            T`**Both sides:** simplify each side separately, label the results (i) and (ii), and observe that they match.`,
          ],
        },
        {
          title: 'Never work across the = sign',
          body: [
            T`Moving a term across, multiplying both sides or cross-multiplying all assume the equality is already true. That is the very thing you are proving.`,
            T`Each side is worked on **on its own**.`,
          ],
        },
      ],
      widget: {
        title: 'A proof you can see',
        blurb: T`$(x+y)^2-(x-y)^2=4xy$ as a picture: take a square of side $x+y$, remove a square of side $x-y$ from its middle, and count what is left.`,
        Component: AreaPicture,
      },
      exercises: [
        {
          id: 'p-wu-1',
          type: 'proof',
          level: 'warmup',
          source: 'Lesson 1-10 · Warm Up 1',
          prompt: T`Prove that $(x+y)^2-(x-y)^2=4xy$.`,
          steps: [
            {
              goal: 'Start with the LHS and expand both squares.',
              options: [
                T`$\text{LHS}=(x^2+2xy+y^2)$ $-\,(x^2-2xy+y^2)$`,
                T`$\text{LHS}=(x^2+y^2)-(x^2-y^2)$`,
                T`$\text{LHS}=(x^2+2xy+y^2)$ $-\,(x^2+2xy+y^2)$`,
              ],
              correct: 0,
              why: T`$(x\pm y)^2=x^2\pm2xy+y^2$. Keep the second square in brackets for now.`,
            },
            {
              goal: 'Remove the brackets.',
              options: [T`$=x^2+2xy+y^2-x^2+2xy-y^2$`, T`$=x^2+2xy+y^2-x^2-2xy+y^2$`, T`$=x^2+2xy+y^2-x^2-2xy-y^2$`],
              correct: 0,
              why: 'The minus sign flips every sign in the second bracket.',
            },
            {
              goal: 'Collect like terms.',
              options: [T`$=4xy=\text{RHS}$`, T`$=2y^2$`, T`$=2x^2+4xy$`],
              correct: 0,
              why: T`$x^2$ and $y^2$ cancel. The LHS has become the RHS, so the equality is proven.`,
            },
          ],
          hints: [T`$(x-y)^2=x^2-2xy+y^2$, and subtracting it changes all three signs.`],
          solution: [
            T`$$\text{LHS}=(x^2+2xy+y^2)-(x^2-2xy+y^2)$$`,
            T`$$=x^2+2xy+y^2-x^2+2xy-y^2=4xy=\text{RHS}$$`,
            T`Therefore $(x+y)^2-(x-y)^2=4xy$.`,
          ],
        },
        {
          id: 'p-plan',
          type: 'choice',
          level: 'warmup',
          source: 'Lesson 1-10 · Point',
          prompt: T`You want to prove $(a+2b)^2-4ab=(a-2b)^2+4ab$. Which plan is a valid proof?`,
          options: [
            T`Add $4ab$ to both sides, then expand what is left.`,
            T`Substitute $a=1,\ b=1$ and check that both sides give $5$.`,
            T`Simplify the LHS and the RHS separately and show that both become $a^2+4b^2$.`,
            T`Take the square root of both sides.`,
          ],
          correct: 2,
          feedback: [
            'Adding to both sides treats the equality as already true. That is assuming what you want to prove.',
            'One numerical check shows it is true for those numbers only. A proof must cover every $a$ and $b$.',
            'Yes: each side is simplified on its own until both are the same expression.',
            'This also works across the equals sign, and a sum of terms has no simple square root anyway.',
          ],
          solution: [
            T`LHS $=a^2+4ab+4b^2-4ab=a^2+4b^2$.`,
            T`RHS $=a^2-4ab+4b^2+4ab=a^2+4b^2$.`,
            'Both sides become the same expression, so the equality holds.',
          ],
        },
        {
          id: 'p-try-1',
          type: 'proof',
          level: 'warmup',
          source: 'Lesson 1-10 · Try 1',
          prompt: T`Prove that $(x+y)^2+(x-y)^2=2x^2+2y^2$.`,
          steps: [
            {
              goal: 'Start with the LHS and expand both squares.',
              options: [
                T`$\text{LHS}=(x^2+2xy+y^2)$ $+\,(x^2-2xy+y^2)$`,
                T`$\text{LHS}=(x^2+y^2)+(x^2-y^2)$`,
                T`$\text{LHS}=(x^2+2xy+y^2)$ $+\,(x^2-2xy-y^2)$`,
              ],
              correct: 0,
            },
            {
              goal: 'Collect like terms.',
              options: [T`$=2x^2+2y^2=\text{RHS}$`, T`$=2x^2+4xy+2y^2$`, T`$=2x^2$`],
              correct: 0,
              why: T`This time the middle terms $+2xy$ and $-2xy$ cancel.`,
            },
          ],
          hints: [T`$(x-y)^2=x^2-2xy+y^2$: the last term is $+y^2$.`],
          solution: [T`$$\text{LHS}=(x^2+2xy+y^2)+(x^2-2xy+y^2)=2x^2+2y^2=\text{RHS}$$`],
        },
        {
          id: 'p-ex-6',
          type: 'input',
          level: 'practice',
          source: 'Lesson 1-10 · Exercise 6',
          prompt: T`To prove $(2a+b)^2-(a+2b)^2=3(a^2-b^2)$, simplify the LHS. Type it fully expanded, with no brackets.`,
          fields: [{key: 'lhs', label: 'LHS $=$', answer: '3a^2-3b^2', rule: 'noParens', placeholder: 'e.g. 5a^2 + 2ab'}],
          hints: [
            T`$(2a+b)^2=4a^2+4ab+b^2$ and $(a+2b)^2=a^2+4ab+4b^2$.`,
            T`Subtract: every sign of the second expansion flips, and the $4ab$ terms cancel.`,
          ],
          solution: [
            T`$$\text{LHS}=(4a^2+4ab+b^2)-(a^2+4ab+4b^2)=3a^2-3b^2$$`,
            T`$\text{RHS}=3(a^2-b^2)=3a^2-3b^2$. Both sides are the same expression, so the equality is proven.`,
          ],
        },
        {
          id: 'p-ex-2',
          type: 'proof',
          level: 'practice',
          source: 'Lesson 1-10 · Exercise 2',
          prompt: T`Prove that $(a+b)^3-3ab(a+b)=a^3+b^3$.`,
          steps: [
            {
              goal: T`Start with the LHS and expand $(a+b)^3$.`,
              options: [
                T`$\text{LHS}=(a^3+3a^2b+3ab^2+b^3)$ $-\,3ab(a+b)$`,
                T`$\text{LHS}=(a^3+b^3)-3ab(a+b)$`,
                T`$\text{LHS}=(a^3+a^2b+ab^2+b^3)$ $-\,3ab(a+b)$`,
              ],
              correct: 0,
              why: 'The coefficients 1, 3, 3, 1 come from the binomial theorem.',
            },
            {
              goal: T`Expand $-3ab(a+b)$.`,
              options: [
                T`$=a^3+3a^2b+3ab^2+b^3$ $-\,3a^2b-3ab^2$`,
                T`$=a^3+3a^2b+3ab^2+b^3$ $-\,3a^2b+3ab^2$`,
                T`$=a^3+3a^2b+3ab^2+b^3$ $-\,3ab-3ab^2$`,
              ],
              correct: 0,
            },
            {
              goal: 'Collect like terms.',
              options: [T`$=a^3+b^3=\text{RHS}$`, T`$=a^3+6ab^2+b^3$`, T`$=a^3+6a^2b+6ab^2+b^3$`],
              correct: 0,
            },
          ],
          hints: [T`$(a+b)^3=a^3+3a^2b+3ab^2+b^3$.`],
          solution: [
            T`$$\text{LHS}=a^3+3a^2b+3ab^2+b^3-3a^2b-3ab^2=a^3+b^3=\text{RHS}$$`,
          ],
        },
        {
          id: 'p-ex-4',
          type: 'proof',
          level: 'practice',
          source: 'Lesson 1-10 · Exercise 4',
          prompt: T`Prove that $(a+2b)^2-4ab=(a-2b)^2+4ab$.`,
          steps: [
            {
              goal: 'Simplify the LHS.',
              options: [
                T`$\text{LHS}=a^2+4ab+4b^2-4ab$ $=a^2+4b^2$`,
                T`$\text{LHS}=a^2+2ab+4b^2-4ab$ $=a^2-2ab+4b^2$`,
                T`$\text{LHS}=a^2+4ab+2b^2-4ab$ $=a^2+2b^2$`,
              ],
              correct: 0,
              why: T`$(a+2b)^2=a^2+2\cdot a\cdot 2b+(2b)^2$. Call the result (i).`,
            },
            {
              goal: 'The LHS cannot get any simpler, and it is not yet the RHS. What now?',
              options: [
                'Leave the LHS alone and simplify the RHS separately.',
                T`Add $4ab$ to both sides of the equality.`,
                T`Cancel the $4ab$ that appears on both sides.`,
              ],
              correct: 0,
              why: 'Working across the equals sign would assume the equality is already true.',
            },
            {
              goal: 'Simplify the RHS.',
              options: [
                T`$\text{RHS}=a^2-4ab+4b^2+4ab$ $=a^2+4b^2$`,
                T`$\text{RHS}=a^2-4b^2+4ab$`,
                T`$\text{RHS}=a^2-4ab-4b^2+4ab$ $=a^2-4b^2$`,
              ],
              correct: 0,
              why: 'Call this (ii).',
            },
            {
              goal: 'Conclude.',
              options: [
                T`From (i) and (ii), both sides equal $a^2+4b^2$, so LHS = RHS.`,
                T`The signs of $4ab$ differ, so the equality only holds when $ab=0$.`,
                T`Both sides contain $a^2$, so LHS = RHS.`,
              ],
              correct: 0,
            },
          ],
          hints: [T`$(a\pm2b)^2=a^2\pm4ab+4b^2$.`],
          solution: [
            T`$\text{LHS}=a^2+4ab+4b^2-4ab=a^2+4b^2$ …(i)`,
            T`$\text{RHS}=a^2-4ab+4b^2+4ab=a^2+4b^2$ …(ii)`,
            T`From (i) and (ii), $(a+2b)^2-4ab=(a-2b)^2+4ab$.`,
          ],
        },
        {
          id: 'p-try-2',
          type: 'proof',
          level: 'practice',
          source: 'Lesson 1-10 · Try 2',
          prompt: T`Prove that $(a^2-b^2)(c^2-d^2)=(ac-bd)^2-(ad-bc)^2$.`,
          steps: [
            {
              goal: 'Expand the LHS.',
              options: [
                T`$\text{LHS}=a^2c^2-a^2d^2-b^2c^2+b^2d^2$`,
                T`$\text{LHS}=a^2c^2-b^2d^2$`,
                T`$\text{LHS}=a^2c^2-a^2d^2-b^2c^2-b^2d^2$`,
              ],
              correct: 0,
              why: T`Four products; $(-b^2)(-d^2)=+b^2d^2$. Call this (i).`,
            },
            {
              goal: 'Now, on its own, expand both squares on the RHS.',
              options: [
                T`$\text{RHS}=(a^2c^2-2abcd+b^2d^2)$ $-\,(a^2d^2-2abcd+b^2c^2)$`,
                T`$\text{RHS}=(a^2c^2-b^2d^2)$ $-\,(a^2d^2-b^2c^2)$`,
                T`$\text{RHS}=(a^2c^2-2abcd+b^2d^2)$ $-\,(a^2d^2+2abcd+b^2c^2)$`,
              ],
              correct: 0,
            },
            {
              goal: 'Remove the brackets and collect like terms.',
              options: [
                T`$=a^2c^2+b^2d^2-a^2d^2-b^2c^2$`,
                T`$=a^2c^2+b^2d^2-a^2d^2-b^2c^2-4abcd$`,
                T`$=a^2c^2+b^2d^2-a^2d^2+b^2c^2$`,
              ],
              correct: 0,
              why: T`$-2abcd-(-2abcd)=0$: the middle terms cancel.`,
            },
            {
              goal: 'Conclude.',
              options: [
                'Rearranged, these are exactly the four terms of (i), so LHS = RHS.',
                'The terms come in a different order from (i), so the equality fails.',
                T`Divide both sides by $a^2c^2$ to finish.`,
              ],
              correct: 0,
            },
          ],
          hints: [T`$(ac-bd)^2=a^2c^2-2abcd+b^2d^2$ and $(ad-bc)^2=a^2d^2-2abcd+b^2c^2$.`],
          solution: [
            T`$\text{LHS}=a^2c^2-a^2d^2-b^2c^2+b^2d^2$ …(i)`,
            T`$$\text{RHS}=(a^2c^2-2abcd+b^2d^2)-(a^2d^2-2abcd+b^2c^2)$$`,
            T`$=a^2c^2-a^2d^2-b^2c^2+b^2d^2$ …(ii)`,
            'From (i) and (ii), the equality holds.',
          ],
        },
        {
          id: 'p-ex-5',
          type: 'proof',
          level: 'practice',
          source: 'Lesson 1-10 · Exercise 5',
          prompt: T`Prove that $(x^2+1)(y^2+1)=(xy+1)^2+(x-y)^2$.`,
          steps: [
            {
              goal: 'Expand the LHS.',
              options: [T`$\text{LHS}=x^2y^2+x^2+y^2+1$`, T`$\text{LHS}=x^2y^2+1$`, T`$\text{LHS}=x^2y^2+2xy+1$`],
              correct: 0,
              why: 'Call this (i).',
            },
            {
              goal: 'Expand both squares on the RHS.',
              options: [
                T`$\text{RHS}=(x^2y^2+2xy+1)$ $+\,(x^2-2xy+y^2)$`,
                T`$\text{RHS}=(x^2y^2+1)+(x^2-y^2)$`,
                T`$\text{RHS}=(x^2y^2+2xy+1)$ $+\,(x^2+2xy+y^2)$`,
              ],
              correct: 0,
            },
            {
              goal: 'Collect like terms and compare with (i).',
              options: [T`$=x^2y^2+x^2+y^2+1=\text{LHS}$`, T`$=x^2y^2+x^2+y^2+1+4xy$`, T`$=x^2y^2+x^2-y^2+1$`],
              correct: 0,
              why: T`$+2xy$ and $-2xy$ cancel, leaving the same four terms as (i).`,
            },
          ],
          hints: [T`$(xy+1)^2=x^2y^2+2xy+1$.`],
          solution: [
            T`$\text{LHS}=x^2y^2+x^2+y^2+1$ …(i)`,
            T`$\text{RHS}=(x^2y^2+2xy+1)+(x^2-2xy+y^2)=x^2y^2+x^2+y^2+1$ …(ii)`,
            'From (i) and (ii), the equality holds.',
          ],
        },
        {
          id: 'p-challenge',
          type: 'proof',
          level: 'challenge',
          source: 'Lesson 1-10 · Challenge',
          prompt: T`Prove that $(a^2-ab+b^2)(a^2+ab+b^2)=(a^2+b^2)^2-(ab)^2$.`,
          steps: [
            {
              goal: 'Spot the structure: regroup the LHS so that the two brackets differ only by one sign.',
              options: [
                T`$\text{LHS}=\{(a^2+b^2)-ab\}$ $\{(a^2+b^2)+ab\}$`,
                T`$\text{LHS}=\{(a^2+b^2)-ab\}^2$`,
                T`$\text{LHS}=\{(a^2-b^2)-ab\}$ $\{(a^2-b^2)+ab\}$`,
              ],
              correct: 0,
              why: 'Only the order of the terms has changed.',
            },
            {
              goal: T`Use $(P-Q)(P+Q)=P^2-Q^2$ with $P=a^2+b^2$ and $Q=ab$.`,
              options: [
                T`$=(a^2+b^2)^2-(ab)^2=\text{RHS}$`,
                T`$=(a^2+b^2)^2+(ab)^2$`,
                T`$=(a^2+b^2)^2-2ab(a^2+b^2)+(ab)^2$`,
              ],
              correct: 0,
              why: 'The LHS has become the RHS: the proof is complete.',
            },
            {
              goal: 'Bonus: what single expression are both sides equal to?',
              options: [T`$a^4+a^2b^2+b^4$`, T`$a^4-a^2b^2+b^4$`, T`$a^4+3a^2b^2+b^4$`],
              correct: 0,
              why: T`$(a^2+b^2)^2-(ab)^2=a^4+2a^2b^2+b^4-a^2b^2$.`,
            },
          ],
          hints: [
            T`Both brackets contain $a^2+b^2$. Treat it as a single block $P$.`,
            T`$(P-ab)(P+ab)$ is a difference of two squares.`,
          ],
          solution: [
            T`$$\text{LHS}=\{(a^2+b^2)-ab\}\{(a^2+b^2)+ab\}=(a^2+b^2)^2-(ab)^2=\text{RHS}$$`,
            T`Both sides equal $a^4+a^2b^2+b^4$. The same idea proves Exercise 1: $(x^2+x+1)(x^2-x+1)=(x^2+1)^2-x^2=x^4+x^2+1$.`,
          ],
        },
      ],
    },

    /* ----------------------------------------------------------- 1-11 */
    {
      id: '1-11',
      title: 'Proving Equalities (2): with a condition',
      blurb: T`Some equalities are only true under a condition. Use the condition to eliminate one variable.`,
      ideas: [
        {
          title: 'Eliminate a variable',
          body: [
            T`In proving conditional equalities, **express one variable from the conditional equation in terms of the others** and substitute it to eliminate that variable.`,
            T`If $x+y=1$, substitute $\textcolor{#ffc857}{y=1-x}$. If $a+b+c=0$, substitute $\textcolor{#ffc857}{c=-a-b}$.`,
          ],
        },
        {
          title: 'Substitute, then prove as before',
          body: [
            T`Replace the letter **everywhere**, on both sides. With one letter gone, it is an ordinary proof: simplify each side to the same expression.`,
            T`Careful with signs: $(-a-b)^2=(a+b)^2$ but $(-a-b)^3=-(a+b)^3$.`,
          ],
        },
        {
          title: 'The condition matters',
          body: [
            T`A conditional equality is **not** an identity: $a^2+b^2+c^2=-2(ab+bc+ca)$ fails for $a=b=c=1$.`,
            T`So your proof must actually use the condition, and the conclusion only holds when the condition does.`,
          ],
        },
      ],
      widget: {
        title: 'Condition on, condition off',
        blurb: T`Pick $a$ and $b$. While $c=-a-b$ the two sides always agree; release $c$ and watch them drift apart.`,
        Component: ConditionLab,
      },
      exercises: [
        {
          id: 'c-numbers-first',
          type: 'input',
          level: 'warmup',
          source: 'Lesson 1-11 · Warm Up',
          prompt: T`Try it with numbers first. Take $a=1$ and $b=2$, and choose $c$ so that $a+b+c=0$. Then evaluate both sides of $a^2+b^2+c^2=-2(ab+bc+ca)$.`,
          fields: [
            {key: 'c', label: '$c =$', answer: '-3', rule: 'number', placeholder: 'a number'},
            {key: 'l', label: '$a^2+b^2+c^2 =$', answer: '14', rule: 'number', placeholder: 'a number'},
            {key: 'r', label: '$-2(ab+bc+ca) =$', answer: '14', rule: 'number', placeholder: 'a number'},
          ],
          hints: [T`$c=-a-b=-3$.`, T`$ab+bc+ca=2-6-3=-7$.`],
          solution: [
            T`$c=-1-2=-3$.`,
            T`LHS $=1+4+9=14$.`,
            T`RHS $=-2\{(1)(2)+(2)(-3)+(-3)(1)\}=-2(-7)=14$.`,
            'One check is not a proof, but it shows what the proof has to deliver.',
          ],
        },
        {
          id: 'c-wu',
          type: 'proof',
          level: 'warmup',
          source: 'Lesson 1-11 · Warm Up',
          prompt: T`If $a+b+c=0$, prove that $a^2+b^2+c^2=-2(ab+bc+ca)$.`,
          steps: [
            {
              goal: 'Use the condition to express one variable in terms of the others.',
              options: [T`$c=-a-b$`, T`$c=a+b$`, T`$c=-a+b$`],
              correct: 0,
              why: T`Call this (i). Substituting it will eliminate $c$.`,
            },
            {
              goal: 'Substitute (i) into the LHS.',
              options: [T`$\text{LHS}=a^2+b^2+(-a-b)^2$`, T`$\text{LHS}=a^2+b^2-(a+b)^2$`, T`$\text{LHS}=a^2+b^2+(-a)^2-b^2$`],
              correct: 0,
              why: T`The whole of $-a-b$ is squared, so it needs brackets.`,
            },
            {
              goal: 'Expand and collect like terms.',
              options: [
                T`$=a^2+b^2+a^2+2ab+b^2$ $=2a^2+2ab+2b^2$`,
                T`$=a^2+b^2+a^2-2ab+b^2$ $=2a^2-2ab+2b^2$`,
                T`$=a^2+b^2+a^2+b^2$ $=2a^2+2b^2$`,
              ],
              correct: 0,
              why: T`$(-a-b)^2=(a+b)^2$. Call the result (ii).`,
            },
            {
              goal: 'Substitute (i) into the RHS.',
              options: [
                T`$\text{RHS}=-2\{ab+b(-a-b)+(-a-b)a\}$`,
                T`$\text{RHS}=-2\{ab+b(-a-b)\}$`,
                T`$\text{RHS}=-2\{ab+b(a-b)+(a-b)a\}$`,
              ],
              correct: 0,
              why: T`$c$ appears twice on the RHS, in $bc$ and in $ca$.`,
            },
            {
              goal: 'Multiply out inside the bracket and collect like terms.',
              options: [
                T`$=-2(ab-ab-b^2-a^2-ab)$ $=-2(-a^2-ab-b^2)$`,
                T`$=-2(ab-ab+b^2-a^2-ab)$ $=-2(-a^2-ab+b^2)$`,
                T`$=-2(ab-ab-b^2-a^2+ab)$ $=-2(-a^2+ab-b^2)$`,
              ],
              correct: 0,
            },
            {
              goal: T`Multiply by $-2$ and compare with (ii).`,
              options: [T`$=2a^2+2ab+2b^2=\text{LHS}$`, T`$=-2a^2-2ab-2b^2$`, T`$=2a^2-2ab+2b^2$`],
              correct: 0,
              why: T`With $c$ eliminated, both sides are the same expression.`,
            },
          ],
          hints: [T`From $a+b+c=0$: $c=-a-b$.`, T`$(-a-b)^2=a^2+2ab+b^2$.`],
          solution: [
            T`From $a+b+c=0$, $\;c=-a-b$ …(i)`,
            T`$\text{LHS}=a^2+b^2+(-a-b)^2=2a^2+2ab+2b^2$ …(ii)`,
            T`$\text{RHS}=-2\{ab+b(-a-b)+(-a-b)a\}$ $=-2(-a^2-ab-b^2)$ $=2a^2+2ab+2b^2$ …(iii)`,
            T`From (ii) and (iii), $a^2+b^2+c^2=-2(ab+bc+ca)$.`,
          ],
        },
        {
          id: 'c-ex-3',
          type: 'proof',
          level: 'practice',
          source: 'Lesson 1-11 · Exercise 3',
          prompt: T`If $x+y=1$, prove that $x^2-x=y^2-y$.`,
          steps: [
            {
              goal: 'Use the condition to express one variable in terms of the other.',
              options: [T`$y=1-x$`, T`$y=x-1$`, T`$y=1+x$`],
              correct: 0,
            },
            {
              goal: T`The LHS has no $y$, so work on the RHS: substitute.`,
              options: [T`$\text{RHS}=(1-x)^2-(1-x)$`, T`$\text{RHS}=(1-x)^2-1-x$`, T`$\text{RHS}=1-x^2-(1-x)$`],
              correct: 0,
            },
            {
              goal: 'Expand.',
              options: [T`$=1-2x+x^2-1+x$`, T`$=1-2x+x^2-1-x$`, T`$=1+x^2-1+x$`],
              correct: 0,
              why: T`$-(1-x)=-1+x$.`,
            },
            {
              goal: 'Collect like terms.',
              options: [T`$=x^2-x=\text{LHS}$`, T`$=x^2-3x$`, T`$=x^2+x$`],
              correct: 0,
            },
          ],
          hints: [T`$y=1-x$, so $y^2=(1-x)^2=1-2x+x^2$.`],
          solution: [
            T`From $x+y=1$, $\;y=1-x$.`,
            T`$$\text{RHS}=(1-x)^2-(1-x)=1-2x+x^2-1+x=x^2-x=\text{LHS}$$`,
          ],
        },
        {
          id: 'c-try-1',
          type: 'proof',
          level: 'practice',
          source: 'Lesson 1-11 · Try 1',
          prompt: T`If $x+y=1$, prove that $x^2+y^2+1=2(x+y-xy)$. Use $y=1-x$.`,
          steps: [
            {
              goal: T`Substitute $y=1-x$ into the LHS and simplify.`,
              options: [
                T`$\text{LHS}=x^2+(1-x)^2+1$ $=2x^2-2x+2$`,
                T`$\text{LHS}=x^2+(1-x)^2+1$ $=2x^2+2x+2$`,
                T`$\text{LHS}=x^2+1-x^2+1$ $=2$`,
              ],
              correct: 0,
              why: T`$(1-x)^2=1-2x+x^2$. Call the result (i).`,
            },
            {
              goal: T`Substitute into the RHS. (The condition says $x+y$ is simply $1$.)`,
              options: [T`$\text{RHS}=2\{1-x(1-x)\}$`, T`$\text{RHS}=2\{1-x(x-1)\}$`, T`$\text{RHS}=2\{1-x-(1-x)\}$`],
              correct: 0,
            },
            {
              goal: 'Simplify and compare with (i).',
              options: [
                T`$=2(1-x+x^2)$ $=2x^2-2x+2=\text{LHS}$`,
                T`$=2(1-x-x^2)$ $=-2x^2-2x+2$`,
                T`$=2-x+x^2$`,
              ],
              correct: 0,
            },
          ],
          hints: [T`LHS: $x^2+(1-2x+x^2)+1$.`, T`RHS: $xy=x(1-x)=x-x^2$.`],
          solution: [
            T`From $x+y=1$, $\;y=1-x$.`,
            T`$\text{LHS}=x^2+(1-x)^2+1=2x^2-2x+2$ …(i)`,
            T`$\text{RHS}=2\{1-x(1-x)\}=2(1-x+x^2)=2x^2-2x+2$ …(ii)`,
            'From (i) and (ii), the equality holds.',
          ],
        },
        {
          id: 'c-ex-2',
          type: 'proof',
          level: 'practice',
          source: 'Lesson 1-11 · Exercise 2',
          prompt: T`If $x-y=1$, prove that $x^2+y^2=2xy+1$.`,
          steps: [
            {
              goal: 'Use the condition to express one variable in terms of the other.',
              options: [T`$x=y+1$`, T`$x=1-y$`, T`$x=y-1$`],
              correct: 0,
            },
            {
              goal: 'Substitute into the LHS and simplify.',
              options: [
                T`$\text{LHS}=(y+1)^2+y^2$ $=2y^2+2y+1$`,
                T`$\text{LHS}=(y+1)^2+y^2$ $=2y^2+1$`,
                T`$\text{LHS}=(y+1)^2+y^2$ $=2y^2+y+1$`,
              ],
              correct: 0,
            },
            {
              goal: 'Substitute into the RHS and simplify.',
              options: [
                T`$\text{RHS}=2(y+1)y+1$ $=2y^2+2y+1$`,
                T`$\text{RHS}=2(y+1)y+1$ $=2y^2+3$`,
                T`$\text{RHS}=2y+1\cdot y+1$ $=3y+1$`,
              ],
              correct: 0,
            },
            {
              goal: 'Conclude. Exactly what has been proven?',
              options: [
                T`Both sides equal $2y^2+2y+1$, so LHS = RHS whenever $x-y=1$.`,
                T`LHS = RHS for all values of $x$ and $y$.`,
                T`The condition $x-y=1$ has been proven.`,
              ],
              correct: 0,
              why: T`The condition was used, so the result depends on it. For example $x=y=0$ gives $0\ne1$.`,
            },
          ],
          hints: [T`$x=y+1$, so $x^2=y^2+2y+1$ and $2xy=2y^2+2y$.`],
          solution: [
            T`From $x-y=1$, $\;x=y+1$.`,
            T`$\text{LHS}=(y+1)^2+y^2=2y^2+2y+1$ …(i)`,
            T`$\text{RHS}=2(y+1)y+1=2y^2+2y+1$ …(ii)`,
            'From (i) and (ii), the equality holds.',
          ],
        },
        {
          id: 'c-ex-4',
          type: 'proof',
          level: 'practice',
          source: 'Lesson 1-11 · Exercise 4',
          prompt: T`If $a+b+c=0$, prove that $a^2+ca=b^2+bc$.`,
          steps: [
            {
              goal: T`Use the condition to eliminate $c$.`,
              options: [T`$c=-a-b$`, T`$c=a+b$`, T`$c=0$`],
              correct: 0,
            },
            {
              goal: 'Substitute into the LHS and simplify.',
              options: [
                T`$\text{LHS}=a^2+(-a-b)a$ $=-ab$`,
                T`$\text{LHS}=a^2+(a+b)a$ $=2a^2+ab$`,
                T`$\text{LHS}=a^2+(-a-b)a$ $=ab$`,
              ],
              correct: 0,
              why: T`$a^2-a^2-ab=-ab$. Call it (i).`,
            },
            {
              goal: 'Substitute into the RHS and simplify.',
              options: [
                T`$\text{RHS}=b^2+b(-a-b)$ $=-ab$`,
                T`$\text{RHS}=b^2+b(-a-b)$ $=-ab-2b^2$`,
                T`$\text{RHS}=b^2+b(a+b)$ $=2b^2+ab$`,
              ],
              correct: 0,
              why: T`$b^2-ab-b^2=-ab$. Call it (ii).`,
            },
            {
              goal: 'Conclude.',
              options: [
                T`From (i) and (ii), both sides equal $-ab$, so LHS = RHS.`,
                T`Both sides equal $-ab$, so $a=b$.`,
                T`Both sides equal $-ab$, so $ab=0$.`,
              ],
              correct: 0,
            },
          ],
          hints: [T`$ca=(-a-b)a=-a^2-ab$ and $bc=b(-a-b)=-ab-b^2$.`],
          solution: [
            T`From $a+b+c=0$, $\;c=-a-b$.`,
            T`$\text{LHS}=a^2+(-a-b)a=-ab$ …(i)`,
            T`$\text{RHS}=b^2+b(-a-b)=-ab$ …(ii)`,
            'From (i) and (ii), the equality holds.',
          ],
        },
        {
          id: 'c-reflect',
          type: 'choice',
          level: 'practice',
          source: 'Lesson 1-11 · Reflect',
          prompt: 'Why is it invalid to cross-multiply, or to add terms to both sides, while you are proving an equality?',
          options: [
            'Those moves start from “LHS = RHS”, which is exactly what has not been proven yet.',
            'They make the algebra longer than necessary.',
            'Cross-multiplying changes the value of a fraction.',
            T`They are fine, as long as you finish with a true statement such as $0=0$.`,
          ],
          correct: 0,
          feedback: [
            'Right. Working strictly on one side at a time only ever rewrites an expression as something equal to it, so every line is safe.',
            'Length is not the issue: the logic is. The proof would be using its own conclusion.',
            'On a true equation, cross-multiplying is perfectly legal. The trouble is that the equation is not yet known to be true.',
            T`Reaching a true statement proves nothing: from the false claim $1=-1$, squaring both sides gives the true statement $1=1$.`,
          ],
          solution: [
            'Operations on both sides are only valid for an equality that is already known to be true. In a proof that is the claim itself, so using it would be circular.',
            'Rewriting one side on its own produces a chain LHS = … = …, in which every link is certain. When the chain reaches the RHS (or both chains reach the same expression), the equality is established.',
          ],
        },
        {
          id: 'c-try-2',
          type: 'proof',
          level: 'challenge',
          source: 'Lesson 1-11 · Try 2',
          prompt: T`If $a+b+c=0$, prove that $a^3+b^3+c^3=3abc$. Use $c=-a-b$.`,
          steps: [
            {
              goal: 'Substitute into the LHS.',
              options: [
                T`$\text{LHS}=a^3+b^3+(-a-b)^3$ $=a^3+b^3-(a+b)^3$`,
                T`$\text{LHS}=a^3+b^3+(-a-b)^3$ $=a^3+b^3+(a+b)^3$`,
                T`$\text{LHS}=a^3+b^3+(-a)^3-b^3$ $=0$`,
              ],
              correct: 0,
              why: 'An odd power keeps the minus sign.',
            },
            {
              goal: T`Expand $(a+b)^3$.`,
              options: [
                T`$=a^3+b^3$ $-\,(a^3+3a^2b+3ab^2+b^3)$`,
                T`$=a^3+b^3-(a^3+b^3)$`,
                T`$=a^3+b^3$ $-\,(a^3+a^2b+ab^2+b^3)$`,
              ],
              correct: 0,
            },
            {
              goal: 'Collect like terms.',
              options: [T`$=-3a^2b-3ab^2$`, T`$=3a^2b+3ab^2$`, T`$=2a^3+2b^3+3a^2b+3ab^2$`],
              correct: 0,
              why: 'Call this (i).',
            },
            {
              goal: 'Substitute into the RHS and expand.',
              options: [
                T`$\text{RHS}=3ab(-a-b)$ $=-3a^2b-3ab^2$`,
                T`$\text{RHS}=3ab(a+b)$ $=3a^2b+3ab^2$`,
                T`$\text{RHS}=3ab(-a-b)$ $=-3a^2b+3ab^2$`,
              ],
              correct: 0,
              why: 'Call this (ii).',
            },
            {
              goal: 'Conclude.',
              options: [
                T`From (i) and (ii), $a^3+b^3+c^3=3abc$ whenever $a+b+c=0$.`,
                T`So $a^3+b^3+c^3=3abc$ for all $a$, $b$, $c$.`,
                'The two sides differ by a sign, so the equality is false.',
              ],
              correct: 0,
            },
          ],
          hints: [T`$(-a-b)^3=-(a+b)^3$.`, T`$(a+b)^3=a^3+3a^2b+3ab^2+b^3$.`],
          solution: [
            T`From $a+b+c=0$, $\;c=-a-b$.`,
            T`$\text{LHS}=a^3+b^3-(a+b)^3=-3a^2b-3ab^2$ …(i)`,
            T`$\text{RHS}=3ab(-a-b)=-3a^2b-3ab^2$ …(ii)`,
            'From (i) and (ii), the equality holds.',
          ],
        },
        {
          id: 'c-challenge-sum',
          type: 'proof',
          level: 'challenge',
          source: 'Lesson 1-11 · Challenge (A Constant Sum)',
          prompt: T`Three non-zero numbers $a$, $b$, $c$ satisfy $a+b+c=0$. Prove that, whichever such numbers you choose, $$\frac{a}{b+c}+\frac{b}{c+a}+\frac{c}{a+b}=-3$$`,
          steps: [
            {
              goal: 'Use the condition to rewrite the first denominator.',
              options: [T`$b+c=-a$`, T`$b+c=a$`, T`$b+c=0$`],
              correct: 0,
              why: 'This time it is quicker to replace a whole denominator than a single letter.',
            },
            {
              goal: 'Do the same for the other two denominators.',
              options: [T`$c+a=-b,\quad a+b=-c$`, T`$c+a=-c,\quad a+b=-b$`, T`$c+a=b,\quad a+b=c$`],
              correct: 0,
            },
            {
              goal: 'Substitute into the LHS.',
              options: [
                T`$\text{LHS}=\dfrac{a}{-a}+\dfrac{b}{-b}+\dfrac{c}{-c}$`,
                T`$\text{LHS}=\dfrac{a}{a}+\dfrac{b}{b}+\dfrac{c}{c}$`,
                T`$\text{LHS}=\dfrac{a}{-a}+\dfrac{b}{-c}+\dfrac{c}{-b}$`,
              ],
              correct: 0,
              why: 'The numbers are non-zero, so none of these denominators is 0.',
            },
            {
              goal: 'Simplify.',
              options: [
                T`$=(-1)+(-1)+(-1)=-3=\text{RHS}$`,
                T`$=1+1+1=3$`,
                T`$=\dfrac{a+b+c}{-(a+b+c)}=-1$`,
              ],
              correct: 0,
              why: 'Each fraction is exactly −1, whatever the three numbers are.',
            },
          ],
          hints: [T`From $a+b+c=0$: $b+c=-a$.`, T`Each fraction becomes a number divided by its own negative.`],
          solution: [
            T`From $a+b+c=0$: $\;b+c=-a,\ c+a=-b,\ a+b=-c$.`,
            T`$$\text{LHS}=\frac{a}{-a}+\frac{b}{-b}+\frac{c}{-c}=-1-1-1=-3=\text{RHS}$$`,
            T`(The same substitutions prove Exercise 5: $(a+b)(b+c)(c+a)+abc$ $=(-c)(-a)(-b)+abc=0$.)`,
          ],
        },
      ],
    },

    /* ----------------------------------------------------------- 1-12 */
    {
      id: '1-12',
      title: 'Proving Equalities (3): proportions',
      blurb: T`When ratios are equal, give the shared ratio a name, $k$, and everything can be written with fewer letters.`,
      ideas: [
        {
          title: 'Proportion',
          body: [
            T`An equation saying that ratios are equal, like`,
            T`$$\frac{a}{b}=\frac{c}{d}\qquad\text{or}\qquad x:y:z=a:b:c$$`,
            T`is called a **proportion**. For example $\frac63=\frac{10}{5}$: both ratios are $2$.`,
          ],
        },
        {
          title: 'Name the ratio k',
          body: [
            T`For a condition $\frac ab=\frac cd$, first let`,
            T`$$\frac{a}{b}=\frac{c}{d}=\textcolor{#ffc857}{k}\quad\Longrightarrow\quad \textcolor{#ffc857}{a=bk,\ \ c=dk}$$`,
            T`Substitute into each side. The common factors cancel and both sides collapse to the same expression in $k$.`,
          ],
        },
        {
          title: 'Three-part ratios',
          body: [
            T`For a condition $x:y:z=a:b:c$, let $k$ be a constant and write`,
            T`$$\textcolor{#ffc857}{x=ak,\quad y=bk,\quad z=ck}$$`,
            T`When you then "find the value" of a fraction, the powers of $k$ cancel and a plain number is left.`,
          ],
        },
      ],
      widget: {
        title: 'Ratio lab',
        blurb: T`Set a ratio $x:y:z$, then slide $k$. The three bars stretch together, yet the value of $\frac{2xy+yz+3zx}{x^2+y^2+z^2}$ never moves.`,
        Component: RatioLab,
      },
      exercises: [
        {
          id: 'r-set-k',
          type: 'choice',
          level: 'warmup',
          source: 'Lesson 1-12 · Point',
          prompt: T`If $x:y:z=2:3:5$, how should you write $x$, $y$ and $z$?`,
          options: [
            T`$x=2,\ y=3,\ z=5$`,
            T`$x=2k,\ y=3k,\ z=5k$ for a constant $k$`,
            T`$x=2+k,\ y=3+k,\ z=5+k$ for a constant $k$`,
            T`$x=\dfrac k2,\ y=\dfrac k3,\ z=\dfrac k5$ for a constant $k$`,
          ],
          correct: 1,
          feedback: [
            T`That is only one possibility. $x=20,\ y=30,\ z=50$ has the same ratio.`,
            T`Yes. Every triple in the ratio $2:3:5$ is a common multiple of $2$, $3$ and $5$.`,
            T`Adding the same number changes the ratio: $k=1$ gives $3:4:6$.`,
            T`These are in the ratio $\frac12:\frac13:\frac15=15:10:6$, not $2:3:5$.`,
          ],
          solution: [T`A ratio fixes the numbers only up to a common multiplier, so $x=2k,\ y=3k,\ z=5k$ for a constant $k$.`],
        },
        {
          id: 'r-wu-2',
          type: 'input',
          level: 'warmup',
          source: 'Lesson 1-12 · Warm Up 2',
          prompt: T`If $x:y:z=2:3:5$, find the value of $\dfrac{2xy+yz+3zx}{x^2+y^2+z^2}$.`,
          fields: [{key: 'v', label: 'Value', answer: '3/2', rule: 'number', placeholder: 'a fraction, e.g. 5/4'}],
          hints: [
            T`Let $x=2k,\ y=3k,\ z=5k$.`,
            T`Numerator: $12k^2+15k^2+30k^2$. Denominator: $4k^2+9k^2+25k^2$.`,
          ],
          solution: [
            T`Let $k$ be a constant with $x=2k,\ y=3k,\ z=5k$.`,
            T`$$\frac{2(2k)(3k)+(3k)(5k)+3(5k)(2k)}{(2k)^2+(3k)^2+(5k)^2}=\frac{57k^2}{38k^2}=\frac{3}{2}$$`,
          ],
        },
        {
          id: 'r-wu-1',
          type: 'proof',
          level: 'warmup',
          source: 'Lesson 1-12 · Warm Up 1',
          prompt: T`If $\dfrac ab=\dfrac cd$, prove that $\dfrac{ab}{a^2+b^2}=\dfrac{cd}{c^2+d^2}$.`,
          steps: [
            {
              goal: 'Give the common ratio a name and rewrite the condition.',
              options: [
                T`Let $\dfrac ab=\dfrac cd=k$. Then $a=bk,\ c=dk$.`,
                T`Let $\dfrac ab=\dfrac cd=k$. Then $a=\dfrac bk,\ c=\dfrac dk$.`,
                T`Let $\dfrac ab=\dfrac cd=k$. Then $a=bk,\ d=ck$.`,
              ],
              correct: 0,
              why: 'Call this (i). It lets you eliminate a and c.',
            },
            {
              goal: T`Substitute (i) into the LHS to eliminate $a$.`,
              options: [
                T`$\text{LHS}=\dfrac{bk\times b}{(bk)^2+b^2}$ $=\dfrac{b^2k}{b^2k^2+b^2}$`,
                T`$\text{LHS}=\dfrac{bk\times b}{(bk)^2+b^2}$ $=\dfrac{b^2k}{b^2k+b^2}$`,
                T`$\text{LHS}=\dfrac{bk\times b}{bk+b^2}$ $=\dfrac{b^2k}{bk+b^2}$`,
              ],
              correct: 0,
              why: T`$(bk)^2=b^2k^2$: the square applies to both letters.`,
            },
            {
              goal: 'Factorise the denominator and simplify.',
              options: [
                T`$=\dfrac{b^2k}{b^2(k^2+1)}$ $=\dfrac{k}{k^2+1}$`,
                T`$=\dfrac{k}{k^2+b^2}$`,
                T`$=\dfrac{b^2k}{b^2(k^2+1)}$ $=\dfrac{1}{k+1}$`,
              ],
              correct: 0,
              why: T`$b^2$ is a common factor of the whole denominator, so it cancels. Call the result (ii).`,
            },
            {
              goal: T`Substitute (i) into the RHS to eliminate $c$, and simplify in the same way.`,
              options: [
                T`$\text{RHS}=\dfrac{dk\times d}{(dk)^2+d^2}$ $=\dfrac{k}{k^2+1}$`,
                T`$\text{RHS}=\dfrac{dk\times d}{(dk)^2+d^2}$ $=\dfrac{d}{k^2+1}$`,
                T`$\text{RHS}=\dfrac{bk\times d}{(bk)^2+d^2}$`,
              ],
              correct: 0,
              why: T`This time $d^2$ cancels. Call the result (iii).`,
            },
            {
              goal: 'Conclude.',
              options: [
                T`From (ii) and (iii), both sides equal $\dfrac{k}{k^2+1}$, so LHS = RHS.`,
                T`The LHS used $b$ and the RHS used $d$, so they are equal only if $b=d$.`,
                'Now cross-multiply the original equality to finish.',
              ],
              correct: 0,
            },
          ],
          hints: [T`$\dfrac ab=k$ means $a=bk$.`, T`$b^2k^2+b^2=b^2(k^2+1)$.`],
          solution: [
            T`Let $\dfrac ab=\dfrac cd=k$. Then $a=bk,\ c=dk$ …(i)`,
            T`$$\text{LHS}=\frac{bk\times b}{(bk)^2+b^2}=\frac{b^2k}{b^2(k^2+1)}=\frac{k}{k^2+1}\ \ \text{…(ii)}$$`,
            T`$$\text{RHS}=\frac{dk\times d}{(dk)^2+d^2}=\frac{d^2k}{d^2(k^2+1)}=\frac{k}{k^2+1}\ \ \text{…(iii)}$$`,
            'From (ii) and (iii), the equality holds.',
          ],
        },
        {
          id: 'r-ex-2',
          type: 'input',
          level: 'practice',
          source: 'Lesson 1-12 · Exercise 2',
          prompt: T`Let $\dfrac ab=\dfrac cd=k$. To prove $\dfrac{3a+c}{3b+d}=\dfrac{2a-c}{2b-d}$, simplify the LHS. What does it become, in terms of $k$?`,
          fields: [{key: 'lhs', label: 'LHS $=$', answer: 'k', rule: 'simplified', placeholder: 'an expression in k'}],
          hints: [T`Substitute $a=bk$ and $c=dk$: the numerator is $3bk+dk$.`, T`$3bk+dk=k(3b+d)$.`],
          solution: [
            T`With $a=bk,\ c=dk$:`,
            T`$$\text{LHS}=\frac{3bk+dk}{3b+d}=\frac{k(3b+d)}{3b+d}=k$$`,
            T`$$\text{RHS}=\frac{2bk-dk}{2b-d}=\frac{k(2b-d)}{2b-d}=k$$`,
            T`Both sides equal $k$, so the equality holds.`,
          ],
        },
        {
          id: 'r-try-3',
          type: 'input',
          level: 'practice',
          source: 'Lesson 1-12 · Try 3',
          prompt: T`If $a:b:c=2:3:4$, find the value of $\dfrac{ab+bc+ca}{a^2+b^2+c^2}$.`,
          fields: [{key: 'v', label: 'Value', answer: '26/29', rule: 'number', placeholder: 'a fraction, e.g. 5/4'}],
          hints: [T`Let $a=2k,\ b=3k,\ c=4k$.`, T`Numerator: $6k^2+12k^2+8k^2$. Denominator: $4k^2+9k^2+16k^2$.`],
          solution: [
            T`Let $a=2k,\ b=3k,\ c=4k$.`,
            T`$$\frac{6k^2+12k^2+8k^2}{4k^2+9k^2+16k^2}=\frac{26k^2}{29k^2}=\frac{26}{29}$$`,
          ],
        },
        {
          id: 'r-try-1',
          type: 'proof',
          level: 'practice',
          source: 'Lesson 1-12 · Try 1',
          prompt: T`If $\dfrac ab=\dfrac cd$, prove that $\dfrac{ab+cd}{ab-cd}=\dfrac{a^2+c^2}{a^2-c^2}$. Let $\dfrac ab=\dfrac cd=k$, so that $a=bk$ and $c=dk$.`,
          steps: [
            {
              goal: 'Substitute into the LHS and simplify.',
              options: [
                T`$\text{LHS}=\dfrac{b^2k+d^2k}{b^2k-d^2k}$ $=\dfrac{b^2+d^2}{b^2-d^2}$`,
                T`$\text{LHS}=\dfrac{b^2k+d^2k}{b^2k-d^2k}$ $=\dfrac{b^2+d^2k}{b^2-d^2k}$`,
                T`$\text{LHS}=\dfrac{bk+dk}{bk-dk}$ $=\dfrac{b+d}{b-d}$`,
              ],
              correct: 0,
              why: T`$ab=bk\cdot b=b^2k$ and $cd=d^2k$; then $k$ is a common factor of top and bottom. Call the result (i).`,
            },
            {
              goal: 'Substitute into the RHS and simplify.',
              options: [
                T`$\text{RHS}=\dfrac{b^2k^2+d^2k^2}{b^2k^2-d^2k^2}$ $=\dfrac{b^2+d^2}{b^2-d^2}$`,
                T`$\text{RHS}=\dfrac{b^2k^2+d^2k^2}{b^2k^2-d^2k^2}$ $=\dfrac{b^2+d^2}{b^2-d^2}\,k^2$`,
                T`$\text{RHS}=\dfrac{bk^2+dk^2}{bk^2-dk^2}$ $=\dfrac{b+d}{b-d}$`,
              ],
              correct: 0,
              why: T`Here $k^2$ is the common factor. Call the result (ii).`,
            },
            {
              goal: 'Conclude.',
              options: [
                T`From (i) and (ii), both sides equal $\dfrac{b^2+d^2}{b^2-d^2}$, so LHS = RHS.`,
                T`One side cancelled $k$ and the other $k^2$, so the sides differ by a factor of $k$.`,
                T`The equality only holds when $k=1$.`,
              ],
              correct: 0,
            },
          ],
          hints: [T`$a^2=(bk)^2=b^2k^2$ and $c^2=d^2k^2$.`],
          solution: [
            T`Let $\dfrac ab=\dfrac cd=k$, so $a=bk,\ c=dk$.`,
            T`$$\text{LHS}=\frac{b^2k+d^2k}{b^2k-d^2k}=\frac{b^2+d^2}{b^2-d^2}\ \ \text{…(i)}$$`,
            T`$$\text{RHS}=\frac{b^2k^2+d^2k^2}{b^2k^2-d^2k^2}=\frac{b^2+d^2}{b^2-d^2}\ \ \text{…(ii)}$$`,
            'From (i) and (ii), the equality holds.',
          ],
        },
        {
          id: 'r-ex-8',
          type: 'input',
          level: 'practice',
          source: 'Lesson 1-12 · Exercise 8',
          prompt: T`If $x:y:z=2:-3:4$, find the value of $\dfrac{x^2+y^2+z^2}{xy+yz+zx}$.`,
          fields: [{key: 'v', label: 'Value', answer: '-29/10', rule: 'number', placeholder: 'a fraction, e.g. -5/4'}],
          hints: [
            T`Let $x=2k,\ y=-3k,\ z=4k$. Squares are positive, products with $y$ are negative.`,
            T`Numerator: $4k^2+9k^2+16k^2$. Denominator: $-6k^2-12k^2+8k^2$.`,
          ],
          solution: [
            T`Let $x=2k,\ y=-3k,\ z=4k$.`,
            T`$$\frac{4k^2+9k^2+16k^2}{-6k^2-12k^2+8k^2}=\frac{29k^2}{-10k^2}=-\frac{29}{10}$$`,
          ],
        },
        {
          id: 'r-ex-9',
          type: 'input',
          level: 'practice',
          source: 'Lesson 1-12 · Exercise 9',
          prompt: T`If $\dfrac x7=\dfrac y3\ne0$, find the value of $\dfrac{x^2+5y^2}{x^2+xy+y^2}$.`,
          fields: [{key: 'v', label: 'Value', answer: '94/79', rule: 'number', placeholder: 'a fraction, e.g. 5/4'}],
          hints: [T`Let $\dfrac x7=\dfrac y3=k$, so $x=7k$ and $y=3k$.`, T`Numerator: $49k^2+45k^2$. Denominator: $49k^2+21k^2+9k^2$.`],
          solution: [
            T`Let $\dfrac x7=\dfrac y3=k$ with $k\ne0$, so $x=7k,\ y=3k$.`,
            T`$$\frac{49k^2+5\times9k^2}{49k^2+21k^2+9k^2}=\frac{94k^2}{79k^2}=\frac{94}{79}$$`,
          ],
        },
        {
          id: 'r-try-2',
          type: 'proof',
          level: 'challenge',
          source: 'Lesson 1-12 · Try 2',
          prompt: T`If $\dfrac xa=\dfrac yb=\dfrac zc$, prove that $\dfrac{x^2+y^2+z^2}{a^2+b^2+c^2}=\dfrac{xy+yz+zx}{ab+bc+ca}$.`,
          steps: [
            {
              goal: 'Name the common ratio and rewrite the condition.',
              options: [
                T`Let the ratio be $k$: $\ x=ak,\ y=bk,\ z=ck$`,
                T`Let the ratio be $k$: $\ x=a+k,\ y=b+k,\ z=c+k$`,
                T`Let the ratio be $k$: $\ x=ak,\ y=bk^2,\ z=ck^3$`,
              ],
              correct: 0,
              why: 'All three fractions equal the same k.',
            },
            {
              goal: 'Substitute into the LHS and simplify.',
              options: [
                T`$\text{LHS}=\dfrac{a^2k^2+b^2k^2+c^2k^2}{a^2+b^2+c^2}$ $=k^2$`,
                T`$\text{LHS}=\dfrac{a^2k+b^2k+c^2k}{a^2+b^2+c^2}$ $=k$`,
                T`$\text{LHS}=\dfrac{a^2k^2+b^2k^2+c^2k^2}{a^2+b^2+c^2}$ $=3k^2$`,
              ],
              correct: 0,
              why: T`Take out the common factor $k^2$; the rest cancels with the denominator. Call it (i).`,
            },
            {
              goal: 'Substitute into the RHS and simplify.',
              options: [
                T`$\text{RHS}=\dfrac{abk^2+bck^2+cak^2}{ab+bc+ca}$ $=k^2$`,
                T`$\text{RHS}=\dfrac{abk+bck+cak}{ab+bc+ca}$ $=k$`,
                T`$\text{RHS}=\dfrac{abk^2+bck^2+cak^2}{ab+bc+ca}$ $=k^6$`,
              ],
              correct: 0,
              why: T`$xy=ak\cdot bk=abk^2$, and likewise for the others. Call it (ii).`,
            },
            {
              goal: 'Conclude.',
              options: [T`From (i) and (ii), both sides equal $k^2$, so LHS = RHS.`, T`Both sides contain $k^2$, so $k=1$.`],
              correct: 0,
            },
          ],
          hints: [T`$x=ak$, so $x^2=a^2k^2$ and $xy=abk^2$.`],
          solution: [
            T`Let $\dfrac xa=\dfrac yb=\dfrac zc=k$, so $x=ak,\ y=bk,\ z=ck$.`,
            T`$$\text{LHS}=\frac{k^2(a^2+b^2+c^2)}{a^2+b^2+c^2}=k^2\ \ \text{…(i)}$$`,
            T`$$\text{RHS}=\frac{k^2(ab+bc+ca)}{ab+bc+ca}=k^2\ \ \text{…(ii)}$$`,
            'From (i) and (ii), the equality holds.',
          ],
        },
        {
          id: 'r-challenge-chem',
          type: 'proof',
          level: 'challenge',
          source: 'Lesson 1-12 · Challenge (Adjusting a Chemical Solution) · Exercise 1',
          prompt: T`Container 1 has $a$ grams of salt in $b$ millilitres of water; Container 2 has $c$ grams in $d$ millilitres. Both have the same concentration. Prove that the ratio of combined mass to separated difference is also the same: $$\frac{a+b}{a-b}=\frac{c+d}{c-d}$$`,
          steps: [
            {
              goal: 'Translate “the same concentration” into algebra.',
              options: [
                T`$\dfrac ab=\dfrac cd=k$, so $a=bk,\ c=dk$`,
                T`$a=c$ and $b=d$`,
                T`$a+b=c+d$`,
              ],
              correct: 0,
              why: 'Concentration is salt divided by water. The containers may be different sizes.',
            },
            {
              goal: 'Substitute into the LHS, factorise and simplify.',
              options: [
                T`$\text{LHS}=\dfrac{bk+b}{bk-b}$ $=\dfrac{b(k+1)}{b(k-1)}$ $=\dfrac{k+1}{k-1}$`,
                T`$\text{LHS}=\dfrac{bk+b}{bk-b}$ $=\dfrac{k+b}{k-b}$`,
                T`$\text{LHS}=\dfrac{bk+b}{bk-b}$ $=\dfrac{bk}{bk}+\dfrac{b}{-b}$ $=0$`,
              ],
              correct: 0,
              why: T`$b$ must be a factor of every term before it can cancel. Call the result (i).`,
            },
            {
              goal: 'Substitute into the RHS and simplify in the same way.',
              options: [
                T`$\text{RHS}=\dfrac{dk+d}{dk-d}$ $=\dfrac{k+1}{k-1}$`,
                T`$\text{RHS}=\dfrac{dk+d}{dk-d}$ $=\dfrac{k+d}{k-d}$`,
                T`$\text{RHS}=\dfrac{bk+d}{bk-d}$`,
              ],
              correct: 0,
              why: 'Call this (ii).',
            },
            {
              goal: 'Conclude.',
              options: [
                T`From (i) and (ii), both sides equal $\dfrac{k+1}{k-1}$, so the equality holds.`,
                'The two sides are equal only if both containers hold the same amount of water.',
                T`The sides are equal only when $k=1$.`,
              ],
              correct: 0,
            },
          ],
          hints: [T`Equal concentrations: $\dfrac ab=\dfrac cd$. Call the common value $k$.`, T`$bk+b=b(k+1)$ and $bk-b=b(k-1)$.`],
          solution: [
            T`Let $\dfrac ab=\dfrac cd=k$, so $a=bk,\ c=dk$.`,
            T`$$\text{LHS}=\frac{bk+b}{bk-b}=\frac{b(k+1)}{b(k-1)}=\frac{k+1}{k-1}\ \ \text{…(i)}$$`,
            T`$$\text{RHS}=\frac{dk+d}{dk-d}=\frac{d(k+1)}{d(k-1)}=\frac{k+1}{k-1}\ \ \text{…(ii)}$$`,
            T`From (i) and (ii), $\dfrac{a+b}{a-b}=\dfrac{c+d}{c-d}$. (The fractions exist as long as $k\ne1$, that is $a\ne b$.)`,
          ],
        },
      ],
    },
  ],
};

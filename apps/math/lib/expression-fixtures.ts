import type { ExpressionSnapshot } from "./expression";

export type ExpressionFixture = {
  name: string;
  category: "algebra" | "calculus" | "linear-algebra" | "logic" | "science";
  snapshot: ExpressionSnapshot;
};

function fixture(
  name: string,
  category: ExpressionFixture["category"],
  latex: string,
  plainText: string,
  strictText: string
): ExpressionFixture {
  return {
    name,
    category,
    snapshot: {
      latex,
      plainText,
      strictText,
      spokenText: plainText,
      mathMl: ""
    }
  };
}

export const expressionFixtures: ExpressionFixture[] = [
  fixture("quadratic equation", "algebra", String.raw`x^2+5x+6=0`, "x squared plus 5 x plus 6 equals 0", "x^2+5*x+6=0"),
  fixture("quadratic formula", "algebra", String.raw`x=\frac{-b\pm\sqrt{b^2-4ac}}{2a}`, "x equals negative b plus or minus the square root of b squared minus 4 a c, over 2 a", "x=(-b+-sqrt(b^2-4*a*c))/(2*a)"),
  fixture("rational expression", "algebra", String.raw`\frac{x+1}{x-1}`, "x plus 1 over x minus 1", "(x+1)/(x-1)"),
  fixture("nth root", "algebra", String.raw`\sqrt[3]{8}=2`, "the cube root of 8 equals 2", "root(8,3)=2"),
  fixture("absolute value", "algebra", String.raw`\left|x-3\right|\leq2`, "the absolute value of x minus 3 is less than or equal to 2", "abs(x-3)<=2"),
  fixture("binomial coefficient", "algebra", String.raw`\binom{n}{k}=\frac{n!}{k!(n-k)!}`, "n choose k equals n factorial over k factorial times n minus k factorial", "choose(n,k)=n!/(k!*(n-k)!)"),
  fixture("gaussian integral", "calculus", String.raw`\int_0^\infty e^{-x^2}\,dx=\frac{\sqrt{\pi}}2`, "the integral from 0 to infinity of e to the negative x squared d x equals square root of pi over 2", "integral(0,infinity,exp(-x^2),x)=sqrt(pi)/2"),
  fixture("limit", "calculus", String.raw`\lim_{x\to0}\frac{\sin x}{x}=1`, "the limit as x approaches 0 of sine x over x equals 1", "limit(x->0,sin(x)/x)=1"),
  fixture("derivative", "calculus", String.raw`\frac{d}{dx}x^n=nx^{n-1}`, "the derivative with respect to x of x to the n equals n x to the n minus 1", "diff(x^n,x)=n*x^(n-1)"),
  fixture("partial derivative", "calculus", String.raw`\frac{\partial f}{\partial x}`, "the partial derivative of f with respect to x", "partial(f,x)"),
  fixture("finite sum", "calculus", String.raw`\sum_{k=1}^n k=\frac{n(n+1)}2`, "the sum from k equals 1 to n of k equals n times n plus 1 over 2", "sum(k,1,n,k)=n*(n+1)/2"),
  fixture("infinite series", "calculus", String.raw`\sum_{n=0}^\infty\frac1{2^n}=2`, "the sum from n equals 0 to infinity of 1 over 2 to the n equals 2", "sum(n,0,infinity,1/2^n)=2"),
  fixture("finite product", "calculus", String.raw`\prod_{k=1}^n k=n!`, "the product from k equals 1 to n of k equals n factorial", "product(k,1,n,k)=n!"),
  fixture("contour integral", "calculus", String.raw`\oint_C f(z)\,dz`, "the contour integral over C of f of z d z", "contour_integral(C,f(z),z)"),
  fixture("double integral", "calculus", String.raw`\iint_D f(x,y)\,dx\,dy`, "the double integral over D of f of x y d x d y", "integral2(D,f(x,y),x,y)"),
  fixture("matrix", "linear-algebra", String.raw`\begin{pmatrix}a&b\\c&d\end{pmatrix}`, "the two by two matrix a b c d", "matrix([[a,b],[c,d]])"),
  fixture("determinant", "linear-algebra", String.raw`\det(A-\lambda I)=0`, "the determinant of A minus lambda I equals 0", "det(A-lambda*I)=0"),
  fixture("vector", "linear-algebra", String.raw`\vec{v}=\begin{pmatrix}v_1\\v_2\end{pmatrix}`, "vector v equals the column vector v 1 v 2", "v=vector(v_1,v_2)"),
  fixture("dot product", "linear-algebra", String.raw`\vec{a}\cdot\vec{b}=\|a\|\|b\|\cos\theta`, "a dot b equals norm a times norm b times cosine theta", "dot(a,b)=norm(a)*norm(b)*cos(theta)"),
  fixture("cross product", "linear-algebra", String.raw`\vec{a}\times\vec{b}`, "a cross b", "cross(a,b)"),
  fixture("set union", "logic", String.raw`A\cup B`, "A union B", "union(A,B)"),
  fixture("set comprehension", "logic", String.raw`\left\{x\in\mathbb{R}\mid x>0\right\}`, "the set of real x such that x is greater than 0", "set(x in R where x>0)"),
  fixture("logical implication", "logic", String.raw`P\Rightarrow Q`, "P implies Q", "implies(P,Q)"),
  fixture("logical equivalence", "logic", String.raw`P\Leftrightarrow Q`, "P if and only if Q", "iff(P,Q)"),
  fixture("universal quantifier", "logic", String.raw`\forall x\in X,\;P(x)`, "for all x in X, P of x", "forall(x in X,P(x))"),
  fixture("complex identity", "science", String.raw`e^{i\pi}+1=0`, "e to the i pi plus 1 equals 0", "exp(i*pi)+1=0"),
  fixture("mass energy", "science", String.raw`E=mc^2`, "E equals m c squared", "E=m*c^2"),
  fixture("wave equation", "science", String.raw`\frac{\partial^2u}{\partial t^2}=c^2\nabla^2u`, "the second partial derivative of u with respect to t equals c squared laplacian u", "partial(u,t,2)=c^2*laplacian(u)"),
  fixture("expectation", "science", String.raw`\mathbb{E}[X]=\sum_x xP(X=x)`, "the expected value of X equals the sum over x of x times the probability that X equals x", "expect(X)=sum(x,x*P(X=x))"),
  fixture("normal distribution", "science", String.raw`f(x)=\frac1{\sigma\sqrt{2\pi}}e^{-\frac12\left(\frac{x-\mu}{\sigma}\right)^2}`, "f of x is the normal distribution density with mean mu and standard deviation sigma", "f(x)=exp(-0.5*((x-mu)/sigma)^2)/(sigma*sqrt(2*pi))")
];

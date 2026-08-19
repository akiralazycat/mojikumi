export type UnicodeReadableFixture = {
  name: string;
  strict: string;
  expected: string;
  protects: string;
};

export const unicodeReadableFixtures: UnicodeReadableFixture[] = [
  {
    name: "simple scripts",
    strict: "x^2+y_12",
    expected: "x²+y₁₂",
    protects: "数値だけの上付き・下付きは作用範囲が一意"
  },
  {
    name: "grouped base with a numeric power",
    strict: "(x+1)^2",
    expected: "(x+1)²",
    protects: "底を囲む括弧を維持"
  },
  {
    name: "compound exponent",
    strict: "x^(n+1)",
    expected: "x^(n+1)",
    protects: "複合指数を推測でUnicode上付きへ変換しない"
  },
  {
    name: "grouped fraction",
    strict: "(a+b)/(c+d)",
    expected: "(a+b)/(c+d)",
    protects: "分子・分母の括弧とスラッシュを維持"
  },
  {
    name: "nested fraction",
    strict: "1/(1+x/y)",
    expected: "1/(1+x/y)",
    protects: "入れ子の分数を平坦化しない"
  },
  {
    name: "radical scope",
    strict: "sqrt(x+1)/sqrt(y-1)",
    expected: "√(x+1)/√(y−1)",
    protects: "根号の作用範囲と分数を維持"
  },
  {
    name: "definite integral",
    strict: "int _0^(oo) f(x) d x",
    expected: "∫ ₀^(∞) f(x) d x",
    protects: "上下限と微分変数を明示したまま表示"
  },
  {
    name: "bounded summation",
    strict: "sum_(i=1)^n (1/i)",
    expected: "∑_(i=1)^n (1/i)",
    protects: "総和の上下限と被演算子の括弧を維持"
  },
  {
    name: "bounded product",
    strict: "prod_(k=1)^n (k/(k+1))",
    expected: "∏_(k=1)^n (k/(k+1))",
    protects: "総乗の被演算子に含まれる分数を維持"
  },
  {
    name: "relations and multiplication",
    strict: "a*b<=c!=d",
    expected: "a×b≤c≠d",
    protects: "複数文字の関係演算子を一単位で置換"
  },
  {
    name: "function arguments",
    strict: "sin(x+y)=sqrt(1-z^2)",
    expected: "sin(x+y)=√(1−z²)",
    protects: "関数と根号の引数括弧を維持"
  },
  {
    name: "matrix notation",
    strict: "matrix([[a,b],[c,d]])",
    expected: "matrix([[a,b],[c,d]])",
    protects: "行列の行・列構造を変更しない"
  },
  {
    name: "logical implication",
    strict: "P=>Q<=>R",
    expected: "P⇒Q⇔R",
    protects: "含意と同値を長い演算子から置換"
  },
  {
    name: "named symbols",
    strict: "e^(i*pi)+1=0",
    expected: "e^(i×π)+1=0",
    protects: "複合指数は保持し、既知の定数だけを置換"
  },
  {
    name: "ambiguous semantic function",
    strict: "sum(k,1,n,k)=n*(n+1)/2",
    expected: "sum(k,1,n,k)=n×(n+1)/2",
    protects: "関数形式のsumを組版記号へ推測変換しない"
  }
];

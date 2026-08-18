export type TypesettingFixture = {
  name: string;
  latex: string;
  purpose: string;
};

/**
 * Visual regression inputs for combinations whose math axis and spacing are
 * easy to disturb when structure templates or MathLive are updated.
 */
export const typesettingFixtures: TypesettingFixture[] = [
  {
    name: "sum followed by a fraction",
    latex: String.raw`\sum_{i=1}^{n}\,\frac{1}{i}`,
    purpose: "上下限付きの和と分数の数式軸"
  },
  {
    name: "product followed by a fraction",
    latex: String.raw`\prod_{k=1}^{n}\,\frac{k}{k+1}`,
    purpose: "上下限付きの積と分数の数式軸"
  },
  {
    name: "definite integral of a rational expression",
    latex: String.raw`\int_{0}^{1}\frac{x^2}{1+x}\,dx`,
    purpose: "積分記号、分数、微分要素の間隔"
  },
  {
    name: "adjacent fractions",
    latex: String.raw`\frac{a}{b}+\frac{c}{d}`,
    purpose: "高さの異なる分数が続く式のベースライン"
  },
  {
    name: "parenthesized fraction with an exponent",
    latex: String.raw`\left(\frac{a+b}{c}\right)^n`,
    purpose: "可変括弧、分数、累乗の高さ"
  },
  {
    name: "nested sum and fraction",
    latex: String.raw`\frac{1}{n}\sum_{i=1}^{n}\,\frac{x_i-\mu}{\sigma}`,
    purpose: "外側の分数と総和を含む長い複合式"
  }
];

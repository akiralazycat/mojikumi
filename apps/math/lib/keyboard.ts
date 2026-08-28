import type { GlyphName } from "../components/structure-glyph";

/**
 * Keyboard content, kept as data so it can move to a shared package once the
 * Embed build needs the same key set.
 */

export type KeyboardGroup = "basic" | "algebra" | "calculus" | "greek";

export type MathKey = {
  label: string;
  value: string;
  variants?: Array<{ label: string; value: string }>;
};

export type QuickStarter = {
  label: string;
  glyph: GlyphName;
  value: string;
};

export type StructureKey = {
  label: string;
  glyph: GlyphName;
  emptyValue: string;
  selectedValue: string;
  appendValue?: string;
};

export const keyboardGroups: KeyboardGroup[] = ["basic", "algebra", "calculus", "greek"];

export const keyboardLabels: Record<KeyboardGroup, string> = {
  basic: "基本",
  algebra: "代数",
  calculus: "解析",
  greek: "ギリシャ"
};

export const quickStarters: QuickStarter[] = [
  {
    label: "分数",
    glyph: "fraction",
    value: String.raw`\frac{\placeholder{}}{\placeholder{}}`
  },
  {
    label: "二次式",
    glyph: "quadratic",
    value: String.raw`\placeholder{}x^2+\placeholder{}x+\placeholder{}=0`
  },
  {
    label: "定積分",
    glyph: "integral",
    value: String.raw`\int_{\placeholder{}}^{\placeholder{}}\placeholder{}\,d\placeholder{}`
  }
];

export const structureKeys: StructureKey[] = [
  {
    label: "分数",
    glyph: "fraction",
    emptyValue: String.raw`\frac{\placeholder{}}{\placeholder{}}`,
    selectedValue: String.raw`\frac{#0}{\placeholder{}}`
  },
  {
    label: "二乗",
    glyph: "square",
    emptyValue: String.raw`\placeholder{}^2`,
    selectedValue: String.raw`{#0}^2`,
    appendValue: String.raw`^2`
  },
  {
    label: "累乗",
    glyph: "power",
    emptyValue: String.raw`\placeholder{}^{\placeholder{}}`,
    selectedValue: String.raw`{#0}^{\placeholder{}}`,
    appendValue: String.raw`^{\placeholder{}}`
  },
  {
    label: "根号",
    glyph: "root",
    emptyValue: String.raw`\sqrt{\placeholder{}}`,
    selectedValue: String.raw`\sqrt{#0}`
  },
  {
    label: "括弧",
    glyph: "paren",
    emptyValue: String.raw`\left(\placeholder{}\right)`,
    selectedValue: String.raw`\left(#0\right)`
  }
];

export const keys: Record<KeyboardGroup, MathKey[]> = {
  basic: [
    { label: "+", value: "+" },
    { label: "−", value: "-" },
    { label: "×", value: String.raw`\times` },
    { label: "÷", value: String.raw`\div` },
    {
      label: "=",
      value: "=",
      variants: [
        { label: "≠", value: String.raw`\ne` },
        { label: "≈", value: String.raw`\approx` },
        { label: "≡", value: String.raw`\equiv` },
        { label: "≤", value: String.raw`\le` },
        { label: "≥", value: String.raw`\ge` }
      ]
    },
    { label: "π", value: String.raw`\pi` },
    { label: "∞", value: String.raw`\infty` }
  ],
  algebra: [
    { label: "±", value: String.raw`\pm` },
    { label: "≠", value: String.raw`\ne` },
    { label: "≈", value: String.raw`\approx` },
    { label: "≤", value: String.raw`\le` },
    { label: "≥", value: String.raw`\ge` },
    { label: "|x|", value: String.raw`\left|\placeholder{}\right|` },
    { label: "f(x)", value: String.raw`f\left(x\right)` },
    { label: "log", value: String.raw`\log\left(\placeholder{}\right)` }
  ],
  calculus: [
    {
      label: "∫",
      value: String.raw`\int_{\placeholder{}}^{\placeholder{}}\placeholder{}\,d\placeholder{}`,
      variants: [
        { label: "∬", value: String.raw`\iint_{\placeholder{}}\placeholder{}\,d\placeholder{}` },
        { label: "∭", value: String.raw`\iiint_{\placeholder{}}\placeholder{}\,d\placeholder{}` },
        { label: "∮", value: String.raw`\oint_{\placeholder{}}\placeholder{}\,d\placeholder{}` }
      ]
    },
    { label: "∂", value: String.raw`\frac{\partial \placeholder{}}{\partial \placeholder{}}` },
    { label: "lim", value: String.raw`\lim_{\placeholder{}\to\placeholder{}}` },
    { label: "Σ", value: String.raw`\sum_{\placeholder{}}^{\placeholder{}}\,\placeholder{}` },
    { label: "Π", value: String.raw`\prod_{\placeholder{}}^{\placeholder{}}\,\placeholder{}` },
    {
      label: "→",
      value: String.raw`\to`,
      variants: [
        { label: "←", value: String.raw`\leftarrow` },
        { label: "↔", value: String.raw`\leftrightarrow` },
        { label: "⇒", value: String.raw`\Rightarrow` },
        { label: "⇔", value: String.raw`\Leftrightarrow` }
      ]
    }
  ],
  greek: [
    { label: "α", value: String.raw`\alpha` },
    { label: "β", value: String.raw`\beta` },
    { label: "γ", value: String.raw`\gamma` },
    { label: "δ", value: String.raw`\delta` },
    { label: "θ", value: String.raw`\theta` },
    { label: "λ", value: String.raw`\lambda` },
    { label: "μ", value: String.raw`\mu` },
    { label: "σ", value: String.raw`\sigma` },
    { label: "φ", value: String.raw`\phi` },
    { label: "ω", value: String.raw`\omega` }
  ]
};

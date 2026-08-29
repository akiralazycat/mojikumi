export type ImportFormat = "latex" | "asciimath" | "mathml" | "unicode" | "plain";

export type ImportDetection = {
  format: ImportFormat;
  label: string;
  normalized: string;
};

const formatLabels: Record<ImportFormat, string> = {
  latex: "LaTeX",
  asciimath: "AsciiMath",
  mathml: "MathML",
  unicode: "Unicode数式",
  plain: "数式テキスト"
};

const latexSignal = /\\(?:frac|dfrac|tfrac|sqrt|sum|prod|int|iint|iiint|oint|lim|sin|cos|tan|log|ln|mathrm|operatorname|left|right|begin|end|alpha|beta|gamma|theta|pi|infty)\b/u;
const asciiMathSignal = /(?:\b(?:sqrt|root|sum|prod|int|lim|sin|cos|tan|log|ln)\s*(?:\(|_|\^)|\boo\b|<=|>=|!=|[A-Za-z0-9).]+\s*\/\s*[(A-Za-z0-9])/iu;
const unicodeMathSignal = /[√∑∏∫∞≤≥≠≈×÷−±∂∇∈∉⊂⊆∪∩→↦πθλμσφω]/u;

function stripCodeFence(source: string) {
  const match = source.trim().match(/^```(?:latex|tex|asciimath|mathml|xml|math)?\s*\n?([\s\S]*?)\n?```$/iu);
  return match?.[1]?.trim() ?? source.trim();
}

function stripLatexDelimiters(source: string) {
  const value = source.trim();
  const wrappers: Array<[string, string]> = [
    ["$$", "$$"],
    ["\\[", "\\]"],
    ["\\(", "\\)"],
    ["$", "$"]
  ];
  for (const [open, close] of wrappers) {
    if (value.startsWith(open) && value.endsWith(close) && value.length > open.length + close.length) {
      return value.slice(open.length, -close.length).trim();
    }
  }
  return value;
}

export function detectImportSource(input: string): ImportDetection {
  const fenced = stripCodeFence(input);
  if (/<(?:[a-zA-Z0-9_-]+:)?math(?:\s|>)/iu.test(fenced) || /<(?:[a-zA-Z0-9_-]+:)?mfrac(?:\s|>)/iu.test(fenced)) {
    return { format: "mathml", label: formatLabels.mathml, normalized: fenced };
  }

  const normalized = stripLatexDelimiters(fenced);
  if (latexSignal.test(normalized) || /^\\(?:[a-zA-Z]+|.)/u.test(normalized)) {
    return { format: "latex", label: formatLabels.latex, normalized };
  }
  if (asciiMathSignal.test(normalized)) {
    return { format: "asciimath", label: formatLabels.asciimath, normalized };
  }
  if (unicodeMathSignal.test(normalized)) {
    return { format: "unicode", label: formatLabels.unicode, normalized };
  }
  return { format: "plain", label: formatLabels.plain, normalized };
}

const unicodeToLatex = new Map<string, string>([
  ["−", "-"], ["×", "\\times "], ["÷", "\\div "],
  ["≤", "\\le "], ["≥", "\\ge "], ["≠", "\\ne "],
  ["≈", "\\approx "], ["±", "\\pm "], ["∞", "\\infty "],
  ["∑", "\\sum "], ["∏", "\\prod "], ["∫", "\\int "],
  ["∂", "\\partial "], ["∇", "\\nabla "], ["∈", "\\in "],
  ["∉", "\\notin "], ["⊂", "\\subset "], ["⊆", "\\subseteq "],
  ["∪", "\\cup "], ["∩", "\\cap "], ["→", "\\to "],
  ["↦", "\\mapsto "], ["π", "\\pi "], ["θ", "\\theta "],
  ["λ", "\\lambda "], ["μ", "\\mu "], ["σ", "\\sigma "],
  ["φ", "\\phi "], ["ω", "\\omega "]
]);

export function normalizeUnicodeMath(source: string) {
  let result = source;
  for (const [symbol, latex] of unicodeToLatex) result = result.split(symbol).join(latex);
  result = result.replace(/√\s*\(([^()]*)\)/gu, "\\sqrt{$1}");
  result = result.replace(/√\s*([a-zA-Z0-9]+)/gu, "\\sqrt{$1}");
  return result.trim();
}

type MathMlNode = {
  name: string;
  attrs: Record<string, string>;
  children: Array<MathMlNode | string>;
};

function decodeXml(value: string) {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/gu, "$1")
    .replace(/&lt;/gu, "<")
    .replace(/&gt;/gu, ">")
    .replace(/&amp;/gu, "&")
    .replace(/&quot;/gu, '"')
    .replace(/&apos;/gu, "'")
    .replace(/&#(\d+);/gu, (_, code: string) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/giu, (_, code: string) => String.fromCodePoint(Number.parseInt(code, 16)));
}

function parseAttributes(tag: string) {
  const attrs: Record<string, string> = {};
  const pattern = /([:\w-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/gu;
  for (const match of tag.matchAll(pattern)) {
    const rawName = match[1] ?? "";
    attrs[rawName.split(":").at(-1) ?? rawName] = decodeXml(match[2] ?? match[3] ?? "");
  }
  return attrs;
}

function parseMathMlXml(source: string): MathMlNode | null {
  const root: MathMlNode = { name: "root", attrs: {}, children: [] };
  const stack = [root];
  const tokens = source.match(/<[^>]+>|[^<]+/gu) ?? [];
  for (const token of tokens) {
    if (token.startsWith("<?") || token.startsWith("<!--") || token.startsWith("<!DOCTYPE")) continue;
    if (token.startsWith("</")) {
      if (stack.length > 1) stack.pop();
      continue;
    }
    if (token.startsWith("<")) {
      const match = token.match(/^<\s*([^\s/>]+)/u);
      if (!match?.[1]) continue;
      const rawName = match[1];
      const node: MathMlNode = {
        name: (rawName.split(":").at(-1) ?? rawName).toLowerCase(),
        attrs: parseAttributes(token),
        children: []
      };
      stack.at(-1)?.children.push(node);
      if (!/\/\s*>$/u.test(token)) stack.push(node);
      continue;
    }
    const text = decodeXml(token);
    if (text.trim()) stack.at(-1)?.children.push(text);
  }
  return root.children.find((child): child is MathMlNode => typeof child !== "string" && child.name === "math")
    ?? root.children.find((child): child is MathMlNode => typeof child !== "string")
    ?? null;
}

function childLatex(node: MathMlNode, index: number) {
  const child = node.children[index];
  return child === undefined ? "" : mathMlPartToLatex(child);
}

function escapeMathText(value: string) {
  const trimmed = value.replace(/\s+/gu, " ").trim();
  if (!trimmed) return "";
  if (trimmed.length === 1 && unicodeToLatex.has(trimmed)) return unicodeToLatex.get(trimmed) ?? trimmed;
  if (/^[a-zA-Z0-9.]+$/u.test(trimmed)) return trimmed;
  if (/^[=+\-()\[\],.:/]$/u.test(trimmed)) return trimmed;
  return `\\text{${trimmed.replace(/[{}]/gu, "")}}`;
}

function mathMlPartToLatex(part: MathMlNode | string): string {
  if (typeof part === "string") return escapeMathText(part);
  const children = () => part.children.map(mathMlPartToLatex).join("");
  switch (part.name) {
    case "math":
    case "mrow":
    case "mstyle":
    case "mpadded":
    case "mphantom":
      return children();
    case "semantics": {
      const presentation = part.children.find((child) => typeof child !== "string" && child.name !== "annotation" && child.name !== "annotation-xml");
      return presentation ? mathMlPartToLatex(presentation) : "";
    }
    case "annotation":
    case "annotation-xml":
    case "none":
      return "";
    case "mi":
    case "mn":
    case "mo":
      return escapeMathText(part.children.map((child) => typeof child === "string" ? child : mathMlPartToLatex(child)).join(""));
    case "mtext": {
      const text = part.children.map((child) => typeof child === "string" ? child : "").join("").replace(/\s+/gu, " ").trim();
      return text ? `\\text{${text.replace(/[{}]/gu, "")}}` : "";
    }
    case "mfrac":
      return `\\frac{${childLatex(part, 0)}}{${childLatex(part, 1)}}`;
    case "msqrt":
      return `\\sqrt{${children()}}`;
    case "mroot":
      return `\\sqrt[${childLatex(part, 1)}]{${childLatex(part, 0)}}`;
    case "msup":
      return `{${childLatex(part, 0)}}^{${childLatex(part, 1)}}`;
    case "msub":
      return `{${childLatex(part, 0)}}_{${childLatex(part, 1)}}`;
    case "msubsup":
      return `{${childLatex(part, 0)}}_{${childLatex(part, 1)}}^{${childLatex(part, 2)}}`;
    case "mover":
      return `\\overset{${childLatex(part, 1)}}{${childLatex(part, 0)}}`;
    case "munder":
      return `\\underset{${childLatex(part, 1)}}{${childLatex(part, 0)}}`;
    case "munderover":
      return `\\overset{${childLatex(part, 2)}}{\\underset{${childLatex(part, 1)}}{${childLatex(part, 0)}}}`;
    case "mfenced": {
      const open = part.attrs.open ?? "(";
      const close = part.attrs.close ?? ")";
      const separators = part.attrs.separators ?? ",";
      const rendered = part.children.map(mathMlPartToLatex).join(`${separators[0] ?? ","} `);
      return `\\left${open}${rendered}\\right${close}`;
    }
    case "mtable":
      return `\\begin{matrix}${part.children.map(mathMlPartToLatex).join("\\\\")}\\end{matrix}`;
    case "mtr":
      return part.children.map(mathMlPartToLatex).join(" & ");
    case "mtd":
      return children();
    default:
      return children();
  }
}

export function convertMathMlToLatex(source: string) {
  const texAnnotation = source.match(/<annotation\b[^>]*encoding\s*=\s*(?:"(?:application\/x-tex|application\/x-latex|text\/latex)"|'(?:application\/x-tex|application\/x-latex|text\/latex)')[^>]*>([\s\S]*?)<\/annotation>/iu);
  if (texAnnotation?.[1]) return stripLatexDelimiters(decodeXml(texAnnotation[1]).trim());
  const root = parseMathMlXml(source);
  if (!root) throw new Error("MathMLを読み取れませんでした。");
  const latex = mathMlPartToLatex(root).trim();
  if (!latex) throw new Error("MathMLに数式がありません。");
  return latex;
}

export function prepareImportedLatex(
  detection: ImportDetection,
  convertAsciiMathToLatex: (source: string) => string
) {
  if (detection.format === "mathml") return convertMathMlToLatex(detection.normalized);
  if (detection.format === "asciimath") return convertAsciiMathToLatex(detection.normalized).trim();
  if (detection.format === "unicode") return normalizeUnicodeMath(detection.normalized);
  return detection.normalized.trim();
}

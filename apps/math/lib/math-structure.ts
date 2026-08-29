import { readGroup } from "./latex-scan";

export type SemanticStructureKind = "fraction" | "root" | "integral" | "sum";

export type SemanticSlot = {
  id: "numerator" | "denominator" | "radicand" | "index" | "lower" | "upper" | "body" | "variable";
  label: string;
  latex: string;
};

export type SemanticStructure = {
  kind: SemanticStructureKind;
  label: string;
  slots: SemanticSlot[];
};

type ScriptParts = {
  lower: string;
  upper: string;
  rest: string;
};

function unwrapGrouping(source: string) {
  let result = source.trim();
  while (result.startsWith("{")) {
    const group = readGroup(result, 0);
    if (!group || group.end !== result.length) break;
    result = group.content.trim();
  }
  return result;
}

function skipWhitespace(source: string, start: number) {
  let index = start;
  while (/\s/.test(source[index] ?? "")) index += 1;
  return index;
}

function readBracket(source: string, start: number) {
  const index = skipWhitespace(source, start);
  if (source[index] !== "[") return null;
  let depth = 0;
  for (let cursor = index; cursor < source.length; cursor += 1) {
    const token = source[cursor];
    if (token === "[") depth += 1;
    if (token === "]") {
      depth -= 1;
      if (depth === 0) {
        return { content: source.slice(index + 1, cursor), end: cursor + 1 };
      }
    }
  }
  return null;
}

function readScriptValue(source: string, start: number) {
  let index = start;
  while (/\s/.test(source[index] ?? "")) index += 1;
  const group = readGroup(source, index);
  if (group) return { content: group.content, end: group.end };
  if (source[index] === "\\") {
    const command = source.slice(index).match(/^\\[a-zA-Z]+/u)?.[0];
    if (command) return { content: command, end: index + command.length };
  }
  return { content: source[index] ?? "", end: Math.min(index + 1, source.length) };
}

function readScripts(source: string, start: number): ScriptParts {
  let index = start;
  let lower = "";
  let upper = "";
  while (index < source.length) {
    while (/\s/.test(source[index] ?? "")) index += 1;
    const marker = source[index];
    if (marker !== "_" && marker !== "^") break;
    const value = readScriptValue(source, index + 1);
    if (marker === "_") lower = value.content;
    if (marker === "^") upper = value.content;
    index = value.end;
  }
  return { lower, upper, rest: source.slice(index) };
}

function stripLeadingSpacing(source: string) {
  return source.replace(/^\s*(?:\\[,!;:]\s*)+/u, "").trim();
}

function parseIntegralBody(source: string) {
  const body = stripLeadingSpacing(source);
  const differential = body.match(
    /^(.*?)(?:\\[,!;:]\s*)?(?:d|\\mathrm\s*\{\s*d\s*\}|\\operatorname\s*\{\s*d\s*\})\s*((?:\\placeholder(?:\[[^\]]*\])?\{[^{}]*\}|\\[a-zA-Z]+|[a-zA-Z])(?:_\{[^{}]*\}|_[a-zA-Z0-9]+)?)\s*$/u
  );
  if (differential) {
    return { expression: differential[1]?.trim() ?? "", variable: differential[2]?.trim() ?? "" };
  }
  return { expression: body, variable: "" };
}

function parseFraction(source: string): SemanticStructure | null {
  const command = source.match(/^\\(?:dfrac|tfrac|frac)(?=[^a-zA-Z]|$)/u);
  if (!command) return null;
  const numerator = readGroup(source, skipWhitespace(source, command[0].length));
  if (!numerator) return null;
  const denominator = readGroup(source, skipWhitespace(source, numerator.end));
  if (!denominator || source.slice(denominator.end).trim()) return null;
  return {
    kind: "fraction",
    label: "分数",
    slots: [
      { id: "numerator", label: "分子", latex: numerator.content },
      { id: "denominator", label: "分母", latex: denominator.content }
    ]
  };
}

function parseRoot(source: string): SemanticStructure | null {
  const command = source.match(/^\\sqrt(?=[^a-zA-Z]|$)/u);
  if (!command) return null;
  let cursor = command[0].length;
  const index = readBracket(source, cursor);
  if (index) cursor = index.end;
  const radicand = readGroup(source, skipWhitespace(source, cursor));
  if (!radicand || source.slice(radicand.end).trim()) return null;
  return {
    kind: "root",
    label: index ? "根号" : "平方根",
    slots: [
      { id: "index", label: "根指数", latex: index?.content ?? "" },
      { id: "radicand", label: "根号の中", latex: radicand.content }
    ]
  };
}

export function parseSemanticStructure(latex: string): SemanticStructure | null {
  const source = unwrapGrouping(latex);
  const fraction = parseFraction(source);
  if (fraction) return fraction;
  const root = parseRoot(source);
  if (root) return root;

  const command = source.match(/^\\(iiint|iint|oint|int|sum|prod)(?=[^a-zA-Z]|$)/u);
  if (!command) return null;
  const scripts = readScripts(source, command[0].length);
  if (command[1] === "sum" || command[1] === "prod") {
    return {
      kind: "sum",
      label: command[1] === "prod" ? "総乗" : "シグマ",
      slots: [
        { id: "lower", label: "下側条件", latex: scripts.lower },
        { id: "upper", label: "上限", latex: scripts.upper },
        { id: "body", label: "総和式", latex: stripLeadingSpacing(scripts.rest) }
      ]
    };
  }
  const integralBody = parseIntegralBody(scripts.rest);
  return {
    kind: "integral",
    label: "積分",
    slots: [
      { id: "lower", label: "下限", latex: scripts.lower },
      { id: "upper", label: "上限", latex: scripts.upper },
      { id: "body", label: "式", latex: integralBody.expression },
      { id: "variable", label: "変数", latex: integralBody.variable }
    ]
  };
}

export function normalizeSlotLatex(latex: string) {
  return stripLeadingSpacing(unwrapGrouping(latex)).replace(/\s+/gu, " ").trim();
}

const fractionPattern = /\\(?:dfrac|tfrac|frac)(?=[^a-zA-Z]|$)/u;
const rootPattern = /\\sqrt(?=[^a-zA-Z]|$)/u;
const integralPattern = /\\(?:iiint|iint|oint|int)(?=[^a-zA-Z]|$)/u;
const sumPattern = /\\(?:sum|prod)(?=[^a-zA-Z]|$)/u;

/** Which semantic structures the expression contains, without parsing it. */
export function structureKindsIn(latex: string): SemanticStructureKind[] {
  const kinds: SemanticStructureKind[] = [];
  if (fractionPattern.test(latex)) kinds.push("fraction");
  if (rootPattern.test(latex)) kinds.push("root");
  if (integralPattern.test(latex)) kinds.push("integral");
  if (sumPattern.test(latex)) kinds.push("sum");
  return kinds;
}

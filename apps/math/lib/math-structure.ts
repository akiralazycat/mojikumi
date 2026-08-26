import { readGroup } from "./latex-scan";

export type SemanticStructureKind = "integral" | "sum";

export type SemanticSlot = {
  id: "lower" | "upper" | "body" | "variable";
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

export function parseSemanticStructure(latex: string): SemanticStructure | null {
  const source = unwrapGrouping(latex);
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

const integralPattern = /\\(?:iiint|iint|oint|int)(?=[^a-zA-Z]|$)/u;
const sumPattern = /\\(?:sum|prod)(?=[^a-zA-Z]|$)/u;

/** Which semantic structures the expression contains, without parsing it. */
export function structureKindsIn(latex: string): SemanticStructureKind[] {
  const kinds: SemanticStructureKind[] = [];
  if (integralPattern.test(latex)) kinds.push("integral");
  if (sumPattern.test(latex)) kinds.push("sum");
  return kinds;
}

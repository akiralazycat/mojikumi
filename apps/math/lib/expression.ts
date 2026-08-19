import { toUnicodeReadable } from "./unicode-readable";

export const expressionVersion = 1 as const;

export type MojikumiExpression = {
  version: typeof expressionVersion;
  engine: "mathlive";
  isComplete: boolean;
  latex: string;
  plainText: string;
  strictText: string;
  spokenText: string;
  mathMl: string;
};

export type ExpressionSnapshot = Omit<
  MojikumiExpression,
  "version" | "engine" | "isComplete"
>;

export type OutputKind =
  | "ai"
  | "plain"
  | "readable"
  | "strict"
  | "latex"
  | "markdown"
  | "mathml"
  | "embed";

export type AiAction =
  | "explain"
  | "solve"
  | "prove"
  | "simplify"
  | "differentiate"
  | "integrate";

const aiInstructions: Record<AiAction, string> = {
  explain: "次の数式について、意味と考え方を順を追って説明してください。",
  solve: "次の数式または方程式を解き、途中の手順も示してください。",
  prove: "次の数式または命題を証明し、使った前提を明示してください。",
  simplify: "次の数式を簡約し、変形の根拠を説明してください。",
  differentiate: "次の数式を微分し、途中の手順も示してください。",
  integrate: "次の数式を積分し、途中の手順も示してください。"
};

export function cleanLatex(value: string) {
  return value
    .replace(/\\placeholder(?:\[[^\]]*\])?\{[^}]*\}/g, "")
    .trim();
}

export function hasPlaceholders(value: string) {
  return /\\placeholder(?:\[[^\]]*\])?\{/.test(value);
}

export function createExpression(snapshot: ExpressionSnapshot): MojikumiExpression {
  const latex = cleanLatex(snapshot.latex);

  return {
    version: expressionVersion,
    engine: "mathlive",
    isComplete: !hasPlaceholders(snapshot.latex),
    latex,
    plainText: snapshot.plainText.trim() || latex,
    strictText: snapshot.strictText.trim() || latex,
    spokenText: snapshot.spokenText.trim() || snapshot.plainText.trim() || latex,
    mathMl: snapshot.mathMl.trim()
  };
}

function escapeAttribute(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function escapeText(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

export function createAiPrompt(
  expression: MojikumiExpression,
  action: AiAction = "explain"
) {
  const readable = expression.spokenText || expression.plainText || expression.strictText;
  return `${aiInstructions[action]}\n\n${readable}`;
}

export function serializeExpression(
  expression: MojikumiExpression,
  kind: OutputKind,
  options: { aiAction?: AiAction } = {}
) {
  switch (kind) {
    case "ai":
      return createAiPrompt(expression, options.aiAction);
    case "plain":
      return expression.plainText;
    case "readable":
      return toUnicodeReadable(expression.strictText);
    case "strict":
      return expression.strictText;
    case "latex":
      return expression.latex;
    case "markdown":
      return `$$\n${expression.latex}\n$$`;
    case "mathml":
      return expression.mathMl || `<math><mtext>${escapeText(expression.plainText)}</mtext></math>`;
    case "embed":
      return `<mojikumi-math latex="${escapeAttribute(expression.latex)}"></mojikumi-math>`;
  }
}

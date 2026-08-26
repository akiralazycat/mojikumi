import { hasPlaceholder, replacePlaceholders } from "./latex-scan";
import { toUnicodeReadable } from "./unicode-readable";

export const expressionVersion = 1 as const;

/** Visible stand-ins for an input slot the writer has not filled yet. */
export const placeholderText = "□";
export const placeholderLatex = String.raw`\square`;

const enginePlaceholderGlyph = "❑";

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

export function toOutputLatex(value: string) {
  return replacePlaceholders(value, placeholderLatex).trim();
}

export function hasPlaceholders(value: string) {
  return hasPlaceholder(value);
}

function toOutputText(value: string) {
  return replacePlaceholders(value, placeholderText)
    .replaceAll(enginePlaceholderGlyph, placeholderText)
    .trim();
}

/**
 * Build the app-local expression from one engine snapshot.
 *
 * A converter the engine has not produced yet stays empty. Substituting LaTeX
 * for it would send LaTeX through the Strict β and MathML paths, which assume
 * their own input language.
 */
export function createExpression(snapshot: ExpressionSnapshot): MojikumiExpression {
  return {
    version: expressionVersion,
    engine: "mathlive",
    isComplete: !hasPlaceholders(snapshot.latex),
    latex: toOutputLatex(snapshot.latex),
    plainText: toOutputText(snapshot.plainText),
    strictText: toOutputText(snapshot.strictText),
    spokenText: toOutputText(snapshot.spokenText),
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

function toMathMl(expression: MojikumiExpression) {
  if (expression.mathMl) return expression.mathMl;
  if (!expression.plainText) return null;
  return `<math><mtext>${escapeText(expression.plainText)}</mtext></math>`;
}

/**
 * The prompt keeps the text the writer can see on the テキスト tab and adds the
 * LaTeX beneath it, so the request stays readable while the notation stays
 * exact. No reading is invented for notation Mojikumi Math cannot derive.
 */
export function createAiPrompt(
  expression: MojikumiExpression,
  action: AiAction = "explain"
) {
  const blocks = [aiInstructions[action]];
  if (expression.plainText) blocks.push(expression.plainText);
  blocks.push(`LaTeX:\n${expression.latex}`);
  if (!expression.isComplete) {
    blocks.push(`${placeholderText} は未入力の箇所です。`);
  }
  return blocks.join("\n\n");
}

/**
 * Serialize one output. `null` means the engine has not produced the source
 * this output derives from yet; the caller shows that state instead of
 * inventing a substitute.
 */
export function serializeExpression(
  expression: MojikumiExpression,
  kind: OutputKind,
  options: { aiAction?: AiAction } = {}
): string | null {
  switch (kind) {
    case "ai":
      return createAiPrompt(expression, options.aiAction);
    case "plain":
      return expression.plainText || null;
    case "readable":
      return expression.strictText ? toUnicodeReadable(expression.strictText) : null;
    case "strict":
      return expression.strictText || null;
    case "latex":
      return expression.latex;
    case "markdown":
      return `$$\n${expression.latex}\n$$`;
    case "mathml":
      return toMathMl(expression);
    case "embed": {
      const fallback = toMathMl(expression) ?? "";
      return `<mojikumi-math latex="${escapeAttribute(expression.latex)}">${fallback}</mojikumi-math>`;
    }
  }
}

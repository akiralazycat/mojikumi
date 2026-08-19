import { describe, expect, it } from "vitest";
import {
  cleanLatex,
  createAiPrompt,
  createExpression,
  serializeExpression
} from "./expression";
import { expressionFixtures } from "./expression-fixtures";

const expression = createExpression({
  latex: String.raw`\frac{\sqrt{\pi}}{2}`,
  plainText: "sqrt(π) / 2",
  strictText: "sqrt(pi)/2",
  spokenText: "the square root of pi over two",
  mathMl: "<math><mfrac><msqrt><mi>π</mi></msqrt><mn>2</mn></mfrac></math>"
});

describe("MojikumiExpression", () => {
  it("removes MathLive placeholders at the adapter boundary", () => {
    expect(cleanLatex(String.raw`x+\placeholder[id]{value}+y`)).toBe("x++y");
  });

  it("keeps the engine payload private behind a versioned expression", () => {
    expect(expression).toMatchObject({
      version: 1,
      engine: "mathlive",
      isComplete: true,
      latex: String.raw`\frac{\sqrt{\pi}}{2}`
    });
  });

  it("marks unfinished structural input without exposing placeholders", () => {
    const unfinished = createExpression({
      latex: String.raw`\frac{1}{\placeholder{}}`,
      plainText: "1 /",
      strictText: "1/",
      spokenText: "one divided by",
      mathMl: ""
    });
    expect(unfinished.isComplete).toBe(false);
    expect(unfinished.latex).toBe(String.raw`\frac{1}{}`);
  });

  it.each([
    ["plain", "sqrt(π) / 2"],
    ["readable", "√(π)/2"],
    ["strict", "sqrt(pi)/2"],
    ["latex", String.raw`\frac{\sqrt{\pi}}{2}`],
    ["markdown", `$$\n${String.raw`\frac{\sqrt{\pi}}{2}`}\n$$`],
    ["mathml", expression.mathMl]
  ] as const)("serializes %s output", (kind, expected) => {
    expect(serializeExpression(expression, kind)).toBe(expected);
  });

  it("escapes LaTeX when embedding it in an HTML attribute", () => {
    const unsafe = createExpression({
      latex: 'x<y & y>"z"',
      plainText: "",
      strictText: "",
      spokenText: "",
      mathMl: ""
    });
    expect(serializeExpression(unsafe, "embed")).toContain(
      'latex="x&lt;y &amp; y&gt;&quot;z&quot;"'
    );
  });

  it("escapes plain text in the MathML fallback", () => {
    const unsafe = createExpression({
      latex: "x",
      plainText: "x < y & z",
      strictText: "x<y&z",
      spokenText: "",
      mathMl: ""
    });
    expect(serializeExpression(unsafe, "mathml")).toBe(
      "<math><mtext>x &lt; y &amp; z</mtext></math>"
    );
  });

  it("builds destination-neutral AI prompts", () => {
    expect(createAiPrompt(expression, "simplify")).toBe(
      "次の数式を簡約し、変形の根拠を説明してください。\n\n" +
        "the square root of pi over two"
    );
  });

  it("derives Readable only from the Strict β source", () => {
    const conflictingSources = createExpression({
      latex: "z^9",
      plainText: "z to the ninth",
      strictText: "x^2",
      spokenText: "z to the ninth",
      mathMl: ""
    });

    expect(serializeExpression(conflictingSources, "readable")).toBe("x²");
  });

  it("covers 30 representative formulas at the public adapter boundary", () => {
    expect(expressionFixtures).toHaveLength(30);

    for (const fixture of expressionFixtures) {
      const adapted = createExpression(fixture.snapshot);
      expect(adapted.isComplete, fixture.name).toBe(true);
      expect(serializeExpression(adapted, "plain"), fixture.name).toBe(
        fixture.snapshot.plainText
      );
      expect(serializeExpression(adapted, "strict"), fixture.name).toBe(
        fixture.snapshot.strictText
      );
      expect(serializeExpression(adapted, "readable"), fixture.name).toBeTruthy();
      expect(serializeExpression(adapted, "markdown"), fixture.name).toBe(
        `$$\n${fixture.snapshot.latex}\n$$`
      );
      expect(serializeExpression(adapted, "embed"), fixture.name).toContain(
        "<mojikumi-math"
      );
    }
  });
});

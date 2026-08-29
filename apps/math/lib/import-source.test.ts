import { describe, expect, it } from "vitest";
import {
  convertMathMlToLatex,
  detectImportSource,
  normalizeUnicodeMath,
  prepareImportedLatex
} from "./import-source";

describe("detectImportSource", () => {
  it("unwraps fenced and delimited LaTeX", () => {
    const detected = detectImportSource("```latex\n$$\\frac{1}{2}$$\n```");
    expect(detected.format).toBe("latex");
    expect(detected.normalized).toBe(String.raw`\frac{1}{2}`);
  });

  it("recognizes AsciiMath, MathML and Unicode math", () => {
    expect(detectImportSource("1/2").format).toBe("asciimath");
    expect(detectImportSource("<math><mfrac><mn>1</mn><mn>2</mn></mfrac></math>").format).toBe("mathml");
    expect(detectImportSource("√(x+1) ≤ π").format).toBe("unicode");
  });
});

describe("import conversion", () => {
  it("uses the supplied MathLive AsciiMath converter", () => {
    const detection = detectImportSource("1/2");
    expect(prepareImportedLatex(detection, () => String.raw`\frac{1}{2}`)).toBe(String.raw`\frac{1}{2}`);
  });

  it("normalizes common Unicode math symbols", () => {
    expect(normalizeUnicodeMath("√(x+1) ≤ π").replace(/\s+/gu, " ")).toBe(String.raw`\sqrt{x+1} \le \pi`);
  });

  it("prefers embedded TeX annotations in MathML", () => {
    const mathml = `<math><semantics><mfrac><mn>1</mn><mn>2</mn></mfrac><annotation encoding="application/x-tex">\\frac{a}{b}</annotation></semantics></math>`;
    expect(convertMathMlToLatex(mathml)).toBe(String.raw`\frac{a}{b}`);
  });

  it("converts basic presentation MathML when no annotation exists", () => {
    const mathml = `<math><mrow><mfrac><mi>x</mi><mn>2</mn></mfrac><mo>+</mo><msqrt><mi>y</mi></msqrt></mrow></math>`;
    expect(convertMathMlToLatex(mathml)).toBe(String.raw`\frac{x}{2}+\sqrt{y}`);
  });
});

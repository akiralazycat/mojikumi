import { describe, expect, it } from "vitest";
import {
  normalizeSlotLatex,
  parseSemanticStructure,
  structureKindsIn
} from "./math-structure";

describe("parseSemanticStructure", () => {
  it("splits a fraction into numerator and denominator", () => {
    expect(parseSemanticStructure(String.raw`\frac{x+1}{y}`)).toEqual({
      kind: "fraction",
      label: "分数",
      slots: [
        { id: "numerator", label: "分子", latex: "x+1" },
        { id: "denominator", label: "分母", latex: "y" }
      ]
    });
  });

  it("splits square and indexed roots into semantic slots", () => {
    expect(parseSemanticStructure(String.raw`\sqrt{x+1}`)).toEqual({
      kind: "root",
      label: "平方根",
      slots: [
        { id: "index", label: "根指数", latex: "" },
        { id: "radicand", label: "根号の中", latex: "x+1" }
      ]
    });
    expect(parseSemanticStructure(String.raw`\sqrt[3]{x}`)).toEqual({
      kind: "root",
      label: "根号",
      slots: [
        { id: "index", label: "根指数", latex: "3" },
        { id: "radicand", label: "根号の中", latex: "x" }
      ]
    });
  });

  it("does not absorb trailing terms into fraction or root structures", () => {
    expect(parseSemanticStructure(String.raw`\frac{a}{b}+c`)).toBeNull();
    expect(parseSemanticStructure(String.raw`\sqrt{x}+1`)).toBeNull();
  });

  it("splits a definite integral into four semantic slots", () => {
    expect(parseSemanticStructure(String.raw`\int_{0}^{1}x^2\,dx`)).toEqual({
      kind: "integral",
      label: "積分",
      slots: [
        { id: "lower", label: "下限", latex: "0" },
        { id: "upper", label: "上限", latex: "1" },
        { id: "body", label: "式", latex: "x^2" },
        { id: "variable", label: "変数", latex: "x" }
      ]
    });
  });

  it("splits a sigma expression into three semantic slots", () => {
    expect(parseSemanticStructure(String.raw`\sum_{i=1}^{n}\,i^2`)).toEqual({
      kind: "sum",
      label: "シグマ",
      slots: [
        { id: "lower", label: "下側条件", latex: "i=1" },
        { id: "upper", label: "上限", latex: "n" },
        { id: "body", label: "総和式", latex: "i^2" }
      ]
    });
  });

  it("handles nested groups without losing their structure", () => {
    expect(parseSemanticStructure(String.raw`{\int_{a}^{b}\frac{1}{x}\,dx}`)?.slots[2]?.latex)
      .toBe(String.raw`\frac{1}{x}`);
    expect(normalizeSlotLatex(String.raw`{\frac{1}{x}}`)).toBe(String.raw`\frac{1}{x}`);
  });

  it.each([
    [String.raw`\int^{1}_{0}f(t)\,\mathrm{d}t`, "f(t)", "t"],
    [String.raw`\int_{a}^{b}g(\theta)\operatorname{d}\theta`, "g(\\theta)", String.raw`\theta`],
    [String.raw`\int h(x)dx_1`, "h(x)", "x_1"]
  ])("recognizes common differential typography in %s", (latex, expression, variable) => {
    const slots = parseSemanticStructure(latex)?.slots;
    expect(slots?.find((slot) => slot.id === "body")?.latex).toBe(expression);
    expect(slots?.find((slot) => slot.id === "variable")?.latex).toBe(variable);
  });

  it("does not absorb a trailing expression into the differential variable", () => {
    const slots = parseSemanticStructure(String.raw`\int_0^1 x\,dx+1`)?.slots;
    expect(slots?.find((slot) => slot.id === "variable")?.latex).toBe("");
    expect(slots?.find((slot) => slot.id === "body")?.latex).toBe(String.raw`x\,dx+1`);
  });

  it("reports every supported semantic structure present in an expression", () => {
    expect(structureKindsIn(String.raw`\frac{1}{2}+\sqrt{x}+\int_0^1x\,dx+\sum_{n=1}^{N}n`))
      .toEqual(["fraction", "root", "integral", "sum"]);
  });
});

import { describe, expect, it } from "vitest";
import { normalizeSlotLatex, parseSemanticStructure } from "./math-structure";

describe("parseSemanticStructure", () => {
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
});

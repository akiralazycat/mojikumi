import { describe, expect, it } from "vitest";
import {
  createChemAiPrompt,
  normalizeChemInput,
  parseChemSegments,
  serializeChem,
  toChemHtml,
  toUnicodeChem
} from "./chemistry";

describe("chemical expression conversion", () => {
  it("normalizes common ASCII arrows", () => {
    expect(normalizeChemInput("2H2 + O2 -> 2H2O")).toBe("2H2 + O2 → 2H2O");
    expect(normalizeChemInput("N2 + 3H2 <=> 2NH3")).toBe("N2 + 3H2 ⇌ 2NH3");
  });

  it("keeps coefficients on the baseline and formula counts below it", () => {
    expect(parseChemSegments("2H2O")).toEqual([
      { kind: "text", value: "2H" },
      { kind: "subscript", value: "2" },
      { kind: "text", value: "O" }
    ]);
  });

  it("renders counts and explicit charges as Unicode", () => {
    expect(toUnicodeChem("SO4^2- + 2H^+ → H2SO4")).toBe("SO₄²⁻ + 2H⁺ → H₂SO₄");
  });

  it("serializes to mhchem, Markdown, LaTeX, and safe HTML", () => {
    const equation = "CH3COOH + NaOH -> CH3COONa + H2O";
    expect(serializeChem(equation, "mhchem")).toBe(String.raw`\ce{CH3COOH + NaOH -> CH3COONa + H2O}`);
    expect(serializeChem(equation, "markdown")).toBe(String.raw`$\ce{CH3COOH + NaOH -> CH3COONa + H2O}$`);
    expect(serializeChem(equation, "latex")).toContain(String.raw`_{3}`);
    expect(toChemHtml("H2 < X")).toContain("&lt; X");
  });

  it("builds action-specific AI prompts", () => {
    expect(createChemAiPrompt("H2 + O2 -> H2O", "balance")).toContain("最小の整数比");
    expect(createChemAiPrompt("H2 + O2 -> H2O", "balance")).toContain("H₂ + O₂ → H₂O");
  });
});

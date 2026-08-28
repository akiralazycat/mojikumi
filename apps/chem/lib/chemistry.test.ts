import { describe, expect, it } from "vitest";
import {
  createChemAiPrompt,
  normalizeChemInput,
  parseChemSegments,
  serializeChem,
  splitChemCondition,
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

  it("keeps reaction conditions across every structured destination", () => {
    const equation = "N2 + 3H2 ⇌ 2NH3";
    const options = { condition: "Fe, 450 °C" };
    expect(serializeChem(equation, "plain", options)).toContain("⇌[Fe, 450 °C]");
    expect(serializeChem(equation, "mhchem", options)).toContain("<=>[Fe, 450 °C]");
    expect(serializeChem(equation, "latex", options)).toContain(String.raw`\overset{\mathrm{Fe,\,450\,°C}}`);
    expect(serializeChem(equation, "html", options)).toContain("chem-condition");
  });

  it("separates an inline arrow condition for visual editing", () => {
    expect(splitChemCondition("N2 + 3H2 ⇌[Fe, 450 °C] 2NH3")).toEqual({
      source: "N2 + 3H2 ⇌ 2NH3",
      condition: "Fe, 450 °C"
    });
  });

  it("exports a versioned chemical structure as JSON", () => {
    const result = JSON.parse(serializeChem("2H2 + O2 → 2H2O", "json"));
    expect(result).toMatchObject({ version: 1, kind: "reaction", reaction: { arrow: "→" } });
    expect(result.reaction.reactants).toHaveLength(2);
    expect(result.reaction.reactants[0]).toMatchObject({ formula: "H2", coefficient: 2 });
    expect(result.reaction.products[0]).toMatchObject({ formula: "H2O", coefficient: 2 });
  });

  it("builds action-specific AI prompts", () => {
    expect(createChemAiPrompt("H2 + O2 -> H2O", "balance")).toContain("最小の整数比");
    expect(createChemAiPrompt("H2 + O2 -> H2O", "balance")).toContain("H₂ + O₂ → H₂O");
  });
});

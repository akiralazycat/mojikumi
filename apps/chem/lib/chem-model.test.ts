import { describe, expect, it } from "vitest";
import { analyzeChem, balanceChemReaction, parseMolecularFormula } from "./chem-model";

describe("chemical structure model", () => {
  const balancedFixtures = [
    "2H2 + O2 → 2H2O",
    "2Na + Cl2 → 2NaCl",
    "CaCO3 → CaO + CO2",
    "2KClO3 → 2KCl + 3O2",
    "C6H12O6 + 6O2 → 6CO2 + 6H2O",
    "2Al + 6HCl → 2AlCl3 + 3H2",
    "HCl + NaOH → NaCl + H2O",
    "AgNO3 + NaCl → AgCl + NaNO3",
    "BaCl2 + Na2SO4 → BaSO4 + 2NaCl",
    "N2 + 3H2 ⇌ 2NH3",
    "2SO2 + O2 ⇌ 2SO3",
    "CH3COOH + NaOH → CH3COONa + H2O",
    "2Fe2O3 + 3C → 4Fe + 3CO2",
    "2Mg + CO2 → 2MgO + C",
    "NH4Cl + NaOH → NH3 + NaCl + H2O",
    "Ag^+ + Cl^- → AgCl",
    "H^+ + OH^- → H2O",
    "Zn + CuSO4 → ZnSO4 + Cu",
    "2Na2O2 + 2H2O → 4NaOH + O2",
    "P4 + 5O2 → 2P2O5"
  ];

  it.each(balancedFixtures)("accepts the representative balanced reaction %s", (reaction) => {
    const result = analyzeChem(reaction);
    expect(result.valid).toBe(true);
    expect(result.balanced).toBe(true);
  });

  it.each([
    ["H2O", { H: 2, O: 1 }],
    ["Ca(OH)2", { Ca: 1, O: 2, H: 2 }],
    ["K4[Fe(CN)6]", { K: 4, Fe: 1, C: 6, N: 6 }],
    ["CuSO4·5H2O", { Cu: 1, S: 1, O: 9, H: 10 }]
  ])("parses %s", (formula, expected) => {
    const result = parseMolecularFormula(formula);
    expect(result.diagnostics.filter((item) => item.severity === "error")).toEqual([]);
    expect(result.atoms).toEqual(expected);
  });

  it("reports unknown elements and unmatched groups", () => {
    expect(parseMolecularFormula("Xx2").diagnostics).toContainEqual(expect.objectContaining({ code: "unknown-element" }));
    expect(parseMolecularFormula("Ca(OH2").diagnostics).toContainEqual(expect.objectContaining({ code: "unclosed-group" }));
  });

  it("recognizes balanced atoms, charges, states, and conditions", () => {
    const result = analyzeChem("Ag^+(aq) + Cl^-(aq) → AgCl(s)", { condition: "室温" });
    expect(result.valid).toBe(true);
    expect(result.balanced).toBe(true);
    expect(result.reaction?.condition).toBe("室温");
    expect(result.reaction?.reactants[0]).toMatchObject({ charge: 1, state: "aq", atoms: { Ag: 1 } });
  });

  it("reports element deltas for unbalanced reactions", () => {
    const result = analyzeChem("H2 + O2 → H2O");
    expect(result.balanced).toBe(false);
    expect(result.elementDelta).toEqual({ O: -1 });
  });

  it.each([
    ["H2 + O2 → H2O", "2H2 + O2 → 2H2O", [2, 1, 2]],
    ["Fe + O2 → Fe2O3", "4Fe + 3O2 → 2Fe2O3", [4, 3, 2]],
    ["C2H6 + O2 → CO2 + H2O", "2C2H6 + 7O2 → 4CO2 + 6H2O", [2, 7, 4, 6]],
    ["MnO4^- + Fe^2+ + H^+ → Mn^2+ + Fe^3+ + H2O", "MnO4^- + 5Fe^2+ + 8H^+ → Mn^2+ + 5Fe^3+ + 4H2O", [1, 5, 8, 1, 5, 4]]
  ])("balances %s", (input, source, coefficients) => {
    expect(balanceChemReaction(input)).toEqual({ source, coefficients, condition: "" });
  });

  it("preserves reaction conditions while balancing", () => {
    expect(balanceChemReaction("N2 + H2 ⇌ NH3", { condition: "Fe, 450 °C" })?.source)
      .toBe("N2 + 3H2 ⇌ 2NH3");
    expect(balanceChemReaction("N2 + H2 ⇌ NH3", { condition: "Fe, 450 °C" })?.condition)
      .toBe("Fe, 450 °C");
  });
});

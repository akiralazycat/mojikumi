import { describe, expect, it } from "vitest";
import { analyzeChem } from "./chem-model";
import { buildElementBalance, getSpecies, speciesRefKey } from "./reaction-awareness";

function reactionOf(source: string) {
  const analysis = analyzeChem(source);
  if (analysis.kind !== "reaction" || !analysis.reaction) throw new Error("reaction fixture required");
  return analysis.reaction;
}

describe("reaction awareness", () => {
  it("builds a weighted element ledger and puts mismatches first", () => {
    const rows = buildElementBalance(reactionOf("H2 + O2 → H2O"));
    expect(rows).toEqual([
      expect.objectContaining({ element: "O", reactantCount: 2, productCount: 1, delta: -1, balanced: false }),
      expect.objectContaining({ element: "H", reactantCount: 2, productCount: 2, delta: 0, balanced: true })
    ]);
  });

  it("links an element to only the species that contain it", () => {
    const reaction = reactionOf("H2 + O2 → H2O");
    const oxygen = buildElementBalance(reaction).find((row) => row.element === "O");
    expect(oxygen?.species.map(speciesRefKey)).toEqual(["reactant:1", "product:0"]);
    expect(getSpecies(reaction, { side: "reactant", index: 1 })?.formula).toBe("O2");
  });

  it("marks every row balanced for a balanced reaction", () => {
    const rows = buildElementBalance(reactionOf("2H2 + O2 → 2H2O"));
    expect(rows.every((row) => row.balanced)).toBe(true);
  });
});

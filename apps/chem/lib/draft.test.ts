import { describe, expect, it } from "vitest";
import { createChemDraft, parseChemDraft } from "./draft";

describe("Chem draft", () => {
  it("round-trips a valid local draft", () => {
    const draft = createChemDraft("2H2 + O2 -> 2H2O", "点火", new Date("2026-08-27T00:00:00.000Z"));
    expect(parseChemDraft(JSON.stringify(draft))).toEqual(draft);
  });

  it("migrates version 1 drafts", () => {
    expect(parseChemDraft(JSON.stringify({ version: 1, source: "H2O", updatedAt: "2026-08-27T00:00:00.000Z" })))
      .toEqual({ version: 2, source: "H2O", condition: "", updatedAt: "2026-08-27T00:00:00.000Z" });
  });

  it("rejects malformed and oversized drafts", () => {
    expect(parseChemDraft("not json")).toBeNull();
    expect(parseChemDraft(JSON.stringify({ version: 1, source: "x".repeat(100_001), updatedAt: new Date().toISOString() }))).toBeNull();
    expect(parseChemDraft(JSON.stringify({ version: 2, source: "H2O", condition: 42, updatedAt: new Date().toISOString() }))).toBeNull();
  });
});

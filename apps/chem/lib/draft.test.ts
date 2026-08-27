import { describe, expect, it } from "vitest";
import { createChemDraft, parseChemDraft } from "./draft";

describe("Chem draft", () => {
  it("round-trips a valid local draft", () => {
    const draft = createChemDraft("2H2 + O2 -> 2H2O", new Date("2026-08-27T00:00:00.000Z"));
    expect(parseChemDraft(JSON.stringify(draft))).toEqual(draft);
  });

  it("rejects malformed and oversized drafts", () => {
    expect(parseChemDraft("not json")).toBeNull();
    expect(parseChemDraft(JSON.stringify({ version: 1, source: "x".repeat(100_001), updatedAt: new Date().toISOString() }))).toBeNull();
  });
});

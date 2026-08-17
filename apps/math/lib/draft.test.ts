import { describe, expect, it, vi } from "vitest";
import {
  createDraft,
  draftStorageKey,
  loadDraft,
  parseDraft,
  removeDraft,
  saveDraft
} from "./draft";

describe("local math draft", () => {
  const now = new Date("2026-08-17T02:03:04.000Z");

  it("creates a small versioned record without formula analytics", () => {
    expect(createDraft(String.raw`x^2+\placeholder{}{}`, now)).toEqual({
      version: 1,
      latex: String.raw`x^2+\placeholder{}{}`,
      updatedAt: now.toISOString()
    });
  });

  it("rejects malformed and unknown draft data", () => {
    expect(parseDraft("not json")).toBeNull();
    expect(parseDraft('{"version":2,"latex":"x","updatedAt":"today"}')).toBeNull();
  });

  it("round-trips through the provided storage boundary", () => {
    const values = new Map<string, string>();
    const storage = {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => values.set(key, value),
      removeItem: (key: string) => values.delete(key)
    };

    saveDraft(storage, "x^2+1", now);
    expect(loadDraft(storage)).toEqual({
      version: 1,
      latex: "x^2+1",
      updatedAt: now.toISOString()
    });

    removeDraft(storage);
    expect(values.has(draftStorageKey)).toBe(false);
  });

  it("reads only the namespaced key", () => {
    const getItem = vi.fn(() => null);
    loadDraft({ getItem });
    expect(getItem).toHaveBeenCalledWith("mojikumi.math.draft.v1");
  });
});

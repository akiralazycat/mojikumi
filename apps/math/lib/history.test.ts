import { describe, expect, it } from "vitest";
import {
  historyStorageKey,
  loadHistory,
  maxHistoryEntries,
  rememberHistory,
  removeHistoryEntry
} from "./history";

function createStorage() {
  const values = new Map<string, string>();
  return {
    getItem(key: string) { return values.get(key) ?? null; },
    setItem(key: string, value: string) { values.set(key, value); },
    removeItem(key: string) { values.delete(key); }
  };
}

describe("math history", () => {
  it("stores newest-first and deduplicates identical expressions", () => {
    const storage = createStorage();
    rememberHistory(storage, "x+1", new Date("2026-01-01T00:00:00Z"));
    rememberHistory(storage, "y+1", new Date("2026-01-02T00:00:00Z"));
    rememberHistory(storage, "x+1", new Date("2026-01-03T00:00:00Z"));
    expect(loadHistory(storage).map((entry) => entry.latex)).toEqual(["x+1", "y+1"]);
  });

  it("keeps only the configured maximum", () => {
    const storage = createStorage();
    for (let index = 0; index < maxHistoryEntries + 5; index += 1) {
      rememberHistory(storage, `x+${index}`, new Date(2026, 0, index + 1));
    }
    expect(loadHistory(storage)).toHaveLength(maxHistoryEntries);
    expect(loadHistory(storage)[0]?.latex).toBe(`x+${maxHistoryEntries + 4}`);
  });

  it("removes individual entries and ignores corrupt storage", () => {
    const storage = createStorage();
    rememberHistory(storage, "x", new Date("2026-01-01T00:00:00Z"));
    rememberHistory(storage, "y", new Date("2026-01-02T00:00:00Z"));
    removeHistoryEntry(storage, "x");
    expect(loadHistory(storage).map((entry) => entry.latex)).toEqual(["y"]);
    storage.setItem(historyStorageKey, "not-json");
    expect(loadHistory(storage)).toEqual([]);
  });
});

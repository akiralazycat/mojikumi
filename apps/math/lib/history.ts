export const historyStorageKey = "mojikumi.math.history.v1";
export const maxHistoryEntries = 12;
const maxExpressionLength = 100_000;

export type MathHistoryEntry = {
  latex: string;
  updatedAt: string;
};

type HistoryStorage = Pick<Storage, "getItem" | "setItem" | "removeItem">;

export function parseHistory(value: string | null): MathHistoryEntry[] {
  if (!value) return [];
  try {
    const parsed: unknown = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];
    const entries: MathHistoryEntry[] = [];
    for (const item of parsed) {
      if (
        typeof item !== "object" || item === null ||
        !("latex" in item) || typeof item.latex !== "string" ||
        !item.latex.trim() || item.latex.length > maxExpressionLength ||
        !("updatedAt" in item) || typeof item.updatedAt !== "string" ||
        !Number.isFinite(Date.parse(item.updatedAt))
      ) continue;
      if (entries.some((entry) => entry.latex === item.latex)) continue;
      entries.push({ latex: item.latex, updatedAt: item.updatedAt });
      if (entries.length >= maxHistoryEntries) break;
    }
    return entries;
  } catch {
    return [];
  }
}

export function loadHistory(storage: Pick<HistoryStorage, "getItem">) {
  return parseHistory(storage.getItem(historyStorageKey));
}

export function rememberHistory(
  storage: Pick<HistoryStorage, "getItem" | "setItem">,
  latex: string,
  now = new Date()
) {
  const normalized = latex.trim();
  if (!normalized || normalized.length > maxExpressionLength) return loadHistory(storage);
  const next = [
    { latex: normalized, updatedAt: now.toISOString() },
    ...loadHistory(storage).filter((entry) => entry.latex !== normalized)
  ].slice(0, maxHistoryEntries);
  storage.setItem(historyStorageKey, JSON.stringify(next));
  return next;
}

export function removeHistoryEntry(
  storage: Pick<HistoryStorage, "getItem" | "setItem">,
  latex: string
) {
  const next = loadHistory(storage).filter((entry) => entry.latex !== latex);
  storage.setItem(historyStorageKey, JSON.stringify(next));
  return next;
}

export function clearHistory(storage: Pick<HistoryStorage, "removeItem">) {
  storage.removeItem(historyStorageKey);
}

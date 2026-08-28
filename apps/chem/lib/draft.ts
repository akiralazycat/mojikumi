export const chemDraftStorageKey = "mojikumi.chem.draft.v1";
const maxDraftLength = 100_000;
const maxConditionLength = 10_000;

export type ChemDraft = {
  version: 2;
  condition: string;
  source: string;
  updatedAt: string;
};

export function createChemDraft(source: string, condition = "", now = new Date()): ChemDraft {
  return { version: 2, source, condition, updatedAt: now.toISOString() };
}

export function parseChemDraft(value: string | null): ChemDraft | null {
  if (!value) return null;
  try {
    const parsed: unknown = JSON.parse(value);
    if (
      typeof parsed !== "object" || parsed === null ||
      !("version" in parsed) || (parsed.version !== 1 && parsed.version !== 2) ||
      !("source" in parsed) || typeof parsed.source !== "string" || parsed.source.length > maxDraftLength ||
      (parsed.version === 2 && (!("condition" in parsed) || typeof parsed.condition !== "string" || parsed.condition.length > maxConditionLength)) ||
      !("updatedAt" in parsed) || typeof parsed.updatedAt !== "string" || !Number.isFinite(Date.parse(parsed.updatedAt))
    ) return null;
    return {
      version: 2,
      source: parsed.source,
      condition: parsed.version === 2 && "condition" in parsed && typeof parsed.condition === "string" ? parsed.condition : "",
      updatedAt: parsed.updatedAt
    };
  } catch {
    return null;
  }
}

export function loadChemDraft(storage: Pick<Storage, "getItem">) {
  return parseChemDraft(storage.getItem(chemDraftStorageKey));
}

export function saveChemDraft(storage: Pick<Storage, "setItem">, source: string, condition = "", now = new Date()) {
  const draft = createChemDraft(source, condition, now);
  storage.setItem(chemDraftStorageKey, JSON.stringify(draft));
  return draft;
}

export function removeChemDraft(storage: Pick<Storage, "removeItem">) {
  storage.removeItem(chemDraftStorageKey);
}

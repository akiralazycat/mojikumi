export const chemDraftStorageKey = "mojikumi.chem.draft.v1";
const maxDraftLength = 100_000;

export type ChemDraft = {
  version: 1;
  source: string;
  updatedAt: string;
};

export function createChemDraft(source: string, now = new Date()): ChemDraft {
  return { version: 1, source, updatedAt: now.toISOString() };
}

export function parseChemDraft(value: string | null): ChemDraft | null {
  if (!value) return null;
  try {
    const parsed: unknown = JSON.parse(value);
    if (
      typeof parsed !== "object" || parsed === null ||
      !("version" in parsed) || parsed.version !== 1 ||
      !("source" in parsed) || typeof parsed.source !== "string" || parsed.source.length > maxDraftLength ||
      !("updatedAt" in parsed) || typeof parsed.updatedAt !== "string" || !Number.isFinite(Date.parse(parsed.updatedAt))
    ) return null;
    return { version: 1, source: parsed.source, updatedAt: parsed.updatedAt };
  } catch {
    return null;
  }
}

export function loadChemDraft(storage: Pick<Storage, "getItem">) {
  return parseChemDraft(storage.getItem(chemDraftStorageKey));
}

export function saveChemDraft(storage: Pick<Storage, "setItem">, source: string, now = new Date()) {
  const draft = createChemDraft(source, now);
  storage.setItem(chemDraftStorageKey, JSON.stringify(draft));
  return draft;
}

export function removeChemDraft(storage: Pick<Storage, "removeItem">) {
  storage.removeItem(chemDraftStorageKey);
}

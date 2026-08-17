export const draftStorageKey = "mojikumi.math.draft.v1";
const maxDraftLength = 100_000;

export type MathDraft = {
  version: 1;
  latex: string;
  updatedAt: string;
};

export function createDraft(latex: string, now = new Date()): MathDraft {
  return {
    version: 1,
    latex,
    updatedAt: now.toISOString()
  };
}

export function parseDraft(value: string | null): MathDraft | null {
  if (!value) return null;

  try {
    const parsed: unknown = JSON.parse(value);
    if (
      typeof parsed !== "object" ||
      parsed === null ||
      !("version" in parsed) ||
      parsed.version !== 1 ||
      !("latex" in parsed) ||
      typeof parsed.latex !== "string" ||
      parsed.latex.length > maxDraftLength ||
      !("updatedAt" in parsed) ||
      typeof parsed.updatedAt !== "string" ||
      !Number.isFinite(Date.parse(parsed.updatedAt))
    ) {
      return null;
    }

    return {
      version: 1,
      latex: parsed.latex,
      updatedAt: parsed.updatedAt
    };
  } catch {
    return null;
  }
}

export function loadDraft(storage: Pick<Storage, "getItem">) {
  return parseDraft(storage.getItem(draftStorageKey));
}

export function saveDraft(
  storage: Pick<Storage, "setItem">,
  latex: string,
  now = new Date()
) {
  const draft = createDraft(latex, now);
  storage.setItem(draftStorageKey, JSON.stringify(draft));
  return draft;
}

export function removeDraft(storage: Pick<Storage, "removeItem">) {
  storage.removeItem(draftStorageKey);
}

export function normalizeChemInput(value: string) {
  return value
    .replaceAll("<=>", "⇌")
    .replaceAll("<->", "↔")
    .replaceAll("->", "→")
    .replaceAll("<-", "←")
    .replaceAll("=>", "→")
    .replaceAll("−>", "→")
    .replace(/\s+/g, " ")
    .trim();
}

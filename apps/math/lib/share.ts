export const maxSharedExpressionLength = 20_000;

export type SharedExpression = {
  version: 1;
  latex: string;
};

export function createShareFragment(latex: string) {
  const normalized = latex.trim();
  if (!normalized) throw new Error("共有する数式がありません。");
  if (normalized.length > maxSharedExpressionLength) throw new Error("共有リンクにするには数式が長すぎます。");
  const params = new URLSearchParams({ v: "1", expr: normalized });
  return `#${params.toString()}`;
}

export function readSharedExpression(hash: string): SharedExpression | null {
  const value = hash.startsWith("#") ? hash.slice(1) : hash;
  if (!value) return null;
  try {
    const params = new URLSearchParams(value);
    const version = params.get("v");
    const latex = params.get("expr");
    if ((version !== null && version !== "1") || !latex) return null;
    if (!latex.trim() || latex.length > maxSharedExpressionLength) return null;
    return { version: 1, latex };
  } catch {
    return null;
  }
}

export function createShareUrl(latex: string, href: string) {
  const url = new URL(href);
  url.hash = createShareFragment(latex).slice(1);
  return url.toString();
}

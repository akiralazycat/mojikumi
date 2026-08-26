const superscriptDigits: Record<string, string> = {
  "0": "⁰",
  "1": "¹",
  "2": "²",
  "3": "³",
  "4": "⁴",
  "5": "⁵",
  "6": "⁶",
  "7": "⁷",
  "8": "⁸",
  "9": "⁹"
};

const subscriptDigits: Record<string, string> = {
  "0": "₀",
  "1": "₁",
  "2": "₂",
  "3": "₃",
  "4": "₄",
  "5": "₅",
  "6": "₆",
  "7": "₇",
  "8": "₈",
  "9": "₉"
};

const namedSymbols: Record<string, string> = {
  alpha: "α",
  beta: "β",
  gamma: "γ",
  delta: "δ",
  theta: "θ",
  lambda: "λ",
  mu: "μ",
  sigma: "σ",
  phi: "φ",
  omega: "ω",
  pi: "π"
};

function mapDigits(value: string, table: Record<string, string>) {
  return Array.from(value, (digit) => table[digit] ?? digit).join("");
}

function replaceNamedToken(value: string, name: string, symbol: string) {
  return value.replace(
    new RegExp(`(^|[^A-Za-z0-9])${name}(?![A-Za-z0-9])`, "g"),
    (_, prefix: string) => `${prefix}${symbol}`
  );
}

/**
 * Derive a display-oriented Unicode form from Strict β.
 *
 * This is intentionally conservative: it changes only tokens whose scope is
 * already explicit in Strict β. Parentheses, slash fractions, commas and
 * complex script expressions are never inferred or removed.
 */
export function toUnicodeReadable(strictText: string) {
  let readable = strictText.trim().replace(/\s+/g, " ");

  readable = readable
    .replace(/<=>/g, "⇔")
    .replace(/=>/g, "⇒")
    .replace(/->/g, "→")
    .replace(/<=/g, "≤")
    .replace(/>=/g, "≥")
    .replace(/!=/g, "≠")
    .replace(/\+-/g, "±")
    .replace(/\bsqrt(?=\s*\()/g, "√")
    .replace(/\bsum(?=\s*_)/g, "∑")
    .replace(/\bprod(?=\s*_)/g, "∏")
    .replace(/\bint(?=\s*_)/g, "∫")
    .replace(/\^([0-9]+)/g, (_, digits: string) => mapDigits(digits, superscriptDigits))
    .replace(/_([0-9]+)/g, (_, digits: string) => mapDigits(digits, subscriptDigits));

  readable = replaceNamedToken(readable, "infinity", "∞");
  readable = replaceNamedToken(readable, "oo", "∞");
  for (const [name, symbol] of Object.entries(namedSymbols)) {
    readable = replaceNamedToken(readable, name, symbol);
  }

  return readable
    .replace(/\*/g, "×")
    .replace(/-/g, "−");
}

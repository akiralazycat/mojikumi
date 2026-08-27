export type ChemSegment = {
  kind: "text" | "subscript" | "superscript" | "arrow";
  value: string;
};

export type ChemOutputKind = "plain" | "mhchem" | "latex" | "markdown" | "html" | "ai";
export type ChemAiAction = "explain" | "balance" | "name" | "analyze";

const subscriptCharacters: Record<string, string> = {
  "0": "₀", "1": "₁", "2": "₂", "3": "₃", "4": "₄",
  "5": "₅", "6": "₆", "7": "₇", "8": "₈", "9": "₉"
};

const superscriptCharacters: Record<string, string> = {
  "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴",
  "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹",
  "+": "⁺", "-": "⁻", "−": "⁻"
};

const arrowToMhchem: Record<string, string> = {
  "→": "->",
  "←": "<-",
  "⇌": "<=>",
  "↔": "<->"
};

const arrowToLatex: Record<string, string> = {
  "→": String.raw`\rightarrow`,
  "←": String.raw`\leftarrow`,
  "⇌": String.raw`\rightleftharpoons`,
  "↔": String.raw`\leftrightarrow`
};

const aiInstructions: Record<ChemAiAction, string> = {
  explain: "次の化学式または反応式について、物質と反応の意味を順を追って説明してください。",
  balance: "次の化学反応式を係数が最小の整数比になるように整え、手順も示してください。",
  name: "次の化学式に含まれる物質の名称を、日本語名と英語名で示してください。",
  analyze: "次の化学反応式を分析し、反応の種類、酸化還元、条件、注意点を説明してください。"
};

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

function pushSegment(segments: ChemSegment[], kind: ChemSegment["kind"], value: string) {
  if (!value) return;
  const previous = segments.at(-1);
  if (previous?.kind === kind && kind !== "arrow") {
    previous.value += value;
  } else {
    segments.push({ kind, value });
  }
}

export function parseChemSegments(rawValue: string): ChemSegment[] {
  const value = normalizeChemInput(rawValue);
  const segments: ChemSegment[] = [];

  for (let index = 0; index < value.length;) {
    const character = value[index]!;

    if (character in arrowToMhchem) {
      pushSegment(segments, "arrow", character);
      index += 1;
      continue;
    }

    if (character === "^") {
      let end = index + 1;
      let content = "";
      if (value[end] === "{") {
        const close = value.indexOf("}", end + 1);
        if (close !== -1) {
          content = value.slice(end + 1, close);
          end = close + 1;
        }
      }
      if (!content) {
        while (end < value.length && /[0-9+\-−]/.test(value[end]!)) {
          content += value[end]!;
          end += 1;
        }
      }
      if (content) {
        pushSegment(segments, "superscript", content);
        index = end;
        continue;
      }
    }

    if (/\d/.test(character)) {
      let end = index + 1;
      while (end < value.length && /\d/.test(value[end]!)) end += 1;
      const digits = value.slice(index, end);
      const previousCharacter = value[index - 1] ?? "";
      const isFormulaCount = /[A-Za-z)\]}]/.test(previousCharacter);
      pushSegment(segments, isFormulaCount ? "subscript" : "text", digits);
      index = end;
      continue;
    }

    pushSegment(segments, "text", character);
    index += 1;
  }

  return segments;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function escapeLatex(value: string) {
  return value
    .replaceAll("\\", String.raw`\backslash `)
    .replaceAll("{", String.raw`\{`)
    .replaceAll("}", String.raw`\}`)
    .replaceAll("_", String.raw`\_`)
    .replaceAll("%", String.raw`\%`)
    .replaceAll("#", String.raw`\#`)
    .replaceAll("&", String.raw`\&`)
    .replaceAll(" ", String.raw`\,`);
}

export function toUnicodeChem(value: string) {
  return parseChemSegments(value).map((segment) => {
    if (segment.kind === "subscript") {
      return [...segment.value].map((character) => subscriptCharacters[character] ?? character).join("");
    }
    if (segment.kind === "superscript") {
      return [...segment.value].map((character) => superscriptCharacters[character] ?? character).join("");
    }
    return segment.value;
  }).join("");
}

export function toMhchem(value: string) {
  const normalized = normalizeChemInput(value);
  const source = [...normalized].map((character) => arrowToMhchem[character] ?? character).join("");
  return String.raw`\ce{${source}}`;
}

export function toChemLatex(value: string) {
  return parseChemSegments(value).map((segment) => {
    switch (segment.kind) {
      case "subscript":
        return `_{${escapeLatex(segment.value)}}`;
      case "superscript":
        return `^{${escapeLatex(segment.value)}}`;
      case "arrow":
        return String.raw`\;${arrowToLatex[segment.value]}\;`;
      case "text":
        return String.raw`\mathrm{${escapeLatex(segment.value)}}`;
    }
  }).join("");
}

export function toChemHtml(value: string) {
  const contents = parseChemSegments(value).map((segment) => {
    const escaped = escapeHtml(segment.value);
    if (segment.kind === "subscript") return `<sub>${escaped}</sub>`;
    if (segment.kind === "superscript") return `<sup>${escaped}</sup>`;
    if (segment.kind === "arrow") return `<span class="chem-arrow">${escaped}</span>`;
    return escaped;
  }).join("");
  return `<span class="chemical-equation" role="math">${contents}</span>`;
}

export function createChemAiPrompt(value: string, action: ChemAiAction = "explain") {
  return `${aiInstructions[action]}\n\n${toUnicodeChem(value)}`;
}

export function serializeChem(
  value: string,
  kind: ChemOutputKind,
  options: { aiAction?: ChemAiAction } = {}
) {
  if (!normalizeChemInput(value)) return "";
  switch (kind) {
    case "plain":
      return toUnicodeChem(value);
    case "mhchem":
      return toMhchem(value);
    case "latex":
      return toChemLatex(value);
    case "markdown":
      return `$${toMhchem(value)}$`;
    case "html":
      return toChemHtml(value);
    case "ai":
      return createChemAiPrompt(value, options.aiAction);
  }
}

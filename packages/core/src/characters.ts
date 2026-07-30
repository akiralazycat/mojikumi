import type { MojikumiClass } from "./types.js";

export const CHARACTER_CLASSES = {
  opening: [..."（［｛〈《「『【〔〖〘〚"],
  closing: [..."）］｝〉》」』】〕〗〙〛"],
  comma: [..."、，"],
  period: [..."。．"],
  middle: [..."・：；"],
  question: [..."？！⁉⁈"]
} as const satisfies Record<
  Extract<
    MojikumiClass,
    "opening" | "closing" | "comma" | "period" | "middle" | "question"
  >,
  readonly string[]
>;

const lookup = new Map<string, MojikumiClass>(
  Object.entries(CHARACTER_CLASSES).flatMap(([className, characters]) =>
    characters.map(
      (character) => [character, className as MojikumiClass] as const
    )
  )
);

const IDEOGRAPH_PATTERN =
  /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}々〆ヵヶ]/u;
const LATIN_PATTERN = /\p{Script=Latin}/u;
const NUMERIC_PATTERN = /\p{Number}/u;
const SPACE_PATTERN = /^\s+$/u;

export function classifyGrapheme(value: string): MojikumiClass {
  const punctuationClass = lookup.get(value);
  if (punctuationClass) return punctuationClass;
  if (SPACE_PATTERN.test(value)) return "space";
  if (IDEOGRAPH_PATTERN.test(value)) return "ideograph";
  if (LATIN_PATTERN.test(value)) return "latin";
  if (NUMERIC_PATTERN.test(value)) return "numeric";
  return "other";
}

export function isPunctuationClass(className: MojikumiClass): boolean {
  return (
    className === "opening" ||
    className === "closing" ||
    className === "comma" ||
    className === "period" ||
    className === "middle" ||
    className === "question"
  );
}

export function isJapaneseClass(className: MojikumiClass): boolean {
  return className === "ideograph" || isPunctuationClass(className);
}

import type { MojikumiClass } from "./types.js";

/*
 * Fullwidth punctuation only. Every character here carries half an em of blank
 * on one side, which is the space the pair rules take back when two of them
 * meet — measured on Chromium 148, `text-spacing-trim: normal` trims each of
 * them to 0.5em in exactly the pairs this table describes.
 *
 * The halfwidth forms `｡｢｣､･` are deliberately absent. They render at 0.5em
 * already, with no blank to remove, and no browser trims them; taking another
 * half em off would close the glyph up against its neighbour.
 */
export const CHARACTER_CLASSES = {
  opening: [..."（［｛〈《「『【〔〖〘〚〝"],
  closing: [..."）］｝〉》」』】〕〗〙〛〟"],
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

/*
 * Script_Extensions rather than Script. The prolonged sound mark `ー` is
 * Script=Common and was landing in `other`, which cost every katakana word
 * ending in it the space before a following letter or digit — `コーヒーAPI`,
 * `メニュー100円`. Chromium puts 0.125em there, so the fallback has to agree.
 */
const IDEOGRAPH_PATTERN =
  /[\p{scx=Han}\p{scx=Hiragana}\p{scx=Katakana}々〆ヵヶ]/u;
const LATIN_PATTERN = /\p{Script=Latin}/u;
const NUMERIC_PATTERN = /\p{Number}/u;
const SPACE_PATTERN = /^\s+$/u;

/*
 * Fullwidth forms of ASCII and of the currency signs. `Ａ` and `１` are Latin
 * and Number to Unicode, but nothing puts a space between them and Japanese:
 * CSS Text 4 leaves fullwidth forms out of the alphanumeric side, and Chromium
 * measurably adds nothing around them. JavaScript has no East_Asian_Width
 * escape, so the two blocks are named directly.
 */
const FULLWIDTH_FORM_PATTERN = /[\uFF01-\uFF60\uFFE0-\uFFE6]/u;

/*
 * Anything else the Unicode tables call punctuation or a symbol. Reaching this
 * means the character is not in the table above, so nothing is known about
 * where its blank sits — `〜`, `…`, `‥`, `―` have none to give, and neither do
 * the halfwidth forms. They are left alone, which is also what keeps
 * Script_Extensions from reading `｢` as a katakana letter.
 */
const PUNCTUATION_PATTERN = /[\p{P}\p{S}]/u;

export function classifyGrapheme(value: string): MojikumiClass {
  const punctuationClass = lookup.get(value);
  if (punctuationClass) return punctuationClass;
  if (SPACE_PATTERN.test(value)) return "space";
  if (FULLWIDTH_FORM_PATTERN.test(value)) return "other";
  if (PUNCTUATION_PATTERN.test(value)) return "other";
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

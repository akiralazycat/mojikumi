import type { MojikumiPreset } from "@mojikumi/core";

/*
 * Three presets, on one axis: how far towards print composition to go.
 *
 * `article` is what Mojikumi is for. Japanese fills a measure evenly, so a
 * justified line costs it nothing — measured across widths from 12em to 30em,
 * ordinary Japanese stretched by 2% at worst — and justification is what makes
 * trimming a line-final comma visible at all. `book` adds the paragraph indent
 * and the hanging punctuation of a printed page.
 *
 * `minimal` is the compromise, and named for it. It keeps the punctuation, the
 * line starts and the space between Japanese and Latin, and gives up the line
 * ends, because those need justification and justification needs the DOM
 * fallback until browsers ship `text-spacing-trim: trim-both`. It is the
 * default for that reason alone: a page that says nothing should not be signed
 * up for the fallback. When the browsers catch up, `article` becomes free and
 * should take the default with it.
 */
export const PRESETS = {
  minimal: {
    punctuationClusters: true,
    lineStartTrim: true,
    lineEndTrim: false,
    autospace: true,
    justify: false,
    indent: false,
    hanging: false,
    headingBreak: false
  },
  article: {
    punctuationClusters: true,
    lineStartTrim: true,
    lineEndTrim: true,
    autospace: true,
    justify: true,
    indent: false,
    hanging: false,
    headingBreak: false
  },
  book: {
    punctuationClusters: true,
    lineStartTrim: true,
    lineEndTrim: true,
    autospace: true,
    justify: true,
    indent: "1em",
    hanging: true,
    headingBreak: false
  }
} as const satisfies Record<string, MojikumiPreset>;

export type PresetName = keyof typeof PRESETS;

/*
 * The names the first release shipped with. `web` and `editorial` were the two
 * halves of what `minimal` now is — `editorial` differed only by turning off the
 * space between Japanese and Latin, which nothing recorded a reason for, and by
 * a heading treatment that has always been reachable on its own as `mjk-heading`.
 * `native` said "standard CSS only", which is what `precision: "native"` says,
 * so it resolves to a preset plus that precision rather than a preset of its own.
 */
export const PRESET_ALIASES = {
  web: "minimal",
  editorial: "minimal",
  native: "minimal"
} as const satisfies Record<string, PresetName>;

export type PresetAlias = keyof typeof PRESET_ALIASES;

/** `native` also pins the precision, so that the old name keeps its behaviour. */
export const PRECISION_ALIASES = {
  native: "native"
} as const;

export function isPresetName(value: string): value is PresetName {
  return Object.hasOwn(PRESETS, value);
}

export function isPresetAlias(value: string): value is PresetAlias {
  return Object.hasOwn(PRESET_ALIASES, value);
}

/** Accepts a retired name and answers with the one that replaced it. */
export function resolvePresetName(value: string): PresetName | undefined {
  if (isPresetName(value)) return value;
  if (isPresetAlias(value)) return PRESET_ALIASES[value];
  return undefined;
}

export function getPreset(name: PresetName = "minimal"): MojikumiPreset {
  return { ...PRESETS[name] };
}

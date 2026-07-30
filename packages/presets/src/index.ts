import type { MojikumiPreset } from "@mojikumi/core";

export const PRESETS = {
  web: {
    punctuationClusters: true,
    lineStartTrim: true,
    lineEndTrim: "when-needed",
    autospace: true,
    paragraphIndent: false,
    hanging: false,
    headingPhraseBreak: false,
    fallback: true
  },
  book: {
    punctuationClusters: true,
    lineStartTrim: true,
    lineEndTrim: true,
    autospace: true,
    paragraphIndent: "1em",
    hanging: "allow-end",
    headingPhraseBreak: false,
    fallback: true
  },
  editorial: {
    punctuationClusters: true,
    lineStartTrim: true,
    lineEndTrim: true,
    autospace: false,
    paragraphIndent: false,
    hanging: false,
    headingPhraseBreak: true,
    fallback: true
  },
  minimal: {
    punctuationClusters: true,
    lineStartTrim: false,
    lineEndTrim: false,
    autospace: false,
    paragraphIndent: false,
    hanging: false,
    headingPhraseBreak: false,
    fallback: true
  },
  native: {
    punctuationClusters: true,
    lineStartTrim: true,
    lineEndTrim: true,
    autospace: true,
    paragraphIndent: false,
    hanging: false,
    headingPhraseBreak: false,
    fallback: false
  }
} as const satisfies Record<string, MojikumiPreset>;

export type PresetName = keyof typeof PRESETS;

export function isPresetName(value: string): value is PresetName {
  return Object.hasOwn(PRESETS, value);
}

export function getPreset(name: PresetName = "web"): MojikumiPreset {
  return { ...PRESETS[name] };
}

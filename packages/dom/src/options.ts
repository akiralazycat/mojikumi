import type { MojikumiPreset } from "@mojikumi/core";
import { getPreset, resolvePresetName } from "@mojikumi/presets";
import type { MojikumiOptions, ResolvedMojikumiOptions } from "./types.js";

export const DEFAULT_EXCLUDE = [
  "script",
  "style",
  "code",
  "pre",
  "kbd",
  "samp",
  "textarea",
  "input",
  "select",
  "option",
  "[contenteditable]:not([contenteditable='false'])",
  "svg",
  "math",
  "[data-no-mojikumi]"
] as const;

/*
 * Modifiers are folded into the preset rather than carried beside it, so that
 * everything downstream keeps asking the preset and cannot forget to consult
 * the override. It matters most for `justify`: turning it off has to turn off
 * line-end trimming too, which is only visible in a justified line.
 */
function applyModifiers(
  preset: MojikumiPreset,
  options: MojikumiOptions
): MojikumiPreset {
  if (options.justify !== undefined) preset.justify = options.justify;
  if (options.hanging !== undefined) preset.hanging = options.hanging;
  if (options.headingBreak !== undefined) {
    preset.headingBreak = options.headingBreak;
  }
  if (options.indent !== undefined) {
    preset.indent =
      options.indent === true ? preset.indent || "1em" : options.indent;
  }
  return preset;
}

export function resolveOptions(
  options: MojikumiOptions = {}
): ResolvedMojikumiOptions {
  const presetName = resolvePresetName(options.preset ?? "") ?? "minimal";
  const observe = options.observe ?? true;

  return {
    presetName,
    preset: applyModifiers(getPreset(presetName), options),
    precision: options.precision ?? "auto",
    observeResize: options.observeResize ?? observe,
    observeMutations: options.observeMutations ?? observe,
    debug: options.debug ?? false,
    exclude: [...DEFAULT_EXCLUDE, ...(options.exclude ?? [])]
  };
}

import { getPreset } from "@mojikumi/presets";
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

export function resolveOptions(
  options: MojikumiOptions = {}
): ResolvedMojikumiOptions {
  const presetName = options.preset ?? "web";
  const observe = options.observe ?? true;

  return {
    presetName,
    preset: getPreset(presetName),
    precision: options.precision ?? "auto",
    observeResize: options.observeResize ?? observe,
    observeMutations: options.observeMutations ?? observe,
    debug: options.debug ?? false,
    exclude: [...DEFAULT_EXCLUDE, ...(options.exclude ?? [])]
  };
}

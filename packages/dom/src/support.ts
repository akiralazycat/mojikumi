import type { NativeFeatureSupport } from "./types.js";

function supports(view: Window | null, property: string, value: string): boolean {
  const css = (view as (Window & { CSS?: typeof CSS }) | null)?.CSS;
  return typeof css?.supports === "function" && css.supports(property, value);
}

export function detectNativeSupport(
  view: Window | null =
    typeof window === "undefined" ? null : window
): NativeFeatureSupport {
  return {
    textSpacingTrim: supports(view, "text-spacing-trim", "normal"),
    textAutospace: supports(view, "text-autospace", "normal"),
    hangingPunctuation: supports(
      view,
      "hanging-punctuation",
      "first allow-end"
    ),
    autoPhrase: supports(view, "word-break", "auto-phrase")
  };
}

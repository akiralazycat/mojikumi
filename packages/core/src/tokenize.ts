import { classifyGrapheme } from "./characters.js";
import { segmentGraphemes } from "./segment.js";
import type { MojikumiToken } from "./types.js";

export function tokenize(input: string, locale = "ja"): MojikumiToken[] {
  return segmentGraphemes(input, locale).map(({ value, offset }, index) => ({
    value,
    class: classifyGrapheme(value),
    index,
    offset
  }));
}

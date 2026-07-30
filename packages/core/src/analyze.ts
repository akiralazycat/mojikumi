import { computeAutospaceBoundaries } from "./autospace.js";
import { computePairAdjustments } from "./rules.js";
import { tokenize } from "./tokenize.js";
import type { WritingMode } from "./types.js";

export interface AnalyzeOptions {
  autospace?: boolean;
  punctuationClusters?: boolean;
  writingMode?: WritingMode;
}

export function analyzeText(input: string, options: AnalyzeOptions = {}) {
  const tokens = tokenize(input);
  const writingMode = options.writingMode ?? "horizontal";

  return {
    tokens,
    pairAdjustments:
      options.punctuationClusters === false
        ? []
        : computePairAdjustments(tokens, writingMode),
    autospaceBoundaries:
      options.autospace === false ? [] : computeAutospaceBoundaries(tokens)
  };
}

export {
  createMojikumi,
  detectNativeSupport,
  mojikumi,
  resolveOptions
} from "@mojikumi/dom";
export type {
  MojikumiInstance,
  MojikumiOptions,
  NativeFeatureSupport,
  Precision,
  ResolvedMojikumiOptions
} from "@mojikumi/dom";
export {
  analyzeText,
  classifyGrapheme,
  computeAutospaceBoundaries,
  computePairAdjustments,
  needsAutospace,
  segmentGraphemes,
  tokenize
} from "@mojikumi/core";
export type {
  AnalyzeOptions,
  AutospaceBoundary,
  MojikumiClass,
  MojikumiPreset,
  MojikumiToken,
  PairAdjustment,
  SpacingRule,
  WritingMode
} from "@mojikumi/core";
export { getPreset, isPresetName, PRESETS } from "@mojikumi/presets";
export type { PresetName } from "@mojikumi/presets";

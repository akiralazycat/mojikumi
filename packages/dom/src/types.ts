import type { MojikumiPreset } from "@mojikumi/core";
import type { PresetName } from "@mojikumi/presets";

export type Precision = "native" | "auto" | "full";

export interface NativeFeatureSupport {
  textSpacingTrim: boolean;
  textSpacingTrimStart: boolean;
  textSpacingTrimBoth: boolean;
  textAutospace: boolean;
  hangingPunctuation: boolean;
  autoPhrase: boolean;
}

export interface MojikumiOptions {
  preset?: PresetName;
  precision?: Precision;
  observe?: boolean;
  observeResize?: boolean;
  observeMutations?: boolean;
  debug?: boolean;
  exclude?: readonly string[];
}

export interface ResolvedMojikumiOptions {
  presetName: PresetName;
  preset: MojikumiPreset;
  precision: Precision;
  observeResize: boolean;
  observeMutations: boolean;
  debug: boolean;
  exclude: readonly string[];
}

export interface MojikumiInstance {
  readonly element: Element;
  readonly options: ResolvedMojikumiOptions;
  readonly support: NativeFeatureSupport;
  refresh(): void;
  destroy(): void;
}

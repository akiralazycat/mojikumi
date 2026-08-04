import type { MojikumiPreset } from "@mojikumi/core";
import type { PresetAlias, PresetName } from "@mojikumi/presets";

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
  /** A retired name (`web`, `editorial`, `native`) still resolves. */
  preset?: PresetName | PresetAlias;
  precision?: Precision;
  /*
   * Modifiers. A preset decides these, and these override the preset, because
   * neither is a question about Japanese typography — whether a paragraph is
   * indented and whether the text is set flush to both edges are decisions
   * about this particular page. Leave them out to take the preset's answer.
   */
  /** `true` indents by the preset's amount, or 1em. A length sets its own. */
  indent?: boolean | string;
  /** Setting this to false also stops the fallback from trimming line ends. */
  justify?: boolean;
  /** Let punctuation hang into the margin. WebKit only, today. */
  hanging?: boolean;
  /** Break headings on phrase boundaries where the browser can. */
  headingBreak?: boolean;
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

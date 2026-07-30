export type MojikumiClass =
  | "opening"
  | "closing"
  | "comma"
  | "period"
  | "middle"
  | "question"
  | "ideograph"
  | "latin"
  | "numeric"
  | "space"
  | "other";

export type WritingMode = "horizontal" | "vertical";

export type RuleContext =
  | "inline"
  | "line-start"
  | "line-end"
  | "paragraph-start";

export type LineContext =
  | "paragraph-start"
  | "wrapped-line-start"
  | "line-middle"
  | "line-end"
  | "paragraph-end";

export interface MojikumiToken {
  value: string;
  class: MojikumiClass;
  index: number;
  offset: number;
}

export interface SpacingRule {
  before?: number;
  after?: number;
  adjustment: number;
  context: RuleContext;
  writingMode: WritingMode | "both";
  priority: number;
  source: "jlreq" | "css-text" | "mojikumi-safe";
}

export interface PairAdjustment {
  left: MojikumiToken;
  right: MojikumiToken;
  boundary: number;
  rule: SpacingRule;
}

export type LineEndTrim = boolean | "when-needed";
export type HangingMode = false | "first" | "allow-end" | "force-end";

export interface MojikumiPreset {
  punctuationClusters: boolean;
  lineStartTrim: boolean;
  lineEndTrim: LineEndTrim;
  autospace: boolean;
  paragraphIndent: false | string;
  hanging: HangingMode;
  headingPhraseBreak: boolean;
  fallback: boolean;
}

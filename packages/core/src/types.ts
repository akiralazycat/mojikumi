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

/**
 * A preset in two halves.
 *
 * The first four say what has to happen for the Japanese to be set correctly:
 * they follow JLREQ, and a reader would call a page that skipped them wrong.
 * The last four are how this particular page is laid out — whether it is set
 * flush to both edges, whether paragraphs are indented, whether punctuation
 * hangs into the margin, whether headings break on phrase boundaries. JLREQ
 * describes those as choices a publisher makes, so a preset only supplies the
 * default and the caller's modifier wins.
 */
export interface MojikumiPreset {
  punctuationClusters: boolean;
  lineStartTrim: boolean;
  /**
   * Only ever acts through the fallback in a justified block: in ragged text
   * there is nothing to the right of a line-final comma to pull in, so removing
   * its half-em changes no pixel, while still being able to talk the browser
   * into a different line break.
   */
  lineEndTrim: boolean;
  autospace: boolean;

  justify: boolean;
  indent: false | string;
  hanging: boolean;
  headingBreak: boolean;
}

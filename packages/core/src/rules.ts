import type {
  MojikumiClass,
  MojikumiToken,
  PairAdjustment,
  SpacingRule,
  WritingMode
} from "./types.js";

type PairKey = `${MojikumiClass}:${MojikumiClass}`;

function inlineRule(adjustment: number): SpacingRule {
  return {
    adjustment,
    context: "inline",
    writingMode: "both",
    priority: 1,
    source: "mojikumi-safe"
  };
}

/**
 * Conservative reductions of duplicated half-em punctuation spacing.
 * The table intentionally excludes question/exclamation and middle-dot pairs.
 */
export const PAIR_RULES: Readonly<Partial<Record<PairKey, SpacingRule>>> = {
  "opening:opening": inlineRule(-0.5),
  "closing:closing": inlineRule(-0.5),
  "closing:opening": inlineRule(-0.5),
  "comma:opening": inlineRule(-0.5),
  "period:opening": inlineRule(-0.5),
  "closing:comma": inlineRule(-0.5),
  "closing:period": inlineRule(-0.5)
};

export function getPairRule(
  left: MojikumiClass,
  right: MojikumiClass,
  writingMode: WritingMode = "horizontal"
): SpacingRule | undefined {
  const rule = PAIR_RULES[`${left}:${right}`];
  if (
    !rule ||
    (rule.writingMode !== "both" && rule.writingMode !== writingMode)
  ) {
    return undefined;
  }
  return rule;
}

export function computePairAdjustments(
  tokens: readonly MojikumiToken[],
  writingMode: WritingMode = "horizontal"
): PairAdjustment[] {
  const adjustments: PairAdjustment[] = [];

  for (let boundary = 1; boundary < tokens.length; boundary += 1) {
    const left = tokens[boundary - 1];
    const right = tokens[boundary];
    if (!left || !right) continue;

    const rule = getPairRule(left.class, right.class, writingMode);
    if (rule) adjustments.push({ left, right, boundary, rule });
  }

  return adjustments;
}

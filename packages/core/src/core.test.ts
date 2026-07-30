import { describe, expect, it } from "vitest";
import {
  analyzeText,
  classifyGrapheme,
  segmentGraphemes,
  tokenize
} from "./index.js";

describe("classifyGrapheme", () => {
  it.each([
    ["「", "opening"],
    ["」", "closing"],
    ["、", "comma"],
    ["。", "period"],
    ["・", "middle"],
    ["！", "question"],
    ["文", "ideograph"],
    ["あ", "ideograph"],
    ["ア", "ideograph"],
    ["A", "latin"],
    ["５", "numeric"],
    [" ", "space"]
  ] as const)("classifies %s as %s", (value, expected) => {
    expect(classifyGrapheme(value)).toBe(expected);
  });
});

describe("segmentGraphemes", () => {
  it("keeps combining marks and variation selectors intact", () => {
    expect(segmentGraphemes("か\u3099葛\u{E0100}").map((item) => item.value)).toEqual([
      "か\u3099",
      "葛\u{E0100}"
    ]);
  });

  it("keeps emoji ZWJ sequences intact", () => {
    expect(segmentGraphemes("👩‍💻").map((item) => item.value)).toEqual(["👩‍💻"]);
  });
});

describe("analyzeText", () => {
  it("finds conservative punctuation pair adjustments", () => {
    const result = analyzeText("『「引用」』");
    expect(result.pairAdjustments.map(({ left, right }) => left.value + right.value))
      .toEqual(["『「", "」』"]);
    expect(result.pairAdjustments[0]?.rule.adjustment).toBe(-0.5);
  });

  it("does not squeeze question or exclamation marks indiscriminately", () => {
    expect(analyzeText("？！「").pairAdjustments).toHaveLength(0);
  });

  it("finds Japanese and Latin/numeric boundaries", () => {
    const result = analyzeText("Next.jsを100円");
    expect(
      result.autospaceBoundaries.map(({ left, right }) => left.value + right.value)
    ).toEqual(["sを", "を1", "0円"]);
  });

  it("can disable individual analyses", () => {
    const result = analyzeText("「（A）」。", {
      punctuationClusters: false,
      autospace: false
    });
    expect(result.pairAdjustments).toEqual([]);
    expect(result.autospaceBoundaries).toEqual([]);
  });
});

describe("tokenize", () => {
  it("reports UTF-16 offsets", () => {
    expect(tokenize("A👩‍💻文").map(({ offset }) => offset)).toEqual([0, 1, 6]);
  });
});

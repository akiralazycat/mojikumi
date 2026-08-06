import { describe, expect, it } from "vitest";
import {
  analyzeText,
  classifyGrapheme,
  computeUnbreakableRuns,
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
    ["5", "numeric"],
    [" ", "space"]
  ] as const)("classifies %s as %s", (value, expected) => {
    expect(classifyGrapheme(value)).toBe(expected);
  });

  /*
   * The prolonged sound mark is Script=Common, so a Script test dropped it into
   * `other` and every katakana word ending in one lost the space before a
   * following letter. Chromium puts 0.125em there.
   */
  it("keeps the marks that only kana use with the kana", () => {
    expect(classifyGrapheme("ー")).toBe("ideograph");
    expect(classifyGrapheme("ｰ")).toBe("ideograph");
    expect(classifyGrapheme("ゝ")).toBe("ideograph");
    expect(classifyGrapheme("々")).toBe("ideograph");
  });

  /*
   * Fullwidth forms are letters and digits to Unicode, but CSS Text 4 leaves
   * them out of the alphanumeric side and Chromium adds nothing around them.
   */
  it("does not read a fullwidth form as Latin or a number", () => {
    expect(classifyGrapheme("Ａ")).toBe("other");
    expect(classifyGrapheme("１")).toBe("other");
    expect(classifyGrapheme("％")).toBe("other");
  });

  /*
   * Measured on Chromium: `〝〟` are trimmed to 0.5em beside another bracket,
   * exactly as `『』` are, while `〜…‥―` and the halfwidth forms never are.
   * Adjusting a glyph with no blank to give would close it up on its neighbour.
   */
  it("takes the fullwidth quotation marks as brackets", () => {
    expect(classifyGrapheme("〝")).toBe("opening");
    expect(classifyGrapheme("〟")).toBe("closing");
  });

  it("leaves alone the punctuation that carries no half em", () => {
    for (const value of ["〜", "…", "‥", "―", "｡", "｢", "｣", "､", "･"]) {
      expect(classifyGrapheme(value)).toBe("other");
    }
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

  it("spaces a katakana word that ends in a prolonged sound mark", () => {
    expect(
      analyzeText("コーヒーAPIとメニュー100円")
        .autospaceBoundaries.map(({ left, right }) => left.value + right.value)
    ).toEqual(["ーA", "Iと", "ー1", "0円"]);
  });

  it("puts nothing beside a fullwidth form", () => {
    expect(analyzeText("あＡあ１あ").autospaceBoundaries).toEqual([]);
  });

  it("closes up a fullwidth quotation mark against a bracket", () => {
    expect(
      analyzeText("「〝引用〟」")
        .pairAdjustments.map(({ left, right }) => left.value + right.value)
    ).toEqual(["「〝", "〟」"]);
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

describe("computeUnbreakableRuns", () => {
  const runsIn = (text: string) =>
    computeUnbreakableRuns(tokenize(text)).map((run) =>
      text.slice(run.offset, run.offset + run.length)
    );

  it("finds a URL a Japanese line cannot break inside", () => {
    expect(
      runsIn("詳しくはhttps://example.com/2026/typography.htmlを参照。")
    ).toEqual(["https://example.com/2026/typography.html"]);
  });

  it("finds an identifier written for a machine", () => {
    expect(runsIn("環境変数NEXT_PUBLIC_MOJIKUMI_FLAGを設定する。")).toEqual([
      "NEXT_PUBLIC_MOJIKUMI_FLAG"
    ]);
  });

  /*
   * Prose has spaces to break at, and a long word broken mid-syllable reads
   * worse than the gap it saves. Those are left to the justification check.
   */
  it("leaves prose alone, however long the words are", () => {
    expect(
      runsIn("The internationalization of typography は難しい問題です。")
    ).toEqual([]);
    expect(runsIn("Next.jsと日本語、GPT-5を使う100円の本。")).toEqual([]);
  });

  it("ignores a machine-written run that is short enough to fit", () => {
    expect(runsIn("設定はa/bです。")).toEqual([]);
  });

  /*
   * The break offsets are where the run may be divided. Written out as the
   * pieces they produce, so a wrong offset reads as a wrong address rather
   * than as a number.
   */
  const piecesIn = (text: string) =>
    computeUnbreakableRuns(tokenize(text)).map((run) => {
      const edges = [run.offset, ...run.breaks, run.offset + run.length];
      return edges
        .slice(0, -1)
        .map((from, index) => text.slice(from, edges[index + 1]));
    });

  it("divides a URL where the address divides", () => {
    expect(
      piecesIn("詳しくはhttps://example.com/2026/typography.htmlを参照。")
    ).toEqual([
      ["https:", "/", "/", "example.com/", "2026/", "typography.html"]
    ]);
  });

  it("keeps a domain name whole", () => {
    const [pieces] = piecesIn("配信元はhttps://cdn.mojikumi.jp/v1/です。");
    expect(pieces).toContain("cdn.mojikumi.jp/");
  });

  it("divides a query at its parameters", () => {
    expect(piecesIn("例はhttps://example.com/s?q=1&r=2です。")).toEqual([
      ["https:", "/", "/", "example.com/", "s?", "q=", "1&", "r=", "2"]
    ]);
  });

  /*
   * The two hex digits after a percent sign are one escape (RFC 3986 §2.1).
   * Dividing them divides a character, not an address.
   */
  it("never divides a percent-encoded escape", () => {
    const [pieces] = piecesIn("検索はhttps://example.com/%E3%81%82%E3%81%84");
    expect(pieces).toContain("%E3%81%82%E3%81%84");
  });

  it("offers nothing where every mark sits at the end", () => {
    const [run] = computeUnbreakableRuns(
      tokenize("設定はNEXT_PUBLIC_MOJIKUMI_を読みます。")
    );
    expect(run?.breaks.at(-1)).toBeLessThan(run!.offset + run!.length);
  });
});

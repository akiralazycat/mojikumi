import { describe, expect, it } from "vitest";
import {
  getPreset,
  isPresetName,
  PRESETS,
  resolvePresetName
} from "./index.js";

describe("presets", () => {
  it("exposes one preset per step towards print composition", () => {
    expect(Object.keys(PRESETS)).toEqual(["minimal", "article", "book"]);
  });

  it("returns defensive copies", () => {
    const first = getPreset("book");
    const second = getPreset("book");
    expect(first).not.toBe(second);
    expect(first.indent).toBe("1em");
  });

  it("validates preset names", () => {
    expect(isPresetName("article")).toBe(true);
    expect(isPresetName("unknown")).toBe(false);
  });

  /* A page that pasted one of the first release's names keeps its typography. */
  it("resolves the retired names", () => {
    expect(resolvePresetName("web")).toBe("minimal");
    expect(resolvePresetName("editorial")).toBe("minimal");
    expect(resolvePresetName("native")).toBe("minimal");
    expect(resolvePresetName("article")).toBe("article");
    expect(resolvePresetName("unknown")).toBeUndefined();
  });

  /*
   * Trimming a line-final comma only shows in a justified line, so a preset
   * that asks the fallback for one has to ask for the other.
   */
  it("only trims line ends where the text is justified", () => {
    for (const [name, preset] of Object.entries(PRESETS)) {
      if (preset.lineEndTrim && !preset.justify) {
        expect.unreachable(`${name} trims line ends in ragged text`);
      }
    }
    expect(PRESETS.minimal.justify).toBe(false);
    expect(PRESETS.article.justify).toBe(true);
    expect(PRESETS.book.justify).toBe(true);
  });

  /* The one thing that separates them, and the reason book still has a name. */
  it("makes book an article with the trappings of a printed page", () => {
    const { indent, hanging, ...bookRest } = PRESETS.book;
    const { indent: _, hanging: __, ...articleRest } = PRESETS.article;
    expect(bookRest).toEqual(articleRest);
    expect(indent).toBe("1em");
    expect(hanging).toBe(true);
  });
});

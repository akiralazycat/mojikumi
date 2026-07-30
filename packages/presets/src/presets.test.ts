import { describe, expect, it } from "vitest";
import { getPreset, isPresetName, PRESETS } from "./index.js";

describe("presets", () => {
  it("exposes the planned preset set", () => {
    expect(Object.keys(PRESETS)).toEqual([
      "web",
      "book",
      "editorial",
      "minimal",
      "native"
    ]);
  });

  it("returns defensive copies", () => {
    const first = getPreset("book");
    const second = getPreset("book");
    expect(first).not.toBe(second);
    expect(first.paragraphIndent).toBe("1em");
  });

  it("validates preset names", () => {
    expect(isPresetName("editorial")).toBe(true);
    expect(isPresetName("unknown")).toBe(false);
  });
});

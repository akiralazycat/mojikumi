import { describe, expect, it } from "vitest";
import { hasPlaceholder, readGroup, replacePlaceholders } from "./latex-scan";

describe("readGroup", () => {
  it("balances nested braces", () => {
    expect(readGroup("{a{b}c}d", 0)).toEqual({ content: "a{b}c", end: 7 });
  });

  it("ignores braces escaped with a backslash", () => {
    expect(readGroup(String.raw`{a\}b}`, 0)).toEqual({ content: String.raw`a\}b`, end: 6 });
  });

  it("returns null when the group never closes", () => {
    expect(readGroup("{a", 0)).toBeNull();
  });
});

describe("replacePlaceholders", () => {
  it("keeps an empty slot visible instead of removing it", () => {
    expect(replacePlaceholders(String.raw`\placeholder{}x^2+3`, "□")).toBe("□x^2+3");
  });

  it("replaces a placeholder that carries an optional argument", () => {
    expect(replacePlaceholders(String.raw`x+\placeholder[id]{value}+y`, "□")).toBe("x+□+y");
  });

  it("replaces placeholders whose content nests further braces", () => {
    expect(
      replacePlaceholders(String.raw`\frac{\placeholder{\frac{a}{b}}}{2}`, String.raw`\square`)
    ).toBe(String.raw`\frac{\square}{2}`);
  });

  it("leaves other commands with the same prefix alone", () => {
    expect(replacePlaceholders(String.raw`\placeholders{x}`, "□")).toBe(String.raw`\placeholders{x}`);
  });

  it("reports whether an input slot is present", () => {
    expect(hasPlaceholder(String.raw`\frac{1}{\placeholder{}}`)).toBe(true);
    expect(hasPlaceholder(String.raw`\frac{1}{2}`)).toBe(false);
  });
});

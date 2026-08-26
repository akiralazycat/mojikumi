import { describe, expect, it } from "vitest";
import { unicodeReadableFixtures } from "./unicode-readable-fixtures";
import { toUnicodeReadable } from "./unicode-readable";

describe("Unicode Readable", () => {
  it.each(unicodeReadableFixtures)("derives $name conservatively", ({ strict, expected }) => {
    expect(toUnicodeReadable(strict)).toBe(expected);
  });

  it("keeps every ambiguity fixture documented and uniquely named", () => {
    expect(unicodeReadableFixtures.length).toBeGreaterThanOrEqual(12);
    expect(new Set(unicodeReadableFixtures.map((fixture) => fixture.name)).size)
      .toBe(unicodeReadableFixtures.length);
    expect(unicodeReadableFixtures.every((fixture) => fixture.protects.length > 0)).toBe(true);
  });
});

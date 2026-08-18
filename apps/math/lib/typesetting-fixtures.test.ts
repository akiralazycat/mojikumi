import { describe, expect, it } from "vitest";
import { typesettingFixtures } from "./typesetting-fixtures";

describe("typesetting fixtures", () => {
  it("keeps a focused set of complex visual regression inputs", () => {
    expect(typesettingFixtures).toHaveLength(6);
    expect(new Set(typesettingFixtures.map((fixture) => fixture.name)).size).toBe(6);
    expect(typesettingFixtures.every((fixture) => fixture.latex && fixture.purpose)).toBe(true);
  });
});

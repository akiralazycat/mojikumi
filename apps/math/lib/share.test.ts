import { describe, expect, it } from "vitest";
import { createShareFragment, createShareUrl, readSharedExpression } from "./share";

describe("share fragments", () => {
  it("round-trips LaTeX through a URL fragment", () => {
    const latex = String.raw`\frac{x+1}{2}`;
    const fragment = createShareFragment(latex);
    expect(fragment.startsWith("#v=1&expr=")).toBe(true);
    expect(readSharedExpression(fragment)).toEqual({ version: 1, latex });
  });

  it("keeps the expression in the hash rather than the request path", () => {
    const url = new URL(createShareUrl(String.raw`\sqrt{x}`, "https://math.mojikumi.jp/?mode=test"));
    expect(url.origin + url.pathname + url.search).toBe("https://math.mojikumi.jp/?mode=test");
    expect(readSharedExpression(url.hash)?.latex).toBe(String.raw`\sqrt{x}`);
  });

  it("rejects unknown versions and empty values", () => {
    expect(readSharedExpression("#v=2&expr=x")).toBeNull();
    expect(readSharedExpression("#v=1&expr=")).toBeNull();
  });
});

import { defineConfig } from "vitest/config";

export default defineConfig({
  /*
   * The browser bundle has its stylesheet and version baked in at build time.
   * Standing in for them here lets the tests exercise the same branches the
   * pasted script takes, rather than the empty fallbacks.
   */
  define: {
    __MOJIKUMI_CSS__: JSON.stringify("@layer mojikumi{}"),
    __MOJIKUMI_VERSION__: JSON.stringify("0.0.0-test")
  },
  test: {
    include: ["packages/**/*.test.ts", "apps/web/**/*.test.ts"],
    coverage: {
      reporter: ["text", "html"]
    }
  }
});

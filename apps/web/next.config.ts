import type { NextConfig } from "next";
import { fileURLToPath } from "node:url";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  /*
   * The two locales each have their own root layout, so Next.js cannot pick one
   * for a URL that matched neither, and a plain `not-found.tsx` gets wrapped in
   * a bare default document — a second <html> inside ours. `global-not-found`
   * is the convention for this case: it replaces the root layout instead of
   * nesting inside one.
   */
  experimental: {
    globalNotFound: true
  },
  turbopack: {
    root: fileURLToPath(new URL("../..", import.meta.url))
  },
  transpilePackages: [
    "@mojikumi/core",
    "@mojikumi/css",
    "@mojikumi/dom",
    "@mojikumi/presets",
    "@mojikumi/react",
    "mojikumi"
  ]
};

export default nextConfig;

import type { NextConfig } from "next";
import { fileURLToPath } from "node:url";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
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

import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{
    url: "https://chem.mojikumi.jp/",
    lastModified: new Date("2026-08-27"),
    changeFrequency: "monthly",
    priority: 1
  }];
}

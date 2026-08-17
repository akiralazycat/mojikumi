import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://math.mojikumi.jp/",
      lastModified: new Date("2026-08-17"),
      changeFrequency: "monthly",
      priority: 1
    }
  ];
}

import type { MetadataRoute } from "next";
import { locales } from "../content";
import { absoluteUrl, pageKeys, sitemapPriority } from "../lib/site";

/*
 * Both locales are listed as their own entries, each pointing at the other
 * through hreflang, so a crawler that lands on either one can find the pair.
 * No lastModified: the site is a static export, and stamping the build date on
 * every page would claim a change that did not happen.
 */
// Required for `output: "export"`, which cannot leave a route to run per request.
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return pageKeys.flatMap((page) =>
    locales.map((locale) => ({
      url: absoluteUrl(locale, page),
      changeFrequency: "monthly" as const,
      priority: sitemapPriority(page),
      alternates: {
        languages: {
          ja: absoluteUrl("ja", page),
          en: absoluteUrl("en", page),
          "x-default": absoluteUrl("ja", page)
        }
      }
    }))
  );
}

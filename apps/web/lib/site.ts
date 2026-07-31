import type { Metadata } from "next";
import { getDictionary, type Locale } from "../content";

export const siteUrl = "https://mojikumi.jp";
export const repositoryUrl = "https://github.com/akiralazycat/mojikumi";
export const releasesUrl = `${repositoryUrl}/releases`;
export const npmUrl = "https://www.npmjs.com/package/mojikumi";

export const pagePaths = {
  home: "/",
  start: "/start/",
  docs: "/docs/",
  playground: "/playground/",
  benchmarks: "/benchmarks/",
  privacy: "/privacy/",
  terms: "/terms/"
} as const;

export type PageKey = keyof typeof pagePaths;

export const pageKeys = Object.keys(pagePaths) as PageKey[];

/** Relative weight for the sitemap: what a first-time visitor should find. */
const pagePriority: Record<PageKey, number> = {
  home: 1,
  start: 0.9,
  docs: 0.9,
  playground: 0.9,
  benchmarks: 0.5,
  privacy: 0.3,
  terms: 0.3
};

export function absoluteUrl(locale: Locale, page: PageKey): string {
  return new URL(localePath(locale, pagePaths[page]), siteUrl).href;
}

export function sitemapPriority(page: PageKey): number {
  return pagePriority[page];
}

/** Japanese lives at the root; English is nested under /en/. */
export function localePath(locale: Locale, path: string): string {
  if (locale === "ja") return path;
  return path === "/" ? "/en/" : `/en${path}`;
}

export function pageHref(locale: Locale, page: PageKey): string {
  return localePath(locale, pagePaths[page]);
}

/** Maps a pathname back to the equivalent page in the other locale. */
export function switchLocalePath(locale: Locale, pathname: string): string {
  const withoutPrefix = pathname.startsWith("/en/")
    ? pathname.slice(3)
    : pathname === "/en"
      ? "/"
      : pathname;
  return localePath(locale, withoutPrefix);
}

export function buildMetadata(locale: Locale, page: PageKey): Metadata {
  const dictionary = getDictionary(locale);
  const path = pagePaths[page];
  /* Every page key names its own section of the dictionary. */
  const content = dictionary[page];

  return {
    title: page === "home" ? dictionary.meta.defaultTitle : content.title,
    description: content.description,
    alternates: {
      canonical: localePath(locale, path),
      languages: {
        ja: localePath("ja", path),
        en: localePath("en", path),
        "x-default": localePath("ja", path)
      }
    },
    openGraph: {
      locale: dictionary.ogLocale,
      url: localePath(locale, path),
      title: page === "home" ? dictionary.meta.defaultTitle : content.title,
      description: content.description
    }
  };
}

import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { getDictionary, type Locale } from "../content";
import { fontVariables } from "../lib/fonts";
import { localePath, siteUrl } from "../lib/site";
import { PageTransition } from "./page-transition";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";
import { SiteMojikumi } from "./site-mojikumi";
import { StructuredData } from "./structured-data";

const themeScript = `
try {
  const saved = localStorage.getItem("mojikumi.theme");
  const theme = saved === "light" || saved === "dark"
    ? saved
    : matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  const color = theme === "dark" ? "#120d10" : "#f5f0ea";
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
  document.documentElement.style.backgroundColor = color;
} catch {}
`;

export const viewport: Viewport = {
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f0ea" },
    { media: "(prefers-color-scheme: dark)", color: "#120d10" }
  ]
};

export function rootMetadata(locale: Locale): Metadata {
  const dictionary = getDictionary(locale);

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: dictionary.meta.defaultTitle,
      template: dictionary.meta.titleTemplate
    },
    description: dictionary.meta.description,
    alternates: {
      canonical: localePath(locale, "/"),
      languages: {
        ja: "/",
        en: "/en/",
        "x-default": "/"
      }
    },
    openGraph: {
      locale: dictionary.ogLocale,
      siteName: "Mojikumi",
      type: "website",
      images: [
        {
          url: "/og-enji.png",
          width: 1200,
          height: 630,
          alt: dictionary.meta.ogAlt
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      images: ["/og-enji.png"]
    }
  };
}

export function RootDocument({
  locale,
  head,
  children
}: {
  locale: Locale;
  /** Extra head content, for pages that have no layout of their own. */
  head?: ReactNode;
  children: ReactNode;
}) {
  const dictionary = getDictionary(locale);

  return (
    <html
      lang={locale}
      data-scroll-behavior="smooth"
      className={fontVariables}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        {head}
        <StructuredData locale={locale} />
      </head>
      <body>
        <div className="ambient-wash" aria-hidden="true" />
        <SiteMojikumi locale={locale}>
          <SiteHeader dictionary={dictionary} locale={locale} />
          <PageTransition>{children}</PageTransition>
          <SiteFooter dictionary={dictionary} locale={locale} />
        </SiteMojikumi>
      </body>
    </html>
  );
}

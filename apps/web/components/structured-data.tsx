import { getDictionary, type Locale } from "../content";
import { localePath, repositoryUrl, siteUrl } from "../lib/site";

/*
 * Describes the two things this site is: a bilingual site, and the source of an
 * open-source library. Both nodes are kept to facts already stated on the page
 * itself, so the markup and the visible copy cannot drift apart.
 */
export function StructuredData({ locale }: { locale: Locale }) {
  const dictionary = getDictionary(locale);
  const author = {
    "@type": "Person",
    name: "Akira Manabe",
    url: repositoryUrl
  };

  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        name: "Mojikumi",
        url: new URL(localePath(locale, "/"), siteUrl).href,
        description: dictionary.meta.description,
        inLanguage: locale === "ja" ? "ja-JP" : "en-US",
        author,
        publisher: { "@id": `${siteUrl}/#author` }
      },
      {
        "@type": "SoftwareSourceCode",
        "@id": `${siteUrl}/#software`,
        name: "Mojikumi",
        description: dictionary.meta.description,
        codeRepository: repositoryUrl,
        url: siteUrl,
        programmingLanguage: "TypeScript",
        runtimePlatform: "Web browser",
        license: "https://opensource.org/licenses/MIT",
        author,
        isAccessibleForFree: true
      },
      { ...author, "@id": `${siteUrl}/#author` }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}

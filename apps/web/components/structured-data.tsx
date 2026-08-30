import { getDictionary, type Locale } from "../content";
import { chemUrl, localePath, mathUrl, repositoryUrl, siteUrl } from "../lib/site";

/*
 * Describes the site, source project, and the focused Mojikumi tools that live
 * on sibling subdomains. Keeping the family relationship explicit here mirrors
 * the visible navigation without turning the main product into a portal.
 */
export function StructuredData({ locale }: { locale: Locale }) {
  const dictionary = getDictionary(locale);
  const author = {
    "@type": "Person",
    name: "Akira Manabe",
    url: repositoryUrl
  };
  const websiteId = `${siteUrl}/#website`;

  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": websiteId,
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
      {
        "@type": "WebApplication",
        "@id": `${mathUrl}/#app`,
        name: "Mojikumi Math",
        url: mathUrl,
        applicationCategory: "UtilitiesApplication",
        operatingSystem: "Any",
        browserRequirements: "Requires JavaScript",
        isAccessibleForFree: true,
        isPartOf: { "@id": websiteId }
      },
      {
        "@type": "WebApplication",
        "@id": `${chemUrl}/#app`,
        name: "Mojikumi Chem",
        url: chemUrl,
        applicationCategory: "UtilitiesApplication",
        operatingSystem: "Any",
        browserRequirements: "Requires JavaScript",
        isAccessibleForFree: true,
        isPartOf: { "@id": websiteId }
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

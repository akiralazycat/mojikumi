import Link from "next/link";
import type { Dictionary, Locale } from "../content";
import { npmUrl, pageHref, releasesUrl, repositoryUrl } from "../lib/site";

export function SiteFooter({
  dictionary,
  locale
}: {
  dictionary: Dictionary;
  locale: Locale;
}) {
  const { footer, nav } = dictionary;

  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="footer-brand">
          <Link className="brand" href={pageHref(locale, "home")}>
            <span className="brand-mark" aria-hidden="true" data-no-mojikumi>
              「
            </span>
            <span>Mojikumi</span>
          </Link>
          <p>{footer.tagline}</p>
          <span className="footer-note">{footer.note}</span>
        </div>

        <div className="footer-links">
          <nav aria-label={footer.product}>
            <p className="footer-heading">{footer.product}</p>
            <Link href={pageHref(locale, "docs")}>{nav.docs}</Link>
            <Link href={pageHref(locale, "playground")}>{nav.playground}</Link>
            <Link href={pageHref(locale, "benchmarks")}>{nav.benchmarks}</Link>
          </nav>

          <nav aria-label={footer.project}>
            <p className="footer-heading">{footer.project}</p>
            <a href={repositoryUrl}>{nav.github}</a>
            <a href={npmUrl}>{footer.npm}</a>
            <a href={releasesUrl}>{footer.releases}</a>
          </nav>

          <nav aria-label={footer.legal}>
            <p className="footer-heading">{footer.legal}</p>
            <Link href={pageHref(locale, "privacy")}>{footer.privacy}</Link>
            <Link href={pageHref(locale, "terms")}>{footer.terms}</Link>
          </nav>
        </div>
      </div>

      <div className="footer-bottom">
        <span>{footer.copyright}</span>
        <span className="footer-dot" aria-hidden="true" />
        <span>{footer.license}</span>
        <span className="footer-credit">{footer.credit}</span>
      </div>
    </footer>
  );
}

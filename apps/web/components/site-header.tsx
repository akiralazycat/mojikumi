import Link from "next/link";
import type { Dictionary, Locale } from "../content";
import { pageHref, repositoryUrl } from "../lib/site";
import { HeaderMenu } from "./header-menu";

export function SiteHeader({
  dictionary,
  locale
}: {
  dictionary: Dictionary;
  locale: Locale;
}) {
  const navigation = [
    { href: pageHref(locale, "start"), label: dictionary.nav.start },
    { href: pageHref(locale, "docs"), label: dictionary.nav.docs },
    { href: pageHref(locale, "playground"), label: dictionary.nav.playground },
    { href: pageHref(locale, "benchmarks"), label: dictionary.nav.benchmarks }
  ];

  return (
    <header className="site-header">
      <Link
        className="brand"
        href={pageHref(locale, "home")}
        aria-label={dictionary.nav.home}
      >
        <span className="brand-mark" aria-hidden="true" data-no-mojikumi>
          「
        </span>
        <span>Mojikumi</span>
      </Link>
      <div className="header-actions">
        <nav className="header-nav" aria-label={dictionary.nav.label}>
          {navigation.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
          <a href={repositoryUrl}>{dictionary.nav.github}</a>
        </nav>
        <HeaderMenu dictionary={dictionary} locale={locale} />
      </div>
    </header>
  );
}

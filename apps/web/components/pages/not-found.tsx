import Link from "next/link";
import type { Dictionary, Locale } from "../../content";
import { pageHref } from "../../lib/site";
import { ArrowRightIcon } from "../icons";

/*
 * The page number a book prints in its margin is the nombre, and 404 is set as
 * one here: a number the binding never carried. The headline is the caption to
 * that, so it sits a step below the heading every real page uses — a 404 has no
 * business looking more important than /start/.
 *
 * Both locales are rendered, because the static export writes a single
 * 404.html for every unmatched URL. The head script decides which one shows.
 */
export function NotFoundView({
  dictionary,
  locale
}: {
  dictionary: Dictionary;
  locale: Locale;
}) {
  const { notFound } = dictionary;

  return (
    <div className="not-found" lang={locale}>
      <div className="not-found-intro">
        <p className="eyebrow">{notFound.eyebrow}</p>
        <h1>
          {notFound.headlineLead}
          {/* Latin words need the space between them; Japanese ones do not. */}
          {locale === "en" ? " " : null}
          <em>{notFound.headlineAccent}</em>
        </h1>
        <p className="not-found-lead">{notFound.lead}</p>
      </div>

      {/* The headline already says it; to a screen reader this is decoration. */}
      <aside className="not-found-nombre" aria-hidden="true">
        <small>{notFound.nombreLabel}</small>
        <strong data-no-mojikumi>404</strong>
        <span className="not-found-running-head">{notFound.runningHead}</span>
      </aside>

      <nav className="not-found-contents" aria-label={notFound.linksLabel}>
        {notFound.links.map((link) => (
          <Link key={link.page} href={pageHref(locale, link.page)}>
            <span className="index-mark">{link.index}</span>
            <span>{link.label}</span>
            <ArrowRightIcon size={17} aria-hidden="true" />
          </Link>
        ))}
      </nav>
    </div>
  );
}

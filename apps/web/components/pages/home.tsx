import Link from "next/link";
import type { Dictionary, Locale } from "../../content";
import { pageHref } from "../../lib/site";
import { ArrowRightIcon, PackageGlyph, PrincipleGlyph } from "../icons";

export function HomePage({
  dictionary,
  locale
}: {
  dictionary: Dictionary;
  locale: Locale;
}) {
  const { home } = dictionary;

  return (
    <main>
      <section className="home-hero">
        <p className="eyebrow">{home.eyebrow}</p>
        <h1>
          {home.headlineLead}
          <br />
          <em>{home.headlineAccent}</em>
        </h1>
        <p className="hero-copy">{home.lead}</p>
        <div className="hero-actions">
          <Link
            className="button button-primary"
            href={pageHref(locale, "playground")}
          >
            {home.primaryAction}
          </Link>
          <Link
            className="button button-secondary"
            href={pageHref(locale, "docs")}
          >
            {home.secondaryAction}
          </Link>
        </div>
        <div className="hero-specimen">
          <span
            className="hero-specimen-mark mjk-trim-start"
            aria-hidden="true"
            data-no-mojikumi
          >
            『
          </span>
          <div>
            <small>{home.specimenLabel}</small>
            <p lang="ja">{home.specimenText}</p>
          </div>
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <p className="eyebrow">{home.principles.eyebrow}</p>
          <h2>{home.principles.title}</h2>
        </div>
        <div className="principle-grid">
          {home.principles.items.map((item) => (
            <article key={item.index}>
              <div className="principle-head">
                <span className="principle-icon">
                  <PrincipleGlyph name={item.icon} size={22} />
                </span>
                <span className="principle-index">{item.index}</span>
              </div>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      {/*
       * The "after" side is simply the page's own typesetting, since the whole
       * site is already wrapped in Mojikumi. Only the "before" side has to opt
       * out: data-no-mojikumi keeps the runtime pass off it, and the CSS resets
       * the inherited standard properties.
       */}
      <section className="section-block home-compare">
        <div className="section-heading">
          <p className="eyebrow">{home.compare.eyebrow}</p>
          <h2>{home.compare.title}</h2>
          <p>{home.compare.body}</p>
        </div>
        <div className="compare-pair">
          <article className="compare-card compare-card-before">
            <header>
              <strong>{home.compare.beforeLabel}</strong>
              <small>{home.compare.beforeNote}</small>
            </header>
            <p lang="ja" data-no-mojikumi>
              {home.compare.sampleText}
            </p>
          </article>
          <article className="compare-card compare-card-after">
            <header>
              <strong>{home.compare.afterLabel}</strong>
              <small>{home.compare.afterNote}</small>
            </header>
            <p lang="ja">{home.compare.sampleText}</p>
          </article>
        </div>
        <Link className="text-link" href={pageHref(locale, "playground")}>
          {home.compare.link}
          <ArrowRightIcon size={16} />
        </Link>
      </section>

      <section className="section-block section-split">
        <div className="section-heading">
          <p className="eyebrow">{home.surfaces.eyebrow}</p>
          <h2>{home.surfaces.title}</h2>
          <p>{home.surfaces.body}</p>
        </div>
        <div className="package-list">
          {home.surfaces.packages.map((item) => (
            <div key={item.name}>
              <span className="package-icon">
                <PackageGlyph name={item.icon} size={17} />
              </span>
              <code>{item.name}</code>
              <span className="package-description">{item.description}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="closing-panel">
        <p className="eyebrow">{home.closing.eyebrow}</p>
        <h2>{home.closing.title}</h2>
        <p>{home.closing.body}</p>
        <Link className="text-link" href={pageHref(locale, "playground")}>
          {home.closing.link}
          <ArrowRightIcon size={16} />
        </Link>
      </section>
    </main>
  );
}

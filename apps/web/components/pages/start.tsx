import Link from "next/link";
import type { Dictionary, Locale } from "../../content";
import { pageHref } from "../../lib/site";
import { ArrowRightIcon } from "../icons";
import { GuideSection } from "./guide-section";


export function StartPage({
  dictionary,
  locale
}: {
  dictionary: Dictionary;
  locale: Locale;
}) {
  const { start } = dictionary;

  return (
    <main className="page-shell">
      <header className="page-intro">
        <p className="eyebrow">{start.eyebrow}</p>
        <h1>{start.heading}</h1>
        <p>{start.lead}</p>
      </header>

      {/*
       * Only environments that have been checked on a real site appear here.
       * A card for something unverified would spend the reader's time on our
       * behalf.
       */}
      <section className="section-block start-choose">
        <div className="section-heading">
          <p className="eyebrow">{start.choose.eyebrow}</p>
          <h2>{start.choose.title}</h2>
          <p>{start.choose.body}</p>
        </div>
        <div className="start-choices">
          {start.guides.map((guide) => (
            <a className="start-choice" key={guide.id} href={`#${guide.id}`}>
              <span className="index-mark">{guide.index}</span>
              <h3>{guide.title}</h3>
              <p>{guide.summary}</p>
              <span className="start-choice-more" aria-hidden="true">
                <ArrowRightIcon size={16} />
              </span>
            </a>
          ))}
        </div>
        <p className="start-pending">{start.choose.pending}</p>
      </section>

      <div className="docs-layout">
        <aside className="docs-index">
          <p>{start.indexLabel}</p>
          {start.guides.map((guide) => (
            <a key={guide.id} href={`#${guide.id}`}>
              {guide.navLabel}
            </a>
          ))}
          <a href={`#${start.trouble.id}`}>{start.trouble.navLabel}</a>
        </aside>

        <article className="docs-content start-content">
          {start.guides.map((guide) => (
            <GuideSection key={guide.id} guide={guide} dictionary={dictionary} />
          ))}

          <section id={start.trouble.id}>
            <p className="section-number">{start.trouble.index}</p>
            <h2>{start.trouble.title}</h2>
            <p>{start.trouble.body}</p>
            <dl className="trouble-list">
              {start.trouble.items.map((item) => (
                <div key={item.term}>
                  <dt>{item.term}</dt>
                  <dd>{item.description}</dd>
                </div>
              ))}
            </dl>
          </section>
        </article>
      </div>

      <section className="next-step">
        <p>{start.nextStep.label}</p>
        <h2>{start.nextStep.title}</h2>
        <Link className="text-link" href={pageHref(locale, "playground")}>
          {start.nextStep.link}
          <ArrowRightIcon size={16} />
        </Link>
      </section>
    </main>
  );
}

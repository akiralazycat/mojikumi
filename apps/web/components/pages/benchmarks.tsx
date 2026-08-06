import Link from "next/link";
import type { Dictionary, Locale } from "../../content";
import { pageHref } from "../../lib/site";
import { ArrowRightIcon } from "../icons";
import { Table } from "../table";

export function BenchmarksPage({
  dictionary,
  locale
}: {
  dictionary: Dictionary;
  locale: Locale;
}) {
  const { benchmarks } = dictionary;

  return (
    <main className="page-shell">
      <header className="page-intro">
        <p className="eyebrow">{benchmarks.eyebrow}</p>
        <h1>{benchmarks.heading}</h1>
        <p>{benchmarks.lead}</p>
      </header>

      <section className="benchmark-status">
        <div>
          <span>{benchmarks.status.label}</span>
          <strong>{benchmarks.status.title}</strong>
        </div>
        <div className="benchmark-status-body">
          <p>{benchmarks.status.body}</p>
          <Link className="text-link" href={pageHref(locale, "playground")}>
            {benchmarks.status.link}
            <ArrowRightIcon size={16} />
          </Link>
        </div>
      </section>

      <section className="benchmark-results">
        <p className="eyebrow">{benchmarks.results.eyebrow}</p>
        <h2>{benchmarks.results.title}</h2>
        {benchmarks.results.tables.map((entry) => (
          <div key={entry.caption}>
            <h3>{entry.caption}</h3>
            <p>{entry.note}</p>
            <Table table={entry.table} />
          </div>
        ))}
      </section>

      <section className="benchmark-grid">
        {[benchmarks.metrics, benchmarks.matrix].map((group) => (
          <article key={group.eyebrow}>
            <p className="eyebrow">{group.eyebrow}</p>
            <h2>{group.title}</h2>
            <dl>
              {group.items.map((item) => (
                <div key={item.term}>
                  <dt>{item.term}</dt>
                  <dd>{item.description}</dd>
                </div>
              ))}
            </dl>
          </article>
        ))}
      </section>

      <section className="method-note">
        <p className="eyebrow">{benchmarks.method.label}</p>
        <h2>{benchmarks.method.title}</h2>
        <p>{benchmarks.method.body}</p>
      </section>
    </main>
  );
}

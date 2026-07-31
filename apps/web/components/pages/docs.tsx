import Link from "next/link";
import type { Dictionary, DocsTable, Locale } from "../../content";
import { pageHref } from "../../lib/site";
import { ArrowRightIcon } from "../icons";
import { Snippet } from "../snippet";

/*
 * Wide reference tables scroll on their own rather than pushing the page
 * sideways, and the first cell of each row is a heading for that row.
 */
function Table({ table }: { table: DocsTable }) {
  return (
    <div className="docs-table">
      <table>
        <thead>
          <tr>
            {table.head.map((cell) => (
              <th key={cell} scope="col">
                {cell}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row) => (
            <tr key={row[0]}>
              {row.map((cell, index) =>
                index === 0 ? (
                  <th key={index} scope="row">
                    {cell}
                  </th>
                ) : (
                  <td key={index}>{cell}</td>
                )
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function DocsPage({
  dictionary,
  locale
}: {
  dictionary: Dictionary;
  locale: Locale;
}) {
  const { docs } = dictionary;

  return (
    <main className="page-shell">
      <header className="page-intro">
        <p className="eyebrow">{docs.eyebrow}</p>
        <h1>{docs.heading}</h1>
        <p>{docs.lead}</p>
      </header>

      <div className="docs-layout">
        <aside className="docs-index">
          <p>{docs.indexLabel}</p>
          {docs.sections.map((section) => (
            <a key={section.id} href={`#${section.id}`}>
              {section.navLabel}
            </a>
          ))}
          <a href={`#${docs.policy.id}`}>{docs.policy.navLabel}</a>
        </aside>

        <article className="docs-content">
          {docs.sections.map((section) => (
            <section id={section.id} key={section.id}>
              <p className="section-number">{section.index}</p>
              <h2>{section.title}</h2>
              {section.body ? <p>{section.body}</p> : null}
              {section.code && section.language ? (
                <Snippet
                  language={section.language}
                  source={section.code}
                  title={section.title}
                  labels={dictionary.codeCopy}
                />
              ) : null}
              {section.table ? <Table table={section.table} /> : null}
              {section.list ? (
                <ul>
                  {section.list.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}

          <section id={docs.policy.id}>
            <p className="section-number">{docs.policy.index}</p>
            <h2>{docs.policy.title}</h2>
            <ul>
              {docs.policy.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        </article>
      </div>

      <section className="next-step">
        <p>{docs.nextStep.label}</p>
        <h2>{docs.nextStep.title}</h2>
        <Link className="text-link" href={pageHref(locale, "playground")}>
          {docs.nextStep.link}
          <ArrowRightIcon size={16} />
        </Link>
      </section>
    </main>
  );
}

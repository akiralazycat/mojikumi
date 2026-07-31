import { Fragment } from "react";
import Link from "next/link";
import type { Dictionary, DocsSection, Locale } from "../../content";
import { tokenize } from "../../lib/highlight";
import { pageHref } from "../../lib/site";
import { CodeBlock } from "../code-block";
import { ArrowRightIcon } from "../icons";

/* Highlighting happens here, while the page is prerendered. */
function Code({
  section,
  labels
}: {
  section: DocsSection;
  labels: Dictionary["docs"]["codeCopy"];
}) {
  return (
    <CodeBlock
      language={section.language}
      source={section.code}
      labels={{ ...labels, action: labels.action.replace("{title}", section.title) }}
    >
      {tokenize(section.code).map((token, index) =>
        token.type === "plain" ? (
          <Fragment key={index}>{token.value}</Fragment>
        ) : (
          <span key={index} className={`tok-${token.type}`}>
            {token.value}
          </span>
        )
      )}
    </CodeBlock>
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
              <Code section={section} labels={docs.codeCopy} />
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

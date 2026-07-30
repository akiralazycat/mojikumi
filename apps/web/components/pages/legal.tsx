import type { LegalPage } from "../../content";

export function LegalPageView({ page }: { page: LegalPage }) {
  return (
    <main className="page-shell">
      <header className="page-intro page-intro-compact">
        <p className="eyebrow">{page.eyebrow}</p>
        <h1>{page.heading}</h1>
        <p>{page.lead}</p>
      </header>

      <article className="legal-content">
        <p className="legal-updated">{page.updated}</p>
        {page.sections.map((section, index) => (
          <section key={section.title}>
            <p className="section-number">
              {String(index + 1).padStart(2, "0")}
            </p>
            <h2>{section.title}</h2>
            {section.list ? (
              <ul>
                {section.list.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : null}
            {section.body?.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </section>
        ))}
      </article>
    </main>
  );
}

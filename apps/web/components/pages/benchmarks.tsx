import type { Dictionary } from "../../content";

export function BenchmarksPage({ dictionary }: { dictionary: Dictionary }) {
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
        <p>{benchmarks.status.body}</p>
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

import Link from "next/link";
import type { Dictionary, Locale } from "../../content";
import { chemUrl, mathUrl, pageHref } from "../../lib/site";
import { ArrowRightIcon } from "../icons";

export function HomePage({
  dictionary,
  locale
}: {
  dictionary: Dictionary;
  locale: Locale;
}) {
  const { home } = dictionary;
  const tools = locale === "ja"
    ? {
        eyebrow: "Mojikumi Tools",
        title: "表記を、使う場所へ。",
        body: "文章だけでなく、数式と化学式も。Mojikumiの考え方を、それぞれの表記に合わせた入力ツールへ広げています。",
        math: {
          title: "Mojikumi Math",
          description: "数式を見たまま組み上げ、Readable・LaTeX・Markdown・MathMLへ。",
          action: "Mathを開く"
        },
        chem: {
          title: "Mojikumi Chem",
          description: "化学式と反応式を解析し、原子数と電荷を確認して文書・Web・AIへ。",
          action: "Chemを開く"
        }
      }
    : {
        eyebrow: "Mojikumi Tools",
        title: "Notation, ready for where it goes next.",
        body: "Mojikumi extends beyond prose into focused tools for mathematical and chemical notation.",
        math: {
          title: "Mojikumi Math",
          description: "Compose equations visually, then carry them into readable text, LaTeX, Markdown, or MathML.",
          action: "Open Math"
        },
        chem: {
          title: "Mojikumi Chem",
          description: "Parse formulas and reactions, inspect atoms and charge, then carry them into documents, the Web, or AI.",
          action: "Open Chem"
        }
      };

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
            href={pageHref(locale, "start")}
          >
            {home.primaryAction}
          </Link>
          <Link
            className="button button-secondary"
            href={pageHref(locale, "playground")}
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
              <span className="index-mark">{item.index}</span>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

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
              <code>{item.name}</code>
              <span className="package-description">{item.description}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="section-block section-split" aria-labelledby="mojikumi-tools-title">
        <div className="section-heading">
          <p className="eyebrow">{tools.eyebrow}</p>
          <h2 id="mojikumi-tools-title">{tools.title}</h2>
          <p>{tools.body}</p>
        </div>
        <div className="package-list">
          <div>
            <strong>{tools.math.title}</strong>
            <span className="package-description">
              {tools.math.description}{" "}
              <a className="text-link" href={mathUrl}>{tools.math.action} <ArrowRightIcon size={14} /></a>
            </span>
          </div>
          <div>
            <strong>{tools.chem.title}</strong>
            <span className="package-description">
              {tools.chem.description}{" "}
              <a className="text-link" href={chemUrl}>{tools.chem.action} <ArrowRightIcon size={14} /></a>
            </span>
          </div>
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

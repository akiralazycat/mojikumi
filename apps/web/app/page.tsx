import Link from "next/link";

const layers = [
  {
    index: "01",
    title: "CSS first",
    body: "text-spacing-trimやtext-autospaceなど、育ちつつあるWeb標準を最優先します。"
  },
  {
    index: "02",
    title: "Small fallback",
    body: "ブラウザに足りない処理だけを補い、本文・コピー結果・読み上げ内容を守ります。"
  },
  {
    index: "03",
    title: "Framework ready",
    body: "素のDOM、React、Markdown / MDXへ、同じ字組み方針を持ち込めます。"
  }
] as const;

const packages = [
  ["mojikumi", "通常利用向けの統合API"],
  ["@mojikumi/css", "標準CSS中心のプリセット"],
  ["@mojikumi/dom", "ブラウザ差を補うDOM層"],
  ["@mojikumi/react", "ComponentとHook"],
  ["@mojikumi/rehype", "Markdown / MDX連携"]
] as const;

export default function HomePage() {
  return (
    <main>
      <section className="home-hero">
        <p className="eyebrow">Japanese typography compatibility layer</p>
        <h1>
          Webの日本語を
          <br />
          <em>端正にする</em>
        </h1>
        <p className="hero-copy">
          Mojikumiは独自の組版エンジンではありません。Web標準を土台に、
          約物のアキや和欧文間の間隔など、まだ揃わない部分を静かに補います。
        </p>
        <div className="hero-actions">
          <Link className="button button-primary" href="/playground/">
            Playgroundで比較する
          </Link>
          <Link className="button button-secondary" href="/docs/">
            導入方法を見る
          </Link>
        </div>
        <div className="hero-specimen">
          <span className="hero-specimen-mark" aria-hidden="true" data-no-mojikumi>
            『
          </span>
          <div>
            <small>TYPE SAMPLE / 01</small>
            <p>
              『美しい本文』は、文字そのものだけでなく、
              文字と文字のあいだに宿ります。
            </p>
          </div>
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <p className="eyebrow">Principles</p>
          <h2>標準を活かす穏やかな補完</h2>
        </div>
        <div className="principle-grid">
          {layers.map((layer) => (
            <article key={layer.index}>
              <span>{layer.index}</span>
              <h3>{layer.title}</h3>
              <p>{layer.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-block section-split">
        <div className="section-heading">
          <p className="eyebrow">One policy, several surfaces</p>
          <h2>使う場所に合わせて必要な層だけ</h2>
          <p>
            CSSだけの導入から、DOMフォールバック、React、MDXまで。
            プロジェクトの構成を大きく変えずに始められます。
          </p>
        </div>
        <div className="package-list">
          {packages.map(([name, description]) => (
            <div key={name}>
              <code>{name}</code>
              <span>{description}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="closing-panel">
        <p className="eyebrow">See the difference</p>
        <h2>同じ文章で違いを確かめる</h2>
        <p>
          約物調整なし、標準CSS、Mojikumiの3つを並べて、
          行幅やフォントを変えながら比較できます。
        </p>
        <Link className="text-link" href="/playground/">
          Playgroundを開く <span aria-hidden="true">→</span>
        </Link>
      </section>
    </main>
  );
}

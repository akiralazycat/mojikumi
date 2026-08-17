import { MathWorkspace } from "../components/math-workspace";

export default function HomePage() {
  return (
    <div className="site-shell">
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Mojikumi Math ホーム">
          <span className="brand-mark" aria-hidden="true">
            ∫
          </span>
          <span>Mojikumi</span>
          <span className="brand-product">Math</span>
        </a>
        <div className="header-meta">
          <span className="status-dot" aria-hidden="true" />
          <span>Prototype 0.1 · ログイン不要</span>
        </div>
      </header>

      <main id="top">
        <section className="intro" aria-labelledby="intro-title">
          <p className="eyebrow">Mathematical input, reconsidered</p>
          <h1 id="intro-title">
            数式を、<em>思ったまま</em>入力する。
          </h1>
          <p>
            見たまま組み立てて、AI、LaTeX、Markdown、MathMLへ。
            Mojikumi Mathは、数式を書くことと使うことのあいだをつなぐ入力レイヤーです。
          </p>
        </section>

        <MathWorkspace />

        <section className="principles" aria-labelledby="principles-title">
          <div className="section-heading">
            <p className="eyebrow">Product principles</p>
            <h2 id="principles-title">書くための摩擦だけを、なくす。</h2>
          </div>
          <div className="principle-grid">
            <article>
              <span>01</span>
              <h3>見たまま入力</h3>
              <p>LaTeXコマンドではなく、組版された数式そのものに触れる。</p>
            </article>
            <article>
              <span>02</span>
              <h3>一度入力、どこへでも</h3>
              <p>同じ構造から、人間にもAIにもWebにも適した表現を取り出す。</p>
            </article>
            <article>
              <span>03</span>
              <h3>中立な入力レイヤー</h3>
              <p>答えを囲い込まず、ユーザーが選ぶ道具へきれいに渡す。</p>
            </article>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="brand footer-brand">
          <span className="brand-mark" aria-hidden="true">∫</span>
          <span>Mojikumi Math</span>
        </div>
        <p>Mathematical typography &amp; input.</p>
      </footer>
    </div>
  );
}

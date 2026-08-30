import { MathWorkspace } from "../components/math-workspace";
import { ThemeToggle } from "../components/theme-toggle";

const repositoryUrl = "https://github.com/akiralazycat/mojikumi";
const mojikumiUrl = "https://mojikumi.jp";
const chemUrl = "https://chem.mojikumi.jp";

export default function HomePage() {
  return (
    <div className="site-shell">
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Mojikumi Math ホーム">
          <span className="brand-mark" aria-hidden="true"><span className="brand-integral">∫</span></span>
          <span className="brand-name">Mojikumi</span>
          <span className="brand-product">Math</span>
        </a>
        <div className="header-actions">
          <nav className="header-nav" aria-label="ページ内ナビゲーション">
            <a href="#editor">入力</a>
            <a href="#use-cases">使い方</a>
            <a href="#privacy">データ方針</a>
          </nav>
          <ThemeToggle />
        </div>
      </header>

      <main id="top">
        <section className="intro" aria-labelledby="intro-title">
          <p className="eyebrow">Mathematical input, reconsidered</p>
          <h1 id="intro-title">数式を<em>自然に</em><span className="intro-action">組み上げる</span></h1>
          <p>
            <span>見たまま組み立てて、テキスト、LaTeX、Markdown、MathMLへ。</span>{" "}
            <span className="intro-detail">Mojikumi Mathは、数式を書くことと使うことのあいだをつなぐ入力レイヤーです。</span>
          </p>
        </section>

        <div id="editor">
          <MathWorkspace />
        </div>

        <section className="product-story" id="use-cases" aria-labelledby="use-cases-title">
          <div className="section-heading">
            <p className="eyebrow">One expression, many destinations</p>
            <h2 id="use-cases-title">ひとつの数式を、<span className="section-title-tail">使う場所に合わせて</span></h2>
            <p>入力しづらい構造は画面上で組み、必要な形式を選んでコピー。書き直すことなく、次の道具へ渡せます。</p>
          </div>

          <div className="use-case-grid">
            <article>
              <span className="use-case-number">01</span>
              <h3>読めるテキストとして</h3>
              <p>ブログ、メモ、チャットなど、数式記法を前提にしない場所へ読みやすいテキストとして貼り付けられます。</p>
              <p className="use-case-detail">Readableでは安全な範囲だけUnicode記号へ置き換えます。AIへ渡す場合は目的に合った依頼文も付けられます。</p>
            </article>
            <article>
              <span className="use-case-number">02</span>
              <h3>文書の数式として</h3>
              <p>LaTeXやMarkdownへ変換し、論文、教材、技術文書へ。Visual編集とソース編集をいつでも切り替えられます。</p>
              <p className="use-case-detail">Strict βでは、構造を保った簡潔なプレーンテキストも試せます。</p>
            </article>
            <article>
              <span className="use-case-number">03</span>
              <h3>Webの要素として</h3>
              <p>MathMLや埋め込み用マークアップを取り出し、WebページやCMSの中へ整った数式を運べます。</p>
              <p className="use-case-detail">入力元はひとつ。用途が変わっても、式を最初から作り直す必要はありません。</p>
            </article>
          </div>
        </section>

        <section className="privacy-section" id="privacy" aria-labelledby="privacy-title">
          <div className="privacy-copy">
            <p className="eyebrow">Local by design</p>
            <h2 id="privacy-title">数式は、この端末の中で</h2>
            <p>入力内容はサーバーへ送らず、下書きもブラウザ内に保存します。初回の読み込み後は、オフラインでも入力・変換・コピーを続けられます。</p>
          </div>
          <ul className="privacy-points" aria-label="データ方針">
            <li><strong>ログイン不要</strong><span>アカウントを作らず、すぐに使えます</span></li>
            <li><strong>端末内保存</strong><span>下書きはこのブラウザだけに残ります</span></li>
            <li><strong>数式を送信しない</strong><span>入力内容をAnalyticsにも含めません</span></li>
            <li><strong>オフライン対応</strong><span>初回訪問後も主要機能を利用できます</span></li>
          </ul>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-main">
          <div className="footer-brand">
            <a className="brand" href="#top">
              <span className="brand-mark" aria-hidden="true"><span className="brand-integral">∫</span></span>
              <span className="brand-name">Mojikumi Math</span>
            </a>
            <p>数式を書くことと、使うことのあいだをつなぐ</p>
            <span className="footer-note">Public beta · ログイン不要</span>
          </div>
          <div className="footer-links">
            <nav aria-label="Math">
              <p className="footer-heading">Math</p>
              <a href="#editor">数式を入力</a>
              <a href="#use-cases">使い方</a>
              <a href="#privacy">データ方針</a>
            </nav>
            <nav aria-label="Mojikumi">
              <p className="footer-heading">Mojikumi</p>
              <a href={mojikumiUrl}>Mojikumi</a>
              <a href={chemUrl}>Mojikumi Chem</a>
            </nav>
            <nav aria-label="Project">
              <p className="footer-heading">Project</p>
              <a href={repositoryUrl}>GitHub</a>
            </nav>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© Mojikumi</span>
          <span className="footer-dot" aria-hidden="true" />
          <span>Mathematical typography &amp; input</span>
          <span className="footer-credit">math.mojikumi.jp</span>
        </div>
      </footer>
    </div>
  );
}

import { ChemWorkspace } from "../components/chem-workspace";
import { ThemeToggle } from "../components/theme-toggle";

export default function HomePage() {
  return (
    <div className="site-shell">
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Mojikumi Chem ホーム">
          <span className="brand-mark" aria-hidden="true">
            <span className="brand-atom">C</span><span className="brand-index">6</span>
          </span>
          <span className="brand-name">Mojikumi</span>
          <span className="brand-product">Chem</span>
        </a>
        <div className="header-actions">
          <nav className="header-nav" aria-label="ページ内ナビゲーション">
            <a href="#editor">入力</a>
            <a href="#destinations">使い方</a>
            <a href="#privacy">データ方針</a>
          </nav>
          <ThemeToggle />
        </div>
      </header>

      <main id="top">
        <section className="intro" aria-labelledby="intro-title">
          <div className="intro-copy">
            <p className="eyebrow">Chemical notation, reconsidered</p>
            <h1 id="intro-title">化学式を、<br /><em>意味から</em>組み上げる</h1>
            <p>下付き文字や電荷、反応矢印を気にせず入力。ひとつの化学表現を、文書・Web・AIで使える形式へ変換します。</p>
          </div>
          <div className="hero-specimen" aria-hidden="true">
            <span className="specimen-number">01</span>
            <div className="specimen-formula">CH<sub>3</sub>COOH</div>
            <div className="specimen-line" />
            <div className="specimen-caption">acetic acid</div>
            <div className="orbital orbital-a" />
            <div className="orbital orbital-b" />
          </div>
        </section>

        <div id="editor"><ChemWorkspace /></div>

        <section className="destinations" id="destinations" aria-labelledby="destinations-title">
          <div className="section-heading">
            <p className="eyebrow">One expression, many destinations</p>
            <h2 id="destinations-title">ひとつの反応式を、<br />使う場所に合わせて。</h2>
            <p>画面で確認しながら組み、必要な形式を選んでコピー。下付きや電荷を場所ごとに書き直す必要はありません。</p>
          </div>
          <div className="destination-grid">
            <article>
              <span>01</span><h3>人が読むテキストへ</h3>
              <p>メモ、チャット、教材には Unicode の下付き・上付き文字で。専用レンダラーがない場所でも読みやすさを保ちます。</p>
            </article>
            <article>
              <span>02</span><h3>文書の化学式へ</h3>
              <p>mhchem、LaTeX、Markdownへ変換し、論文、レポート、技術文書へそのまま渡せます。</p>
            </article>
            <article>
              <span>03</span><h3>WebとAIへ</h3>
              <p>意味を保つHTMLと、説明・係数調整・物質名・反応分析の依頼文を取り出せます。</p>
            </article>
          </div>
        </section>

        <section className="roadmap" aria-labelledby="roadmap-title">
          <div>
            <p className="eyebrow">Start precise, grow structural</p>
            <h2 id="roadmap-title">まず反応式。<br />次に、構造式へ。</h2>
          </div>
          <ol>
            <li><span>Now</span><strong>化学式・反応式</strong><small>下付き、電荷、状態、反応矢印、標準形式への変換</small></li>
            <li><span>Next</span><strong>反応条件・酸化数</strong><small>触媒、温度、電子移動、可逆反応の詳細な構造化</small></li>
            <li><span>Later</span><strong>構造式・Lewis構造</strong><small>視覚編集からSMILES・InChIへつなぐ分子表現</small></li>
          </ol>
        </section>

        <section className="privacy-section" id="privacy" aria-labelledby="privacy-title">
          <div className="privacy-copy">
            <p className="eyebrow">Local by design</p>
            <h2 id="privacy-title">化学式は、<br />この端末の中で。</h2>
            <p>入力内容はサーバーへ送らず、下書きもブラウザ内だけに保存します。</p>
          </div>
          <ul>
            <li><strong>ログイン不要</strong><span>アカウントを作らず、すぐに使えます</span></li>
            <li><strong>端末内保存</strong><span>下書きはこのブラウザだけに残ります</span></li>
            <li><strong>式を送信しない</strong><span>入力内容をAnalyticsにも含めません</span></li>
            <li><strong>オフライン対応</strong><span>初回訪問後も主要機能を利用できます</span></li>
          </ul>
        </section>
      </main>

      <footer className="site-footer">
        <div>
          <a className="brand" href="#top">
            <span className="brand-mark" aria-hidden="true"><span className="brand-atom">C</span><span className="brand-index">6</span></span>
            <span className="brand-name">Mojikumi Chem</span>
          </a>
          <p>化学表現を組むことと、使うことのあいだをつなぐ</p>
        </div>
        <nav aria-label="フッター">
          <a href="#editor">化学式を入力</a>
          <a href="#destinations">使い方</a>
          <a href="#privacy">データ方針</a>
          <a href="https://mojikumi.jp">Mojikumi本体</a>
        </nav>
        <div className="footer-bottom">
          <span>© Mojikumi</span><span>Public beta</span><span className="footer-domain">chem.mojikumi.jp</span>
        </div>
      </footer>
    </div>
  );
}

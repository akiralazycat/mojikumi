import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Docs",
  description: "Mojikumiの導入方法とパッケージ構成"
};

export default function DocsPage() {
  return (
    <main className="page-shell">
      <header className="page-intro">
        <p className="eyebrow">Documentation</p>
        <h1>小さく導入し必要な分だけ補う</h1>
        <p>
          まず標準CSSを適用し、必要な環境でだけDOMフォールバックを追加します。
          ReactやMDXでも、本文を変更しない方針は共通です。
        </p>
      </header>

      <div className="docs-layout">
        <aside className="docs-index">
          <p>このページ</p>
          <a href="#css">CSS</a>
          <a href="#dom">DOM</a>
          <a href="#react">React</a>
          <a href="#mdx">Markdown / MDX</a>
          <a href="#policy">設計方針</a>
        </aside>

        <article className="docs-content">
          <section id="css">
            <p className="section-number">01</p>
            <h2>CSSだけで使う</h2>
            <p>
              最初はCSSプリセットだけで構いません。標準CSSを理解するブラウザは、
              その機能をそのまま使います。
            </p>
            <pre>
              <code>{`import "mojikumi/css";

<article lang="ja" className="mjk mjk-book">
  <p>『Webの日本語』を端正にする</p>
</article>`}</code>
            </pre>
          </section>

          <section id="dom">
            <p className="section-number">02</p>
            <h2>DOMフォールバックを追加する</h2>
            <p>
              約物の連続や行頭・行末など、標準CSSだけでは揃わない箇所を実行時に補います。
            </p>
            <pre>
              <code>{`import "mojikumi/css";
import { mojikumi } from "mojikumi";

const instance = mojikumi(".article", {
  preset: "book",
  precision: "auto"
});`}</code>
            </pre>
          </section>

          <section id="react">
            <p className="section-number">03</p>
            <h2>Reactで使う</h2>
            <p>
              SSRでは通常のHTMLを出力し、必要なDOM補完はマウント後に行います。
            </p>
            <pre>
              <code>{`import { Mojikumi } from "@mojikumi/react";

export function Article({ children }) {
  return (
    <Mojikumi as="article" preset="book">
      {children}
    </Mojikumi>
  );
}`}</code>
            </pre>
          </section>

          <section id="mdx">
            <p className="section-number">04</p>
            <h2>Markdown / MDXで使う</h2>
            <pre>
              <code>{`import rehypeMojikumi from "@mojikumi/rehype";

export default {
  rehypePlugins: [
    [rehypeMojikumi, { preset: "editorial" }]
  ]
};`}</code>
            </pre>
          </section>

          <section id="policy">
            <p className="section-number">05</p>
            <h2>設計方針</h2>
            <ul>
              <li>標準CSSを最優先する</li>
              <li>本文の文字列、コピー結果、読み上げ内容を変えない</li>
              <li>ネイティブ実装の進展に合わせてフォールバックを削除できるようにする</li>
              <li>未知のフォントでは過度に詰めない</li>
            </ul>
          </section>
        </article>
      </div>

      <section className="next-step">
        <p>次のステップ</p>
        <h2>実際の文章で見比べる</h2>
        <Link className="text-link" href="/playground/">
          Playgroundへ <span aria-hidden="true">→</span>
        </Link>
      </section>
    </main>
  );
}

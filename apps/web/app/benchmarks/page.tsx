import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Benchmarks",
  description: "Mojikumiの性能計測方針と公開予定の指標"
};

const metrics = [
  ["初期処理", "本文を初めて解析・補完するまでの時間"],
  ["再評価", "リサイズやフォント読み込み後の更新時間"],
  ["DOM増加量", "補完によって追加される要素数"],
  ["メモリ", "長文・複数記事でのヒープ使用量"]
] as const;

const environments = [
  ["Chromium", "最新版 / macOS・Linux"],
  ["Firefox", "最新版 / macOS・Linux"],
  ["WebKit", "最新版 / macOS"],
  ["Content", "1千字・1万字・複数段落"]
] as const;

export default function BenchmarksPage() {
  return (
    <main className="page-shell">
      <header className="page-intro">
        <p className="eyebrow">Performance & compatibility</p>
        <h1>速さと補完の小ささを測る</h1>
        <p>
          Mojikumiは、ブラウザ標準が育つほど仕事を減らせる設計です。
          処理時間とともに、追加DOM量や再評価コストも継続的に記録します。
        </p>
      </header>

      <section className="benchmark-status">
        <div>
          <span>Current status</span>
          <strong>Measurement pipeline in preparation</strong>
        </div>
        <p>
          現在は計測条件を固定している段階です。比較可能なデータが揃うまで、
          推測値や単一端末の結果は公開しません。
        </p>
      </section>

      <section className="benchmark-grid">
        <article>
          <p className="eyebrow">Metrics</p>
          <h2>測定するもの</h2>
          <dl>
            {metrics.map(([name, description]) => (
              <div key={name}>
                <dt>{name}</dt>
                <dd>{description}</dd>
              </div>
            ))}
          </dl>
        </article>
        <article>
          <p className="eyebrow">Matrix</p>
          <h2>揃える環境</h2>
          <dl>
            {environments.map(([name, description]) => (
              <div key={name}>
                <dt>{name}</dt>
                <dd>{description}</dd>
              </div>
            ))}
          </dl>
        </article>
      </section>

      <section className="method-note">
        <p className="section-number">Method</p>
        <h2>再現できる結果だけを公開する</h2>
        <p>
          計測コード、入力テキスト、ブラウザバージョン、フォント条件をリポジトリに残し、
          CI上の固定条件で得たJSONをこのページへ反映します。
          端末依存のライブ計測は、正式結果と分けて扱います。
        </p>
      </section>
    </main>
  );
}

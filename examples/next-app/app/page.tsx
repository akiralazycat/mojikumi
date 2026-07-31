import { Mojikumi } from "@mojikumi/react";

/*
 * This page is rendered on the server as ordinary HTML: view source and the
 * article is exactly the text below, with no wrapping and no extra markup.
 * Mojikumi measures and adjusts after hydration, and only where the browser
 * cannot do the work itself.
 *
 * Each sentence stays on one line. A line break inside Japanese text collapses
 * into a literal space in JSX, which would put a gap in the middle of a word.
 */
export default function Page() {
  return (
    <main>
      <h1>Mojikumi + Next.js</h1>

      <Mojikumi as="article" preset="book" className="article">
        <p>
          『日本語組版処理の要件（JLREQ）』は、行末に置いた終わり括弧類や句読点について「その後ろを原則として二分アキとする」と定めています。約物が連続する箇所、たとえば「『引用』」や〈補足（注記）〉でアキを重ねないのも、同じ体裁上の判断です。
        </p>
        <p>
          Next.jsやTypeScriptのような欧文が地の文に混ざるときは、和文との境目にわずかな間隔が入ります。2024年のように数字が続く場合も同じです。
        </p>
      </Mojikumi>

      {/* Nothing here is touched: the same passage without the component. */}
      <article className="article" lang="ja">
        <p>
          『日本語組版処理の要件（JLREQ）』は、行末に置いた終わり括弧類や句読点について「その後ろを原則として二分アキとする」と定めています。
        </p>
      </article>
    </main>
  );
}

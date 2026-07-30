import type { Metadata } from "next";
import { Playground } from "./playground";

export const metadata: Metadata = {
  title: "Playground",
  description: "未調整、標準CSS、Mojikumiの日本語字組みを比較します"
};

export default function PlaygroundPage() {
  return (
    <main className="page-shell page-shell-wide">
      <header className="page-intro page-intro-compact">
        <p className="eyebrow">Interactive comparison</p>
        <h1>同じ文章で字組みを比べる</h1>
        <p>
          約物調整なし、標準CSS、Mojikumiを並べて表示します。
          AutoとFallback demoを切り替えると、標準実装と互換補完の役割も確認できます。
        </p>
      </header>
      <Playground />
    </main>
  );
}

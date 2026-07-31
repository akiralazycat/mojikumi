import type { Metadata } from "next";
import type { ReactNode } from "react";
/* The stylesheet is the whole of the CSS-only layer; import it once. */
import "mojikumi/css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mojikumi + Next.js",
  description: "Mojikumiを組み込んだ最小構成のNext.jsプロジェクト"
};

/* lang="ja" is what turns on the browser's own line breaking rules. */
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}

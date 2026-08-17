import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";

const themeScript = `
try {
  const saved = localStorage.getItem("mojikumi.math.theme");
  const theme = saved === "light" || saved === "dark"
    ? saved
    : matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
} catch {}
`;

export const metadata: Metadata = {
  metadataBase: new URL("https://math.mojikumi.jp"),
  title: "Mojikumi Math — 数式を、思ったまま入力する。",
  description:
    "スマホでも直感的に数式を組み立て、AI・LaTeX・Markdown・MathML・Webへ持ち出せる数式入力インターフェース。",
  openGraph: {
    siteName: "Mojikumi Math",
    title: "Mojikumi Math — 数式を、思ったまま入力する。",
    description: "数式を書くことと、使うことのあいだをつなぐ入力レイヤー。",
    type: "website"
  }
};

export const viewport: Viewport = {
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f1f5f8" },
    { media: "(prefers-color-scheme: dark)", color: "#07121d" }
  ]
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <div className="ambient-wash" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}

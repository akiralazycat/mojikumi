import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { PwaRegistration } from "../components/pwa-registration";
import "./globals.css";
import "./a11y.css";
import "./reaction-awareness.css";
import "./output-ux.css";

const themeScript = `
try {
  const saved = localStorage.getItem("mojikumi.chem.theme");
  const theme = saved === "light" || saved === "dark"
    ? saved
    : matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  const color = theme === "dark" ? "#111512" : "#f4f1e8";
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
  document.documentElement.style.backgroundColor = color;
} catch {}
`;

export const metadata: Metadata = {
  metadataBase: new URL("https://chem.mojikumi.jp"),
  title: "Mojikumi Chem — 化学式を自然に組み上げる",
  description: "スマホでも化学式と反応式を組み立て、原子数と電荷を検証。係数を整え、mhchem・LaTeX・Markdown・HTML・AIへ持ち出せる入力ツール。",
  manifest: "/manifest.webmanifest",
  applicationName: "Mojikumi Chem",
  appleWebApp: { capable: true, title: "Mojikumi Chem", statusBarStyle: "default" },
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" }
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }]
  },
  openGraph: {
    siteName: "Mojikumi Chem",
    title: "Mojikumi Chem — 化学式を自然に組み上げる",
    description: "化学表現を組むことと、使うことのあいだをつなぐ入力レイヤー。",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Mojikumi Chem — 化学式を、意味から組み上げる" }]
  },
  twitter: {
    card: "summary_large_image",
    title: "Mojikumi Chem — 化学式を自然に組み上げる",
    description: "化学表現を組むことと、使うことのあいだをつなぐ入力レイヤー。",
    images: ["/og.png"]
  }
};

export const viewport: Viewport = {
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f1e8" },
    { media: "(prefers-color-scheme: dark)", color: "#111512" }
  ]
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: themeScript }} /></head>
      <body>
        <div className="ambient-wash" aria-hidden="true" />
        <PwaRegistration />
        {children}
      </body>
    </html>
  );
}

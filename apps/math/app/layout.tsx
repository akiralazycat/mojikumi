import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { PwaRegistration } from "../components/pwa-registration";
import "./globals.css";

const themeScript = `
try {
  const saved = localStorage.getItem("mojikumi.math.theme");
  const theme = saved === "light" || saved === "dark"
    ? saved
    : matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  const color = theme === "dark" ? "#07121d" : "#f1f5f8";
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
  document.documentElement.style.backgroundColor = color;
} catch {}
`;

export const metadata: Metadata = {
  metadataBase: new URL("https://math.mojikumi.jp"),
  title: "Mojikumi Math — 数式を自然に組み上げる",
  description:
    "スマホでも直感的に数式を組み立て、AI・LaTeX・Markdown・MathML・Webへ持ち出せる数式入力インターフェース。",
  manifest: "/manifest.webmanifest",
  applicationName: "Mojikumi Math",
  appleWebApp: {
    capable: true,
    title: "Mojikumi Math",
    statusBarStyle: "default"
  },
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" }
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }]
  },
  openGraph: {
    siteName: "Mojikumi Math",
    title: "Mojikumi Math — 数式を自然に組み上げる",
    description: "数式を書くことと、使うことのあいだをつなぐ入力レイヤー。",
    type: "website",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Mojikumi Math — 数式を自然に組み上げる"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Mojikumi Math — 数式を自然に組み上げる",
    description: "数式を書くことと、使うことのあいだをつなぐ入力レイヤー。",
    images: ["/og.png"]
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
        <PwaRegistration />
        {children}
      </body>
    </html>
  );
}

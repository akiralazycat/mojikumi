import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { Shippori_Mincho, Zen_Maru_Gothic } from "next/font/google";
import "@mojikumi/css/mojikumi.css";
import "./globals.css";
import { SiteMojikumi } from "./site-mojikumi";
import { ThemeToggle } from "./theme-toggle";

const shipporiMincho = Shippori_Mincho({
  variable: "--font-shippori-mincho",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  preload: false,
  display: "swap"
});

const zenMaruGothic = Zen_Maru_Gothic({
  variable: "--font-zen-maru-gothic",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  preload: false,
  display: "swap"
});

const themeScript = `
try {
  const saved = localStorage.getItem("mojikumi.theme");
  const theme = saved === "light" || saved === "dark"
    ? saved
    : matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  const color = theme === "dark" ? "#120d10" : "#f5f0ea";
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
  document.documentElement.style.backgroundColor = color;
} catch {}
`;

export const metadata: Metadata = {
  metadataBase: new URL("https://mojikumi.jp"),
  title: {
    default: "Mojikumi — Webの日本語を端正にする",
    template: "%s — Mojikumi"
  },
  description:
    "標準CSSを優先し、ブラウザに足りない部分だけを補う、日本語字組みの互換レイヤー。",
  openGraph: {
    locale: "ja_JP",
    siteName: "Mojikumi",
    type: "website",
    images: [
      {
        url: "/og-enji.png",
        width: 1200,
        height: 630,
        alt: "Mojikumi — Webの日本語を端正にする"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og-enji.png"]
  }
};

export const viewport: Viewport = {
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f0ea" },
    { media: "(prefers-color-scheme: dark)", color: "#120d10" }
  ]
};

const navigation = [
  { href: "/docs/", label: "Docs" },
  { href: "/playground/", label: "Playground" },
  { href: "/benchmarks/", label: "Benchmarks" }
] as const;

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      data-scroll-behavior="smooth"
      className={`${shipporiMincho.variable} ${zenMaruGothic.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <div className="ambient-wash" aria-hidden="true" />
        <SiteMojikumi>
          <header className="site-header">
            <Link className="brand" href="/" aria-label="Mojikumi ホーム">
              <span className="brand-mark" aria-hidden="true" data-no-mojikumi>
                「
              </span>
              <span>Mojikumi</span>
            </Link>
            <div className="header-actions">
              <nav aria-label="メインナビゲーション">
                {navigation.map((item) => (
                  <Link key={item.href} href={item.href}>
                    {item.label}
                  </Link>
                ))}
                <a href="https://github.com/akiralazycat/mojikumi">GitHub</a>
              </nav>
              <ThemeToggle />
            </div>
          </header>
          {children}
          <footer className="site-footer">
            <p>Webの日本語を端正にする</p>
            <span>JLREQ × CSS Text</span>
          </footer>
        </SiteMojikumi>
      </body>
    </html>
  );
}

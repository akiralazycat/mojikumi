import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Mojikumi Math",
    short_name: "Math",
    description: "数式を組み立て、AI・LaTeX・Markdown・MathML・Webへ持ち出す入力レイヤー。",
    start_url: "/",
    display: "standalone",
    background_color: "#f1f5f8",
    theme_color: "#245b87",
    lang: "ja",
    orientation: "any",
    categories: ["productivity", "utilities", "education"],
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any"
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any"
      },
      {
        src: "/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable"
      }
    ]
  };
}

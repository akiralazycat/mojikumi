import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Mojikumi Chem",
    short_name: "Chem",
    description: "化学式・反応式を組み立てて検証し、係数を整えて文書・Web・AIへ持ち出す入力レイヤー。",
    start_url: "/",
    display: "standalone",
    background_color: "#f4f1e8",
    theme_color: "#2f6b4f",
    lang: "ja",
    orientation: "any",
    categories: ["productivity", "utilities", "education"],
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" }
    ]
  };
}

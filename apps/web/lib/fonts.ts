import { Shippori_Mincho, Zen_Maru_Gothic } from "next/font/google";

export const shipporiMincho = Shippori_Mincho({
  variable: "--font-shippori-mincho",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  preload: false,
  display: "swap"
});

export const zenMaruGothic = Zen_Maru_Gothic({
  variable: "--font-zen-maru-gothic",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  preload: false,
  display: "swap"
});

export const fontVariables = `${shipporiMincho.variable} ${zenMaruGothic.variable}`;

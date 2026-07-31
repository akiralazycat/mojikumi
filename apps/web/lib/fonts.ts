import { Noto_Sans_JP, Shippori_Mincho, Zen_Maru_Gothic } from "next/font/google";

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

/*
 * YakuHanJP is a punctuation-only subset cut from Noto Sans JP, so the
 * Playground pairs it with the face it was derived from rather than with the
 * site's own gothic. Only the regular weight is needed for the sample text,
 * and preload stays off because a single comparison card is the only user.
 */
export const notoSansJp = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  weight: ["400"],
  preload: false,
  display: "swap"
});

export const fontVariables = `${shipporiMincho.variable} ${zenMaruGothic.variable} ${notoSansJp.variable}`;

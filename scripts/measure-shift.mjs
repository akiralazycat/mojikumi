import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { chromium } from "playwright-core";

/*
 * Measures what the pasted script tag costs a page in layout shift.
 *
 * The question is not whether Mojikumi reflows the article — it does, that is
 * the point — but whether the reflow lands before or after the reader sees the
 * text. In the head the stylesheet arrives first and nothing moves. At the end
 * of the body it arrives after the first paint, and a narrow measure shifts.
 *
 * Run against a built bundle:
 *   npm run build:packages && npm run build:browser && npm run measure:shift
 *
 * Chromium comes from PLAYWRIGHT_BROWSERS_PATH, or set MOJIKUMI_CHROMIUM to an
 * executable. Numbers depend on the machine; the shape of the result does not.
 */

const BUNDLE = resolve("packages/mojikumi/dist/mojikumi.browser.js");

/** One paragraph of the specimen the site uses, so the text is not synthetic. */
const PARAGRAPH =
  "『日本語組版処理の要件（JLREQ）』は、行末に置いた終わり括弧類や句読点について「その後ろを原則として二分アキとする」と定めたうえで、行の調整処理で詰めてベタ組にしてもよい、と述べています〈W3C技術ノート、2012年、3.1.9〉。約物が連続する箇所、たとえば「『引用』」や〈補足（注記）〉でアキを重ねないのも、同じ体裁上の判断です。Next.jsやTypeScriptのような欧文が混ざる場合、和文との境目にわずかな間隔が入ります。";

const TAG =
  '<script src="/mojikumi.min.js" data-target=".entry-content" data-style="article"></script>';

const PAGE_STYLE =
  "<style>body{font-family:serif;margin:0 auto;max-width:38rem;padding:2rem;font-size:17px;line-height:2}</style>";

/** Milliseconds before the bundle is served: a CDN is not on localhost. */
const NETWORK_DELAY = 40;

const VIEWPORTS = [
  { label: "desktop", width: 1280, height: 900 },
  { label: "mobile", width: 390, height: 844 }
];

const PLACEMENTS = ["none", "head", "footer"];
const LENGTHS = [8, 40];

function buildPage(placement, paragraphs) {
  const article = `<main><article class="entry-content">${
    `<p>${PARAGRAPH}</p>`.repeat(paragraphs)
  }</article></main>`;
  const head = placement === "head" ? TAG : "";
  const footer = placement === "footer" ? TAG : "";

  return `<!doctype html><html lang="ja"><head><meta charset="utf-8">${PAGE_STYLE}${head}</head><body>${article}${footer}</body></html>`;
}

const bundle = await readFile(BUNDLE, "utf8");

const server = createServer(async (request, response) => {
  const url = new URL(request.url, "http://localhost");

  if (url.pathname === "/mojikumi.min.js") {
    await new Promise((done) => setTimeout(done, NETWORK_DELAY));
    response.writeHead(200, { "content-type": "text/javascript" });
    response.end(bundle);
    return;
  }

  response.writeHead(200, { "content-type": "text/html; charset=utf-8" });
  response.end(
    buildPage(
      url.searchParams.get("placement") ?? "none",
      Number(url.searchParams.get("paragraphs") ?? 8)
    )
  );
});

await new Promise((listening) => server.listen(0, listening));
const base = `http://127.0.0.1:${server.address().port}`;

const browser = await chromium.launch(
  process.env.MOJIKUMI_CHROMIUM
    ? { executablePath: process.env.MOJIKUMI_CHROMIUM }
    : {}
);

async function measure(viewport, placement, paragraphs) {
  const page = await browser.newPage({
    viewport: { width: viewport.width, height: viewport.height }
  });

  /* Buffered, so shifts from before the observer existed still count. */
  await page.addInitScript(() => {
    window.__shifts = [];
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) window.__shifts.push(entry.value);
      }
    }).observe({ type: "layout-shift", buffered: true });
  });

  await page.goto(`${base}/?placement=${placement}&paragraphs=${paragraphs}`, {
    waitUntil: "load"
  });
  await page.waitForTimeout(1200);

  const result = await page.evaluate(() => ({
    cls: window.__shifts.reduce((total, value) => total + value, 0),
    shifts: window.__shifts.length,
    height: Math.round(
      document.querySelector(".entry-content")?.getBoundingClientRect().height ?? 0
    ),
    generated: document.querySelectorAll("[data-mjk-generated]").length,
    /*
     * A tag that never ran also reports no shift. Without this the healthy
     * result and the broken one are the same number.
     */
    mounted: document.querySelectorAll(".mjk").length
  }));

  await page.close();
  return result;
}

const rows = [];
for (const viewport of VIEWPORTS) {
  for (const placement of PLACEMENTS) {
    for (const paragraphs of LENGTHS) {
      const result = await measure(viewport, placement, paragraphs);
      rows.push({
        viewport: `${viewport.label} ${viewport.width}`,
        placement,
        paragraphs,
        cls: Number(result.cls.toFixed(4)),
        shifts: result.shifts,
        articleHeight: result.height,
        generated: result.generated,
        mounted: result.mounted
      });
    }
  }
}

console.log(`chromium ${browser.version()}`);
console.table(rows);

const tagged = rows.filter((row) => row.placement !== "none");
const worstInHead = Math.max(
  ...rows.filter((row) => row.placement === "head").map((row) => row.cls)
);
const unmounted = tagged.filter((row) => row.mounted === 0);

await browser.close();
server.close();

/*
 * Checked before the shift, because a page where nothing mounted passes the
 * shift check for the wrong reason and would read as good news.
 */
if (unmounted.length) {
  throw new Error(
    `The tag mounted nothing in ${unmounted.length} of ${tagged.length} runs`
  );
}

/* The guides tell people to paste into the head. That has to stay free. */
if (worstInHead > 0) {
  throw new Error(`Layout shift with the tag in the head: ${worstInHead}`);
}

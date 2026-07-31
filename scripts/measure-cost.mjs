import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { chromium } from "playwright-core";

/*
 * Measures what the pasted script tag costs a page in work, markup and memory.
 *
 * The claim the library makes is that its cost falls as browsers implement CSS
 * Text Level 4, because the DOM fallback is what the native properties replace.
 * That is only worth saying if both halves are on the page, so every cell is
 * measured twice: once at `precision: "auto"`, which is what a reader on this
 * browser actually gets, and once at `precision: "full"`, which forces the
 * fallback and stands in for a browser with none of the properties.
 *
 * Run against a built bundle:
 *   npm run build:packages && npm run build:browser && npm run measure:cost
 *
 * Chromium comes from PLAYWRIGHT_BROWSERS_PATH, or set MOJIKUMI_CHROMIUM to an
 * executable. Timings depend on the machine; the ratio between the two columns
 * does not.
 */

const BUNDLE = resolve("packages/mojikumi/dist/mojikumi.browser.js");

/** The same specimen the layout-shift measurement uses, at 219 characters. */
const PARAGRAPH =
  "『日本語組版処理の要件（JLREQ）』は、行末に置いた終わり括弧類や句読点について「その後ろを原則として二分アキとする」と定めたうえで、行の調整処理で詰めてベタ組にしてもよい、と述べています〈W3C技術ノート、2012年、3.1.9〉。約物が連続する箇所、たとえば「『引用』」や〈補足（注記）〉でアキを重ねないのも、同じ体裁上の判断です。";

const PAGE_STYLE =
  "<style>body{font-family:serif;margin:0 auto;max-width:38rem;padding:2rem;font-size:17px;line-height:2}</style>";

/*
 * `data-auto="false"` hands the timing over: the tag still publishes the API,
 * but nothing starts until the measurement says so, so the numbers below are
 * the library's work rather than whatever else the page was doing at load.
 */
const TAG = '<script src="/mojikumi.min.js" data-auto="false"></script>';

/** Character counts the site's matrix promises, plus the many-roots case. */
const SHAPES = [
  { label: "1,000 chars", articles: 1, paragraphs: 5 },
  { label: "10,000 chars", articles: 1, paragraphs: 46 },
  { label: "10 articles", articles: 10, paragraphs: 5 }
];

const PRECISIONS = ["auto", "full"];

/** Timings move by a millisecond or two between runs; the median does not. */
const RUNS = 7;

function buildPage(articles, paragraphs) {
  const article = `<article class="entry-content">${
    `<p>${PARAGRAPH}</p>`.repeat(paragraphs)
  }</article>`;

  return `<!doctype html><html lang="ja"><head><meta charset="utf-8">${PAGE_STYLE}${TAG}</head><body><main>${
    article.repeat(articles)
  }</main></body></html>`;
}

const bundle = await readFile(BUNDLE, "utf8");

const server = createServer((request, response) => {
  const url = new URL(request.url, "http://localhost");

  if (url.pathname === "/mojikumi.min.js") {
    response.writeHead(200, { "content-type": "text/javascript" });
    response.end(bundle);
    return;
  }

  response.writeHead(200, { "content-type": "text/html; charset=utf-8" });
  response.end(
    buildPage(
      Number(url.searchParams.get("articles") ?? 1),
      Number(url.searchParams.get("paragraphs") ?? 5)
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

const median = (values) =>
  [...values].sort((a, b) => a - b)[Math.floor(values.length / 2)];

/*
 * A heap reading straight after allocation is mostly garbage that has not been
 * collected yet, so each one is taken after a forced collection. The interest
 * is the difference between the two readings, not either number on its own.
 */
async function heapUsage(session) {
  await session.send("HeapProfiler.collectGarbage");
  const { usedSize } = await session.send("Runtime.getHeapUsage");
  return usedSize;
}

async function measure(shape, precision) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const session = await page.context().newCDPSession(page);
  await page.goto(
    `${base}/?articles=${shape.articles}&paragraphs=${shape.paragraphs}`,
    { waitUntil: "load" }
  );
  await page.evaluate(() => document.fonts.ready);

  const before = await heapUsage(session);

  const result = await page.evaluate(async (precision) => {
    /*
     * The line pass runs in an animation frame, so wall clock from start() to
     * the next frame would be mostly idle waiting. Wrapping the scheduler
     * charges us only the time the callback itself spends working.
     */
    const schedule = window.requestAnimationFrame.bind(window);
    let frameWork = 0;
    const spent = () => {
      const total = frameWork;
      frameWork = 0;
      return total;
    };
    window.requestAnimationFrame = (callback) =>
      schedule((time) => {
        const started = performance.now();
        callback(time);
        frameWork += performance.now() - started;
      });

    const settle = () =>
      new Promise((done) => schedule(() => schedule(() => done())));

    const elementsBefore = document.getElementsByTagName("*").length;

    const mountStart = performance.now();
    window.Mojikumi.start({
      target: ".entry-content",
      style: "article",
      precision
    });
    const mount = performance.now() - mountStart;
    await settle();
    const measurePass = spent();

    /*
     * Re-evaluation as the library defines it: throw the generated markup away,
     * analyse the text again, and re-measure. A width change alone only reruns
     * the line pass, which is the cheaper half and already counted above.
     */
    const refreshStart = performance.now();
    window.Mojikumi.refresh();
    const refresh = performance.now() - refreshStart;
    await settle();

    return {
      mount: mount + measurePass,
      refresh: refresh + spent(),
      elements: document.getElementsByTagName("*").length - elementsBefore,
      generated: document.querySelectorAll("[data-mjk-generated]").length,
      roots: document.querySelectorAll(".mjk").length
    };
  }, precision);

  const after = await heapUsage(session);
  await page.close();
  return { ...result, heap: after - before };
}

const rows = [];
for (const shape of SHAPES) {
  for (const precision of PRECISIONS) {
    const runs = [];
    for (let run = 0; run < RUNS; run += 1) {
      runs.push(await measure(shape, precision));
    }
    const last = runs.at(-1);
    rows.push({
      content: shape.label,
      precision,
      roots: last.roots,
      "mount ms": Number(median(runs.map((run) => run.mount)).toFixed(2)),
      "refresh ms": Number(median(runs.map((run) => run.refresh)).toFixed(2)),
      "+elements": last.elements,
      generated: last.generated,
      "heap KB": Math.round(median(runs.map((run) => run.heap)) / 1024)
    });
  }
}

console.log(`chromium ${browser.version()}, median of ${RUNS} runs`);
console.table(rows);

const nativeGrowth = rows
  .filter((row) => row.precision === "auto")
  .map((row) => row.generated);

await browser.close();
server.close();

/*
 * The whole design rests on the fallback standing down where the browser can
 * do the work itself. On a browser with the CSS properties, a run that still
 * wraps tokens is a regression in the detection, not a slow benchmark.
 */
if (Math.max(...nativeGrowth) > 0) {
  throw new Error(
    `Fallback markup on a browser with native support: ${Math.max(
      ...nativeGrowth
    )} elements`
  );
}

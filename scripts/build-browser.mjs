import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { brotliCompressSync } from "node:zlib";
import { build, transform } from "esbuild";

/*
 * The paste-and-go build: one file, no imports, no build step at the other end.
 * The CSS travels inside it so a beginner has one tag to copy rather than two
 * that have to arrive in the right order.
 */

/** Small enough that nobody has to weigh typography against page weight. */
const SIZE_LIMIT = 15 * 1024;

const packageJson = JSON.parse(
  await readFile(resolve("packages/mojikumi/package.json"), "utf8")
);
const { version } = packageJson;

const source = await readFile(resolve("packages/css/src/mojikumi.css"), "utf8");
const { code: css } = await transform(source, { loader: "css", minify: true });

await writeFile(resolve("packages/mojikumi/dist/mojikumi.min.css"), css);

const result = await build({
  entryPoints: [resolve("packages/mojikumi/src/browser.ts")],
  outfile: resolve("packages/mojikumi/dist/mojikumi.browser.js"),
  bundle: true,
  format: "iife",
  globalName: "Mojikumi",
  target: ["es2022"],
  minify: true,
  sourcemap: true,
  legalComments: "none",
  metafile: true,
  define: {
    __MOJIKUMI_CSS__: JSON.stringify(css),
    __MOJIKUMI_VERSION__: JSON.stringify(version)
  },
  banner: {
    js: `/*! Mojikumi v${version} | MIT | https://mojikumi.jp */`
  }
});

const bundle = await readFile(
  resolve("packages/mojikumi/dist/mojikumi.browser.js")
);
const compressed = brotliCompressSync(bundle).byteLength;

const report = `${(bundle.byteLength / 1024).toFixed(1)}KB, ${(
  compressed / 1024
).toFixed(1)}KB brotli`;

if (compressed > SIZE_LIMIT) {
  throw new Error(
    `mojikumi.browser.js is ${report}, over the ${SIZE_LIMIT / 1024}KB budget`
  );
}

console.log(`mojikumi.browser.js  ${report}`);

if (result.warnings.length) {
  for (const warning of result.warnings) console.warn(warning.text);
}

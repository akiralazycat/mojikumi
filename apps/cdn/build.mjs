import { cp, mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

/*
 * Lays out what cdn.mojikumi.jp serves. Two copies of the same build: a pinned
 * one that is never rewritten, and a `/v1/` one that gets fixes without anyone
 * editing the tag they pasted. Both exist so that choice stays with the site.
 */

const root = resolve(dirname(new URL(import.meta.url).pathname), "../..");
const output = resolve(root, "apps/cdn/dist");
const distribution = resolve(root, "packages/mojikumi/dist");

const { version } = JSON.parse(
  await readFile(resolve(root, "packages/mojikumi/package.json"), "utf8")
);

/** `/v1/` follows the major, which is 0.x until the API stops moving. */
const channel = `v${version.split(".")[0] === "0" ? "1" : version.split(".")[0]}`;

const files = [
  ["mojikumi.browser.js", "mojikumi.min.js"],
  ["mojikumi.browser.js.map", "mojikumi.min.js.map"],
  ["mojikumi.min.css", "mojikumi.min.css"]
];

for (const directory of [channel, version]) {
  for (const [from, to] of files) {
    const destination = resolve(output, directory, to);
    await mkdir(dirname(destination), { recursive: true });
    await cp(resolve(distribution, from), destination);
  }

  /* The bundle points at its map by name, and the name changed on the way in. */
  const script = resolve(output, directory, "mojikumi.min.js");
  const source = await readFile(script, "utf8");
  await writeFile(
    script,
    source.replace("mojikumi.browser.js.map", "mojikumi.min.js.map")
  );
}

await mkdir(output, { recursive: true });
await writeFile(
  resolve(output, "index.html"),
  `<!doctype html>
<html lang="ja">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>Mojikumi CDN</title>
<p>Mojikumiの配信元です。導入方法は<a href="https://mojikumi.jp/start/">mojikumi.jp/start/</a>にあります。</p>
<p>Files for the Mojikumi CDN. See <a href="https://mojikumi.jp/start/">mojikumi.jp/start/</a> to get started.</p>
<pre>/${channel}/mojikumi.min.js
/${channel}/mojikumi.min.css
/${version}/mojikumi.min.js
/${version}/mojikumi.min.css</pre>
`
);

console.log(`cdn: /${channel}/ and /${version}/`);

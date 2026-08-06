import { createHash } from "node:crypto";
import { cp, mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

/*
 * Lays out what cdn.mojikumi.jp serves. Two copies of the same build: a pinned
 * one that is never rewritten, and a `/v1/` one that gets fixes without anyone
 * editing the tag they pasted. Both exist so that choice stays with the site.
 *
 * The pages are HTML files in `templates/`, not strings in here. They are read,
 * filled in, and written out; nothing is generated that could not have been
 * written by hand. A file origin should not need a framework to describe
 * itself, and this way the markup can be reviewed as markup.
 */

const root = resolve(dirname(new URL(import.meta.url).pathname), "../..");
const output = resolve(root, "apps/cdn/dist");
const distribution = resolve(root, "packages/mojikumi/dist");
const templates = resolve(root, "apps/cdn/templates");

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

/*
 * Hashed after the rewrite above, and only for the pinned copy: `/v1/` changes
 * with every minor release, so an integrity value published for it would be a
 * promise this project cannot keep.
 */
async function integrity(name) {
  const bytes = await readFile(resolve(output, version, name));
  return `sha384-${createHash("sha384").update(bytes).digest("base64")}`;
}

const fields = {
  channel,
  version,
  integrityJs: await integrity("mojikumi.min.js"),
  integrityCss: await integrity("mojikumi.min.css"),
  style: await readFile(resolve(templates, "page.css"), "utf8")
};

async function page(template, destination) {
  const source = await readFile(resolve(templates, template), "utf8");
  const filled = source.replace(/\{\{(\w+)\}\}/g, (whole, key) => {
    if (!(key in fields)) throw new Error(`${template}: no value for ${whole}`);
    return fields[key];
  });
  const path = resolve(output, destination);
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, filled);
}

await mkdir(output, { recursive: true });

/*
 * One page per language rather than both languages down one page, which is how
 * mojikumi.jp is laid out too. Each one can then be written as prose instead of
 * as a translation running beside its original. The 404 keeps both, since a
 * path that missed says nothing about who asked for it.
 */
await page("index.html", "index.html");
await page("en.html", "en/index.html");
await page("404.html", "404.html");
await cp(resolve(templates, "robots.txt"), resolve(output, "robots.txt"));

console.log(`cdn: /${channel}/ and /${version}/`);
console.log(`cdn: ${fields.integrityJs}  mojikumi.min.js`);
console.log(`cdn: ${fields.integrityCss}  mojikumi.min.css`);

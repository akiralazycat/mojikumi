import { readdir, writeFile } from "node:fs/promises";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const outputRoot = join(appRoot, "out");
const staticRoot = join(outputRoot, "_next", "static");

async function listFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? listFiles(path) : [path];
  }));
  return nested.flat();
}

const assets = (await listFiles(staticRoot))
  .map((path) => `/${relative(outputRoot, path).split("\\").join("/")}`)
  .sort();
await writeFile(join(outputRoot, "precache.json"), `${JSON.stringify(assets)}\n`, "utf8");
console.log(`Service Worker precache: ${assets.length} static assets`);

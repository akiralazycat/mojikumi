import { cp, mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const source = resolve("packages/css/src/mojikumi.css");
const destination = resolve("packages/css/dist/mojikumi.css");
const packageDirectories = [
  "core",
  "css",
  "presets",
  "dom",
  "react",
  "rehype",
  "mojikumi"
];

await mkdir(dirname(destination), { recursive: true });
await cp(source, destination);
await mkdir(resolve("packages/mojikumi/dist"), { recursive: true });
await cp(source, resolve("packages/mojikumi/dist/mojikumi.css"));

const css = await readFile(source, "utf8");
await writeFile(
  resolve("packages/css/dist/index.js"),
  `export const stylesheet = ${JSON.stringify(css)};\n`
);
await writeFile(
  resolve("packages/css/dist/index.d.ts"),
  "export declare const stylesheet: string;\n"
);

for (const packageDirectory of packageDirectories) {
  const packageRoot = resolve("packages", packageDirectory);
  await cp(resolve("README.md"), resolve(packageRoot, "README.md"));
  await cp(resolve("LICENSE"), resolve(packageRoot, "LICENSE"));
}

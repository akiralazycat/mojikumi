import { copyFile, mkdir, readFile, readdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const appRoot = path.resolve(import.meta.dirname, "..");
const publicDir = path.join(appRoot, "public");
const assetDir = path.join(appRoot, "assets");
const fontSourceDir = path.resolve(appRoot, "../../node_modules/mathlive/fonts");
const fontPublicDir = path.join(publicDir, "fonts");

const iconSvg = await readFile(path.join(assetDir, "icon-source.svg"));
const maskableSvg = Buffer.from(
  iconSvg.toString("utf8").replace('rx="224"', 'rx="0"')
);

await Promise.all([
  sharp(iconSvg)
    .resize(192, 192)
    .png({ compressionLevel: 9 })
    .toFile(path.join(publicDir, "icon-192.png")),
  sharp(iconSvg)
    .resize(512, 512)
    .png({ compressionLevel: 9 })
    .toFile(path.join(publicDir, "icon-512.png")),
  sharp(iconSvg)
    .resize(180, 180)
    .png({ compressionLevel: 9 })
    .toFile(path.join(publicDir, "apple-icon.png")),
  sharp(maskableSvg)
    .resize(512, 512)
    .png({ compressionLevel: 9 })
    .toFile(path.join(publicDir, "icon-maskable-512.png"))
]);

await mkdir(fontPublicDir, { recursive: true });
const fontFiles = (await readdir(fontSourceDir)).filter((name) => name.endsWith(".woff2"));
await Promise.all(
  fontFiles.map((name) => copyFile(path.join(fontSourceDir, name), path.join(fontPublicDir, name)))
);

const ogSource = await readFile(path.join(assetDir, "og-source.png"));
await sharp(ogSource)
  .resize(1200, 630, { fit: "cover", position: "centre" })
  .png({ compressionLevel: 9 })
  .toFile(path.join(publicDir, "og.png"));

console.log(`Generated PWA/OG assets and copied ${fontFiles.length} MathLive fonts`);

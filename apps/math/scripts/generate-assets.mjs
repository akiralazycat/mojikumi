import { copyFile, mkdir, readFile, readdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const appRoot = path.resolve(import.meta.dirname, "..");
const publicDir = path.join(appRoot, "public");
const assetDir = path.join(appRoot, "assets");
const fontSourceDir = path.resolve(appRoot, "../../node_modules/mathlive/fonts");
const fontPublicDir = path.join(publicDir, "fonts");

const iconSvg = String.raw`
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" rx="112" fill="#f1f5f8"/>
  <circle cx="256" cy="256" r="188" fill="#245b87" opacity="0.08"/>
  <text x="256" y="358" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="360" font-style="italic" fill="#245b87">∫</text>
</svg>`;

const maskableSvg = String.raw`
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" fill="#245b87"/>
  <circle cx="256" cy="256" r="176" fill="#f1f5f8"/>
  <text x="256" y="346" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="310" font-style="italic" fill="#245b87">∫</text>
</svg>`;

await Promise.all([
  sharp(Buffer.from(iconSvg)).png().resize(192, 192).toFile(path.join(publicDir, "icon-192.png")),
  sharp(Buffer.from(iconSvg)).png().resize(512, 512).toFile(path.join(publicDir, "icon-512.png")),
  sharp(Buffer.from(iconSvg)).png().resize(180, 180).toFile(path.join(publicDir, "apple-icon.png")),
  sharp(Buffer.from(maskableSvg)).png().resize(512, 512).toFile(path.join(publicDir, "icon-maskable-512.png"))
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

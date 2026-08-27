import { mkdir, readFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const appRoot = path.resolve(import.meta.dirname, "..");
const publicDir = path.join(appRoot, "public");
const assetDir = path.join(appRoot, "assets");
await mkdir(publicDir, { recursive: true });

const iconSvg = String.raw`
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" rx="112" fill="#f4f1e8"/>
  <circle cx="256" cy="256" r="184" fill="#2f6b4f" opacity="0.09"/>
  <ellipse cx="256" cy="256" rx="178" ry="64" fill="none" stroke="#2f6b4f" stroke-width="10" opacity="0.34" transform="rotate(55 256 256)"/>
  <ellipse cx="256" cy="256" rx="178" ry="64" fill="none" stroke="#2f6b4f" stroke-width="10" opacity="0.34" transform="rotate(-55 256 256)"/>
  <text x="256" y="342" text-anchor="middle" font-family="Georgia, serif" font-size="260" fill="#2f6b4f">C</text>
  <text x="118" y="150" text-anchor="middle" font-family="monospace" font-size="48" fill="#2f6b4f">6</text>
</svg>`;

const maskableSvg = String.raw`
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" fill="#2f6b4f"/>
  <circle cx="256" cy="256" r="176" fill="#f4f1e8"/>
  <text x="256" y="340" text-anchor="middle" font-family="Georgia, serif" font-size="252" fill="#2f6b4f">C</text>
  <text x="138" y="170" text-anchor="middle" font-family="monospace" font-size="42" fill="#2f6b4f">6</text>
</svg>`;

await Promise.all([
  sharp(Buffer.from(iconSvg)).png().resize(192, 192).toFile(path.join(publicDir, "icon-192.png")),
  sharp(Buffer.from(iconSvg)).png().resize(512, 512).toFile(path.join(publicDir, "icon-512.png")),
  sharp(Buffer.from(iconSvg)).png().resize(180, 180).toFile(path.join(publicDir, "apple-icon.png")),
  sharp(Buffer.from(maskableSvg)).png().resize(512, 512).toFile(path.join(publicDir, "icon-maskable-512.png"))
]);

const ogSource = await readFile(path.join(assetDir, "og-source.png"));
await sharp(ogSource)
  .resize(1200, 630, { fit: "cover", position: "centre" })
  .png({ compressionLevel: 9 })
  .toFile(path.join(publicDir, "og.png"));

console.log("Generated Mojikumi Chem PWA and social assets");

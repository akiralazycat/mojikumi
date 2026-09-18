import { mkdir, readFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const appRoot = path.resolve(import.meta.dirname, "..");
const publicDir = path.join(appRoot, "public");
const assetDir = path.join(appRoot, "assets");
await mkdir(publicDir, { recursive: true });

const iconSvg = Buffer.from(String.raw`
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" rx="112" fill="#2f6b4f"/>
  <circle cx="256" cy="256" r="184" fill="#1f503a" opacity="0.18"/>
  <ellipse cx="256" cy="256" rx="176" ry="62" fill="none" stroke="#e6ead9" stroke-width="10" opacity="0.26" transform="rotate(55 256 256)"/>
  <ellipse cx="256" cy="256" rx="176" ry="62" fill="none" stroke="#e6ead9" stroke-width="10" opacity="0.26" transform="rotate(-55 256 256)"/>
  <text x="256" y="342" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="260" fill="#f4f1e8">C</text>
  <text x="116" y="150" text-anchor="middle" font-family="monospace" font-size="48" fill="#e6ead9">6</text>
</svg>`);

await Promise.all([
  sharp(iconSvg).resize(192, 192).png({ compressionLevel: 9 }).toFile(path.join(publicDir, "icon-192.png")),
  sharp(iconSvg).resize(512, 512).png({ compressionLevel: 9 }).toFile(path.join(publicDir, "icon-512.png")),
  sharp(iconSvg).resize(180, 180).png({ compressionLevel: 9 }).toFile(path.join(publicDir, "apple-icon.png")),
  sharp(iconSvg).resize(512, 512).png({ compressionLevel: 9 }).toFile(path.join(publicDir, "icon-maskable-512.png"))
]);

const ogSource = await readFile(path.join(assetDir, "og-source.png"));
await sharp(ogSource)
  .resize(1200, 630, { fit: "cover", position: "centre" })
  .png({ compressionLevel: 9 })
  .toFile(path.join(publicDir, "og.png"));

console.log("Generated Mojikumi Chem PWA and social assets");

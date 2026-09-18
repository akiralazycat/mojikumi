import { mkdir, readFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const appRoot = path.resolve(import.meta.dirname, "..");
const publicDir = path.join(appRoot, "public");
const assetDir = path.join(appRoot, "assets");
await mkdir(publicDir, { recursive: true });

const iconSource = await readFile(path.join(assetDir, "icon-source.png"));

await Promise.all([
  sharp(iconSource).resize(192, 192).png({ palette: true, colours: 256 }).toFile(path.join(publicDir, "icon-192.png")),
  sharp(iconSource).resize(512, 512).png({ palette: true, colours: 256 }).toFile(path.join(publicDir, "icon-512.png")),
  sharp(iconSource).resize(180, 180).png({ palette: true, colours: 256 }).toFile(path.join(publicDir, "apple-icon.png"))
]);

const maskableInset = await sharp(iconSource)
  .resize(448, 448)
  .png()
  .toBuffer();

await sharp({
  create: {
    width: 512,
    height: 512,
    channels: 4,
    background: "#e0e7d1"
  }
})
  .composite([{ input: maskableInset, left: 32, top: 32 }])
  .png({ palette: true, colours: 256 })
  .toFile(path.join(publicDir, "icon-maskable-512.png"));

const ogSource = await readFile(path.join(assetDir, "og-source.png"));
await sharp(ogSource)
  .resize(1200, 630, { fit: "cover", position: "centre" })
  .png({ compressionLevel: 9 })
  .toFile(path.join(publicDir, "og.png"));

console.log("Generated Mojikumi Chem PWA and social assets");

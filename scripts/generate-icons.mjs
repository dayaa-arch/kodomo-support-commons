import { writeFile } from "node:fs/promises";
import sharp from "sharp";

// SVGを正本として、ブラウザ用ICOとホーム画面用PNGを生成する。
const source = new URL("../app/icon.svg", import.meta.url);
const sizes = [16, 32, 48];
const images = await Promise.all(sizes.map(size => sharp(source.pathname).resize(size, size).png().toBuffer()));
const header = Buffer.alloc(6 + 16 * images.length);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(images.length, 4);
let offset = header.length;
for (const [index, image] of images.entries()) {
  const entry = 6 + index * 16;
  header[entry] = sizes[index];
  header[entry + 1] = sizes[index];
  header.writeUInt16LE(1, entry + 4);
  header.writeUInt16LE(32, entry + 6);
  header.writeUInt32LE(image.length, entry + 8);
  header.writeUInt32LE(offset, entry + 12);
  offset += image.length;
}
await writeFile(new URL("../app/favicon.ico", import.meta.url), Buffer.concat([header, ...images]));
await sharp(source.pathname).resize(180, 180).png().toFile(new URL("../app/apple-icon.png", import.meta.url).pathname);

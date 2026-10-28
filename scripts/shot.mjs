// Render an HTML file to PNG: carousel slides, static ads, thumbnails.
//
//   npm run shot -- <file.html> [--size 1080x1350] [--out <dir>]
//
// Each element with a data-slide attribute becomes its own PNG (slide-01.png,
// slide-02.png ...), sized to --size. A page with no data-slide elements is
// captured whole at --size. Uses the installed Chrome, so nothing is downloaded.

import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { basename, dirname, join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const args = process.argv.slice(2);
const file = args[0];
if (!file || file.startsWith("--")) {
  console.error("usage: npm run shot -- <file.html> [--size 1080x1350] [--out <dir>]");
  process.exit(1);
}
const opt = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i === -1 ? fallback : args[i + 1];
};
const [width, height] = opt("size", "1080x1350").split("x").map(Number);
const src = resolve(file);
const out = resolve(opt("out", join(dirname(src), "png")));
mkdirSync(out, { recursive: true });

const browser = await chromium.launch({ channel: "chrome" });
const page = await browser.newPage({ viewport: { width, height } });
await page.goto(pathToFileURL(src).href, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);

const slides = await page.$$("[data-slide]");
if (slides.length) {
  for (const [i, el] of slides.entries()) {
    const path = join(out, `slide-${String(i + 1).padStart(2, "0")}.png`);
    await el.screenshot({ path });
    console.log(path);
  }
} else {
  const path = join(out, basename(src).replace(/\.html?$/, ".png"));
  await page.screenshot({ path });
  console.log(path);
}
await browser.close();

// Render an animated HTML composition to PNG frames for ffmpeg.
//
//   node scripts/frames.mjs <composition.html> <out-dir> [--fps 30] [--size 1080x1920]
//
// The page must define window.DURATION (seconds) and window.render(t), and
// render(t) must be a pure function of t so every frame is reproducible.

import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const [file, outDir] = process.argv.slice(2);
const opt = (n, d) => { const i = process.argv.indexOf(`--${n}`); return i === -1 ? d : process.argv[i + 1]; };
const fps = Number(opt("fps", "30"));
const [width, height] = opt("size", "1080x1920").split("x").map(Number);
mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch({ channel: "chrome" });
const page = await browser.newPage({ viewport: { width, height } });
await page.goto(pathToFileURL(resolve(file)).href, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
await page.waitForFunction(() => [...document.images].every((i) => i.complete));

const duration = await page.evaluate(() => window.DURATION);
const total = Math.round(duration * fps);
for (let f = 0; f < total; f++) {
  await page.evaluate((t) => window.render(t), f / fps);
  await page.screenshot({ path: join(outDir, `${String(f).padStart(5, "0")}.png`) });
  if (f % 60 === 0) console.log(`frame ${f}/${total}`);
}
await browser.close();
console.log(`${total} frames -> ${outDir}`);

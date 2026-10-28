// Publish everything in the queue that is due, then rewrite QUEUE.md.
//
//   node scripts/run-queue.mjs            (the queue workflow runs this every half hour)
//
// A content folder is queued when its post.json has "publish_at". Optional
// "expires_at": past it, an unpublished post is skipped (a festival post that
// missed its day). A failure is retried on the next runs, up to 3 times, then
// written to ISSUES.md and left alone until someone looks. "hold": true keeps a
// post back until it is released; "cancelled": true drops it for good. Both are
// set from the admin site.

import { existsSync, readdirSync, readFileSync, writeFileSync, appendFileSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { config } from "./config.mjs";

const root = new URL("..", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const contentDir = join(root, "content");
const now = Date.now();
const log = (line) => appendFileSync(join(root, "results", "queue.log"), `${new Date().toISOString()} ${line}\n`);
const issue = (line) => appendFileSync(join(root, "ISSUES.md"), `- ${new Date().toISOString().slice(0, 16)} ${line}\n`);

const items = readdirSync(contentDir, { withFileTypes: true })
  .filter((d) => d.isDirectory() && existsSync(join(contentDir, d.name, "post.json")))
  .map((d) => {
    const dir = join(contentDir, d.name);
    const spec = JSON.parse(readFileSync(join(dir, "post.json"), "utf8"));
    const read = (f) => (existsSync(join(dir, f)) ? JSON.parse(readFileSync(join(dir, f), "utf8")) : null);
    return { name: d.name, dir, spec, published: read("published.json"), failed: read("failed.json") };
  });

for (const it of items) {
  const at = it.spec.publish_at && Date.parse(it.spec.publish_at);
  if (!at || it.published || at > now || it.failed?.gave_up || it.failed?.skipped) continue;
  if (it.spec.hold || it.spec.cancelled) continue;
  if (it.spec.expires_at && Date.parse(it.spec.expires_at) < now) {
    writeFileSync(join(it.dir, "failed.json"), JSON.stringify({ skipped: true, reason: "expired before it could post" }, null, 2));
    log(`SKIP ${it.name} (expired)`);
    issue(`Skipped **${it.name}**: it expired before it could post (did the queue stop running?).`);
    continue;
  }
  const r = spawnSync(process.execPath, [join(root, "scripts", "publish.mjs"), it.dir], { encoding: "utf8" });
  if (r.status === 0) {
    log(`OK   ${it.name} ${r.stdout.trim().split("\n").slice(-2).join(" | ")}`);
    it.published = JSON.parse(readFileSync(join(it.dir, "published.json"), "utf8"));
  } else {
    const attempts = (it.failed?.attempts ?? 0) + 1;
    const error = (r.stderr || r.stdout).trim().split("\n").filter((l) => /Error/.test(l)).pop() ?? "unknown error";
    const gave_up = attempts >= 3;
    writeFileSync(join(it.dir, "failed.json"), JSON.stringify({ attempts, gave_up, error }, null, 2));
    log(`FAIL ${it.name} attempt ${attempts}: ${error}`);
    if (gave_up) issue(`Gave up on **${it.name}** after 3 attempts: ${error}`);
  }
}

// QUEUE.md: what is coming, and what went out.
const local = (iso) => new Date(Date.parse(iso)).toLocaleString(config.locale, { timeZone: config.timezone, weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
const kind = (s) => (!s.media?.length ? "text (FB)" : s.format === "story" ? "story" : /\.(mp4|mov)$/i.test(s.media[0]) ? "reel" : s.media.length > 1 ? "carousel" : "image");
const first = (s) => (s.caption ?? "").split("\n")[0].slice(0, 70);
const upcoming = items.filter((i) => i.spec.publish_at && !i.published && !i.failed?.skipped && !i.spec.cancelled).sort((a, b) => Date.parse(a.spec.publish_at) - Date.parse(b.spec.publish_at));
const done = items.filter((i) => i.published).sort((a, b) => Date.parse(b.published.at) - Date.parse(a.published.at)).slice(0, 15);

const md = [
  "# Queue",
  "",
  `Updated ${local(new Date().toISOString())} (${config.timezone}). Posts go out on their own. To change or stop one, tell Claude or write it in FEEDBACK.md.`,
  "",
  "## Coming up",
  "",
  ...(upcoming.length
    ? ["| When | Format | Post | Opens with |", "|---|---|---|---|",
       ...upcoming.map((i) => `| ${local(i.spec.publish_at)} | ${kind(i.spec)} | [${i.name}](content/${i.name}/) | ${i.spec.hold ? "**HELD** " : ""}${first(i.spec)}${i.failed ? ` (retrying: ${i.failed.error})` : ""} |`)]
    : ["_Nothing queued._"]),
  "",
  "## Published",
  "",
  "| When | Format | Post | Link |",
  "|---|---|---|---|",
  ...done.map((i) => `| ${local(i.published.at)} | ${kind(i.spec)} | [${i.name}](content/${i.name}/) | ${i.published.instagram?.permalink ? `[Instagram](${i.published.instagram.permalink})` : "Facebook"} |`),
  "",
];
writeFileSync(join(root, "QUEUE.md"), md.join("\n"));

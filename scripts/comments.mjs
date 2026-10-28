// Comments: fetch the new ones, or post a reply.
//
//   node scripts/comments.mjs fetch [--days 7]
//       writes results/comments-YYYY-MM-DD.md for the replies skill
//   node scripts/comments.mjs reply <instagram|facebook> <comment-id> "<text>"
//
// Comment files carry commenters' usernames, so git ignores them.

import { mkdirSync, writeFileSync } from "node:fs";
import { accounts, get, post } from "./meta.mjs";

const [cmd, ...rest] = process.argv.slice(2);
const acct = await accounts();
const t = { access_token: acct.pageToken };

if (cmd === "reply") {
  const [platform, id, text] = rest;
  if (!text) throw new Error('usage: reply <instagram|facebook> <comment-id> "<text>"');
  const r = platform === "instagram"
    ? await post(`/${id}/replies`, { message: text, ...t })
    : await post(`/${id}/comments`, { message: text, ...t });
  console.log(`replied: ${r.id}`);
} else if (cmd === "fetch") {
  const i = rest.indexOf("--days");
  const since = Date.now() - (i === -1 ? 7 : Number(rest[i + 1])) * 864e5;
  const lines = [`# Comments since ${new Date(since).toISOString().slice(0, 10)}`, ""];

  const ig = await get(`/${acct.igId}/media`, { fields: "id,caption,permalink,timestamp,comments{id,username,text,timestamp,replies{username,text}}", limit: "25", ...t });
  for (const m of ig.data) for (const c of m.comments?.data ?? []) {
    if (Date.parse(c.timestamp) < since) continue;
    const answered = (c.replies?.data ?? []).some((r) => r.username === acct.igUser);
    lines.push(`- [instagram ${c.id}] @${c.username}: ${c.text}${answered ? "  (answered)" : ""}  <- ${m.permalink}`);
  }

  const fb = await get(`/${acct.pageId}/posts`, { fields: "id,permalink_url,comments{id,from,message,created_time,comments{from}}", limit: "25", ...t });
  for (const p of fb.data) for (const c of p.comments?.data ?? []) {
    if (Date.parse(c.created_time) < since) continue;
    const answered = (c.comments?.data ?? []).some((r) => r.from?.id === acct.pageId);
    lines.push(`- [facebook ${c.id}] ${c.from?.name ?? "someone"}: ${c.message}${answered ? "  (answered)" : ""}  <- ${p.permalink_url}`);
  }

  const found = lines.length - 2;
  if (!found) lines.push("No new comments.");
  mkdirSync(new URL("../results/", import.meta.url), { recursive: true });
  const file = new URL(`../results/comments-${new Date().toISOString().slice(0, 10)}.md`, import.meta.url);
  writeFileSync(file, lines.join("\n") + "\n");
  console.log(`${found} comment(s) -> ${file.pathname}`);
} else {
  throw new Error("usage: comments.mjs fetch [--days N] | reply <platform> <comment-id> <text>");
}

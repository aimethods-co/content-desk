// Publish one content folder to Instagram and the Facebook Page.
//
//   node scripts/publish.mjs content/<folder> [--dry-run]
//
// The folder needs:
//   post.json        { "platforms": ["instagram", "facebook"],
//                      "media": ["png/slide-01.png", ...] or ["reel.mp4"],
//                      "caption": "...", "facebook_caption": "..." (optional),
//                      "format": "story" (optional: 9:16 image or video story),
//                      "publish_at": "2026-11-08T09:00:00+05:30" (your utc_offset) (used by run-queue.mjs) }
//   compliance.md    starting with "VERDICT: PASS". Nothing else is published.
// No media = a Facebook text post (Instagram has no text-only posts).
// It writes published.json with the post ids, and refuses to publish twice.

import { existsSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { accounts, get, igReady, post, stageImage } from "./meta.mjs";

const dir = resolve(process.argv[2] ?? "");
const dryRun = process.argv.includes("--dry-run");

const spec = JSON.parse(readFileSync(join(dir, "post.json"), "utf8"));
const verdict = existsSync(join(dir, "compliance.md")) ? readFileSync(join(dir, "compliance.md"), "utf8") : "";
if (!verdict.startsWith("VERDICT: PASS")) throw new Error(`${dir}: compliance.md is missing or not a PASS`);
if (existsSync(join(dir, "published.json"))) throw new Error(`${dir}: already published (published.json exists)`);

const media = (spec.media ?? []).map((m) => join(dir, m));
for (const m of media) if (!existsSync(m)) throw new Error(`missing media: ${m}`);
const isVideo = media.length === 1 && /\.(mp4|mov)$/i.test(media[0]);
const isStory = spec.format === "story";
const isText = media.length === 0;
if (!isVideo && media.length > 10) throw new Error("Instagram carousels take at most 10 images");
if (isStory && media.length !== 1) throw new Error("a story is exactly one image or video");

const acct = await accounts();
const kind = isText ? "text" : isStory ? `story (${isVideo ? "video" : "image"})` : isVideo ? "video" : `${media.length} image(s)`;
console.log(`Page: ${acct.pageName}  Instagram: @${acct.igUser}  ${kind}`);
if (dryRun) process.exit(0);

const out = {};

if (spec.platforms.includes("instagram") && !isText) {
  out.instagram = isStory
    ? isVideo ? await igReel(media[0], undefined, "STORIES") : await igStoryImage(media[0])
    : isVideo ? await igReel(media[0], spec.caption) : await igImages(media, spec.caption);
  console.log(`instagram: ${out.instagram.permalink ?? out.instagram.id}`);
}
if (spec.platforms.includes("facebook")) {
  const caption = spec.facebook_caption ?? spec.caption;
  if (isText) out.facebook = await post(`/${acct.pageId}/feed`, { message: caption, access_token: acct.pageToken });
  else if (isStory && !isVideo) out.facebook = await fbStoryImage(media[0]);
  else if (isStory) console.log("facebook: video stories are Instagram-only here; skipped");
  else out.facebook = isVideo ? await fbVideo(media[0], caption) : await fbImages(media, caption);
  if (out.facebook) console.log(`facebook: ${out.facebook.id ?? out.facebook.post_id}`);
}

writeFileSync(join(dir, "published.json"), JSON.stringify({ at: new Date().toISOString(), ...out }, null, 2));

async function igImages(files, caption) {
  const t = { access_token: acct.pageToken };
  const urls = [];
  for (const f of files) urls.push((await stageImage(acct, f)).url);
  let creation;
  if (urls.length === 1) {
    creation = (await post(`/${acct.igId}/media`, { image_url: urls[0], caption, ...t })).id;
  } else {
    const children = [];
    for (const url of urls) children.push((await post(`/${acct.igId}/media`, { image_url: url, is_carousel_item: "true", ...t })).id);
    for (const c of children) await igReady(acct, c);
    creation = (await post(`/${acct.igId}/media`, { media_type: "CAROUSEL", children: children.join(","), caption, ...t })).id;
  }
  await igReady(acct, creation);
  const { id } = await post(`/${acct.igId}/media_publish`, { creation_id: creation, ...t });
  return { id, ...(await get(`/${id}`, { fields: "permalink", ...t })) };
}

async function igStoryImage(file) {
  const t = { access_token: acct.pageToken };
  const { url } = await stageImage(acct, file);
  const creation = (await post(`/${acct.igId}/media`, { image_url: url, media_type: "STORIES", ...t })).id;
  await igReady(acct, creation);
  return post(`/${acct.igId}/media_publish`, { creation_id: creation, ...t });
}

async function fbStoryImage(file) {
  const { id } = await stageImage(acct, file);
  return post(`/${acct.pageId}/photo_stories`, { photo_id: id, access_token: acct.pageToken });
}

async function igReel(file, caption, mediaType = "REELS") {
  const t = { access_token: acct.pageToken };
  const params = { media_type: mediaType, upload_type: "resumable", ...t };
  if (caption) params.caption = caption;
  const { id: creation, uri } = await post(`/${acct.igId}/media`, params);
  const bytes = readFileSync(file);
  const res = await fetch(uri, {
    method: "POST",
    headers: { Authorization: `OAuth ${acct.pageToken}`, offset: "0", file_size: String(statSync(file).size) },
    body: bytes,
  });
  if (!res.ok) throw new Error(`reel upload: ${res.status} ${await res.text()}`);
  await igReady(acct, creation);
  const { id } = await post(`/${acct.igId}/media_publish`, { creation_id: creation, ...t });
  return { id, ...(await get(`/${id}`, { fields: "permalink", ...t })) };
}

async function fbImages(files, message) {
  if (files.length === 1) return stageImage(acct, files[0], { published: true, caption: message });
  const attached = [];
  for (const f of files) attached.push({ media_fbid: (await stageImage(acct, f)).id });
  const params = { message, access_token: acct.pageToken };
  attached.forEach((a, i) => (params[`attached_media[${i}]`] = JSON.stringify(a)));
  return post(`/${acct.pageId}/feed`, params);
}

async function fbVideo(file, description) {
  const form = new FormData();
  form.set("source", new Blob([readFileSync(file)]), "video.mp4");
  form.set("description", description);
  form.set("access_token", acct.pageToken);
  return post(`/${acct.pageId}/videos`, {}, form);
}

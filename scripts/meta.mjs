// Thin client for the Meta Graph API: your Facebook Page and its linked
// Instagram account. Token comes from .env (META_SYSTEM_USER_TOKEN).

import { readFileSync } from "node:fs";
import { basename } from "node:path";

const G = "https://graph.facebook.com/v24.0";

export function env(name) {
  // GitHub Actions passes secrets as environment variables; locally they live in .env.
  if (process.env[name]) return process.env[name];
  const line = readFileSync(new URL("../.env", import.meta.url), "utf8")
    .split(/\r?\n/)
    .find((l) => l.startsWith(`${name}=`));
  const value = line?.slice(name.length + 1).trim();
  if (!value) throw new Error(`${name} is empty in .env`);
  return value;
}

async function call(method, path, params = {}, body) {
  const url = new URL(G + path);
  if (method === "GET") for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  const res = await fetch(url, {
    method,
    body: method === "GET" ? undefined : body ?? new URLSearchParams(params),
  });
  const json = await res.json();
  if (json.error) throw new Error(`${method} ${path}: ${json.error.message}`);
  return json;
}
export const get = (path, params) => call("GET", path, params);
export const post = (path, params, body) => call("POST", path, params, body);

/** The Page, its token, and the linked Instagram account. */
export async function accounts() {
  const token = env("META_SYSTEM_USER_TOKEN");
  // The token is a 60-day one by choice: warn while there's time to replace it.
  const { data: info } = await get("/debug_token", { input_token: token, access_token: token });
  const daysLeft = info.expires_at ? Math.floor((info.expires_at * 1000 - Date.now()) / 864e5) : Infinity;
  if (daysLeft <= 10) console.warn(`WARNING: the Meta token expires in ${daysLeft} day(s). Generate a new one and put it in .env.`);
  const { data } = await get("/me/accounts", {
    fields: "id,name,access_token,instagram_business_account{id,username}",
    access_token: token,
  });
  const page = data[0];
  if (!page) throw new Error("The token sees no Facebook Page. Assign the Page to the system user.");
  const ig = page.instagram_business_account;
  if (!ig) throw new Error(`Page "${page.name}" has no linked Instagram professional account.`);
  return { pageId: page.id, pageName: page.name, pageToken: page.access_token, igId: ig.id, igUser: ig.username };
}

/** Upload an image to the Page without publishing it. Returns its id and a
 *  public CDN URL, which is what Instagram needs to fetch the image. */
export async function stageImage(acct, file, { published = false, caption } = {}) {
  const form = new FormData();
  form.set("source", new Blob([readFileSync(file)]), basename(file));
  form.set("published", String(published));
  if (!published) form.set("temporary", "true");
  if (caption) form.set("caption", caption);
  form.set("access_token", acct.pageToken);
  const { id } = await post(`/${acct.pageId}/photos`, {}, form);
  const { images } = await get(`/${id}`, { fields: "images", access_token: acct.pageToken });
  return { id, url: images[0].source };
}

/** Wait for an Instagram container to finish processing. */
export async function igReady(acct, containerId) {
  for (let i = 0; i < 60; i++) {
    const { status_code } = await get(`/${containerId}`, { fields: "status_code", access_token: acct.pageToken });
    if (status_code === "FINISHED") return;
    if (status_code === "ERROR" || status_code === "EXPIRED") throw new Error(`Instagram container ${containerId}: ${status_code}`);
    await new Promise((r) => setTimeout(r, 5000));
  }
  throw new Error(`Instagram container ${containerId} still processing after 5 minutes`);
}

// Publish the desk app to GitHub Pages (desk_pages_repo in desk.config.json).
//
//   node scripts/deploy-admin.mjs
//
// Reads ADMIN_GITHUB_TOKEN and ADMIN_PASSWORD from .env, writes the encrypted
// vault and config.js, and pushes them with index.html + logo.png to the Pages repo. Only
// the encrypted vault ever leaves this machine; the password never does.
// Re-run it after changing the page, the token or the password.

import { execFileSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { env } from "./meta.mjs";
import { config } from "./config.mjs";

const root = new URL("..", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const site = join(root, "..", config.desk_pages_repo.split("/")[1]);
const git = (...args) => execFileSync("git", args, { cwd: site, stdio: "pipe" }).toString().trim();

process.env.ADMIN_PASSWORD = env("ADMIN_PASSWORD");
process.env.ADMIN_GITHUB_TOKEN = env("ADMIN_GITHUB_TOKEN");
execFileSync(process.execPath, [join(root, "scripts", "admin-vault.mjs")], { stdio: "inherit", env: process.env });

if (!existsSync(join(site, ".git"))) {
  mkdirSync(site, { recursive: true });
  execFileSync("git", ["clone", `https://github.com/${config.desk_pages_repo}.git`, site], { stdio: "inherit" });
}
const configJs = `export const CONFIG = ${JSON.stringify(config)};
`;
writeFileSync(join(root, "admin", "config.js"), configJs);
writeFileSync(join(site, "config.js"), configJs);
for (const f of ["index.html", "vault.js"]) copyFileSync(join(root, "admin", f), join(site, f));
copyFileSync(join(root, "brand", "logo", "logo.png"), join(site, "logo.png"));

git("add", "-A");
if (git("status", "--porcelain")) {
  git("commit", "-m", "deploy desk app");
  try { git("push", "-u", "origin", "HEAD:main"); } catch { git("push", "-u", "origin", "HEAD:main"); }
  const [owner, name] = config.desk_pages_repo.split("/");
  console.log(`pushed; GitHub Pages: https://${owner}.github.io/${name}/`);
} else console.log("nothing changed");

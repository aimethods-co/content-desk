---
name: setup
description: First-run onboarding. Turns this repo into one brand's content desk - fills the brand, compliance, calendar and replies skills, brand.css, desk.config.json and .agents/product-marketing.md from the brand's website, then connects Instagram/Facebook, GitHub Actions and the phone desk app. Use when the user says "setup", "set this up", "onboard my brand", or when the brand skill still contains FILL.
---

# Setup

Goal: a working desk with as few questions as possible. **Work out everything
you can from the website before asking anything.** Every question you ask is
one the owner might not answer.

## 1. Ask for one thing

> What's your website? (If there isn't one, tell me what you sell and who buys it.)

## 2. Derive from the site

Read the home page, pricing, about, FAQ and terms (WebFetch). Then:

- **Positioning and audience:** run `product-marketing` to write
  `.agents/product-marketing.md`, filling it from the site, not from questions.
- **Colours, type, voice:** run `brand-dna` on the URL. Put the colours into
  `brand/brand.css` (keep the token names), and the font if it's on Google Fonts.
- **Approved claims:** copy the site's own claims into the `brand` skill's
  table with the page URL as the source. Leave out anything the site can't
  back (big numbers with no source, "the best", testimonials you can't verify)
  and list those under "Claims we do not repeat".
- **Logo:** download the site's logo or favicon at the largest size available
  into `brand/logo/logo.png`, unchanged. If only an SVG exists, render it to
  PNG with `npm run shot` at 1024x1024 on a solid plate, without changing the mark.
- **Timezone and locale:** from the site's address, phone code or currency.
  Write `desk.config.json` (`name`, `timezone`, `utc_offset`, `locale`).
- **Industry rules:** if it's health, finance, legal, alcohol, gambling,
  dating, politics or anything else with platform restrictions, add those
  rules to the `compliance` skill's section 1.8.
- **Calendar:** write 4-6 content pillars and the next 3 months of dates
  that matter in that market and industry (look each one up, cite it).
- **Replies:** write who we're reaching and where an interested commenter goes.

Replace every FILL. `grep -rn FILL .claude/skills .agents` must come back empty.

## 3. Show, then ask only what you couldn't derive

Show the owner a short summary: the one-line pitch, the audience, five
approved claims, the colours and the logo. Ask them to correct anything wrong
in one reply. Then ask only for what you still don't have, typically:

- where "link in bio" should go;
- topics or words they never want used.

## 4. Connect the accounts

Walk the owner through each step and check it worked before moving on.

1. **Meta** (Instagram professional account linked to a Facebook Page):
   Meta Business Suite > Settings > Users > System users > add one, assign the
   Page and the Instagram account, generate a token with
   `instagram_basic, instagram_content_publish, instagram_manage_comments,
   pages_show_list, pages_read_engagement, pages_manage_posts,
   pages_manage_engagement, business_management`. Put it in `.env` as
   `META_SYSTEM_USER_TOKEN`. Check: `node scripts/check-meta.mjs` prints the
   Page and the Instagram username.
2. **GitHub:** push this repo (private is fine). Set `repo` and `branch` in
   `desk.config.json`. Add the secrets `META_SYSTEM_USER_TOKEN` and
   `CLAUDE_CODE_OAUTH_TOKEN` (from `claude setup-token`) under
   Settings > Secrets and variables > Actions. Check: run the `queue` workflow
   by hand from the Actions tab and see it finish green.
3. **Desk app (phone):** create an empty public repo for GitHub Pages and set
   `desk_pages_repo`. Make a fine-grained GitHub token with access to this
   repo only (Contents: read and write, Actions: read and write) as
   `ADMIN_GITHUB_TOKEN`, pick an `ADMIN_PASSWORD` of 16+ characters, both in
   `.env`. Run `node scripts/deploy-admin.mjs`, then turn on Pages for that repo
   (main branch, root). Check: the page opens and unlocks.
4. **Schedules:** the cron times in `.github/workflows/desk.yml` are UTC.
   Convert them for the owner's timezone.

## 5. First week

Delete `content/_example`. Run the weekly desk by hand (Actions > desk >
Run workflow > weekly), or say "plan and make next week" here. Tell the owner
where to look: the desk app, `QUEUE.md`, and `FEEDBACK.md` for anything they
want changed.

# Content Desk

This repo is a brand's whole social media team: it plans, makes, checks,
schedules and posts Instagram and Facebook content, and answers comments.
The owner runs it by talking to Claude here, from the phone desk app, or by
writing in `FEEDBACK.md`. Close gaps yourself instead of suggesting a hire.

## First run

This repo ships as AI Methods' own desk (aimethods.co). If `git remote -v`
isn't `aimethods-co/content-desk`, run the `setup` skill before anything
else: it swaps AI Methods for your brand. Nothing gets published until then.

## Rules

- Read `.agents/product-marketing.md` first: who we post for, the current
  focus, and what has worked (Learnings).
- **Every public piece goes through the `compliance` skill before it ships.**
  Save the verdict as `compliance.md` next to the piece. `publish.mjs` refuses
  anything without `VERDICT: PASS`.
- Claims, logo, colours and voice come from the `brand` skill. Never invent
  a number, a result, a testimonial or a date.
- Use the logo files in `brand/logo/` exactly as they are. Don't recolour or
  redraw them.
- Where a third-party skill disagrees with `brand` or `compliance`, those
  two win (for example: a skill suggests testimonials, made-up proof numbers
  or targeting by personal attributes).
- **Never spend money and never DM anyone first.** Ads stay off until the
  owner turns them on.
- Every day needs at least 1 reel, 1 post and 1 story. How to make each piece:
  `scripts/desk/make.md`. Owner references arrive as `REF:` lines in
  FEEDBACK.md and files in `inbox/`: study them first.
- Put work in `content/YYYY-MM-DD-slug/` (or `ads/YYYY-MM-campaign/` once
  ads are on). Render HTML with `npm run shot -- <file> --size WxH`.
- Times in `post.json` use the `utc_offset` in `desk.config.json`.

## Commands

| Job | Command |
|---|---|
| Render slides / stills | `npm run shot -- content/<folder>/carousel.html [--size 1080x1920]` |
| Render a reel's frames | `node scripts/frames.mjs <composition.html> <out-dir>` |
| Music bed | `python scripts/score.py ...` |
| Voiceover | `python scripts/voice.py --lines vo.json --duration <s> --voice <voice>` |
| Mix | `python scripts/mix.py --music ... --voice ... --out mix.wav` |
| Post one folder now | `node scripts/publish.mjs content/<folder>` |
| Post everything due | `node scripts/run-queue.mjs` |
| Comments | `node scripts/comments.mjs fetch`, then the `replies` skill, then `comments.mjs reply` |
| Check the Meta token | `node scripts/check-meta.mjs` |
| Deploy the desk app | `node scripts/deploy-admin.mjs` |

## Skills (`.claude/skills/`)

| Job | Skills |
|---|---|
| Onboarding | `setup` |
| Foundation | `product-marketing` (owns `.agents/product-marketing.md`), `brand`, `brand-voice-guidelines`, `brand-dna` |
| Research | `competitor-ads-analyst`, `reel-analyzer` |
| Reels | `virality`, `viral-hook-writer`, `reel-scripter`, `reel-builder`, `on-screen-text-writer`, `cover-thumbnail-brief` |
| Static | `carousel-builder`, `viral-carousel`, `canvas-design` |
| Plan and schedule | `calendar`, `content-calendar` |
| Publish and review | `caption-and-hashtags`, `replies`, `social-analytics-report` |
| Launch video | `brag-slim`, `launch` |
| Ads (off by default) | `ads`, `ad-creative`, `copywriting`, `marketing-psychology` |
| LinkedIn (off by default) | `linkedin-thought-leadership` |
| Final check | `compliance` |

Third-party skills, their sources and licences are listed in `third_party/`.

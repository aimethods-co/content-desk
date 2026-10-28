# Content Desk

**An AI social media team that lives in a GitHub repo.** It plans a week of
Instagram and Facebook content, makes the reels, carousels and stories,
checks every piece against your brand rules, posts on schedule and answers
comments. You review from your phone.

Built on [Claude Code](https://claude.com/claude-code). Made by
[AI Methods](https://aimethods.co).

```
Sunday             every evening              every half hour
  |                     |                           |
  v                     v                           v
plan the week  ->  make tomorrow's pieces  ->  post what's due
(calendar skill)   (reel, post, story)        (queue workflow)
                   check each one              update QUEUE.md
                   (compliance skill)
                        ^
                        |
          you: desk app on your phone, or FEEDBACK.md
          "change this", "remake that", "more like this reel"
```

## What you get

- **Reels with motion, music and voiceover.** HTML compositions rendered
  frame by frame, an original music bed (`score.py`) and a local text-to-speech
  voiceover (`voice.py`, Kokoro). No stock footage, and no licensed audio to
  worry about.
- **Carousels, single images, stories and memes,** rendered from HTML in your
  brand's colours and type.
- **A compliance gate.** Nothing posts without a `VERDICT: PASS` from the
  `compliance` skill: approved claims only, no invented numbers, platform ad
  rules, your banned words.
- **"Never get comfortable".** The desk logs every format it uses and won't
  repeat a hook, structure or motion style from the last four pieces.
- **A phone app** (a static page on GitHub Pages) to preview, edit, hold,
  post now, remake or drop any piece, and to send references ("make one like
  this reel").
- **Comment replies** for routine questions. Complaints, spam and anything
  about money get flagged for you instead.
- **29 skills** for hooks, scripts, carousels, captions, analytics and
  research. Open-source skills are credited in `third_party/`.

## Quick start

You need: [Claude Code](https://claude.com/claude-code), Node 20+,
Python 3.12, Chrome, an Instagram professional account linked to a Facebook
Page, and a GitHub account.

```bash
# 1. Make your own copy: "Use this template" on GitHub, or
git clone https://github.com/aimethods-co/content-desk my-content && cd my-content

# 2. Install the tools
npm install
pip install numpy==1.26.4 kokoro==0.9.4 soundfile==0.13.1   # voiceover; also install espeak-ng

# 3. Open Claude Code here and onboard your brand
claude
> /setup
```

`/setup` asks for your website and works the rest out from it: your pitch,
audience, approved claims, colours, logo and timezone. It shows you what it
found, asks only what it couldn't work out, then walks you through connecting
Meta, GitHub Actions and the phone app, checking each step.

After that you can leave it running. Say "plan and make next week" any time
to run the desk by hand.

## How it runs

| Workflow | When | What it does |
|---|---|---|
| `queue` | every half hour | posts whatever is due, retries failures 3 times, rewrites `QUEUE.md` |
| `desk` (weekly) | Sunday | plans 7 days into `results/plan.md`, makes the first two |
| `desk` (daily) | every evening | handles your feedback, makes tomorrow, replies to comments |

The desk runs Claude Code in GitHub Actions on your Claude subscription
(`CLAUDE_CODE_OAUTH_TOKEN`). Cron times in `.github/workflows/` are UTC:
setup converts them. GitHub can delay scheduled runs. If exact times matter,
call each workflow's `workflow_dispatch` from an external scheduler (Google
Cloud Scheduler, cron-job.org) instead.

**Actions minutes:** public repos run free. On a private repo the half-hourly
queue and the daily desk add up, so check your GitHub plan's included minutes
or trim the queue's cron to the slots you actually post in.

## Where things live

```
desk.config.json        brand name, timezone, repo names
.agents/product-marketing.md   who we are, who we post for, what worked (read first)
.claude/skills/         brand, compliance, calendar, replies, setup + 24 more
brand/                  brand.css (tokens) and logo/
templates/              starting points (carousel, saved reel styles)
content/YYYY-MM-DD-slug/  one folder per piece: post.json, compliance.md, media
scripts/                render, publish, queue, comments, music, voice, mix
scripts/desk/           the prompts the scheduled desk runs
admin/                  the phone desk app (single HTML file)
QUEUE.md                what's coming up and what went out
FEEDBACK.md             write here; the desk acts on it and moves it to Done
ISSUES.md               what needs you: failed posts, flagged comments
```

A piece is a folder with `post.json`:

```json
{
  "platforms": ["instagram", "facebook"],
  "media": ["png/slide-01.png", "png/slide-02.png"],
  "caption": "...",
  "format": "story",
  "publish_at": "2026-11-08T13:00:00+05:30",
  "expires_at": "2026-11-08T23:59:00+05:30"
}
```

`media` is images (a carousel when there's more than one), one `.mp4` (a reel), or
empty (a Facebook text post). `format: "story"` makes it a story. See
`content/_example/`.

## Safety

- Secrets stay in `.env` (git-ignored) and GitHub Actions secrets.
- The phone app holds only your GitHub token encrypted with AES-256-GCM
  (PBKDF2, 600k iterations). Without your password the published file is useless.
- The desk never spends money, never DMs anyone first, and never posts a
  piece without a compliance PASS.

## Want it set up for you?

AI Methods sets up and runs Content Desk for brands that want the result
without the setup: [aimethods.co/contact](https://aimethods.co/contact).

## Licence

MIT, see `LICENSE`. Third-party skills keep their own licences (MIT and
Apache 2.0), listed in `third_party/`.

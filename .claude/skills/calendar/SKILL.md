---
name: calendar
description: Plan and schedule Instagram and Facebook posting for the coming week. Covers the format mix (reels, carousels, stories, single images, memes, Facebook text posts), posting times, festivals and dates the audience cares about, and topical memes kept on-brand. Use for the weekly planning run, "plan next week", "what should we post", "is there a holiday coming", or "make a meme about X".
---

# Content calendar

Who we post for is in `.agents/product-marketing.md`. Every week mixes
formats, each made on its own merits. A reel doesn't have to come from a
carousel, and the other way round.

## Weekly mix (starting point; adjust from `social-analytics-report`)

**Every day: at least 1 reel, 1 post and 1 story.** Reels and stories carry
reach, so they get the best hooks.

| Format | Per day | Slot (local time) | Built with |
|---|---|---|---|
| Reel | 1+ | 19:30 weekdays, 11:00 weekends | `reel-builder` / `virality` / `brag-slim` + `scripts/frames.mjs` + `scripts/score.py` + `scripts/voice.py` |
| Post (carousel, image or meme) | 1+ | 13:00 | `carousel-builder`, `viral-carousel`, `npm run shot` |
| Story (9:16) | 1-3 | 10:00, plus 18:30 to tease the reel | `npm run shot -- <file> --size 1080x1920` |
| Facebook text post | 0-2 a week | 12:00 | caption only |

Times go on the hour or half hour, when the queue runs. Adjust slots to the
owner's audience once `social-analytics-report` has a few weeks of data.

**Light and dark.** Don't default to one. At least a third of each week's
pieces use the light ground. Log the ground in `results/formats.md`.

## Never get comfortable (hard rule)

Same-looking posts kill reach. Before making anything, read
`results/formats.md`, the log of what each queued or published piece used.
After making something, add its row there:

`| date | folder | format | hook type | structure | motion | ground | music | voice |`

- **No two reels in a row share a structure, hook type or motion style.**
  - Hook types: POV, question, bold claim, number, "you're doing X wrong",
    a myth, a countdown, an object in motion, a sound cue, a fake notification.
  - Structures: list, before and after, a day in the life, a quiz with the
    answer at the end, a mock UI walkthrough, a split screen, a kinetic-type
    monologue, a one-shot slow push-in, a chat-style story, a timeline.
  - Motion: wipes, push-ins, type-on, counters, cards stacking, a scrolling
    feed, a calendar flipping, a slow zoom.
  - Change the music feel too: tempo, key and texture (`score.py` arguments).
- **Look at least 4 pieces back.** If the new piece looks like any of them,
  change it.
- **Every week, try one thing we've never done.** Log it as an experiment and
  read its numbers the next week.
- Stories are not shrunken posts: polls-as-copy, countdowns, "this or that",
  reel teasers, behind-the-scenes notes.
- Never reuse a hook or headline that already ran.

## Topics

FILL (the `setup` skill writes 4-6 content pillars from
`.agents/product-marketing.md`: what the product does for the reader, the
reader's world, practical tips, light humour about the work, occasions).

Never: FILL (topics the owner rules out).

## Dates that matter

| Date | Occasion | Plan | Source |
|---|---|---|---|
| FILL | | | |

Festivals and holidays in the owner's market, industry days, deadlines the
audience works to. **Look each date up before adding it** and note the
source. Plan a short arc for big ones (a teaser a few days before, the day
itself, an optional thank-you after), with `expires_at` at the end of the day
so a late run never posts a greeting the day after.

Greeting rules: warm, short, no sales pitch, in brand style. No religious
figures or stock imagery.

## Memes

Each week, search for what's current in the audience's world and build our
own version.
- **Our visuals only:** typographic memes in brand style (two-panel
  "Expectation / Reality", "Nobody: / Us in <season>:", a fake notification,
  a chat bubble, a checklist). No film stills, celebrity faces or copyrighted
  images.
- **Humour about the work, never about people:** never mock customers,
  competitors, religion, politics, region or gender.
- Still on-brand, and it still goes through `compliance`.

## Scheduling

Each piece is a folder `content/YYYY-MM-DD-slug/` with:
- `post.json`: `platforms`, `media`, `caption`, optional `format: "story"`,
  `publish_at` (ISO with the `utc_offset` from `desk.config.json`), optional
  `expires_at`;
- `compliance.md` starting `VERDICT: PASS`;
- the rendered media.

`scripts/run-queue.mjs` posts it when due and updates `QUEUE.md`. Before
planning, read `FEEDBACK.md` and `ISSUES.md` and act on them first.

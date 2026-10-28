---
name: brand
description: The brand's look, logo rules, voice and approved claims. Use before making any post, ad, reel, carousel, story, thumbnail, video or caption, and whenever another skill asks for brand colours, fonts, voice or "proof". Where a third-party skill disagrees with this file, this file wins.
---

# Brand

<!-- This is AI Methods' brand (aimethods.co), which runs this desk. The
     `setup` skill rewrites every section below for a new brand. -->

**What we sell, in one line:** AI Methods builds agents, automations and custom AI systems, and ships its own AI products.

Who we talk to, positioning and learnings live in `.agents/product-marketing.md`
(the `product-marketing` skill owns it). This file is the visual and claims
layer on top.

## Approved claims

Every claim in a post must come from this table, word for word or close to it.
Anything else needs a source before it ships. Take these from the live site,
the product itself, or what the owner states. Never write one from a guess.

| Claim | Wording | Source |
|---|---|---|
| What we do | "Integrate AI into your existing business." | aimethods.co (home) |
| How | "We build agents, automations, and custom AI systems that plug directly into what your team already uses." | aimethods.co (home) |
| Products | "AI tools built for real work." / "We build products we believe in and use ourselves." | aimethods.co/products |
| RouteAI | Routes each prompt to the AI model that fits it best | aimethods.co/products |
| BizAgent | WhatsApp AI agent: audits a business from its Google Maps link and makes a demo site | aimethods.co/products |
| QuickCA | ITR filing over WhatsApp with a verified CA | aimethods.co/products |
| Cue | Reminders that fire on place or app, not just time (Android) | aimethods.co/products |
| Content Desk | An AI social media team in a GitHub repo: plans, makes, checks and posts Instagram and Facebook content | this repo |
| Content Desk | Free, open source, MIT licensed | this repo (LICENSE) |
| Content Desk | Nothing posts without a compliance PASS | scripts/publish.mjs |
| Content Desk | Set up with one command: /setup | this repo |
| Contact | quickca@thequickca.com | owner, 2026-10-28 |

**Claims we do not repeat** (even if they appear somewhere): "No disruption, just results", any client result, client count, ROI or time saved, and the site's testimonials (not verified for ads).

**Banned words:** "revolutionise",
"seamless", "hassle-free", "one-stop solution", "game-changer",
"excited to announce", and fear-based framing.

Never invent a price, a number of users, a result, a rating, a time saved, a
percentage or a testimonial.

## Logo

Files live in `brand/logo/`. `logo.png` is the main one (also the desk app
icon and the profile picture).

- Use the files exactly as supplied. No recolouring, filters, opacity, masks,
  outlines, or redrawing the mark in SVG or code.
- Dark grounds: `logo-transparent.png` (white mark). Light grounds and
  unknown grounds (profile pictures, link previews): `logo.png` (the mark on
  a near-black plate). Never put the white mark straight on a light ground.
- If no file fits, ask the owner for one. Don't make one.

## Colour and type

Tokens are in `brand/brand.css`. Link it from every HTML piece.

| Token | Value | Use |
|---|---|---|
| `--b-night` / `--b-paper` | `#0A0A0A` / `#F5F5F7` | default dark / light ground |
| `--b-deep` | `#141414` | stats, closing slide |
| `--b-accent` / `--b-accent-on-dark` | `#16A34A` / `#22C55E` | one thing per slide (a tick, "Live", PASS) |

Font: Inter. Body text meets 4.5:1 contrast on its ground.

**Visual style** (from aimethods.co):
- Black and white first. Greys carry hierarchy. Green only for one small
  signal per slide.
- Inter 900 headlines, tight tracking, line-height about 1.0.
- Show the product's own world: a terminal, a queue, a chat, a card. Mark
  mock UI "Illustrative".
- One dominant element per slide. No stock photos, emoji or clip art.

Sizes: feed portrait 1080x1350, square 1080x1080, story/reel 1080x1920, link
preview 1200x630.

## Voice

- Short words. Short lines. Aim for a reading score of 90+.
- Builder to builder: plain, specific, a little dry.
- Say what it does for the reader, then how.
- English. No hype.

## Before it ships

Run the `compliance` skill on anything going public.

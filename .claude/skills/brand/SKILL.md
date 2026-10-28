---
name: brand
description: The brand's look, logo rules, voice and approved claims. Use before making any post, ad, reel, carousel, story, thumbnail, video or caption, and whenever another skill asks for brand colours, fonts, voice or "proof". Where a third-party skill disagrees with this file, this file wins.
---

# Brand

<!-- The `setup` skill fills in every section marked FILL. Until it has run,
     nothing may be published: the compliance skill fails anything that relies
     on an unfilled section. -->

**What we sell, in one line:** FILL

Who we talk to, positioning and learnings live in `.agents/product-marketing.md`
(the `product-marketing` skill owns it). This file is the visual and claims
layer on top.

## Approved claims

Every claim in a post must come from this table, word for word or close to it.
Anything else needs a source before it ships. Take these from the live site,
the product itself, or what the owner states. Never write one from a guess.

| Claim | Wording | Source |
|---|---|---|
| FILL | FILL | FILL (page URL, or "owner, YYYY-MM-DD") |

**Claims we do not repeat** (even if they appear somewhere): FILL or "none yet".

**Banned words:** FILL. Defaults until the owner changes them: "revolutionise",
"seamless", "hassle-free", "one-stop solution", "game-changer",
"excited to announce", and fear-based framing.

Never invent a price, a number of users, a result, a rating, a time saved, a
percentage or a testimonial.

## Logo

Files live in `brand/logo/`. `logo.png` is the main one (also the desk app
icon and the profile picture).

- Use the files exactly as supplied. No recolouring, filters, opacity, masks,
  outlines, or redrawing the mark in SVG or code.
- Dark grounds: FILL (which file). Light grounds: FILL. Unknown ground
  (profile pictures, link previews): a version on a solid plate.
- If no file fits, ask the owner for one. Don't make one.

## Colour and type

Tokens are in `brand/brand.css`. Link it from every HTML piece.

| Token | Value | Use |
|---|---|---|
| `--b-night` / `--b-paper` | FILL | default dark / light ground |
| `--b-deep` | FILL | stats, closing slide |
| `--b-accent` / `--b-accent-on-dark` | FILL | one thing per slide |

Font: FILL (default Inter). Body text meets 4.5:1 contrast on its ground.

**Visual style:** FILL (2-6 bullets: grounds, how the accent is used,
headline weight and tracking, what imagery is and isn't allowed). Defaults:
one dominant element per slide; hierarchy from size and weight, not colour;
no stock photos, emoji or clip art; illustrative product UI labelled
"Illustrative".

Sizes: feed portrait 1080x1350, square 1080x1080, story/reel 1080x1920, link
preview 1200x630.

## Voice

FILL (3-6 bullets: tone, reading level, language(s), words we prefer).
Defaults: plain, specific, confident without being loud. Say what happens
for the reader, not how it's built.

## Before it ships

Run the `compliance` skill on anything going public.

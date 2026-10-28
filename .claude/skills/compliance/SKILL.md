---
name: compliance
description: Final check on any post, ad, reel, carousel, caption, reply script or landing copy before it is published or sent to an ad platform. Covers the brand's own rules, platform ad policies and honest claims. Use when the user says "check this", "is this ok to post", "review this ad", and before handing any content over as final. Its verdict goes in compliance.md, which publish.mjs requires.
---

# Compliance

Go through every line of the piece, including on-screen text and voiceover,
against the rules below. Report each problem with the exact line, the rule
and a rewrite. If nothing fails, say so. Don't soften a fail into a
"consider".

## 0. Setup

If `desk.config.json` says "AI Methods" but this repo isn't
`aimethods-co/content-desk` (check `git remote -v`), the verdict is FIX NEEDED:
"Run the setup skill first." A copy never posts on AI Methods' brand.

## 1. The brand's own rules

1. **Approved claims only.** Every claim and number is in the `brand` skill's
   approved-claims table, or comes with a source you checked today.
2. **No invented figures.** No made-up prices, user counts, results, ratings,
   percentages or time saved.
3. **No fake proof.** No testimonials, reviews, logos of customers, or
   "as seen in" unless the owner supplied them and said they can be used.
4. **No real personal data.** No real names, faces, chats, documents or
   screenshots of real people without the owner's written OK. Use made-up
   stand-ins labelled as samples.
5. **Banned words** from the `brand` skill fail the line.
6. **No exaggerated or disparaging claims:** "the best", "#1", "cheaper than X",
   attacks on a competitor.
7. **Logo and colours** follow the `brand` skill. Fail a recoloured or redrawn logo.
8. Brand-specific rules (AI Methods; `setup` rewrites these): never name a
   client or show client work; never claim what an AI model can do beyond
   what our product does; QuickCA posts follow QuickCA's own rules (no tax
   figures, no CA names).

## 2. Platform rules (Meta: Facebook, Instagram)

- **Personal attributes.** Copy must not say or imply that we know the reader's
  money situation, health, religion, ethnicity, sexuality, age or other
  personal attributes ("Struggling with debt?", "Are you diabetic?").
  Talk about the topic, not about the reader.
- **No before/after promises** of money, weight, health or results.
- **The destination matches the post.** If the post says "link in bio", the bio
  link goes where the post says.
- No trending audio, film stills, celebrity faces or copyrighted images we
  don't hold rights to.

## 3. Dates and urgency

- Every date is checked at its source the week it is used. If it can't be
  confirmed, drop it.
- Urgency only when it's real. Never invented scarcity ("only 5 left").

## Output

The first line of compliance.md must be the verdict, exactly:

```
VERDICT: PASS | FIX NEEDED
[line] -> [rule] -> [rewrite]
```

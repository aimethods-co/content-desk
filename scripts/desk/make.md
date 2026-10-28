How to make a piece (read by the weekly and daily desk runs)

1. Read the brand skill (claims, banned words, visual style, brand/brand.css),
   the calendar skill ("Never get comfortable"), the last rows of
   results/formats.md, results/references.md and Learnings. Nothing may look
   like the previous four pieces of its format.
2. Pick the skill for the format: viral-hook-writer and virality for every
   hook; carousel-builder / viral-carousel for carousels; reel-builder /
   brag-slim for reels; caption-and-hashtags for captions. Don't restrict
   yourself: try kinetic type, chat or notification UI, split screens,
   countdowns, quizzes, myth vs fact, a day in the season, a fake app screen,
   data that animates, memes. Light and dark grounds both.
3. Reels:
   - Build an HTML composition driven by window.render(t), and render it with
     `node scripts/frames.mjs`.
   - Music: `python scripts/score.py` with a tempo and mode you haven't used
     lately, or the user's audio from inbox/.
   - Voiceover on most reels: write the lines into vo.json, then
     `python scripts/voice.py --lines vo.json --duration <s> --voice <voice>`,
     rotating voices (English: am_michael, am_fenrir, af_heart, af_bella,
     bm_george, bf_emma; Hindi: hm_omega, hf_alpha). Fix every overlap warning.
     Keep the on-screen text and the voice saying the same thing in fewer words.
   - Mix: `python scripts/mix.py --music ... --voice ... --out mix.wav`, then
     encode with ffmpeg (H.264 + AAC, 1080x1920, 30fps).
   - Frame 0 is the poster: copy the strongest settled frame over it.
   - When you invent a reel style that worked, save its composition as a
     reusable template in templates/reels/<style>/ with a one-line README.
4. Look at the rendered stills (and mid-transition frames) yourself. Fix
   anything cut off, overlapping, low-contrast or off-brand.
5. Run the compliance skill and save compliance.md. Only a PASS gets queued.
6. Write post.json with publish_at on the half hour (utc_offset from desk.config.json), and
   expires_at for anything time-bound. Add a row to results/formats.md.

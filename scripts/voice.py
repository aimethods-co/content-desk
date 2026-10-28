"""AI voiceover for reels with Kokoro (open-source TTS, runs locally or in CI).

    python scripts/voice.py --text "Documents pending: zero." --out work/vo.wav
        [--voice am_michael] [--speed 1.0] [--lang a]
    python scripts/voice.py --lines vo.json --out work/vo.wav --duration 20
        vo.json: [{"at": 0.4, "text": "Documents pending..."}, ...]  places each line at its time

Voices to rotate between (don't use the same voice every reel):
  English, US  (--lang a): am_michael, am_fenrir, af_heart, af_bella, af_nicole
  English, UK  (--lang b): bm_george, bm_fable, bf_emma
  Hindi        (--lang h): hm_omega, hm_psi, hf_alpha, hf_beta
Mix it over the music with scripts/mix.py so the music ducks under the voice.
"""
import argparse
import json

import numpy as np
import soundfile as sf
from kokoro import KPipeline

SR = 24000


def speak(pipe, text, voice, speed):
    parts = [audio for _, _, audio in pipe(text, voice=voice, speed=speed)]
    return np.concatenate([p.numpy() if hasattr(p, "numpy") else np.asarray(p) for p in parts]) if parts else np.zeros(0)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--text")
    ap.add_argument("--lines", help="JSON list of {at, text}")
    ap.add_argument("--duration", type=float, help="total length when using --lines")
    ap.add_argument("--voice", default="am_michael")
    ap.add_argument("--lang", default="a")
    ap.add_argument("--speed", type=float, default=1.0)
    ap.add_argument("--out", required=True)
    a = ap.parse_args()

    pipe = KPipeline(lang_code=a.lang)
    if a.lines:
        lines = json.load(open(a.lines, encoding="utf-8"))
        total = int((a.duration or (max(l["at"] for l in lines) + 6)) * SR)
        out = np.zeros(total, dtype=np.float32)
        lines = sorted(lines, key=lambda l: l["at"])
        for k, line in enumerate(lines):
            clip = speak(pipe, line["text"], a.voice, a.speed)
            i = int(line["at"] * SR)
            end = line["at"] + len(clip) / SR
            nxt = lines[k + 1]["at"] if k + 1 < len(lines) else None
            print(f"  {line['at']:5.2f}s -> {end:5.2f}s  {line['text'][:50]}")
            if nxt is not None and end > nxt:
                print(f"warning: runs {end - nxt:.2f}s into the next line; move it or shorten the text")
            n = max(0, min(len(clip), total - i))
            out[i : i + n] += clip[:n]
            if n < len(clip):
                print(f"warning: line at {line['at']}s runs past the end and was cut")
    else:
        out = speak(pipe, a.text, a.voice, a.speed)
    peak = float(np.max(np.abs(out))) or 1.0
    sf.write(a.out, out / peak * 0.9, SR)
    print(f"{len(out) / SR:.1f}s -> {a.out} ({a.voice})")


if __name__ == "__main__":
    main()

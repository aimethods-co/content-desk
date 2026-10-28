"""Original music bed for a reel, written to the reel's own beat grid.

    python scripts/score.py --duration 22 --cuts 5,10.5,14,18 --ticks 6.5,7,7.5,8 --out work/score.wav
        [--bpm 96] [--mode major] [--drums-from 3]

Default 120 BPM, Am - F - C - G (or --mode major: D - Bm - G - A), one chord
per bar. Vary bpm and mode between reels. Soft pad, sub,
gentle kick from bar 3, offbeat hats, an arpeggio, in-key ticks for UI
moments, and a short swell into every cut. Everything sits on the grid
counted from frame 0, and the mix is kept quiet and round.
"""
import argparse
import wave

import numpy as np

SR = 48000
BEAT = 0.5
BAR = 2.0
# root (bass), chord tones (pad), arpeggio tones. Two progressions so reels
# don't all sound alike: "minor" Am F C G, "major" D Bm G A.
MAJOR = [
    (73.42, [293.66, 369.99, 440.00], [587.33, 739.99, 880.00, 739.99]),
    (61.74, [246.94, 293.66, 369.99], [493.88, 587.33, 739.99, 587.33]),
    (98.00, [196.00, 246.94, 293.66], [392.00, 493.88, 587.33, 493.88]),
    (110.00, [220.00, 277.18, 329.63], [440.00, 554.37, 659.26, 554.37]),
]
CHORDS = [
    (110.00, [220.00, 261.63, 329.63], [440.00, 523.25, 659.26, 523.25]),
    (87.31, [174.61, 220.00, 261.63], [349.23, 440.00, 523.25, 440.00]),
    (130.81, [196.00, 261.63, 329.63], [392.00, 523.25, 659.26, 523.25]),
    (98.00, [196.00, 246.94, 293.66], [392.00, 493.88, 587.33, 493.88]),
]


def env(n, attack, decay):
    t = np.arange(n) / SR
    return np.minimum(1, t / max(attack, 1e-4)) * np.exp(-t / decay)


def add(buf, start, sig):
    i = int(start * SR)
    if i >= len(buf):
        return
    sig = sig[: len(buf) - i]
    buf[i : i + len(sig)] += sig


def soft_saw(freq, n, harmonics=7):
    t = np.arange(n) / SR
    return sum(np.sin(2 * np.pi * freq * k * t) / k for k in range(1, harmonics + 1))


def build(duration, cuts, ticks, bpm=120, mode="minor", drums_from=4.0):
    global BEAT, BAR, CHORDS
    BEAT = 60.0 / bpm
    BAR = BEAT * 4
    if mode == "major":
        CHORDS = MAJOR
    n = int(duration * SR)
    pad, bass, drums, keys = (np.zeros(n) for _ in range(4))
    bars = int(np.ceil(duration / BAR))

    for b in range(bars):
        root, tones, arp = CHORDS[b % 4]
        start = b * BAR
        length = int((BAR + 0.6) * SR)
        shape = np.minimum(1, np.arange(length) / (0.35 * SR)) * np.minimum(1, (length - np.arange(length)) / (0.6 * SR))
        for f in tones:
            for detune in (0.9965, 1.0035):
                add(pad, start, 0.022 * soft_saw(f * detune, length) * shape)
        if start >= 2:  # sub from bar 2, on beats 1 and 3
            for beat in (0, 2):
                m = int(0.9 * SR)
                add(bass, start + beat * BEAT, 0.16 * np.sin(2 * np.pi * root * np.arange(m) / SR) * env(m, 0.005, 0.45))
        for i in range(8):  # eighth-note arpeggio
            f = arp[i % 4]
            m = int(0.45 * SR)
            t = np.arange(m) / SR
            tone = np.sin(2 * np.pi * f * t) + 0.25 * np.sin(4 * np.pi * f * t)
            add(keys, start + i * BEAT / 2, 0.035 * tone * env(m, 0.003, 0.16))

    end_drums = duration - 2.0
    beat_t = drums_from
    while beat_t < end_drums:  # gentle kick on every beat, hats on the offbeats
        m = int(0.3 * SR)
        t = np.arange(m) / SR
        sweep = np.sin(2 * np.pi * (45 * t + (110 - 45) * 0.04 * (1 - np.exp(-t / 0.04))))
        add(drums, beat_t, 0.30 * sweep * env(m, 0.002, 0.11))
        hm = int(0.05 * SR)
        hat = np.diff(np.random.default_rng(int(beat_t * 100)).standard_normal(hm + 1))
        add(drums, beat_t + BEAT / 2, 0.012 * hat * env(hm, 0.001, 0.015))
        beat_t += BEAT

    for c in cuts:  # swell into the cut, soft low thump on it
        m = int(0.5 * SR)
        noise = np.convolve(np.random.default_rng(int(c * 10)).standard_normal(m), np.ones(24) / 24, "same")
        add(drums, c - 0.5, 0.05 * noise * np.linspace(0, 1, m) ** 2)
        k = int(0.4 * SR)
        t = np.arange(k) / SR
        add(drums, c, 0.22 * np.sin(2 * np.pi * 60 * t) * env(k, 0.003, 0.18))

    for tk in ticks:  # in-key UI ticks (E6 + A6)
        m = int(0.25 * SR)
        t = np.arange(m) / SR
        tone = np.sin(2 * np.pi * 1318.51 * t) + 0.5 * np.sin(2 * np.pi * 1760.0 * t)
        add(keys, tk, 0.05 * tone * env(m, 0.002, 0.07))

    # room on pad + keys
    ir_n = int(1.2 * SR)
    ir = np.random.default_rng(7).standard_normal(ir_n) * np.exp(-np.arange(ir_n) / (0.35 * SR))
    ir /= np.sqrt(np.sum(ir**2))
    wet_src = pad + keys
    size = 1 << int(np.ceil(np.log2(n + ir_n)))
    wet = np.fft.irfft(np.fft.rfft(wet_src, size) * np.fft.rfft(ir, size), size)[:n]

    mix = pad + 0.9 * keys + bass + drums + 0.22 * wet
    fade = np.ones(n)
    fade[: int(0.02 * SR)] = np.linspace(0, 1, int(0.02 * SR))
    tail = int(1.6 * SR)
    fade[-tail:] = np.linspace(1, 0, tail) ** 1.5
    mix = np.tanh(mix * fade * 1.2)
    return mix / np.max(np.abs(mix)) * 0.89  # about -1 dBFS


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--duration", type=float, required=True)
    ap.add_argument("--cuts", default="")
    ap.add_argument("--ticks", default="")
    ap.add_argument("--out", required=True)
    ap.add_argument("--bpm", type=float, default=120)
    ap.add_argument("--mode", choices=["minor", "major"], default="minor")
    ap.add_argument("--drums-from", type=float, default=4.0)
    a = ap.parse_args()
    nums = lambda s: [float(x) for x in s.split(",") if x]
    audio = build(a.duration, nums(a.cuts), nums(a.ticks), a.bpm, a.mode, a.drums_from)
    pcm = (np.repeat(audio[:, None], 2, axis=1) * 32767).astype(np.int16)
    with wave.open(a.out, "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm.tobytes())
    print(f"{a.duration}s -> {a.out}")


if __name__ == "__main__":
    main()

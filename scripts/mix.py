"""Mix a voiceover over a music bed, ducking the music while the voice speaks.

    python scripts/mix.py --music work/score.wav --voice work/vo.wav --out work/mix.wav [--music-db -6]

Uses ffmpeg's sidechain compressor, so the music drops under the voice and
comes back up between lines. Output is 48 kHz stereo, peak about -1 dBFS.
"""
import argparse
import subprocess


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--music", required=True)
    ap.add_argument("--voice", required=True)
    ap.add_argument("--out", required=True)
    ap.add_argument("--music-db", type=float, default=-6.0, help="music level before ducking")
    a = ap.parse_args()
    graph = (
        f"[0:a]aresample=48000,volume={a.music_db}dB[m];"
        "[1:a]aresample=48000,pan=stereo|c0=c0|c1=c0,volume=1.6[v];"
        "[v]asplit=2[vk][vm];"
        "[m][vk]sidechaincompress=threshold=0.03:ratio=8:attack=15:release=350[duck];"
        "[duck][vm]amix=inputs=2:duration=first:normalize=0,alimiter=limit=0.8[out]"
    )
    subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-i", a.music, "-i", a.voice,
                    "-filter_complex", graph, "-map", "[out]", "-ac", "2", a.out], check=True)
    print(f"mixed -> {a.out}")


if __name__ == "__main__":
    main()

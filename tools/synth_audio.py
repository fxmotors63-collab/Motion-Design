"""Bande-son temporaire 100 % synthétisée (aucun son de rush).

Génère public/audio/music_temp.wav (120 BPM, 24,5 s), les SFX dans public/sfx/
et beats.json. Usage : python3 -I tools/synth_audio.py
"""
import json
import os
import wave

import numpy as np

SR = 48000
BPM = 120
BEAT = 60 / BPM
DUR = 24.5
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
rng = np.random.default_rng(7)


def write(path, x, peak=0.89):
    x = np.asarray(x, dtype=np.float64)
    if x.ndim == 1:
        x = np.stack([x, x], 1)
    m = np.max(np.abs(x)) or 1
    x = x / m * peak
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with wave.open(path, 'wb') as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((x * 32767).astype('<i2').tobytes())


def t_(d):
    return np.arange(int(d * SR)) / SR


def lowpass_fft(x, fc, order=2):
    X = np.fft.rfft(x)
    f = np.fft.rfftfreq(len(x), 1 / SR)
    return np.fft.irfft(X / (1 + (f / fc) ** (2 * order)), len(x))


def bandpass_fft(x, lo, hi):
    X = np.fft.rfft(x)
    f = np.fft.rfftfreq(len(x), 1 / SR)
    return np.fft.irfft(X * ((f > lo) & (f < hi)), len(x))


def sweep_lp(x, fc):
    """One-pole lowpass with per-sample cutoff."""
    a = 1 - np.exp(-2 * np.pi * np.asarray(fc) / SR)
    y = np.zeros_like(x)
    s = 0.0
    for i in range(len(x)):
        s += a[i] * (x[i] - s)
        y[i] = s
    return y


def saw(freq, t, detune=0.0):
    ph = (freq * (1 + detune)) * t
    return 2 * (ph - np.floor(ph + 0.5))


# ---------- instruments ----------
def kick():
    t = t_(0.45)
    f = 45 + 110 * np.exp(-t / 0.035)
    ph = 2 * np.pi * np.cumsum(f) / SR
    body = np.sin(ph) * np.exp(-t / 0.16)
    click = rng.standard_normal(len(t)) * np.exp(-t / 0.003) * 0.4
    return np.tanh((body + click) * 1.8)


def hat(open_=False):
    t = t_(0.18 if open_ else 0.06)
    n = bandpass_fft(rng.standard_normal(len(t)), 7000, 16000)
    return n * np.exp(-t / (0.05 if open_ else 0.015)) * 3


def clap():
    t = t_(0.25)
    n = bandpass_fft(rng.standard_normal(len(t)), 900, 5000)
    env = np.exp(-t / 0.06)
    for d in (0.0, 0.012, 0.024):
        env += np.where(t > d, np.exp(-(t - d) / 0.008), 0) * 0.6
    return n * env * 1.5


def bass_note(freq, d):
    t = t_(d)
    x = np.tanh(2.5 * (saw(freq, t) + 0.5 * saw(freq, t, 0.005)))
    x = lowpass_fft(x, 380)
    return x * np.minimum(1, t / 0.005) * np.exp(-t / 0.18)


def add(buf, x, at, g=1.0):
    i = int(at * SR)
    if i >= len(buf):
        return
    n = min(len(x), len(buf) - i)
    buf[i:i + n] += x[:n] * g


# ---------- music ----------
def music():
    n = int(DUR * SR)
    drums = np.zeros(n)
    bass = np.zeros(n)
    k, h, ho, c = kick(), hat(), hat(True), clap()
    roots = [55.0, 43.65, 65.41, 49.0]  # Am F C G
    beats = int(DUR / BEAT)
    break_from, drop_at, end_at = 9.5, 11.0, 19.5
    for b in range(beats):
        tb = b * BEAT
        in_break = break_from <= tb < drop_at
        if tb >= end_at:
            continue
        if not in_break:
            add(drums, k, tb, 1.0)
        if tb >= 2.0 and not in_break:
            add(drums, h, tb + BEAT / 2, 0.35)
            if b % 4 == 3:
                add(drums, ho, tb + BEAT / 2, 0.3)
        if tb >= 5.0 and not in_break:
            if b % 2 == 1:
                add(drums, c, tb, 0.55)
            add(drums, h, tb + BEAT / 4, 0.18)
            add(drums, h, tb + 3 * BEAT / 4, 0.18)
            root = roots[(b // 4) % 4]
            add(bass, bass_note(root, BEAT / 2), tb + BEAT / 2, 0.9)
            add(bass, bass_note(root * 2, BEAT / 4), tb + 3 * BEAT / 4, 0.35)
    # pad
    t = t_(DUR)
    chord = sum(saw(f, t, d) for f in (110.0, 130.81, 164.81) for d in (-0.004, 0.004))
    pad = lowpass_fft(chord, 900) * 0.12
    pad *= np.clip(t / 1.5, 0, 1) * np.clip((DUR - t) / 4.0, 0, 1)
    # final hits
    tail = np.zeros(n)
    add(tail, kick(), end_at, 1.2)
    mix = drums * 0.8 + bass * 0.5 + pad
    mix += tail
    mix *= np.clip((DUR - t) / 1.2, 0, 1)
    return np.tanh(mix * 1.2)


# ---------- sfx ----------
def whoosh(d=0.45, rev=False):
    t = t_(d)
    env = np.sin(np.pi * np.clip(t / d, 0, 1)) ** 2
    fc = 300 + 5000 * env
    x = sweep_lp(rng.standard_normal(len(t)), fc) * env
    return x[::-1] if rev else x


def clunk():
    t = t_(0.35)
    x = sum(a * np.sin(2 * np.pi * f * t) * np.exp(-t / dd)
            for f, a, dd in ((150, 1, 0.09), (420, 0.5, 0.05), (1230, 0.25, 0.03), (2210, 0.15, 0.02)))
    x += rng.standard_normal(len(t)) * np.exp(-t / 0.004) * 0.5
    return np.tanh(x * 1.5)


def riser(d=2.0):
    t = t_(d)
    f = 180 * (1600 / 180) ** (t / d)
    tone = np.sin(2 * np.pi * np.cumsum(f) / SR)
    noise = sweep_lp(rng.standard_normal(len(t)), 200 + 7000 * (t / d) ** 2)
    return (tone * 0.4 + noise * 0.8) * (t / d) ** 2


def splash():
    t = t_(0.6)
    x = bandpass_fft(rng.standard_normal(len(t)), 500, 4000) * np.exp(-t / 0.12)
    for _ in range(7):
        st = rng.uniform(0.02, 0.3)
        f0 = rng.uniform(500, 900)
        tt = np.clip(t - st, 0, None)
        blip = np.sin(2 * np.pi * (f0 * tt + 1800 * tt ** 2)) * np.where(t > st, np.exp(-tt / 0.025), 0)
        x += blip * 0.5
    return x


def glitch():
    t = t_(0.3)
    x = np.zeros(len(t))
    seg = int(0.02 * SR)
    for i in range(0, len(t), seg):
        f = rng.choice([110, 220, 880, 1760, 3520])
        x[i:i + seg] = np.sign(np.sin(2 * np.pi * f * t[i:i + seg])) * rng.uniform(0.3, 1)
    return np.round(x * 6) / 6 * np.exp(-t / 0.2)


if __name__ == '__main__':
    write(f'{ROOT}/public/audio/music_temp.wav', music(), 0.7)
    write(f'{ROOT}/public/sfx/whoosh.wav', whoosh(), 0.8)
    write(f'{ROOT}/public/sfx/whoosh_rev.wav', whoosh(0.35, True), 0.8)
    write(f'{ROOT}/public/sfx/clunk.wav', clunk(), 0.8)
    write(f'{ROOT}/public/sfx/riser.wav', riser(), 0.75)
    write(f'{ROOT}/public/sfx/splash.wav', splash(), 0.8)
    write(f'{ROOT}/public/sfx/glitch.wav', glitch(), 0.6)
    beats = [round(b * BEAT, 3) for b in range(int(DUR / BEAT) + 1)]
    with open(f'{ROOT}/beats.json', 'w') as fh:
        json.dump({'bpm': BPM, 'framesPerBeat': 15, 'beats_s': beats,
                   'break': [9.5, 11.0], 'drop_s': 11.0, 'end_hit_s': 19.5,
                   'source': 'music_temp.wav (synthèse, temporaire)'}, fh, indent=1)
    print('ok')

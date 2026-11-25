"""Analyse d'une musique : tempo, grosses frappes, décalage conseillé. Écrit beats.json.

Usage : python3 -I tools/analyze_music.py assets/audio/<musique>.mp3
Ensuite : MUSIC_OFFSET (brand.ts) = 1re grosse frappe × 30, et caler DUR sur la grille (1 temps = 1800 / BPM frames).
"""
import json
import os
import subprocess
import sys

import numpy as np

src = sys.argv[1]
SR = 22050
raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', src, '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True, check=True).stdout
x = np.frombuffer(raw, dtype=np.float32)
hop, n = 512, 2048
win = np.hanning(n)
S = np.abs(np.array([np.fft.rfft(x[i * hop:i * hop + n] * win) for i in range((len(x) - n) // hop)]))
flux = np.r_[0, np.maximum(0, np.diff(np.log1p(S * 10), axis=0)).sum(1)]
fps = SR / hop
o = flux - flux.mean()
ac = np.correlate(o, o, 'full')[len(o) - 1:]
lo, hi = int(fps * 60 / 180), int(fps * 60 / 60)
bpm = 60 * fps / (lo + np.argmax(ac[lo:hi]))
w = int(0.05 * SR)
e = np.array([np.sqrt(np.mean(x[i:i + w] ** 2)) for i in range(0, len(x) - w, w)])
d = np.r_[0, np.diff(e)]
thr = max(0.12, np.percentile(d, 99.5))
hits = [round(i * 0.05, 2) for i in range(1, len(d) - 1) if d[i] > thr and d[i] >= d[i - 1] and d[i] >= d[i + 1]]
big = [h for h in hits if e[int(h / 0.05)] > 0.8 * e.max()] or hits[:1]
print(f'BPM ≈ {bpm:.1f}  (1 temps = {1800 / bpm:.1f} frames à 30 fps)')
print('grosses frappes (s) :', big[:12])
print('frappes (s) :', hits[:40])
print(f'MUSIC_OFFSET conseillé = {round(big[0] * 30)} frames (1re grosse frappe sur la frame 0)')
out = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'beats.json')
json.dump({'source': src, 'bpm': round(float(bpm), 2), 'big_hits_s': big, 'hits_s': hits, 'offset_frames': round(big[0] * 30)}, open(out, 'w'), indent=1)

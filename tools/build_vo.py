"""Assemble la voix off (prises ElevenLabs) phrase par phrase sur la timeline, d'après assets/audio/vo/plan.json.

Écrit public/audio/vo_track[_b].wav et src/vo_segments[_b].json (utilisé pour baisser la musique sous la voix).
Usage : python3 -I tools/build_vo.py [b]
"""
import json
import os
import subprocess
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
VO = f'{ROOT}/assets/audio/vo'
plan = json.load(open(f'{VO}/plan.json', encoding='utf-8'))
VARIANT_B = len(sys.argv) > 1 and sys.argv[1].lower() == 'b'
SUFFIX = '_b' if VARIANT_B else ''
segments = list(plan['A'])
if VARIANT_B:
    for idx, seg in plan.get('B', {}).items():
        if os.path.exists(f"{VO}/{seg['file']}"):  # sinon on garde la phrase de la version A
            segments[int(idx)] = seg

files = sorted({s['file'] for s in segments})
args = ['ffmpeg', '-v', 'error', '-y']
for f in files:
    args += ['-i', f'{VO}/{f}']
parts, labels = [], []
for i, s in enumerate(segments):
    a, b, tp = s['start'], s['end'], s.get('tempo', 1.0)
    chain = f"[{files.index(s['file'])}:a]aresample=48000,atrim={a}:{b},asetpts=PTS-STARTPTS,afade=t=in:d=0.02,afade=t=out:st={b - a - 0.04:.3f}:d=0.04"
    if tp != 1.0:
        chain += f',atempo={tp}'
    ms = int(s['at'] * 1000)
    parts.append(f'{chain},adelay={ms}|{ms}[s{i}]')
    labels.append(f'[s{i}]')
fc = ';'.join(parts) + ';' + ''.join(labels) + (
    f'amix=inputs={len(segments)}:normalize=0,highpass=f=80,'
    'acompressor=threshold=-20dB:ratio=3:attack=5:release=80,volume=7dB,alimiter=limit=0.89:level=false,'
    'apad=whole_dur=30,atrim=0:30[out]'
)
subprocess.run(args + ['-filter_complex', fc, '-map', '[out]', '-ar', '48000', '-ac', '2', f'{ROOT}/public/audio/vo_track{SUFFIX}.wav'], check=True)
with open(f'{ROOT}/src/vo_segments{SUFFIX}.json', 'w') as fh:
    json.dump([[s['at'], round((s['end'] - s['start']) / s.get('tempo', 1.0), 3)] for s in segments], fh)
print('ok', len(segments), 'phrases')

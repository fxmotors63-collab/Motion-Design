#!/usr/bin/env bash
# Prétraitement des rushes, SANS AUDIO (-an). HD 1080x1920 (rendu final) ou --draft 540x960 (brouillons).
# Rush accéléré : ajouter son nom dans FAST (ex. FAST="IMG_5051:2.8").
set -e
cd "$(dirname "$0")/.."
FAST=${FAST:-"IMG_5051:2.8"}
if [[ $1 == --draft ]]; then W=540; H=960; Q=23; P=ultrafast; OUT=public/work; else W=1080; H=1920; Q=15; P=medium; OUT=work/hd; fi
mkdir -p "$OUT"
for f in rushes/*.MOV; do
  n=$(basename "$f" .MOV)
  ffmpeg -v error -y -i "$f" -an -vf "scale=$W:$H:force_original_aspect_ratio=increase:flags=lanczos,crop=$W:$H,fps=30" \
    -c:v libx264 -preset $P -crf $Q -pix_fmt yuv420p "$OUT/$n.mp4" &
done
wait
for spec in $FAST; do n=${spec%%:*}; k=${spec##*:}
  ffmpeg -v error -y -i "$OUT/$n.mp4" -an -vf "setpts=PTS/$k" -r 30 -c:v libx264 -preset $P -crf $Q -pix_fmt yuv420p "$OUT/${n}_fast.mp4"
done
ffmpeg -v error -y -f lavfi -i "color=c=0x808080:s=1080x1920:r=30,noise=alls=60:allf=t+u,format=gray" -frames:v 8 public/fx/grain_%d.png
echo done

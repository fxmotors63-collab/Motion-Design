#!/usr/bin/env bash
# Rendu final 1080x1920 30 fps, H.264 CRF 18, AAC 320 kbps, son normalisé -14 LUFS / -1 dBTP.
# Usage : ./tools/render_final.sh [A|B|all]   (défaut : all)
set -e
cd "$(dirname "$0")/.."
WHICH=${1:-all}
cp work/hd/*.mp4 public/work/   # rushes HD sans audio (voir tools/prep_rushes.sh)

render() { # $1 = composition, $2 = fichier de sortie
  local raw="output/_raw_$1.mp4"
  npx remotion render src/index.ts "$1" "$raw" --crf=18 --x264-preset=medium --audio-codec=aac --audio-bitrate=320k \
    --concurrency=3 --timeout=180000 --log=error
  # loudnorm en 2 passes : mesure puis correction linéaire
  local m; m=$(ffmpeg -hide_banner -i "$raw" -af loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json -f null - 2>&1 | sed -n '/{/,/}/p')
  local ii tp lra th off
  ii=$(echo "$m" | grep input_i | grep -o '[-0-9.]*'); tp=$(echo "$m" | grep input_tp | grep -o '[-0-9.]*')
  lra=$(echo "$m" | grep input_lra | grep -o '[-0-9.]*'); th=$(echo "$m" | grep input_thresh | grep -o '[-0-9.]*')
  off=$(echo "$m" | grep target_offset | grep -o '[-0-9.]*')
  ffmpeg -v error -y -i "$raw" -c:v copy \
    -af "loudnorm=I=-14:TP=-1.5:LRA=11:measured_I=$ii:measured_TP=$tp:measured_LRA=$lra:measured_thresh=$th:offset=$off:linear=true,aresample=48000" \
    -c:a aac -b:a 320k "$2"
  rm -f "$raw"
}
[[ $WHICH == A || $WHICH == all ]] && render Main output/fxmotors_motorex_crosspower_story.mp4
[[ $WHICH == B || $WHICH == all ]] && render MainB output/fxmotors_motorex_crosspower_story_hookB.mp4
echo done

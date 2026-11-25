#!/usr/bin/env bash
# Planche contact d'une vidéo : 1 image toutes les N s (défaut 1), timecode incrusté, repères safe zones.
# Usage : ./tools/contact_sheet.sh <video> [intervalle_s] [colonnes]
set -e
v=$1; step=${2:-1}; cols=${3:-9}
out="contact/$(basename "${v%.*}")_sheet.png"; mkdir -p contact
n=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$v" | awk -v s="$step" '{print int($1/s)+1}')
rows=$(( (n + cols - 1) / cols ))
ffmpeg -v error -y -i "$v" -vf "fps=1/$step,scale=180:320,drawbox=y=25:w=iw:h=1:color=cyan,drawbox=y=283:w=iw:h=1:color=cyan,drawtext=fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf:text='%{pts\:hms}':x=4:y=4:fontsize=14:fontcolor=yellow:box=1:boxcolor=black,tile=${cols}x${rows}" -frames:v 1 "$out"
echo "$out"

#!/bin/zsh
# Zwischenablage (Zeilen "KS-x <url>") -> frames/KS-x.png, Vorschau -> vorschau/KS-x.jpg. URLs nie ausgeben.
cd "${0:A:h}/.."
mkdir -p frames vorschau
{ pbpaste; echo; } | while read -r id url; do [ -z "$id" ] && continue
  [[ ( "$id" == KS-* || "$id" == H-* ) && "$url" == https://*ibyteimg.com/*aigc_resize:0:0* ]] || { echo "skip $id"; continue; }
  [ -s frames/$id.png ] && { echo "da $id"; continue; }
  curl -s -o frames/$id.png "$url" && sips -g pixelWidth -g pixelHeight frames/$id.png | tail -2 | tr '\n' ' ' && echo " $id"
  sips -Z 1600 -s format jpeg frames/$id.png --out vorschau/$id.jpg >/dev/null
done
md5 -q frames/KS-*.png | sort | uniq -d | sed 's/^/DOPPEL /'

#!/bin/zsh
# Startbilder -> WebP (1920 + 960), Drafts -> Scrub-MP4 (dichte Keyframes). Nur Neues rechnen.
cd "${0:A:h}/.."
for f in frames/KWF-*.png; do b=$(basename $f .png | cut -d_ -f1 | tr A-Z a-z)
  [ site/assets/img/$b.webp -nt $f ] || { python3 tools/webp.py $f site/assets/img/$b; echo img $b; }
done
for f in videos/KWV-*_draft.mp4; do b=$(basename $f | cut -d_ -f1 | tr A-Z a-z)
  [ site/assets/vid/$b.mp4 -nt $f ] || { ffmpeg -v error -y -i $f -an -c:v libx264 -pix_fmt yuv420p -preset slow -crf 23 -g 4 -keyint_min 4 -sc_threshold 0 -r 30 -movflags +faststart site/assets/vid/$b.mp4; echo vid $b; }
done
ls site/assets/img site/assets/vid | tr '\n' ' '
python3 tools/manifest.py

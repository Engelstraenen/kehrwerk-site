#!/bin/zsh
# Schachtkamera-Seite: Motive KS-*.png -> WebP 2560 + 1600 (-m); Filme -> Scrub-MP4 (dichte Keyframes). Nur Neues rechnen.
cd "${0:A:h}/.."
mkdir -p site/assets/img site/assets/vid
for f in frames/KS-*.png(N); do b=$(basename $f .png | cut -d_ -f1 | tr A-Z a-z)
  [ site/assets/img/$b.webp -nt $f ] || { python3 tools/webp.py $f site/assets/img/$b; echo img $b; }
done
enc(){ ffmpeg -v error -y -i $1 ${=3} -an -c:v libx264 -pix_fmt yuv420p -preset slow -crf 22 -g 4 -keyint_min 4 -sc_threshold 0 -r 30 -movflags +faststart $2; }
[ site/assets/vid/ks-einfahrt.mp4 -nt videos/KWV-2_schacht_draft.mp4 ] || { enc videos/KWV-2_schacht_draft.mp4 site/assets/vid/ks-einfahrt.mp4 "-vf reverse"; echo vid einfahrt; }
[ site/assets/vid/ks-ofen.mp4 -nt videos/KWV-1_ofen_draft.mp4 ] || { enc videos/KWV-1_ofen_draft.mp4 site/assets/vid/ks-ofen.mp4 ""; echo vid ofen; }
for f in videos/KS-V*_draft.mp4(N); do b=$(basename $f | cut -d_ -f2 | tr A-Z a-z)
  [ site/assets/vid/ks-$b.mp4 -nt $f ] || { enc $f site/assets/vid/ks-$b.mp4 ""; echo vid $b; }
done
python3 tools/manifest.py

# Bild -> WebP 2560 + 1600 (-m), lokal nachgeschärft (Masterfile V2.65). Original bleibt unverändert.
import sys
from PIL import Image, ImageFilter
src, dst = sys.argv[1], sys.argv[2]
im = Image.open(src).convert("RGB"); w0 = im.width
for w, suf, q in ((min(2560, w0), "", 86), (1600, "-m", 82)):
    out = im if w == w0 else im.resize((w, round(im.height * w / w0)), Image.LANCZOS)
    out = out.filter(ImageFilter.UnsharpMask(radius=1.6, percent=70, threshold=2))
    out.save(f"{dst}{suf}.webp", "WEBP", quality=q, method=6)

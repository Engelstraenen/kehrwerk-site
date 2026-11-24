import sys
from PIL import Image
src,dst=sys.argv[1],sys.argv[2]
im=Image.open(src).convert("RGB")
for w,suf,q in((1920,"",82),(960,"-m",78)):
    im.resize((w,round(im.height*w/im.width)),Image.LANCZOS).save(f"{dst}{suf}.webp","WEBP",quality=q,method=6)

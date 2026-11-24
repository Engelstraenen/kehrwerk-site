import sys
from PIL import Image
src,dst=sys.argv[1],sys.argv[2]
im=Image.open(src).convert("RGB")
w0=im.width
for w,suf,q in((min(2560,w0),"",84),(1600,"-m",80)):
    (im if w==w0 else im.resize((w,round(im.height*w/w0)),Image.LANCZOS)).save(f"{dst}{suf}.webp","WEBP",quality=q,method=6)

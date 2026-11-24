import sys,glob
from PIL import Image,ImageDraw
pat,out,cols,w=sys.argv[1],sys.argv[2],int(sys.argv[3]),int(sys.argv[4])
fs=sorted(glob.glob(pat)); ims=[Image.open(f) for f in fs]
h=round(ims[0].height*w/ims[0].width); rows=(len(ims)+cols-1)//cols
S=Image.new("RGB",(cols*w+(cols-1)*6,rows*h+(rows-1)*6),(60,60,60))
for i,im in enumerate(ims):
    t=im.resize((w,h)); d=ImageDraw.Draw(t); d.rectangle((0,0,26,16),fill=(255,59,48)); d.text((3,2),str(i),fill=(255,255,255))
    S.paste(t,((i%cols)*(w+6),(i//cols)*(h+6)))
S.save(out,quality=70); print(S.size)

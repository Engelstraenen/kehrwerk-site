# Abnahme-Bilder: je Kapitel Storyboard-Panel (groß) + Seite Desktop + Seite Handy
import asyncio
from playwright.async_api import async_playwright
from PIL import Image
SB='konzepte/SB-3.png'; OUT='abnahme/'
CH=[("s0",0.4),("s1",0.45),("s2",0.45),("s3",0.45),("s4",0.45),("s5",0.5),("s6",0.4),("s7",0.5),("s8",0.05)]
sb=Image.open(SB).convert('RGB'); W,H=sb.size; pw,ph=W/3,H/3
for i in range(9):
    r,c=divmod(i,3); sb.crop((int(c*pw),int(r*ph),int((c+1)*pw),int((r+1)*ph))).save(f'{OUT}{i+1}-storyboard.jpg',quality=88)
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch()
        for tag,w,h,mob in (("desktop",1600,900,False),("handy",390,844,True)):
            pg=await b.new_page(viewport={"width":w,"height":h},device_scale_factor=2 if mob else 1,is_mobile=mob,has_touch=mob)
            await pg.goto("http://localhost:4472/"); await pg.wait_for_timeout(2500)
            for i,(sid,t) in enumerate(CH):
                await pg.evaluate(f"(()=>{{const s=document.getElementById('{sid}');scrollTo(0,s.offsetTop+s.offsetHeight*{t}-innerHeight*0.35)}})()"); await pg.wait_for_timeout(1800)
                await pg.screenshot(path=f'{OUT}{i+1}-{tag}.jpg',type='jpeg',quality=82)
        await b.close()
asyncio.run(main())

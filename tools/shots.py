# Headless-Prüfung: Screens je Viewport an Scroll-Ständen, Querscroll, Konsolenfehler, Kopfzeile
import sys, asyncio, json
from playwright.async_api import async_playwright
URL = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:4472/"
OUT = sys.argv[2] if len(sys.argv) > 2 else "/tmp/kwshots"
VPS = [("d1440",1440,900),("m390",390,844),("m360",360,740),("m430",430,932),("q844",844,390)]
STOPS = [0,.02,.06,.1,.14,.18,.22,.27,.32,.37,.42,.47,.52,.58,.64,.7,.76,.82,.88,.94,.99]
async def main():
    import os; os.makedirs(OUT, exist_ok=True)
    rep = {}
    async with async_playwright() as p:
        b = await p.chromium.launch()
        for name,w,h in VPS:
            ctx = await b.new_context(viewport={"width":w,"height":h}, device_scale_factor=1, is_mobile=w<700, has_touch=w<700)
            pg = await ctx.new_page(); errs=[]
            pg.on("console", lambda m: errs.append(m.text) if m.type=="error" else None)
            pg.on("pageerror", lambda e: errs.append(str(e)))
            await pg.goto(URL, wait_until="domcontentloaded"); await pg.wait_for_timeout(1800)
            H = await pg.evaluate("document.documentElement.scrollHeight")
            ox = []
            for i,s in enumerate(STOPS if name in ("d1440","m390") else STOPS[::3]):
                await pg.evaluate(f"scrollTo(0,{int(s*(H-h))})"); await pg.wait_for_timeout(700)
                sw = await pg.evaluate("document.documentElement.scrollWidth")
                if sw > w: ox.append((s,sw))
                await pg.screenshot(path=f"{OUT}/{name}_{i:02d}.jpg", type="jpeg", quality=60)
            rep[name] = {"errors":errs[:5],"overflowX":ox[:3],"height":H}
            await ctx.close()
        # Kopfzeile 1081-1600
        hdr = {}
        for w in (1081,1180,1181,1280,1440,1600):
            ctx = await b.new_context(viewport={"width":w,"height":800}); pg = await ctx.new_page()
            await pg.goto(URL, wait_until="domcontentloaded"); await pg.wait_for_timeout(500)
            r = await pg.evaluate("(()=>{const bv=getComputedStyle(document.querySelector('.burger')).display!=='none';const els=[...document.querySelectorAll('.logo,.burger')].concat(bv?[]:[...document.querySelectorAll('.nav > *')]);return Math.max(...els.filter(e=>e.offsetParent).map(e=>e.getBoundingClientRect().right))})()")
            hdr[w] = round(r)
            await ctx.close()
        rep["header_right"] = hdr
        await b.close()
    print(json.dumps(rep, indent=1))
asyncio.run(main())

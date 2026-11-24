// KEHRWERK Schachtkamera – Dreamina-Bild-Warteschlange (GPT Image 2.5 Sunburst, 2K, 16:9, Unlimited)
// Einspielen: <input type=file id=ksjs> + file_upload, dann (0,eval)(await ksjs.files[0].text()); KSQ.run()
(() => {
  const STYLE = ' Photorealistic cinematic photograph, 16:9, dramatic low-key light, deep soot-black tones with a single signal red (#ff3b30) accent light, 35mm lens, fine film grain, premium campaign look like Apple or Nike. ABSOLUTELY NO text, no letters, no numbers, no logos, no UI overlays, no watermark. Modern realistic work situation, NO top hat, NO brass buttons, NO traditional chimney sweep uniform, NO lucky charms, NO clover, NO pig, NO horseshoe, no clichés, no orange, no gold, no blue tint.';
  const JOBS = [
    ['KS-1', 'Looking straight down from directly above into the open square flue of a brick chimney on a modern dark slate roof at dusk. A professional chimney inspection camera with a ring of bright white LEDs hangs on a black cable in the exact center, just entering the dark opening; the flue below falls away into deep black. Soot-darkened bricks around the opening, wet slate tiles around the chimney, a faint red rim light from the left. Perfectly centered symmetrical composition, the dark opening fills the middle third of the frame.'],
    ['KS-2', 'Inside a narrow soot-covered brick chimney flue, camera looking straight along the shaft: a round steel-bristle chimney sweeping brush on a flexible black rod fills the center and comes towards the lens, black soot particles and flakes fly through the white beam of the inspection camera LED, the brick courses converge to a dark vanishing point in the center, extreme depth, motion and energy.'],
    ['KS-3', 'Inside a freshly cleaned brick chimney flue lit by a white inspection LED, the camera glides close along the wall: dark red-brown bricks with clean mortar joints, one small hairline crack in a mortar joint in the right third of the frame catching a faint red light, the shaft continues into darkness in the left third. Macro detail, slight wet sheen, very shallow depth of field.'],
    ['KS-1B', 'Looking straight down from directly above into the open square flue of a brick chimney on a modern dark slate roof at dusk. A professional chimney inspection camera on a black cable is being lowered into the opening; we see the camera head from above, from its back side, as a dark silhouette. Its LED ring points DOWNWARD into the shaft: the bright white LED light shines down into the flue and lights up the soot-covered brick walls below, a glowing pool of light deep down in the shaft, the light falls away from the viewer. NO light shines upward, no LEDs visible from above, no lens flare towards the camera. Soot-darkened bricks around the opening, wet slate tiles around the chimney, a faint red rim light from the left. Chimney opening centered in the frame.'],
    ['KS-4', 'A clean modern basement boiler room with a white wall-mounted gas condensing boiler and a stainless steel flue pipe. A chimney sweep technician, man in his thirties, modern black softshell work jacket and black work trousers with knee pads, red fall-protection harness straps over his shoulders, inserts the thin metal probe of a handheld digital flue gas analyzer into a small test hole in the flue pipe and looks at the device with concentration. He stands in the left third of the frame, the right two thirds are dark calm wall space. Low-key light from a cold ceiling lamp, the analyzer screen glows red.'],
    ['KS-5', 'Close-up of a small white round carbon monoxide detector mounted on a white living room ceiling at night, its small red LED glowing, red light reflecting on the ceiling; below and behind it in soft focus a dark modern living room with a wood-burning stove glowing faintly. Detector in the right third, lots of dark negative space on the left. Calm, quiet, slightly ominous.'],
    ['KS-6', 'A detached modern German single-family house with a dark tiled gable roof and a brick chimney at night, seen straight-on from the street at eye level, facade parallel to the image plane, house perfectly centered and filling the middle of the frame, dark desaturated night sky, two warm lit windows, wet dark street in the foreground, quiet and calm.'],
    ['KS-7', 'A young female chimney sweep apprentice, about twenty, in a modern black softshell work jacket and black work trousers, red fall-protection harness attached to a safety rope, standing on a roof ladder hooked over the ridge of a dark slate roof at dawn, looking confidently into the camera, low angle from slightly below, town rooftops and a pale grey-red dawn sky behind her, tied-back hair moving in the wind. She stands in the left half of the frame, the right half is open sky.'],
    ['KS-8', 'Top-down close photograph of a rugged black tablet lying on a dark soot-stained workbench, the screen shows a clean abstract digital checklist made of grey lines with four red check marks and no readable text, next to it a handheld flue gas analyzer, a coiled black inspection camera cable and a pair of black work gloves. Dramatic low-key light from one side.'],
    ['KS-T', 'Seamless tileable texture: flat orthographic straight-on view of an old soot-blackened brick chimney flue wall, dark red-brown bricks covered with black soot, dark mortar joints, horizontal brick courses, even flat diffuse lighting, no shadows, no vignette, no perspective, no depth, the brick pattern fills the entire frame edge to edge.']
  ];
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const editor = () => [...document.querySelectorAll('.ProseMirror')].find(e => e.offsetParent);
  const sw = () => [...document.querySelectorAll('[role=switch]')].find(e => e.offsetParent);
  const row = () => { let r = sw(); for (let i = 0; i < 9 && r && !/Sunburst/.test(r.innerText); i++) r = r.parentElement; return r; };
  const fixedAnc = el => { for (let e = el; e && e !== document.body; e = e.parentElement) if (getComputedStyle(e).position === 'fixed') return true; return false; };
  const hashOf = src => (src.split('~tplv')[0].split('/').pop() || '');
  const feedImgs = () => [...document.querySelectorAll('img')].filter(i => i.getBoundingClientRect().left > 80 && i.naturalWidth > 1000 && !fixedAnc(i));
  const bigImgs = () => new Set(feedImgs().map(i => hashOf(i.src))).size;
  const old = window.KSQ || {};
  const K = window.KSQ = { log: [], done: old.done || {}, urls: old.urls || {}, stop: false, rejects: 0, runId: Date.now() };
  if (old.runId) old.runId = -1;
  window.KWURLS = window.KWURLS || [];
  if (!window.__kwf) { window.__kwf = window.fetch; window.fetch = function (u, ...a) { try { const s = typeof u === 'string' ? u : u.url; if (/aigc_resize:0:0/.test(s)) window.KWURLS.push(s); } catch (e) {} return window.__kwf.call(this, u, ...a); }; }
  /* Original-URL eines fertigen Bildes holen (Detailansicht -> Download, URL abfangen) */
  K.grab = async id => {
    const card = [...document.querySelectorAll('div')].filter(d => d.getBoundingClientRect().left > 80 && d.innerText && d.innerText.startsWith(id + ' ') && d.querySelector('img')).sort((a, b) => a.innerText.length - b.innerText.length)[0];
    const im = card && [...card.querySelectorAll('img')].find(i => i.naturalWidth > 1000);
    if (!im) return 'nocard';
    const h = hashOf(im.src); im.click(); await sleep(2500);
    const dl = [...document.querySelectorAll('button,div[role=button],span')].filter(b => b.offsetParent && /^Download$/i.test((b.innerText || '').trim())).pop();
    if (!dl) { document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })); return 'nodl'; }
    (dl.closest('button') || dl).click(); await sleep(3500);
    const u = window.KWURLS.filter(x => x.includes(h)).pop();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })); await sleep(800);
    if (u) { K.urls[id] = u; return 'ok'; } return 'nourl';
  };
  K.armCopy = () => { document.addEventListener('click', () => navigator.clipboard.writeText(Object.entries(K.urls).map(([k, v]) => k + ' ' + v).join('\n')), { once: true, capture: true }); return Object.keys(K.urls); };
  K.say = m => { K.log.push(new Date().toLocaleTimeString() + ' ' + m); if (K.log.length > 60) K.log.shift(); };
  let rejN = 0;
  new MutationObserver(ms => { for (const m of ms) for (const n of m.addedNodes) if (n.textContent && /run up to 1 generation/i.test(n.textContent)) rejN++; })
    .observe(document.body, { childList: true, subtree: true });
  K.safeGen = async () => {
    const ed = editor(); ed && ed.focus(); await sleep(400);
    const s = sw(); if (!s) return 'noswitch';
    if (s.getAttribute('aria-checked') !== 'true') { s.click(); await sleep(1500); }
    if (sw().getAttribute('aria-checked') !== 'true') return 'switchoff';
    const r = row(); const m = r && r.innerText.replace(/\n/g, ' ').match(/Unlimited\s*(\d+)?/);
    if (!r || !/Sunburst/.test(r.innerText) || !/2K/.test(r.innerText) || !/16:9/.test(r.innerText)) return 'settings';
    if (m && m[1] && m[1] !== '0') return 'price' + m[1];
    const btn = [...r.querySelectorAll('button')].filter(b => b.offsetParent).pop();
    if (!btn || btn.disabled) return 'btn';
    btn.click(); return 'clicked';
  };
  K.run = async (from = 0, sentId = null) => {
    const my = K.runId = Date.now();
    for (let j = from; j < JOBS.length; j++) {
      const [id, p] = JOBS[j]; if (K.done[id]) continue;
      if (id === sentId) { const before = bigImgs() ; let t = 0; while (bigImgs() <= before && t < 40) { await sleep(15000); t++; if (K.runId !== my) return; } K.done[id] = bigImgs() > before ? 'ok' : 'timeout'; K.say(id + ' ' + K.done[id]); if (K.done[id] === 'ok') K.say(id + ' grab ' + await K.grab(id)); continue; }
      for (let attempt = 0; attempt < 120; attempt++) {
        if (K.stop || K.runId !== my) return K.say('stop');
        editor().editor.commands.setContent(id + ' ' + p + STYLE);
        const before = bigImgs(); const rej0 = rejN;
        const g = await K.safeGen(); K.say(id + ' ' + g);
        if (g !== 'clicked') { await sleep(30000); continue; }
        await sleep(30000);
        if (rejN > rej0) { K.rejects++; K.say(id + ' abgelehnt, warte'); document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })); await sleep(60000); continue; }
        let t = 0; while (bigImgs() <= before && t < 40) { await sleep(15000); t++; if (K.runId !== my) return; }
        K.done[id] = bigImgs() > before ? 'ok' : 'timeout'; K.say(id + ' ' + K.done[id]);
        if (K.done[id] === 'ok') { await sleep(3000); K.say(id + ' grab ' + await K.grab(id)); }
        break;
      }
    }
    K.say('FERTIG');
  };
})();

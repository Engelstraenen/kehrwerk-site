// KEHRWERK Schachtkamera – Dreamina-Bild-Warteschlange (GPT Image 2.5 Sunburst, 2K, 16:9, Unlimited)
// Einspielen: <input type=file id=ksjs> + file_upload, dann (0,eval)(await ksjs.files[0].text()); KSQ.run()
(() => {
  const STYLE = ' Photorealistic cinematic photograph, 16:9, dramatic low-key light, deep soot-black tones with a single signal red (#ff3b30) accent light, 35mm lens, fine film grain, premium campaign look like Apple or Nike. ABSOLUTELY NO text, no letters, no numbers, no logos, no UI overlays, no watermark. Modern realistic work situation, NO top hat, NO brass buttons, NO traditional chimney sweep uniform, NO lucky charms, NO clover, NO pig, NO horseshoe, no clichés, no orange, no gold, no blue tint.';
  const JOBS = [
    ['KS-1', 'Looking straight down from directly above into the open square flue of a brick chimney on a modern dark slate roof at dusk. A professional chimney inspection camera with a ring of bright white LEDs hangs on a black cable in the exact center, just entering the dark opening; the flue below falls away into deep black. Soot-darkened bricks around the opening, wet slate tiles around the chimney, a faint red rim light from the left. Perfectly centered symmetrical composition, the dark opening fills the middle third of the frame.'],
    ['KS-2', 'Inside a narrow soot-covered brick chimney flue, camera looking straight along the shaft: a round steel-bristle chimney sweeping brush on a flexible black rod fills the center and comes towards the lens, black soot particles and flakes fly through the white beam of the inspection camera LED, the brick courses converge to a dark vanishing point in the center, extreme depth, motion and energy.'],
    ['KS-3', 'Inside a freshly cleaned brick chimney flue lit by a white inspection LED, the camera glides close along the wall: dark red-brown bricks with clean mortar joints, one small hairline crack in a mortar joint in the right third of the frame catching a faint red light, the shaft continues into darkness in the left third. Macro detail, slight wet sheen, very shallow depth of field.'],
    ["SB-2", "Photorealistic website storyboard sheet, 16:9, a 3x3 grid of nine panels with thin gutters, each panel one scroll state of the same bright, clean scrollytelling website for a modern German chimney sweep master company. CONCEPT: the website is a live inspection monitor: a large circular camera viewport (like a professional chimney inspection monitor) shows the photoreal camera feed travelling down a brick flue, while beside it a clean digital inspection protocol writes itself line by line; the navigation is a vertical cable reel counter on the right edge with meter numbers rolling like an odometer. Strict colour palette: chalk white #f2f0eb background, cobalt blue #1f4fd8 accent, graphite text; bright, airy, technical, Swiss typography. Panel 1 (first frame): white page, huge cobalt headline, the circular viewport shows the view from the top of a chimney on a roof looking down into the lit flue, the cable reel counter at 0,0 m. Panel 2: viewport shows a steel chimney brush passing in the shaft, protocol line 'Reinigung' ticks cobalt. Panel 3: viewport zooms on a mortar crack, a cobalt marker ring and a photo card slide into the protocol. Panel 4: viewport becomes wide: a technician in black workwear with a red harness measures flue gas at a boiler, big cobalt measurement numbers. Panel 5: carbon monoxide detector close-up in the viewport, warning line in the protocol. Panel 6: thermal image of a house in the circular viewport, energy advice. Panel 7: young female apprentice on a roof ladder in the viewport, a short application form in the protocol column. Panel 8: the protocol complete with cobalt check marks and three review cards labeled example. Panel 9: smartphone in a hand showing the same site: circular viewport on top, protocol below, time slot booking buttons in cobalt. Modern realistic work situations only. NO top hat, NO brass buttons, NO traditional chimney sweep uniform, NO lucky charms, NO clover, NO pig, NO horseshoe, no clich\u00e9s. Photorealistic photographic panels, premium campaign look like Apple or Nike."],
    ["SB-3", "Photorealistic website storyboard sheet, 16:9, a 3x3 grid of nine panels with thin black gutters, each panel one scroll state of the same dark, cinematic scrollytelling website for a modern German chimney sweep master company. CONCEPT: the whole website is a vertical architectural cutaway of a house at night: a photoreal cross-section shows roof, attic, living rooms, basement and the chimney running through all floors; a glowing dot (the inspection camera) travels down the chimney as you scroll, a thin neon line traces its path, and at each station the view dives from the cutaway into a full-frame photoreal close-up; the navigation is a small cutaway minimap of the house on the left. Strict colour palette: graphite #141516 background, neon safety yellow #e6ff3a accent like hi-vis tape, white type. Panel 1 (first frame): full cutaway of a modern German house at night, chimney highlighted, the yellow dot at the chimney top, huge white headline. Panel 2: dive into the flue: a steel chimney brush with flying soot, full frame. Panel 3: back to the cutaway, the dot at attic level, a yellow callout to a crack in the chimney. Panel 4: full frame in the basement: technician in black workwear with red harness measuring flue gas at the boiler, yellow data labels. Panel 5: cutaway living room glows, CO detector on the ceiling with a yellow warning ring. Panel 6: the cutaway turns into a thermal view of the whole house. Panel 7: full frame on the roof at dawn: young female apprentice on a roof ladder with fall protection, yellow application form. Panel 8: the cutaway with yellow check marks at every station and three review cards labeled example. Panel 9: smartphone in a hand showing the same site: vertical cutaway minimap and yellow booking buttons. Modern realistic work situations only. NO top hat, NO brass buttons, NO traditional chimney sweep uniform, NO lucky charms, NO clover, NO pig, NO horseshoe, no clich\u00e9s. Photorealistic photographic panels, premium campaign look like Apple or Nike."],
    ['KS-1B', 'Looking straight down from directly above into the open square flue of a brick chimney on a modern dark slate roof at dusk. A professional chimney inspection camera on a black cable is being lowered into the opening; we see the camera head from above, from its back side, as a dark silhouette. Its LED ring points DOWNWARD into the shaft: the bright white LED light shines down into the flue and lights up the soot-covered brick walls below, a glowing pool of light deep down in the shaft, the light falls away from the viewer. NO light shines upward, no LEDs visible from above, no lens flare towards the camera. Soot-darkened bricks around the opening, wet slate tiles around the chimney, a faint red rim light from the left. Chimney opening centered in the frame.'],
    ['KS-1C', 'Low side view at dusk on a modern dark slate roof: the gloved hands of a chimney sweep in a black softshell jacket with a red fall-protection harness strap lower a black inspection camera cable hand over hand into a brick chimney; the camera head has already disappeared inside, its white LED light shines DOWNWARD into the flue, only a soft indirect glow spills out of the opening onto the soot-blackened brick rim. Shallow depth of field on the hands and the cable, town rooftops blurred in the background, dark grey-red dusk sky. No face visible.'],
    ['KS-1D', 'Inside the top of a brick chimney flue, camera positioned just above and behind a black inspection camera head that hangs on its cable in the center: its LED ring points straight DOWN and throws a bright cone of white light down the square shaft, illuminating the soot-covered brick courses that recede into the depth, a glowing pool of light far below; above the camera head a small square of dark dusk sky at the top of the frame. Strong one-point perspective, dramatic, the light falls away from the viewer.'],
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
  const K = window.KSQ = { log: [], done: old.done || {}, urls: old.urls || {}, retry: old.retry || {}, stop: false, rejects: 0, runId: Date.now() };
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
  /* Regel 24.11.2026: Dreamina Unlimited = 1 Auftrag kontoweit. Nur abschicken, wenn im Hauptbereich nichts wartet/läuft.
     Kein Retry-Klicken: nach Ablehnung erst warten, bis der Hauptbereich frei ist, dann frühestens nach 5 min EIN neuer Versuch. */
  const busy = () => JOBS.some(([id]) => cardState(id) === 'busy');
  const cardState = id => { const cs = [...document.querySelectorAll('div')].filter(d => d.getBoundingClientRect().left > 80 && (d.innerText || '').startsWith(id + ' ') && !d.querySelector('.ProseMirror') && !d.closest('.ProseMirror')); if (!cs.length) return 'none'; if (cs.some(c => [...c.querySelectorAll('img')].some(i => i.naturalWidth > 1000))) return 'done'; if (cs.some(c => /Couldn.t generate|failed/i.test(c.innerText))) return 'failed'; if (cs.some(c => /Waiting in queue|Generating/.test(c.innerText))) return 'busy'; return 'other'; };
  K.busy = busy; K.cardState = cardState;
  K.run = async (from = 0) => {
    const my = K.runId = Date.now(); const alive = () => !K.stop && K.runId === my;
    for (let j = from; j < JOBS.length; j++) {
      const [id, p] = JOBS[j]; if (K.done[id]) continue;
      while (alive()) {
        const tag = K.retry[id] ? id + 'R' + K.retry[id] : id;
        let st = cardState(tag);
        if (st === 'busy' || st === 'done') K.say(tag + ' lief schon');
        else {
          if (st === 'failed') { K.retry[id] = (K.retry[id] || 0) + 1; if (K.retry[id] > 2) { K.done[id] = 'failed'; K.say(id + ' aufgegeben'); break; } K.say(tag + ' fehlgeschlagen – neu als ' + id + 'R' + K.retry[id]); continue; }
          while (alive() && busy()) await sleep(60000);
          if (!alive()) return K.say('stop');
          editor().editor.commands.setContent(tag + ' ' + p + (id.startsWith('SB') ? '' : STYLE));
          const rej0 = rejN; const g = await K.safeGen(); K.say(tag + ' ' + g);
          if (g !== 'clicked') { await sleep(120000); continue; }
          await sleep(35000);
          if (rejN > rej0) { K.rejects++; K.say(tag + ' abgelehnt – warte 5 min'); document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })); await sleep(300000); continue; }
        }
        while (alive() && (st = cardState(tag)) !== 'done' && st !== 'failed') await sleep(30000);
        if (!alive()) return K.say('stop');
        if (st === 'failed') continue;
        K.done[id] = 'ok'; K.say(tag + ' fertig');
        await sleep(3000); const gr = await K.grab(tag); K.say(tag + ' grab ' + gr); if (gr === 'ok' && tag !== id) K.urls[id] = K.urls[tag];
        break;
      }
    }
    K.say('FERTIG');
  };
})();

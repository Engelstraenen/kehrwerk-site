// KEHRWERK Schachtkamera – Dreamina-Bild-Warteschlange (GPT Image 2.5 Sunburst, 2K, 16:9, Unlimited)
// Einspielen: <input type=file id=ksjs> + file_upload, dann (0,eval)(await ksjs.files[0].text()); KSQ.run()
(() => {
  const STYLE = " Photorealistic cinematic photograph, 16:9, low-key night or dusk light, deep graphite and charcoal tones, natural neutral light sources (cool white LED, warm interior lamps), at most one small neon safety yellow (#e6ff3a) accent such as reflective tape, 35mm lens, fine film grain, premium campaign look like Apple or Nike. ABSOLUTELY NO text, no letters, no numbers, no logos, no UI overlays, no labels, no watermark. Modern realistic work situation, NO top hat, NO brass buttons, NO traditional chimney sweep uniform, NO lucky charms, NO clover, NO pig, NO horseshoe, no clich\u00e9s, no red tint, no orange tint, no blue tint.";
  const JOBS = [
    ["H-1A", "Photorealistic architectural cutaway photograph of a modern German two-storey detached house with a gable roof at night, the front wall removed like a cross-section model, seen perfectly frontal and straight-on: from top to bottom the roof with dark tiles and the chimney top, the attic with wooden beams, a bedroom, the living room with a wood-burning stove, the hallway, and the basement with a modern wall-mounted gas boiler, below it a dark soil layer. The brick chimney runs straight up through the house from the basement boiler and the living-room wood stove, through every floor and out of the roof; the chimney itself is also cut open so its inner flue is visible as a dark vertical shaft. The chimney is exactly in the horizontal center of the image. Warm lamps glow in two rooms, the rest is dark and quiet; graphite night sky. The whole house fits in the frame with dark space around it."],
    ["H-1B", "Photorealistic three-quarter axonometric cutaway of a modern German detached house at night seen from slightly above, the house sliced open diagonally so the front and the left side wall are removed and all floors are visible like a precise architectural model photographed for real: roof with dark tiles, attic, bedroom, living room with a wood-burning stove, kitchen, basement with a gas boiler, dark soil below. The brick chimney runs straight up through the house from the basement boiler and the living-room wood stove, through every floor and out of the roof; the chimney itself is also cut open so its inner flue is visible as a dark vertical shaft. Dramatic: interiors softly lit by warm lamps, the open chimney flue glows faintly from inside, surrounding darkness graphite. The house fills most of the frame."],
    ["H-1C", "Photorealistic close cutaway focused on the chimney zone of a German house at night: the frame shows a vertical slice of the house from the chimney top above the roof ridge at the very top edge down to the basement boiler at the very bottom edge; the cut-open brick chimney with its dark inner flue runs vertically through the exact center; on both sides narrow slices of the rooms it passes: attic beams under the roof tiles, a child's bedroom, the living room with a glowing wood stove connected to the chimney, the basement with a gas boiler; the outer left and right parts of the frame fall off into graphite darkness. Precise, architectural, cinematic."],
    ["H-2", "Inside a narrow soot-covered brick chimney flue, camera looking straight down the shaft: a round steel-bristle chimney sweeping brush on a flexible black rod fills the center and moves towards the lens, black soot particles and flakes fly through the cool white beam of an inspection camera LED, the brick courses converge to a dark vanishing point in the center, extreme depth, motion and energy."],
    ["H-4", "A clean modern basement boiler room at night with a white wall-mounted gas condensing boiler and a stainless steel flue pipe. A chimney sweep technician, man in his thirties, wearing a modern black softshell work jacket with thin neon-yellow reflective stripes, black work trousers with knee pads and a black fall-protection harness with neon-yellow straps, inserts the thin metal probe of a handheld digital flue gas analyzer into a small test hole in the flue pipe and reads the device with concentration. He stands in the left third of the frame, the right two thirds are calm dark wall space. Cool ceiling light, the analyzer screen glows white."],
    ["H-7", "A young female chimney sweep apprentice, about twenty, wearing a modern black softshell work jacket with thin neon-yellow reflective stripes, black work trousers with knee pads and a black fall-protection harness with neon-yellow straps, standing on a roof ladder hooked over the ridge of a dark slate roof at dawn, secured with a safety rope, looking confidently into the camera, low angle from slightly below, town rooftops and a pale grey dawn sky behind her, tied-back hair moving in the wind. She stands in the left half of the frame, the right half is open sky."],
    ["H-5", "Close-up of a small white round carbon monoxide detector on the white ceiling of a modern living room at night, its small status LED glowing, below and behind it in soft focus the dark living room with a wood-burning stove glowing faintly. Detector in the right third, lots of dark negative space on the left. Calm, quiet, slightly ominous."],
    ["H-3", "Inside a freshly cleaned brick chimney flue lit by a cool white inspection LED, the camera glides close along the wall: dark red-brown bricks with clean mortar joints, one small hairline crack in a mortar joint in the right third of the frame, the shaft continues into darkness in the left third. Macro detail, slight wet sheen, very shallow depth of field."]
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
  const busy = () => [...document.querySelectorAll('div')].some(d => { const t = d.innerText || ''; return d.getBoundingClientRect().left > 80 && /^(KS|SB|H)-[0-9A-Z]+ /.test(t) && t.length < 4000 && !d.querySelector('.ProseMirror') && /Waiting in queue|Generating|\d+%/.test(t) && ![...d.querySelectorAll('img')].some(i => i.naturalWidth > 1000); });
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

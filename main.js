/* KEHRWERK · Haus im Schnitt: Leuchtpunkt (Schachtkamera) fährt den Schornstein hinab, an jeder Station Eintauchen ins Foto */
(() => {
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const smooth = (a, b, x) => { const k = clamp((x - a) / (b - a)); return k * k * (3 - 2 * k); };
const qs = new URLSearchParams(location.search);
const A = window.KW_ASSETS || { img: [], vid: [] };
const has = (k, n) => (A[k] || []).includes(n);
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const mob = () => innerWidth <= 820;

/* ?firma= persönlicher Link, ?farbe=akzent,grund (Hex ohne #) */
const firma = (qs.get('firma') || '').replace(/[<>]/g, '').slice(0, 60);
if (firma) $('#firma').textContent = ' · Musterseite für ' + firma;
const farbe = (qs.get('farbe') || '').split(',').filter(x => /^[0-9a-f]{6}$/i.test(x));
if (farbe[0]) { const h = farbe[0]; document.documentElement.style.setProperty('--or', '#' + h); document.documentElement.style.setProperty('--or-rgb', [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16)).join(',')); }
if (farbe[1]) document.documentElement.style.setProperty('--bg', '#' + farbe[1]);

/* ---------- Hausschnitt: Lage des Schornsteins im Bild (0..1) ---------- */
const HOUSE = window.KW_HOUSE || { img: 'h-1', th: 'h-1t', w: 2560, h: 1440, x: 0.5, top: 0.06, bottom: 0.9,
  floors: { DACH: 0.14, DACHBODEN: 0.32, WOHNEN: 0.55, TECHNIK: 0.7, KELLER: 0.84 } };
const FLOORS = ['DACH', 'DACHBODEN', 'WOHNEN', 'TECHNIK', 'KELLER'];
const LABEL = { DACH: 'Dach', DACHBODEN: 'Dachboden', WOHNEN: 'Wohnen', TECHNIK: 'Technik', KELLER: 'Keller' };
const RING = { 'h-5': { x: 0.74, y: 0.3, w: 0.2 } };
const POS = { 'h-4': '24% 50%', 'h-5': '72% 50%', 'h-7': '30% 50%' };

const cutImg = $('#cutImg'), cutTh = $('#cutTh'), cutZ = $('#cutZ');
const houseOK = has('img', HOUSE.img);
const SIZES = '(max-aspect-ratio: 16/9) 177.8vh, 100vw';
const srcset = n => `assets/img/${n}-m.webp 1600w, assets/img/${n}.webp 2560w`;
if (houseOK) { cutImg.sizes = SIZES; cutImg.srcset = srcset(HOUSE.img); cutImg.src = `assets/img/${HOUSE.img}.webp`; }
else { cutImg.setAttribute('src', ''); document.body.classList.add('nohouse'); $('#trace').style.display = 'none'; }
if (has('img', HOUSE.th)) { cutTh.sizes = SIZES; cutTh.srcset = srcset(HOUSE.th); cutTh.src = `assets/img/${HOUSE.th}.webp`; } else cutTh.setAttribute('src', '');
if (has('img', 'h-3')) $('#calloutImg').src = 'assets/img/h-3-m.webp'; else $('#calloutImg').setAttribute('src', '');

/* ---------- Kapitel ---------- */
const secs = $$('.sc').map(el => {
  const s = { el, id: el.id, kind: el.dataset.kind, floor: el.dataset.floor, fx: el.dataset.fx, panel: $('.panel', el), t: 0, vis: 0 };
  const img = el.dataset.img, vid = el.dataset.vid;
  if ((img && has('img', img)) || (vid && has('vid', vid))) {
    const ly = document.createElement('div'); ly.className = 'ly' + (s.panel && s.panel.classList.contains('right') ? ' r' : '');
    if (img && has('img', img)) { const im = new Image(); im.alt = ''; im.decoding = 'async'; im.sizes = SIZES; im.srcset = srcset(img); im.src = `assets/img/${img}.webp`; im.style.objectPosition = POS[img] || '50% 50%'; ly.append(im); s.pos = POS[img] || '50% 50%'; }
    else { const v = document.createElement('video'); v.muted = true; v.loop = true; v.playsInline = true; v.setAttribute('playsinline', ''); v.preload = 'metadata'; v.src = `assets/vid/${vid}.mp4`; ly.append(v); s.vid = v; }
    if (RING[img]) { const r = document.createElement('i'); r.className = 'ring'; ly.append(r); s.ring = r; s.ringCfg = RING[img]; }
    $('#layers').append(ly); s.ly = ly;
  }
  return s;
});
const S = id => secs.find(s => s.id === id);

/* Mini-Schnitt */
const miniList = $('#miniList');
FLOORS.forEach(f => { const first = secs.find(s => s.floor === f); miniList.insertAdjacentHTML('beforeend', `<li><a href="#${first.id}" data-go="${first.id}" data-floor="${f}" aria-label="${LABEL[f]}">${LABEL[f]}</a></li>`); });
if (!houseOK) $('#mini').style.display = 'none';

/* Häkchen (Protokoll) */
const checks = $('#checks');
FLOORS.forEach(() => checks.insertAdjacentHTML('beforeend', '<i></i>'));

/* ---------- Scroll ---------- */
let lenis = null;
if (window.Lenis && !reduce) lenis = new window.Lenis({ lerp: 0.09, smoothWheel: true });
const burger = $('#burger'), menu = $('#menu');
const closeMenu = () => { menu.hidden = true; burger.setAttribute('aria-expanded', 'false'); };
const goTo = id => {
  const s = S(id); if (!s) return;
  const y = s.el.classList.contains('last') ? s.top + innerHeight * 0.2 : s.top + s.h * 0.4 - innerHeight * 0.35;
  closeMenu();
  lenis ? lenis.scrollTo(Math.max(0, y), { duration: 2 }) : scrollTo({ top: Math.max(0, y), behavior: reduce ? 'auto' : 'smooth' });
};
document.addEventListener('click', e => { const a = e.target.closest('[data-go]'); if (a) { e.preventDefault(); goTo(a.dataset.go); } });
burger.addEventListener('click', () => { const o = menu.hidden; menu.hidden = !o; burger.setAttribute('aria-expanded', String(o)); });
addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

/* ---------- Geometrie: Bildkoordinaten -> Bildschirm ---------- */
let W = innerWidth, H = innerHeight, cover = null;
const coverOf = (posX = 0.5) => { const s = Math.max(W / HOUSE.w, H / HOUSE.h), dw = HOUSE.w * s, dh = HOUSE.h * s; return { dw, dh, ox: (W - dw) * posX, oy: (H - dh) / 2 }; };
const measure = () => {
  W = innerWidth; H = innerHeight;
  /* Schornstein im Hochformat in die Mitte holen */
  const c0 = coverOf(0.5); const px = c0.dw > W ? clamp((HOUSE.x * c0.dw - W / 2) / (c0.dw - W)) : 0.5;
  cover = coverOf(px); cutImg.style.objectPosition = cutTh.style.objectPosition = `${(px * 100).toFixed(2)}% 50%`;
  secs.forEach(s => { s.top = s.el.offsetTop; s.h = s.el.offsetHeight; });
  secs.forEach(s => { if (s.ring) { const c = coverOf(parseFloat(s.pos) / 100); s.ring.style.left = (c.ox + s.ringCfg.x * c.dw) + 'px'; s.ring.style.top = (c.oy + s.ringCfg.y * c.dh) + 'px'; s.ring.style.setProperty('--rw', (s.ringCfg.w * c.dw) + 'px'); } });
};
addEventListener('resize', measure); measure(); addEventListener('load', measure);
const toScreen = (nx, ny) => [cover.ox + nx * cover.dw, cover.oy + ny * cover.dh];

/* Zähler (Messung) */
let meterDone = false;
const countUp = els => { const t0 = performance.now(); const f = now => { const k = clamp((now - t0) / 1400), e = 1 - Math.pow(1 - k, 3); els.forEach(d => d.textContent = (+d.dataset.to * e).toFixed(+d.dataset.dec).replace('.', ',')); if (k < 1) requestAnimationFrame(f); else $('#meter').classList.add('fin'); }; requestAnimationFrame(f); };

/* Wärmebild: Maus übersteuert */
let thermoMouse = null;
S('s5').el.addEventListener('pointermove', e => { if (e.pointerType === 'mouse') thermoMouse = clamp(e.clientX / innerWidth) * 100; });
S('s5').el.addEventListener('pointerleave', () => thermoMouse = null);

const trFull = $('#trFull'), trLit = $('#trLit'), trDot = $('#trDot'), trPing = $('#trPing');
const tStart = performance.now();
let dotY = HOUSE.top, zoom = 1, zx = W / 2, zy = H / 2;

function frame() {
  const y = lenis ? lenis.scroll : scrollY, vh = H;
  secs.forEach(s => {
    const last = s.el.classList.contains('last');
    s.t = clamp((y - s.top + vh * 0.35) / (last ? vh * 0.8 : s.h));
    s.vis = (y + vh * 0.35 < s.top) ? 0 : smooth(0, 0.15, s.t) * (last ? 1 : 1 - smooth(0.85, 1, s.t));
    if (s.panel && !last) {
      const p = mob() ? 1 : smooth(0.1, 0.24, s.t) * (1 - smooth(0.74, 0.86, s.t));
      s.panel.style.opacity = p.toFixed(3); s.panel.style.visibility = p > 0.01 ? 'visible' : 'hidden';
      s.panel.style.transform = reduce || mob() ? 'none' : `translateY(${((1 - p) * 28).toFixed(1)}px)`;
    }
  });

  /* Leuchtpunkt: Stockwerk zwischen den Kapitelmitten (beim Laden gleitet er vom Schornsteinkopf herein) */
  const pts = secs.map(s => [s.top + s.h * 0.4 - vh * 0.35, HOUSE.floors[s.floor]]);
  let fy = pts[0][1];
  if (y >= pts[pts.length - 1][0]) fy = pts[pts.length - 1][1];
  else for (let i = 0; i < pts.length - 1; i++) if (y >= pts[i][0] && y < pts[i + 1][0]) fy = pts[i][1] + (pts[i + 1][1] - pts[i][1]) * smooth(0, 1, (y - pts[i][0]) / (pts[i + 1][0] - pts[i][0]));
  const intro = reduce ? 1 : smooth(0, 1, (performance.now() - tStart) / 1800);
  const target = HOUSE.top + (fy - HOUSE.top) * intro;
  dotY += (target - dotY) * 0.2;

  /* Eintauchen: Foto-Kapitel mit größter Sichtbarkeit bestimmt Zoom und Zoompunkt */
  const ph = secs.filter(s => s.kind === 'photo' && s.ly).reduce((a, s) => s.vis > (a ? a.vis : 0) ? s : a, null);
  const pv = ph ? ph.vis : 0;
  const [ax, ay] = toScreen(HOUSE.x, ph ? HOUSE.floors[ph.floor] : dotY);
  const zt = reduce ? 1 : 1 + 2.6 * smooth(0, 1, pv);
  zoom += (zt - zoom) * 0.25; zx += (ax - zx) * 0.3; zy += (ay - zy) * 0.3;
  cutZ.style.transformOrigin = `${zx.toFixed(1)}px ${zy.toFixed(1)}px`;
  cutZ.style.transform = `scale(${zoom.toFixed(4)})`;
  secs.forEach(s => {
    if (!s.ly) return;
    const o = s === ph || s.el.classList.contains('last') ? clamp((s.vis - 0.25) / 0.6) : 0;
    s.ly.style.opacity = o.toFixed(3); s.ly.style.visibility = o > 0.002 ? 'visible' : 'hidden';
    if (!reduce) s.ly.style.transform = `scale(${(1.14 - 0.1 * o + 0.04 * s.t).toFixed(4)})`;
    if (s.vid) { if (o > 0.05 && s.vid.paused) s.vid.play().catch(() => {}); else if (o <= 0.05 && !s.vid.paused) s.vid.pause(); }
  });

  /* Spur + Punkt (im gezoomten Bild mitgeführt) */
  const Z = p => [zx + (p[0] - zx) * zoom, zy + (p[1] - zy) * zoom];
  const top = Z(toScreen(HOUSE.x, HOUSE.top)), bot = Z(toScreen(HOUSE.x, HOUSE.bottom)), dot = Z(toScreen(HOUSE.x, dotY));
  trFull.setAttribute('x1', top[0]); trFull.setAttribute('y1', top[1]); trFull.setAttribute('x2', bot[0]); trFull.setAttribute('y2', bot[1]);
  trLit.setAttribute('x1', top[0]); trLit.setAttribute('y1', top[1]); trLit.setAttribute('x2', dot[0]); trLit.setAttribute('y2', dot[1]);
  [trDot, trPing].forEach(c => { c.setAttribute('cx', dot[0]); c.setAttribute('cy', dot[1]); });
  $('#trace').style.opacity = (1 - smooth(0.05, 0.4, pv)).toFixed(3);

  /* Ebene in der Navigation */
  const cur = FLOORS.reduce((a, f) => Math.abs(HOUSE.floors[f] - dotY) < Math.abs(HOUSE.floors[a] - dotY) ? f : a, FLOORS[0]);
  $$('#miniList a').forEach(a => { const f = a.dataset.floor; a.classList.toggle('on', f === cur); a.classList.toggle('done', HOUSE.floors[f] < dotY - 0.04 && f !== cur); });

  /* Kapitel-Effekte */
  const c2 = S('s2'), co = $('#callout');
  const cv = smooth(0.16, 0.3, c2.t) * (1 - smooth(0.74, 0.86, c2.t)) * (houseOK ? 1 : 0);
  co.style.opacity = cv.toFixed(3);
  if (cv > 0) {
    const p = Z(toScreen(HOUSE.x, HOUSE.floors.DACHBODEN)), lead = mob() ? 0 : Math.min(120, W * 0.07);
    const left = mob() ? Math.max(16, Math.min(W - co.offsetWidth - 64, p[0] - co.offsetWidth / 2)) : p[0] + lead;
    co.style.left = left + 'px'; co.style.top = (mob() ? p[1] + 26 : p[1] - 22) + 'px'; co.style.setProperty('--lead', lead + 'px');
  }
  const m3 = S('s3'), mt = $('#meter');
  if (!mob()) { const mv = smooth(0.2, 0.32, m3.t) * (1 - smooth(0.74, 0.86, m3.t)); mt.style.opacity = mv.toFixed(3); mt.style.visibility = mv > 0.01 ? 'visible' : 'hidden'; }
  if (!meterDone && m3.t > 0.22 && m3.t < 0.9) { meterDone = true; countUp($$('#meter dd')); }
  const s5 = S('s5'), thv = smooth(0.12, 0.22, s5.t) * (1 - smooth(0.78, 0.9, s5.t));
  const cut = thermoMouse ?? (100 - 100 * smooth(0.16, 0.52, s5.t) * (1 - smooth(0.8, 0.92, s5.t)));
  cutTh.style.setProperty('--cut', cut.toFixed(1) + '%'); $('#thScale').style.opacity = (cutTh.getAttribute('src') ? thv : 0).toFixed(3);
  const s7 = S('s7');
  $$('#checks i').forEach((c, i) => { const p = Z(toScreen(HOUSE.x, HOUSE.floors[FLOORS[i]])); c.style.left = p[0] + 'px'; c.style.top = p[1] + 'px'; c.classList.toggle('on', houseOK && s7.t > 0.14 + i * 0.07 && s7.t < 0.9); });
  if (!mob()) { const tg = $('#tags'), tv = smooth(0.2, 0.3, s7.t) * (1 - smooth(0.76, 0.86, s7.t)); tg.style.opacity = tv.toFixed(3); tg.style.visibility = tv > 0.01 ? 'visible' : 'hidden'; }
  $$('#tags .tagc').forEach((c, k) => c.classList.toggle('on', mob() || s7.t > 0.3 + k * 0.1));
  const s6 = S('s6');
  $$('#kin span').forEach((sp, k) => { const a = mob() ? 0.12 + k * 0.08 : 0.08 + k * 0.2, i = smooth(a, a + 0.07, s6.t), o = mob() ? 0 : k === 2 ? smooth(0.78, 0.86, s6.t) : smooth(a + 0.15, a + 0.21, s6.t); sp.style.opacity = (i * (1 - o)).toFixed(3); sp.style.transform = `translateX(${((1 - i) * -12 + o * 8).toFixed(2)}vw)`; });
}
function loop(ts) { if (lenis) lenis.raf(ts); frame(); requestAnimationFrame(loop); }
requestAnimationFrame(loop);

/* ---------- Termin: nächste 5 Werktage ---------- */
const days = $('#days'), wd = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
for (let d = new Date(), n = 0; n < 5;) { d.setDate(d.getDate() + 1); if (d.getDay() % 6 === 0) continue; const v = `${wd[d.getDay()]} ${d.getDate()}.${d.getMonth() + 1}.`; days.insertAdjacentHTML('beforeend', `<label><input type="radio" name="tag" value="${v}" ${n ? '' : 'checked'}><span>${v}</span></label>`); n++; }

/* ---------- Formulare (Demo) ---------- */
const toast = m => { const t = $('#toast'); t.textContent = m; t.classList.add('on'); clearTimeout(toast.h); toast.h = setTimeout(() => t.classList.remove('on'), 4200); };
const check = f => { let ok = true; $$('input[required]', f).forEach(i => { const bad = !i.value.trim(); i.classList.toggle('bad', bad); if (bad && ok) { i.focus(); ok = false; } }); return ok; };
$('#slotForm').addEventListener('submit', e => { e.preventDefault(); if (!check(e.target)) return; const fd = new FormData(e.target); toast(`Demo: ${fd.get('tag')} · ${fd.get('win')} Uhr wäre angefragt. Es wurde nichts gesendet.`); e.target.reset(); });
$('#jobForm').addEventListener('submit', e => { e.preventDefault(); if (!check(e.target)) return; toast('Demo: Funkspruch wäre beim Meister. Es wurde nichts gesendet.'); e.target.reset(); });
let txT0 = 0; $('#jobForm').addEventListener('input', () => { if (txT0) return; txT0 = Date.now(); const iv = setInterval(() => { const s = Math.max(0, 45 - Math.round((Date.now() - txT0) / 1000)); $('#txTime').textContent = s ? `noch ≈ ${s} s` : 'gleich fertig'; if (!s) clearInterval(iv); }, 1000); });
$('#coTest').addEventListener('click', () => { document.body.classList.remove('flash'); void document.body.offsetWidth; document.body.classList.add('flash'); toast('Piep, piep, piep – so warnt ein CO-Melder. (Demo)'); setTimeout(() => document.body.classList.remove('flash'), 1600); });

/* ---------- Impressum / Datenschutz ---------- */
const TXT = {
  imp: '<h3>Impressum</h3><p>Demo-Website. KEHRWERK ist ein erfundener Schornsteinfeger-Meisterbetrieb.</p><p>Bei einer echten Seite stehen hier Name, Anschrift, Kontakt, Handwerkskammer und Registereintrag des Betriebs.</p>',
  ds: '<h3>Datenschutz</h3><p>Diese Demo speichert und sendet keine Eingaben. Schriften werden von Google Fonts geladen, die Scroll-Bibliothek von unpkg.</p><p>Bei einer echten Seite steht hier die vollständige Datenschutzerklärung.</p>'
};
const modal = $('#modal');
document.addEventListener('click', e => { const b = e.target.closest('[data-modal]'); if (b) { $('#modalBody').innerHTML = TXT[b.dataset.modal]; modal.showModal(); } });
$('#modalX').addEventListener('click', () => modal.close());
})();

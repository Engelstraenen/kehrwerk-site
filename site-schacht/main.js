/* KEHRWERK · Schachtkamera-Fahrt: Scrollen = Kamera fährt den Schornstein hinab, HUD = Navigation */
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const qs = new URLSearchParams(location.search);
const A = window.KW_ASSETS || { img: [], vid: [] };
const has = (k, n) => (A[k] || []).includes(n);
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ?firma= persönlicher Link, ?farbe=akzent,grund (Hex ohne #) */
const firma = (qs.get('firma') || '').replace(/[<>]/g, '').slice(0, 60);
if (firma) $('#firma').textContent = ' · Musterseite für ' + firma;
const farbe = (qs.get('farbe') || '').split(',').filter(x => /^[0-9a-f]{6}$/i.test(x));
if (farbe[0]) { const h = farbe[0], r = parseInt(h.slice(0, 2), 16), g = parseInt(h.slice(2, 4), 16), b = parseInt(h.slice(4), 16); document.documentElement.style.setProperty('--or', '#' + h); document.documentElement.style.setProperty('--or-rgb', `${r},${g},${b}`); }
if (farbe[1]) document.documentElement.style.setProperty('--bg', '#' + farbe[1]);

/* ---------- Stationen + Ebenen ---------- */
const MAP = {
  0: { img: 'ks-1', vid: 'ks-dach', pos: '30% 50%' },
  E: { vid: 'ks-einfahrt', cls: 'cold' },
  1: { img: 'ks-2', pos: '68% 50%' },
  2: { img: 'ks-3', pos: '62% 50%' },
  3: { img: 'ks-4', r: 1, pos: '24% 50%' },
  4: { img: 'ks-5', pos: '74% 50%' },
  5: { img: 'ks-6', thermo: 'ks-6t', r: 1 },
  6: { img: 'ks-7', r: 1, pos: '30% 50%' },
  7: { img: 'ks-8' },
  8: { vid: 'ks-ofen', loop: 1 }
};
const SIZES = '(max-aspect-ratio: 16/9) 177.8vh, 100vw';
const srcset = n => `assets/img/${n}-m.webp 1600w, assets/img/${n}.webp 2560w`;
const secs = $$('.st-c').map(el => {
  const key = el.dataset.st, m = MAP[key] || {};
  const s = { el, key, depth: +el.dataset.depth, name: el.dataset.name, read: el.dataset.read.split(',').map(Number), panel: $('.panel', el), t: 0, vis: 0 };
  let ly = null;
  const useVid = m.vid && has('vid', m.vid), useImg = m.img && has('img', m.img);
  if (useVid || useImg) {
    ly = document.createElement('div'); ly.className = 'ly' + (m.r ? ' r' : '') + (m.cls ? ' ' + m.cls : '');
    if (useImg) { const im = new Image(); im.alt = ''; im.decoding = 'async'; im.sizes = SIZES; im.srcset = srcset(m.img); im.src = `assets/img/${m.img}.webp`; im.style.objectPosition = m.pos || '50% 50%'; ly.append(im); }
    if (useVid) {
      const v = document.createElement('video'); v.muted = true; v.playsInline = true; v.setAttribute('playsinline', ''); v.preload = 'auto';
      if (m.loop) { v.loop = true; v.autoplay = true; }
      v.src = `assets/vid/${m.vid}.mp4`; v.style.objectPosition = m.pos || '50% 50%'; ly.append(v); s.vid = v; s.loopVid = !!m.loop;
    }
    if (m.thermo && has('img', m.thermo)) { const th = new Image(); th.alt = ''; th.className = 'thermo'; th.sizes = SIZES; th.srcset = srcset(m.thermo); th.src = `assets/img/${m.thermo}.webp`; ly.append(th); s.thermo = ly; }
    $('#layers').append(ly);
  }
  s.ly = ly;
  return s;
});
if (!secs.find(s => s.key === '5').thermo) $('#dragHint').classList.add('hide');
const stations = secs.filter(s => /^\d$/.test(s.key));
const MAXD = Math.max(...secs.map(s => s.depth));

/* Tiefenmesser = Navigation */
const gSt = $('#gSt');
stations.forEach(s => {
  const li = document.createElement('li');
  li.style.top = (6 + s.depth / MAXD * 88) + '%';
  li.innerHTML = `<a href="#${s.el.id}" data-go="${s.key}" aria-label="${s.name}, ${String(s.depth).replace('.', ',')} Meter"><span>${s.key.padStart(2, '0')} ${s.name}</span></a>`;
  gSt.append(li); s.mark = $('a', li);
});

/* ---------- Scroll (Lenis, falls geladen) ---------- */
let lenis = null;
if (window.Lenis && !reduce) { lenis = new window.Lenis({ lerp: 0.09, smoothWheel: true }); }
const goTo = key => {
  const s = secs.find(x => x.key === String(key)); if (!s) return;
  const y = s.key === '8' ? s.top + innerHeight * 0.1 : s.top + s.h * 0.32 - innerHeight * 0.3;
  lenis ? lenis.scrollTo(Math.max(0, y), { duration: 2.2 }) : scrollTo({ top: Math.max(0, y), behavior: reduce ? 'auto' : 'smooth' });
};
document.addEventListener('click', e => { const a = e.target.closest('[data-go]'); if (a) { e.preventDefault(); goTo(a.dataset.go); } });

let vh = innerHeight;
const measure = () => { vh = innerHeight; secs.forEach(s => { s.top = s.el.offsetTop; s.h = s.el.offsetHeight; }); };
addEventListener('resize', () => { measure(); resize3d && resize3d(); });
measure(); addEventListener('load', measure);

/* ---------- HUD ---------- */
const hDepth = $('#hDepth'), hNo = $('#hStNo'), hName = $('#hStName'), gauge = $('#gauge');
const R = ['#rO2', '#rCO', '#rT', '#rZ'].map(x => $(x));
const clock = () => { const d = new Date(); $('#hClock').textContent = d.toTimeString().slice(0, 8); };
setInterval(clock, 1000); clock();
let cur = null, depth = 0;

/* Zähler (Messung) */
const countUp = (els, ms = 1400) => { const t0 = performance.now(); const f = now => { const k = clamp((now - t0) / ms); const e = 1 - Math.pow(1 - k, 3); els.forEach(d => { const to = +d.dataset.to, dec = +d.dataset.dec; d.textContent = (to * e).toFixed(dec).replace('.', ','); }); if (k < 1) requestAnimationFrame(f); else $('#meter').classList.add('fin'); }; requestAnimationFrame(f); };
let meterDone = false;

/* Wärmebild: Maus übersteuert den Scroll-Wert */
let thermoOverride = null;
const s5 = secs.find(s => s.key === '5');
s5.el.addEventListener('pointermove', e => { if (e.pointerType === 'mouse' && s5.thermo) thermoOverride = clamp(e.clientX / innerWidth) * 100; });
s5.el.addEventListener('pointerleave', () => thermoOverride = null);

const mob = () => innerWidth <= 820;
const smooth = (a, b, x) => { const k = clamp((x - a) / (b - a)); return k * k * (3 - 2 * k); };

function frame() {
  const y = lenis ? lenis.scroll : scrollY;
  let best = null;
  secs.forEach((s, i) => {
    const last = s.key === '8';
    const t = clamp((y - s.top + vh * 0.35) / (last ? vh * 0.9 : s.h));
    s.t = t;
    const vin = smooth(0, 0.13, t), vout = last ? 1 : 1 - smooth(0.84, 1, t);
    s.vis = (y + vh * 0.35 < s.top) ? 0 : vin * vout;
    if (s.ly) {
      let sc = 0.9 + 0.16 * t; if (t > 0.84 && !last) sc += (t - 0.84) * 2.4;
      if (last) sc = 1.04 - 0.04 * t;
      s.ly.style.opacity = s.vis.toFixed(3);
      s.ly.style.transform = reduce ? 'none' : `scale(${sc.toFixed(4)})`;
      s.ly.style.visibility = s.vis > 0.002 ? 'visible' : 'hidden';
    }
    if (s.panel && !last) {
      const p = mob() ? 1 : smooth(0.08, 0.22, t) * (1 - smooth(0.74, 0.86, t));
      s.panel.style.opacity = p.toFixed(3);
      s.panel.style.transform = reduce ? 'none' : `translateY(${((1 - p) * 30).toFixed(1)}px)`;
      s.panel.style.visibility = p > 0.01 ? 'visible' : 'hidden';
      s.panel.style.pointerEvents = p > 0.5 ? 'auto' : 'none';
    }
    if (!best || s.vis > best.vis + 0.0001 || (s.vis === best.vis && t > 0 && t < 1)) best = s.vis > 0.01 ? s : best;
    /* Scroll-Film */
    if (s.vid && !s.loopVid && s.vid.duration && s.vis > 0) { const tt = clamp(t / 0.84) * (s.vid.duration - 0.05); if (Math.abs(s.vid.currentTime - tt) > 1 / 30) s.vid.currentTime = tt; }
    if (s.vid && s.loopVid) { if (s.vis > 0.05 && s.vid.paused) s.vid.play().catch(() => {}); else if (s.vis <= 0.05 && !s.vid.paused) s.vid.pause(); }
  });

  /* Tiefe: linear zwischen den Kapitelmitten */
  const pts = secs.map(s => [s.top + s.h * 0.4 - vh * 0.35, s.depth]);
  let d = 0;
  if (y <= pts[0][0]) d = 0; else if (y >= pts[pts.length - 1][0]) d = MAXD;
  else for (let i = 0; i < pts.length - 1; i++) if (y >= pts[i][0] && y < pts[i + 1][0]) { const k = (y - pts[i][0]) / (pts[i + 1][0] - pts[i][0]); d = pts[i][1] + (pts[i + 1][1] - pts[i][1]) * k; }
  depth += (d - depth) * 0.25;
  hDepth.textContent = depth.toFixed(1);
  gauge.style.setProperty('--gs', (depth * 24).toFixed(1) + 'px');

  /* aktuelle Station */
  const near = secs.reduce((a, s) => Math.abs(s.depth - depth) < Math.abs(a.depth - depth) ? s : a, secs[0]);
  if (near !== cur) {
    cur = near;
    hNo.textContent = /^\d$/.test(near.key) ? near.key.padStart(2, '0') : '··'; hName.textContent = near.name;
  }
  /* Messwerte mit leichtem Rauschen */
  const tm = performance.now() / 1000;
  near.read.forEach((v, i) => { const j = v * 0.012 * Math.sin(tm * (1.3 + i) + i); R[i].textContent = (i === 0 ? (v + j).toFixed(1) : Math.round(v + j)).toString().replace('.', ','); });
  R[1].classList.toggle('alarm', near.key === '4');
  let done = 0;
  stations.forEach(s => { const on = s === near, ok = s.depth < depth - 0.3 || (s.t > 0.4); s.mark.classList.toggle('on', on); s.mark.classList.toggle('done', ok && !on); if (ok && s.key !== '0' && s.key !== '8') done++; });
  $('#hProto').textContent = `${Math.min(done, 7)} / 7 geprüft`;
  $('.hud-proto i').style.setProperty('--pp', (Math.min(done, 7) / 7 * 100) + '%');
  $('#hHint').style.opacity = y > 40 ? 0 : 1;

  /* Kapitel-Effekte */
  const S = k => secs.find(s => s.key === k);
  const f = $('#finding'), t2 = S('2').t;
  f.style.opacity = (smooth(0.2, 0.3, t2) * (1 - smooth(0.74, 0.84, t2))).toFixed(3);
  f.style.setProperty('--dash', (400 * (1 - smooth(0.24, 0.42, t2))).toFixed(0));
  if (!meterDone && S('3').t > 0.24 && S('3').t < 0.9) { meterDone = true; countUp($$('#meter dd')); }
  const t4 = S('4').t, co = $('#coline path');
  $('#coline').style.opacity = (smooth(0, 0.08, t4) * (1 - smooth(0.6, 0.8, t4)) * (S('4').ly ? 0.9 : 1)).toFixed(3);
  co.style.strokeDashoffset = (1 - smooth(0.02, 0.4, t4)).toFixed(3);
  $('#coN').textContent = Math.round(320 * smooth(0.15, 0.45, t4));
  if (s5.thermo) { const cut = thermoOverride ?? (100 - 100 * smooth(0.22, 0.6, s5.t)); s5.thermo.style.setProperty('--cut', cut.toFixed(1) + '%'); }
  const t6 = S('6').t;
  $$('#kin span').forEach((sp, k) => { const a = mob() ? 0.15 + k * 0.08 : 0.06 + k * 0.17, i = smooth(a, a + 0.06, t6), o = mob() ? 0 : k === 3 ? smooth(0.8, 0.88, t6) : smooth(a + 0.13, a + 0.19, t6); sp.style.opacity = (i * (1 - o)).toFixed(3); sp.style.transform = `translateX(${((1 - i) * -14 + o * 10).toFixed(2)}vw)`; });
  const t7 = S('7').t;
  $$('#proto li').forEach((li, k) => li.classList.toggle('ok', t7 > 0.18 + k * 0.06));
  const tg = $('#tags'); if (innerWidth > 820) tg.style.opacity = (smooth(0.2, 0.3, t7) * (1 - smooth(0.76, 0.86, t7))).toFixed(3);
  $$('#tags .tagc').forEach((c, k) => c.classList.toggle('on', innerWidth <= 820 || t7 > 0.3 + k * 0.1));

  if (tick3d) tick3d(depth, secs.reduce((a, s) => Math.max(a, s.ly ? s.vis : 0), 0), S('4').t, S('1').t);
}
function loop(ts) { lenis && lenis.raf(ts); frame(); requestAnimationFrame(loop); }

/* ---------- Schacht in WebGL ---------- */
let tick3d = null, resize3d = null;
async function initShaft() {
  let THREE;
  try { THREE = await import('three'); } catch (e) { return; }
  const cv = $('#shaft');
  let rd; try { rd = new THREE.WebGLRenderer({ canvas: cv, antialias: false, powerPreference: 'high-performance' }); } catch (e) { return; }
  rd.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  rd.outputColorSpace = THREE.SRGBColorSpace;
  const sc = new THREE.Scene(); sc.background = new THREE.Color(0x000000); sc.fog = new THREE.Fog(0x000000, 1.5, 16);
  const cam = new THREE.PerspectiveCamera(72, 1, 0.05, 40);
  /* Ziegel-Textur: Foto, sonst gezeichnet */
  const tex = await new Promise(res => {
    if (has('img', 'ks-t')) new THREE.TextureLoader().load('assets/img/ks-t-m.webp', res, undefined, () => res(null)); else res(null);
  }) || (() => {
    const c = document.createElement('canvas'); c.width = 512; c.height = 512; const x = c.getContext('2d');
    x.fillStyle = '#1a1310'; x.fillRect(0, 0, 512, 512);
    for (let r = 0; r < 16; r++) for (let k = -1; k < 5; k++) {
      const off = r % 2 ? 64 : 0, bx = k * 128 + off + 3, by = r * 32 + 3, l = 14 + Math.random() * 16;
      x.fillStyle = `hsl(${8 + Math.random() * 10},${30 + Math.random() * 20}%,${l}%)`; x.fillRect(bx, by, 122, 26);
      for (let n = 0; n < 40; n++) { x.fillStyle = `rgba(0,0,0,${Math.random() * 0.35})`; x.fillRect(bx + Math.random() * 122, by + Math.random() * 26, 2 + Math.random() * 8, 1 + Math.random() * 3); }
    }
    return new THREE.CanvasTexture(c);
  })();
  tex.colorSpace = THREE.SRGBColorSpace; tex.wrapS = tex.wrapT = THREE.MirroredRepeatWrapping; tex.anisotropy = 4;
  const W = 1.6, L = 150;
  tex.repeat.set(1, L / (tex.isCanvasTexture ? 1.8 : 0.9));
  const mat = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.95, metalness: 0, color: 0xd8cfc6 });
  const g = new THREE.PlaneGeometry(W, L);
  const tube = new THREE.Group(), Z0 = -L / 2 + 8;
  /* Boden, Decke, Wände – jede Fläche zeigt nach innen, Ziegellagen laufen als Ringe um den Schacht */
  [[[-Math.PI / 2, 0, 0], [0, -W / 2]], [[Math.PI / 2, 0, 0], [0, W / 2]], [[0, Math.PI / 2, Math.PI / 2], [-W / 2, 0]], [[0, -Math.PI / 2, -Math.PI / 2], [W / 2, 0]]].forEach(([r, [x, y]]) => {
    const m = new THREE.Mesh(g, mat); m.rotation.order = 'YXZ'; m.rotation.set(...r); m.position.set(x, y, Z0); tube.add(m);
  });
  sc.add(tube);
  const led = new THREE.PointLight(0xfff4ea, 6, 9, 1.6); sc.add(led);
  const red = new THREE.PointLight(0xff3b30, 0, 6, 1.5); sc.add(red);
  sc.add(new THREE.AmbientLight(0x221a16, 0.6));
  /* Ruß-Partikel */
  const dot = () => { const c = document.createElement('canvas'); c.width = c.height = 32; const x = c.getContext('2d'); const gr = x.createRadialGradient(16, 16, 0, 16, 16, 16); gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(.5, 'rgba(255,255,255,.5)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = gr; x.fillRect(0, 0, 32, 32); return new THREE.CanvasTexture(c); };
  const N = innerWidth < 820 ? 500 : 1100, pos = new Float32Array(N * 3), spd = new Float32Array(N);
  for (let i = 0; i < N; i++) { pos[i * 3] = (Math.random() - 0.5) * W * 0.95; pos[i * 3 + 1] = (Math.random() - 0.5) * W * 0.95; pos[i * 3 + 2] = -Math.random() * 12; spd[i] = 0.2 + Math.random(); }
  const pg = new THREE.BufferGeometry(); pg.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const pts = new THREE.Points(pg, new THREE.PointsMaterial({ color: 0xb9aea3, size: 0.007, map: dot(), alphaTest: 0.02, transparent: true, opacity: 0.8, depthWrite: false }));
  sc.add(pts);
  resize3d = () => { const w = innerWidth, h = innerHeight; rd.setSize(w, h, false); cam.aspect = w / h; cam.fov = w / h < 1 ? 92 : 72; cam.updateProjectionMatrix(); };
  resize3d();
  let mx = 0, my = 0; addEventListener('pointermove', e => { mx = e.clientX / innerWidth - 0.5; my = e.clientY / innerHeight - 0.5; }, { passive: true });
  let last = performance.now(), camZ = 4, prevZ = 4;
  tick3d = (d, cover, t4, t1) => {
    const now = performance.now(), dt = Math.min(0.05, (now - last) / 1000); last = now;
    if (cover > 0.995) return; /* Bild deckt alles ab: nicht rendern */
    const tz = 4 - d * 4.6;
    prevZ = camZ; camZ += (tz - camZ) * 0.12;
    const v = Math.abs(camZ - prevZ) / Math.max(dt, 0.001);
    const tt = now / 1000;
    cam.position.set(Math.sin(tt * 0.5) * 0.04 + mx * 0.12, Math.cos(tt * 0.4) * 0.04 - my * 0.12, camZ);
    cam.lookAt(mx * 0.3, -my * 0.3, camZ - 4);
    led.position.set(0, 0, camZ - 0.2); led.intensity = 6 + Math.sin(tt * 23) * 0.15;
    red.position.set(0.5, 0.2, camZ - 3); red.intensity = 8 * clamp(Math.sin(Math.PI * clamp(t4 / 0.7)));
    const pa = pg.attributes.position.array, boost = 1 + 3 * Math.sin(Math.PI * clamp(t1));
    for (let i = 0; i < N; i++) {
      pa[i * 3 + 2] += (spd[i] * 0.25 * boost + v * 0.02) * dt * 4; pa[i * 3] += Math.sin(tt + i) * 0.0006;
      if (pa[i * 3 + 2] > camZ + 0.3) pa[i * 3 + 2] = camZ - 2 - Math.random() * 10;
      if (pa[i * 3 + 2] < camZ - 12) pa[i * 3 + 2] = camZ - Math.random() * 2;
    }
    pg.attributes.position.needsUpdate = true;
    rd.render(sc, cam);
  };
}

/* ---------- Termin: nächste 5 Werktage ---------- */
const days = $('#days'), wd = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
for (let d = new Date(), n = 0; n < 5;) { d.setDate(d.getDate() + 1); if (d.getDay() % 6 === 0) continue; const v = `${wd[d.getDay()]} ${d.getDate()}.${d.getMonth() + 1}.`; days.insertAdjacentHTML('beforeend', `<label><input type="radio" name="tag" value="${v}" ${n ? '' : 'checked'}><span>${v}</span></label>`); n++; }

/* ---------- Formulare (Demo) ---------- */
const toast = (m) => { const t = $('#toast'); t.textContent = m; t.classList.add('on'); clearTimeout(toast.h); toast.h = setTimeout(() => t.classList.remove('on'), 4200); };
const check = f => { let ok = true; $$('input[required]', f).forEach(i => { const bad = !i.value.trim(); i.classList.toggle('bad', bad); if (bad && ok) { i.focus(); ok = false; } }); return ok; };
$('#slotForm').addEventListener('submit', e => { e.preventDefault(); if (!check(e.target)) return; const fd = new FormData(e.target); toast(`Demo: ${fd.get('tag')} · ${fd.get('win')} Uhr wäre angefragt. Es wurde nichts gesendet.`); e.target.reset(); });
$('#jobForm').addEventListener('submit', e => { e.preventDefault(); if (!check(e.target)) return; toast('Demo: Funkspruch wäre beim Meister. Es wurde nichts gesendet.'); e.target.reset(); });
let txT0 = 0; $('#jobForm').addEventListener('input', () => { if (!txT0) { txT0 = Date.now(); const iv = setInterval(() => { const s = Math.max(0, 45 - Math.round((Date.now() - txT0) / 1000)); $('#txTime').textContent = s ? `noch ≈ ${s} s` : 'gleich fertig'; if (!s) clearInterval(iv); }, 1000); } });
$('#coTest').addEventListener('click', () => { document.body.classList.remove('flash'); void document.body.offsetWidth; document.body.classList.add('flash'); toast('Piep, piep, piep – so warnt ein CO-Melder. (Demo)'); setTimeout(() => document.body.classList.remove('flash'), 1600); });

/* ---------- Impressum / Datenschutz ---------- */
const TXT = {
  imp: '<h3>Impressum</h3><p>Demo-Website. KEHRWERK ist ein erfundener Schornsteinfeger-Meisterbetrieb.</p><p>Bei einer echten Seite stehen hier Name, Anschrift, Kontakt, Handwerkskammer und Registereintrag des Betriebs.</p>',
  ds: '<h3>Datenschutz</h3><p>Diese Demo speichert und sendet keine Eingaben. Schriften werden von Google Fonts geladen, Bibliotheken von unpkg und jsDelivr.</p><p>Bei einer echten Seite steht hier die vollständige Datenschutzerklärung.</p>'
};
const modal = $('#modal');
document.addEventListener('click', e => { const b = e.target.closest('[data-modal]'); if (b) { $('#modalBody').innerHTML = TXT[b.dataset.modal]; modal.showModal(); } });
$('#modalX').addEventListener('click', () => modal.close());

/* Videos auf iOS anwerfen (erste Berührung) */
const prime = () => { secs.forEach(s => { if (s.vid && !s.loopVid) s.vid.play().then(() => s.vid.pause()).catch(() => {}); }); removeEventListener('touchstart', prime); };
addEventListener('touchstart', prime, { passive: true });

/* Aktion ab der ersten Sekunde: Kamera fährt beim Laden kurz an */
initShaft().finally(() => {
  requestAnimationFrame(loop);
  if (!reduce && scrollY < 5) setTimeout(() => { if (scrollY < 5) (lenis ? lenis.scrollTo(innerHeight * 0.18, { duration: 1.6 }) : scrollTo({ top: innerHeight * 0.18, behavior: 'smooth' })); }, 700);
});

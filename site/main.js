/* KEHRWERK Demo · Scroll-Filme, Haus-Check, Termin, Bewerbung */
(() => {
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const qs = new URLSearchParams(location.search);
const small = () => innerWidth < 700;

/* ?firma= persönlicher Link */
const firma = (qs.get('firma') || '').replace(/[<>]/g, '').slice(0, 60);
if (firma) $('#firma').textContent = ' · Musterseite für ' + firma;

/* ?farbe= Farbwelt testen */
const FARBEN = {
  rot: {}, // Standard: Ruß + Signalrot
  mint: { '--bg': '#141019', '--bg2': '#1b1622', '--bg3': '#241d2d', '--or': '#5ef2c2', '--or-rgb': '94,242,194', '--on-or': '#0b1712' },
  kobalt: { '--bg': '#f2efe9', '--bg2': '#e8e3da', '--bg3': '#ddd6cb', '--tx': '#111', '--mut': 'rgba(17,17,17,.62)', '--line': 'rgba(17,17,17,.14)', '--or': '#2747ff', '--or-rgb': '39,71,255' },
};
const f = FARBEN[qs.get('farbe')];
if (f) for (const k in f) document.documentElement.style.setProperty(k, f[k]);

/* Header + Menü */
const hd = $('#hd'), nav = $('#nav'), burger = $('#burger');
const setHd = () => hd.classList.toggle('solid', scrollY > 40);
burger.addEventListener('click', () => {
  const o = !nav.classList.contains('open');
  nav.classList.toggle('open', o); burger.setAttribute('aria-expanded', o);
  burger.setAttribute('aria-label', o ? 'Menü schließen' : 'Menü öffnen');
  document.body.style.overflow = o ? 'hidden' : '';
});
$$('a', nav).forEach(a => a.addEventListener('click', () => { if (nav.classList.contains('open')) burger.click(); }));

/* Toast */
const toast = (t) => { const el = $('#toast'); el.textContent = t; el.classList.add('on'); clearTimeout(toast.t); toast.t = setTimeout(() => el.classList.remove('on'), 3200); };
$$('[data-toast]').forEach(b => b.addEventListener('click', () => toast(b.dataset.toast)));
$$('[data-goto]').forEach(b => b.addEventListener('click', () => { $(b.dataset.goto).scrollIntoView({ behavior: 'smooth' }); toast(b.dataset.pick + ' im Termin vermerkt (Demo).'); }));

/* Video vorbereiten: Poster = Startbild, Quelle lazy */
const A = window.KW_ASSETS || { vid: [], img: [] };
function prep(v, vid, img) {
  if (A.img.includes(img)) v.poster = `assets/img/${img}${small() ? '-m' : ''}.webp`;
  if (A.vid.includes(vid)) v.dataset.src = `assets/vid/${vid}.mp4`;
  v.addEventListener('error', () => { v.removeAttribute('src'); v.load(); v.dataset.dead = 1; }, true);
}
const films = $$('.film').map(sec => {
  const multi = sec.classList.contains('film-multi');
  const vids = multi ? $$('video', sec) : [$('video', sec)];
  vids.forEach(v => prep(v, v.dataset.vid || sec.dataset.vid, v.dataset.img || sec.dataset.img));
  return { sec, multi, vids, cur: vids.map(() => 0), p: 0, ovs: $$('[data-a]', sec) };
}).filter(fm => {
  // Weder Bild noch Film vorhanden -> Kapitel ausblenden (nie Platzhalter zeigen)
  const ok = fm.vids.some(v => v.poster || v.dataset.src);
  if (!ok) fm.sec.style.display = 'none';
  return ok;
});
const io = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  $$('video', e.target).forEach(v => { if (!v.src && v.dataset.src && !v.dataset.dead) { v.src = v.dataset.src; v.load(); } });
}), { rootMargin: '150% 0px' });
films.forEach(fm => io.observe(fm.sec));

/* iOS: Videos einmal per Geste freischalten */
const unlock = () => { $$('video').forEach(v => { if (v.src) { const p = v.play(); p && p.then(() => v.pause()).catch(() => {}); } }); removeEventListener('touchstart', unlock); };
addEventListener('touchstart', unlock, { passive: true });

/* Hero läuft beim Laden kurz von selbst an (Aktion ab Sekunde 1) */
const hero = films[0]; let heroAuto = 0;
const hv = hero.vids[0];
hv.addEventListener('loadeddata', () => {
  const p = hv.play(); if (!p) return;
  p.then(() => setTimeout(() => { hv.pause(); heroAuto = hv.currentTime; hero.cur[0] = heroAuto; }, 1500)).catch(() => {});
}, { once: true });

/* Overlay-Einblendung nach Fortschritt */
function ovState(el, p) {
  const [a, b] = el.dataset.a.split(' ').map(Number);
  const r = (b - a) || 1, fi = r * .18;
  let o = a === 0 ? 1 : clamp((p - a) / fi);
  if (b < 1) o = Math.min(o, clamp((b - p) / fi));
  el.style.opacity = o;
  if (!el.classList.contains('passcard') && !el.classList.contains('depth')) el.style.transform = (el.classList.contains('ov-left') ? 'translateY(-50%) ' : '') + `translateY(${(1 - o) * 30}px)`;
  return o;
}
const isNarrow = () => innerWidth <= 900;

function scrub(v, i, fm, target) {
  if (!v.duration || v.readyState < 1) return;
  if (fm === hero && !hv.paused) return; // Auto-Anlauf nicht stören
  fm.cur[i] += (target - fm.cur[i]) * .22;
  if (Math.abs(v.currentTime - fm.cur[i]) > .016) { try { v.currentTime = fm.cur[i]; } catch (e) {} }
}

function frame() {
  const vh = innerHeight;
  for (const fm of films) {
    const r = fm.sec.getBoundingClientRect();
    if (r.bottom < -vh || r.top > vh * 2) continue;
    const p = clamp(-r.top / (r.height - vh));
    fm.p = p;
    if (!fm.multi) {
      const v = fm.vids[0], d = v.duration || 0;
      const t0 = fm === hero ? heroAuto : 0;
      scrub(v, 0, fm, t0 + p * Math.max(0, d * .985 - t0));
      fm.ovs.forEach(el => ovState(el, p));
      if (fm === hero) { const sm = $('.smoke', fm.sec); sm.style.setProperty('--blur', (clamp((p - .46) / .2, 0, 1) < 1 ? (1 - clamp((p - .46) / .2)) * 18 : 0) + 'px'); }
      const dp = $('.depth', fm.sec);
      if (dp) { dp.style.setProperty('--p', (p * 100) + '%'); $('.depth-n', dp).textContent = (p * 14).toFixed(1).replace('.', ',') + ' m'; }
      const pc = $('.passcard', fm.sec);
      if (pc) $$('li', pc).forEach((li, i) => li.classList.toggle('on', p > .34 + i * .12));
    } else {
      const n = fm.vids.length, seg = Math.min(n - 1, Math.floor(p * n)), loc = clamp(p * n - seg);
      fm.vids.forEach((v, i) => {
        v.classList.toggle('on', i === seg);
        if (i === seg) scrub(v, i, fm, loc * (v.duration || 0) * .985);
      });
      $$('.w', fm.sec).forEach((w, i) => {
        const on = i === seg;
        w.classList.toggle('on', on);
        const x = on ? (1 - clamp(loc / .22)) * 110 : (i < seg ? -130 : 120);
        w.style.setProperty('--x', x + '%');
        w.style.opacity = on ? clamp(loc / .12) * (isNarrow() ? .9 : 1) : 0;
      });
      $$('.step', fm.sec).forEach((s, i) => s.classList.toggle('on', i === seg && loc > .12));
      $$('.prog i', fm.sec).forEach((b, i) => b.style.setProperty('--p', i < seg ? 1 : i === seg ? loc : 0));
    }
  }
  /* Kinetik-Typo */
  const kin = $('.kin'), kr = kin.getBoundingClientRect();
  if (kr.top < vh && kr.bottom > 0) {
    const p = clamp(-kr.top / (kr.height - vh)), ws = $$('.kw', kin), n = ws.length;
    ws.forEach((w, i) => {
      const a = i / n, b = (i + 1) / n, l = (p - a) / (b - a);
      let o, y, s;
      if (l < 0) { o = 0; y = 90; s = 1.12; }
      else if (l < .35) { const k = l / .35; o = k; y = (1 - k) * 90; s = 1.12 - .12 * k; }
      else if (l < .75 || i === n - 1) { o = 1; y = 0; s = 1; }
      else { const k = (l - .75) / .25; o = 1 - k; y = -90 * k; s = 1 - .06 * k; }
      if (l > 1 && i < n - 1) o = 0;
      w.style.opacity = clamp(o); w.style.setProperty('--y', y + 'px'); w.style.setProperty('--s', s);
    });
  }
  /* CO-Glut */
  const co = $('#co'), cr = co.getBoundingClientRect();
  co.style.setProperty('--co', clamp(1 - Math.abs((cr.top + cr.height / 2) - vh / 2) / vh * 1.4).toFixed(3));
  setHd();
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

/* Glut-Partikel */
$$('canvas.embers').forEach(c => {
  const ctx = c.getContext('2d'), fast = c.classList.contains('fast');
  let W, H, ps = [];
  const size = () => { const d = Math.min(2, devicePixelRatio || 1); W = c.width = c.clientWidth * d; H = c.height = c.clientHeight * d; };
  size(); addEventListener('resize', size);
  const N = small() ? 40 : 90;
  const spawn = (init) => ({ x: Math.random() * W, y: init ? Math.random() * H : H + 10, r: (Math.random() * 1.8 + .6) * (devicePixelRatio || 1), v: (fast ? 6 : 1.2) + Math.random() * (fast ? 8 : 2.2), w: Math.random() * 6.28, l: Math.random() * .5 + .5 });
  for (let i = 0; i < N; i++) ps.push(spawn(true));
  let vis = false; new IntersectionObserver(e => vis = e[0].isIntersecting).observe(c);
  (function tick() {
    if (vis) {
      ctx.clearRect(0, 0, W, H);
      for (const p of ps) {
        p.y -= p.v; p.w += .03; p.x += Math.sin(p.w) * (fast ? .3 : .8);
        if (p.y < -20) Object.assign(p, spawn(false));
        const a = p.l * clamp(p.y / H + .15);
        ctx.fillStyle = `rgba(255,${120 + (p.r * 30 | 0)},40,${a})`;
        if (fast) { ctx.fillRect(p.x, p.y, p.r, p.v * 3); }
        else { ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.28); ctx.fill(); }
      }
    }
    requestAnimationFrame(tick);
  })();
});

/* Haus-Check */
const INFO = {
  kamin: ['Kaminofen', [['Kehren', 'Schornstein und Verbindungsstück rußfrei – vom Dach aus.'], ['Feuerstättenschau', 'Wir prüfen Ofen, Anschluss und Abstand zu Brennbarem.'], ['Brennholz-Tipp', 'Trocken heizt sauberer – wir zeigen, wie man das misst.']]],
  gas: ['Gas', [['Abgasmessung', 'CO, Sauerstoff und Abgasverlust – Werte direkt aufs Handy.'], ['Abgasleitung', 'Dicht und frei? Wir schauen nach.'], ['CO-Check', 'Wir beraten zum passenden CO-Melder.']]],
  oel: ['Öl', [['Abgasmessung', 'Messung an der Ölheizung mit Protokoll.'], ['Kehren', 'Abgasanlage reinigen, wo nötig.'], ['Heizungstausch?', 'Ehrliche Beratung, was danach passt.']]],
  pellets: ['Pellets', [['Kehren', 'Schornstein und Rauchrohr reinigen.'], ['Messung', 'Feinstaub und Abgaswerte im Blick.'], ['Anlagen-Check', 'Anschlüsse und Zuluft prüfen.']]],
  wp: ['Wärmepumpe', [['Kein Schornstein im Einsatz?', 'Dann prüfen wir, ob noch etwas zu tun ist – etwa beim Kaminofen nebenan.'], ['Rückbau & Abnahme', 'Wir beraten, was mit dem alten Schornstein passiert.'], ['Energieberatung', 'Wärmebild und klare Schritte für Ihr Haus.']]],
};
const house = $('.house'), result = $('#result'), sel = new Set();
$$('.ln', house).forEach(p => { try { p.style.setProperty('--dl', Math.ceil(p.getTotalLength()) + 1); } catch (e) {} });
new IntersectionObserver((e, o) => { if (e[0].isIntersecting) { house.classList.add('drawn'); o.disconnect(); } }, { threshold: .35 }).observe(house);
function renderCheck() {
  $$('.hot', house).forEach(g => g.classList.toggle('on', sel.has(g.dataset.k)));
  house.classList.toggle('any', sel.size > 0);
  if (!sel.size) { result.innerHTML = '<p class="r-hint">Tippen Sie an, womit Sie heizen – auch mehrere.</p>'; return; }
  let h = '';
  sel.forEach(k => { const [name, items] = INFO[k]; h += `<p class="kicker" style="margin:14px 0 4px">${name}</p>` + items.map(([b, t]) => `<div class="r-item"><b>${b}</b><p>${t}</p></div>`).join(''); });
  result.innerHTML = h + '<a class="btn r-cta" href="#termin">Termin dafür wählen</a>';
}
$$('.chip').forEach(c => c.addEventListener('click', () => {
  const k = c.dataset.k; sel.has(k) ? sel.delete(k) : sel.add(k);
  c.classList.toggle('on', sel.has(k)); c.setAttribute('aria-pressed', sel.has(k)); renderCheck();
}));

/* Termin: Tage, Karte, Formular */
const days = $('#days'), WD = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
let d = new Date(); d.setDate(d.getDate() + 1); let added = 0;
while (added < 12) {
  if (d.getDay() !== 0) {
    const b = document.createElement('button'); b.type = 'button'; b.className = 'day' + (added === 0 ? ' on' : '');
    b.innerHTML = `${WD[d.getDay()]}<b>${d.getDate()}</b>`; b.setAttribute('aria-label', d.toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long' }));
    b.addEventListener('click', () => { $$('.day', days).forEach(x => x.classList.remove('on')); b.classList.add('on'); });
    days.appendChild(b); added++;
  }
  d.setDate(d.getDate() + 1);
}
const route = $('#route'), van = $('#van'), eta = $('#eta'), RL = route.getTotalLength();
let vt = 0;
(function drive() {
  vt = (vt + .0016) % 1.25; const k = clamp(vt);
  const pt = route.getPointAtLength(k * RL), pt2 = route.getPointAtLength(Math.min(RL, k * RL + 2));
  const ang = Math.atan2(pt2.y - pt.y, pt2.x - pt.x) * 57.3;
  van.setAttribute('transform', `translate(${pt.x} ${pt.y}) rotate(${ang})`);
  eta.textContent = Math.max(0, Math.round((1 - k) * 12));
  requestAnimationFrame(drive);
})();
$('#tform').addEventListener('submit', e => {
  e.preventDefault();
  const day = $('.day.on', days), slot = $('input[name=slot]:checked').value;
  toast(`Demo: ${day ? day.getAttribute('aria-label') : ''}, ${slot} – nichts gesendet.`);
});

/* Karten-Reveal */
const rio = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); rio.unobserve(e.target); } }), { threshold: .3 });
$$('.c3').forEach(c => rio.observe(c));

/* Bewerben in 60 Sekunden */
const QS = [
  ['Schule fertig?', ['Ja', 'Bald']],
  ['Höhenangst?', ['Nein', 'Ein bisschen']],
  ['Ab wann?', ['Sofort', 'Zum Sommer']],
  ['Wie erreichen wir dich?', null],
];
const qc = $('#qcards'), pd = $('#pdots');
QS.slice().reverse().forEach(([q, a], ri) => {
  const i = QS.length - 1 - ri, el = document.createElement('div'); el.className = 'qc'; el.dataset.i = i;
  el.innerHTML = `<h4>${q}</h4>` + (a ? `<div class="qa">${a.map(x => `<button type="button">${x}</button>`).join('')}</div>`
    : `<input placeholder="Vorname" aria-label="Vorname"><input placeholder="Handy" inputmode="tel" aria-label="Handynummer"><div class="qa"><button type="button">Absenden</button></div>`);
  qc.appendChild(el);
});
QS.forEach((_, i) => pd.insertAdjacentHTML('beforeend', `<i class="${i ? '' : 'on'}"></i>`));
let step = 0, secs = 60, timer = 0;
const ringv = $('#ringv'), secsEl = $('#secs');
qc.addEventListener('click', e => {
  if (!e.target.matches('.qa button')) return;
  const card = e.target.closest('.qc'); card.classList.add('gone'); step++;
  $$('i', pd).forEach((d, i) => d.classList.toggle('on', i === Math.min(step, QS.length - 1)));
  if (step === QS.length) {
    clearInterval(timer);
    qc.insertAdjacentHTML('beforeend', `<div class="qc done"><h4>Danke!</h4><p style="margin-top:12px;color:var(--mut)">Geschafft in ${60 - secs} Sekunden. Wir melden uns.<br><br><small>Demo: Es wurde nichts gesendet.</small></p></div>`);
  }
});
new IntersectionObserver((e, o) => {
  if (!e[0].isIntersecting) return; o.disconnect();
  timer = setInterval(() => { secs = Math.max(0, secs - 1); secsEl.textContent = secs; ringv.style.setProperty('--o', (119.4 * (1 - secs / 60)).toFixed(1)); if (!secs) clearInterval(timer); }, 1000);
}, { threshold: .5 }).observe($('#phone'));

/* Bewertungs-Beispiele nacheinander */
const qq = $$('.q'); let qi = 0; qq[0].classList.add('on');
setInterval(() => { qq[qi].classList.remove('on'); qi = (qi + 1) % qq.length; qq[qi].classList.add('on'); }, 5600);

/* Impressum / Datenschutz */
const M = {
  imp: '<h3>Impressum</h3><p>Demo-Website. KEHRWERK ist ein erfundener Schornsteinfeger-Meisterbetrieb.</p><p>Bei einer echten Seite stehen hier Name, Anschrift, Kontakt, Handwerkskammer und Registereintrag des Betriebs.</p>',
  ds: '<h3>Datenschutz</h3><p>Diese Musterseite sendet keine Formulardaten und setzt keine Tracking-Cookies.</p><p>Schriften werden von Google Fonts geladen.</p>',
};
const modal = $('#modal');
$$('[data-modal]').forEach(b => b.addEventListener('click', () => { $('#mbody').innerHTML = M[b.dataset.modal]; modal.showModal(); }));
$('.m-x').addEventListener('click', () => modal.close());
modal.addEventListener('click', e => { if (e.target === modal) modal.close(); });
})();

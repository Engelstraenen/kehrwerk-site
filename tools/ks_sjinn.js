// KEHRWERK – sjinn GPT Image 2 (16:9, 4K, Unlimited · On, 0 credits), höchstens 2 eigene Aufträge gleichzeitig.
// Einspielen: Datei-Eingang #ksjs, (0,eval)(await ksjs.files[0].text()); dann SJ.jobs = [...]; SJ.run()
(() => {
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const old = window.SJ || {};
  if (old.runId) old.runId = -1;
  const SJ = window.SJ = { jobs: old.jobs || [], sent: old.sent || {}, log: [], limN: 0, runId: 0, MAX: 2 };
  SJ.say = m => { SJ.log.push(new Date().toLocaleTimeString() + ' ' + m); if (SJ.log.length > 50) SJ.log.shift(); };
  new MutationObserver(ms => { for (const m of ms) for (const n of m.addedNodes) if (n.textContent && /maximum limit of \d+ concurrent/i.test(n.textContent)) SJ.limN++; }).observe(document.body, { childList: true, subtree: true });
  const ta = () => [...document.querySelectorAll('textarea')].find(e => e.offsetParent);
  const bar = () => { let r = ta(); for (let i = 0; i < 8 && r && !/GPT Image 2/.test(r.innerText || ''); i++) r = r.parentElement; return r; };
  SJ.doneImg = id => [...document.querySelectorAll('img')].find(i => (i.alt || '').startsWith(id + ' ') && i.naturalWidth > 500);
  SJ.running = () => Object.keys(SJ.sent).filter(id => SJ.sent[id] === 'sent' && !SJ.doneImg(id));
  SJ.settingsOK = () => { const t = (bar() || {}).innerText || ''; return /GPT Image 2/.test(t) && /16:9/.test(t) && /4K/.test(t) && /Unlimited\s*·\s*On/.test(t) && /\b0 credits/.test(t); };
  SJ.submit = async (id, prompt) => {
    if (!SJ.settingsOK()) return 'settings';
    const t = ta(); const set = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value').set;
    t.focus(); set.call(t, ''); t.dispatchEvent(new Event('input', { bubbles: true })); await sleep(300);
    set.call(t, prompt); t.dispatchEvent(new Event('input', { bubbles: true })); await sleep(800);
    if (!SJ.settingsOK()) return 'settings';
    const b = [...document.querySelectorAll('button')].find(x => x.offsetParent && /^Generate/.test(x.innerText.trim()));
    if (!b || b.disabled) return 'btn';
    const l0 = SJ.limN; b.click(); await sleep(20000);
    if (SJ.limN > l0) return 'limit';
    return 'ok';
  };
  SJ.run = async () => {
    const my = SJ.runId = Date.now(); const alive = () => SJ.runId === my;
    for (const [id, prompt] of SJ.jobs) {
      if (SJ.sent[id]) continue;
      while (alive()) {
        while (alive() && SJ.running().length >= SJ.MAX) await sleep(60000);
        if (!alive()) return;
        const r = await SJ.submit(id, prompt); SJ.say(id + ' ' + r);
        if (r === 'ok') { SJ.sent[id] = 'sent'; SJ.sentAt = Object.assign(SJ.sentAt || {}, { [id]: Date.now() }); break; }
        await sleep(r === 'limit' ? 60000 : 90000);
      }
    }
    while (alive() && SJ.running().length) await sleep(60000);
    SJ.say('FERTIG');
  };
  /* Bild-URLs aller fertigen eigenen Bilder (für tools/ks_fetch.sh) */
  SJ.urls = () => Object.keys(SJ.sent).map(id => { const i = SJ.doneImg(id); return i ? id + ' ' + i.src : null; }).filter(Boolean);
  SJ.armCopy = () => { document.addEventListener('click', () => navigator.clipboard.writeText(SJ.urls().join('\n')), { once: true, capture: true }); return SJ.urls().map(x => x.split(' ')[0]); };
})();

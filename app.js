'use strict';

/* =========================================================
   Respira — calm, guided breathing exercises (PWA)
   ========================================================= */

const SQ = [[45, 195], [45, 45], [195, 45], [195, 195], [45, 195]];   // box: up, across, down, back
const TRI = [[120, 212], [40, 74], [200, 74], [120, 212]];            // 4-7-8: up, across, down

/* Phases: [text key, seconds, size from, size to, sound cue]. Colors: [light, dark]. Text is in lang.js. */
const EXERCISES = [
  {
    id: 'sigh',
    col: ['#8FB59A', '#9CC7A7'], col2: ['#7FB9AE', '#8FCBBE'], R: 96,
    ph: [['in', 2, .45, .85, 'in'], ['topUp', 1, .85, 1, null], ['outLong', 6, 1, .45, 'out']],
    durs: [60, 180, 300, 600], def: 300,
  },
  {
    id: '478',
    col: ['#A99BD3', '#B7A9E3'], col2: ['#C3A2CF', '#CFB0DB'], R: 40, path: TRI,
    ph: [['in', 4, .45, 1, 'in'], ['hold', 7, 1, 1, 'hold'], ['out', 8, 1, .45, 'out']],
    durs: [76, 152], def: 76, cycles: true,
  },
  {
    id: 'res',
    col: ['#7FB7B5', '#8CCBC8'], col2: ['#86A9CC', '#95BAD9'], R: 96,
    ph: [['in', 5, .45, 1, 'in'], ['out', 6, 1, .45, 'out']],
    durs: [180, 300, 600, 900], def: 600,
  },
  {
    id: 'box',
    col: ['#8EA9CF', '#9DB8E0'], col2: ['#86B0C9', '#93C0D8'], R: 62, path: SQ,
    ph: [['in', 4, .45, 1, 'in'], ['hold', 4, 1, 1, 'hold'], ['out', 4, 1, .45, 'out'], ['hold', 4, .45, .45, 'hold']],
    durs: [120, 240, 480], def: 240,
  },
  {
    id: 'belly',
    col: ['#E2B48F', '#E8C19E'], col2: ['#E5A396', '#EBB1A5'], R: 96, timer: true,
    durs: [60, 180, 300, 600], def: 180,
  },
];

const $ = id => document.getElementById(id);
const RING = 2 * Math.PI * 112;
const dark = matchMedia('(prefers-color-scheme: dark)');
const calm = matchMedia('(prefers-reduced-motion: reduce)');
const ease = x => -(Math.cos(Math.PI * x) - 1) / 2;
const fmt = s => { s = Math.max(0, Math.ceil(s)); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); };

/* ---------- Language: the saved choice, otherwise the phone's language ---------- */
let lang = /^it\b/i.test(navigator.language || '') ? 'it' : 'en';
try { const saved = localStorage.getItem('respira-lang'); if (saved === 'en' || saved === 'it') lang = saved; } catch (e) { /* storage blocked */ }
const t = (key, time) => T[lang][key].replace('{}', time);
const text = ex => T[lang].ex[ex.id];
const durLabel = (ex, s) => ex.cycles ? Math.round(s / cycleLen(ex)) + ' ' + t('cycles') : s / 60 + ' min';

function applyLang() {
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-t]').forEach(el => { el.innerHTML = t(el.dataset.t); });
  document.querySelectorAll('[data-t-label]').forEach(el => el.setAttribute('aria-label', t(el.dataset.tLabel)));
  document.querySelectorAll('[data-lang]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
  renderHome();
}
$('lang').addEventListener('click', e => {
  const b = e.target.closest('[data-lang]');
  if (!b) return;
  lang = b.dataset.lang;
  try { localStorage.setItem('respira-lang', lang); } catch (e) { /* storage blocked */ }
  applyLang();
});

/* ---------- Colors ---------- */
const rgb = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
const mix = (a, b, k) => { const A = rgb(a), B = rgb(b); return A.map((v, i) => v + (B[i] - v) * k); };
const css = c => 'rgb(' + c.map(Math.round).join(',') + ')';
const colOf = ex => ex.col[dark.matches ? 1 : 0];
const col2Of = ex => ex.col2[dark.matches ? 1 : 0];

/* A softly rippling circle: radius r, ripple clock wt, ripple strength amp. */
function blob(r, wt, amp) {
  let d = '';
  for (let j = 0; j <= 72; j++) {
    const th = j / 72 * 2 * Math.PI;
    const k = 1 + amp * (Math.sin(2 * th + wt * .9) * .5 + Math.sin(3 * th - wt * .7) * .35 + Math.sin(5 * th + wt * 1.3) * .15);
    d += (j ? 'L' : 'M') + (120 + Math.cos(th) * r * k).toFixed(1) + ' ' + (120 + Math.sin(th) * r * k).toFixed(1);
  }
  return d + 'Z';
}

/* ---------- Sound cues (synthesized, so they work offline) ---------- */
let soundOn = false;
try { soundOn = localStorage.getItem('respira-sound') === '1'; } catch (e) { /* storage blocked */ }
let ac = null;
function audio() {
  if (!ac) { const A = window.AudioContext || window.webkitAudioContext; if (A) ac = new A(); }
  if (ac && ac.state === 'suspended') ac.resume();
  return ac;
}
function tone(f, start, dur, peak) {
  const a = ac, o = a.createOscillator(), g = a.createGain();
  o.type = 'sine';
  o.frequency.setValueAtTime(f, start);
  g.gain.setValueAtTime(0, start);
  g.gain.linearRampToValueAtTime(peak, start + 0.03);
  g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
  o.connect(g).connect(a.destination);
  o.start(start);
  o.stop(start + dur + 0.05);
}
/* Singing bowl for in (higher) and out (lower), a soft tap for holds, a middle bowl to finish. */
function cue(kind) {
  if (!soundOn || !kind || !audio()) return;
  const t = ac.currentTime + 0.02;
  if (kind === 'hold') { tone(415, t, 0.35, 0.09); return; }
  const f = { in: 294, out: 220, end: 262 }[kind];
  [[1, .16, 3.2], [2.76, .05, 2.2], [5.4, .02, 1.4], [1.004, .08, 3.2]].forEach(([m, p, d]) => tone(f * m, t, d, p));
}

/* ---------- Keep the screen on during a session ---------- */
let wakeLock = null;
async function keepAwake(on) {
  try {
    if (on && !wakeLock && 'wakeLock' in navigator) {
      wakeLock = await navigator.wakeLock.request('screen');
      wakeLock.addEventListener('release', () => { wakeLock = null; });
    } else if (!on && wakeLock) { await wakeLock.release(); wakeLock = null; }
  } catch (e) { /* not supported or not allowed */ }
}

/* ---------- Home ---------- */
function renderHome() {
  $('list').innerHTML = EXERCISES.map(ex => {
    const c = colOf(ex), x = text(ex);
    return `<li><button class="card" data-id="${ex.id}">
      <svg viewBox="0 0 56 56" aria-hidden="true"><circle cx="28" cy="28" r="26" fill="${c}" fill-opacity=".2"/><circle cx="28" cy="28" r="17" fill="${c}"/></svg>
      <span><span class="name">${x.name}</span><span class="tag">${x.tag}</span><span class="meta">${x.pattern} · ${durLabel(ex, ex.def)}</span></span>
    </button></li>`;
  }).join('');
}
$('list').addEventListener('click', e => {
  const b = e.target.closest('[data-id]');
  if (b) openSession(EXERCISES.find(x => x.id === b.dataset.id));
});

/* ---------- Session ---------- */
const S = { ex: null, dur: 0, total: 0, t: 0, run: false, done: false, w: 0, last: 0, key: -1, raf: 0 };
const cycleLen = ex => ex.ph.reduce((a, p) => a + p[1], 0);

function openSession(ex) {
  Object.assign(S, { ex, dur: ex.def, t: 0, run: false, done: false, key: -1 });
  setTotal();
  $('s-name').textContent = text(ex).name;
  $('s-how').textContent = text(ex).how;
  $('halo').setAttribute('r', ex.R + (ex.path ? 4 : 0));
  const g = $('guide');
  if (ex.path) { g.setAttribute('d', 'M' + ex.path.map(p => p.join(' ')).join('L') + 'Z'); g.style.visibility = 'visible'; $('dot').style.visibility = 'visible'; }
  else { g.style.visibility = 'hidden'; $('dot').style.visibility = 'hidden'; }
  applyColors();
  renderDurations();
  $('home').hidden = true;
  $('session').hidden = false;
  scrollTo(0, 0);
  history.pushState({ session: ex.id }, '');
  S.last = performance.now();
  cancelAnimationFrame(S.raf);
  S.raf = requestAnimationFrame(loop);
}
function closeSession() {
  S.run = false;
  keepAwake(false);
  cancelAnimationFrame(S.raf);
  $('session').hidden = true;
  $('home').hidden = false;
}
/* Patterns always finish a whole cycle, so a session never ends mid-breath. */
function setTotal() {
  S.total = S.ex.timer ? S.dur : Math.ceil(S.dur / cycleLen(S.ex)) * cycleLen(S.ex);
}
function applyColors() {
  const c = colOf(S.ex);
  $('prog').setAttribute('stroke', c);
  $('dot').setAttribute('fill', c);
  $('guide').setAttribute('stroke', c + '99');
  $('session').style.setProperty('--accent', c);
}
function renderDurations() {
  $('durations').innerHTML = S.ex.durs.map(s =>
    `<button class="chip" data-s="${s}" aria-pressed="${s === S.dur}">${durLabel(S.ex, s)}</button>`).join('');
}
$('durations').addEventListener('click', e => {
  const b = e.target.closest('[data-s]');
  if (!b) return;
  S.dur = +b.dataset.s;
  setTotal();
  renderDurations();
});

function state() { return S.done ? 'done' : S.run ? 'run' : S.t > 0 ? 'paused' : 'idle'; }

function toggle() {
  audio(); // unlock sound on the first tap
  if (S.done) { S.t = 0; S.done = false; S.key = -1; }
  S.run = !S.run;
  keepAwake(S.run);
}
$('tap').addEventListener('click', toggle);
$('restart').addEventListener('click', () => { S.t = 0; S.run = false; S.key = -1; keepAwake(false); });
$('back').addEventListener('click', () => history.state && history.state.session ? history.back() : closeSession());
addEventListener('popstate', () => { if (!$('session').hidden) closeSession(); });

function paint(s) {
  const ex = S.ex, still = calm.matches;
  const base = mix(colOf(ex), col2Of(ex), still ? 0 : .5 + .5 * Math.sin(S.w * .25));
  const lift = Math.max(0, (s - .45) / .55) * .18;
  $('core').setAttribute('d', blob(ex.R * s, S.w, still ? 0 : S.run ? .045 : .03));
  $('core').setAttribute('fill', css(base.map(v => v + (255 - v) * lift)));
  $('halo').setAttribute('fill', css(base));
  $('halo').setAttribute('fill-opacity', dark.matches ? .2 : .16);
}

function ui(label, count) {
  const st = state(), small = !!S.ex.path;
  /* The shape can be very small on 4-7-8 and box, so those use symbols that always fit inside it. */
  $('hint').textContent = st === 'idle' ? t(small ? 'tap' : 'tapStart') : st === 'paused' ? (small ? '▶︎' : t('tapResume')) : st === 'done' ? (small ? '↻' : t('again')) : '';
  $('phase').textContent = st === 'paused' ? t('paused') : st === 'done' ? t('done') : st === 'run' ? label : '';
  $('count').textContent = st === 'run' || st === 'paused' ? count : '';
  $('left').textContent = st === 'idle' ? t('session', fmt(S.total)) : st === 'done' ? '' : S.ex.timer ? '' : t('left', fmt(S.total - S.t));
  $('durations').style.visibility = st === 'idle' || st === 'done' ? 'visible' : 'hidden';
  $('restart').textContent = st === 'paused' ? t('restart') : '';
  $('core').style.opacity = $('halo').style.opacity = st === 'paused' ? .55 : 1;
  $('tap').setAttribute('aria-label', t(st === 'run' ? 'pause' : st === 'paused' ? 'resume' : 'start'));
}

function draw() {
  const ex = S.ex;
  if (S.run && S.t >= S.total) {
    S.t = S.total; S.run = false; S.done = true;
    keepAwake(false);
    cue('end');
  }
  if (ex.timer) {
    if (S.run && S.key === -1) { S.key = 0; cue('in'); }
    paint(.72);
    $('prog').setAttribute('stroke-dasharray', (RING * Math.min(1, S.t / S.total)) + ' ' + RING);
    ui(t('belly'), t('left', fmt(S.total - S.t)));
    return;
  }
  const cyc = cycleLen(ex);
  let x = S.done ? 0 : S.t % cyc, i = 0;
  while (x >= ex.ph[i][1]) { x -= ex.ph[i][1]; i++; }
  const [label, d, a, b, kind] = ex.ph[i];
  const f = S.done ? 0 : x / d, s = a + (b - a) * ease(f);
  const key = Math.floor(S.t / cyc) * 10 + i;
  if (S.run && key !== S.key) { S.key = key; cue(kind); }
  paint(s);
  $('prog').setAttribute('stroke-dasharray', (RING * f) + ' ' + RING);
  if (ex.path) {
    const p0 = ex.path[i], p1 = ex.path[i + 1];
    $('dot').setAttribute('cx', p0[0] + (p1[0] - p0[0]) * f);
    $('dot').setAttribute('cy', p0[1] + (p1[1] - p0[1]) * f);
  }
  ui(t(label), Math.ceil(d - x) + ' s');
}

function loop(now) {
  const dt = Math.min(0.1, (now - S.last) / 1000);
  S.last = now;
  if (S.run) S.t += dt;
  S.w += dt * (S.run ? 1 : 0.4);
  draw();
  S.raf = requestAnimationFrame(loop);
}

/* Pause when the app goes to the background; the screen lock is released by the system then. */
document.addEventListener('visibilitychange', () => {
  if (document.hidden && S.run) { S.run = false; }
  if (!document.hidden) S.last = performance.now();
});

/* ---------- Sound toggle and info sheet ---------- */
function renderSound() { $('sound').setAttribute('aria-pressed', String(soundOn)); }
$('sound').addEventListener('click', () => {
  soundOn = !soundOn;
  try { localStorage.setItem('respira-sound', soundOn ? '1' : '0'); } catch (e) { /* storage blocked */ }
  renderSound();
  if (soundOn) { audio(); cue('end'); }
});
$('info-btn').addEventListener('click', () => $('info').showModal());
$('info-close').addEventListener('click', () => $('info').close());
$('info').addEventListener('click', e => { if (e.target === $('info')) $('info').close(); });

dark.addEventListener('change', () => { renderHome(); if (S.ex) applyColors(); });

applyLang();
renderSound();

/* ---------- Offline support ---------- */
if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
}

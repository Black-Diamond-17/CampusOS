
// CampusOS - Nigeria's Campus Super-App (MVP)
// Offline-first PWA. All data lives in localStorage. No backend needed to run.
'use strict';
const store = {
  get(k, fallback) { try { const v = localStorage.getItem('campusos_' + k); return v ? JSON.parse(v) : fallback; } catch (e) { return fallback; } },
  set(k, v) { try { localStorage.setItem('campusos_' + k, JSON.stringify(v)); } catch (e) {} }
};
let campusKey = store.get('campus', 'UNILAG');
let listings = store.get('listings', null);
if (!listings) { listings = SEED_LISTINGS.slice(); store.set('listings', listings); }
let events = store.get('events', null);
if (!events) { events = SEED_EVENTS.slice(); store.set('events', events); }
let timetable = store.get('timetable', null);
if (!timetable) { timetable = DEFAULT_TIMETABLE.slice(); store.set('timetable', timetable); }
let cbtHistory = store.get('cbtHistory', []);
let selectedPlace = null;
const $ = (id) => document.getElementById(id);
const fmtNaira = (n) => '\u20A6' + Number(n).toLocaleString('en-NG');
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function toast(msg) {
  const t = $('toast'); t.textContent = msg; t.classList.add('show');
  clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove('show'), 2500);
}
function waLink(phone, text) { return 'https://wa.me/' + String(phone || '').replace(/\D/g, '') + '?text=' + encodeURIComponent(text); }
const PIN_ICONS = { gate:'\u{1F6AA}', library:'\u{1F4DA}', lecture:'\u{1F393}', faculty:'\u{1F3EB}', food:'\u{1F37D}', hostel:'\u{1F3E0}', sports:'\u{1F3DF}', landmark:'\u{1F4CD}', office:'\u{1F3E2}' };
const DAY_ORDER = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
const VIEWS = ['home','map','timetable','market','events','cbt','cgpa'];
function navigate(name) {
  VIEWS.forEach(v => $('view-' + v).classList.toggle('active', v === name));
  document.querySelectorAll('#tabbar button').forEach(b => b.classList.toggle('active', b.dataset.nav === name));
  window.scrollTo({ top: 0 });
}
document.querySelectorAll('[data-nav]').forEach(b => b.addEventListener('click', () => navigate(b.dataset.nav)));
function campus() { return CAMPUSES[campusKey] || CAMPUSES.UNILAG; }
function initCampus() {
  const sel = $('campusSelect');
  sel.innerHTML = Object.keys(CAMPUSES).map(k => '<option value="' + k + '"' + (k===campusKey?' selected':'') + '>' + CAMPUSES[k].short + '</option>').join('');
  sel.addEventListener('change', () => { campusKey = sel.value; store.set('campus', campusKey); renderHome(); renderMap(); toast('Switched to ' + campus().name); });
}
function renderHome() {
  const c = campus();
  $('heroCampus').textContent = c.short + ' \u00B7 ' + c.city;
  const h = new Date().getHours();
  $('heroGreeting').textContent = (h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening') + ', student';
  $('statClasses').textContent = timetable.length;
  $('statListings').textContent = listings.filter(l => l.campus === campusKey).length;
  $('statEvents').textContent = events.length;
  $('statBest').textContent = cbtHistory.length ? Math.max(...cbtHistory.map(r => r.score)) + '%' : '\u2014';
  const todayName = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][new Date().getDay()];
  const today = timetable.filter(t => t.day === todayName).sort((a,b) => a.from.localeCompare(b.from));
  $('todayClasses').innerHTML = today.length
    ? today.map(t => '<div class="item"><h4>' + esc(t.code) + ' \u00B7 ' + esc(t.title) + '</h4><div class="meta">' + esc(t.from) + ' \u2013 ' + esc(t.to) + ' \u00B7 ' + esc(t.venue) + '</div></div>').join('')
    : '<div class="empty">No classes today.<br><button class="btn primary" id="homeAddTt" style="margin-top:10px">Add your timetable</button></div>';
  const b = $('homeAddTt'); if (b) b.addEventListener('click', () => navigate('timetable'));
}
function renderMap() {
  const c = campus();
  const svg = $('campusSvg');
  svg.innerHTML = '<rect width="100" height="100" fill="#dff0e6"/>'
    + '<path d="M0,85 L30,88 L52,52 L70,66 L100,80" stroke="#b9d9c7" stroke-width="3" fill="none"/>'
    + '<path d="M8,20 L46,74 M46,74 L82,80" stroke="#b9d9c7" stroke-width="2" fill="none"/>'
    + '<ellipse cx="18" cy="14" rx="16" ry="9" fill="#bfe3f0"/>'
    + '<text x="18" y="15" text-anchor="middle" font-size="3.2" fill="#2b6a8a">Lagoon</text>';
  const pins = $('mapPins');
  pins.innerHTML = c.places.map(p => '<button class="pin' + (selectedPlace && selectedPlace.id===p.id ? ' active':'') + '" data-id="' + p.id + '" style="left:' + p.x + '%;top:' + p.y + '%" title="' + esc(p.name) + '">' + (PIN_ICONS[p.type]||'\u{1F4CD}') + '</button>').join('');
  pins.querySelectorAll('.pin').forEach(b => b.addEventListener('click', () => selectPlace(b.dataset.id)));
  const opts = c.places.map(p => '<option value="' + p.id + '">' + esc(p.name) + '</option>').join('');
  $('routeFrom').innerHTML = opts; $('routeTo').innerHTML = opts;
  if (c.places[1]) $('routeTo').value = c.places[1].id;
  $('placesList').innerHTML = c.places.map(p => '<div class="item"><div class="row-between"><h4>' + (PIN_ICONS[p.type]||'\u{1F4CD}') + ' ' + esc(p.name) + '</h4><button class="btn" data-view="' + p.id + '" style="background:var(--green2);color:#fff;padding:7px 12px;font-size:12px">View</button></div><div class="meta">' + esc(p.note) + '</div></div>').join('');
  $('placesList').querySelectorAll('[data-view]').forEach(b => b.addEventListener('click', () => selectPlace(b.dataset.view)));
  $('routeResult').innerHTML = '<p class="muted">Pick two places above and tap Plan route.</p><button class="btn primary" id="routeBtn" style="margin-top:8px">Plan route</button>';
  $('routeBtn').addEventListener('click', planRoute);
}
function selectPlace(id) {
  const p = campus().places.find(x => x.id === id); if (!p) return;
  selectedPlace = p;
  document.querySelectorAll('.pin').forEach(el => el.classList.toggle('active', el.dataset.id === id));
  $('placeDetail').innerHTML = '<h3>' + (PIN_ICONS[p.type]||'\u{1F4CD}') + ' ' + esc(p.name) + '</h3><p class="muted" style="margin:0">' + esc(p.note) + '</p>';
  $('placeDetail').scrollIntoView({ behavior: 'smooth', block: 'center' });
}
function planRoute() {
  const from = campus().places.find(p => p.id === $('routeFrom').value);
  const to = campus().places.find(p => p.id === $('routeTo').value);
  if (!from || !to) return;
  if (from.id === to.id) { $('routeResult').innerHTML = '<p class="muted">You picked the same place twice.</p>'; return; }
  const dx = from.x - to.x, dy = from.y - to.y;
  const dist = Math.sqrt(dx*dx + dy*dy);
  const metres = Math.round(dist * 28);
  const mins = Math.max(1, Math.round(metres / 75));
  const dir = Math.abs(dx) > Math.abs(dy) ? (to.x > from.x ? 'east' : 'west') : (to.y > from.y ? 'south' : 'north');
  $('routeResult').innerHTML = '<h3>' + esc(from.name) + ' \u2192 ' + esc(to.name) + '</h3><p class="muted" style="margin:0">Walk <b style="color:var(--ink)">' + metres + ' m</b> heading roughly <b style="color:var(--ink)">' + dir + '</b>. About <b style="color:var(--ink)">' + mins + ' minute' + (mins===1?'':'s') + '</b> at normal walking pace.</p>';
}
function renderTimetable() {
  const sorted = timetable.slice().sort((a,b) => DAY_ORDER.indexOf(a.day) - DAY_ORDER.indexOf(b.day) || a.from.localeCompare(b.from));
  $('ttList').innerHTML = sorted.length ? sorted.map((t, i) => '<div class="item"><div class="row-between"><h4>' + esc(t.day) + ' \u00B7 ' + esc(t.code) + '</h4><button class="del-btn" data-i="' + i + '">\u{1F5D1}</button></div><div class="meta">' + esc(t.title) + ' \u00B7 ' + esc(t.from) + ' \u2013 ' + esc(t.to) + ' \u00B7 ' + esc(t.venue) + '</div></div>').join('') : '<div class="empty">No classes yet. Add yours above.</div>';
  $('ttList').querySelectorAll('.del-btn').forEach(b => b.addEventListener('click', () => {
    const t = sorted[Number(b.dataset.i)];
    timetable = timetable.filter(x => !(x.day===t.day && x.code===t.code && x.from===t.from));
    store.set('timetable', timetable); renderTimetable(); renderHome();
  }));
}
$('ttAddBtn').addEventListener('click', () => {
  const code = $('ttCode').value.trim(), title = $('ttTitle').value.trim();
  if (!code || !title) { toast('Add course code and title'); return; }
  timetable.push({ day: $('ttDay').value, code, title, venue: $('ttVenue').value.trim() || 'TBA', from: $('ttFrom').value, to: $('ttTo').value });
  store.set('timetable', timetable);
  $('ttCode').value = ''; $('ttTitle').value = ''; $('ttVenue').value = '';
  renderTimetable(); renderHome(); toast('Class added');
});
$('ttClearBtn').addEventListener('click', () => { timetable = []; store.set('timetable', timetable); renderTimetable(); renderHome(); toast('Timetable cleared'); });
function renderMarket() {
  const f = $('mkFilter').value, q = $('mkSearch').value.trim().toLowerCase();
  const mine = listings.filter(l => l.campus === campusKey).filter(l => !f || l.cat === f).filter(l => !q || l.title.toLowerCase().includes(q) || l.note.toLowerCase().includes(q));
  $('mkList').innerHTML = mine.length ? mine.map(l => '<div class="item"><span class="tag">' + esc(l.cat) + ' \u00B7 ' + esc(l.cond) + '</span><div class="row-between"><h4>' + esc(l.title) + '</h4><span class="price">' + fmtNaira(l.price) + '</span></div><div class="meta">Seller: ' + esc(l.seller) + ' \u00B7 ' + esc(l.note) + '</div>' + (l.phone ? '<a class="wa-btn" href="' + waLink(l.phone, 'Hello ' + l.seller + ', I saw your listing on CampusOS: ' + l.title + ' (' + fmtNaira(l.price) + '). Is it still available?') + '" target="_blank" rel="noopener">Chat on WhatsApp</a>' : '') + '</div>').join('') : '<div class="empty">No items here yet. Be the first to sell.</div>';
}
$('mkAddBtn').addEventListener('click', () => {
  const title = $('mkTitle').value.trim(), price = Number($('mkPrice').value);
  if (!title || !price || price <= 0) { toast('Add a title and a price'); return; }
  listings.push({ id: 'u' + Date.now(), title, price, cat: $('mkCat').value, cond: $('mkCond').value, note: $('mkNote').value.trim() || '\u2014', seller: 'You', campus: campusKey, phone: $('mkPhone').value.trim() });
  store.set('listings', listings);
  ['mkTitle','mkPrice','mkNote','mkPhone'].forEach(id => $(id).value = '');
  renderMarket(); renderHome(); toast('Item listed');
});
$('mkFilter').addEventListener('change', renderMarket);
$('mkSearch').addEventListener('input', renderMarket);
function renderEvents() {
  const sorted = events.slice().sort((a,b) => (a.date + a.time).localeCompare(b.date + b.time));
  $('evList').innerHTML = sorted.length ? sorted.map(e => '<div class="item"><span class="tag">' + esc(e.price) + '</span><div class="row-between"><h4>' + esc(e.title) + '</h4><button class="del-btn" data-id="' + e.id + '">\u{1F5D1}</button></div><div class="meta">' + esc(e.date) + ' \u00B7 ' + esc(e.time) + ' \u00B7 ' + esc(e.venue) + '<br>' + esc(e.desc) + '</div></div>').join('') : '<div class="empty">No events yet.</div>';
  $('evList').querySelectorAll('.del-btn').forEach(b => b.addEventListener('click', () => { events = events.filter(e => e.id !== b.dataset.id); store.set('events', events); renderEvents(); renderHome(); }));
}
$('evAddBtn').addEventListener('click', () => {
  const title = $('evTitle').value.trim(), date = $('evDate').value;
  if (!title || !date) { toast('Add event title and date'); return; }
  events.push({ id: 'u' + Date.now(), title, date, time: $('evTime').value || '18:00', venue: $('evVenue').value.trim() || 'TBA', desc: $('evDesc').value.trim() || '\u2014', price: 'Free' });
  store.set('events', events);
  ['evTitle','evDate','evVenue','evDesc'].forEach(id => $(id).value = '');
  renderEvents(); renderHome(); toast('Event added');
});
let qs = [], qi = 0, answers = [], timerId = null, secondsLeft = 0, perQ = 0;
function initCbtSubjects() {
  const subjects = [...new Set(QUESTIONS.map(q => q.subject))];
  $('cbtSubject').innerHTML = '<option value="">Mixed (all subjects)</option>' + subjects.map(s => '<option value="' + esc(s) + '">' + esc(s) + '</option>').join('');
  renderCbtHistory();
}
function renderCbtHistory() {
  $('cbtHistory').innerHTML = cbtHistory.length ? '<h3>Recent sessions</h3>' + cbtHistory.slice(-5).reverse().map(r => '<div class="item" style="margin:0 0 8px"><h4>' + esc(r.subject) + ' \u00B7 ' + esc(r.count) + ' questions</h4><div class="meta">' + esc(r.date) + ' \u00B7 Score: <b>' + r.score + '%</b> (' + r.correct + '/' + r.count + ')</div></div>').join('') : '';
}
function shuffle(a) { const x = a.slice(); for (let i = x.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); const t = x[i]; x[i] = x[j]; x[j] = t; } return x; }
$('cbtStartBtn').addEventListener('click', () => {
  const subj = $('cbtSubject').value, count = Number($('cbtCount').value), t = Number($('cbtTimer').value);
  let pool = subj ? QUESTIONS.filter(q => q.subject === subj) : QUESTIONS.slice();
  qs = shuffle(pool).slice(0, count);
  if (!qs.length) { toast('No questions for that subject yet'); return; }
  qi = 0; answers = new Array(qs.length).fill(null); perQ = t;
  $('cbtSetup').classList.add('hide'); $('cbtResult').classList.add('hide'); $('cbtRun').classList.remove('hide');
  showQuestion();
});
function showQuestion() {
  const q = qs[qi];
  $('cbtProgress').textContent = 'Q ' + (qi + 1) + '/' + qs.length;
  $('cbtSubjectTag').textContent = q.subject + ' \u00B7 ' + q.topic;
  $('cbtQuestion').textContent = q.q;
  $('cbtExplain').classList.add('hide');
  const locked = answers[qi] !== null && answers[qi] !== undefined;
  $('cbtOptions').innerHTML = q.options.map((o, i) => {
    let cls = 'opt';
    if (locked) { if (i === q.answer) cls += ' correct'; else if (i === answers[qi]) cls += ' wrong'; }
    return '<button class="' + cls + '" data-i="' + i + '"' + (locked ? ' disabled' : '') + '>' + String.fromCharCode(65+i) + '. ' + esc(o) + '</button>';
  }).join('');
  if (!locked) $('cbtOptions').querySelectorAll('.opt').forEach(b => b.addEventListener('click', () => pick(Number(b.dataset.i))));
  updateScoreLive(); startTimer();
}
function pick(i) {
  if (answers[qi] !== null && answers[qi] !== undefined) return;
  answers[qi] = i; clearInterval(timerId);
  const q = qs[qi];
  const exp = $('cbtExplain');
  exp.innerHTML = (i === q.answer ? '\u2705 Correct! ' : '\u274C Not quite. ') + esc(q.explain);
  exp.classList.remove('hide');
  showQuestion(); updateScoreLive();
}
function updateScoreLive() {
  const correct = answers.filter((a, i) => a === qs[i].answer).length;
  const done = answers.filter(a => a !== null && a !== undefined).length;
  $('cbtScoreLive').textContent = '\u2705 ' + correct + '/' + done;
  $('cbtBar').style.width = (done / qs.length * 100) + '%';
}
function startTimer() {
  clearInterval(timerId);
  if (!perQ) { $('cbtTimerLabel').textContent = 'No timer'; return; }
  secondsLeft = perQ;
  $('cbtTimerLabel').textContent = secondsLeft + 's';
  timerId = setInterval(() => {
    secondsLeft--;
    $('cbtTimerLabel').textContent = secondsLeft + 's';
    if (secondsLeft <= 0) {
      clearInterval(timerId);
      if (answers[qi] === null || answers[qi] === undefined) answers[qi] = -1;
      $('cbtExplain').innerHTML = 'Time up! ' + esc(qs[qi].explain);
      $('cbtExplain').classList.remove('hide');
      showQuestion(); updateScoreLive();
    }
  }, 1000);
}
$('cbtPrevBtn').addEventListener('click', () => { if (qi > 0) { qi--; showQuestion(); } });
$('cbtNextBtn').addEventListener('click', () => { if (qi < qs.length - 1) { qi++; showQuestion(); } else finishCbt(); });
$('cbtEndBtn').addEventListener('click', finishCbt);
function finishCbt() {
  clearInterval(timerId);
  const correct = answers.filter((a, i) => a === qs[i].answer).length;
  const score = Math.round(correct / qs.length * 100);
  const subj = $('cbtSubject').value || 'Mixed';
  cbtHistory.push({ subject: subj, count: qs.length, correct, score, date: new Date().toLocaleDateString('en-NG') });
  store.set('cbtHistory', cbtHistory);
  $('cbtRun').classList.add('hide');
  const r = $('cbtResult'); r.classList.remove('hide');
  r.innerHTML = '<div class="card result-big"><h3>' + (score >= 70 ? 'Great job!' : score >= 40 ? 'Keep practicing' : 'More practice needed') + '</h3><b>' + score + '%</b><p class="muted" style="text-align:center">' + correct + ' of ' + qs.length + ' correct \u00B7 ' + esc(subj) + '</p><h3 style="text-align:left;margin-top:18px">Review</h3>'
    + qs.map((q, i) => '<div class="item" style="margin:0 0 8px"><h4>' + (i+1) + '. ' + esc(q.q) + '</h4><div class="meta">Your answer: ' + (answers[i] >= 0 && answers[i] !== null && answers[i] !== undefined ? esc(q.options[answers[i]]) : '\u2014') + '<br>Correct: <b>' + esc(q.options[q.answer]) + '</b><br>' + esc(q.explain) + '</div></div>').join('')
    + '<button class="btn primary" id="cbtAgainBtn" style="width:100%;margin-top:10px">Practice again</button></div>';
  $('cbtAgainBtn').addEventListener('click', () => { $('cbtResult').classList.add('hide'); $('cbtSetup').classList.remove('hide'); renderCbtHistory(); });
  renderHome();
}
const GRADES = [['A',5],['B',4],['C',3],['D',2],['F',0]];
function cgpaRow() {
  const div = document.createElement('div');
  div.className = 'cgpa-row';
  div.innerHTML = '<input placeholder="Course" class="g-code"><select class="g-grade">' + GRADES.map(g => '<option value="' + g[1] + '">' + g[0] + ' (' + g[1] + ')</option>').join('') + '</select><input type="number" min="0" max="6" value="3" class="g-units"><button class="del-btn">\u2715</button>';
  div.querySelector('.del-btn').addEventListener('click', () => div.remove());
  $('cgpaRows').appendChild(div);
}
$('cgpaAddBtn').addEventListener('click', cgpaRow);
$('cgpaCalcBtn').addEventListener('click', () => {
  const rows = [...document.querySelectorAll('.cgpa-row')];
  let points = 0, units = 0;
  rows.forEach(rw => { const u = Number(rw.querySelector('.g-units').value) || 0; const g = Number(rw.querySelector('.g-grade').value); points += g * u; units += u; });
  const prevGpa = Number($('cgpaPrev').value), prevUnits = Number($('cgpaPrevUnits').value);
  const gpa = units ? points / units : 0;
  const cgpa = (prevGpa && prevUnits) ? (prevGpa * prevUnits + points) / (prevUnits + units) : gpa;
  const cls = cgpa >= 4.5 ? 'First Class' : cgpa >= 3.5 ? 'Second Class Upper' : cgpa >= 2.4 ? 'Second Class Lower' : cgpa >= 1.5 ? 'Third Class' : 'Pass \u2014 keep pushing';
  const r = $('cgpaResult'); r.classList.remove('hide');
  r.innerHTML = '<div class="result-big"><p class="muted">Semester GPA: <b>' + gpa.toFixed(2) + '</b> (' + units + ' units)' + (prevGpa && prevUnits ? '<br>Overall CGPA:<br>' : '') + '</p><b>' + cgpa.toFixed(2) + '</b><p class="muted">' + cls + '</p></div>';
});
let deferredPrompt = null;
window.addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); deferredPrompt = e; $('installBtn').classList.remove('hide'); });
$('installBtn').addEventListener('click', async () => { if (deferredPrompt) { deferredPrompt.prompt(); await deferredPrompt.userChoice; deferredPrompt = null; $('installBtn').classList.add('hide'); } });
if ('serviceWorker' in navigator) { window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {})); }
initCampus(); renderHome(); renderMap(); renderTimetable(); renderMarket(); renderEvents(); initCbtSubjects(); cgpaRow(); cgpaRow(); cgpaRow();

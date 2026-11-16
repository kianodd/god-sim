// v5 harness: load the REAL app.js in a vm with DOM stubs, verify v5 items
// (mobile CSS hide, tribe spacing, distance-driven war appetite, land
// ownership, bigger world, food icon, less idling) + the v4 regressions.
// Run: node ~/workspace/god-sim/v4-harness.js   (exit 1 on any failure)
const fs = require('fs'), vm = require('vm');
const SRC = fs.readFileSync(process.env.SRC || '/home/hatch/workspace/god-sim/app.js', 'utf8');

function makeCtx(seed, src) {
  let s = seed >>> 0;
  const rnd = () => {
    s |= 0; s = s + 0x6D2B79F5 | 0;
    let t = Math.imul(s ^ s >>> 15, 1 | s);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
  const ctxProxy = new Proxy({}, {
    get: (t, k) => {
      if (k === 'createLinearGradient' || k === 'createRadialGradient') return () => ({ addColorStop() {} });
      if (k === 'measureText') return () => ({ width: 10 });
      if (k === 'getLineDash') return () => [];
      if (typeof k === 'string') return () => {};
      return undefined;
    },
    set: () => true
  });
  const els = {};
  for (const m of fs.readFileSync('/home/hatch/workspace/god-sim/index.html', 'utf8')
    .matchAll(/<[^>]*\bid="([\w-]+)"[^>]*\bhidden\b[^>]*>/g)) {
    els[m[1]] = makeEl(m[1]); els[m[1]].hidden = true;
  }
  function makeEl(id) {
    const el = {
      id: id || '', hidden: false, textContent: '', innerHTML: '', value: '', style: {}, dataset: {}, children: [],
      _listeners: {},
      classList: { add() {}, remove() {}, toggle() {}, contains: () => false },
      addEventListener(type, fn) { (this._listeners[type] = this._listeners[type] || []).push(fn); },
      removeEventListener() {},
      appendChild(c) { c._parent = this; this.children.push(c); }, prepend(c) { c._parent = this; this.children.unshift(c); },
      remove() { if (this._parent) { const i = this._parent.children.indexOf(this); if (i >= 0) this._parent.children.splice(i, 1); } },
      setAttribute() {}, getAttribute: () => null,
      get lastChild() { return this.children[this.children.length - 1]; },
      getContext: () => ctxProxy,
      getBoundingClientRect: () => ({ width: 800, height: 600, left: 0, top: 0, right: 800, bottom: 600 }),
      querySelector: () => makeEl(), querySelectorAll: () => [], click() {}, focus() {},
      width: 300, height: 150,
      dispatch(type, ev) { (this._listeners[type] || []).forEach(fn => fn(ev || { target: this, preventDefault() {} })); }
    };
    return el;
  }
  const sandbox = {
    console,
    Math: Object.assign(Object.create(Math), Math, { random: rnd }),
    performance: { now: () => Date.now() },
    requestAnimationFrame: () => {},
    localStorage: { _s: {}, getItem(k) { return this._s[k] ?? null; }, setItem(k, v) { this._s[k] = String(v); }, removeItem(k) { delete this._s[k]; } },
    navigator: { clipboard: { writeText: async () => {} } },
    URL: { createObjectURL: () => '', revokeObjectURL() {} },
    Blob: class {},
    setTimeout, clearTimeout, setInterval, clearInterval,
    addEventListener() {}, removeEventListener() {},
    confirm() { return true; },
  };
  sandbox.window = sandbox;
  sandbox.document = {
    getElementById: id => els[id] || (els[id] = makeEl(id)),
    querySelector: sel => {
      const m = /^#([\w-]+)$/.exec(sel);
      if (m) return els[m[1]] || (els[m[1]] = makeEl(m[1]));
      return makeEl();
    },
    querySelectorAll: () => [],
    createElement: () => makeEl(), createTextNode: (t) => ({ textContent: t }), addEventListener() {}, body: makeEl('body'), documentElement: { style: {} }
  };
  const ctx = vm.createContext(sandbox);
  vm.runInContext(src || SRC, ctx, { filename: 'app.js' });
  // capture logEvent texts for assertions about visible spending/diplomacy
  vm.runInContext(`S.__log=[]; const __origLogEvent=logEvent; logEvent=function(t,k){ S.__log.push(String(t)); return __origLogEvent(t,k); };`, ctx);
  return { ctx, sandbox, els };
}

const ev = (ctx, expr) => vm.runInContext(expr, ctx);
let pass = 0, fail = 0;
function check(label, cond) { console.log((cond ? 'PASS' : 'FAIL') + ' — ' + label); cond ? pass++ : fail++; }
const DT = 1 / 20;
function runDays(ctx, days) { const n = Math.round(days * 60 / DT); for (let i = 0; i < n; i++) ev(ctx, `tick(${DT})`); }
// fraction of adult agents whose position barely moves over `seconds` sim-seconds
function stuckFrac(ctx, seconds = 30) {
  const snap = ev(ctx, `S.agents.filter(a=>!a.dead&&a.age>=0.4).map(a=>[a.id,a.x,a.y])`);
  const n = Math.round(seconds / DT);
  for (let i = 0; i < n; i++) ev(ctx, `tick(${DT})`);
  return ev(ctx, `(()=>{const snap=${JSON.stringify(snap)}; let stuck=0, total=0; for(const [id,x,y] of snap){ const a=S.agents.find(z=>z.id===id); if(!a||a.dead) continue; total++; if(Math.hypot(a.x-x,a.y-y)<5) stuck++; } return {stuck,total,frac:total?+(stuck/total).toFixed(3):0}; })()`);
}
// ensure >=2 tribes exist (run up to 3 days); returns their ids
function ensureTribes(ctx, n = 2) {
  for (let d = 0; d < 3; d++) { if (ev(ctx, `S.tribes.length`) >= n) break; runDays(ctx, 1); }
  return ev(ctx, `S.tribes.map(t=>t.id)`);
}
// give a tribe completed buildings of given types at its home
function giveBuildings(ctx, tribeId, types) {
  ev(ctx, `(()=>{const t=tribeById(${tribeId}); t.stock.wood=999; t.stock.stone=999; for(const tc of TECHS) t.techs[tc.id]=true; ${types.map((ty, i) => `queueBuilding(t,'${ty}',t.home.x+${(i % 5) * 40 - 80},t.home.y+${Math.floor(i / 5) * 40 - 40},true)`).join(';')}; for(const b of S.buildings) if(b.tribeId===${tribeId}) b.progress=100; })()`);
}
function setWarriors(ctx, tribeId, n) {
  ev(ctx, `(()=>{const ms=tribeMembers(tribeById(${tribeId})); let c=0; for(const a of ms){ if(c>=${n}) break; if(a.age>=0.4){ a.job='warrior'; a.equip={weapon:'club',shield:null,armor:null}; c++; } } })()`);
}
function setRelations(ctx, id1, id2, v) {
  ev(ctx, `(()=>{const a=tribeById(${id1}), b=tribeById(${id2}); a.relations[b.id]=${v}; b.relations[a.id]=${v}; })()`);
}


// ============ v27: نمای ایزومتریک + بازگشت خودکار به دوبعدی ============
console.log('\n--- v27. isometric view / 2D fallback ---');
const { ctx, sandbox, els } = makeCtx(12345);
const SRC27 = fs.readFileSync('/home/hatch/workspace/god-sim/app.js', 'utf8');
const ISO27 = fs.readFileSync('/home/hatch/workspace/god-sim/iso3d.js', 'utf8');

// 1. پیش‌فرض در کد 'iso' است (در هارنس — بدون Three.js — شروع خودکار دوبعدی می‌شود)
check('default view literal is iso', /view:\s*'iso'/.test(SRC27));
check('startup forces 2D fallback without Iso3D (S.view==2d)', ev(ctx, `S.view`) === '2d');
check('canvas3d element exists and is hidden in 2D mode', ev(ctx, `!!document.getElementById('world3d') && document.getElementById('world3d').style.display==='none'`));
check('2D canvas visible in 2D mode', ev(ctx, `document.getElementById('world').style.display==='block'`));

// 2. توابع نما وجود دارند و محافظ‌ها درست کار می‌کنند
check('isoDraw() returns false without Iso3D', ev(ctx, `isoDraw()`) === false);
check('isoPick() returns null without Iso3D', ev(ctx, `isoPick(100,100)`) === null);
check('switchView(iso) refuses without Iso3D and stays 2d', ev(ctx, `switchView('iso'); S.view`) === '2d');
check('switchView(2d) persists preference to localStorage', ev(ctx, `switchView('2d'); localStorage.getItem('godsim-view')`) === '2d');
check('updateViewBtn labels the 2D state', ev(ctx, `updateViewBtn(); document.getElementById('btnView').innerHTML.includes('دوبعدی')`));
check('applyView keeps 2D when Iso3D is absent', ev(ctx, `S.view='iso'; applyView(); S.view`) === '2d');

// 3. آیکون‌ها و راهنما
check('ICONS.cube exists', ev(ctx, `typeof ICONS.cube==='string' && ICONS.cube.length>10`));
check('ICONS.grid exists', ev(ctx, `typeof ICONS.grid==='string' && ICONS.grid.length>10`));
check('icon(cube) renders an svg (not the star fallback)', ev(ctx, `icon('cube').includes('<svg') && !icon('cube').includes('M12 2l2.5 6.5')`));
check('GUIDE has the isometric entry', ev(ctx, `GUIDE.some(g=>g.t==='نمای ایزومتریک' && g.ic==='cube')`));

// 4. ورودی روی هر دو بوم بسته شده است
check('pointer handlers bound on 2D canvas', (els.world._listeners.pointerdown || []).length >= 1 && (els.world._listeners.pointerup || []).length >= 1 && (els.world._listeners.wheel || []).length >= 1);
check('pointer handlers bound on 3D canvas', (els.world3d._listeners.pointerdown || []).length >= 1 && (els.world3d._listeners.pointerup || []).length >= 1 && (els.world3d._listeners.wheel || []).length >= 1);

// 5. draw() در حالت دوبعدی بدون خطا اجرا می‌شود
check('draw() runs cleanly in 2D mode (5 frames)', ev(ctx, `try{ for(let i=0;i<5;i++) draw(); true; }catch(e){ false; }`));

// 6. رگرسیون شبیه‌سازی (نقطه‌ای از v5): ۲ روز اجرا — تولد هست، قبیله شکل می‌گیرد، جمعیت پایدار
runDays(ctx, 2);
check('2-day smoke: births happened', ev(ctx, `S.births`) > 0);
check('2-day smoke: tribes formed', ev(ctx, `S.tribes.length`) >= 1);
check('2-day smoke: population alive and sane', ev(ctx, `S.agents.filter(a=>!a.dead).length`) > 50);
check('2-day smoke: houses exist', ev(ctx, `S.buildings.some(b=>b.type==='house')`));

// 7. iso3d.js: ساختار کلی — بدون ارجاع به منطق شبیه‌سازی، فقط رندر
check('iso3d.js exposes window.Iso3D with render/screenToWorld/available', /window\.Iso3D\s*=\s*\{[^}]*render[^}]*screenToWorld[^}]*available/.test(ISO27));
check('iso3d.js uses InstancedMesh for tiles/agents/trees', /new THREE\.InstancedMesh/.test(ISO27) && (ISO27.match(/makeInstanced\(/g) || []).length >= 10);
check('iso3d.js uses an orthographic camera', /OrthographicCamera/.test(ISO27));
check('iso3d.js has no shadows enabled', !/castShadow\s*=\s*true|shadowMap\.enabled\s*=\s*true/.test(ISO27));
check('iso3d.js guards THREE absence (typeof THREE check)', /typeof THREE/.test(ISO27));
check('iso3d.js decays particles itself (2D draw is bypassed in iso mode)', /p\.life-=0\.016/.test(ISO27));
check('iso3d.js has no emoji', !/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u.test(ISO27));
check('app.js has no emoji introduced by v27 edits', (()=>{ const m=SRC27.match(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu)||[]; return m.every(c=>['\u2640','\u2642','\u2715','\u2713'].includes(c)) && !SRC27.split('\n').some(l=>l.includes('v27')&&/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u.test(l)); })());

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);

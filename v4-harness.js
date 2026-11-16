// v4 harness: load the REAL app.js in a vm with DOM stubs, verify war,
// diplomacy, economy, clickable buildings, trees, trade and job shops.
// Run: node ~/workspace/god-sim/v4-harness.js   (exit 1 on any failure)
const fs = require('fs'), vm = require('vm');
const SRC = fs.readFileSync(process.env.SRC || '/home/hatch/workspace/god-sim/app.js', 'utf8');

function makeCtx(seed) {
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
  vm.runInContext(SRC, ctx, { filename: 'app.js' });
  // capture logEvent texts for assertions about visible spending/diplomacy
  vm.runInContext(`S.__log=[]; const __origLogEvent=logEvent; logEvent=function(t,k){ S.__log.push(String(t)); return __origLogEvent(t,k); };`, ctx);
  return { ctx, sandbox, els };
}

const ev = (ctx, expr) => vm.runInContext(expr, ctx);
let pass = 0, fail = 0;
function check(label, cond) { console.log((cond ? 'PASS' : 'FAIL') + ' — ' + label); cond ? pass++ : fail++; }
const DT = 1 / 20;
function runDays(ctx, days) { const n = Math.round(days * 60 / DT); for (let i = 0; i < n; i++) ev(ctx, `tick(${DT})`); }
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

// ============ A. alliances ============
console.log('\n--- A. alliances ---');
{
  const { ctx } = makeCtx(777);
  const ids = ensureTribes(ctx, 2);
  check('at least 2 tribes formed', ids.length >= 2);
  const [a, b] = ids;
  setRelations(ctx, a, b, 80);
  const allied = ev(ctx, `(()=>{const t1=tribeById(${a}), t2=tribeById(${b}); return tryAlly(t1,t2); })()`);
  check('tryAlly succeeds at relations 80', allied === true);
  check('alliance is mutual', ev(ctx, `tribeById(${a}).allies.includes(${b}) && tribeById(${b}).allies.includes(${a})`));
  check('declareWar between allies is blocked', ev(ctx, `(()=>{const t1=tribeById(${a}), t2=tribeById(${b}); t1.relations[t2.id]=-80; t2.relations[t1.id]=-80; return declareWar(t1,t2,false); })()`) === null);
  check('warTarget skips allies even at relations -80', ev(ctx, `(()=>{const w=warTarget(tribeById(${a})); return w===null || w.id!==${b}; })()`));
  check('tryAlly fails below relations 60', ev(ctx, `(()=>{const t1=tribeById(${a}), t2=S.tribes.find(t=>t.id!==${a}&&t.id!==${b}); if(!t2) return true; t1.relations[t2.id]=30; t2.relations[t1.id]=30; return !tryAlly(t1,t2); })()`));
}

// ============ B. siege + dissolve/occupy ============
console.log('\n--- B. siege + dissolve/occupy ---');
{
  const { ctx } = makeCtx(888);
  const ids = ensureTribes(ctx, 2);
  const [a, b] = ids;
  giveBuildings(ctx, b, ['house', 'house', 'farm', 'wall', 'market']);
  setWarriors(ctx, a, 4); setWarriors(ctx, b, 4);
  setRelations(ctx, a, b, -80);
  const war = ev(ctx, `declareWar(tribeById(${a}),tribeById(${b}),false)`);
  check('declareWar succeeds with 1+ warriors per side', war !== null);
  // unit: attack a building directly
  const before = ev(ctx, `(()=>{const bb=S.buildings.find(x=>x.tribeId===${b}&&x.type==='house'); const w=tribeMembers(tribeById(${a})).find(x=>x.job==='warrior'); w.x=bb.x+10; w.y=bb.y; for(let i=0;i<6;i++) attackBuilding(w,bb,1); return {hp:bb.hp, gone:!S.buildings.includes(bb)}; })()`);
  console.log('  building after 6s of siege:', JSON.stringify(before));
  check('siege damages building HP', before.hp < 60 || before.gone === true);
  // destroy it fully and check family handling + collapse path
  const destroyed = ev(ctx, `(()=>{let bb=S.buildings.find(x=>x.tribeId===${b}&&x.type==='house'); if(!bb) return {gone:true}; const w=tribeMembers(tribeById(${a})).find(x=>x.job==='warrior'); let i=0; while(S.buildings.includes(bb)&&i++<30) attackBuilding(w,bb,1); return {gone:!S.buildings.includes(bb)}; })()`);
  check('building can be destroyed by siege', destroyed.gone === true);
  // force collapse: kill all but 2 members of the loser
  const res = ev(ctx, `(()=>{const loser=tribeById(${b}); const win=tribeById(${a});
    const mem=tribeMembers(loser); for(let i=2;i<mem.length;i++) killAgent(mem[i],'جنگ');
    const winWoodBefore=win.stock.wood, winFoodBefore=win.stock.food;
    const loserBlds=S.buildings.filter(x=>x.tribeId===${b}).length;
    checkTribeCollapse(loser,win);
    return {loserGone:!S.tribes.some(t=>t.id===${b}), membersNow:tribeMembers(win).length, woodGain:win.stock.wood-winWoodBefore, foodGain:win.stock.food-winFoodBefore, bldsTaken:S.buildings.filter(x=>x.tribeId===${a}).length, loserBlds}; })()`);
  console.log('  dissolve result:', JSON.stringify(res));
  check('loser tribe dissolves', res.loserGone === true);
  check('survivors join the winner', res.membersNow >= 2);
  check('winner loots the stockpile', res.woodGain > 0 || res.foodGain > 0);
  check('winner occupies the land (buildings transfer)', res.bldsTaken >= res.loserBlds && res.loserBlds > 0);
}

// ============ C. peace + tribute + truce ============
console.log('\n--- C. peace + tribute + truce ---');
{
  const { ctx } = makeCtx(999);
  const ids = ensureTribes(ctx, 2);
  const [a, b] = ids;
  setWarriors(ctx, a, 3); setWarriors(ctx, b, 3);
  setRelations(ctx, a, b, -80);
  ev(ctx, `declareWar(tribeById(${a}),tribeById(${b}),false)`);
  check('war started', ev(ctx, `S.battles.length`) === 1);
  ev(ctx, `offerPeace(tribeById(${a}),tribeById(${b}))`);
  check('offerPeace ends all battles', ev(ctx, `S.battles.length`) === 0);
  check('peace sets relations to +10', ev(ctx, `tribeById(${a}).relations[${b}]`) === 10);
  check('peace sets a 3-day truce', ev(ctx, `tribeById(${a}).truce[${b}]`) === ev(ctx, `S.day`) + 3);
  check('declareWar blocked during truce', ev(ctx, `declareWar(tribeById(${a}),tribeById(${b}),false)`) === null);
  // tribute path
  ev(ctx, `(()=>{const t1=tribeById(${a}), t2=tribeById(${b}); t1.truce={}; t2.truce={}; t1.relations[t2.id]=-80; t2.relations[t1.id]=-80; })()`);
  ev(ctx, `declareWar(tribeById(${a}),tribeById(${b}),false)`);
  ev(ctx, `tribeById(${a}).stock.coins=20`);
  const trib = ev(ctx, `payTribute(tribeById(${a}),tribeById(${b}))`);
  check('payTribute ends the war', trib === true && ev(ctx, `S.battles.length`) === 0);
  check('tribute moves 15 coins', ev(ctx, `tribeById(${a}).stock.coins`) === 5 && ev(ctx, `tribeById(${b}).stock.coins`) >= 15);
  check('tribute also sets a truce', ev(ctx, `tribeById(${a}).truce[${b}]`) > ev(ctx, `S.day`));
}

// ============ D. 10-day economy run + F. trees + H. v3 invariants ============
console.log('\n--- D/F/H. 10-day run ---');
{
  const { ctx } = makeCtx(12345);
  check('world starts with 0 tribes (v3 invariant)', ev(ctx, `S.tribes.length`) === 0);
  const daily = [];
  let maxWood = 0, maxStone = 0, maxFood = 0, maxFoodCap = 0;
  for (let d = 0; d < 10; d++) {
    runDays(ctx, 1);
    const s = ev(ctx, `(()=>{let w=0,st=0,f=0,fc=0; for(const t of S.tribes){ w=Math.max(w,t.stock.wood); st=Math.max(st,t.stock.stone); f=Math.max(f,t.stock.food); fc=Math.max(fc,foodCap(t)); } return {pop:S.agents.length,births:S.births,tribes:S.tribes.length,families:S.families.length,houses:S.buildings.filter(b=>b.type==='house').length,trees:S.trees.length,hunger:S.deathsBy['گرسنگی'],w,st,f,fc,granaries:S.buildings.filter(b=>b.type==='granary').length,shops:['bakery','granary','smithy','butcher','library','clinic','inn'].filter(ty=>S.buildings.some(b=>b.type===ty)).length}; })()`);
    daily.push(s);
    maxWood = Math.max(maxWood, s.w); maxStone = Math.max(maxStone, s.st); maxFood = Math.max(maxFood, s.f); maxFoodCap = Math.max(maxFoodCap, s.fc);
    console.log(`  day ${d + 1}: pop=${s.pop} births=${s.births} tribes=${s.tribes} families=${s.families} houses=${s.houses} trees=${s.trees} hunger=${s.hunger} maxStock w${s.w}/s${s.st}/f${s.f}(cap ${s.fc}) shops=${s.shops}`);
  }
  const last = daily[9];
  check('tribes form from 0', last.tribes >= 2);
  check('births happen (v3 invariant)', last.births > 50);
  check('families exist (v3 invariant)', last.families > 0);
  check('houses exist (v3 invariant)', last.houses > 0);
  check('population stays alive (no collapse)', last.pop > 40);
  check('wood stock stays near cap 250 (max ' + maxWood + ')', maxWood <= 260);
  check('stone stock stays near cap 200 (max ' + maxStone + ')', maxStone <= 210);
  check('food stock stays near its cap (max ' + maxFood + ' vs cap ' + maxFoodCap + ')', maxFood <= maxFoodCap + 40);
  check('no starvation collapse (hunger deaths ' + last.hunger + ')', last.hunger < 60);
  check('trees stay in a healthy band 25..110 every day', daily.every(s => s.trees >= 25 && s.trees <= 110));
  const spendLogs = ev(ctx, `S.__log.filter(t=>t.includes('خرج می‌شود')).length`);
  console.log('  auto-spend log lines:', spendLogs);
  check('autoInfra spending is visible in the event log', spendLogs > 0);
  check('at least one job shop gets built by a tribe', daily.some(s => s.shops > 0));
  const sexw = ev(ctx, `(()=>{let f=0,mm=0;for(const a of S.agents){if(a.job==='sexworker'){if(a.sex==='♀')f++;else mm++;}}return {f,mm};})()`);
  console.log('  sex workers after 10 days:', JSON.stringify(sexw));
  check('v24: most sex workers still female', sexw.f + sexw.mm > 0 && sexw.f > sexw.mm);
}

// ============ E. clickable buildings ============
console.log('\n--- E. clickable buildings ---');
{
  const { ctx, els } = makeCtx(4242);
  ensureTribes(ctx, 1);
  const tid = ev(ctx, `S.tribes[0].id`);
  giveBuildings(ctx, tid, ['house', 'farm', 'market', 'bakery']);
  const found = ev(ctx, `(()=>{const b=S.buildings.find(x=>x.tribeId===${tid}&&x.type==='farm'); const nb=nearestBuilding(b.x+3,b.y-2,40); return {ok:nb===b, type:nb&&nb.type}; })()`);
  check('nearestBuilding hit-tests a building', found.ok === true);
  const card = ev(ctx, `(()=>{const b=S.buildings.find(x=>x.tribeId===${tid}&&x.type==='farm'); selectBuilding(b); updateBuildingCard(); return {sel:S.selectedBuilding===b, hidden:document.getElementById('buildingCard').hidden, txt:document.getElementById('bldName').textContent, content:document.getElementById('bldContent').textContent}; })()`);
  console.log('  building card:', JSON.stringify(card));
  check('selectBuilding opens the card with name + contents', card.sel && card.hidden === false && card.txt.includes('مزرعه') && card.content.length > 5);
  // repair button
  const rep = ev(ctx, `(()=>{const b=S.buildings.find(x=>x.tribeId===${tid}&&x.type==='farm'); b.hp=10; const t=tribeById(${tid}); t.stock.wood=100; t.stock.stone=100; selectBuilding(b); updateBuildingCard(); return b.hp; })()`);
  els['btnBuildRepair'].dispatch('click');
  const repAfter = ev(ctx, `(()=>{const b=S.buildings.find(x=>x.tribeId===${tid}&&x.type==='farm'); return {hp:b.hp, wood:tribeById(${tid}).stock.wood}; })()`);
  check('repair button restores HP and spends resources', repAfter.hp > rep && repAfter.wood === 95);
  // upgrade button
  els['btnBuildUpgrade'].dispatch('click');
  const upAfter = ev(ctx, `(()=>{const b=S.buildings.find(x=>x.tribeId===${tid}&&x.type==='farm'); return {level:b.level, hp:b.hp, maxHp:b.maxHp}; })()`);
  console.log('  after upgrade:', JSON.stringify(upAfter));
  check('upgrade button raises level + max HP', upAfter.level === 2 && upAfter.maxHp > 50);
  // demolish button
  const beforeCount = ev(ctx, `S.buildings.length`);
  els['btnBuildDemolish'].dispatch('click');
  const afterCount = ev(ctx, `S.buildings.length`);
  check('demolish button removes the building', afterCount === beforeCount - 1);
  check('card closes after demolish', ev(ctx, `S.selectedBuilding`) === null);
  // draw() must not crash with a selected building + damaged buildings
  ev(ctx, `draw()`);
  check('draw() runs clean with buildings selected/damaged', true);
}

// ============ G. inter-tribe trade ============
console.log('\n--- G. inter-tribe trade ---');
{
  const { ctx } = makeCtx(31337);
  const ids = ensureTribes(ctx, 2);
  const [a, b] = ids;
  ev(ctx, `(()=>{const t1=tribeById(${a}), t2=tribeById(${b});
    t1.techs.money=true; t2.techs.money=true;
    t1.relations[t2.id]=40; t2.relations[t1.id]=40;
    t1.stock={wood:100,stone:50,food:200,coins:20,meals:0}; t2.stock={wood:200,stone:50,food:5,coins:100,meals:0};
    })()`);
  giveBuildings(ctx, a, ['market']);
  giveBuildings(ctx, b, ['market']);
  ev(ctx, `(()=>{const t1=tribeById(${a}); const ms=tribeMembers(t1); const tr=ms.find(x=>x.age>=0.4); if(tr){ tr.job='trader'; tr.manualJob=true; tr.x=tribeById(${a}).home.x; tr.y=tribeById(${a}).home.y; } })()`);
  const before = ev(ctx, `S.tradeCount`);
  runDays(ctx, 2);
  const after = ev(ctx, `S.tradeCount`);
  console.log('  inter-tribe trades in 2 days:', after - before, '| t2 food now:', ev(ctx, `tribeById(${b}).stock.food`), '| t1 coins now:', ev(ctx, `tribeById(${a}).stock.coins`));
  check('at least one inter-tribe trade happens', after > before);
  // price reflects scarcity: scarce good is expensive
  const pScarce = ev(ctx, `tradePrice(tribeById(${a}),(()=>{const t=tribeById(${b}); t.stock.food=0; return t;})(),'food')`);
  const pPlenty = ev(ctx, `tradePrice(tribeById(${a}),(()=>{const t=tribeById(${b}); t.stock.food=380; return t;})(),'food')`);
  console.log('  price of food when scarce vs plentiful:', pScarce, 'vs', pPlenty);
  check('scarce goods cost more than plentiful ones', pScarce > pPlenty);
}

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);

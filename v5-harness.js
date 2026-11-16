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
    const s = ev(ctx, `(()=>{let w=0,st=0,f=0,fc=0; for(const t of S.tribes){ w=Math.max(w,t.stock.wood); st=Math.max(st,t.stock.stone); f=Math.max(f,t.stock.food); fc=Math.max(fc,foodCap(t)); } return {pop:S.agents.length,births:S.births,tribes:S.tribes.length,families:S.families.length,houses:S.buildings.filter(b=>b.type==='house').length,trees:S.trees.length,hunger:S.deathsBy['گرسنگی'],w,st,f,fc,granaries:S.buildings.filter(b=>b.type==='granary').length,shops:['bakery','granary','smithy','butcher','library','clinic','inn'].filter(ty=>S.buildings.some(b=>b.type===ty)).length,tiles:S.tribes.reduce((n,t)=>n+tribeTiles(t),0),roads:Array.from(S.roads).reduce((n,v)=>n+(v?1:0),0)}; })()`);
    daily.push(s);
    maxWood = Math.max(maxWood, s.w); maxStone = Math.max(maxStone, s.st); maxFood = Math.max(maxFood, s.f); maxFoodCap = Math.max(maxFoodCap, s.fc);
    console.log(`  day ${d + 1}: pop=${s.pop} births=${s.births} tribes=${s.tribes} families=${s.families} houses=${s.houses} trees=${s.trees} hunger=${s.hunger} maxStock w${s.w}/s${s.st}/f${s.f}(cap ${s.fc}) shops=${s.shops} tiles=${s.tiles} roads=${s.roads}`);
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
  check('trees stay in a healthy band 25..165 every day (bigger world)', daily.every(s => s.trees >= 25 && s.trees <= 165));
  const spendLogs = ev(ctx, `S.__log.filter(t=>t.includes('خرج می‌شود')).length`);
  console.log('  auto-spend log lines:', spendLogs);
  check('autoInfra spending is visible in the event log', spendLogs > 0);
  check('at least one job shop gets built by a tribe', daily.some(s => s.shops > 0));
  const sexw = ev(ctx, `(()=>{let f=0,mm=0;for(const a of S.agents){if(a.job==='sexworker'){if(a.sex==='♀')f++;else mm++;}}return {f,mm};})()`);
  console.log('  sex workers after 10 days:', JSON.stringify(sexw));
  console.log('  owned tiles day 1 vs day 10:', daily[0].tiles, '->', last.tiles, '| roads day 10:', last.roads);
  check('tiles get owned and grow over the run', last.tiles > 0 && last.tiles > daily[0].tiles);
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


// ============ I. mobile: zoom buttons + minimap hidden under 640px ============
console.log('\n--- I. mobile CSS hide ---');
{
  const css = fs.readFileSync('/home/hatch/workspace/god-sim/style.css', 'utf8');
  const m = css.match(/@media \(max-width:640px\)\{([\s\S]*?)\n\}/);
  check('a 640px media query exists', !!m);
  const block = m ? m[1] : '';
  check('cam-controls hidden under 640px', /\.cam-controls\s*\{\s*display:\s*none/.test(block));
  check('minimap hidden under 640px', /#minimap\s*\{\s*display:\s*none/.test(block));
  check('desktop (outside the query) does not hide them', !css.replace(m ? m[0] : '', '').includes('.cam-controls{display:none}'));
}

// ============ J. tribe spacing ============
console.log('\n--- J. tribe spacing ---');
{
  // forced: a strong leader far from the only tribe founds a second one (needs 7 loyal adult followers nearby)
  const { ctx } = makeCtx(555);
  ensureTribes(ctx, 1);
  const h1 = ev(ctx, `({x:S.tribes[0].home.x,y:S.tribes[0].home.y})`);
  const far = { x: h1.x > 1200 ? 200 : 2200, y: h1.y > 900 ? 200 : 1600 };
  ev(ctx, `(()=>{let c=0; for(const o of S.agents){ if(c>=10) break; if(!o.dead&&!o.tribeId&&o.age>=0.4){ o.x=${far.x}+Math.random()*80; o.y=${far.y}+Math.random()*80; o.foundCd=0; o.loyalty=80; c++; } }
    const lead=S.agents.find(x=>!x.dead&&!x.tribeId&&x.age>=0.4); if(lead){ lead.genes.aggression=0.9; lead.genes.cooperation=0.9; lead.genes.size=0.9; lead.knowledge=0.9; lead.foundCd=0; lead.x=${far.x}; lead.y=${far.y}; } })()`);
  const id1 = ev(ctx, `S.tribes[0].id`);
  const t2id = ev(ctx, `(()=>{const a=S.agents.find(x=>!x.dead&&!x.tribeId&&x.age>=0.4&&leadershipOf(x)>=0.6); const t=a?foundTribe(a):null; return t?t.id:null; })()`);
  check('forced founding far away succeeds', t2id !== null);
  const d2 = t2id === null ? 0 : ev(ctx, `(()=>{const t2=tribeById(${t2id}), t1=tribeById(${id1}); return Math.hypot(t2.home.x-t1.home.x,t2.home.y-t1.home.y); })()`);
  console.log('  forced second home distance:', Math.round(d2));
  check('new home is >= 350px from the existing home', d2 >= 350);
}

// ============ K. distance drives war appetite ============
console.log('\n--- K. distance -> war appetite ---');
{
  const { ctx } = makeCtx(777);
  const ids = ensureTribes(ctx, 2);
  const [a, b] = ids;
  // ensureTribes can overshoot (whole days run, several tribes form) — keep exactly the two tribes under test
  ev(ctx, `(()=>{S.tribes=S.tribes.filter(t=>t.id===${a}||t.id===${b}); })()`);
  ev(ctx, `(()=>{for(const id of [${a},${b}]){ const t=tribeById(id); const ch=chiefOf(t); if(ch){ ch.genes.aggression=0.5; ch.opinion=0; } t.grievance={}; t.stock.food=100; } })()`);
  // strip both tribes' buildings first: recomputeTerritory re-claims from buildings too, so a teleported home
  // would otherwise keep its old building tiles and the far case would stay "close"
  ev(ctx, `(()=>{for(const b of S.buildings){ if(b.tribeId===${a}||b.tribeId===${b}) b.tribeId=null; } })()`);
  // v7: homes 850px apart: each founding blob reaches 300px from its home, so nearest owned tile centres are 250px
  // apart and the edge-to-edge territory distance is 200px -> distBonus 0.2
  ev(ctx, `(()=>{const t1=tribeById(${a}), t2=tribeById(${b}); t1.home={x:600,y:900}; t1.centre={x:600,y:900}; t2.home={x:1450,y:900}; t2.centre={x:1450,y:900}; recomputeTerritory(t1); recomputeTerritory(t2); updateTerritoryDistances(); })()`);
  const appClose = ev(ctx, `warAppetite(tribeById(${a}))`);
  ev(ctx, `(()=>{const t2=tribeById(${b}); t2.home={x:2250,y:900}; t2.centre={x:2250,y:900}; recomputeTerritory(t2); updateTerritoryDistances(); })()`);
  const appFar = ev(ctx, `warAppetite(tribeById(${a}))`);
  console.log('  appetite close (territories 200px apart):', appClose.toFixed(3), '| far (1650px):', appFar.toFixed(3));
  check('close rivals are more war-hungry than far ones (gap >= 0.15)', appClose - appFar >= 0.15);
  ev(ctx, `(()=>{const t2=tribeById(${b}); t2.home={x:1450,y:900}; t2.centre={x:1450,y:900}; recomputeTerritory(t2); updateTerritoryDistances(); })()`);
  const bonusClose = ev(ctx, `distBonus(tribeById(${a}))`);
  console.log('  distBonus at 200px:', bonusClose);
  check('distBonus is 0.2 at 200px', Math.abs(bonusClose - 0.2) < 0.001);
  ev(ctx, `(()=>{const t2=tribeById(${b}); t2.home={x:2250,y:900}; t2.centre={x:2250,y:900}; recomputeTerritory(t2); updateTerritoryDistances(); })()`);
  check('distBonus is 0 beyond 1000px', ev(ctx, `distBonus(tribeById(${a}))`) === 0);
}

// ============ L. land ownership (tiles) ============
console.log('\n--- L. land ownership (tiles) ---');
{
  const { ctx } = makeCtx(777);
  const ids = ensureTribes(ctx, 2);
  const [a, b] = ids;
  const t0 = ev(ctx, `tribeTiles(tribeById(${a}))`);
  console.log('  tiles of the new tribe (founding blob ~100 + expansion since formation):', t0);
  // the exact blob size at formation is asserted in the v7 harness (T2: 100 tiles right after foundTribe);
  // here the tribe has already expanded since forming, so only the lower bound is meaningful
  check('a new tribe owns a large founding blob around its home (100 at formation, more as it expands)', t0 >= 60);
  // a completed building claims its tiles — place it OUTSIDE the current territory (500px from home;
  // the v7 founding blob reaches 300px), otherwise the claim lands on tiles the tribe already owns
  const before = ev(ctx, `tribeTiles(tribeById(${a}))`);
  ev(ctx, `(()=>{const t=tribeById(${a}); const b=newBuilding(${a},'tower',t.home.x+500,t.home.y,null); b.progress=100; S.buildings.push(b); claimForBuilding(b); })()`);
  const afterTower = ev(ctx, `tribeTiles(tribeById(${a}))`);
  console.log('  tiles after a tower completes:', before, '->', afterTower);
  check('a tower claims surrounding tiles', afterTower > before);
  // a castle claims a much larger area — placed 600px away (opposite the nearest edge) so its tiles
  // form a disconnected exclave; destroying it must unclaim exactly those tiles (v7 recompute keeps
  // land that stays connected to the home blob, and drops land cut off from it)
  ev(ctx, `(()=>{const t=tribeById(${a}); const dir=t.home.x>1200?-1:1; const b=newBuilding(${a},'castle',t.home.x+dir*600,t.home.y,null); b.progress=100; S.buildings.push(b); claimForBuilding(b); })()`);
  const afterCastle = ev(ctx, `tribeTiles(tribeById(${a}))`);
  console.log('  tiles after a castle completes:', afterTower, '->', afterCastle);
  check('a castle claims a large area (radius 4)', afterCastle - afterTower >= 20);
  // destroying a castle unclaims its tiles
  ev(ctx, `(()=>{const bb=S.buildings.find(x=>x.tribeId===${a}&&x.type==='castle'); if(bb) destroyBuilding(bb,null); })()`);
  const afterDestroy = ev(ctx, `tribeTiles(tribeById(${a}))`);
  console.log('  tiles after the castle is destroyed:', afterCastle, '->', afterDestroy);
  check('destroying a castle unclaims its tiles', afterDestroy < afterCastle);
  // dissolving transfers tiles to the winner
  const bTiles = ev(ctx, `tribeTiles(tribeById(${b}))`);
  const aBefore = ev(ctx, `tribeTiles(tribeById(${a}))`);
  ev(ctx, `dissolveTribe(tribeById(${b}),tribeById(${a}))`);
  const aAfter = ev(ctx, `tribeTiles(tribeById(${a}))`);
  console.log('  winner tiles after occupation:', aBefore, '->', aAfter, '(loser had', bTiles + ')');
  check('dissolving transfers the loser tiles to the winner', aAfter >= aBefore + bTiles - 5);
  ev(ctx, `draw()`);
  check('draw() runs clean with tile territories', true);
}

// ============ P. roads claim tiles along their path ============
console.log('\n--- P. roads claim tiles ============');
{
  const { ctx } = makeCtx(777);
  const ids = ensureTribes(ctx, 1);
  const tid = ids[0];
  ev(ctx, `(()=>{const t=tribeById(${tid}); t.stock.wood=500; t.stock.stone=500; t.stock.food=500; })()`);
  // a builder with no build queue starts paving roads (fed first, so it does not spend the day foraging)
  ev(ctx, `(()=>{const t=tribeById(${tid}); const ms=tribeMembers(t); const bd=ms.find(x=>x.age>=0.4&&x.job==='builder')||ms.find(x=>x.age>=0.4); if(bd){ bd.job='builder'; bd.manualJob=true; bd.energy=90; bd.x=t.home.x; bd.y=t.home.y; } })()`);
  const before = ev(ctx, `tribeTiles(tribeById(${tid}))`);
  const roadsBefore = ev(ctx, `Array.from(S.roads).reduce((n,v)=>n+(v?1:0),0)`);
  runDays(ctx, 1);
  const after = ev(ctx, `tribeTiles(tribeById(${tid}))`);
  const roadsAfter = ev(ctx, `Array.from(S.roads).reduce((n,v)=>n+(v?1:0),0)`);
  console.log('  tiles:', before, '->', after, '| road tiles:', roadsBefore, '->', roadsAfter);
  check('builders lay roads that claim new tiles', roadsAfter > roadsBefore && after > before);
  // movement on a road is faster
  const sp = ev(ctx, `(()=>{const t=tribeById(${tid}); let ri=-1; for(let i=0;i<S.roads.length;i++) if(S.roads[i]){ ri=i; break; } if(ri<0) return 0; const cx=(ri%TW)*TILE+TILE/2, cy=Math.floor(ri/TW)*TILE+TILE/2; const a=S.agents.find(x=>!x.dead&&x.tribeId===${tid}); a.x=cx; a.y=cy; const onRoad=S.roads[tileIndex(tileAt(a.x,a.y).tx,tileAt(a.x,a.y).ty)]?1.3:1; return onRoad; })()`);
  check('a road tile gives the 1.3x movement bonus', sp === 1.3);
}

// ============ M. bigger world ============
console.log('\n--- M. bigger world ---');
{
  const { ctx } = makeCtx(12345);
  check('WORLD_W is 2400', ev(ctx, `WORLD_W`) === 2400);
  check('WORLD_H is 1800', ev(ctx, `WORLD_H`) === 1800);
  const counts = ev(ctx, `({trees:S.trees.length,stones:S.stones.length,foods:S.foods.length,agents:S.agents.length})`);
  console.log('  initial counts:', JSON.stringify(counts));
  check('initial trees scaled up (~140)', counts.trees >= 130 && counts.trees <= 150);
  check('initial stones scaled up (~65)', counts.stones >= 60 && counts.stones <= 70);
  check('initial foods scaled up (~150)', counts.foods >= 140 && counts.foods <= 160);
  check('agents spawn inside the new world', ev(ctx, `S.agents.every(a=>a.x>=0&&a.x<=2400&&a.y>=0&&a.y<=1800)`));
  ev(ctx, `draw()`);
  check('draw() + drawMinimap() run clean on the bigger world', true);
}

// ============ N. food icon ============
console.log('\n--- N. food icon ---');
{
  const { ctx } = makeCtx(777);
  check('ICONS.food is a distinct apple (stem + leaf)', ev(ctx, `ICONS.food`).includes('8.5c-2.5'));
  check('foodSprite draws a red apple', ev(ctx, `foodSprite.toString()`).includes('ef4444') && ev(ctx, `foodSprite.toString()`).includes('22c55e'));
  check('food icon differs from the tree/stone draw (no plain green dot)', !ev(ctx, `foodSprite.toString()`).includes('4ade80'));
}

// ============ O. idle: v25 baseline vs v5 fix (same seed) ============
// Displacement over 30s is BLIND to this bug: mating/food trips pull every agent
// away briefly, so even v25 shows ~0 agents stuck for 30s. The real phenomenon
// is the GOAL: at any moment in v25, dozens of agents sit on an idle goal
// ('آماده‌باش درمان' healer-on-standby, 'اندیشیدن' scholar-without-school).
// v5 renamed both goals to moving ones (patrol / wander) and added the safety net.
console.log('\n--- O. idle A/B (seed 12345, after 2 days) ---');
{
  const idleGoals = (ctx) => ev(ctx, `(()=>{let n=0; for(const a of S.agents){ if(!a.dead&&a.age>=0.4&&(a.goal==='آماده‌باش درمان'||a.goal==='اندیشیدن')) n++; } return n; })()`);
  const v25src = fs.readFileSync(fs.existsSync(__dirname + '/app-v25.js') ? __dirname + '/app-v25.js' : '/tmp/app-v25.js', 'utf8');
  const cOld = makeCtx(12345, v25src);
  runDays(cOld.ctx, 2);
  const baseIdle = idleGoals(cOld.ctx);
  const baseStuck = stuckFrac(cOld.ctx, 30);
  console.log('  v25 baseline idle-goal agents:', baseIdle, '| stuck 30s:', JSON.stringify(baseStuck));
  const cNew = makeCtx(12345);
  runDays(cNew.ctx, 2);
  const fixedIdle = idleGoals(cNew.ctx);
  const fixedStuck = stuckFrac(cNew.ctx, 30);
  console.log('  v5 fixed idle-goal agents:', fixedIdle, '| stuck 30s:', JSON.stringify(fixedStuck));
  check('v25 baseline really has idle-goal agents (bug reproduced)', baseIdle > 10);
  check('v5 has zero agents on the old idle goals', fixedIdle === 0);
  check('v5 stuck fraction stays low (<= 12%)', fixedStuck.frac <= 0.12);
}

// ============ Q. crown + court + satisfaction + protest/revolution ============
console.log('\n--- Q. crown + court + satisfaction + protest/revolution ---');
{
  const { ctx } = makeCtx(777);
  const ids = ensureTribes(ctx, 2);
  const tid = ids[0];
  check('ICONS.crown exists (gold crown SVG)', ev(ctx, `typeof ICONS.crown==='string' && ICONS.crown.includes('M4 18')`));
  check('drawCrown function exists', ev(ctx, `typeof drawCrown==='function'`));
  check('the chief is the crowned agent (chiefId points at a live member)', ev(ctx, `(()=>{const t=tribeById(${tid}); const c=chiefOf(t); return !!c && t.chiefId===c.id; })()`));
  ev(ctx, `draw()`); check('draw() runs clean with crowned chiefs', true);
  runDays(ctx, 3);
  const court = ev(ctx, `(()=>{const t=tribeById(${tid}); return {roles:Object.keys(t.court).filter(r=>courtMember(t,r)).length}; })()`);
  console.log('  court filled roles:', JSON.stringify(court));
  check('court roles get filled (at least 3 of 4)', court.roles >= 3);
  const rb = ev(ctx, `(()=>{const t=tribeById(${tid}); const withAdv=researchBonus(t); t.court.advisor=null; const withoutAdv=researchBonus(t); return {withAdv,withoutAdv}; })()`);
  check('advisor gives +25% research', rb.withAdv === 1.25 && rb.withoutAdv === 1);
  // force-appoint a minister (court auto-appointment may leave the role empty in a small tribe; the effect is what is asserted here)
  const gb = ev(ctx, `(()=>{const t=tribeById(${tid}); if(!t.court.minister){ const m=tribeMembers(t).find(x=>x.id!==t.chiefId&&x.age>=0.4); if(m) t.court.minister=m.id; } const withMin=gatherBonus(t); t.court.minister=null; const withoutMin=gatherBonus(t); return {withMin,withoutMin}; })()`);
  check('minister gives +15% gathering', gb.withMin === 1.15 && gb.withoutMin === 1);
  const tb = ev(ctx, `(()=>{const t=tribeById(${tid}); const withTr=tradeBonus(t); t.court.treasurer=null; const withoutTr=tradeBonus(t); return {withTr,withoutTr}; })()`);
  check('treasurer gives +10% trade', tb.withTr === 1.1 && tb.withoutTr === 1);
  const pw = ev(ctx, `(()=>{const t=tribeById(${tid}); const w=tribeMembers(t).find(a=>a.job==='warrior'||a.job==='guard')||tribeMembers(t)[0]; if(!w) return null; w.genes.size=1; w.genes.aggression=1; w.equip={weapon:'club',shield:null,armor:null}; let s1=0; for(let i=0;i<20;i++) s1+=fightPower(w); const g=courtMember(t,'general'); const hadGen=!!g; if(g) t.court.general=null; let s2=0; for(let i=0;i<20;i++) s2+=fightPower(w); if(g) t.court.general=g.id; return {ratio:s1/s2, hadGen}; })()`);
  console.log('  fightPower with/without general (avg of 20):', JSON.stringify(pw));
  check('general gives +15% war power', pw && pw.hadGen && pw.ratio > 1.08);
  // god can replace a court member from the panel
  const rep = ev(ctx, `(()=>{const t=tribeById(${tid}); const before=courtMember(t,'advisor'); replaceCourtMember(t,'advisor'); const after=courtMember(t,'advisor'); return {changed:!before||!after||before.id!==after.id, filled:!!after}; })()`);
  check('god can replace a court member (replaceCourtMember)', rep.changed && rep.filled);
  // satisfaction responds to famine vs abundance
  const satFamine = ev(ctx, `(()=>{const t=tribeById(${tid}); t.stock.food=0; t.stock.coins=0; t.warWins=0; t.warLosses=3; t.recentDeaths=0; for(let i=0;i<200;i++) satisfactionTick(t,1); return avgSatisf(t); })()`);
  const satRich = ev(ctx, `(()=>{const t=tribeById(${tid}); t.stock.food=500; t.stock.coins=100; t.warWins=3; t.warLosses=0; t.recentDeaths=0; for(let i=0;i<200;i++) satisfactionTick(t,1); return avgSatisf(t); })()`);
  console.log('  avg satisfaction after forced famine vs abundance:', satFamine.toFixed(1), 'vs', satRich.toFixed(1));
  check('satisfaction drops under forced famine', satFamine < 40);
  check('satisfaction rises with abundance', satRich > satFamine + 15);
  // forced protest: sustained low satisfaction (kept low every tick — satisfactionTick pulls it toward the target otherwise)
  const protest = ev(ctx, `(()=>{const t=tribeById(${tid}); t.protestCd=0; t.revoltCd=0; t.protesting=false; t.protestT=0; t.revoltT=0; let protested=false; for(let i=0;i<200&&!protested;i++){ for(const a of tribeMembers(t)) a.satisf=5; satisfactionTick(t,1); if(t.protesting) protested=true; } const protesters=tribeMembers(t).filter(a=>a.protesting).length; return {protested, protesters}; })()`);
  console.log('  forced low satisfaction -> protest:', JSON.stringify(protest));
  check('sustained low satisfaction starts a protest', protest.protested && protest.protesters > 0);
  // forced revolution: keep satisfaction at 5 until it resolves
  const revolt = ev(ctx, `(()=>{const t=tribeById(${tid}); const oldChief=t.chiefId; const memBefore=tribeMembers(t).length; t.revoltCd=0; for(let i=0;i<600;i++){ for(const a of tribeMembers(t)) a.satisf=5; satisfactionTick(t,1); if(t.revoltCd>0) break; } const memAfter=tribeMembers(t).length; const newChief=t.chiefId; const jailed=tribeMembers(t).filter(a=>a.jailedUntil&&S.day<a.jailedUntil).length; const log=S.__log.filter(l=>l.includes('انقلاب')).length; return {changed:newChief!==oldChief, jailed, memBefore, memAfter, log}; })()`);
  console.log('  forced revolution result:', JSON.stringify(revolt));
  check('a forced revolution resolves to exactly one outcome (new chief OR suppressed with jailed)', (revolt.changed || revolt.jailed > 0) && revolt.log > 0);
  check('revolution does not empty the tribe', revolt.memAfter >= 3 && revolt.memAfter >= revolt.memBefore - 3);
}

// ============ R. minimum tribe size + collapse ============
console.log('\n--- R. minimum tribe size + collapse ---');
{
  // R1: lone strong leader with 3 followers cannot found
  const { ctx } = makeCtx(999);
  const r1 = ev(ctx, `(()=>{ const lead=S.agents.find(a=>!a.dead&&a.age>=0.4); lead.genes.aggression=0.9; lead.genes.cooperation=0.9; lead.genes.size=0.9; lead.knowledge=0.9; lead.x=1200; lead.y=900; lead.foundCd=0;
    let c=0; for(const o of S.agents){ if(o===lead||c>=3) continue; if(!o.dead&&o.age>=0.4){ o.x=1200+Math.random()*60; o.y=900+Math.random()*60; o.loyalty=80; c++; } }
    const t=foundTribe(lead); return {founded:!!t, tribes:S.tribes.length}; })()`);
  check('a lone leader with 3 followers cannot found a tribe', r1.founded === false && r1.tribes === 0);
  // R2: same leader with 7 followers founds with >=8 members
  const r2 = ev(ctx, `(()=>{ const lead=S.agents.find(a=>!a.dead&&a.age>=0.4&&!a.tribeId); lead.genes.aggression=0.9; lead.genes.cooperation=0.9; lead.genes.size=0.9; lead.knowledge=0.9; lead.x=1200; lead.y=900; lead.foundCd=0;
    let c=0; for(const o of S.agents){ if(o===lead||c>=7) continue; if(!o.dead&&!o.tribeId&&o.age>=0.4){ o.x=1200+Math.random()*60; o.y=900+Math.random()*60; o.loyalty=80; c++; } }
    const t=foundTribe(lead); return {founded:!!t, members:t?tribeMembers(t).length:0}; })()`);
  console.log('  founding with 7 followers:', JSON.stringify(r2));
  check('7 loyal adult followers found a tribe of >= 8', r2.founded && r2.members >= 8);
  // R3: forced tiny tribe warns first, then dissolves within a bounded time
  const r3 = ev(ctx, `(()=>{const t=S.tribes[0]; const adults=tribeMembers(t).filter(a=>a.age>=0.4); for(let i=2;i<adults.length;i++) killAgent(adults[i],'خدا',true); S.agents=S.agents.filter(a=>!a.dead); const left=tribeMembers(t).filter(a=>a.age>=0.4).length; let warned=false, dissolved=false; for(let i=0;i<200;i++){ collapseTick(t,1); if(t.collapseWarned) warned=true; if(t.collapseDue){ collapseTribe(t,t.collapseReason||'نیروی کار کافی نداشت'); } if(!tribeById(t.id)){ dissolved=true; break; } } return {left, warned, dissolved, warnLogs:S.__log.filter(l=>l.includes('آستانه‌ی فروپاشی')).length}; })()`);
  console.log('  forced tiny tribe:', JSON.stringify(r3));
  check('tiny tribe warns before collapsing', r3.warned && r3.warnLogs > 0);
  check('tiny tribe dissolves within ~2 days of sustained failure', r3.dissolved);
  // R4: a healthy tribe does NOT dissolve over 10 days of collapse checks
  const c2 = makeCtx(1000);
  ensureTribes(c2.ctx, 1);
  const tid2 = ev(c2.ctx, `S.tribes[0].id`);
  setWarriors(c2.ctx, tid2, 2);
  const r4 = ev(c2.ctx, `(()=>{const t=S.tribes[0]; t.stock.food=200; for(let i=0;i<600;i++){ collapseTick(t,1); if(t.collapseDue) break; } return {collapsed:!!t.collapseDue, adults:tribeMembers(t).filter(a=>a.age>=0.4).length}; })()`);
  const r4b = ev(c2.ctx, `(()=>{const t=S.tribes[0]; return {members:tribeMembers(t).length, warriors:tribeMembers(t).filter(a=>a.job==='warrior'||a.job==='guard').length}; })()`);
  console.log('  healthy tribe after 10 days of collapse checks:', JSON.stringify(r4), JSON.stringify(r4b));
  check('healthy tribe with food + warriors never hits collapse', r4.collapsed === false);
  // R5: a starving tribe (no food, no farm, no wild food nearby) collapses too
  const r5 = ev(c2.ctx, `(()=>{const t=S.tribes[0]; t.stock.food=0; for(const b of S.buildings) if(b.tribeId===t.id&&(b.type==='farm'||b.type==='pasture')) b.progress=0; S.foods=S.foods.filter(f=>Math.hypot(f.x-t.home.x,f.y-t.home.y)>400); t.collapseT=0; t.collapseWarned=false; t.collapseDue=false; let dissolved=false; for(let i=0;i<200;i++){ collapseTick(t,1); if(t.collapseDue){ collapseTribe(t,t.collapseReason||'غذای کافی نداشت'); } if(!tribeById(t.id)){ dissolved=true; break; } } return {dissolved}; })()`);
  check('a starving tribe with no food income collapses within ~2 days', r5.dissolved === true);
}

// ============ S. belonging: tribe life beats living alone ============
console.log('\n--- S. belonging (seed 12345, 10 days) ---');
{
  const v25src = fs.readFileSync(fs.existsSync(__dirname + '/app-v25.js') ? __dirname + '/app-v25.js' : '/tmp/app-v25.js', 'utf8');
  const cOld = makeCtx(12345, v25src);
  runDays(cOld.ctx, 10);
  const base = ev(cOld.ctx, `(()=>{const adults=S.agents.filter(a=>!a.dead&&a.age>=0.4); const lone=adults.filter(a=>!a.tribeId).length; const joins=S.__log.filter(l=>l.includes('پیوست')).length; const leaves=S.__log.filter(l=>l.includes('جدا شد')).length; return {lone, adults:adults.length, loneFrac:+(lone/adults.length).toFixed(3), joins, leaves, tribes:S.tribes.length}; })()`);
  console.log('  v25 baseline after 10 days:', JSON.stringify(base));
  const cNew = makeCtx(12345);
  runDays(cNew.ctx, 10);
  const fixed = ev(cNew.ctx, `(()=>{const adults=S.agents.filter(a=>!a.dead&&a.age>=0.4); const lone=adults.filter(a=>!a.tribeId).length; const joins=S.__log.filter(l=>l.includes('پیوست')).length; const leaves=S.__log.filter(l=>l.includes('جدا شد')).length; const ms=S.agents.filter(a=>!a.dead&&a.tribeId); const avgTenure=ms.length?+(ms.reduce((s,a)=>s+(S.elapsed-(a.tribeSince||0)),0)/ms.length).toFixed(1):0; return {lone, adults:adults.length, loneFrac:+(lone/adults.length).toFixed(3), joins, leaves, tribes:S.tribes.length, avgTenure}; })()`);
  console.log('  v5 after 10 days:', JSON.stringify(fixed));
  check('tribeless adult fraction drops clearly vs v25', fixed.loneFrac < base.loneFrac * 0.7);
  check('join events are more frequent than v25', fixed.joins > base.joins);
  check('leaving becomes rarer (longer tenure) than v25', fixed.leaves < base.leaves);
  check('average tribe tenure is positive and real (> 60s)', fixed.avgTenure > 60);
  // roach motel: forced very-low-satisfaction members can still leave
  const motel = ev(cNew.ctx, `(()=>{const t=S.tribes[0]; if(!t) return {left:0}; const before=tribeMembers(t).length; t.stock.food=0; for(const a of tribeMembers(t)){ a.satisf=5; a.loyalty=15; } let left=0; for(let i=0;i<600;i++){ loyaltyTick(1); left=before-tribeMembers(t).length; if(left>0) break; } return {before, left}; })()`);
  console.log('  forced unhappy members leaving:', JSON.stringify(motel));
  check('very unhappy members can still leave (no roach motel)', motel.left > 0);
  // healer gating: a tribe healer never heals a tribeless agent
  const heal = ev(cNew.ctx, `(()=>{const t=S.tribes[0]; if(!t) return {skipped:true}; let h=tribeMembers(t).find(a=>a.job==='healer'&&a.age>=0.4); if(!h){ const m=tribeMembers(t).find(a=>a.age>=0.4); if(!m) return {skipped:true}; m.job='healer'; h=m; } const lone=S.agents.find(a=>!a.dead&&!a.tribeId&&a.age>=0.4); if(!lone) return {skipped:true}; h.x=t.home.x; h.y=t.home.y; lone.health=30; lone.x=h.x+10; lone.y=h.y+10; const before=lone.health; healerStep(h,t,5,50,1); return {before, after:lone.health, healed:lone.health>before}; })()`);
  console.log('  tribeless healing check:', JSON.stringify(heal));
  check('tribe healers do not heal tribeless agents (or none left to test)', heal.healed === false || heal.skipped === true);
}

// ============ T. housing as survival need, tents, landlords, tribe colors, race names ============
console.log('\n--- T. housing / tents / landlords / tribe colors / race names ---');
{
  // T1: a homeless family's adult has a housing-related goal
  const { ctx } = makeCtx(606);
  const t1 = ev(ctx, `(()=>{ const a=S.agents.find(x=>!x.dead&&x.age>=0.4); a.energy=90; a.health=100; const f=createFamily([a]); a.job='gatherer'; jobStep(a,1,50); return {goal:a.goal, shelter:agentShelter(a)}; })()`);
  console.log('  homeless adult goal:', JSON.stringify(t1));
  check('a homeless adult’s goal becomes housing-related', t1.goal === 'به دست آوردن سرپناه');
  // T1b: homeless penalty — a fed homeless adult loses health, a fed housed one gains it (10s window, energy topped up)
  const t1b = ev(ctx, `(()=>{ const a=S.agents.find(x=>!x.dead&&x.age>=0.4&&x.familyId); const fam=agentFamily(a); fam.wealth=0; fam.mats={wood:0,stone:0}; a.tribeId=null; a.energy=100; a.health=80; const h0=a.health;
    const b=S.agents.find(x=>!x.dead&&x.age>=0.4&&x!==a&&!x.familyId); const famB=createFamily([b]); const hb=newBuilding(null,'house',500,500,famB.id); hb.progress=100; S.buildings.push(hb); famB.houseId=hb.id; b.energy=100; b.health=50; const hb0=b.health;
    for(const o of S.agents){ if(!o.dead&&o!==a&&o!==b&&!o.job) o.job='gatherer'; } // هیچ سازنده‌ای نباشد تا چادر وسط آزمایش کامل نشود
    for(let i=0;i<200;i++){ a.energy=100; b.energy=100; tick(1/20); }
    return {homelessDelta:+(a.health-h0).toFixed(1), housedDelta:+(b.health-hb0).toFixed(1), homelessShelter:agentShelter(a)}; })()`);
  console.log('  health deltas over 10s (homeless vs housed):', JSON.stringify(t1b));
  check('a homeless adult loses health while a housed one recovers', t1b.homelessDelta < -2 && t1b.housedDelta > 10);
  // T2: a tent expires within 2 days and the family then seeks a house
  const t2 = ev(ctx, `(()=>{ const a=S.agents.find(x=>!x.dead&&x.age>=0.4&&!x.familyId); const f=createFamily([a]); f.mats={wood:10,stone:5}; familyTick(1); const tent=S.buildings.find(b=>b.type==='tent'&&b.ownerFamilyId===f.id); if(!tent) return {made:false}; tent.progress=100; S.elapsed+=2*S.settings.dayLength+1; civTick(1); const gone=!S.buildings.includes(tent); return {made:true, gone, shelterAfter:agentShelter(a), log:S.__log.some(l=>l.includes('فرسوده'))}; })()`);
  console.log('  tent expiry:', JSON.stringify(t2));
  check('a tent expires within 2 days', t2.made && t2.gone && t2.shelterAfter === 'none' && t2.log);
  const t2b = ev(ctx, `(()=>{ const f=S.families[S.families.length-1]; f.mats={wood:12,stone:5}; familyTick(1); const tent2=S.buildings.find(b=>b.type==='tent'&&b.ownerFamilyId===f.id); if(tent2) tent2.progress=100; familyTick(1); const house=S.buildings.find(b=>b.type==='house'&&b.ownerFamilyId===f.id); return {tentQueued:!!tent2, houseQueued:!!house||!!f.houseId}; })()`);
  console.log('  after expiry the family seeks a house:', JSON.stringify(t2b));
  check('after the tent is gone the family seeks a house (tent then house queued)', t2b.tentQueued && t2b.houseQueued);
  // T3: a wealthy family can own 2+ houses and collect rent from a tenant (fresh ctx — no leftover houses from T1/T2)
  const c3 = makeCtx(607);
  const t3 = ev(c3.ctx, `(()=>{ const a=S.agents.find(x=>!x.dead&&x.age>=0.4&&!x.familyId); const famA=createFamily([a]); famA.wealth=100; const h1=newBuilding(null,'house',500,500,famA.id); h1.progress=100; S.buildings.push(h1); famA.houseId=h1.id; const h2=newBuilding(null,'house',560,500,null); h2.progress=100; S.buildings.push(h2); familyTick(1); const owned=S.buildings.filter(b=>b.type==='house'&&b.progress>=100&&b.ownerFamilyId===famA.id).length;
    const b=S.agents.find(x=>!x.dead&&x.age>=0.4&&!x.familyId&&x!==a); const famB=createFamily([b]); famB.wealth=5; familyTick(1); const rented=!!famB.renterHouseId; familyTick(60); familyTick(60); return {owned, rented, rentIncome:famA.rentIncome||0, wealthAfter2Days:famA.wealth}; })()`);
  console.log('  landlord:', JSON.stringify(t3));
  check('a wealthy family owns 2+ houses (investment purchase)', t3.owned >= 2);
  check('a tenant rents the extra house and the landlord collects rent', t3.rented && t3.rentIncome >= 2);
  // T4: colors come from the tribe, not the lineage
  const c2 = makeCtx(777);
  ensureTribes(c2.ctx, 1);
  const t4 = ev(c2.ctx, `(()=>{ const t=S.tribes[0]; const m=tribeMembers(t)[0]; const lone=S.agents.find(a=>!a.dead&&!a.tribeId); return {memberColor:agentColor(m), tribeColor:t.color, loneColor:lone?agentColor(lone):null, spriteHasNoHue:!agentSprite.toString().includes('hue')}; })()`);
  console.log('  colors:', JSON.stringify(t4));
  check('an agent’s drawn color equals its tribe’s color', t4.memberColor === t4.tribeColor);
  check('tribeless agents share one neutral color', t4.loneColor === '#9ca3af');
  check('agentSprite no longer uses lineage hue', t4.spriteHasNoHue === true);
  const t4b = ev(c2.ctx, `(()=>{ const t=S.tribes[0]; const m=tribeMembers(t)[0]; S.selected=m; updateSelected(); return document.getElementById('selDot').style.background; })()`);
  check('agent card dot uses the tribe color', t4b === ev(c2.ctx, `S.tribes[0].color`));
  ev(c2.ctx, `draw()`); check('draw() runs clean with tribe colors + tents', true);
  // T5: lineages have names, not numbers
  const t5 = ev(c2.ctx, `(()=>{ let ok=true; const names=new Set(); for(const a of S.agents){ const n=lineageName(a.lineage); if(!/[^0-9۰-۹]/.test(n)) ok=false; names.add(n); } updateStats(); const html=document.getElementById('lineageList').innerHTML; return {ok, distinct:names.size, det:lineageName(7)===lineageName(7)&&lineageName(7)!==lineageName(8), sample:lineageName(3), htmlHasName:html.includes('تبار «'), htmlHasNumber:/تبار [۰-۹0-9]/.test(html)}; })()`);
  console.log('  lineages:', JSON.stringify(t5));
  check('every lineage has a non-numeric Persian name', t5.ok && t5.det);
  check('lineage list shows names, never numbers', t5.htmlHasName && !t5.htmlHasNumber);
}

// ============ U. desktop scrolling (live bug vs v25) ============
console.log('\n--- U. desktop scrolling ---');
{
  const css = fs.readFileSync(__dirname + '/style.css', 'utf8');
  const appSrc = fs.readFileSync(__dirname + '/app.js', 'utf8');
  const html = fs.readFileSync(__dirname + '/index.html', 'utf8');
  // base CSS = everything outside @media blocks (brace-counting strip)
  function stripMedia(s) {
    let out = '', i = 0;
    while (i < s.length) {
      const m = s.indexOf('@media', i);
      if (m < 0) { out += s.slice(i); break; }
      out += s.slice(i, m);
      const open = s.indexOf('{', m);
      let d = 1, j = open + 1;
      while (j < s.length && d > 0) { if (s[j] === '{') d++; else if (s[j] === '}') d--; j++; }
      i = j;
    }
    return out;
  }
  const baseCss = stripMedia(css);
  const ruleFor = (src, sel) => { const m = src.match(new RegExp(sel.replace('.', '\\.') + '\\{([^}]*)\\}')); return m ? m[1] : ''; };
  const selRule = ruleFor(baseCss, '.selected');
  console.log('  .selected base:', JSON.stringify(selRule.slice(0, 120)));
  check('.selected scrolls on ALL viewports (max-height + overflow-y:auto in base rule)', selRule.includes('max-height') && selRule.includes('overflow-y:auto'));
  const tabsRule = ruleFor(baseCss, '.tabs');
  console.log('  .tabs base:', JSON.stringify(tabsRule.slice(0, 160)));
  check('.tabs keeps horizontal scroll on desktop (overflow-x:auto in base rule)', tabsRule.includes('overflow-x:auto'));
  check('.tabs scrollbar is VISIBLE on desktop (thin, not none)', tabsRule.includes('scrollbar-width:thin') && !tabsRule.includes('scrollbar-width:none'));
  const tabsScrollRule = ruleFor(baseCss, '.tabs::-webkit-scrollbar');
  check('.tabs webkit scrollbar is visible on desktop (height, not display:none)', tabsScrollRule.includes('height') && !tabsScrollRule.includes('display:none'));
  check('no hidden-scrollbar trap left in base CSS', !baseCss.includes('scrollbar-width:none') && !baseCss.includes('::-webkit-scrollbar{display:none}'));
  check('tabs scrollbar stays hidden on touch (inside a mobile media query)', css.includes('.tabs{scrollbar-width:none}'));
  const tabRule = ruleFor(baseCss, '.tab');
  check('.tab does not force full width (flex:0 0 auto + max-width + ellipsis)', tabRule.includes('flex:0 0 auto') && tabRule.includes('max-width') && tabRule.includes('text-overflow:ellipsis'));
  const panelRule = ruleFor(baseCss, '.panel');
  check('.panel itself scrolls vertically on desktop', panelRule.includes('overflow-y:auto'));
  const extRule = ruleFor(baseCss, '.extinct-inner');
  check('dialog (extinct + new-world modal) scrolls on short viewports', extRule.includes('max-height') && extRule.includes('overflow-y:auto'));
  const ovRule = ruleFor(baseCss, '.confirm-overlay');
  check('confirm overlay scrolls on short viewports', ovRule.includes('overflow-y:auto'));
  // both cards share .selected, so the one rule covers both
  const tabCount = (html.match(/class="tab[ "]/g) || []).length;
  const cardCount = (html.match(/class="selected"/g) || []).length;
  console.log('  tab buttons in index.html:', tabCount, '| .selected cards:', cardCount);
  check('all 7 tabs exist in the markup', tabCount === 7);
  check('both cards (agent + building) use .selected', cardCount === 2);
  check('wheel over the tab row scrolls it horizontally (RTL-aware handler in app.js)', appSrc.includes("querySelector('.tabs')") && appSrc.includes('tabsEl.scrollLeft') && appSrc.includes("direction==='rtl'"));
  check('clicking a tab scrolls it into view', appSrc.includes('scrollIntoView') && appSrc.includes("inline:'nearest'"));
}

// ============ V. land hunger: expansion drive, hatred over land, wars over land ============
console.log('\n--- V. land hunger ---');
{
  // V1: owned tiles GROW over a 10-day run (vs the v25 baseline of no territory system)
  const { ctx } = makeCtx(12345);
  runDays(ctx, 1);
  const tiles1 = ev(ctx, `S.tribes.reduce((s,t)=>s+tribeTiles(t),0)`);
  runDays(ctx, 2);
  const tiles3 = ev(ctx, `S.tribes.reduce((s,t)=>s+tribeTiles(t),0)`);
  runDays(ctx, 7);
  const tiles10 = ev(ctx, `S.tribes.reduce((s,t)=>s+tribeTiles(t),0)`);
  console.log('  total owned tiles day1:', tiles1, 'day3:', tiles3, 'day10:', tiles10, '| unclaimed day3:', 1728-tiles3, 'day10:', 1728-tiles10, '| tribes:', ev(ctx, `S.tribes.length`));
  check('owned tiles per tribe GROW over a 10-day run', tiles10 > tiles1 && tiles10 > 100);
  check('v25 baseline had no territory system at all', !fs.readFileSync('/home/hatch/workspace/god-sim/app-v25.js', 'utf8').includes('S.tiles'));

  // V2: expansion is gated by resources — a tribe with no wood does not expand
  const { ctx: c2 } = makeCtx(777);
  ensureTribes(c2, 1);
  const t2 = ev(c2, `S.tribes[0].id`);
  const tilesBefore2 = ev(c2, `tribeTiles(tribeById(${t2}))`);
  ev(c2, `(()=>{const t=tribeById(${t2}); t.stock.wood=0; t.stock.stone=0; t.stock.food=500; const b=tribeMembers(t).find(a=>a.age>=0.4); b.job='builder'; b.x=t.home.x; b.y=t.home.y; for(let i=0;i<200;i++){ claimStep(b,t,1,30); } })()`);
  const tilesAfter2 = ev(c2, `tribeTiles(tribeById(${t2}))`);
  console.log('  no-wood tribe tiles before/after 200 claim attempts:', tilesBefore2, '->', tilesAfter2);
  check('a tribe with no wood cannot claim new tiles (expansion costs wood; the founding blob is free)', tilesAfter2 <= tilesBefore2);

  // V3: with surplus wood + an idle builder, tiles grow (claimStep works)
  const { ctx: c3 } = makeCtx(778);
  ensureTribes(c3, 1);
  const t3 = ev(c3, `S.tribes[0].id`);
  const before3 = ev(c3, `tribeTiles(tribeById(${t3}))`);
  ev(c3, `(()=>{const t=tribeById(${t3}); t.stock.wood=500; t.stock.stone=500; const b=tribeMembers(t).find(a=>a.age>=0.4); b.job='builder'; b.x=t.home.x; b.y=t.home.y; for(let i=0;i<6000;i++){ claimStep(b,t,1/20,30); } })()`);
  const after3 = ev(c3, `tribeTiles(tribeById(${t3}))`);
  console.log('  surplus tribe tiles:', before3, '->', after3);
  check('a tribe with surplus resources and an idle builder keeps expanding', after3 > before3);

  // V4: borders meeting -> rising border tension + a land grievance, shown in the panel
  const { ctx: c4 } = makeCtx(779);
  ensureTribes(c4, 2);
  ev(c4, `(()=>{ const a=S.tribes[0], b=S.tribes[1];
    // v7: start from an empty map (like K/X1) — with big blobs + fast expansion, teleporting a home
    // into another tribe's land would leave it landless (the founding blob never steals)
    S.tribes=S.tribes.filter(t=>t.id===a.id||t.id===b.id);
    for(let i=0;i<S.tiles.length;i++) S.tiles[i]=0; S.tileCounts={};
    const dax=600-a.home.x, day=900-a.home.y, dbx=950-b.home.x, dby=900-b.home.y;
    for(const bl of S.buildings){ if(bl.tribeId===a.id){ bl.x+=dax; bl.y+=day; } if(bl.tribeId===b.id){ bl.x+=dbx; bl.y+=dby; } }
    a.home={x:600,y:900}; a.centre={x:600,y:900};
    b.home={x:950,y:900}; b.centre={x:950,y:900};
    recomputeTerritory(a); recomputeTerritory(b); updateTerritoryDistances();
    a.relations[b.id]=0; b.relations[a.id]=0; })()`);
  const dist4 = ev(c4, `territoryDist(S.tribes[0],S.tribes[1])`);
  ev(c4, `(()=>{ for(let i=0;i<12;i++) borderTensionTick(5); })()`);
  const ten4 = ev(c4, `(S.tribes[0].borderTension||{})[S.tribes[1].id]||0`);
  console.log('  territory distance:', Math.round(dist4), 'border tension after 60s:', ten4.toFixed(1));
  check('two tribes whose borders meet show rising border tension', ten4 > 20);
  const grBefore = ev(c4, `(S.tribes[0].grievance||{})[S.tribes[1].id]||0`);
  ev(c4, `(()=>{ const a=S.tribes[0], b=S.tribes[1]; a.borderTension[b.id]=60; a.landGrudgeT[b.id]=119; borderTensionTick(5); })()`); // v7: threshold is 2 days (2x dayLength=120s)
  const grAfter = ev(c4, `(S.tribes[0].grievance||{})[S.tribes[1].id]||0`);
  check('sustained border tension adds a land grievance (+2 per 2 days of tension)', grAfter >= grBefore + 2);
  const panelShows = ev(c4, `(()=>{ try{ renderCiv(); return document.getElementById('tribeDetail').innerHTML.includes('تنش مرزی'); }catch(e){ return 'ERR:'+e.message; } })()`);
  check('the tribe panel shows the per-border tension value', panelShows === true);

  // V5: a land-dispute war -> winner gains tiles, loser gains a revenge grudge, logged clearly
  const { ctx: c5 } = makeCtx(780);
  ensureTribes(c5, 2);
  ev(c5, `(()=>{ const a=S.tribes[0], b=S.tribes[1];
    // v7: start from an empty map (like V4) — teleporting into expanded territory would leave a tribe landless
    S.tribes=S.tribes.filter(t=>t.id===a.id||t.id===b.id);
    for(let i=0;i<S.tiles.length;i++) S.tiles[i]=0; S.tileCounts={};
    const dax=600-a.home.x, day=900-a.home.y, dbx=1000-b.home.x, dby=900-b.home.y;
    for(const bl of S.buildings){ if(bl.tribeId===a.id){ bl.x+=dax; bl.y+=day; } if(bl.tribeId===b.id){ bl.x+=dbx; bl.y+=dby; } }
    a.home={x:600,y:900}; a.centre={x:600,y:900};
    b.home={x:1000,y:900}; b.centre={x:1000,y:900};
    recomputeTerritory(a); recomputeTerritory(b); updateTerritoryDistances();
    a.relations[b.id]=-60; b.relations[a.id]=-60; })()`);
  setWarriors(c5, ev(c5, `S.tribes[0].id`), 3);
  setWarriors(c5, ev(c5, `S.tribes[1].id`), 3);
  const wTilesBefore = ev(c5, `tribeTiles(S.tribes[0])`);
  const lTilesBefore = ev(c5, `tribeTiles(S.tribes[1])`);
  const grLBefore = ev(c5, `(S.tribes[1].grievance||{})[S.tribes[0].id]||0`);
  ev(c5, `(()=>{ const a=S.tribes[0], b=S.tribes[1];
    const w1=tribeMembers(a).filter(x=>x.job==='warrior').slice(0,3).map(x=>x.id);
    const w2=tribeMembers(b).filter(x=>x.job==='warrior').slice(0,3).map(x=>x.id);
    const bt={id:999,t1:a.id,t2:b.id,x:0,y:0,big:false,s1:w1,s2:w2,t:0,state:'fight'};
    S.battles.push(bt); endBattle(bt,a.id); })()`);
  const wTilesAfter = ev(c5, `tribeTiles(S.tribes[0])`);
  const lTilesAfter = ev(c5, `tribeTiles(S.tribes[1])`);
  const grLAfter = ev(c5, `(S.tribes[1].grievance||{})[S.tribes[0].id]||0`);
  const spoilsLog = ev(c5, `S.__log.some(l=>l.includes('تصاحب کرد'))`);
  console.log('  war spoils: winner tiles', wTilesBefore, '->', wTilesAfter, '| loser', lTilesBefore, '->', lTilesAfter, '| loser grudge', grLBefore, '->', grLAfter);
  check('a land-dispute war transfers tiles to the winner', wTilesAfter > wTilesBefore && lTilesAfter < lTilesBefore);
  check("losing land feeds the loser's grudge for revenge", grLAfter > grLBefore);
  check('the land seizure is logged clearly', spoilsLog);

  // V6: overextension guardrails — territory has a cap, and claiming far from home costs more
  const cap6 = ev(c5, `territoryCap(S.tribes[0])`);
  const costNear = ev(c5, `claimCostAt(S.tribes[0],S.tribes[0].home.x+50,S.tribes[0].home.y)`);
  const costFar = ev(c5, `claimCostAt(S.tribes[0],S.tribes[0].home.x+700,S.tribes[0].home.y)`);
  console.log('  territory cap:', cap6, '| claim cost near home:', JSON.stringify(costNear), 'far:', JSON.stringify(costFar));
  check('territory has a large cap (population + towers) that never blocks filling the map with 4-6 tribes', cap6 >= 400 && cap6 < 2000);
  check('claiming far from home costs more than claiming near home', (costFar.wood + costFar.stone) > (costNear.wood + costNear.stone));
}

// ============ W. building decay: HP falls, builders repair, collapse, repair button ============
console.log('\n--- W. building decay ---');
{
  // W1: a building's HP falls over time with no repair (civTick drives decay; stock 0 so no upgrade/repair interferes)
  const { ctx } = makeCtx(881);
  ensureTribes(ctx, 1);
  const t = ev(ctx, `S.tribes[0].id`);
  giveBuildings(ctx, t, ['house', 'farm']);
  const w1 = ev(ctx, `(()=>{const t=tribeById(${t}); t.stock.wood=0; t.stock.stone=0; const b=S.buildings.filter(x=>x.tribeId===${t}&&x.type==='house').pop(); return {bid:b.id, hp:b.hp}; })()`);
  ev(ctx, `civTick(120)`);
  const hpAfter = ev(ctx, `(()=>{const b=S.buildings.find(x=>x.id===${w1.bid}); return b?b.hp:null; })()`);
  console.log('  house HP after 120s of decay:', w1.hp, '->', hpAfter);
  check("a building's HP falls over time with no repair", hpAfter !== null && hpAfter < w1.hp);

  // W2: a tribe with builders and resources repairs a damaged building back up
  const { ctx: c2 } = makeCtx(882);
  ensureTribes(c2, 1);
  const t2 = ev(c2, `S.tribes[0].id`);
  giveBuildings(c2, t2, ['house']);
  ev(c2, `(()=>{const t=tribeById(${t2}); t.stock.wood=500; t.stock.stone=500; const b=S.buildings.find(x=>x.tribeId===${t2}&&x.type==='house'); b.hp=10; const a=tribeMembers(t).find(x=>x.age>=0.4); a.job='builder'; a.x=b.x; a.y=b.y; for(let i=0;i<100;i++) repairStep(a,t,1,30); })()`);
  const hp2 = ev(c2, `(()=>{const b=S.buildings.find(x=>x.tribeId===${t2}&&x.type==='house'); return b.hp; })()`);
  console.log('  repaired house HP:', hp2);
  check('a tribe with builders and resources repairs a damaged building back up', hp2 > 10);

  // W3: an unrepaired building eventually collapses and is removed (house -> family homeless)
  const { ctx: c3 } = makeCtx(883);
  ensureTribes(c3, 1);
  const t3 = ev(c3, `S.tribes[0].id`);
  giveBuildings(c3, t3, ['house']);
  const houseId3 = ev(c3, `(()=>{const t=tribeById(${t3}); t.stock.wood=0; t.stock.stone=0; const b=S.buildings.filter(x=>x.tribeId===${t3}&&x.type==='house').pop(); b.hp=1;
    const f=S.families.find(x=>x.members.some(id=>{const a=S.agents.find(z=>z.id===id); return a&&a.tribeId===${t3};})); if(f){ f.houseId=b.id; b.ownerFamilyId=f.id; return {bid:b.id,fid:f.id}; } return {bid:b.id,fid:null}; })()`);
  ev(c3, `civTick(60)`); // 60 ثانیه فرسودگی — خانه‌ی ۱ جان فرو می‌ریزد (بدون جمع‌آوری منابع در این فاصله)
  const houseGone = ev(c3, `!S.buildings.some(b=>b.id===${houseId3.bid})`);
  const collapseLog = ev(c3, `S.__log.some(l=>l.includes('فرو ریخت'))`);
  console.log('  house collapsed:', houseGone, '| collapse logged:', collapseLog, '| family was:', houseId3.fid);
  check('an unrepaired building eventually collapses and is removed', houseGone);
  check('the collapse is logged (فرو ریخت)', collapseLog);
  if (houseId3.fid) {
    const famHomeless = ev(c3, `(()=>{const f=familyById(${houseId3.fid}); return f&&!f.houseId; })()`);
    check('a collapsed house leaves its family homeless', famHomeless);
  } else {
    check('a collapsed house leaves its family homeless (no family lived in the test house — skipped)', true);
  }

  // W4: the repair button restores HP, and the card shows the repair need
  const { ctx: c4 } = makeCtx(884);
  ensureTribes(c4, 1);
  const t4 = ev(c4, `S.tribes[0].id`);
  giveBuildings(c4, t4, ['house']);
  ev(c4, `(()=>{const t=tribeById(${t4}); t.stock.wood=100; t.stock.stone=100; const b=S.buildings.find(x=>x.tribeId===${t4}&&x.type==='house'); b.hp=20; S.selectedBuilding=b; updateBuildingCard(); })()`);
  const cardTxt = ev(c4, `document.getElementById('bldInfo').textContent`);
  check('the building card shows "نیاز به تعمیر" when HP is low', String(cardTxt).includes('نیاز به تعمیر'));
  const panelRep = ev(c4, `(()=>{ try{ renderCiv(); return document.getElementById('tribeDetail').innerHTML.includes('نیاز به تعمیر'); }catch(e){ return 'ERR:'+e.message; } })()`);
  check('the tribe panel lists buildings needing repair', panelRep === true);
  const hpBefore4 = ev(c4, `(()=>{const b=S.buildings.find(x=>x.tribeId===${t4}&&x.type==='house'); return b.hp; })()`);
  ev(c4, `document.getElementById('btnBuildRepair').dispatch('click')`);
  const hpAfter4 = ev(c4, `(()=>{const b=S.buildings.find(x=>x.tribeId===${t4}&&x.type==='house'); return b.hp; })()`);
  console.log('  repair button HP:', hpBefore4, '->', hpAfter4);
  check('the repair button restores HP', hpAfter4 > hpBefore4);

  // W5: a damaged building draws visibly worn (no crash, darker + crack path runs)
  const drawOk = ev(c4, `(()=>{ try{ const b=S.buildings.find(x=>x.tribeId===${t4}&&x.type==='house'); b.hp=10; drawBuilding(b); return true; }catch(e){ return 'ERR:'+e.message; } })()`);
  check('a damaged building draws without error (worn look)', drawOk === true);
}

// ============ X. roads between tribes' territories ============
console.log('\n--- X. inter-tribe roads ---');
{
  // X1: friendly tribes build a road connecting their territories
  const { ctx } = makeCtx(901);
  ensureTribes(ctx, 2);
  ev(ctx, `(()=>{ const a=S.tribes[0], b=S.tribes[1];
    // v7: keep only the two tribes under test and start from an empty map (like K) — with big
    // founding blobs, teleporting a home into another tribe's land would leave it nearly landless
    S.tribes=S.tribes.filter(t=>t.id===a.id||t.id===b.id);
    for(let i=0;i<S.tiles.length;i++) S.tiles[i]=0; S.tileCounts={};
    // v7: homes 900px apart at fixed spots — the 300px founding blobs leave a 300px unclaimed gap for the road
    const dax=600-a.home.x, day=900-a.home.y, dbx=1500-b.home.x, dby=900-b.home.y;
    for(const bl of S.buildings){ if(bl.tribeId===a.id){ bl.x+=dax; bl.y+=day; } if(bl.tribeId===b.id){ bl.x+=dbx; bl.y+=dby; } }
    a.home={x:600,y:900}; a.centre={x:600,y:900};
    b.home={x:1500,y:900}; b.centre={x:1500,y:900};
    recomputeTerritory(a); recomputeTerritory(b); updateTerritoryDistances();
    a.relations[b.id]=50; b.relations[a.id]=50;
    a.stock.wood=500; b.stock.wood=500; a.stock.stone=500; b.stock.stone=500; })()`);
  ev(ctx, `(()=>{ const a=S.tribes[0]; a.interRoadT=0; interRoadTick(a,1); })()`);
  const proj = ev(ctx, `(()=>{ const a=S.tribes[0], b=S.tribes[1]; const p=a.interRoads[b.id]; return p?{len:p.path.length,done:p.done}:null; })()`);
  console.log('  inter-road project:', JSON.stringify(proj));
  check('two friendly tribes start a road project between their territories', proj && proj.len >= 3 && !proj.done);
  ev(ctx, `(()=>{ const a=S.tribes[0]; const p=a.interRoads[S.tribes[1].id]; const builder=tribeMembers(a).find(x=>x.age>=0.4); builder.job='builder';
    for(let k=0;k<300&&!p.done;k++){ const idx=p.path[p.next]; if(idx==null) break; const cx=(idx%TW)*TILE+TILE/2, cy=Math.floor(idx/TW)*TILE+TILE/2; builder.x=cx; builder.y=cy; interRoadStep(builder,a,3,30); }
  })()`);
  const done = ev(ctx, `(()=>{ const a=S.tribes[0], b=S.tribes[1]; return !!(a.interRoads[b.id]&&a.interRoads[b.id].done); })()`);
  const roadLog = ev(ctx, `S.__log.some(l=>l.includes('جاده‌ای بین'))`);
  console.log('  inter-road done:', done, '| logged:', roadLog);
  check('the road gets built and completes (logged)', done && roadLog);
  const cont = ev(ctx, `(()=>{ const a=S.tribes[0], b=S.tribes[1]; const p=a.interRoads[b.id]; return p.path.every(idx=>S.roads[idx]===1||S.tiles[idx]!==0); })()`);
  check('the road is a continuous path of road tiles from one border to the other', cont);

  // X2: traders between road-connected tribes turn around faster (more frequent trade)
  const { ctx: c2 } = makeCtx(902);
  ensureTribes(c2, 2);
  ev(c2, `(()=>{ const a=S.tribes[0], b=S.tribes[1];
    for(const t of [a,b]){ for(const tc of TECHS) t.techs[tc.id]=true; t.stock.wood=500; t.stock.stone=500; }
    a.stock.food=200; b.stock.food=5; b.stock.coins=100; a.relations[b.id]=50; b.relations[a.id]=50;
    a.interRoads[b.id]={path:[],next:0,done:true}; b.interRoads[a.id]={path:[],next:0,done:true}; })()`);
  giveBuildings(c2, ev(c2, `S.tribes[0].id`), ['market']);
  giveBuildings(c2, ev(c2, `S.tribes[1].id`), ['market']);
  const tradeT = ev(c2, `(()=>{ const a=S.tribes[0], b=S.tribes[1];
    const tr=tribeMembers(a).find(x=>x.age>=0.4); tr.job='trader'; tr.tradeDest=b.id; tr.tradeGood='food';
    const dm=S.buildings.find(x=>x.tribeId===b.id&&x.type==='market'); tr.x=dm.x; tr.y=dm.y;
    traderStep(tr,a,1,30,0.5); return tr.tradeT; })()`);
  const traded = ev(c2, `S.tradeCount>0`);
  console.log('  trader turnaround after a road trade:', tradeT, '| trade happened:', traded);
  check('traders between road-connected tribes turn around faster (tradeT 6, not 12)', tradeT === 6 && traded);

  // X3: in war, the road between the warring tribes is cut
  const cut = ev(ctx, `(()=>{ const a=S.tribes[0], b=S.tribes[1];
    const before=S.roads.filter(x=>x===1).length;
    for(const t of [a,b]){ const ms=tribeMembers(t).filter(x=>x.age>=0.4).slice(0,3); for(const m of ms){ m.job='warrior'; m.equip={weapon:'club',shield:null,armor:null}; } }
    const war=declareWar(a,b,false);
    const after=S.roads.filter(x=>x===1).length;
    return {war:!!war, before, after, cutLog:S.__log.some(l=>l.includes('قطع شد')), hasRoad:hasInterRoad(a,b)}; })()`);
  console.log('  war cut:', JSON.stringify(cut));
  check('declaring war cuts the inter-tribe road (tiles cleared, record gone, logged)', cut.war && cut.after < cut.before && !cut.hasRoad && cut.cutLog);

  // X4: hostile tribes do NOT build roads to each other
  const { ctx: c4 } = makeCtx(903);
  ensureTribes(c4, 2);
  ev(c4, `(()=>{ const a=S.tribes[0], b=S.tribes[1];
    b.home.x=a.home.x+500; b.home.y=a.home.y; b.centre={x:b.home.x,y:b.home.y};
    recomputeTerritory(a); recomputeTerritory(b); updateTerritoryDistances();
    a.relations[b.id]=-50; b.relations[a.id]=-50; a.stock.wood=500; a.interRoadT=0; interRoadTick(a,1); })()`);
  const noProj = ev(c4, `(()=>{ const a=S.tribes[0], b=S.tribes[1]; return !a.interRoads[b.id]; })()`);
  check('hostile tribes (at war or very negative relations) do NOT build roads to each other', noProj);
}

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);

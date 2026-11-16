// v7 harness: v28 — (1) isometric 3D fully removed, 2D only; (2) massive land claiming:
// founding blob ~100 free tiles, cluster claiming, big cap -> almost no unclaimed land.
// Head (makeCtx/ev/runDays/ensureTribes/...) is copied from v5-harness.js.
const fs = require('fs');
const head = fs.readFileSync('/home/hatch/workspace/god-sim/v5-harness.js', 'utf8')
  .split('// ============ A. alliances')[0];
eval(head + `
console.log('\\n--- T1. isometric removed completely ---');
{
  const appSrc = fs.readFileSync('/home/hatch/workspace/god-sim/app.js', 'utf8');
  const html = fs.readFileSync('/home/hatch/workspace/god-sim/index.html', 'utf8');
  const css = fs.readFileSync('/home/hatch/workspace/god-sim/style.css', 'utf8');
  check('app.js has no Iso3D/isoDraw/isoPick references', !/Iso3D|isoDraw|isoPick/.test(appSrc));
  check('app.js has no view-switch code (S.view / switchView / applyView / godsim-view)', !/S\\.view|switchView|applyView|godsim-view/.test(appSrc));
  check('app.js has no btnView / canvas3d references', !/btnView|canvas3d/.test(appSrc));
  check('index.html loads only style.css + app.js (no three/iso3d script)', !/three|iso3d/.test(html) && /app\\.js\\?v=28/.test(html) && /style\\.css\\?v=28/.test(html));
  check('index.html has no world3d canvas and no view-toggle button', !/world3d|btnView|view-toggle/.test(html));
  check('style.css has no world3d / view-toggle rules', !/world3d|view-toggle/.test(css));
  check('iso3d.js is deleted from the repo dir', !fs.existsSync('/home/hatch/workspace/god-sim/iso3d.js'));
  check('three.min.js is deleted from the repo dir', !fs.existsSync('/home/hatch/workspace/god-sim/three.min.js'));
  check('v6 (iso) harness is deleted', !fs.existsSync('/home/hatch/workspace/god-sim/v6-harness.js'));
  const { ctx } = makeCtx(777);
  ev(ctx, 'draw()');
  check('draw() runs clean in 2D-only mode', true);
}

console.log('\\n--- T2. founding blob: a new tribe claims a lot of land immediately ---');
{
  const { ctx } = makeCtx(777);
  // record the blob size at the exact moment of formation (before any expansion ticks):
  // measuring after ensureTribes() would include days of expandTick/builder expansion
  ev(ctx, \`S.__blobSize=null; S.__origFT=foundTribe; foundTribe=function(a){ const t=S.__origFT(a); if(t&&S.__blobSize===null) S.__blobSize=tribeTiles(t); return t; };\`);
  const ids = ensureTribes(ctx, 1);
  const t0 = ev(ctx, 'S.__blobSize');
  console.log('  tiles at formation:', t0);
  check('a forming tribe claims a large free blob (>= 60 tiles)', t0 !== null && t0 >= 60);
  check('the blob is bounded (~100 tiles, not the whole map)', t0 !== null && t0 <= 120);
  // the blob must not steal from an existing tribe: force a second founding next to the first
  const before = ev(ctx, 'tribeTiles(S.tribes[0])');
  ev(ctx, \`(()=>{let c=0; for(const o of S.agents){ if(c>=10) break; if(!o.dead&&!o.tribeId&&o.age>=0.4){ o.x=S.tribes[0].home.x+350+Math.random()*80; o.y=S.tribes[0].home.y+Math.random()*80; o.foundCd=0; o.loyalty=80; c++; } }
    const lead=S.agents.find(x=>!x.dead&&!x.tribeId&&x.age>=0.4); if(lead){ lead.genes.aggression=0.9; lead.genes.cooperation=0.9; lead.genes.size=0.9; lead.knowledge=0.9; lead.foundCd=0; lead.x=S.tribes[0].home.x+350; lead.y=S.tribes[0].home.y; } })()\`);
  const t2id = ev(ctx, '(()=>{const a=S.agents.find(x=>!x.dead&&!x.tribeId&&x.age>=0.4&&leadershipOf(x)>=0.6); const t=a?foundTribe(a):null; return t?t.id:null; })()');
  const after = ev(ctx, 'tribeTiles(S.tribes[0])');
  console.log('  second tribe formed:', t2id, '| first tribe tiles before/after:', before, '->', after);
  check('a neighbouring founding still succeeds', t2id !== null);
  check('formation never steals tiles from an existing tribe', after >= before);
  if (t2id !== null) {
    const t2tiles = ev(ctx, 'tribeTiles(tribeById(' + t2id + '))');
    check('the second tribe also gets land (whatever pocket was left)', t2tiles > 0);
  }
}

console.log('\\n--- T3. the map fills: almost no unclaimed land within a few days ---');
{
  const { ctx } = makeCtx(12345);
  const unclaimed = () => ev(ctx, 'S.tiles.reduce((s,v)=>s+(v===0?1:0),0)');
  const tribes = () => ev(ctx, 'S.tribes.length');
  runDays(ctx, 1);
  const u1 = unclaimed(), tr1 = tribes();
  runDays(ctx, 2);
  const u3 = unclaimed(), tr3 = tribes();
  runDays(ctx, 2);
  const u5 = unclaimed(), tr5 = tribes();
  console.log('  unclaimed tiles day1:', u1, 'day3:', u3, 'day5:', u5, 'of 1728 | tribes day1/3/5:', tr1, tr3, tr5);
  check('several tribes exist by day 5', tr5 >= 4);
  check('unclaimed land is under 5% of the map by day 5 (< 86 of 1728 tiles)', u5 < 86);
  check('the map keeps filling (day5 < day1)', u5 < u1);
}

console.log('\\n--- T4. late formation on a nearly-full map ---');
{
  const { ctx } = makeCtx(777);
  ensureTribes(ctx, 1);
  // keep only tribe 1 and move its home to the far corner (400,400), so the max-min home picker
  // of a late founder favours the opposite corner, where the unclaimed pocket is
  ev(ctx, \`(()=>{ const t=S.tribes[0]; S.tribes=[t];
    const dx=400-t.home.x, dy=400-t.home.y;
    for(const bl of S.buildings) if(bl.tribeId===t.id){ bl.x+=dx; bl.y+=dy; }
    t.home={x:400,y:400}; t.centre={x:400,y:400};
    recomputeTerritory(t); })()\`);
  const firstId = ev(ctx, 'S.tribes[0].id');
  const firstBefore = ev(ctx, 'tribeTiles(S.tribes[0])');
  // fill the whole map with tribe 1 except a 12x9 pocket at the far corner, then found a tribe there
  ev(ctx, \`(()=>{ const t=S.tribes[0];
    for(let i=0;i<S.tiles.length;i++){ const tx=i%TW, ty=Math.floor(i/TW); if(tx>=36&&ty>=27) continue; if(S.tiles[i]===0) claimTile(tx,ty,t.id); }
    let c=0; for(const o of S.agents){ if(c>=10) break; if(!o.dead&&!o.tribeId&&o.age>=0.4){ o.x=2100+Math.random()*150; o.y=1575+Math.random()*100; o.foundCd=0; o.loyalty=80; c++; } }
    const lead=S.agents.find(x=>!x.dead&&!x.tribeId&&x.age>=0.4); if(lead){ lead.genes.aggression=0.9; lead.genes.cooperation=0.9; lead.genes.size=0.9; lead.knowledge=0.9; lead.foundCd=0; lead.x=2100; lead.y=1575; } })()\`);
  const t2id = ev(ctx, '(()=>{const a=S.agents.find(x=>!x.dead&&!x.tribeId&&x.age>=0.4&&leadershipOf(x)>=0.6); const t=a?foundTribe(a):null; return t?t.id:null; })()');
  const firstAfter = ev(ctx, 'tribeTiles(tribeById(' + firstId + '))');
  console.log('  late tribe formed:', t2id, '| first tribe tiles before/after:', firstBefore, '->', firstAfter);
  check('a tribe can still form when the map is nearly full', t2id !== null);
  check('late formation does not steal from the established tribe', firstAfter >= firstBefore);
  if (t2id !== null) {
    const t2tiles = ev(ctx, 'tribeTiles(tribeById(' + t2id + '))');
    console.log('  late tribe tiles (leftover pocket, blob-capped):', t2tiles);
    check('the late tribe gets the leftover pocket (non-zero, at most the ~100-tile blob)', t2tiles > 0 && t2tiles <= 120);
  }
}

console.log('\\n--- T5. wars still transfer land ---');
{
  const { ctx } = makeCtx(780);
  ensureTribes(ctx, 2);
  ev(ctx, \`(()=>{ const a=S.tribes[0], b=S.tribes[1];
    // v7: start from an empty map — with big blobs + fast expansion, teleporting a home
    // into another tribe's land would leave it landless (the founding blob never steals)
    S.tribes=S.tribes.filter(t=>t.id===a.id||t.id===b.id);
    for(let i=0;i<S.tiles.length;i++) S.tiles[i]=0; S.tileCounts={};
    const dax=600-a.home.x, day=900-a.home.y, dbx=1000-b.home.x, dby=900-b.home.y;
    for(const bl of S.buildings){ if(bl.tribeId===a.id){ bl.x+=dax; bl.y+=day; } if(bl.tribeId===b.id){ bl.x+=dbx; bl.y+=dby; } }
    a.home={x:600,y:900}; a.centre={x:600,y:900};
    b.home={x:1000,y:900}; b.centre={x:1000,y:900};
    recomputeTerritory(a); recomputeTerritory(b); updateTerritoryDistances();
    a.relations[b.id]=-60; b.relations[a.id]=-60; })()\`);
  setWarriors(ctx, ev(ctx, 'S.tribes[0].id'), 3);
  setWarriors(ctx, ev(ctx, 'S.tribes[1].id'), 3);
  const wBefore = ev(ctx, 'tribeTiles(S.tribes[0])');
  const lBefore = ev(ctx, 'tribeTiles(S.tribes[1])');
  ev(ctx, \`(()=>{ const a=S.tribes[0], b=S.tribes[1];
    const w1=tribeMembers(a).filter(x=>x.job==='warrior').slice(0,3).map(x=>x.id);
    const w2=tribeMembers(b).filter(x=>x.job==='warrior').slice(0,3).map(x=>x.id);
    const bt={id:999,t1:a.id,t2:b.id,x:0,y:0,big:false,s1:w1,s2:w2,t:0,state:'fight'};
    S.battles.push(bt); endBattle(bt,a.id); })()\`);
  const wAfter = ev(ctx, 'tribeTiles(S.tribes[0])');
  const lAfter = ev(ctx, 'tribeTiles(S.tribes[1])');
  console.log('  war spoils: winner', wBefore, '->', wAfter, '| loser', lBefore, '->', lAfter);
  check('the war winner still gains tiles', wAfter > wBefore);
  check('the war loser still loses tiles', lAfter < lBefore);
}

console.log('\\n--- T6. war rate sanity: full borders must not mean permanent world war ---');
{
  const { ctx } = makeCtx(12345);
  ev(ctx, 'S.__wars=0; S.__ow=declareWar; declareWar=function(t,o,a){ const r=S.__ow(t,o,a); if(r) S.__wars++; return r; };');
  runDays(ctx, 5);
  const wars = ev(ctx, 'S.__wars');
  const tribes = ev(ctx, 'S.tribes.length');
  console.log('  wars declared in 5 days:', wars, '| tribes:', tribes);
  check('wars happen but not constantly (fewer than 40 declarations in 5 days)', wars < 40);
}

console.log('\\n--- T7. recompute keeps connected expansion, drops cut-off exclaves ---');
{
  const { ctx } = makeCtx(777);
  ensureTribes(ctx, 1);
  const tid = ev(ctx, 'S.tribes[0].id');
  // expand the tribe far beyond its blob via direct claims, then destroy a building inside the blob:
  // the expansion must survive (it is connected to home)
  ev(ctx, \`(()=>{ const t=tribeById(\${tid});
    const c=tileAt(t.home.x,t.home.y);
    for(let dx=0;dx<10;dx++) for(let dy=0;dy<2;dy++){ const i=tileIndex(c.tx+dx,c.ty+dy); if(S.tiles[i]===0) claimTile(c.tx+dx,c.ty+dy,t.id); } })()\`);
  const expanded = ev(ctx, 'tribeTiles(tribeById(' + tid + '))');
  giveBuildings(ctx, tid, ['house']);
  ev(ctx, \`(()=>{ const b=S.buildings.find(x=>x.tribeId===\${tid}&&x.type==='house'); if(b) destroyBuilding(b,null); })()\`);
  const afterDestroy = ev(ctx, 'tribeTiles(tribeById(' + tid + '))');
  console.log('  tiles after manual expansion:', expanded, '| after destroying a house inside the blob:', afterDestroy);
  check('destroying a building no longer wipes the connected expansion (v5 bug: full reset)', afterDestroy >= expanded - 5);
  // a disconnected exclave drops when its building is destroyed
  ev(ctx, \`(()=>{ const t=tribeById(\${tid}); const dir=t.home.x>1200?-1:1; const b=newBuilding(t.id,'castle',t.home.x+dir*700,t.home.y,null); b.progress=100; S.buildings.push(b); claimForBuilding(b); })()\`);
  const withCastle = ev(ctx, 'tribeTiles(tribeById(' + tid + '))');
  ev(ctx, \`(()=>{ const b=S.buildings.find(x=>x.tribeId===\${tid}&&x.type==='castle'); if(b) destroyBuilding(b,null); })()\`);
  const afterCastle = ev(ctx, 'tribeTiles(tribeById(' + tid + '))');
  console.log('  tiles with far castle exclave:', withCastle, '| after destroying it:', afterCastle);
  check('a cut-off castle exclave is unclaimed when the castle falls', afterCastle < withCastle);
}

console.log('\\n--- T8. save/load keeps the territory ---');
{
  const { ctx } = makeCtx(777);
  ensureTribes(ctx, 1);
  runDays(ctx, 1);
  const before = ev(ctx, 'S.tribes.reduce((s,t)=>s+tribeTiles(t),0)');
  ev(ctx, \`document.getElementById('btnSave').dispatch('click')\`);
  ev(ctx, 'resetWorld(120)');
  const cleared = ev(ctx, 'S.tribes.reduce((s,t)=>s+tribeTiles(t),0)');
  const loaded = ev(ctx, \`(()=>{ document.getElementById('btnLoad').dispatch('click'); return S.tribes.reduce((s,t)=>s+tribeTiles(t),0); })()\`);
  console.log('  owned tiles before save:', before, '| after reset:', cleared, '| after load:', loaded);
  check('territory survives a save/load round-trip', loaded === before && cleared < before);
}

console.log('\\n' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
`);

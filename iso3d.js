/* iso3d.js — نمای ایزومتریک سه‌بعدی برای خدای جهان کوچک (v27)
   Three.js r149 (فایل محلی three.min.js — بدون CDN) با دوربین ارتوسکوپیک
   در زاویه‌ی کلاسیک ایزومتریک. استایل low-poly، رنگ‌های گرم هماهنگ با پالت دوبعدی.
   این فایل هیچ‌کدام از متغیرهای app.js را در زمان بارگذاری لمس نمی‌کند —
   همه‌چیز تنبل است: init() اولین بار از draw() صدا زده می‌شود.
   اگر THREE نباشد یا WebGL خراب باشد، init() false برمی‌گرداند و بازی
   خودکار به رندر دوبعدی برمی‌گردد. منطق شبیه‌سازی اینجا نیست — فقط رندر.
   مختصات: جهان دوبعدی (x,y) ← سه‌بعدی (x, 0, y)؛ محور Y بالاست. */
(function(){
'use strict';
var BG=0x0a2018;            // پس‌زمینه‌ی تیره‌ی هماهنگ با گرادیان دوبعدی
var ISO_F=0.62;             // ضریب ارتفاع دید ایزومتریک نسبت به نمای دوبعدی
var renderer=null, scene=null, camera=null, raycaster=null;
var ready=false, failed=false, frame=0;
var lastW=0, lastH=0, lastDpr=0;
var _d=null, _c=null, _plane=null, _hit=null;
var tileMesh=null, trunkMesh=null, topMesh=null, stoneMesh=null, foodMesh=null;
var agentBodyMesh=null, agentHeadMesh=null, animalBodyMesh=null, animalHeadMesh=null;
var boxMesh=null, roofMesh=null, towerBodyMesh=null, towerTopMesh=null, tentMesh=null;
var crownBandMesh=null, crownSpikeMesh=null, partMesh=null;
var flagPoleMesh=null, flagMesh=null;
var selRing=null, visRing=null, battleRings=[];

function hex(h){ return new THREE.Color(h); }
function shade(hexCol, f){ var c=new THREE.Color(hexCol); c.multiplyScalar(f); return c; }

function makeInstanced(geo, mat, count){
  var m=new THREE.InstancedMesh(geo, mat, count);
  m.frustumCulled=false; m.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  scene.add(m); return m;
}
function put(mesh, i, x, y, z, ry, sx, sy, sz, color){
  _d.position.set(x, y, z); _d.rotation.set(0, ry||0, 0); _d.scale.set(sx, sy, sz);
  _d.updateMatrix(); mesh.setMatrixAt(i, _d.matrix);
  if(color!==undefined){ _c.set(color); mesh.setColorAt(i, _c); }
}
function setCount(mesh, n){ mesh.count=n; mesh.instanceMatrix.needsUpdate=true; if(mesh.instanceColor) mesh.instanceColor.needsUpdate=true; }

function init(){
  if(ready) return true;
  if(failed) return false;
  if(typeof THREE==='undefined'){ failed=true; return false; }
  try{
    var cv=document.getElementById('world3d');
    if(!cv){ failed=true; return false; }
    _d=new THREE.Object3D(); _c=new THREE.Color();
    _plane=new THREE.Plane(new THREE.Vector3(0,1,0), 0);
    _hit=new THREE.Vector3();
    raycaster=new THREE.Raycaster();
    renderer=new THREE.WebGLRenderer({canvas:cv, antialias:true});
    renderer.setPixelRatio(Math.min(1.5, window.devicePixelRatio||1));
    renderer.setClearColor(BG, 1);
    if('outputEncoding' in renderer && THREE.sRGBEncoding) renderer.outputEncoding=THREE.sRGBEncoding;
    scene=new THREE.Scene();
    scene.background=new THREE.Color(BG);
    camera=new THREE.OrthographicCamera(-1, 1, 1, -1, 1, 6000);
    scene.add(new THREE.HemisphereLight(0xcfe8ff, 0x3f7a44, 0.95));
    var sun=new THREE.DirectionalLight(0xfff2d9, 0.85);
    sun.position.set(800, 1500, 600); scene.add(sun);
    var lam=function(){ return new THREE.MeshLambertMaterial({color:0xffffff}); };
    var basic=function(op){ return new THREE.MeshBasicMaterial({color:0xffffff, transparent:!!op, opacity:op||1, side:THREE.DoubleSide}); };
    tileMesh   =makeInstanced(new THREE.BoxGeometry(TILE, 3, TILE), lam(), TW*TH);
    trunkMesh  =makeInstanced(new THREE.CylinderGeometry(2, 3, 8, 5), lam(), 200);
    topMesh    =makeInstanced(new THREE.ConeGeometry(9, 20, 6), lam(), 200);
    stoneMesh  =makeInstanced(new THREE.DodecahedronGeometry(7, 0), lam(), 100);
    foodMesh   =makeInstanced(new THREE.IcosahedronGeometry(5, 0), lam(), 800);
    agentBodyMesh=makeInstanced(new THREE.CapsuleGeometry(5, 7, 2, 8), lam(), 600);
    agentHeadMesh=makeInstanced(new THREE.SphereGeometry(4, 8, 6), lam(), 600);
    animalBodyMesh=makeInstanced(new THREE.SphereGeometry(1, 8, 6), lam(), 64);
    animalHeadMesh=makeInstanced(new THREE.SphereGeometry(1, 8, 6), lam(), 64);
    boxMesh    =makeInstanced(new THREE.BoxGeometry(1, 1, 1), lam(), 400);
    roofMesh   =makeInstanced(new THREE.ConeGeometry(1, 1, 4), lam(), 400);
    towerBodyMesh=makeInstanced(new THREE.CylinderGeometry(7, 8, 26, 6), lam(), 64);
    towerTopMesh=makeInstanced(new THREE.CylinderGeometry(9.5, 9.5, 4, 6), lam(), 64);
    tentMesh   =makeInstanced(new THREE.ConeGeometry(1, 1, 4), lam(), 64);
    crownBandMesh =makeInstanced(new THREE.CylinderGeometry(5.5, 5.5, 3, 8), lam(), 12);
    crownSpikeMesh=makeInstanced(new THREE.ConeGeometry(1.8, 5, 4), lam(), 36);
    partMesh   =makeInstanced(new THREE.SphereGeometry(2, 6, 4), basic(), 300);
    flagPoleMesh=makeInstanced(new THREE.CylinderGeometry(1, 1, 42, 5), basic(), 12);
    var tri=new THREE.Shape(); tri.moveTo(0,0); tri.lineTo(0,10); tri.lineTo(16,5); tri.closePath();
    flagMesh   =makeInstanced(new THREE.ShapeGeometry(tri), basic(), 12);
    selRing=new THREE.Mesh(new THREE.RingGeometry(0.9, 1, 40), new THREE.MeshBasicMaterial({color:0xfbbf24, transparent:true, opacity:0.95, side:THREE.DoubleSide}));
    selRing.rotation.x=-Math.PI/2; selRing.visible=false; scene.add(selRing);
    visRing=new THREE.Mesh(new THREE.RingGeometry(0.97, 1, 48), new THREE.MeshBasicMaterial({color:0xffffff, transparent:true, opacity:0.22, side:THREE.DoubleSide}));
    visRing.rotation.x=-Math.PI/2; visRing.visible=false; scene.add(visRing);
    for(var i=0;i<6;i++){
      var br=new THREE.Mesh(new THREE.RingGeometry(20, 26, 32), new THREE.MeshBasicMaterial({color:0xf43f5e, transparent:true, opacity:0.8, side:THREE.DoubleSide}));
      br.rotation.x=-Math.PI/2; br.visible=false; scene.add(br); battleRings.push(br);
    }
    // زمین: موقعیت کاشی‌ها ثابت است — یک بار چیده می‌شوند، فقط رنگشان به‌روز می‌شود
    var ti=0;
    for(var ty=0; ty<TH; ty++) for(var tx=0; tx<TW; tx++){
      put(tileMesh, ti, tx*TILE+TILE/2, -1.5, ty*TILE+TILE/2, 0, 1, 1, 1, 0x3f7a44); ti++;
    }
    setCount(tileMesh, TW*TH);
    paintTiles();
    ready=true; return true;
  }catch(e){ failed=true; renderer=null; return false; }
}

function available(){ return (typeof THREE!=='undefined') && !failed; }

function syncCamera(){
  var cx=CAM.x+(VW/CAM.zoom)/2, cz=CAM.y+(VH/CAM.zoom)/2;
  var halfH=(VH/CAM.zoom)*ISO_F, halfW=halfH*(VW/VH);
  camera.left=-halfW; camera.right=halfW; camera.top=halfH; camera.bottom=-halfH;
  camera.updateProjectionMatrix();
  var D=3000, k=0.57735026919; // 1/√3 — جهت ایزومتریک کلاسیک (35.26°، آزیموت 45°)
  camera.position.set(cx+D*k, D*k, cz+D*k);
  camera.lookAt(cx, 0, cz);
}

function grassColor(i){
  var h=(i*2654435761)%3;
  return h===0?0x3f7a44:(h===1?0x47854a:0x38703e);
}
function paintTiles(){
  if(!S.tiles) return;
  var grass=new THREE.Color(), tc=new THREE.Color();
  for(var i=0;i<TW*TH;i++){
    var col=grassColor(i);
    if(S.roads&&S.roads[i]){ col=0x7a5c2e; }
    else if(S.tiles[i]){
      var tr=tribeById(S.tiles[i]);
      if(tr){ tc.set(tr.color); grass.set(col); tc.lerp(grass, 0.5); col='#'+tc.getHexString(); }
    }
    _c.set(col); tileMesh.setColorAt(i, _c);
  }
  tileMesh.instanceColor.needsUpdate=true;
}

var BLD3D={
  house:{c:0xb45309,w:22,h:14,d:18,roof:9}, farm:{c:0x16a34a,w:26,h:4,d:14},
  pasture:{c:0x65a30d,w:26,h:3,d:18}, school:{c:0x2563eb,w:22,h:16,d:18,roof:9},
  university:{c:0x7c3aed,w:24,h:18,d:18,roof:9}, hospital:{c:0xf8fafc,w:22,h:14,d:18,roof:9},
  clinic:{c:0xf8fafc,w:20,h:12,d:16,roof:8}, market:{c:0xf59e0b,w:24,h:12,d:20,roof:8},
  workshop:{c:0x78716c,w:22,h:12,d:18,roof:8}, smithy:{c:0x475569,w:22,h:12,d:18,roof:8},
  armory:{c:0x475569,w:22,h:12,d:18,roof:8}, wall:{c:0x94a3b8,w:20,h:8,d:10},
  barracks:{c:0xb91c1c,w:24,h:14,d:18,roof:9}, castle:{c:0x7c2d12,w:30,h:22,d:30,roof:10},
  command:{c:0x0ea5e9,w:24,h:14,d:18,roof:9}, bakery:{c:0xd97706,w:22,h:12,d:18,roof:8},
  granary:{c:0xeab308,w:22,h:16,d:18,roof:9}, butcher:{c:0x991b1b,w:22,h:12,d:18,roof:8},
  library:{c:0x4f46e5,w:22,h:14,d:18,roof:9}, inn:{c:0x0d9488,w:22,h:12,d:18,roof:8}
};
function updateBuildings(){
  var bi=0, ri=0, ti=0, twi=0, tei=0;
  var bs=S.buildings;
  for(var k=0;k<bs.length;k++){
    var b=bs[k]; if(bi>=400) break;
    if(b.type==='tower'){
      if(twi<64){
        var frac=(b.hp!=null&&b.maxHp)?b.hp/b.maxHp:1;
        put(towerBodyMesh, twi, b.x, 13, b.y, 0, 1, 1, 1, frac<0.5?0x4b5a6b:0x64748b);
        put(towerTopMesh, twi, b.x, 28, b.y, 0, 1, 1, 1, 0x334155); twi++;
      }
      continue;
    }
    if(b.type==='tent'){
      if(tei<64){ put(tentMesh, tei, b.x, 8, b.y, Math.PI/4, 13, 16, 13, 0xd97706); tei++; }
      continue;
    }
    var def=BLD3D[b.type]||{c:0x94a3b8,w:22,h:12,d:18,roof:8};
    var lvl=1+((b.level||1)-1)*0.12;
    var hs=(b.progress<100)?(0.3+0.7*(b.progress||0)/100):1;
    var frac2=(b.hp!=null&&b.maxHp)?b.hp/b.maxHp:1;
    var col=def.c;
    if(frac2<0.5) col=shade(col, 0.6).getHex();
    put(boxMesh, bi, b.x, (def.h*lvl*hs)/2, b.y, 0, def.w*lvl, def.h*lvl*hs, def.d*lvl, col);
    bi++;
    if(def.roof && ri<400){
      var rw=def.w*lvl*0.51, rd=def.d*lvl*0.51;
      put(roofMesh, ri, b.x, def.h*lvl*hs+def.roof*lvl/2, b.y, Math.PI/4, rw, def.roof*lvl, rd, shade(def.c, 0.55).getHex());
      ri++;
    }
  }
  setCount(boxMesh, bi); setCount(roofMesh, ri); setCount(towerBodyMesh, twi); setCount(towerTopMesh, twi); setCount(tentMesh, tei);
}

function updateAgents(){
  var n=Math.min(S.agents.length, 600);
  for(var i=0;i<n;i++){
    var a=S.agents[i];
    var s=(5+a.genes.size*7)/8.5;
    var col=agentColor(a);
    if(typeof coatIsDark!=='undefined'&&coatIsDark(a)) col=shade(col, 0.45).getHex();
    if(a.plague>0) col=shade(col, 0.7).getHex();
    put(agentBodyMesh, i, a.x, 8.5*s, a.y, 0, s, s, s, col);
    put(agentHeadMesh, i, a.x, 20*s, a.y, 0, s, s, s, shade(col, 1.25).getHex());
  }
  setCount(agentBodyMesh, n); setCount(agentHeadMesh, n);
}

var ANIMAL3D={
  sheep:{c:0xf8fafc, s:[9,6,6], hy:6, hs:3.5, hf:9, hy2:8},
  cow:{c:0x92400e, s:[11,7,7], hy:6, hs:4, hf:11, hy2:9},
  wolf:{c:0x64748b, s:[10,5.5,5.5], hy:6, hs:3.5, hf:10, hy2:8},
  bear:{c:0x78350f, s:[12,8,8], hy:8, hs:5, hf:11, hy2:10}
};
function updateAnimals(){
  var n=0;
  for(var i=0;i<S.animals.length&&n<64;i++){
    var an=S.animals[i]; if(an.dead) continue;
    var def=ANIMAL3D[an.kind]||ANIMAL3D.sheep;
    var ang=an.angle||0;
    put(animalBodyMesh, n, an.x, def.hy, an.y, -ang, def.s[0], def.s[1], def.s[2], def.c);
    put(animalHeadMesh, n, an.x+Math.cos(ang)*def.hf, def.hy2, an.y+Math.sin(ang)*def.hf, 0, def.hs, def.hs, def.hs, shade(def.c, 0.8).getHex());
    n++;
  }
  setCount(animalBodyMesh, n); setCount(animalHeadMesh, n);
}

function updateStatics(){
  var i, t;
  var nt=Math.min(S.trees.length, 200);
  for(i=0;i<nt;i++){
    t=S.trees[i]; var s=t.sapling?0.55:1;
    put(trunkMesh, i, t.x, 4*s, t.y, 0, s, s, s, 0x7c4a21);
    put(topMesh, i, t.x, 18*s, t.y, 0, s, s, s, t.sapling?0x4ade80:0x16a34a);
  }
  setCount(trunkMesh, nt); setCount(topMesh, nt);
  var ns=Math.min(S.stones.length, 100);
  for(i=0;i<ns;i++){
    var st=S.stones[i], rot=(i*2.399)%Math.PI, ss=0.8+((i*2654435761)%100)/100*0.5;
    put(stoneMesh, i, st.x, 3, st.y, rot, ss, ss*0.8, ss, 0x94a3b8);
  }
  setCount(stoneMesh, ns);
  var nf=Math.min(S.foods.length, 800);
  for(i=0;i<nf;i++){
    var f=S.foods[i];
    put(foodMesh, i, f.x, 5, f.y, 0, 1, 1, 1, 0xef4444);
  }
  setCount(foodMesh, nf);
}

function updateCrowns(){
  var ci=0, si=0;
  for(var k=0;k<S.tribes.length&&ci<12;k++){
    var tr=S.tribes[k];
    var chief=S.agents.find(function(x){ return x.id===tr.chiefId&&!x.dead; });
    if(!chief) continue;
    var s=(5+chief.genes.size*7)/8.5;
    var cy=20*s+6;
    put(crownBandMesh, ci, chief.x, cy, chief.y, 0, 1, 1, 1, 0xfbbf24);
    for(var j=0;j<3&&si<36;j++){
      var ang=j*(Math.PI*2/3);
      put(crownSpikeMesh, si, chief.x+Math.cos(ang)*3.5, cy+4, chief.y+Math.sin(ang)*3.5, 0, 1, 1, 1, 0xfbbf24);
      si++;
    }
    ci++;
  }
  setCount(crownBandMesh, ci); setCount(crownSpikeMesh, si);
}

function updateFlags(){
  var n=Math.min(S.tribes.length, 12);
  for(var i=0;i<n;i++){
    var t=S.tribes[i];
    put(flagPoleMesh, i, t.centre.x, 21, t.centre.y, 0, 1, 1, 1, 0xd6d3d1);
    put(flagMesh, i, t.centre.x+2, 33, t.centre.y, 0, 1, 1, 1, t.color);
  }
  setCount(flagPoleMesh, n); setCount(flagMesh, n);
}

function updateBattles(){
  for(var i=0;i<battleRings.length;i++){
    var br=battleRings[i];
    if(i<S.battles.length){
      var bt=S.battles[i];
      br.visible=true; br.position.set(bt.x, 1.5, bt.y);
      var p=1+Math.sin(S.elapsed*4)*0.15; br.scale.set(p, p, 1);
    } else br.visible=false;
  }
}

function updateSelection(){
  var sel=S.selected, b=S.selectedBuilding;
  selRing.visible=false; visRing.visible=false;
  if(sel&&!sel.dead){
    var r=5+sel.genes.size*7+7;
    selRing.visible=true; selRing.position.set(sel.x, 1.5, sel.y);
    var p=1+Math.sin(S.elapsed*5)*0.05; selRing.scale.set(r*p, r*p, 1);
    visRing.visible=true; visRing.position.set(sel.x, 1.2, sel.y);
    var vr=60+sel.genes.vision*200; visRing.scale.set(vr, vr, 1);
  } else if(b){
    selRing.visible=true; selRing.position.set(b.x, 1.5, b.y);
    selRing.scale.set(26, 26, 1);
  }
}

function updateParticles(){
  // ذره‌ها در حالت دوبعدی داخل draw() به‌روز می‌شوند؛ اینجا همان منطق تکرار می‌شود
  for(var i=0;i<S.parts.length;i++){ var p=S.parts[i]; p.x+=p.vx*0.016; p.y+=p.vy*0.016; p.life-=0.016; }
  S.parts=S.parts.filter(function(p){ return p.life>0; });
  for(var j=0;j<S.floaters.length;j++){ var f=S.floaters[j]; f.y-=0.5; f.life-=0.016; }
  S.floaters=S.floaters.filter(function(f){ return f.life>0; });
  var n=Math.min(S.parts.length, 300);
  for(var k=0;k<n;k++){
    var pt=S.parts[k];
    put(partMesh, k, pt.x, 8+Math.max(0,pt.life)*8, pt.y, 0, 0.5+Math.max(0,pt.life), 0.5+Math.max(0,pt.life), 0.5+Math.max(0,pt.life), pt.color||'#ffffff');
  }
  setCount(partMesh, n);
}

function render(){
  if(!init()) return false;
  try{
    frame++;
    // اندازه‌ی بوم عوض شده؟ (resize در app.js فقط بوم دوبعدی را تنظیم می‌کند)
    var dpr=Math.min(1.5, window.devicePixelRatio||1);
    if(VW!==lastW||VH!==lastH||dpr!==lastDpr){
      lastW=VW; lastH=VH; lastDpr=dpr;
      renderer.setPixelRatio(dpr);
      renderer.setSize(VW, VH, false);
    }
    syncCamera();
    if(frame%20===0) paintTiles();
    if(frame%15===0) updateStatics();
    updateAgents(); updateBuildings(); updateAnimals(); updateCrowns(); updateFlags(); updateBattles(); updateSelection(); updateParticles();
    renderer.render(scene, camera);
    return true;
  }catch(e){ return false; }
}

function resize(){ if(ready){ lastW=0; } } // اندازه در رندر بعدی همگام می‌شود

function screenToWorld(sx, sy){
  if(!init()) return null;
  try{
    syncCamera();
    var nx=(sx/VW)*2-1, ny=-(sy/VH)*2+1;
    raycaster.setFromCamera({x:nx, y:ny}, camera);
    var hit=raycaster.ray.intersectPlane(_plane, _hit);
    if(!hit) return null;
    return {x:Math.max(0, Math.min(WORLD_W, _hit.x)), y:Math.max(0, Math.min(WORLD_H, _hit.z))};
  }catch(e){ return null; }
}

window.Iso3D={init:init, render:render, resize:resize, screenToWorld:screenToWorld, available:available};
})();

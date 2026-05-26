'use strict';
// ═══════════════════════════════════════════════════════
//  GRĂDINA  –  pixel farm  (Stardew style)
// ═══════════════════════════════════════════════════════

const canvas = document.getElementById('game');
const ctx    = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;   // PIXEL ART – nu blura nimic!

const VW = 400, VH = 240;
canvas.width  = VW;
canvas.height = VH;

// Scalează canvas-ul să umple ecranul păstrând pixeli clari
function resizeDisplay() {
  const s = Math.min(innerWidth / VW, innerHeight / VH);
  canvas.style.width  = (VW * s) + 'px';
  canvas.style.height = (VH * s) + 'px';
}
window.addEventListener('resize', resizeDisplay);
resizeDisplay();

// ── Sunete ──────────────────────────────────────────────
let audioCtx = null;
function aud() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return audioCtx;
}
function beep(freq, type, dur, vol) {
  try {
    const a = aud(), o = a.createOscillator(), g = a.createGain();
    o.type = type || 'square';
    o.frequency.value = freq;
    g.gain.setValueAtTime(vol || 0.18, a.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, a.currentTime + dur);
    o.connect(g); g.connect(a.destination);
    o.start(); o.stop(a.currentTime + dur);
  } catch(e) {}
}
function sfxDig()     { beep(160,'sawtooth',0.09); }
function sfxWater()   { beep(523,'sine',0.12); setTimeout(()=>beep(659,'sine',0.1),70); }
function sfxPlant()   { beep(659,'square',0.07); }
function sfxHarvest() { beep(784,'triangle',0.08); setTimeout(()=>beep(1046,'triangle',0.13),90); }
function sfxCoin()    { [523,659,784,1046].forEach((f,i)=>setTimeout(()=>beep(f,'triangle',0.1),i*55)); }
function sfxNo()      { beep(140,'square',0.1,0.1); }
function sfxDay()     { [392,494,659,784].forEach((f,i)=>setTimeout(()=>beep(f,'triangle',0.2),i*80)); }
function sfxBuy()     { beep(880,'triangle',0.15); }

// ── Tile IDs ─────────────────────────────────────────────
const TID = { GRASS:0, FIELD:1, DIRT:2, WET:3, WATER:4, PATH:5,
              FENCE_H:6, FENCE_V:7, TREE:8, SOLID:9 };
const TS = 16;
const SOLID_SET = new Set([TID.WATER, TID.TREE, TID.SOLID]);

// ── Harta (25 × 15 tiles = 400 × 240 px) ────────────────
const MAP_W = 25, MAP_H = 15;
// prettier-ignore
const MAP_BASE = [
//  0  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24
  [ 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8], // 0
  [ 8, 9, 9, 9, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 8, 8, 8, 8], // 1
  [ 8, 9, 9, 9, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 8, 8, 8, 8], // 2
  [ 8, 9, 9, 9, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 8, 8, 8, 8], // 3
  [ 0, 6, 6, 6, 5, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 0, 0, 0, 0, 0], // 4
  [ 0, 7, 1, 1, 1, 1, 1, 7, 1, 1, 1, 1, 1, 7, 1, 1, 1, 1, 1, 7, 0, 0, 0, 0, 0], // 5
  [ 0, 7, 1, 1, 1, 1, 1, 7, 1, 1, 1, 1, 1, 7, 1, 1, 1, 1, 1, 7, 0, 0, 0, 0, 0], // 6
  [ 0, 7, 1, 1, 1, 1, 1, 7, 1, 1, 1, 1, 1, 7, 1, 1, 1, 1, 1, 7, 0, 0, 0, 0, 0], // 7
  [ 0, 7, 1, 1, 1, 1, 1, 7, 1, 1, 1, 1, 1, 7, 1, 1, 1, 1, 1, 7, 0, 0, 0, 0, 0], // 8
  [ 0, 7, 1, 1, 1, 1, 1, 7, 1, 1, 1, 1, 1, 7, 1, 1, 1, 1, 1, 7, 0, 0, 0, 0, 0], // 9
  [ 0, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 0, 0, 0, 0, 0], //10
  [ 0, 7, 1, 1, 1, 1, 1, 7, 1, 1, 1, 1, 1, 7, 1, 1, 1, 1, 1, 7, 0, 0, 0, 0, 0], //11
  [ 0, 7, 1, 1, 1, 1, 1, 7, 1, 1, 1, 1, 1, 7, 1, 1, 1, 1, 1, 7, 0, 0, 0, 0, 0], //12
  [ 0, 7, 1, 1, 1, 1, 1, 7, 1, 1, 1, 1, 1, 7, 1, 1, 1, 1, 1, 7, 0, 0, 0, 0, 0], //13
  [ 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4], //14
];

let tileMap;
function initMap() { tileMap = MAP_BASE.map(r => [...r]); }

// Pozitii obiecte speciale
const SHOP_TX = 9,  SHOP_TY = 2;   // magazin
const BOX_TX  = 13, BOX_TY  = 2;   // ladă expediere

// ── Tipuri de culturi ────────────────────────────────────
const CROPS = {
  nap:     { name:'Nap',     emoji:'🌿', days:2, cost:10, sell:30,  clr:['#a0d060','#70b840','#50a020','#e8e030'] },
  morcov:  { name:'Morcov',  emoji:'🥕', days:3, cost:15, sell:50,  clr:['#a0d060','#70b840','#50a020','#ff7000'] },
  rosie:   { name:'Roșie',   emoji:'🍅', days:4, cost:20, sell:80,  clr:['#a0d060','#70b840','#50a020','#e03030'] },
  dovleac: { name:'Dovleac', emoji:'🎃', days:5, cost:30, sell:130, clr:['#a0d060','#70b840','#50a020','#f07800'] },
};
const CROP_KEYS = Object.keys(CROPS);

// ── Stare joc ────────────────────────────────────────────
let crops = [];   // { tx, ty, type, stage, watered }
let particles = [];
let notifications = [];

let gs = {
  screen: 'title',  // 'title' | 'play' | 'shop' | 'dayend'
  day: 1,
  coins: 500,
  tool: 0,          // 0=sapă, 1=stropitoare, 2=semințe
  seedIdx: 0,       // index în CROP_KEYS
  inv: { nap:0, morcov:0, rosie:0, dovleac:0 },
  shipping: [],
  dayCoins: 0,
};

// ── Jucător ──────────────────────────────────────────────
let pl = {
  x: 68, y: 64,   // px (top-left sprite)
  dir: 2,          // 0=sus,1=stânga,2=jos,3=dreapta
  walkF: 0,
  moving: false,
};

// ── Input ────────────────────────────────────────────────
const keys = {};
let justPressed = {};
window.addEventListener('keydown', e => {
  if (!keys[e.code]) justPressed[e.code] = true;
  keys[e.code] = true;
  // preventDefault doar pentru tastele jocului
  if (['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight',
       'KeyZ','KeyX','KeyQ','KeyE','Tab','Digit1','Digit2','Digit3'].includes(e.code))
    e.preventDefault();
});
window.addEventListener('keyup',  e => { keys[e.code] = false; });
window.addEventListener('blur',   () => { for(const k in keys) keys[k]=false; });

// Click / touch pe butonul JOACA din titlu
canvas.addEventListener('click', e => {
  if(gs.screen!=='title') return;
  const rect=canvas.getBoundingClientRect();
  const scaleX=VW/rect.width, scaleY=VH/rect.height;
  const cx=(e.clientX-rect.left)*scaleX;
  const cy=(e.clientY-rect.top)*scaleY;
  if(cx>=BTN_X&&cx<=BTN_X+BTN_W&&cy>=BTN_Y-10&&cy<=BTN_Y+BTN_H+10) {
    gs.screen='play'; initMap(); initState();
  }
});
canvas.addEventListener('touchstart', e => {
  if(gs.screen!=='title') return;
  e.preventDefault();
  const rect=canvas.getBoundingClientRect();
  const t2=e.touches[0];
  const scaleX=VW/rect.width, scaleY=VH/rect.height;
  const cx=(t2.clientX-rect.left)*scaleX;
  const cy=(t2.clientY-rect.top)*scaleY;
  if(cx>=BTN_X&&cx<=BTN_X+BTN_W&&cy>=BTN_Y-10&&cy<=BTN_Y+BTN_H+10) {
    gs.screen='play'; initMap(); initState();
  }
}, {passive:false});

function jp(code) { const v = justPressed[code]; justPressed[code]=false; return v; }

// ── Helpers de desen ─────────────────────────────────────
function fr(x,y,w,h,c) { ctx.fillStyle=c; ctx.fillRect(x,y,w,h); }
function tx(text,x,y,c,size,align) {
  ctx.font = `${size||7}px monospace`;
  ctx.textAlign = align||'left';
  ctx.fillStyle = c||'#fff';
  ctx.fillText(text,x,y);
}

// ── Desenare tiles ───────────────────────────────────────
function drawTile(id, px, py) {
  switch(id) {
    case TID.GRASS:
      fr(px,py,TS,TS,'#5c8a3f');
      fr(px+2,py+3,1,2,'#4e7535'); fr(px+7,py+1,1,2,'#4e7535');
      fr(px+12,py+6,1,2,'#4e7535'); fr(px+5,py+10,1,2,'#4e7535');
      break;
    case TID.FIELD:
      fr(px,py,TS,TS,'#68a048');
      fr(px+3,py+2,1,2,'#5a9040'); fr(px+10,py+7,1,2,'#5a9040');
      fr(px+6,py+12,1,2,'#5a9040');
      break;
    case TID.DIRT:
      fr(px,py,TS,TS,'#8b6040');
      fr(px+1,py+4,TS-2,1,'#7a5535');
      fr(px+1,py+8,TS-2,1,'#7a5535');
      fr(px+1,py+12,TS-2,1,'#7a5535');
      break;
    case TID.WET:
      fr(px,py,TS,TS,'#5c3d20');
      fr(px+1,py+4,TS-2,1,'#4a2f18');
      fr(px+1,py+8,TS-2,1,'#4a2f18');
      fr(px+1,py+12,TS-2,1,'#4a2f18');
      fr(px+4,py+6,1,1,'#6090ff'); fr(px+10,py+10,1,1,'#6090ff');
      fr(px+7,py+2,1,1,'#6090ff');
      break;
    case TID.WATER:
      fr(px,py,TS,TS,'#3472c8');
      fr(px,py+5,TS,1,'#2a5aaa'); fr(px,py+11,TS,1,'#2a5aaa');
      fr(px+2,py+2,3,1,'#80a8ff'); fr(px+9,py+8,3,1,'#80a8ff');
      fr(px+5,py+13,4,1,'#80a8ff');
      break;
    case TID.PATH:
      fr(px,py,TS,TS,'#c8a46e');
      fr(px+2,py+2,3,2,'#b89058'); fr(px+8,py+7,3,2,'#b89058');
      fr(px+4,py+11,3,2,'#b89058'); fr(px+12,py+3,3,2,'#b89058');
      break;
    case TID.FENCE_H:
      fr(px,py,TS,TS,'#5c8a3f');
      fr(px,py+5,TS,4,'#8b6040'); fr(px,py+6,TS,2,'#a07050');
      fr(px,py+2,2,TS-2,'#7a5535');
      break;
    case TID.FENCE_V:
      fr(px,py,TS,TS,'#5c8a3f');
      fr(px+7,py,2,TS,'#7a5535');
      fr(px+2,py+4,TS-4,2,'#8b6040'); fr(px+2,py+10,TS-4,2,'#8b6040');
      break;
    case TID.TREE:
      fr(px,py,TS,TS,'#5c8a3f');
      fr(px+6,py+9,4,7,'#7a5535');
      fr(px+2,py+2,12,9,'#2a6618'); fr(px+4,py+1,8,3,'#2a6618');
      fr(px+1,py+4,14,6,'#2a6618'); fr(px+4,py+9,8,2,'#2a6618');
      fr(px+4,py+3,4,3,'#3a8828'); fr(px+5,py+4,2,2,'#4a9838');
      break;
    case TID.SOLID:
      fr(px,py,TS,TS,'#c8956a');
      break;
  }
}

// ── Desenare casă ────────────────────────────────────────
function drawHouse() {
  const hx = 1*TS, hy = 1*TS;
  // Ziduri
  fr(hx, hy+TS, 3*TS, 2*TS, '#c8956a');
  // Acoperis (triunghi simulat cu rects)
  fr(hx-1,hy+TS,3*TS+2,4,'#b04040');
  fr(hx+2,hy+TS-4,3*TS-4,4,'#c04848');
  fr(hx+5,hy+TS-8,3*TS-10,4,'#c04848');
  fr(hx+8,hy+TS-12,3*TS-16,4,'#c84040');
  fr(hx+11,hy+TS-14,6,4,'#d04848');
  // Ferestre
  fr(hx+3,hy+TS+4,10,8,'#80c8e8');
  fr(hx+8,hy+TS+4,2,8,'#c8956a');
  fr(hx+3,hy+TS+8,10,2,'#c8956a');
  fr(hx+3*TS-13,hy+TS+4,10,8,'#80c8e8');
  fr(hx+3*TS-8,hy+TS+4,2,8,'#c8956a');
  fr(hx+3*TS-13,hy+TS+8,10,2,'#c8956a');
  // Ușă
  fr(hx+3*TS/2-5,hy+2*TS+2,10,TS-1,'#7a4a20');
  fr(hx+3*TS/2-4,hy+2*TS+3,8,TS-2,'#9b6030');
  fr(hx+3*TS/2+2,hy+2*TS+8,2,2,'#f0c060');
}

// ── Desenare magazin ─────────────────────────────────────
function drawShop() {
  const sx = SHOP_TX*TS-2, sy = SHOP_TY*TS-4;
  fr(sx,sy+4,20,16,'#8b5a2a');       // corp
  fr(sx-2,sy,24,6,'#e84040');        // acoperiș
  fr(sx+1,sy+8,8,6,'#80c8e8');       // fereastră
  fr(sx+11,sy+6,8,10,'#6b3a1f');     // ușă
  fr(sx+14,sy+9,2,2,'#f0c060');      // mâner ușă
  // Semn
  fr(sx+2,sy-6,20,6,'#f5c518');
  tx('SHOP',sx+4,sy-1,'#2a1800',5);
}

// ── Desenare ladă expediere ──────────────────────────────
function drawBox() {
  const bx = BOX_TX*TS, by = BOX_TY*TS;
  fr(bx+1,by+4,14,11,'#8b5a2a');     // corp
  fr(bx,by+3,16,4,'#a06030');        // capac
  fr(bx+3,by+7,10,2,'#7a4a1a');      // dungă
  fr(bx+6,by+4,4,3,'#c08040');       // zăvor
  fr(bx+7,by+5,2,2,'#f0c060');
  // Semn
  fr(bx+1,by-2,14,4,'#50a050');
  tx('LADĂ',bx+2,by+1,'#fff',5);
}

// ── Desenare culturi ─────────────────────────────────────
function drawCrop(c) {
  const def = CROPS[c.type];
  const px = c.tx*TS, py = c.ty*TS;
  const stage = Math.min(3, Math.floor((c.stage / def.days)*4));
  if (c.stage >= def.days) { // gata de recoltat
    // plantă mare cu culoarea produsului
    fr(px+7,py+4,2,12,def.clr[1]);  // tulpină
    if (def.clr[3] === '#e8e030') { // nap
      fr(px+3,py+8,10,6,def.clr[3]);
      fr(px+5,py+6,6,4,def.clr[3]);
      fr(px+5,py+4,2,4,def.clr[1]);
      fr(px+8,py+3,2,5,def.clr[1]);
    } else if (def.clr[3] === '#ff7000') { // morcov
      fr(px+5,py+4,6,2,def.clr[1]);
      fr(px+6,py+6,4,2,def.clr[1]);
      fr(px+6,py+8,3,6,def.clr[3]);
      fr(px+7,py+12,2,2,def.clr[3]);
    } else if (def.clr[3] === '#e03030') { // roșie
      fr(px+4,py+5,8,2,def.clr[1]);
      fr(px+5,py+7,6,2,def.clr[1]);
      fr(px+4,py+7,5,5,def.clr[3]);
      fr(px+8,py+8,5,5,def.clr[3]);
    } else { // dovleac
      fr(px+5,py+5,2,4,def.clr[1]);
      fr(px+9,py+6,2,3,def.clr[1]);
      fr(px+3,py+8,10,6,def.clr[3]);
      fr(px+5,py+7,6,8,def.clr[3]);
      fr(px+6,py+4,4,5,def.clr[3]);
    }
    // Sclipire: gata de recoltat
    if (Math.floor(Date.now()/400)%2===0) {
      fr(px+6,py+1,4,2,'#ffff80'); fr(px+1,py+6,2,2,'#ffff80');
      fr(px+13,py+4,2,2,'#ffff80');
    }
  } else if (stage === 0) { // sămânță
    fr(px+7,py+11,2,3,def.clr[0]);
    fr(px+6,py+10,4,2,def.clr[0]);
  } else if (stage === 1) { // răsad
    fr(px+7,py+7,2,8,def.clr[1]);
    fr(px+4,py+7,4,3,def.clr[2]);
    fr(px+8,py+9,4,3,def.clr[2]);
  } else { // crescând
    fr(px+7,py+4,2,11,def.clr[1]);
    fr(px+3,py+6,5,4,def.clr[2]);
    fr(px+8,py+5,5,4,def.clr[2]);
    fr(px+5,py+4,4,3,def.clr[0]);
  }
}

// ── Desenare jucător ─────────────────────────────────────
function drawPlayer() {
  const x = pl.x, y = pl.y;
  const f = Math.floor(pl.walkF)%2;
  const skin='#f4c090', hair='#7a3010', shirt='#e84060', pants='#3050b0', boot='#6b3a1f';

  // Umbră
  fr(x+1,y+18,10,2,'rgba(0,0,0,0.25)');

  // Picioare animate
  ctx.fillStyle=pants;
  if(pl.dir!==0) {
    if(f===0){ ctx.fillRect(x+2,y+12,3,6); ctx.fillRect(x+7,y+14,3,4); }
    else     { ctx.fillRect(x+2,y+14,3,4); ctx.fillRect(x+7,y+12,3,6); }
  } else {
    ctx.fillRect(x+2,y+12,3,6); ctx.fillRect(x+7,y+12,3,6);
  }
  // Ghete
  ctx.fillStyle=boot;
  ctx.fillRect(x+1,y+18,4,2); ctx.fillRect(x+6,y+18,4,2);

  // Corp
  fr(x+1,y+7,10,6,shirt);
  // Brațe
  fr(x-1,y+7,2,5,shirt); fr(x+11,y+7,2,5,shirt);
  fr(x-1,y+12,2,2,skin); fr(x+11,y+12,2,2,skin);
  // Unealtă în mână
  drawToolInHand(x,y);

  // Cap
  fr(x+2,y+1,8,7,skin);
  // Ochi
  ctx.fillStyle='#2a1800';
  if(pl.dir===2)      { ctx.fillRect(x+4,y+4,1,1); ctx.fillRect(x+7,y+4,1,1); }
  else if(pl.dir===0) { ctx.fillRect(x+4,y+5,1,1); ctx.fillRect(x+7,y+5,1,1); }
  else if(pl.dir===1) { ctx.fillRect(x+3,y+4,1,1); }
  else                { ctx.fillRect(x+8,y+4,1,1); }
  // Gură
  if(pl.dir===2) { ctx.fillRect(x+5,y+6,2,1); }
  // Păr
  fr(x+2,y+0,8,3,hair);
  fr(x+1,y+1,2,4,hair); fr(x+9,y+1,2,4,hair);
}

function drawToolInHand(x,y) {
  const c = ['#c8a030','#5080f0','#50c840'][gs.tool];
  if(gs.tool===0) { // sapă
    fr(x+12,y+8,1,10,'#8b6040'); fr(x+10,y+8,4,2,c);
  } else if(gs.tool===1) { // stropitoare
    fr(x+12,y+9,1,8,'#8b6040'); fr(x+11,y+8,4,5,c);
    fr(x+14,y+10,3,1,c); fr(x+14,y+12,3,1,c);
  } else { // semințe
    fr(x+12,y+10,1,7,'#8b6040'); fr(x+11,y+9,3,3,c);
  }
}

// ── Particule ────────────────────────────────────────────
function spawnParticles(x,y,clr,n) {
  for(let i=0;i<n;i++) particles.push({
    x, y, vx:(Math.random()-0.5)*2.5, vy:-Math.random()*2.5-0.5,
    life:30+Math.random()*20, maxLife:50, clr
  });
}

function updateParticles() {
  particles = particles.filter(p => {
    p.x+=p.vx; p.y+=p.vy; p.vy+=0.1; p.life--;
    return p.life>0;
  });
}

function drawParticles() {
  particles.forEach(p => {
    const a = p.life/p.maxLife;
    ctx.globalAlpha = a;
    fr(p.x,p.y,2,2,p.clr);
    ctx.globalAlpha=1;
  });
}

// ── Notificări ───────────────────────────────────────────
function notify(msg, clr) {
  notifications.push({ msg, clr:clr||'#fff', timer:120 });
  if(notifications.length>3) notifications.shift();
}

function drawNotifications() {
  notifications = notifications.filter(n=>n.timer-->0);
  notifications.forEach((n,i) => {
    const a = Math.min(1, n.timer/20);
    ctx.globalAlpha=a;
    const yw = VH-30-(i*14);
    fr(2,yw-8,VW-4,11,'rgba(0,0,0,0.7)');
    tx(n.msg, VW/2, yw, n.clr, 7, 'center');
    ctx.globalAlpha=1;
  });
}

// ── HUD ──────────────────────────────────────────────────
function drawHUD() {
  fr(0,0,VW,17,'rgba(0,0,0,0.82)');
  fr(0,17,VW,1,'#3a5a20');
  // Zi
  tx(`Ziua ${gs.day}`, 4, 12, '#f5c518', 9);
  // Monede
  tx(`Monede: ${gs.coins}`, 72, 12, '#f0f040', 9);
  // Unealtă
  const toolNames = ['Sapa','Stropitoare','Seminte'];
  tx(`[${toolNames[gs.tool]}]`, 185, 12, '#80ff80', 9);
  // Semință activă (dacă tool=2)
  if(gs.tool===2) {
    const k = CROP_KEYS[gs.seedIdx];
    const d = CROPS[k];
    tx(`${d.name}(${gs.inv[k]})`, 268, 12, '#ffcc40', 9);
  }
  // Hint taste
  tx('Z=act  Tab=dormi  Q/E=unealta', VW-2, 12, '#999', 7, 'right');
}

// ── Coliziune ────────────────────────────────────────────
function isSolid(px,py) {
  const tx=Math.floor(px/TS), ty=Math.floor(py/TS);
  if(tx<0||tx>=MAP_W||ty<0||ty>=MAP_H) return true;
  if(SOLID_SET.has(tileMap[ty][tx])) return true;
  // obiecte solide
  if(tx===SHOP_TX&&ty===SHOP_TY) return true;
  if(tx===BOX_TX&&ty===BOX_TY) return true;
  return false;
}

function canStep(nx,ny) {
  const corners=[[nx+2,ny+15],[nx+9,ny+15],[nx+2,ny+19],[nx+9,ny+19]];
  return !corners.some(([cx,cy])=>isSolid(cx,cy));
}

// ── Tile față de jucător ─────────────────────────────────
function facingTile() {
  const cx=Math.floor((pl.x+6)/TS), cy=Math.floor((pl.y+17)/TS);
  const dx=[0,-1,0,1][pl.dir], dy=[-1,0,1,0][pl.dir];
  return { tx:cx+dx, ty:cy+dy };
}

// ── Interacțiune ─────────────────────────────────────────
function interact() {
  const {tx,ty} = facingTile();
  if(tx<0||tx>=MAP_W||ty<0||ty>=MAP_H) return;

  // Magazin
  if((tx===SHOP_TX||tx===SHOP_TX+1)&&ty===SHOP_TY+1) { openShop(); return; }
  // Ladă
  if((tx===BOX_TX||tx===BOX_TX+1)&&ty===BOX_TY+1) { addToShipping(); return; }

  const tile = tileMap[ty][tx];
  const crop = crops.find(c=>c.tx===tx&&c.ty===ty)||null;

  // Recoltat
  if(crop && crop.stage>=CROPS[crop.type].days) {
    gs.inv[crop.type]=(gs.inv[crop.type]||0)+1;
    crops=crops.filter(c=>c!==crop);
    tileMap[ty][tx]=TID.DIRT;
    sfxHarvest();
    notify(`+1 ${CROPS[crop.type].name}! 🎉`, '#80ff80');
    spawnParticles(tx*TS+8,ty*TS+8,'#f0e030',8);
    return;
  }

  if(gs.tool===0) { // sapă
    if(tile===TID.FIELD||tile===TID.GRASS) {
      tileMap[ty][tx]=TID.DIRT; sfxDig();
      notify('Pământ săpat!','#c8a46e');
    } else { sfxNo(); }
  } else if(gs.tool===1) { // stropitoare
    if(tile===TID.DIRT&&!crop) {
      tileMap[ty][tx]=TID.WET; sfxWater();
      notify('Udat! 💧','#80c0ff');
    } else if(crop&&(tile===TID.DIRT||tile===TID.WET)) {
      tileMap[ty][tx]=TID.WET;
      if(crop) crop.watered=true;
      sfxWater(); notify('Plantat udat! 💧','#80c0ff');
    } else { sfxNo(); }
  } else if(gs.tool===2) { // semințe
    if((tile===TID.DIRT||tile===TID.WET)&&!crop) {
      const k=CROP_KEYS[gs.seedIdx];
      if(gs.inv[k]>0) {
        crops.push({tx,ty,type:k,stage:0,watered:tile===TID.WET});
        gs.inv[k]--;
        sfxPlant(); notify(`${CROPS[k].name} plantat! 🌱`,'#a0ff80');
      } else {
        sfxNo(); notify(`Nu ai semințe de ${CROPS[k].name}!`,'#ff8080');
      }
    } else if(!crop) {
      sfxNo(); notify('Sapă pământul mai întâi!','#ffcc40');
    }
  }
}

// ── Magazin ──────────────────────────────────────────────
let shopOpen = false;
let shopSel = 0;

function openShop() { shopOpen=true; sfxBuy(); }

function drawShopUI() {
  if(!shopOpen) return;
  // Fundal semi-transparent
  fr(50,20,VW-100,VH-40,'rgba(0,0,0,0.9)');
  fr(52,22,VW-104,VH-44,'#2a1a0a');
  fr(52,22,VW-104,16,'#8b5a2a');
  tx('🛒 MAGAZIN', VW/2, 33, '#f5c518', 9, 'center');
  tx(`🪙 ${gs.coins} monede`, VW/2, 44, '#f0f040', 7, 'center');

  CROP_KEYS.forEach((k,i) => {
    const d=CROPS[k];
    const ry=54+i*26;
    const sel=i===shopSel;
    if(sel) { fr(55,ry-1,VW-110,20,'#4a3010'); fr(55,ry-1,3,20,'#f5c518'); }
    tx(`${d.emoji} ${d.name}`, 65, ry+12, sel?'#fff':'#ccc', 7);
    tx(`Preț: ${d.cost}🪙`, 140, ry+12, sel?'#ffcc40':'#aa9940', 7);
    tx(`Vinde: ${d.sell}🪙`, 210, ry+12, sel?'#80ff80':'#50a050', 7);
    tx(`Crește: ${d.days} zile`, 285, ry+12, sel?'#80ccff':'#5090bb', 7);
    tx(`Ai: ${gs.inv[k]}`, 345, ry+12, sel?'#ffaa40':'#aa7030', 7);
  });

  tx('[↑↓] Alege  [Z] Cumpără ×10  [X] Închide', VW/2, VH-30, '#aaa', 5, 'center');
}

function updateShop() {
  if(!shopOpen) return;
  if(jp('ArrowUp'))   shopSel=(shopSel-1+4)%4;
  if(jp('ArrowDown')) shopSel=(shopSel+1)%4;
  if(jp('KeyZ')||jp('Space')) {
    const k=CROP_KEYS[shopSel];
    const cost=CROPS[k].cost*10;
    if(gs.coins>=cost) {
      gs.coins-=cost; gs.inv[k]+=10;
      sfxBuy(); notify(`+10 semințe ${CROPS[k].name}!`,'#80ff80');
    } else {
      sfxNo(); notify('Nu ai destule monede!','#ff8080');
    }
  }
  if(jp('KeyX')||jp('Tab')||jp('Escape')) shopOpen=false;
}

// ── Adaugă la ladă ───────────────────────────────────────
function addToShipping() {
  let total=0;
  CROP_KEYS.forEach(k=>{
    if(gs.inv[k]>0) {
      total+=gs.inv[k]*CROPS[k].sell;
      gs.shipping.push({type:k,qty:gs.inv[k]});
      gs.inv[k]=0;
    }
  });
  if(total>0) {
    sfxCoin();
    notify(`Pus în ladă! Câștigi ${total}🪙 la noapte`,'#f5c518');
  } else {
    sfxNo(); notify('Nu ai nimic de expediat!','#ffcc40');
  }
}

// ── Zi nouă ──────────────────────────────────────────────
let dayEndOpen=false, dayEndCoins=0, dayEndList=[];

function advanceDay() {
  // Calculează monedele din livrare
  dayEndCoins=0; dayEndList=[];
  gs.shipping.forEach(s=>{
    const earn=s.qty*CROPS[s.type].sell;
    dayEndCoins+=earn;
    dayEndList.push(`${s.qty}× ${CROPS[s.type].name} = ${earn}🪙`);
  });
  gs.coins+=dayEndCoins;
  gs.shipping=[];

  // Avansează culturile udate
  crops.forEach(c=>{
    if(tileMap[c.ty][c.tx]===TID.WET) {
      c.stage=Math.min(CROPS[c.type].days, c.stage+1);
      tileMap[c.ty][c.tx]=TID.DIRT;
    }
  });

  gs.day++;
  dayEndOpen=true;
  sfxDay();
}

function drawDayEnd() {
  if(!dayEndOpen) return;
  fr(60,30,VW-120,VH-60,'rgba(0,0,0,0.95)');
  fr(62,32,VW-124,VH-64,'#0a1f0a');
  fr(62,32,VW-124,18,'#2a6018');
  tx(`🌙 Ziua ${gs.day-1} s-a terminat!`, VW/2, 44, '#f5c518', 9, 'center');
  if(dayEndList.length===0) {
    tx('Nu ai expediat nimic.', VW/2, 75, '#aaa', 7, 'center');
  } else {
    dayEndList.forEach((s,i)=>tx(s, VW/2, 68+i*14, '#80ff80', 7, 'center'));
  }
  const y2=68+Math.max(1,dayEndList.length)*14+8;
  tx(`Total câștigat: ${dayEndCoins}🪙`, VW/2, y2, '#f5c518', 8, 'center');
  tx(`Total monede: ${gs.coins}🪙`, VW/2, y2+14, '#f0f040', 7, 'center');
  tx('[Z sau Space] Ziua nouă', VW/2, VH-36, '#80ccff', 7, 'center');
}

function updateDayEnd() {
  if(!dayEndOpen) return;
  if(jp('KeyZ')||jp('Space')||jp('Enter')) dayEndOpen=false;
}

// ── Ecran titlu ──────────────────────────────────────────
let titleFrame=0;
// Coordonate buton PLAY (pentru click)
const BTN_X=VW/2-50, BTN_Y=148, BTN_W=100, BTN_H=26;

function drawTitle() {
  titleFrame++;
  const t=titleFrame;

  // ── Cer ──────────────────────────────────────────────────
  for(let y=0;y<110;y++) { fr(0,y,VW,1,`hsl(200,70%,${55+y*0.2}%)`); }

  // ── Soare ─────────────────────────────────────────────────
  const sx=60,sy=38;
  // raze
  for(let a=0;a<8;a++) {
    const ang=a*Math.PI/4+t*0.01;
    const rx=Math.cos(ang)*22+sx, ry=Math.sin(ang)*22+sy;
    fr(rx-1,ry-1,3,3,'#ffe080');
  }
  // disc
  for(let dy=-14;dy<=14;dy++) {
    const w=Math.round(Math.sqrt(14*14-dy*dy)*2);
    fr(sx-w/2,sy+dy,w,1,'#f5c518');
  }

  // ── Nori ──────────────────────────────────────────────────
  [[120-(t*0.25%200),30],[280-(t*0.15%300),48],[380-(t*0.2%350),22]].forEach(([cx,cy])=>{
    const x2=((cx%VW+VW)%VW);
    fr(x2,cy+4,36,10,'rgba(255,255,255,0.9)');
    fr(x2+6,cy,24,10,'rgba(255,255,255,0.9)');
    fr(x2+12,cy-4,14,8,'rgba(255,255,255,0.9)');
  });

  // ── Dealuri îndepărtate ───────────────────────────────────
  for(let x=0;x<VW;x++) {
    const h=18+Math.sin(x/60)*8+Math.sin(x/30)*4;
    fr(x,110-h,1,h,'#3a7828');
  }
  // ── Câmp mijlociu ─────────────────────────────────────────
  fr(0,100,VW,70,'#4a8c3f');
  for(let x=0;x<VW;x++) {
    const h=Math.sin(x/25)*4+Math.sin(x/12)*2;
    fr(x,104+h,1,3,'#5ca048');
  }

  // ── Casă ──────────────────────────────────────────────────
  fr(295,105,55,42,'#c8956a');                    // ziduri
  fr(292,103,62,4,'#b04040');                      // baza acoperiș
  for(let i=0;i<10;i++) fr(295+i*2,93+i,55-i*4,12,'#c04040'); // acoperiș
  fr(315,125,12,22,'#7a4a20');                     // ușă
  fr(298,112,10,9,'#a0d8f0');                      // geam st
  fr(334,112,10,9,'#a0d8f0');                      // geam dr
  fr(302,112,2,9,'#c8956a'); fr(298,116,10,2,'#c8956a'); // cruce geam
  fr(338,112,2,9,'#c8956a'); fr(334,116,10,2,'#c8956a');

  // ── Copaci ────────────────────────────────────────────────
  [[268,120,10,26],[360,118,12,24],[380,115,10,22]].forEach(([tx2,ty2,rw,rh])=>{
    fr(tx2+rw/2-2,ty2+rh,4,20,'#7a5535');
    fr(tx2,ty2,rw,rh,'#2a6618'); fr(tx2+2,ty2-5,rw-4,8,'#3a8828');
  });

  // ── Gard ──────────────────────────────────────────────────
  for(let i=0;i<VW;i+=18) {
    fr(i,135,3,14,'#9b6b3a'); fr(i+3,137,12,2,'#b07848'); fr(i+3,143,12,2,'#b07848');
  }

  // ── Iarbă față ───────────────────────────────────────────
  fr(0,145,VW,VH-145,'#5c8a3f');
  for(let x=0;x<VW;x+=3) fr(x,145,1,2+Math.sin(x*2)*1,'#70a050');

  // ── Flori ─────────────────────────────────────────────────
  [[30,148,'#ff6090'],[65,150,'#f5c518'],[110,147,'#ff6090'],
   [160,149,'#f5c518'],[210,148,'#ff80c0'],[255,150,'#f5c518'],
   [310,148,'#ff6090'],[355,147,'#f5c518'],[390,149,'#ff80c0']].forEach(([fx,fy,c])=>{
    fr(fx,fy+3,1,5,'#5a8030'); fr(fx-2,fy,5,4,c); fr(fx-1,fy+1,3,2,'#fff');
  });

  // ── Titlu (fundal) ────────────────────────────────────────
  fr(VW/2-110,60,220,38,'rgba(0,0,0,0.65)');
  fr(VW/2-110,60,220,2,'#f5c518');
  fr(VW/2-110,96,220,2,'#f5c518');

  // Text titlu
  ctx.font='bold 22px monospace';
  ctx.textAlign='center';
  ctx.fillStyle='#ffee44';
  ctx.fillText('🌻 GRADINA 🌻', VW/2, 86);

  // Subtitlu
  fr(VW/2-120,100,240,16,'rgba(0,0,0,0.6)');
  ctx.font='bold 9px monospace';
  ctx.fillStyle='#b0ff80';
  ctx.fillText('Sapa  Planta  Uda  Recolteaza!', VW/2, 112);

  // ── Buton JOACA ───────────────────────────────────────────
  const pulse=Math.sin(t*0.09)*2;
  const by=BTN_Y-pulse;
  fr(BTN_X-2,by-2,BTN_W+4,BTN_H+4,'#f5c518');   // bordură galbenă
  fr(BTN_X,by,BTN_W,BTN_H,'#1a4010');             // fundal buton
  ctx.font='bold 13px monospace';
  ctx.fillStyle='#f5c518';
  ctx.fillText('▶  JOACA', VW/2, by+18);

  // Hint taste
  fr(0,VH-16,VW,16,'rgba(0,0,0,0.7)');
  ctx.font='8px monospace';
  ctx.fillStyle='#90d070';
  ctx.fillText('SPACE / Z / Enter  sau  click pe buton', VW/2, VH-4);
}

// ── Update principal ─────────────────────────────────────
function update() {
  if(gs.screen==='title') {
    if(jp('KeyZ')||jp('Space')||jp('Enter')) {
      gs.screen='play'; initMap(); initState();
    }
    return;
  }

  updateShop();
  updateDayEnd();
  if(shopOpen||dayEndOpen) return;

  // Mișcare
  let vx=0, vy=0;
  const spd = 1;
  if(keys['ArrowUp']   ||keys['KeyW']) { vy=-spd; pl.dir=0; }
  if(keys['ArrowDown'] ||keys['KeyS']) { vy= spd; pl.dir=2; }
  if(keys['ArrowLeft'] ||keys['KeyA']) { vx=-spd; pl.dir=1; }
  if(keys['ArrowRight']||keys['KeyD']) { vx= spd; pl.dir=3; }

  // Normalizare diagonală
  if(vx!==0&&vy!==0) { vx*=0.707; vy*=0.707; }

  pl.moving = vx!==0||vy!==0;
  if(pl.moving) pl.walkF+=0.15;

  // Coliziune pe axe separate
  if(vx!==0 && canStep(pl.x+vx, pl.y)) pl.x+=vx;
  if(vy!==0 && canStep(pl.x, pl.y+vy)) pl.y+=vy;

  // Limite hartă
  pl.x=Math.max(0, Math.min(VW-12, pl.x));
  pl.y=Math.max(18, Math.min(VH-22, pl.y));

  // Acțiune
  if(jp('KeyZ')||jp('Space')) interact();

  // Schimb unealtă
  if(jp('KeyQ')) gs.tool=(gs.tool-1+3)%3;
  if(jp('KeyE')) gs.tool=(gs.tool+1)%3;
  if(jp('Digit1')) { gs.tool=2; gs.seedIdx=0; }
  if(jp('Digit2')) { gs.tool=2; gs.seedIdx=1; }
  if(jp('Digit3')) { gs.tool=2; gs.seedIdx=2; }
  if(jp('Digit4')) { gs.tool=2; gs.seedIdx=3; }

  // Doarme (zi nouă)
  if(jp('Tab')) advanceDay();

  updateParticles();
  justPressed={};
}

// ── Render ───────────────────────────────────────────────
function render() {
  // Tiles
  for(let ty=0;ty<MAP_H;ty++)
    for(let tx=0;tx<MAP_W;tx++)
      drawTile(tileMap[ty][tx], tx*TS, ty*TS);

  drawHouse();
  drawShop();
  drawBox();

  // Tile față (highlight)
  if(gs.screen==='play'&&!shopOpen&&!dayEndOpen) {
    const {tx:ftx,ty:fty}=facingTile();
    if(ftx>=0&&ftx<MAP_W&&fty>=0&&fty<MAP_H) {
      ctx.strokeStyle='rgba(255,255,255,0.5)';
      ctx.lineWidth=1;
      ctx.strokeRect(ftx*TS+0.5,fty*TS+0.5,TS-1,TS-1);
    }
  }

  crops.forEach(drawCrop);
  drawPlayer();
  drawParticles();
  drawHUD();
  drawNotifications();
  drawShopUI();
  drawDayEnd();
}

function renderTitle() {
  drawTitle();
}

// ── Init ─────────────────────────────────────────────────
function initState() {
  crops=[];
  particles=[];
  notifications=[];
  pl.x=68; pl.y=64; pl.dir=2; pl.walkF=0;
  gs.day=1; gs.coins=500;
  gs.inv={nap:5,morcov:3,rosie:0,dovleac:0};
  gs.shipping=[];
  shopOpen=false; dayEndOpen=false;
  notify('Bun venit! Ai 5 nap + 3 morcov de start.🌱','#80ff80');
}

// ── Game loop ────────────────────────────────────────────
function loop() {
  requestAnimationFrame(loop);
  ctx.imageSmoothingEnabled=false;
  if(gs.screen==='title') {
    renderTitle();
    // Ascultă input titlu
    if(justPressed['KeyZ']||justPressed['Space']||justPressed['Enter']) {
      gs.screen='play'; initMap(); initState();
    }
    justPressed={};
  } else {
    update();
    render();
  }
}

loop();

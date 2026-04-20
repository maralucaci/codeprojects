/* ============================================================
   PARCURING — game.js
   Screens: cover → char select → game → game-over / win
   Controls: 1=left, 2=right, Shift=run, Space=jump, Enter=hit sign
   ============================================================ */

// ─── SCREEN HELPERS ────────────────────────────────────────
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => {
    s.classList.remove('active');
    s.style.display = 'none';
  });
  const el = document.getElementById(id);
  el.style.display = 'flex';
  el.classList.add('active');
}

// ─── COVER CANVAS (ANIMAT) ─────────────────────────────────
(function initCover() {
  const canvas = document.getElementById('cover-canvas');
  const ctx = canvas.getContext('2d');
  let coverOff = 0, rafCover;

  // Stele fixe (random o singura data)
  const STARS = Array.from({length: 80}, () => ({
    x: Math.random(), y: Math.random() * 0.75,
    r: 0.5 + Math.random() * 1.5,
    blink: Math.random() * Math.PI * 2
  }));

  // Neon signs pe cladiri
  const NEONS = ['PIZZA','24H','BAR','GYM','HOTEL','MARKET','OPEN','CAFÉ'];

  // Cladiri definitie (reutilizate cu offset)
  const BLDGS_BG = [];
  const BLDGS_FG = [];
  for (let i = 0; i < 18; i++) {
    BLDGS_BG.push({ ox: i * 110 + (i*37)%55, w: 50+(i*31)%70, h: 0.35+((i*17)%20)*0.01, color: `hsl(${210+i*5},40%,${18+i%5}%)` });
    BLDGS_FG.push({ ox: i * 90  + (i*53)%40, w: 45+(i*43)%85, h: 0.42+((i*23)%22)*0.01, color: `hsl(${215+i*4},55%,${10+i%4}%)`, neon: NEONS[i%NEONS.length] });
  }

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function drawCover(ts) {
    const W = canvas.width, H = canvas.height;
    coverOff = (coverOff + 0.5) % (W + 200);
    const t = ts * 0.001;

    // ── Cer noapte → apus ──────────────────────────────────
    const sky = ctx.createLinearGradient(0, 0, 0, H);
    sky.addColorStop(0,   '#07091a');
    sky.addColorStop(0.5, '#0d1b3e');
    sky.addColorStop(0.8, '#1a1060');
    sky.addColorStop(1,   '#ff6030');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, W, H);

    // ── Luna ───────────────────────────────────────────────
    ctx.save();
    ctx.shadowColor = '#c8e0ff'; ctx.shadowBlur = 30;
    ctx.fillStyle = '#e8f0ff';
    ctx.beginPath(); ctx.arc(W * 0.15, H * 0.14, 30, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#07091a';
    ctx.beginPath(); ctx.arc(W * 0.15 + 12, H * 0.14 - 4, 24, 0, Math.PI * 2); ctx.fill();
    ctx.shadowBlur = 0; ctx.restore();

    // ── Stele (pâlpâitoare) ────────────────────────────────
    for (const s of STARS) {
      const alpha = 0.4 + 0.6 * Math.abs(Math.sin(t * 1.2 + s.blink));
      ctx.fillStyle = `rgba(255,255,255,${alpha.toFixed(2)})`;
      ctx.beginPath(); ctx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2); ctx.fill();
    }

    // ── Cladiri fundal (parallax lent) ────────────────────
    const totalW = 18 * 110;
    for (const b of BLDGS_BG) {
      const bx = ((b.ox - coverOff * 0.15) % totalW + totalW) % totalW - 60;
      const bh = b.h * H;
      const by = H * 0.88 - bh;
      ctx.fillStyle = b.color;
      ctx.beginPath(); ctx.roundRect(bx, by, b.w, bh, [4,4,0,0]); ctx.fill();
      // ferestre galbene
      const cols = Math.floor(b.w / 14), rows = Math.floor(bh / 18);
      for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
        if ((b.ox + r + c) % 4 !== 0) {
          const on = Math.sin(t * 0.3 + b.ox + r * 0.7 + c * 1.1) > -0.3;
          ctx.fillStyle = on ? 'rgba(255,240,140,0.45)' : 'rgba(60,80,120,0.3)';
          ctx.fillRect(bx + 5 + c * 14, by + 6 + r * 18, 8, 10);
        }
      }
    }

    // ── Cladiri prim-plan (mai rapide, 3D) ───────────────
    const totalW2 = 18 * 90;
    for (let i = 0; i < BLDGS_FG.length; i++) {
      const b = BLDGS_FG[i];
      const bx = ((b.ox - coverOff * 0.55) % totalW2 + totalW2) % totalW2 - 60;
      const bh = b.h * H;
      const by = H * 0.88 - bh;
      const sd = 14; // side depth 3D

      // Față dreapta (3D)
      ctx.fillStyle = b.color;
      ctx.save(); ctx.globalAlpha = 0.5;
      ctx.beginPath();
      ctx.moveTo(bx + b.w, by);
      ctx.lineTo(bx + b.w + sd, by - sd * 0.6);
      ctx.lineTo(bx + b.w + sd, H * 0.88 - sd * 0.6);
      ctx.lineTo(bx + b.w, H * 0.88);
      ctx.closePath(); ctx.fill();
      ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.fill();
      ctx.globalAlpha = 1; ctx.restore();

      // Față top (3D tavan)
      ctx.save(); ctx.globalAlpha = 0.75;
      ctx.fillStyle = b.color;
      ctx.beginPath();
      ctx.moveTo(bx, by);
      ctx.lineTo(bx + sd, by - sd * 0.6);
      ctx.lineTo(bx + b.w + sd, by - sd * 0.6);
      ctx.lineTo(bx + b.w, by);
      ctx.closePath(); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.12)'; ctx.fill();
      ctx.globalAlpha = 1; ctx.restore();

      // Față frontală
      ctx.fillStyle = b.color;
      ctx.beginPath(); ctx.roundRect(bx, by, b.w, bh, [4,4,0,0]); ctx.fill();
      // Gradient lumina pe fatada
      const bGrad = ctx.createLinearGradient(bx, by, bx + b.w, by);
      bGrad.addColorStop(0, 'rgba(255,255,255,0.1)');
      bGrad.addColorStop(0.5, 'rgba(255,255,255,0.0)');
      bGrad.addColorStop(1, 'rgba(0,0,0,0.15)');
      ctx.fillStyle = bGrad;
      ctx.beginPath(); ctx.roundRect(bx, by, b.w, bh, [4,4,0,0]); ctx.fill();

      // ferestre albastre-neon
      const cols = Math.floor(b.w / 13), rows = Math.floor(bh / 17);
      for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
        if ((i + r + c) % 3 !== 0) {
          const on = Math.sin(t * 0.5 + i + r * 0.9 + c) > -0.4;
          ctx.fillStyle = on ? 'rgba(100,200,255,0.55)' : 'rgba(20,40,80,0.4)';
          ctx.beginPath(); ctx.roundRect(bx + 5 + c * 13, by + 6 + r * 17, 7, 9, 1); ctx.fill();
          if (on) {
            // reflexie pe geam
            ctx.fillStyle = 'rgba(255,255,255,0.25)';
            ctx.beginPath(); ctx.roundRect(bx + 5 + c * 13, by + 6 + r * 17, 3, 4, 1); ctx.fill();
          }
        }
      }
      // Semn neon pe 1 din 3 cladiri mari
      if (b.w > 70 && i % 3 === 1) {
        const neonAlpha = 0.7 + 0.3 * Math.sin(t * 2 + i);
        ctx.save();
        ctx.shadowColor = '#ff44aa'; ctx.shadowBlur = 14;
        ctx.fillStyle = `rgba(255,80,180,${neonAlpha.toFixed(2)})`;
        ctx.font = `bold ${Math.floor(b.w * 0.18)}px Nunito, sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText(b.neon, bx + b.w / 2, by + 28);
        ctx.shadowBlur = 0; ctx.restore();
      }
    }

    // ── Stradă ────────────────────────────────────────────
    const roadY = H * 0.88;
    const roadGrad = ctx.createLinearGradient(0, roadY, 0, H);
    roadGrad.addColorStop(0, '#1a1a28'); roadGrad.addColorStop(1, '#0a0a14');
    ctx.fillStyle = roadGrad; ctx.fillRect(0, roadY, W, H - roadY);
    // reflexie stradă
    ctx.fillStyle = 'rgba(255,100,30,0.08)';
    ctx.fillRect(0, roadY, W, 8);
    // linii punctate
    ctx.strokeStyle = 'rgba(255,255,255,0.25)'; ctx.setLineDash([40,35]); ctx.lineWidth = 3;
    const dashOff = (coverOff * 1.5) % 75;
    ctx.beginPath(); ctx.moveTo(-dashOff, H * 0.94); ctx.lineTo(W + 80, H * 0.94); ctx.stroke();
    ctx.setLineDash([]);

    // ── Maşini care se mişcă ──────────────────────────────
    const carColors = ['#e84040','#4488ff','#40cc60','#ff8c00','#cc44cc'];
    for (let ci = 0; ci < 3; ci++) {
      const carX = ((coverOff * (1.5 + ci * 0.4) + ci * (W / 3 + 80)) % (W + 140)) - 70;
      const carY = H * 0.92 - 20;
      ctx.fillStyle = carColors[ci % carColors.length];
      ctx.beginPath(); ctx.roundRect(carX, carY, 52, 20, 4); ctx.fill();
      // finestrele masinii
      ctx.fillStyle = 'rgba(150,220,255,0.6)';
      ctx.beginPath(); ctx.roundRect(carX + 6, carY - 12, 16, 12, [3,3,0,0]); ctx.fill();
      ctx.beginPath(); ctx.roundRect(carX + 26, carY - 12, 14, 12, [3,3,0,0]); ctx.fill();
      // roti
      ctx.fillStyle = '#111';
      ctx.beginPath(); ctx.arc(carX + 12, carY + 20, 6, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(carX + 40, carY + 20, 6, 0, Math.PI * 2); ctx.fill();
      // faruri
      ctx.save(); ctx.shadowColor = '#fffaaa'; ctx.shadowBlur = 18;
      ctx.fillStyle = '#fffaaa';
      ctx.beginPath(); ctx.arc(carX + 52, carY + 6, 4, 0, Math.PI * 2); ctx.fill();
      ctx.shadowBlur = 0; ctx.restore();
    }

    // ── Siluetă parkour (personaj care aleargă pe acoperiș) ──
    const runnerX = ((coverOff * 0.9) % (W + 120)) - 60;
    const roofY   = H * 0.88 - BLDGS_FG[3].h * H;
    const bounce  = Math.abs(Math.sin(t * 6)) * 8;
    ctx.save();
    ctx.fillStyle = 'rgba(255,200,50,0.85)';
    ctx.shadowColor = '#f7c948'; ctx.shadowBlur = 14;
    // corp
    ctx.beginPath(); ctx.ellipse(runnerX, roofY - 28 - bounce, 6, 10, 0, 0, Math.PI*2); ctx.fill();
    // cap
    ctx.beginPath(); ctx.arc(runnerX, roofY - 44 - bounce, 7, 0, Math.PI*2); ctx.fill();
    // picior stâng
    const leg = Math.sin(t * 6) * 14;
    ctx.lineWidth = 4; ctx.strokeStyle = 'rgba(255,200,50,0.85)';
    ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(runnerX - 2, roofY - 20 - bounce);
    ctx.lineTo(runnerX - 2 + leg * 0.5, roofY - 5 - bounce + Math.abs(leg)*0.3); ctx.stroke();
    // picior drept
    ctx.beginPath(); ctx.moveTo(runnerX + 2, roofY - 20 - bounce);
    ctx.lineTo(runnerX + 2 - leg * 0.5, roofY - 5 - bounce + Math.abs(leg)*0.3); ctx.stroke();
    ctx.shadowBlur = 0; ctx.restore();
  }

  function loop(ts) {
    drawCover(ts);
    rafCover = requestAnimationFrame(loop);
  }

  document.getElementById('cover-start').addEventListener('click', () => {
    cancelAnimationFrame(rafCover);
  }, { once: true });

  window.addEventListener('resize', resize);
  resize();
  rafCover = requestAnimationFrame(loop);
})();

document.getElementById('cover-start').addEventListener('click', () => {
  showScreen('screen-chars');
  initCharSelect();
});

// ─── CHARACTER DEFINITIONS ─────────────────────────────────
const CHARS = {
  girl1: { name: 'Mia',  skin: '#f5c09a', hair: '#3d1a00', shirt: '#e84040', pants: '#3a3a6a', shoes: '#c0392b', eyeColor: '#5a3010', shirtDetail: '#fff' },
  girl2: { name: 'Lara', skin: '#ffe0bd', hair: '#cc2200', shirt: '#8e44ad', pants: '#2c3e50', shoes: '#6c3483', eyeColor: '#1a6640', shirtDetail: '#d7bde2' },
  boy1:  { name: 'Alex', skin: '#f5c09a', hair: '#1a0d00', shirt: '#27ae60', pants: '#2c3e50', shoes: '#1a252f', eyeColor: '#1a4a7a', shirtDetail: '#1e8449', capColor: '#2980b9' },
  boy2:  { name: 'Cris', skin: '#d4956a', hair: '#111', shirt: '#e67e22', pants: '#1a1a2e', shoes: '#884400', eyeColor: '#5a2d00', shirtDetail: '#f0a830' },
};

function drawCharacter(ctx, charId, x, y, scale, frame) {
  const C = CHARS[charId];
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.translate(0, -8); // align feet to y=0

  const t = frame * 0.18; // animation time
  const walk = Math.sin(t);
  const bodyBob = 0;
  const isGirl = charId.startsWith('girl');

  const acc = (shopState.equipped[charId] || []);

  // ── ARIPI (desenate primele, pe spate) ────────────────────
  if (acc.includes('top_wings')) {
    ctx.save(); ctx.translate(0, -34 + bodyBob);
    ctx.fillStyle = 'rgba(220,220,255,0.85)';
    ctx.beginPath(); ctx.moveTo(-2, 0); ctx.bezierCurveTo(-30, -20, -36, 10, -22, 20); ctx.bezierCurveTo(-14, 26, -4, 10, -2, 0); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = 'rgba(180,180,230,0.9)'; ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.moveTo(-2, 0); ctx.bezierCurveTo(-30, -20, -36, 10, -22, 20); ctx.bezierCurveTo(-14, 26, -4, 10, -2, 0); ctx.stroke();
    ctx.strokeStyle = 'rgba(150,150,210,0.5)'; ctx.lineWidth = 0.8;
    for (let i = 0; i < 4; i++) {
      const wt = 0.2 + i * 0.2;
      const wx = -2 + (-30 - -2) * wt; const wy = (-20) * wt;
      ctx.beginPath(); ctx.moveTo(wx, wy); ctx.lineTo(wx - 4, wy + 8); ctx.stroke();
    }
    ctx.fillStyle = 'rgba(220,220,255,0.85)';
    ctx.beginPath(); ctx.moveTo(2, 0); ctx.bezierCurveTo(30, -20, 36, 10, 22, 20); ctx.bezierCurveTo(14, 26, 4, 10, 2, 0); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = 'rgba(180,180,230,0.9)'; ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.moveTo(2, 0); ctx.bezierCurveTo(30, -20, 36, 10, 22, 20); ctx.bezierCurveTo(14, 26, 4, 10, 2, 0); ctx.stroke();
    ctx.strokeStyle = 'rgba(150,150,210,0.5)'; ctx.lineWidth = 0.8;
    for (let i = 0; i < 4; i++) {
      const wt = 0.2 + i * 0.2;
      const wx = 2 + (30 - 2) * wt; const wy = (-20) * wt;
      ctx.beginPath(); ctx.moveTo(wx, wy); ctx.lineTo(wx + 4, wy + 8); ctx.stroke();
    }
    ctx.restore();
  }

  // ── LEGS ──────────────────────────────────────────────────
  const lSwing = walk * 14; // left leg angle degrees
  const rSwing = -walk * 14;
  const hipY = -20 + bodyBob;

  // Left leg
  ctx.save();
  ctx.translate(-6, hipY);
  ctx.rotate(lSwing * Math.PI / 180);
  ctx.fillStyle = C.pants;
  ctx.beginPath(); ctx.roundRect(-5, 0, 10, 22, 3); ctx.fill();
  // Left knee highlight
  ctx.fillStyle = 'rgba(255,255,255,0.1)';
  ctx.beginPath(); ctx.ellipse(0, 10, 4, 3, 0, 0, Math.PI*2); ctx.fill();
  // Left shoe
  ctx.fillStyle = C.shoes;
  ctx.beginPath(); ctx.ellipse(0, 23, 7, 5, 0.15, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle = '#fff'; ctx.fillRect(-3, 21, 6, 2); // sole line
  ctx.restore();

  // Right leg
  ctx.save();
  ctx.translate(6, hipY);
  ctx.rotate(rSwing * Math.PI / 180);
  ctx.fillStyle = C.pants;
  ctx.beginPath(); ctx.roundRect(-5, 0, 10, 22, 3); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.1)';
  ctx.beginPath(); ctx.ellipse(0, 10, 4, 3, 0, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle = C.shoes;
  ctx.beginPath(); ctx.ellipse(0, 23, 7, 5, -0.15, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle = '#fff'; ctx.fillRect(-3, 21, 6, 2);
  ctx.restore();

  // ── TORSO ──────────────────────────────────────────────────
  const torsoY = -48 + bodyBob;
  if (isGirl) {
    // Skirt flare
    ctx.fillStyle = C.shirt;
    ctx.beginPath();
    ctx.moveTo(-13, -24 + bodyBob);
    ctx.lineTo(13, -24 + bodyBob);
    ctx.lineTo(17, -14 + bodyBob);
    ctx.lineTo(-17, -14 + bodyBob);
    ctx.closePath();
    ctx.fill();
    // Skirt shadow
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.beginPath();
    ctx.moveTo(-13, -20 + bodyBob); ctx.lineTo(13, -20 + bodyBob);
    ctx.lineTo(17, -14 + bodyBob); ctx.lineTo(-17, -14 + bodyBob);
    ctx.closePath(); ctx.fill();
  }

  // Shirt body
  ctx.fillStyle = C.shirt;
  ctx.beginPath();
  ctx.moveTo(-13, -46 + bodyBob);
  ctx.lineTo(13, -46 + bodyBob);
  ctx.lineTo(14, -22 + bodyBob);
  ctx.lineTo(-14, -22 + bodyBob);
  ctx.closePath();
  ctx.fill();

  // Shirt shading
  ctx.fillStyle = 'rgba(0,0,0,0.08)';
  ctx.beginPath();
  ctx.moveTo(4, -46 + bodyBob); ctx.lineTo(14, -46 + bodyBob);
  ctx.lineTo(14, -22 + bodyBob); ctx.lineTo(4, -22 + bodyBob);
  ctx.closePath(); ctx.fill();

  if (isGirl && charId === 'girl1') {
    // White collar V-neck
    ctx.fillStyle = C.shirtDetail;
    ctx.beginPath();
    ctx.moveTo(-6, -46 + bodyBob); ctx.lineTo(0, -40 + bodyBob); ctx.lineTo(6, -46 + bodyBob);
    ctx.closePath(); ctx.fill();
    // Small bow
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.ellipse(-3, -43 + bodyBob, 3, 2, -0.4, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(3, -43 + bodyBob, 3, 2, 0.4, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#ffb3b3';
    ctx.beginPath(); ctx.arc(0, -43 + bodyBob, 2, 0, Math.PI*2); ctx.fill();
  } else if (charId === 'girl2') {
    // Hoodie pocket
    ctx.fillStyle = C.shirtDetail;
    ctx.beginPath(); ctx.roundRect(-7, -32 + bodyBob, 14, 8, 3); ctx.fill();
    ctx.fillStyle = 'rgba(0,0,0,0.1)';
    ctx.beginPath(); ctx.roundRect(-7, -32 + bodyBob, 14, 8, 3); ctx.stroke();
    // Hood drawstring
    ctx.strokeStyle = C.shirtDetail;
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(-3, -46 + bodyBob); ctx.lineTo(-2, -38 + bodyBob); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(3, -46 + bodyBob); ctx.lineTo(2, -38 + bodyBob); ctx.stroke();
  } else if (charId === 'boy1') {
    // Shirt stripe
    ctx.fillStyle = C.shirtDetail;
    ctx.fillRect(-13, -36 + bodyBob, 27, 3);
    // Number on shirt
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 9px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('7', 0, -26 + bodyBob);
  } else if (charId === 'boy2') {
    // Side stripes
    ctx.fillStyle = C.shirtDetail;
    ctx.fillRect(-14, -44 + bodyBob, 4, 22);
    ctx.fillRect(10, -44 + bodyBob, 4, 22);
  }

  // ── ARMS ──────────────────────────────────────────────────
  const lArmSwing = -walk * 20;
  const rArmSwing = walk * 20;

  // Left arm
  ctx.save();
  ctx.translate(-13, -42 + bodyBob);
  ctx.rotate(lArmSwing * Math.PI / 180);
  ctx.fillStyle = C.shirt;
  ctx.beginPath(); ctx.roundRect(-4, 0, 8, 14, 3); ctx.fill();
  // Forearm (skin)
  ctx.fillStyle = C.skin;
  ctx.beginPath(); ctx.roundRect(-3, 12, 7, 10, 3); ctx.fill();
  // Hand
  ctx.beginPath(); ctx.ellipse(0, 23, 4, 4, 0, 0, Math.PI*2); ctx.fill();
  ctx.restore();

  // Right arm
  ctx.save();
  ctx.translate(13, -42 + bodyBob);
  ctx.rotate(rArmSwing * Math.PI / 180);
  ctx.fillStyle = C.shirt;
  ctx.beginPath(); ctx.roundRect(-4, 0, 8, 14, 3); ctx.fill();
  ctx.fillStyle = C.skin;
  ctx.beginPath(); ctx.roundRect(-4, 12, 7, 10, 3); ctx.fill();
  ctx.beginPath(); ctx.ellipse(0, 23, 4, 4, 0, 0, Math.PI*2); ctx.fill();
  ctx.restore();

  // ── NECK ──────────────────────────────────────────────────
  ctx.fillStyle = C.skin;
  ctx.beginPath(); ctx.roundRect(-5, -54 + bodyBob, 10, 10, 2); ctx.fill();

  // ── HEAD ──────────────────────────────────────────────────
  const headY = -68 + bodyBob;

  // Head base
  ctx.fillStyle = C.skin;
  ctx.beginPath();
  ctx.ellipse(0, headY, 15, 17, 0, 0, Math.PI * 2);
  ctx.fill();

  // Ear left
  ctx.beginPath(); ctx.ellipse(-15, headY + 2, 4, 5, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = 'rgba(0,0,0,0.07)';
  ctx.beginPath(); ctx.ellipse(-15, headY + 2, 2, 3, 0, 0, Math.PI * 2); ctx.fill();

  // Ear right
  ctx.fillStyle = C.skin;
  ctx.beginPath(); ctx.ellipse(15, headY + 2, 4, 5, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = 'rgba(0,0,0,0.07)';
  ctx.beginPath(); ctx.ellipse(15, headY + 2, 2, 3, 0, 0, Math.PI * 2); ctx.fill();

  // Face shading
  ctx.fillStyle = 'rgba(0,0,0,0.04)';
  ctx.beginPath(); ctx.ellipse(5, headY + 2, 8, 10, 0, 0, Math.PI * 2); ctx.fill();

  // ── HAIR ──────────────────────────────────────────────────
  ctx.fillStyle = C.hair;
  if (charId === 'girl1') {
    // Top of hair
    ctx.beginPath();
    ctx.ellipse(0, headY - 8, 16, 11, 0, Math.PI, Math.PI * 2);
    ctx.fill();
    // Side part highlight
    ctx.fillStyle = 'rgba(255,255,255,0.12)';
    ctx.beginPath(); ctx.ellipse(-4, headY - 12, 4, 3, -0.3, 0, Math.PI * 2); ctx.fill();
    // Left long strand
    ctx.fillStyle = C.hair;
    ctx.beginPath();
    ctx.moveTo(-14, headY - 4);
    ctx.bezierCurveTo(-18, headY + 8, -20, headY + 22, -16, headY + 34);
    ctx.bezierCurveTo(-12, headY + 36, -10, headY + 34, -12, headY + 30);
    ctx.bezierCurveTo(-14, headY + 20, -13, headY + 6, -11, headY - 2);
    ctx.closePath(); ctx.fill();
    // Right strand
    ctx.beginPath();
    ctx.moveTo(14, headY - 4);
    ctx.bezierCurveTo(18, headY + 8, 20, headY + 22, 16, headY + 34);
    ctx.bezierCurveTo(12, headY + 36, 10, headY + 34, 12, headY + 30);
    ctx.bezierCurveTo(14, headY + 20, 13, headY + 6, 11, headY - 2);
    ctx.closePath(); ctx.fill();
    // Hair shine
    ctx.fillStyle = 'rgba(255,255,255,0.15)';
    ctx.beginPath(); ctx.ellipse(-2, headY - 10, 5, 3, -0.2, 0, Math.PI * 2); ctx.fill();

  } else if (charId === 'girl2') {
    // Top bun base
    ctx.beginPath();
    ctx.ellipse(0, headY - 8, 16, 11, 0, Math.PI, Math.PI * 2);
    ctx.fill();
    // Left pigtail
    ctx.save();
    ctx.translate(-16, headY - 2);
    ctx.fillStyle = C.hair;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(-8, 6, -10, 18, -6, 30);
    ctx.bezierCurveTo(-2, 36, 2, 34, 4, 28);
    ctx.bezierCurveTo(6, 18, 4, 6, 0, 0);
    ctx.closePath(); ctx.fill();
    // Highlight
    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    ctx.beginPath(); ctx.ellipse(-3, 10, 2, 6, -0.2, 0, Math.PI * 2); ctx.fill();
    // Hair tie bow
    ctx.fillStyle = '#ff69b4';
    ctx.beginPath(); ctx.ellipse(-4, 2, 5, 3, -0.3, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(2, 1, 4, 3, 0.3, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#ff1493';
    ctx.beginPath(); ctx.arc(-1, 2, 2.5, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
    // Right pigtail
    ctx.save();
    ctx.translate(16, headY - 2);
    ctx.fillStyle = C.hair;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(8, 6, 10, 18, 6, 30);
    ctx.bezierCurveTo(2, 36, -2, 34, -4, 28);
    ctx.bezierCurveTo(-6, 18, -4, 6, 0, 0);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    ctx.beginPath(); ctx.ellipse(3, 10, 2, 6, 0.2, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#ff69b4';
    ctx.beginPath(); ctx.ellipse(4, 2, 5, 3, 0.3, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(-2, 1, 4, 3, -0.3, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#ff1493';
    ctx.beginPath(); ctx.arc(1, 2, 2.5, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
    // Hair shine
    ctx.fillStyle = 'rgba(255,255,255,0.18)';
    ctx.beginPath(); ctx.ellipse(-2, headY - 11, 4, 3, -0.2, 0, Math.PI * 2); ctx.fill();

  } else if (charId === 'boy1') {
    // Hair under cap
    ctx.beginPath();
    ctx.ellipse(0, headY - 2, 15, 10, 0, Math.PI, Math.PI * 2);
    ctx.fill();
    // Cap body
    ctx.fillStyle = C.capColor;
    ctx.beginPath();
    ctx.ellipse(0, headY - 8, 16, 10, 0, Math.PI, Math.PI * 2);
    ctx.fill();
    ctx.beginPath(); ctx.roundRect(-16, headY - 12, 32, 8, [0,0,2,2]); ctx.fill();
    // Cap brim
    ctx.fillStyle = '#1a5276';
    ctx.beginPath(); ctx.roundRect(-18, headY - 8, 36, 6, [0,0,4,4]); ctx.fill();
    // Cap button on top
    ctx.fillStyle = '#1a5276';
    ctx.beginPath(); ctx.arc(0, headY - 18, 3, 0, Math.PI * 2); ctx.fill();
    // Cap seam lines
    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.lineWidth = 0.8;
    ctx.beginPath(); ctx.moveTo(0, headY - 18); ctx.lineTo(-14, headY - 10); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, headY - 18); ctx.lineTo(14, headY - 10); ctx.stroke();
    // Cap shine
    ctx.fillStyle = 'rgba(255,255,255,0.15)';
    ctx.beginPath(); ctx.ellipse(-4, headY - 14, 5, 3, -0.3, 0, Math.PI * 2); ctx.fill();

  } else { // boy2 - par scurt normal
    // Top hair — shape rotunjit, usor bombat
    ctx.beginPath();
    ctx.ellipse(0, headY - 10, 16, 10, 0, Math.PI, Math.PI * 2);
    ctx.fill();
    // Sides — coborare pe langa urechi
    ctx.beginPath();
    ctx.roundRect(-16, headY - 12, 5, 14, [0, 0, 2, 2]);
    ctx.fill();
    ctx.beginPath();
    ctx.roundRect(11, headY - 12, 5, 14, [0, 0, 2, 2]);
    ctx.fill();
    // Part lateral stanga
    ctx.fillStyle = 'rgba(255,255,255,0.1)';
    ctx.beginPath();
    ctx.moveTo(-8, headY - 18);
    ctx.quadraticCurveTo(-2, headY - 20, 4, headY - 16);
    ctx.quadraticCurveTo(-2, headY - 14, -8, headY - 12);
    ctx.closePath();
    ctx.fill();
    // Shine
    ctx.fillStyle = 'rgba(255,255,255,0.13)';
    ctx.beginPath(); ctx.ellipse(-3, headY - 16, 5, 3, -0.2, 0, Math.PI * 2); ctx.fill();
  }

  // ── FACE DETAILS ──────────────────────────────────────────

  // Eyebrows
  ctx.strokeStyle = C.hair;
  ctx.lineWidth = isGirl ? 1.2 : 1.8;
  ctx.lineCap = 'round';
  if (isGirl) {
    // Arched eyebrows
    ctx.beginPath(); ctx.arc(-6, headY - 5, 5, Math.PI + 0.5, Math.PI * 2 - 0.5); ctx.stroke();
    ctx.beginPath(); ctx.arc(6, headY - 5, 5, Math.PI + 0.5, Math.PI * 2 - 0.5); ctx.stroke();
  } else {
    // Straight/slight arch
    ctx.beginPath(); ctx.moveTo(-10, headY - 5); ctx.quadraticCurveTo(-6, headY - 7, -2, headY - 5); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(2, headY - 5); ctx.quadraticCurveTo(6, headY - 7, 10, headY - 5); ctx.stroke();
  }

  // Eyes — whites
  ctx.fillStyle = '#fff';
  ctx.beginPath(); ctx.ellipse(-6, headY + 1, 5, 4, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(6, headY + 1, 5, 4, 0, 0, Math.PI * 2); ctx.fill();

  // Iris
  ctx.fillStyle = C.eyeColor;
  ctx.beginPath(); ctx.ellipse(-6, headY + 1, 3, 3.5, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(6, headY + 1, 3, 3.5, 0, 0, Math.PI * 2); ctx.fill();

  // Pupil
  ctx.fillStyle = '#111';
  ctx.beginPath(); ctx.ellipse(-6, headY + 1.5, 1.6, 2, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(6, headY + 1.5, 1.6, 2, 0, 0, Math.PI * 2); ctx.fill();

  // Eye shine
  ctx.fillStyle = '#fff';
  ctx.beginPath(); ctx.arc(-5, headY - 0.5, 1, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(7, headY - 0.5, 1, 0, Math.PI * 2); ctx.fill();

  // Eye outline
  ctx.strokeStyle = 'rgba(0,0,0,0.25)';
  ctx.lineWidth = 0.7;
  ctx.beginPath(); ctx.ellipse(-6, headY + 1, 5, 4, 0, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath(); ctx.ellipse(6, headY + 1, 5, 4, 0, 0, Math.PI * 2); ctx.stroke();

  // Eyelashes (girls only)
  if (isGirl) {
    ctx.strokeStyle = '#222';
    ctx.lineWidth = 1;
    const lashPositions = [-9, -7, -5, -3];
    const rLashPositions = [3, 5, 7, 9];
    for (const lx of lashPositions) {
      ctx.beginPath();
      ctx.moveTo(lx, headY - 3);
      ctx.lineTo(lx - 0.5, headY - 6);
      ctx.stroke();
    }
    for (const lx of rLashPositions) {
      ctx.beginPath();
      ctx.moveTo(lx, headY - 3);
      ctx.lineTo(lx + 0.5, headY - 6);
      ctx.stroke();
    }
  }

  // Nose
  ctx.strokeStyle = 'rgba(0,0,0,0.18)';
  ctx.lineWidth = 1;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(-2, headY + 5);
  ctx.quadraticCurveTo(-3, headY + 9, 0, headY + 10);
  ctx.quadraticCurveTo(3, headY + 9, 2, headY + 5);
  ctx.stroke();

  // Mouth
  if (isGirl) {
    // Lips
    ctx.fillStyle = charId === 'girl1' ? '#e07070' : '#c0608a';
    ctx.beginPath();
    ctx.moveTo(-6, headY + 12);
    ctx.quadraticCurveTo(0, headY + 16, 6, headY + 12);
    ctx.quadraticCurveTo(0, headY + 18, -6, headY + 12);
    ctx.closePath(); ctx.fill();
    // Upper lip highlight
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.beginPath(); ctx.ellipse(0, headY + 13, 3, 1.5, 0, 0, Math.PI * 2); ctx.fill();
  } else {
    // Boy smile — no teeth
    ctx.strokeStyle = 'rgba(0,0,0,0.35)';
    ctx.lineWidth = 1.5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-5, headY + 12);
    ctx.quadraticCurveTo(0, headY + 17, 5, headY + 12);
    ctx.stroke();
  }

  // Blush (girls)
  if (isGirl) {
    ctx.fillStyle = 'rgba(255,120,120,0.25)';
    ctx.beginPath(); ctx.ellipse(-9, headY + 6, 4, 3, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(9, headY + 6, 4, 3, 0, 0, Math.PI * 2); ctx.fill();
  }

  // ── ACCESSORIES ───────────────────────────────────────────

  if (acc.includes('sunglasses')) {
    ctx.fillStyle = 'rgba(0,0,0,0.75)';
    ctx.beginPath(); ctx.ellipse(-6, headY + 1, 5.5, 4, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(6, headY + 1, 5.5, 4, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#333'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(-11, headY + 1); ctx.lineTo(-16, headY); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(11, headY + 1); ctx.lineTo(16, headY); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-0.5, headY + 1); ctx.lineTo(0.5, headY + 1); ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    ctx.beginPath(); ctx.ellipse(-7, headY - 1, 2, 1.5, -0.3, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(5, headY - 1, 2, 1.5, -0.3, 0, Math.PI * 2); ctx.fill();
  }

  if (acc.includes('crown')) {
    ctx.fillStyle = '#f7c948';
    ctx.beginPath();
    ctx.moveTo(-14, headY - 16);
    ctx.lineTo(-14, headY - 26);
    ctx.lineTo(-7,  headY - 20);
    ctx.lineTo(0,   headY - 28);
    ctx.lineTo(7,   headY - 20);
    ctx.lineTo(14,  headY - 26);
    ctx.lineTo(14,  headY - 16);
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = '#e6a800'; ctx.lineWidth = 1;
    ctx.stroke();
    ctx.fillStyle = '#e84040';
    ctx.beginPath(); ctx.arc(0, headY - 26, 2.5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#3498db';
    ctx.beginPath(); ctx.arc(-10, headY - 22, 2, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(10, headY - 22, 2, 0, Math.PI * 2); ctx.fill();
  }

  if (acc.includes('hat')) {
    ctx.fillStyle = '#222';
    ctx.beginPath(); ctx.roundRect(-18, headY - 10, 36, 6, 2); ctx.fill(); // brim
    ctx.fillStyle = '#1a1a1a';
    ctx.beginPath(); ctx.roundRect(-12, headY - 30, 24, 22, [4,4,0,0]); ctx.fill(); // top
    ctx.fillStyle = 'rgba(255,255,255,0.08)';
    ctx.beginPath(); ctx.roundRect(-12, headY - 30, 10, 22, [4,0,0,0]); ctx.fill();
    ctx.fillStyle = '#e84040';
    ctx.fillRect(-12, headY - 12, 24, 3); // band
  }

  if (acc.includes('scarf')) {
    const scarfY = -52 + bodyBob;
    ctx.fillStyle = '#e84040';
    ctx.beginPath(); ctx.roundRect(-14, scarfY, 28, 8, 4); ctx.fill();
    ctx.fillStyle = '#fff';
    for (let i = 0; i < 4; i++) ctx.fillRect(-10 + i * 7, scarfY + 2, 3, 4);
    // tail
    ctx.fillStyle = '#e84040';
    ctx.beginPath(); ctx.roundRect(8, scarfY + 6, 8, 20, 3); ctx.fill();
  }

  if (acc.includes('cape')) {
    ctx.fillStyle = '#8e44ad';
    ctx.beginPath();
    ctx.moveTo(-14, -46 + bodyBob);
    ctx.lineTo(14,  -46 + bodyBob);
    ctx.lineTo(20,  -10 + bodyBob);
    ctx.lineTo(0,    0  + bodyBob);
    ctx.lineTo(-20, -10 + bodyBob);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#f7c948';
    ctx.beginPath(); ctx.roundRect(-2, -46 + bodyBob, 4, 6, 1); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.1)';
    ctx.beginPath();
    ctx.moveTo(-14, -46 + bodyBob); ctx.lineTo(-4, -46 + bodyBob);
    ctx.lineTo(-10, -10 + bodyBob); ctx.lineTo(-20, -10 + bodyBob);
    ctx.closePath(); ctx.fill();
  }

  if (acc.includes('backpack')) {
    ctx.fillStyle = '#e67e22';
    ctx.beginPath(); ctx.roundRect(12, -44 + bodyBob, 14, 22, 3); ctx.fill();
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.beginPath(); ctx.roundRect(13, -38 + bodyBob, 12, 10, 2); ctx.fill();
    ctx.strokeStyle = '#cc6600'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(12, -44 + bodyBob); ctx.lineTo(10, -22 + bodyBob); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(26, -44 + bodyBob); ctx.lineTo(24, -22 + bodyBob); ctx.stroke();
  }

  // ── OCHELARI SUPLIMENTARI ────────────────────────────────
  if (acc.includes('heart_glasses')) {
    // Heart-shaped lenses
    const hgY = headY + 1;
    ctx.fillStyle = 'rgba(255,80,120,0.8)';
    for (const sx of [-6, 6]) {
      ctx.save(); ctx.translate(sx, hgY);
      ctx.beginPath();
      ctx.moveTo(0, 3); ctx.bezierCurveTo(-6, -4, -8, 1, 0, 5);
      ctx.bezierCurveTo(8, 1, 6, -4, 0, 3); ctx.closePath(); ctx.fill();
      ctx.restore();
    }
    ctx.strokeStyle = '#cc0044'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(-11, hgY); ctx.lineTo(-16, hgY - 1); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(11, hgY); ctx.lineTo(16, hgY - 1); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-0.5, hgY + 1); ctx.lineTo(0.5, hgY + 1); ctx.stroke();
  }

  if (acc.includes('nerd_glasses')) {
    const ngY = headY + 1;
    ctx.strokeStyle = '#333'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.roundRect(-11, ngY - 4, 10, 8, 2); ctx.stroke();
    ctx.beginPath(); ctx.roundRect(1, ngY - 4, 10, 8, 2); ctx.stroke();
    ctx.fillStyle = 'rgba(180,220,255,0.3)';
    ctx.beginPath(); ctx.roundRect(-11, ngY - 4, 10, 8, 2); ctx.fill();
    ctx.beginPath(); ctx.roundRect(1, ngY - 4, 10, 8, 2); ctx.fill();
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(-1, ngY); ctx.lineTo(1, ngY); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-11, ngY); ctx.lineTo(-16, ngY - 1); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(11, ngY); ctx.lineTo(16, ngY - 1); ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    ctx.beginPath(); ctx.ellipse(-7, ngY - 2, 2, 1.5, -0.3, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(5, ngY - 2, 2, 1.5, -0.3, 0, Math.PI * 2); ctx.fill();
  }

  // ── PĂLĂRII SUPLIMENTARE ─────────────────────────────────
  if (acc.includes('cowboy')) {
    ctx.fillStyle = '#8B4513';
    ctx.beginPath(); ctx.roundRect(-22, headY - 10, 44, 6, 2); ctx.fill(); // brim
    ctx.fillStyle = '#6B3410';
    ctx.beginPath(); ctx.roundRect(-11, headY - 32, 22, 24, [4,4,0,0]); ctx.fill(); // crown
    ctx.fillStyle = '#5a2a0a';
    ctx.beginPath(); ctx.moveTo(-22, headY - 10); ctx.quadraticCurveTo(-28, headY - 8, -24, headY - 4); ctx.lineTo(-22, headY - 4); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(22, headY - 10); ctx.quadraticCurveTo(28, headY - 8, 24, headY - 4); ctx.lineTo(22, headY - 4); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#f7c948';
    ctx.fillRect(-11, headY - 13, 22, 3); // band
    ctx.fillStyle = '#e6a800';
    ctx.beginPath(); ctx.arc(0, headY - 11, 3, 0, Math.PI * 2); ctx.fill(); // buckle
  }

  if (acc.includes('party_hat')) {
    ctx.fillStyle = '#e84040';
    ctx.beginPath();
    ctx.moveTo(0, headY - 38);
    ctx.lineTo(-14, headY - 16);
    ctx.lineTo(14, headY - 16);
    ctx.closePath(); ctx.fill();
    // stripes
    ctx.strokeStyle = '#f7c948'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(-7, headY - 27); ctx.lineTo(7, headY - 27); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-11, headY - 20); ctx.lineTo(11, headY - 20); ctx.stroke();
    // pompom
    ctx.fillStyle = '#f7c948';
    ctx.beginPath(); ctx.arc(0, headY - 40, 4, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#ffe066';
    ctx.beginPath(); ctx.arc(-1, headY - 41, 2, 0, Math.PI * 2); ctx.fill();
    // elastic
    ctx.strokeStyle = 'rgba(0,0,0,0.3)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(-14, headY - 16); ctx.lineTo(-16, headY + 4); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(14, headY - 16); ctx.lineTo(16, headY + 4); ctx.stroke();
  }

  // ── CĂCIULI ──────────────────────────────────────────────
  const beanieColors = {
    beanie_red:    ['#cc2200','#ff4422'],
    beanie_blue:   ['#1a4aaa','#3370dd'],
    beanie_stripe: ['#cc2200','#fff'],
    beanie_green:  ['#1a7a30','#2ecc71'],
    beanie_purple: ['#6a0dad','#9b59b6'],
    beanie_yellow: ['#cc8800','#f7c948'],
    beanie_black:  ['#111','#444'],
  };
  const beanieId = acc.find(a => a.startsWith('beanie_'));
  if (beanieId) {
    const [c1, c2] = beanieColors[beanieId];
    // Body
    ctx.fillStyle = c1;
    ctx.beginPath(); ctx.ellipse(0, headY - 10, 17, 13, 0, Math.PI, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.roundRect(-17, headY - 12, 34, 8, [0,0,4,4]); ctx.fill();
    if (beanieId === 'beanie_stripe') {
      ctx.fillStyle = c2;
      for (let i = 0; i < 3; i++) {
        ctx.fillRect(-17 + i * 12, headY - 22, 6, 18);
      }
      ctx.fillStyle = c1;
      ctx.beginPath(); ctx.ellipse(0, headY - 10, 17, 13, 0, Math.PI, Math.PI * 2); ctx.fill(); // redraw over stripes outside
    } else {
      ctx.fillStyle = c2;
      ctx.fillRect(-17, headY - 14, 34, 4);
    }
    // Pompon
    ctx.fillStyle = c2 === '#fff' ? c1 : c2;
    ctx.beginPath(); ctx.arc(0, headY - 22, 5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    ctx.beginPath(); ctx.arc(-2, headY - 24, 2, 0, Math.PI * 2); ctx.fill();
  }

  // ── TRICOURI ─────────────────────────────────────────────
  const torsoTop = -46 + bodyBob, torsoBot = -22 + bodyBob;
  if (acc.includes('shirt_rainbow')) {
    const colors = ['#e84040','#e67e22','#f7c948','#2ecc71','#3498db','#8e44ad'];
    const stripeH = 4;
    for (let i = 0; i < colors.length; i++) {
      ctx.fillStyle = colors[i];
      ctx.fillRect(-13, torsoTop + i * stripeH, 27, stripeH);
    }
    ctx.fillStyle = 'rgba(255,255,255,0.12)';
    ctx.fillRect(-13, torsoTop, 8, 24);
  }
  if (acc.includes('shirt_star')) {
    ctx.fillStyle = '#1a1a6e';
    ctx.fillRect(-13, torsoTop, 27, 24);
    ctx.fillStyle = '#f7c948';
    const starPositions = [[-5, torsoTop+5], [5, torsoTop+13], [-7, torsoTop+16], [6, torsoTop+4], [0, torsoTop+10]];
    for (const [sx, sy] of starPositions) {
      ctx.font = '8px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('★', sx, sy + 6);
    }
  }
  if (acc.includes('shirt_flame')) {
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(-13, torsoTop, 27, 24);
    const flameColors = ['#e84040','#e67e22','#f7c948'];
    for (const [fi, fc] of flameColors.entries()) {
      ctx.fillStyle = fc;
      ctx.beginPath();
      ctx.moveTo(-13, torsoBot);
      ctx.quadraticCurveTo(-6, torsoBot - 8 - fi*3, -2, torsoBot - 4 - fi*2);
      ctx.quadraticCurveTo(2, torsoBot - 10 - fi*3, 7, torsoBot - 5 - fi*2);
      ctx.quadraticCurveTo(11, torsoBot - 8 - fi*3, 14, torsoBot);
      ctx.closePath(); ctx.fill();
    }
  }

  // ── PANTALONI ────────────────────────────────────────────
  if (acc.includes('pants_jeans')) {
    ctx.fillStyle = '#3a5fa0';
    const hp = -20 + bodyBob;
    ctx.save();
    ctx.translate(-6, hp); ctx.rotate(walk * 14 * Math.PI / 180);
    ctx.beginPath(); ctx.roundRect(-5, 0, 10, 22, 3); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.08)'; ctx.fillRect(-3, 2, 4, 16);
    ctx.restore();
    ctx.save();
    ctx.translate(6, hp); ctx.rotate(-walk * 14 * Math.PI / 180);
    ctx.fillStyle = '#3a5fa0';
    ctx.beginPath(); ctx.roundRect(-5, 0, 10, 22, 3); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.08)'; ctx.fillRect(-1, 2, 4, 16);
    ctx.restore();
  }
  if (acc.includes('pants_shorts')) {
    // Draw skin over lower half of pants to simulate shorts
    ctx.fillStyle = C.skin;
    const hp = -20 + bodyBob;
    ctx.save();
    ctx.translate(-6, hp); ctx.rotate(walk * 14 * Math.PI / 180);
    ctx.fillRect(-6, 11, 12, 12);
    ctx.restore();
    ctx.save();
    ctx.translate(6, hp); ctx.rotate(-walk * 14 * Math.PI / 180);
    ctx.fillRect(-6, 11, 12, 12);
    ctx.restore();
    // Short hem line
    ctx.strokeStyle = 'rgba(0,0,0,0.2)'; ctx.lineWidth = 1.5;
    ctx.save(); ctx.translate(-6, hp); ctx.rotate(walk * 14 * Math.PI / 180);
    ctx.beginPath(); ctx.moveTo(-5, 12); ctx.lineTo(5, 12); ctx.stroke(); ctx.restore();
    ctx.save(); ctx.translate(6, hp); ctx.rotate(-walk * 14 * Math.PI / 180);
    ctx.beginPath(); ctx.moveTo(-5, 12); ctx.lineTo(5, 12); ctx.stroke(); ctx.restore();
  }
  if (acc.includes('pants_stripe')) {
    const hp = -20 + bodyBob;
    ctx.save(); ctx.translate(-6, hp); ctx.rotate(walk * 14 * Math.PI / 180);
    ctx.fillStyle = '#f7c948'; ctx.fillRect(-5, 0, 3, 22);
    ctx.restore();
    ctx.save(); ctx.translate(6, hp); ctx.rotate(-walk * 14 * Math.PI / 180);
    ctx.fillStyle = '#f7c948'; ctx.fillRect(2, 0, 3, 22);
    ctx.restore();
  }

  // ── PANTALONI SUPLIMENTARI ───────────────────────────────
  if (acc.includes('pants_camo')) {
    const hp = -20 + bodyBob;
    const camoCols = ['#4a5e2a','#6b7c3a','#3a4820','#8a9a5a'];
    for (const side of [-1, 1]) {
      ctx.save(); ctx.translate(side * 6, hp); ctx.rotate(-side * walk * 14 * Math.PI / 180);
      ctx.fillStyle = camoCols[0]; ctx.beginPath(); ctx.roundRect(-5, 0, 10, 22, 3); ctx.fill();
      ctx.fillStyle = camoCols[1]; ctx.fillRect(-4, 2, 4, 5); ctx.fillRect(0, 10, 3, 6);
      ctx.fillStyle = camoCols[2]; ctx.fillRect(-2, 7, 5, 4); ctx.fillRect(-4, 15, 3, 5);
      ctx.fillStyle = camoCols[3]; ctx.fillRect(1, 4, 3, 3); ctx.fillRect(-3, 13, 4, 3);
      ctx.restore();
    }
  }
  if (acc.includes('pants_rainbow')) {
    const hp = -20 + bodyBob;
    const prc = ['#e84040','#e67e22','#f7c948','#2ecc71','#3498db','#8e44ad'];
    for (const side of [-1, 1]) {
      ctx.save(); ctx.translate(side * 6, hp); ctx.rotate(-side * walk * 14 * Math.PI / 180);
      for (let i = 0; i < prc.length; i++) {
        ctx.fillStyle = prc[i];
        ctx.fillRect(-5, i * 3.6, 10, 3.7);
      }
      ctx.restore();
    }
  }
  if (acc.includes('pants_gold')) {
    const hp = -20 + bodyBob;
    for (const side of [-1, 1]) {
      ctx.save(); ctx.translate(side * 6, hp); ctx.rotate(-side * walk * 14 * Math.PI / 180);
      ctx.fillStyle = '#c8a400';
      ctx.beginPath(); ctx.roundRect(-5, 0, 10, 22, 3); ctx.fill();
      ctx.fillStyle = '#f7c948'; ctx.fillRect(-4, 0, 5, 22);
      ctx.fillStyle = 'rgba(255,255,255,0.25)'; ctx.fillRect(-3, 1, 2, 18);
      ctx.restore();
    }
  }
  if (acc.includes('pants_flower')) {
    const hp = -20 + bodyBob;
    for (const side of [-1, 1]) {
      ctx.save(); ctx.translate(side * 6, hp); ctx.rotate(-side * walk * 14 * Math.PI / 180);
      ctx.fillStyle = '#fff0f5';
      ctx.beginPath(); ctx.roundRect(-5, 0, 10, 22, 3); ctx.fill();
      const flowers = [[0, 5], [-3, 14], [2, 11]];
      for (const [fx, fy] of flowers) {
        ctx.fillStyle = '#ff6eb0';
        for (let a = 0; a < 5; a++) {
          const ra = a * Math.PI * 2 / 5;
          ctx.beginPath(); ctx.ellipse(fx + Math.cos(ra)*2.5, fy + Math.sin(ra)*2.5, 2, 1.5, ra, 0, Math.PI*2); ctx.fill();
        }
        ctx.fillStyle = '#f7c948';
        ctx.beginPath(); ctx.arc(fx, fy, 1.5, 0, Math.PI*2); ctx.fill();
      }
      ctx.restore();
    }
  }

  // ── TRICOURI SUPLIMENTARE ────────────────────────────────
  if (acc.includes('shirt_camo')) {
    const camoCols = ['#4a5e2a','#6b7c3a','#3a4820','#8a9a5a'];
    ctx.fillStyle = camoCols[0]; ctx.fillRect(-13, torsoTop, 27, 24);
    ctx.fillStyle = camoCols[1]; ctx.fillRect(-10, torsoTop+2, 8, 7); ctx.fillRect(2, torsoTop+10, 7, 6);
    ctx.fillStyle = camoCols[2]; ctx.fillRect(-4, torsoTop+5, 6, 8); ctx.fillRect(-11, torsoTop+14, 9, 6);
    ctx.fillStyle = camoCols[3]; ctx.fillRect(5, torsoTop+2, 5, 5); ctx.fillRect(-2, torsoTop+17, 7, 5);
  }
  if (acc.includes('shirt_heart')) {
    ctx.fillStyle = '#ff4477'; ctx.fillRect(-13, torsoTop, 27, 24);
    ctx.fillStyle = '#fff';
    ctx.save(); ctx.translate(0, torsoTop + 12);
    ctx.beginPath(); ctx.moveTo(0, 5); ctx.bezierCurveTo(-9,-6,-14,2,0,10); ctx.bezierCurveTo(14,2,9,-6,0,5); ctx.closePath(); ctx.fill();
    ctx.restore();
    ctx.fillStyle = 'rgba(255,255,255,0.15)'; ctx.fillRect(-13, torsoTop, 8, 24);
  }
  if (acc.includes('shirt_lightning')) {
    ctx.fillStyle = '#1a1a4e'; ctx.fillRect(-13, torsoTop, 27, 24);
    ctx.fillStyle = '#f7c948';
    ctx.beginPath();
    ctx.moveTo(2, torsoTop+1); ctx.lineTo(-5, torsoTop+12); ctx.lineTo(1, torsoTop+12);
    ctx.lineTo(-4, torsoTop+23); ctx.lineTo(7, torsoTop+10); ctx.lineTo(1, torsoTop+10);
    ctx.lineTo(8, torsoTop+1); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = '#e6a800'; ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(2, torsoTop+1); ctx.lineTo(-5, torsoTop+12); ctx.lineTo(1, torsoTop+12);
    ctx.lineTo(-4, torsoTop+23); ctx.stroke();
  }
  if (acc.includes('shirt_flower')) {
    ctx.fillStyle = '#fff0f5'; ctx.fillRect(-13, torsoTop, 27, 24);
    const sflowers = [[-5, torsoTop+7], [6, torsoTop+5], [0, torsoTop+16], [-8, torsoTop+17]];
    for (const [fx, fy] of sflowers) {
      ctx.fillStyle = '#ff88c8';
      for (let a = 0; a < 5; a++) {
        const ra = a * Math.PI * 2 / 5;
        ctx.beginPath(); ctx.ellipse(fx + Math.cos(ra)*3, fy + Math.sin(ra)*3, 2.5, 1.8, ra, 0, Math.PI*2); ctx.fill();
      }
      ctx.fillStyle = '#f7c948';
      ctx.beginPath(); ctx.arc(fx, fy, 2, 0, Math.PI*2); ctx.fill();
    }
  }

  // ── TOPURI (ACC FAȚĂ) ───────────────────────────────────
  if (acc.includes('top_bow')) {
    ctx.save(); ctx.translate(0, -46 + bodyBob);
    ctx.fillStyle = '#ff4488';
    // stanga funda
    ctx.beginPath(); ctx.moveTo(0,-2); ctx.bezierCurveTo(-14,-14,-16,-4,-10,0); ctx.bezierCurveTo(-14,4,-14,14,0,2); ctx.closePath(); ctx.fill();
    // dreapta funda
    ctx.beginPath(); ctx.moveTo(0,-2); ctx.bezierCurveTo(14,-14,16,-4,10,0); ctx.bezierCurveTo(14,4,14,14,0,2); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#ff88bb';
    ctx.beginPath(); ctx.ellipse(0, 0, 4, 3, 0, 0, Math.PI*2); ctx.fill();
    ctx.restore();
  }
  if (acc.includes('top_medal')) {
    ctx.save(); ctx.translate(0, -36 + bodyBob);
    ctx.strokeStyle = '#c8a400'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(-3, -10); ctx.lineTo(3, -10); ctx.lineTo(0, 0); ctx.closePath(); ctx.stroke();
    ctx.fillStyle = '#f7c948';
    ctx.beginPath(); ctx.arc(0, 8, 8, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#e6a800';
    ctx.beginPath(); ctx.arc(0, 8, 8, 0, Math.PI*2); ctx.stroke();
    ctx.fillStyle = '#ffe066'; ctx.font = 'bold 8px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('1', 0, 9);
    ctx.restore();
  }
  if (acc.includes('top_anchor')) {
    ctx.save(); ctx.translate(5, -38 + bodyBob);
    ctx.strokeStyle = '#1a3a6e'; ctx.lineWidth = 2.5; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.arc(0, -4, 4, 0, Math.PI*2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 12); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-5, 4); ctx.lineTo(5, 4); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, 12); ctx.bezierCurveTo(-7, 12, -7, 6, -7, 8); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, 12); ctx.bezierCurveTo(7, 12, 7, 6, 7, 8); ctx.stroke();
    ctx.restore();
  }

  // ── OCHELARI SUPLIMENTARI 2 ──────────────────────────────
  if (acc.includes('glasses_round')) {
    const gy = headY + 1;
    ctx.strokeStyle = '#8B4513'; ctx.lineWidth = 2.2;
    ctx.beginPath(); ctx.arc(-7, gy, 5, 0, Math.PI*2); ctx.stroke();
    ctx.beginPath(); ctx.arc(7, gy, 5, 0, Math.PI*2); ctx.stroke();
    ctx.fillStyle = 'rgba(180,230,255,0.25)';
    ctx.beginPath(); ctx.arc(-7, gy, 5, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(7, gy, 5, 0, Math.PI*2); ctx.fill();
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(-2, gy); ctx.lineTo(2, gy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-12, gy-1); ctx.lineTo(-16, gy-2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(12, gy-1); ctx.lineTo(16, gy-2); ctx.stroke();
  }
  if (acc.includes('glasses_cat')) {
    const gy = headY + 1;
    ctx.fillStyle = 'rgba(180,60,200,0.7)';
    ctx.beginPath(); ctx.moveTo(-12, gy+3); ctx.lineTo(-12, gy-3); ctx.lineTo(-5, gy-5); ctx.lineTo(-2, gy-2); ctx.lineTo(-2, gy+3); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(2, gy+3); ctx.lineTo(2, gy-2); ctx.lineTo(5, gy-5); ctx.lineTo(12, gy-3); ctx.lineTo(12, gy+3); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = '#6a0dad'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(-12, gy+3); ctx.lineTo(-12, gy-3); ctx.lineTo(-5, gy-5); ctx.lineTo(-2, gy-2); ctx.lineTo(-2, gy+3); ctx.closePath(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(2, gy+3); ctx.lineTo(2, gy-2); ctx.lineTo(5, gy-5); ctx.lineTo(12, gy-3); ctx.lineTo(12, gy+3); ctx.closePath(); ctx.stroke();
    ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.moveTo(-2, gy); ctx.lineTo(2, gy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-12, gy); ctx.lineTo(-16, gy-1); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(12, gy); ctx.lineTo(16, gy-1); ctx.stroke();
  }
  if (acc.includes('glasses_star')) {
    const gy = headY + 1;
    ctx.fillStyle = 'rgba(255,210,0,0.75)';
    for (const cx of [-7, 7]) {
      ctx.save(); ctx.translate(cx, gy);
      ctx.beginPath();
      for (let p2 = 0; p2 < 5; p2++) {
        const a = p2 * Math.PI * 2 / 5 - Math.PI / 2;
        const b = a + Math.PI / 5;
        if (p2 === 0) ctx.moveTo(Math.cos(a)*6, Math.sin(a)*6); else ctx.lineTo(Math.cos(a)*6, Math.sin(a)*6);
        ctx.lineTo(Math.cos(b)*3, Math.sin(b)*3);
      }
      ctx.closePath(); ctx.fill();
      ctx.restore();
    }
    ctx.strokeStyle = '#e6a800'; ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.moveTo(-2, gy); ctx.lineTo(2, gy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-13, gy-1); ctx.lineTo(-16, gy-2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(13, gy-1); ctx.lineTo(16, gy-2); ctx.stroke();
  }
  if (acc.includes('glasses_3d')) {
    const gy = headY + 1;
    ctx.fillStyle = 'rgba(255,30,30,0.6)';
    ctx.beginPath(); ctx.roundRect(-12, gy-4, 10, 8, 2); ctx.fill();
    ctx.fillStyle = 'rgba(30,80,255,0.6)';
    ctx.beginPath(); ctx.roundRect(2, gy-4, 10, 8, 2); ctx.fill();
    ctx.strokeStyle = '#222'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.roundRect(-12, gy-4, 10, 8, 2); ctx.stroke();
    ctx.beginPath(); ctx.roundRect(2, gy-4, 10, 8, 2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-2, gy); ctx.lineTo(2, gy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-12, gy); ctx.lineTo(-16, gy-1); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(12, gy); ctx.lineTo(16, gy-1); ctx.stroke();
  }

  // ── PĂLĂRII SUPLIMENTARE 2 ───────────────────────────────
  if (acc.includes('hat_pirate')) {
    ctx.fillStyle = '#1a1a1a';
    ctx.beginPath(); ctx.roundRect(-20, headY - 8, 40, 6, 2); ctx.fill(); // brim
    ctx.beginPath(); ctx.roundRect(-12, headY - 28, 24, 22, [4,4,0,0]); ctx.fill(); // crown
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.moveTo(-8, headY-26); ctx.lineTo(0, headY-36); ctx.lineTo(8, headY-26); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#333';
    ctx.beginPath(); ctx.arc(-4, headY-29, 3, 0, Math.PI*2); ctx.fill(); // eye socket skull
    ctx.beginPath(); ctx.arc(4, headY-29, 3, 0, Math.PI*2); ctx.fill();
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(-5, headY-22); ctx.lineTo(-2, headY-19); ctx.lineTo(2, headY-19); ctx.lineTo(5, headY-22); ctx.stroke(); // crossbones hint
  }
  if (acc.includes('hat_witch')) {
    ctx.fillStyle = '#2a0a4a';
    ctx.beginPath(); ctx.roundRect(-22, headY - 8, 44, 7, 3); ctx.fill(); // brim
    ctx.beginPath(); ctx.moveTo(0, headY-42); ctx.lineTo(-12, headY-8); ctx.lineTo(12, headY-8); ctx.closePath(); ctx.fill(); // cone
    ctx.fillStyle = '#6a0dad';
    ctx.fillRect(-22, headY-8, 44, 3); // band
    ctx.fillStyle = '#f7c948';
    ctx.beginPath(); ctx.arc(0, headY-8, 3, 0, Math.PI*2); ctx.fill(); // buckle
    // stars on hat
    ctx.fillStyle = '#ffe066'; ctx.font = '7px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('✦', -6, headY-22); ctx.fillText('✦', 5, headY-30);
  }
  if (acc.includes('hat_chef')) {
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.roundRect(-14, headY - 10, 28, 8, [0,0,4,4]); ctx.fill(); // band
    // puff top
    ctx.beginPath(); ctx.ellipse(0, headY-18, 14, 14, 0, Math.PI, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(-6, headY-20, 9, 9, 0, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(6, headY-20, 9, 9, 0, 0, Math.PI*2); ctx.fill();
    ctx.strokeStyle = '#ddd'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(-14, headY-10); ctx.lineTo(14, headY-10); ctx.stroke();
  }

  ctx.restore();
}

// ─── CHARACTER SELECT ───────────────────────────────────────
let selectedChar = null;

function initCharSelect() {
  const cards = document.querySelectorAll('.char-card');
  cards.forEach(card => {
    const id = card.dataset.char;
    const canvas = card.querySelector('.char-canvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawCharacter(ctx, id, canvas.width / 2, canvas.height - 20, 1.1, 0);

    card.addEventListener('click', () => {
      cards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      selectedChar = id;
      setTimeout(() => { showScreen('screen-world'); initWorldSelect(); }, 350);
    });
  });

  // Personajele stau static pe ecranul de selectie (frame=0)
}

// ─── WORLD SELECT ────────────────────────────────────────────
function initWorldSelect() {
  const grid = document.getElementById('world-grid');
  grid.innerHTML = '';
  for (const world of WORLDS) {
    const card = document.createElement('div');
    card.className = 'world-card' + (selectedWorld && selectedWorld.id === world.id ? ' selected' : '');
    card.innerHTML = `<div class="world-card-icon">${world.icon}</div><div class="world-card-name">${world.name}</div>`;
    card.addEventListener('click', () => {
      selectedWorld = world;
      startGame(selectedChar);
    });
    grid.appendChild(card);
  }
}

document.getElementById('btn-world-back').addEventListener('click', () => {
  showScreen('screen-chars');
});

// ─── SHOP STATE ─────────────────────────────────────────────
const SHOP_ITEMS = [
  // Ochelari
  { id: 'sunglasses',     name: 'Ochelari soare',   icon: '🕶️', price: 30, cat: 'ochelari' },
  { id: 'heart_glasses',  name: 'Ochelari inimă',   icon: '🩷',  price: 40, cat: 'ochelari' },
  { id: 'nerd_glasses',   name: 'Ochelari nerd',    icon: '🤓',  price: 35, cat: 'ochelari' },
  { id: 'glasses_round',  name: 'Ochelari rotunzi', icon: '🔵',  price: 45, cat: 'ochelari' },
  { id: 'glasses_cat',    name: 'Ochi de pisică',   icon: '😸',  price: 55, cat: 'ochelari' },
  { id: 'glasses_star',   name: 'Ochelari stea',    icon: '⭐',  price: 60, cat: 'ochelari' },
  { id: 'glasses_3d',     name: 'Ochelari 3D',      icon: '🎬',  price: 50, cat: 'ochelari' },
  // Pălării
  { id: 'hat',            name: 'Joben',            icon: '🎩',  price: 50, cat: 'palarii' },
  { id: 'cowboy',         name: 'Cowboy',           icon: '🤠',  price: 65, cat: 'palarii' },
  { id: 'party_hat',      name: 'Petrecere',        icon: '🎉',  price: 30, cat: 'palarii' },
  { id: 'crown',          name: 'Coroană',          icon: '👑',  price: 80, cat: 'palarii' },
  { id: 'hat_pirate',     name: 'Pirat',            icon: '🏴‍☠️', price: 70, cat: 'palarii' },
  { id: 'hat_witch',      name: 'Vrăjitoare',       icon: '🧙',  price: 75, cat: 'palarii' },
  { id: 'hat_chef',       name: 'Bucătar',          icon: '👨‍🍳', price: 55, cat: 'palarii' },
  // Căciuli
  { id: 'beanie_red',     name: 'Căciulă roșie',    icon: '🔴',  price: 25, cat: 'caciuli' },
  { id: 'beanie_blue',    name: 'Căciulă albastră', icon: '🔵',  price: 25, cat: 'caciuli' },
  { id: 'beanie_stripe',  name: 'Căciulă dungată',  icon: '🧶',  price: 35, cat: 'caciuli' },
  { id: 'beanie_green',   name: 'Căciulă verde',    icon: '🟢',  price: 25, cat: 'caciuli' },
  { id: 'beanie_purple',  name: 'Căciulă mov',      icon: '🟣',  price: 30, cat: 'caciuli' },
  { id: 'beanie_yellow',  name: 'Căciulă galbenă',  icon: '🟡',  price: 30, cat: 'caciuli' },
  { id: 'beanie_black',   name: 'Căciulă neagră',   icon: '⚫',  price: 20, cat: 'caciuli' },
  // Tricouri
  { id: 'shirt_rainbow',  name: 'Curcubeu',         icon: '🌈',  price: 60, cat: 'tricouri' },
  { id: 'shirt_star',     name: 'Cu stele',         icon: '⭐',  price: 50, cat: 'tricouri' },
  { id: 'shirt_flame',    name: 'Cu flăcări',       icon: '🔥',  price: 70, cat: 'tricouri' },
  { id: 'shirt_camo',     name: 'Camuflaj',         icon: '🪖',  price: 55, cat: 'tricouri' },
  { id: 'shirt_heart',    name: 'Cu inimi',         icon: '💕',  price: 45, cat: 'tricouri' },
  { id: 'shirt_lightning',name: 'Fulger',           icon: '⚡',  price: 65, cat: 'tricouri' },
  { id: 'shirt_flower',   name: 'Cu flori',         icon: '🌸',  price: 50, cat: 'tricouri' },
  // Topuri
  { id: 'cape',           name: 'Pelerină',         icon: '🦸',  price: 70, cat: 'topuri' },
  { id: 'backpack',       name: 'Rucsac',           icon: '🎒',  price: 60, cat: 'topuri' },
  { id: 'scarf',          name: 'Eșarfă',           icon: '🧣',  price: 40, cat: 'topuri' },
  { id: 'top_wings',      name: 'Aripi',            icon: '🪽',  price: 90, cat: 'topuri' },
  { id: 'top_bow',        name: 'Fundă spate',      icon: '🎀',  price: 45, cat: 'topuri' },
  { id: 'top_medal',      name: 'Medalie',          icon: '🏅',  price: 35, cat: 'topuri' },
  { id: 'top_anchor',     name: 'Lanț',             icon: '⛓️', price: 55, cat: 'topuri' },
  // Pantaloni
  { id: 'pants_jeans',    name: 'Jeans',            icon: '👖',  price: 45, cat: 'pantaloni' },
  { id: 'pants_shorts',   name: 'Pantaloni scurți', icon: '🩳',  price: 35, cat: 'pantaloni' },
  { id: 'pants_stripe',   name: 'Cu dungi',         icon: '〰️', price: 40, cat: 'pantaloni' },
  { id: 'pants_camo',     name: 'Camuflaj',         icon: '🪖',  price: 55, cat: 'pantaloni' },
  { id: 'pants_rainbow',  name: 'Curcubeu',         icon: '🌈',  price: 60, cat: 'pantaloni' },
  { id: 'pants_gold',     name: 'Aurii',            icon: '✨',  price: 75, cat: 'pantaloni' },
  { id: 'pants_flower',   name: 'Cu flori',         icon: '🌸',  price: 50, cat: 'pantaloni' },
];

const SHOP_CATS = [
  { id: 'ochelari',  label: '👓 Ochelari' },
  { id: 'palarii',   label: '🎩 Pălării' },
  { id: 'caciuli',   label: '🧶 Căciuli' },
  { id: 'tricouri',  label: '👕 Tricouri' },
  { id: 'topuri',    label: '🦸 Topuri' },
  { id: 'pantaloni', label: '👖 Pantaloni' },
];

// ─── WORLDS ─────────────────────────────────────────────────
const WORLDS = [
  { id: 'oras',     name: 'Oraș',     icon: '🏙️', sky: ['#87ceeb','#c9e8f5','#ffd580'], platColor: '#3a5a7c', platTop: '#4a7aaa' },
  { id: 'japonia',  name: 'Japonia',  icon: '🌸', sky: ['#fce4ec','#f8c8dc','#ffdde8'], platColor: '#8d5a57', platTop: '#c08080' },
  { id: 'jungla',   name: 'Junglă',   icon: '🌴', sky: ['#0d4a1a','#1a6e30','#4a9a2e'], platColor: '#2d5a1e', platTop: '#4a8a2e' },
  { id: 'newyork',  name: 'New York', icon: '🗽', sky: ['#0d0d1a','#1a1a3e','#2e2e60'], platColor: '#2d2d2d', platTop: '#555555' },
  { id: 'plaja',    name: 'Plajă',    icon: '🏖️', sky: ['#00b4d8','#48cae4','#90e0ef'], platColor: '#f0c060', platTop: '#ffe090' },
  { id: 'munte',    name: 'Munte',    icon: '⛰️', sky: ['#b8d4e8','#d8eef8','#e8f8ff'], platColor: '#607d8b', platTop: '#90a4ae' },
  { id: 'spatiu',   name: 'Spațiu',   icon: '🌌', sky: ['#000008','#050520','#0a0a2a'], platColor: '#1a1a4a', platTop: '#3a3a8a' },
  { id: 'iarna',    name: 'Iarnă',    icon: '❄️', sky: ['#d8eef8','#eaf4fc','#f5fbff'], platColor: '#8898aa', platTop: '#c8dce8' },
  { id: 'apus',     name: 'Apus',     icon: '🌅', sky: ['#c0392b','#e74c3c','#f39c12'], platColor: '#8b4513', platTop: '#c46520' },
  { id: 'subapa',   name: 'Sub apă',  icon: '🌊', sky: ['#003366','#005599','#0077cc'], platColor: '#1a4a6e', platTop: '#2a6a9e' },
  { id: 'castel',   name: 'Castel',   icon: '🏰', sky: ['#1a0a2e','#2d1b4e','#402560'], platColor: '#4a2d6e', platTop: '#6a4a9e' },
  { id: 'curcubeu', name: 'Curcubeu', icon: '🌈', sky: ['#ff9ff3','#a29bfe','#74b9ff'], platColor: '#e056c0', platTop: '#fd79a8' },
];
let selectedWorld = WORLDS[0];

function loadShopState() {
  try {
    const saved = localStorage.getItem('parcuring_shop');
    if (saved) {
      const s = JSON.parse(saved);
      return {
        coins:    s.coins    ?? 0,
        owned:    s.owned    ?? {},
        equipped: Object.assign({ girl1: [], girl2: [], boy1: [], boy2: [] }, s.equipped ?? {}),
        shopChar: s.shopChar ?? 'girl1',
        shopCat:  s.shopCat  ?? 'ochelari',
      };
    }
  } catch(e) {}
  return { coins: 0, owned: {}, equipped: { girl1: [], girl2: [], boy1: [], boy2: [] }, shopChar: 'girl1', shopCat: 'ochelari' };
}

function saveShopState() {
  try {
    localStorage.setItem('parcuring_shop', JSON.stringify({
      coins:    shopState.coins,
      owned:    shopState.owned,
      equipped: shopState.equipped,
      shopChar: shopState.shopChar,
    }));
  } catch(e) {}
}

let shopState = loadShopState();

// ─── GAME STATE ─────────────────────────────────────────────
const TILE = 32;
const GRAVITY = 0.55;
const JUMP_FORCE = -13;
const WALK_SPEED = 1.2;
const RUN_MULT = 1.3;

let gs = {}; // game state

// ─── LEVEL DATA ─────────────────────────────────────────────
// Each level: { platforms, signs, spawn, exit }
// Platform: { x, y, w, h }   (world coords)
// Sign: { x, y, hit: false }
// Spawn/exit: { x, y }

// ─── LEVEL SETS ─────────────────────────────────────────────
// Set A — Urban (Oraș, New York): platforme late, blocuri lungi
function levelsUrban() { return [
  { width:3500, spawn:{x:80,y:430}, exit:{x:3380,y:280},
    platforms:[
      {x:0,y:480,w:500,h:20}, {x:600,y:430,w:350,h:20}, {x:1060,y:390,w:320,h:20},
      {x:1490,y:350,w:300,h:20}, {x:1900,y:310,w:280,h:20}, {x:2290,y:340,w:260,h:20},
      {x:2660,y:300,w:250,h:20}, {x:3020,y:280,w:400,h:20},
    ],
    signs:[{x:650,y:390},{x:1100,y:350},{x:1950,y:270},{x:3060,y:240}],
    coins:[
      {x:150,y:450},{x:220,y:450},{x:290,y:450},{x:360,y:450},
      {x:650,y:390},{x:750,y:390},{x:850,y:390},
      {x:1110,y:350},{x:1210,y:350},{x:1310,y:350},
      {x:1540,y:310},{x:1640,y:310},{x:1740,y:310},
      {x:1950,y:270},{x:2050,y:270},{x:2150,y:270},
      {x:2710,y:260},{x:2810,y:260},{x:2910,y:260},
      {x:3070,y:240},{x:3170,y:240},{x:3270,y:240},
      {x:530,y:320,v:10},{x:880,y:310,v:10},{x:1390,y:250,v:10},
      {x:2230,y:240,v:10},{x:2600,y:230,v:10},
    ],
  },
  { width:4200, spawn:{x:80,y:430}, exit:{x:4060,y:250},
    platforms:[
      {x:0,y:480,w:450,h:20}, {x:560,y:430,w:300,h:20}, {x:970,y:380,w:280,h:20},
      {x:1360,y:340,w:260,h:20}, {x:1730,y:300,w:250,h:20}, {x:2090,y:340,w:240,h:20},
      {x:2440,y:300,w:240,h:20}, {x:2790,y:270,w:230,h:20}, {x:3130,y:300,w:220,h:20},
      {x:3460,y:270,w:220,h:20}, {x:3790,y:250,w:300,h:20},
    ],
    signs:[{x:610,y:390},{x:1410,y:300},{x:2140,y:300},{x:3510,y:230},{x:3840,y:210}],
    coins:[
      {x:150,y:450},{x:250,y:450},{x:350,y:450},
      {x:600,y:390},{x:700,y:390},{x:800,y:390},
      {x:1010,y:340},{x:1110,y:340},{x:1210,y:340},
      {x:1400,y:300},{x:1500,y:300},{x:1600,y:300},
      {x:1770,y:260},{x:1870,y:260},{x:1970,y:260},
      {x:2480,y:260},{x:2580,y:260},{x:2680,y:260},
      {x:2830,y:230},{x:2930,y:230},{x:3030,y:230},
      {x:3830,y:210},{x:3930,y:210},{x:4030,y:210},
      {x:490,y:310,v:10},{x:870,y:270,v:10},{x:1300,y:230,v:10},
      {x:2130,y:240,v:10},{x:2750,y:210,v:10},{x:3400,y:205,v:10},
    ],
  },
  { width:5000, spawn:{x:80,y:430}, exit:{x:4870,y:230},
    platforms:[
      {x:0,y:480,w:400,h:20}, {x:510,y:430,w:270,h:20}, {x:890,y:380,w:250,h:20},
      {x:1250,y:340,w:240,h:20}, {x:1600,y:300,w:230,h:20}, {x:1940,y:340,w:220,h:20},
      {x:2270,y:300,w:220,h:20}, {x:2600,y:270,w:210,h:20}, {x:2920,y:300,w:200,h:20},
      {x:3230,y:270,w:200,h:20}, {x:3540,y:250,w:200,h:20}, {x:3850,y:270,w:190,h:20},
      {x:4150,y:250,w:190,h:20}, {x:4450,y:240,w:200,h:20}, {x:4760,y:230,w:220,h:20},
    ],
    signs:[{x:560,y:390},{x:1300,y:300},{x:1990,y:300},{x:2650,y:230},{x:4800,y:190}],
    coins:[
      {x:130,y:450},{x:210,y:450},{x:310,y:450},
      {x:550,y:390},{x:650,y:390},{x:750,y:390},
      {x:930,y:340},{x:1030,y:340},{x:1130,y:340},
      {x:1290,y:300},{x:1390,y:300},{x:1490,y:300},
      {x:2310,y:260},{x:2410,y:260},{x:2510,y:260},
      {x:3580,y:210},{x:3680,y:210},{x:3780,y:210},
      {x:4490,y:200},{x:4590,y:200},{x:4690,y:200},
      {x:440,y:310,v:10},{x:800,y:270,v:10},{x:1140,y:240,v:10},
      {x:1820,y:230,v:10},{x:2200,y:210,v:10},{x:2860,y:200,v:10},
      {x:3200,y:200,v:10},{x:4100,y:185,v:10},{x:4750,y:175,v:10},
    ],
  },
  { width:5800, spawn:{x:80,y:430}, exit:{x:5680,y:210},
    platforms:[
      {x:0,y:480,w:380,h:20}, {x:490,y:420,w:250,h:20}, {x:850,y:370,w:230,h:20},
      {x:1190,y:330,w:220,h:20}, {x:1520,y:290,w:210,h:20}, {x:1840,y:330,w:200,h:20},
      {x:2150,y:290,w:200,h:20}, {x:2460,y:260,w:190,h:20}, {x:2760,y:290,w:190,h:20},
      {x:3060,y:260,w:180,h:20}, {x:3350,y:240,w:180,h:20}, {x:3640,y:260,w:170,h:20},
      {x:3920,y:240,w:170,h:20}, {x:4200,y:220,w:170,h:20}, {x:4480,y:240,w:160,h:20},
      {x:4750,y:220,w:160,h:20}, {x:5020,y:230,w:160,h:20}, {x:5290,y:220,w:160,h:20},
      {x:5560,y:210,w:200,h:20},
    ],
    signs:[{x:540,y:380},{x:1240,y:290},{x:2200,y:250},{x:3400,y:200},{x:5610,y:170}],
    coins:[
      {x:120,y:450},{x:200,y:450},{x:290,y:450},
      {x:530,y:380},{x:630,y:380},{x:730,y:380},
      {x:890,y:330},{x:990,y:330},{x:1090,y:330},
      {x:2190,y:250},{x:2290,y:250},{x:2390,y:250},
      {x:3390,y:200},{x:3490,y:200},{x:3590,y:200},
      {x:5600,y:170},{x:5700,y:170},
      {x:420,y:300,v:10},{x:760,y:260,v:10},{x:1100,y:240,v:10},
      {x:1730,y:230,v:10},{x:2040,y:210,v:10},{x:2700,y:195,v:10},
      {x:3000,y:190,v:10},{x:3640,y:185,v:10},{x:4190,y:175,v:10},
      {x:4750,y:165,v:10},{x:5330,y:155,v:10},
    ],
  },
  { width:6600, spawn:{x:80,y:430}, exit:{x:6470,y:200},
    platforms:[
      {x:0,y:480,w:350,h:20}, {x:460,y:410,w:230,h:20}, {x:800,y:360,w:210,h:20},
      {x:1120,y:320,w:200,h:20}, {x:1430,y:280,w:190,h:20}, {x:1730,y:320,w:180,h:20},
      {x:2020,y:280,w:180,h:20}, {x:2310,y:250,w:170,h:20}, {x:2590,y:280,w:170,h:20},
      {x:2870,y:250,w:160,h:20}, {x:3140,y:230,w:160,h:20}, {x:3410,y:250,w:150,h:20},
      {x:3670,y:230,w:150,h:20}, {x:3930,y:210,w:150,h:20}, {x:4190,y:230,w:150,h:20},
      {x:4450,y:210,w:140,h:20}, {x:4700,y:220,w:140,h:20}, {x:4950,y:210,w:140,h:20},
      {x:5200,y:220,w:140,h:20}, {x:5450,y:210,w:140,h:20}, {x:5700,y:200,w:140,h:20},
      {x:5950,y:210,w:140,h:20}, {x:6200,y:200,w:140,h:20}, {x:6440,y:200,w:200,h:20},
    ],
    signs:[{x:510,y:370},{x:1170,y:280},{x:2060,y:240},{x:3180,y:190},{x:6490,y:160}],
    coins:[
      {x:130,y:450},{x:210,y:450},{x:290,y:450},
      {x:500,y:370},{x:600,y:370},{x:700,y:370},
      {x:840,y:320},{x:940,y:320},{x:1040,y:320},
      {x:2350,y:210},{x:2450,y:210},{x:2550,y:210},
      {x:3180,y:190},{x:3280,y:190},{x:3378,y:190},
      {x:6480,y:165},{x:6580,y:165},
      {x:390,y:280,v:10},{x:720,y:250,v:10},{x:1020,y:230,v:10},
      {x:1630,y:220,v:10},{x:1930,y:210,v:10},{x:2220,y:195,v:10},
      {x:2760,y:185,v:10},{x:3060,y:175,v:10},{x:3570,y:170,v:10},
      {x:3870,y:160,v:10},{x:4370,y:155,v:10},{x:4900,y:145,v:10},
      {x:5390,y:150,v:10},{x:5850,y:140,v:10},
    ],
  },
  { width:7400, spawn:{x:80,y:430}, exit:{x:7270,y:190},
    platforms:[
      {x:0,y:480,w:330,h:20}, {x:440,y:400,w:210,h:20}, {x:760,y:350,w:200,h:20},
      {x:1070,y:310,w:190,h:20}, {x:1370,y:270,w:180,h:20}, {x:1660,y:310,w:170,h:20},
      {x:1940,y:270,w:170,h:20}, {x:2220,y:240,w:160,h:20}, {x:2490,y:270,w:160,h:20},
      {x:2760,y:240,w:150,h:20}, {x:3020,y:220,w:150,h:20}, {x:3280,y:240,w:150,h:20},
      {x:3540,y:220,w:140,h:20}, {x:3790,y:200,w:140,h:20}, {x:4040,y:220,w:140,h:20},
      {x:4290,y:200,w:130,h:20}, {x:4530,y:210,w:130,h:20}, {x:4770,y:200,w:130,h:20},
      {x:5010,y:210,w:130,h:20}, {x:5250,y:200,w:130,h:20}, {x:5490,y:210,w:130,h:20},
      {x:5730,y:200,w:130,h:20}, {x:5970,y:210,w:130,h:20}, {x:6210,y:200,w:130,h:20},
      {x:6450,y:190,w:130,h:20}, {x:6690,y:200,w:130,h:20}, {x:6930,y:190,w:130,h:20},
      {x:7180,y:190,w:200,h:20},
    ],
    signs:[{x:490,y:360},{x:1120,y:270},{x:2270,y:200},{x:3840,y:160},{x:7230,y:150}],
    coins:[
      {x:120,y:450},{x:200,y:450},{x:280,y:450},
      {x:480,y:360},{x:580,y:360},{x:680,y:360},
      {x:800,y:310},{x:900,y:310},{x:1000,y:310},
      {x:2260,y:200},{x:2360,y:200},{x:2460,y:200},
      {x:3830,y:165},{x:3930,y:165},{x:4030,y:165},
      {x:7220,y:155},{x:7320,y:155},
      {x:370,y:270,v:10},{x:660,y:240,v:10},{x:970,y:220,v:10},
      {x:1560,y:220,v:10},{x:1850,y:205,v:10},{x:2140,y:190,v:10},
      {x:2660,y:185,v:10},{x:2930,y:175,v:10},{x:3200,y:165,v:10},
      {x:3650,y:155,v:10},{x:4180,y:145,v:10},{x:4690,y:145,v:10},
      {x:5200,y:140,v:10},{x:5700,y:135,v:10},{x:6200,y:130,v:10},
    ],
  },
  { width:8200, spawn:{x:80,y:430}, exit:{x:8060,y:180},
    platforms:[
      {x:0,y:480,w:300,h:20}, {x:410,y:390,w:190,h:20}, {x:710,y:340,w:180,h:20},
      {x:1000,y:300,w:170,h:20}, {x:1280,y:260,w:160,h:20}, {x:1550,y:300,w:160,h:20},
      {x:1820,y:260,w:150,h:20}, {x:2080,y:230,w:150,h:20}, {x:2340,y:260,w:140,h:20},
      {x:2590,y:230,w:140,h:20}, {x:2840,y:210,w:140,h:20}, {x:3090,y:230,w:130,h:20},
      {x:3330,y:210,w:130,h:20}, {x:3570,y:190,w:130,h:20}, {x:3810,y:210,w:130,h:20},
      {x:4050,y:190,w:120,h:20}, {x:4280,y:200,w:120,h:20}, {x:4510,y:190,w:120,h:20},
      {x:4740,y:200,w:120,h:20}, {x:4970,y:190,w:120,h:20}, {x:5200,y:200,w:120,h:20},
      {x:5430,y:190,w:120,h:20}, {x:5660,y:200,w:120,h:20}, {x:5890,y:190,w:120,h:20},
      {x:6120,y:200,w:120,h:20}, {x:6350,y:190,w:120,h:20}, {x:6580,y:200,w:120,h:20},
      {x:6810,y:190,w:120,h:20}, {x:7040,y:200,w:120,h:20}, {x:7270,y:190,w:120,h:20},
      {x:7500,y:200,w:120,h:20}, {x:7730,y:190,w:120,h:20}, {x:7970,y:180,w:200,h:20},
    ],
    signs:[{x:460,y:350},{x:1050,y:260},{x:1870,y:220},{x:3620,y:150},{x:8020,y:140}],
    coins:[
      {x:120,y:450},{x:200,y:450},
      {x:450,y:350},{x:550,y:350},{x:650,y:350},
      {x:1040,y:260},{x:1140,y:260},{x:1240,y:260},
      {x:2120,y:190},{x:2220,y:190},{x:2320,y:190},
      {x:3610,y:150},{x:3710,y:150},{x:3810,y:150},
      {x:8010,y:145},{x:8110,y:145},
      {x:340,y:260,v:10},{x:620,y:230,v:10},{x:900,y:210,v:10},
      {x:1450,y:200,v:10},{x:1730,y:190,v:10},{x:2030,y:175,v:10},
      {x:2490,y:165,v:10},{x:2790,y:155,v:10},{x:3050,y:150,v:10},
      {x:3450,y:145,v:10},{x:3960,y:140,v:10},{x:4460,y:135,v:10},
      {x:4970,y:130,v:10},{x:5460,y:125,v:10},{x:5950,y:120,v:10},
    ],
  },
  { width:9000, spawn:{x:80,y:430}, exit:{x:8860,y:175},
    platforms:[
      {x:0,y:480,w:280,h:20}, {x:390,y:380,w:180,h:20}, {x:680,y:330,w:170,h:20},
      {x:960,y:290,w:160,h:20}, {x:1230,y:250,w:150,h:20}, {x:1490,y:290,w:150,h:20},
      {x:1750,y:250,w:140,h:20}, {x:2000,y:220,w:140,h:20}, {x:2250,y:250,w:130,h:20},
      {x:2490,y:220,w:130,h:20}, {x:2730,y:200,w:130,h:20}, {x:2970,y:220,w:120,h:20},
      {x:3200,y:200,w:120,h:20}, {x:3430,y:180,w:120,h:20}, {x:3660,y:200,w:120,h:20},
      {x:3890,y:180,w:110,h:20}, {x:4110,y:190,w:110,h:20}, {x:4330,y:180,w:110,h:20},
      {x:4550,y:190,w:110,h:20}, {x:4770,y:180,w:110,h:20}, {x:4990,y:190,w:110,h:20},
      {x:5210,y:180,w:110,h:20}, {x:5430,y:190,w:110,h:20}, {x:5650,y:180,w:110,h:20},
      {x:5870,y:190,w:110,h:20}, {x:6090,y:180,w:110,h:20}, {x:6310,y:190,w:110,h:20},
      {x:6530,y:180,w:110,h:20}, {x:6750,y:190,w:110,h:20}, {x:6970,y:180,w:110,h:20},
      {x:7190,y:190,w:110,h:20}, {x:7410,y:180,w:110,h:20}, {x:7630,y:190,w:110,h:20},
      {x:7850,y:180,w:110,h:20}, {x:8080,y:190,w:110,h:20}, {x:8720,y:175,w:200,h:20},
    ],
    signs:[{x:440,y:340},{x:1010,y:250},{x:2050,y:180},{x:3480,y:140},{x:8770,y:135}],
    coins:[
      {x:120,y:450},{x:200,y:450},
      {x:430,y:340},{x:530,y:340},{x:630,y:340},
      {x:1000,y:250},{x:1100,y:250},{x:1200,y:250},
      {x:2040,y:180},{x:2140,y:180},{x:2240,y:180},
      {x:3470,y:145},{x:3570,y:145},
      {x:8760,y:140},{x:8860,y:140},
      {x:320,y:250,v:10},{x:580,y:220,v:10},{x:860,y:200,v:10},
      {x:1380,y:195,v:10},{x:1660,y:185,v:10},{x:1950,y:175,v:10},
      {x:2360,y:165,v:10},{x:2660,y:155,v:10},{x:2930,y:150,v:10},
      {x:3300,y:140,v:10},{x:3790,y:135,v:10},{x:4290,y:130,v:10},
      {x:4790,y:125,v:10},{x:5290,y:120,v:10},{x:5790,y:115,v:10},
    ],
  },
  { width:9800, spawn:{x:80,y:430}, exit:{x:9650,y:170},
    platforms:[
      {x:0,y:480,w:260,h:20}, {x:370,y:370,w:170,h:20}, {x:650,y:320,w:160,h:20},
      {x:920,y:280,w:150,h:20}, {x:1180,y:240,w:140,h:20}, {x:1430,y:280,w:140,h:20},
      {x:1680,y:240,w:130,h:20}, {x:1920,y:210,w:130,h:20}, {x:2160,y:240,w:120,h:20},
      {x:2390,y:210,w:120,h:20}, {x:2620,y:190,w:120,h:20}, {x:2850,y:210,w:110,h:20},
      {x:3070,y:190,w:110,h:20}, {x:3290,y:170,w:110,h:20}, {x:3510,y:190,w:110,h:20},
      {x:3730,y:170,w:100,h:20}, {x:3940,y:180,w:100,h:20}, {x:4150,y:170,w:100,h:20},
      {x:4360,y:180,w:100,h:20}, {x:4570,y:170,w:100,h:20}, {x:4780,y:180,w:100,h:20},
      {x:4990,y:170,w:100,h:20}, {x:5200,y:180,w:100,h:20}, {x:5410,y:170,w:100,h:20},
      {x:5620,y:180,w:100,h:20}, {x:5830,y:170,w:100,h:20}, {x:6040,y:180,w:100,h:20},
      {x:6250,y:170,w:100,h:20}, {x:6460,y:180,w:100,h:20}, {x:6670,y:170,w:100,h:20},
      {x:6880,y:180,w:100,h:20}, {x:7090,y:170,w:100,h:20}, {x:7300,y:180,w:100,h:20},
      {x:7510,y:170,w:100,h:20}, {x:7720,y:180,w:100,h:20}, {x:7930,y:170,w:100,h:20},
      {x:8140,y:180,w:100,h:20}, {x:8350,y:170,w:100,h:20}, {x:8560,y:180,w:100,h:20},
      {x:8770,y:170,w:100,h:20}, {x:9510,y:170,w:200,h:20},
    ],
    signs:[{x:420,y:330},{x:970,y:240},{x:1970,y:170},{x:3340,y:130},{x:9560,y:130}],
    coins:[
      {x:120,y:450},{x:200,y:450},
      {x:410,y:330},{x:510,y:330},{x:610,y:330},
      {x:960,y:240},{x:1060,y:240},{x:1160,y:240},
      {x:1960,y:170},{x:2060,y:170},{x:2160,y:170},
      {x:3330,y:135},{x:3430,y:135},
      {x:9550,y:135},{x:9650,y:135},
      {x:300,y:240,v:10},{x:560,y:210,v:10},{x:820,y:195,v:10},
      {x:1320,y:185,v:10},{x:1590,y:175,v:10},{x:1880,y:160,v:10},
      {x:2290,y:155,v:10},{x:2580,y:145,v:10},{x:2840,y:140,v:10},
      {x:3180,y:130,v:10},{x:3640,y:125,v:10},{x:4140,y:120,v:10},
    ],
  },
  { width:10600, spawn:{x:80,y:430}, exit:{x:10450,y:160},
    platforms:[
      {x:0,y:480,w:250,h:20}, {x:360,y:360,w:160,h:20}, {x:630,y:310,w:150,h:20},
      {x:890,y:270,w:140,h:20}, {x:1140,y:230,w:130,h:20}, {x:1380,y:270,w:130,h:20},
      {x:1620,y:230,w:120,h:20}, {x:1850,y:200,w:120,h:20}, {x:2080,y:230,w:110,h:20},
      {x:2300,y:200,w:110,h:20}, {x:2520,y:180,w:110,h:20}, {x:2740,y:200,w:100,h:20},
      {x:2950,y:180,w:100,h:20}, {x:3160,y:160,w:100,h:20}, {x:3370,y:180,w:100,h:20},
      {x:3580,y:160,w:90,h:20}, {x:3780,y:170,w:90,h:20}, {x:3980,y:160,w:90,h:20},
      {x:4180,y:170,w:90,h:20}, {x:4380,y:160,w:90,h:20}, {x:4580,y:170,w:90,h:20},
      {x:4780,y:160,w:90,h:20}, {x:4980,y:170,w:90,h:20}, {x:5180,y:160,w:90,h:20},
      {x:5380,y:170,w:90,h:20}, {x:5580,y:160,w:90,h:20}, {x:5780,y:170,w:90,h:20},
      {x:5980,y:160,w:90,h:20}, {x:6180,y:170,w:90,h:20}, {x:6380,y:160,w:90,h:20},
      {x:6580,y:170,w:90,h:20}, {x:6780,y:160,w:90,h:20}, {x:6980,y:170,w:90,h:20},
      {x:7180,y:160,w:90,h:20}, {x:7380,y:170,w:90,h:20}, {x:7580,y:160,w:90,h:20},
      {x:7780,y:170,w:90,h:20}, {x:7980,y:160,w:90,h:20}, {x:8180,y:170,w:90,h:20},
      {x:8380,y:160,w:90,h:20}, {x:8580,y:170,w:90,h:20}, {x:8780,y:160,w:90,h:20},
      {x:8980,y:170,w:90,h:20}, {x:9180,y:160,w:90,h:20}, {x:9380,y:170,w:90,h:20},
      {x:9580,y:160,w:90,h:20}, {x:9780,y:170,w:90,h:20}, {x:9980,y:160,w:90,h:20},
      {x:10200,y:170,w:90,h:20},{x:10400,y:160,w:200,h:20},
    ],
    signs:[{x:410,y:320},{x:940,y:230},{x:1900,y:160},{x:3210,y:120},{x:10450,y:120}],
    coins:[
      {x:120,y:450},{x:200,y:450},
      {x:400,y:320},{x:500,y:320},{x:600,y:320},
      {x:930,y:230},{x:1030,y:230},{x:1130,y:230},
      {x:1890,y:165},{x:1990,y:165},{x:2090,y:165},
      {x:3200,y:125},{x:3300,y:125},
      {x:10440,y:125},{x:10540,y:125},
      {x:290,y:230,v:10},{x:540,y:200,v:10},{x:790,y:185,v:10},
      {x:1280,y:175,v:10},{x:1530,y:165,v:10},{x:1770,y:155,v:10},
      {x:2200,y:145,v:10},{x:2490,y:140,v:10},{x:2750,y:135,v:10},
      {x:3060,y:120,v:10},{x:3480,y:115,v:10},{x:3980,y:110,v:10},
    ],
  },
];}

// Set B — Natura (Jungla, Munte, Plaja, Apus): teren organic, tronsoane variate
function levelsNatura() { return [
  { width:3800, spawn:{x:80,y:430}, exit:{x:3670,y:260},
    platforms:[
      {x:0,y:480,w:300,h:20}, {x:380,y:440,w:200,h:20}, {x:650,y:400,w:180,h:20},
      {x:900,y:360,w:260,h:20}, {x:1230,y:320,w:200,h:20}, {x:1500,y:380,w:220,h:20},
      {x:1790,y:340,w:190,h:20}, {x:2050,y:300,w:200,h:20}, {x:2320,y:260,w:220,h:20},
      {x:2610,y:300,w:180,h:20}, {x:2860,y:260,w:200,h:20}, {x:3130,y:280,w:180,h:20},
      {x:3380,y:260,w:180,h:20}, {x:3620,y:260,w:200,h:20},
      {x:500,y:465,w:130,h:20}, {x:770,y:465,w:110,h:20},
    ],
    signs:[{x:430,y:400},{x:950,y:320},{x:1540,y:340},{x:2370,y:220},{x:3670,y:220}],
    coins:[
      {x:130,y:450},{x:200,y:450},{x:270,y:450},{x:340,y:450},
      {x:420,y:400},{x:520,y:400},{x:620,y:400},
      {x:690,y:360},{x:790,y:360},{x:890,y:360},
      {x:940,y:320},{x:1040,y:320},{x:1140,y:320},{x:1230,y:320},
      {x:1540,y:340},{x:1640,y:340},{x:1740,y:340},
      {x:2090,y:260},{x:2190,y:260},{x:2290,y:260},
      {x:2360,y:220},{x:2460,y:220},{x:2560,y:220},
      {x:3670,y:220},{x:3770,y:220},
      {x:570,y:330,v:10},{x:840,y:290,v:10},{x:1340,y:250,v:10},
      {x:1980,y:240,v:10},{x:2660,y:220,v:10},{x:3040,y:210,v:10},
    ],
  },
  { width:4500, spawn:{x:80,y:430}, exit:{x:4370,y:240},
    platforms:[
      {x:0,y:480,w:280,h:20}, {x:360,y:430,w:180,h:20}, {x:610,y:380,w:200,h:20},
      {x:880,y:430,w:160,h:20}, {x:1110,y:380,w:180,h:20}, {x:1360,y:340,w:200,h:20},
      {x:1630,y:300,w:180,h:20}, {x:1880,y:340,w:170,h:20}, {x:2120,y:300,w:180,h:20},
      {x:2370,y:260,w:190,h:20}, {x:2630,y:300,w:170,h:20}, {x:2870,y:260,w:180,h:20},
      {x:3120,y:240,w:180,h:20}, {x:3370,y:260,w:170,h:20}, {x:3610,y:240,w:170,h:20},
      {x:3850,y:260,w:160,h:20}, {x:4080,y:240,w:160,h:20}, {x:4310,y:240,w:180,h:20},
    ],
    signs:[{x:410,y:390},{x:920,y:390},{x:1410,y:300},{x:2420,y:220},{x:4360,y:200}],
    coins:[
      {x:120,y:450},{x:200,y:450},{x:280,y:450},
      {x:400,y:390},{x:500,y:390},{x:600,y:390},
      {x:650,y:340},{x:750,y:340},{x:850,y:340},
      {x:920,y:390},{x:1020,y:390},{x:1110,y:390},
      {x:1400,y:300},{x:1500,y:300},{x:1600,y:300},
      {x:2410,y:220},{x:2510,y:220},{x:2610,y:220},
      {x:3660,y:200},{x:3760,y:200},{x:3860,y:200},
      {x:4350,y:200},{x:4450,y:200},
      {x:490,y:300,v:10},{x:760,y:290,v:10},{x:1060,y:280,v:10},
      {x:1530,y:240,v:10},{x:1830,y:260,v:10},{x:2060,y:240,v:10},
      {x:2300,y:200,v:10},{x:2740,y:190,v:10},{x:3070,y:180,v:10},
    ],
  },
  { width:5200, spawn:{x:80,y:430}, exit:{x:5060,y:230},
    platforms:[
      {x:0,y:480,w:260,h:20}, {x:340,y:420,w:170,h:20}, {x:580,y:370,w:190,h:20},
      {x:840,y:420,w:150,h:20}, {x:1060,y:370,w:170,h:20}, {x:1300,y:330,w:180,h:20},
      {x:1550,y:290,w:170,h:20}, {x:1790,y:330,w:160,h:20}, {x:2020,y:290,w:170,h:20},
      {x:2260,y:250,w:180,h:20}, {x:2510,y:290,w:160,h:20}, {x:2740,y:250,w:170,h:20},
      {x:2980,y:230,w:170,h:20}, {x:3220,y:250,w:160,h:20}, {x:3450,y:230,w:160,h:20},
      {x:3680,y:250,w:150,h:20}, {x:3900,y:230,w:150,h:20}, {x:4120,y:240,w:150,h:20},
      {x:4340,y:230,w:150,h:20}, {x:4560,y:240,w:150,h:20}, {x:4780,y:230,w:150,h:20},
      {x:5020,y:230,w:180,h:20},
    ],
    signs:[{x:390,y:380},{x:890,y:380},{x:1350,y:290},{x:2310,y:210},{x:5070,y:190}],
    coins:[
      {x:120,y:450},{x:200,y:450},{x:270,y:450},
      {x:380,y:380},{x:480,y:380},{x:580,y:380},
      {x:620,y:330},{x:720,y:330},{x:820,y:330},
      {x:880,y:380},{x:980,y:380},{x:1058,y:380},
      {x:1340,y:290},{x:1440,y:290},{x:1540,y:290},
      {x:2300,y:210},{x:2400,y:210},{x:2500,y:210},
      {x:3460,y:190},{x:3560,y:190},{x:3660,y:190},
      {x:5060,y:195},{x:5160,y:195},
      {x:270,y:310,v:10},{x:510,y:280,v:10},{x:770,y:280,v:10},
      {x:1150,y:270,v:10},{x:1690,y:250,v:10},{x:1970,y:240,v:10},
      {x:2200,y:195,v:10},{x:2650,y:185,v:10},{x:2940,y:180,v:10},
      {x:3330,y:175,v:10},{x:3840,y:170,v:10},
    ],
  },
  { width:5900, spawn:{x:80,y:430}, exit:{x:5760,y:220},
    platforms:[
      {x:0,y:480,w:240,h:20}, {x:320,y:410,w:160,h:20}, {x:550,y:360,w:180,h:20},
      {x:800,y:410,w:140,h:20}, {x:1010,y:360,w:160,h:20}, {x:1240,y:320,w:170,h:20},
      {x:1480,y:280,w:160,h:20}, {x:1710,y:320,w:150,h:20}, {x:1930,y:280,w:160,h:20},
      {x:2160,y:250,w:170,h:20}, {x:2400,y:280,w:150,h:20}, {x:2620,y:250,w:160,h:20},
      {x:2850,y:230,w:160,h:20}, {x:3080,y:250,w:150,h:20}, {x:3300,y:230,w:150,h:20},
      {x:3520,y:250,w:140,h:20}, {x:3730,y:230,w:140,h:20}, {x:3940,y:220,w:140,h:20},
      {x:4150,y:230,w:140,h:20}, {x:4360,y:220,w:130,h:20}, {x:4560,y:230,w:130,h:20},
      {x:4760,y:220,w:130,h:20}, {x:4960,y:230,w:130,h:20}, {x:5160,y:220,w:130,h:20},
      {x:5360,y:230,w:130,h:20}, {x:5560,y:220,w:130,h:20}, {x:5720,y:220,w:200,h:20},
    ],
    signs:[{x:370,y:370},{x:860,y:370},{x:1290,y:280},{x:2210,y:210},{x:5770,y:180}],
    coins:[
      {x:120,y:450},{x:200,y:450},
      {x:360,y:370},{x:460,y:370},{x:560,y:370},
      {x:590,y:320},{x:690,y:320},{x:790,y:320},
      {x:1280,y:280},{x:1380,y:280},{x:1478,y:280},
      {x:2200,y:210},{x:2300,y:210},{x:2400,y:210},
      {x:3310,y:190},{x:3410,y:190},{x:3510,y:190},
      {x:5760,y:185},{x:5860,y:185},
      {x:250,y:280,v:10},{x:480,y:260,v:10},{x:730,y:270,v:10},
      {x:1110,y:250,v:10},{x:1640,y:230,v:10},{x:1880,y:220,v:10},
      {x:2090,y:195,v:10},{x:2530,y:185,v:10},{x:2790,y:175,v:10},
      {x:3070,y:165,v:10},{x:3650,y:155,v:10},{x:4110,y:150,v:10},
    ],
  },
  { width:6700, spawn:{x:80,y:430}, exit:{x:6560,y:210},
    platforms:[
      {x:0,y:480,w:220,h:20}, {x:300,y:400,w:150,h:20}, {x:520,y:350,w:170,h:20},
      {x:760,y:400,w:130,h:20}, {x:960,y:350,w:150,h:20}, {x:1180,y:310,w:160,h:20},
      {x:1410,y:270,w:150,h:20}, {x:1630,y:310,w:140,h:20}, {x:1840,y:270,w:150,h:20},
      {x:2060,y:240,w:160,h:20}, {x:2290,y:270,w:140,h:20}, {x:2500,y:240,w:150,h:20},
      {x:2720,y:220,w:150,h:20}, {x:2940,y:240,w:140,h:20}, {x:3150,y:220,w:140,h:20},
      {x:3360,y:240,w:130,h:20}, {x:3560,y:220,w:130,h:20}, {x:3760,y:230,w:130,h:20},
      {x:3960,y:220,w:130,h:20}, {x:4160,y:230,w:130,h:20}, {x:4360,y:220,w:120,h:20},
      {x:4550,y:230,w:120,h:20}, {x:4740,y:220,w:120,h:20}, {x:4930,y:230,w:120,h:20},
      {x:5120,y:220,w:120,h:20}, {x:5310,y:230,w:120,h:20}, {x:5500,y:220,w:120,h:20},
      {x:5690,y:230,w:120,h:20}, {x:5880,y:220,w:120,h:20}, {x:6070,y:230,w:120,h:20},
      {x:6260,y:220,w:120,h:20}, {x:6450,y:210,w:120,h:20}, {x:6520,y:210,w:200,h:20},
    ],
    signs:[{x:350,y:360},{x:810,y:360},{x:1230,y:270},{x:2110,y:200},{x:6570,y:170}],
    coins:[
      {x:120,y:450},{x:200,y:450},
      {x:340,y:360},{x:440,y:360},{x:540,y:360},
      {x:560,y:310},{x:660,y:310},{x:760,y:310},
      {x:1220,y:270},{x:1320,y:270},{x:1418,y:270},
      {x:2100,y:200},{x:2200,y:200},{x:2300,y:200},
      {x:3160,y:180},{x:3260,y:180},{x:3360,y:180},
      {x:6560,y:175},{x:6660,y:175},
      {x:230,y:270,v:10},{x:450,y:250,v:10},{x:690,y:270,v:10},
      {x:1070,y:240,v:10},{x:1540,y:220,v:10},{x:1790,y:210,v:10},
      {x:2000,y:185,v:10},{x:2420,y:175,v:10},{x:2670,y:165,v:10},
      {x:2900,y:155,v:10},{x:3460,y:145,v:10},{x:3960,y:140,v:10},
      {x:4460,y:135,v:10},{x:4950,y:130,v:10},
    ],
  },
  { width:7500, spawn:{x:80,y:430}, exit:{x:7360,y:200},
    platforms:[
      {x:0,y:480,w:200,h:20}, {x:280,y:390,w:140,h:20}, {x:490,y:340,w:160,h:20},
      {x:720,y:390,w:120,h:20}, {x:910,y:340,w:140,h:20}, {x:1120,y:300,w:150,h:20},
      {x:1340,y:260,w:140,h:20}, {x:1550,y:300,w:130,h:20}, {x:1750,y:260,w:140,h:20},
      {x:1960,y:230,w:150,h:20}, {x:2180,y:260,w:130,h:20}, {x:2380,y:230,w:140,h:20},
      {x:2590,y:210,w:140,h:20}, {x:2800,y:230,w:130,h:20}, {x:3000,y:210,w:130,h:20},
      {x:3200,y:225,w:130,h:20}, {x:3400,y:210,w:120,h:20}, {x:3590,y:220,w:120,h:20},
      {x:3780,y:210,w:120,h:20}, {x:3970,y:220,w:120,h:20}, {x:4160,y:210,w:120,h:20},
      {x:4350,y:220,w:120,h:20}, {x:4540,y:210,w:120,h:20}, {x:4730,y:220,w:120,h:20},
      {x:4920,y:210,w:120,h:20}, {x:5110,y:220,w:120,h:20}, {x:5300,y:210,w:120,h:20},
      {x:5490,y:220,w:120,h:20}, {x:5680,y:210,w:120,h:20}, {x:5870,y:220,w:120,h:20},
      {x:6060,y:210,w:120,h:20}, {x:6250,y:220,w:120,h:20}, {x:6440,y:210,w:120,h:20},
      {x:6630,y:220,w:120,h:20}, {x:6820,y:210,w:120,h:20}, {x:7010,y:220,w:120,h:20},
      {x:7200,y:200,w:120,h:20}, {x:7330,y:200,w:200,h:20},
    ],
    signs:[{x:330,y:350},{x:760,y:350},{x:1170,y:260},{x:2010,y:190},{x:7380,y:160}],
    coins:[
      {x:120,y:450},{x:200,y:450},
      {x:320,y:350},{x:420,y:350},{x:520,y:350},
      {x:530,y:300},{x:630,y:300},{x:730,y:300},
      {x:1160,y:260},{x:1260,y:260},{x:1358,y:260},
      {x:2000,y:195},{x:2100,y:195},{x:2200,y:195},
      {x:3010,y:170},{x:3110,y:170},{x:3210,y:170},
      {x:7370,y:165},{x:7470,y:165},
      {x:210,y:260,v:10},{x:420,y:240,v:10},{x:640,y:265,v:10},
      {x:1010,y:235,v:10},{x:1450,y:215,v:10},{x:1710,y:200,v:10},
      {x:1870,y:185,v:10},{x:2290,y:175,v:10},{x:2530,y:165,v:10},
      {x:2760,y:155,v:10},{x:3260,y:145,v:10},{x:3760,y:140,v:10},
      {x:4260,y:135,v:10},{x:4760,y:130,v:10},{x:5260,y:125,v:10},
    ],
  },
  { width:8300, spawn:{x:80,y:430}, exit:{x:8150,y:190},
    platforms:[
      {x:0,y:480,w:190,h:20}, {x:260,y:380,w:130,h:20}, {x:460,y:330,w:150,h:20},
      {x:680,y:380,w:110,h:20}, {x:860,y:330,w:130,h:20}, {x:1060,y:290,w:140,h:20},
      {x:1270,y:250,w:130,h:20}, {x:1470,y:290,w:120,h:20}, {x:1660,y:250,w:130,h:20},
      {x:1860,y:220,w:140,h:20}, {x:2070,y:250,w:120,h:20}, {x:2260,y:220,w:130,h:20},
      {x:2460,y:200,w:130,h:20}, {x:2660,y:220,w:120,h:20}, {x:2850,y:200,w:120,h:20},
      {x:3040,y:215,w:120,h:20}, {x:3230,y:200,w:110,h:20}, {x:3410,y:210,w:110,h:20},
      {x:3590,y:200,w:110,h:20}, {x:3770,y:210,w:110,h:20}, {x:3950,y:200,w:110,h:20},
      {x:4130,y:210,w:110,h:20}, {x:4310,y:200,w:110,h:20}, {x:4490,y:210,w:110,h:20},
      {x:4670,y:200,w:110,h:20}, {x:4850,y:210,w:110,h:20}, {x:5030,y:200,w:110,h:20},
      {x:5210,y:210,w:110,h:20}, {x:5390,y:200,w:110,h:20}, {x:5570,y:210,w:110,h:20},
      {x:5750,y:200,w:110,h:20}, {x:5930,y:210,w:110,h:20}, {x:6110,y:200,w:110,h:20},
      {x:6290,y:210,w:110,h:20}, {x:6470,y:200,w:110,h:20}, {x:6650,y:210,w:110,h:20},
      {x:6830,y:200,w:110,h:20}, {x:7010,y:210,w:110,h:20}, {x:7190,y:200,w:110,h:20},
      {x:7370,y:210,w:110,h:20}, {x:7550,y:200,w:110,h:20}, {x:7730,y:210,w:110,h:20},
      {x:7910,y:200,w:110,h:20}, {x:8110,y:190,w:200,h:20},
    ],
    signs:[{x:310,y:340},{x:710,y:340},{x:1110,y:250},{x:1910,y:180},{x:8160,y:150}],
    coins:[
      {x:120,y:450},{x:200,y:450},
      {x:300,y:340},{x:400,y:340},{x:500,y:340},
      {x:500,y:290},{x:600,y:290},{x:700,y:290},
      {x:1100,y:250},{x:1200,y:250},{x:1298,y:250},
      {x:1900,y:185},{x:2000,y:185},{x:2100,y:185},
      {x:2870,y:165},{x:2970,y:165},
      {x:8160,y:155},{x:8260,y:155},
      {x:190,y:250,v:10},{x:390,y:225,v:10},{x:600,y:255,v:10},
      {x:960,y:225,v:10},{x:1380,y:210,v:10},{x:1620,y:195,v:10},
      {x:1780,y:180,v:10},{x:2175,y:170,v:10},{x:2420,y:160,v:10},
      {x:2660,y:155,v:10},{x:3140,y:145,v:10},{x:3640,y:140,v:10},
      {x:4140,y:135,v:10},{x:4640,y:130,v:10},{x:5140,y:125,v:10},
    ],
  },
  { width:9100, spawn:{x:80,y:430}, exit:{x:8950,y:180},
    platforms:[
      {x:0,y:480,w:180,h:20}, {x:250,y:370,w:120,h:20}, {x:440,y:320,w:140,h:20},
      {x:650,y:370,w:100,h:20}, {x:820,y:320,w:120,h:20}, {x:1010,y:280,w:130,h:20},
      {x:1210,y:240,w:120,h:20}, {x:1400,y:280,w:110,h:20}, {x:1580,y:240,w:120,h:20},
      {x:1770,y:210,w:130,h:20}, {x:1970,y:240,w:110,h:20}, {x:2150,y:210,w:120,h:20},
      {x:2340,y:190,w:120,h:20}, {x:2530,y:210,w:110,h:20}, {x:2710,y:190,w:110,h:20},
      {x:2890,y:205,w:110,h:20}, {x:3070,y:190,w:100,h:20}, {x:3240,y:200,w:100,h:20},
      {x:3410,y:190,w:100,h:20}, {x:3580,y:200,w:100,h:20}, {x:3750,y:190,w:100,h:20},
      {x:3920,y:200,w:100,h:20}, {x:4090,y:190,w:100,h:20}, {x:4260,y:200,w:100,h:20},
      {x:4430,y:190,w:100,h:20}, {x:4600,y:200,w:100,h:20}, {x:4770,y:190,w:100,h:20},
      {x:4940,y:200,w:100,h:20}, {x:5110,y:190,w:100,h:20}, {x:5280,y:200,w:100,h:20},
      {x:5450,y:190,w:100,h:20}, {x:5620,y:200,w:100,h:20}, {x:5790,y:190,w:100,h:20},
      {x:5960,y:200,w:100,h:20}, {x:6130,y:190,w:100,h:20}, {x:6300,y:200,w:100,h:20},
      {x:6470,y:190,w:100,h:20}, {x:6640,y:200,w:100,h:20}, {x:6810,y:190,w:100,h:20},
      {x:6980,y:200,w:100,h:20}, {x:7150,y:190,w:100,h:20}, {x:7320,y:200,w:100,h:20},
      {x:7490,y:190,w:100,h:20}, {x:7660,y:200,w:100,h:20}, {x:7830,y:190,w:100,h:20},
      {x:8000,y:200,w:100,h:20}, {x:8170,y:190,w:100,h:20}, {x:8900,y:180,w:200,h:20},
    ],
    signs:[{x:300,y:330},{x:670,y:330},{x:1060,y:240},{x:1820,y:170},{x:8950,y:140}],
    coins:[
      {x:120,y:450},{x:200,y:450},
      {x:290,y:330},{x:390,y:330},{x:490,y:330},
      {x:480,y:280},{x:580,y:280},{x:680,y:280},
      {x:1050,y:240},{x:1150,y:240},{x:1248,y:240},
      {x:1810,y:175},{x:1910,y:175},{x:2010,y:175},
      {x:2760,y:155},{x:2860,y:155},
      {x:8940,y:145},{x:9040,y:145},
      {x:180,y:240,v:10},{x:370,y:215,v:10},{x:570,y:245,v:10},
      {x:910,y:215,v:10},{x:1310,y:200,v:10},{x:1550,y:185,v:10},
      {x:1700,y:170,v:10},{x:2060,y:160,v:10},{x:2280,y:150,v:10},
      {x:2510,y:145,v:10},{x:3000,y:140,v:10},{x:3500,y:135,v:10},
      {x:4000,y:130,v:10},{x:4500,y:125,v:10},{x:5000,y:120,v:10},
    ],
  },
  { width:9900, spawn:{x:80,y:430}, exit:{x:9750,y:170},
    platforms:[
      {x:0,y:480,w:170,h:20}, {x:240,y:360,w:115,h:20}, {x:425,y:310,w:135,h:20},
      {x:630,y:360,w:95,h:20}, {x:795,y:310,w:115,h:20}, {x:980,y:270,w:125,h:20},
      {x:1175,y:230,w:115,h:20}, {x:1360,y:270,w:105,h:20}, {x:1535,y:230,w:115,h:20},
      {x:1720,y:200,w:125,h:20}, {x:1915,y:230,w:105,h:20}, {x:2090,y:200,w:115,h:20},
      {x:2275,y:180,w:115,h:20}, {x:2460,y:200,w:105,h:20}, {x:2635,y:180,w:105,h:20},
      {x:2810,y:195,w:105,h:20}, {x:2985,y:180,w:95,h:20}, {x:3150,y:190,w:95,h:20},
      {x:3315,y:180,w:95,h:20}, {x:3480,y:190,w:95,h:20}, {x:3645,y:180,w:95,h:20},
      {x:3810,y:190,w:95,h:20}, {x:3975,y:180,w:95,h:20}, {x:4140,y:190,w:95,h:20},
      {x:4305,y:180,w:95,h:20}, {x:4470,y:190,w:95,h:20}, {x:4635,y:180,w:95,h:20},
      {x:4800,y:190,w:95,h:20}, {x:4965,y:180,w:95,h:20}, {x:5130,y:190,w:95,h:20},
      {x:5295,y:180,w:95,h:20}, {x:5460,y:190,w:95,h:20}, {x:5625,y:180,w:95,h:20},
      {x:5790,y:190,w:95,h:20}, {x:5955,y:180,w:95,h:20}, {x:6120,y:190,w:95,h:20},
      {x:6285,y:180,w:95,h:20}, {x:6450,y:190,w:95,h:20}, {x:6615,y:180,w:95,h:20},
      {x:6780,y:190,w:95,h:20}, {x:6945,y:180,w:95,h:20}, {x:7110,y:190,w:95,h:20},
      {x:7275,y:180,w:95,h:20}, {x:7440,y:190,w:95,h:20}, {x:7605,y:180,w:95,h:20},
      {x:7770,y:190,w:95,h:20}, {x:7935,y:180,w:95,h:20}, {x:8100,y:190,w:95,h:20},
      {x:8265,y:180,w:95,h:20}, {x:8430,y:190,w:95,h:20}, {x:9700,y:170,w:200,h:20},
    ],
    signs:[{x:290,y:320},{x:645,y:320},{x:1030,y:230},{x:1770,y:160},{x:9750,y:130}],
    coins:[
      {x:120,y:450},{x:200,y:450},
      {x:280,y:320},{x:380,y:320},{x:480,y:320},
      {x:470,y:270},{x:570,y:270},{x:670,y:270},
      {x:1020,y:230},{x:1120,y:230},{x:1218,y:230},
      {x:1760,y:165},{x:1860,y:165},{x:1960,y:165},
      {x:2700,y:145},{x:2800,y:145},
      {x:9740,y:135},{x:9840,y:135},
      {x:170,y:230,v:10},{x:360,y:205,v:10},{x:550,y:235,v:10},
      {x:880,y:205,v:10},{x:1270,y:190,v:10},{x:1510,y:175,v:10},
      {x:1640,y:160,v:10},{x:2000,y:150,v:10},{x:2200,y:140,v:10},
      {x:2430,y:135,v:10},{x:2920,y:130,v:10},{x:3420,y:125,v:10},
    ],
  },
];}

// Set C — Asia/Fantasy (Japonia, Iarna, Spatiu, Subapa, Castel, Curcubeu): platforme in trepte
function levelsFantasy() { return [
  { width:4000, spawn:{x:80,y:430}, exit:{x:3870,y:250},
    platforms:[
      {x:0,y:480,w:250,h:20}, {x:330,y:440,w:220,h:20}, {x:630,y:400,w:200,h:20},
      {x:910,y:360,w:220,h:20}, {x:1210,y:320,w:200,h:20}, {x:1490,y:360,w:180,h:20},
      {x:1750,y:320,w:200,h:20}, {x:2030,y:280,w:180,h:20}, {x:2290,y:320,w:170,h:20},
      {x:2540,y:280,w:180,h:20}, {x:2800,y:260,w:180,h:20}, {x:3060,y:280,w:160,h:20},
      {x:3300,y:260,w:160,h:20}, {x:3540,y:250,w:180,h:20}, {x:3800,y:250,w:200,h:20},
      // drum jos
      {x:460,y:465,w:140,h:20}, {x:760,y:465,w:130,h:20}, {x:1030,y:460,w:130,h:20},
    ],
    signs:[{x:380,y:400},{x:960,y:320},{x:1540,y:320},{x:2580,y:240},{x:3850,y:210}],
    coins:[
      {x:130,y:450},{x:200,y:450},{x:280,y:450},
      {x:370,y:400},{x:470,y:400},{x:570,y:400},
      {x:670,y:360},{x:770,y:360},{x:870,y:360},
      {x:950,y:320},{x:1050,y:320},{x:1150,y:320},{x:1250,y:320},
      {x:1540,y:320},{x:1640,y:320},{x:1740,y:320},
      {x:2080,y:240},{x:2180,y:240},{x:2280,y:240},
      {x:2590,y:240},{x:2690,y:240},{x:2790,y:240},
      {x:3850,y:215},{x:3950,y:215},
      {x:260,y:330,v:10},{x:540,y:300,v:10},{x:820,y:270,v:10},
      {x:1120,y:240,v:10},{x:1390,y:240,v:10},{x:1680,y:240,v:10},
      {x:1960,y:220,v:10},{x:2440,y:210,v:10},{x:2720,y:195,v:10},
      {x:3000,y:210,v:10},{x:3460,y:190,v:10},
      {x:490,y:430},{x:790,y:430},{x:1060,y:425},
    ],
  },
  { width:4700, spawn:{x:80,y:430}, exit:{x:4570,y:230},
    platforms:[
      {x:0,y:480,w:230,h:20}, {x:310,y:430,w:200,h:20}, {x:590,y:390,w:180,h:20},
      {x:850,y:430,w:160,h:20}, {x:1090,y:390,w:180,h:20}, {x:1350,y:350,w:190,h:20},
      {x:1620,y:310,w:180,h:20}, {x:1880,y:350,w:170,h:20}, {x:2130,y:310,w:180,h:20},
      {x:2390,y:270,w:190,h:20}, {x:2660,y:310,w:170,h:20}, {x:2910,y:270,w:180,h:20},
      {x:3170,y:250,w:180,h:20}, {x:3430,y:270,w:170,h:20}, {x:3680,y:250,w:170,h:20},
      {x:3930,y:270,w:160,h:20}, {x:4170,y:250,w:160,h:20}, {x:4410,y:230,w:160,h:20},
      {x:4650,y:230,w:180,h:20},
    ],
    signs:[{x:360,y:390},{x:900,y:390},{x:1400,y:310},{x:2440,y:230},{x:4700,y:190}],
    coins:[
      {x:120,y:450},{x:200,y:450},{x:280,y:450},
      {x:350,y:390},{x:450,y:390},{x:550,y:390},
      {x:630,y:350},{x:730,y:350},{x:830,y:350},
      {x:900,y:390},{x:1000,y:390},{x:1090,y:390},
      {x:1390,y:310},{x:1490,y:310},{x:1590,y:310},
      {x:2430,y:230},{x:2530,y:230},{x:2630,y:230},
      {x:3720,y:210},{x:3820,y:210},{x:3920,y:210},
      {x:4700,y:195},{x:4800,y:195},
      {x:240,y:310,v:10},{x:480,y:280,v:10},{x:740,y:290,v:10},
      {x:1190,y:270,v:10},{x:1730,y:250,v:10},{x:1990,y:240,v:10},
      {x:2230,y:230,v:10},{x:2770,y:210,v:10},{x:3070,y:195,v:10},
      {x:3350,y:205,v:10},{x:4060,y:185,v:10},
    ],
  },
  { width:5400, spawn:{x:80,y:430}, exit:{x:5260,y:220},
    platforms:[
      {x:0,y:480,w:210,h:20}, {x:290,y:420,w:180,h:20}, {x:550,y:380,w:170,h:20},
      {x:800,y:420,w:150,h:20}, {x:1030,y:380,w:170,h:20}, {x:1280,y:340,w:180,h:20},
      {x:1540,y:300,w:170,h:20}, {x:1790,y:340,w:160,h:20}, {x:2030,y:300,w:170,h:20},
      {x:2280,y:260,w:180,h:20}, {x:2540,y:300,w:160,h:20}, {x:2780,y:260,w:170,h:20},
      {x:3030,y:240,w:170,h:20}, {x:3280,y:260,w:160,h:20}, {x:3520,y:240,w:160,h:20},
      {x:3760,y:260,w:150,h:20}, {x:3990,y:240,w:150,h:20}, {x:4220,y:250,w:150,h:20},
      {x:4450,y:240,w:150,h:20}, {x:4680,y:250,w:150,h:20}, {x:4910,y:240,w:150,h:20},
      {x:5140,y:220,w:150,h:20}, {x:5230,y:220,w:200,h:20},
    ],
    signs:[{x:340,y:380},{x:850,y:380},{x:1330,y:300},{x:2330,y:220},{x:5280,y:180}],
    coins:[
      {x:120,y:450},{x:200,y:450},{x:260,y:450},
      {x:330,y:380},{x:430,y:380},{x:530,y:380},
      {x:590,y:340},{x:690,y:340},{x:790,y:340},
      {x:1320,y:300},{x:1420,y:300},{x:1518,y:300},
      {x:2320,y:220},{x:2420,y:220},{x:2520,y:220},
      {x:3540,y:200},{x:3640,y:200},{x:3740,y:200},
      {x:5270,y:185},{x:5370,y:185},
      {x:220,y:300,v:10},{x:460,y:270,v:10},{x:700,y:280,v:10},
      {x:1130,y:260,v:10},{x:1650,y:240,v:10},{x:1900,y:230,v:10},
      {x:2130,y:220,v:10},{x:2670,y:195,v:10},{x:2960,y:185,v:10},
      {x:3240,y:175,v:10},{x:3900,y:165,v:10},{x:4400,y:160,v:10},
    ],
  },
  { width:6200, spawn:{x:80,y:430}, exit:{x:6060,y:210},
    platforms:[
      {x:0,y:480,w:195,h:20}, {x:275,y:410,w:165,h:20}, {x:520,y:365,w:160,h:20},
      {x:760,y:410,w:140,h:20}, {x:980,y:365,w:160,h:20}, {x:1220,y:325,w:170,h:20},
      {x:1470,y:285,w:160,h:20}, {x:1710,y:325,w:150,h:20}, {x:1940,y:285,w:160,h:20},
      {x:2180,y:255,w:170,h:20}, {x:2430,y:285,w:150,h:20}, {x:2660,y:255,w:160,h:20},
      {x:2900,y:235,w:160,h:20}, {x:3140,y:255,w:150,h:20}, {x:3370,y:235,w:150,h:20},
      {x:3600,y:255,w:140,h:20}, {x:3820,y:235,w:140,h:20}, {x:4040,y:245,w:140,h:20},
      {x:4260,y:235,w:140,h:20}, {x:4480,y:245,w:130,h:20}, {x:4690,y:235,w:130,h:20},
      {x:4900,y:245,w:130,h:20}, {x:5110,y:235,w:130,h:20}, {x:5320,y:245,w:130,h:20},
      {x:5530,y:235,w:130,h:20}, {x:5740,y:245,w:130,h:20}, {x:5950,y:210,w:200,h:20},
    ],
    signs:[{x:325,y:370},{x:810,y:370},{x:1270,y:285},{x:2230,y:215},{x:6000,y:170}],
    coins:[
      {x:120,y:450},{x:200,y:450},
      {x:315,y:370},{x:415,y:370},{x:515,y:370},
      {x:560,y:325},{x:660,y:325},{x:760,y:325},
      {x:1260,y:285},{x:1360,y:285},{x:1458,y:285},
      {x:2220,y:215},{x:2320,y:215},{x:2420,y:215},
      {x:3380,y:195},{x:3480,y:195},{x:3578,y:195},
      {x:5990,y:175},{x:6090,y:175},
      {x:205,y:285,v:10},{x:440,y:255,v:10},{x:680,y:270,v:10},
      {x:1070,y:255,v:10},{x:1590,y:235,v:10},{x:1840,y:225,v:10},
      {x:2060,y:210,v:10},{x:2555,y:195,v:10},{x:2810,y:185,v:10},
      {x:3070,y:175,v:10},{x:3590,y:165,v:10},{x:4060,y:160,v:10},
      {x:4560,y:155,v:10},{x:5070,y:150,v:10},
    ],
  },
  { width:7000, spawn:{x:80,y:430}, exit:{x:6860,y:200},
    platforms:[
      {x:0,y:480,w:180,h:20}, {x:260,y:400,w:155,h:20}, {x:495,y:355,w:150,h:20},
      {x:725,y:400,w:130,h:20}, {x:935,y:355,w:150,h:20}, {x:1165,y:315,w:160,h:20},
      {x:1405,y:275,w:150,h:20}, {x:1635,y:315,w:140,h:20}, {x:1855,y:275,w:150,h:20},
      {x:2085,y:245,w:160,h:20}, {x:2325,y:275,w:140,h:20}, {x:2545,y:245,w:150,h:20},
      {x:2775,y:225,w:150,h:20}, {x:3005,y:245,w:140,h:20}, {x:3225,y:225,w:140,h:20},
      {x:3445,y:245,w:130,h:20}, {x:3655,y:225,w:130,h:20}, {x:3865,y:235,w:130,h:20},
      {x:4075,y:225,w:130,h:20}, {x:4285,y:235,w:130,h:20}, {x:4495,y:225,w:120,h:20},
      {x:4695,y:235,w:120,h:20}, {x:4895,y:225,w:120,h:20}, {x:5095,y:235,w:120,h:20},
      {x:5295,y:225,w:120,h:20}, {x:5495,y:235,w:120,h:20}, {x:5695,y:225,w:120,h:20},
      {x:5895,y:235,w:120,h:20}, {x:6095,y:225,w:120,h:20}, {x:6295,y:235,w:120,h:20},
      {x:6495,y:225,w:120,h:20}, {x:6695,y:235,w:120,h:20}, {x:6820,y:200,w:200,h:20},
    ],
    signs:[{x:310,y:360},{x:775,y:360},{x:1215,y:275},{x:2135,y:205},{x:6870,y:160}],
    coins:[
      {x:120,y:450},{x:200,y:450},
      {x:300,y:360},{x:400,y:360},{x:500,y:360},
      {x:535,y:315},{x:635,y:315},{x:735,y:315},
      {x:1205,y:275},{x:1305,y:275},{x:1403,y:275},
      {x:2125,y:205},{x:2225,y:205},{x:2325,y:205},
      {x:3235,y:185},{x:3335,y:185},{x:3433,y:185},
      {x:6860,y:165},{x:6960,y:165},
      {x:190,y:275,v:10},{x:420,y:245,v:10},{x:650,y:260,v:10},
      {x:1035,y:245,v:10},{x:1530,y:225,v:10},{x:1775,y:215,v:10},
      {x:1975,y:200,v:10},{x:2435,y:185,v:10},{x:2685,y:175,v:10},
      {x:2925,y:165,v:10},{x:3445,y:155,v:10},{x:3945,y:150,v:10},
      {x:4445,y:145,v:10},{x:4945,y:140,v:10},{x:5445,y:135,v:10},
    ],
  },
  { width:7800, spawn:{x:80,y:430}, exit:{x:7650,y:190},
    platforms:[
      {x:0,y:480,w:170,h:20}, {x:245,y:390,w:145,h:20}, {x:470,y:345,w:145,h:20},
      {x:695,y:390,w:120,h:20}, {x:895,y:345,w:140,h:20}, {x:1115,y:305,w:150,h:20},
      {x:1345,y:265,w:140,h:20}, {x:1565,y:305,w:130,h:20}, {x:1775,y:265,w:140,h:20},
      {x:1995,y:235,w:150,h:20}, {x:2225,y:265,w:130,h:20}, {x:2435,y:235,w:140,h:20},
      {x:2655,y:215,w:140,h:20}, {x:2875,y:235,w:130,h:20}, {x:3085,y:215,w:130,h:20},
      {x:3295,y:230,w:130,h:20}, {x:3505,y:215,w:120,h:20}, {x:3705,y:225,w:120,h:20},
      {x:3905,y:215,w:120,h:20}, {x:4105,y:225,w:120,h:20}, {x:4305,y:215,w:120,h:20},
      {x:4505,y:225,w:120,h:20}, {x:4705,y:215,w:120,h:20}, {x:4905,y:225,w:120,h:20},
      {x:5105,y:215,w:120,h:20}, {x:5305,y:225,w:120,h:20}, {x:5505,y:215,w:120,h:20},
      {x:5705,y:225,w:120,h:20}, {x:5905,y:215,w:120,h:20}, {x:6105,y:225,w:120,h:20},
      {x:6305,y:215,w:120,h:20}, {x:6505,y:225,w:120,h:20}, {x:6705,y:215,w:120,h:20},
      {x:6905,y:225,w:120,h:20}, {x:7105,y:215,w:120,h:20}, {x:7305,y:225,w:120,h:20},
      {x:7505,y:215,w:120,h:20}, {x:7630,y:190,w:200,h:20},
    ],
    signs:[{x:295,y:350},{x:745,y:350},{x:1165,y:265},{x:2045,y:195},{x:7680,y:150}],
    coins:[
      {x:120,y:450},{x:200,y:450},
      {x:285,y:350},{x:385,y:350},{x:485,y:350},
      {x:510,y:305},{x:610,y:305},{x:710,y:305},
      {x:1155,y:265},{x:1255,y:265},{x:1353,y:265},
      {x:2035,y:200},{x:2135,y:200},{x:2235,y:200},
      {x:3096,y:175},{x:3196,y:175},
      {x:7670,y:155},{x:7770,y:155},
      {x:175,y:265,v:10},{x:400,y:235,v:10},{x:625,y:255,v:10},
      {x:995,y:235,v:10},{x:1465,y:215,v:10},{x:1705,y:205,v:10},
      {x:1895,y:190,v:10},{x:2345,y:175,v:10},{x:2565,y:165,v:10},
      {x:2795,y:155,v:10},{x:3295,y:145,v:10},{x:3795,y:140,v:10},
      {x:4295,y:135,v:10},{x:4795,y:130,v:10},{x:5295,y:125,v:10},
    ],
  },
  { width:8600, spawn:{x:80,y:430}, exit:{x:8450,y:180},
    platforms:[
      {x:0,y:480,w:160,h:20}, {x:230,y:380,w:135,h:20}, {x:445,y:335,w:135,h:20},
      {x:660,y:380,w:110,h:20}, {x:850,y:335,w:130,h:20}, {x:1060,y:295,w:140,h:20},
      {x:1280,y:255,w:130,h:20}, {x:1490,y:295,w:120,h:20}, {x:1690,y:255,w:130,h:20},
      {x:1900,y:225,w:140,h:20}, {x:2120,y:255,w:120,h:20}, {x:2320,y:225,w:130,h:20},
      {x:2530,y:205,w:130,h:20}, {x:2740,y:225,w:120,h:20}, {x:2940,y:205,w:120,h:20},
      {x:3140,y:220,w:120,h:20}, {x:3340,y:205,w:110,h:20}, {x:3530,y:215,w:110,h:20},
      {x:3720,y:205,w:110,h:20}, {x:3910,y:215,w:110,h:20}, {x:4100,y:205,w:110,h:20},
      {x:4290,y:215,w:110,h:20}, {x:4480,y:205,w:110,h:20}, {x:4670,y:215,w:110,h:20},
      {x:4860,y:205,w:110,h:20}, {x:5050,y:215,w:110,h:20}, {x:5240,y:205,w:110,h:20},
      {x:5430,y:215,w:110,h:20}, {x:5620,y:205,w:110,h:20}, {x:5810,y:215,w:110,h:20},
      {x:6000,y:205,w:110,h:20}, {x:6190,y:215,w:110,h:20}, {x:6380,y:205,w:110,h:20},
      {x:6570,y:215,w:110,h:20}, {x:6760,y:205,w:110,h:20}, {x:6950,y:215,w:110,h:20},
      {x:7140,y:205,w:110,h:20}, {x:7330,y:215,w:110,h:20}, {x:7520,y:205,w:110,h:20},
      {x:7710,y:215,w:110,h:20}, {x:7900,y:205,w:110,h:20}, {x:8090,y:215,w:110,h:20},
      {x:8280,y:205,w:110,h:20}, {x:8420,y:180,w:200,h:20},
    ],
    signs:[{x:280,y:340},{x:710,y:340},{x:1110,y:255},{x:1950,y:185},{x:8470,y:140}],
    coins:[
      {x:120,y:450},{x:200,y:450},
      {x:270,y:340},{x:370,y:340},{x:470,y:340},
      {x:485,y:295},{x:585,y:295},{x:685,y:295},
      {x:1100,y:255},{x:1200,y:255},{x:1298,y:255},
      {x:1940,y:190},{x:2040,y:190},{x:2140,y:190},
      {x:2960,y:170},{x:3060,y:170},
      {x:8460,y:145},{x:8560,y:145},
      {x:160,y:255,v:10},{x:380,y:225,v:10},{x:600,y:245,v:10},
      {x:950,y:225,v:10},{x:1400,y:205,v:10},{x:1640,y:195,v:10},
      {x:1820,y:180,v:10},{x:2230,y:165,v:10},{x:2450,y:155,v:10},
      {x:2660,y:145,v:10},{x:3150,y:140,v:10},{x:3650,y:135,v:10},
      {x:4150,y:130,v:10},{x:4650,y:125,v:10},{x:5150,y:120,v:10},
    ],
  },
  { width:9400, spawn:{x:80,y:430}, exit:{x:9250,y:170},
    platforms:[
      {x:0,y:480,w:150,h:20}, {x:215,y:370,w:125,h:20}, {x:420,y:325,w:125,h:20},
      {x:625,y:370,w:100,h:20}, {x:805,y:325,w:120,h:20}, {x:1005,y:285,w:130,h:20},
      {x:1215,y:245,w:120,h:20}, {x:1415,y:285,w:110,h:20}, {x:1605,y:245,w:120,h:20},
      {x:1805,y:215,w:130,h:20}, {x:2015,y:245,w:110,h:20}, {x:2205,y:215,w:120,h:20},
      {x:2405,y:195,w:120,h:20}, {x:2605,y:215,w:110,h:20}, {x:2795,y:195,w:110,h:20},
      {x:2985,y:210,w:110,h:20}, {x:3175,y:195,w:100,h:20}, {x:3355,y:205,w:100,h:20},
      {x:3535,y:195,w:100,h:20}, {x:3715,y:205,w:100,h:20}, {x:3895,y:195,w:100,h:20},
      {x:4075,y:205,w:100,h:20}, {x:4255,y:195,w:100,h:20}, {x:4435,y:205,w:100,h:20},
      {x:4615,y:195,w:100,h:20}, {x:4795,y:205,w:100,h:20}, {x:4975,y:195,w:100,h:20},
      {x:5155,y:205,w:100,h:20}, {x:5335,y:195,w:100,h:20}, {x:5515,y:205,w:100,h:20},
      {x:5695,y:195,w:100,h:20}, {x:5875,y:205,w:100,h:20}, {x:6055,y:195,w:100,h:20},
      {x:6235,y:205,w:100,h:20}, {x:6415,y:195,w:100,h:20}, {x:6595,y:205,w:100,h:20},
      {x:6775,y:195,w:100,h:20}, {x:6955,y:205,w:100,h:20}, {x:7135,y:195,w:100,h:20},
      {x:7315,y:205,w:100,h:20}, {x:7495,y:195,w:100,h:20}, {x:7675,y:205,w:100,h:20},
      {x:7855,y:195,w:100,h:20}, {x:8035,y:205,w:100,h:20}, {x:8215,y:195,w:100,h:20},
      {x:9210,y:170,w:200,h:20},
    ],
    signs:[{x:265,y:330},{x:655,y:330},{x:1055,y:245},{x:1855,y:175},{x:9260,y:130}],
    coins:[
      {x:120,y:450},{x:200,y:450},
      {x:255,y:330},{x:355,y:330},{x:455,y:330},
      {x:460,y:285},{x:560,y:285},{x:660,y:285},
      {x:1045,y:245},{x:1145,y:245},{x:1243,y:245},
      {x:1845,y:180},{x:1945,y:180},{x:2045,y:180},
      {x:2830,y:160},{x:2930,y:160},
      {x:9250,y:135},{x:9350,y:135},
      {x:145,y:245,v:10},{x:360,y:215,v:10},{x:580,y:235,v:10},
      {x:910,y:215,v:10},{x:1330,y:195,v:10},{x:1570,y:185,v:10},
      {x:1730,y:170,v:10},{x:2125,y:155,v:10},{x:2330,y:145,v:10},
      {x:2540,y:135,v:10},{x:3040,y:130,v:10},{x:3540,y:125,v:10},
    ],
  },
  { width:10200, spawn:{x:80,y:430}, exit:{x:10050,y:160},
    platforms:[
      {x:0,y:480,w:145,h:20}, {x:205,y:360,w:120,h:20}, {x:405,y:315,w:120,h:20},
      {x:605,y:360,w:95,h:20}, {x:780,y:315,w:115,h:20}, {x:975,y:275,w:125,h:20},
      {x:1180,y:235,w:115,h:20}, {x:1375,y:275,w:105,h:20}, {x:1560,y:235,w:115,h:20},
      {x:1755,y:205,w:125,h:20}, {x:1960,y:235,w:105,h:20}, {x:2145,y:205,w:115,h:20},
      {x:2340,y:185,w:115,h:20}, {x:2535,y:205,w:105,h:20}, {x:2720,y:185,w:105,h:20},
      {x:2905,y:200,w:105,h:20}, {x:3090,y:185,w:95,h:20}, {x:3265,y:195,w:95,h:20},
      {x:3440,y:185,w:95,h:20}, {x:3615,y:195,w:95,h:20}, {x:3790,y:185,w:95,h:20},
      {x:3965,y:195,w:95,h:20}, {x:4140,y:185,w:95,h:20}, {x:4315,y:195,w:95,h:20},
      {x:4490,y:185,w:95,h:20}, {x:4665,y:195,w:95,h:20}, {x:4840,y:185,w:95,h:20},
      {x:5015,y:195,w:95,h:20}, {x:5190,y:185,w:95,h:20}, {x:5365,y:195,w:95,h:20},
      {x:5540,y:185,w:95,h:20}, {x:5715,y:195,w:95,h:20}, {x:5890,y:185,w:95,h:20},
      {x:6065,y:195,w:95,h:20}, {x:6240,y:185,w:95,h:20}, {x:6415,y:195,w:95,h:20},
      {x:6590,y:185,w:95,h:20}, {x:6765,y:195,w:95,h:20}, {x:6940,y:185,w:95,h:20},
      {x:7115,y:195,w:95,h:20}, {x:7290,y:185,w:95,h:20}, {x:7465,y:195,w:95,h:20},
      {x:7640,y:185,w:95,h:20}, {x:7815,y:195,w:95,h:20}, {x:7990,y:185,w:95,h:20},
      {x:8165,y:195,w:95,h:20}, {x:8340,y:185,w:95,h:20}, {x:10010,y:160,w:200,h:20},
    ],
    signs:[{x:255,y:320},{x:630,y:320},{x:1030,y:235},{x:1805,y:165},{x:10060,y:120}],
    coins:[
      {x:120,y:450},{x:200,y:450},
      {x:245,y:320},{x:345,y:320},{x:445,y:320},
      {x:445,y:275},{x:545,y:275},{x:645,y:275},
      {x:1020,y:235},{x:1120,y:235},{x:1218,y:235},
      {x:1795,y:170},{x:1895,y:170},{x:1995,y:170},
      {x:2760,y:150},{x:2860,y:150},
      {x:10050,y:125},{x:10150,y:125},
      {x:135,y:235,v:10},{x:345,y:205,v:10},{x:560,y:225,v:10},
      {x:875,y:205,v:10},{x:1290,y:185,v:10},{x:1530,y:175,v:10},
      {x:1665,y:160,v:10},{x:2055,y:145,v:10},{x:2255,y:135,v:10},
      {x:2480,y:125,v:10},{x:2980,y:120,v:10},{x:3480,y:115,v:10},
    ],
  },
];}

function makeLevels(worldId) {
  // Urban: Oras + New York
  if (worldId === 'oras' || worldId === 'newyork') return levelsUrban();
  // Natura: Jungla + Munte + Plaja + Apus
  if (worldId === 'jungla' || worldId === 'munte' || worldId === 'plaja' || worldId === 'apus') return levelsNatura();
  // Fantasy: restul (Japonia, Iarna, Spatiu, Subapa, Castel, Curcubeu)
  return levelsFantasy();
}

function _unused_makeLevels_old() {
  return [
    // Nivel 1 — introducere, goluri mici
    {
      width: 3200,
      spawn: { x: 80, y: 440 },
      exit:  { x: 3060, y: 270 },
      platforms: [
        { x: 0,    y: 480, w: 320, h: 20 },
        { x: 480,  y: 420, w: 130, h: 20 }, // gol 160
        { x: 760,  y: 370, w: 120, h: 20 }, // gol 110
        { x: 1030, y: 320, w: 130, h: 20 }, // gol 150
        { x: 1320, y: 290, w: 160, h: 20 }, // gol 130
        { x: 1650, y: 290, w: 130, h: 20 }, // gol 170
        { x: 1950, y: 330, w: 130, h: 20 }, // gol 170
        { x: 2250, y: 290, w: 130, h: 20 }, // gol 170
        { x: 2560, y: 280, w: 130, h: 20 }, // gol 180
        { x: 2870, y: 270, w: 130, h: 20 }, // gol 180
        { x: 3010, y: 270, w: 220, h: 20 }, // platforma finish
        // cale alternativa jos
        { x: 620,  y: 460, w: 110, h: 20 },
        { x: 880,  y: 450, w: 110, h: 20 },
        { x: 1140, y: 440, w: 110, h: 20 },
      ],
      signs: [
        { x: 540, y: 380 }, { x: 820, y: 330 }, { x: 1090, y: 280 },
        { x: 1710, y: 250 }, { x: 2920, y: 230 },
      ],
      coins: [
        { x: 140, y: 450 }, { x: 190, y: 450 }, { x: 260, y: 450 },
        { x: 510, y: 380 }, { x: 790, y: 330 }, { x: 1060, y: 280 },
        { x: 1350, y: 250 }, { x: 1680, y: 250 }, { x: 1980, y: 290 },
        { x: 2280, y: 250 }, { x: 2590, y: 240 }, { x: 2900, y: 230 },
        // speciale (10) in aer intre platforme
        { x: 370,  y: 340, v: 10 },
        { x: 632,  y: 290, v: 10 },
        { x: 900,  y: 260, v: 10 },
        { x: 1185, y: 240, v: 10 },
        { x: 1808, y: 220, v: 10 },
        { x: 2410, y: 220, v: 10 },
        // cale jos
        { x: 650, y: 425 }, { x: 910, y: 415 }, { x: 1170, y: 405 },
      ],
    },
    // Nivel 2 — goluri mai mari, incepe dificultatea
    {
      width: 3800,
      spawn: { x: 80, y: 420 },
      exit:  { x: 3660, y: 220 },
      platforms: [
        { x: 0,    y: 480, w: 280, h: 20 },
        { x: 440,  y: 420, w: 110, h: 20 }, // gol 160
        { x: 700,  y: 360, w: 110, h: 20 }, // gol 150
        { x: 980,  y: 300, w: 110, h: 20 }, // gol 170
        { x: 1270, y: 250, w: 140, h: 20 }, // gol 160
        { x: 1580, y: 300, w: 110, h: 20 }, // gol 170
        { x: 1870, y: 240, w: 120, h: 20 }, // gol 180
        { x: 2180, y: 210, w: 130, h: 20 }, // gol 190
        { x: 2510, y: 250, w: 110, h: 20 }, // gol 200
        { x: 2830, y: 230, w: 110, h: 20 }, // gol 210
        { x: 3160, y: 220, w: 110, h: 20 }, // gol 220
        { x: 3490, y: 220, w: 80,  h: 20 }, // gol 220
        { x: 3620, y: 220, w: 200, h: 20 }, // finish
        // cale alternativa
        { x: 560,  y: 460, w: 100, h: 20 },
        { x: 820,  y: 450, w: 100, h: 20 },
        { x: 1090, y: 440, w: 100, h: 20 },
      ],
      signs: [
        { x: 500, y: 380 }, { x: 760, y: 320 }, { x: 1040, y: 260 },
        { x: 1940, y: 200 }, { x: 3220, y: 180 },
      ],
      coins: [
        { x: 120, y: 445 }, { x: 180, y: 445 }, { x: 240, y: 445 },
        { x: 470, y: 380 }, { x: 730, y: 320 }, { x: 1010, y: 260 },
        { x: 1300, y: 210 }, { x: 1610, y: 260 }, { x: 1900, y: 200 },
        { x: 2210, y: 170 }, { x: 2540, y: 210 }, { x: 2860, y: 190 },
        { x: 3190, y: 180 }, { x: 3660, y: 185 },
        // speciale
        { x: 330,  y: 340, v: 10 },
        { x: 585,  y: 280, v: 10 },
        { x: 848,  y: 240, v: 10 },
        { x: 1130, y: 210, v: 10 },
        { x: 2050, y: 175, v: 10 },
        { x: 2690, y: 180, v: 10 },
        { x: 3340, y: 170, v: 10 },
        // cale jos
        { x: 590, y: 425 }, { x: 850, y: 415 }, { x: 1120, y: 405 },
      ],
    },
    // Nivel 3 — zigzag, doua drumuri distincte
    {
      width: 4400,
      spawn: { x: 80, y: 430 },
      exit:  { x: 4270, y: 230 },
      platforms: [
        { x: 0,    y: 480, w: 250, h: 20 },
        // Drum principal (sus)
        { x: 380,  y: 400, w: 100, h: 20 }, // gol 130
        { x: 600,  y: 340, w: 100, h: 20 }, // gol 120
        { x: 840,  y: 290, w: 100, h: 20 }, // gol 140
        { x: 1100, y: 340, w: 100, h: 20 }, // gol 160
        { x: 1370, y: 280, w: 110, h: 20 }, // gol 170
        { x: 1670, y: 240, w: 110, h: 20 }, // gol 190
        { x: 1990, y: 280, w: 100, h: 20 }, // gol 210
        { x: 2310, y: 230, w: 100, h: 20 }, // gol 220
        { x: 2650, y: 260, w: 100, h: 20 }, // gol 240
        { x: 2990, y: 230, w: 100, h: 20 }, // gol 240
        { x: 3340, y: 230, w: 100, h: 20 }, // gol 250
        { x: 3700, y: 240, w: 100, h: 20 }, // gol 260
        { x: 4120, y: 230, w: 200, h: 20 }, // finish
        // Drum alternativ (jos, mai lent dar mai sigur)
        { x: 300,  y: 460, w: 100, h: 20 },
        { x: 500,  y: 460, w: 100, h: 20 },
        { x: 720,  y: 450, w: 100, h: 20 },
        { x: 940,  y: 450, w: 100, h: 20 },
        { x: 1160, y: 460, w: 100, h: 20 },
      ],
      signs: [
        { x: 440, y: 360 }, { x: 660, y: 300 }, { x: 900, y: 250 },
        { x: 1430, y: 240 }, { x: 2370, y: 190 }, { x: 3760, y: 200 },
      ],
      coins: [
        { x: 110, y: 450 }, { x: 160, y: 450 }, { x: 210, y: 450 },
        { x: 410, y: 360 }, { x: 630, y: 300 }, { x: 870, y: 250 },
        { x: 1130, y: 300 }, { x: 1400, y: 240 }, { x: 1700, y: 200 },
        { x: 2020, y: 240 }, { x: 2340, y: 190 }, { x: 2680, y: 220 },
        { x: 3020, y: 190 }, { x: 3370, y: 190 }, { x: 3730, y: 200 },
        // speciale
        { x: 490,  y: 280, v: 10 },
        { x: 740,  y: 240, v: 10 },
        { x: 1240, y: 230, v: 10 },
        { x: 1830, y: 180, v: 10 },
        { x: 2160, y: 190, v: 10 },
        { x: 2500, y: 200, v: 10 },
        { x: 2870, y: 190, v: 10 },
        { x: 3520, y: 180, v: 10 },
        // cale jos
        { x: 330, y: 425 }, { x: 530, y: 425 }, { x: 750, y: 415 },
        { x: 970, y: 415 }, { x: 1190, y: 425 },
      ],
    },
    // Nivel 4 — platforme inguste, goluri 180-230px
    {
      width: 5000,
      spawn: { x: 80, y: 430 },
      exit:  { x: 4870, y: 200 },
      platforms: [
        { x: 0,    y: 480, w: 220, h: 20 },
        { x: 380,  y: 420, w: 90,  h: 20 }, // gol 160
        { x: 620,  y: 360, w: 90,  h: 20 }, // gol 150
        { x: 880,  y: 310, w: 90,  h: 20 }, // gol 170
        { x: 1160, y: 360, w: 90,  h: 20 }, // gol 190
        { x: 1440, y: 300, w: 90,  h: 20 }, // gol 190
        { x: 1730, y: 250, w: 90,  h: 20 }, // gol 200
        { x: 2030, y: 300, w: 90,  h: 20 }, // gol 210
        { x: 2340, y: 240, w: 90,  h: 20 }, // gol 220
        { x: 2660, y: 290, w: 90,  h: 20 }, // gol 230
        { x: 2980, y: 230, w: 90,  h: 20 }, // gol 230
        { x: 3310, y: 280, w: 90,  h: 20 }, // gol 240
        { x: 3650, y: 230, w: 90,  h: 20 }, // gol 250
        { x: 3990, y: 260, w: 90,  h: 20 }, // gol 250
        { x: 4330, y: 220, w: 90,  h: 20 }, // gol 250
        { x: 4680, y: 200, w: 90,  h: 20 }, // gol 260
        { x: 4830, y: 200, w: 200, h: 20 }, // finish
      ],
      signs: [
        { x: 440, y: 380 }, { x: 940, y: 270 }, { x: 1500, y: 260 },
        { x: 2100, y: 260 }, { x: 3040, y: 190 }, { x: 4740, y: 160 },
      ],
      coins: [
        { x: 150, y: 450 }, { x: 210, y: 450 },
        { x: 410, y: 380 }, { x: 650, y: 320 }, { x: 910, y: 270 },
        { x: 1190, y: 320 }, { x: 1470, y: 260 }, { x: 1760, y: 210 },
        { x: 2060, y: 260 }, { x: 2370, y: 200 }, { x: 2690, y: 250 },
        { x: 3010, y: 190 }, { x: 3340, y: 240 }, { x: 3680, y: 190 },
        { x: 4020, y: 220 }, { x: 4360, y: 180 }, { x: 4710, y: 165 },
        // speciale
        { x: 504,  y: 280, v: 10 },
        { x: 760,  y: 240, v: 10 },
        { x: 1030, y: 220, v: 10 },
        { x: 1600, y: 200, v: 10 },
        { x: 1900, y: 210, v: 10 },
        { x: 2200, y: 170, v: 10 },
        { x: 2530, y: 200, v: 10 },
        { x: 2850, y: 180, v: 10 },
        { x: 3520, y: 180, v: 10 },
        { x: 4150, y: 170, v: 10 },
        { x: 4490, y: 160, v: 10 },
      ],
    },
    // Nivel 5 — doua drumuri lungi, goluri mari
    {
      width: 5600,
      spawn: { x: 80, y: 420 },
      exit:  { x: 5460, y: 190 },
      platforms: [
        { x: 0,    y: 480, w: 200, h: 20 },
        // Drum sus (dificil, monede speciale)
        { x: 360,  y: 400, w: 80,  h: 20 },
        { x: 580,  y: 330, w: 80,  h: 20 },
        { x: 830,  y: 280, w: 80,  h: 20 },
        { x: 1110, y: 330, w: 80,  h: 20 },
        { x: 1390, y: 270, w: 80,  h: 20 },
        { x: 1680, y: 230, w: 80,  h: 20 },
        { x: 1990, y: 270, w: 80,  h: 20 },
        { x: 2300, y: 220, w: 80,  h: 20 },
        { x: 2630, y: 260, w: 80,  h: 20 },
        { x: 2970, y: 220, w: 80,  h: 20 },
        { x: 3320, y: 250, w: 80,  h: 20 },
        { x: 3680, y: 220, w: 80,  h: 20 },
        { x: 4060, y: 240, w: 80,  h: 20 },
        { x: 4440, y: 210, w: 80,  h: 20 },
        { x: 4840, y: 220, w: 80,  h: 20 },
        { x: 5240, y: 200, w: 80,  h: 20 },
        { x: 5420, y: 190, w: 200, h: 20 }, // finish
        // Drum jos (mai lent, mai sigur)
        { x: 480,  y: 460, w: 90,  h: 20 },
        { x: 700,  y: 460, w: 90,  h: 20 },
        { x: 950,  y: 460, w: 90,  h: 20 },
        { x: 1200, y: 450, w: 90,  h: 20 },
        { x: 1460, y: 440, w: 90,  h: 20 },
      ],
      signs: [
        { x: 420, y: 360 }, { x: 890, y: 240 }, { x: 1450, y: 230 },
        { x: 2360, y: 180 }, { x: 3740, y: 180 }, { x: 5300, y: 160 },
      ],
      coins: [
        { x: 120, y: 450 }, { x: 170, y: 450 },
        { x: 390, y: 360 }, { x: 610, y: 290 }, { x: 860, y: 240 },
        { x: 1140, y: 290 }, { x: 1420, y: 230 }, { x: 1710, y: 190 },
        { x: 2020, y: 230 }, { x: 2330, y: 180 }, { x: 2660, y: 220 },
        { x: 3000, y: 180 }, { x: 3350, y: 210 }, { x: 3710, y: 180 },
        { x: 4090, y: 200 }, { x: 4470, y: 170 }, { x: 4870, y: 180 },
        { x: 5270, y: 165 },
        // speciale
        { x: 472,  y: 270, v: 10 },
        { x: 710,  y: 220, v: 10 },
        { x: 975,  y: 200, v: 10 },
        { x: 1250, y: 190, v: 10 },
        { x: 1843, y: 180, v: 10 },
        { x: 2170, y: 170, v: 10 },
        { x: 2500, y: 180, v: 10 },
        { x: 2840, y: 170, v: 10 },
        { x: 3510, y: 170, v: 10 },
        { x: 3870, y: 165, v: 10 },
        { x: 4250, y: 155, v: 10 },
        { x: 4660, y: 160, v: 10 },
        { x: 5050, y: 150, v: 10 },
        // cale jos
        { x: 510, y: 425 }, { x: 730, y: 425 }, { x: 980, y: 425 },
        { x: 1230, y: 415 }, { x: 1490, y: 405 },
      ],
    },
    // Nivel 6 — platforme mici, goluri 200-260px
    {
      width: 6000,
      spawn: { x: 80, y: 430 },
      exit:  { x: 5860, y: 190 },
      platforms: [
        { x: 0,    y: 480, w: 180, h: 20 },
        { x: 340,  y: 420, w: 75,  h: 20 },
        { x: 580,  y: 360, w: 75,  h: 20 },
        { x: 840,  y: 310, w: 75,  h: 20 },
        { x: 1120, y: 360, w: 75,  h: 20 },
        { x: 1410, y: 300, w: 75,  h: 20 },
        { x: 1710, y: 250, w: 75,  h: 20 },
        { x: 2040, y: 290, w: 75,  h: 20 },
        { x: 2380, y: 240, w: 75,  h: 20 },
        { x: 2730, y: 280, w: 75,  h: 20 },
        { x: 3090, y: 240, w: 75,  h: 20 },
        { x: 3460, y: 260, w: 75,  h: 20 },
        { x: 3840, y: 230, w: 75,  h: 20 },
        { x: 4230, y: 250, w: 75,  h: 20 },
        { x: 4630, y: 220, w: 75,  h: 20 },
        { x: 5040, y: 240, w: 75,  h: 20 },
        { x: 5460, y: 210, w: 75,  h: 20 },
        { x: 5820, y: 190, w: 200, h: 20 },
      ],
      signs: [
        { x: 400, y: 380 }, { x: 900, y: 270 }, { x: 1770, y: 210 },
        { x: 2440, y: 200 }, { x: 3920, y: 190 }, { x: 5520, y: 170 },
      ],
      coins: [
        { x: 120, y: 450 }, { x: 180, y: 450 },
        { x: 370, y: 380 }, { x: 610, y: 320 }, { x: 870, y: 270 },
        { x: 1150, y: 320 }, { x: 1440, y: 260 }, { x: 1740, y: 210 },
        { x: 2070, y: 250 }, { x: 2410, y: 200 }, { x: 2760, y: 240 },
        { x: 3120, y: 200 }, { x: 3490, y: 220 }, { x: 3870, y: 190 },
        { x: 4260, y: 210 }, { x: 4660, y: 180 }, { x: 5070, y: 200 },
        { x: 5490, y: 170 }, { x: 5850, y: 155 },
        // speciale
        { x: 461,  y: 290, v: 10 },
        { x: 716,  y: 240, v: 10 },
        { x: 1000, y: 220, v: 10 },
        { x: 1280, y: 220, v: 10 },
        { x: 1582, y: 190, v: 10 },
        { x: 1900, y: 190, v: 10 },
        { x: 2220, y: 180, v: 10 },
        { x: 2610, y: 200, v: 10 },
        { x: 2970, y: 180, v: 10 },
        { x: 3330, y: 190, v: 10 },
        { x: 3720, y: 170, v: 10 },
        { x: 4110, y: 170, v: 10 },
        { x: 4510, y: 160, v: 10 },
        { x: 4920, y: 170, v: 10 },
        { x: 5260, y: 155, v: 10 },
      ],
    },
    // Nivel 7 — zigzag rapid, goluri alternante
    {
      width: 6500,
      spawn: { x: 80, y: 430 },
      exit:  { x: 6360, y: 180 },
      platforms: [
        { x: 0,    y: 480, w: 160, h: 20 },
        { x: 310,  y: 420, w: 70,  h: 20 },
        { x: 540,  y: 360, w: 70,  h: 20 },
        { x: 790,  y: 420, w: 70,  h: 20 },
        { x: 1040, y: 360, w: 70,  h: 20 },
        { x: 1300, y: 300, w: 70,  h: 20 },
        { x: 1570, y: 360, w: 70,  h: 20 },
        { x: 1850, y: 300, w: 70,  h: 20 },
        { x: 2130, y: 250, w: 70,  h: 20 },
        { x: 2420, y: 300, w: 70,  h: 20 },
        { x: 2720, y: 250, w: 70,  h: 20 },
        { x: 3030, y: 210, w: 70,  h: 20 },
        { x: 3340, y: 260, w: 70,  h: 20 },
        { x: 3670, y: 220, w: 70,  h: 20 },
        { x: 4010, y: 260, w: 70,  h: 20 },
        { x: 4360, y: 220, w: 70,  h: 20 },
        { x: 4720, y: 250, w: 70,  h: 20 },
        { x: 5090, y: 210, w: 70,  h: 20 },
        { x: 5470, y: 240, w: 70,  h: 20 },
        { x: 5860, y: 200, w: 70,  h: 20 },
        { x: 6230, y: 180, w: 70,  h: 20 },
        { x: 6320, y: 180, w: 200, h: 20 },
      ],
      signs: [
        { x: 600, y: 320 }, { x: 1110, y: 320 }, { x: 1910, y: 260 },
        { x: 2790, y: 210 }, { x: 3740, y: 180 }, { x: 5150, y: 170 },
      ],
      coins: [
        { x: 120, y: 450 },
        { x: 340, y: 380 }, { x: 570, y: 320 }, { x: 820, y: 380 },
        { x: 1070, y: 320 }, { x: 1330, y: 260 }, { x: 1600, y: 320 },
        { x: 1880, y: 260 }, { x: 2160, y: 210 }, { x: 2450, y: 260 },
        { x: 2750, y: 210 }, { x: 3060, y: 170 }, { x: 3370, y: 220 },
        { x: 3700, y: 180 }, { x: 4040, y: 220 }, { x: 4390, y: 180 },
        { x: 4750, y: 210 }, { x: 5120, y: 170 }, { x: 5500, y: 200 },
        { x: 5890, y: 165 }, { x: 6260, y: 145 },
        // speciale
        { x: 435,  y: 290, v: 10 },
        { x: 665,  y: 280, v: 10 },
        { x: 916,  y: 310, v: 10 },
        { x: 1175, y: 240, v: 10 },
        { x: 1440, y: 230, v: 10 },
        { x: 1720, y: 240, v: 10 },
        { x: 2010, y: 220, v: 10 },
        { x: 2295, y: 200, v: 10 },
        { x: 2600, y: 200, v: 10 },
        { x: 2910, y: 180, v: 10 },
        { x: 3220, y: 175, v: 10 },
        { x: 3560, y: 165, v: 10 },
        { x: 3900, y: 185, v: 10 },
        { x: 4260, y: 160, v: 10 },
        { x: 4640, y: 170, v: 10 },
        { x: 5010, y: 155, v: 10 },
        { x: 5380, y: 170, v: 10 },
        { x: 5740, y: 155, v: 10 },
      ],
    },
    // Nivel 8 — platforme foarte inguste, goluri mari
    {
      width: 7000,
      spawn: { x: 80, y: 430 },
      exit:  { x: 6860, y: 175 },
      platforms: [
        { x: 0,    y: 480, w: 150, h: 20 },
        { x: 310,  y: 430, w: 65,  h: 20 },
        { x: 560,  y: 370, w: 65,  h: 20 },
        { x: 830,  y: 320, w: 65,  h: 20 },
        { x: 1120, y: 280, w: 65,  h: 20 },
        { x: 1430, y: 330, w: 65,  h: 20 },
        { x: 1760, y: 270, w: 65,  h: 20 },
        { x: 2110, y: 230, w: 65,  h: 20 },
        { x: 2480, y: 270, w: 65,  h: 20 },
        { x: 2870, y: 230, w: 65,  h: 20 },
        { x: 3270, y: 260, w: 65,  h: 20 },
        { x: 3690, y: 230, w: 65,  h: 20 },
        { x: 4130, y: 250, w: 65,  h: 20 },
        { x: 4590, y: 220, w: 65,  h: 20 },
        { x: 5070, y: 240, w: 65,  h: 20 },
        { x: 5570, y: 210, w: 65,  h: 20 },
        { x: 6090, y: 230, w: 65,  h: 20 },
        { x: 6630, y: 200, w: 65,  h: 20 },
        { x: 6820, y: 175, w: 200, h: 20 },
      ],
      signs: [
        { x: 590, y: 330 }, { x: 1180, y: 240 }, { x: 1820, y: 230 },
        { x: 2540, y: 230 }, { x: 3750, y: 190 }, { x: 5630, y: 170 },
      ],
      coins: [
        { x: 130, y: 450 }, { x: 200, y: 450 },
        { x: 340, y: 390 }, { x: 590, y: 330 }, { x: 860, y: 280 },
        { x: 1150, y: 240 }, { x: 1460, y: 290 }, { x: 1790, y: 230 },
        { x: 2140, y: 190 }, { x: 2510, y: 230 }, { x: 2900, y: 190 },
        { x: 3300, y: 220 }, { x: 3720, y: 190 }, { x: 4160, y: 210 },
        { x: 4620, y: 180 }, { x: 5100, y: 200 }, { x: 5600, y: 170 },
        { x: 6120, y: 190 }, { x: 6660, y: 165 },
        // speciale
        { x: 435,  y: 300, v: 10 },
        { x: 700,  y: 260, v: 10 },
        { x: 980,  y: 230, v: 10 },
        { x: 1285, y: 230, v: 10 },
        { x: 1600, y: 220, v: 10 },
        { x: 1940, y: 200, v: 10 },
        { x: 2300, y: 185, v: 10 },
        { x: 2690, y: 195, v: 10 },
        { x: 3090, y: 195, v: 10 },
        { x: 3510, y: 185, v: 10 },
        { x: 3960, y: 185, v: 10 },
        { x: 4420, y: 170, v: 10 },
        { x: 4900, y: 175, v: 10 },
        { x: 5400, y: 160, v: 10 },
        { x: 5900, y: 170, v: 10 },
        { x: 6420, y: 155, v: 10 },
      ],
    },
    // Nivel 9 — furtuna, doua drumuri complet diferite
    {
      width: 7500,
      spawn: { x: 80, y: 430 },
      exit:  { x: 7360, y: 165 },
      platforms: [
        { x: 0,    y: 480, w: 140, h: 20 },
        // Drum A — zig-zag sus
        { x: 300,  y: 400, w: 60,  h: 20 },
        { x: 530,  y: 330, w: 60,  h: 20 },
        { x: 780,  y: 390, w: 60,  h: 20 },
        { x: 1040, y: 320, w: 60,  h: 20 },
        { x: 1310, y: 270, w: 60,  h: 20 },
        { x: 1600, y: 320, w: 60,  h: 20 },
        { x: 1900, y: 260, w: 60,  h: 20 },
        { x: 2220, y: 220, w: 60,  h: 20 },
        { x: 2560, y: 260, w: 60,  h: 20 },
        { x: 2920, y: 220, w: 60,  h: 20 },
        { x: 3300, y: 250, w: 60,  h: 20 },
        { x: 3700, y: 220, w: 60,  h: 20 },
        { x: 4120, y: 240, w: 60,  h: 20 },
        { x: 4570, y: 210, w: 60,  h: 20 },
        { x: 5050, y: 230, w: 60,  h: 20 },
        { x: 5560, y: 200, w: 60,  h: 20 },
        { x: 6100, y: 220, w: 60,  h: 20 },
        { x: 6680, y: 190, w: 60,  h: 20 },
        // Drum B — de jos (mai lent dar cu mai multe monede de 5)
        { x: 420,  y: 460, w: 80,  h: 20 },
        { x: 680,  y: 460, w: 80,  h: 20 },
        { x: 950,  y: 450, w: 80,  h: 20 },
        { x: 1220, y: 445, w: 80,  h: 20 },
        { x: 1510, y: 440, w: 80,  h: 20 },
        { x: 7300, y: 165, w: 200, h: 20 }, // finish
      ],
      signs: [
        { x: 590, y: 290 }, { x: 1100, y: 280 }, { x: 1960, y: 220 },
        { x: 2980, y: 180 }, { x: 4180, y: 200 }, { x: 5620, y: 160 },
      ],
      coins: [
        { x: 120, y: 450 }, { x: 200, y: 450 },
        { x: 330, y: 360 }, { x: 560, y: 290 }, { x: 810, y: 350 },
        { x: 1070, y: 280 }, { x: 1340, y: 230 }, { x: 1630, y: 280 },
        { x: 1930, y: 220 }, { x: 2250, y: 180 }, { x: 2590, y: 220 },
        { x: 2950, y: 180 }, { x: 3330, y: 210 }, { x: 3730, y: 180 },
        { x: 4150, y: 200 }, { x: 4600, y: 170 }, { x: 5080, y: 190 },
        { x: 5590, y: 160 }, { x: 6130, y: 180 }, { x: 6710, y: 155 },
        // speciale
        { x: 415,  y: 280, v: 10 },
        { x: 660,  y: 250, v: 10 },
        { x: 915,  y: 270, v: 10 },
        { x: 1180, y: 230, v: 10 },
        { x: 1460, y: 220, v: 10 },
        { x: 1760, y: 210, v: 10 },
        { x: 2080, y: 190, v: 10 },
        { x: 2400, y: 185, v: 10 },
        { x: 2750, y: 180, v: 10 },
        { x: 3120, y: 190, v: 10 },
        { x: 3520, y: 175, v: 10 },
        { x: 3940, y: 185, v: 10 },
        { x: 4400, y: 165, v: 10 },
        { x: 4900, y: 175, v: 10 },
        { x: 5400, y: 155, v: 10 },
        { x: 5930, y: 165, v: 10 },
        { x: 6500, y: 155, v: 10 },
        // cale B jos
        { x: 450, y: 425 }, { x: 710, y: 425 }, { x: 980, y: 415 },
        { x: 1250, y: 410 }, { x: 1540, y: 405 },
      ],
    },
    // Nivel 10 — final epic, goluri uriase, necesita aripi
    {
      width: 8000,
      spawn: { x: 80, y: 430 },
      exit:  { x: 7840, y: 155 },
      platforms: [
        { x: 0,    y: 480, w: 160, h: 20 },
        { x: 320,  y: 420, w: 60,  h: 20 },
        { x: 580,  y: 360, w: 60,  h: 20 },
        { x: 870,  y: 310, w: 60,  h: 20 },
        { x: 1200, y: 360, w: 60,  h: 20 },
        { x: 1540, y: 300, w: 60,  h: 20 },
        { x: 1910, y: 250, w: 60,  h: 20 },
        { x: 2310, y: 290, w: 60,  h: 20 },
        { x: 2750, y: 240, w: 60,  h: 20 },
        { x: 3230, y: 270, w: 60,  h: 20 },
        { x: 3750, y: 230, w: 60,  h: 20 },
        { x: 4320, y: 250, w: 60,  h: 20 },
        { x: 4940, y: 220, w: 60,  h: 20 },
        { x: 5600, y: 240, w: 60,  h: 20 },
        { x: 6310, y: 210, w: 60,  h: 20 },
        { x: 7080, y: 230, w: 60,  h: 20 },
        { x: 7480, y: 200, w: 60,  h: 20 },
        { x: 7720, y: 155, w: 60,  h: 20 },
        { x: 7800, y: 155, w: 250, h: 20 },
        // platform intermediara pentru nivel 10
        { x: 450,  y: 460, w: 100, h: 20 },
        { x: 720,  y: 450, w: 100, h: 20 },
        { x: 1000, y: 450, w: 100, h: 20 },
      ],
      signs: [
        { x: 640, y: 320 }, { x: 1260, y: 320 }, { x: 1970, y: 210 },
        { x: 2810, y: 200 }, { x: 3810, y: 190 }, { x: 5660, y: 200 },
        { x: 7140, y: 190 },
      ],
      coins: [
        { x: 120, y: 450 }, { x: 200, y: 450 },
        { x: 350, y: 380 }, { x: 610, y: 320 }, { x: 900, y: 270 },
        { x: 1230, y: 320 }, { x: 1570, y: 260 }, { x: 1940, y: 210 },
        { x: 2340, y: 250 }, { x: 2780, y: 200 }, { x: 3260, y: 230 },
        { x: 3780, y: 190 }, { x: 4350, y: 210 }, { x: 4970, y: 180 },
        { x: 5630, y: 200 }, { x: 6340, y: 170 }, { x: 7110, y: 190 },
        { x: 7510, y: 165 },
        // speciale (monede greu accesibile)
        { x: 450,  y: 300, v: 10 },
        { x: 730,  y: 260, v: 10 },
        { x: 1040, y: 230, v: 10 },
        { x: 1380, y: 240, v: 10 },
        { x: 1730, y: 210, v: 10 },
        { x: 2120, y: 200, v: 10 },
        { x: 2540, y: 200, v: 10 },
        { x: 3000, y: 190, v: 10 },
        { x: 3510, y: 185, v: 10 },
        { x: 4060, y: 190, v: 10 },
        { x: 4720, y: 175, v: 10 },
        { x: 5300, y: 185, v: 10 },
        { x: 5990, y: 165, v: 10 },
        { x: 6710, y: 175, v: 10 },
        { x: 7300, y: 160, v: 10 },
        { x: 7640, y: 140, v: 10 },
        // cale jos nivel 10
        { x: 480, y: 425 }, { x: 750, y: 415 }, { x: 1030, y: 415 },
      ],
    },
  ];
} // end _unused

// ─── START GAME ─────────────────────────────────────────────
function startGame(charId) {
  showScreen('screen-game');
  const canvas = document.getElementById('game-canvas');

  gs = {
    charId: charId,
    levels: makeLevels((selectedWorld || WORLDS[0]).id),
    levelIdx: 0,
    lives: 4,
    score: 0,
    over: false,
    won: false,
    keys: {},
    player: null,
    cameraX: 0,
    animFrame: 0,
    frameCount: 0,
  };
  shopState.coins = shopState.coins || 0;

  resizeCanvas(canvas);
  window.addEventListener('resize', () => resizeCanvas(canvas));
  loadLevel();
  bindKeys();
  _loopAccum = 0; _loopLastTime = performance.now();
  requestAnimationFrame(gameLoop);
}

function resizeCanvas(canvas) {
  const hud = document.querySelector('.hud');
  const hint = document.querySelector('.controls-hint');
  const hudH = hud ? hud.offsetHeight : 40;
  const hintH = hint ? hint.offsetHeight : 32;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight - hudH - hintH;
}

function loadLevel() {
  const lvl = gs.levels[gs.levelIdx];
  lvl.signs.forEach(s => { s.hit = false; });
  lvl.coins.forEach(c => { c.collected = false; });

  gs.player = {
    x: lvl.spawn.x,
    y: lvl.spawn.y,
    w: 28,
    h: 56,
    vx: 0,
    vy: 0,
    onGround: false,
    facing: 1,
    jumpsLeft: (shopState.equipped[gs.charId] || []).includes('top_wings') ? 3 : 2,
  };
  gs.cameraX = 0;
  gs.checkpointX = lvl.spawn.x;
  gs.checkpointY = lvl.spawn.y;

  document.getElementById('hud-level').textContent = `Nivel ${gs.levelIdx + 1} / 10`;
  updateHUD();
}

function updateHUD() {
  document.getElementById('hud-lives').textContent = '❤️'.repeat(gs.lives) + '🖤'.repeat(Math.max(0, 4 - gs.lives));
  document.getElementById('hud-score').textContent = gs.score;
  document.getElementById('hud-coins').textContent = shopState.coins;
}

// ─── INPUT ──────────────────────────────────────────────────
let _keysBound = false;
function bindKeys() {
  if (_keysBound) return; // ruleaza O SINGURA DATA
  _keysBound = true;

  window.addEventListener('keydown', e => {
    if (e.repeat) return;
    if (gs.keys) gs.keys[e.key] = true;
    if (e.key === ' ') {
      e.preventDefault();
      if (gs.keys) gs.keys['_jumpPressed'] = true;
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      tryHitSign();
    }
  });
  window.addEventListener('keyup', e => { if (gs.keys) gs.keys[e.key] = false; });
  // Sterge tastele blocate cand fereastra pierde focusul
  window.addEventListener('blur', () => { if (gs.keys) gs.keys = {}; });

  // Touch controls
  function setupTouchBtn(id, pressKey, onPress) {
    const btn = document.getElementById(id);
    if (!btn) return;
    const down = e => { e.preventDefault(); btn.classList.add('pressed'); if (pressKey) gs.keys[pressKey] = true; if (onPress) onPress(); };
    const up   = e => { e.preventDefault(); btn.classList.remove('pressed'); if (pressKey) gs.keys[pressKey] = false; };
    btn.addEventListener('touchstart', down, { passive: false });
    btn.addEventListener('touchend',   up,   { passive: false });
    btn.addEventListener('touchcancel',up,   { passive: false });
    btn.addEventListener('mousedown',  down);
    btn.addEventListener('mouseup',    up);
  }
  setupTouchBtn('touch-left',  '1');
  setupTouchBtn('touch-right', '2');
  setupTouchBtn('touch-jump',  ' ', () => { gs.keys['_jumpPressed'] = true; });
  setupTouchBtn('touch-hit',   null, () => { tryHitSign(); });
}

function tryHitSign() {
  const lvl = gs.levels[gs.levelIdx];
  const p = gs.player;
  const range = 70;
  lvl.signs.forEach(sign => {
    if (sign.hit) return;
    const dx = (sign.x + 20) - (p.x + p.w / 2);
    const dy = (sign.y + 20) - (p.y + p.h / 2);
    if (Math.abs(dx) < range && Math.abs(dy) < range) {
      sign.hit = true;
      gs.score += 10;
      updateHUD();
    }
  });
}

// ─── GAME LOOP (timestep fix — viteza constanta indiferent de FPS) ──
const FIXED_STEP = 1000 / 60; // 16.67ms = 60fps
let _loopLastTime = 0;
let _loopAccum = 0;

function gameLoop(timestamp) {
  if (gs.over || gs.won) return;
  const canvas = document.getElementById('game-canvas');
  const ctx = canvas.getContext('2d');

  const dt = Math.min(timestamp - _loopLastTime, 50); // max 50ms (tab in background)
  _loopLastTime = timestamp;
  _loopAccum += dt;

  // ruleaza update() exact cat trebuie pentru a mentine 60fps logic
  while (_loopAccum >= FIXED_STEP) {
    update();
    _loopAccum -= FIXED_STEP;
  }

  render(ctx, canvas);
  requestAnimationFrame(gameLoop);
}

function update() {
  const p = gs.player;
  const lvl = gs.levels[gs.levelIdx];
  gs.frameCount++;

  // Horizontal movement
  const running = gs.keys['Shift'];
  const spd = WALK_SPEED * (running ? RUN_MULT : 1);

  p.vx = 0;
  if (gs.keys['1']) { p.vx = -spd; p.facing = -1; }
  if (gs.keys['2']) { p.vx =  spd; p.facing =  1; }

  // Jump (dublu salt)
  if (gs.keys['_jumpPressed']) {
    if (p.jumpsLeft > 0) {
      p.vy = JUMP_FORCE;
      p.jumpsLeft--;
      p.onGround = false;
    }
    gs.keys['_jumpPressed'] = false;
  }

  // Gravity
  p.vy += GRAVITY;
  if (p.vy > 18) p.vy = 18;

  // Aripi — planare cand tii apasat saritura in aer
  const hasWings = (shopState.equipped[gs.charId] || []).includes('top_wings');
  if (hasWings && !p.onGround && gs.keys[' '] && p.vy > 1.5) {
    p.vy = Math.min(p.vy, 1.5);
  }

  // Move X
  p.x += p.vx;
  p.x = Math.max(0, Math.min(p.x, lvl.width - p.w));

  // Exit platform (solid, land on top of it)
  const ex = lvl.exit;
  const exitPlatform = { x: ex.x, y: ex.y, w: 80, h: 20 };
  const allPlatforms = [...lvl.platforms, exitPlatform];

  // Collide X with platforms
  for (const pl of allPlatforms) {
    if (rectsOverlap(p.x, p.y, p.w, p.h, pl.x, pl.y, pl.w, pl.h)) {
      if (p.vx > 0) p.x = pl.x - p.w;
      if (p.vx < 0) p.x = pl.x + pl.w;
      p.vx = 0;
    }
  }

  // Move Y
  p.y += p.vy;
  p.onGround = false;

  // Collide Y with platforms
  for (const pl of allPlatforms) {
    if (rectsOverlap(p.x, p.y, p.w, p.h, pl.x, pl.y, pl.w, pl.h)) {
      if (p.vy > 0) { p.y = pl.y - p.h; p.onGround = true; p.jumpsLeft = (shopState.equipped[gs.charId] || []).includes('top_wings') ? 3 : 2; if (p.x > gs.checkpointX) { gs.checkpointX = p.x; gs.checkpointY = p.y; } }
      if (p.vy < 0) { p.y = pl.y + pl.h; }
      p.vy = 0;
    }
  }

  // Collect coins
  const lvl2 = gs.levels[gs.levelIdx];
  for (const coin of lvl2.coins) {
    if (coin.collected) continue;
    if (p.x + p.w > coin.x && p.x < coin.x + 18 &&
        p.y + p.h > coin.y && p.y < coin.y + 18) {
      coin.collected = true;
      shopState.coins += (coin.v || 5);
      updateHUD();
    }
  }

  // Fell off screen
  const canvas = document.getElementById('game-canvas');
  if (p.y > canvas.height + 100) {
    gs.lives--;
    updateHUD();
    if (gs.lives <= 0) {
      gameOver();
      return;
    }
    // Respawn la checkpoint
    p.x = gs.checkpointX;
    p.y = gs.checkpointY - 60;
    p.vx = 0; p.vy = 0;
  }

  // Reached exit — player must LAND on the exit rooftop platform
  if (p.onGround &&
      p.x + p.w > ex.x + 8 && p.x < ex.x + 72 &&
      Math.abs((p.y + p.h) - ex.y) < 4) {
    if (gs.levelIdx < gs.levels.length - 1) {
      gs.levelIdx++;
      gs.lives = 4;
      loadLevel();
    } else {
      win();
    }
    return;
  }

  // Camera
  const canvas2 = document.getElementById('game-canvas');
  const targetCam = p.x - canvas2.width * 0.35;
  gs.cameraX = Math.max(0, Math.min(targetCam, lvl.width - canvas2.width));

  // Anim — only walk-cycle when moving, idle (frame=0) when stopped
  if (p.vx !== 0) gs.animFrame = gs.frameCount;
  else gs.animFrame = 0;
}

function rectsOverlap(ax, ay, aw, ah, bx, by, bw, bh) {
  return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
}

// ─── RENDER ─────────────────────────────────────────────────
function render(ctx, canvas) {
  const W = canvas.width, H = canvas.height;
  const lvl = gs.levels[gs.levelIdx];
  const cam = gs.cameraX;

  // Sky (world-themed)
  const world = selectedWorld || WORLDS[0];
  const sky = ctx.createLinearGradient(0, 0, 0, H);
  sky.addColorStop(0, world.sky[0]);
  sky.addColorStop(0.7, world.sky[1]);
  sky.addColorStop(1, world.sky[2]);
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, W, H);

  // World background (parallax)
  drawWorldBg(ctx, W, H, cam * 0.3);

  // Platforms
  for (const pl of lvl.platforms) {
    const px = pl.x - cam;
    if (px > W + 20 || px + pl.w < -20) continue;
    // Shadow
    const D = 9; // adâncime 3D
    // ── Față de jos (3D bottom face) ──────────────────────
    ctx.beginPath();
    ctx.moveTo(px,          pl.y + pl.h);
    ctx.lineTo(px + D,      pl.y + pl.h + D);
    ctx.lineTo(px + pl.w + D, pl.y + pl.h + D);
    ctx.lineTo(px + pl.w,   pl.y + pl.h);
    ctx.closePath();
    ctx.fillStyle = world.platColor;
    ctx.fill();
    ctx.fillStyle = 'rgba(0,0,0,0.45)';
    ctx.fill();

    // ── Față dreapta (3D right face) ──────────────────────
    ctx.beginPath();
    ctx.moveTo(px + pl.w,   pl.y);
    ctx.lineTo(px + pl.w + D, pl.y + D);
    ctx.lineTo(px + pl.w + D, pl.y + pl.h + D);
    ctx.lineTo(px + pl.w,   pl.y + pl.h);
    ctx.closePath();
    ctx.fillStyle = world.platColor;
    ctx.fill();
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.fill();

    // ── Față sus / top (suprafața principală) ─────────────
    ctx.fillStyle = world.platColor;
    ctx.beginPath(); ctx.roundRect(px, pl.y, pl.w, pl.h, [6,6,0,0]); ctx.fill();
    // Gradient de lumină pe suprafață
    const topGrad = ctx.createLinearGradient(px, pl.y, px, pl.y + pl.h);
    topGrad.addColorStop(0, 'rgba(255,255,255,0.18)');
    topGrad.addColorStop(1, 'rgba(0,0,0,0.08)');
    ctx.fillStyle = topGrad;
    ctx.beginPath(); ctx.roundRect(px, pl.y, pl.w, pl.h, [6,6,0,0]); ctx.fill();
    // Highlight stânga (lumina laterală)
    ctx.fillStyle = 'rgba(255,255,255,0.12)';
    ctx.beginPath(); ctx.roundRect(px, pl.y, 6, pl.h, [6,0,0,0]); ctx.fill();
    // Top highlight (dungă colorată)
    ctx.fillStyle = world.platTop;
    ctx.beginPath(); ctx.roundRect(px, pl.y, pl.w, 5, [6,6,0,0]); ctx.fill();

    // ── Decorații specifice lumii ────────────────────────
    if (world.id === 'jungla' || world.id === 'munte') {
      // Iarbă
      ctx.fillStyle = '#3a9e28';
      ctx.beginPath(); ctx.roundRect(px, pl.y, pl.w, 5, [6,6,0,0]); ctx.fill();
      for (let gx = px + 6; gx < px + pl.w - 4; gx += 9) {
        const h2 = 4 + (gx % 5);
        ctx.fillStyle = gx % 18 < 9 ? '#4ab830' : '#2d8a1e';
        ctx.beginPath(); ctx.moveTo(gx, pl.y); ctx.lineTo(gx + 3, pl.y - h2); ctx.lineTo(gx + 6, pl.y); ctx.fill();
      }
    } else if (world.id === 'iarna') {
      // Zăpadă
      ctx.fillStyle = '#e8f4ff';
      ctx.beginPath(); ctx.roundRect(px, pl.y - 3, pl.w, 8, [4,4,0,0]); ctx.fill();
      // Cristale de gheață mici
      for (let gx = px + 10; gx < px + pl.w - 6; gx += 22) {
        ctx.fillStyle = 'rgba(180,230,255,0.8)';
        ctx.beginPath(); ctx.moveTo(gx, pl.y - 3);
        ctx.lineTo(gx + 3, pl.y - 8); ctx.lineTo(gx + 6, pl.y - 3); ctx.fill();
      }
    } else if (world.id === 'plaja') {
      // Nisip cu valuri
      ctx.fillStyle = '#e8c070';
      ctx.beginPath(); ctx.roundRect(px, pl.y, pl.w, 5, [6,6,0,0]); ctx.fill();
      ctx.strokeStyle = 'rgba(200,160,60,0.5)'; ctx.lineWidth = 1.5;
      for (let gx = px; gx < px + pl.w; gx += 20) {
        ctx.beginPath(); ctx.arc(gx + 10, pl.y + 2, 8, Math.PI, 0); ctx.stroke();
      }
    } else if (world.id === 'spatiu') {
      // Glow neon violet
      ctx.save(); ctx.shadowColor = world.platTop; ctx.shadowBlur = 14;
      ctx.strokeStyle = world.platTop; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.roundRect(px + 1, pl.y + 1, pl.w - 2, pl.h - 2, 5); ctx.stroke();
      ctx.shadowBlur = 0; ctx.restore();
    } else if (world.id === 'castel') {
      // Pietre de castel
      ctx.strokeStyle = 'rgba(0,0,0,0.3)'; ctx.lineWidth = 1;
      for (let gx = px; gx < px + pl.w; gx += 24) {
        ctx.beginPath(); ctx.roundRect(gx + 1, pl.y + 1, 22, pl.h - 2, 2); ctx.stroke();
      }
      // Merloane (ziduri castel)
      ctx.fillStyle = world.platColor;
      for (let gx = px + 4; gx < px + pl.w - 4; gx += 16) {
        ctx.beginPath(); ctx.roundRect(gx, pl.y - 7, 10, 8, [2,2,0,0]); ctx.fill();
      }
    } else if (world.id === 'subapa') {
      // Corali și alge
      ctx.fillStyle = 'rgba(0,200,180,0.25)';
      ctx.beginPath(); ctx.roundRect(px, pl.y, pl.w, 5, [6,6,0,0]); ctx.fill();
      for (let gx = px + 8; gx < px + pl.w - 4; gx += 18) {
        ctx.strokeStyle = gx % 36 < 18 ? 'rgba(255,100,100,0.7)' : 'rgba(100,220,200,0.7)';
        ctx.lineWidth = 3; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(gx, pl.y); ctx.quadraticCurveTo(gx + 5, pl.y - 8, gx + 2, pl.y - 14); ctx.stroke();
      }
    } else if (world.id === 'curcubeu') {
      // Dungă curcubeu pe top
      const colors = ['#ff6b6b','#ff9f43','#f7c948','#2ecc71','#4facfe','#a29bfe'];
      const sw = pl.w / colors.length;
      for (let ci = 0; ci < colors.length; ci++) {
        ctx.fillStyle = colors[ci];
        const rx = px + ci * sw;
        const rad = ci === 0 ? [6,0,0,0] : ci === colors.length-1 ? [0,6,0,0] : 0;
        ctx.beginPath(); ctx.roundRect(rx, pl.y, sw, 5, rad); ctx.fill();
      }
    } else {
      // Default: linii verticale discrete
      ctx.strokeStyle = 'rgba(0,0,0,0.12)'; ctx.lineWidth = 1;
      for (let gx = px + 32; gx < px + pl.w; gx += 32) {
        ctx.beginPath(); ctx.moveTo(gx, pl.y + 5); ctx.lineTo(gx, pl.y + pl.h); ctx.stroke();
      }
    }
  }

  // Coins
  for (const coin of lvl.coins) {
    if (coin.collected) continue;
    const cx = coin.x - cam;
    const special = (coin.v === 10);
    const r = special ? 12 : 9;
    const cy = coin.y + r;
    if (cx < -40 || cx > W + 40) continue;

    if (special) {
      // Moneda speciala (10) — steluta aurie cu stralucire
      ctx.save();
      ctx.shadowColor = '#ffdd00';
      ctx.shadowBlur = 14;
      // Outer glow
      ctx.fillStyle = 'rgba(255,220,0,0.3)';
      ctx.beginPath(); ctx.arc(cx + r, cy, r + 5, 0, Math.PI * 2); ctx.fill();
      // Corp
      const sg = ctx.createRadialGradient(cx + r - 3, cy - 3, 1, cx + r, cy, r);
      sg.addColorStop(0, '#fff176');
      sg.addColorStop(0.5, '#ffd600');
      sg.addColorStop(1, '#e65100');
      ctx.fillStyle = sg;
      ctx.beginPath(); ctx.arc(cx + r, cy, r, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#b8860b'; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(cx + r, cy, r, 0, Math.PI * 2); ctx.stroke();
      // Stea mica in mijloc
      ctx.fillStyle = 'rgba(255,255,255,0.7)';
      ctx.beginPath();
      for (let k = 0; k < 5; k++) {
        const a = k * Math.PI * 2 / 5 - Math.PI / 2;
        const a2 = a + Math.PI / 5;
        if (k === 0) ctx.moveTo(cx + r + Math.cos(a)*5, cy + Math.sin(a)*5);
        else ctx.lineTo(cx + r + Math.cos(a)*5, cy + Math.sin(a)*5);
        ctx.lineTo(cx + r + Math.cos(a2)*2.5, cy + Math.sin(a2)*2.5);
      }
      ctx.closePath(); ctx.fill();
      ctx.restore();
      // Valoare deasupra monedei speciale
      ctx.save();
      ctx.fillStyle = '#fff'; ctx.strokeStyle = '#b8600a'; ctx.lineWidth = 2;
      ctx.font = 'bold 10px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.strokeText('10', cx + r, cy - r - 6);
      ctx.fillText('10', cx + r, cy - r - 6);
      ctx.restore();
    } else {
      // Moneda normala (5) — galbena simpla
      ctx.fillStyle = 'rgba(255,215,0,0.25)';
      ctx.beginPath(); ctx.arc(cx + r, cy, r + 4, 0, Math.PI * 2); ctx.fill();
      const cg = ctx.createRadialGradient(cx + r - 2, cy - 2, 1, cx + r, cy, r);
      cg.addColorStop(0, '#ffe566'); cg.addColorStop(1, '#e6a800');
      ctx.fillStyle = cg;
      ctx.beginPath(); ctx.arc(cx + r, cy, r, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.beginPath(); ctx.ellipse(cx + r - 2, cy - 3, 3, 2, -0.4, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#cc8800'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(cx + r, cy, r, 0, Math.PI * 2); ctx.stroke();
      // Valoare in centrul monedei
      ctx.save();
      ctx.fillStyle = '#7a3d00'; ctx.font = 'bold 9px sans-serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('5', cx + r, cy + 1);
      ctx.restore();
    }
  }

  // Signs
  for (const sign of lvl.signs) {
    const sx = sign.x - cam;
    if (sx < -60 || sx > W + 60) continue;
    drawSign(ctx, sx, sign.y, sign.hit);
  }

  // Exit gate
  drawExit(ctx, lvl.exit.x - cam, lvl.exit.y);

  // Player
  const p = gs.player;
  const px = p.x - cam;
  ctx.save();
  if (p.facing === -1) {
    ctx.translate(px + p.w / 2, p.y + p.h);
    ctx.scale(-1, 1);
    drawCharacter(ctx, gs.charId, 0, 0, 1, gs.animFrame);
  } else {
    drawCharacter(ctx, gs.charId, px + p.w / 2, p.y + p.h, 1, gs.animFrame);
  }
  ctx.restore();
}

function drawBgBuildings(ctx, W, H, offset) {
  const buildings = [
    { x: 50,   w: 90,  h: 200 }, { x: 160,  w: 70,  h: 160 }, { x: 250,  w: 100, h: 240 },
    { x: 380,  w: 80,  h: 180 }, { x: 480,  w: 110, h: 260 }, { x: 620,  w: 75,  h: 190 },
    { x: 720,  w: 90,  h: 220 }, { x: 840,  w: 65,  h: 150 }, { x: 930,  w: 100, h: 280 },
    { x: 1060, w: 80,  h: 200 }, { x: 1170, w: 95,  h: 240 }, { x: 1290, w: 70,  h: 170 },
  ];
  const totalW = 1400;
  for (const b of buildings) {
    const bx = ((b.x - offset % totalW + totalW) % totalW) - 20;
    const by = H - b.h - 30;
    ctx.fillStyle = 'rgba(100,150,200,0.25)';
    ctx.fillRect(bx, by, b.w, b.h);
    // windows
    ctx.fillStyle = 'rgba(255,240,150,0.2)';
    const cols = Math.floor(b.w / 14), rows = Math.floor(b.h / 18);
    for (let r = 0; r < rows; r++)
      for (let c = 0; c < cols; c++)
        if ((r + c) % 3 !== 0) ctx.fillRect(bx + 6 + c * 14, by + 6 + r * 18, 7, 9);
  }
}

// ─── WORLD BACKGROUNDS ──────────────────────────────────────
function drawWorldBg(ctx, W, H, offset) {
  const world = selectedWorld || WORLDS[0];
  switch (world.id) {
    case 'oras':     _bgCity(ctx, W, H, offset);       break;
    case 'japonia':  _bgJapan(ctx, W, H, offset);      break;
    case 'jungla':   _bgJungle(ctx, W, H, offset);     break;
    case 'newyork':  _bgNY(ctx, W, H, offset);         break;
    case 'plaja':    _bgBeach(ctx, W, H, offset);      break;
    case 'munte':    _bgMountain(ctx, W, H, offset);   break;
    case 'spatiu':   _bgSpace(ctx, W, H, offset);      break;
    case 'iarna':    _bgWinter(ctx, W, H, offset);     break;
    case 'apus':     _bgSunset(ctx, W, H, offset);     break;
    case 'subapa':   _bgUnderwater(ctx, W, H, offset); break;
    case 'castel':   _bgCastle(ctx, W, H, offset);     break;
    case 'curcubeu': _bgRainbow(ctx, W, H, offset);    break;
  }
}

function _bgCity(ctx, W, H, offset) {
  const t = Date.now() * 0.001;
  // ── Strat 1: cladiri departe (parallax lent) ──────────────
  const far = [
    {x:30,w:80,h:160,c:'#5a7ea0'},{x:130,w:60,h:130,c:'#4a6e90'},{x:210,w:90,h:190,c:'#3d6080'},
    {x:320,w:70,h:150,c:'#4e7090'},{x:410,w:100,h:210,c:'#3a5878'},{x:530,w:65,h:140,c:'#5080a0'},
    {x:620,w:85,h:180,c:'#446080'},{x:730,w:110,h:200,c:'#3a5870'},{x:860,w:70,h:160,c:'#4a6888'},
    {x:950,w:95,h:220,c:'#385678'},{x:1070,w:80,h:175,c:'#4c7090'},{x:1180,w:60,h:140,c:'#3e6080'},
  ];
  const totalW = 1400;
  for (const b of far) {
    const bx = ((b.x - (offset*0.18)%totalW + totalW)%totalW) - 20;
    const by = H - b.h - 30;
    // Corp clădire
    ctx.fillStyle = b.c;
    ctx.beginPath(); ctx.roundRect(bx, by, b.w, b.h, [3,3,0,0]); ctx.fill();
    // Gradient lumina
    const fg = ctx.createLinearGradient(bx, by, bx + b.w, by);
    fg.addColorStop(0, 'rgba(255,255,255,0.08)'); fg.addColorStop(1, 'rgba(0,0,0,0.12)');
    ctx.fillStyle = fg;
    ctx.beginPath(); ctx.roundRect(bx, by, b.w, b.h, [3,3,0,0]); ctx.fill();
    // Ferestre galbene
    const cols = Math.floor(b.w/13), rows = Math.floor(b.h/16);
    for (let r=0;r<rows;r++) for (let c=0;c<cols;c++) {
      if ((r+c+b.x)%3!==0) {
        const on = Math.sin(t*0.4 + b.x + r*0.8 + c*1.2) > -0.3;
        ctx.fillStyle = on ? 'rgba(255,235,130,0.7)' : 'rgba(40,60,100,0.5)';
        ctx.beginPath(); ctx.roundRect(bx+4+c*13, by+5+r*16, 6, 8, 1); ctx.fill();
      }
    }
  }

  // ── Strat 2: cladiri aproape (mai mari, mai vizibile) ──────
  const near = [
    {x:50,w:100,h:260,c:'#2a4060'},{x:170,w:75,h:200,c:'#1e3450'},{x:265,w:110,h:300,c:'#243858'},
    {x:395,w:85,h:230,c:'#1a3050'},{x:500,w:120,h:280,c:'#20384a'},{x:640,w:80,h:210,c:'#243050'},
    {x:740,w:95,h:270,c:'#1c3248'},{x:855,w:115,h:320,c:'#182840'},{x:990,w:85,h:240,c:'#1e3050'},
    {x:1095,w:105,h:290,c:'#223050'},{x:1220,w:75,h:220,c:'#1a2e48'},
  ];
  const totalW2 = 1400;
  const neons = ['OPEN','24H','BAR','PIZZA','GYM'];
  for (let i=0; i<near.length; i++) {
    const b = near[i];
    const bx = ((b.x - (offset*0.45)%totalW2 + totalW2)%totalW2) - 20;
    const by = H - b.h - 30;
    const sd = 11;
    // Față dreapta 3D
    ctx.fillStyle = b.c;
    ctx.save(); ctx.globalAlpha = 0.55;
    ctx.beginPath();
    ctx.moveTo(bx+b.w, by); ctx.lineTo(bx+b.w+sd, by-sd*0.55);
    ctx.lineTo(bx+b.w+sd, H-30-sd*0.55); ctx.lineTo(bx+b.w, H-30);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle='rgba(0,0,0,0.3)'; ctx.fill();
    ctx.globalAlpha=1; ctx.restore();
    // Corp clădire
    ctx.fillStyle = b.c;
    ctx.beginPath(); ctx.roundRect(bx, by, b.w, b.h, [4,4,0,0]); ctx.fill();
    // Gradient pe faţadă
    const ng = ctx.createLinearGradient(bx, by, bx+b.w, by);
    ng.addColorStop(0,'rgba(255,255,255,0.1)'); ng.addColorStop(0.4,'rgba(255,255,255,0.02)'); ng.addColorStop(1,'rgba(0,0,0,0.2)');
    ctx.fillStyle = ng;
    ctx.beginPath(); ctx.roundRect(bx, by, b.w, b.h, [4,4,0,0]); ctx.fill();
    // Ferestre
    const cols=Math.floor(b.w/14), rows=Math.floor(b.h/18);
    for (let r=0;r<rows;r++) for (let c=0;c<cols;c++) {
      if ((i+r+c)%3!==2) {
        const on = Math.sin(t*0.5 + i + r*0.9 + c*1.3) > -0.35;
        ctx.fillStyle = on ? 'rgba(255,230,100,0.85)' : 'rgba(30,50,90,0.6)';
        ctx.beginPath(); ctx.roundRect(bx+5+c*14, by+6+r*18, 7,10, 1); ctx.fill();
        if (on) { ctx.fillStyle='rgba(255,255,255,0.3)'; ctx.fillRect(bx+5+c*14, by+6+r*18, 3, 4); }
      }
    }
    // Semn neon rar
    if (b.w>90 && i%4===1) {
      ctx.save(); ctx.shadowColor='#44aaff'; ctx.shadowBlur=12;
      ctx.fillStyle=`rgba(80,190,255,${0.65+0.3*Math.sin(t*1.8+i)})`;
      ctx.font=`bold ${Math.floor(b.w*0.14)}px Nunito,sans-serif`; ctx.textAlign='center';
      ctx.fillText(neons[i%neons.length], bx+b.w/2, by+24);
      ctx.shadowBlur=0; ctx.restore();
    }
  }

  // ── Stradă ────────────────────────────────────────────────
  const roadGrad = ctx.createLinearGradient(0, H-34, 0, H);
  roadGrad.addColorStop(0,'#2a2a3a'); roadGrad.addColorStop(1,'#16161e');
  ctx.fillStyle=roadGrad; ctx.fillRect(0, H-34, W, 34);
  ctx.strokeStyle='rgba(255,255,255,0.3)'; ctx.setLineDash([36,28]); ctx.lineWidth=3;
  const dashOff=(offset*0.6)%64;
  ctx.beginPath(); ctx.moveTo(-dashOff, H-16); ctx.lineTo(W+60, H-16); ctx.stroke();
  ctx.setLineDash([]);

  // Stâlpi de iluminat
  for (let i=0; i<8; i++) {
    const lx=((i*190-(offset*0.5)%1520+1520)%1520);
    ctx.fillStyle='#8090a8'; ctx.fillRect(lx, H-100, 4, 68);
    ctx.fillStyle='#707888'; ctx.fillRect(lx-10, H-100, 24, 5);
    ctx.save(); ctx.shadowColor='#ffe090'; ctx.shadowBlur=18;
    ctx.fillStyle='#ffe8a0';
    ctx.beginPath(); ctx.arc(lx+2, H-100, 7, 0, Math.PI*2); ctx.fill();
    ctx.shadowBlur=0; ctx.restore();
  }

  // Mașini
  const carColors=['#cc3030','#3060cc','#30aa50','#cc8800'];
  for (let ci=0; ci<2; ci++) {
    const carX=((offset*(0.7+ci*0.4)+ci*(W/2+80))%(W+140))-70;
    ctx.fillStyle=carColors[ci];
    ctx.beginPath(); ctx.roundRect(carX, H-48, 54, 20, 4); ctx.fill();
    ctx.fillStyle='rgba(150,220,255,0.6)';
    ctx.beginPath(); ctx.roundRect(carX+6, H-60, 16, 13, [3,3,0,0]); ctx.fill();
    ctx.beginPath(); ctx.roundRect(carX+30, H-60, 14, 13, [3,3,0,0]); ctx.fill();
    ctx.fillStyle='#111';
    ctx.beginPath(); ctx.arc(carX+12, H-28, 6, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(carX+40, H-28, 6, 0, Math.PI*2); ctx.fill();
    ctx.save(); ctx.shadowColor='#fffaaa'; ctx.shadowBlur=14;
    ctx.fillStyle='#fffaaa'; ctx.beginPath(); ctx.arc(carX+54, H-42, 4, 0, Math.PI*2); ctx.fill();
    ctx.shadowBlur=0; ctx.restore();
  }
}

function _bgJapan(ctx, W, H, offset) {
  // Mount Fuji (far parallax)
  const fujiX = ((W * 0.5 - (offset * 0.06) % 2000 + 2000) % 2000) - 50;
  ctx.fillStyle = 'rgba(200,210,230,0.55)';
  ctx.beginPath(); ctx.moveTo(fujiX - 200, H - 60); ctx.lineTo(fujiX, H - 320); ctx.lineTo(fujiX + 200, H - 60); ctx.fill();
  ctx.fillStyle = 'rgba(240,245,255,0.75)';
  ctx.beginPath(); ctx.moveTo(fujiX - 55, H - 230); ctx.lineTo(fujiX, H - 320); ctx.lineTo(fujiX + 55, H - 230); ctx.lineTo(fujiX + 30, H - 215); ctx.lineTo(fujiX - 30, H - 215); ctx.fill();

  // Torii gate (mid parallax)
  const torii = [350, 950];
  for (const tx of torii) {
    const bx = ((tx - (offset * 0.18) % 1400 + 1400) % 1400) - 30;
    ctx.fillStyle = 'rgba(200,40,40,0.62)';
    // pillars
    ctx.fillRect(bx - 35, H - 220, 12, 160);
    ctx.fillRect(bx + 23, H - 220, 12, 160);
    // top beam
    ctx.fillRect(bx - 55, H - 222, 110, 14);
    // curved top piece
    ctx.beginPath(); ctx.moveTo(bx - 50, H - 222); ctx.quadraticCurveTo(bx, H - 252, bx + 50, H - 222); ctx.lineWidth = 12; ctx.strokeStyle = 'rgba(200,40,40,0.62)'; ctx.stroke();
    // second beam
    ctx.fillStyle = 'rgba(200,40,40,0.55)';
    ctx.fillRect(bx - 44, H - 198, 88, 10);
  }

  // Cherry blossom trees
  const totalW = 1200;
  const trees = [60, 220, 400, 570, 740, 920, 1090];
  for (const tx of trees) {
    const bx = ((tx - (offset * 0.35) % totalW + totalW) % totalW) - 20;
    // trunk
    ctx.fillStyle = '#6b4226';
    ctx.fillRect(bx - 6, H - 195, 12, 130);
    // branches
    ctx.strokeStyle = '#6b4226'; ctx.lineWidth = 4; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(bx, H - 170); ctx.lineTo(bx - 30, H - 210); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(bx, H - 155); ctx.lineTo(bx + 28, H - 200); ctx.stroke();
    // blossoms
    for (const [ox, oy, r] of [[-28,-14,38],[0,-42,44],[28,-16,36],[-14,-52,30],[14,-52,28]]) {
      ctx.fillStyle = 'rgba(255,175,195,0.62)';
      ctx.beginPath(); ctx.arc(bx + ox, H - 195 + oy, r, 0, Math.PI*2); ctx.fill();
    }
    // inner bright blossoms
    for (const [ox, oy, r] of [[0,-42,22],[-28,-14,18],[28,-16,16]]) {
      ctx.fillStyle = 'rgba(255,210,225,0.5)';
      ctx.beginPath(); ctx.arc(bx + ox, H - 195 + oy, r, 0, Math.PI*2); ctx.fill();
    }
    // falling petals
    for (let p = 0; p < 10; p++) {
      const px = bx + ((p*41 + offset * 0.6) % 120) - 60;
      const py = H - 195 + ((p*57 + offset * 0.45) % 160);
      ctx.fillStyle = 'rgba(255,182,200,0.6)';
      ctx.beginPath(); ctx.ellipse(px, py, 3.5, 2, p * 0.7, 0, Math.PI*2); ctx.fill();
    }
  }

  // Pagoda (background element)
  const pagX = ((700 - (offset * 0.12) % 1800 + 1800) % 1800) - 40;
  ctx.fillStyle = 'rgba(130,50,50,0.42)';
  for (let t = 0; t < 4; t++) {
    const tw = 62 - t * 13, ty = H - 310 + t * 52;
    ctx.beginPath(); ctx.moveTo(pagX - tw - 14, ty + 12); ctx.lineTo(pagX - tw + 2, ty); ctx.lineTo(pagX + tw - 2, ty); ctx.lineTo(pagX + tw + 14, ty + 12); ctx.fill();
    ctx.fillRect(pagX - tw + 2, ty, (tw - 2) * 2, 10);
    if (t < 3) ctx.fillRect(pagX - tw * 0.55, ty + 10, tw * 1.1, 42);
  }
  // pagoda finial
  ctx.fillRect(pagX - 3, H - 310 - 30, 6, 30);

  // Water / river at base
  ctx.fillStyle = 'rgba(180,220,255,0.28)';
  ctx.fillRect(0, H - 55, W, 55);
  ctx.strokeStyle = 'rgba(120,190,255,0.4)'; ctx.lineWidth = 2;
  for (let w = 0; w < 5; w++) {
    const wy = H - 48 + w * 10;
    ctx.beginPath();
    for (let wx = ((-offset * 0.15) % 100) - 100; wx < W + 100; wx += 100) {
      ctx.moveTo(wx, wy + 5); ctx.quadraticCurveTo(wx + 25, wy - 5, wx + 50, wy + 2); ctx.quadraticCurveTo(wx + 75, wy + 9, wx + 100, wy + 5);
    }
    ctx.stroke();
  }
}

function _bgJungle(ctx, W, H, offset) {
  ctx.fillStyle = 'rgba(0,40,10,0.22)'; ctx.fillRect(0, 0, W, H);
  // Sun peeking through
  ctx.fillStyle='rgba(255,220,80,0.18)'; ctx.shadowColor='#ffee88'; ctx.shadowBlur=40;
  ctx.beginPath(); ctx.arc(W*0.75, H*0.08, 38, 0, Math.PI*2); ctx.fill(); ctx.shadowBlur=0;
  // Light rays
  for (let r=0;r<6;r++) {
    const ra = r*Math.PI/8 + Math.PI/12;
    ctx.strokeStyle='rgba(200,255,100,0.07)'; ctx.lineWidth=18;
    ctx.beginPath(); ctx.moveTo(W*0.75,H*0.08); ctx.lineTo(W*0.75+Math.cos(ra)*600, H*0.08+Math.sin(ra)*600); ctx.stroke();
  }
  // Far background trees
  const totalW = 1400;
  for (const tx of [30,130,240,360,470,590,710,820,940,1060,1170,1290]) {
    const bx = ((tx - (offset*0.12)%totalW+totalW)%totalW)-20;
    ctx.fillStyle='rgba(10,80,20,0.3)';
    ctx.beginPath(); ctx.moveTo(bx,H-20); ctx.lineTo(bx-28,H-180); ctx.lineTo(bx+28,H-180); ctx.fill();
    ctx.beginPath(); ctx.moveTo(bx,H-150); ctx.lineTo(bx-35,H-280); ctx.lineTo(bx+35,H-280); ctx.fill();
    ctx.beginPath(); ctx.moveTo(bx,H-250); ctx.lineTo(bx-20,H-360); ctx.lineTo(bx+20,H-360); ctx.fill();
  }
  // Near jungle trees with canopy
  for (const tx of [60,220,390,560,730,900,1070]) {
    const bx = ((tx-(offset*0.38)%1300+1300)%1300)-20;
    ctx.strokeStyle='#4a2e0a'; ctx.lineWidth=14; ctx.lineCap='round';
    ctx.beginPath(); ctx.moveTo(bx,H); ctx.quadraticCurveTo(bx-18,H-130,bx+12,H-230); ctx.stroke();
    // large canopy
    for (const [ox,oy,r] of [[-35,-20,55],[0,-50,60],[35,-18,52],[-18,-70,40],[18,-72,38]]) {
      ctx.fillStyle='rgba(20,130,30,0.52)';
      ctx.beginPath(); ctx.arc(bx+ox,H-230+oy,r,0,Math.PI*2); ctx.fill();
    }
    // bright highlights
    for (const [ox,oy,r] of [[0,-52,28],[-35,-20,22]]) {
      ctx.fillStyle='rgba(60,200,50,0.28)';
      ctx.beginPath(); ctx.arc(bx+ox,H-230+oy,r,0,Math.PI*2); ctx.fill();
    }
    // exotic flowers
    for (let f=0;f<3;f++) {
      const fx=bx+(f*37-37); const fy=H-230+((f*53)%80)-30;
      ctx.fillStyle='rgba(255,80,180,0.55)'; ctx.beginPath(); ctx.arc(fx,fy,5,0,Math.PI*2); ctx.fill();
      ctx.fillStyle='rgba(255,220,50,0.55)'; ctx.beginPath(); ctx.arc(fx,fy,2,0,Math.PI*2); ctx.fill();
    }
  }
  // Hanging vines
  for (let v=0;v<12;v++) {
    const vx=((v*130-offset*0.28)%W+W)%W;
    ctx.strokeStyle='rgba(30,120,30,0.42)'; ctx.lineWidth=3;
    ctx.beginPath(); ctx.moveTo(vx,0); ctx.quadraticCurveTo(vx+Math.sin(v)*20,H*0.25,vx-Math.sin(v)*14,H*0.52); ctx.stroke();
    // leaf at bottom
    ctx.fillStyle='rgba(40,170,40,0.48)';
    ctx.beginPath(); ctx.ellipse(vx-Math.sin(v)*14,H*0.52,8,4,v*0.5,0,Math.PI*2); ctx.fill();
  }
  // Butterfly
  for (const bf of [{x:300,y:120,d:1},{x:780,y:90,d:-1}]) {
    const bfx=((bf.x+offset*bf.d*0.3)%(W+80)+W+80)%(W+80)-40;
    const bfy=bf.y+Math.sin(offset*0.04+bf.x)*18;
    ctx.save(); ctx.translate(bfx,bfy); if(bf.d<0)ctx.scale(-1,1);
    ctx.fillStyle='rgba(255,150,50,0.65)'; ctx.beginPath(); ctx.ellipse(-9,-4,12,7,0.5,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='rgba(255,100,30,0.55)'; ctx.beginPath(); ctx.ellipse(-8,5,10,6,-0.5,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='rgba(255,220,100,0.65)'; ctx.beginPath(); ctx.ellipse(9,-4,12,7,-0.5,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='rgba(255,180,60,0.55)'; ctx.beginPath(); ctx.ellipse(8,5,10,6,0.5,0,Math.PI*2); ctx.fill();
    ctx.restore();
  }
  // Waterfall
  const wfx=((900-(offset*0.1)%2000+2000)%2000);
  if(wfx<W+30) {
    ctx.fillStyle='rgba(150,220,255,0.3)'; ctx.fillRect(wfx,H*0.3,22,H*0.7);
    ctx.strokeStyle='rgba(200,240,255,0.4)'; ctx.lineWidth=2;
    for(let s=0;s<6;s++){const sy=((s*50+offset*1.5)%((H*0.7))); ctx.beginPath();ctx.arc(wfx+11,H*0.3+sy,5+s,0,Math.PI*2);ctx.stroke();}
    ctx.fillStyle='rgba(150,230,255,0.28)';
    ctx.beginPath();ctx.ellipse(wfx+11,H-30,28,12,0,0,Math.PI*2);ctx.fill();
  }
  // Parrot
  const parX=((500+offset*0.55)%(W+60)+W+60)%(W+60)-30;
  const parY=80+Math.sin(offset*0.03)*12;
  ctx.save(); ctx.translate(parX,parY);
  ctx.fillStyle='rgba(50,200,50,0.7)'; ctx.beginPath(); ctx.ellipse(0,0,14,9,0,0,Math.PI*2); ctx.fill();
  ctx.fillStyle='rgba(255,50,50,0.7)'; ctx.beginPath(); ctx.ellipse(-8,-5,7,5,0.5,0,Math.PI*2); ctx.fill();
  ctx.fillStyle='rgba(255,220,30,0.8)'; ctx.beginPath(); ctx.moveTo(-10,0); ctx.lineTo(-16,-3); ctx.lineTo(-14,3); ctx.fill();
  ctx.restore();
}

function _bgNY(ctx, W, H, offset) {
  const t = Date.now() * 0.001;
  // ── Lună ──────────────────────────────────────────────────
  ctx.save(); ctx.shadowColor='#fffde0'; ctx.shadowBlur=35;
  ctx.fillStyle='rgba(255,250,220,0.85)';
  ctx.beginPath(); ctx.arc(W*0.78, 70, 32, 0, Math.PI*2); ctx.fill();
  ctx.shadowBlur=0; ctx.restore();
  // Stele
  for (let s=0;s<50;s++) {
    const sx=((s*137+offset*0.02)%W+W)%W, sy=(s*79)%(H*0.45);
    const alpha = 0.35 + Math.abs(Math.sin(t*0.8+s)) * 0.4;
    ctx.fillStyle=`rgba(255,255,220,${alpha.toFixed(2)})`; ctx.beginPath(); ctx.arc(sx,sy,0.8+s%3*0.5,0,Math.PI*2); ctx.fill();
  }

  // ── Statuia Libertății ─────────────────────────────────────
  const sL=((1050-(offset*0.08)%2200+2200)%2200)-30;
  ctx.fillStyle='rgba(50,100,75,0.5)';
  ctx.fillRect(sL,H-195,20,120);
  ctx.beginPath(); ctx.moveTo(sL-14,H-195); ctx.lineTo(sL+34,H-195); ctx.lineTo(sL+26,H-265); ctx.lineTo(sL+8,H-265); ctx.fill();
  ctx.beginPath(); ctx.moveTo(sL+8,H-265); ctx.lineTo(sL+2,H-308); ctx.lineTo(sL+20,H-285); ctx.lineTo(sL+26,H-265); ctx.fill();
  for(let sp=0;sp<5;sp++) { ctx.fillStyle='rgba(60,120,90,0.5)'; ctx.fillRect(sL+4+sp*4,H-312-sp%2*8,3,12); }

  // ── Cladiri strat 1 — fundal (albastrui vizibili) ──────────
  const far2=[{x:20,w:70,h:200,c:'#1c2a44'},{x:105,w:55,h:165,c:'#162238'},{x:175,w:80,h:230,c:'#1a2840'},
    {x:270,w:60,h:188,c:'#14203a'},{x:345,w:90,h:260,c:'#182440'},{x:450,w:70,h:210,c:'#1c2a44'},
    {x:535,w:85,h:195,c:'#16223c'},{x:635,w:100,h:250,c:'#1a2842'},{x:750,w:65,h:178,c:'#14203a'},
    {x:830,w:88,h:235,c:'#182440'},{x:932,w:72,h:198,c:'#1c2a44'},{x:1020,w:95,h:268,c:'#1a2640'}];
  const tw1=1200;
  for (const b of far2) {
    const bx=((b.x-(offset*0.25)%tw1+tw1)%tw1)-20;
    const by=H-b.h-28;
    ctx.fillStyle=b.c;
    ctx.beginPath(); ctx.roundRect(bx,by,b.w,b.h,[3,3,0,0]); ctx.fill();
    const cols=Math.floor(b.w/13), rows=Math.floor(b.h/17);
    for(let r=0;r<rows;r++) for(let c=0;c<cols;c++) {
      if((r+c+b.x)%4!==3) {
        const on=Math.sin(t*0.35+b.x+r*0.7+c)>-0.25;
        ctx.fillStyle=on?'rgba(255,210,80,0.75)':'rgba(20,35,65,0.6)';
        ctx.beginPath(); ctx.roundRect(bx+4+c*13,by+5+r*17,6,9,1); ctx.fill();
      }
    }
  }

  // ── Cladiri strat 2 — prim plan (NY caracteristice) ────────
  const bldgs=[
    {x:0,  w:88, h:360,c:'#1a2440'},{x:100,w:65, h:295,c:'#0e1830'},
    {x:175,w:105,h:420,c:'#162038'},{x:292,w:72, h:335,c:'#0c1628'},
    {x:376,w:95, h:395,c:'#122030'},{x:483,w:115,h:365,c:'#162238'},
    {x:611,w:82, h:445,c:'#0e1a2e'},{x:705,w:74, h:315,c:'#101c30'},
    {x:791,w:102,h:405,c:'#14202e'},{x:905,w:78, h:272,c:'#0e1a2c'},
    {x:995,w:92, h:435,c:'#121e30'},{x:1099,w:62,h:305,c:'#101830'},
    {x:1173,w:112,h:375,c:'#162038'},
  ];
  const totalW=1300;
  for (let i=0;i<bldgs.length;i++) {
    const b=bldgs[i];
    const bx=((b.x-offset%totalW+totalW)%totalW)-20;
    const by=H-b.h-28;
    const sd=12;
    // Față dreapta 3D
    ctx.save(); ctx.globalAlpha=0.55;
    ctx.fillStyle=b.c;
    ctx.beginPath();
    ctx.moveTo(bx+b.w,by); ctx.lineTo(bx+b.w+sd,by-sd*0.5);
    ctx.lineTo(bx+b.w+sd,H-28-sd*0.5); ctx.lineTo(bx+b.w,H-28);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle='rgba(0,0,0,0.35)'; ctx.fill();
    ctx.globalAlpha=1; ctx.restore();
    // Corp
    ctx.fillStyle=b.c;
    ctx.beginPath(); ctx.roundRect(bx,by,b.w,b.h,[4,4,0,0]); ctx.fill();
    // Gradient lumina
    const bg=ctx.createLinearGradient(bx,by,bx+b.w,by);
    bg.addColorStop(0,'rgba(255,255,255,0.09)'); bg.addColorStop(0.5,'rgba(255,255,255,0.01)'); bg.addColorStop(1,'rgba(0,0,0,0.15)');
    ctx.fillStyle=bg; ctx.beginPath(); ctx.roundRect(bx,by,b.w,b.h,[4,4,0,0]); ctx.fill();
    // Ferestre galbene NY
    const cols=Math.floor(b.w/14), rows=Math.floor(b.h/18);
    for(let r=0;r<rows;r++) for(let c=0;c<cols;c++) {
      if((i+r+c)%3!==2) {
        const on=Math.sin(t*0.45+i+r*0.85+c*1.2)>-0.3;
        ctx.fillStyle=on?'rgba(255,210,80,0.9)':'rgba(15,28,55,0.7)';
        ctx.beginPath(); ctx.roundRect(bx+5+c*14,by+6+r*18,7,10,1); ctx.fill();
        if(on){ ctx.fillStyle='rgba(255,255,200,0.35)'; ctx.fillRect(bx+5+c*14,by+6+r*18,3,4); }
      }
    }
    // Antenă pe clădiri înalte
    if(b.h>380) {
      ctx.fillStyle='#7a8090'; ctx.fillRect(bx+b.w/2-2,by-32,4,34);
      ctx.save(); ctx.shadowColor='#ff4444'; ctx.shadowBlur=10;
      ctx.fillStyle=`rgba(255,60,60,${0.6+0.4*Math.abs(Math.sin(t*1.5+i))})`;
      ctx.beginPath(); ctx.arc(bx+b.w/2,by-32,4,0,Math.PI*2); ctx.fill();
      ctx.shadowBlur=0; ctx.restore();
    }
  }

  // ── Stradă NY ─────────────────────────────────────────────
  ctx.fillStyle='#111118'; ctx.fillRect(0,H-30,W,30);
  ctx.strokeStyle='rgba(255,255,255,0.2)'; ctx.setLineDash([36,28]); ctx.lineWidth=2.5;
  const doff=(offset*0.7)%64;
  ctx.beginPath(); ctx.moveTo(-doff,H-14); ctx.lineTo(W+60,H-14); ctx.stroke();
  ctx.setLineDash([]);
  // Glow portocaliu de stradă
  const glow=ctx.createLinearGradient(0,H*0.88,0,H);
  glow.addColorStop(0,'rgba(255,140,30,0)'); glow.addColorStop(1,'rgba(255,140,30,0.28)');
  ctx.fillStyle=glow; ctx.fillRect(0,H*0.88,W,H*0.12);

  // ── Taxi galben ───────────────────────────────────────────
  const cab=((offset*0.95)%(W+130))-65;
  ctx.save(); ctx.shadowColor='rgba(255,200,0,0.4)'; ctx.shadowBlur=8;
  ctx.fillStyle='#e8c000';
  ctx.beginPath(); ctx.roundRect(cab,H-48,56,22,4); ctx.fill();
  ctx.shadowBlur=0; ctx.restore();
  ctx.fillStyle='rgba(150,220,255,0.55)';
  ctx.beginPath(); ctx.roundRect(cab+8,H-60,17,13,[3,3,0,0]); ctx.fill();
  ctx.beginPath(); ctx.roundRect(cab+30,H-60,15,13,[3,3,0,0]); ctx.fill();
  ctx.fillStyle='#fff'; ctx.font='bold 8px sans-serif'; ctx.textAlign='center';
  ctx.fillText('TAXI',cab+28,H-39);
  ctx.fillStyle='#111';
  ctx.beginPath(); ctx.arc(cab+14,H-26,6,0,Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(cab+42,H-26,6,0,Math.PI*2); ctx.fill();
}

function _bgBeach(ctx, W, H, offset) {
  // Sun with glow
  ctx.fillStyle='#ffe066'; ctx.shadowColor='#ffcc00'; ctx.shadowBlur=45;
  ctx.beginPath(); ctx.arc(W*0.82,H*0.14,46,0,Math.PI*2); ctx.fill(); ctx.shadowBlur=0;
  // Sun rays
  ctx.strokeStyle='rgba(255,220,80,0.18)'; ctx.lineWidth=14;
  for(let r=0;r<12;r++){const ra=r*Math.PI/6;ctx.beginPath();ctx.moveTo(W*0.82+Math.cos(ra)*58,H*0.14+Math.sin(ra)*58);ctx.lineTo(W*0.82+Math.cos(ra)*105,H*0.14+Math.sin(ra)*105);ctx.stroke();}
  // Distant sailboats
  for(const boat of [{x:200,s:0.6},{x:700,s:0.45}]){
    const bx=((boat.x-(offset*boat.s*0.15)%1800+1800)%1800);
    if(bx<W+40){
      ctx.fillStyle='rgba(255,255,255,0.5)'; ctx.fillRect(bx,H*0.58,40,8);
      ctx.strokeStyle='rgba(180,180,220,0.6)'; ctx.lineWidth=2; ctx.beginPath(); ctx.moveTo(bx+20,H*0.58); ctx.lineTo(bx+20,H*0.38); ctx.stroke();
      ctx.fillStyle='rgba(255,120,80,0.5)'; ctx.beginPath(); ctx.moveTo(bx+20,H*0.38); ctx.lineTo(bx+42,H*0.56); ctx.lineTo(bx+20,H*0.56); ctx.fill();
    }
  }
  // Ocean
  ctx.fillStyle='rgba(0,100,210,0.2)'; ctx.fillRect(0,H*0.65,W,H*0.35);
  // Ocean waves
  ctx.strokeStyle='rgba(120,210,255,0.48)'; ctx.lineWidth=3;
  for(let w2=0;w2<5;w2++){
    const wy=H*0.67+w2*22;
    ctx.beginPath();
    for(let wx=(-offset*0.14)%130-130;wx<W+130;wx+=130){
      ctx.moveTo(wx,wy+8); ctx.quadraticCurveTo(wx+33,wy-9,wx+65,wy+4); ctx.quadraticCurveTo(wx+97,wy+17,wx+130,wy+8);
    }
    ctx.stroke();
  }
  // Sand
  ctx.fillStyle='rgba(210,185,130,0.42)'; ctx.fillRect(0,H*0.82,W,H*0.18);
  // Palm trees (multiple)
  for(const [tx,lean] of [[150,1],[550,-0.6],[920,0.8]]){
    const px=((tx-(offset*0.32)%1200+1200)%1200);
    ctx.fillStyle='#7a5030'; ctx.fillRect(px-5,H*0.48,11,H*0.35);
    for(let l=0;l<7;l++){
      const la=l*Math.PI/3.5-Math.PI/4+lean*0.2;
      ctx.strokeStyle='rgba(30,180,50,0.68)'; ctx.lineWidth=7;
      ctx.beginPath(); ctx.moveTo(px+5,H*0.48); ctx.quadraticCurveTo(px+5+Math.cos(la)*58,H*0.48+Math.sin(la)*38,px+5+Math.cos(la)*95,H*0.48+Math.sin(la)*65); ctx.stroke();
    }
    // coconuts
    ctx.fillStyle='rgba(130,80,30,0.65)'; ctx.beginPath(); ctx.arc(px+6,H*0.48+2,6,0,Math.PI*2); ctx.fill();
  }
  // Beach umbrella
  const umbX=((400-(offset*0.22)%1500+1500)%1500);
  ctx.fillStyle='rgba(180,40,40,0.5)'; ctx.strokeStyle='rgba(180,40,40,0.5)'; ctx.lineWidth=3;
  ctx.beginPath(); ctx.moveTo(umbX,H*0.84); ctx.lineTo(umbX,H*0.63); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(umbX-40,H*0.66); ctx.quadraticCurveTo(umbX,H*0.60,umbX+40,H*0.66); ctx.fill();
  ctx.fillStyle='rgba(255,200,50,0.5)';
  ctx.beginPath(); ctx.moveTo(umbX-40,H*0.66); ctx.quadraticCurveTo(umbX-20,H*0.675,umbX,H*0.67); ctx.fill();
  ctx.fillStyle='rgba(180,40,40,0.5)';
  ctx.beginPath(); ctx.moveTo(umbX,H*0.67); ctx.quadraticCurveTo(umbX+20,H*0.675,umbX+40,H*0.66); ctx.fill();
  // Seagulls
  for(const g of [{x:120,y:60},{x:380,y:45},{x:650,y:75}]){
    const gx=((g.x+offset*0.4)%(W+60)+W+60)%(W+60)-30;
    ctx.strokeStyle='rgba(240,240,255,0.65)'; ctx.lineWidth=2; ctx.lineCap='round';
    ctx.beginPath(); ctx.moveTo(gx-12,g.y); ctx.quadraticCurveTo(gx-5,g.y-7,gx,g.y); ctx.quadraticCurveTo(gx+5,g.y-7,gx+12,g.y); ctx.stroke();
  }
}

function _bgMountain(ctx, W, H, offset) {
  // Distant mountains (far parallax)
  const mts = [{x:0,h:280},{x:180,h:340},{x:380,h:260},{x:560,h:320},{x:730,h:300},{x:910,h:360},{x:1090,h:280},{x:1260,h:310}];
  const totalW = 1400;
  // Far snow mountains
  for (const m of mts) {
    const bx = ((m.x-(offset*0.1)%totalW+totalW)%totalW)-50;
    ctx.fillStyle='rgba(180,200,220,0.3)';
    ctx.beginPath(); ctx.moveTo(bx,H); ctx.lineTo(bx+100,H-m.h); ctx.lineTo(bx+200,H); ctx.fill();
    ctx.fillStyle='rgba(235,245,255,0.5)';
    ctx.beginPath(); ctx.moveTo(bx+100,H-m.h); ctx.lineTo(bx+70,H-m.h+50); ctx.lineTo(bx+130,H-m.h+50); ctx.fill();
  }
  // Mid mountains (darker)
  for (const m of mts) {
    const bx = ((m.x+70-(offset*0.3)%totalW+totalW)%totalW)-50;
    ctx.fillStyle='rgba(70,100,120,0.42)';
    ctx.beginPath(); ctx.moveTo(bx,H); ctx.lineTo(bx+90,H-m.h*0.85); ctx.lineTo(bx+180,H); ctx.fill();
    ctx.fillStyle='rgba(210,230,250,0.45)';
    ctx.beginPath(); ctx.moveTo(bx+90,H-m.h*0.85); ctx.lineTo(bx+68,H-m.h*0.85+35); ctx.lineTo(bx+112,H-m.h*0.85+35); ctx.fill();
  }
  // Eagles / birds
  for(const e of [{x:200,y:80},{x:650,y:55},{x:1050,y:95}]){
    const ex=((e.x+offset*0.25)%(W+60)+W+60)%(W+60)-30;
    ctx.strokeStyle='rgba(80,80,100,0.5)'; ctx.lineWidth=2; ctx.lineCap='round';
    ctx.beginPath(); ctx.moveTo(ex-14,e.y); ctx.quadraticCurveTo(ex-5,e.y-9,ex,e.y); ctx.quadraticCurveTo(ex+5,e.y-9,ex+14,e.y); ctx.stroke();
  }
  // Clouds
  for(const cl of [{x:100,y:60},{x:420,y:40},{x:750,y:70},{x:1050,y:50}]){
    const cx=((cl.x-(offset*0.18)%1500+1500)%1500);
    ctx.fillStyle='rgba(255,255,255,0.55)';
    ctx.beginPath(); ctx.ellipse(cx,cl.y,45,22,0,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(cx-30,cl.y+8,28,16,0,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(cx+30,cl.y+8,26,15,0,0,Math.PI*2); ctx.fill();
  }
  // Pine trees (near)
  for (const px of [50,150,260,370,480,580,680,790,900,1010,1130]) {
    const bx = ((px-(offset*0.5)%1300+1300)%1300)-15;
    ctx.fillStyle='rgba(20,70,40,0.52)';
    ctx.beginPath(); ctx.moveTo(bx,H-20); ctx.lineTo(bx-18,H-20); ctx.lineTo(bx,H-105); ctx.fill();
    ctx.beginPath(); ctx.moveTo(bx,H-20); ctx.lineTo(bx+18,H-20); ctx.lineTo(bx,H-105); ctx.fill();
    ctx.beginPath(); ctx.moveTo(bx,H-65); ctx.lineTo(bx-22,H-65); ctx.lineTo(bx,H-140); ctx.fill();
    ctx.beginPath(); ctx.moveTo(bx,H-65); ctx.lineTo(bx+22,H-65); ctx.lineTo(bx,H-140); ctx.fill();
    // Snow on tree
    ctx.fillStyle='rgba(235,245,255,0.6)';
    ctx.beginPath(); ctx.moveTo(bx,H-105); ctx.lineTo(bx-8,H-90); ctx.lineTo(bx+8,H-90); ctx.fill();
    ctx.beginPath(); ctx.moveTo(bx,H-140); ctx.lineTo(bx-6,H-127); ctx.lineTo(bx+6,H-127); ctx.fill();
  }
  // Mountain cabin
  const cabX=((300-(offset*0.4)%1800+1800)%1800);
  ctx.fillStyle='rgba(90,60,40,0.48)'; ctx.fillRect(cabX,H-80,50,50);
  ctx.fillStyle='rgba(120,50,50,0.5)';
  ctx.beginPath(); ctx.moveTo(cabX-8,H-80); ctx.lineTo(cabX+25,H-115); ctx.lineTo(cabX+58,H-80); ctx.fill();
  // Smoke
  for(let s=0;s<3;s++){
    ctx.fillStyle=`rgba(200,200,200,${0.25-s*0.07})`;
    ctx.beginPath(); ctx.arc(cabX+38,(H-120)-s*18,5+s*4,0,Math.PI*2); ctx.fill();
  }
}

function _bgSpace(ctx, W, H, offset) {
  // Nebula clouds
  for(const nb of [{x:0.2,y:0.2,r:180,c:'rgba(80,0,120,'},{x:0.7,y:0.5,r:140,c:'rgba(0,50,120,'},{x:0.45,y:0.75,r:120,c:'rgba(120,0,60,'}]){
    const ng=ctx.createRadialGradient(W*nb.x,H*nb.y,0,W*nb.x,H*nb.y,nb.r);
    ng.addColorStop(0,nb.c+'0.18)'); ng.addColorStop(1,nb.c+'0)');
    ctx.fillStyle=ng; ctx.fillRect(0,0,W,H);
  }
  // Stars (many)
  const primes=[11,23,37,53,67,79,97,113,127,151,163,179,197,211,223,239,251,269,281,293];
  for(let i=0;i<120;i++){
    const s=primes[i%primes.length];
    const sx=((i*s*17+offset*0.04)%W+W)%W, sy=(i*s*13)%(H*0.92);
    const bri=0.35+i%5*0.13;
    ctx.fillStyle=`rgba(255,255,255,${bri})`; ctx.beginPath(); ctx.arc(sx,sy,0.5+(i%4)*0.4,0,Math.PI*2); ctx.fill();
    // Twinkling star cross
    if(i%15===0){ctx.strokeStyle=`rgba(255,255,200,${bri*0.8})`; ctx.lineWidth=0.5; ctx.beginPath(); ctx.moveTo(sx-4,sy); ctx.lineTo(sx+4,sy); ctx.moveTo(sx,sy-4); ctx.lineTo(sx,sy+4); ctx.stroke();}
  }
  // Planets
  const planets=[
    {x:150,y:80,r:36,c:'#3a3aee',c2:'#8888ff',ring:true,bands:true},
    {x:700,y:60,r:22,c:'#cc4400',c2:'#ff8855',ring:false,bands:true},
    {x:1050,y:110,r:16,c:'#22aa66',c2:'#66ddaa',ring:false,bands:false},
    {x:400,y:40,r:10,c:'#888888',c2:'#bbbbbb',ring:false,bands:false}
  ];
  for(const pl of planets){
    const px=((pl.x-(offset*0.07)%1600+1600)%1600);
    const pg=ctx.createRadialGradient(px-pl.r*0.32,pl.y-pl.r*0.32,0,px,pl.y,pl.r);
    pg.addColorStop(0,pl.c2); pg.addColorStop(1,pl.c);
    ctx.fillStyle=pg; ctx.beginPath(); ctx.arc(px,pl.y,pl.r,0,Math.PI*2); ctx.fill();
    if(pl.bands){ctx.strokeStyle='rgba(0,0,0,0.15)'; ctx.lineWidth=pl.r*0.25;ctx.beginPath();ctx.arc(px,pl.y,pl.r*0.65,0,Math.PI*2);ctx.stroke();}
    if(pl.ring){ctx.strokeStyle='rgba(200,200,255,0.42)'; ctx.lineWidth=5; ctx.beginPath(); ctx.ellipse(px,pl.y,pl.r*1.8,pl.r*0.44,-0.32,0,Math.PI*2); ctx.stroke();}
  }
  // Shooting stars
  for(const ss of [{speed:0.9,y:50},{speed:0.65,y:130}]){
    const sx=((offset*ss.speed)%(W+250))-50;
    ctx.strokeStyle='rgba(255,255,200,0.68)'; ctx.lineWidth=2;
    const trail=ctx.createLinearGradient(sx,ss.y,sx-70,ss.y+35);
    trail.addColorStop(0,'rgba(255,255,200,0.7)'); trail.addColorStop(1,'rgba(255,255,200,0)');
    ctx.strokeStyle=trail; ctx.beginPath(); ctx.moveTo(sx,ss.y); ctx.lineTo(sx-70,ss.y+35); ctx.stroke();
  }
  // Rocket
  const rktX=((offset*0.35)%(W+100))-50;
  ctx.save(); ctx.translate(rktX, H*0.3); ctx.rotate(-0.3);
  ctx.fillStyle='rgba(220,220,240,0.7)'; ctx.fillRect(-8,-20,16,36);
  ctx.fillStyle='rgba(255,80,80,0.7)'; ctx.beginPath(); ctx.moveTo(-8,-20); ctx.lineTo(0,-38); ctx.lineTo(8,-20); ctx.fill();
  ctx.fillStyle='rgba(100,180,255,0.6)'; ctx.beginPath(); ctx.arc(0,-8,5,0,Math.PI*2); ctx.fill();
  ctx.fillStyle='rgba(255,120,30,0.6)'; ctx.beginPath(); ctx.ellipse(0,20,5,12,0,0,Math.PI*2); ctx.fill();
  ctx.restore();
}

function _bgWinter(ctx, W, H, offset) {
  // Snow ground
  ctx.fillStyle='rgba(215,235,248,0.5)'; ctx.fillRect(0,H*0.78,W,H*0.22);
  // Distant mountains snowy
  for(const m of [{x:50,h:200},{x:250,h:240},{x:460,h:190},{x:660,h:220},{x:870,h:210},{x:1070,h:230}]){
    const bx=((m.x-(offset*0.1)%1400+1400)%1400)-60;
    ctx.fillStyle='rgba(190,210,230,0.32)';
    ctx.beginPath(); ctx.moveTo(bx,H*0.78); ctx.lineTo(bx+100,H*0.78-m.h); ctx.lineTo(bx+200,H*0.78); ctx.fill();
    ctx.fillStyle='rgba(240,248,255,0.55)';
    ctx.beginPath(); ctx.moveTo(bx+100,H*0.78-m.h); ctx.lineTo(bx+75,H*0.78-m.h+45); ctx.lineTo(bx+125,H*0.78-m.h+45); ctx.fill();
  }
  // Trees
  for (const tx of [55,165,285,405,525,645,765,890,1010,1130]) {
    const bx = ((tx-(offset*0.38)%1300+1300)%1300)-15;
    ctx.strokeStyle='rgba(70,50,40,0.45)'; ctx.lineWidth=7; ctx.lineCap='round';
    ctx.beginPath(); ctx.moveTo(bx,H*0.78); ctx.lineTo(bx,H*0.78-110); ctx.stroke();
    for(let b=0;b<5;b++){
      const by=H*0.78-110+b*22, bdir=b%2===0?1:-1;
      ctx.lineWidth=3; ctx.strokeStyle='rgba(70,50,40,0.4)';
      ctx.beginPath(); ctx.moveTo(bx,by); ctx.lineTo(bx+bdir*(32-b*4),by-16); ctx.stroke();
    }
    ctx.fillStyle='rgba(220,240,255,0.7)'; ctx.beginPath(); ctx.ellipse(bx,H*0.78-115,10,5,0,0,Math.PI*2); ctx.fill();
  }
  // Snowman
  const smX=((600-(offset*0.28)%1600+1600)%1600);
  ctx.fillStyle='rgba(240,248,255,0.7)';
  ctx.beginPath(); ctx.arc(smX,H*0.78-20,18,0,Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(smX,H*0.78-52,13,0,Math.PI*2); ctx.fill();
  ctx.fillStyle='rgba(50,50,50,0.6)'; ctx.beginPath(); ctx.arc(smX-4,H*0.78-54,2,0,Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.arc(smX+4,H*0.78-54,2,0,Math.PI*2); ctx.fill();
  ctx.fillStyle='rgba(255,120,30,0.7)'; ctx.beginPath(); ctx.moveTo(smX,H*0.78-50); ctx.lineTo(smX+10,H*0.78-51); ctx.lineTo(smX,H*0.78-52); ctx.fill();
  ctx.fillStyle='rgba(50,50,50,0.6)'; ctx.fillRect(smX-14,H*0.78-68,28,9); ctx.fillRect(smX-10,H*0.78-77,20,8);
  // Snowflakes
  for (let s=0;s<45;s++) {
    const sfx=((s*97+offset*0.45)%W+W)%W;
    const sfy=((s*53+offset*0.7)%(H*0.78)+10);
    ctx.fillStyle='rgba(200,225,255,0.7)'; ctx.beginPath(); ctx.arc(sfx,sfy,1.5+s%3,0,Math.PI*2); ctx.fill();
  }
  // Frozen lake
  ctx.fillStyle='rgba(150,200,240,0.25)';
  ctx.beginPath(); ctx.ellipse(W*0.5,H*0.78,W*0.35,22,0,0,Math.PI*2); ctx.fill();
  ctx.strokeStyle='rgba(180,220,255,0.5)'; ctx.lineWidth=1.5;
  ctx.beginPath(); ctx.moveTo(W*0.35,H*0.78-8); ctx.lineTo(W*0.65,H*0.78+8); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(W*0.38,H*0.78+5); ctx.lineTo(W*0.62,H*0.78-5); ctx.stroke();
}

function _bgSunset(ctx, W, H, offset) {
  // Sun setting (large, glowing)
  ctx.fillStyle='#ff8c00'; ctx.shadowColor='#ffcc00'; ctx.shadowBlur=60;
  ctx.beginPath(); ctx.arc(W*0.5,H*0.8,55,0,Math.PI*2); ctx.fill(); ctx.shadowBlur=0;
  // Partial sun behind horizon
  ctx.fillStyle='rgba(255,200,80,0.9)';
  ctx.beginPath(); ctx.arc(W*0.5,H*0.8,42,Math.PI,0); ctx.fill();
  // Sun rays
  ctx.strokeStyle='rgba(255,160,30,0.18)'; ctx.lineWidth=18;
  for(let r=0;r<14;r++){const ra=r*Math.PI/7; ctx.beginPath(); ctx.moveTo(W*0.5+Math.cos(ra)*68,H*0.8+Math.sin(ra)*68); ctx.lineTo(W*0.5+Math.cos(ra)*145,H*0.8+Math.sin(ra)*145); ctx.stroke();}
  // Horizon glow strip
  const hGlow=ctx.createLinearGradient(0,H*0.72,0,H*0.82);
  hGlow.addColorStop(0,'rgba(255,100,30,0)'); hGlow.addColorStop(0.5,'rgba(255,160,60,0.38)'); hGlow.addColorStop(1,'rgba(255,100,30,0)');
  ctx.fillStyle=hGlow; ctx.fillRect(0,H*0.72,W,H*0.1);
  // Desert hills silhouette
  for(const dx of [0,280,560,840,1120]){
    const bx=((dx-(offset*0.22)%1400+1400)%1400)-100;
    ctx.fillStyle='rgba(140,80,40,0.38)';
    ctx.beginPath(); ctx.moveTo(bx,H); ctx.quadraticCurveTo(bx+140,H-88,bx+280,H); ctx.fill();
  }
  // Cacti
  for(const [tx,h] of [[180,100],[480,80],[760,110],[1040,90]]){
    const cx=((tx-(offset*0.35)%1500+1500)%1500);
    ctx.fillStyle='rgba(25,100,30,0.52)';
    ctx.fillRect(cx-6,H-h,12,h); // body
    ctx.fillRect(cx-22,H-h+28,16,8); ctx.fillRect(cx-22,H-h+20,8,-18); // left arm
    ctx.fillRect(cx+6,H-h+22,16,8); ctx.fillRect(cx+14,H-h+14,8,-16); // right arm
  }
  // Birds in sunset
  for(const b of [{x:100,y:60},{x:320,y:45},{x:600,y:70},{x:850,y:55}]){
    const bx=((b.x+offset*0.3)%(W+60)+W+60)%(W+60)-30;
    ctx.strokeStyle='rgba(50,20,10,0.5)'; ctx.lineWidth=2; ctx.lineCap='round';
    ctx.beginPath(); ctx.moveTo(bx-11,b.y); ctx.quadraticCurveTo(bx-4,b.y-8,bx,b.y); ctx.quadraticCurveTo(bx+4,b.y-8,bx+11,b.y); ctx.stroke();
  }
  // Clouds lit by sunset
  for(const cl of [{x:80,y:55},{x:380,y:38},{x:720,y:62},{x:1000,y:44}]){
    const cx=((cl.x-(offset*0.15)%1600+1600)%1600);
    ctx.fillStyle='rgba(255,140,60,0.32)';
    ctx.beginPath(); ctx.ellipse(cx,cl.y,50,22,0,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(cx-32,cl.y+9,30,16,0,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(cx+32,cl.y+9,28,15,0,0,Math.PI*2); ctx.fill();
  }
}

function _bgUnderwater(ctx, W, H, offset) {
  // Sun rays from surface
  for(let r=0;r<8;r++){
    const rx=W*0.45+r*55-220;
    const rg=ctx.createLinearGradient(rx,0,rx+30,H);
    rg.addColorStop(0,'rgba(100,210,255,0.18)'); rg.addColorStop(1,'rgba(0,100,200,0)');
    ctx.fillStyle=rg; ctx.beginPath(); ctx.moveTo(rx,0); ctx.lineTo(rx+45,H); ctx.lineTo(rx+75,H); ctx.lineTo(rx+30,0); ctx.fill();
  }
  // Sandy floor
  ctx.fillStyle='rgba(210,185,130,0.38)'; ctx.fillRect(0,H-55,W,55);
  // Coral
  for(const [cx,ct] of [[80,'round'],[200,'branch'],[400,'round'],[580,'fan'],[750,'branch'],[930,'round'],[1100,'fan']]){
    const bx=((cx-(offset*0.22)%1400+1400)%1400);
    if(ct==='round'){
      ctx.fillStyle='rgba(255,80,100,0.55)'; ctx.beginPath(); ctx.arc(bx,H-55,18,Math.PI,0); ctx.fill();
      for(let s=0;s<6;s++){ctx.beginPath();ctx.arc(bx+Math.cos(s*Math.PI/3)*14,H-55+Math.sin(s*Math.PI/3)*8,5,0,Math.PI*2);ctx.fill();}
    } else if(ct==='branch'){
      ctx.strokeStyle='rgba(255,120,60,0.6)'; ctx.lineWidth=4; ctx.lineCap='round';
      ctx.beginPath(); ctx.moveTo(bx,H-55); ctx.lineTo(bx,H-105); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(bx,H-90); ctx.lineTo(bx-18,H-120); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(bx,H-85); ctx.lineTo(bx+18,H-115); ctx.stroke();
      ctx.fillStyle='rgba(255,200,100,0.6)'; ctx.beginPath(); ctx.arc(bx,H-105,5,0,Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.arc(bx-18,H-120,4,0,Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.arc(bx+18,H-115,4,0,Math.PI*2); ctx.fill();
    } else {
      ctx.strokeStyle='rgba(200,80,200,0.5)'; ctx.lineWidth=2;
      for(let f=0;f<7;f++){const fa=f*Math.PI/8-Math.PI/4; ctx.beginPath(); ctx.moveTo(bx,H-55); ctx.quadraticCurveTo(bx+Math.cos(fa)*25,H-55+Math.sin(fa)*25,bx+Math.cos(fa)*40,H-55-Math.abs(Math.sin(fa))*55); ctx.stroke();}
    }
  }
  // Seaweed
  for (const wx of [90,210,370,510,660,800,950,1100]) {
    const bx=((wx-(offset*0.2)%1200+1200)%1200)-10;
    const sway=Math.sin(offset*0.018+wx*0.1)*16;
    ctx.strokeStyle='rgba(0,160,80,0.5)'; ctx.lineWidth=7; ctx.lineCap='round';
    ctx.beginPath(); ctx.moveTo(bx,H-55); ctx.quadraticCurveTo(bx+sway,H-90,bx-sway,H-135); ctx.quadraticCurveTo(bx+sway*0.6,H-165,bx,H-185); ctx.stroke();
  }
  // Fish (various)
  const fishTypes=[
    {x:200,y:150,d:1,c1:'rgba(255,150,50,0.62)',c2:'rgba(255,80,30,0.6)',scale:1},
    {x:600,y:220,d:-1,c1:'rgba(80,180,255,0.62)',c2:'rgba(30,100,220,0.6)',scale:0.8},
    {x:950,y:100,d:1,c1:'rgba(255,220,50,0.65)',c2:'rgba(220,140,30,0.6)',scale:1.2},
    {x:1250,y:185,d:-1,c1:'rgba(200,80,200,0.6)',c2:'rgba(140,30,180,0.55)',scale:0.7},
    {x:400,y:280,d:1,c1:'rgba(50,220,180,0.6)',c2:'rgba(20,160,120,0.55)',scale:0.9}
  ];
  for(const f of fishTypes){
    const fx=((f.x+offset*f.d*0.45)%(W+120)+W+120)%(W+120)-60;
    ctx.save(); ctx.translate(fx,f.y); if(f.d<0)ctx.scale(-1,1); ctx.scale(f.scale,f.scale);
    ctx.fillStyle=f.c1; ctx.beginPath(); ctx.ellipse(0,0,20,9,0,0,Math.PI*2); ctx.fill();
    ctx.fillStyle=f.c2; ctx.beginPath(); ctx.moveTo(-20,0); ctx.lineTo(-30,-11); ctx.lineTo(-30,11); ctx.fill();
    ctx.fillStyle='rgba(0,0,0,0.7)'; ctx.beginPath(); ctx.arc(16,-2,2.5,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='rgba(255,255,255,0.8)'; ctx.beginPath(); ctx.arc(17,-3,1,0,Math.PI*2); ctx.fill();
    ctx.restore();
  }
  // Bubbles
  for (let b=0;b<28;b++) {
    const bx=(b*97%W); const by=((b*53+offset*0.7)%(H-60)+10);
    ctx.strokeStyle=`rgba(150,230,255,${0.3+b%4*0.08})`; ctx.lineWidth=1.2;
    ctx.beginPath(); ctx.arc(bx,by,2+b%5,0,Math.PI*2); ctx.stroke();
  }
  // Jellyfish
  const jfX=((700-(offset*0.15)%2000+2000)%2000);
  const jfY=H*0.3+Math.sin(offset*0.02)*20;
  ctx.fillStyle='rgba(255,150,220,0.4)'; ctx.beginPath(); ctx.arc(jfX,jfY,22,Math.PI,0); ctx.fill();
  ctx.strokeStyle='rgba(255,180,230,0.45)'; ctx.lineWidth=2;
  for(let t=0;t<6;t++){const tx=jfX-15+t*6; ctx.beginPath(); ctx.moveTo(tx,jfY); ctx.quadraticCurveTo(tx+Math.sin(t+offset*0.04)*8,jfY+30,tx+Math.sin(t)*5,jfY+50); ctx.stroke();}
}

function _bgCastle(ctx, W, H, offset) {
  // Moon with craters
  ctx.fillStyle='#fffde7'; ctx.shadowColor='#ffe082'; ctx.shadowBlur=35;
  ctx.beginPath(); ctx.arc(W*0.15,H*0.12,36,0,Math.PI*2); ctx.fill(); ctx.shadowBlur=0;
  ctx.fillStyle='rgba(220,200,160,0.4)';
  for(const [cx,cy,cr] of [[-8,-8,6],[10,5,4],[-2,12,5],[14,-10,3]]){
    ctx.beginPath(); ctx.arc(W*0.15+cx,H*0.12+cy,cr,0,Math.PI*2); ctx.fill();
  }
  // Stars
  for (let s=0;s<55;s++) {
    const sx=((s*113+offset*0.04)%W+W)%W;
    const sy=(s*79)%(H*0.72);
    ctx.fillStyle=`rgba(220,190,255,${0.4+s%4*0.12})`; ctx.beginPath(); ctx.arc(sx,sy,0.7+s%2*0.5,0,Math.PI*2); ctx.fill();
  }
  // Spooky trees
  for(const tx of [80,250,420,680,850,1020,1190]){
    const bx=((tx-(offset*0.28)%1500+1500)%1500)-20;
    ctx.strokeStyle='rgba(20,10,40,0.5)'; ctx.lineWidth=8; ctx.lineCap='round';
    ctx.beginPath(); ctx.moveTo(bx,H); ctx.lineTo(bx,H-180); ctx.stroke();
    // Gnarled branches
    for(let br=0;br<5;br++){
      const brY=H-180+br*32, brDir=br%2===0?1:-1, brLen=40-br*6;
      ctx.lineWidth=4-br*0.5; ctx.beginPath(); ctx.moveTo(bx,brY); ctx.quadraticCurveTo(bx+brDir*brLen*0.6,brY-15,bx+brDir*brLen,brY-8); ctx.stroke();
      ctx.lineWidth=2; ctx.beginPath(); ctx.moveTo(bx+brDir*brLen,brY-8); ctx.lineTo(bx+brDir*(brLen+16),brY-22); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(bx+brDir*brLen,brY-8); ctx.lineTo(bx+brDir*(brLen+12),brY+5); ctx.stroke();
    }
  }
  // Distant castle
  for (const t of [{x:200,h:300,w:82},{x:500,h:360,w:70},{x:820,h:280,w:92},{x:1080,h:330,w:76}]) {
    const bx=((t.x-(offset*0.15)%1600+1600)%1600)-50;
    ctx.fillStyle='rgba(18,6,42,0.58)'; ctx.fillRect(bx,H-t.h,t.w,t.h);
    // Battlements
    for(let b=0;b<5;b++) ctx.fillRect(bx+b*(t.w/5),H-t.h-18,t.w/5-4,18);
    // Windows glowing
    ctx.fillStyle='rgba(255,200,80,0.35)'; ctx.fillRect(bx+t.w/2-6,H-t.h+32,12,18); ctx.fillRect(bx+t.w/2-6,H-t.h+72,12,18);
    ctx.fillStyle='rgba(180,130,255,0.25)'; ctx.fillRect(bx+10,H-t.h+50,10,16); ctx.fillRect(bx+t.w-20,H-t.h+50,10,16);
    // Flag
    ctx.fillStyle='rgba(180,30,30,0.5)'; ctx.fillRect(bx+t.w/2-2,H-t.h-40,3,22); ctx.beginPath(); ctx.moveTo(bx+t.w/2+1,H-t.h-40); ctx.lineTo(bx+t.w/2+18,H-t.h-32); ctx.lineTo(bx+t.w/2+1,H-t.h-24); ctx.fill();
  }
  // Bats
  for (const bat of [{x:300,y:95},{x:600,y:75},{x:900,y:110},{x:1150,y:88}]) {
    const bx=((bat.x+offset*0.6)%(W+120)+W+120)%(W+120)-60;
    ctx.fillStyle='rgba(60,0,90,0.65)'; ctx.save(); ctx.translate(bx,bat.y+Math.sin(offset*0.05+bat.x)*5);
    ctx.beginPath(); ctx.moveTo(0,-5); ctx.bezierCurveTo(-20,-20,-28,2,-17,5); ctx.bezierCurveTo(-10,8,-3,0,0,0); ctx.fill();
    ctx.beginPath(); ctx.moveTo(0,-5); ctx.bezierCurveTo(20,-20,28,2,17,5); ctx.bezierCurveTo(10,8,3,0,0,0); ctx.fill();
    ctx.fillStyle='rgba(120,0,160,0.5)'; ctx.beginPath(); ctx.arc(0,-4,3,0,Math.PI*2); ctx.fill();
    ctx.restore();
  }
  // Purple mist at base
  const mist=ctx.createLinearGradient(0,H*0.82,0,H);
  mist.addColorStop(0,'rgba(50,0,80,0)'); mist.addColorStop(1,'rgba(50,0,80,0.35)');
  ctx.fillStyle=mist; ctx.fillRect(0,H*0.82,W,H*0.18);
}

function _bgRainbow(ctx, W, H, offset) {
  // Rainbow arcs (double rainbow!)
  const rbColors=['#ff2222','#ff8800','#ffee00','#22cc22','#2288ff','#8844cc','#ee22ee'];
  for(let i=0;i<7;i++){
    ctx.strokeStyle=rbColors[i]+'99'; ctx.lineWidth=15;
    ctx.beginPath(); ctx.arc(W*0.5,H*0.9,185+i*18,Math.PI,Math.PI*2); ctx.stroke();
  }
  // Second fainter rainbow
  for(let i=0;i<7;i++){
    ctx.strokeStyle=rbColors[6-i]+'44'; ctx.lineWidth=9;
    ctx.beginPath(); ctx.arc(W*0.5,H*0.9,310+i*14,Math.PI,Math.PI*2); ctx.stroke();
  }
  // Fluffy clouds
  for (const cx2 of [70,340,620,900,1150]) {
    const bx=((cx2-(offset*0.14)%1400+1400)%1400)-30;
    const by=48+(cx2%75);
    ctx.fillStyle='rgba(255,255,255,0.62)';
    ctx.beginPath(); ctx.ellipse(bx,by,42,22,0,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(bx-30,by+9,28,17,0,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(bx+30,by+10,26,16,0,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(bx-12,by-14,22,14,0,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(bx+14,by-12,20,13,0,0,Math.PI*2); ctx.fill();
  }
  // Unicorn
  const unicX=((offset*0.4)%(W+100))-50;
  const unicY=H*0.4+Math.sin(offset*0.025)*15;
  ctx.save(); ctx.translate(unicX,unicY);
  ctx.fillStyle='rgba(255,240,255,0.75)'; ctx.beginPath(); ctx.ellipse(0,0,28,16,0,0,Math.PI*2); ctx.fill(); // body
  ctx.beginPath(); ctx.ellipse(24,-10,14,11,0.4,0,Math.PI*2); ctx.fill(); // head
  ctx.fillStyle='rgba(255,180,230,0.7)'; ctx.beginPath(); ctx.moveTo(28,-16); ctx.lineTo(34,-32); ctx.lineTo(24,-16); ctx.fill(); // horn... ear
  // Horn (spiral golden)
  ctx.strokeStyle='rgba(255,210,50,0.85)'; ctx.lineWidth=2;
  ctx.beginPath(); ctx.moveTo(30,-20); ctx.lineTo(38,-42); ctx.stroke();
  // Mane
  const maneColors=['rgba(255,100,200,0.7)','rgba(180,100,255,0.7)','rgba(100,180,255,0.7)'];
  for(let m=0;m<3;m++){ctx.strokeStyle=maneColors[m]; ctx.lineWidth=4; ctx.beginPath(); ctx.moveTo(14,-20); ctx.quadraticCurveTo(8+m*3,-30+m*5,0+m*4,-15+m*3); ctx.stroke();}
  // Tail
  for(let t=0;t<3;t++){ctx.strokeStyle=maneColors[t]; ctx.lineWidth=4; ctx.beginPath(); ctx.moveTo(-28,5); ctx.quadraticCurveTo(-42+t*3,15+t*5,-38+t*2,28+t*2); ctx.stroke();}
  // Legs
  ctx.strokeStyle='rgba(255,240,255,0.75)'; ctx.lineWidth=5; ctx.lineCap='round';
  for(const [lx,ly] of [[-12,16],[2,16],[14,16],[-20,16]]){ctx.beginPath();ctx.moveTo(lx,ly);ctx.lineTo(lx+2,ly+22);ctx.stroke();}
  ctx.restore();
  // Colorful sparkles
  for (let s=0;s<30;s++) {
    const sx=((s*137+offset*0.55)%W+W)%W;
    const sy=(s*71)%(H*0.8);
    ctx.fillStyle=`hsl(${(s*28+offset*2.5)%360},100%,72%)`;
    ctx.beginPath(); ctx.arc(sx,sy,3+s%3,0,Math.PI*2); ctx.fill();
    if(s%5===0){ctx.strokeStyle=`hsla(${(s*40+offset*3)%360},100%,72%,0.6)`;ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(sx-5,sy);ctx.lineTo(sx+5,sy);ctx.moveTo(sx,sy-5);ctx.lineTo(sx,sy+5);ctx.stroke();}
  }
  // Pot of gold at end of rainbow
  const potX=((W*0.5+185+(offset*0.05))%(W+100));
  ctx.fillStyle='rgba(100,60,20,0.5)'; ctx.beginPath(); ctx.ellipse(potX,H*0.88,22,28,0,0,Math.PI*2); ctx.fill();
  ctx.fillStyle='rgba(255,210,30,0.65)';
  for(let g=0;g<8;g++){ctx.beginPath();ctx.arc(potX+Math.cos(g*Math.PI/4)*14,H*0.88+Math.sin(g*Math.PI/4)*12,4,0,Math.PI*2);ctx.fill();}
}

function drawSign(ctx, x, y, hit) {
  const cx = x + 20, cy = y + 15;
  // Stâlp metalic cu gradient
  const poleGrad = ctx.createLinearGradient(x + 16, 0, x + 26, 0);
  poleGrad.addColorStop(0, '#aaa'); poleGrad.addColorStop(0.5, '#eee'); poleGrad.addColorStop(1, '#888');
  ctx.fillStyle = poleGrad;
  ctx.beginPath(); ctx.roundRect(x + 17, y + (hit ? 14 : 28), 7, hit ? 36 : 24, 2); ctx.fill();

  if (hit) {
    // Semn spart — înclinat
    ctx.save(); ctx.translate(cx, cy); ctx.rotate(0.35);
    ctx.fillStyle = '#667';
    ctx.beginPath(); ctx.roundRect(-20, -14, 40, 28, 4); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.15)';
    ctx.beginPath(); ctx.roundRect(-20, -14, 40, 5, [4,4,0,0]); ctx.fill();
    ctx.fillStyle = '#ccd'; ctx.font = 'bold 12px Nunito, sans-serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('+10 🪙', 0, 1);
    ctx.restore();
    // Scântei
    for (let i = 0; i < 5; i++) {
      ctx.fillStyle = '#f7c948';
      ctx.beginPath(); ctx.arc(cx - 10 + i * 5, cy - 18 - i * 3, 2, 0, Math.PI*2); ctx.fill();
    }
  } else {
    // Semn normal — neon luminos
    ctx.save();
    ctx.shadowColor = '#4488ff'; ctx.shadowBlur = 16;
    ctx.fillStyle = '#1a3a8a';
    ctx.beginPath(); ctx.roundRect(x, y, 40, 28, 6); ctx.fill();
    ctx.shadowBlur = 0;
    // Border neon
    ctx.strokeStyle = '#4af'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.roundRect(x + 1, y + 1, 38, 26, 5); ctx.stroke();
    // Top shine
    ctx.fillStyle = 'rgba(100,200,255,0.25)';
    ctx.beginPath(); ctx.roundRect(x + 2, y + 2, 36, 10, [4,4,0,0]); ctx.fill();
    // Steaua și valoarea
    ctx.fillStyle = '#f7c948';
    ctx.font = '14px sans-serif'; ctx.textAlign = 'left'; ctx.textBaseline = 'top';
    ctx.fillText('★', x + 6, y + 7);
    ctx.fillStyle = '#fff'; ctx.font = 'bold 11px Nunito, sans-serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('+10', x + 26, y + 15);
    ctx.shadowBlur = 0; ctx.restore();
  }
}

function drawExit(ctx, x, y) {
  if (x < -150 || x > 9999) return;
  const W = 80, roofH = 20;
  const wave = Math.sin(Date.now() * 0.004) * 10;

  // Glow verde sub platforma finish
  ctx.save();
  ctx.shadowColor = '#2ecc71'; ctx.shadowBlur = 20;
  ctx.fillStyle = '#27ae60';
  ctx.beginPath(); ctx.roundRect(x, y, W, roofH, [4,4,0,0]); ctx.fill();
  ctx.shadowBlur = 0; ctx.restore();

  // Dungă verde sus
  ctx.fillStyle = '#2ecc71';
  ctx.beginPath(); ctx.roundRect(x, y, W, 5, [4,4,0,0]); ctx.fill();

  // Halo verde în jurul platformei
  ctx.fillStyle = 'rgba(46,204,113,0.15)';
  ctx.beginPath(); ctx.roundRect(x - 6, y - 6, W + 12, roofH + 12, 8); ctx.fill();

  // Pătrate alb-negru (finish line)
  const sq = 10;
  for (let i = 0; i < 8; i++) {
    ctx.fillStyle = i % 2 === 0 ? 'rgba(255,255,255,0.65)' : 'rgba(0,0,0,0.35)';
    ctx.fillRect(x + i * sq, y + 5, sq, roofH / 2);
  }

  // Stâlp steag
  const poleGrad = ctx.createLinearGradient(x + W/2 - 2, 0, x + W/2 + 2, 0);
  poleGrad.addColorStop(0, '#999'); poleGrad.addColorStop(0.5, '#eee'); poleGrad.addColorStop(1, '#777');
  ctx.fillStyle = poleGrad;
  ctx.beginPath(); ctx.roundRect(x + W/2 - 2, y - 72, 5, 72, 2); ctx.fill();

  // Steag animat
  ctx.save();
  ctx.shadowColor = '#e74c3c'; ctx.shadowBlur = 10;
  ctx.fillStyle = '#e74c3c';
  ctx.beginPath();
  ctx.moveTo(x + W/2 + 3, y - 70);
  ctx.quadraticCurveTo(x + W/2 + 20 + wave * 0.5, y - 62, x + W/2 + 3, y - 54);
  ctx.closePath(); ctx.fill();
  // Detaliu steag - dungă albă
  ctx.fillStyle = 'rgba(255,255,255,0.4)';
  ctx.beginPath();
  ctx.moveTo(x + W/2 + 3, y - 70);
  ctx.quadraticCurveTo(x + W/2 + 20 + wave * 0.5, y - 62, x + W/2 + 18 + wave * 0.5, y - 61);
  ctx.lineTo(x + W/2 + 3, y - 66);
  ctx.closePath(); ctx.fill();
  ctx.shadowBlur = 0; ctx.restore();

  // Text FINISH cu glow
  ctx.save();
  ctx.shadowColor = '#f7c948'; ctx.shadowBlur = 12;
  ctx.fillStyle = '#f7c948';
  ctx.font = 'bold 14px Nunito, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('🏁 FINISH', x + W/2, y - 78);
  ctx.shadowBlur = 0; ctx.restore();
  ctx.textAlign = 'left';
}

// ─── GAME OVER / WIN ────────────────────────────────────────
function gameOver() {
  gs.over = true;
  showScreen('screen-over');
  document.getElementById('over-score').textContent = `Scor final: ${gs.score} puncte`;
}

function win() {
  gs.won = true;
  showScreen('screen-win');
  document.getElementById('win-score').textContent = `Scor total: ${gs.score} puncte`;
}

document.getElementById('btn-retry').addEventListener('click', () => {
  startGame(gs.charId);
});
document.getElementById('btn-over-menu').addEventListener('click', () => {
  showScreen('screen-cover');
});
document.getElementById('btn-win-menu').addEventListener('click', () => {
  showScreen('screen-cover');
});

// ─── SHOP ───────────────────────────────────────────────────
let shopReturnScreen = 'screen-chars';

function openShop(returnTo) {
  shopReturnScreen = returnTo;
  renderShop();
  showScreen('screen-shop');
}

function renderShop() {
  document.getElementById('shop-coins-display').textContent = shopState.coins;

  // Char selector
  document.querySelectorAll('.shop-char-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.char === shopState.shopChar);
  });

  // Preview canvas
  const previewCanvas = document.getElementById('shop-char-preview');
  const pctx = previewCanvas.getContext('2d');
  pctx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
  drawCharacter(pctx, shopState.shopChar, previewCanvas.width / 2, previewCanvas.height - 10, 1.1, 0);

  // Category tabs
  let tabsEl = document.getElementById('shop-cat-tabs');
  if (!tabsEl) {
    tabsEl = document.createElement('div');
    tabsEl.id = 'shop-cat-tabs';
    tabsEl.className = 'shop-cat-tabs';
    const list0 = document.getElementById('shop-items-list');
    list0.parentNode.insertBefore(tabsEl, list0);
  }
  tabsEl.innerHTML = '';
  for (const cat of SHOP_CATS) {
    const btn = document.createElement('button');
    btn.className = 'shop-cat-btn' + (cat.id === shopState.shopCat ? ' active' : '');
    btn.textContent = cat.label;
    btn.addEventListener('click', () => { shopState.shopCat = cat.id; renderShop(); });
    tabsEl.appendChild(btn);
  }

  // Items (filtered by category)
  const list = document.getElementById('shop-items-list');
  list.innerHTML = '';
  for (const item of SHOP_ITEMS.filter(i => i.cat === shopState.shopCat)) {
    const owned = !!shopState.owned[item.id];
    const equipped = (shopState.equipped[shopState.shopChar] || []).includes(item.id);
    const div = document.createElement('div');
    div.className = 'shop-item' + (equipped ? ' equipped' : (owned ? ' owned' : ''));
    div.innerHTML = `
      <div class="shop-item-icon">${item.icon}</div>
      <div class="shop-item-name">${item.name}</div>
      ${owned
        ? `<div class="shop-item-status">✓ Deținut</div>
           <button class="shop-item-btn ${equipped ? 'unequip' : 'equip'}" data-id="${item.id}">
             ${equipped ? 'Scoate' : 'Pune'}
           </button>`
        : `<div class="shop-item-price">🪙 ${item.price}</div>
           <button class="shop-item-btn buy" data-id="${item.id}" ${shopState.coins < item.price ? 'disabled' : ''}>
             Cumpără
           </button>`
      }
    `;
    list.appendChild(div);
  }

  // Item button events
  list.querySelectorAll('.shop-item-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const item = SHOP_ITEMS.find(i => i.id === id);
      if (btn.classList.contains('buy')) {
        if (shopState.coins >= item.price && !shopState.owned[id]) {
          shopState.coins -= item.price;
          shopState.owned[id] = true;
          // Auto-equip on current char
          if (!shopState.equipped[shopState.shopChar].includes(id)) {
            shopState.equipped[shopState.shopChar].push(id);
          }
          saveShopState();
          renderShop();
          if (document.getElementById('hud-coins'))
            document.getElementById('hud-coins').textContent = shopState.coins;
        }
      } else if (btn.classList.contains('equip')) {
        if (!shopState.equipped[shopState.shopChar].includes(id)) {
          shopState.equipped[shopState.shopChar].push(id);
        }
        saveShopState();
        renderShop();
      } else if (btn.classList.contains('unequip')) {
        shopState.equipped[shopState.shopChar] =
          shopState.equipped[shopState.shopChar].filter(x => x !== id);
        saveShopState();
        renderShop();
      }
    });
  });
}

document.querySelectorAll('.shop-char-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    shopState.shopChar = btn.dataset.char;
    if (!Array.isArray(shopState.equipped[shopState.shopChar])) {
      shopState.equipped[shopState.shopChar] = [];
    }
    saveShopState();
    renderShop();
  });
});

document.getElementById('btn-open-shop-chars').addEventListener('click', () => {
  openShop('screen-chars');
});
document.getElementById('btn-open-shop-game').addEventListener('click', () => {
  gs.over = true; // pause game loop
  openShop('screen-game');
});
document.getElementById('btn-close-shop').addEventListener('click', () => {
  if (shopReturnScreen === 'screen-game') {
    gs.over = false;
    showScreen('screen-game');
    requestAnimationFrame(gameLoop);
  } else {
    showScreen(shopReturnScreen);
  }
});

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

// ─── COVER CANVAS ──────────────────────────────────────────
(function initCover() {
  const canvas = document.getElementById('cover-canvas');
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    drawCover();
  }

  function drawCover() {
    const W = canvas.width, H = canvas.height;

    // Sky gradient
    const sky = ctx.createLinearGradient(0, 0, 0, H);
    sky.addColorStop(0, '#87ceeb');
    sky.addColorStop(0.6, '#c9e8f5');
    sky.addColorStop(1, '#ffd580');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, W, H);

    // Sun
    ctx.fillStyle = '#ffe066';
    ctx.shadowColor = '#ffcc00';
    ctx.shadowBlur = 40;
    ctx.beginPath();
    ctx.arc(W * 0.78, H * 0.18, 55, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Buildings (background layer — lighter)
    drawBuildings(ctx, W, H, 0.62, 0.55, '#b0c8e0', 14);
    // Buildings (foreground layer — darker)
    drawBuildings(ctx, W, H, 0.72, 0.42, '#1a3a5c', 10);

    // Road at bottom
    ctx.fillStyle = '#2d2d2d';
    ctx.fillRect(0, H * 0.87, W, H * 0.13);
    // Road lines
    ctx.strokeStyle = '#fff';
    ctx.setLineDash([40, 30]);
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, H * 0.93);
    ctx.lineTo(W, H * 0.93);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  function drawBuildings(ctx, W, H, baseY, minH, color, count) {
    const seed = color.length * 7;
    for (let i = 0; i < count; i++) {
      const t = i / count;
      const bx = (t * W * 1.1) - W * 0.05 + ((seed * (i + 3)) % 60) - 30;
      const bw = 40 + ((seed * (i * 3 + 7)) % 80);
      const bh = minH * H + ((seed * (i * 7 + 11)) % (H * 0.2));
      const by = baseY * H - bh;

      ctx.fillStyle = color;
      ctx.fillRect(bx, by, bw, bh);

      // Windows
      ctx.fillStyle = 'rgba(255,240,150,0.35)';
      const cols = Math.floor(bw / 14);
      const rows = Math.floor(bh / 18);
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (((i + r + c) * 3) % 5 !== 0) {
            ctx.fillRect(bx + 6 + c * 14, by + 8 + r * 18, 7, 9);
          }
        }
      }
    }
  }

  window.addEventListener('resize', resize);
  resize();
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
      setTimeout(() => startGame(id), 350);
    });
  });

  // Personajele stau static pe ecranul de selectie (frame=0)
}

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

let shopState = {
  coins: 0,
  owned: {},
  equipped: { girl1: [], girl2: [], boy1: [], boy2: [] },
  shopChar: 'girl1',
  shopCat: 'ochelari',
};

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

function makeLevels() {
  return [
    // Nivel 1
    {
      width: 1800,
      spawn: { x: 80, y: 400 },
      exit:  { x: 1700, y: 300 },
      platforms: [
        { x: 0,    y: 480, w: 400, h: 20 },
        { x: 450,  y: 430, w: 200, h: 20 },
        { x: 700,  y: 380, w: 180, h: 20 },
        { x: 930,  y: 340, w: 160, h: 20 },
        { x: 1140, y: 300, w: 200, h: 20 },
        { x: 1380, y: 340, w: 180, h: 20 },
        { x: 1550, y: 300, w: 220, h: 20 },
        // cale alternativa de jos
        { x: 600,  y: 470, w: 120, h: 20 },
        { x: 780,  y: 460, w: 120, h: 20 },
        { x: 960,  y: 450, w: 140, h: 20 },
      ],
      signs: [
        { x: 510, y: 390 }, { x: 760, y: 340 }, { x: 990, y: 300 }, { x: 1450, y: 300 },
      ],
      coins: [
        { x: 150, y: 450 }, { x: 200, y: 450 }, { x: 250, y: 450 },
        { x: 500, y: 395 }, { x: 550, y: 395 },
        { x: 750, y: 345 }, { x: 800, y: 345 },
        { x: 970, y: 305 }, { x: 1020, y: 305 },
        { x: 1200, y: 265 }, { x: 1250, y: 265 },
        { x: 1420, y: 305 }, { x: 1470, y: 305 },
        { x: 630, y: 435 }, { x: 820, y: 425 }, { x: 1000, y: 415 },
      ],
    },
    // Nivel 2
    {
      width: 2000,
      spawn: { x: 80, y: 400 },
      exit:  { x: 1880, y: 200 },
      platforms: [
        { x: 0,    y: 480, w: 300, h: 20 },
        { x: 350,  y: 420, w: 120, h: 20 },
        { x: 530,  y: 360, w: 120, h: 20 },
        { x: 710,  y: 300, w: 120, h: 20 },
        { x: 890,  y: 240, w: 160, h: 20 },
        { x: 1100, y: 290, w: 120, h: 20 },
        { x: 1280, y: 240, w: 140, h: 20 },
        { x: 1470, y: 200, w: 160, h: 20 },
        { x: 1680, y: 230, w: 200, h: 20 },
        { x: 1830, y: 200, w: 120, h: 20 },
        // cale alternativa
        { x: 450,  y: 470, w: 100, h: 20 },
        { x: 620,  y: 460, w: 100, h: 20 },
        { x: 800,  y: 450, w: 100, h: 20 },
      ],
      signs: [
        { x: 400, y: 380 }, { x: 590, y: 320 }, { x: 770, y: 260 },
        { x: 1340, y: 200 }, { x: 1530, y: 160 },
      ],
      coins: [
        { x: 100, y: 445 }, { x: 150, y: 445 }, { x: 200, y: 445 },
        { x: 380, y: 385 }, { x: 420, y: 385 },
        { x: 560, y: 325 }, { x: 600, y: 325 },
        { x: 740, y: 265 }, { x: 780, y: 265 },
        { x: 930, y: 205 }, { x: 970, y: 205 },
        { x: 1140, y: 255 }, { x: 1180, y: 255 },
        { x: 1490, y: 165 }, { x: 1530, y: 165 },
        { x: 480, y: 435 }, { x: 660, y: 425 }, { x: 840, y: 415 },
      ],
    },
    // Nivel 3
    {
      width: 2200,
      spawn: { x: 80, y: 420 },
      exit:  { x: 2100, y: 250 },
      platforms: [
        { x: 0,    y: 480, w: 250, h: 20 },
        { x: 300,  y: 440, w: 100, h: 20 },
        { x: 460,  y: 390, w: 100, h: 20 },
        { x: 620,  y: 340, w: 100, h: 20 },
        { x: 780,  y: 290, w: 100, h: 20 },
        { x: 940,  y: 350, w: 100, h: 20 },
        { x: 1100, y: 300, w: 150, h: 20 },
        { x: 1310, y: 250, w: 100, h: 20 },
        { x: 1480, y: 300, w: 100, h: 20 },
        { x: 1640, y: 250, w: 120, h: 20 },
        { x: 1820, y: 270, w: 200, h: 20 },
        { x: 2020, y: 250, w: 150, h: 20 },
      ],
      signs: [
        { x: 350, y: 400 }, { x: 840, y: 250 }, { x: 960, y: 310 },
        { x: 1150, y: 260 }, { x: 1700, y: 210 },
      ],
      coins: [
        { x: 120, y: 445 }, { x: 170, y: 445 },
        { x: 330, y: 405 }, { x: 500, y: 355 }, { x: 660, y: 305 },
        { x: 820, y: 255 }, { x: 980, y: 315 }, { x: 1140, y: 265 },
        { x: 1360, y: 215 }, { x: 1680, y: 235 }, { x: 1870, y: 235 },
        { x: 2060, y: 215 },
      ],
    },
    // Nivel 4 — platforme mai mici, mai sus
    {
      width: 2400,
      spawn: { x: 80, y: 420 },
      exit:  { x: 2300, y: 200 },
      platforms: [
        { x: 0,    y: 480, w: 200, h: 20 },
        { x: 280,  y: 430, w: 90,  h: 20 },
        { x: 440,  y: 370, w: 90,  h: 20 },
        { x: 600,  y: 310, w: 90,  h: 20 },
        { x: 760,  y: 360, w: 90,  h: 20 },
        { x: 920,  y: 300, w: 90,  h: 20 },
        { x: 1080, y: 250, w: 90,  h: 20 },
        { x: 1240, y: 300, w: 90,  h: 20 },
        { x: 1400, y: 240, w: 90,  h: 20 },
        { x: 1560, y: 290, w: 90,  h: 20 },
        { x: 1720, y: 230, w: 90,  h: 20 },
        { x: 1880, y: 200, w: 90,  h: 20 },
        { x: 2040, y: 230, w: 110, h: 20 },
        { x: 2200, y: 200, w: 150, h: 20 },
      ],
      signs: [
        { x: 340, y: 390 }, { x: 660, y: 270 }, { x: 980, y: 260 },
        { x: 1460, y: 200 }, { x: 2100, y: 190 },
      ],
      coins: [
        { x: 300, y: 395 }, { x: 460, y: 335 }, { x: 620, y: 275 },
        { x: 780, y: 325 }, { x: 940, y: 265 }, { x: 1100, y: 215 },
        { x: 1260, y: 265 }, { x: 1420, y: 205 }, { x: 1580, y: 255 },
        { x: 1740, y: 195 }, { x: 1900, y: 165 }, { x: 2060, y: 195 },
        { x: 2220, y: 165 },
      ],
    },
    // Nivel 5
    {
      width: 2600,
      spawn: { x: 80, y: 400 },
      exit:  { x: 2500, y: 180 },
      platforms: [
        { x: 0,    y: 480, w: 220, h: 20 },
        { x: 260,  y: 420, w: 80,  h: 20 },
        { x: 410,  y: 360, w: 80,  h: 20 },
        { x: 560,  y: 410, w: 80,  h: 20 },
        { x: 710,  y: 350, w: 80,  h: 20 },
        { x: 860,  y: 290, w: 80,  h: 20 },
        { x: 1010, y: 240, w: 80,  h: 20 },
        { x: 1160, y: 290, w: 80,  h: 20 },
        { x: 1310, y: 230, w: 80,  h: 20 },
        { x: 1480, y: 280, w: 80,  h: 20 },
        { x: 1640, y: 220, w: 80,  h: 20 },
        { x: 1800, y: 260, w: 80,  h: 20 },
        { x: 1960, y: 200, w: 80,  h: 20 },
        { x: 2130, y: 230, w: 80,  h: 20 },
        { x: 2300, y: 190, w: 80,  h: 20 },
        { x: 2450, y: 180, w: 120, h: 20 },
      ],
      signs: [
        { x: 620, y: 370 }, { x: 920, y: 250 }, { x: 1370, y: 190 },
        { x: 1700, y: 180 }, { x: 2360, y: 150 },
      ],
      coins: [
        { x: 280, y: 385 }, { x: 430, y: 325 }, { x: 580, y: 375 },
        { x: 730, y: 315 }, { x: 880, y: 255 }, { x: 1030, y: 205 },
        { x: 1180, y: 255 }, { x: 1330, y: 195 }, { x: 1500, y: 245 },
        { x: 1660, y: 185 }, { x: 1820, y: 225 }, { x: 1980, y: 165 },
        { x: 2150, y: 195 }, { x: 2320, y: 155 }, { x: 2470, y: 145 },
      ],
    },
    // Nivel 6 — platforme cu goluri mari
    {
      width: 2800,
      spawn: { x: 80, y: 420 },
      exit:  { x: 2700, y: 200 },
      platforms: [
        { x: 0,    y: 480, w: 200, h: 20 },
        { x: 300,  y: 430, w: 80,  h: 20 },
        { x: 500,  y: 380, w: 80,  h: 20 },
        { x: 700,  y: 330, w: 80,  h: 20 },
        { x: 920,  y: 280, w: 80,  h: 20 },
        { x: 1140, y: 240, w: 80,  h: 20 },
        { x: 1360, y: 280, w: 80,  h: 20 },
        { x: 1560, y: 220, w: 80,  h: 20 },
        { x: 1760, y: 270, w: 80,  h: 20 },
        { x: 1960, y: 210, w: 80,  h: 20 },
        { x: 2180, y: 250, w: 80,  h: 20 },
        { x: 2400, y: 200, w: 80,  h: 20 },
        { x: 2600, y: 200, w: 160, h: 20 },
      ],
      signs: [
        { x: 360, y: 390 }, { x: 760, y: 290 }, { x: 1200, y: 200 },
        { x: 1620, y: 180 }, { x: 2460, y: 160 },
      ],
      coins: [
        { x: 320, y: 395 }, { x: 520, y: 345 }, { x: 720, y: 295 },
        { x: 940, y: 245 }, { x: 1160, y: 205 }, { x: 1380, y: 245 },
        { x: 1580, y: 185 }, { x: 1780, y: 235 }, { x: 1980, y: 175 },
        { x: 2200, y: 215 }, { x: 2420, y: 165 }, { x: 2620, y: 165 },
      ],
    },
    // Nivel 7
    {
      width: 3000,
      spawn: { x: 80, y: 420 },
      exit:  { x: 2900, y: 180 },
      platforms: [
        { x: 0,    y: 480, w: 180, h: 20 },
        { x: 250,  y: 420, w: 70,  h: 20 },
        { x: 420,  y: 360, w: 70,  h: 20 },
        { x: 600,  y: 310, w: 70,  h: 20 },
        { x: 790,  y: 360, w: 70,  h: 20 },
        { x: 980,  y: 300, w: 70,  h: 20 },
        { x: 1170, y: 250, w: 70,  h: 20 },
        { x: 1360, y: 300, w: 70,  h: 20 },
        { x: 1550, y: 240, w: 70,  h: 20 },
        { x: 1740, y: 290, w: 70,  h: 20 },
        { x: 1930, y: 230, w: 70,  h: 20 },
        { x: 2130, y: 200, w: 70,  h: 20 },
        { x: 2330, y: 230, w: 70,  h: 20 },
        { x: 2530, y: 190, w: 70,  h: 20 },
        { x: 2730, y: 200, w: 70,  h: 20 },
        { x: 2850, y: 180, w: 120, h: 20 },
      ],
      signs: [
        { x: 450, y: 320 }, { x: 840, y: 320 }, { x: 1230, y: 210 },
        { x: 1610, y: 200 }, { x: 2590, y: 150 },
      ],
      coins: [
        { x: 270, y: 385 }, { x: 440, y: 325 }, { x: 620, y: 275 },
        { x: 810, y: 325 }, { x: 1000, y: 265 }, { x: 1190, y: 215 },
        { x: 1380, y: 265 }, { x: 1570, y: 205 }, { x: 1760, y: 255 },
        { x: 1950, y: 195 }, { x: 2150, y: 165 }, { x: 2350, y: 195 },
        { x: 2550, y: 155 }, { x: 2770, y: 165 }, { x: 2870, y: 145 },
      ],
    },
    // Nivel 8
    {
      width: 3200,
      spawn: { x: 80, y: 420 },
      exit:  { x: 3100, y: 170 },
      platforms: [
        { x: 0,    y: 480, w: 160, h: 20 },
        { x: 230,  y: 430, w: 65,  h: 20 },
        { x: 410,  y: 370, w: 65,  h: 20 },
        { x: 600,  y: 320, w: 65,  h: 20 },
        { x: 800,  y: 280, w: 65,  h: 20 },
        { x: 1000, y: 330, w: 65,  h: 20 },
        { x: 1200, y: 270, w: 65,  h: 20 },
        { x: 1400, y: 230, w: 65,  h: 20 },
        { x: 1600, y: 280, w: 65,  h: 20 },
        { x: 1800, y: 220, w: 65,  h: 20 },
        { x: 2010, y: 270, w: 65,  h: 20 },
        { x: 2220, y: 210, w: 65,  h: 20 },
        { x: 2440, y: 240, w: 65,  h: 20 },
        { x: 2660, y: 190, w: 65,  h: 20 },
        { x: 2890, y: 200, w: 65,  h: 20 },
        { x: 3050, y: 170, w: 120, h: 20 },
      ],
      signs: [
        { x: 470, y: 330 }, { x: 860, y: 240 }, { x: 1260, y: 230 },
        { x: 1860, y: 180 }, { x: 2720, y: 150 },
      ],
      coins: [
        { x: 250, y: 395 }, { x: 430, y: 335 }, { x: 620, y: 285 },
        { x: 820, y: 245 }, { x: 1020, y: 295 }, { x: 1220, y: 235 },
        { x: 1420, y: 195 }, { x: 1620, y: 245 }, { x: 1820, y: 185 },
        { x: 2030, y: 235 }, { x: 2240, y: 175 }, { x: 2460, y: 205 },
        { x: 2680, y: 155 }, { x: 2910, y: 165 }, { x: 3070, y: 135 },
      ],
    },
    // Nivel 9 — zigzag rapid
    {
      width: 3500,
      spawn: { x: 80, y: 400 },
      exit:  { x: 3400, y: 160 },
      platforms: [
        { x: 0,    y: 480, w: 150, h: 20 },
        { x: 210,  y: 420, w: 60,  h: 20 },
        { x: 380,  y: 360, w: 60,  h: 20 },
        { x: 550,  y: 420, w: 60,  h: 20 },
        { x: 720,  y: 360, w: 60,  h: 20 },
        { x: 890,  y: 300, w: 60,  h: 20 },
        { x: 1060, y: 360, w: 60,  h: 20 },
        { x: 1230, y: 300, w: 60,  h: 20 },
        { x: 1400, y: 250, w: 60,  h: 20 },
        { x: 1570, y: 300, w: 60,  h: 20 },
        { x: 1740, y: 240, w: 60,  h: 20 },
        { x: 1910, y: 200, w: 60,  h: 20 },
        { x: 2090, y: 240, w: 60,  h: 20 },
        { x: 2270, y: 190, w: 60,  h: 20 },
        { x: 2460, y: 230, w: 60,  h: 20 },
        { x: 2650, y: 180, w: 60,  h: 20 },
        { x: 2850, y: 210, w: 60,  h: 20 },
        { x: 3060, y: 170, w: 60,  h: 20 },
        { x: 3260, y: 180, w: 60,  h: 20 },
        { x: 3380, y: 160, w: 100, h: 20 },
      ],
      signs: [
        { x: 610, y: 380 }, { x: 950, y: 260 }, { x: 1460, y: 210 },
        { x: 1970, y: 160 }, { x: 3120, y: 130 },
      ],
      coins: [
        { x: 230, y: 385 }, { x: 400, y: 325 }, { x: 570, y: 385 },
        { x: 740, y: 325 }, { x: 910, y: 265 }, { x: 1080, y: 325 },
        { x: 1250, y: 265 }, { x: 1420, y: 215 }, { x: 1590, y: 265 },
        { x: 1760, y: 205 }, { x: 1930, y: 165 }, { x: 2110, y: 205 },
        { x: 2290, y: 155 }, { x: 2480, y: 195 }, { x: 2670, y: 145 },
        { x: 2880, y: 175 }, { x: 3100, y: 135 }, { x: 3300, y: 145 },
        { x: 3420, y: 125 },
      ],
    },
    // Nivel 10 — final
    {
      width: 4000,
      spawn: { x: 80, y: 400 },
      exit:  { x: 3880, y: 150 },
      platforms: [
        { x: 0,    y: 480, w: 180, h: 20 },
        { x: 240,  y: 430, w: 60,  h: 20 },
        { x: 410,  y: 370, w: 60,  h: 20 },
        { x: 580,  y: 310, w: 60,  h: 20 },
        { x: 760,  y: 370, w: 60,  h: 20 },
        { x: 940,  y: 310, w: 60,  h: 20 },
        { x: 1120, y: 260, w: 60,  h: 20 },
        { x: 1300, y: 200, w: 60,  h: 20 },
        { x: 1480, y: 260, w: 60,  h: 20 },
        { x: 1660, y: 200, w: 60,  h: 20 },
        { x: 1860, y: 240, w: 60,  h: 20 },
        { x: 2060, y: 190, w: 60,  h: 20 },
        { x: 2280, y: 230, w: 60,  h: 20 },
        { x: 2500, y: 180, w: 60,  h: 20 },
        { x: 2720, y: 220, w: 60,  h: 20 },
        { x: 2940, y: 170, w: 60,  h: 20 },
        { x: 3160, y: 210, w: 60,  h: 20 },
        { x: 3380, y: 170, w: 60,  h: 20 },
        { x: 3600, y: 200, w: 60,  h: 20 },
        { x: 3820, y: 150, w: 140, h: 20 },
      ],
      signs: [
        { x: 640, y: 270 }, { x: 1000, y: 270 }, { x: 1360, y: 160 },
        { x: 1720, y: 160 }, { x: 2120, y: 150 }, { x: 2560, y: 140 },
        { x: 3440, y: 130 },
      ],
      coins: [
        { x: 260, y: 395 }, { x: 430, y: 335 }, { x: 600, y: 275 },
        { x: 780, y: 335 }, { x: 960, y: 275 }, { x: 1140, y: 225 },
        { x: 1320, y: 165 }, { x: 1500, y: 225 }, { x: 1680, y: 165 },
        { x: 1880, y: 205 }, { x: 2080, y: 155 }, { x: 2300, y: 195 },
        { x: 2520, y: 145 }, { x: 2740, y: 185 }, { x: 2960, y: 135 },
        { x: 3180, y: 175 }, { x: 3400, y: 135 }, { x: 3620, y: 165 },
        { x: 3840, y: 115 },
      ],
    },
  ];
}

// ─── START GAME ─────────────────────────────────────────────
function startGame(charId) {
  showScreen('screen-game');
  const canvas = document.getElementById('game-canvas');

  gs = {
    charId: charId,
    levels: makeLevels(),
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
    jumpsLeft: 2,
  };
  gs.cameraX = 0;

  document.getElementById('hud-level').textContent = `Nivel ${gs.levelIdx + 1} / 10`;
  updateHUD();
}

function updateHUD() {
  document.getElementById('hud-lives').textContent = '❤️'.repeat(gs.lives) + '🖤'.repeat(Math.max(0, 4 - gs.lives));
  document.getElementById('hud-score').textContent = gs.score;
  document.getElementById('hud-coins').textContent = shopState.coins;
}

// ─── INPUT ──────────────────────────────────────────────────
function bindKeys() {
  window.addEventListener('keydown', e => {
    if (e.repeat) return;
    gs.keys[e.key] = true;
    if (e.key === ' ') {
      e.preventDefault();
      gs.keys['_jumpPressed'] = true;
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      tryHitSign();
    }
  });
  window.addEventListener('keyup', e => { gs.keys[e.key] = false; });
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

// ─── GAME LOOP ───────────────────────────────────────────────
function gameLoop() {
  if (gs.over || gs.won) return;
  const canvas = document.getElementById('game-canvas');
  const ctx = canvas.getContext('2d');

  update();
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
      if (p.vy > 0) { p.y = pl.y - p.h; p.onGround = true; p.jumpsLeft = 2; }
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
      shopState.coins++;
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
    // Respawn
    p.x = lvl.spawn.x;
    p.y = lvl.spawn.y;
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

  // Sky
  const sky = ctx.createLinearGradient(0, 0, 0, H);
  sky.addColorStop(0, '#87ceeb');
  sky.addColorStop(0.7, '#c9e8f5');
  sky.addColorStop(1, '#ffd580');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, W, H);

  // Background buildings (parallax)
  drawBgBuildings(ctx, W, H, cam * 0.3);

  // Platforms
  for (const pl of lvl.platforms) {
    const px = pl.x - cam;
    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.fillRect(px + 4, pl.y + 4, pl.w, pl.h);
    // Top surface
    ctx.fillStyle = '#3a5a7c';
    ctx.fillRect(px, pl.y, pl.w, pl.h);
    // Top highlight
    ctx.fillStyle = '#4a7aaa';
    ctx.fillRect(px, pl.y, pl.w, 4);
    // Grid pattern
    ctx.strokeStyle = 'rgba(0,0,0,0.15)';
    ctx.lineWidth = 1;
    for (let gx = px; gx < px + pl.w; gx += 32) {
      ctx.beginPath(); ctx.moveTo(gx, pl.y); ctx.lineTo(gx, pl.y + pl.h); ctx.stroke();
    }
  }

  // Coins
  for (const coin of lvl.coins) {
    if (coin.collected) continue;
    const cx = coin.x - cam;
    if (cx < -30 || cx > W + 30) continue;
    // Outer glow
    ctx.fillStyle = 'rgba(255,215,0,0.25)';
    ctx.beginPath(); ctx.arc(cx + 9, coin.y + 9, 13, 0, Math.PI * 2); ctx.fill();
    // Coin body
    const cg = ctx.createRadialGradient(cx + 7, coin.y + 7, 1, cx + 9, coin.y + 9, 9);
    cg.addColorStop(0, '#ffe566');
    cg.addColorStop(1, '#e6a800');
    ctx.fillStyle = cg;
    ctx.beginPath(); ctx.arc(cx + 9, coin.y + 9, 9, 0, Math.PI * 2); ctx.fill();
    // Shine
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.beginPath(); ctx.ellipse(cx + 7, coin.y + 6, 3, 2, -0.4, 0, Math.PI * 2); ctx.fill();
    // Outline
    ctx.strokeStyle = '#cc8800';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(cx + 9, coin.y + 9, 9, 0, Math.PI * 2); ctx.stroke();
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

function drawSign(ctx, x, y, hit) {
  // Pole
  ctx.fillStyle = '#888';
  ctx.fillRect(x + 16, y, 8, 50);

  if (hit) {
    // Broken sign
    ctx.fillStyle = '#888';
    ctx.beginPath();
    ctx.moveTo(x, y); ctx.lineTo(x + 40, y + 5); ctx.lineTo(x + 38, y + 35); ctx.lineTo(x + 2, y + 30);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#aaa';
    ctx.font = 'bold 14px Nunito';
    ctx.fillText('+10', x + 5, y + 22);
  } else {
    // Normal sign — blue board
    ctx.fillStyle = '#2255aa';
    ctx.fillRect(x, y, 40, 30);
    ctx.fillStyle = '#4488ff';
    ctx.fillRect(x, y, 40, 4);
    // Star icon
    ctx.fillStyle = '#f7c948';
    ctx.font = '16px sans-serif';
    ctx.fillText('★', x + 12, y + 22);
  }
}

function drawExit(ctx, x, y) {
  if (x < -150 || x > 9999) return;

  const W = 80, roofH = 20;

  // Building body below the rooftop
  ctx.fillStyle = '#1a3a5c';
  ctx.fillRect(x, y + roofH, W, 300);

  // Window grid on building
  ctx.fillStyle = 'rgba(255,240,100,0.3)';
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 3; col++) {
      ctx.fillRect(x + 8 + col * 24, y + roofH + 10 + row * 22, 14, 14);
    }
  }

  // Rooftop platform (glowing)
  ctx.fillStyle = '#27ae60';
  ctx.fillRect(x, y, W, roofH);
  ctx.fillStyle = '#2ecc71';
  ctx.fillRect(x, y, W, 4); // top highlight
  // Pulsing glow effect
  ctx.fillStyle = 'rgba(46,204,113,0.15)';
  ctx.fillRect(x - 4, y - 4, W + 8, roofH + 8);

  // Door on rooftop (arch style)
  ctx.fillStyle = '#f7c948';
  ctx.beginPath();
  ctx.roundRect(x + 26, y - 30, 28, 32, [8, 8, 0, 0]);
  ctx.fill();
  // Door glow
  ctx.fillStyle = 'rgba(247,201,72,0.3)';
  ctx.beginPath();
  ctx.roundRect(x + 22, y - 34, 36, 38, [10, 10, 0, 0]);
  ctx.fill();
  // Door frame
  ctx.strokeStyle = '#e67e22';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(x + 26, y - 30, 28, 32, [8, 8, 0, 0]);
  ctx.stroke();
  // Door knob
  ctx.fillStyle = '#e67e22';
  ctx.beginPath(); ctx.arc(x + 47, y - 14, 3, 0, Math.PI * 2); ctx.fill();
  // Door shine
  ctx.fillStyle = 'rgba(255,255,255,0.4)';
  ctx.fillRect(x + 29, y - 28, 6, 14);

  // "FINAL" label with arrow
  ctx.fillStyle = '#f7c948';
  ctx.font = 'bold 13px Nunito';
  ctx.textAlign = 'center';
  ctx.fillText('FINAL', x + W / 2, y - 36);
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 16px sans-serif';
  ctx.fillText('⬆', x + W / 2, y - 50);
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
          renderShop();
          if (document.getElementById('hud-coins'))
            document.getElementById('hud-coins').textContent = shopState.coins;
        }
      } else if (btn.classList.contains('equip')) {
        if (!shopState.equipped[shopState.shopChar].includes(id)) {
          shopState.equipped[shopState.shopChar].push(id);
        }
        renderShop();
      } else if (btn.classList.contains('unequip')) {
        shopState.equipped[shopState.shopChar] =
          shopState.equipped[shopState.shopChar].filter(x => x !== id);
        renderShop();
      }
    });
  });
}

document.querySelectorAll('.shop-char-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    shopState.shopChar = btn.dataset.char;
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

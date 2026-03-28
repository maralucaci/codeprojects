// ── State ──────────────────────────────────────────────
const SKIN = {
  light:  { face:'#ffe0c2', shadow:'#f5c09a', lip:'#e8a090' },
  medium: { face:'#f4a97f', shadow:'#d4845a', lip:'#c97060' },
  tan:    { face:'#c8733a', shadow:'#a05520', lip:'#9a4a30' },
  dark:   { face:'#7a4825', shadow:'#5a3010', lip:'#6a3820' },
};
const EYE_COLORS = {
  brown:'#6b3a2a', blue:'#3a7bd5', green:'#27ae60',
  purple:'#9b59b6', red:'#e74c3c', grey:'#7f8c8d',
  pink:'#e91e8c', gold:'#f0c040',
};
const HAIR_COLORS = {
  black:'#111', brown:'#6b3a2a', blonde:'#e8c96a', red:'#c0392b',
  pink:'#e91e8c', blue:'#3a7bd5', purple:'#9b59b6', white:'#e8e8e8',
  green:'#27ae60', orange:'#e67e22',
};
const BROW_COLORS = { black:'#111', brown:'#6b3a2a', blonde:'#c8a840', red:'#a02010' };
const LIP_COLORS = { natural:'#e8a090', red:'#c0392b', pink:'#e91e8c', purple:'#9b59b6', dark:'#7b2d2d' };
const TOP_COLORS = { white:'#eee', black:'#222', red:'#e74c3c', blue:'#3a7bd5', pink:'#e91e8c', green:'#27ae60', purple:'#9b59b6', yellow:'#f1c40f' };
const BOT_COLORS = { white:'#eee', black:'#222', blue:'#3a7bd5', red:'#e74c3c', pink:'#e91e8c', green:'#27ae60', purple:'#9b59b6' };

const BG_GRADIENTS = {
  pink:    ['#ffb3d9','#ff69b4'],
  blue:    ['#a8d8ff','#4a90d9'],
  purple:  ['#d4a8ff','#9b59b6'],
  green:   ['#a8ffce','#27ae60'],
  sunset:  ['#ffb347','#e74c3c'],
  night:   ['#1a1a2e','#16213e'],
  pastel:  ['#ffecd2','#fcb69f'],
  rainbow: ['#ff6b6b','#4d96ff'],
};

let state = defaultState();
let editingId = null; // id of character being edited (null = new)

function defaultState() {
  return {
    gender:'girl', skin:'light',
    eyeShape:'round', eyeColor:'blue',
    eyebrow:'arched', browColor:'black',
    hairStyle:'long_straight', hairColor:'pink',
    mouth:'smile', lipColor:'natural',
    top:'bra', topColor:'pink',
    bottom:'panties', bottomColor:'pink',
    accGlasses:false, accBow:false, accCatEars:false, accHeadband:false,
    accMask:false, accScarf:false, accWings:false, accHalo:false,
    accHorns:false, accTail:false,
    bg:'pink',
  };
}

// ── Storage ─────────────────────────────────────────────
function loadLibrary() {
  try { return JSON.parse(localStorage.getItem('op_library') || '[]'); }
  catch { return []; }
}
function saveLibrary(lib) {
  localStorage.setItem('op_library', JSON.stringify(lib));
}

// ── Screens ──────────────────────────────────────────────
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => {
    s.classList.toggle('active', s.id === id);
    s.style.display = s.id === id ? 'flex' : 'none';
  });
}

// ── Draw ─────────────────────────────────────────────────
function drawCharacter(canvas, s) {
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0, 0, W, H);

  const skin = SKIN[s.skin] || SKIN.light;
  const hairCol = HAIR_COLORS[s.hairColor] || '#111';
  const eyeCol  = EYE_COLORS[s.eyeColor]  || '#3a7bd5';
  const browCol = BROW_COLORS[s.browColor] || '#111';
  const lipCol  = LIP_COLORS[s.lipColor]  || '#e8a090';
  const topCol  = TOP_COLORS[s.topColor]  || '#3a7bd5';
  const botCol  = BOT_COLORS[s.bottomColor] || '#222';

  // Background
  const bgGrad = BG_GRADIENTS[s.bg] || BG_GRADIENTS.pink;
  const grad = ctx.createLinearGradient(0,0,W,H);
  grad.addColorStop(0, bgGrad[0]);
  grad.addColorStop(1, bgGrad[1]);
  ctx.fillStyle = grad;
  ctx.fillRect(0,0,W,H);

  // Decorative sparkles
  drawSparkles(ctx, W, H);

  const cx = W/2;
  const isGirl = s.gender !== 'boy';

  // ── Wings (behind body) ──
  if (s.accWings) drawWings(ctx, cx, 240, isGirl);

  // ── Tail ──
  if (s.accTail) drawTail(ctx, cx, 320, hairCol);

  // ── Body ──
  const bodyW = isGirl ? 80 : 90;
  const bodyH = isGirl ? 110 : 120;
  const bodyY = 250;
  ctx.fillStyle = skin.face;
  ctx.beginPath();
  rrect(ctx,cx - bodyW/2, bodyY, bodyW, bodyH, 8);
  ctx.fill();

  // ── Clothing: Bottom ── (botY = linia soldului)
  drawBottom(ctx, s.bottom, botCol, cx, bodyY + bodyH - 22, isGirl);

  // ── Clothing: Top ──
  drawTop(ctx, s.top, topCol, cx, bodyY, bodyW, bodyH, isGirl);

  // ── Neck ──
  ctx.fillStyle = skin.face;
  ctx.fillRect(cx - 12, bodyY - 16, 24, 22);

  // ── Head ──
  const headR = 60;
  const headY = bodyY - headR - 10;
  // shadow
  ctx.fillStyle = skin.shadow;
  ctx.beginPath();
  ctx.ellipse(cx + 4, headY + 4, headR - 2, headR - 2, 0, 0, Math.PI * 2);
  ctx.fill();
  // face
  ctx.fillStyle = skin.face;
  ctx.beginPath();
  ctx.ellipse(cx, headY, headR, headR, 0, 0, Math.PI * 2);
  ctx.fill();
  // chin detail
  ctx.fillStyle = skin.face;
  ctx.beginPath();
  ctx.ellipse(cx, headY + headR - 8, 30, 22, 0, 0, Math.PI);
  ctx.fill();

  // ── Hair (back layer) ──
  drawHairBack(ctx, s.hairStyle, hairCol, cx, headY, headR, isGirl);

  // ── Ears ──
  ctx.fillStyle = skin.face;
  ctx.beginPath(); ctx.ellipse(cx - headR + 2, headY + 5, 10, 14, 0, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(cx + headR - 2, headY + 5, 10, 14, 0, 0, Math.PI*2); ctx.fill();

  // ── Cat Ears ──
  if (s.accCatEars) drawCatEars(ctx, cx, headY, headR, hairCol);

  // ── Horns ──
  if (s.accHorns) drawHorns(ctx, cx, headY, headR);

  // ── Hair (front layer) ──
  drawHairFront(ctx, s.hairStyle, hairCol, cx, headY, headR, isGirl);

  // ── Eyes ──
  drawEyes(ctx, s.eyeShape, eyeCol, cx, headY, skin);

  // ── Eyebrows ──
  drawEyebrows(ctx, s.eyebrow, browCol, cx, headY);

  // ── Nose ──
  ctx.strokeStyle = skin.shadow;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(cx - 4, headY + 14);
  ctx.quadraticCurveTo(cx - 6, headY + 22, cx, headY + 20);
  ctx.stroke();

  // ── Mouth ──
  drawMouth(ctx, s.mouth, lipCol, cx, headY);

  // ── Blush ──
  ctx.globalAlpha = 0.35;
  ctx.fillStyle = '#ff9999';
  ctx.beginPath(); ctx.ellipse(cx - 30, headY + 20, 12, 7, 0, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(cx + 30, headY + 20, 12, 7, 0, 0, Math.PI*2); ctx.fill();
  ctx.globalAlpha = 1;

  // ── Accessories ──
  if (s.accHalo)     drawHalo(ctx, cx, headY, headR);
  if (s.accHeadband) drawHeadband(ctx, cx, headY, headR, topCol);
  if (s.accBow)      drawBow(ctx, cx, headY, headR, '#e91e8c');
  if (s.accGlasses)  drawGlasses(ctx, cx, headY);
  if (s.accMask)     drawMask(ctx, cx, headY, skin);
  if (s.accScarf)    drawScarf(ctx, cx, bodyY, topCol);

  // ── Arms ──
  ctx.fillStyle = skin.face;
  // left arm
  ctx.beginPath();
  rrect(ctx,cx - bodyW/2 - 18, bodyY + 10, 16, 60, 8);
  ctx.fill();
  // right arm
  ctx.beginPath();
  rrect(ctx,cx + bodyW/2 + 2, bodyY + 10, 16, 60, 8);
  ctx.fill();

  // ── Hands ──
  ctx.fillStyle = skin.face;
  ctx.beginPath(); ctx.ellipse(cx - bodyW/2 - 10, bodyY + 76, 10, 9, 0, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(cx + bodyW/2 + 10, bodyY + 76, 10, 9, 0, 0, Math.PI*2); ctx.fill();

  // ── Legs ──
  const legY = bodyY + bodyH;
  ctx.fillStyle = skin.face;
  ctx.beginPath(); rrect(ctx,cx - 28, legY, 22, 60, 8); ctx.fill();
  ctx.beginPath(); rrect(ctx,cx + 6, legY, 22, 60, 8);  ctx.fill();

  // Shoes
  ctx.fillStyle = '#333';
  ctx.beginPath(); ctx.ellipse(cx - 17, legY + 62, 16, 8, -0.1, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(cx + 17, legY + 62, 16, 8, 0.1, 0, Math.PI*2);  ctx.fill();
}

// ── Hair ─────────────────────────────────────────────────
function drawHairBack(ctx, style, col, cx, hy, hr, isGirl) {
  ctx.fillStyle = col;
  if (style === 'long_straight') {
    ctx.beginPath();
    ctx.moveTo(cx - hr + 5, hy - hr/2);
    ctx.lineTo(cx - hr - 10, hy + hr + 80);
    ctx.lineTo(cx - hr + 20, hy + hr + 90);
    ctx.lineTo(cx + hr - 20, hy + hr + 90);
    ctx.lineTo(cx + hr + 10, hy + hr + 80);
    ctx.lineTo(cx + hr - 5, hy - hr/2);
    ctx.fill();
  } else if (style === 'twin_tails') {
    // left tail
    ctx.beginPath();
    ctx.moveTo(cx - hr + 10, hy + 10);
    ctx.bezierCurveTo(cx - hr - 20, hy + 40, cx - hr - 30, hy + 80, cx - hr - 10, hy + 130);
    ctx.lineTo(cx - hr + 15, hy + 130);
    ctx.bezierCurveTo(cx - hr + 5, hy + 80, cx - hr + 5, hy + 40, cx - hr + 25, hy + 10);
    ctx.fill();
    // right tail
    ctx.beginPath();
    ctx.moveTo(cx + hr - 10, hy + 10);
    ctx.bezierCurveTo(cx + hr + 20, hy + 40, cx + hr + 30, hy + 80, cx + hr + 10, hy + 130);
    ctx.lineTo(cx + hr - 15, hy + 130);
    ctx.bezierCurveTo(cx + hr - 5, hy + 80, cx + hr - 5, hy + 40, cx + hr - 25, hy + 10);
    ctx.fill();
  } else if (style === 'ponytail') {
    ctx.beginPath();
    ctx.moveTo(cx + 10, hy - hr + 5);
    ctx.bezierCurveTo(cx + hr + 20, hy, cx + hr + 30, hy + 60, cx + hr + 5, hy + 120);
    ctx.lineTo(cx + hr - 10, hy + 120);
    ctx.bezierCurveTo(cx + hr + 10, hy + 55, cx + hr + 5, hy + 5, cx - 5, hy - hr + 8);
    ctx.fill();
  } else if (style === 'curly') {
    ctx.beginPath();
    ctx.moveTo(cx - hr + 5, hy);
    ctx.bezierCurveTo(cx - hr - 20, hy + 30, cx - hr - 15, hy + 80, cx - hr + 10, hy + 100);
    ctx.lineTo(cx - hr + 25, hy + 100);
    ctx.bezierCurveTo(cx - hr, hy + 80, cx - hr - 5, hy + 30, cx - hr + 20, hy);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(cx + hr - 5, hy);
    ctx.bezierCurveTo(cx + hr + 20, hy + 30, cx + hr + 15, hy + 80, cx + hr - 10, hy + 100);
    ctx.lineTo(cx + hr - 25, hy + 100);
    ctx.bezierCurveTo(cx + hr, hy + 80, cx + hr + 5, hy + 30, cx + hr - 20, hy);
    ctx.fill();
  }
}

function drawHairFront(ctx, style, col, cx, hy, hr, isGirl) {
  ctx.fillStyle = col;
  // Base top of head
  ctx.beginPath();
  ctx.arc(cx, hy, hr + 4, Math.PI, 0);
  ctx.fill();
  // Bangs / front fringe
  if (style === 'long_straight' || style === 'bob' || style === 'twin_tails') {
    // franje frontale (doar fruntea, nu pe fata)
    ctx.beginPath();
    ctx.moveTo(cx - hr + 8, hy - 12);
    ctx.quadraticCurveTo(cx - 15, hy - 4, cx - 5, hy - 6);
    ctx.quadraticCurveTo(cx + 5, hy - 4, cx + 15, hy - 6);
    ctx.quadraticCurveTo(cx + 25, hy - 4, cx + hr - 8, hy - 12);
    ctx.fill();
  } else if (style === 'short' || style === 'spiky') {
    // spiky points
    for (let i = -2; i <= 2; i++) {
      ctx.beginPath();
      ctx.moveTo(cx + i * 18 - 10, hy - hr + 5);
      ctx.lineTo(cx + i * 18, hy - hr - 16 + Math.abs(i)*5);
      ctx.lineTo(cx + i * 18 + 10, hy - hr + 5);
      ctx.fill();
    }
    ctx.beginPath();
    ctx.moveTo(cx - hr + 5, hy);
    ctx.quadraticCurveTo(cx - hr - 5, hy + 15, cx - hr + 15, hy + 25);
    ctx.quadraticCurveTo(cx - hr + 8, hy + 10, cx - hr + 16, hy + 3);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(cx + hr - 5, hy);
    ctx.quadraticCurveTo(cx + hr + 5, hy + 15, cx + hr - 15, hy + 25);
    ctx.quadraticCurveTo(cx + hr - 8, hy + 10, cx + hr - 16, hy + 3);
    ctx.fill();
  } else if (style === 'ponytail') {
    ctx.beginPath();
    ctx.moveTo(cx - hr + 8, hy - 10);
    ctx.quadraticCurveTo(cx - 10, hy - 3, cx + 5, hy - 5);
    ctx.quadraticCurveTo(cx + 15, hy - 3, cx + hr - 8, hy - 10);
    ctx.fill();
    // ponytail tie
    ctx.fillStyle = '#e91e8c';
    ctx.beginPath(); ctx.arc(cx + hr + 5, hy - hr + 15, 6, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = col;
  } else if (style === 'bun') {
    ctx.beginPath();
    ctx.arc(cx, hy - hr - 10, 22, 0, Math.PI*2);
    ctx.fill();
    // bun shadow
    ctx.fillStyle = shadeColor(col, -20);
    ctx.beginPath();
    ctx.arc(cx + 6, hy - hr - 6, 14, 0, Math.PI*2);
    ctx.fill();
    ctx.fillStyle = col;
    // front bangs
    ctx.beginPath();
    ctx.moveTo(cx - hr + 8, hy - 10);
    ctx.quadraticCurveTo(cx - 10, hy - 3, cx + 5, hy - 5);
    ctx.quadraticCurveTo(cx + 15, hy - 3, cx + hr - 8, hy - 10);
    ctx.fill();
  } else if (style === 'curly') {
    // curly front bumps
    for (let i = -2; i <= 2; i++) {
      ctx.beginPath();
      ctx.arc(cx + i * 18, hy - hr - 2, 13, 0, Math.PI*2);
      ctx.fill();
    }
  }
}

// ── Eyes ─────────────────────────────────────────────────
function drawEyes(ctx, shape, col, cx, hy, skin) {
  const offsets = [-28, 28];
  offsets.forEach(ox => {
    const ex = cx + ox, ey = hy + 5;
    ctx.save();
    ctx.beginPath();
    if (shape === 'round') {
      ctx.ellipse(ex, ey, 12, 14, 0, 0, Math.PI*2);
    } else if (shape === 'almond') {
      ctx.moveTo(ex - 14, ey + 2);
      ctx.quadraticCurveTo(ex, ey - 12, ex + 14, ey + 2);
      ctx.quadraticCurveTo(ex, ey + 12, ex - 14, ey + 2);
    } else if (shape === 'cat') {
      ctx.moveTo(ex - 14, ey + 4);
      ctx.quadraticCurveTo(ex - 4, ey - 14, ex + 10, ey - 8);
      ctx.lineTo(ex + 14, ey - 2);
      ctx.quadraticCurveTo(ex + 4, ey + 12, ex - 14, ey + 4);
    } else if (shape === 'sleepy') {
      ctx.ellipse(ex, ey + 3, 13, 8, 0, 0, Math.PI*2);
    } else if (shape === 'wide') {
      ctx.ellipse(ex, ey, 14, 16, 0, 0, Math.PI*2);
    } else if (shape === 'star') {
      drawStar(ctx, ex, ey, 5, 14, 7);
    } else {
      ctx.ellipse(ex, ey, 12, 14, 0, 0, Math.PI*2);
    }
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.clip();
    // iris
    ctx.fillStyle = col;
    ctx.beginPath(); ctx.ellipse(ex, ey + 2, 9, 10, 0, 0, Math.PI*2); ctx.fill();
    // pupil
    ctx.fillStyle = '#111';
    ctx.beginPath(); ctx.ellipse(ex, ey + 2, 5, 6, 0, 0, Math.PI*2); ctx.fill();
    // shine
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.ellipse(ex - 3, ey - 2, 3, 3, 0, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(ex + 3, ey + 3, 1.5, 1.5, 0, 0, Math.PI*2); ctx.fill();
    ctx.restore();
    // outline
    ctx.strokeStyle = '#222';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    if (shape === 'round' || shape === 'wide' || shape === 'sleepy') {
      ctx.ellipse(ex, ey + (shape==='sleepy'?3:0), shape==='sleepy'?13:12, shape==='wide'?16:shape==='sleepy'?8:14, 0, 0, Math.PI*2);
    } else if (shape === 'almond') {
      ctx.moveTo(ex - 14, ey + 2); ctx.quadraticCurveTo(ex, ey - 12, ex + 14, ey + 2); ctx.quadraticCurveTo(ex, ey + 12, ex - 14, ey + 2);
    } else if (shape === 'cat') {
      ctx.moveTo(ex - 14, ey + 4); ctx.quadraticCurveTo(ex - 4, ey - 14, ex + 10, ey - 8); ctx.lineTo(ex + 14, ey - 2); ctx.quadraticCurveTo(ex + 4, ey + 12, ex - 14, ey + 4);
    }
    ctx.stroke();
    // lashes
    ctx.strokeStyle = '#111'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(ex - 12, ey - 4); ctx.lineTo(ex - 15, ey - 10); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(ex + 12, ey - 4); ctx.lineTo(ex + 15, ey - 10); ctx.stroke();
    if (shape !== 'sleepy') {
      ctx.beginPath(); ctx.moveTo(ex, ey - 13); ctx.lineTo(ex, ey - 17); ctx.stroke();
    }
  });
}

// ── Eyebrows ──────────────────────────────────────────────
function drawEyebrows(ctx, style, col, cx, hy) {
  ctx.strokeStyle = col;
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  [-28, 28].forEach(ox => {
    const bx = cx + ox, by = hy - 16;
    ctx.beginPath();
    if (style === 'straight') {
      ctx.moveTo(bx - 13, by); ctx.lineTo(bx + 13, by);
    } else if (style === 'arched') {
      ctx.moveTo(bx - 13, by + 3); ctx.quadraticCurveTo(bx, by - 5, bx + 13, by + 3);
    } else if (style === 'thin') {
      ctx.lineWidth = 1.5;
      ctx.moveTo(bx - 13, by + 1); ctx.quadraticCurveTo(bx, by - 4, bx + 13, by + 1);
    } else if (style === 'angry') {
      const dir = ox < 0 ? 1 : -1;
      ctx.moveTo(bx - 13, by + dir * 4); ctx.lineTo(bx + 13, by - dir * 4);
    } else if (style === 'worried') {
      const dir = ox < 0 ? -1 : 1;
      ctx.moveTo(bx - 13, by + dir * 4); ctx.lineTo(bx + 13, by - dir * 4);
    }
    ctx.stroke();
  });
}

// ── Mouth ─────────────────────────────────────────────────
function drawMouth(ctx, style, col, cx, hy) {
  const my = hy + 35;
  ctx.strokeStyle = col;
  ctx.lineWidth = 2.5;
  ctx.lineCap = 'round';
  if (style === 'smile') {
    ctx.beginPath();
    ctx.moveTo(cx - 14, my - 2);
    ctx.quadraticCurveTo(cx, my + 12, cx + 14, my - 2);
    ctx.stroke();
    ctx.fillStyle = col;
    ctx.globalAlpha = 0.3;
    ctx.beginPath();
    ctx.moveTo(cx - 14, my - 2); ctx.quadraticCurveTo(cx, my + 12, cx + 14, my - 2);
    ctx.closePath(); ctx.fill();
    ctx.globalAlpha = 1;
  } else if (style === 'neutral') {
    ctx.beginPath();
    ctx.moveTo(cx - 12, my + 3); ctx.lineTo(cx + 12, my + 3);
    ctx.stroke();
  } else if (style === 'open') {
    ctx.fillStyle = '#8b1a1a';
    ctx.beginPath();
    ctx.ellipse(cx, my + 4, 14, 10, 0, 0, Math.PI*2);
    ctx.fill();
    ctx.fillStyle = '#f8b4b4';
    ctx.beginPath();
    ctx.ellipse(cx, my + 7, 10, 6, 0, 0, Math.PI*2);
    ctx.fill();
    ctx.strokeStyle = col; ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx - 14, my); ctx.quadraticCurveTo(cx, my - 8, cx + 14, my);
    ctx.stroke();
  } else if (style === 'pout') {
    ctx.fillStyle = col;
    ctx.beginPath();
    ctx.ellipse(cx, my + 5, 12, 7, 0, 0, Math.PI*2);
    ctx.fill();
    ctx.strokeStyle = shadeColor(col, -30);
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(cx - 10, my + 5); ctx.lineTo(cx + 10, my + 5);
    ctx.stroke();
  } else if (style === 'smirk') {
    ctx.beginPath();
    ctx.moveTo(cx - 10, my + 5);
    ctx.quadraticCurveTo(cx, my + 3, cx + 14, my - 2);
    ctx.stroke();
  } else if (style === 'sad') {
    ctx.beginPath();
    ctx.moveTo(cx - 14, my + 4);
    ctx.quadraticCurveTo(cx, my - 6, cx + 14, my + 4);
    ctx.stroke();
  }
}

// ── Clothing ──────────────────────────────────────────────
function drawTop(ctx, style, col, cx, bodyY, bodyW, bodyH, isGirl) {
  if (style === 'none') return;
  ctx.fillStyle = col;
  if (style === 'bra') {
    const by = bodyY + 14; // mutat mai jos, nu la gat
    ctx.fillStyle = col;
    ctx.beginPath();
    ctx.moveTo(cx - 24, by);
    ctx.quadraticCurveTo(cx - 30, by + 24, cx - 4, by + 22);
    ctx.quadraticCurveTo(cx, by + 16, cx + 4, by + 22);
    ctx.quadraticCurveTo(cx + 30, by + 24, cx + 24, by);
    ctx.fill();
    // linie centrală
    ctx.strokeStyle = shadeColor(col, -30);
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(cx, by + 16); ctx.lineTo(cx, by + 22); ctx.stroke();
    // bretele (pe umeri, nu pana la gat)
    ctx.strokeStyle = col; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(cx - 20, by + 2); ctx.lineTo(cx - 28, by - 8); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx + 20, by + 2); ctx.lineTo(cx + 28, by - 8); ctx.stroke();
  } else if (style === 'tshirt') {
    ctx.beginPath();
    rrect(ctx,cx - bodyW/2, bodyY, bodyW, bodyH * 0.6, 4);
    ctx.fill();
    // sleeves
    ctx.beginPath(); rrect(ctx,cx - bodyW/2 - 16, bodyY + 6, 18, 30, 4); ctx.fill();
    ctx.beginPath(); rrect(ctx,cx + bodyW/2 - 2, bodyY + 6, 18, 30, 4); ctx.fill();
  } else if (style === 'uniform') {
    ctx.beginPath();
    rrect(ctx,cx - bodyW/2, bodyY, bodyW, bodyH * 0.65, 4);
    ctx.fill();
    // collar white
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.moveTo(cx - 14, bodyY);
    ctx.lineTo(cx, bodyY + 24);
    ctx.lineTo(cx + 14, bodyY);
    ctx.fill();
    ctx.fillStyle = col;
    ctx.beginPath(); rrect(ctx,cx - bodyW/2 - 14, bodyY + 6, 16, 28, 4); ctx.fill();
    ctx.beginPath(); rrect(ctx,cx + bodyW/2 - 2, bodyY + 6, 16, 28, 4); ctx.fill();
  } else if (style === 'hoodie') {
    ctx.beginPath();
    rrect(ctx,cx - bodyW/2, bodyY, bodyW, bodyH * 0.65, 8);
    ctx.fill();
    // hood
    ctx.beginPath();
    ctx.moveTo(cx - 22, bodyY + 4);
    ctx.quadraticCurveTo(cx, bodyY - 18, cx + 22, bodyY + 4);
    ctx.fill();
    // pocket
    ctx.fillStyle = shadeColor(col, -20);
    ctx.beginPath(); rrect(ctx,cx - 16, bodyY + 42, 32, 16, 4); ctx.fill();
    ctx.fillStyle = col;
    // sleeves
    ctx.beginPath(); rrect(ctx,cx - bodyW/2 - 16, bodyY + 6, 18, 38, 8); ctx.fill();
    ctx.beginPath(); rrect(ctx,cx + bodyW/2 - 2, bodyY + 6, 18, 38, 8); ctx.fill();
  } else if (style === 'dress') {
    ctx.beginPath();
    ctx.moveTo(cx - bodyW/2 + 5, bodyY);
    ctx.lineTo(cx - bodyW/2 - 20, bodyY + 180);
    ctx.lineTo(cx + bodyW/2 + 20, bodyY + 180);
    ctx.lineTo(cx + bodyW/2 - 5, bodyY);
    ctx.closePath();
    ctx.fill();
    // bodice
    ctx.fillStyle = shadeColor(col, -15);
    ctx.beginPath(); rrect(ctx,cx - bodyW/2, bodyY, bodyW, 40, 4); ctx.fill();
    ctx.fillStyle = col;
    ctx.beginPath(); rrect(ctx,cx - bodyW/2 - 12, bodyY + 6, 14, 22, 4); ctx.fill();
    ctx.beginPath(); rrect(ctx,cx + bodyW/2 - 2, bodyY + 6, 14, 22, 4); ctx.fill();
  } else if (style === 'crop') {
    ctx.beginPath();
    rrect(ctx,cx - bodyW/2, bodyY, bodyW, bodyH * 0.4, 4);
    ctx.fill();
    ctx.beginPath(); rrect(ctx,cx - bodyW/2 - 14, bodyY + 6, 16, 22, 4); ctx.fill();
    ctx.beginPath(); rrect(ctx,cx + bodyW/2 - 2, bodyY + 6, 16, 22, 4); ctx.fill();
  } else if (style === 'jacket') {
    ctx.beginPath();
    rrect(ctx,cx - bodyW/2, bodyY, bodyW, bodyH * 0.65, 4);
    ctx.fill();
    ctx.fillStyle = shadeColor(col, -25);
    ctx.beginPath();
    ctx.moveTo(cx - 16, bodyY); ctx.lineTo(cx - 6, bodyY + 40); ctx.lineTo(cx - 16, bodyY + 40); ctx.closePath(); ctx.fill();
    ctx.beginPath();
    ctx.moveTo(cx + 16, bodyY); ctx.lineTo(cx + 6, bodyY + 40); ctx.lineTo(cx + 16, bodyY + 40); ctx.closePath(); ctx.fill();
    ctx.fillStyle = col;
    ctx.beginPath(); rrect(ctx,cx - bodyW/2 - 14, bodyY + 6, 16, 36, 4); ctx.fill();
    ctx.beginPath(); rrect(ctx,cx + bodyW/2 - 2, bodyY + 6, 16, 36, 4); ctx.fill();
  }
}

function drawBottom(ctx, style, col, cx, botY, isGirl) {
  if (style === 'none') return;
  ctx.fillStyle = col;
  if (style === 'skirt') {
    ctx.beginPath();
    ctx.moveTo(cx - 42, botY - 5);
    ctx.lineTo(cx - 55, botY + 80);
    ctx.lineTo(cx + 55, botY + 80);
    ctx.lineTo(cx + 42, botY - 5);
    ctx.closePath();
    ctx.fill();
    // pleats
    ctx.strokeStyle = shadeColor(col, -20);
    ctx.lineWidth = 1;
    for (let i = -2; i <= 2; i++) {
      ctx.beginPath();
      ctx.moveTo(cx + i * 14, botY);
      ctx.lineTo(cx + i * 18, botY + 80);
      ctx.stroke();
    }
  } else if (style === 'pants') {
    ctx.beginPath(); rrect(ctx,cx - 38, botY - 5, 34, 90, 8); ctx.fill();
    ctx.beginPath(); rrect(ctx,cx + 4, botY - 5, 34, 90, 8); ctx.fill();
    ctx.fillStyle = shadeColor(col, -15);
    ctx.beginPath(); rrect(ctx,cx - 38, botY - 5, 76, 12, 4); ctx.fill();
  } else if (style === 'shorts') {
    ctx.beginPath(); rrect(ctx,cx - 38, botY - 5, 34, 45, 8); ctx.fill();
    ctx.beginPath(); rrect(ctx,cx + 4, botY - 5, 34, 45, 8); ctx.fill();
    ctx.fillStyle = shadeColor(col, -15);
    ctx.beginPath(); rrect(ctx,cx - 38, botY - 5, 76, 12, 4); ctx.fill();
  } else if (style === 'mini') {
    ctx.beginPath();
    ctx.moveTo(cx - 42, botY - 5);
    ctx.lineTo(cx - 48, botY + 40);
    ctx.lineTo(cx + 48, botY + 40);
    ctx.lineTo(cx + 42, botY - 5);
    ctx.closePath();
    ctx.fill();
  } else if (style === 'panties') {
    // chiloți fată - pornesc de la sold, acoperă zona soldului + coapse sus
    ctx.beginPath();
    ctx.moveTo(cx - 38, botY);
    ctx.quadraticCurveTo(cx - 40, botY + 40, cx - 12, botY + 44);
    ctx.quadraticCurveTo(cx, botY + 38, cx + 12, botY + 44);
    ctx.quadraticCurveTo(cx + 40, botY + 40, cx + 38, botY);
    ctx.closePath();
    ctx.fill();
    // elastic sus
    ctx.fillStyle = shadeColor(col, -25);
    ctx.beginPath();
    ctx.moveTo(cx - 38, botY);
    ctx.quadraticCurveTo(cx, botY - 10, cx + 38, botY);
    ctx.quadraticCurveTo(cx, botY + 8, cx - 38, botY);
    ctx.fill();
  } else if (style === 'boxers') {
    // boxeri băiat
    ctx.beginPath(); ctx.moveTo(cx - 38, botY - 5); ctx.fill();
    ctx.fillStyle = col;
    ctx.beginPath();
    ctx.moveTo(cx - 38, botY - 5);
    ctx.lineTo(cx - 34, botY + 50);
    ctx.lineTo(cx - 2, botY + 48);
    ctx.lineTo(cx + 2, botY + 48);
    ctx.lineTo(cx + 34, botY + 50);
    ctx.lineTo(cx + 38, botY - 5);
    ctx.closePath();
    ctx.fill();
    // dungă centrală
    ctx.strokeStyle = shadeColor(col, -20);
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(cx, botY - 5); ctx.lineTo(cx, botY + 48); ctx.stroke();
    // elastic
    ctx.fillStyle = shadeColor(col, -25);
    ctx.beginPath(); ctx.fillRect(cx - 38, botY - 5, 76, 10);
  }
}

// ── Accessories ───────────────────────────────────────────
function drawWings(ctx, cx, cy, isGirl) {
  const wingCol = '#f0e8ff';
  const wingShad = '#c9a8e8';
  // left wing
  ctx.save();
  ctx.globalAlpha = 0.92;
  ctx.fillStyle = wingCol;
  ctx.strokeStyle = wingShad;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(cx - 20, cy);
  ctx.bezierCurveTo(cx - 80, cy - 60, cx - 110, cy - 20, cx - 90, cy + 40);
  ctx.bezierCurveTo(cx - 70, cy + 70, cx - 40, cy + 50, cx - 20, cy + 20);
  ctx.closePath();
  ctx.fill(); ctx.stroke();
  // inner feathers
  ctx.strokeStyle = wingShad; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(cx-20,cy+10); ctx.bezierCurveTo(cx-60,cy-20,cx-85,cy+10,cx-75,cy+40); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx-20,cy+15); ctx.bezierCurveTo(cx-50,cy+20,cx-65,cy+40,cx-50,cy+55); ctx.stroke();
  // right wing
  ctx.fillStyle = wingCol;
  ctx.strokeStyle = wingShad; ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(cx + 20, cy);
  ctx.bezierCurveTo(cx + 80, cy - 60, cx + 110, cy - 20, cx + 90, cy + 40);
  ctx.bezierCurveTo(cx + 70, cy + 70, cx + 40, cy + 50, cx + 20, cy + 20);
  ctx.closePath();
  ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx+20,cy+10); ctx.bezierCurveTo(cx+60,cy-20,cx+85,cy+10,cx+75,cy+40); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx+20,cy+15); ctx.bezierCurveTo(cx+50,cy+20,cx+65,cy+40,cx+50,cy+55); ctx.stroke();
  ctx.globalAlpha = 1;
  ctx.restore();
}

function drawTail(ctx, cx, cy, col) {
  ctx.strokeStyle = col;
  ctx.lineWidth = 12;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(cx + 35, cy);
  ctx.bezierCurveTo(cx + 70, cy + 30, cx + 80, cy + 70, cx + 50, cy + 90);
  ctx.stroke();
  ctx.lineWidth = 8;
  ctx.strokeStyle = shadeColor(col, 20);
  ctx.beginPath();
  ctx.moveTo(cx + 35, cy + 2);
  ctx.bezierCurveTo(cx + 65, cy + 32, cx + 75, cy + 70, cx + 50, cy + 88);
  ctx.stroke();
}

function drawCatEars(ctx, cx, hy, hr, col) {
  ctx.fillStyle = col;
  // left ear
  ctx.beginPath();
  ctx.moveTo(cx - hr + 5, hy - hr + 10);
  ctx.lineTo(cx - hr - 14, hy - hr - 28);
  ctx.lineTo(cx - hr + 22, hy - hr - 4);
  ctx.closePath(); ctx.fill();
  // right ear
  ctx.beginPath();
  ctx.moveTo(cx + hr - 5, hy - hr + 10);
  ctx.lineTo(cx + hr + 14, hy - hr - 28);
  ctx.lineTo(cx + hr - 22, hy - hr - 4);
  ctx.closePath(); ctx.fill();
  // inner
  ctx.fillStyle = '#ffb3d9';
  ctx.beginPath();
  ctx.moveTo(cx - hr + 6, hy - hr + 6);
  ctx.lineTo(cx - hr - 8, hy - hr - 18);
  ctx.lineTo(cx - hr + 16, hy - hr - 2);
  ctx.closePath(); ctx.fill();
  ctx.beginPath();
  ctx.moveTo(cx + hr - 6, hy - hr + 6);
  ctx.lineTo(cx + hr + 8, hy - hr - 18);
  ctx.lineTo(cx + hr - 16, hy - hr - 2);
  ctx.closePath(); ctx.fill();
}

function drawHorns(ctx, cx, hy, hr) {
  ctx.fillStyle = '#e74c3c';
  ctx.beginPath(); ctx.moveTo(cx - 24, hy - hr + 5); ctx.lineTo(cx - 30, hy - hr - 28); ctx.lineTo(cx - 12, hy - hr - 4); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(cx + 24, hy - hr + 5); ctx.lineTo(cx + 30, hy - hr - 28); ctx.lineTo(cx + 12, hy - hr - 4); ctx.closePath(); ctx.fill();
}

function drawHalo(ctx, cx, hy, hr) {
  ctx.strokeStyle = '#f0c040';
  ctx.lineWidth = 5;
  ctx.shadowColor = '#f0c040';
  ctx.shadowBlur = 12;
  ctx.beginPath();
  ctx.ellipse(cx, hy - hr - 16, 28, 8, 0, 0, Math.PI*2);
  ctx.stroke();
  ctx.shadowBlur = 0;
}

function drawGlasses(ctx, cx, hy) {
  ctx.strokeStyle = '#555';
  ctx.lineWidth = 2.5;
  ctx.beginPath(); rrect(ctx,cx - 44, hy - 4, 28, 20, 6); ctx.stroke();
  ctx.beginPath(); rrect(ctx,cx + 16, hy - 4, 28, 20, 6); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx - 16, hy + 6); ctx.lineTo(cx + 16, hy + 6); ctx.stroke();
}

function drawMask(ctx, cx, hy, skin) {
  ctx.fillStyle = '#fff';
  ctx.beginPath(); rrect(ctx,cx - 26, hy + 22, 52, 28, 6); ctx.fill();
  ctx.strokeStyle = '#ddd'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(cx - 22, hy + 32); ctx.lineTo(cx + 22, hy + 32); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx - 22, hy + 39); ctx.lineTo(cx + 22, hy + 39); ctx.stroke();
  ctx.strokeStyle = '#ccc'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(cx - 26, hy + 28); ctx.lineTo(cx - 38, hy + 24); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx + 26, hy + 28); ctx.lineTo(cx + 38, hy + 24); ctx.stroke();
}

function drawScarf(ctx, cx, bodyY, col) {
  ctx.fillStyle = col;
  ctx.beginPath(); rrect(ctx,cx - 30, bodyY - 10, 60, 18, 6); ctx.fill();
  ctx.fillStyle = shadeColor(col, -20);
  ctx.beginPath(); ctx.ellipse(cx + 10, bodyY + 14, 10, 20, 0.3, 0, Math.PI*2); ctx.fill();
}

function drawHeadband(ctx, cx, hy, hr, col) {
  ctx.strokeStyle = col;
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.arc(cx, hy, hr + 2, Math.PI * 1.2, Math.PI * 1.8);
  ctx.stroke();
}

function drawBow(ctx, cx, hy, hr, col) {
  const bx = cx + hr - 5, by = hy - hr - 5;
  ctx.fillStyle = col;
  // left loop
  ctx.beginPath();
  ctx.moveTo(bx, by); ctx.bezierCurveTo(bx - 18, by - 18, bx - 20, by + 10, bx, by + 5); ctx.fill();
  // right loop
  ctx.beginPath();
  ctx.moveTo(bx, by); ctx.bezierCurveTo(bx + 18, by - 18, bx + 20, by + 10, bx, by + 5); ctx.fill();
  // center
  ctx.fillStyle = shadeColor(col, -20);
  ctx.beginPath(); ctx.ellipse(bx, by + 2, 5, 5, 0, 0, Math.PI*2); ctx.fill();
}

// ── Sparkles ──────────────────────────────────────────────
function drawSparkles(ctx, W, H) {
  const sparks = [[40,30],[W-50,50],[30,H-60],[W-40,H-40],[W/2,20],[60,H/2],[W-30,H/2]];
  ctx.fillStyle = 'rgba(255,255,255,0.55)';
  sparks.forEach(([x,y]) => {
    drawStar(ctx, x, y, 4, 5, 2.5);
    ctx.fill();
  });
}

function drawStar(ctx, cx, cy, n, r1, r2) {
  ctx.beginPath();
  for (let i = 0; i < n * 2; i++) {
    const r = i % 2 === 0 ? r1 : r2;
    const a = (i * Math.PI) / n - Math.PI / 2;
    i === 0 ? ctx.moveTo(cx + r * Math.cos(a), cy + r * Math.sin(a))
            : ctx.lineTo(cx + r * Math.cos(a), cy + r * Math.sin(a));
  }
  ctx.closePath();
}

// ── roundRect polyfill (compatibil cu toate browserele) ────
function rrect(ctx, x, y, w, h, r) {
  r = Math.min(r, w / 2, h / 2);
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function shadeColor(hex, pct) {
  const n = parseInt(hex.replace('#',''), 16);
  const r = Math.max(0, Math.min(255, (n >> 16) + pct));
  const g = Math.max(0, Math.min(255, ((n >> 8) & 0xff) + pct));
  const b = Math.max(0, Math.min(255, (n & 0xff) + pct));
  return '#' + [r,g,b].map(v => v.toString(16).padStart(2,'0')).join('');
}

// ── UI ────────────────────────────────────────────────────
const canvas = document.getElementById('char-canvas');

function render() {
  drawCharacter(canvas, state);
}

// Tabs
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.add('hidden'));
    btn.classList.add('active');
    document.getElementById('tab-' + btn.dataset.tab).classList.remove('hidden');
  });
});

// Option cards
document.querySelectorAll('.opt-card:not(.toggle-card)').forEach(card => {
  card.addEventListener('click', () => {
    const key = card.dataset.key, val = card.dataset.val;
    state[key] = val;
    // schimbarea genului aplica defaults potrivite
    if (key === 'gender') {
      if (val === 'boy') {
        Object.assign(state, { hairStyle:'short', hairColor:'black', top:'none', topColor:'blue', bottom:'boxers', bottomColor:'black' });
      } else {
        Object.assign(state, { hairStyle:'long_straight', hairColor:'pink', top:'bra', topColor:'pink', bottom:'panties', bottomColor:'pink' });
      }
      document.querySelectorAll('.opt-card:not(.toggle-card)').forEach(c => c.classList.remove('selected'));
      markSelections();
    } else {
      document.querySelectorAll(`.opt-card[data-key="${key}"]`).forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
    }
    render();
  });
});

// Toggle cards (accessories)
document.querySelectorAll('.toggle-card').forEach(card => {
  card.addEventListener('click', () => {
    const key = card.dataset.key;
    state[key] = !state[key];
    card.classList.toggle('toggle-selected', state[key]);
    render();
  });
});

// Mark defaults as selected
function markSelections() {
  Object.entries(state).forEach(([key, val]) => {
    if (typeof val === 'boolean') {
      const card = document.querySelector(`.toggle-card[data-key="${key}"]`);
      if (card) card.classList.toggle('toggle-selected', val);
    } else {
      const card = document.querySelector(`.opt-card[data-key="${key}"][data-val="${val}"]`);
      if (card) card.classList.add('selected');
    }
  });
}

// ── Navigation ────────────────────────────────────────────
document.getElementById('btn-create').addEventListener('click', () => {
  editingId = null;
  state = defaultState();
  markSelections();
  document.getElementById('char-name').value = '';
  render();
  showScreen('screen-editor');
});

document.getElementById('btn-library').addEventListener('click', () => {
  renderLibrary();
  showScreen('screen-library');
});

document.getElementById('btn-back-home').addEventListener('click', () => showScreen('screen-home'));
document.getElementById('btn-back-lib').addEventListener('click', () => showScreen('screen-home'));

// ── Save ──────────────────────────────────────────────────
document.getElementById('btn-save-char').addEventListener('click', () => {
  const name = document.getElementById('char-name').value.trim() || 'Character';
  const lib = loadLibrary();
  const snap = canvas.toDataURL();

  if (editingId !== null) {
    const idx = lib.findIndex(c => c.id === editingId);
    if (idx !== -1) { lib[idx] = { ...lib[idx], name, state: {...state}, snap }; }
  } else {
    lib.push({ id: Date.now(), name, state: {...state}, snap });
  }
  saveLibrary(lib);
  showScreen('screen-library');
  renderLibrary();
});

// ── Library ───────────────────────────────────────────────
function renderLibrary() {
  const lib = loadLibrary();
  const grid = document.getElementById('lib-grid');
  const empty = document.getElementById('lib-empty');
  document.getElementById('lib-count').textContent = lib.length + ' character' + (lib.length !== 1 ? 's' : '');
  grid.innerHTML = '';
  if (lib.length === 0) { empty.classList.remove('hidden'); return; }
  empty.classList.add('hidden');
  lib.forEach(char => {
    const card = document.createElement('div');
    card.className = 'lib-card';
    const c = document.createElement('canvas');
    c.width = 300; c.height = 420;
    drawCharacter(c, char.state);
    c.style.width = '100%';
    const nameEl = document.createElement('div');
    nameEl.className = 'lib-card-name';
    nameEl.textContent = char.name;
    card.appendChild(c);
    card.appendChild(nameEl);
    card.addEventListener('click', () => openModal(char));
    grid.appendChild(card);
  });
}

// ── Modal ─────────────────────────────────────────────────
let modalChar = null;
function openModal(char) {
  modalChar = char;
  document.getElementById('modal-name').textContent = char.name;
  const mc = document.getElementById('modal-canvas');
  drawCharacter(mc, char.state);
  document.getElementById('modal-char').classList.remove('hidden');
}
document.getElementById('btn-modal-close').addEventListener('click', () => {
  document.getElementById('modal-char').classList.add('hidden');
});
document.getElementById('btn-modal-edit').addEventListener('click', () => {
  document.getElementById('modal-char').classList.add('hidden');
  editingId = modalChar.id;
  state = {...modalChar.state};
  document.getElementById('char-name').value = modalChar.name;
  // reset selections
  document.querySelectorAll('.opt-card').forEach(c => c.classList.remove('selected','toggle-selected'));
  markSelections();
  render();
  showScreen('screen-editor');
});
document.getElementById('btn-modal-delete').addEventListener('click', () => {
  if (!confirm('Delete "' + modalChar.name + '"?')) return;
  const lib = loadLibrary().filter(c => c.id !== modalChar.id);
  saveLibrary(lib);
  document.getElementById('modal-char').classList.add('hidden');
  renderLibrary();
});

// ── Cover screen ──────────────────────────────────────────
document.getElementById('screen-cover').addEventListener('click', () => {
  showScreen('screen-home');
});

// ── Init ──────────────────────────────────────────────────
showScreen('screen-cover');
markSelections();
render();

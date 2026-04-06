'use strict';

// ══════════════════════════════════════════════
//  CHORD SHAPES
// ══════════════════════════════════════════════
const CHORD_SHAPES = {
  'C':    { positions:[{s:5,f:3,n:3},{s:4,f:2,n:2},{s:2,f:1,n:1}], open:[1,2,4], muted:[6] },
  'Cm':   { positions:[{s:5,f:3,n:3},{s:4,f:5,n:4},{s:3,f:5,n:4},{s:2,f:4,n:3}], barre:{fret:3,from:1,to:5} },
  'D':    { positions:[{s:3,f:2,n:1},{s:2,f:3,n:3},{s:1,f:2,n:2}], open:[4], muted:[5,6] },
  'Dm':   { positions:[{s:3,f:2,n:2},{s:2,f:3,n:3},{s:1,f:1,n:1}], open:[4], muted:[5,6] },
  'E':    { positions:[{s:5,f:2,n:2},{s:4,f:2,n:3},{s:3,f:1,n:1}], open:[1,2,4,6] },
  'Em':   { positions:[{s:5,f:2,n:2},{s:4,f:2,n:3}], open:[1,2,3,4,6] },
  'F':    { positions:[{s:5,f:3,n:3},{s:4,f:3,n:4},{s:3,f:2,n:2}], barre:{fret:1,from:1,to:6} },
  'Fm':   { positions:[{s:5,f:3,n:3},{s:4,f:3,n:4}], barre:{fret:1,from:1,to:6} },
  'G':    { positions:[{s:6,f:3,n:2},{s:5,f:2,n:1},{s:1,f:3,n:3}], open:[2,3,4,5] },
  'Gm':   { positions:[{s:5,f:5,n:3},{s:4,f:5,n:4},{s:3,f:3,n:2}], barre:{fret:3,from:1,to:6} },
  'A':    { positions:[{s:4,f:2,n:1},{s:3,f:2,n:2},{s:2,f:2,n:3}], open:[1,5,6], muted:[6] },
  'Am':   { positions:[{s:4,f:2,n:2},{s:3,f:2,n:3},{s:2,f:1,n:1}], open:[1,4,5], muted:[6] },
  'B':    { positions:[{s:4,f:4,n:3},{s:3,f:4,n:4},{s:2,f:4,n:4}], barre:{fret:2,from:1,to:5}, muted:[6] },
  'Bm':   { positions:[{s:4,f:4,n:3},{s:3,f:4,n:4},{s:2,f:3,n:2}], barre:{fret:2,from:1,to:5}, muted:[6] },
  'F#m':  { positions:[{s:5,f:4,n:3},{s:4,f:4,n:4},{s:3,f:2,n:1}], barre:{fret:2,from:1,to:5}, muted:[6] },
  'C#m':  { positions:[{s:5,f:6,n:3},{s:4,f:6,n:4},{s:3,f:4,n:2}], barre:{fret:4,from:1,to:5}, muted:[6] },
  'G#m':  { positions:[{s:5,f:6,n:3},{s:4,f:6,n:4},{s:3,f:4,n:2}], barre:{fret:4,from:1,to:6} },
  'E7':   { positions:[{s:5,f:2,n:2},{s:3,f:1,n:1}], open:[1,2,4,6] },
  'A7':   { positions:[{s:4,f:2,n:2},{s:2,f:2,n:3}], open:[1,3,5], muted:[6] },
  'D7':   { positions:[{s:3,f:2,n:2},{s:2,f:1,n:1},{s:1,f:2,n:3}], open:[4], muted:[5,6] },
  'G7':   { positions:[{s:6,f:3,n:3},{s:5,f:2,n:2},{s:1,f:1,n:1}], open:[2,3,4] },
  'Bb':   { positions:[{s:5,f:3,n:3},{s:4,f:3,n:4},{s:3,f:3,n:4}], barre:{fret:1,from:1,to:5}, muted:[6] },
  'Ab':   { positions:[{s:5,f:6,n:3},{s:4,f:6,n:4},{s:3,f:6,n:4}], barre:{fret:4,from:1,to:6} },
  'Db':   { positions:[{s:5,f:6,n:3},{s:4,f:6,n:4},{s:3,f:6,n:4}], barre:{fret:4,from:1,to:5}, muted:[6] },
};

// ══════════════════════════════════════════════
//  SONGS
// ══════════════════════════════════════════════
const SONGS = [
  { title:'Shape of You', artist:'Ed Sheeran', chords:['C#m','A','B','E'], bpm:96,
    lyrics:'[C#m]Every day dis-[A]covering something brand new\n[B]I\'m in love with the shape of [E]you' },
  { title:'Blinding Lights', artist:'The Weeknd', chords:['Am','F','C','G'], bpm:171,
    lyrics:'[Am]I\'ve been tryna call\n[F]I\'ve been on my own for long enough\n[C]Maybe you can show me how to love\n[G]Maybe' },
  { title:'Someone Like You', artist:'Adele', chords:['A','C#m','F#m','D'], bpm:68,
    lyrics:'[A]I heard that you\'re settled down\n[C#m]That you found a girl\n[F#m]I heard that your dreams came true\n[D]Guess she gave you things I didn\'t give to you' },
  { title:'Counting Stars', artist:'OneRepublic', chords:['Am','C','G','F'], bpm:122,
    lyrics:'[Am]Lately I\'ve been losing sleep\n[C]Dreaming about the things that we could be\n[G]But baby I\'ve been praying hard\n[F]No more counting dollars, we\'ll be counting stars' },
  { title:'Let Her Go', artist:'Passenger', chords:['C','G','Am','F'], bpm:104,
    lyrics:'[C]Well you only need the light when it\'s burning low\n[G]Only miss the sun when it starts to snow\n[Am]Only know you love her when you let her go\n[F]And you let her go' },
  { title:'Viva La Vida', artist:'Coldplay', chords:['C','D','G','Em'], bpm:138,
    lyrics:'[C]I used to rule the world\n[D]Seas would rise when I gave the word\n[G]Now in the morning I sleep alone\n[Em]Sweep the streets I used to own' },
  { title:'Photograph', artist:'Ed Sheeran', chords:['Em','C','G','D'], bpm:108,
    lyrics:'[Em]Loving can hurt, [C]loving can hurt sometimes\n[G]But it\'s the only thing that I know\n[D]When it gets hard sometimes' },
  { title:'Perfect', artist:'Ed Sheeran', chords:['G','Em','C','D'], bpm:95,
    lyrics:'[G]I found a love for me\n[Em]Darling just dive right in\n[C]Well I found a girl beautiful and sweet\n[D]I never knew you were the someone waiting for me' },
  { title:'Thinking Out Loud', artist:'Ed Sheeran', chords:['D','A','Bm','G'], bpm:79,
    lyrics:'[D]When your legs don\'t work like they used to before\n[A]And I can\'t sweep you off of your feet\n[Bm]Will your mouth still remember the taste of my love\n[G]Will your eyes still smile from your cheeks' },
  { title:'Stay With Me', artist:'Sam Smith', chords:['Am','F','C','G'], bpm:86,
    lyrics:'[Am]Guess it\'s true I\'m not good at a one-night stand\n[F]But I still need love\n[C]These nights never seem to go to plan\n[G]I don\'t want you to leave' },
  { title:'Wonderwall', artist:'Oasis', chords:['Em','G','D','A'], bpm:87,
    lyrics:'[Em]Today is gonna be the day\n[G]That they\'re gonna throw it back to you\n[D]By now you should have somehow\n[A]Realized what you gotta do' },
  { title:'Hotel California', artist:'Eagles', chords:['Bm','F#m','A','E'], bpm:75,
    lyrics:'[Bm]On a dark desert highway [F#m]cool wind in my hair\n[A]Warm smell of colitas [E]rising up through the air' },
  { title:'Knockin on Heavens Door', artist:'Bob Dylan', chords:['G','D','Am','C'], bpm:70,
    lyrics:'[G]Mama, take this badge off of me\n[D]I can\'t use it anymore\n[G]It\'s gettin\' dark, [Am]too dark to see\n[D]Knockin\' on heaven\'s door' },
  { title:'Sweet Home Alabama', artist:'Lynyrd Skynyrd', chords:['D','C','G'], bpm:98,
    lyrics:'[D]Big wheels keep on turning\n[C]Carry me home to see my kin\n[G]Singing songs about the Southland' },
  { title:'Wish You Were Here', artist:'Pink Floyd', chords:['Em','G','A','C','D'], bpm:63,
    lyrics:'[Em]So, so you think you can tell\n[G]Heaven from hell\n[A]Blue skies from pain\n[C]Can you tell a green field\n[D]From a cold steel rail' },
  { title:'Nothing Else Matters', artist:'Metallica', chords:['Em','D','C','Am'], bpm:69,
    lyrics:'[Em]So close, no matter how far\n[D]Couldn\'t be much more from the heart\n[C]Forever trusting who we are\n[Am]And nothing else matters' },
  { title:'Shallow', artist:'Lady Gaga', chords:['Em','D','G','C','Am'], bpm:96,
    lyrics:'[Em]Tell me something girl\n[D]Are you happy in this modern world\n[G]Or do you need more\n[C]Is there something else you\'re searching for' },
  { title:'All of Me', artist:'John Legend', chords:['Em','C','G','D'], bpm:63,
    lyrics:'[Em]What would I do without your smart mouth\n[C]Drawing me in and kicking me out\n[G]Got my head spinning\n[D]What\'s going on in that beautiful mind' },
  { title:'Hallelujah', artist:'Leonard Cohen', chords:['C','Am','F','G','E'], bpm:64,
    lyrics:'[C]I\'ve heard there was a [Am]secret chord\n[C]That David played and [Am]it pleased the Lord\n[F]But you don\'t really [G]care for music do you' },
  { title:'Dragostea Din Tei', artist:'O-Zone', chords:['F','C','Dm','Bb'], bpm:140,
    lyrics:'[F]Ma-ia-hii [C]ma-ia-huu\n[Dm]Ma-ia-hoo [Bb]ma-ia-haa' },
  { title:'Doi Străini', artist:'Irina Rimes', chords:['Am','F','C','G'], bpm:95,
    lyrics:'[Am]Eram doi străini [F]în același oraș\n[C]Ne-am întâlnit [G]la o schimbare de iarnă' },
  { title:'Vara Nu Dorm', artist:'Carla\'s Dreams', chords:['Dm','Bb','F','C'], bpm:110,
    lyrics:'[Dm]Vara nu dorm [Bb]noaptea\n[F]Mă gândesc la tine [C]toată' },
  { title:'Despacito', artist:'Luis Fonsi', chords:['Bm','G','D','A'], bpm:89,
    lyrics:'[Bm]Sí, sabes que ya llevo un rato mirándote\n[G]Tengo que bailar contigo hoy\n[D]Vi que tu mirada ya estaba llamándome\n[A]Muéstrame el camino que yo voy' },
  { title:'La Bamba', artist:'Ritchie Valens', chords:['C','F','G'], bpm:170,
    lyrics:'[C]Para bailar la bamba\n[F]Para bailar la bamba\n[G]Se necesita una poca de gracia' },
  { title:'Bella Ciao', artist:'Folk Italiano', chords:['Dm','A','C','F'], bpm:104,
    lyrics:'[Dm]Una mattina mi son svegliato\n[A]O bella ciao, bella ciao\n[Dm]Bella ciao ciao ciao' },
  { title:'Africa', artist:'Toto', chords:['F#m','D','A','E'], bpm:93,
    lyrics:'[F#m]I hear the drums echoing tonight\n[D]But she hears only whispers\n[A]She\'s coming in twelve-thirty flight\n[E]The moonlit wings reflect the stars' },
  { title:'Stand By Me', artist:'Ben E. King', chords:['A','F#m','D','E'], bpm:121,
    lyrics:'[A]When the night has come\n[F#m]And the land is dark\n[D]And the moon is the only light we\'ll see\n[E]No I won\'t be afraid' },
  { title:'Hey There Delilah', artist:'Plain White T\'s', chords:['D','F#m','Bm','G','A'], bpm:94,
    lyrics:'[D]Hey there Delilah what\'s it like in New York City\n[F#m]I\'m a thousand miles away\n[Bm]Yes you do [G]Times Square can\'t shine as bright as you\n[A]I swear it\'s true' },
  { title:'Riptide', artist:'Vance Joy', chords:['Am','G','C','F'], bpm:104,
    lyrics:'[Am]I was scared of dentists and the dark\n[G]I was scared of pretty girls\n[C]Oh, all my friends are turning green\n[Am]You\'re the magician\'s assistant in their dream' },
  { title:'Budapest', artist:'George Ezra', chords:['C','F','G','Am'], bpm:130,
    lyrics:'[C]My house in Budapest\n[F]My hidden treasure chest\n[G]Golden grand piano\n[Am]My beautiful Castillo' },
  { title:'Take Me to Church', artist:'Hozier', chords:['Am','F','C','G','Em'], bpm:129,
    lyrics:'[Am]My lover\'s got humor\n[F]She\'s the giggle at a funeral\n[C]Knows everybody\'s disapproval\n[G]I should\'ve worshipped her sooner' },
  { title:'Smells Like Teen Spirit', artist:'Nirvana', chords:['F','Bb','Ab','Db'], bpm:117,
    lyrics:'[F]Load up on guns, bring your friends\n[Bb]It\'s fun to lose and to pretend\n[Ab]She\'s overboard and self-assured\n[Db]Oh no, I know a dirty word' },
];

// ══════════════════════════════════════════════
//  DRAW CHORD DIAGRAM
// ══════════════════════════════════════════════
function drawChordDiagram(canvas, chordName) {
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0, 0, W, H);

  const shape = CHORD_SHAPES[chordName];
  if (!shape) {
    ctx.fillStyle = '#555'; ctx.font = '12px Segoe UI';
    ctx.textAlign = 'center'; ctx.fillText('no diagram', W/2, H/2);
    return;
  }

  const strings = 6, frets = 5;
  const pl = 28, pt = 24, pr = 10, pb = 10;
  const gw = W - pl - pr, gh = H - pt - pb;
  const sx = gw / (strings - 1), fy = gh / frets;

  let minFret = 99;
  (shape.positions || []).forEach(p => { if (p.f > 0) minFret = Math.min(minFret, p.f); });
  if (shape.barre) minFret = Math.min(minFret, shape.barre.fret);
  if (minFret === 99) minFret = 1;
  const offset = minFret > 1 && !shape.barre ? minFret - 1 : 0;
  const startFret = offset + 1;

  if (offset > 0) {
    ctx.fillStyle = '#f5c518'; ctx.font = 'bold 11px Segoe UI';
    ctx.textAlign = 'left'; ctx.fillText(startFret + 'fr', 1, pt + fy * 0.7);
  }
  if (offset === 0) { ctx.fillStyle = '#eee'; ctx.fillRect(pl, pt - 3, gw, 4); }

  ctx.strokeStyle = '#444'; ctx.lineWidth = 1;
  for (let i = 0; i <= frets; i++) {
    ctx.beginPath(); ctx.moveTo(pl, pt + i*fy); ctx.lineTo(pl+gw, pt+i*fy); ctx.stroke();
  }
  for (let i = 0; i < strings; i++) {
    ctx.beginPath(); ctx.moveTo(pl+i*sx, pt); ctx.lineTo(pl+i*sx, pt+gh); ctx.stroke();
  }

  (shape.open||[]).forEach(s => {
    const x = pl+(6-s)*sx;
    ctx.strokeStyle='#4caf50'; ctx.lineWidth=1.5;
    ctx.beginPath(); ctx.arc(x, pt-10, 5, 0, Math.PI*2); ctx.stroke();
  });
  (shape.muted||[]).forEach(s => {
    const x = pl+(6-s)*sx;
    ctx.strokeStyle='#e74c3c'; ctx.lineWidth=2;
    ctx.beginPath(); ctx.moveTo(x-4,pt-14); ctx.lineTo(x+4,pt-6); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x+4,pt-14); ctx.lineTo(x-4,pt-6); ctx.stroke();
  });

  if (shape.barre) {
    const y = pt+(shape.barre.fret-startFret+0.5)*fy;
    const x1 = pl+(6-shape.barre.to)*sx, x2 = pl+(6-shape.barre.from)*sx;
    ctx.fillStyle='#f5c518'; ctx.beginPath();
    ctx.roundRect(x1-4, y-8, x2-x1+8, 16, 8); ctx.fill();
  }

  (shape.positions||[]).forEach(p => {
    if (p.f <= 0) return;
    const x = pl+(6-p.s)*sx, y = pt+(p.f-startFret+0.5)*fy;
    ctx.fillStyle='#f5c518'; ctx.beginPath(); ctx.arc(x,y,9,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='#000'; ctx.font='bold 10px Segoe UI';
    ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText(p.n,x,y);
  });
  ctx.textBaseline='alphabetic';
}

// ══════════════════════════════════════════════
//  FINGER HINTS
// ══════════════════════════════════════════════
const HINTS = {
  'C':'Deget 1→B(1), 2→D(2), 3→A(3)',
  'D':'Deget 1→G(2), 2→e(2), 3→B(3)',
  'E':'Deget 1→G(1), 2→A(2), 3→D(2)',
  'G':'Deget 1→A(2), 2→E(3), 3→e(3)',
  'A':'Deget 1,2,3→D,G,B fret 2',
  'Am':'Deget 1→B(1), 2→D(2), 3→G(2)',
  'Em':'Deget 2→A(2), 3→D(2)',
  'Dm':'Deget 1→e(1), 2→G(2), 3→B(3)',
  'F':'Barre fret 1 + deget 3→D, 4→A',
  'Bm':'Barre fret 2 + degete 3,4',
  'C#m':'Barre fret 4 + degete 3,4',
  'F#m':'Barre fret 2 + degete 3,4',
};

// ══════════════════════════════════════════════
//  PLAYER STATE
// ══════════════════════════════════════════════
const pl = { song:null, playing:false, idx:0, bpm:80, timer:null, prog:0, progTimer:null };

function msPerChord() { return (60000 / pl.bpm) * 4; }

function startPlayer() {
  if (pl.playing) return;
  pl.playing = true;
  pl.idx = 0;
  document.getElementById('btn-play').textContent = '⏹ STOP';
  document.getElementById('btn-play').classList.add('playing');
  // switch views
  document.getElementById('diagrams-section').classList.add('hidden');
  document.getElementById('player-view').classList.remove('hidden');
  tick();
}

function stopPlayer() {
  pl.playing = false;
  clearTimeout(pl.timer);
  clearInterval(pl.progTimer);
  document.getElementById('btn-play').textContent = '▶ PLAY';
  document.getElementById('btn-play').classList.remove('playing');
  document.getElementById('player-view').classList.add('hidden');
  document.getElementById('diagrams-section').classList.remove('hidden');
  document.getElementById('progress-fill').style.width = '0%';
  highlightSeq(-1);
}

function tick() {
  if (!pl.playing) return;
  showChord(pl.idx);
  startProgress();
  pl.timer = setTimeout(() => {
    pl.idx = (pl.idx + 1) % pl.song.chords.length;
    tick();
  }, msPerChord());
}

function startProgress() {
  clearInterval(pl.progTimer);
  pl.prog = 0;
  const step = 50;
  pl.progTimer = setInterval(() => {
    if (!pl.playing) return;
    pl.prog += step;
    document.getElementById('progress-fill').style.width =
      Math.min(100, (pl.prog / msPerChord()) * 100) + '%';
  }, step);
}

function showChord(idx) {
  const chords = pl.song.chords;
  const cur = chords[idx], nxt = chords[(idx+1) % chords.length];
  document.getElementById('player-chord-name').textContent = cur;
  document.getElementById('player-next-name').textContent = nxt;
  document.getElementById('player-hint').textContent = HINTS[cur] || '';
  drawChordDiagram(document.getElementById('player-canvas'), cur);
  drawChordDiagram(document.getElementById('player-next-canvas'), nxt);
  highlightSeq(idx);
}

function highlightSeq(idx) {
  document.querySelectorAll('.seq-pill').forEach((el,i) =>
    el.classList.toggle('active', i === idx));
}

// ══════════════════════════════════════════════
//  RENDER SONG
// ══════════════════════════════════════════════
function searchSongs(q) {
  q = q.toLowerCase().trim();
  if (!q) return [];
  return SONGS.filter(s =>
    s.title.toLowerCase().includes(q) || s.artist.toLowerCase().includes(q)
  ).slice(0, 8);
}

function renderSong(song) {
  if (pl.playing) stopPlayer();
  pl.song = song; pl.bpm = song.bpm || 80;

  document.getElementById('empty-state').classList.add('hidden');
  document.getElementById('song-view').classList.remove('hidden');
  document.getElementById('bottom-bar').classList.remove('hidden');
  document.getElementById('player-view').classList.add('hidden');
  document.getElementById('diagrams-section').classList.remove('hidden');

  document.getElementById('song-name').textContent = song.title;
  document.getElementById('song-artist').textContent = '— ' + song.artist;

  // speed slider
  const slider = document.getElementById('speed-slider');
  slider.value = pl.bpm;
  document.getElementById('speed-bpm').textContent = pl.bpm + ' BPM';

  // bottom sequence
  const seq = document.getElementById('chord-seq');
  seq.innerHTML = '';
  song.chords.forEach(c => {
    const el = document.createElement('div');
    el.className = 'seq-pill'; el.textContent = c;
    seq.appendChild(el);
  });

  // diagrams
  const grid = document.getElementById('diagrams-grid');
  grid.innerHTML = '';
  [...new Set(song.chords)].forEach(c => {
    const card = document.createElement('div');
    card.className = 'diagram-card';
    const lbl = document.createElement('div'); lbl.className = 'chord-label'; lbl.textContent = c;
    const cvs = document.createElement('canvas'); cvs.className = 'chord-canvas'; cvs.width = 110; cvs.height = 130;
    const hint = document.createElement('div'); hint.className = 'finger-hint'; hint.textContent = HINTS[c] || '';
    card.appendChild(lbl); card.appendChild(cvs); card.appendChild(hint);
    grid.appendChild(card);
    drawChordDiagram(cvs, c);
  });

  // lyrics
  const lw = document.getElementById('lyrics-wrap');
  lw.innerHTML = song.lyrics ? song.lyrics.split('\n').map(line =>
    '<div>' + line.replace(/\[([^\]]+)\]/g, (_,c) => `<span class="chord-inline">${c}</span>`) + '</div>'
  ).join('') : '';
}

// ══════════════════════════════════════════════
//  EVENTS
// ══════════════════════════════════════════════
document.getElementById('btn-start').addEventListener('click', () => {
  document.getElementById('screen-cover').classList.add('hidden');
  document.getElementById('screen-app').classList.remove('hidden');
  document.getElementById('search-input').focus();
});

const input = document.getElementById('search-input');
const sugg  = document.getElementById('suggestions');

input.addEventListener('input', () => {
  const res = searchSongs(input.value);
  if (!res.length) { sugg.classList.add('hidden'); return; }
  sugg.innerHTML = '';
  res.forEach(s => {
    const item = document.createElement('div');
    item.className = 'suggestion-item';
    item.innerHTML = `<div class="s-title">${s.title}</div><div class="s-artist">${s.artist}</div>`;
    item.addEventListener('click', () => { input.value = s.title; sugg.classList.add('hidden'); renderSong(s); });
    sugg.appendChild(item);
  });
  sugg.classList.remove('hidden');
});

document.getElementById('btn-search').addEventListener('click', () => {
  const res = searchSongs(input.value);
  if (res.length) renderSong(res[0]);
  sugg.classList.add('hidden');
});

input.addEventListener('keydown', e => {
  if (e.key === 'Enter') { const res = searchSongs(input.value); if (res.length) renderSong(res[0]); sugg.classList.add('hidden'); }
});

document.addEventListener('click', e => {
  if (!sugg.contains(e.target) && e.target !== input) sugg.classList.add('hidden');
});

document.getElementById('btn-play').addEventListener('click', () => {
  if (!pl.song) return;
  pl.playing ? stopPlayer() : startPlayer();
});

const slider = document.getElementById('speed-slider');
slider.addEventListener('input', () => {
  pl.bpm = parseInt(slider.value);
  document.getElementById('speed-bpm').textContent = pl.bpm + ' BPM';
  if (pl.playing) { clearTimeout(pl.timer); tick(); }
});

document.getElementById('btn-slower').addEventListener('click', () => {
  slider.value = Math.max(40, parseInt(slider.value) - 10);
  slider.dispatchEvent(new Event('input'));
});
document.getElementById('btn-faster').addEventListener('click', () => {
  slider.value = Math.min(240, parseInt(slider.value) + 10);
  slider.dispatchEvent(new Event('input'));
});

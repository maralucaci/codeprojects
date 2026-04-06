'use strict';

// ══════════════════════════════════════════════
//  CHORD SHAPES  (strings: E A D G B e, fret 0=open, -1=muted)
//  positions: [{string, fret, finger}]  barre: {fret, from, to}
// ══════════════════════════════════════════════
const CHORD_SHAPES = {
  'C':   { positions:[{s:5,f:3,n:3},{s:4,f:2,n:2},{s:2,f:1,n:1}], open:[1,2,4], muted:[6] },
  'Cm':  { positions:[{s:5,f:3,n:3},{s:4,f:5,n:4},{s:3,f:5,n:4},{s:2,f:4,n:3}], barre:{fret:3,from:1,to:5} },
  'D':   { positions:[{s:3,f:2,n:1},{s:2,f:3,n:3},{s:1,f:2,n:2}], open:[4], muted:[5,6] },
  'Dm':  { positions:[{s:3,f:2,n:2},{s:2,f:3,n:3},{s:1,f:1,n:1}], open:[4], muted:[5,6] },
  'E':   { positions:[{s:5,f:2,n:2},{s:4,f:2,n:3},{s:3,f:1,n:1}], open:[1,2,4,6] },
  'Em':  { positions:[{s:5,f:2,n:2},{s:4,f:2,n:3}], open:[1,2,3,4,6] },
  'F':   { positions:[{s:5,f:3,n:3},{s:4,f:3,n:4},{s:3,f:2,n:2}], barre:{fret:1,from:1,to:6} },
  'Fm':  { positions:[{s:5,f:3,n:3},{s:4,f:3,n:4}], barre:{fret:1,from:1,to:6} },
  'G':   { positions:[{s:6,f:3,n:2},{s:5,f:2,n:1},{s:1,f:3,n:3}], open:[2,3,4,5] },
  'Gm':  { positions:[{s:5,f:5,n:3},{s:4,f:5,n:4},{s:3,f:3,n:2}], barre:{fret:3,from:1,to:6} },
  'A':   { positions:[{s:4,f:2,n:1},{s:3,f:2,n:2},{s:2,f:2,n:3}], open:[1,5,6], muted:[6] },
  'Am':  { positions:[{s:4,f:2,n:2},{s:3,f:2,n:3},{s:2,f:1,n:1}], open:[1,4,5], muted:[6] },
  'B':   { positions:[{s:4,f:4,n:3},{s:3,f:4,n:4},{s:2,f:4,n:4}], barre:{fret:2,from:1,to:5}, muted:[6] },
  'Bm':  { positions:[{s:4,f:4,n:3},{s:3,f:4,n:4},{s:2,f:3,n:2}], barre:{fret:2,from:1,to:5}, muted:[6] },
  'F#m': { positions:[{s:5,f:4,n:3},{s:4,f:4,n:4},{s:3,f:2,n:1}], barre:{fret:2,from:1,to:5}, muted:[6] },
  'C#m': { positions:[{s:5,f:6,n:3},{s:4,f:6,n:4},{s:3,f:4,n:2}], barre:{fret:4,from:1,to:5}, muted:[6] },
  'G#m': { positions:[{s:5,f:6,n:3},{s:4,f:6,n:4},{s:3,f:4,n:2}], barre:{fret:4,from:1,to:6} },
  'E7':  { positions:[{s:5,f:2,n:2},{s:3,f:1,n:1}], open:[1,2,4,6] },
  'A7':  { positions:[{s:4,f:2,n:2},{s:2,f:2,n:3}], open:[1,3,5], muted:[6] },
  'D7':  { positions:[{s:3,f:2,n:2},{s:2,f:1,n:1},{s:1,f:2,n:3}], open:[4], muted:[5,6] },
  'G7':  { positions:[{s:6,f:3,n:3},{s:5,f:2,n:2},{s:1,f:1,n:1}], open:[2,3,4] },
  'Cadd9':{ positions:[{s:5,f:3,n:3},{s:4,f:2,n:2},{s:1,f:3,n:4}], open:[2,3], muted:[6] },
  'Dsus2':{ positions:[{s:3,f:2,n:1},{s:2,f:3,n:3}], open:[1,4], muted:[5,6] },
  'Esus2':{ positions:[{s:5,f:2,n:2},{s:4,f:2,n:3}], open:[1,2,3,4,6] },
};

// ══════════════════════════════════════════════
//  SONG DATABASE
// ══════════════════════════════════════════════
const SONGS = [
  // POP
  { title:'Shape of You', artist:'Ed Sheeran', chords:['C#m','A','B','E'], bpm:96,
    lyrics:'[C#m]Every day dis-[A]covering something brand new\n[B]I\'m in love with the shape of [E]you' },
  { title:'Blinding Lights', artist:'The Weeknd', chords:['Am','F','C','G'], bpm:171,
    lyrics:'[Am]I\'ve been tryna call\n[F]I\'ve been on my own for long enough\n[C]Maybe you can show me how to love\n[G]Maybe' },
  { title:'Someone Like You', artist:'Adele', chords:['A','C#m','F#m','D'], bpm:68,
    lyrics:'[A]I heard that you\'re settled down\n[C#m]That you found a girl and you\'re married now\n[F#m]I heard that your dreams came true\n[D]Guess she gave you things I didn\'t give to you' },
  { title:'Counting Stars', artist:'OneRepublic', chords:['Am','C','G','F'], bpm:122,
    lyrics:'[Am]Lately I\'ve been, I\'ve been losing sleep\n[C]Dreaming about the things that we could be\n[G]But baby I\'ve been, I\'ve been praying hard\n[F]Said no more counting dollars, we\'ll be counting stars' },
  { title:'Let Her Go', artist:'Passenger', chords:['C','G','Am','F'], bpm:104,
    lyrics:'[C]Well you only need the light when it\'s burning low\n[G]Only miss the sun when it starts to snow\n[Am]Only know you love her when you let her go\n[F]And you let her go' },
  { title:'Viva La Vida', artist:'Coldplay', chords:['C','D','G','Em'], bpm:138,
    lyrics:'[C]I used to rule the world\n[D]Seas would rise when I gave the word\n[G]Now in the morning I sleep alone\n[Em]Sweep the streets I used to own' },
  { title:'Photograph', artist:'Ed Sheeran', chords:['Em','C','G','D'], bpm:108,
    lyrics:'[Em]Loving can hurt, [C]loving can hurt sometimes\n[G]But it\'s the only thing that I know\n[D]When it gets hard, you know it can get hard sometimes' },
  { title:'Perfect', artist:'Ed Sheeran', chords:['G','Em','C','D'], bpm:95,
    lyrics:'[G]I found a love for me\n[Em]Darling just dive right in and follow my lead\n[C]Well I found a girl beautiful and sweet\n[D]I never knew you were the someone waiting for me' },
  { title:'Thinking Out Loud', artist:'Ed Sheeran', chords:['D','A','Bm','G'], bpm:79,
    lyrics:'[D]When your legs don\'t work like they used to before\n[A]And I can\'t sweep you off of your feet\n[Bm]Will your mouth still remember the taste of my love\n[G]Will your eyes still smile from your cheeks' },
  { title:'Stay With Me', artist:'Sam Smith', chords:['Am','F','C','G'], bpm:86,
    lyrics:'[Am]Guess it\'s true I\'m not good at a one-night stand\n[F]But I still need love \'cause I\'m just a man\n[C]These nights never seem to go to plan\n[G]I don\'t want you to leave, will you hold my hand' },

  // ROCK
  { title:'Wonderwall', artist:'Oasis', chords:['Em','G','D','A'], bpm:87,
    lyrics:'[Em]Today is gonna be the day\n[G]That they\'re gonna throw it back to you\n[D]By now you should have somehow\n[A]Realized what you gotta do' },
  { title:'Hotel California', artist:'Eagles', chords:['Bm','F#m','A','E'], bpm:75,
    lyrics:'[Bm]On a dark desert highway [F#m]cool wind in my hair\n[A]Warm smell of colitas [E]rising up through the air' },
  { title:'Knockin on Heavens Door', artist:'Bob Dylan', chords:['G','D','Am','C'], bpm:70,
    lyrics:'[G]Mama, take this badge off of me\n[D]I can\'t use it anymore\n[G]It\'s gettin\' dark, [Am]too dark to see\n[D]I feel I\'m knockin\' on heaven\'s door' },
  { title:'Sweet Home Alabama', artist:'Lynyrd Skynyrd', chords:['D','C','G'], bpm:98,
    lyrics:'[D]Big wheels keep on turning\n[C]Carry me home to see my kin\n[G]Singing songs about the Southland\n[D]I miss Alabamy once again' },
  { title:'Wish You Were Here', artist:'Pink Floyd', chords:['Em','G','A','C','D'], bpm:63,
    lyrics:'[Em]So, so you think you can tell\n[G]Heaven from hell\n[A]Blue skies from pain\n[C]Can you tell a green field\n[D]From a cold steel rail' },
  { title:'Nothing Else Matters', artist:'Metallica', chords:['Em','D','C','Am'], bpm:69,
    lyrics:'[Em]So close, no matter how far\n[D]Couldn\'t be much more from the heart\n[C]Forever trusting who we are\n[Am]And nothing else matters' },
  { title:'Back in Black', artist:'AC/DC', chords:['E','B','A','D','G'], bpm:96,
    lyrics:'[E]Back in black I hit the sack\n[B]I\'ve been too long I\'m glad to be back\n[A]Yes I\'m let loose from the noose\n[D]That\'s kept me hanging about' },
  { title:'Smells Like Teen Spirit', artist:'Nirvana', chords:['F','Bb','Ab','Db'], bpm:117,
    lyrics:'[F]Load up on guns, bring your friends\n[Bb]It\'s fun to lose and to pretend\n[Ab]She\'s overboard and self-assured\n[Db]Oh no, I know a dirty word' },

  // R&B / SOUL
  { title:'Shallow', artist:'Lady Gaga', chords:['Em','D','G','C','Am'], bpm:96,
    lyrics:'[Em]Tell me something girl\n[D]Are you happy in this modern world\n[G]Or do you need more\n[C]Is there something else you\'re searching for' },
  { title:'All of Me', artist:'John Legend', chords:['Em','C','G','D'], bpm:63,
    lyrics:'[Em]What would I do without your smart mouth\n[C]Drawing me in and kicking me out\n[G]Got my head spinning no kidding I can\'t pin you down\n[D]What\'s going on in that beautiful mind' },
  { title:'Hallelujah', artist:'Leonard Cohen', chords:['C','Am','F','G','E'], bpm:64,
    lyrics:'[C]I\'ve heard there was a [Am]secret chord\n[C]That David played and [Am]it pleased the Lord\n[F]But you don\'t really [G]care for music do you' },

  // ROMÂNEȘTI
  { title:'Dragostea Din Tei', artist:'O-Zone', chords:['F','C','Dm','Bb'], bpm:140,
    lyrics:'[F]Ma-ia-hii [C]ma-ia-huu\n[Dm]Ma-ia-hoo [Bb]ma-ia-haa\n[F]Alo, salut, sunt eu, [C]un haiduc\n[Dm]Și te rog, iubito, [Bb]primește-i flori' },
  { title:'Codrule Codrutule', artist:'Folk Românesc', chords:['Am','G','F','E'], bpm:90,
    lyrics:'[Am]Codrule, codruțule\n[G]Ce mai faci drăguțule\n[F]Că de când nu te-am văzut\n[E]Mult mi-a fost și mi-a căzut' },
  { title:'Doi Străini', artist:'Irina Rimes', chords:['Am','F','C','G'], bpm:95,
    lyrics:'[Am]Eram doi străini [F]în același oraș\n[C]Ne-am întâlnit [G]la o schimbare de iarnă\n[Am]Eram doi nebuni [F]cu același vis\n[C]Ne-am recunoscut [G]dintr-o privire' },
  { title:'Vara Nu Dorm', artist:'Carla\'s Dreams', chords:['Dm','Bb','F','C'], bpm:110,
    lyrics:'[Dm]Vara nu dorm [Bb]noaptea\n[F]Mă gândesc la tine [C]toată\n[Dm]Zilele fug [Bb]repede\n[F]Și-ți simt lipsa [C]tot mai mult' },
  { title:'Nu Sunt Eu', artist:'Smiley', chords:['Am','F','C','G'], bpm:105,
    lyrics:'[Am]Nu sunt eu cel de care ai nevoie\n[F]Nu pot să-ți dau ce vrei să-ți dea cineva\n[C]Dar pot să stau și să ascult în voie\n[G]Tot ce ți-e greu, tot ce te apasă' },
  { title:'Lumea ta', artist:'Carla\'s Dreams', chords:['Dm','Am','Bb','F'], bpm:120,
    lyrics:'[Dm]Vreau să fiu [Am]în lumea ta\n[Bb]Vreau să știu [F]ce gândești\n[Dm]Să fiu lângă [Am]tine-ntr-una\n[Bb]Noaptea când te [F]risipești' },
  { title:'Rău', artist:'Delia', chords:['Am','F','C','G'], bpm:130,
    lyrics:'[Am]Eu știu că îți fac rău\n[F]Că nu e bine\n[C]Dar nu mă pot opri\n[G]Să nu fiu cu tine' },

  // LATIN / INTERNATIONAL
  { title:'Despacito', artist:'Luis Fonsi', chords:['Bm','G','D','A'], bpm:89,
    lyrics:'[Bm]Sí, sabes que ya llevo un rato mirándote\n[G]Tengo que bailar contigo hoy\n[D]Vi que tu mirada ya estaba llamándome\n[A]Muéstrame el camino que yo voy' },
  { title:'La Bamba', artist:'Ritchie Valens', chords:['C','F','G'], bpm:170,
    lyrics:'[C]Para bailar la bamba\n[F]Para bailar la bamba\n[G]Se necesita una poca de gracia\n[C]Una poca de gracia para mi para ti' },
  { title:'Bella Ciao', artist:'Folk Italiano', chords:['Dm','A','C','F'], bpm:104,
    lyrics:'[Dm]Una mattina mi son svegliato\n[A]O bella ciao, bella ciao\n[Dm]Bella ciao ciao ciao\n[Dm]Una mattina mi son svegliato\n[C]E ho trovato l\'invasor' },
  { title:'Africa', artist:'Toto', chords:['F#m','D','A','E'], bpm:93,
    lyrics:'[F#m]I hear the drums echoing tonight\n[D]But she hears only whispers of some quiet conversation\n[A]She\'s coming in twelve-thirty flight\n[E]The moonlit wings reflect the stars that guide me towards salvation' },
  { title:'Stand By Me', artist:'Ben E. King', chords:['A','F#m','D','E'], bpm:121,
    lyrics:'[A]When the night has come\n[F#m]And the land is dark\n[D]And the moon is the only light we\'ll see\n[E]No I won\'t be afraid, no I won\'t be afraid\n[A]Just as long as you stand, stand by me' },
  { title:'Knockin on Heavens Door', artist:'Guns N Roses', chords:['G','D','Am','C'], bpm:72,
    lyrics:'[G]Mama, take this badge off of me\n[D]I can\'t use it anymore\n[G]It\'s gettin\' dark, too dark to see\n[Am]I feel I\'m knockin\' on heaven\'s door' },
  { title:'Hey There Delilah', artist:'Plain White T\'s', chords:['D','F#m','Bm','G','A'], bpm:94,
    lyrics:'[D]Hey there Delilah what\'s it like in New York City\n[F#m]I\'m a thousand miles away but girl tonight you look so pretty\n[Bm]Yes you do [G]Times Square can\'t shine as bright as you\n[A]I swear it\'s true' },
  { title:'Riptide', artist:'Vance Joy', chords:['Am','G','C','F'], bpm:104,
    lyrics:'[Am]I was scared of dentists and the dark\n[G]I was scared of pretty girls and starting conversations\n[C]Oh, all my friends are turning green\n[Am]You\'re the magician\'s assistant in their dream' },
  { title:'Budapest', artist:'George Ezra', chords:['C','F','G','Am'], bpm:130,
    lyrics:'[C]My house in Budapest\n[F]My hidden treasure chest\n[G]Golden grand piano\n[Am]My beautiful Castillo\n[F]You, ooh, you, ooh [C]I\'d leave it all' },
  { title:'Take Me to Church', artist:'Hozier', chords:['Am','F','C','G','Em'], bpm:129,
    lyrics:'[Am]My lover\'s got humor\n[F]She\'s the giggle at a funeral\n[C]Knows everybody\'s disapproval\n[G]I should\'ve worshipped her sooner' },
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
    ctx.fillStyle = '#555';
    ctx.font = '12px Segoe UI';
    ctx.textAlign = 'center';
    ctx.fillText('no diagram', W/2, H/2);
    return;
  }

  // Grid settings
  const strings = 6, frets = 5;
  const pl = 28, pt = 24, pr = 10, pb = 10;
  const gw = W - pl - pr;
  const gh = H - pt - pb;
  const sx = gw / (strings - 1);
  const fy = gh / frets;

  // Determine min fret for positioning
  let minFret = 99, maxFret = 0;
  (shape.positions || []).forEach(p => {
    if (p.f > 0) { minFret = Math.min(minFret, p.f); maxFret = Math.max(maxFret, p.f); }
  });
  if (shape.barre) { minFret = Math.min(minFret, shape.barre.fret); maxFret = Math.max(maxFret, shape.barre.fret); }
  if (minFret === 99) minFret = 1;
  const offset = minFret > 1 && !shape.barre ? minFret - 1 : 0;
  const startFret = offset + 1;

  // Fret number
  if (offset > 0) {
    ctx.fillStyle = '#f5c518';
    ctx.font = 'bold 11px Segoe UI';
    ctx.textAlign = 'left';
    ctx.fillText(startFret + 'fr', 1, pt + fy * 0.7);
  }

  // Nut (only if starting at fret 1)
  if (offset === 0) {
    ctx.fillStyle = '#eee';
    ctx.fillRect(pl, pt - 3, gw, 4);
  }

  // Grid lines (frets)
  ctx.strokeStyle = '#444';
  ctx.lineWidth = 1;
  for (let i = 0; i <= frets; i++) {
    ctx.beginPath();
    ctx.moveTo(pl, pt + i * fy);
    ctx.lineTo(pl + gw, pt + i * fy);
    ctx.stroke();
  }

  // Grid lines (strings)
  for (let i = 0; i < strings; i++) {
    ctx.beginPath();
    ctx.moveTo(pl + i * sx, pt);
    ctx.lineTo(pl + i * sx, pt + gh);
    ctx.stroke();
  }

  // Open / muted strings
  (shape.open || []).forEach(s => {
    const x = pl + (6 - s) * sx;
    ctx.strokeStyle = '#4caf50';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(x, pt - 10, 5, 0, Math.PI * 2);
    ctx.stroke();
  });
  (shape.muted || []).forEach(s => {
    const x = pl + (6 - s) * sx;
    ctx.strokeStyle = '#e74c3c';
    ctx.lineWidth = 2;
    const sz = 4;
    ctx.beginPath();
    ctx.moveTo(x - sz, pt - 14); ctx.lineTo(x + sz, pt - 6);
    ctx.moveTo(x + sz, pt - 14); ctx.lineTo(x - sz, pt - 6);
    ctx.stroke();
  });

  // Barre
  if (shape.barre) {
    const y = pt + (shape.barre.fret - startFret + 0.5) * fy;
    const x1 = pl + (6 - shape.barre.to) * sx;
    const x2 = pl + (6 - shape.barre.from) * sx;
    ctx.fillStyle = '#f5c518';
    ctx.beginPath();
    ctx.roundRect(x1 - 4, y - 8, x2 - x1 + 8, 16, 8);
    ctx.fill();
  }

  // Finger positions
  (shape.positions || []).forEach(p => {
    if (p.f <= 0) return;
    const x = pl + (6 - p.s) * sx;
    const y = pt + (p.f - startFret + 0.5) * fy;
    ctx.fillStyle = '#f5c518';
    ctx.beginPath();
    ctx.arc(x, y, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#000';
    ctx.font = 'bold 10px Segoe UI';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(p.n, x, y);
  });

  ctx.textBaseline = 'alphabetic';
}

// ══════════════════════════════════════════════
//  SEARCH
// ══════════════════════════════════════════════
function searchSongs(query) {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return SONGS.filter(s =>
    s.title.toLowerCase().includes(q) ||
    s.artist.toLowerCase().includes(q)
  ).slice(0, 8);
}

// ══════════════════════════════════════════════
//  RENDER SONG
// ══════════════════════════════════════════════
function renderSong(song) {
  document.getElementById('empty-state').classList.add('hidden');
  document.getElementById('result-area').classList.remove('hidden');

  document.getElementById('song-name').textContent = song.title;
  document.getElementById('song-artist').textContent = '— ' + song.artist;

  // Chord strip
  const strip = document.getElementById('chord-strip');
  strip.innerHTML = '';
  song.chords.forEach(c => {
    const pill = document.createElement('div');
    pill.className = 'chord-pill';
    pill.textContent = c;
    strip.appendChild(pill);
  });

  // Diagrams
  const grid = document.getElementById('diagrams-grid');
  grid.innerHTML = '';
  const unique = [...new Set(song.chords)];
  unique.forEach(c => {
    const card = document.createElement('div');
    card.className = 'diagram-card';

    const label = document.createElement('div');
    label.className = 'chord-label';
    label.textContent = c;

    const canvas = document.createElement('canvas');
    canvas.className = 'chord-canvas';
    canvas.width = 110;
    canvas.height = 130;

    const hint = document.createElement('div');
    hint.className = 'finger-hint';
    hint.textContent = getFingerHint(c);

    card.appendChild(label);
    card.appendChild(canvas);
    card.appendChild(hint);
    grid.appendChild(card);

    drawChordDiagram(canvas, c);
  });

  // Lyrics with chords
  const lyricsWrap = document.getElementById('lyrics-wrap');
  if (song.lyrics) {
    lyricsWrap.innerHTML = formatLyrics(song.lyrics);
  } else {
    lyricsWrap.innerHTML = '';
  }
}

function formatLyrics(raw) {
  return raw.split('\n').map(line => {
    const formatted = line.replace(/\[([^\]]+)\]/g, (_, chord) =>
      `<span class="chord-inline">${chord}</span>`
    );
    return `<div>${formatted}</div>`;
  }).join('');
}

function getFingerHint(chord) {
  const hints = {
    'C':'Deget 1→B(1), 2→D(2), 3→A(3)', 'D':'Deget 1→G(2), 2→e(2), 3→B(3)',
    'E':'Deget 1→G(1), 2→A(2), 3→D(2)', 'G':'Deget 2→A(2), 1→d(2), 3→e(3)',
    'A':'Deget 1,2,3→DGB(2)', 'Am':'Deget 1→B(1), 2→D(2), 3→G(2)',
    'Em':'Deget 2→A(2), 3→D(2)', 'Dm':'Deget 1→e(1), 2→G(2), 3→B(3)',
    'F':'Barre fret 1, deget 3→D(3), 4→A(3)', 'Bm':'Barre fret 2 + degete',
  };
  return hints[chord] || '';
}

// ══════════════════════════════════════════════
//  UI EVENTS
// ══════════════════════════════════════════════
document.getElementById('btn-start').addEventListener('click', () => {
  document.getElementById('screen-cover').classList.add('hidden');
  document.getElementById('screen-app').classList.remove('hidden');
  document.getElementById('search-input').focus();
});

const input = document.getElementById('search-input');
const suggestionsEl = document.getElementById('suggestions');

input.addEventListener('input', () => {
  const results = searchSongs(input.value);
  if (!results.length) { suggestionsEl.classList.add('hidden'); return; }
  suggestionsEl.innerHTML = '';
  results.forEach(s => {
    const item = document.createElement('div');
    item.className = 'suggestion-item';
    item.innerHTML = `<div class="s-title">${s.title}</div><div class="s-artist">${s.artist}</div>`;
    item.addEventListener('click', () => {
      input.value = s.title;
      suggestionsEl.classList.add('hidden');
      renderSong(s);
    });
    suggestionsEl.appendChild(item);
  });
  suggestionsEl.classList.remove('hidden');
});

document.getElementById('btn-search').addEventListener('click', () => {
  const results = searchSongs(input.value);
  if (results.length) renderSong(results[0]);
  suggestionsEl.classList.add('hidden');
});

input.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    const results = searchSongs(input.value);
    if (results.length) renderSong(results[0]);
    suggestionsEl.classList.add('hidden');
  }
});

document.addEventListener('click', e => {
  if (!suggestionsEl.contains(e.target) && e.target !== input) {
    suggestionsEl.classList.add('hidden');
  }
});

// ─── State ───────────────────────────────────────────────────────────────────
let currentLevel = 1;
let levelWins    = 0;
const WINS_TO_ADVANCE = 10;

let pool         = buildPool(1);
let currentWord  = "";
let currentHint  = "";
let guessed      = new Set();
let autoRevealed = new Set();
let wrong        = [];
let maxWrong     = 5;
let wins         = 0;
let losses       = 0;
let gameOver     = false;
let lives        = 5;
let globalOver   = false;

// Level 2 state
let antonymPool = [];
let currentSet  = [];
let rowStates   = [];   // 'empty' | 'correct' | 'wrong'
const SET_SIZE  = 8;

// ─── DOM refs ─────────────────────────────────────────────────────────────────
const canvas       = document.getElementById("hangman");
const ctx          = canvas.getContext("2d");
const wordDisplay  = document.getElementById("word-display");
const wrongEl      = document.getElementById("wrong-letters");
const keyboard     = document.getElementById("keyboard");
const messageEl    = document.getElementById("message");
const winsEl       = document.getElementById("wins");
const lossesEl     = document.getElementById("losses");
const remainingEl  = document.getElementById("remaining");
const hintBox      = document.getElementById("hint-box");
const newGameBtn   = document.getElementById("new-game-btn");
const restartBtn   = document.getElementById("restart-btn");
const livesBar     = document.getElementById("lives-bar");
const levelEl      = document.getElementById("level-display");
const hangmanGame  = document.getElementById("hangman-game");
const gridGame     = document.getElementById("grid-game");
const gridMessage  = document.getElementById("grid-message");
const nextSetBtn   = document.getElementById("next-set-btn");
const gridRestartBtn = document.getElementById("grid-restart-btn");

// ─── Init ─────────────────────────────────────────────────────────────────────
buildKeyboard();
renderLives();
renderLevel();
startNewGame();

newGameBtn.addEventListener("click", startNewGame);
restartBtn.addEventListener("click", restartAll);
nextSetBtn.addEventListener("click", loadNextSet);
gridRestartBtn.addEventListener("click", restartAll);

document.addEventListener("keydown", (e) => {
  if (currentLevel === 1) {
    const key = e.key.toUpperCase();
    if (/^[A-ZĂÂÎȘȚ]$/.test(key)) handleGuess(key);
  }
});

// ─── Level 1: Hangman ─────────────────────────────────────────────────────────
function buildPool(level) {
  return shuffle(WORDS.filter(w => w.level === level));
}

function startNewGame() {
  if (globalOver) return;
  if (pool.length === 0) pool = buildPool(currentLevel);

  const entry   = pool.pop();
  currentWord   = normalizeWord(entry.word);
  currentHint   = entry.hint;
  const letters = [...currentWord].filter(ch => ch !== " ");
  autoRevealed  = new Set([letters[0], letters[letters.length - 1]]);
  guessed       = new Set();
  wrong         = [];
  gameOver      = false;

  messageEl.textContent   = "";
  messageEl.className     = "message";
  hintBox.textContent     = `Indiciu: ${currentHint}`;
  remainingEl.textContent = pool.length;

  renderWord();
  renderWrong();
  renderKeyboard();
  drawHangman();
}

function handleGuess(letter) {
  if (gameOver || globalOver || guessed.has(letter) || autoRevealed.has(letter)) return;
  guessed.add(letter);

  if (currentWord.includes(letter)) {
    renderWord();
    if (isWon()) endGame(true);
  } else {
    wrong.push(letter);
    renderWrong();
    drawHangman();
    if (wrong.length >= maxWrong) endGame(false);
  }
  renderKeyboard();
}

function isWon() {
  return [...currentWord].every(ch => ch === " " || guessed.has(ch) || autoRevealed.has(ch));
}

function endGame(won) {
  gameOver = true;
  if (won) {
    wins++;
    levelWins++;
    winsEl.textContent = wins;
    renderLevel();
    if (currentLevel === 1 && levelWins >= WINS_TO_ADVANCE) {
      currentLevel = 2;
      levelWins    = 0;
      messageEl.textContent = "Felicitari! Treci la Nivel 2 — Antonime!";
      messageEl.className   = "message win level-up";
      setTimeout(() => startLevel2(), 1600);
    } else {
      messageEl.textContent = "Ai ghicit! Bravo!";
      messageEl.className   = "message win";
    }
  } else {
    losses++;
    lives = Math.max(0, lives - 1);
    lossesEl.textContent = losses;
    renderLives();
    if (lives === 0) {
      globalOver = true;
      messageEl.textContent = `Game over! Cuvantul era: ${currentWord}`;
      messageEl.className   = "message lose";
    } else {
      messageEl.textContent = `Cuvantul era: ${currentWord} — mai ai ${lives} ${lives === 1 ? "viata" : "vieti"}!`;
      messageEl.className   = "message lose";
    }
  }
}

function restartAll() {
  currentLevel = 1;
  levelWins    = 0;
  pool         = buildPool(1);
  wins         = 0;
  losses       = 0;
  lives        = 5;
  globalOver   = false;
  winsEl.textContent   = 0;
  lossesEl.textContent = 0;

  hangmanGame.style.display  = "block";
  gridGame.style.display     = "none";
  nextSetBtn.style.display   = "none";

  renderLives();
  renderLevel();
  startNewGame();
}

// ─── Level 2: Antonym Grid ────────────────────────────────────────────────────
function startLevel2() {
  hangmanGame.style.display = "none";
  gridGame.style.display    = "block";
  antonymPool = shuffle([...ANTONYMS]);
  renderLevel();
  loadNextSet();
}

function loadNextSet() {
  if (antonymPool.length === 0) {
    gridMessage.textContent = "Ai completat toate antonimele! Felicitari!";
    gridMessage.className   = "message win level-up";
    nextSetBtn.style.display = "none";
    return;
  }

  currentSet = antonymPool.splice(0, Math.min(SET_SIZE, antonymPool.length));
  rowStates  = currentSet.map(() => "empty");
  remainingEl.textContent  = antonymPool.length;
  gridMessage.textContent  = "";
  gridMessage.className    = "message";
  nextSetBtn.style.display = "none";

  buildAntonymGrid();
}

function buildAntonymGrid() {
  const grid = document.getElementById("antonym-grid");
  grid.innerHTML = "";

  currentSet.forEach((pair, rowIdx) => {
    const row = document.createElement("div");
    row.className  = "grid-row";
    row.dataset.row = rowIdx;

    const cells = document.createElement("div");
    cells.className = "cells";

    [...pair.answer].forEach((_, colIdx) => {
      const input = document.createElement("input");
      input.type         = "text";
      input.maxLength    = 2;
      input.className    = "grid-cell";
      input.dataset.row  = rowIdx;
      input.dataset.col  = colIdx;
      input.autocomplete = "off";
      input.spellcheck   = false;
      input.addEventListener("keydown", (e) => handleCellKeydown(e, rowIdx, colIdx, pair.answer.length));
      input.addEventListener("input",   (e) => handleCellInput(e, rowIdx, colIdx, pair.answer.length));
      cells.appendChild(input);
    });

    const clue = document.createElement("span");
    clue.className   = "clue-word";
    clue.textContent = pair.clue;

    row.appendChild(cells);
    row.appendChild(clue);
    grid.appendChild(row);
  });

  const first = getCell(0, 0);
  if (first) first.focus();
}

function handleCellKeydown(e, row, col, rowLen) {
  if (rowStates[row] === "correct") return;

  if (e.key === "Backspace") {
    const cell = getCell(row, col);
    if (cell.value) {
      cell.value = "";
    } else {
      focusCell(row, col - 1);
    }
    e.preventDefault();
  } else if (e.key === "ArrowLeft") {
    focusCell(row, col - 1); e.preventDefault();
  } else if (e.key === "ArrowRight") {
    focusCell(row, col + 1); e.preventDefault();
  } else if (e.key === "ArrowUp") {
    if (row > 0) focusCell(row - 1, Math.min(col, currentSet[row - 1].answer.length - 1));
    e.preventDefault();
  } else if (e.key === "ArrowDown") {
    const next = Math.min(currentSet.length - 1, row + 1);
    focusCell(next, Math.min(col, currentSet[next].answer.length - 1));
    e.preventDefault();
  }
}

function handleCellInput(e, row, col, rowLen) {
  if (rowStates[row] === "correct") return;

  const cell = getCell(row, col);
  const raw  = cell.value.toUpperCase().replace(/[^A-ZĂÂÎȘȚ]/g, "");
  cell.value = raw ? raw[raw.length - 1] : "";

  if (cell.value) {
    if (col < rowLen - 1) {
      focusCell(row, col + 1);
    } else {
      checkRow(row);
    }
  }
}

function checkRow(rowIdx) {
  if (globalOver) return;
  const pair    = currentSet[rowIdx];
  const cells   = getRowCells(rowIdx);
  const entered = cells.map(c => c.value).join("");

  if (entered.length < pair.answer.length) return;

  if (entered === pair.answer) {
    rowStates[rowIdx] = "correct";
    cells.forEach(c => { c.classList.add("cell-correct"); c.disabled = true; });
    wins++;
    winsEl.textContent = wins;

    if (rowStates.every(s => s === "correct")) {
      if (antonymPool.length > 0) {
        gridMessage.textContent  = "Set complet! Bravo!";
        gridMessage.className    = "message win";
        nextSetBtn.style.display = "inline-block";
      } else {
        gridMessage.textContent  = "Ai completat toate antonimele! Felicitari!";
        gridMessage.className    = "message win level-up";
        nextSetBtn.style.display = "none";
      }
    }
  } else {
    cells.forEach(c => c.classList.add("cell-wrong"));
    lives = Math.max(0, lives - 1);
    losses++;
    lossesEl.textContent = losses;
    renderLives();

    if (lives === 0) {
      globalOver = true;
      gridMessage.textContent = "Game over! Ai ramas fara vieti!";
      gridMessage.className   = "message lose";
      document.querySelectorAll(".grid-cell:not(:disabled)").forEach(c => c.disabled = true);
    } else {
      setTimeout(() => {
        cells.forEach(c => { c.classList.remove("cell-wrong"); c.value = ""; });
        rowStates[rowIdx] = "empty";
        const first = getCell(rowIdx, 0);
        if (first) first.focus();
      }, 700);
    }
  }
}

function getCell(row, col) {
  return document.querySelector(`.grid-cell[data-row="${row}"][data-col="${col}"]`);
}

function getRowCells(row) {
  return [...document.querySelectorAll(`.grid-cell[data-row="${row}"]`)];
}

function focusCell(row, col) {
  if (row < 0 || col < 0) return;
  const cell = getCell(row, col);
  if (cell && !cell.disabled) cell.focus();
}

// ─── Render ───────────────────────────────────────────────────────────────────
function renderLevel() {
  if (currentLevel === 1) {
    levelEl.textContent = `Nivel ${currentLevel}  ·  ${levelWins}/${WINS_TO_ADVANCE}`;
  } else {
    levelEl.textContent = `Nivel 2  ·  Antonime`;
  }
}

function renderLives() {
  livesBar.innerHTML = Array.from({ length: 5 }, (_, i) =>
    `<span class="heart ${i < lives ? "alive" : "dead"}">♥</span>`
  ).join("");
}

function renderWord() {
  wordDisplay.innerHTML = [...currentWord].map(ch => {
    if (ch === " ") return `<span class="letter space"></span>`;
    const shown = guessed.has(ch) || autoRevealed.has(ch);
    return `<span class="letter ${shown ? "revealed" : "hidden"}">${shown ? ch : "_"}</span>`;
  }).join("");
}

function renderWrong() {
  wrongEl.innerHTML = wrong.map(l => `<span class="wrong-letter">${l}</span>`).join(" ");
}

function renderKeyboard() {
  [...keyboard.querySelectorAll(".key")].forEach(btn => {
    const l = btn.dataset.letter;
    btn.disabled = guessed.has(l) || gameOver;
    if (guessed.has(l)) {
      btn.classList.add(currentWord.includes(l) ? "correct" : "incorrect");
    } else {
      btn.classList.remove("correct", "incorrect");
    }
  });
}

// ─── Keyboard builder ─────────────────────────────────────────────────────────
function buildKeyboard() {
  const rows = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM", "ĂÂÎȘȚ"];
  rows.forEach(row => {
    const rowDiv = document.createElement("div");
    rowDiv.className = "key-row";
    [...row].forEach(letter => {
      const btn = document.createElement("button");
      btn.className      = "key";
      btn.textContent    = letter;
      btn.dataset.letter = letter;
      btn.addEventListener("click", () => handleGuess(letter));
      rowDiv.appendChild(btn);
    });
    keyboard.appendChild(rowDiv);
  });
}

// ─── Canvas drawing ───────────────────────────────────────────────────────────
function drawHangman() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#f5f5e8";
  ctx.lineWidth   = 3;
  ctx.lineCap     = "round";
  ctx.lineJoin    = "round";
  ctx.shadowColor = "rgba(245,245,232,0.4)";
  ctx.shadowBlur  = 4;

  chalkLine(20, 250, 200, 250);
  chalkLine(60, 250, 60, 20);
  chalkLine(60, 20, 150, 20);
  chalkLine(150, 20, 150, 55);

  const parts = [drawHead, drawBody, drawLeftArm, drawRightArm, drawLegs];
  for (let i = 0; i < wrong.length && i < parts.length; i++) parts[i]();
}

function chalkLine(x1, y1, x2, y2) {
  ctx.beginPath();
  ctx.moveTo(x1 + jitter(), y1 + jitter());
  ctx.lineTo(x2 + jitter(), y2 + jitter());
  ctx.stroke();
}

function jitter() { return (Math.random() - 0.5) * 1.5; }

function drawHead()     { ctx.beginPath(); ctx.arc(150 + jitter(), 72, 17, 0, Math.PI * 2); ctx.stroke(); }
function drawBody()     { chalkLine(150, 89, 150, 170); }
function drawLeftArm()  { chalkLine(150, 105, 120, 145); }
function drawRightArm() { chalkLine(150, 105, 180, 145); }
function drawLegs()     { chalkLine(150, 170, 120, 215); chalkLine(150, 170, 180, 215); }

// ─── Helpers ──────────────────────────────────────────────────────────────────
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function normalizeWord(str) {
  return str.toUpperCase().trim();
}

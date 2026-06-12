// Game State
let targetNumber = 0;
let attempts = 0;
const maxAttempts = 10;
let minRange = 1;
let maxRange = 100;
let isGameOver = false;
let isWin = false;
let guessHistory = [];

// DOM Elements
const rangeDisplay = document.getElementById('range-display');
const attemptsDisplay = document.getElementById('attempts-display');
const progressBar = document.getElementById('progress-bar');
const messageEl = document.getElementById('message');
const guessForm = document.getElementById('guess-form');
const guessInput = document.getElementById('guess-input');
const resetBtn = document.getElementById('reset-btn');
const historySection = document.getElementById('history-section');
const historyList = document.getElementById('history-list');
const canvas = document.getElementById('confetti-canvas');
const ctx = canvas.getContext('2d');

// Canvas setup for confetti
let confettiActive = false;
let particles = [];
const colors = ['#f472b6', '#a855f7', '#6366f1', '#60a5fa', '#34d399', '#fbbf24'];

function init() {
  targetNumber = Math.floor(Math.random() * 100) + 1;
  attempts = 0;
  minRange = 1;
  maxRange = 100;
  isGameOver = false;
  isWin = false;
  guessHistory = [];

  // Reset UI
  rangeDisplay.textContent = '1 - 100';
  attemptsDisplay.textContent = maxAttempts;
  progressBar.style.width = '100%';
  progressBar.style.background = 'linear-gradient(to right, #6366f1, #a855f7)';
  messageEl.textContent = '請輸入 1 到 100 之間的數字開始遊戲';
  messageEl.className = 'game-message';
  
  guessInput.value = '';
  guessInput.min = 1;
  guessInput.max = 100;
  guessInput.disabled = false;
  
  guessForm.classList.remove('hidden');
  resetBtn.classList.add('hidden');
  historySection.classList.add('hidden');
  historyList.innerHTML = '';
  
  confettiActive = false;
  particles = [];
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Check Guess function
function checkGuess(num) {
  if (isGameOver) return;

  if (isNaN(num) || num < 1 || num > 100) {
    setMessage('請輸入 1 到 100 之間的數字！', 'danger');
    return;
  }

  attempts++;
  const remaining = maxAttempts - attempts;
  attemptsDisplay.textContent = remaining;
  
  // Progress bar calculation
  const progressPercent = (remaining / maxAttempts) * 100;
  progressBar.style.width = `${progressPercent}%`;
  
  if (progressPercent <= 30) {
    progressBar.style.background = 'var(--danger-color)';
  } else if (progressPercent <= 60) {
    progressBar.style.background = '#fbbf24';
  }

  let result = '';
  let badgeClass = '';

  if (num === targetNumber) {
    isWin = true;
    isGameOver = true;
    result = '猜對了';
    badgeClass = 'badge-correct';
    setMessage(`恭喜你！猜對了！目標數字是 ${targetNumber}。`, 'win');
    startConfetti();
  } else if (num < targetNumber) {
    minRange = Math.max(num + 1, minRange);
    result = '太小了';
    badgeClass = 'badge-up';
    setMessage('太小了！', 'up');
  } else {
    maxRange = Math.min(num - 1, maxRange);
    result = '太大了';
    badgeClass = 'badge-down';
    setMessage('太大了！', 'down');
  }

  // Update Range
  rangeDisplay.textContent = `${minRange} - ${maxRange}`;
  guessInput.min = minRange;
  guessInput.max = maxRange;

  // Add to history
  addHistoryItem(attempts, num, result, badgeClass);

  if (attempts >= maxAttempts && !isWin) {
    isGameOver = true;
    setMessage(`遊戲結束！次數已耗盡。答案是 ${targetNumber}。`, 'lose');
  }

  if (isGameOver) {
    endGame();
  }
}

// UI Message helpers
function setMessage(text, type) {
  messageEl.textContent = text;
  messageEl.className = 'game-message';
  
  if (type === 'up') {
    messageEl.classList.add('message-highlight-up');
  } else if (type === 'down') {
    messageEl.classList.add('message-highlight-down');
  } else if (type === 'win') {
    messageEl.classList.add('message-win');
  } else if (type === 'lose') {
    messageEl.classList.add('message-lose');
  }
}

function addHistoryItem(attempt, guess, result, badgeClass) {
  historySection.classList.remove('hidden');
  const div = document.createElement('div');
  div.className = 'history-item';
  div.innerHTML = `
    <span>第 ${attempt} 次猜測</span>
    <div>
      <span class="history-guess">${guess}</span>
      <span class="history-badge ${badgeClass}">${result}</span>
    </div>
  `;
  historyList.insertBefore(div, historyList.firstChild);
}

function endGame() {
  guessInput.disabled = true;
  guessForm.classList.add('hidden');
  resetBtn.classList.remove('hidden');
}

// Event Listeners
guessForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const val = parseInt(guessInput.value, 10);
  checkGuess(val);
  guessInput.value = '';
  guessInput.focus();
});

resetBtn.addEventListener('click', init);

// Confetti Effect
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class ConfettiParticle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height - canvas.height;
    this.r = Math.random() * 6 + 4;
    this.d = Math.random() * canvas.height;
    this.color = colors[Math.floor(Math.random() * colors.length)];
    this.tilt = Math.random() * 10 - 5;
    this.tiltAngleIncremental = Math.random() * 0.07 + 0.02;
    this.tiltAngle = 0;
  }
  
  draw() {
    ctx.beginPath();
    ctx.lineWidth = this.r / 2;
    ctx.strokeStyle = this.color;
    ctx.moveTo(this.x + this.tilt + this.r / 2, this.y);
    ctx.lineTo(this.x + this.tilt, this.y + this.tilt + this.r / 2);
    ctx.stroke();
  }
  
  update() {
    this.tiltAngle += this.tiltAngleIncremental;
    this.y += (Math.cos(this.d) + 3 + this.r / 2) / 2;
    this.x += Math.sin(this.tiltAngle);
    this.tilt = Math.sin(this.tiltAngle - this.r / 2) * 5;
    
    if (this.y > canvas.height) {
      this.x = Math.random() * canvas.width;
      this.y = -20;
      this.tilt = Math.random() * 10 - 5;
    }
  }
}

function startConfetti() {
  confettiActive = true;
  particles = [];
  for (let i = 0; i < 150; i++) {
    particles.push(new ConfettiParticle());
  }
  animateConfetti();
}

function animateConfetti() {
  if (!confettiActive) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  particles.forEach(p => {
    p.update();
    p.draw();
  });
  
  requestAnimationFrame(animateConfetti);
}

// Start Game on Load
init();

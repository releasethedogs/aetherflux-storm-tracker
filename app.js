let stormCount = 0;
let lifeGained = 0;
let currentLife = 40;
let history = [];

const stormCountEl = document.getElementById('stormCount');
const nextGainEl = document.getElementById('nextGain');
const lifeGainedEl = document.getElementById('lifeGained');
const currentLifeEl = document.getElementById('currentLife');
const logEl = document.getElementById('log');
const startingLifeEl = document.getElementById('startingLife');

function save() {
  localStorage.setItem('aetherfluxTracker', JSON.stringify({ stormCount, lifeGained, currentLife, history }));
}

function load() {
  const saved = localStorage.getItem('aetherfluxTracker');
  if (!saved) return;
  try {
    const data = JSON.parse(saved);
    stormCount = data.stormCount ?? 0;
    lifeGained = data.lifeGained ?? 0;
    currentLife = data.currentLife ?? 40;
    history = data.history ?? [];
    startingLifeEl.value = currentLife;
  } catch (_) {}
}

function render() {
  stormCountEl.textContent = stormCount;
  nextGainEl.textContent = stormCount + 1;
  lifeGainedEl.textContent = lifeGained;
  currentLifeEl.textContent = currentLife;

  logEl.innerHTML = '';
  history.slice().reverse().forEach(entry => {
    const li = document.createElement('li');
    li.textContent = entry;
    logEl.appendChild(li);
  });
  save();
}

function castSpell() {
  stormCount += 1;
  const gain = stormCount;
  lifeGained += gain;
  currentLife += gain;
  history.push(`Spell ${stormCount}: gained ${gain} life. Current life: ${currentLife}.`);
  render();
}

function undoSpell() {
  if (stormCount <= 0) return;
  const gain = stormCount;
  currentLife -= gain;
  lifeGained -= gain;
  history.push(`Undo spell ${stormCount}: removed ${gain} life.`);
  stormCount -= 1;
  render();
}

function newTurn() {
  stormCount = 0;
  lifeGained = 0;
  history.push('New turn started. Storm count and turn life gain reset.');
  render();
}

function payReservoir() {
  if (currentLife < 50) {
    alert('You need at least 50 life to activate Aetherflux Reservoir.');
    return;
  }
  currentLife -= 50;
  history.push(`Paid 50 life: Aetherflux Reservoir deals 50 damage. Current life: ${currentLife}.`);
  render();
}

function setLife() {
  const value = Number(startingLifeEl.value);
  if (Number.isNaN(value) || value < 0) return;
  currentLife = value;
  history.push(`Life total set to ${currentLife}.`);
  render();
}

function resetAll() {
  stormCount = 0;
  lifeGained = 0;
  currentLife = 40;
  history = [];
  startingLifeEl.value = 40;
  localStorage.removeItem('aetherfluxTracker');
  render();
}

document.getElementById('castSpell').addEventListener('click', castSpell);
document.getElementById('undoSpell').addEventListener('click', undoSpell);
document.getElementById('newTurn').addEventListener('click', newTurn);
document.getElementById('payReservoir').addEventListener('click', payReservoir);
document.getElementById('setLife').addEventListener('click', setLife);
document.getElementById('resetAll').addEventListener('click', resetAll);

load();
render();


if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js').catch(() => {});
  });
}

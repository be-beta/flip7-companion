let players = [];
let targetScore = 200;
let round = 1;

let selectedNumbers = [];
let selectedModifiers = [];
let currentPlayerIndex = null;

function saveGame() {
  localStorage.setItem("flip7game", JSON.stringify({ players, targetScore, round }));
}

function loadGame() {
  const saved = localStorage.getItem("flip7game");
  if (saved) {
    const data = JSON.parse(saved);
    players = data.players;
    targetScore = data.targetScore;
    round = data.round;
    document.getElementById("setup").classList.add("hidden");
    document.getElementById("game").classList.remove("hidden");
    renderPlayers();
    updateRoundDisplay();
  }
}

function addPlayer() {
  const name = document.getElementById("playerName").value.trim();
  if (!name) return;

  players.push({ name, total: 0, history: [] });
  document.getElementById("playerName").value = "";
  renderPlayerList();
}

function renderPlayerList() {
  const list = document.getElementById("playerList");
  list.innerHTML = "";
  players.forEach(p => {
    const li = document.createElement("li");
    li.textContent = p.name;
    list.appendChild(li);
  });
}

function startGame() {
  if (players.length < 1) return;
  targetScore = parseInt(document.getElementById("targetScore").value);
  document.getElementById("setup").classList.add("hidden");
  document.getElementById("game").classList.remove("hidden");
  renderPlayers();
  updateRoundDisplay();
  saveGame();
}

function renderPlayers() {
  const container = document.getElementById("playersContainer");
  container.innerHTML = "";

  players.forEach((player, index) => {
    const div = document.createElement("div");
    div.className = "player-card";

    div.innerHTML = `
      <h3>${player.name}</h3>
      <div class="score">Total: ${player.total}</div>
      <button onclick="openCardModal(${index})">Registrar Cartas</button>
    `;

    container.appendChild(div);
  });
}

function updateRoundDisplay() {
  document.getElementById("roundDisplay").innerText = `Rodada ${round}`;
}

function nextRound() {
  round++;
  updateRoundDisplay();
  saveGame();
}

function openCardModal(index) {
  currentPlayerIndex = index;
  selectedNumbers = [];
  selectedModifiers = [];
  document.getElementById("modalPlayerName").innerText = players[index].name;
  buildCardButtons();
  document.getElementById("roundPreview").innerText = 0;
  document.getElementById("cardModal").classList.remove("hidden");
}

function buildCardButtons() {
  const numberContainer = document.getElementById("numberButtons");
  const modifierContainer = document.getElementById("modifierButtons");

  numberContainer.innerHTML = "";
  modifierContainer.innerHTML = "";

  numberContainer.className = "card-grid";
  modifierContainer.className = "card-grid";

  for (let i = 0; i <= 12; i++) {
    const btn = document.createElement("div");
    btn.className = "card-btn";
    btn.innerText = i;
    btn.onclick = () => addNumber(i);
    numberContainer.appendChild(btn);
  }

  const modifiers = ["+2","+4","+6","+8","+10","x2"];
  modifiers.forEach(mod => {
    const btn = document.createElement("div");
    btn.className = "card-btn";
    btn.innerText = mod;
    btn.onclick = () => addModifier(mod);
    modifierContainer.appendChild(btn);
  });
}

function addNumber(num) {
  selectedNumbers.push(num);
  calculatePreview();
}

function addModifier(mod) {
  selectedModifiers.push(mod);
  calculatePreview();
}

function calculatePreview() {
  let sum = selectedNumbers.reduce((a,b) => a+b, 0);

  selectedModifiers.forEach(mod => {
    if (mod === "x2") sum *= 2;
    else sum += parseInt(mod.replace("+",""));
  });

  document.getElementById("roundPreview").innerText = sum;
}

function confirmCards() {
  let finalScore = parseInt(document.getElementById("roundPreview").innerText);

  players[currentPlayerIndex].total += finalScore;
  players[currentPlayerIndex].history.push(finalScore);

  if (players[currentPlayerIndex].total >= targetScore) {
    alert(`${players[currentPlayerIndex].name} venceu!`);
  }

  closeModal();
  renderPlayers();
  saveGame();
}

function closeModal() {
  document.getElementById("cardModal").classList.add("hidden");
}

function resetGame() {
  localStorage.removeItem("flip7game");
  location.reload();
}

loadGame();
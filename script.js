const winningCombos = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

let board = Array(9).fill(0);
let jogadasIA = JSON.parse(localStorage.getItem("knn_dataset")) || [];
let historicoProgresso = JSON.parse(localStorage.getItem("knn_progresso")) || [];
let chartInstance = null;
let movimentosDaPartida = 0;
let aprendizado = 0;
let jogadasDaIAPartida = [];

function euclideanDistance(a, b) {
  return Math.sqrt(a.reduce((sum, val, i) => sum + (val - b[i]) ** 2, 0));
}

function checkThreat(board, player) {
  for (const combo of winningCombos) {
    const values = combo.map(i => board[i]);
    const empty = combo.filter(i => board[i] === 0);
    if (values.filter(v => v === player).length === 2 && empty.length === 1) {
      return empty[0];
    }
  }
  return null;
}

function getBestMove(board, k = 3) {
  const isFirstPlay = board.filter(v => v !== 0).length === 1;
  if (isFirstPlay && board[4] === 0 && aprendizado >= 100) return 4;

  if (aprendizado >= 100) {
    const winMove = checkThreat(board, -1);
    if (winMove !== null) return winMove;
    const blockMove = checkThreat(board, 1);
    if (blockMove !== null) return blockMove;
    if (board[4] === 0) return 4;
    const corners = [0, 2, 6, 8].filter(i => board[i] === 0);
    if (corners.length > 0) return corners[Math.floor(Math.random() * corners.length)];
  }

  if (jogadasIA.length >= 5) {
    const block = checkThreat(board, 1);
    if (block !== null) return block;
  }

  if (jogadasIA.length < 5) {
    const empty = board.map((v, i) => v === 0 ? i : -1).filter(i => i !== -1);
    return empty[Math.floor(Math.random() * empty.length)];
  }

  const distances = jogadasIA.map((data, i) => ({
    index: i,
    distance: euclideanDistance(board, data.board)
  })).sort((a, b) => a.distance - b.distance);

  const neighbors = distances.slice(0, k)
    .map(n => jogadasIA[n.index].move)
    .filter(m => board[m] === 0);

  if (neighbors.length === 0) {
    const empty = board.map((v, i) => v === 0 ? i : -1).filter(i => i !== -1);
    return empty[Math.floor(Math.random() * empty.length)];
  }

  const counts = neighbors.reduce((acc, move) => {
    acc[move] = (acc[move] || 0) + 1;
    return acc;
  }, {});

  return parseInt(Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b));
}

function updateProgress() {
  aprendizado = Math.min(100, Math.round((jogadasIA.length / 20) * 100));

  const jogadasDaPartida = jogadasIA.slice(-movimentosDaPartida);
  const jogadasKNN = jogadasDaPartida.filter(j => j.viaKNN).length;

  if (movimentosDaPartida > 0) {
    historicoProgresso.push({
      aprendizado,
      movimentos: movimentosDaPartida,
      jogadasKNN,
      jogadasIA: [...jogadasDaIAPartida]
    });
  }

  localStorage.setItem("knn_dataset", JSON.stringify(jogadasIA));
  localStorage.setItem("knn_progresso", JSON.stringify(historicoProgresso));

  const bar = document.getElementById('intelligenceBar');
  bar.style.width = aprendizado + '%';
  bar.textContent = aprendizado + '%';

  const feedback = document.getElementById('message');
  if (aprendizado < 30) {
    feedback.textContent = "Vovó é leiga.";
  } else if (aprendizado < 50) {
    feedback.textContent = "Vovó está começando a entender seus padrões...";
  } else if (aprendizado < 75) {
    feedback.textContent = "Ela já consegue antecipar seus movimentos.";
  } else if (aprendizado < 100) {
    feedback.textContent = "Quase uma profissional!";
  } else {
    feedback.textContent = "Duvido você ganhar...";
  }
}

function makeMove(index) {
  if (board[index] !== 0) return;
  board[index] = 1;
  renderBoard();
  hideEndElements(); // 👈 Esconde elementos no início da jogada

  if (checkWin(1)) return endGame('Você venceu!');
  if (board.every(v => v !== 0)) return endGame('Empate!');

  setTimeout(() => {
    const foiViaKNN = jogadasIA.length >= 5;
    const move = getBestMove(board);
    board[move] = -1;
    jogadasIA.push({ board: [...board], move, viaKNN: foiViaKNN });
    jogadasDaIAPartida.push(move);
    movimentosDaPartida++;
    updateProgress();
    renderBoard();
    if (checkWin(-1)) return endGame('Vovó venceu!');
    if (board.every(v => v !== 0)) return endGame('Empate!');
  }, 500);
}

function checkWin(player) {
  return winningCombos.some(combo => combo.every(i => board[i] === player));
}

function fazerScrollParaOBotao() {
  const botaoJogar = document.getElementById('resetBtn');

  // Rola a tela suavemente até o botão
  if (botaoJogar) {
    // Usamos um pequeno timeout para garantir que o botão já está visível na tela
    setTimeout(() => {
      botaoJogar.scrollIntoView({
        behavior: 'smooth', // Animação de rolagem
        block: 'center'     // Alinha o botão ao centro
      });
    }, 100); // 100 milissegundos de espera
  }
}

function endGame(message) {
  document.getElementById('message').textContent = message;
  document.querySelectorAll('.cell').forEach(cell => cell.onclick = null);
  document.getElementById('resetBtn').style.display = 'inline-block';
  document.getElementById('resetLearningBtn').style.display = 'inline-block';
  document.getElementById('toggleChart').style.display = 'block';
  
  // --- Adicione o código para o texto aqui ---
  const statsText = document.getElementById('statsText'); 
  if (statsText) {                                        
    statsText.style.display = 'block';                    
  }                                                      
  // ---------------------------------------------

  gerarGraficoIA();
  movimentosDaPartida = 0;

  const imgIA = document.getElementById('velhinha');
  if (message.includes("Você venceu!")) {
    imgIA.src = "velhinhaperde.png";
  } else if (message.includes("Vovó venceu!")) {
    imgIA.src = "velhinhaganha.png";
  } else {
    imgIA.src = "velhinha.png";
  }

  fazerScrollParaOBotao(); 
}

function resetGame() {
  board = Array(9).fill(0);
  movimentosDaPartida = 0;
  jogadasDaIAPartida = [];
  document.getElementById('message').textContent = '';
  document.getElementById('velhinha').src = "velhinha.png";
  document.getElementById('chartContainer').classList.remove('show');
  document.getElementById('toggleChart').style.display = 'none';
  document.getElementById('resetBtn').style.display = 'none';
  document.getElementById('resetLearningBtn').style.display = 'none';

  const statsText = document.getElementById('statsText'); 
  if (statsText) {                                        
    statsText.style.display = 'none';                     
  }                                                       

  renderBoard();
}

function resetLearning() {
  localStorage.removeItem("knn_dataset");
  localStorage.removeItem("knn_progresso");
  jogadasIA = [];
  historicoProgresso = [];
  aprendizado = 0;
  updateProgress();
  gerarGraficoIA();
  resetGame();
}

function toggleChartVisibility() {
  const chart = document.getElementById('chartContainer');
  const arrow = document.getElementById('arrowIcon');
  const isOpen = chart.classList.contains('show');

  if (isOpen) {
    chart.classList.remove('show');
    arrow.classList.remove('rotated');
    arrow.textContent = '▼';
  } else {
    chart.classList.add('show');
    arrow.classList.add('rotated');
    arrow.textContent = '▲';
    setTimeout(() => {
      chart.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 300);
  }
}

function hideEndElements() {
  document.getElementById('resetBtn').style.display = 'none';
  document.getElementById('toggleChart').style.display = 'none';
  document.getElementById('chartContainer').classList.remove('show');
}

function gerarGraficoIA() {
  const ctx = document.getElementById('chartIA');
  if (chartInstance !== null) chartInstance.destroy();

  const labels = historicoProgresso.map((_, i) => `Jogada ${i + 1}`);
  const dadosAprendizado = historicoProgresso.map(entry => entry.aprendizado);
  const dadosDataset = historicoProgresso.map((_, i) => Math.min(i + 1, jogadasIA.length));
  const dadosKNN = historicoProgresso.map(entry => entry.jogadasKNN || 0);

  chartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Evolução da IA (%)',
          data: dadosAprendizado,
          borderColor: '#00da91ff',
          backgroundColor: 'rgba(127, 255, 212, 0.2)',
          tension: 0.2,
          fill: true,
          yAxisID: 'y'
        },
        {
          label: 'Tamanho do dataset KNN',
          data: dadosDataset,
          borderColor: '#ffa07a',
          backgroundColor: 'rgba(255, 160, 122, 0.2)',
          tension: 0.3,
          fill: false,
          yAxisID: 'y2'
        },
        {
          label: 'Jogadas feitas via KNN',
          data: dadosKNN,
          borderColor: '#87cefa',
          backgroundColor: 'rgba(135, 206, 250, 0.2)',
          tension: 0.3,
          fill: false,
          yAxisID: 'y2'
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        tooltip: {
          callbacks: {
            label: function (context) {
              const partida = historicoProgresso[context.dataIndex];
              if (context.dataset.label === 'Evolução da IA (%)') {
                return `Aprendizado: ${partida.aprendizado}% | Jogadas conhecidas: ${partida.movimentos}`;
              } else if (context.dataset.label === 'Jogadas feitas via KNN') {
                return `Jogadas via KNN: ${partida.jogadasKNN || 0}`;
              } else {
                const jogadas = partida.jogadasIA ? partida.jogadasIA.join(', ') : '-';
                return `Casas jogadas pela IA: ${jogadas}`;
              }
            }
          }
        },
        legend: { labels: { color: '#000' } }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          title: { display: true, text: 'Aprendizado (%)' },
          ticks: { color: '#049c69ff' }
        },
        y2: {
          position: 'right',
          beginAtZero: true,
          grid: { drawOnChartArea: false },
          title: { display: true, text: 'Jogadas' },
          ticks: { color: '#ff7f4cff' }
        },
        x: {
          ticks: { display: false },
          grid: { display: false },
          title: { display: false }
        }
      }
    }
  });

  if (!document.getElementById('explicacaoKNN')) {
    const explicacao = document.createElement('p');
    explicacao.id = 'explicacaoKNN';
    explicacao.style.textAlign = 'center';
    explicacao.style.color = '#000';
    explicacao.style.marginTop = '10px';
    explicacao.textContent = 'A IA usa KNN para prever seus próximos movimentos. Quanto mais partidas ela joga, mais dados ela tem para melhorar suas decisões.';
    document.getElementById('chartContainer').appendChild(explicacao);
  }
}

function renderBoard() {
  const container = document.getElementById('board');
  container.innerHTML = '';
  board.forEach((v, i) => {
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.textContent = v === 1 ? 'X' : v === -1 ? 'O' : '';
    cell.onclick = () => makeMove(i);
    container.appendChild(cell);
  });
}

window.onload = () => {
  renderBoard();
  updateProgress();
  hideEndElements();
};

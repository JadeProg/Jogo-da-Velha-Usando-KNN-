<h1 align="center"> X|0 [memória de máquina]</h1>

<p align="center">
  <img src="jogo-da-velha/img/jogodavelha.jpg" alt="Velhinha IA" width="400"/>
</p>


Um jogo da velha interativo onde você joga contra uma **IA que aprende com você**.  
A cada partida, a "Vovó" vai evoluindo sua estratégia usando um modelo de aprendizado baseado em **KNN (K-Nearest Neighbors)**.

---

## 🛠 Funcionalidades
- ✔️ Tabuleiro de 3x3 com jogabilidade simples.  
- ✔️ IA adaptativa: aprende a cada partida e armazena suas jogadas no navegador (localStorage).  
- ✔️ Barra de progresso mostrando o nível de aprendizado da IA.  
- ✔️ Estatísticas visuais com **Chart.js**.  
- ✔️ Botão para reiniciar o aprendizado da IA.  
- ✔️ Feedback visual da “Vovó”: muda de imagem dependendo do resultado (ganhou, perdeu ou empatou).  
- ✔️ Design responsivo para celular e desktop.  

---

Entenda mais em meu post: 👵 [Desvenda o cérebro da Vovó.](https://www.instagram.com/p/DMkhWKhOI3B/?utm_source=ig_web_copy_link&igsh=MWd6eXIxZGw1d29mZA==)  

## 📄 Instruções
1. Abra o site hospedado no GitHub Pages:  
   👉 [JOGAR AGORA](https://jadeprog.github.io/site/jogodavelha.html)

2. Clique em **Jogar** para começar uma partida.  
3. Jogue clicando em uma das casas do tabuleiro.  
4. Observe a barra de aprendizado subir conforme a IA acumula experiência.  
5. Use o botão 🌀 **Resetar Aprendizado** para reiniciar a memória da IA.  
6. Clique em **Ver Estatísticas** para abrir o gráfico com o histórico de evolução.  

---

## ⚙️ Tecnologias utilizadas
- **HTML5** → Estrutura do jogo.  
- **CSS3** → Estilo, responsividade e tipografia.  
- **JavaScript (Vanilla)** → Lógica do jogo e da IA.  
- **Chart.js** → Gráficos da evolução da IA.  
- **LocalStorage** → Memória da IA entre partidas.  

---

## 🤖 Como funciona a lógica da IA

A IA do jogo foi implementada em **JavaScript puro (Vanilla JS)** e combina duas estratégias:

1. **Aprendizado com KNN (K-Nearest Neighbors):**
   - A cada jogada, o estado do tabuleiro (`board`) é salvo no navegador (via `localStorage`).
   - Esses estados formam um dataset chamado `knn_dataset`.
   - Quando a IA precisa decidir um movimento, ela compara o tabuleiro atual com os anteriores, usando **distância euclidiana** para achar as jogadas mais parecidas.
   - Quanto mais partidas jogadas → mais dados → IA melhora suas previsões.

2. **Estratégia perfeita (quando `learningLevel >= 100`):**
   - Se pode vencer, vence.
   - Se o jogador pode vencer, bloqueia.
   - Prefere **cantos** e **centro** para dominar o jogo.
   - Tem táticas de abertura e contra-ataque.

---

### 📈 Visualização do aprendizado
- O gráfico é construído com **Chart.js** (`renderChart()`).
- Ele mostra:
  - Evolução do aprendizado em %.
  - Tamanho do dataset (quantos estados a IA conhece).
  - Jogadas feitas via KNN.
- O gráfico pode ser expandido ou escondido clicando em "Ver Estatísticas".

---

### 🔧 Outras funções principais
- `makeMove(index)` → executa a jogada do jogador e da IA.  
- `resetGame()` → reinicia o tabuleiro.  
- `resetLearning()` → apaga o dataset e "zera" a memória da Vovó.  
- `checkThreat(board, player)` → verifica se há chance de vitória ou bloqueio.  
- `renderBoard()` → desenha o tabuleiro dinamicamente.  


## 📥 Instalação para desenvolvedores

Se você deseja **alterar o código** ou estudar a lógica da IA, siga estes passos:

1. **Clone este repositório** (ou baixe o ZIP):
   ```bash
   git clone https://github.com/JadeProg/Jogo-da-Velha-Usando-KNN.git

2. Abra o arquivo index.html em qualquer navegador moderno.
3. (Opcional) Rode em um servidor local:
   ```bash
   python -m http.server
   Depois acesse http://localhost:8000

## 📂 Estrutura do projeto
```bash
jogo-da-velha/
├── index.html       # Página principal
├── style.css        # Estilos
├── script.js        # Lógica do jogo e da IA
└── img/             # Imagens usadas no jogo
    ├── velhinha.png
    ├── velhinhaganha.png
    ├── velhinhaperde.png
    ├── reiniciar.png
    └── jogodavelha.jpg


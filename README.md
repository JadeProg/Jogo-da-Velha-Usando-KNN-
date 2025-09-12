# 🎮 X|0 [memória de máquina]
![Velhinha IA](jogo-da-velha/img/jogodavelha.jpg)

Um jogo da velha interativo onde você joga contra uma **IA que aprende com você**.  
A cada partida, a "Vovó" vai evoluindo sua estratégia usando um modelo de aprendizado baseado em **KNN (K-Nearest Neighbors)**.

---

## ✨ Funcionalidades
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
    └── reiniciar.png

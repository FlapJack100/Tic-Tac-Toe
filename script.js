
function Player(name, marker) {
    return { name, marker };
  }
  
  
  const Gameboard = (function () {
    let board = ["", "", "", "", "", "", "", "", ""];
  
    const getBoard = () => board;
  
    const resetBoard = () => {
      board = ["", "", "", "", "", "", "", "", ""];
    };
  
    const setCell = (index, marker) => {
      if (board[index] === "") {
        board[index] = marker;
        return true;
      }
      return false;
    };
  
    return { getBoard, resetBoard, setCell };
  })();
  
  
  const GameController = (function () {
    let player1;
    let player2;
    let currentPlayer;
    let gameOver = false;
  
    const winningCombos = [
      [0,1,2],[3,4,5],[6,7,8],
      [0,3,6],[1,4,7],[2,5,8],
      [0,4,8],[2,4,6]
    ];
  
    const startGame = (name1, name2) => {
      player1 = Player(name1, "X");
      player2 = Player(name2, "O");
      currentPlayer = player1;
      Gameboard.resetBoard();
      gameOver = false;
      DisplayController.render();
      DisplayController.updateStatus(`${currentPlayer.name}, твой ход (${currentPlayer.marker})`);
    };
  
    const playRound = (index) => {
      if (gameOver || !Gameboard.setCell(index, currentPlayer.marker)) return;
  
      DisplayController.render();
  
      if (checkWinner(currentPlayer.marker)) {
        DisplayController.updateStatus(`${currentPlayer.name} победил!`);
        gameOver = true;
      } else if (!Gameboard.getBoard().includes("")) {
        DisplayController.updateStatus("Ничья!");
        gameOver = true;
      } else {
        switchPlayer();
        DisplayController.updateStatus(`${currentPlayer.name}, твой ход (${currentPlayer.marker})`);
      }
    };
  
    const checkWinner = (marker) => {
      return winningCombos.some(combo => 
        combo.every(index => Gameboard.getBoard()[index] === marker)
      );
    };
  
    const switchPlayer = () => {
      currentPlayer = currentPlayer === player1 ? player2 : player1;
    };
  
    return { startGame, playRound };
  })();
  
  
  const DisplayController = (function () {
    const boardDiv = document.getElementById("gameBoard");
    const statusDiv = document.getElementById("status");
  
    const render = () => {
      boardDiv.innerHTML = "";
      Gameboard.getBoard().forEach((cell, index) => {
        const square = document.createElement("div");
        square.classList.add("square");
        square.textContent = cell;
        square.addEventListener("click", () => GameController.playRound(index));
        boardDiv.appendChild(square);
      });
      boardDiv.classList.remove("hidden");
    };
  
    const updateStatus = (message) => {
      statusDiv.textContent = message;
    };
  
    return { render, updateStatus };
  })();
  
  
  document.getElementById("startBtn").addEventListener("click", () => {
    const name1 = document.getElementById("player1").value || "Игрок 1";
    const name2 = document.getElementById("player2").value || "Игрок 2";
    GameController.startGame(name1, name2);
    document.getElementById("restartBtn").classList.remove("hidden");
  });
  
  document.getElementById("restartBtn").addEventListener("click", () => {
    location.reload(); 
  });
  
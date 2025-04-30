document.addEventListener('DOMContentLoaded', function () {
  const board = document.getElementById('board');
  const rows = 6;
  const cols = 3;
  let currentPlayer = 'X';
  let gameBoard = [];
  const playing = document.getElementById('playing');
  playing.textContent = currentPlayer;

  for (let row = 0; row < rows; row++) {
    gameBoard.push(Array(cols).fill(null));
  }

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.dataset.row = row;
      cell.dataset.col = col;
      board.appendChild(cell);
    }
  }

  const cells = document.querySelectorAll('.cell');

  cells.forEach(cell => {
    cell.addEventListener('click', function () {
      const col = parseInt(this.dataset.col);
      let row = -1;
      for (let i = rows - 1; i >= 0; i--) {
        if (gameBoard[i][col] === null) {
          row = i;
          break;
        }
      }

      if (row === -1) return;

      const cellIndex = row * cols + col;
      if (gameBoard[row][col] === null) {
        gameBoard[row][col] = currentPlayer;
        const targetCell = cells[cellIndex];
        targetCell.textContent = currentPlayer;
        animateCellDrop(targetCell);
        targetCell.classList.add(currentPlayer === 'X' ? 'playerX' : 'playerO');

        if (checkWin(row, col)) {
          setTimeout(() => {
            alert(`🎉 Player ${currentPlayer} wins!`);
            resetGame();
          }, 200);
          return;
        }

        if (gameBoard.flat().every(cell => cell !== null)) {
          setTimeout(() => {
            alert("It's a draw!");
            resetGame();
          }, 200);
          return;
        }

        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        playing.textContent = currentPlayer;
      }
    });
  });

  function checkWin(row, col) {
    const directions = [[0, 1], [1, 0], [1, 1], [-1, 1]];
  
    for (let [dx, dy] of directions) {
      let connected = [[row, col]];
  
      let r = row + dx, c = col + dy;
      while (r >= 0 && r < rows && c >= 0 && c < cols && gameBoard[r][c] === currentPlayer) {
        connected.push([r, c]);
        r += dx; c += dy;
      }
  
      r = row - dx; c = col - dy;
      while (r >= 0 && r < rows && c >= 0 && c < cols && gameBoard[r][c] === currentPlayer) {
        connected.push([r, c]);
        r -= dx; c -= dy;
      }
  
      if (connected.length >= 3) {
        highlightWinningCells(connected);
        return true;
      }
    }
    return false;
  }

  function highlightWinningCells(cellsPos) {
    cellsPos.forEach(([r, c]) => {
      const index = r * cols + c;
      const cell = document.querySelectorAll('.cell')[index];
      cell.classList.add('win-blink');
    });
  }
  

  function countDirection(row, col, dx, dy) {
    let r = row + dx, c = col + dy, count = 0;
    while (r >= 0 && r < rows && c >= 0 && c < cols && gameBoard[r][c] === currentPlayer) {
      count++;
      r += dx;
      c += dy;
    }
    return count;
  }

  function animateCellDrop(cell) {
    cell.style.transform = 'translateY(-150px)';
    cell.style.opacity = '0';
    setTimeout(() => {
      cell.style.transform = 'translateY(0)';
      cell.style.opacity = '1';
    }, 50);
  }

  window.resetGame = function () {
    gameBoard.forEach(row => row.fill(null));
    cells.forEach(cell => {
      cell.textContent = '';
      cell.classList.remove('playerX', 'playerO');
      cell.classList.remove('win-blink');
      cell.style.opacity = '1';
      cell.style.transform = 'translateY(0)';
    });
    currentPlayer = 'X';
    playing.textContent = currentPlayer;
  };
});

const board = document.getElementById('board');
const resetButton = document.getElementById('resetButton');
const statusMessage = document.getElementById('statusMessage');
let boardSize = 8; // Tamaño del tablero (8x8)
let mineCount = 10; // Número de minas
let mines = [];
let revealedCells = 0;
let minesRemaining = mineCount; // Inicialmente igual al número de minas
const customizationForm = document.getElementById('customization-form');
const boardSizeSelector = document.getElementById('board-size');
const mineCountInput = document.getElementById('mine-count');

/**
 * Manejar la personalización del juego
 */
customizationForm.addEventListener('submit', (event) => {
  event.preventDefault();

  // Obtener valores del formulario
  boardSize = parseInt(boardSizeSelector.value, 10);
  mineCount = parseInt(mineCountInput.value, 10);

  // Validar el número de minas
  const maxMines = boardSize * boardSize - 1; // Deja al menos una celda sin mina
  if (mineCount > maxMines) {
    alert(`El número máximo de minas para un tablero ${boardSize}x${boardSize} es ${maxMines}.`);
    mineCount = maxMines;
    mineCountInput.value = maxMines; // Ajustar visualmente el valor en el formulario
  }

  // Reiniciar el juego con las nuevas opciones
  createBoard();
});

/**
 * Crear el tablero con soporte para el contador de minas
 */
function createBoard() {
    board.innerHTML = '';
    board.style.gridTemplateColumns = `repeat(${boardSize}, 1fr)`;
    board.style.gridTemplateRows = `repeat(${boardSize}, 1fr)`;
    mines = [];
    revealedCells = 0;
    minesRemaining = mineCount; // Reinicia el contador de minas
    updateMinesCounter(); // Actualiza el contador en la interfaz
    statusMessage.textContent = '';
  
    for (let row = 0; row < boardSize; row++) {
      for (let col = 0; col < boardSize; col++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.dataset.row = row;
        cell.dataset.col = col;
  
        // Manejar clic izquierdo
        cell.addEventListener('click', () => handleCellClick(cell));
  
        // Manejar clic derecho
        cell.addEventListener('contextmenu', (event) => {
          event.preventDefault();
          toggleFlag(cell);
        });
  
        board.appendChild(cell);
      }
    }
  
    // Colocar minas
    placeMines();
  }
/**
 * Alternar bandera en una celda
 * @param {HTMLElement} cell - La celda a marcar/desmarcar
 */
function toggleFlag(cell) {
    if (cell.classList.contains('revealed')) return; // No marcar celdas ya reveladas
  
    if (cell.classList.contains('flagged')) {
      cell.classList.remove('flagged');
      cell.textContent = ''; // Quitar la bandera
      minesRemaining++; // Incrementar minas restantes
    } else {
      cell.classList.add('flagged');
      cell.textContent = '🚩'; // Agregar la bandera
      minesRemaining--; // Reducir minas restantes
    }
  
    updateMinesCounter(); // Actualizar el contador
  }
    
/**
 * Colocar minas aleatoriamente
 */
function placeMines() {
  while (mines.length < mineCount) {
    const row = Math.floor(Math.random() * boardSize);
    const col = Math.floor(Math.random() * boardSize);
    const position = `${row}-${col}`;
    if (!mines.includes(position)) {
      mines.push(position);
    }
  }
}

/**
 * Manejar clics en las celdas
 */
function handleCellClick(cell) {
  const row = parseInt(cell.dataset.row, 10);
  const col = parseInt(cell.dataset.col, 10);
  const position = `${row}-${col}`;

  // Si es una mina, termina el juego
  if (mines.includes(position)) {
    revealMines();
    statusMessage.textContent = '¡Has perdido! 😢';
    return;
  }

  // Si no es una mina, revelar la celda
  revealCell(cell, row, col);
  checkVictory();
}
/**
 * Actualizar el contador de minas restantes
 */
function updateMinesCounter() {
    const minesCounter = document.getElementById('mines-counter');
    if (minesCounter) {
      minesCounter.textContent = `Minas restantes: ${minesRemaining}`;
    }
  }
/**
 * Revelar una celda
 */
function revealCell(cell, row, col) {
  if (cell.classList.contains('revealed')) return;

  cell.classList.add('revealed');
  revealedCells++;

  const mineCount = countAdjacentMines(row, col);
  if (mineCount > 0) {
    cell.textContent = mineCount;
  } else {
    revealAdjacentCells(row, col);
  }
}

/**
 * Contar minas adyacentes
 */
function countAdjacentMines(row, col) {
  let count = 0;
  for (let r = row - 1; r <= row + 1; r++) {
    for (let c = col - 1; c <= col + 1; c++) {
      if (mines.includes(`${r}-${c}`)) {
        count++;
      }
    }
  }
  return count;
}

/**
 * Revelar celdas adyacentes
 */
function revealAdjacentCells(row, col) {
  for (let r = row - 1; r <= row + 1; r++) {
    for (let c = col - 1; c <= col + 1; c++) {
      if (r >= 0 && r < boardSize && c >= 0 && c < boardSize) {
        const cell = board.querySelector(`[data-row="${r}"][data-col="${c}"]`);
        if (cell && !cell.classList.contains('revealed')) {
          revealCell(cell, r, c);
        }
      }
    }
  }
}

/**
 * Revelar todas las minas
 */
function revealMines() {
  mines.forEach((position) => {
    const [row, col] = position.split('-').map(Number);
    const cell = board.querySelector(`[data-row="${row}"][data-col="${col}"]`);
    cell.classList.add('mine');
    cell.textContent = '💣';
  });
}

/**
 * Verificar si el jugador ha ganado
 */
function checkVictory() {
    const flaggedCorrectly = mines.every((position) => {
      const [row, col] = position.split('-').map(Number);
      const cell = board.querySelector(`[data-row="${row}"][data-col="${col}"]`);
      return cell.classList.contains('flagged');
    });
  
    if (revealedCells === boardSize * boardSize - mineCount && flaggedCorrectly) {
      statusMessage.textContent = '¡Has ganado! 🎉';
    }
  }
  
/**
 * Reiniciar el juego
 */
resetButton.addEventListener('click', createBoard);

// Inicializar el tablero
createBoard();

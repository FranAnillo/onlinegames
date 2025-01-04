// Selección del contenedor del tablero
const board = document.getElementById('board');
const resetButton = document.getElementById('resetButton');
let currentTurn = "white"; // El turno comienza con las blancas

/**
 * Cambia el turno al jugador opuesto
 */
function changeTurn() {
    currentTurn = currentTurn === "white" ? "black" : "white";
    const turnIndicator = document.getElementById('turn-indicator');
    if (turnIndicator) {
        turnIndicator.innerHTML = `Turno: ${currentTurn === "white" ? "Blancas" : "Negras"}`;

  
      // Forzar re-renderizado
      turnIndicator.style.display = "none";
      setTimeout(() => {
        turnIndicator.style.display = "block";
      }, 0);
  
      console.log(`Turno actualizado a: ${currentTurn}`);
    } else {
      console.error("No se encontró el elemento con id 'turn-indicator'.");
    }
  }
  

// Configuración inicial de las piezas (usamos emojis)
const initialPieces = [
  ["♜", "♞", "♝", "♛", "♚", "♝", "♞", "♜"],
  ["♟", "♟", "♟", "♟", "♟", "♟", "♟", "♟"],
  Array(8).fill(""),
  Array(8).fill(""),
  Array(8).fill(""),
  Array(8).fill(""),
  ["♙", "♙", "♙", "♙", "♙", "♙", "♙", "♙"],
  ["♖", "♘", "♗", "♕", "♔", "♗", "♘", "♖"]
];

let selectedCell = null;

/**
 * Crea el tablero dinámicamente
 */
function createBoard() {
  board.innerHTML = ""; // Limpia el tablero antes de generarlo
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const cell = createCell(row, col, initialPieces[row][col]);
      board.appendChild(cell);
    }
  }
}

/**
 * Crea una celda del tablero
 */
function createCell(row, col, piece) {
  const cell = document.createElement('div');
  cell.className = `cell ${((row + col) % 2 === 0) ? 'white' : 'black'}`;
  cell.dataset.row = row;
  cell.dataset.col = col;

  if (piece) {
    const pieceElement = createPieceElement(piece);
    cell.appendChild(pieceElement);
  }

  cell.addEventListener('click', () => handleCellClick(cell));
  return cell;
}

/**
 * Crea un elemento HTML para una pieza
 */
function createPieceElement(piece) {
  const pieceElement = document.createElement('div');
  pieceElement.className = 'piece';
  pieceElement.innerText = piece;
  return pieceElement;
}

/**
 * Maneja el clic en una celda
 * @param {HTMLElement} cell - La celda clicada
 */
function handleCellClick(cell) {
    if (selectedCell) {
      // Mover pieza si la celda es válida
      if (cell.classList.contains('valid-move')) {
        movePiece(selectedCell, cell);
  
        // Cambiar el turno después de un movimiento válido
        changeTurn();
      }
  
      // Limpiar la selección
      clearSelection();
    } else if (cell.querySelector('.piece')) {
      // Seleccionar una celda con pieza y resaltar movimientos válidos
      selectCell(cell);
    }
  }
  
  
  /**
   * Cambia el turno al jugador opuesto
   */
  function changeTurn() {
    currentTurn = currentTurn === "white" ? "black" : "white";
    console.log(`Turno actual: ${currentTurn === "white" ? "Blancas" : "Negras"}`);
  }
  

/**
 * Selecciona una celda y resalta las opciones de movimiento
 * @param {HTMLElement} cell - La celda seleccionada
 */
function selectCell(cell) {
    const piece = cell.querySelector('.piece');
    if (piece && isPlayerPiece(piece.innerText)) {
      selectedCell = cell;
      cell.classList.add('selected');
      highlightValidMoves(cell);
    } else {
      console.log("No es tu turno");
    }
  }
  
  /**
   * Verifica si una pieza pertenece al jugador activo
   * @param {string} piece - La pieza seleccionada
   * @returns {boolean} - True si pertenece al jugador activo
   */
  function isPlayerPiece(piece) {
    const whitePieces = "♙♖♘♗♕♔";
    const blackPieces = "♟♜♞♝♛♚";
  
    if (currentTurn === "white") {
      return whitePieces.includes(piece);
    } else {
      return blackPieces.includes(piece);
    }
  }
  

/**
 * Resalta las celdas donde una pieza puede moverse
 * @param {HTMLElement} fromCell - Celda de origen de la pieza
 */
function highlightValidMoves(fromCell) {
    const allCells = Array.from(board.querySelectorAll('.cell'));
  
    allCells.forEach(toCell => {
      if (isValidMove(fromCell, toCell)) {
        toCell.classList.add('valid-move'); // Resaltar celdas válidas
        console.log(`Movimiento válido: De (${fromCell.dataset.row}, ${fromCell.dataset.col}) a (${toCell.dataset.row}, ${toCell.dataset.col})`);
      }
    });
  }
  

/**
 * Limpia la selección de celdas y el resaltado
 */
function clearSelection() {
  if (selectedCell) {
    selectedCell.classList.remove('selected');
    selectedCell = null;
  }

  const allCells = Array.from(board.querySelectorAll('.cell'));
  allCells.forEach(cell => {
    cell.classList.remove('valid-move'); // Eliminar resaltado
  });
}

/**
 * Mueve una pieza de una celda a otra
 */
function movePiece(fromCell, toCell) {
  const piece = fromCell.querySelector('.piece');
  if (piece) {
    toCell.innerHTML = ""; // Limpia la celda de destino
    toCell.appendChild(piece); // Mueve la pieza
  }
}

function isValidMove(fromCell, toCell) {
    const fromRow = parseInt(fromCell.dataset.row, 10);
    const fromCol = parseInt(fromCell.dataset.col, 10);
    const toRow = parseInt(toCell.dataset.row, 10);
    const toCol = parseInt(toCell.dataset.col, 10);
    const piece = fromCell.querySelector('.piece').innerText;
  
    // No puedes moverte a la misma celda
    if (fromRow === toRow && fromCol === toCol) {
      return false;
    }
  
    // Regla para el rey
    if (piece === "♚" || piece === "♔") {
      const rowDiff = Math.abs(toRow - fromRow);
      const colDiff = Math.abs(toCol - fromCol);
  
      // Movimiento básico del rey: una casilla en cualquier dirección
      if (rowDiff <= 1 && colDiff <= 1 && isCellSafe(toCell, piece)) {
        return true;
      }
  
      // Movimiento de enroque
      if (isCastlingMove(fromCell, toCell, piece)) {
        return true;
      }
    }
  
    // Regla para peones
    if (piece === "♟" || piece === "♙") {
      const direction = piece === "♟" ? 1 : -1; // Dirección según color
      const startingRow = piece === "♟" ? 1 : 6;
  
      // Movimiento hacia adelante
      if (toRow === fromRow + direction && fromCol === toCol && !toCell.querySelector('.piece')) {
        return true;
      }
  
      // Primer movimiento: dos casillas hacia adelante
      if (
        fromRow === startingRow &&
        toRow === fromRow + 2 * direction &&
        fromCol === toCol &&
        !toCell.querySelector('.piece') &&
        !board.querySelector(`[data-row="${fromRow + direction}"][data-col="${fromCol}"]`).querySelector('.piece')
      ) {
        return true;
      }
  
      // Captura en diagonal
      if (
        toRow === fromRow + direction &&
        Math.abs(toCol - fromCol) === 1 &&
        toCell.querySelector('.piece')
      ) {
        const targetPiece = toCell.querySelector('.piece').innerText;
        if ((piece === "♙" && "♟♜♞♝♛♚".includes(targetPiece)) || (piece === "♟" && "♙♖♘♗♕♔".includes(targetPiece))) {
          return true;
        }
      }
    }
  
    // Regla para alfiles
    if (piece === "♝" || piece === "♗") {
      if (Math.abs(toRow - fromRow) === Math.abs(toCol - fromCol) && isPathClear(fromCell, toCell)) {
        return true;
      }
    }
  
    // Regla para caballos
    if (piece === "♞" || piece === "♘") {
      const rowDiff = Math.abs(toRow - fromRow);
      const colDiff = Math.abs(toCol - fromCol);
  
      if ((rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2)) {
        const targetPiece = toCell.querySelector('.piece');
        if (!targetPiece || (piece === "♘" && "♟♜♞♝♛♚".includes(targetPiece)) || (piece === "♞" && "♙♖♘♗♕♔".includes(targetPiece))) {
          return true;
        }
      }
    }
  
    // Regla para reinas
    if (piece === "♛" || piece === "♕") {
      const rowDiff = Math.abs(toRow - fromRow);
      const colDiff = Math.abs(toCol - fromCol);
  
      if ((rowDiff === 0 || colDiff === 0 || rowDiff === colDiff) && isPathClear(fromCell, toCell)) {
        return true;
      }
    }
  
    // Regla para torres
    if (piece === "♜" || piece === "♖") {
      const rowDiff = Math.abs(toRow - fromRow);
      const colDiff = Math.abs(toCol - fromCol);
  
      if ((rowDiff === 0 || colDiff === 0) && isPathClear(fromCell, toCell)) {
        return true;
      }
    }
  
    return false; // Movimiento no válido
  }
  
/**
 * Verifica si el camino entre dos celdas está despejado
 * @param {HTMLElement} fromCell - Celda de origen
 * @param {HTMLElement} toCell - Celda de destino
 * @returns {boolean} - True si el camino está despejado, False si está bloqueado
 */
function isPathClear(fromCell, toCell) {
    const fromRow = parseInt(fromCell.dataset.row, 10);
    const fromCol = parseInt(fromCell.dataset.col, 10);
    const toRow = parseInt(toCell.dataset.row, 10);
    const toCol = parseInt(toCell.dataset.col, 10);
  
    // Determinar los pasos (dirección del movimiento)
    const rowStep = Math.sign(toRow - fromRow); // +1, -1, o 0
    const colStep = Math.sign(toCol - fromCol); // +1, -1, o 0
  
    // Comenzar desde la celda adyacente a `fromCell`
    let currentRow = fromRow + rowStep;
    let currentCol = fromCol + colStep;
  
    // Iterar hasta llegar a la celda de destino
    while (currentRow !== toRow || currentCol !== toCol) {
      const cell = board.querySelector(`[data-row="${currentRow}"][data-col="${currentCol}"]`);
      if (cell && cell.querySelector('.piece')) {
        return false; // Camino bloqueado por una pieza
      }
  
      // Avanzar hacia la celda de destino
      currentRow += rowStep;
      currentCol += colStep;
    }
  
    return true; // Camino despejado
  }
  
/**
 * Verifica si un movimiento es un enroque válido
 * @param {HTMLElement} fromCell - Celda de origen del rey
 * @param {HTMLElement} toCell - Celda de destino del rey
 * @param {string} piece - Pieza que se está moviendo (rey)
 * @returns {boolean} - True si el enroque es válido, False en caso contrario
 */
function isCastlingMove(fromCell, toCell, piece) {
    const fromRow = parseInt(fromCell.dataset.row, 10);
    const fromCol = parseInt(fromCell.dataset.col, 10);
    const toRow = parseInt(toCell.dataset.row, 10);
    const toCol = parseInt(toCell.dataset.col, 10);
  
    // Enroque solo puede ocurrir en la fila inicial del rey
    const startingRow = piece === "♔" ? 7 : 0;
  
    if (fromRow !== startingRow || toRow !== startingRow) {
      return false;
    }
  
    // Movimiento de dos casillas hacia la izquierda o derecha
    if (Math.abs(toCol - fromCol) === 2) {
      const direction = toCol > fromCol ? 1 : -1; // Derecha (+1) o izquierda (-1)
      const rookCol = toCol > fromCol ? 7 : 0; // Columna de la torre
      const rookCell = board.querySelector(`[data-row="${fromRow}"][data-col="${rookCol}"]`);
  
      // Verificar la existencia de una torre válida
      if (!rookCell || !rookCell.querySelector('.piece')) {
        return false; // No hay torre en la posición esperada
      }
  
      const rookPiece = rookCell.querySelector('.piece').innerText;
      if (rookPiece !== (piece === "♔" ? "♖" : "♜")) {
        return false; // La pieza no es una torre válida
      }
  
      // Verificar que las celdas intermedias estén despejadas
      const intermediateCol1 = fromCol + direction;
      const intermediateCol2 = fromCol + 2 * direction;
      const intermediateCell1 = board.querySelector(`[data-row="${fromRow}"][data-col="${intermediateCol1}"]`);
      const intermediateCell2 = board.querySelector(`[data-row="${fromRow}"][data-col="${intermediateCol2}"]`);
  
      if (
        (intermediateCell1 && intermediateCell1.querySelector('.piece')) ||
        (toCol > fromCol && intermediateCell2 && intermediateCell2.querySelector('.piece'))
      ) {
        return false; // Camino bloqueado
      }
  
      // Verificar que el rey no esté en jaque, no pase por jaque, ni termine en jaque
      if (
        !isCellSafe(fromCell, piece) || // Celda inicial segura
        !isCellSafe(intermediateCell1, piece) || // Celda intermedia segura
        !isCellSafe(toCell, piece) // Celda final segura
      ) {
        return false; // Rey en jaque
      }
  
      return true; // Enroque válido
    }
  
    return false; // Movimiento no válido para enroque
  }
  
/**
 * Verifica si una celda está en una posición segura para el rey
 * @param {HTMLElement} cell - Celda de destino
 * @param {string} king - Pieza del rey ("♔" o "♚")
 * @returns {boolean} - True si la celda es segura, False si está en jaque
 */
function isCellSafe(cell, king) {
    const targetRow = parseInt(cell.dataset.row, 10);
    const targetCol = parseInt(cell.dataset.col, 10);
    const opponentPieces = king === "♔" ? "♟♜♞♝♛♚" : "♙♖♘♗♕♔"; // Piezas enemigas
  
    // Iterar sobre todas las celdas del tablero
    const allCells = Array.from(board.querySelectorAll('.cell'));
    for (const potentialAttackerCell of allCells) {
      const piece = potentialAttackerCell.querySelector('.piece');
      if (piece && opponentPieces.includes(piece.innerText)) {
        // Simular un movimiento de la pieza enemiga hacia la celda objetivo
        if (canPieceAttackCell(potentialAttackerCell, cell, piece.innerText)) {
          return false; // Si cualquier pieza enemiga puede atacar, la celda no es segura
        }
      }
    }
  
    return true; // Si ninguna pieza enemiga puede atacar, la celda es segura
  }
  /**
 * Verifica si una pieza puede atacar una celda específica
 * @param {HTMLElement} fromCell - Celda de origen de la pieza
 * @param {HTMLElement} toCell - Celda de destino
 * @param {string} piece - Pieza que se mueve
 * @returns {boolean} - True si la pieza puede atacar la celda
 */
function canPieceAttackCell(fromCell, toCell, piece) {
    const originalToCellContent = toCell.innerHTML;
    const pieceClone = fromCell.querySelector('.piece').cloneNode(true);
  
    // Simular movimiento de la pieza hacia la celda destino
    toCell.innerHTML = "";
    toCell.appendChild(pieceClone);
  
    // Usar isValidMove para verificar si el movimiento es posible
    const isAttackValid = isValidMove(fromCell, toCell);
  
    // Restaurar el estado original
    toCell.innerHTML = originalToCellContent;
  
    return isAttackValid;
  }


  
  // Botón de reinicio
resetButton.addEventListener('click', createBoard);

// Inicializa el tablero
createBoard();
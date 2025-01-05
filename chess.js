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
      // Posicionar la pieza dentro de la celda
      pieceElement.style.left = '0';
      pieceElement.style.top = '0';
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
  
        // Verificar si el rey está en jaque
        if (isKingInCheck(currentTurn)) {
          if (isCheckmate(currentTurn)) {
            showModal(`¡Jaque mate! Las ${currentTurn === "white" ? "negras" : "blancas"} ganan.`);
          } else {
            showModal("¡Jaque al rey!");
          }
        }
  
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
 * Mueve una pieza de una celda a otra con animación
 * @param {HTMLElement} fromCell - Celda de origen
 * @param {HTMLElement} toCell - Celda de destino
 */
function movePiece(fromCell, toCell) {
    const piece = fromCell.querySelector('.piece');
    if (piece) {
      // Obtener las coordenadas de la celda destino
      const toCellRect = toCell.getBoundingClientRect();
      const fromCellRect = fromCell.getBoundingClientRect();
  
      // Calcular la diferencia en posición
      const deltaX = toCellRect.left - fromCellRect.left;
      const deltaY = toCellRect.top - fromCellRect.top;
  
      // Eliminar cualquier pieza en la celda destino (captura)
      const targetPiece = toCell.querySelector('.piece');
      if (targetPiece) {
        // Capturar la pieza enemiga
        registerCapture(targetPiece.innerText, currentTurn);
        targetPiece.remove(); // Eliminar la pieza capturada
      }
  
      // Aplicar la transformación
      piece.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
  
      // Esperar a que termine la animación antes de mover la pieza
      setTimeout(() => {
        toCell.appendChild(piece); // Mueve la pieza al DOM de la celda destino
        piece.style.transform = ''; // Restablece la transformación
      }, 300); // Duración de la animación (en milisegundos)
  
      // Limpiar la celda de origen
      fromCell.innerHTML = '';
    }
  }
  
/**
 * Registra una captura en el resumen de la partida
 * @param {string} piece - La pieza capturada
 * @param {string} currentTurn - El jugador activo
 */
function registerCapture(piece, currentTurn) {
    const summaryId = currentTurn === "white" ? "captured-by-black" : "captured-by-white";
    const summaryList = document.querySelector(`#${summaryId} ul`);
  
    if (summaryList) {
      const listItem = document.createElement('li');
      listItem.textContent = piece; // Agregar la pieza capturada al resumen
      summaryList.appendChild(listItem);
    }
  }
function isValidMove(fromCell, toCell) {
    const fromRow = parseInt(fromCell.dataset.row, 10);
    const fromCol = parseInt(fromCell.dataset.col, 10);
    const toRow = parseInt(toCell.dataset.row, 10);
    const toCol = parseInt(toCell.dataset.col, 10);
    const piece = fromCell.querySelector('.piece').innerText;
  

  // Verificar si la celda destino contiene una pieza del mismo color
  const targetPiece = toCell.querySelector('.piece');
  if (targetPiece) {
    const isSameColor =
      ("♙♖♘♗♕♔".includes(piece) && "♙♖♘♗♕♔".includes(targetPiece.innerText)) ||
      ("♟♜♞♝♛♚".includes(piece) && "♟♜♞♝♛♚".includes(targetPiece.innerText));
    if (isSameColor) {
      return false; // No se puede mover a una celda ocupada por una pieza del mismo color
    }
  }

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

/**
 * Encuentra la celda donde se encuentra el rey del jugador actual
 * @param {string} king - La pieza del rey ("♔" o "♚")
 * @returns {HTMLElement} - La celda donde está el rey
 */
function findKingCell(king) {
    const allCells = Array.from(board.querySelectorAll('.cell'));
    return allCells.find(cell => {
      const piece = cell.querySelector('.piece');
      return piece && piece.innerText === king;
    });
  }

  
  /**
 * Verifica si el rey del jugador actual está en jaque
 * @param {string} currentTurn - El jugador actual ("white" o "black")
 * @returns {boolean} - True si el rey está en jaque, False en caso contrario
 */
function isKingInCheck(currentTurn) {
    const king = currentTurn === "white" ? "♔" : "♚";
    const kingCell = findKingCell(king);
  
    if (!kingCell) {
      console.error("No se encontró al rey en el tablero.");
      return false;
    }
  
    // Verificar si alguna pieza enemiga puede atacar al rey
    const opponentPieces = currentTurn === "white" ? "♟♜♞♝♛♚" : "♙♖♘♗♕♔";
    const allCells = Array.from(board.querySelectorAll('.cell'));
  
    for (const potentialAttackerCell of allCells) {
      const piece = potentialAttackerCell.querySelector('.piece');
      if (piece && opponentPieces.includes(piece.innerText)) {
        if (canPieceAttackCell(potentialAttackerCell, kingCell, piece.innerText)) {
          return true; // Rey está en jaque
        }
      }
    }
  
    return false; // Rey no está en jaque
  }
  

  /**
 * Muestra el modal de notificación
 * @param {string} message - Mensaje a mostrar en el modal
 */
  function showModal(message) {
    const modal = document.getElementById('check-modal');
    const modalMessage = document.getElementById('modal-message');
    
    if (modal && modalMessage) {
      modalMessage.textContent = message; // Configurar el mensaje del modal
      modal.style.display = 'block'; // Mostrar el modal
    }
  }
  
  /**
   * Oculta el modal de notificación
   */
  function closeModal() {
    const modal = document.getElementById('check-modal');
    if (modal) {
      modal.style.display = 'none'; // Ocultar el modal
    }
  }
  
  // Configurar el botón de cerrar
  const closeModalButton = document.getElementById('close-modal');
  if (closeModalButton) {
    closeModalButton.addEventListener('click', closeModal);
  }
  
  // Ocultar el modal si se hace clic fuera del contenido
  window.addEventListener('click', (event) => {
    const modal = document.getElementById('check-modal');
    if (event.target === modal) {
      closeModal();
    }
  });
  
  /**
 * Verifica si el jugador actual está en jaque mate
 * @param {string} currentTurn - El jugador actual ("white" o "black")
 * @returns {boolean} - True si es jaque mate, False en caso contrario
 */
function isCheckmate(currentTurn) {
    const allCells = Array.from(board.querySelectorAll('.cell'));
    const playerPieces = currentTurn === "white" ? "♙♖♘♗♕♔" : "♟♜♞♝♛♚";
  
    // Iterar sobre todas las celdas del jugador actual
    for (const fromCell of allCells) {
      const piece = fromCell.querySelector('.piece');
      if (piece && playerPieces.includes(piece.innerText)) {
        // Verificar si alguna pieza tiene movimientos legales
        for (const toCell of allCells) {
          if (isValidMove(fromCell, toCell)) {
            // Simular el movimiento para verificar si sale del jaque
            const originalPiece = toCell.innerHTML;
            movePiece(fromCell, toCell);
            const isStillInCheck = isKingInCheck(currentTurn);
  
            // Revertir el movimiento simulado
            movePiece(toCell, fromCell);
            toCell.innerHTML = originalPiece;
  
            if (!isStillInCheck) {
              return false; // Hay un movimiento legal, no es jaque mate
            }
          }
        }
      }
    }
  
    return true; // No hay movimientos legales, es jaque mate
  }
  
  function playMoveSound() {
    const audio = new Audio('move-sound.mp3'); // Ruta al archivo de sonido
    audio.play();
  }
  
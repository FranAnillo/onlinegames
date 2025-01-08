const choices = document.querySelectorAll('.choice');
const gameResult = document.getElementById('game-result');
const scoreBoard = document.getElementById('score');

let playerScore = 0;
let iaScore = 0;

/**
 * Lógica del juego
 */
choices.forEach(choice => {
  choice.addEventListener('click', () => {
    const playerChoice = choice.dataset.choice;
    const iaChoice = getIaChoice();
    const result = determineWinner(playerChoice, iaChoice);

    updateResult(playerChoice, iaChoice, result);
    updateScore(result);
  });
});

/**
 * Generar elección de la IA
 * @returns {string} - "rock", "paper", o "scissors"
 */
function getIaChoice() {
  const options = ['rock', 'paper', 'scissors'];
  const randomIndex = Math.floor(Math.random() * options.length);
  return options[randomIndex];
}

/**
 * Determinar el ganador
 * @param {string} playerChoice - Elección del jugador
 * @param {string} iaChoice - Elección de la IA
 * @returns {string} - "win", "lose", o "draw"
 */
function determineWinner(playerChoice, iaChoice) {
  if (playerChoice === iaChoice) {
    return 'draw';
  }

  if (
    (playerChoice === 'rock' && iaChoice === 'scissors') ||
    (playerChoice === 'scissors' && iaChoice === 'paper') ||
    (playerChoice === 'paper' && iaChoice === 'rock')
  ) {
    return 'win';
  }

  return 'lose';
}

/**
 * Actualizar el resultado en la interfaz
 * @param {string} playerChoice - Elección del jugador
 * @param {string} iaChoice - Elección de la IA
 * @param {string} result - Resultado del enfrentamiento
 */
function updateResult(playerChoice, iaChoice, result) {
    const playerChoiceEmoji = getChoiceEmoji(playerChoice);
    const iaChoiceEmoji = getChoiceEmoji(iaChoice);
  
    const iaChoiceLine = `La máquina eligió: ${iaChoiceEmoji}`;
  
    if (result === 'win') {
      gameResult.innerHTML = `${iaChoiceLine}<br>Ganaste: ${playerChoiceEmoji} vence a ${iaChoiceEmoji}`;
    } else if (result === 'lose') {
      gameResult.innerHTML = `${iaChoiceLine}<br>Perdiste: ${iaChoiceEmoji} vence a ${playerChoiceEmoji}`;
    } else {
      gameResult.innerHTML = `${iaChoiceLine}<br>Empate: Ambos eligieron ${playerChoiceEmoji}`;
    }
  }
  

/**
 * Actualizar la puntuación
 * @param {string} result - Resultado del enfrentamiento
 */
function updateScore(result) {
  if (result === 'win') {
    playerScore++;
  } else if (result === 'lose') {
    iaScore++;
  }

  scoreBoard.textContent = `Jugador: ${playerScore} | IA: ${iaScore}`;
}

/**
 * Obtener emoji según la elección
 * @param {string} choice - Elección ("rock", "paper", "scissors")
 * @returns {string} - Emoji correspondiente
 */
function getChoiceEmoji(choice) {
  const emojis = {
    rock: '🪨',
    paper: '📄',
    scissors: '✂️',
  };
  return emojis[choice];
}

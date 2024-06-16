const X_CLASS = 'x';
const O_CLASS = 'o';
const WINNING_COMBINATIONS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];
const cellElements = document.querySelectorAll('[data-cell]');
const board = document.getElementById('board');
const restartButton = document.getElementById('restartButton');
const statusDisplay = document.getElementById('status');
const humanButton = document.getElementById('humanButton');
const aiButton = document.getElementById('aiButton');
const playerSelectionModal = document.getElementById('playerSelectionModal');
const playerXButton = document.getElementById('playerXButton');
const playerOButton = document.getElementById('playerOButton');
let oTurn;
let aiOpponent = false;
let playerSymbol = X_CLASS;
let aiSymbol = O_CLASS;

humanButton.addEventListener('click', () => { aiOpponent = false; openPlayerSelection(); });
aiButton.addEventListener('click', () => { aiOpponent = true; openPlayerSelection(); });
restartButton.addEventListener('click', startGame);

playerXButton.addEventListener('click', () => { selectPlayer(X_CLASS); });
playerOButton.addEventListener('click', () => { selectPlayer(O_CLASS); });

function startGame() {
    oTurn = false;
    statusDisplay.textContent = `${playerSymbol.toUpperCase()}'s Turn`;
    cellElements.forEach(cell => {
        cell.classList.remove(X_CLASS);
        cell.classList.remove(O_CLASS);
        cell.textContent = ''; // Clear the cell text
        cell.removeEventListener('click', handleClick);
        cell.addEventListener('click', handleClick, { once: true });
    });
    playerSelectionModal.style.display = 'none';
}

function handleClick(e) {
    const cell = e.target;
    const currentClass = oTurn ? aiSymbol : playerSymbol;
    placeMark(cell, currentClass);
    if (checkWin(currentClass)) {
        endGame(false);
    } else if (isDraw()) {
        endGame(true);
    } else {
        swapTurns();
        if (aiOpponent && oTurn) {
            setTimeout(makeAiMove, 500); // Allow AI to make a move
        }
    }
}

function endGame(draw) {
    if (draw) {
        statusDisplay.textContent = 'Draw!';
    } else {
        statusDisplay.textContent = `${oTurn ? aiSymbol.toUpperCase() : playerSymbol.toUpperCase()} Wins!`;
    }
}

function isDraw() {
    return [...cellElements].every(cell => {
        return cell.classList.contains(X_CLASS) || cell.classList.contains(O_CLASS);
    });
}

function placeMark(cell, currentClass) {
    cell.classList.add(currentClass);
    cell.textContent = currentClass.toUpperCase(); 
}

function swapTurns() {
    oTurn = !oTurn;
    statusDisplay.textContent = `${oTurn ? aiSymbol.toUpperCase() : playerSymbol.toUpperCase()}'s Turn`;
}

function checkWin(currentClass) {
    return WINNING_COMBINATIONS.some(combination => {
        return combination.every(index => {
            return cellElements[index].classList.contains(currentClass);
        });
    });
}

function makeAiMove() {
    const availableCells = [...cellElements].filter(cell => {
        return !cell.classList.contains(X_CLASS) && !cell.classList.contains(O_CLASS);
    });
    const randomCell = availableCells[Math.floor(Math.random() * availableCells.length)];
    if (randomCell) {
        placeMark(randomCell, aiSymbol);
        if (checkWin(aiSymbol)) {
            endGame(false);
        } else if (isDraw()) {
            endGame(true);
        } else {
            swapTurns();
    }
}
}

function openPlayerSelection() {
    playerSelectionModal.style.display = 'flex';
}

function selectPlayer(selectedSymbol) {
    playerSymbol = selectedSymbol;
    aiSymbol = selectedSymbol === X_CLASS ? O_CLASS : X_CLASS;
    startGame();
}

startGame(); 

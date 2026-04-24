const cells = document.querySelectorAll('.cell');
const statusMessage = document.getElementById('statusMessage');
const resetBtn = document.getElementById('resetBtn');
const scoreList = document.getElementById('scoreList');

let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameActive = true;

const winConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Redovi
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Stupci
    [0, 4, 8], [2, 4, 6]             // Dijagonale
];

function handleCellClick(e) {
    const cell = e.target;
    const index = cell.getAttribute('data-index');

    const playerXName = document.getElementById('playerX').value;
    const playerOName = document.getElementById('playerO').value;

    if (!playerXName || !playerOName) {
        alert("Prvo unesite imena igrača!");
        return;
    }

    if (board[index] !== '' || !gameActive) return;

    board[index] = currentPlayer;
    cell.innerText = currentPlayer;

    checkWin();
}

function checkWin() {
    let roundWon = false;
    for (let i = 0; i < winConditions.length; i++) {
        const [a, b, c] = winConditions[i];
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            roundWon = true;
            break;
        }
    }

    const playerXName = document.getElementById('playerX').value;
    const playerOName = document.getElementById('playerO').value;

    if (roundWon) {
        const winnerName = currentPlayer === 'X' ? playerXName : playerOName;
        statusMessage.innerText = `Pobjednik je ${winnerName}!`;
        gameActive = false;
        saveWinToDatabase(winnerName);
        return;
    }

    if (!board.includes('')) {
        statusMessage.innerText = 'Neriješeno!';
        gameActive = false;
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusMessage.innerText = `Na potezu je igrač ${currentPlayer === 'X' ? playerXName : playerOName} (${currentPlayer})`;
}

function saveWinToDatabase(winnerName) {
    fetch('save_win.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ winner: winnerName })
    })
    .then(response => response.json())
    .then(data => {
        console.log(data.message);
        loadLeaderboard(); // Osvježi ljestvicu nakon pobjede
    })
    .catch(error => console.error('Greška:', error));
}

function loadLeaderboard() {
    fetch('get_leaderboard.php')
    .then(response => response.json())
    .then(data => {
        scoreList.innerHTML = '';
        data.forEach(player => {
            const li = document.createElement('li');
            li.innerText = `${player.username} - Pobjede: ${player.wins}`;
            scoreList.appendChild(li);
        });
    });
}

function resetGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    gameActive = true;
    statusMessage.innerText = 'Nova igra! Tko je na potezu?';
    cells.forEach(cell => cell.innerText = '');
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetBtn.addEventListener('click', resetGame);

// Učitaj ljestvicu kad se stranica otvori
loadLeaderboard();
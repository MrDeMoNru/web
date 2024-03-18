document.addEventListener("DOMContentLoaded", function () {
    const canvas = document.getElementById("game");
    const ctx = canvas.getContext("2d");
    const cellSize = 100;
    const boardSize = 3;
    let currentPlayer = "X";
    let winnerGame;
    let board = [
        [null,null,null],
        [null,null,null],
        [null,null,null]
    ];
    let score = {X: " |", O: ""};

    let worker = new Worker("worker_win_script.js");
    worker.postMessage({
            scoreX: score.X,
            scoreO: score.O
        });
    worker.onmessage = receivedWorkerMessage;

    function receivedWorkerMessage(event) {
        let msg = event.data;
        winnerGame = msg;
    }

    function updateScoreboard() {
        document.getElementById("playerXScore").textContent = score.X;
        document.getElementById("playerOScore").textContent = score.O;
    }
    
    function checkWinner() {
        for (let i = 0; i < boardSize; i++) {
            if (
                board[i][0] !== null &&
                board[i][0] === board[i][1] &&
                board[i][0] === board[i][2]
            ) {
                return board[i][0];
            }

            if (
                board[0][i] !== null &&
                board[0][i] === board[1][i] &&
                board[0][i] === board[2][i]
            ) {
                return board[0][i];
            }
        }

        if (
            board[0][0] !== null &&
            board[0][0] === board[1][1] &&
            board[0][0] === board[2][2]
        ) {
            return board[0][0];
        }

        if (
            board[0][2] !== null &&
            board[0][2] === board[1][1] &&
            board[0][2] === board[2][0]
        ) {
            return board[0][2];
        }

        return null;
    }


    function drawWinnerMessage(winner) {
        worker.postMessage(
            {
                scoreX: score.X,
                scoreO: score.O
            }
        );
        const message =
            winner === "X" ? "Выиграли крестики!" : "Выиграли нолики!";
        score[winner] += " |";
        updateScoreboard();
        alert(message);
        resetGame();
    }
    
    function resetGame() {
        console.log(winnerGame);
        /*if (winnerGame === 1) {
            alert("X");
            endGame();
        }
        else if (winnerGame === 2) {
            alert("O");
            endGame();
        }
        else {
            board = [
                [null, null, null],
                [null, null, null],
                [null, null, null]
            ];
            currentPlayer = "X";
            drawGrid();
            updateScoreboard();
        }*/
        switch (winnerGame) {
            case 1:
                alert("X");
                endGame();
                break;
            case 2:
                alert("O");
                endGame();
                break;
            default:
                board = [
                    [null, null, null],
                    [null, null, null],
                    [null, null, null]
                ];
                currentPlayer = "X";
                drawGrid();
                updateScoreboard();
                break;
        }
    }

    function endGame() {
        board = [
            [null, null, null],
            [null, null, null],
            [null, null, null]
        ];
        currentPlayer = "X";
        drawGrid();
        score.O = "";
        score.X = "";
        updateScoreboard();
    }
    
    function drawGrid() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
        for (let i = 1; i < boardSize; i++) {
            ctx.moveTo(0, i * cellSize);
            ctx.lineTo(boardSize * cellSize, i * cellSize);
            ctx.moveTo(i * cellSize, 0);
            ctx.lineTo(i * cellSize, boardSize * cellSize);
        }
        ctx.stroke();
    }
    
    function drawSymbol(x, y, symbol) {
        ctx.font = "bold 80px Arial";
        ctx.fillStyle = "black";
        ctx.fillText(symbol, x * cellSize + 20, y * cellSize + 80);
    }
    
    function handleClick(event) {
        const x = Math.floor(event.offsetX / cellSize);
        const y = Math.floor(event.offsetY / cellSize);

        if (board[y][x] === null) {
            board[y][x] = currentPlayer;
            drawSymbol(x, y, currentPlayer);

            const winner = checkWinner();
            if (winner) {
                setTimeout(() => drawWinnerMessage(winner), 10);
            }
            else {
                currentPlayer = currentPlayer === "X" ? "O" : "X";
            }
        }
    }

    canvas.addEventListener("click", handleClick);
    
    const resetButton = document.querySelector(".reset-button");
    resetButton.addEventListener("click", resetGame);

    drawGrid();
    updateScoreboard();
});
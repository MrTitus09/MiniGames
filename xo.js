const board = document.getElementById("board");
const status = document.getElementById("status");
const restart = document.getElementById("restart");

let currentPlayer = "X";
let cells = [];
let gameOver = false;

const winPatterns = [
    [0,1,2],
    [3,4,5],
    [6,7,8],

    [0,3,6],
    [1,4,7],
    [2,5,8],

    [0,4,8],
    [2,4,6]
];

for(let i = 0; i < 9; i++){

    const cell = document.createElement("div");
    cell.className = "cell";
    cell.dataset.index = i;

    cell.addEventListener("click", () => {

        if(gameOver) return;
        if(cell.textContent !== "") return;

        cell.textContent = currentPlayer;

        if(checkWinner()){
            status.textContent = `🎉 ${currentPlayer} Kazandı!`;
            gameOver = true;
            return;
        }

        if(cells.every(c => c.textContent !== "")){
            status.textContent = "🤝 Berabere!";
            gameOver = true;
            return;
        }

        currentPlayer = currentPlayer === "X" ? "O" : "X";
        status.textContent = `Sıra: ${currentPlayer}`;

    });

    board.appendChild(cell);
    cells.push(cell);
}

function checkWinner(){

    for(let pattern of winPatterns){

        const [a,b,c] = pattern;

        if(
            cells[a].textContent &&
            cells[a].textContent === cells[b].textContent &&
            cells[a].textContent === cells[c].textContent
        ){
            return true;
        }
    }

    return false;
}

restart.addEventListener("click", () => {

    currentPlayer = "X";
    gameOver = false;

    status.textContent = "Sıra: X";

    cells.forEach(cell => {
        cell.textContent = "";
    });

});
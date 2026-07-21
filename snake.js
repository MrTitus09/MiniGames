const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const scoreElement = document.getElementById("score");
const highscoreElement = document.getElementById("highscore");
const restartButton = document.getElementById("restart");

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake;
let direction;
let apple;
let score;
let highscore = localStorage.getItem("snakeHighscore") || 0;

let gameLoop;
let gameRunning = false;
let gamePaused = false;

highscoreElement.textContent = highscore;

function resetGame(){

    snake = [
        {x:10,y:10},
        {x:9,y:10},
        {x:8,y:10}
    ];

    direction = {x:1,y:0};

    score = 0;
    scoreElement.textContent = score;

    spawnApple();

}

function spawnApple(){

    apple = {

        x:Math.floor(Math.random()*tileCount),
        y:Math.floor(Math.random()*tileCount)

    };

}

function draw() {

    ctx.fillStyle = "#111";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Elma
    ctx.fillStyle = "#ff3b30";
    ctx.beginPath();
    ctx.arc(
        apple.x * gridSize + gridSize / 2,
        apple.y * gridSize + gridSize / 2,
        gridSize / 2.5,
        0,
        Math.PI * 2
    );
    ctx.fill();

    // Yılan
    snake.forEach((part, index) => {

        ctx.fillStyle = index === 0 ? "#66ff66" : "#32cd32";

        ctx.fillRect(
            part.x * gridSize + 1,
            part.y * gridSize + 1,
            gridSize - 2,
            gridSize - 2
        );

    });

}

function update() {

    if (!gameRunning || gamePaused) return;

    const head = {
        x: snake[0].x + direction.x,
        y: snake[0].y + direction.y
    };

    // Duvar
    if (
        head.x < 0 ||
        head.y < 0 ||
        head.x >= tileCount ||
        head.y >= tileCount
    ) {
        gameOver();
        return;
    }

    // Kendine çarpma
    for (let part of snake) {
        if (head.x === part.x && head.y === part.y) {
            gameOver();
            return;
        }
    }

    snake.unshift(head);

    // Elma yeme
    if (head.x === apple.x && head.y === apple.y) {

        score++;
        scoreElement.textContent = score;

        if (score > highscore) {
            highscore = score;
            highscoreElement.textContent = highscore;
            localStorage.setItem("snakeHighscore", highscore);
        }

        spawnApple();

    } else {

        snake.pop();

    }

    draw();

}

function gameOver() {

    gameRunning = false;
    clearInterval(gameLoop);

    ctx.fillStyle = "rgba(0,0,0,0.6)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "white";
    ctx.font = "40px Arial";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2);

}

function startGame() {

    clearInterval(gameLoop);

    resetGame();

    let countdown = 3;

    ctx.fillStyle = "#111";
    ctx.fillRect(0,0,canvas.width,canvas.height);

    ctx.fillStyle = "white";
    ctx.font = "60px Arial";
    ctx.textAlign = "center";
    ctx.fillText(countdown, canvas.width/2, canvas.height/2);

    const timer = setInterval(() => {

        countdown--;

        ctx.fillStyle="#111";
        ctx.fillRect(0,0,canvas.width,canvas.height);

        if(countdown > 0){

            ctx.fillStyle="white";
            ctx.font="60px Arial";
            ctx.fillText(countdown,canvas.width/2,canvas.height/2);

        }else{

            clearInterval(timer);

            gameRunning = true;

            draw();

            gameLoop = setInterval(update,150);

        }

    },1000);

}

document.addEventListener("keydown",(e)=>{

    if(e.code==="Space"){
        gamePaused=!gamePaused;
        return;
    }

    switch(e.key){

        case "ArrowUp":
        case "w":
        case "W":
            if(direction.y!==1)
                direction={x:0,y:-1};
            break;

        case "ArrowDown":
        case "s":
        case "S":
            if(direction.y!==-1)
                direction={x:0,y:1};
            break;

        case "ArrowLeft":
        case "a":
        case "A":
            if(direction.x!==1)
                direction={x:-1,y:0};
            break;

        case "ArrowRight":
        case "d":
        case "D":
            if(direction.x!==-1)
                direction={x:1,y:0};
            break;

    }

});

restartButton.addEventListener("click",startGame);

startGame();
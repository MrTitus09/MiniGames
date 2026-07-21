const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const scoreText = document.getElementById("score");
const highscoreText = document.getElementById("highscore");
const restartBtn = document.getElementById("restart");

const tileSize = 25;
const tileCount = canvas.width / tileSize;

let snake = [];
let direction = { x: 1, y: 0 };
let nextDirection = { x: 1, y: 0 };

let apple = { x: 0, y: 0 };

let score = 0;
let highscore = Number(localStorage.getItem("snakeHighscore")) || 0;

let gameRunning = false;
let paused = false;
let speed = 140;
let gameLoop;

highscoreText.textContent = highscore;

function resetGame() {

    snake = [
        { x: 10, y: 10 },
        { x: 9, y: 10 },
        { x: 8, y: 10 }
    ];

    direction = { x: 1, y: 0 };
    nextDirection = { x: 1, y: 0 };

    score = 0;
    speed = 140;

    scoreText.textContent = score;

    spawnApple();

}

function spawnApple() {

    while (true) {

        apple.x = Math.floor(Math.random() * tileCount);
        apple.y = Math.floor(Math.random() * tileCount);

        let inside = false;

        for (const part of snake) {

            if (part.x === apple.x && part.y === apple.y) {

                inside = true;
                break;

            }

        }

        if (!inside) break;

    }

}

function draw() {

    // Arkaplan
    ctx.fillStyle = "#111";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Izgara
    ctx.strokeStyle = "#1f1f1f";
    ctx.lineWidth = 1;

    for (let i = 0; i <= tileCount; i++) {

        ctx.beginPath();
        ctx.moveTo(i * tileSize, 0);
        ctx.lineTo(i * tileSize, canvas.height);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, i * tileSize);
        ctx.lineTo(canvas.width, i * tileSize);
        ctx.stroke();

    }

    // Elma
    const ax = apple.x * tileSize + tileSize / 2;
    const ay = apple.y * tileSize + tileSize / 2;

    // Gölge
    ctx.shadowColor = "#ff3b30";
    ctx.shadowBlur = 12;

    // Gövde
    ctx.fillStyle = "#ff3b30";
    ctx.beginPath();
    ctx.arc(ax, ay, tileSize / 2.7, 0, Math.PI * 2);
    ctx.fill();

    ctx.shadowBlur = 0;

    // Sap
    ctx.strokeStyle = "#6d4c41";
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(ax, ay - 7);
    ctx.lineTo(ax, ay - 12);
    ctx.stroke();

    // Yaprak
    ctx.fillStyle = "#4CAF50";

    ctx.beginPath();
    ctx.ellipse(ax + 4, ay - 8, 4, 2, Math.PI / 4, 0, Math.PI * 2);
    ctx.fill();

    // Yılan
    snake.forEach((part, index) => {

        ctx.shadowColor = "#66ff66";
        ctx.shadowBlur = 10;

        ctx.fillStyle = index === 0 ? "#7CFF7C" : "#41d441";

        roundRect(
            part.x * tileSize + 1,
            part.y * tileSize + 1,
            tileSize - 2,
            tileSize - 2,
            6
        );

        ctx.shadowBlur = 0;

        // Kafa
        if (index === 0) {

            let x1 = 7;
            let y1 = 7;
            let x2 = 17;
            let y2 = 7;

            if (direction.x === -1) {

                x1 = 7;
                y1 = 7;
                x2 = 7;
                y2 = 17;

            }

            if (direction.x === 1) {

                x1 = 17;
                y1 = 7;
                x2 = 17;
                y2 = 17;

            }

            if (direction.y === -1) {

                x1 = 7;
                y1 = 7;
                x2 = 17;
                y2 = 7;

            }

            if (direction.y === 1) {

                x1 = 7;
                y1 = 17;
                x2 = 17;
                y2 = 17;

            }

            ctx.fillStyle = "#000";

            ctx.beginPath();
            ctx.arc(part.x * tileSize + x1, part.y * tileSize + y1, 2.5, 0, Math.PI * 2);
            ctx.fill();

            ctx.beginPath();
            ctx.arc(part.x * tileSize + x2, part.y * tileSize + y2, 2.5, 0, Math.PI * 2);
            ctx.fill();

        }

    });

}

function roundRect(x, y, w, h, r) {

    ctx.beginPath();

    ctx.moveTo(x + r, y);

    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);

    ctx.closePath();

    ctx.fill();

}

function update() {

    if (!gameRunning || paused) return;

    direction = nextDirection;

    const head = {
        x: snake[0].x + direction.x,
        y: snake[0].y + direction.y
    };

    // Duvara çarpma
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
    for (let i = 0; i < snake.length; i++) {

        if (
            head.x === snake[i].x &&
            head.y === snake[i].y
        ) {

            gameOver();
            return;

        }

    }

    snake.unshift(head);

    // Elma yeme
    if (
        head.x === apple.x &&
        head.y === apple.y
    ) {

        score++;

        scoreText.textContent = score;

        if (score > highscore) {

            highscore = score;

            highscoreText.textContent = highscore;

            localStorage.setItem(
                "snakeHighscore",
                highscore
            );

        }

        // Her 5 puanda hızlan
        if (score % 5 === 0 && speed > 60) {

            speed -= 10;

            clearInterval(gameLoop);

            gameLoop = setInterval(update, speed);

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

    draw();

    ctx.fillStyle = "rgba(0,0,0,.55)";
    ctx.fillRect(0,0,canvas.width,canvas.height);

    ctx.fillStyle = "white";
    ctx.font = "bold 42px Arial";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER",canvas.width/2,canvas.height/2-20);

    ctx.font = "22px Arial";
    ctx.fillText("Skor: " + score,canvas.width/2,canvas.height/2+20);

}

function startGame(){

    clearInterval(gameLoop);

    resetGame();

    gameRunning = false;

    let countdown = 3;

    function drawCountdown(){

        ctx.fillStyle="#111";
        ctx.fillRect(0,0,canvas.width,canvas.height);

        ctx.fillStyle="white";
        ctx.font="bold 70px Arial";
        ctx.textAlign="center";

        ctx.fillText(
            countdown>0 ? countdown : "GO!",
            canvas.width/2,
            canvas.height/2
        );

    }

    drawCountdown();

    const timer=setInterval(()=>{

        countdown--;

        if(countdown>=0){

            drawCountdown();

        }else{

            clearInterval(timer);

            gameRunning=true;

            draw();

            gameLoop=setInterval(update,speed);

        }

    },1000);

}

document.addEventListener("keydown",(e)=>{

    if(e.code==="Space"){

        paused=!paused;

        return;

    }

    switch(e.key){

        case"ArrowUp":
        case"w":
        case"W":

            if(direction.y!==1)
                nextDirection={x:0,y:-1};

            break;

        case"ArrowDown":
        case"s":
        case"S":

            if(direction.y!==-1)
                nextDirection={x:0,y:1};

            break;

        case"ArrowLeft":
        case"a":
        case"A":

            if(direction.x!==1)
                nextDirection={x:-1,y:0};

            break;

        case"ArrowRight":
        case"d":
        case"D":

            if(direction.x!==-1)
                nextDirection={x:1,y:0};

            break;

    }

});

restartBtn.addEventListener("click",startGame);

startGame();

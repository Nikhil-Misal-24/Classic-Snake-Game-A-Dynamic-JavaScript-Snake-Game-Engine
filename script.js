const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");
const pauseBtn = document.getElementById("pauseBtn");
const nameTag = document.getElementById("playerNameTag");

const box = 20;
let score = 0;
let d = "RIGHT";
let isPaused = true; // Start mein pause rahega
let gameActive = true;
let playerName = "";

// Naam poochne ka logic
window.onload = () => {
    playerName = prompt("Apna Naam Enter Karein:", "Player 1");
    if(!playerName) playerName = "Guest";
    nameTag.innerText = "Khiladi: " + playerName;
};

let snake = [{ x: 9 * box, y: 10 * box }];
let food = {
    x: Math.floor(Math.random() * 19 + 1) * box,
    y: Math.floor(Math.random() * 19 + 1) * box
};

document.addEventListener("keydown", (e) => {
    if(e.keyCode == 37 && d != "RIGHT") d = "LEFT";
    else if(e.keyCode == 38 && d != "DOWN") d = "UP";
    else if(e.keyCode == 39 && d != "LEFT") d = "RIGHT";
    else if(e.keyCode == 40 && d != "UP") d = "DOWN";
    else if(e.keyCode == 32) togglePause();
});

function changeDir(newDir) {
    if(!isPaused) {
        if(newDir == "LEFT" && d != "RIGHT") d = "LEFT";
        if(newDir == "UP" && d != "DOWN") d = "UP";
        if(newDir == "RIGHT" && d != "LEFT") d = "RIGHT";
        if(newDir == "DOWN" && d != "UP") d = "DOWN";
    }
}

function togglePause() {
    isPaused = !isPaused;
    pauseBtn.innerHTML = isPaused ? "PLAY" : "PAUSE";
    pauseBtn.classList.toggle("paused");
}

function draw() {
    if(!gameActive || isPaused) return;

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Snake Draw
    for(let i = 0; i < snake.length; i++) {
        ctx.fillStyle = (i == 0) ? "#39ff14" : "#1b5e20";
        ctx.fillRect(snake[i].x, snake[i].y, box-1, box-1);
    }

    // Food Draw
    ctx.fillStyle = "#ff3131";
    ctx.beginPath();
    ctx.arc(food.x + box/2, food.y + box/2, box/2 - 2, 0, Math.PI * 2);
    ctx.fill();

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if(d == "LEFT") snakeX -= box;
    if(d == "UP") snakeY -= box;
    if(d == "RIGHT") snakeX += box;
    if(d == "DOWN") snakeY += box;

    // Portal Logic (Deewar se nahi marta)
    if (snakeX < 0) snakeX = canvas.width - box;
    else if (snakeX >= canvas.width) snakeX = 0;
    if (snakeY < 0) snakeY = canvas.height - box;
    else if (snakeY >= canvas.height) snakeY = 0;

    if(snakeX == food.x && snakeY == food.y) {
        score++;
        scoreElement.innerHTML = score;
        food = {
            x: Math.floor(Math.random() * 19 + 1) * box,
            y: Math.floor(Math.random() * 19 + 1) * box
        };
    } else {
        snake.pop();
    }

    let newHead = { x: snakeX, y: snakeY };

    if(snake.some(seg => seg.x === newHead.x && seg.y === newHead.y)) {
        gameActive = false;
        alert("Game Over " + playerName + "! Score: " + score);
        location.reload();
    }

    snake.unshift(newHead);
}

setInterval(draw, 180); // Easy Speed
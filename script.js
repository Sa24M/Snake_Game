let input_dir = { x: 0, y: 0 }; // Initial direction
const foodsound = new Audio("music_food.mp3");
const movesound = new Audio("music_move.mp3");
const gameoversound = new Audio("music_gameover.mp3");
const game_music = new Audio("music_music.mp3");

// 🎵 Reduce game music volume (50% volume)
game_music.volume = 0.5;

let speed = 4;
let highscoreval = 0;
let previouspainttime = 0;
let snake_arr = [{ x: 10, y: 10 }];
let score = 0;
let isPaused = false; // Pause state

food = { x: 6, y: 7 };

const box = document.querySelector(".box");
const scorebox = document.getElementById("scorebox");
const highscorebox = document.getElementById("highscorebox");
const pauseBtn = document.getElementById("pauseBtn"); // Pause Button
let previous_score = 0;

// 🎮 Move function (for both keyboard and mobile)
function move(direction) {
    if (isPaused) return; // Don't move if paused
    movesound.play();
    switch (direction) {
        case "ArrowUp":
            input_dir = { x: 0, y: -1 };
            break;
        case "ArrowDown":
            input_dir = { x: 0, y: 1 };
            break;
        case "ArrowLeft":
            input_dir = { x: -1, y: 0 };
            break;
        case "ArrowRight":
            input_dir = { x: 1, y: 0 };
            break;
    }
}

// 🖥️ Keyboard Controls
window.addEventListener("keydown", (e) => move(e.key));

// 📱 Mobile Touch Controls
document.querySelectorAll(".controls button").forEach((btn) => {
    btn.addEventListener("touchstart", (e) => {
        e.preventDefault(); // Prevents ghost clicks
        move(btn.getAttribute("onclick").replace("move('", "").replace("')", ""));
    });
});

// 🛑 Pause Button
pauseBtn.addEventListener("click", () => {
    isPaused = !isPaused; // Toggle pause state

    if (isPaused) {
        game_music.pause();
        pauseBtn.innerText = "Resume";
    } else {
        game_music.play();
        window.requestAnimationFrame(main); // Resume game loop
        pauseBtn.innerText = "Pause";
    }
});

// 🎮 Main Game Loop
function main(ctime) {
    game_music.play();
    if (isPaused) return; // Stop game loop if paused

    window.requestAnimationFrame(main);
    if ((ctime - previouspainttime) / 1000 < 1 / speed) {
        return;
    }
    previouspainttime = ctime;
    game_engine();
}

// 🚨 Collision Detection
function is_collide(arr) {
    // If the snake collides with itself
    for (let i = 1; i < snake_arr.length; i++) {
        if (snake_arr[i].x === snake_arr[0].x && snake_arr[i].y === snake_arr[0].y) {
            return true;
        }
    }
    // If the snake hits the wall
    if (snake_arr[0].x >= 22 || snake_arr[0].y >= 16 || snake_arr[0].x <= 0 || snake_arr[0].y <= 0) {
        return true;
    }
    return false;
}

// 🕹️ Game Engine
function game_engine() {
    // 🛑 If collision happens, reset game
    if (is_collide(snake_arr)) {
        gameoversound.play();
        game_music.pause();
        input_dir = { x: 0, y: 0 };
        alert("Game over! Press any key to restart.");
        snake_arr = [{ x: 10, y: 10 }];
        score = 0;
        speed = 4; // Reset speed
        return;
    }

    // 🍏 If food is eaten, grow snake and increase score
    if (snake_arr[0].x === food.x && snake_arr[0].y === food.y) {
        score += 1;
        if (score > highscoreval) {
            highscoreval = score;
            localStorage.setItem("highscorebox", JSON.stringify(highscoreval));
            highscorebox.innerHTML = "High Score : " + highscoreval;
        }
        // Increase speed every 5 points
        if (score - previous_score === 5) {
            speed += 1;
            previous_score = score;
        }
        scorebox.innerHTML = "Score : " + score;
        foodsound.play();

        // Add new head (grow snake)
        snake_arr.unshift({ x: snake_arr[0].x + input_dir.x, y: snake_arr[0].y + input_dir.y });

        // 🍏 Generate new food at a random position
        let a = 2, b = 14;
        food = { x: Math.round(a + (b - a) * Math.random()), y: Math.round(a + (b - a) * Math.random()) };
    }

    // 🏃 Move the snake forward
    for (let i = snake_arr.length - 2; i >= 0; i--) {
        snake_arr[i + 1] = { ...snake_arr[i] };
    }

    snake_arr[0].x += input_dir.x;
    snake_arr[0].y += input_dir.y;

    // 🎨 Draw Snake & Food
    box.innerHTML = "";
    
    // Draw the snake
    snake_arr.forEach((e, index) => {
        let snakeElement = document.createElement("div");
        snakeElement.style.gridRowStart = e.y;
        snakeElement.style.gridColumnStart = e.x;
        snakeElement.classList.add(index === 0 ? "head" : "snake");
        box.appendChild(snakeElement);
    });

    // Draw the food
    let foodElement = document.createElement("div");
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add("food");
    box.appendChild(foodElement);
}

// 📌 High Score Handling
let highscore = localStorage.getItem("highscorebox");
if (highscore === null) {
    highscoreval = 0;
    localStorage.setItem("highscorebox", JSON.stringify(highscoreval));
} else {
    highscoreval = JSON.parse(highscore);
    highscorebox.innerHTML = "High Score : " + highscoreval;
}

// ▶️ Start Game
game_music.play();
window.requestAnimationFrame(main);

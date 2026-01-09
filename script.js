const gameContainer = document.getElementById("game-container");
const basket = document.getElementById("basket");
const scoreDisplay = document.getElementById("score");
const missedDisplay = document.getElementById("missed");
const startBtn = document.getElementById("start-btn");

let score = 0;
let missed = 0;
let gameRunning = false;
let ballInterval = null;

startBtn.addEventListener("click", startGame);
gameContainer.addEventListener("mousemove", moveBasket);

function moveBasket(e) {
  if (!gameRunning) return;

  const rect = gameContainer.getBoundingClientRect();
  let x = e.clientX - rect.left - basket.offsetWidth / 2;
  x = Math.max(0, Math.min(rect.width - basket.offsetWidth, x));
  basket.style.left = x + "px";
}

function startGame() {
  if (gameRunning) return;

  gameRunning = true;
  score = 0;
  missed = 0;
  scoreDisplay.textContent = score;
  missedDisplay.textContent = missed;

  startBtn.textContent = "Game Running...";
  startBtn.disabled = true;

  // Remove any leftover balls
  document.querySelectorAll(".ball").forEach(b => b.remove());

  // Drop a new ball every second
  ballInterval = setInterval(createBall, 1000);
}

function createBall() {
  if (!gameRunning) return;

  const ball = document.createElement("div");
  ball.classList.add("ball");
  ball.style.left = Math.random() * (gameContainer.clientWidth - 25) + "px";
  ball.style.top = "0px";
  gameContainer.appendChild(ball);

  let fallSpeed = 2 + Math.random() * 3;

  const fall = setInterval(() => {
    if (!gameRunning) {
      clearInterval(fall);
      if (ball.parentNode) ball.remove();
      return;
    }

    let ballTop = parseFloat(ball.style.top);
    ballTop += fallSpeed;
    ball.style.top = ballTop + "px";

    // Check if the ball reaches the bottom (basket area)
    if (ballTop + 25 >= gameContainer.clientHeight - basket.offsetHeight) {
      const basketLeft = parseFloat(basket.style.left) || 0;
      const basketRight = basketLeft + basket.offsetWidth;
      const ballLeft = parseFloat(ball.style.left);
      const ballRight = ballLeft + 25;

      // Check collision
      if (ballRight > basketLeft && ballLeft < basketRight) {
        // Ball caught
        score++;
        scoreDisplay.textContent = score;
      } else {
        // Ball missed
        missed++;
        missedDisplay.textContent = missed;

        if (missed >= 5) {
          endGame();
        }
      }

      clearInterval(fall);
      if (ball.parentNode) ball.remove();
    }
  }, 20);
}

function endGame() {
  gameRunning = false;
  clearInterval(ballInterval);
  document.querySelectorAll(".ball").forEach(b => b.remove());
  startBtn.textContent = "Start Game";
  startBtn.disabled = false;
  alert("Game Over! Your score: " + score);
}

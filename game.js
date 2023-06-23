// Get the canvas element
var canvas = document.getElementById("gameScreen");
var ctx = canvas.getContext("2d");

// Set the canvas to full browser width/height
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Game characters and settings
var cat = {
  x: 50,
  y: 50,
  width: 50,
  height: 50,
  speed: 25,
  dy: 0, // This is the vertical velocity of the cat
  gravity: 1, // This is the constant force pulling the cat down
  onGround: false,
  img: new Image(),
};

cat.img.src =
  "https://cdn.discordapp.com/attachments/1066210217731305583/1108813768344998029/birdmonk_cute_whale_cb3b964f-9255-4e7f-b998-508842a92c56-transformed.png";

// Background
var bgImage = new Image();
bgImage.src =
  "https://cdn.discordapp.com/attachments/1066210217731305583/1108764118804078613/birdmonk_cute_animated_blue_sky_with_bitcoin_and_ethereum_as_a__67753693-b55f-4fa3-9506-2387ba4c69f7.png";

var bg1 = {
  x: 0,
  y: 0,
  speed: 1,
};

var bg2 = {
  x: canvas.width,
  y: 0,
  speed: 1,
};

// Platforms array
var platforms = [];
for (var i = 0; i < 40; i++) {
  var width = Math.random() * 100 + 50;
  platforms.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    width: width,
    height: 20,
    color: "#81ff5b",
  });
}

// Coins
var coins = [];
for (var i = 0; i < 50; i++) {
  coins.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    radius: 20,
    collected: false,
    img: new Image(),
  });
  coins[i].img.src =
    "https://cdn.discordapp.com/attachments/1066210217731305583/1108816935258443856/She_Is.png";
}

// Score
var score = 0;

// Draw cat function
function drawCat() {
  ctx.drawImage(cat.img, cat.x, cat.y, cat.width, cat.height);
}

// Draw platforms
function drawPlatforms() {
  platforms.forEach(function (p) {
    ctx.fillStyle = p.color;
    ctx.fillRect(p.x, p.y, p.width, p.height);
  });
}

// Draw coins
function drawCoins() {
  coins.forEach(function (coin) {
    if (!coin.collected) {
      ctx.drawImage(
        coin.img,
        coin.x - coin.radius,
        coin.y - coin.radius,
        coin.radius * 2.5,
        coin.radius * 2
      );
    }
  });
}

// Check for collision with coin
function checkCoinCollision() {
  coins.forEach(function (coin) {
    if (
      !coin.collected &&
      cat.x < coin.x + coin.radius &&
      cat.x + cat.width > coin.x - coin.radius &&
      cat.y < coin.y + coin.radius &&
      cat.y + cat.height > coin.y - coin.radius
    ) {
      coin.collected = true;
      score += 10;
    }
  });
}

// Draw score
function drawScore() {
  ctx.font = "30px Arial";
  ctx.fillStyle = "#FF0000";
  ctx.fillText("Score: " + score, 10, 30);
}

// Draw background
function drawBackground() {
  ctx.drawImage(bgImage, bg1.x, bg1.y, canvas.width, canvas.height);
  ctx.drawImage(bgImage, bg2.x, bg2.y, canvas.width, canvas.height);
}

// Reset game
function resetGame() {
  cat.x = 50;
  cat.y = 50;
  cat.dy = 0;
  cat.onGround = false;
  score = 0;
  coins.forEach(function (coin) {
    coin.collected = false;
  });
}

// Update game characters and settings
function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawBackground();
  drawPlatforms();
  drawCoins();
  drawScore();
  drawCat();

  bg1.x -= bg1.speed;
  bg2.x -= bg2.speed;

  if (bg1.x < -canvas.width) bg1.x = canvas.width;
  if (bg2.x < -canvas.width) bg2.x = canvas.width;

  platforms.forEach(function (p) {
    if (
      cat.y + cat.height > p.y &&
      cat.y < p.y + p.height &&
      cat.x + cat.width > p.x &&
      cat.x < p.x + p.width &&
      cat.dy >= 0 // Ensure that the whale is falling when it lands on a platform
    ) {
      cat.y = p.y - cat.height;
      cat.dy = 0;
      cat.onGround = true;
    }
  });

  // Apply gravity and movement
  cat.dy += cat.gravity; // Apply gravity to velocity
  cat.y += cat.dy; // Apply velocity to position

  if (cat.y + cat.height > canvas.height) {
    resetGame();
  }

  checkCoinCollision();

  requestAnimationFrame(update);
}

update();

// Key controls
window.onkeydown = function (e) {
  if (e.code === "ArrowLeft") cat.x -= cat.speed;
  if (e.code === "ArrowRight") cat.x += cat.speed;
  if (e.code === "Space" && cat.onGround) {
    cat.dy = -20;
    cat.onGround = false;
  }
};

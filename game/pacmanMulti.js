class PacMan {
  constructor(ctx, x, y, radius, color, mouthSpeed = 0.04) {
    this.score = 0;
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.mouthSpeed = mouthSpeed;
    this.mouthOpenValue = 1; // Start with the mouth open
    this.mouthOpening = true;
    this.dx = 0;
    this.dy = 0;
    this.nextDx = 0;
    this.nextDy = 0;
    this.direction = 'right';

  }

  draw(direction) {
    const mouthArc = this.mouthOpenValue * Math.PI * 0.2;
    let baseStartAngle, baseEndAngle;

    switch (direction) {
      case "left":
        baseStartAngle = 1.2;
        baseEndAngle = 0.8;
        break;
      case "right":
        baseStartAngle = 0.2;
        baseEndAngle = 1.8;
        break;
      case "up":
        baseStartAngle = 1.7;
        baseEndAngle = 1.3;
        break;
      case "down":
        baseStartAngle = 0.7;
        baseEndAngle = 0.3;
        break;
      default:
        baseStartAngle = 0.2;
        baseEndAngle = 1.8;
    }

    // Calculate the angles for the arc
    let startAngle = baseStartAngle * Math.PI - mouthArc;
    let endAngle = baseEndAngle * Math.PI + mouthArc;

    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.radius, startAngle, endAngle, false);
    this.ctx.lineTo(this.x, this.y);
    this.ctx.fillStyle = this.color;
    this.ctx.fill();
    this.ctx.closePath();
  }

  animateMouth(animate) {
    if (animate) {
      if (this.mouthOpening) {
        this.mouthOpenValue += this.mouthSpeed;
        if (this.mouthOpenValue >= 1) {
          this.mouthOpening = false;
        }
      } else {
        this.mouthOpenValue -= this.mouthSpeed;
        if (this.mouthOpenValue <= 0) {
          this.mouthOpening = true;
        }
      }
    } 
  }

  update() {
    let gridPosX = Math.floor(this.x / level.tileSize);
    let gridPosY = Math.floor(this.y / level.tileSize);
    let cellCenterX = (gridPosX + 0.5) * level.tileSize;
    let cellCenterY = (gridPosY + 0.5) * level.tileSize;
    let turnTolerance = this.radius * 0.1;

    let canTurn =
      Math.abs(cellCenterX - this.x) <= turnTolerance &&
      Math.abs(cellCenterY - this.y) <= turnTolerance;

    if (canTurn) {
      let potentialX = gridPosX + this.nextDx;
      let potentialY = gridPosY + this.nextDy;

      if (
        !level.isWall(potentialX * level.tileSize, potentialY * level.tileSize)
      ) {
        this.dx = this.nextDx;
        this.dy = this.nextDy;
      }
      
    }

    let nextX = this.x + this.dx * this.radius;
    let nextY = this.y + this.dy * this.radius;

    if (!level.isWall(nextX, nextY)) {
      this.x += this.dx;
      this.y += this.dy;
    }
    else {
      this.setDirection(0,0);
    }

    if (this.dx !== 0 || this.dy !== 0) {
      this.animateMouth(true);
    } else {
      this.animateMouth(false);
    }

    if (this.dx == 0 && this.dy == 0) {}
    else if (this.dx < 0) this.direction = "left";
    else if (this.dx > 0) this.direction = "right";
    else if (this.dy < 0) this.direction = "up";
    else if (this.dy > 0) this.direction = "down";

    this.draw(this.direction);

    // Check for pellet collisions
    for (let pellet of level.pellets) {
      if (!pellet.eaten && pellet.isEaten(this.x, this.y, this.radius)) {
        this.score += pellet.scoreValue;
        console.log(`Score for ${this.color} Pac-Man: ${this.score}`);
        pellet.eaten = true; // Mark the pellet as eaten
        break; // Break to ensure only one pellet is eaten per frame
      }
    }

    // Check for power pellet collisions
    for (let powerPellet of level.powerPellets) {
      if (
        !powerPellet.eaten &&
        powerPellet.isEaten(this.x, this.y, this.radius)
      ) {
        this.score += powerPellet.scoreValue;
        console.log(`Score for ${this.color} Pac-Man: ${this.score}`);
        powerPellet.eaten = true; // Mark the power pellet as eaten
        break; // Break to ensure only one power pellet is eaten per frame
      }
    }
  }

  setDirection(dx, dy) {
    this.nextDx = dx;
    this.nextDy = dy;
  }
}

class Level {
  constructor(ctx, levelString, color = "blue") {
    this.ctx = ctx;
    this.levelString = levelString.split("\n"); // Split the string into an array of strings for each row
    this.color = color;
    this.tileSize = 20; // Size of each tile in the level
    this.spawnPoints = []; // Array to hold spawn point coordinates
    this.collectSpawnPoints(); // Initialize spawn points
    this.initializePellets();
  }

  draw() {
    this.drawPellets();
    for (let row = 0; row < this.levelString.length; row++) {
      for (let col = 0; col < this.levelString[row].length; col++) {
        const tile = this.levelString[row][col];
        if (tile === "W") {
          this.ctx.fillStyle = this.color;
          this.ctx.fillRect(
            col * this.tileSize,
            row * this.tileSize,
            this.tileSize,
            this.tileSize
          );
        } else if (tile === ".") {
          // Draw a pellet
        } else if (tile === "*") {
          // Draw a power-up pellet
        } else if (tile === "S") {
          // Spawn Point
          this.ctx.fillStyle = "green";
          this.ctx.beginPath();
          this.ctx.fillRect(
            col * this.tileSize + this.tileSize / 4,
            row * this.tileSize + this.tileSize / 4,
            this.tileSize / 2,
            this.tileSize / 2
          );
          this.ctx.fill();
        }
        // more conditions here for additional tile types
      }
    }
  }

  initializePellets() {
    this.pellets = [];
    this.powerPellets = [];
    for (let row = 0; row < this.levelString.length; row++) {
      for (let col = 0; col < this.levelString[row].length; col++) {
        let x = col * this.tileSize + this.tileSize / 2;
        let y = row * this.tileSize + this.tileSize / 2;
        if (this.levelString[row][col] === ".") {
          this.pellets.push(new Pellet(x, y));
        } else if (this.levelString[row][col] === "*") {
          this.powerPellets.push(new PowerPellet(x, y));
        }
      }
    }
  }

  drawPellets() {
    // Draw standard pellets
    for (let pellet of this.pellets) {
      pellet.draw(this.ctx);
    }
    // Draw power pellets
    for (let powerPellet of this.powerPellets) {
      powerPellet.draw(this.ctx);
    }
  }

  collectSpawnPoints() {
    for (let row = 0; row < this.levelString.length; row++) {
      for (let col = 0; col < this.levelString[row].length; col++) {
        if (this.levelString[row][col] === "S") {
          this.spawnPoints.push({
            x: col * this.tileSize + this.tileSize / 2,
            y: row * this.tileSize + this.tileSize / 2,
          });
        }
      }
    }
  }

  isWall(x, y) {
    const row = Math.floor(y / this.tileSize);
    const col = Math.floor(x / this.tileSize);
    return this.levelString[row] && this.levelString[row][col] === "W";
  }
}

class Pellet {
  constructor(x, y, scoreValue = 10) {
    this.x = x;
    this.y = y;
    this.radius = 1.5; // Standard size of a pellet
    this.scoreValue = scoreValue;
    this.eaten = false;
  }

  draw(ctx) {
    if (!this.eaten) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = "white";
      ctx.fill();
    }
  }

  isEaten(pacManX, pacManY, pacManRadius) {
    // Check if PacMan has collided with the pellet
    let distance = Math.hypot(pacManX - this.x, pacManY - this.y);
    if (distance < this.radius + pacManRadius) {
      this.eaten = true;
      return true;
    }
    return false;
  }
}

class PowerPellet extends Pellet {
  constructor(x, y, scoreValue = 50) {
    super(x, y, scoreValue);
    this.radius = 3; // Power pellets are larger
  }

  draw(ctx) {
    if (!this.eaten) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = "yellow";
      ctx.fill();
    }
  }
}

const canvas = document.getElementById("pacmanCanvas");
const ctx = canvas.getContext("2d");
let pacMen = [];
const levelString = `
WWWWWWWWWWWWWWWWWWWWWWWWWWWW
W............WW............W
W.WWWW.WWWWW.WW.WWWWW.WWWW.W
W*WWWW.WWWWW.WW.WWWWW.WWWW*W
W.WWWW.WWWWW.WW.WWWWW.WWWW.W
W..........................W
W.WWWW.WW.WWWWWWWW.WW.WWWW.W
W.WWWW.WW.WWWWWWWW.WW.WWWW.W
W......WW....WW....WW......W
WWWWWW.WWWWW-WW-WWWWW.WWWWWW
WWWWWW.WWWWW-WW-WWWWW.WWWWWW
WWWWWW.WW----------WW.WWWWWW
WWWWWW.WW-WWWDDWWW-WW.WWWWWW
WWWWWW.WW-W------W-WW.WWWWWW
T-----.---W-IBPK-W---.-----T
WWWWWW.WW-W------W-WW.WWWWWW
WWWWWW.WW-WWWWWWWW-WW.WWWWWW
WWWWWW.WW----SS----WW.WWWWWW
WWWWWW.WW-WWWWWWWW-WW.WWWWWW
WWWWWW.WW-WWWWWWWW-WW.WWWWWW
W............WW............W
W.WWWW.WWWWW.WW.WWWWW.WWWW.W
W.WWWW.WWWWW.WW.WWWWW.WWWW.W
W*..WW................WW..*W
WWW.WW.WW.WWWWWWWW.WW.WW.WWW
WWW.WW.WW.WWWWWWWW.WW.WW.WWW
W......WW....WW....WW......W
W.WWWWWWWWWW.WW.WWWWWWWWWW.W
W.WWWWWWWWWW.WW.WWWWWWWWWW.W
W..........................W
WWWWWWWWWWWWWWWWWWWWWWWWWWWW
`.trim();
const level = new Level(ctx, levelString);

document.getElementById("newPacman").addEventListener("click", addNewPacMan);

function addNewPacMan() {
  const colors = ["red", "green", "purple", "orange"];
  const color = colors[Math.floor(Math.random() * colors.length)];

  // Get a random spawn location from the level's spawn points
  const spawnIndex = Math.floor(Math.random() * level.spawnPoints.length);
  const spawnPoint = level.spawnPoints[spawnIndex];

  const newPacMan = new PacMan(
    ctx,
    spawnPoint.x,
    spawnPoint.y,
    10,
    color,
    0.05
  );
  pacMen.push(newPacMan);
  console.log("Adding a new PacMan");
}

function gameLoop() {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  level.draw();
  for (let p of pacMen) {
    p.update();
  }
  requestAnimationFrame(gameLoop);
}

document.addEventListener("DOMContentLoaded", (event) => {
  document.getElementById("newPacman").addEventListener("click", addNewPacMan);
  gameLoop();
});

document.addEventListener("keydown", (event) => {
  for (let p of pacMen) {
    switch (event.key) {
      case "ArrowLeft":
        p.setDirection(-1, 0);
        break;
      case "ArrowRight":
        p.setDirection(1, 0);
        break;
      case "ArrowUp":
        p.setDirection(0, -1);
        break;
      case "ArrowDown":
        p.setDirection(0, 1);
        break;
    }
  }
});

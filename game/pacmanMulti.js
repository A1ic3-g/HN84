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
    this.direction = "right";
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
      Math.abs(cellCenterY - this.y) <= turnTolerance &&
      this.x < 560 - this.radius &&
      this.x > 0 + this.radius &&
      this.y < 600 - this.radius &&
      this.y > 0 + this.radius;

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
    } else {
      this.setDirection(0, 0);
    }

    if (this.x - this.radius > 560) {
      this.x -= 560;
    } else if (this.x + this.radius < 0) {
      this.x += 560;
    }
    if (this.y - this.radius > 620) {
      this.y -= 620;
    } else if (this.y + this.radius < 0) {
      this.y += 620;
    }

    if (this.dx !== 0 || this.dy !== 0) {
      this.animateMouth(true);
    } else {
      this.animateMouth(false);
    }

    if (this.dx == 0 && this.dy == 0) {
    } else if (this.dx < 0) this.direction = "left";
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
    this.inkySpawnPoints = [];
    this.collectSpawnPoints(); // Initialize spawn points
    this.collectGhostSpawnPoints();
    this.initializePellets();
  }

  draw() {
    this.drawPellets();
    for (let row = 0; row < this.levelString.length; row++) {
      for (let col = 0; col < this.levelString[row].length; col++) {
        const tile = this.levelString[row][col];
        if (tile === "W" || tile === "G") {
          this.drawWall(col, row);
        } else if (tile === "D") {
          this.drawDoor(col,row);
        }
        else if (tile === ".") {
          // Draw a pellet
        } else if (tile === "*") {
          // Draw a power-up pellet
        } else if (tile === "S") {
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

  drawDoor(col,row) {
    // Doors are always basically the same
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(
      col * this.tileSize,
      row * this.tileSize,
      this.tileSize,
      this.tileSize
    );
    this.ctx.fillStyle = "pink";
    this.ctx.fillRect(
      col * this.tileSize,
      row * this.tileSize + this.tileSize * 4/7,
      this.tileSize,
      this.tileSize/3
    );
    if (this.levelString[row][col-1] === "G")
    {
      this.ctx.moveTo(
        col * this.tileSize, 
        row * this.tileSize + this.tileSize /2);
      this.ctx.lineTo(
        col * this.tileSize,
        row * this.tileSize + this.tileSize 
      );

          this.ctx.stroke();
    } else if (this.levelString[row][col+1] === "G")
    {
      this.ctx.moveTo(
        (1 + col) * this.tileSize , 
        row * this.tileSize + this.tileSize /2);
      this.ctx.lineTo(
        (1 + col) * this.tileSize,
        row * this.tileSize + this.tileSize 
      );

          this.ctx.stroke();
    }
  }
  drawWall(col, row) {
    // Draw the wall as a black block
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(
      col * this.tileSize,
      row * this.tileSize,
      this.tileSize,
      this.tileSize
    );

    if (!this.isWallTile(col, row)) {
      return;
    }

    // Draw the blue line in the center with corner handling
    this.ctx.strokeStyle = "blue";
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();

    // Determine corner type
    // 0 1 2
    // 3 - 4
    // 5 6 7
    //false false true
    //false      true
    //false true false
    let has0 = this.isWallTile(col - 1, row + 1);

    let has1 = this.isWallTile(col, row - 1);
    let has2 = this.isWallTile(col + 1, row + 1);
    let has3 = this.isWallTile(col - 1, row);
    let has4 = this.isWallTile(col + 1, row);
    let has5 = this.isWallTile(col - 1, row - 1);
    let has6 = this.isWallTile(col, row + 1);
    let has7 = this.isWallTile(col + 1, row - 1);
    // For handling edges
    if (col == 0) {
      has0 = true;
      has3 = true;
      has5 = true;
    }
    if (row == 0) {
      has0 = true;
      has1 = true;
      has2 = true;
    }
    if (col == lengthOfEachRow) {
      has2 = true;
      has4 = true;
      has7 = true;
    }
    if (row == numberOfRows) {
      has5 = true;
      has6 = true;
      has7 = true;
    }

    //console.log(row, col, has0, has1, has2, has3, has4, has5 ,has6, has7);
    // Calculate center point
    const centerX = col * this.tileSize + this.tileSize / 2;
    const centerY = row * this.tileSize + this.tileSize / 2;

    if (!has0 && has1 && has2 && has3 && has4 && has5 && has6 && has7) {
      // Top-left corner
      this.ctx.arc(
        centerX - this.tileSize / 2,
        centerY + this.tileSize / 2,
        this.tileSize / 2,
        1.5 * Math.PI,
        0
      );
    } else if (has0 && has1 && !has2 && has3 && has4 && has5 && has6 && has7) {
      // Top-right corner
      this.ctx.arc(
        centerX + this.tileSize / 2,
        centerY + this.tileSize / 2,
        this.tileSize / 2,
        Math.PI,
        1.5 * Math.PI
      );
    } else if (has0 && has1 && has2 && has3 && has4 && !has5 && has6 && has7) {
      // Bottom-left corner
      this.ctx.arc(
        centerX - this.tileSize / 2,
        centerY - this.tileSize / 2,
        this.tileSize / 2,
        Math.PI / 2,
        0,
        true
      );
    } else if (has0 && has1 && has2 && has3 && has4 && has5 && has6 && !has7) {
      // Bottom-right corner
      this.ctx.arc(
        centerX + this.tileSize / 2,
        centerY - this.tileSize / 2,
        this.tileSize / 2,
        Math.PI / 2,
        Math.PI
      );
    } else if ((has1 && !has3 && has6) || (has1 && !has4 && has6)) {
      // Vertical line
      if (this.levelString[row][col] === "G") {
        if (col > lengthOfEachRow / 2) {
          this.ctx.moveTo(col * this.tileSize, row * this.tileSize);
          this.ctx.lineTo(
            col * this.tileSize,
            row * this.tileSize + this.tileSize
          );
        } else {
          this.ctx.moveTo(
            col * this.tileSize + this.tileSize,
            row * this.tileSize
          );
          this.ctx.lineTo(
            col * this.tileSize + this.tileSize,
            row * this.tileSize + this.tileSize
          );
        }
      }
      this.ctx.moveTo(
        col * this.tileSize + this.tileSize / 2,
        row * this.tileSize
      );
      this.ctx.lineTo(
        col * this.tileSize + this.tileSize / 2,
        (row + 1) * this.tileSize
      );
    } else if ((!has1 && has3 && has4) || (has3 && has4 && !has6)) {
      // Horizontal line
      if (this.levelString[row][col] === "G") {
        if (row > numberOfRows / 2) {
          this.ctx.moveTo(col * this.tileSize, row * this.tileSize);
          this.ctx.lineTo(
            col * this.tileSize + this.tileSize,
            row * this.tileSize
          );
        } else {
          this.ctx.moveTo(
            col * this.tileSize,
            row * this.tileSize + this.tileSize
          );
          this.ctx.lineTo(
            col * this.tileSize + this.tileSize,
            row * this.tileSize + this.tileSize
          );
        }
      }
      this.ctx.moveTo(
        col * this.tileSize + this.tileSize,
        row * this.tileSize + this.tileSize / 2
      );
      this.ctx.lineTo(
        col * this.tileSize,
        row * this.tileSize + this.tileSize / 2
      );
    } else if (!has3 && !has5 && !has6) {
      this.ctx.arc(
        centerX + this.tileSize / 2,
        centerY - this.tileSize / 2,
        this.tileSize / 2,
        Math.PI,
        Math.PI / 2,
        true
      );
    } else if (!has4 && !has6 && !has7) {
      // Curve from top to left
      this.ctx.arc(
        centerX - this.tileSize / 2,
        centerY - this.tileSize / 2,
        this.tileSize / 2,
        Math.PI / 2,
        0,
        true
      );
    } else if (!has1 && !has2 && !has4) {
      // Curve from bottom to left
      this.ctx.arc(
        centerX - this.tileSize / 2,
        centerY + this.tileSize / 2,
        this.tileSize / 2,
        1.5 * Math.PI,
        0
      );
    } else if (!has0 && !has1 && !has3) {
      // Curve from bottom to right
      this.ctx.arc(
        centerX + this.tileSize / 2,
        centerY + this.tileSize / 2,
        this.tileSize / 2,
        Math.PI,
        1.5 * Math.PI
      );
    }
    this.ctx.stroke();
  }

  shouldDrawVerticalLine(col, row) {
    // Draw vertical line if there is no wall directly left or right
    return !this.isWallTile(col - 1, row) || !this.isWallTile(col + 1, row);
  }

  shouldDrawHorizontalLine(col, row) {
    // Draw horizontal line if there is no wall directly above or below
    return !this.isWallTile(col, row - 1) || !this.isWallTile(col, row + 1);
  }

  isSurroundedByWalls(col, row) {
    // Check if the current wall tile is surrounded by other wall tiles
    return (
      this.isWallTile(col - 1, row) &&
      this.isWallTile(col + 1, row) &&
      this.isWallTile(col, row - 1) &&
      this.isWallTile(col, row + 1)
    );
  }

  isWallTile(col, row) {
    // Check if the specified tile is a wall
    return (
      this.levelString[row] &&
      (this.levelString[row][col] === "W" ||
        this.levelString[row][col] === "G" ||
        this.levelString[row][col] === "D")
    );
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

  collectGhostSpawnPoints() {
    for (let row = 0; row < this.levelString.length; row++) {
      for (let col = 0; col < this.levelString[row].length; col++) {
        switch (this.levelString[row][col]) {
          case "I":
            this.inkySpawnPoints.push({
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
    return (
      this.levelString[row] &&
      (this.levelString[row][col] === "W" || this.levelString[row][col] === "G" || this.levelString[row][col] === "D")
    );
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

class Ghost {
  constructor(ctx, x, y, color, tileSize) {
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.color = color;
    this.tileSize = tileSize;
    this.direction = "left";
    this.speed = 2; // You can adjust this value as needed
  }

  draw() {
    console.log("GenGhostDraw");

    // Draw the body of the ghost
    this.ctx.fillStyle = this.color;
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.tileSize / 2, Math.PI, 0, false);
    this.ctx.moveTo(this.x - this.tileSize / 2, this.y);

    // Draw the bottom part of the ghost
    for (let i = 0; i < this.tileSize; i += this.tileSize / 5) {
      this.ctx.lineTo(
        this.x - this.tileSize / 2 + i,
        this.y + (this.tileSize / 4) * Math.sin(i)
      );
    }
    this.ctx.closePath();
    this.ctx.fill();

    // Draw the eyes
    this.ctx.fillStyle = "white";
    const eyeRadius = this.tileSize / 6;
    const leftEyeX = this.x - this.tileSize / 4;
    const rightEyeX = this.x + this.tileSize / 4;
    const eyeY = this.y - this.tileSize / 6;

    this.ctx.beginPath();
    this.ctx.arc(leftEyeX, eyeY, eyeRadius, 0, Math.PI * 2);
    this.ctx.arc(rightEyeX, eyeY, eyeRadius, 0, Math.PI * 2);
    this.ctx.fill();

    // Draw the pupils
    this.ctx.fillStyle = "blue";
    const pupilRadius = eyeRadius / 2;
    let pupilOffsetX = 0;
    let pupilOffsetY = 0;

    if (this.direction === "left") {
      pupilOffsetX = -pupilRadius;
    } else if (this.direction === "right") {
      pupilOffsetX = pupilRadius;
    } else if (this.direction === "up") {
      pupilOffsetY = -pupilRadius;
    } else if (this.direction === "down") {
      pupilOffsetY = pupilRadius;
    }

    this.ctx.beginPath();
    this.ctx.arc(
      leftEyeX + pupilOffsetX,
      eyeY + pupilOffsetY,
      pupilRadius,
      0,
      Math.PI * 2
    );
    this.ctx.arc(
      rightEyeX + pupilOffsetX,
      eyeY + pupilOffsetY,
      pupilRadius,
      0,
      Math.PI * 2
    );
    this.ctx.fill();
  }

  update() {
    // This method should be implemented by each subclass
    // For now, just move the ghost to the left
    this.x -= this.speed;
  }
}

class Inky extends Ghost {
  constructor(ctx, x, y, tileSize) {
    super(ctx, x, y, "cyan", tileSize);
  }

  update() {
    console.log("InkyDraw");
    this.draw();

    // Inky movement logic
  }
}

class Pinky extends Ghost {
  constructor(ctx, x, y, tileSize) {
    super(ctx, x, y, "pink", tileSize);
  }

  move() {
    // Pinky movement logic
  }
}

class Blinky extends Ghost {
  constructor(ctx, x, y, tileSize) {
    super(ctx, x, y, "red", tileSize);
  }

  move() {
    // Blinky movement logic
  }
}

class Clyde extends Ghost {
  constructor(ctx, x, y, tileSize) {
    super(ctx, x, y, "orange", tileSize);
  }

  move() {
    // Clyde movement logic
  }
}

const canvas = document.getElementById("pacmanCanvas");
const ctx = canvas.getContext("2d");
let pacMen = [];
let ghosts = [];
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
WWWWWW.WW-GGGDDGGG-WW.WWWWWW
WWWWWW.WW-G------G-WW.WWWWWW
T-----.---G-IBPK-G---.-----T
WWWWWW.WW-G------G-WW.WWWWWW
WWWWWW.WW-GGGGGGGG-WW.WWWWWW
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

const rows = levelString.split("\n");
const nonEmptyRows = rows.filter((row) => row.trim().length > 0);
const numberOfRows = nonEmptyRows.length - 1; // 0-based index for number of rows
const lengthOfEachRow = nonEmptyRows[0].length - 1; // 0-based index for length of each row

console.log("Number of Rows (0-based):", numberOfRows);
console.log("Length of Each Row (0-based):", lengthOfEachRow);

const level = new Level(ctx, levelString);

function addNewGhost(ghost) {
  const inkySpawnIndex = Math.floor(
    Math.random() * level.inkySpawnPoints.length
  );
  const inkySpawnPoint = level.inkySpawnPoints[inkySpawnIndex];
  console.log("To switch");
  switch (ghost) {
    case "i":
      console.log("in switch");

      const newInky = new Inky(ctx, inkySpawnPoint.x, inkySpawnPoint.y, 50);
      ghosts.push(newInky);
      console.log(inkySpawnPoint);
      console.log("Adding a new Inky");
  }
}

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
  for (let g of ghosts) {
    g.update();
  }
  requestAnimationFrame(gameLoop);
}

document.addEventListener("DOMContentLoaded", (event) => {
  document.getElementById("newPacman").addEventListener("click", addNewPacMan);
  gameLoop();
});

document.addEventListener("DOMContentLoaded", (event) => {
  document.getElementById("newInky").addEventListener("click", function () {
    addNewGhost("i");
  });
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

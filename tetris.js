const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scale = 20;
const rows = canvas.height / scale;
const cols = canvas.width / scale;
let lastTime = 0;


class Tetrimino {
  constructor(shape, color, game) {
    this.shapes = shape;
    this.color = color;
    this.position = { x: Math.floor(cols / 2) - 1, y: 0 };
    this.rotationIndex = 0;
    this.shape = this.shapes[this.rotationIndex];
    this.game = game;
  }

  draw() {
    this.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value) {
          ctx.fillStyle = this.color;
          ctx.fillRect(
            (this.position.x + x) * scale,
            (this.position.y + y) * scale,
            scale,
            scale
          );
          ctx.strokeStyle = "black";
          ctx.strokeRect(
            (this.position.x + x) * scale,
            (this.position.y + y) * scale,
            scale,
            scale
          );
        }
      });
    });
  }
  
  move(dirX, dirY) {
    this.position.x += dirX;
    this.position.y += dirY;
  }

  rotate() {
    this.rotationIndex = (this.rotationIndex + 1) % this.shapes.length;
    const newShape = this.shapes[this.rotationIndex];
    if (this.isValidMove(this.position, newShape)) {
      this.shape = newShape;
    } else {
      this.rotationIndex = (this.rotationIndex - 1 + this.shapes.length) % this.shapes.length;
    }
  }
  isValidMove(position, shape) {
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        // Check if the cell is filled
        if (shape[y][x]) {
          // Check if the move is within the game board horizontally
          if (position.x + x < 0 || position.x + x >= cols) {
            return false;
          }
          // Check if the move is within the game board vertically
          if (position.y + y < 0 || position.y + y >= rows) {
            return false;
          }
          // Check if the move collides with existing blocks on the board
          if (this.game.board[position.y + y][position.x + x]) {
            return false;
          }
        }
      }
    }
    return true;
  }

}

const shapes = [
  [
    [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    [
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0],
    ],
  ],
  [
    [
      [0, 0, 0, 0],
      [1, 1, 1, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 0],
    ],
    [
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [1, 1, 0, 0],
      [0, 0, 0, 0],
    ],
    [
      [1, 0, 0, 0],
      [1, 1, 1, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    [
      [0, 1, 1, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 0, 0],
    ],
  ],
  [
    [
      [0, 0, 0, 0],
      [0, 0, 1, 0],
      [1, 1, 1, 0],
      [0, 0, 0, 0],
    ],
    [
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 1, 0],
      [0, 0, 0, 0],
    ],
    [
      [0, 0, 0, 0],
      [1, 1, 1, 0],
      [1, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    [
      [1, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 0, 0],
    ],
  ],
  [
    [
      [0, 0, 0, 0],
      [0, 1, 1, 0],
      [0, 1, 1, 0],
      [0, 0, 0, 0],
    ],
  ],
  [
    [
      [0, 0, 0, 0],
      [0, 1, 1, 0],
      [1, 1, 0, 0],
      [0, 0, 0, 0],
    ],
    [
      [0, 1, 0, 0],
      [0, 1, 1, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 0],
    ],
  ],
  [
    [
      [0, 0, 0, 0],
      [1, 1, 1, 0],
      [0, 1, 0, 0],
      [0, 0, 0, 0],
    ],
    [
      [0, 1, 0, 0],
      [1, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 0, 0],
    ],
    [
      [0, 0, 0, 0],
      [0, 1, 0, 0],
      [1, 1, 1, 0],
      [0, 0, 0, 0],
    ],
    [
      [0, 1, 0, 0],
      [0, 1, 1, 0],
      [0, 1, 0, 0],
      [0, 0, 0, 0],
    ],
  ],
  [
    [
      [0, 0, 0, 0],
      [1, 1, 0, 0],
      [0, 1, 1, 0],
      [0, 0, 0, 0],
    ],
    [
      [0, 1, 0, 0],
      [1, 1, 0, 0],
      [1, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  ],
];

        
class Game {
  constructor() {
    this.board = this.createBoard();
    this.score = 0;
    this.level = 1;
    this.linesCleared = 0;
    this.dropCounter = 0;
    this.dropInterval = 1000;
    this.currentTetrimino = this.createRandomTetrimino();
    this.nextTetrimino = this.createRandomTetrimino();
  }

  createBoard() {
    return new Array(rows).fill(null).map(() => new Array(cols).fill(0));
  }

  createRandomTetrimino() {
    const shapeIndex = Math.floor(Math.random() * shapes.length);
    const color = `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 1)`;
    return new Tetrimino(shapes[shapeIndex], color, this); // Pass the Game instance to the Tetrimino
  }

  moveTetrimino(dirX, dirY) {
    const newPosition = { x: this.currentTetrimino.position.x + dirX, y: this.currentTetrimino.position.y + dirY };
    if (!this.isValidMove(newPosition, this.currentTetrimino.shape)) {
      if (dirY === 1) {
        this.handleTetriminoLanded();
      }
      return;
    }
    this.currentTetrimino.move(dirX, dirY);
  }

  gameOver() {
    this.board = this.createBoard();
    this.score = 0;
    this.level = 1;
    this.linesCleared = 0;
    this.dropCounter = 0;
    this.dropInterval = 1000;
    this.currentTetrimino = this.createRandomTetrimino();
    this.nextTetrimino = this.createRandomTetrimino();
  }

  handleTetriminoLanded() {
    this.mergeTetrimino();
    this.clearLines();
    this.currentTetrimino = this.nextTetrimino;
    this.nextTetrimino = this.createRandomTetrimino();
    this.currentTetrimino.position = { x: Math.floor(cols / 2) - 1, y: 0 };
  
    // Check for game over
    if (!this.isValidMove(this.currentTetrimino.position, this.currentTetrimino.shape)) {
      this.gameOver();
    }
  }

  rotateTetrimino() {
    this.currentTetrimino.rotate();
    if (!this.isValidMove(this.currentTetrimino.position, this.currentTetrimino.shape)) {
      this.currentTetrimino.rotate();
      this.currentTetrimino.rotate();
      this.currentTetrimino.rotate();
    }
  }

  isValidMove(position, shape) {
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        // Check if the cell is filled
        if (shape[y][x]) {
          // Check if the move is within the game board horizontally
          if (position.x + x < 0 || position.x + x >= cols) {
            return false;
          }
          // Check if the move is within the game board vertically
          if (position.y + y < 0 || position.y + y >= rows) {
            return false;
          }
          // Check if the move collides with existing blocks on the board
          if (this.board[position.y + y][position.x + x]) {
            return false;
          }
        }
      }
    }
    return true;
  }

  mergeTetrimino() {
    for (let y = 0; y < this.currentTetrimino.shape.length; y++) {
      for (let x = 0; x < this.currentTetrimino.shape[y].length; x++) {
        // Check if the cell is filled
        if (this.currentTetrimino.shape[y][x]) {
          // Merge the tetrimino with the game board
          this.board[this.currentTetrimino.position.y + y][this.currentTetrimino.position.x + x] = this.currentTetrimino.color;
        }
      }
    }
  }

  clearLines() {
    let linesCleared = 0;

    for (let y = 0; y < rows; y++) {
      const isLineFull = this.board[y].every(cell => cell !== 0);

      if (isLineFull) {
        linesCleared++;

        // Remove the full line
        this.board.splice(y, 1);

        // Add an empty line at the top
        this.board.unshift(new Array(cols).fill(0));
      }
    }

    if (linesCleared > 0) {
      this.score += this.calculateScore(linesCleared);
      this.linesCleared += linesCleared;
      this.level = Math.floor(this.linesCleared / 10) + 1;
      this.dropInterval = 1000 - (this.level - 1) * 100;
      this.drawScore();
    }
  }

  calculateScore(linesCleared) {
    const lineScores = {
      1: 40,
      2: 100,
      3: 300,
      4: 1200
    };

    return lineScores[linesCleared] * this.level;
  }

  update(deltaTime) {
    this.dropCounter += deltaTime;
    if (this.dropCounter > this.dropInterval) {
      this.moveTetrimino(0, 1);
      this.dropCounter = 0;
    }
  }

  drawScore() {
    const scoreElement = document.getElementById("score");
    const linesElement = document.getElementById("lines");

    if (scoreElement) {
      scoreElement.innerHTML = `Score: ${this.score}`;
    }

    if (linesElement) {
      linesElement.innerHTML = `Lines: ${this.linesCleared}`;
    }
  }

  drawLinesCleared() {
    const linesClearedElement = document.getElementById("linesCleared");
    linesClearedElement.textContent = `Lines Cleared: ${this.linesCleared}`;
  }

  draw() {
    // Clear the canvas
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  
    // Draw the game board
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        if (this.board[y][x]) {
          ctx.fillStyle = this.board[y][x];
          ctx.fillRect(x * scale, y * scale, scale, scale);
          ctx.strokeStyle = "black";
          ctx.strokeRect(x * scale, y * scale, scale, scale);
        }
      }
    }
  
    // Draw the current tetrimino
    this.currentTetrimino.draw();
    
    // Draw the score and lines cleared
    this.drawScore();
    // Draw the lines cleared
    this.drawLinesCleared();
  }

}

const game = new Game();

function update(deltaTime) {
  game.update(deltaTime);
}

function draw() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  game.draw();
}

function handleKeyPress(event) {
  const key = event.keyCode;

  switch (key) {
    case 37: // Left arrow
      game.moveTetrimino(-1, 0);
      break;
    case 39: // Right arrow
      game.moveTetrimino(1, 0);
      break;
    case 40: // Down arrow
      game.moveTetrimino(0, 1);
      break;
    case 38: // Up arrow
      game.rotateTetrimino();
      break;
  }
}

function gameLoop(currentTime) {
  // Calculate the time elapsed since the last frame
  const deltaTime = currentTime - lastTime;
  lastTime = currentTime;

  // Update the game state
  game.update(deltaTime);

  // Clear the canvas and draw the updated game state
  game.draw();

  // Request the next animation frame and call the gameLoop function
  requestAnimationFrame(gameLoop);
}

document.addEventListener("keydown", handleKeyPress);
requestAnimationFrame(gameLoop);

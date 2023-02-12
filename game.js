const modal = document.querySelector('.game-over');
const scoreField = document.querySelector('.score');
const board = document.querySelector('.board');

const grid = [[], [], [], [], []];
const ballSize = 50;
const cell = 50;
const gap = 20;
const colN = 5;
const rowN = 7;

let pointsLimit = 3;
let score = 0;

// set gamefield sizes;
board.style.height = `${rowN * cell + (rowN + 1) * gap}px`;
board.style.width = `${colN * cell + (colN + 1) * gap}px`;

const boardX = board.getBoundingClientRect().left;
const boardY = board.getBoundingClientRect().top;
const boardW = board.clientWidth;
const boardH = board.clientHeight;

function Ball() {
  // coordinates at board grid
  this.col = 0;
  this.row = 0;
  this.points = getRandomPoints(pointsLimit);
  this.html = createHtmlElement(this.points);

  // get absolute screen coordinates
  this.getX = function () {
    return this.html.getBoundingClientRect().left;
  };

  this.getY = function () {
    return this.html.getBoundingClientRect().top;
  };

  // get and set new points
  this.updatePoints = function (newPoints) {
    this.points = newPoints;
    this.html.innerText = newPoints;
  };

  // set position in the board grid
  this.setPos = function (col, row) {
    this.col = col;
    this.row = row;
    // set coordinates relative to the board
    let x = gap + col * cell + col * gap;
    let y = gap + (rowN - row - 1) * cell + (rowN - row - 1) * gap;
    this.setXY(x, y);
  };
  // set coordinates relative to the board
  this.setXY = function (x, y) {
    // анимация тут?
    this.html.style.left = `${x}px`;
    this.html.style.top = `${y}px`;
  };

  function createHtmlElement(points) {
    const ball = document.createElement('div');
    ball.innerText = points;
    ball.classList.add('ball');
    ball.style.width = `${ballSize}px`;
    ball.style.height = `${ballSize}px`;
    board.appendChild(ball);
    return ball;
  }

  function getRandomPoints(lim) {
    const points = [2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048];
    let randomNum = Math.trunc(Math.random() * lim);
    return points[randomNum];
  }
}

function Aim() {
  this.col = 0;
  this.row = 0;
  this.html = createHtmlElement();

  function createHtmlElement() {
    const aim = document.createElement('div');
    aim.classList.add('aim');
    aim.style.width = `${ballSize}px`;
    aim.style.height = `${ballSize}px`;
    board.appendChild(aim);
    return aim;
  }

  this.setPos = function (col, row) {
    this.html.style.left = `${gap + col * cell + col * gap}px`;
    this.html.style.top = `${
      gap + (rowN - row - 1) * cell + (rowN - row - 1) * gap
    }px`;
  };
}

function updateScore(score) {
  scoreField.innerText = `score:  ${score}`;
}

function addNewBalls() {
  for (let i = 0; i < colN; i++) {
    //liftBalls();
    const ball = new Ball();
    ball.setPos(i, 0);
    grid[i].unshift(ball);
    liftBalls();
  }
  console.log(grid);
}

function liftBalls() {
  for (let col = 0; col < grid.length; col++) {
    for (let row = 0; row < grid[col].length; row++) {
      grid[col][row].setPos(col, row);
    }
  }
}

updateScore(score);
addNewBalls();

function addAim(col, row) {
  const aim = document.createElement('div');
  aim.classList.add('aim');
  aim.style.width = `${ballSize}px`;
  aim.style.height = `${ballSize}px`;
  aim.style.left = `${gap + col * cell + col * gap}px`;
  aim.style.top = `${gap + (rowN - row - 1) * cell + (rowN - row - 1) * gap}px`;
  board.appendChild(aim);
}

function showAims(exept) {
  // for each column show possible aim for user
  for (let col = 0; col < grid.length; col++) {
    let row = grid[col].length;
    if (col != exept && row < rowN) {
      addAim(col, row);
    }
  }
}

function hideAims() {
  // remove all aims from the board
  const aims = document.querySelectorAll('.aim');
  aims.forEach(aim => aim.remove());
}

// Prevent browser default drag'n'drop behaviour
board.ondragstart = function () {
  return false;
};

board.onpointerdown = function (e) {
  // define cell under the pointer
  let { pointerX, pointerY, col, row } = defineCoordinates(e);
  console.log(col, row);

  // if top cell in column contain the ball then can move ball
  if (grid[col][row] && row === grid[col].length - 1) {
    let ball = grid[col][row];
    // check if pointer down exactly on the ball than grab the ball
    if (pointerX > ball.getX() && pointerY > ball.getY()) {
      grabBall(ball, pointerX, pointerY);

      //!!!!!
      showAims(col);
    }
  }
};

function grabBall(ball, pointerX, pointerY) {
  // define shift between pointer and ball coordinates
  let shiftX = ball.getX() - pointerX;
  let shiftY = ball.getY() - pointerY;
  console.log(ball);

  board.addEventListener('pointermove', moveBall);

  function moveBall(e) {
    let { pointerX, pointerY } = defineCoordinates(e);
    let posX = pointerX - boardX + shiftX;
    let posY = pointerY - boardY + shiftY;
    ball.setXY(posX, posY);
    checkBoundaries(ball);
  }

  function checkBoundaries(ball) {
    if (
      ball.getX() < boardX ||
      ball.getY() < boardY ||
      ball.getX() + ballSize > boardX + boardW ||
      ball.getY() + ballSize > boardY + boardH
    ) {
      // remove event handlers
      board.removeEventListener('pointermove', moveBall);
      board.onpointerup = null;
      // return to previous position
      ball.setPos(ball.col, ball.row);
    }
  }

  board.onpointerup = function (e) {
    board.removeEventListener('pointermove', moveBall);
    hideAims();
    // define cell under the pointer
    let { col, row } = defineCoordinates(e);

    // if gamer places selected ball in another column above last ball
    if (ball.col != col && row >= grid[col].length) {
      // delete ball from previous column
      grid[ball.col].pop(ball);
      // set new position of the ball
      ball.setPos(col, grid[col].length);
      // add to selected column
      grid[col].push(ball);
      // check match between 2 last balls in column after gamer turn
      // if no match than add new row and check for matching again
      if (!checkMatch(grid[col])) {
        if (!gameOver()) {
          setTimeout(() => {
            addNewBalls();
            grid.forEach(col => checkMatch(col));
          }, 300);
        }
      }
    } else {
      // return to previous position
      ball.setPos(ball.col, ball.row);
    }

    console.log(grid);
    this.onpointerup = null;
  };
}

function defineCoordinates(e) {
  let pointerX = e.clientX;
  let pointerY = e.clientY;
  let col = Math.trunc((pointerX - boardX) / (gap + cell));
  let row = Math.trunc(rowN - (pointerY - boardY) / (gap + cell));
  return { pointerX, pointerY, col, row };
}

function checkMatch(col) {
  // if column has more than 1 ball and last 2 balls have same points than match
  if (col.length > 1 && col.at(-1).points === col.at(-2).points) {
    // console.log('match!');
    let achievedPoints = col.at(-1).points * 2;
    score += achievedPoints;
    updateScore(score);

    // merge two balls
    col.at(-2).updatePoints(achievedPoints);
    col.pop().html.remove();

    // check match again
    checkMatch(col);
    return true;
  } else {
    return false;
  }
}

function gameOver() {
  if (grid.find(col => col.length === rowN)) {
    modal.classList.remove('hidden');
    return true;
  } else {
    return false;
  }
}

const animate = () => {
  // do animation

  // request new frame
  requestAnimationFrame(animate);
};

// start animation
requestAnimationFrame(animate);

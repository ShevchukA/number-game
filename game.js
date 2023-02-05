const balls = document.querySelectorAll(".ball");
const scoreField = document.querySelector(".score");
const board = document.querySelector(".board");

const grid = [[], [], [], [], []];
const ballSize = 50;
const cell = 50;
const gap = 20;

let pointsLimit = 3;

// set gamefield sizes;
board.style.height = 7 * cell + 8 * gap + "px";
board.style.width = 5 * cell + 6 * gap + "px";

const boardX = board.getBoundingClientRect().left;
const boardY = board.getBoundingClientRect().top;
const boardW = board.clientWidth;
const boardH = board.clientHeight;

function Ball() {
  //absolute screen coordinates
  this.x = 0;
  this.y = 0;
  this.col = 0;
  this.row = 0;

  this.points = getRundomPoints(pointsLimit);
  this.html = createHtmlElement(this.points);
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
    let y = gap + (6 - row) * cell + (6 - row) * gap;
    this.setXY(x, y);
  };
  // set coordinates relative to the board
  this.setXY = function (x, y) {
    this.html.style.left = x + "px";
    this.html.style.top = y + "px";
    //update absolute screen coordinates
    this.x = this.html.getBoundingClientRect().left;
    this.y = this.html.getBoundingClientRect().top;
    // console.log(this.x, this.y);
  };
  // TODO: replace with string templates
  function createHtmlElement(points) {
    const ball = document.createElement("div");
    ball.innerText = points;
    ball.classList.add("ball");
    ball.style.width = `${ballSize}px`;
    ball.style.height = `${ballSize}px`;
    return ball;
  }

  function getRundomPoints(lim) {
    const points = [2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048];
    let rundomNum = Math.trunc(Math.random() * lim);
    return points[rundomNum];
  }
}

function addNewBalls() {
  for (let i = 0; i < 5; i++) {
    const ball = new Ball();
    board.appendChild(ball.html);
    ball.setPos(i, 0);
    grid[i].unshift(ball);
  }
  console.log(grid);
}

addNewBalls();

board.onpointerdown = function (e) {
  /*
  определить клетку row и col, поделив координаты на gap+cell
  посмотреть в массив grid[row][col] на наличие шарика
  при отпускании мышки определить col, 
  затем определить номер row по длине массива
  задать свойства шарику row и col через метод setPos и вызвать пересчет setXY
  добавить шарик в массив
  */
  let pointerX = e.clientX;
  let pointerY = e.clientY;
  // define cell under the pointer
  let col = Math.trunc((pointerX - boardX) / (gap + cell));
  let row = Math.trunc(7 - (pointerY - boardY) / (gap + cell));
  console.log(col, row);

  // if last cell in column is not empty then can move ball
  if (grid[col][row] && row === grid[col].length - 1) {
    let ball = grid[col][row];
    // check if pointer down exactly on the ball than grab the ball
    if (pointerX > ball.x && pointerY > ball.y) {
      grabBall(ball, pointerX, pointerY);
    }
  }
};

function grabBall(ball, pointerX, pointerY) {
  // define shift between pointer and ball coordinates
  let shiftX = ball.x - pointerX;
  let shiftY = ball.y - pointerY;
  // console.log(shiftX, shiftY);
  console.log(ball);

  board.addEventListener("pointermove", moveBall);

  function moveBall(e) {
    let pointerX = e.clientX;
    let pointerY = e.clientY;
    let posX = pointerX - boardX + shiftX;
    let posY = pointerY - boardY + shiftY;
    ball.setXY(posX, posY);
  }

  board.onpointerup = function (e) {
    board.removeEventListener("pointermove", moveBall);
    let pointerX = e.clientX;
    let pointerY = e.clientY;
    // define cell under the pointer
    let col = Math.trunc((pointerX - boardX) / (gap + cell));
    let row = Math.trunc(7 - (pointerY - boardY) / (gap + cell));

    if (row >= grid[col].length) {
      // delete from current column
      grid[ball.col].pop(ball);
      // set new position of the ball
      ball.setPos(col, grid[col].length);
      // add to selected column
      grid[col].push(ball);
    } else {
      // return to previous position
      ball.setPos(ball.col, ball.row);
      // add to previous column
      grid[col].push(ball);
    }

    console.log(grid);
    this.onpointerup = null;
  };
}

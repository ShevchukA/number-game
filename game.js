const balls = document.querySelectorAll(".ball");
const scoreField = document.querySelector(".score");
const board = document.querySelector(".board");

const grid = [[], [], [], [], []];
const ballSize = 50;
const cell = 50;
const gap = 20;

let pointsLimit = 3;
let score = 0;
scoreField.innerText = `score: ${score}`;

// set gamefield sizes;
board.style.height = 7 * cell + 8 * gap + "px";
board.style.width = 5 * cell + 6 * gap + "px";

const boardX = board.getBoundingClientRect().left;
const boardY = board.getBoundingClientRect().top;
const boardW = board.clientWidth;
const boardH = board.clientHeight;

function Ball() {
  this.col = 0;
  this.row = 0;
  //absolute screen coordinates
  this.x = 0;
  this.y = 0;

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

  // TODO: deletHTML method
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
  // define cell under the pointer
  let pointerX = e.clientX;
  let pointerY = e.clientY;
  let col = Math.trunc((pointerX - boardX) / (gap + cell));
  let row = Math.trunc(7 - (pointerY - boardY) / (gap + cell));
  console.log(col, row);

  // if top cell in column contain the ball then can move ball
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
    // define cell under the pointer
    let pointerX = e.clientX;
    let pointerY = e.clientY;
    let col = Math.trunc((pointerX - boardX) / (gap + cell));
    let row = Math.trunc(7 - (pointerY - boardY) / (gap + cell));

    // TODO проверить что в тот же ряд опускается шарик
    if (row >= grid[col].length) {
      // delete ball from previous column
      grid[ball.col].pop(ball);
      // set new position of the ball
      ball.setPos(col, grid[col].length);
      // add to selected column
      grid[col].push(ball);
      // check match between last and privious ball in column
      checkMatch(grid[col]);
    } else {
      // return to previous position
      ball.setPos(ball.col, ball.row);
      // add to previous column
      //grid[col].push(ball);
    }

    console.log(grid);
    this.onpointerup = null;
  };
}

function checkMatch(col) {
  /*
  сравниваем последний и предыдущий шарик
  если очки равны, то складываем очки
  двигаем верхний шарик вниз
  меняем очки в предыдущем шарике
  удаляем верхний 
  */

  // console.log("1111", col.at(-2).points);
  // if column has more than 2 balls and last 2 balls have same points than mach
  if (col.length > 1 && col.at(-1).points === col.at(-2).points) {
    console.log("match!");
    let achievedPoints = col.at(-1).points * 2;
    console.log(achievedPoints);

    score += achievedPoints;
    scoreField.innerText = `score: ${score}`;
    col.at(-2).updatePoints(achievedPoints);

    col.pop().html.remove();
    checkMatch(col);
  }
}

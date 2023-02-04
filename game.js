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

  this.points = getRundomPoints(pointsLimit);
  this.html = createHtmlElement(this.points);
  // get and set new points
  this.updatePoints = function (newPoints) {
    this.points = newPoints;
    this.html.innerText = newPoints;
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
    ball.style.width = ballSize + "px";
    ball.style.height = ballSize + "px";
    return ball;
  }

  function getRundomPoints(lim) {
    const points = [2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048];
    let rundomNum = Math.trunc(Math.random() * lim);
    return points[rundomNum];
  }
}

function addNewBalls() {
  let posX = 0;
  let posY = boardH - ballSize - gap;
  for (let i = 0; i < 5; i++) {
    const ball = new Ball();
    board.appendChild(ball.html);
    posX = gap + i * gap + i * cell;
    ball.setXY(posX, posY);
    grid[i].unshift(ball);
    ball.html.addEventListener("pointerdown", (e) => {
      grabBall(ball, e);
    });
  }
  console.log(grid);
}

addNewBalls();

function grabBall(ball, e) {
  let shiftX = ball.x - e.clientX;
  let shiftY = ball.y - e.clientY;
  // console.log(shiftX, shiftY);

  board.addEventListener("pointermove", moveBall);

  function moveBall(e) {
    let mouseX = e.clientX;
    let mouseY = e.clientY;
    let posX = mouseX - boardX + shiftX;
    let posY = mouseY - boardY + shiftY;
    ball.setXY(posX, posY);
  }

  ball.html.addEventListener("pointerup", function () {
    board.removeEventListener("pointermove", moveBall);
    //this.removeEventListener('pointerup')
    this.onpointerup = null;
  });
}

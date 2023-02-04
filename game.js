const balls = document.querySelectorAll(".ball");
const grid = document.querySelector(".grid");
const scoreField = document.querySelector(".score");

const ballSize = 50;
const cell = 50;
const gap = 20;

// set gamefield sizes;
grid.style.height = 7 * cell + 8 * gap + "px";
grid.style.width = 5 * cell + 6 * gap + "px";

let gridX = grid.getBoundingClientRect().left;
let gridY = grid.getBoundingClientRect().top;
let gridW = grid.clientWidth;
let gridH = grid.clientHeight;

let pointsLimit = 3;

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
  // set coordinates relative to gamefield
  this.setXY = function (x, y) {
    this.html.style.left = x + "px";
    this.html.style.top = y + "px";
    //update absolute screen coordinates
    this.x = this.html.getBoundingClientRect().left;
    this.y = this.html.getBoundingClientRect().top;
    console.log(this.x, this.y);
  };

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
  let posY = gridH - ballSize - gap;
  for (let i = 0; i < 5; i++) {
    const ball = new Ball();
    grid.appendChild(ball.html);
    posX = gap + i * gap + i * cell;
    ball.setXY(posX, posY);
    ball.html.addEventListener("pointerdown", (e) => {
      grabBall(ball, e);
    });
  }
}

addNewBalls();

function grabBall(ball, e) {
  let shiftX = ball.x - e.clientX;
  let shiftY = ball.y - e.clientY;
  console.log(shiftX, shiftY);

  grid.addEventListener("pointermove", moveBall);

  function moveBall(e) {
    let mouseX = e.clientX;
    let mouseY = e.clientY;
    ball.setXY(mouseX - gridX + shiftX, mouseY - gridY + shiftY);
  }

  ball.html.addEventListener("pointerup", function () {
    grid.removeEventListener("pointermove", moveBall);
    //this.removeEventListener('pointerup')
    this.onpointerup = null;
  });

  /*
  shiftX = this.getBoundingClientRect().left + this.clientWidth / 2 - e.clientX;
  shiftY =
    this.getBoundingClientRect().bottom - this.clientHeight / 2 - e.clientY;
  console.log(shiftX, shiftY);

  grid.addEventListener("pointermove", moveBall);

  function moveBall(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;

    //console.log(this, mouseX, gridX, shiftX);
    balls[0].style.left = `${mouseX - gridX + shiftX}px`;
    balls[0].style.bottom = `${gridY - mouseY - shiftY}px`;
    balls[0].style.zIndex = "1";
    */
}

/*

let shiftX = 0;
let shiftY = 0;
let mouseX = 0;
let mouseY = 0;

/*
// ?????????????
balls[0].ondragstart = function () {
  return false;
};

// balls[0].onpointerdown = function(){}
balls[0].addEventListener("pointerdown", function (e) {
  shiftX = this.getBoundingClientRect().left + this.clientWidth / 2 - e.clientX;
  shiftY =
    this.getBoundingClientRect().bottom - this.clientHeight / 2 - e.clientY;
  console.log(shiftX, shiftY);

  grid.addEventListener("pointermove", moveBall);

  function moveBall(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;

    //console.log(this, mouseX, gridX, shiftX);
    balls[0].style.left = `${mouseX - gridX + shiftX}px`;
    balls[0].style.bottom = `${gridY - mouseY - shiftY}px`;
    balls[0].style.zIndex = "1";
  }

  balls[0].addEventListener("pointerup", function () {
    grid.removeEventListener("pointermove", moveBall);
    balls[0].style.zIndex = "0";
    // какой эквивалетн в случае eventListener?
    balls[0].onpointerup = null;
  });
});


*/
